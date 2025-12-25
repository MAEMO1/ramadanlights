import { NextResponse } from "next/server";
import { mosques, getFullAddress, type Mosque } from "@/lib/mosques-data";

// Cache for geocoded coordinates
const coordinatesCache: Record<string, { lat: number; lng: number }> = {};

// Pre-computed coordinates for mosques (to avoid rate limiting from Nominatim)
// Sorted alphabetically by mosque name
const precomputedCoordinates: Record<string, { lat: number; lng: number }> = {
  "1": { lat: 51.0556, lng: 3.7756 }, // Afghan Attaqwa Moskee - Dendermondsesteenweg 417
  "2": { lat: 51.0372, lng: 3.7089 }, // Al Markaz at Tarbawi - Elyzeese Velden 35
  "3": { lat: 51.0578, lng: 3.7483 }, // Dzamet Ensarija - Loodsenstraat 56
  "4": { lat: 51.0572, lng: 3.7394 }, // El-Albani Moskee - Phoenixstraat 49
  "5": { lat: 51.0561, lng: 3.7458 }, // Eyup Sultan Camii - Kazemattenstraat 80
  "6": { lat: 51.0436, lng: 3.7178 }, // Groene Moskee Fatih - Kwakkelstraat 41
  "7": { lat: 51.0544, lng: 3.7356 }, // IH-VAK Moskee - Koopvaardijlaan 44
  "8": { lat: 51.0539, lng: 3.7594 }, // Ilmihal Dernegi - Dendermondsesteenweg 283
  "9": { lat: 51.0461, lng: 3.7206 }, // Islamitisch Cultureel Centrum - Badr - Kerkstraat 188
  "10": { lat: 51.0633, lng: 3.7333 }, // Ittahad el Muslimin - Voormuide 71
  "11": { lat: 51.0508, lng: 3.7125 }, // Moskee Al Fath - Beukelaarsstraat 23-25
  "12": { lat: 51.0489, lng: 3.7375 }, // Moskee Alfurkaan - Rietstraat 35
  "13": { lat: 51.0568, lng: 3.7398 }, // Moskee Nur - Phoenixstraat 78
  "14": { lat: 51.0711, lng: 3.7517 }, // Moskee Salahaddien - Antwerpsesteenweg 24
  "15": { lat: 51.0486, lng: 3.7297 }, // Okba ibn Nafi-moskee - Warandestraat 39
  "16": { lat: 51.0583, lng: 3.7267 }, // Pakistaans Islamitisch Cultureel Centrum - Victor Frisstraat 27-29
  "17": { lat: 51.0367, lng: 3.7106 }, // Sadique Cultureel Centrum - Frans van Ryhovelaan 317
  "18": { lat: 51.0628, lng: 3.7089 }, // Tevhid Camii - Fr. Ferrerlaan 214A
  "19": { lat: 51.0553, lng: 3.7472 }, // Vaynah Kaukasisch Cultureel Centrum vzw - Kapiteinstraat 42
  "20": { lat: 51.0650, lng: 3.7289 }, // Vlaams Intercultureel Centrum - Doornzelestraat 5-7
  "21": { lat: 51.0433, lng: 3.7064 }, // Vzw de Toekomst - R. Novarumplein 1A
  "22": { lat: 51.0614, lng: 3.7403 }, // Yavuz Sultan Selim Camii - Langestraat 204
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
