// // const API_URL = "http://localhost:1337/api";

// // export async function getOwnerDashboard() {
// //     try {
// //         const response = await fetch(`${API_URL}/owner-dashboard?populate=*`);

// //         if (!response.ok) {
// //             throw new Error("Failed to fetch owner dashboard");
// //         }

// //         const result = await response.json();

// //         return result.data;
// //     } catch (error) {
// //         console.log("API Error:", error);
// //         return null;
// //     }
// // }


// const API_URL =
//     process.env.NEXT_PUBLIC_STRAPI_URL ||
//     "http://localhost:1337/api";

// // =====================================================
// // GET OWNER DASHBOARD DATA
// // =====================================================

// export async function getOwnerDashboard() {
//     try {
//         const response = await fetch(
//             `${API_URL}/owner-dashboard?populate=*`, {
//                 cache: "no-store",
//             }
//         );

//         if (!response.ok) {
//             throw new Error(
//                 "Failed to fetch owner dashboard."
//             );
//         }

//         const result = await response.json();

//         return result ? .data || null;
//     } catch (error) {
//         console.error(
//             "GET OWNER DASHBOARD ERROR:",
//             error
//         );

//         return null;
//     }
// }

// // =====================================================
// // GET LOGGED-IN OWNER
// // =====================================================

// export async function getLoggedInOwner() {
//     try {
//         if (typeof window === "undefined") {
//             throw new Error(
//                 "Owner information can only be loaded in the browser."
//             );
//         }

//         const token = localStorage.getItem("token");

//         if (!token) {
//             throw new Error("Please login as Owner first.");
//         }

//         const response = await fetch(
//             `${API_URL}/users/me`, {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 cache: "no-store",
//             }
//         );

//         const result = await response.json();

//         if (!response.ok) {
//             throw new Error(
//                 result ? .error ? .message ||
//                 "Unable to get logged-in Owner."
//             );
//         }

//         if (!result ? .id) {
//             throw new Error(
//                 "Logged-in Owner ID was not found."
//             );
//         }

//         return result;
//     } catch (error) {
//         console.error(
//             "GET LOGGED-IN OWNER ERROR:",
//             error
//         );

//         throw error;
//     }
// }

// // =====================================================
// // GET ONLY LOGGED-IN OWNER PROPERTIES
// // =====================================================

// export async function getOwnerProperties() {
//     try {
//         if (typeof window === "undefined") {
//             throw new Error(
//                 "Owner properties can only be loaded in the browser."
//             );
//         }

//         const token = localStorage.getItem("token");

//         if (!token) {
//             throw new Error("Please login as Owner first.");
//         }

//         // -------------------------------------------------
//         // 1. GET CURRENT OWNER
//         // -------------------------------------------------

//         const ownerResponse = await fetch(
//             `${API_URL}/users/me`, {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 cache: "no-store",
//             }
//         );

//         const owner = await ownerResponse.json();

//         if (!ownerResponse.ok) {
//             throw new Error(
//                 owner ? .error ? .message ||
//                 "Unable to get current Owner."
//             );
//         }

//         if (!owner ? .id) {
//             throw new Error(
//                 "Current Owner ID was not found."
//             );
//         }

//         // -------------------------------------------------
//         // 2. FILTER PROPERTIES BY OWNER
//         // -------------------------------------------------

//         const query =
//             `filters[Owner][id][$eq]=${owner.id}` +
//             `&populate=*` +
//             `&sort=createdAt:desc`;

//         const propertyResponse = await fetch(
//             `${API_URL}/properties?${query}`, {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 cache: "no-store",
//             }
//         );

//         const propertyResult =
//             await propertyResponse.json();

//         if (!propertyResponse.ok) {
//             throw new Error(
//                 propertyResult ? .error ? .message ||
//                 "Unable to load Owner properties."
//             );
//         }

//         return {
//             owner,
//             properties: propertyResult ? .data || [],
//         };
//     } catch (error) {
//         console.error(
//             "GET OWNER PROPERTIES ERROR:",
//             error
//         );

//         throw error;
//     }
// }


// const STRAPI_BASE_URL =
//     process.env.NEXT_PUBLIC_STRAPI_URL ||
//     "http://localhost:1337/api";

// // =====================================================
// // STRAPI API URL
// // =====================================================

// const API_URL = STRAPI_BASE_URL.endsWith("/api")
//     ? STRAPI_BASE_URL
//     : `${STRAPI_BASE_URL}/api`;

// // =====================================================
// // GET OWNER DASHBOARD DATA
// // =====================================================

// export async function getOwnerDashboard() {
//     try {
//         const query = new URLSearchParams({
//             "populate[header][populate][Logo]": "true",
//             "populate[header][populate][OwnerNavItem][populate][OwnerDropdownItem]": "*",
//             "populate[welcome]": "*",
//             "populate[stats]": "*",
//             "populate[quickActions][populate][OwnerQuickAction]": "*",
//             "populate[propertyOverview]": "*",
//             "populate[propertyStats]": "*",
//             "populate[recentActivity]": "*",
//             "populate[Footer][populate][QuickLinks]": "*",
//             "populate[Footer][populate][PropertyLinks]": "*",
//             "populate[Footer][populate][SupportLinks]": "*",
//             "populate[Footer][populate][SocialLinks]": "*",
//         });

//         const response = await fetch(
//             `${API_URL}/owner-dashboard?${query.toString()}`,
//             {
//                 method: "GET",
//                 cache: "no-store",
//             }
//         );

//         const result = await response
//             .json()
//             .catch(() => null);

//         if (!response.ok) {
//             throw new Error(
//                 result?.error?.message ||
//                     "Failed to fetch owner dashboard."
//             );
//         }

//         return result?.data || null;
//     } catch (error) {
//         console.error(
//             "GET OWNER DASHBOARD ERROR:",
//             error
//         );

//         return null;
//     }
// }

// // =====================================================
// // GET LOGGED-IN OWNER
// // =====================================================

// export async function getLoggedInOwner() {
//     try {
//         if (typeof window === "undefined") {
//             throw new Error(
//                 "Owner information can only be loaded in the browser."
//             );
//         }

//         const token = localStorage.getItem("token");

//         if (!token) {
//             throw new Error(
//                 "Please login as Owner first."
//             );
//         }

//         const response = await fetch(
//             `${API_URL}/users/me`,
//             {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 cache: "no-store",
//             }
//         );

//         const result = await response
//             .json()
//             .catch(() => null);

//         if (!response.ok) {
//             throw new Error(
//                 result?.error?.message ||
//                     "Unable to get logged-in Owner."
//             );
//         }

//         if (!result?.id) {
//             throw new Error(
//                 "Logged-in Owner ID was not found."
//             );
//         }

//         return result;
//     } catch (error) {
//         console.error(
//             "GET LOGGED-IN OWNER ERROR:",
//             error
//         );

//         throw error;
//     }
// }

// // =====================================================
// // GET ONLY LOGGED-IN OWNER PROPERTIES
// // =====================================================

// export async function getOwnerProperties() {
//     try {
//         if (typeof window === "undefined") {
//             throw new Error(
//                 "Owner properties can only be loaded in the browser."
//             );
//         }

//         const token = localStorage.getItem("token");

//         if (!token) {
//             throw new Error(
//                 "Please login as Owner first."
//             );
//         }

//         // =================================================
//         // 1. GET CURRENT LOGGED-IN OWNER
//         // =================================================

//         const ownerResponse = await fetch(
//             `${API_URL}/users/me`,
//             {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 cache: "no-store",
//             }
//         );

//         const owner = await ownerResponse
//             .json()
//             .catch(() => null);

//         if (!ownerResponse.ok) {
//             throw new Error(
//                 owner?.error?.message ||
//                     "Unable to get current Owner."
//             );
//         }

//         if (!owner?.id) {
//             throw new Error(
//                 "Current Owner ID was not found."
//             );
//         }

//         // =================================================
//         // 2. GET ONLY THIS OWNER'S PROPERTIES
//         // =================================================

//         const query =
//             `filters[Owner][id][$eq]=${encodeURIComponent(owner.id)}` +
//             `&populate=*` +
//             `&sort=createdAt:desc`;

//         const propertyResponse = await fetch(
//             `${API_URL}/properties?${query}`,
//             {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 cache: "no-store",
//             }
//         );

//         const propertyResult =
//             await propertyResponse
//                 .json()
//                 .catch(() => null);

//         if (!propertyResponse.ok) {
//             throw new Error(
//                 propertyResult?.error?.message ||
//                     "Unable to load Owner properties."
//             );
//         }

//         return {
//             owner,
//             properties: propertyResult?.data || [],
//         };
//     } catch (error) {
//         console.error(
//             "GET OWNER PROPERTIES ERROR:",
//             error
//         );

//         throw error;
//     }
// }
const STRAPI_BASE_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337";

// =====================================================
// STRAPI API URL
// =====================================================

const API_URL = STRAPI_BASE_URL.endsWith("/api")
    ? STRAPI_BASE_URL
    : `${STRAPI_BASE_URL}/api`;

// =====================================================
// COMMON FETCH HELPER
// =====================================================

async function parseResponse(response) {
    return response.json().catch(() => null);
}

// =====================================================
// GET OWNER DASHBOARD DATA
// =====================================================

export async function getOwnerDashboard() {
    try {
        const query = new URLSearchParams({
            "populate[header][populate][Logo]": "true",

            "populate[header][populate][OwnerNavItem][populate][OwnerDropdownItem]":
                "*",

            "populate[welcome]": "*",

            "populate[stats]": "*",

            "populate[quickActions][populate][OwnerQuickAction]":
                "*",

            "populate[propertyOverview]": "*",

            "populate[propertyStats]": "*",

            "populate[recentActivity]": "*",

            // Footer
            "populate[Footer][populate][QuickLinks]": "*",
            "populate[Footer][populate][PropertyLinks]": "*",
            "populate[Footer][populate][SupportLinks]": "*",
            "populate[Footer][populate][SocialLinks]": "*",
        });

        const response = await fetch(
            `${API_URL}/owner-dashboard?${query.toString()}`,
            {
                method: "GET",
                cache: "no-store",
            }
        );

        const result = await parseResponse(response);

        if (!response.ok) {
            throw new Error(
                result?.error?.message ||
                    `Failed to fetch owner dashboard. HTTP ${response.status}`
            );
        }

        return result?.data || null;
    } catch (error) {
        console.error(
            "GET OWNER DASHBOARD ERROR:",
            error
        );

        return null;
    }
}

// =====================================================
// GET LOGGED-IN OWNER
// =====================================================

export async function getLoggedInOwner() {
    try {
        if (typeof window === "undefined") {
            throw new Error(
                "Owner information can only be loaded in the browser."
            );
        }

        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error(
                "Please login as Owner first."
            );
        }

        const response = await fetch(
            `${API_URL}/users/me`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`,
                },

                cache: "no-store",
            }
        );

        const result = await parseResponse(response);

        if (!response.ok) {
            throw new Error(
                result?.error?.message ||
                    `Unable to get logged-in Owner. HTTP ${response.status}`
            );
        }

        if (!result?.id) {
            throw new Error(
                "Logged-in Owner ID was not found."
            );
        }

        return result;
    } catch (error) {
        console.error(
            "GET LOGGED-IN OWNER ERROR:",
            error
        );

        throw error;
    }
}

// =====================================================
// GET ONLY LOGGED-IN OWNER PROPERTIES
// =====================================================

export async function getOwnerProperties() {
    try {
        if (typeof window === "undefined") {
            throw new Error(
                "Owner properties can only be loaded in the browser."
            );
        }

        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error(
                "Please login as Owner first."
            );
        }

        // =================================================
        // 1. GET CURRENT LOGGED-IN OWNER
        // =================================================

        const ownerResponse = await fetch(
            `${API_URL}/users/me`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`,
                },

                cache: "no-store",
            }
        );

        const owner = await parseResponse(
            ownerResponse
        );

        if (!ownerResponse.ok) {
            throw new Error(
                owner?.error?.message ||
                    `Unable to get current Owner. HTTP ${ownerResponse.status}`
            );
        }

        if (!owner?.id) {
            throw new Error(
                "Current Owner ID was not found."
            );
        }

        console.log(
            "LOGGED-IN OWNER:",
            owner
        );

        console.log(
            "OWNER ID:",
            owner.id
        );

        // =================================================
        // 2. BUILD OWNER PROPERTY QUERY
        // =================================================

        const params = new URLSearchParams();

        // IMPORTANT:
        // Only properties belonging to logged-in Owner
        params.set(
            "filters[Owner][id][$eq]",
            String(owner.id)
        );

        // Load all property fields + images/details
        params.set(
            "populate",
            "*"
        );

        // Latest properties first
        params.set(
            "sort",
            "createdAt:desc"
        );

        // =================================================
        // 3. GET OWNER'S PROPERTIES
        // =================================================

        const propertyResponse = await fetch(
            `${API_URL}/properties?${params.toString()}`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`,
                },

                cache: "no-store",
            }
        );

        const propertyResult =
            await parseResponse(
                propertyResponse
            );

        if (!propertyResponse.ok) {
            throw new Error(
                propertyResult?.error?.message ||
                    `Unable to load Owner properties. HTTP ${propertyResponse.status}`
            );
        }

        const properties =
            propertyResult?.data || [];

        console.log(
            "OWNER PROPERTIES:",
            properties
        );

        console.log(
            "OWNER PROPERTY COUNT:",
            properties.length
        );

        // =================================================
        // 4. EXTRA SAFETY CHECK
        // =================================================
        // API filter already restricts the data.
        // This additional check prevents another owner's
        // property from accidentally appearing in UI.

        const ownerProperties =
            properties.filter(
                (property) => {
                    const propertyOwner =
                        property?.Owner;

                    if (!propertyOwner) {
                        return false;
                    }

                    const propertyOwnerId =
                        propertyOwner?.id;

                    return (
                        String(propertyOwnerId) ===
                        String(owner.id)
                    );
                }
            );

        // =================================================
        // 5. RETURN OWNER + PROPERTIES
        // =================================================

        return {
            owner,
            properties: ownerProperties,
            total: ownerProperties.length,
        };
    } catch (error) {
        console.error(
            "GET OWNER PROPERTIES ERROR:",
            error
        );

        throw error;
    }
}

// =====================================================
// UPDATE PROPERTY STATUS (MARK AS SOLD / RENTED)
// =====================================================

export async function updatePropertyStatus(documentId, newStatus) {
    if (!documentId) {
        throw new Error("Property ID is required.");
    }

    if (!newStatus) {
        throw new Error("New status is required.");
    }

    if (typeof window === "undefined") {
        throw new Error("This action can only be performed in the browser.");
    }

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login as Owner first.");
    }

    const response = await fetch(
        `${API_URL}/properties/${documentId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                data: {
                    PropertyStatus: newStatus,
                },
            }),
            cache: "no-store",
        }
    );

    const result = await parseResponse(response);

    if (!response.ok) {
        throw new Error(
            result?.error?.message ||
                `Failed to update property status. HTTP ${response.status}`
        );
    }

    return result?.data || null;
}