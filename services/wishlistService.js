// const STRAPI_BASE_URL =
//     process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

// const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || `${STRAPI_BASE_URL}/api`;

// // =====================================================
// // GET AUTH TOKEN
// // =====================================================

// function getAuthToken() {
//     if (typeof window === "undefined") {
//         return null;
//     }

//     return (
//         localStorage.getItem("token") ||
//         localStorage.getItem("jwt") ||
//         localStorage.getItem("strapi_jwt")
//     );
// }

// // =====================================================
// // AUTH HEADERS
// // =====================================================

// function getAuthHeaders() {
//     const token = getAuthToken();

//     if (!token) {
//         return {};
//     }

//     return {
//         Authorization: `Bearer ${token}`,
//     };
// }

// // =====================================================
// // PARSE RESPONSE
// // =====================================================

// async function parseResponse(response) {
//     const result = await response.json().catch(() => null);

//     if (!response.ok) {
//         const message =
//             result ? .error ? .message ||
//             result ? .message ||
//             `Request failed with status ${response.status}`;

//         throw new Error(message);
//     }

//     return result;
// }

// // =====================================================
// // GET LOGGED-IN USER
// // =====================================================

// export async function getLoggedInUser() {
//     const token = getAuthToken();

//     if (!token) {
//         throw new Error("Please login first.");
//     }

//     const response = await fetch(`${API_URL}/users/me`, {
//         method: "GET",

//         headers: {
//             ...getAuthHeaders(),
//         },

//         cache: "no-store",
//     });

//     return await parseResponse(response);
// }

// // =====================================================
// // GET USER PROFILE + WISHLIST
// // =====================================================

// export async function getUserWishlist() {
//     const user = await getLoggedInUser();

//     if (!user ? .id) {
//         throw new Error("Logged-in user not found.");
//     }

//     const query =
//         `filters[users_permissions_user][id][$eq]=${user.id}` +
//         `&populate[Wishlist][populate][properties][populate]=*`;

//     const response = await fetch(`${API_URL}/user-profiles?${query}`, {
//         method: "GET",

//         headers: {
//             ...getAuthHeaders(),
//         },

//         cache: "no-store",
//     });

//     const result = await parseResponse(response);

//     if (!result ? .data ? .length) {
//         return null;
//     }

//     return result.data[0];
// }

// // =====================================================
// // CHECK PROPERTY IN WISHLIST
// // =====================================================

// export async function isPropertyInWishlist(propertyDocumentId) {
//     if (!propertyDocumentId) {
//         return false;
//     }

//     try {
//         const profile = await getUserWishlist();

//         if (!profile ? .Wishlist ? .length) {
//             return false;
//         }

//         const wishlist = profile.Wishlist[0];

//         const properties = wishlist ? .properties || [];

//         return properties.some(
//             (property) => property ? .documentId === propertyDocumentId,
//         );
//     } catch (error) {
//         console.error("CHECK WISHLIST ERROR:", error);

//         return false;
//     }
// }

// // =====================================================
// // ADD PROPERTY TO WISHLIST
// // =====================================================

// export async function addToWishlist(propertyDocumentId) {
//     if (!propertyDocumentId) {
//         throw new Error("Property documentId is required.");
//     }

//     const profile = await getUserWishlist();

//     if (!profile) {
//         throw new Error("User profile not found.");
//     }

//     const wishlist = profile.Wishlist ? .[0];

//     if (!wishlist ? .id) {
//         throw new Error("Wishlist not found.");
//     }

//     const properties = wishlist.properties || [];

//     const existingIds = properties
//         .map((property) => property ? .documentId)
//         .filter(Boolean);

//     if (existingIds.includes(propertyDocumentId)) {
//         return true;
//     }

//     const updatedIds = [...existingIds, propertyDocumentId];

//     const response = await fetch(
//         `${API_URL}/user-profiles/${profile.documentId}`, {
//             method: "PUT",

//             headers: {
//                 "Content-Type": "application/json",
//                 ...getAuthHeaders(),
//             },

//             body: JSON.stringify({
//                 data: {
//                     Wishlist: {
//                         id: wishlist.id,

//                         properties: {
//                             set: updatedIds,
//                         },
//                     },
//                 },
//             }),
//         },
//     );

//     await parseResponse(response);

//     return true;
// }

// // =====================================================
// // REMOVE PROPERTY FROM WISHLIST
// // =====================================================

// export async function removeFromWishlist(propertyDocumentId) {
//     if (!propertyDocumentId) {
//         throw new Error("Property documentId is required.");
//     }

//     const profile = await getUserWishlist();

//     if (!profile) {
//         throw new Error("User profile not found.");
//     }

//     const wishlist = profile.Wishlist ? .[0];

//     if (!wishlist ? .id) {
//         throw new Error("Wishlist not found.");
//     }

//     const properties = wishlist.properties || [];

//     const remainingIds = properties
//         .map((property) => property ? .documentId)
//         .filter((id) => id && id !== propertyDocumentId);

//     const response = await fetch(
//         `${API_URL}/user-profiles/${profile.documentId}`, {
//             method: "PUT",

//             headers: {
//                 "Content-Type": "application/json",
//                 ...getAuthHeaders(),
//             },

//             body: JSON.stringify({
//                 data: {
//                     Wishlist: {
//                         id: wishlist.id,

//                         properties: {
//                             set: remainingIds,
//                         },
//                     },
//                 },
//             }),
//         },
//     );

//     await parseResponse(response);

//     return true;
// }
const STRAPI_BASE_URL =
    process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

const API_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    `${STRAPI_BASE_URL.replace(/\/$/, "")}/api`;

// =====================================================
// GET AUTH TOKEN
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
        const message =
            result ? .error ? .message ||
            result ? .message ||
            `Request failed with status ${response.status}`;

        throw new Error(message);
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
// GET USER PROFILE + WISHLIST
// =====================================================

export async function getUserWishlist() {
    const user = await getLoggedInUser();

    if (!user ? .id) {
        throw new Error("Logged-in user not found.");
    }

    /*
     * IMPORTANT:
     * Wishlist is a component.
     * properties is a many-way relation to Property.
     *
     * We populate the component first,
     * then populate the properties relation.
     */

    const query =
        `filters[users_permissions_user][id][$eq]=${user.id}` +
        `&populate[Wishlist][populate][properties]=true`;

    const response = await fetch(`${API_URL}/user-profiles?${query}`, {
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
        cache: "no-store",
    });

    const result = await parseResponse(response);

    const profiles = result ? .data || [];

    if (!profiles.length) {
        throw new Error(
            "User profile not found. Please create a User Profile for this account.",
        );
    }

    return profiles[0];
}

// =====================================================
// CHECK PROPERTY IN WISHLIST
// =====================================================

export async function isPropertyInWishlist(propertyDocumentId) {
    if (!propertyDocumentId) {
        return false;
    }

    try {
        const profile = await getUserWishlist();

        const wishlist = profile ? .Wishlist;

        if (!wishlist) {
            return false;
        }

        const properties = wishlist ? .properties || [];

        return properties.some(
            (property) => String(property ? .documentId) === String(propertyDocumentId),
        );
    } catch (error) {
        console.error("CHECK WISHLIST ERROR:", error);
        return false;
    }
}

// =====================================================
// ADD PROPERTY TO WISHLIST
// =====================================================

export async function addToWishlist(propertyDocumentId) {
    if (!propertyDocumentId) {
        throw new Error("Property documentId is required.");
    }

    const profile = await getUserWishlist();

    if (!profile ? .documentId) {
        throw new Error("User profile not found.");
    }

    const wishlist = profile ? .Wishlist;

    if (!wishlist) {
        throw new Error("Wishlist not found.");
    }

    const currentProperties = wishlist ? .properties || [];

    const existingIds = currentProperties
        .map((property) => property ? .documentId)
        .filter(Boolean);

    // Already exists
    if (existingIds.some((id) => String(id) === String(propertyDocumentId))) {
        return true;
    }

    const updatedIds = [...existingIds, propertyDocumentId];

    /*
     * Wishlist is a component.
     * properties is the relation inside that component.
     */

    const response = await fetch(
        `${API_URL}/user-profiles/${profile.documentId}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },

            body: JSON.stringify({
                data: {
                    Wishlist: {
                        properties: {
                            set: updatedIds,
                        },
                    },
                },
            }),
        },
    );

    await parseResponse(response);

    return true;
}

// =====================================================
// REMOVE PROPERTY FROM WISHLIST
// =====================================================

export async function removeFromWishlist(propertyDocumentId) {
    if (!propertyDocumentId) {
        throw new Error("Property documentId is required.");
    }

    const profile = await getUserWishlist();

    if (!profile ? .documentId) {
        throw new Error("User profile not found.");
    }

    const wishlist = profile ? .Wishlist;

    if (!wishlist) {
        throw new Error("Wishlist not found.");
    }

    const currentProperties = wishlist ? .properties || [];

    const remainingIds = currentProperties
        .map((property) => property ? .documentId)
        .filter((id) => id && String(id) !== String(propertyDocumentId));

    const response = await fetch(
        `${API_URL}/user-profiles/${profile.documentId}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },

            body: JSON.stringify({
                data: {
                    Wishlist: {
                        properties: {
                            set: remainingIds,
                        },
                    },
                },
            }),
        },
    );

    await parseResponse(response);

    return true;
}