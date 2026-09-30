// import { fetchAPI } from "@/utils/fetchAPI";

// export async function getHeroSection() {
//   try {
//     const response = await fetchAPI(
//       "/user-site-setting?populate[heroSection][populate]=*&populate[searchSection][populate]=*&populate[searchTabs]=*&populate[popularSearches][populate]=icon",
//     );

//     return response;
//   } catch (error) {
//     console.error("Hero Section Error:", error);
//     return null;
//   }
// }
const STRAPI_BASE_URL =
    process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || `${STRAPI_BASE_URL}/api`;

// =====================================================
// GET LOGIN TOKEN
// =====================================================

function getAuthToken() {
    if (typeof window === "undefined") {
        return null;
    }

    return (
        localStorage.getItem("token") ||
        localStorage.getItem("jwt") ||
        localStorage.getItem("strapi_jwt")
    );
}

// =====================================================
// AUTH HEADERS
// =====================================================

function getAuthHeaders() {
    const token = getAuthToken();

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`,
    };
}

// =====================================================
// PARSE RESPONSE
// =====================================================

async function parseResponse(response) {
    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            result ? .error ? .message ||
            result ? .message ||
            `Request failed with status ${response.status}`,
        );
    }

    return result;
}

// =====================================================
// GET LOGGED-IN USER
// =====================================================

export async function getLoggedInUser() {
    const token = getAuthToken();

    if (!token) {
        throw new Error("Please login first.");
    }

    const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
        cache: "no-store",
    });

    return await parseResponse(response);
}

// =====================================================
// GET PROPERTY
// =====================================================

export async function getPropertyForEnquiry(documentId) {
    if (!documentId) {
        throw new Error("Property ID is required.");
    }

    const query =
        `filters[documentId][$eq]=${encodeURIComponent(documentId)}` +
        `&populate[Owner]=*`;

    const response = await fetch(`${API_URL}/properties?${query}`, {
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
        cache: "no-store",
    });

    const result = await parseResponse(response);

    if (!result ? .data ? .length) {
        throw new Error("Property not found.");
    }

    return result.data[0];
}

// =====================================================
// SEND ENQUIRY
// =====================================================

export async function sendEnquiry({
    propertyDocumentId,
    name,
    phone,
    email,
    message,
}) {
    if (!propertyDocumentId) {
        throw new Error("Property ID is required.");
    }

    // Get logged-in user
    const user = await getLoggedInUser();

    if (!user ? .id) {
        throw new Error("Logged-in user not found.");
    }

    // Get property + owner
    const property = await getPropertyForEnquiry(propertyDocumentId);

    if (!property ? .id) {
        throw new Error("Property not found.");
    }

    if (!property ? .Owner ? .id) {
        throw new Error("This property does not have an owner.");
    }

    // Create enquiry
    const response = await fetch(`${API_URL}/enquiries`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },

        body: JSON.stringify({
            data: {
                Name: name || user.username || "",
                Phone: phone || "",
                Email: email || user.email || "",
                Message: message || "I am interested in this property.",

                Statuss: "Pending",

                property: property.id,

                users_permissions_user: user.id,
            },
        }),
    });

    const result = await parseResponse(response);

    return result;
}