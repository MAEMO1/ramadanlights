import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { iftarFormSchema } from "@/lib/iftar-validations";
import { Resend } from "resend";
import { ZodError } from "zod";

// Only create Resend client if API key is configured
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Format frequency for display
function formatFrequency(frequency: string, daysOfWeek: string[]): string {
  const dayLabels: Record<string, string> = {
    monday: "Maandag",
    tuesday: "Dinsdag",
    wednesday: "Woensdag",
    thursday: "Donderdag",
    friday: "Vrijdag",
    saturday: "Zaterdag",
    sunday: "Zondag",
  };

  switch (frequency) {
    case "daily":
      return "Dagelijks";
    case "weekly":
    case "specific_days":
      const days = daysOfWeek.map((d) => dayLabels[d] || d).join(", ");
      return frequency === "weekly" ? `Wekelijks (${days})` : `Specifieke dagen: ${days}`;
    case "one_time":
      return "Eenmalig";
    default:
      return frequency;
  }
}

// Geocode address using OpenStreetMap Nominatim
async function geocodeAddress(address: string, city: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(`${address}, ${city}, Belgium`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "RamadanLightsGent/1.0",
        },
      }
    );

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: "Database is niet geconfigureerd" },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Validate form data
    const validatedData = iftarFormSchema.parse(body);

    // Check for duplicate submissions (same mosque_name and address)
    const { data: existingIftars } = await supabaseAdmin
      .from("iftar_events")
      .select("id, status")
      .eq("mosque_name", validatedData.mosque_name)
      .eq("address", validatedData.address)
      .limit(1);

    if (existingIftars && existingIftars.length > 0) {
      const existing = existingIftars[0];
      if (existing.status === "approved") {
        return NextResponse.json(
          { success: false, message: "Deze iftar locatie bestaat al en is goedgekeurd." },
          { status: 400 }
        );
      } else if (existing.status === "pending") {
        return NextResponse.json(
          { success: false, message: "Deze iftar locatie is al ingediend en wacht op goedkeuring." },
          { status: 400 }
        );
      }
    }

    // Geocode the address
    const coordinates = await geocodeAddress(validatedData.address, validatedData.city);

    // Insert into Supabase
    const { data: iftarEvent, error: dbError } = await supabaseAdmin
      .from("iftar_events")
      .insert({
        mosque_name: validatedData.mosque_name,
        address: validatedData.address,
        city: validatedData.city,
        iftar_time: validatedData.iftar_time || null,
        contact_name: validatedData.contact_name,
        contact_email: validatedData.contact_email,
        contact_phone: validatedData.contact_phone || null,
        latitude: coordinates?.lat || null,
        longitude: coordinates?.lng || null,
        capacity: validatedData.capacity || null,
        is_free: validatedData.is_free,
        price_info: validatedData.price_info || null,
        description: validatedData.description || null,
        for_men: validatedData.for_men,
        for_women: validatedData.for_women,
        for_families: validatedData.for_families,
        frequency: validatedData.frequency,
        days_of_week: validatedData.days_of_week,
        start_date: validatedData.start_date || null,
        end_date: validatedData.end_date || null,
        registration_url: validatedData.registration_url || null,
        website_url: validatedData.website_url || null,
        facebook_url: validatedData.facebook_url || null,
        instagram_url: validatedData.instagram_url || null,
        status: "pending",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { success: false, message: "Er is een fout opgetreden bij het opslaan" },
        { status: 500 }
      );
    }

    const baseUrl = request.headers.get("origin") || "https://www.ramadanlights.be";
    const approveUrl = `${baseUrl}/api/iftar/approve?token=${iftarEvent.approval_token}&action=approve`;
    const rejectUrl = `${baseUrl}/api/iftar/approve?token=${iftarEvent.approval_token}&action=reject`;

    // Send approval email to admin (only if Resend is configured)
    if (resend) {
      try {
        await resend.emails.send({
          from: "Ramadan Lights Gent <noreply@ramadanlights.be>",
          to: "vzwvgm@gmail.com",
        subject: `Nieuwe Iftar Inzending: ${validatedData.mosque_name}`,
        html: `
          <h2>Nieuwe Iftar Inzending</h2>
          <p>Er is een nieuwe iftar inzending ontvangen die goedkeuring vereist.</p>

          <h3>Gegevens:</h3>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Moskee/Organisatie:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.mosque_name}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Adres:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.address}, ${validatedData.city}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Iftar tijd:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.iftar_time}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Frequentie:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formatFrequency(validatedData.frequency, validatedData.days_of_week)}</td></tr>
            ${validatedData.start_date ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Startdatum:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.start_date}</td></tr>` : ""}
            ${validatedData.end_date ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Einddatum:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.end_date}</td></tr>` : ""}
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Contactpersoon:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.contact_name}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.contact_email}</td></tr>
            ${validatedData.contact_phone ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefoon:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.contact_phone}</td></tr>` : ""}
            ${validatedData.capacity ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Capaciteit:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.capacity} personen</td></tr>` : ""}
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Gratis:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.is_free ? "Ja" : "Nee"}</td></tr>
            ${validatedData.price_info ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Prijsinfo:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.price_info}</td></tr>` : ""}
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Toegankelijkheid:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${[validatedData.for_men ? "Mannen" : "", validatedData.for_women ? "Vrouwen" : "", validatedData.for_families ? "Gezinnen" : ""].filter(Boolean).join(", ")}</td></tr>
            ${validatedData.description ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Beschrijving:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.description}</td></tr>` : ""}
            ${validatedData.registration_url ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Inschrijvingslink:</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${validatedData.registration_url}">${validatedData.registration_url}</a></td></tr>` : ""}
            ${validatedData.website_url ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Website:</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${validatedData.website_url}">${validatedData.website_url}</a></td></tr>` : ""}
            ${validatedData.facebook_url ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Facebook:</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${validatedData.facebook_url}">${validatedData.facebook_url}</a></td></tr>` : ""}
            ${validatedData.instagram_url ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Instagram:</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${validatedData.instagram_url}">${validatedData.instagram_url}</a></td></tr>` : ""}
          </table>

          <div style="margin-top: 30px;">
            <a href="${approveUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; margin-right: 10px;">Goedkeuren</a>
            <a href="${rejectUrl}" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 8px;">Afkeuren</a>
          </div>
        `,
      });
      } catch (emailError) {
        console.error("Email error (admin):", emailError);
        // Continue even if email fails
      }

      // Send confirmation email to submitter
      try {
        await resend.emails.send({
        from: "Ramadan Lights Gent <noreply@ramadanlights.be>",
        to: validatedData.contact_email,
        subject: "Iftar Inzending Ontvangen - Ramadan Lights Gent",
        html: `
          <h2>Bedankt voor uw inzending!</h2>
          <p>Beste ${validatedData.contact_name},</p>
          <p>We hebben uw iftar inzending voor <strong>${validatedData.mosque_name}</strong> ontvangen.</p>
          <p>Uw inzending wordt zo snel mogelijk beoordeeld. Na goedkeuring verschijnt uw iftar op de Iftarkaart van Ramadan Lights Gent.</p>

          <h3>Ingezonden gegevens:</h3>
          <ul>
            <li><strong>Adres:</strong> ${validatedData.address}, ${validatedData.city}</li>
            <li><strong>Iftar tijd:</strong> ${validatedData.iftar_time}</li>
          </ul>

          <p>Met vriendelijke groet,<br>Ramadan Lights Gent</p>
        `,
      });
      } catch (emailError) {
        console.error("Email error (submitter):", emailError);
        // Continue even if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Uw iftar inzending is succesvol ontvangen",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validatiefout",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Submit error:", error);
    return NextResponse.json(
      { success: false, message: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
