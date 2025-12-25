import { NextResponse } from "next/server";
import { mosques, getFullAddress, type Mosque } from "@/lib/mosques-data";

// Cache for geocoded coordinates
const coordinatesCache: Record<string, { lat: number; lng: number }> = {};

// Pre-computed coordinates for mosques (geocoded via Nominatim/OpenStreetMap)
// Sorted alphabetically by mosque name
const precomputedCoordinates: Record<string, { lat: number; lng: number }> = {
  "1": { lat: 51.0517767, lng: 3.7568497 }, // Afghan Attaqwa Moskee - Dendermondsesteenweg 417
  "2": { lat: 51.0632083, lng: 3.7038111 }, // Al Markaz at Tarbawi - Elyzeese Velden 35
  "3": { lat: 51.0724514, lng: 3.7288641 }, // Dzamet Ensarija - Loodsenstraat 56
  "4": { lat: 51.0577483, lng: 3.7062261 }, // El-Albani Moskee - Phoenixstraat 49
  "5": { lat: 51.0548751, lng: 3.7378870 }, // Eyup Sultan Camii - Kazemattenstraat 80
  "6": { lat: 51.0634776, lng: 3.7065702 }, // Groene Moskee Fatih - Kwakkelstraat 41
  "7": { lat: 51.0598413, lng: 3.7393684 }, // IH-VAK Moskee - Koopvaardijlaan 44
  "8": { lat: 51.0527286, lng: 3.7485731 }, // Ilmihal Dernegi - Dendermondsesteenweg 283
  "9": { lat: 51.0437053, lng: 3.7469959 }, // Islamitisch Cultureel Centrum - Badr - Kerkstraat 188
  "10": { lat: 51.0687619, lng: 3.7293914 }, // Ittahad el Muslimin - Voormuide 71
  "11": { lat: 51.0613824, lng: 3.7023878 }, // Moskee Al Fath - Beukelaarsstraat 23-25
  "12": { lat: 51.0643064, lng: 3.7100423 }, // Moskee Alfurkaan - Rietstraat 35
  "13": { lat: 51.0585239, lng: 3.7052310 }, // Moskee Nur - Phoenixstraat 78
  "14": { lat: 51.0577002, lng: 3.7422811 }, // Moskee Salahaddien - Antwerpsesteenweg 24
  "15": { lat: 51.0579039, lng: 3.7365895 }, // Okba ibn Nafi-moskee - Warandestraat 39
  "16": { lat: 51.0629593, lng: 3.7074127 }, // Pakistaans Islamitisch Cultureel Centrum - Victor Frisstraat 27-29
  "17": { lat: 51.0746886, lng: 3.7126758 }, // Sadique Cultureel Centrum - Frans van Ryhovelaan 317
  "18": { lat: 51.0713669, lng: 3.7077013 }, // Tevhid Camii - Fr. Ferrerlaan 214A
  "19": { lat: 51.0883357, lng: 3.7232181 }, // Vaynah Kaukasisch Cultureel Centrum vzw - Kapiteinstraat 42
  "20": { lat: 51.0642043, lng: 3.7297446 }, // Vlaams Intercultureel Centrum - Doornzelestraat 5-7
  "21": { lat: 51.0233826, lng: 3.7202680 }, // Vzw de Toekomst - R. Novarumplein 1A
  "22": { lat: 51.0336847, lng: 3.7422060 }, // Yavuz Sultan Selim Camii - Langestraat 204
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
