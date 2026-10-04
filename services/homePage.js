// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getHomePage() {
//   const url =
//     `${STRAPI_URL}/home-page` +
//     `?populate[Header][populate][Logo]=true` +
//     `&populate[Header][populate][HeaderActions]=true` +
//     `&populate[Header][populate][MenuItems][populate][DropdownItems]=true`;

//   const response = await fetch(url, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch HomePage: ${response.status}`
//     );
//   }

//   const result = await response.json();

//   return result.data;
// }

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getHomePage() {
//   const url =
//     `${STRAPI_URL}/home-page` +

//     // =========================
//     // HEADER
//     // =========================
//     `?populate[Header][populate][Logo]=true` +
//     `&populate[Header][populate][HeaderActions]=true` +
//     `&populate[Header][populate][MenuItems][populate][DropdownItems]=true` +

//     // =========================
//     // HERO
//     // =========================
//     `&populate[Hero][populate][BackgroundImage]=true` +
//     `&populate[Hero][populate][MobileBackground]=true` +

//     // =========================
//     // HERO → SEARCH
//     // =========================
//     `&populate[Hero][populate][Search]=true`;

//   const response = await fetch(url, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch HomePage: ${response.status}`
//     );
//   }

//   const result = await response.json();

//   return result.data;
// }


// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getHomePage() {
//   const url =
//     `${STRAPI_URL}/home-page` +

//     // =========================
//     // HEADER
//     // =========================
//     `?populate[Header][populate][Logo]=true` +
//     `&populate[Header][populate][HeaderActions]=true` +
//     `&populate[Header][populate][MenuItems][populate][DropdownItems]=true` +

//     // =========================
//     // HERO
//     // =========================
//     `&populate[Hero][populate][BackgroundImage]=true` +
//     `&populate[Hero][populate][MobileBackground]=true` +

//     // =========================
//     // HERO → SEARCH
//     // =========================
//     `&populate[Hero][populate][Search]=true` +

//     // =========================
//     // POPULAR LOCATIONS
//     // =========================
//     `&populate[PopularLocations][populate][PopularLocationItem][populate][Image]=true`;

//   const response = await fetch(url, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch HomePage: ${response.status}`
//     );
//   }

//   const result = await response.json();

//   return result?.data || null;
// }

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getHomePage() {
//   const url =
//     `${STRAPI_URL}/home-page` +

//     // =========================
//     // HEADER
//     // =========================
//     `?populate[Header][populate][Logo]=true` +
//     `&populate[Header][populate][HeaderActions]=true` +
//     `&populate[Header][populate][MenuItems][populate][DropdownItems]=true` +

//     // =========================
//     // HERO
//     // =========================
//     `&populate[Hero][populate][BackgroundImage]=true` +
//     `&populate[Hero][populate][MobileBackground]=true` +

//     // =========================
//     // HERO → SEARCH
//     // =========================
//     `&populate[Hero][populate][Search]=true` +

//     // =========================
//     // POPULAR LOCATIONS
//     // =========================
//     `&populate[PopularLocations][populate][PopularLocationItem][populate][Image]=true` +

//     // =========================
//     // PROPERTY CATEGORIES
//     // =========================
//     `&populate[PropertyCategories][populate][PropertyCategories]=true`;

//   const response = await fetch(url, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch HomePage: ${response.status}`
//     );
//   }

//   const result = await response.json();

//   return result?.data || null;
// }

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// export async function getHomePage() {
//   const url =
//     `${STRAPI_URL}/home-page` +

//     // =========================
//     // HEADER
//     // =========================
//     `?populate[Header][populate][Logo]=true` +
//     `&populate[Header][populate][HeaderActions]=true` +
//     `&populate[Header][populate][MenuItems][populate][DropdownItems]=true` +

//     // =========================
//     // HERO
//     // =========================
//     `&populate[Hero][populate][BackgroundImage]=true` +
//     `&populate[Hero][populate][MobileBackground]=true` +

//     // =========================
//     // HERO → SEARCH
//     // =========================
//     `&populate[Hero][populate][Search]=true` +

//     // =========================
//     // POPULAR LOCATIONS
//     // =========================
//     `&populate[PopularLocations][populate][PopularLocationItem][populate][Image]=true` +

//     // =========================
//     // PROPERTY CATEGORIES
//     // =========================
//     `&populate[PropertyCategories][populate][PropertyCategories]=true` +

//     // =========================
//     // FEATURED PROPERTIES
//     // =========================
//     `&populate[Property][populate][CoverImage]=true` +
//     `&populate[Property][populate][PropertyImage]=true` +
//     `&populate[Property][populate][PropertyCommonDetails]=true` +
//     `&populate[Property][populate][ResidentialDetails]=true` +
//     `&populate[Property][populate][CommercialDetails]=true` +
//     `&populate[Property][populate][IndustrialDetails]=true` +
//     `&populate[Property][populate][PropertyOverview]=true` +
//     `&populate[Property][populate][PropertyFeatures]=true`;

//   const response = await fetch(url, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch HomePage: ${response.status}`
//     );
//   }

//   const result = await response.json();

//   return result?.data || null;
// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL ||
//   "http://localhost:1337/api";

// export async function getHomePage() {
//   const url =
//     `${STRAPI_URL}/home-page` +

//     // =========================
//     // HEADER
//     // =========================
//     `?populate[Header][populate][Logo]=true` +
//     `&populate[Header][populate][HeaderActions]=true` +
//     `&populate[Header][populate][MenuItems][populate][DropdownItems]=true` +

//     // =========================
//     // HERO
//     // =========================
//     `&populate[Hero][populate][BackgroundImage]=true` +
//     `&populate[Hero][populate][MobileBackground]=true` +

//     // =========================
//     // HERO → SEARCH
//     // =========================
//     `&populate[Hero][populate][Search]=true` +

//     // =========================
//     // POPULAR LOCATIONS
//     // =========================
//     `&populate[PopularLocations][populate][PopularLocationItem][populate][Image]=true` +

//     // =========================
//     // PROPERTY CATEGORIES
//     // =========================
//     `&populate[PropertyCategories][populate][PropertyCategories]=true`;

//   console.log("HomePage API URL:", url);

//   const response = await fetch(url, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     const errorText = await response.text();

//     console.error(
//       "HomePage API Error:",
//       response.status,
//       errorText
//     );

//     throw new Error(
//       `Failed to fetch HomePage: ${response.status}`
//     );
//   }

//   const result = await response.json();

//   console.log("HomePage API Data:", result);

//   return result?.data || null;
// }

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL ||
//   "http://localhost:1337/api";

// export async function getHomePage() {
//   const url =
//     `${STRAPI_URL}/home-page` +

//     // =========================
//     // HEADER
//     // =========================
//     `?populate[Header][populate][Logo]=true` +
//     `&populate[Header][populate][HeaderActions]=true` +
//     `&populate[Header][populate][MenuItems][populate][DropdownItems]=true` +

//     // =========================
//     // HERO
//     // =========================
//     `&populate[Hero][populate][BackgroundImage]=true` +
//     `&populate[Hero][populate][MobileBackground]=true` +

//     // =========================
//     // HERO → SEARCH
//     // =========================
//     `&populate[Hero][populate][Search]=true` +

//     // =========================
//     // POPULAR LOCATIONS
//     // =========================
//     `&populate[PopularLocations][populate][PopularLocationItem][populate][Image]=true` +

//     // =========================
//     // PROPERTY CATEGORIES
//     // =========================
//     `&populate[PropertyCategories][populate][PropertyCategories]=true` +

//     // =========================
//     // FEATURED PROPERTIES
//     // =========================
//     `&populate[FeaturedProperties][populate][properties][populate][CoverImage]=true` +
//     `&populate[FeaturedProperties][populate][properties][populate][PropertyImage]=true` +
//     `&populate[FeaturedProperties][populate][properties][populate][PropertyCommonDetails]=true` +
//     `&populate[FeaturedProperties][populate][properties][populate][ResidentialDetails]=true` +
//     `&populate[FeaturedProperties][populate][properties][populate][CommercialDetails]=true` +
//     `&populate[FeaturedProperties][populate][properties][populate][IndustrialDetails]=true`;

//   console.log("HomePage API URL:", url);

//   const response = await fetch(url, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     const errorText = await response.text();

//     console.error(
//       "HomePage API Error:",
//       response.status,
//       errorText
//     );

//     throw new Error(
//       `Failed to fetch HomePage: ${response.status}`
//     );
//   }

//   const result = await response.json();

//   console.log("HomePage API Data:", result);

//   return result?.data || null;
// }


const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337/api";

export async function getHomePage() {
  const url =
    `${STRAPI_URL}/home-page` +

    // =========================
    // HEADER
    // =========================
    `?populate[Header][populate][Logo]=true` +
    `&populate[Header][populate][HeaderActions]=true` +
    `&populate[Header][populate][MenuItems][populate][DropdownItems]=true` +

    // =========================
    // HERO
    // =========================
    `&populate[Hero][populate][BackgroundImage]=true` +
    `&populate[Hero][populate][MobileBackground]=true` +

    // =========================
    // HERO → SEARCH
    // =========================
    `&populate[Hero][populate][Search]=true` +

    // =========================
    // POPULAR LOCATIONS
    // =========================
    `&populate[PopularLocations][populate][PopularLocationItem][populate][Image]=true` +

    // =========================
    // PROPERTY CATEGORIES
    // =========================
    `&populate[PropertyCategories][populate][PropertyCategories]=true` +

    // =========================
    // FEATURED PROPERTIES
    // =========================
    `&populate[FeaturedProperties][populate][properties][populate][CoverImage]=true` +
    `&populate[FeaturedProperties][populate][properties][populate][PropertyCommonDetails]=true` +
    `&populate[FeaturedProperties][populate][properties][populate][ResidentialDetails]=true` +
    `&populate[FeaturedProperties][populate][properties][populate][CommercialDetails]=true` +
    `&populate[FeaturedProperties][populate][properties][populate][IndustrialDetails]=true` +

    // =========================
    // ADVICE & TOOLS
    // =========================
    `&populate[AdviceTools][populate][Tools]=*` +

    // =========================
    // WHY CHOOSE HOMEHUB
    // =========================
    `&populate[WhyChooseHomeHub][populate][Benefits]=true` +

    // =========================
    // PROPERTY GUIDES
    // =========================
    `&populate[PropertyGuides]=true` +

    // =========================
    // FOOTER
    // =========================
    `&populate[Footer][populate][QuickLinks]=true` +
    `&populate[Footer][populate][PropertyLinks]=true` +
    `&populate[Footer][populate][SupportLinks]=true` +
    `&populate[Footer][populate][SocialLinks]=true`;

  console.log("HomePage API URL:", url);

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "HomePage API Error:",
      response.status,
      errorText
    );

    // 404 means the HomePage Single Type entry has not been published yet
    // (most likely because the production database was reset on Render restart).
    // Return null instead of throwing so the page renders a graceful fallback
    // rather than escalating to an HTTP 500.
    if (response.status === 404) {
      console.warn(
        "HomePage entry not found in Strapi (404). " +
        "The production database may have been reset. " +
        "Please re-publish the HomePage entry in the Strapi Admin."
      );
      return null;
    }

    throw new Error(
      `Failed to fetch HomePage: ${response.status}`
    );
  }

  const result = await response.json();

  console.log("HomePage API Data:", result);

  return result?.data || null;
}
