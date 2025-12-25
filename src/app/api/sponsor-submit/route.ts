import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sponsorFormSchema } from "@/lib/validations";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "vzwvgm@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = sponsorFormSchema.parse(body);

    console.log("New sponsor submission:", {
      ...validatedData,
      submittedAt: new Date().toISOString(),
    });

    // Send email to admin
    const { error: adminEmailError } = await resend.emails.send({
      from: "Ramadan Lights <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: `Nieuwe sponsoraanvraag: ${validatedData.companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">Nieuwe Sponsoraanvraag</h1>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Bedrijf:</strong> ${validatedData.companyName}</p>
            <p><strong>BTW-nummer:</strong> ${validatedData.vatNumber}</p>
            <p><strong>Contactpersoon:</strong> ${validatedData.contactPerson}</p>
            <p><strong>Email:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
            <p><strong>Telefoon:</strong> ${validatedData.phone || "Niet opgegeven"}</p>
            <p><strong>Bericht:</strong> ${validatedData.message || "Geen bericht"}</p>
          </div>
          <p style="color: #718096; font-size: 12px;">
            Verzonden op: ${new Date().toLocaleString("nl-BE", { timeZone: "Europe/Brussels" })}
          </p>
        </div>
      `,
    });

    if (adminEmailError) {
      console.error("Failed to send admin email:", adminEmailError);
      throw new Error("Failed to send admin notification email");
    }

    // Send confirmation email to sponsor
    const { error: confirmationEmailError } = await resend.emails.send({
      from: "Ramadan Lights <onboarding@resend.dev>",
      to: validatedData.email,
      subject: "Bevestiging sponsoraanvraag - Ramadan Lights Gent",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a365d;">Bedankt voor uw sponsoraanvraag!</h1>
          <p>Beste ${validatedData.contactPerson},</p>
          <p>Wij hebben uw sponsoraanvraag voor <strong>${validatedData.companyName}</strong> goed ontvangen.</p>
          <p>Ons team zal zo snel mogelijk contact met u opnemen om de details en mogelijkheden te bespreken.</p>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Uw gegevens:</h3>
            <p><strong>Bedrijf:</strong> ${validatedData.companyName}</p>
            <p><strong>BTW-nummer:</strong> ${validatedData.vatNumber}</p>
            <p><strong>Contactpersoon:</strong> ${validatedData.contactPerson}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            ${validatedData.phone ? `<p><strong>Telefoon:</strong> ${validatedData.phone}</p>` : ""}
          </div>
          <p>Met vriendelijke groeten,<br><strong>Het Ramadan Lights Team</strong></p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #718096; font-size: 12px;">
            Dit is een automatisch gegenereerde e-mail. Heeft u vragen? Neem contact op via ${ADMIN_EMAIL}
          </p>
        </div>
      `,
    });

    if (confirmationEmailError) {
      console.error("Failed to send confirmation email:", confirmationEmailError);
      // Don't throw here - admin already received the notification
    }

    return NextResponse.json(
      {
        success: true,
        message: "Sponsoraanvraag succesvol ontvangen",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing sponsor submission:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validatiefout",
          errors: error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Er is een fout opgetreden bij het verwerken van uw aanvraag",
      },
      { status: 500 }
    );
  }
}
