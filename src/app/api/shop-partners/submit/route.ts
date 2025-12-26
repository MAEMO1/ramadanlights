import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { shopPartnerFormSchema } from "@/lib/shop-partner-validations";
import { shopCategoryLabels } from "@/lib/shop-partner-types";
import { Resend } from "resend";
import { ZodError } from "zod";

// Only create Resend client if API key is configured
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Generate a URL-friendly slug from the name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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
    const validatedData = shopPartnerFormSchema.parse(body);

    // Check for duplicate submissions (same name and address)
    const { data: existingPartners } = await supabaseAdmin
      .from("shop_partners")
      .select("id, status")
      .eq("name", validatedData.name)
      .eq("address", validatedData.address)
      .limit(1);

    if (existingPartners && existingPartners.length > 0) {
      const existing = existingPartners[0];
      if (existing.status === "approved") {
        return NextResponse.json(
          {
            success: false,
            message: "Deze winkel bestaat al en is goedgekeurd.",
          },
          { status: 400 }
        );
      } else if (existing.status === "pending") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Deze winkel is al ingediend en wacht op goedkeuring.",
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

    // Generate slug
    const slug = generateSlug(validatedData.name);

    // Insert into Supabase
    const { data: shopPartner, error: dbError } = await supabaseAdmin
      .from("shop_partners")
      .insert({
        name: validatedData.name,
        slug: slug,
        description: validatedData.description || null,
        address: validatedData.address,
        city: validatedData.city,
        postal_code: validatedData.postal_code || null,
        latitude: coordinates?.lat || null,
        longitude: coordinates?.lng || null,
        category: validatedData.category,
        partner_tier: "free", // Default to free, can be upgraded later
        ramadan_special: validatedData.ramadan_special || null,
        ramadan_special_discount: validatedData.ramadan_special_discount || null,
        contact_name: validatedData.contact_name,
        contact_email: validatedData.contact_email,
        contact_phone: validatedData.contact_phone || null,
        website_url: validatedData.website_url || null,
        facebook_url: validatedData.facebook_url || null,
        instagram_url: validatedData.instagram_url || null,
        logo_url: validatedData.logo_url || null,
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
    const approveUrl = `${baseUrl}/api/shop-partners/approve?token=${shopPartner.approval_token}&action=approve`;
    const rejectUrl = `${baseUrl}/api/shop-partners/approve?token=${shopPartner.approval_token}&action=reject`;

    // Send approval email to admin (only if Resend is configured)
    if (resend) {
      try {
        await resend.emails.send({
          from: "Ramadan Lights Gent <noreply@ramadanlights.be>",
          to: "vzwvgm@gmail.com",
          subject: `Nieuwe Shop Partner Aanvraag: ${validatedData.name}`,
          html: `
            <h2>Nieuwe Shop Partner Aanvraag</h2>
            <p>Er is een nieuwe shop partner aanvraag ontvangen die goedkeuring vereist.</p>

            <h3>Gegevens:</h3>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Naam:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.name}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Categorie:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${shopCategoryLabels[validatedData.category]}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Adres:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.address}, ${validatedData.city}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Contactpersoon:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.contact_name}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.contact_email}</td></tr>
              ${validatedData.contact_phone ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefoon:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.contact_phone}</td></tr>` : ""}
              ${validatedData.description ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Beschrijving:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.description}</td></tr>` : ""}
              ${validatedData.ramadan_special ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Ramadan Actie:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.ramadan_special}</td></tr>` : ""}
              ${validatedData.ramadan_special_discount ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Korting:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.ramadan_special_discount}</td></tr>` : ""}
              ${validatedData.website_url ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Website:</strong></td><td style="padding: 8px; border: 1px solid #ddd;"><a href="${validatedData.website_url}">${validatedData.website_url}</a></td></tr>` : ""}
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
          subject: "Shop Partner Aanvraag Ontvangen - Ramadan Lights Gent",
          html: `
            <h2>Bedankt voor uw aanvraag!</h2>
            <p>Beste ${validatedData.contact_name},</p>
            <p>We hebben uw aanvraag voor <strong>${validatedData.name}</strong> ontvangen.</p>
            <p>Uw aanvraag wordt zo snel mogelijk beoordeeld. Na goedkeuring verschijnt uw winkel op de shop gids van Ramadan Lights Gent.</p>

            <h3>Ingezonden gegevens:</h3>
            <ul>
              <li><strong>Categorie:</strong> ${shopCategoryLabels[validatedData.category]}</li>
              <li><strong>Adres:</strong> ${validatedData.address}, ${validatedData.city}</li>
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
      message: "Uw aanvraag is succesvol ontvangen",
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
