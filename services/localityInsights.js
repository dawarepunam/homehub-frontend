const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_URL = `${STRAPI_URL.replace(/\/api\/?$/, "")}/api`;

/**
 * Normalize a string for case- and whitespace-insensitive comparison.
 * Trims, lowercases, and collapses internal whitespace.
 */
export function normalizeString(str) {
  if (!str) return "";
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Convert a display name into a URL slug.
 * "Balaji Nagar" → "balaji-nagar"
 */
export function toSlug(str) {
  if (!str) return "";
  return normalizeString(str).replace(/\s+/g, "-");
}

/**
 * Convert a URL slug back to a normalised string for map lookup.
 * "balaji-nagar" → "balaji nagar"
 */
export function fromSlug(slug) {
  if (!slug) return "";
  return decodeURIComponent(slug).replace(/-/g, " ").trim().toLowerCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL: fetch lightweight property data for locality aggregation.
// Only the fields needed for grouping and stats are requested.
// ─────────────────────────────────────────────────────────────────────────────
async function fetchLocalityProperties() {
  try {
    const params = new URLSearchParams();
    params.append("fields[0]", "City");
    params.append("fields[1]", "Area");
    params.append("fields[2]", "Price");
    params.append("fields[3]", "Purpose");
    params.append("fields[4]", "Property_Type");
    params.append("populate[CoverImage][fields][0]", "url");
    params.append("pagination[limit]", "500");

    const response = await fetch(`${API_URL}/properties?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Strapi responded ${response.status}`);
    }

    const result = await response.json();
    return result?.data || [];
  } catch (error) {
    console.error("fetchLocalityProperties error:", error);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL: build the city → area → properties map.
//
// Keyed by normalised strings so that "Pune" and "pune" merge into one bucket
// and "Balaji Nagar" / "balaji nagar" are treated as the same area.
//
// The `originalName` stored is the first-seen raw value for display purposes.
// ─────────────────────────────────────────────────────────────────────────────
async function buildLocalityMap() {
  const properties = await fetchLocalityProperties();
  // citiesMap: normalisedCity → { originalName, areas: Map<normalisedArea, areaData> }
  const citiesMap = new Map();

  for (const prop of properties) {
    const cityRaw = prop.City;
    const areaRaw = prop.Area;

    if (!cityRaw || !areaRaw) continue;

    const cityNorm = normalizeString(cityRaw);
    const areaNorm = normalizeString(areaRaw);

    if (!citiesMap.has(cityNorm)) {
      citiesMap.set(cityNorm, {
        originalName: cityRaw.trim(),
        areas: new Map(),
      });
    }

    const cityData = citiesMap.get(cityNorm);

    if (!cityData.areas.has(areaNorm)) {
      cityData.areas.set(areaNorm, {
        originalName: areaRaw.trim(),
        cityOriginalName: cityData.originalName, // use the city's canonical name
        properties: [],
        images: [],
      });
    }

    const areaData = cityData.areas.get(areaNorm);
    areaData.properties.push(prop);

    if (prop.CoverImage?.url) {
      areaData.images.push(prop.CoverImage.url);
    }
  }

  return citiesMap;
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Unique, sorted list of city display-names for the search dropdown.
// ─────────────────────────────────────────────────────────────────────────────
export async function getLocalityCities() {
  const map = await buildLocalityMap();
  const names = [];
  for (const [, cityData] of map.entries()) {
    names.push(cityData.originalName);
  }
  return names.sort((a, b) => a.localeCompare(b));
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Top localities sorted by actual property count.
// ─────────────────────────────────────────────────────────────────────────────
export async function getPopularLocalities(limit = 6) {
  const map = await buildLocalityMap();
  const all = [];

  for (const [, cityData] of map.entries()) {
    for (const [, areaData] of cityData.areas.entries()) {
      all.push({
        city: areaData.cityOriginalName,
        locality: areaData.originalName,
        propertyCount: areaData.properties.length,
        image: areaData.images.length > 0 ? areaData.images[0] : null,
        startingPrice: _calculateStartingPrice(areaData.properties),
        // Expose stable slugs so the card can build the URL without re-deriving
        citySlug: toSlug(areaData.cityOriginalName),
        localitySlug: toSlug(areaData.originalName),
      });
    }
  }

  return all.sort((a, b) => b.propertyCount - a.propertyCount).slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Full overview for one locality.
//
// Accepts the raw city/locality strings decoded from the URL slug
// (e.g. "pune", "balaji nagar") and matches them case-insensitively.
//
// Returns null ONLY when the city+area combination genuinely does not exist
// in the property data — never because of a capitalisation mismatch.
// ─────────────────────────────────────────────────────────────────────────────
export async function getLocalityOverview(citySlugParam, localitySlugParam) {
  if (!citySlugParam || !localitySlugParam) return null;

  // fromSlug converts "balaji-nagar" → "balaji nagar" before normalising
  const cityNorm = normalizeString(fromSlug(citySlugParam));
  const locNorm = normalizeString(fromSlug(localitySlugParam));

  if (!cityNorm || !locNorm) return null;

  const map = await buildLocalityMap();

  const cityData = map.get(cityNorm);
  if (!cityData) return null;

  const areaData = cityData.areas.get(locNorm);
  if (!areaData) return null;

  const properties = areaData.properties;

  // Property types found in this locality
  const typesSet = new Set();
  properties.forEach((p) => {
    if (p.Property_Type) typesSet.add(p.Property_Type);
  });

  // Average prices (only from records that have a numeric Price)
  const saleProps = properties.filter(
    (p) => normalizeString(p.Purpose) === "sale" && p.Price && !isNaN(Number(p.Price))
  );
  const rentProps = properties.filter(
    (p) => normalizeString(p.Purpose) === "rent" && p.Price && !isNaN(Number(p.Price))
  );

  const avgSale =
    saleProps.length > 0
      ? saleProps.reduce((s, p) => s + Number(p.Price), 0) / saleProps.length
      : null;

  const avgRent =
    rentProps.length > 0
      ? rentProps.reduce((s, p) => s + Number(p.Price), 0) / rentProps.length
      : null;

  return {
    city: areaData.cityOriginalName,
    locality: areaData.originalName,
    // Canonical slugs — used for "back" links and consistency checks
    citySlug: toSlug(areaData.cityOriginalName),
    localitySlug: toSlug(areaData.originalName),
    propertyCount: properties.length,
    propertyTypes: Array.from(typesSet),
    averageSalePrice: avgSale,
    averageRent: avgRent,
    image: areaData.images.length > 0 ? areaData.images[0] : null,
    totalSale: saleProps.length,
    totalRent: rentProps.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Fetch full property records for a locality from Strapi.
//
// Filters by City (containsi) and Area (containsi) so we get the right set.
// The caller is responsible for any additional client-side filtering.
// ─────────────────────────────────────────────────────────────────────────────
export async function getPropertiesForLocality(city, locality) {
  if (!city || !locality) return [];

  try {
    const params = new URLSearchParams();
    params.append("filters[City][$containsi]", city.trim());
    params.append("filters[Area][$containsi]", locality.trim());
    params.append("populate", "*");
    params.append("sort", "createdAt:desc");
    params.append("pagination[limit]", "100");

    const response = await fetch(`${API_URL}/properties?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Strapi responded ${response.status}`);
    }

    const result = await response.json();
    const data = result?.data || [];

    // Client-side exact-match guard: both City AND Area must match (normalised)
    const cityNorm = normalizeString(city);
    const locNorm = normalizeString(locality);

    return data.filter(
      (p) =>
        normalizeString(p.City) === cityNorm &&
        normalizeString(p.Area) === locNorm
    );
  } catch (error) {
    console.error("getPropertiesForLocality error:", error);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function _calculateStartingPrice(properties) {
  let min = Infinity;
  let purpose = "";
  for (const p of properties) {
    const val = Number(p.Price);
    if (val && val < min) {
      min = val;
      purpose = p.Purpose || "Sale";
    }
  }
  if (min === Infinity) return null;
  return { price: min, purpose };
}

/**
 * Format a numeric price for display.
 * e.g.  9500000 → "₹95.00 Lac"
 *       20000000 → "₹2.00 Cr"
 */
export function formatPrice(price) {
  if (price === null || price === undefined || price === "") return "N/A";
  const num = Number(price);
  if (isNaN(num)) return String(price);

  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lac`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(2)} K`;
  return `₹${num.toLocaleString("en-IN")}`;
}
