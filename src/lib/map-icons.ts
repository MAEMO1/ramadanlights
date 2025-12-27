/**
 * Map Icon System - Using Material Design Icons (MDI)
 *
 * This file provides SVG paths for map markers based on MDI icons.
 * All icons follow the MDI design system: 24x24 viewBox, filled style.
 * These icons are more visually appealing than stroke-based icons.
 */

// MDI icon paths - extracted from Material Design Icons
// Each icon uses fill="currentColor" for theming support
const mdiPaths: Record<string, string> = {
  // Food Categories
  restaurant: `M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4`, // silverware-fork-knife

  bakery: `M12 1.5A2.5 2.5 0 0 1 14.5 4A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 9.5 4A2.5 2.5 0 0 1 12 1.5M15.87 5C18 5 20 7 20 9c2.7 0 2.7 4 0 4H4c-2.7 0-2.7-4 0-4c0-2 2-4 4.13-4c.44 1.73 2.01 3 3.87 3s3.43-1.27 3.87-3M5 15h3l1 7H7zm5 0h4l-1 7h-2zm6 0h3l-2 7h-2z`, // cupcake

  butcher: `M20.16 12.73A6.27 6.27 0 0 0 19.09 3c-2.01-1.33-4.7-1.34-6.73-.03c-1.76 1.13-2.73 2.89-2.9 4.71c-.13 1.32-.63 2.55-1.55 3.47l-.03.03c-1.16 1.16-1.16 2.93-.07 4.01l.99.99a2.794 2.794 0 0 0 3.95 0c.97-.97 2.25-1.5 3.64-1.65c1.37-.15 2.71-.75 3.77-1.8m-13.9 7.13c.27.56.18 1.24-.29 1.7a1.49 1.49 0 0 1-2.55-.98a1.49 1.49 0 0 1-.98-2.55c.46-.46 1.15-.56 1.7-.29l2.48-2.43c.14.19.3.41.48.59l.99.99c.21.2.41.37.67.52z`, // food-drumstick (kippenpoot)

  supermarket: `M17 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2M1 2v2h2l3.6 7.59l-1.36 2.45c-.15.28-.24.61-.24.96a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25q0-.075.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 0 0-1-1H5.21l-.94-2M7 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2`, // cart

  catering: `M12 5a2 2 0 0 1 2 2q0 .36-.12.69C17.95 8.5 21 11.91 21 16H3c0-4.09 3.05-7.5 7.12-8.31Q10 7.36 10 7a2 2 0 0 1 2-2m10 14H2v-2h20z`, // room-service (cloche)

  cafe: `M2 21h18v-2H2M20 8h-2V5h2m0-2H4v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-3h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2`, // coffee

  takeaway: `M12 13a5 5 0 0 1-5-5h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2a5 5 0 0 1-5 5m0-10a3 3 0 0 1 3 3H9a3 3 0 0 1 3-3m7 3h-2a5 5 0 0 0-5-5a5 5 0 0 0-5 5H5c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2`, // shopping bag

  // Shop Categories
  decor: `M12 18H6v-4h6m9 0v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6m0-10H4v2h16z`, // store (winkel)

  clothing: `M16 21H8a1 1 0 0 1-1-1v-7.93l-1.3 1a.996.996 0 0 1-1.41 0l-2.83-2.78a.996.996 0 0 1 0-1.41L7.34 3H9c0 1.1 1.34 2 3 2s3-.9 3-2h1.66l5.88 5.88c.39.39.39 1.02 0 1.41l-2.83 2.83c-.39.38-1.02.38-1.41 0l-1.3-1V20a1 1 0 0 1-1 1`, // tshirt-crew

  spiritual: `M12 2L6.5 11h11L12 2m0 3.84L14.26 9H9.74L12 5.84M17.5 13c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5s4.5-2 4.5-4.5s-2-4.5-4.5-4.5m0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5M3 21.5h8v-8H3v8m2-6h4v4H5v-4z`, // shape-outline

  gifts: `M9.06 1.93C7.17 1.92 5.33 3.74 6.17 6H3a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h9V8h2v3h9a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2h-3.17C19 2.73 14.6.42 12.57 3.24L12 4l-.57-.78c-.63-.89-1.5-1.28-2.37-1.29M9 4c.89 0 1.34 1.08.71 1.71S8 5.89 8 5a1 1 0 0 1 1-1m6 0c.89 0 1.34 1.08.71 1.71S14 5.89 14 5a1 1 0 0 1 1-1M2 12v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8h-9v8h-2v-8z`, // gift

  beauty: `M12 3c-1.66 0-3 1.34-3 3c0 .55.15 1.06.41 1.5l-.06.05l-6.56 6.57c-.15.15-.2.36-.13.55s.25.33.47.33h17.74c.22 0 .4-.14.47-.33s.02-.4-.13-.55l-6.56-6.57l-.06-.05c.26-.44.41-.95.41-1.5c0-1.66-1.34-3-3-3m0 2c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m-2.5 9h5v5.5c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5V14z`, // lipstick-variant

  kids: `M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8S14 8.67 14 9.5s.67 1.5 1.5 1.5m-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8S7 8.67 7 9.5S7.67 11 8.5 11m3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5`, // emoticon-happy-outline

  tech: `M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6m19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1m-1 9h-4v-7h4v7z`, // devices

  jewelry: `M16 9h3l-5 7m-4-7h4l-2 8M5 9h3l2 7m5-12h2l2 3h-3m-5-3h2l1 3h-4M7 4h2L8 7H5m1-5L2 8l10 14L22 8l-4-6z`, // diamond-stone

  books: `M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M6 4h5v8l-2.5-1.5L6 12V4z`, // book-open-page-variant

  electronics: `M7 2v11h3v9l7-12h-4l4-8H7z`, // flash

  sports: `M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m-5.5-2.5l7.51-3.49L17.5 6.5L9.99 9.99L6.5 17.5m5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1s-1.1-.49-1.1-1.1s.49-1.1 1.1-1.1`, // compass

  // Special
  mosque: `M7 8h10c.3 0 .6.1.8.1c.1-.3.2-.7.2-1c0-1.3-.6-2.5-1.7-3.2L12 1L7.7 3.8c-1 .8-1.7 2-1.7 3.3c0 .4.1.7.2 1c.2 0 .5-.1.8-.1m17-1c0-1.1-2-3-2-3s-2 1.9-2 3c0 .7.4 1.4 1 1.7V13h-2v-2c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v2H3V8.7c.6-.3 1-1 1-1.7c0-1.1-2-3-2-3S0 5.9 0 7c0 .7.4 1.4 1 1.7V21h9v-4c0-1.1.9-2 2-2s2 .9 2 2v4h9V8.7c.6-.3 1-1 1-1.7`, // mosque

  other: `M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m1 15h-2v-6h2v6m0-8h-2V7h2v2z`, // information
};

/**
 * Get SVG markup for a category icon
 * Returns a complete SVG element string that can be embedded in HTML
 * Uses filled MDI icons for better visual appearance
 */
export function getCategoryIconSvg(
  category: string,
  color: string = "currentColor",
  size: number = 24
): string {
  const pathData = mdiPaths[category] || mdiPaths.other;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}"><path d="${pathData}"/></svg>`;
}

/**
 * Category to MDI icon name mapping (for reference)
 */
export const categoryIconNames: Record<string, string> = {
  restaurant: "silverware-fork-knife",
  bakery: "cupcake",
  butcher: "food-drumstick",
  supermarket: "cart",
  catering: "room-service",
  cafe: "coffee",
  takeaway: "shopping",
  decor: "store",
  clothing: "tshirt-crew",
  spiritual: "shape-outline",
  gifts: "gift",
  beauty: "lipstick-variant",
  kids: "emoticon-happy-outline",
  tech: "devices",
  jewelry: "diamond-stone",
  books: "book-open-page-variant",
  electronics: "flash",
  sports: "compass",
  mosque: "mosque",
  other: "information",
};

/**
 * List of all supported categories
 */
export const allCategories = Object.keys(mdiPaths);

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
