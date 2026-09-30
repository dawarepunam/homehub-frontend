import { getLoggedInOwner } from "../../../../services/ownerProperties";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

const API_URL = STRAPI_BASE_URL.endsWith("/api") ? STRAPI_BASE_URL : `${STRAPI_BASE_URL}/api`;

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Pricing Config (Plans)
export async function getPricingConfig() {
  try {
    const response = await fetch(`${API_URL}/pricing-config?populate=*`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    
    if (!response.ok) throw new Error("Failed to fetch pricing config");
    
    const result = await response.json();
    return result?.data || null;
  } catch (error) {
    console.error("GET PRICING CONFIG ERROR:", error);
    throw error;
  }
}

// Fetch single property by ID
export async function getPropertyById(propertyId) {
  try {
    const owner = await getLoggedInOwner();
    
    const query = `filters[Owner][id][$eq]=${encodeURIComponent(owner.id)}&populate=*`;
    
    const response = await fetch(`${API_URL}/properties/${propertyId}?${query}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    
    const result = await response.json().catch(() => null);
    
    if (!response.ok) {
      throw new Error(result?.error?.message || "Unable to load property details.");
    }
    
    return result?.data || null;
  } catch (error) {
    console.error("GET PROPERTY ERROR:", error);
    throw error;
  }
}

// Fetch owner details including credits
export async function getOwnerDetails() {
  try {
    const owner = await getLoggedInOwner();
    const response = await fetch(`${API_URL}/users/${owner.id}?populate=*`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    
    if (!response.ok) throw new Error("Failed to fetch owner details");
    
    return await response.json();
  } catch (error) {
    console.error("GET OWNER DETAILS ERROR:", error);
    throw error;
  }
}

// Fetch a promotion by ID
export async function getPromotionDetails(promotionId) {
  try {
    const response = await fetch(`${API_URL}/promotions/${promotionId}?populate=*`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    
    if (!response.ok) throw new Error("Failed to fetch promotion");
    const result = await response.json();
    return result?.data || null;
  } catch (error) {
    console.error("GET PROMOTION ERROR:", error);
    throw error;
  }
}

// Fetch a payment by ID
export async function getPaymentDetails(paymentId) {
  try {
    const response = await fetch(`${API_URL}/payments/${paymentId}?populate=*`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    
    if (!response.ok) throw new Error("Failed to fetch payment");
    const result = await response.json();
    return result?.data || null;
  } catch (error) {
    console.error("GET PAYMENT ERROR:", error);
    throw error;
  }
}

// Fetch subscription plans from PricingConfig
export async function getSubscriptionPlans() {
  try {
    const response = await fetch(`${API_URL}/pricing-config?populate=*`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch pricing config");
    const result = await response.json();
    const config = result?.data;

    if (!config || !Array.isArray(config.subscriptionPlans)) return [];

    return config.subscriptionPlans
      .filter((plan) => plan.isActive !== false)
      .map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        interval: plan.billingCycle || "monthly",
        boostCredits: plan.boostCredits || 0,
        featuredCredits: plan.featuredCredits || 0,
        highlightCredits: plan.highlightCredits || 0,
        benefits: plan.benefits || "",
        isPopular: plan.isPopular || false,
        advancedAnalytics: plan.advancedAnalytics || false,
        priorityVisibility: plan.priorityVisibility || false,
        smartRecommendations: plan.smartRecommendations || false,
        maxActivePromotions: plan.maxActivePromotions || 5,
      }));
  } catch (error) {
    console.error("GET SUBSCRIPTION PLANS ERROR:", error);
    return [];
  }
}

// Fetch active promotions count for the owner
export async function getActivePromotionsCount() {
  try {
    const owner = await getLoggedInOwner();
    const query = `filters[owner][id][$eq]=${owner.id}&filters[status][$eq]=active`;
    const response = await fetch(`${API_URL}/promotions?${query}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    
    if (!response.ok) return 0;
    
    const result = await response.json();
    return result?.meta?.pagination?.total || 0;
  } catch (error) {
    console.error("GET ACTIVE PROMOTIONS COUNT ERROR:", error);
    return 0;
  }
}
