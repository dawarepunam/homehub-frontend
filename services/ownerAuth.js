const API_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337/api";

// =====================================================
// OWNER REGISTER
// =====================================================

export async function registerOwner(ownerData) {
    try {
        const response = await fetch(
            `${API_URL}/auth/local/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: ownerData.username,
                    email: ownerData.email,
                    password: ownerData.password,
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result ? .error ? .message ||
                "Owner registration failed."
            );
        }

        if (!result ? .user) {
            throw new Error(
                "Owner account was not created properly."
            );
        }

        return result;
    } catch (error) {
        console.error(
            "OWNER REGISTER ERROR:",
            error
        );

        throw error;
    }
}

// =====================================================
// OWNER LOGIN
// =====================================================

export async function loginOwner(ownerData) {
    try {
        const response = await fetch(
            `${API_URL}/auth/local`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identifier: ownerData.identifier,
                    password: ownerData.password,
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result ? .error ? .message ||
                "Invalid Owner email or password."
            );
        }

        if (!result ? .jwt || !result ? .user) {
            throw new Error(
                "Invalid login response from Strapi."
            );
        }

        console.log("================================");
        console.log("OWNER LOGIN SUCCESS");
        console.log("OWNER:", result.user);
        console.log("EMAIL:", result.user.email);
        console.log("JWT RECEIVED:", !!result.jwt);
        console.log("================================");

        return result;
    } catch (error) {
        console.error(
            "OWNER LOGIN ERROR:",
            error
        );

        throw error;
    }
}