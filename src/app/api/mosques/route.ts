import { NextResponse } from "next/server";
import { mosques, getFullAddress, type Mosque } from "@/lib/mosques-data";

// Cache for geocoded coordinates
const coordinatesCache: Record<string, { lat: number; lng: number }> = {};

// Pre-computed coordinates for mosques (to avoid rate limiting from Nominatim)
const precomputedCoordinates: Record<string, { lat: number; lng: number }> = {
  "1": { lat: 51.0544, lng: 3.7356 }, // Koopvaardijlaan 44
  "2": { lat: 51.0372, lng: 3.7089 }, // Elyzeese Velden 35
  "3": { lat: 51.0583, lng: 3.7267 }, // Victor Frisstraat 27-29
  "4": { lat: 51.0486, lng: 3.7297 }, // Warandestraat 39
  "5": { lat: 51.0561, lng: 3.7458 }, // Kazemattenstraat 80
  "6": { lat: 51.0436, lng: 3.7178 }, // Kwakkelstraat 41
  "7": { lat: 51.0628, lng: 3.7089 }, // Fr. Ferrerlaan 214A
  "8": { lat: 51.0508, lng: 3.7125 }, // Beukelaarsstraat 23-25
  "9": { lat: 51.0433, lng: 3.7064 }, // R. Novarumplein 1A
  "10": { lat: 51.0614, lng: 3.7403 }, // Langestraat 204
  "11": { lat: 51.0461, lng: 3.7206 }, // Kerkstraat 188
  "12": { lat: 51.0650, lng: 3.7289 }, // Doornzelestraat 5-7
  "13": { lat: 51.0578, lng: 3.7483 }, // Loodsenstraat 56
  "14": { lat: 51.0553, lng: 3.7472 }, // Kapiteinstraat 42
  "15": { lat: 51.0711, lng: 3.7517 }, // Antwerpsesteenweg 24
  "16": { lat: 51.0633, lng: 3.7333 }, // Voormuide 71
  "17": { lat: 51.0489, lng: 3.7375 }, // Rietstraat 35
  "18": { lat: 51.0572, lng: 3.7394 }, // Phoenixstraat 49
  "19": { lat: 51.0539, lng: 3.7594 }, // Dendermondsesteenweg 283
  "20": { lat: 51.0556, lng: 3.7756 }, // Dendermondsesteenweg 417
  "21": { lat: 51.0367, lng: 3.7106 }, // Frans van Ryhovelaan 317
};

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (coordinatesCache[address]) {
    return coordinatesCache[address];
  }

  try {
    const query = encodeURIComponent(`${address}, Belgium`);
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
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
      coordinatesCache[address] = coords;
      return coords;
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function GET() {
  try {
    // Use precomputed coordinates to avoid rate limiting
    const mosquesWithCoords = mosques.map((mosque) => {
      const coords = precomputedCoordinates[mosque.id];
      return {
        ...mosque,
        fullAddress: getFullAddress(mosque),
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: mosquesWithCoords,
    });
  } catch (error) {
    console.error("Mosques API error:", error);
    return NextResponse.json(
      { success: false, message: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
