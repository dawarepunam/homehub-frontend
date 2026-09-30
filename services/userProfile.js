// const STRAPI_BASE_URL =
//   process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

// const API_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL ||
//   `${STRAPI_BASE_URL.replace(/\/$/, "")}/api`;

// function getAuthToken() {
//   if (typeof window === "undefined") {
//     return null;
//   }

//   return (
//     localStorage.getItem("jwt") ||
//     localStorage.getItem("token") ||
//     localStorage.getItem("strapi_jwt")
//   );
// }

// function getAuthHeaders() {
//   const token = getAuthToken();

//   return token
//     ? {
//         Authorization: `Bearer ${token}`,
//       }
//     : {};
// }

// async function parseResponse(response) {
//   const result = await response.json().catch(() => null);

//   if (!response.ok) {
//     throw new Error(
//       result?.error?.message ||
//         result?.message ||
//         `Request failed with status ${response.status}`
//     );
//   }

//   return result;
// }

// // ==========================
// // GET USER PROFILE
// // ==========================

// export async function getUserProfile() {
//   try {
//     const populateQuery = new URLSearchParams({
//       "populate[ProfileDetails][populate]": "*",
//       "populate[Settings]": "*",
//       "populate[users_permissions_user]": "*",
//     });

//     let response = await fetch(`${API_URL}/user-profiles?${populateQuery}`, {
//       cache: "no-store",
//       headers: {
//         ...getAuthHeaders(),
//       },
//     });

//     if (!response.ok) {
//       response = await fetch(`${API_URL}/user-profiles?populate=*`, {
//         cache: "no-store",
//         headers: {
//           ...getAuthHeaders(),
//         },
//       });
//     }

//     const result = await parseResponse(response);

//     if (!result?.data?.length) {
//       return null;
//     }

//     return result.data[0];
//   } catch (error) {
//     console.error("Get User Profile Error:", error);
//     return null;
//   }
// }

// // ==========================
// // UPDATE USER PROFILE
// // ==========================

// export async function updateUserProfile(documentId, data) {
//   try {
//     if (!documentId) {
//       throw new Error("Profile document id is required");
//     }

//     const response = await fetch(`${API_URL}/user-profiles/${documentId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         ...getAuthHeaders(),
//       },
//       body: JSON.stringify({
//         data,
//       }),
//     });

//     const result = await parseResponse(response);

//     return result.data;
//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     throw error;
//   }
// }

// // ==========================
// // UPLOAD MEDIA
// // ==========================

// export async function uploadMedia(file) {
//   try {
//     if (!file) {
//       throw new Error("Media file is required");
//     }

//     const formData = new FormData();
//     formData.append("files", file);

//     const response = await fetch(`${API_URL}/upload`, {
//       method: "POST",
//       headers: {
//         ...getAuthHeaders(),
//       },
//       body: formData,
//     });

//     const result = await parseResponse(response);

//     if (!Array.isArray(result) || !result[0]) {
//       throw new Error("Media Upload Failed");
//     }

//     return result[0];
//   } catch (error) {
//     console.error("Upload Media Error:", error);
//     throw error;
//   }
// }

// // ==========================
// // DELETE MEDIA
// // ==========================

// export async function deleteMedia(id) {
//   try {
//     if (!id) {
//       return false;
//     }

//     const response = await fetch(`${API_URL}/upload/files/${id}`, {
//       method: "DELETE",
//       headers: {
//         ...getAuthHeaders(),
//       },
//     });

//     await parseResponse(response);

//     return true;
//   } catch (error) {
//     console.error("Delete Media Error:", error);
//     return false;
//   }
// }

// export { API_URL, STRAPI_BASE_URL };
export const STRAPI_BASE_URL =
    process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

const API_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    `${STRAPI_BASE_URL.replace(/\/$/, "")}/api`;

// ============================================================
// AUTH TOKEN
// ============================================================

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

// ============================================================
// AUTH HEADERS
// ============================================================

function getAuthHeaders() {
    const token = getAuthToken();

    return token ?
        {
            Authorization: `Bearer ${token}`,
        } :
        {};
}

// ============================================================
// PARSE RESPONSE
// ============================================================

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

// ============================================================
// GET CURRENT LOGGED-IN USER
// ============================================================

export async function getCurrentUser() {
    try {
        const token = getAuthToken();

        if (!token) {
            return null;
        }

        const response = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            headers: {
                ...getAuthHeaders(),
            },
            cache: "no-store",
        });

        const result = await parseResponse(response);

        return result || null;
    } catch (error) {
        console.error("Get Current User Error:", error);
        return null;
    }
}

// ============================================================
// GET USER PROFILE
// ============================================================

export async function getUserProfile() {
    try {
        const token = getAuthToken();

        if (!token) {
            return null;
        }

        const currentUser = await getCurrentUser();

        if (!currentUser ? .id) {
            return null;
        }

        const populateQuery = new URLSearchParams();

        // ----------------------------------------------------------------
        // ProfileDetails is a component with two media fields:
        // ProfileImage and CoverImage.
        //
        // In Strapi v5, populate=* on a nested component does NOT work
        // for media fields — Strapi's query whitelist rejects them.
        // We must populate media fields explicitly one by one.
        // ----------------------------------------------------------------

        // Scalar/text fields inside ProfileDetails are returned automatically
        // when we populate the component itself. We only need to explicitly
        // request media sub-fields.
        populateQuery.set("populate[ProfileDetails][populate][ProfileImage]", "true");
        populateQuery.set("populate[ProfileDetails][populate][CoverImage]", "true");

        // Settings component — scalar only, simple populate is fine
        populateQuery.set("populate[Settings]", "true");

        // PropertyPreferences component — scalar only
        populateQuery.set("populate[PropertyPreferences]", "true");

        // Wishlist component → properties relation
        // Use explicit true, NOT wildcard, to avoid whitelist errors on Property media
        populateQuery.set("populate[Wishlist][populate][properties]", "true");

        // Only current logged-in user's profile
        populateQuery.set(
            "filters[users_permissions_user][id][$eq]",
            currentUser.id,
        );

        const response = await fetch(
            `${API_URL}/user-profiles?${populateQuery.toString()}`, {
                method: "GET",
                cache: "no-store",
                headers: {
                    ...getAuthHeaders(),
                },
            },
        );

        const result = await parseResponse(response);

        if (!result ? .data ? .length) {
            return null;
        }

        return result.data[0];
    } catch (error) {
        console.error("Get User Profile Error:", error);
        return null;
    }
}

// ============================================================
// GET WISHLIST PROPERTIES
// ============================================================

export async function getWishlistProperties() {
    try {
        const profile = await getUserProfile();

        if (!profile) {
            return [];
        }

        const wishlist = Array.isArray(profile ? .Wishlist) ? profile.Wishlist : [];

        const properties = wishlist.flatMap((wishlistItem) => {
            if (Array.isArray(wishlistItem ? .properties)) {
                return wishlistItem.properties;
            }

            if (wishlistItem ? .properties) {
                return [wishlistItem.properties];
            }

            return [];
        });

        return properties;
    } catch (error) {
        console.error("Get Wishlist Properties Error:", error);
        return [];
    }
}

// ============================================================
// ADD PROPERTY TO WISHLIST
// ============================================================

export async function addPropertyToWishlist(propertyDocumentId) {
    try {
        if (!propertyDocumentId) {
            throw new Error("Property document id is required");
        }

        const profile = await getUserProfile();

        if (!profile ? .documentId) {
            throw new Error(
                "User profile not found. Please create your profile first.",
            );
        }

        const wishlist = Array.isArray(profile ? .Wishlist) ? profile.Wishlist : [];

        let wishlistItem = wishlist[0];

        // --------------------------------------------------------
        // EXISTING WISHLIST
        // --------------------------------------------------------

        if (wishlistItem ? .id) {
            const existingProperties = Array.isArray(wishlistItem ? .properties) ?
                wishlistItem.properties :
                [];

            const existingIds = existingProperties
                .map((property) => property ? .documentId)
                .filter(Boolean);

            // Already exists
            if (existingIds.includes(propertyDocumentId)) {
                return {
                    success: true,
                    alreadyExists: true,
                    profile,
                };
            }

            const updatedPropertyIds = [...existingIds, propertyDocumentId];

            const response = await fetch(
                `${API_URL}/user-profiles/${profile.documentId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeaders(),
                    },
                    body: JSON.stringify({
                        data: {
                            Wishlist: [{
                                id: wishlistItem.id,
                                properties: {
                                    set: updatedPropertyIds,
                                },
                            }, ],
                        },
                    }),
                },
            );

            const result = await parseResponse(response);

            return {
                success: true,
                alreadyExists: false,
                profile: result ? .data || null,
            };
        }

        // --------------------------------------------------------
        // NO WISHLIST COMPONENT YET
        // --------------------------------------------------------

        const response = await fetch(
            `${API_URL}/user-profiles/${profile.documentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify({
                    data: {
                        Wishlist: [{
                            properties: {
                                connect: [propertyDocumentId],
                            },
                        }, ],
                    },
                }),
            },
        );

        const result = await parseResponse(response);

        return {
            success: true,
            alreadyExists: false,
            profile: result ? .data || null,
        };
    } catch (error) {
        console.error("Add Property To Wishlist Error:", error);
        throw error;
    }
}

// ============================================================
// REMOVE PROPERTY FROM WISHLIST
// ============================================================

export async function removePropertyFromWishlist(propertyDocumentId) {
    try {
        if (!propertyDocumentId) {
            throw new Error("Property document id is required");
        }

        const profile = await getUserProfile();

        if (!profile ? .documentId) {
            throw new Error("User profile not found.");
        }

        const wishlist = Array.isArray(profile ? .Wishlist) ? profile.Wishlist : [];

        const wishlistItem = wishlist[0];

        if (!wishlistItem ? .id) {
            return {
                success: true,
                removed: false,
                profile,
            };
        }

        const existingProperties = Array.isArray(wishlistItem ? .properties) ?
            wishlistItem.properties :
            [];

        const existingIds = existingProperties
            .map((property) => property ? .documentId)
            .filter(Boolean);

        const updatedPropertyIds = existingIds.filter(
            (id) => id !== propertyDocumentId,
        );

        const response = await fetch(
            `${API_URL}/user-profiles/${profile.documentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify({
                    data: {
                        Wishlist: [{
                            id: wishlistItem.id,
                            properties: {
                                set: updatedPropertyIds,
                            },
                        }, ],
                    },
                }),
            },
        );

        const result = await parseResponse(response);

        return {
            success: true,
            removed: existingIds.length !== updatedPropertyIds.length,
            profile: result ? .data || null,
        };
    } catch (error) {
        console.error("Remove Property From Wishlist Error:", error);

        throw error;
    }
}

// ============================================================
// CHECK PROPERTY IN WISHLIST
// ============================================================

export async function isPropertyInWishlist(propertyDocumentId) {
    try {
        if (!propertyDocumentId) {
            return false;
        }

        const properties = await getWishlistProperties();

        return properties.some(
            (property) => property ? .documentId === propertyDocumentId,
        );
    } catch (error) {
        console.error("Check Wishlist Error:", error);
        return false;
    }
}

// ============================================================
// UPDATE USER PROFILE
// ============================================================

export async function updateUserProfile(documentId, data) {
    try {
        if (!documentId) {
            throw new Error("Profile document id is required");
        }

        const response = await fetch(`${API_URL}/user-profiles/${documentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify({
                data,
            }),
        });

        const result = await parseResponse(response);

        return result.data;
    } catch (error) {
        console.error("Update Profile Error:", error);
        throw error;
    }
}

// ============================================================
// UPLOAD MEDIA
// ============================================================

export async function uploadMedia(file) {
    try {
        if (!file) {
            throw new Error("Media file is required");
        }

        const token = getAuthToken();

        if (!token) {
            throw new Error("Please login before uploading media.");
        }

        const formData = new FormData();

        formData.append("files", file);

        const response = await fetch(`${API_URL}/upload`, {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
            },
            body: formData,
        });

        const result = await parseResponse(response);

        if (!Array.isArray(result) || !result[0]) {
            throw new Error("Media Upload Failed");
        }

        return result[0];
    } catch (error) {
        console.error("Upload Media Error:", error);
        throw error;
    }
}

// ============================================================
// DELETE MEDIA
// ============================================================

export async function deleteMedia(id) {
    try {
        if (!id) {
            return false;
        }

        const response = await fetch(`${API_URL}/upload/files/${id}`, {
            method: "DELETE",
            headers: {
                ...getAuthHeaders(),
            },
        });

        await parseResponse(response);

        return true;
    } catch (error) {
        console.error("Delete Media Error:", error);
        return false;
    }
}

// API_URL is used internally only. STRAPI_BASE_URL is exported above.
export { API_URL };