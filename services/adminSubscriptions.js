// =====================================================
// ADMIN SUBSCRIPTIONS SERVICE
// =====================================================

const STRAPI_BASE_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337").replace(/\/+$/, "").replace(/\/api$/, "");
const API_URL = `${STRAPI_BASE_URL}/api`;

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || localStorage.getItem("jwt") || localStorage.getItem("strapi_jwt");
}

function getAuthHeaders() {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function parseResponse(response) {
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const message = result?.error?.message || result?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return result;
}

// =====================================================
// GET ALL SUBSCRIBED USERS
// Fetches all users and filters them in memory since Strapi 5 
// users-permissions filters can be temperamental on custom fields.
// =====================================================
export async function getAllSubscribedUsers() {
  try {
    const response = await fetch(`${API_URL}/users?populate=*`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    const users = await parseResponse(response);
    if (!Array.isArray(users)) return [];

    // Only return users who actually have a subscriptionTier string
    return users.filter(user => user.subscriptionTier && typeof user.subscriptionTier === 'string' && user.subscriptionTier.trim() !== '');
  } catch (err) {
    console.error("[AdminSubscriptions] getAllSubscribedUsers error:", err);
    throw err;
  }
}

// =====================================================
// GET SINGLE SUBSCRIBED USER
// =====================================================
export async function getSubscribedUser(documentId) {
  if (!documentId) throw new Error("User documentId is required.");
  
  try {
    // We can fetch by documentId
    const query = `filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`;
    const response = await fetch(`${API_URL}/users?${query}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    const users = await parseResponse(response);
    const user = Array.isArray(users) ? users[0] : users;
    
    if (!user) throw new Error("Subscription/User not found.");
    return user;
  } catch (err) {
    console.error("[AdminSubscriptions] getSubscribedUser error:", err);
    throw err;
  }
}

// =====================================================
// GET SUBSCRIPTION CONFIG (PLANS)
// =====================================================
export async function getSubscriptionConfig() {
  try {
    const response = await fetch(`${API_URL}/pricing-config?populate=*`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    const result = await parseResponse(response);
    const data = result?.data || result;
    return data?.subscriptionPlans || [];
  } catch (err) {
    console.error("[AdminSubscriptions] getSubscriptionConfig error:", err);
    throw err;
  }
}

// =====================================================
// GET SUBSCRIPTION PAYMENTS
// =====================================================
export async function getSubscriptionPayments(userDocumentId = null) {
  try {
    let query = `filters[paymentType][$eq]=subscription&populate=*`;
    
    if (userDocumentId) {
      query += `&filters[owner][documentId][$eq]=${encodeURIComponent(userDocumentId)}`;
    }

    const response = await fetch(`${API_URL}/payments?${query}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    const result = await parseResponse(response);
    return result?.data || [];
  } catch (err) {
    console.error("[AdminSubscriptions] getSubscriptionPayments error:", err);
    throw err;
  }
}
