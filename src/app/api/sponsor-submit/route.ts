import { NextRequest, NextResponse } from "next/server";
import { sponsorFormSchema, packageInfo } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = sponsorFormSchema.parse(body);

    // Get package details
    const selectedPackage = packageInfo[validatedData.package];

    // Here you would typically:
    // 1. Send email to admin using Resend/SendGrid
    // 2. Send confirmation email to sponsor
    // 3. Optionally store in database

    // For now, we'll log the submission
    console.log("New sponsor submission:", {
      ...validatedData,
      packageDetails: selectedPackage,
      submittedAt: new Date().toISOString(),
    });

    // TODO: Implement email sending with Resend
    // Example with Resend:
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Email to admin (vzwvgm@gmail.com)
    await resend.emails.send({
      from: 'Ramadan Lights <noreply@ramadanlichtengent.be>',
      to: 'vzwvgm@gmail.com',
      subject: `Nieuwe sponsoraanvraag: ${validatedData.companyName}`,
      html: `
        <h1>Nieuwe Sponsoraanvraag</h1>
        <p><strong>Bedrijf:</strong> ${validatedData.companyName}</p>
        <p><strong>BTW-nummer:</strong> ${validatedData.vatNumber}</p>
        <p><strong>Contactpersoon:</strong> ${validatedData.contactPerson}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Telefoon:</strong> ${validatedData.phone || 'Niet opgegeven'}</p>
        <p><strong>Pakket:</strong> ${selectedPackage.name} (${selectedPackage.price})</p>
        <p><strong>Bericht:</strong> ${validatedData.message || 'Geen bericht'}</p>
      `,
    });

    // Confirmation email to sponsor
    await resend.emails.send({
      from: 'Ramadan Lights <noreply@ramadanlichtengent.be>',
      to: validatedData.email,
      subject: 'Bevestiging sponsoraanvraag - Ramadan Lights Gent',
      html: `
        <h1>Bedankt voor uw sponsoraanvraag!</h1>
        <p>Beste ${validatedData.contactPerson},</p>
        <p>Wij hebben uw aanvraag voor het ${selectedPackage.name} pakket (${selectedPackage.price}) ontvangen.</p>
        <h2>Betaalinstructies</h2>
        <p>Gelieve het bedrag over te schrijven naar:</p>
        <ul>
          <li><strong>IBAN:</strong> BE93 0018 0728 1667</li>
          <li><strong>Begunstigde:</strong> VGM vzw</li>
          <li><strong>Mededeling:</strong> Sponsoring Ramadan Lights + ${validatedData.companyName}</li>
        </ul>
        <p>U ontvangt een bevestiging zodra uw betaling is ontvangen.</p>
        <p>Met vriendelijke groeten,<br>Het Ramadan Lights Team</p>
      `,
    });
    */

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
