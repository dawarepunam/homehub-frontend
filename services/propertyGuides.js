const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

const BASE = STRAPI_URL.replace(/\/api\/?$/, "");
const API_URL = `${BASE}/api`;

// =============================================
// GET ALL PUBLISHED GUIDE ARTICLES
// =============================================
export async function getGuideArticles({ category = "", search = "", page = 1, pageSize = 12 } = {}) {
  try {
    const params = new URLSearchParams();
    params.append("populate", "*");
    params.append("sort", "createdAt:desc");
    params.append("pagination[page]", page);
    params.append("pagination[pageSize]", pageSize);

    if (category) {
      params.append("filters[Category][$eq]", category);
    }
    if (search) {
      params.append("filters[$or][0][Title][$containsi]", search);
      params.append("filters[$or][1][Excerpt][$containsi]", search);
    }

    const response = await fetch(
      `${API_URL}/property-guide-articles?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) return { data: [], meta: {} };

    const result = await response.json();
    return { data: result?.data || [], meta: result?.meta || {} };
  } catch (error) {
    console.error("getGuideArticles Error:", error);
    return { data: [], meta: {} };
  }
}

// =============================================
// GET FEATURED GUIDE ARTICLE
// =============================================
export async function getFeaturedGuide() {
  try {
    const params = new URLSearchParams();
    params.append("populate", "*");
    params.append("filters[IsFeatured][$eq]", "true");
    params.append("pagination[limit]", "1");
    params.append("sort", "createdAt:desc");

    const response = await fetch(
      `${API_URL}/property-guide-articles?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) return null;
    const result = await response.json();
    return result?.data?.[0] || null;
  } catch (error) {
    console.error("getFeaturedGuide Error:", error);
    return null;
  }
}

// =============================================
// GET SINGLE GUIDE ARTICLE BY SLUG
// =============================================
export async function getGuideArticleBySlug(slug) {
  try {
    const params = new URLSearchParams();
    params.append("populate", "*");
    params.append("filters[Slug][$eq]", slug);

    const response = await fetch(
      `${API_URL}/property-guide-articles?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) return null;
    const result = await response.json();
    return result?.data?.[0] || null;
  } catch (error) {
    console.error("getGuideArticleBySlug Error:", error);
    return null;
  }
}

// =============================================
// GET RELATED GUIDES (same category, exclude current)
// =============================================
export async function getRelatedGuides(category, excludeSlug) {
  try {
    const params = new URLSearchParams();
    params.append("populate", "*");
    params.append("sort", "createdAt:desc");
    params.append("pagination[limit]", "3");

    if (category) {
      params.append("filters[Category][$eq]", category);
    }
    if (excludeSlug) {
      params.append("filters[Slug][$ne]", excludeSlug);
    }

    const response = await fetch(
      `${API_URL}/property-guide-articles?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) return [];
    const result = await response.json();
    return result?.data || [];
  } catch (error) {
    console.error("getRelatedGuides Error:", error);
    return [];
  }
}

// =============================================
// GET DISTINCT CATEGORIES FROM PUBLISHED ARTICLES
// =============================================
export async function getGuideCategories() {
  try {
    const response = await fetch(
      `${API_URL}/property-guide-articles?fields[0]=Category&pagination[limit]=200`,
      { cache: "no-store" }
    );

    if (!response.ok) return [];
    const result = await response.json();
    const data = result?.data || [];
    const categories = [...new Set(data.map(a => a.Category).filter(Boolean))];
    return categories;
  } catch (error) {
    console.error("getGuideCategories Error:", error);
    return [];
  }
}
