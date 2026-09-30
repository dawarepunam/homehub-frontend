// // // const API_URL =
// // //     process.env.NEXT_PUBLIC_STRAPI_URL ||
// // //     "http://localhost:1337/api";

// // // export async function getUserSiteSettings() {
// // //     try {
// // //         const response = await fetch(
// // //             `${API_URL}/user-site-settings?populate[UserHeader][populate]=*`, {
// // //                 cache: "no-store",
// // //             }
// // //         );

// // //         if (!response.ok) {
// // //             throw new Error("Failed to fetch user site settings");
// // //         }

// // //         const result = await response.json();

// // //         return result.data[0];
// // //     } catch (error) {
// // //         console.error(error);
// // //         return null;
// // //     }
// // // }

// // // const API_URL =
// // //     process.env.NEXT_PUBLIC_STRAPI_URL ||
// // //     "http://localhost:1337/api";

// // // export async function getUserSiteSettings() {
// // //     try {
// // //         const response = await fetch(
// // //             `${API_URL}/user-site-settings?populate[UserHeader][populate]=*&populate[UserHero][populate]=*`, {
// // //                 cache: "no-store",
// // //             }
// // //         );

// // //         if (!response.ok) {
// // //             throw new Error("Failed to fetch user site settings");
// // //         }

// // //         const result = await response.json();

// // //         return result.data[0];
// // //     } catch (error) {
// // //         console.error("User Site Settings Error:", error);
// // //         return null;
// // //     }
// // // }

// // const API_URL =
// //     process.env.NEXT_PUBLIC_STRAPI_URL ||
// //     "http://localhost:1337/api";

// // export async function getUserSiteSettings() {
// //     try {
// //         const url =
// //             `${API_URL}/user-site-settings?populate[UserHeader][populate]=*&populate[UserHero][populate]=*`;

// //         console.log("Fetching:", url);

// //         const response = await fetch(url, {
// //             cache: "no-store",
// //         });

// //         const result = await response.json();

// //         console.log("Status:", response.status);
// //         console.log(result);

// //         if (!response.ok) {
// //             throw new Error("Failed to fetch User Site Settings");
// //         }

// //         return result.data[0];
// //     } catch (error) {
// //         console.error("User Site Settings Error:", error);
// //         return null;
// //     }
// // }

// // const API_URL =
// //     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// // export async function getUserSiteSettings() {
// //     try {
// //         const url = `${API_URL}/user-site-settings?populate[UserHeader][populate]=*&populate[UserHero][populate]=*`;

// //         console.log("Fetching:", url);

// //         const response = await fetch(url, {
// //             cache: "no-store",
// //         });

// //         if (!response.ok) {
// //             throw new Error("Failed to fetch User Site Settings");
// //         }

// //         const result = await response.json();

// //         console.log("========== FULL RESPONSE ==========");
// //         console.log(result);

// //         console.log("========== MENU ==========");
// //         console.log(result.data[0].UserHeader.MenuItem);

// //         return result.data[0];
// //     } catch (error) {
// //         console.error("User Site Settings Error:", error);
// //         return null;
// //     }
// // }

// // const API_URL =
// //     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// // export async function getUserSiteSettings() {
// //     try {
// //         const response = await fetch(
// //             `${API_URL}/user-site-settings?populate=deep`, {
// //                 cache: "no-store",
// //             },
// //         );

// //         if (!response.ok) {
// //             throw new Error("Failed to fetch User Site Settings");
// //         }

// //         const result = await response.json();

// //         console.log("========== USER SITE SETTINGS ==========");
// //         console.log(result);

// //         return result.data[0];
// //     } catch (error) {
// //         console.error("User Site Settings Error:", error);
// //         return null;
// //     }
// // }

// // const API_URL =
// //     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// // export async function getUserSiteSettings() {
// //     try {
// //         const url =
// //             `${API_URL}/user-site-settings` +
// //             `?populate[UserHeader][populate][Logo]=*` +
// //             `&populate[UserHeader][populate][MenuItem][populate][DropdownItem]=*` +
// //             `&populate[UserHeader][populate][ProfileMenu]=*` +
// //             `&populate[UserHero][populate]=*`;

// //         console.log(url);

// //         const response = await fetch(url, {
// //             cache: "no-store",
// //         });

// //         const result = await response.json();

// //         console.log(result);

// //         if (!response.ok) {
// //             throw new Error("Failed to fetch User Site Settings");
// //         }

// //         return result.data[0];
// //     } catch (error) {
// //         console.error(error);
// //         return null;
// //     }
// // }
// // const API_URL =
// //     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// // export async function getUserSiteSettings() {
// //     try {
// //         const response = await fetch(
// //             `${API_URL}/user-site-settings?populate[UserHeader][populate]=*&populate[UserHero][populate]=*`, {
// //                 cache: "no-store",
// //             },
// //         );

// //         const result = await response.json();

// //         console.log("========== USER SITE SETTINGS ==========");
// //         console.log(JSON.stringify(result, null, 2));

// //         if (!response.ok) {
// //             throw new Error("Failed to fetch User Site Settings");
// //         }

// //         return result.data[0];
// //     } catch (error) {
// //         console.error("User Site Settings Error:", error);
// //         return null;
// //     }
// // }

// const API_URL =
//     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getUserSiteSettings() {
//     try {
//         const response = await fetch(
//             `${API_URL}/user-site-settings?populate[UserHeader][populate][Logo]=*&populate[UserHeader][populate][MenuItem][populate][DropdownItem]=*&populate[UserHeader][populate][ProfileMenu]=*&populate[UserHero][populate]=*`, {
//                 cache: "no-store",
//             },
//         );

//         const result = await response.json();

//         console.log("========== USER SITE SETTINGS ==========");
//         console.log(result);

//         if (!response.ok) {
//             throw new Error("Failed to fetch User Site Settings");
//         }

//         return result.data[0];
//     } catch (error) {
//         console.error(error);
//         return null;
//     }
// }

// const API_URL =
//     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getUserSiteSettings() {
//     try {
//         const query =
//             "?populate[UserHeader][populate][Logo]=true" +
//             "&populate[UserHeader][populate][MenuItem][populate][DropdownItem]=true" +
//             "&populate[UserHeader][populate][ProfileMenu]=true" +
//             "&populate[UserHero][populate]=*";

//         const response = await fetch(`${API_URL}/user-site-settings${query}`, {
//             cache: "no-store",
//         });
//         cache: "no-store",
//     });

// if (!response.ok) {
//     throw new Error(`HTTP Error: ${response.status}`);
// }

// const result = await response.json();

// console.log("===== USER SITE SETTINGS =====");
// console.log(result);

// return result.data[0];
// }
// catch (error) {
//     console.error("User Site Settings Error:", error);
//     return null;
// }
// }

// const API_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getUserSiteSettings() {
//   try {
//     const query =
//       "?populate[UserHeader][populate][Logo]=true" +
//       "&populate[UserHeader][populate][MenuItem][populate][DropdownItem]=true" +
//       "&populate[UserHeader][populate][ProfileMenu]=true" +
//       "&populate[UserHero][populate]=*";

//     const response = await fetch(`${API_URL}/user-site-settings${query}`, {
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//     }

//     const result = await response.json();

//     console.log("===== USER SITE SETTINGS =====");
//     console.log(result);

//     return result.data[0];
//   } catch (error) {
//     console.error("User Site Settings Error:", error);
//     return null;
//   }
// }
// const API_URL =
//     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getUserSiteSettings() {
//   try {
//     const query =
//       "?populate[UserHeader][populate][Logo]=true" +
//       "&populate[UserHeader][populate][MenuItem][populate][DropdownItem]=true" +
//       "&populate[UserHeader][populate][ProfileMenu]=true" +
//       "&populate[HeroSection][populate]=*" +
//       "&populate[SearchSection][populate]=*" +
//       "&populate[SearchTabs][populate]=*" +
//       "&populate[PopularSearches][populate]=*" +
//       "&populate[SearchSection][populate][PropertyCategory]=*" +
//       "&populate[SearchSection][populate][PropertyTypes][populate][Category]=*" +
//       "&populate[SearchSection][populate][Locations]=*";
//     console.log(
//       "USER SETTINGS API URL:",
//       `${API_URL}/user-site-settings${query}`,
//     );
//     const response = await fetch(`${API_URL}/user-site-settings${query}`, {
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//     }

//     const result = await response.json();

//     return result.data[0];
//   } catch (error) {
//     console.error("User Site Settings Error:", error);
//     return null;
//   }
// }
// const API_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";
// export async function getUserSiteSettings() {
//   try {
//     const response = await fetch(`${API_URL}/user-site-settings?populate=*`, {
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//     }

//     const result = await response.json();

//     console.log("========== USER SITE SETTINGS ==========");
//     console.log(result);

//     return result.data[0];
//   } catch (error) {
//     console.error("User Site Settings Error:", error);
//     return null;
//   }
// }
// const API_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getUserSiteSettings() {
//   try {
//     const response = await fetch(`${API_URL}/user-site-settings?populate=*`, {
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//     }

//     const result = await response.json();

//     console.log("========== USER SITE SETTINGS ==========");
//     console.log(result);

//     if (!result.data || result.data.length === 0) {
//       return null;
//     }

//     return result.data[0];
//   } catch (error) {
//     console.error("User Site Settings Error:", error);
//     return null;
// //   }
// // // }
// const API_URL =
//     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getUserSiteSettings() {
//     try {
//         const response = await fetch(
//             `${API_URL}/user-site-settings?populate[UserHeader][populate]=*&populate[HeroSection][populate]=*&populate[SearchSection][populate]=*&populate[SearchTabs][populate]=*&populate[PopularSearches][populate]=*&populate[Footer][populate]=*`, {
//                 cache: "no-store",
//             },
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP Error: ${response.status}`);
//         }

//         const result = await response.json();

//         console.log("========== USER SITE SETTINGS ==========");
//         console.log(JSON.stringify(result, null, 2));

//         if (!result.data || result.data.length === 0) {
//             return null;
//         }

//         return result.data[0];
//     } catch (error) {
//         console.error("User Site Settings Error:", error);
//         return null;
//     }
// }
// const API_URL =
//     process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getUserSiteSettings() {
//     try {
//         const url =
//             `${API_URL}/user-site-settings` +
//             `?populate[UserHeader][populate][Logo]=true` +
//             `&populate[UserHeader][populate][MenuItem][populate][DropdownItem]=true` +
//             `&populate[UserHeader][populate][ProfileMenu]=true` +
//             `&populate[HeroSection]=true` +
//             `&populate[SearchSection]=true` +
//             `&populate[SearchTabs]=true` +
//             `&populate[PopularSearches]=true` +
//             `&populate[Footer]=true`;

//         console.log("FETCH URL:", url);

//         const response = await fetch(url, {
//             cache: "no-store",
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP Error ${response.status}`);
//         }

//         const result = await response.json();

//         console.log("SITE SETTINGS:", result);

//         if (!result.data || result.data.length === 0) {
//             return null;
//         }

//         return result.data[0];
//     } catch (error) {
//         console.error("User Site Settings Error:", error);
//         return null;
//     }
// }

const API_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

export async function getUserSiteSettings() {
    try {
        // Deep populate is required so that nested relations are included:
        //   UserHeader → Logo, MenuItem → DropdownItem, ProfileMenu
        //   HeroSection → backgroundImage
        //   SearchSection, SearchTabs, PopularSearches (flat — shallow is fine)
        const url =
            `${API_URL}/user-site-settings` +
            `?populate[UserHeader][populate][Logo]=true` +
            `&populate[UserHeader][populate][MenuItem][populate][DropdownItem]=true` +
            `&populate[UserHeader][populate][ProfileMenu]=true` +
            `&populate[HeroSection][populate][backgroundImage]=true` +
            `&populate[SearchSection][populate]=*` +
            `&populate[SearchTabs][populate]=*` +
            `&populate[PopularSearches][populate]=*` +
            `&populate[Footer][populate]=*`;

        const response = await fetch(url, {
            cache: "no-store",
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error(
                "User Site Settings API Error:",
                response.status,
                errBody
            );
            throw new Error(`HTTP Error ${response.status}`);
        }

        const result = await response.json();

        if (!result?.data) {
            console.warn("User Site Settings: no data returned.");
            return null;
        }

        // Strapi Single Type returns an object; Collection Type returns an array
        if (Array.isArray(result.data)) {
            return result.data[0] ?? null;
        }
        return result.data;

    } catch (error) {
        console.error("User Site Settings Error:", error);
        return null;
    }
}