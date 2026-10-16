const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  "http://localhost:1337";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  `${STRAPI_BASE_URL.replace(/\/$/, "")}/api`;

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("strapi_jwt")
  );
}

function getAuthHeaders() {
  const token = getAuthToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function parseResponse(response) {
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.error?.message || "API Error");
  }
  return result;
}

// ------------------------------------------------------------------
// VIEWS — Record a single view (session-deduplicated)
// ------------------------------------------------------------------

export async function recordPropertyView(propertyDocumentId) {
  try {
    if (typeof window === "undefined") return false;

    // Session-based deduplication: skip if already recorded this session
    const sessionKey = `pv_${propertyDocumentId}`;
    if (sessionStorage.getItem(sessionKey)) return false;

    const token = getAuthToken();

    // Allow anonymous views — if no token, skip (can be extended later)
    if (!token) return false;

    // Get logged-in user
    const userRes = await fetch(`${API_URL}/users/me`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!userRes.ok) return false;
    const user = await userRes.json();
    if (!user?.id) return false;

    // Get numeric property id from documentId
    const propRes = await fetch(
      `${API_URL}/properties?filters[documentId][$eq]=${propertyDocumentId}&fields[0]=id&fields[1]=documentId`,
      {
        headers: getAuthHeaders(),
        cache: "no-store",
      }
    );
    const propData = await parseResponse(propRes);
    const propertyId = propData?.data?.[0]?.id;
    if (!propertyId) return false;

    // Post a view record
    const postRes = await fetch(`${API_URL}/property-views`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        data: {
          viewer: user.id,
          property: propertyId,
        },
      }),
    });

    if (postRes.ok) {
      // Mark as recorded for this session to avoid duplicates on re-render/refetch
      sessionStorage.setItem(sessionKey, "1");
      return true;
    }
    return false;
  } catch (error) {
    console.warn("Could not record property view:", error);
    return false;
  }
}

// ------------------------------------------------------------------
// BATCH STATS — Single call fetching all data for all properties
// Returns: Map<documentId, { views: number, saves: number, enquiries: number }>
// ------------------------------------------------------------------

export async function getBatchActivityStats() {
  const statsMap = {};

  try {
    // 1. Fetch ALL property-views (paginate if >200 records)
    let viewPage = 1;
    let viewsDone = false;
    while (!viewsDone) {
      const res = await fetch(
        `${API_URL}/property-views?pagination[pageSize]=200&pagination[page]=${viewPage}&populate[property][fields][0]=id&populate[property][fields][1]=documentId&fields[0]=id`,
        { headers: getAuthHeaders(), cache: "no-store" }
      );
      if (!res.ok) { viewsDone = true; break; }
      const data = await res.json();
      const items = data?.data || [];
      for (const v of items) {
        const prop = v.property;
        if (!prop) continue;
        const docId = prop.documentId;
        const numId = String(prop.id);
        if (docId) {
          if (!statsMap[docId]) statsMap[docId] = { views: 0, saves: 0, enquiries: 0 };
          statsMap[docId].views += 1;
        }
        // Also index by numeric id as string for fallback matching
        if (numId) {
          if (!statsMap[numId]) statsMap[numId] = { views: 0, saves: 0, enquiries: 0 };
          statsMap[numId].views += 1;
        }
      }
      const meta = data?.meta?.pagination;
      if (!meta || viewPage >= meta.pageCount) {
        viewsDone = true;
      } else {
        viewPage++;
      }
    }
  } catch (err) {
    console.warn("[ActivityStats] Could not fetch views:", err);
  }

  try {
    // 2. Fetch ALL enquiries (paginate if >200 records)
    let enqPage = 1;
    let enqDone = false;
    while (!enqDone) {
      const res = await fetch(
        `${API_URL}/enquiries?pagination[pageSize]=200&pagination[page]=${enqPage}&populate[property][fields][0]=id&populate[property][fields][1]=documentId&fields[0]=id`,
        { headers: getAuthHeaders(), cache: "no-store" }
      );
      if (!res.ok) { enqDone = true; break; }
      const data = await res.json();
      const items = data?.data || [];
      for (const e of items) {
        const prop = e.property;
        if (!prop) continue;
        const docId = prop.documentId;
        const numId = String(prop.id);
        if (docId) {
          if (!statsMap[docId]) statsMap[docId] = { views: 0, saves: 0, enquiries: 0 };
          statsMap[docId].enquiries += 1;
        }
        if (numId) {
          if (!statsMap[numId]) statsMap[numId] = { views: 0, saves: 0, enquiries: 0 };
          statsMap[numId].enquiries += 1;
        }
      }
      const meta = data?.meta?.pagination;
      if (!meta || enqPage >= meta.pageCount) {
        enqDone = true;
      } else {
        enqPage++;
      }
    }
  } catch (err) {
    console.warn("[ActivityStats] Could not fetch enquiries:", err);
  }

  try {
    // 3. Fetch ALL user-profile wishlists (paginate if >200 records)
    // Use explicit field filters to avoid Strapi v5 CoverImage validation error
    let profPage = 1;
    let profDone = false;
    while (!profDone) {
      const res = await fetch(
        `${API_URL}/user-profiles?pagination[pageSize]=200&pagination[page]=${profPage}&populate[Wishlist][populate][properties][fields][0]=id&populate[Wishlist][populate][properties][fields][1]=documentId&fields[0]=id`,
        { headers: getAuthHeaders(), cache: "no-store" }
      );
      if (!res.ok) { profDone = true; break; }
      const data = await res.json();
      const profiles = data?.data || [];
      for (const profile of profiles) {
        const wishlist = profile?.Wishlist;
        if (!wishlist) continue;
        const props = wishlist?.properties;
        if (!Array.isArray(props)) continue;
        for (const p of props) {
          const docId = p.documentId;
          const numId = String(p.id);
          if (docId) {
            if (!statsMap[docId]) statsMap[docId] = { views: 0, saves: 0, enquiries: 0 };
            statsMap[docId].saves += 1;
          }
          if (numId) {
            if (!statsMap[numId]) statsMap[numId] = { views: 0, saves: 0, enquiries: 0 };
            statsMap[numId].saves += 1;
          }
        }
      }
      const meta = data?.meta?.pagination;
      if (!meta || profPage >= meta.pageCount) {
        profDone = true;
      } else {
        profPage++;
      }
    }
  } catch (err) {
    console.warn("[ActivityStats] Could not fetch saves:", err);
  }

  return statsMap;
}

// ------------------------------------------------------------------
// VIEWS — Per-property (for individual use if needed)
// ------------------------------------------------------------------

export async function getPropertyViews(propertyDocumentId) {
  try {
    const query = `filters[$or][0][property][documentId][$eq]=${propertyDocumentId}&filters[$or][1][property][id][$eq]=${propertyDocumentId}&populate[viewer][fields][0]=id&fields[0]=id`;
    const res = await fetch(`${API_URL}/property-views?${query}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    const data = await parseResponse(res);
    const views = data?.data || [];
    // Return unique viewer count (deduplicated by viewer id)
    const uniqueViewers = new Set();
    for (const view of views) {
      const viewerData = view.viewer;
      if (viewerData?.id) {
        uniqueViewers.add(viewerData.id);
      }
    }
    // Return array of length = unique viewers for backwards compat
    return Array.from({ length: Math.max(views.length, uniqueViewers.size) }, (_, i) => i);
  } catch (error) {
    console.warn("Could not fetch property views:", error);
    return [];
  }
}

// ------------------------------------------------------------------
// SAVES (WISHLISTS) — Per-property (for individual use if needed)
// ------------------------------------------------------------------

export async function getPropertySaves(propertyDocumentId) {
  try {
    // Use explicit field selection to avoid Strapi v5 CoverImage validation error
    const query = `populate[Wishlist][populate][properties][fields][0]=id&populate[Wishlist][populate][properties][fields][1]=documentId&pagination[pageSize]=200&fields[0]=id`;
    const res = await fetch(`${API_URL}/user-profiles?${query}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    const data = await parseResponse(res);

    const profiles = data?.data || [];
    const savers = [];

    for (const profile of profiles) {
      const wishlist = profile?.Wishlist;
      if (!wishlist) continue;

      const props = wishlist?.properties;
      if (!Array.isArray(props)) continue;

      const hasProp = props.some((p) => {
        const pDocId = p?.documentId;
        const pId = String(p?.id || "");
        return (
          String(pDocId) === String(propertyDocumentId) ||
          pId === String(propertyDocumentId)
        );
      });

      if (hasProp) {
        savers.push({ profileId: profile.id });
      }
    }

    return savers;
  } catch (error) {
    console.warn("Could not fetch property saves:", error);
    return [];
  }
}

// ------------------------------------------------------------------
// ENQUIRIES — Per-property (for individual use if needed)
// ------------------------------------------------------------------

export async function getPropertyEnquiries(propertyDocumentId) {
  try {
    const query = `filters[$or][0][property][documentId][$eq]=${propertyDocumentId}&filters[$or][1][property][id][$eq]=${propertyDocumentId}&fields[0]=id&fields[1]=documentId&fields[2]=createdAt&sort=createdAt:desc`;
    const res = await fetch(`${API_URL}/enquiries?${query}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    const data = await parseResponse(res);
    return data?.data || [];
  } catch (error) {
    console.warn("Could not fetch property enquiries:", error);
    return [];
  }
}
