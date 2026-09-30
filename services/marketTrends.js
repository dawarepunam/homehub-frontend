// =====================================================
// HOMEHUB - MARKET TRENDS SERVICE
// =====================================================

const RAW_STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

const STRAPI_BASE_URL = RAW_STRAPI_URL
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const API_URL = `${STRAPI_BASE_URL}/api`;

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("strapi_jwt");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function safeFetch(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      json?.error?.message || `Request failed ${res.status}`
    );
  }
  return json;
}

// =====================================================
// GET LOGGED-IN OWNER
// =====================================================
export async function getMarketTrendsOwner() {
  const json = await safeFetch(`${API_URL}/users/me`);
  return json;
}

// =====================================================
// GET OWNER PROPERTIES
// =====================================================
export async function getOwnerPropertiesForMarket(ownerId) {
  if (!ownerId) throw new Error("Owner ID required");

  const params = new URLSearchParams();
  params.set("filters[Owner][id][$eq]", String(ownerId));
  params.set("populate", "*");
  params.set("pagination[pageSize]", "100");

  const result = await safeFetch(
    `${API_URL}/properties?${params.toString()}`
  );
  return result?.data || [];
}

// =====================================================
// GET MARKET TRENDS
// =====================================================
export async function getMarketTrends(filters = {}) {
  const params = new URLSearchParams();
  params.set("populate", "*");
  
  if (filters.city) params.set("filters[City][$eq]", filters.city);
  if (filters.locality) params.set("filters[Locality][$eq]", filters.locality);
  if (filters.category) params.set("filters[PropertyCategory][$eq]", filters.category);
  if (filters.purpose) params.set("filters[Purpose][$eq]", filters.purpose);
  if (filters.period) params.set("filters[Period][$eq]", filters.period);

  params.set("filters[IsActive][$eq]", "true");

  const result = await safeFetch(
    `${API_URL}/market-trends?${params.toString()}`
  );
  
  return result?.data || [];
}

// =====================================================
// GET UNIQUE FILTERS
// =====================================================
export async function getAvailableFilters() {
  const result = await safeFetch(
    `${API_URL}/market-trends?fields[0]=City&fields[1]=Locality&filters[IsActive][$eq]=true&pagination[pageSize]=200`
  );
  
  const data = result?.data || [];
  
  const cities = [...new Set(data.map(d => d.City))].filter(Boolean);
  const localities = [...new Set(data.map(d => d.Locality))].filter(Boolean);
  
  return { cities, localities };
}

// =====================================================
// GET MARKET TREND BY ID/DOCUMENTID
// =====================================================
export async function getMarketTrendById(id) {
  const result = await safeFetch(
    `${API_URL}/market-trends?filters[documentId][$eq]=${id}&populate=*`
  );
  if (result?.data && result.data.length > 0) {
    return result.data[0];
  }
  
  // fallback to normal id
  const fallback = await safeFetch(
    `${API_URL}/market-trends/${id}?populate=*`
  );
  return fallback?.data || null;
}
