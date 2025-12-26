import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { activityFormSchema } from "@/lib/activity-validations";
import { activityTypeLabels } from "@/lib/activity-types";
import { Resend } from "resend";
import { ZodError } from "zod";

// Only create Resend client if API key is configured
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Geocode address using OpenStreetMap Nominatim
async function geocodeAddress(
  address: string,
  city: string
): Promise<{ lat: number; lng: number } | null> {
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

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
    const validatedData = activityFormSchema.parse(body);

    // Check for duplicate submissions (same title, date, and location)
    const { data: existingActivities } = await supabaseAdmin
      .from("activities")
      .select("id, status")
      .eq("title", validatedData.title)
      .eq("event_date", validatedData.event_date)
      .eq("address", validatedData.address)
      .limit(1);

    if (existingActivities && existingActivities.length > 0) {
      const existing = existingActivities[0];
      if (existing.status === "approved") {
        return NextResponse.json(
          {
            success: false,
            message: "Deze activiteit bestaat al en is goedgekeurd.",
          },
          { status: 400 }
        );
      } else if (existing.status === "pending") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Deze activiteit is al ingediend en wacht op goedkeuring.",
          },
          { status: 400 }
        );
      }
    }

    // Geocode the address
    const coordinates = await geocodeAddress(
      validatedData.address,
      validatedData.city
    );

    // Insert into Supabase
    const { data: activity, error: dbError } = await supabaseAdmin
      .from("activities")
      .insert({
        title: validatedData.title,
        description: validatedData.description || null,
        activity_type: validatedData.activity_type,
        location_name: validatedData.location_name,
        address: validatedData.address,
        city: validatedData.city,
        postal_code: validatedData.postal_code || null,
        latitude: coordinates?.lat || null,
        longitude: coordinates?.lng || null,
        event_date: validatedData.event_date,
        start_time: validatedData.start_time || null,
        end_time: validatedData.end_time || null,
        is_recurring: validatedData.is_recurring,
        recurrence_pattern: validatedData.recurrence_pattern || null,
        recurrence_end_date: validatedData.recurrence_end_date || null,
        capacity: validatedData.capacity || null,
        is_free: validatedData.is_free,
        price: validatedData.price || null,
        for_men: validatedData.for_men,
        for_women: validatedData.for_women,
        for_families: validatedData.for_families,
        for_youth: validatedData.for_youth,
        organizer_name: validatedData.organizer_name,
        organizer_email: validatedData.organizer_email,
        organizer_phone: validatedData.organizer_phone || null,
        registration_url: validatedData.registration_url || null,
        website_url: validatedData.website_url || null,
        facebook_url: validatedData.facebook_url || null,
        instagram_url: validatedData.instagram_url || null,
        cover_image_url: validatedData.cover_image_url || null,
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

    const baseUrl =
      request.headers.get("origin") || "https://www.ramadanlights.be";
    const approveUrl = `${baseUrl}/api/activities/approve?token=${activity.approval_token}&action=approve`;
    const rejectUrl = `${baseUrl}/api/activities/approve?token=${activity.approval_token}&action=reject`;

    // Send approval email to admin (only if Resend is configured)
    if (resend) {
      try {
        await resend.emails.send({
          from: "Ramadan Lights Gent <noreply@ramadanlights.be>",
          to: "vzwvgm@gmail.com",
          subject: `Nieuwe Activiteit: ${validatedData.title}`,
          html: `
            <h2>Nieuwe Activiteit Inzending</h2>
            <p>Er is een nieuwe activiteit ingediend die goedkeuring vereist.</p>

            <h3>Gegevens:</h3>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Titel:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.title}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Type:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${activityTypeLabels[validatedData.activity_type]}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Datum:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formatDate(validatedData.event_date)}</td></tr>
              ${validatedData.start_time ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tijd:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.start_time}${validatedData.end_time ? ` - ${validatedData.end_time}` : ""}</td></tr>` : ""}
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Locatie:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.location_name}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Adres:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.address}, ${validatedData.city}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Gratis:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.is_free ? "Ja" : "Nee"}</td></tr>
              ${validatedData.price ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Prijs:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.price}</td></tr>` : ""}
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Organisator:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.organizer_name}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.organizer_email}</td></tr>
              ${validatedData.organizer_phone ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefoon:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.organizer_phone}</td></tr>` : ""}
              ${validatedData.description ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Beschrijving:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.description}</td></tr>` : ""}
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Doelgroep:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${[validatedData.for_men ? "Mannen" : "", validatedData.for_women ? "Vrouwen" : "", validatedData.for_families ? "Gezinnen" : "", validatedData.for_youth ? "Jeugd" : ""].filter(Boolean).join(", ")}</td></tr>
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
          to: validatedData.organizer_email,
          subject: "Activiteit Inzending Ontvangen - Ramadan Lights Gent",
          html: `
            <h2>Bedankt voor uw inzending!</h2>
            <p>Beste ${validatedData.organizer_name},</p>
            <p>We hebben uw activiteit <strong>${validatedData.title}</strong> ontvangen.</p>
            <p>Uw inzending wordt zo snel mogelijk beoordeeld. Na goedkeuring verschijnt uw activiteit op de "Wat te doen" pagina van Ramadan Lights Gent.</p>

            <h3>Ingezonden gegevens:</h3>
            <ul>
              <li><strong>Type:</strong> ${activityTypeLabels[validatedData.activity_type]}</li>
              <li><strong>Datum:</strong> ${formatDate(validatedData.event_date)}</li>
              <li><strong>Locatie:</strong> ${validatedData.location_name}, ${validatedData.address}</li>
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
      message: "Uw activiteit is succesvol ingediend",
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
