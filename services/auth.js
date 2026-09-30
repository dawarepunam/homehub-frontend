// // const API_URL =
// //     process.env.NEXT_PUBLIC_STRAPI_URL ||
// //     "http://localhost:1337/api";

// // // ==========================
// // // REGISTER USER
// // // ==========================

// // export async function registerUser(userData) {
// //     try {
// //         const response = await fetch(`${API_URL}/auth/local/register`, {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({
// //                 username: userData.username,
// //                 email: userData.email,
// //                 password: userData.password,
// //             }),
// //         });

// //         const result = await response.json();

// //         if (!response.ok) {
// //             throw new Error(
// //                 result.error && result.error.message ?
// //                 result.error.message :
// //                 "Registration Failed"
// //             );
// //         }

// //         return result;
// //     } catch (error) {
// //         console.error("Register Error:", error);
// //         throw error;
// //     }
// // }

// // // ==========================
// // // LOGIN USER
// // // ==========================

// // export async function loginUser(userData) {
// //     try {
// //         const response = await fetch(`${API_URL}/auth/local`, {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({
// //                 identifier: userData.identifier,
// //                 password: userData.password,
// //             }),
// //         });

// //         const result = await response.json();

// //         if (!response.ok) {
// //             throw new Error(
// //                 result.error && result.error.message ?
// //                 result.error.message :
// //                 "Login Failed"
// //             );
// //         }

// //         return result;
// //     } catch (error) {
// //         console.error("Login Error:", error);
// //         throw error;
// //     }
// // }

// // const API_URL =
// //     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// // // =====================================================
// // // REGISTER USER
// // // =====================================================

// // export async function registerUser(userData) {
// //     try {
// //         const response = await fetch(`${API_URL}/auth/local/register`, {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({
// //                 username: userData.username,
// //                 email: userData.email,
// //                 password: userData.password,
// //             }),
// //         });

// //         const result = await response.json();

// //         if (!response.ok) {
// //             throw new Error(result ? .error ? .message || "Registration failed");
// //         }

// //         return result;
// //     } catch (error) {
// //         console.error("Register Error:", error);
// //         throw error;
// //     }
// // }

// // // =====================================================
// // // LOGIN USER
// // // =====================================================

// // export async function loginUser(userData) {
// //     try {
// //         const response = await fetch(`${API_URL}/auth/local`, {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({
// //                 identifier: userData.identifier,
// //                 password: userData.password,
// //             }),
// //         });

// //         const result = await response.json();

// //         if (!response.ok) {
// //             throw new Error(result ? .error ? .message || "Login failed");
// //         }

// //         console.log("================================");
// //         console.log("LOGIN SUCCESS");
// //         console.log("User:", result ? .user);
// //         console.log("Email:", result ? .user ? .email);
// //         console.log("================================");

// //         return result;
// //     } catch (error) {
// //         console.error("Login Error:", error);
// //         throw error;
// //     }
// // // }
// // const API_URL =
// //     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// // // =====================================================
// // // REGISTER USER
// // // =====================================================

// // export async function registerUser(userData) {
// //     try {
// //         const response = await fetch(`${API_URL}/auth/local/register`, {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({
// //                 username: userData.username,
// //                 email: userData.email,
// //                 password: userData.password,
// //             }),
// //         });

// //         const result = await response.json();

// //         if (!response.ok) {
// //             throw new Error(result ? .error ? .message || "Registration failed");
// //         }

// //         return result;
// //     } catch (error) {
// //         console.error("Register Error:", error);
// //         throw error;
// //     }
// // }

// // // =====================================================
// // // LOGIN USER
// // // =====================================================

// // export async function loginUser(userData) {
// //     try {
// //         // -------------------------------------------------
// //         // 1. LOGIN TO STRAPI
// //         // -------------------------------------------------

// //         const response = await fetch(`${API_URL}/auth/local`, {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({
// //                 identifier: userData.identifier,
// //                 password: userData.password,
// //             }),
// //         });

// //         const result = await response.json();

// //         // -------------------------------------------------
// //         // 2. LOGIN FAILED
// //         // -------------------------------------------------

// //         if (!response.ok) {
// //             throw new Error(result ? .error ? .message || "Login failed");
// //         }

// //         // -------------------------------------------------
// //         // 3. LOGIN SUCCESS
// //         // -------------------------------------------------

// //         console.log("================================");
// //         console.log("LOGIN SUCCESS");
// //         console.log("User:", result ? .user);
// //         console.log("Email:", result ? .user ? .email);
// //         console.log("================================");

// //         // -------------------------------------------------
// //         // 4. SEND LOGIN EMAIL TO CURRENT USER
// //         // -------------------------------------------------

// //         try {
// //             const emailResponse = await fetch(`${API_URL}/email-test/send`, {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                 },
// //                 body: JSON.stringify({
// //                     to: result ? .user ? .email,
// //                 }),
// //             });

// //             const emailResult = await emailResponse.json();

// //             console.log("================================");
// //             console.log("LOGIN EMAIL RESULT");
// //             console.log(emailResult);
// //             console.log("================================");

// //             if (!emailResponse.ok) {
// //                 console.error("Login email could not be sent:", emailResult);
// //             }
// //         } catch (emailError) {
// //             console.error("Login email error:", emailError);
// //         }

// //         // -------------------------------------------------
// //         // 5. RETURN LOGIN RESULT
// //         // -------------------------------------------------

// //         return result;
// //     } catch (error) {
// //         console.error("Login Error:", error);
// //         throw error;
// //     }
// // }
// const API_URL =
//     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// // =====================================================
// // REGISTER USER
// // =====================================================

// export async function registerUser(userData) {
//     try {
//         const response = await fetch(`${API_URL}/auth/local/register`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 username: userData.username,
//                 email: userData.email,
//                 password: userData.password,
//             }),
//         });

//         const result = await response.json();

//         if (!response.ok) {
//             throw new Error(
//                 result ? .error ? .message || "Registration failed"
//             );
//         }

//         console.log("================================");
//         console.log("REGISTER SUCCESS");
//         console.log("User:", result ? .user);
//         console.log("Email:", result ? .user ? .email);
//         console.log("================================");

//         return result;
//     } catch (error) {
//         console.error("Register Error:", error);
//         throw error;
//     }
// }

// // =====================================================
// // LOGIN USER
// // =====================================================

// export async function loginUser(userData) {
//     try {
//         // -------------------------------------------------
//         // 1. LOGIN TO STRAPI
//         // -------------------------------------------------

//         const response = await fetch(`${API_URL}/auth/local`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 identifier: userData.identifier,
//                 password: userData.password,
//             }),
//         });

//         const result = await response.json();

//         // -------------------------------------------------
//         // 2. LOGIN FAILED
//         // -------------------------------------------------

//         if (!response.ok) {
//             throw new Error(
//                 result ? .error ? .message || "Login failed"
//             );
//         }

//         // -------------------------------------------------
//         // 3. LOGIN SUCCESS
//         // -------------------------------------------------

//         console.log("================================");
//         console.log("LOGIN SUCCESS");
//         console.log("User:", result ? .user);
//         console.log("Email:", result ? .user ? .email);
//         console.log("================================");

//         // -------------------------------------------------
//         // 4. SEND LOGIN EMAIL
//         // -------------------------------------------------

//         const userEmail = result ? .user ? .email;

//         if (userEmail) {
//             try {
//                 const emailResponse = await fetch(
//                     `${API_URL}/email-test/send`, {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json",
//                         },
//                         body: JSON.stringify({
//                             to: userEmail,
//                         }),
//                     }
//                 );

//                 const emailResult = await emailResponse.json();

//                 console.log("================================");
//                 console.log("LOGIN EMAIL RESULT");
//                 console.log(emailResult);
//                 console.log("================================");

//                 if (!emailResponse.ok) {
//                     console.error(
//                         "Login email could not be sent:",
//                         emailResult
//                     );
//                 }
//             } catch (emailError) {
//                 console.error(
//                     "Login email error:",
//                     emailError
//                 );
//             }
//         } else {
//             console.warn(
//                 "Login successful, but user email was not found."
//             );
//         }

//         // -------------------------------------------------
//         // 5. RETURN LOGIN RESULT
//         // -------------------------------------------------

//         return result;
//     } catch (error) {
//         console.error("Login Error:", error);
//         throw error;
//     }
// }
const API_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// =====================================================
// REGISTER USER
// =====================================================

export async function registerUser(userData) {
    try {
        const response = await fetch(`${API_URL}/auth/local/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                password: userData.password,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result?.error?.message || "Registration failed"
            );
        }

        return result;
    } catch (error) {
        console.error("Register Error:", error);
        throw error;
    }
}

// =====================================================
// LOGIN USER
// =====================================================

export async function loginUser(userData) {
    try {
        // =================================================
        // 1. LOGIN TO STRAPI
        // =================================================

        const response = await fetch(`${API_URL}/auth/local`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                identifier: userData.identifier,
                password: userData.password,
            }),
        });

        const result = await response.json();

        // =================================================
        // 2. LOGIN FAILED
        // =================================================

        if (!response.ok) {
            throw new Error(
                result?.error?.message || "Invalid email or password"
            );
        }

        // =================================================
        // 3. LOGIN SUCCESS
        // =================================================

        console.log("================================");
        console.log("LOGIN SUCCESS");
        console.log("User:", result?.user);
        console.log("Email:", result?.user?.email);
        console.log("JWT received:", !!result?.jwt);
        console.log("================================");

        // =================================================
        // 4. SEND LOGIN NOTIFICATION
        // =================================================

        if (result?.jwt) {
            try {
                const emailResponse = await fetch(
                    `${API_URL}/email-test/send`, {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${result.jwt}`,
                        },

                        body: JSON.stringify({}),
                    }
                );

                const emailResult = await emailResponse.json();

                console.log("================================");
                console.log("LOGIN EMAIL RESULT");
                console.log(emailResult);
                console.log("================================");

                if (!emailResponse.ok) {
                    console.error(
                        "Login email could not be sent:",
                        emailResult
                    );
                }
            } catch (emailError) {
                console.error(
                    "Login email error:",
                    emailError
                );
            }
        } else {
            console.warn(
                "JWT not received. Login email was not requested."
            );
        }

        // =================================================
        // 5. RETURN LOGIN RESULT
        // =================================================

        return result;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

// =====================================================
// FORGOT PASSWORD
// =====================================================

export async function forgotPassword(email) {
    try {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result?.error?.message || "Failed to process forgot password request."
            );
        }

        return result;
    } catch (error) {
        console.error("Forgot Password Error:", error);
        throw error;
    }
}

// =====================================================
// RESET PASSWORD
// =====================================================

export async function resetPassword(code, password, passwordConfirmation) {
    try {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code,
                password,
                passwordConfirmation,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result?.error?.message || "Failed to reset password. The link might be invalid or expired."
            );
        }

        return result;
    } catch (error) {
        console.error("Reset Password Error:", error);
        throw error;
    }
}
