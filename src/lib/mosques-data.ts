export interface Mosque {
  id: string;
  name: string;
  address: string;
  houseNumber: string;
  city: string;
  latitude?: number;
  longitude?: number;
}

export const mosques: Mosque[] = [
  { id: "1", name: "IH-VAK Moskee", address: "Koopvaardijlaan", houseNumber: "44", city: "Gent" },
  { id: "2", name: "Al Markaz at Tarbawi", address: "Elyzeese Velden", houseNumber: "35", city: "Gent" },
  { id: "3", name: "Pakistaans Islamitisch Cultureel Centrum", address: "Victor Frisstraat", houseNumber: "27-29", city: "Gent" },
  { id: "4", name: "Okba ibn Nafi-moskee", address: "Warandestraat", houseNumber: "39", city: "Gent" },
  { id: "5", name: "Eyup Sultan Camii", address: "Kazemattenstraat", houseNumber: "80", city: "Gent" },
  { id: "6", name: "Groene Moskee Fatih", address: "Kwakkelstraat", houseNumber: "41", city: "Gent" },
  { id: "7", name: "Tevhid Camii", address: "Fr. Ferrerlaan", houseNumber: "214A", city: "Gent" },
  { id: "8", name: "Moskee Al Fath", address: "Beukelaarsstraat", houseNumber: "23-25", city: "Gent" },
  { id: "9", name: "Vzw de Toekomst", address: "R. Novarumplein", houseNumber: "1A", city: "Gent" },
  { id: "10", name: "Yavuz Sultan Selim Camii", address: "Langestraat", houseNumber: "204", city: "Gent" },
  { id: "11", name: "Islamitisch Cultureel Centrum - Badr", address: "Kerkstraat", houseNumber: "188", city: "Gent" },
  { id: "12", name: "Vlaams Intercultureel Centrum", address: "Doornzelestraat", houseNumber: "5-7", city: "Gent" },
  { id: "13", name: "Dzamet Ensarija", address: "Loodsenstraat", houseNumber: "56", city: "Gent" },
  { id: "14", name: "Vaynah Kaukasisch Cultureel Centrum vzw", address: "Kapiteinstraat", houseNumber: "42", city: "Gent" },
  { id: "15", name: "Moskee Salahaddien", address: "Antwerpsesteenweg", houseNumber: "24", city: "Gent" },
  { id: "16", name: "Ittahad el Muslimin", address: "Voormuide", houseNumber: "71", city: "Gent" },
  { id: "17", name: "Moskee Alfurkaan", address: "Rietstraat", houseNumber: "35", city: "Gent" },
  { id: "18", name: "El-Albani Moskee", address: "Phoenixstraat", houseNumber: "49", city: "Gent" },
  { id: "19", name: "Ilmihal Dernegi", address: "Dendermondsesteenweg", houseNumber: "283", city: "Gent" },
  { id: "20", name: "Afghan Attaqwa Moskee", address: "Dendermondsesteenweg", houseNumber: "417", city: "Gent" },
  { id: "21", name: "Sadique Cultureel Centrum", address: "Frans van Ryhovelaan", houseNumber: "317", city: "Gent" },
];

export function getFullAddress(mosque: Mosque): string {
  return `${mosque.address} ${mosque.houseNumber}, ${mosque.city}`;
}
