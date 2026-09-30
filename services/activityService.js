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
// VIEWS
// ------------------------------------------------------------------

export async function recordPropertyView(propertyDocumentId) {
  try {
    const token = getAuthToken();
    if (!token) return false;

    // 1. Get Logged in user
    const userRes = await fetch(`${API_URL}/users/me`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!userRes.ok) return false;
    const user = await userRes.json();
    if (!user?.id) return false;

    // 2. Get property id from documentId
    const propRes = await fetch(`${API_URL}/properties?filters[documentId][$eq]=${propertyDocumentId}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    const propData = await parseResponse(propRes);
    const propertyId = propData?.data?.[0]?.id;
    if (!propertyId) return false;

    // 3. Post a view (let backend handle duplicates or just log it)
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
        }
      }),
    });
    return postRes.ok;
  } catch (error) {
    console.warn("Could not record property view:", error);
    return false;
  }
}

export async function getPropertyViews(propertyDocumentId) {
  try {
    const query = `filters[$or][0][property][documentId][$eq]=${propertyDocumentId}&filters[$or][1][property][id][$eq]=${propertyDocumentId}&populate[viewer]=*`;
    const res = await fetch(`${API_URL}/property-views?${query}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    const data = await parseResponse(res);
    
    const views = data?.data || [];
    
    // Dedup by user id (unique buyers)
    const uniqueViewers = new Map();
    for (const view of views) {
      // Handle Strapi v4/v5 relation nesting
      const viewerData = view.viewer?.data || view.viewer || view.attributes?.viewer?.data || view.attributes?.viewer;
      if (viewerData) {
        const id = viewerData.id || viewerData.documentId;
        if (id && !uniqueViewers.has(id)) {
          uniqueViewers.set(id, {
            ...viewerData,
            attributes: viewerData.attributes || viewerData,
            viewDate: view.createdAt || view.attributes?.createdAt
          });
        }
      }
    }
    
    return Array.from(uniqueViewers.values());
  } catch (error) {
    console.warn("Could not fetch property views:", error);
    return [];
  }
}

// ------------------------------------------------------------------
// SAVES (WISHLISTS)
// ------------------------------------------------------------------

export async function getPropertySaves(propertyDocumentId) {
  try {
    const query = `populate[users_permissions_user]=*&populate[Wishlist][populate][properties]=*&pagination[pageSize]=1000`;
    const res = await fetch(`${API_URL}/user-profiles?${query}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    const data = await parseResponse(res);
    
    const profiles = data?.data || [];
    const savers = [];
    
    for (const profile of profiles) {
      const pData = profile.attributes || profile;
      const uData = pData.users_permissions_user?.data || pData.users_permissions_user;
      
      const wishlist = pData.Wishlist?.[0] || pData.Wishlist;
      if (!wishlist) continue;
      
      const props = wishlist?.properties?.data || wishlist?.properties;
      
      if (Array.isArray(props)) {
         const hasProp = props.some(p => {
            const pDocId = p.attributes?.documentId || p.documentId;
            const pId = p.attributes?.id || p.id;
            return String(pDocId) === String(propertyDocumentId) || String(pId) === String(propertyDocumentId);
         });
         
         if (hasProp && uData) {
            savers.push({
              ...uData,
              attributes: uData.attributes || uData,
              saveDate: pData.updatedAt || pData.createdAt
            });
         }
      }
    }
    
    return savers;
  } catch (error) {
    console.warn("Could not fetch property saves:", error);
    return [];
  }
}

// ------------------------------------------------------------------
// ENQUIRIES
// ------------------------------------------------------------------

export async function getPropertyEnquiries(propertyDocumentId) {
  try {
    const query = `filters[$or][0][property][documentId][$eq]=${propertyDocumentId}&filters[$or][1][property][id][$eq]=${propertyDocumentId}&populate[users_permissions_user]=*&sort=createdAt:desc`;
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
