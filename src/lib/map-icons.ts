/**
 * Map Icon System - Using Tabler Icons
 *
 * This file provides SVG strings for map markers based on Tabler Icons.
 * All icons follow the Tabler design system: 24x24 viewBox, 2px stroke.
 * Colors are applied via the marker container, not the icons themselves.
 */

// Tabler icon paths - extracted from @tabler/icons for use as SVG strings
// Each icon is a 24x24 viewBox with stroke-width="2" stroke="currentColor" fill="none"
const tablerPaths: Record<string, string> = {
  // Food Categories
  restaurant: `<path d="M3 19h18M5 19v-9a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v9M4 15h16M9 15v-4M15 15v-4M12 19v-6"/>`, // tools-kitchen-2
  bakery: `<path d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M15 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M3 12v-1a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v1M3 12l-1 7h20l-1 -7"/>`, // bread
  butcher: `<path d="M13.62 8.382l1.966 -1.967a2 2 0 1 1 3.414 -1.415a2 2 0 1 1 -1.413 3.414l-1.82 1.821"/><path d="M5.904 18.596c2.733 2.734 5.9 4 7.07 2.829c1.172 -1.172 -.094 -4.338 -2.828 -7.071c-2.733 -2.734 -5.9 -4 -7.07 -2.829c-1.172 1.172 .094 4.338 2.828 7.071z"/><path d="M7.5 16l1 1"/><path d="M12.975 21.425c3.905 -3.906 4.855 -9.288 2.121 -12.021c-2.733 -2.734 -8.115 -1.784 -12.02 2.121"/>`, // meat
  supermarket: `<path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M17 17h-11v-14h-2M6 5l14 1l-1 7h-13"/>`, // shopping-cart
  catering: `<path d="M4 11h16a1 1 0 0 1 1 1v.5c0 1.5 -2.517 5.573 -4 6.5v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1c-1.687 -1.054 -4 -5 -4 -6.5v-.5a1 1 0 0 1 1 -1z"/><path d="M12 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"/><path d="M16 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"/><path d="M8 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"/>`, // soup
  cafe: `<path d="M17 11v6a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-6z"/><path d="M5 11v-3a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v3"/><path d="M17 8h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2"/><path d="M9 3l1 1l-1 1"/>`, // coffee
  takeaway: `<path d="M9 5h6a1 1 0 0 1 1 1v2h-8v-2a1 1 0 0 1 1 -1"/><path d="M5 9h14l-.986 9.862a2 2 0 0 1 -1.993 1.138h-8.042a2 2 0 0 1 -1.993 -1.138l-.986 -9.862z"/>`, // package

  // Shop Categories
  decor: `<path d="M8 4l3 3l3 -3l3 3v7l-6 8l-6 -8v-7z"/><path d="M8 7l3 3l3 -3"/>`, // lamp (simplified lantern)
  clothing: `<path d="M15 4l6 2v5h-3v8a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-8h-3v-5l6 -2a3 3 0 0 0 6 0"/>`, // shirt
  spiritual: `<path d="M12 3l10 6.5l-10 6.5l-10 -6.5z"/><path d="M12 12l10 6.5l-10 6.5l-10 -6.5z"/><path d="M10 12.5v5.5l2 1l2 -1v-5.5"/>`, // book
  gifts: `<path d="M3 8m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z"/><path d="M12 8l0 13"/><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5"/>`, // gift
  beauty: `<path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25"/><path d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>`, // palette
  kids: `<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 10l.01 0"/><path d="M15 10l.01 0"/><path d="M9.5 15a3.5 3.5 0 0 0 5 0"/>`, // mood-smile
  tech: `<path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z"/><path d="M7 20l10 0"/><path d="M9 16l0 4"/><path d="M15 16l0 4"/>`, // device-desktop
  jewelry: `<path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5"/><path d="M10 12l-2 -2.2l.6 -1"/>`, // diamond
  books: `<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6l0 13"/><path d="M12 6l0 13"/><path d="M21 6l0 13"/>`, // book-2
  electronics: `<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2m3 0v-2h5v2"/><path d="M11 14a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/><path d="M9 8h6"/>`, // device-mobile
  sports: `<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M12 3v6"/><path d="M12 15v6"/>`, // ball

  // Special
  mosque: `<path d="M3 21h7v-2a2 2 0 1 1 4 0v2h7"/><path d="M3 21v-10"/><path d="M21 21v-10"/><path d="M6 21v-7"/><path d="M18 21v-7"/><path d="M6 14h12"/><path d="M12 3a3 3 0 0 1 3 3a5 5 0 0 1 -3 4a5 5 0 0 1 -3 -4a3 3 0 0 1 3 -3z"/>`, // building-mosque
  other: `<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 9h.01"/><path d="M11 12h1v4h1"/>`, // info-circle
};

/**
 * Get SVG markup for a category icon
 * Returns a complete SVG element string that can be embedded in HTML
 */
export function getCategoryIconSvg(
  category: string,
  color: string = "currentColor",
  size: number = 24
): string {
  const path = tablerPaths[category] || tablerPaths.other;

  return `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="${size}"
    height="${size}"
    fill="none"
    stroke="${color}"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >${path}</svg>`;
}

/**
 * Category to Tabler icon name mapping (for reference)
 */
export const categoryIconNames: Record<string, string> = {
  restaurant: "tools-kitchen-2",
  bakery: "bread",
  butcher: "meat",
  supermarket: "shopping-cart",
  catering: "soup",
  cafe: "coffee",
  takeaway: "package",
  decor: "lamp",
  clothing: "shirt",
  spiritual: "book",
  gifts: "gift",
  beauty: "palette",
  kids: "mood-smile",
  tech: "device-desktop",
  jewelry: "diamond",
  books: "book-2",
  electronics: "device-mobile",
  sports: "ball",
  mosque: "building-mosque",
  other: "info-circle",
};

/**
 * List of all supported categories
 */
export const allCategories = Object.keys(tablerPaths);

/**
 * Food-related categories
 */
export const foodCategories = [
  "restaurant",
  "bakery",
  "butcher",
  "supermarket",
  "cafe",
  "takeaway",
  "catering",
];

/**
 * Shop-related categories
 */
export const shopCategories = [
  "decor",
  "clothing",
  "spiritual",
  "gifts",
  "beauty",
  "kids",
  "tech",
  "jewelry",
  "books",
  "electronics",
  "sports",
];
