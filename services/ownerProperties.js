const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

const API_URL = STRAPI_BASE_URL.endsWith("/api")
  ? STRAPI_BASE_URL
  : `${STRAPI_BASE_URL}/api`;

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
      throw new Error("Please login as Owner first.");
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

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.error?.message ||
          "Unable to get logged-in Owner."
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
    const owner = await getLoggedInOwner();

    const query =
      `filters[Owner][id][$eq]=${encodeURIComponent(
        owner.id
      )}` +
      `&populate=*` +
      `&sort=createdAt:desc`;

    const response = await fetch(
      `${API_URL}/properties?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "token"
          )}`,
        },
        cache: "no-store",
      }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.error?.message ||
          "Unable to load Owner properties."
      );
    }

    return result?.data || [];
  } catch (error) {
    console.error(
      "GET OWNER PROPERTIES ERROR:",
      error
    );

    throw error;
  }
}