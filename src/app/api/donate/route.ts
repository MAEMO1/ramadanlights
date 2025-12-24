import { NextRequest, NextResponse } from "next/server";
import { createMollieClient } from "@mollie/api-client";

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) {
      console.error("MOLLIE_API_KEY is not configured");
      return NextResponse.json(
        { success: false, message: "Betalingssysteem is niet geconfigureerd" },
        { status: 500 }
      );
    }

    // Create Mollie client inside the handler
    const mollieClient = createMollieClient({ apiKey });

    const { amount, name, email } = await request.json();

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1) {
      return NextResponse.json(
        { success: false, message: "Ongeldig bedrag (minimum €1)" },
        { status: 400 }
      );
    }

    // Get the base URL for redirects
    const baseUrl = request.headers.get("origin") || "https://www.ramadanlights.be";

    // Create Mollie payment
    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: numAmount.toFixed(2),
      },
      description: `Donatie Ramadan Lights Gent${name ? ` - ${name}` : ""}`,
      redirectUrl: `${baseUrl}/bedankt-donatie`,
      metadata: {
        name: name || "Anoniem",
        email: email || "",
        type: "donation",
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: payment.getCheckoutUrl(),
    });
  } catch (error) {
    console.error("Mollie payment error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        success: false,
        message: "Er is een fout opgetreden bij het aanmaken van de betaling",
      },
      { status: 500 }
    );
  }
}
