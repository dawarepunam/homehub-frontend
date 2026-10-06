// const STRAPI_URL =
//     process.env.NEXT_PUBLIC_STRAPI_URL ||
//     "http://localhost:1337";

// const API_URL =
//     `${STRAPI_URL.replace(/\/api\/?$/, "")}/api`;

// const formatFilterValue = (value = "") =>
//     value
//     .toString()
//     .trim()
//     .toLowerCase()
//     .replace(/\b\w/g, char => char.toUpperCase());

// const appendFilter = (
//     params,
//     field,
//     operator,
//     value
// ) => {
//     if (!value) return;

//     params.append(
//         `filters[${field}][${operator}]`,
//         value
//     );
// };



// // ========================================
// // GET ALL PROPERTIES
// // ========================================
// export async function getProperties() {

//     try {

//         const response = await fetch(
//             `${API_URL}/properties?populate=*`, {
//                 cache: "no-store",
//             }
//         );


//         if (!response.ok) {
//             throw new Error("Failed to fetch properties");
//         }


//         const result = await response.json();


//         return result.data || [];


//     } catch (error) {

//         console.error(
//             "Get Properties Error:",
//             error
//         );

//         return [];

//     }

// }

// // ========================================
// // GET LATEST PROPERTIES FOR USER HOME
// // ========================================

// export async function getLatestProperties() {
//     try {
//         const response = await fetch(
//             `${API_URL}/properties?sort=createdAt:desc&pagination[limit]=6&populate=*`, {
//                 cache: "no-store",
//             }
//         );

//         if (!response.ok) {
//             throw new Error("Failed to fetch latest properties");
//         }

//         const result = await response.json();

//         return result.data || [];
//     } catch (error) {
//         console.error("Latest Properties Error:", error);
//         return [];
//     }
// }


// // ========================================
// // GET PROPERTIES BY TYPE
// // Residential / Commercial / Industrial
// // ========================================
// export async function getPropertiesByType(type) {

//     try {


//         const formattedType = formatFilterValue(type);



//         const response = await fetch(

//             `${API_URL}/properties?` +
//             `filters[Property_Type][$eq]=${formattedType}` +
//             `&populate=*`,

//             {
//                 cache: "no-store"
//             }

//         );



//         if (!response.ok) {

//             throw new Error(
//                 "Failed to fetch property type"
//             );

//         }



//         const result =
//             await response.json();



//         return result.data || [];



//     } catch (error) {


//         console.error(
//             "Get Type Error:",
//             error
//         );


//         return [];

//     }

// }





// // ========================================
// // GET SINGLE PROPERTY
// // Using documentId
// // ========================================
// // ========================================
// // GET SINGLE PROPERTY
// // Using documentId
// // ========================================

// export async function getProperty(documentId) {
//     try {
//         if (!documentId) return null;

//         const params = new URLSearchParams();

//         appendFilter(
//             params,
//             "documentId",
//             "$eq",
//             documentId
//         );

//         params.append("populate", "*");

//         const response = await fetch(
//             `${API_URL}/properties?${params.toString()}`, {
//                 cache: "no-store",
//             }
//         );

//         if (!response.ok) {
//             throw new Error("Property fetch failed");
//         }

//         const result = await response.json();

//         if (!result.data || result.data.length === 0) {
//             return null;
//         }

//         return result.data[0];
//     } catch (error) {
//         console.error("Get Property Error:", error);
//         return null;
//     }
// }

// // ========================================
// // ADVANCED SEARCH
// // Area, City, Title, Category,
// // Property Type, Purpose
// // ========================================
// export async function searchProperties(searchText) {


//     try {


//         const query =
//             encodeURIComponent(
//                 searchText.trim()
//             );



//         const response = await fetch(

//             `${API_URL}/properties?` +

//             `filters[$or][0][Title][$containsi]=${query}` +

//             `&filters[$or][1][Area][$containsi]=${query}` +

//             `&filters[$or][2][City][$containsi]=${query}` +

//             `&filters[$or][3][Address][$containsi]=${query}` +

//             `&filters[$or][4][Category][$containsi]=${query}` +

//             `&filters[$or][5][Property_Type][$containsi]=${query}` +

//             `&filters[$or][6][Purpose][$containsi]=${query}` +

//             `&populate=*`,

//             {
//                 cache: "no-store"
//             }

//         );



//         if (!response.ok) {

//             throw new Error(
//                 "Search failed"
//             );

//         }



//         const result =
//             await response.json();



//         return result.data || [];



//     } catch (error) {


//         console.error(
//             "Search Error:",
//             error
//         );


//         return [];


//     }

// }

// // ========================================
// // PROPERTY COUNTS
// // ========================================
// export function getPropertyCounts(properties) {


//     return {


//         residential: properties.filter(
//             item =>
//             item.Property_Type === "Residential"
//         ).length,


//         commercial: properties.filter(
//             item =>
//             item.Property_Type === "Commercial"
//         ).length,


//         industrial: properties.filter(
//             item =>
//             item.Property_Type === "Industrial"
//         ).length,


//     };


// }






// // ========================================
// // CREATE PROPERTY
// // ========================================

// export async function createProperty(data, token) {
//     try {

//         console.log("TOKEN :", token);
//         console.log("DATA :", data);

//         const response = await fetch(
//             `${API_URL}/properties`,
//             {
//                 method: "POST",

//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },

//                 body: JSON.stringify({
//                     data,
//                 }),
//             }
//         );

//         const result = await response.json();

//         console.log("STATUS :", response.status);
//         console.log("RESULT :", result);

//         if (!response.ok) {
//             throw new Error(
//                 result?.error?.message ||
//                 "Property creation failed"
//             );
//         }

//         return result.data;

//     } catch (error) {

//         console.error(
//             "Create Property Error:",
//             error
//         );

//         throw error;
//     }
// }



// // ========================================
// // UPDATE PROPERTY
// // ========================================
// export async function updateProperty(
//     id,
//     data,
//     token
// ) {


//     try {


//         const response = await fetch(

//             `${API_URL}/properties/${id}`,

//             {

//                 method: "PUT",


//                 headers: {

//                     "Content-Type": "application/json",


//                     Authorization: `Bearer ${token}`

//                 },


//                 body: JSON.stringify({

//                     data

//                 })

//             }

//         );



//         const result =
//             await response.json();



//         if (!response.ok) {


//             throw new Error(
//                 result ? .error ? .message ||
//                 "Update failed"
//             );

//         }



//         return result.data;



//     } catch (error) {


//         console.error(
//             "Update Error:",
//             error
//         );


//         throw error;


//     }

// }





// // ========================================
// // DELETE PROPERTY
// // ========================================
// export async function deleteProperty(
//     id,
//     token
// ) {


//     try {


//         const response = await fetch(

//             `${API_URL}/properties/${id}`,

//             {

//                 method: "DELETE",


//                 headers: {

//                     Authorization: `Bearer ${token}`

//                 }

//             }

//         );



//         if (!response.ok) {

//             throw new Error(
//                 "Delete failed"
//             );

//         }



//         return true;



//     } catch (error) {


//         console.error(
//             "Delete Error:",
//             error
//         );


//         return false;


//     }

// }

// // ========================================
// // GET FILTERED PROPERTIES
// // ========================================

// // ========================================
// // GET FILTERED PROPERTIES
// // ========================================

// export async function getFilteredProperties(
//     type = "",
//     purpose = ""
// ) {
//     try {
//         const normalizedType = formatFilterValue(type);
//         const normalizedPurpose = formatFilterValue(purpose);

//         const params = new URLSearchParams();

//         appendFilter(
//             params,
//             "Property_Type",
//             "$eq",
//             normalizedType
//         );

//         appendFilter(
//             params,
//             "Purpose",
//             "$eq",
//             normalizedPurpose
//         );

//         params.append("populate", "*");
//         params.append("sort", "createdAt:desc");

//         const response = await fetch(`${API_URL}/properties?${params.toString()}`, {
//             cache: "no-store",
//         });

//         if (!response.ok) {
//             throw new Error("Failed to fetch filtered properties");
//         }

//         const result = await response.json();

//         return result.data || [];

//     } catch (error) {

//         console.error(
//             "Filtered Property Error:",
//             error
//         );

//         return [];

//     }
// }


// // ========================================
// // UPLOAD IMAGES
// // ========================================
// export async function uploadImages(
//     files,
//     token
// ) {


//     try {


//         const formData =
//             new FormData();



//         files.forEach(
//             file => {

//                 formData.append(
//                     "files",
//                     file
//                 );

//             }
//         );



//         const response = await fetch(

//             `${API_URL}/upload`,

//             {

//                 method: "POST",


//                 headers: {

//                     Authorization: `Bearer ${token}`

//                 },


//                 body: formData

//             }

//         );



//         const result =
//             await response.json();



//         if (!response.ok) {

//             throw new Error(
//                 "Upload failed"
//             );

//         }



//         return result;



//     } catch (error) {


//         console.error(
//             "Upload Error:",
//             error
//         );


//         throw error;


//     }

// }

// // ========================================
// // GET RELATED PROPERTIES
// // ========================================
// export async function getRelatedProperties(
//     type = "",
//     purpose = "",
//     documentId = ""
// ) {
//     try {
//         const params = new URLSearchParams();

//         appendFilter(
//             params,
//             "Property_Type",
//             "$eq",
//             formatFilterValue(type)
//         );

//         appendFilter(
//             params,
//             "Purpose",
//             "$eq",
//             formatFilterValue(purpose)
//         );

//         if (documentId) {
//             appendFilter(
//                 params,
//                 "documentId",
//                 "$ne",
//                 documentId
//             );
//         }

//         params.append("populate", "*");
//         params.append("pagination[limit]", "3");
//         params.append("sort", "createdAt:desc");

//         const response = await fetch(`${API_URL}/properties?${params.toString()}`, {
//             cache: "no-store",
//         });

//         if (!response.ok) {
//             throw new Error("Failed to fetch related properties");
//         }

//         const result = await response.json();

//         return result.data || [];
//     } catch (error) {
//         console.error("Related Property Error:", error);
//         return [];
//     }


// }
// // ========================================
// // GET PROPERTY FORM SETTINGS
// // ========================================

// export async function getPropertyFormSettings() {
//     try {
//         const response = await fetch(
//             `${API_URL}/property-form?populate=*`, {
//                 cache: "no-store",
//             }
//         );

//         if (!response.ok) {
//             throw new Error("Failed to fetch Property Form");
//         }

//         const result = await response.json();

//         return result.data;

//     } catch (error) {

//         console.error(
//             "Property Form Error:",
//             error
//         );

//         return null;
//     }
// }
// ======================================================
// PROPERTY SERVICE
// Strapi v5 + Next.js
// ======================================================

// ------------------------------------------------------
// STRAPI URL
// ------------------------------------------------------

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// If .env.local has:
// NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
// OR
// NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
// both will work.

const API_URL = `${STRAPI_URL.replace(/\/api\/?$/, "")}/api`;


// ======================================================
// HELPER
// ======================================================

function formatFilterValue(value = "") {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


function appendFilter(params, field, operator, value) {
  if (!value) return;

  params.append(
    `filters[${field}][${operator}]`,
    value
  );
}


// ======================================================
// GET PROPERTY NAV CATEGORIES (for Header navigation)
// Returns: { Residential: [...], Commercial: [...], Industrial: [...] }
// Data comes from the actual Strapi properties collection.
// No hardcoded values — all derived from real property data.
// ======================================================

export async function getPropertyNavCategories() {
  try {
    const response = await fetch(
      `${API_URL}/properties?fields[0]=Property_Type&fields[1]=Category&pagination[limit]=200`,
      { cache: "no-store" }
    );

    const result = await response.json();
    const data = result?.data || [];

    // Group distinct categories by Property_Type
    const grouped = {
      Residential: new Set(),
      Commercial: new Set(),
      Industrial: new Set(),
    };

    for (const item of data) {
      const type = item?.Property_Type?.trim();
      const cat = item?.Category?.trim();
      if (type && cat && grouped[type] !== undefined) {
        grouped[type].add(cat);
      }
    }

    return {
      Residential: Array.from(grouped.Residential),
      Commercial: Array.from(grouped.Commercial),
      Industrial: Array.from(grouped.Industrial),
    };
  } catch (error) {
    console.error("getPropertyNavCategories Error:", error);
    return { Residential: [], Commercial: [], Industrial: [] };
  }
}


// ======================================================
// GET ALL PROPERTIES
// ======================================================

export async function getProperties() {
  try {
    const response = await fetch(
      `${API_URL}/properties?populate=*`,
      {
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("GET PROPERTIES ERROR:", result);

      throw new Error(
        result?.error?.message ||
          "Failed to fetch properties"
      );
    }

    return result?.data || [];
  } catch (error) {
    console.error("Get Properties Error:", error);

    return [];
  }
}


// ======================================================
// GET LATEST PROPERTIES
// ======================================================

export async function getLatestProperties() {
  try {
    const response = await fetch(
      `${API_URL}/properties?sort=createdAt:desc&pagination[limit]=6&populate=*`,
      {
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("LATEST PROPERTIES ERROR:", result);

      throw new Error(
        result?.error?.message ||
          "Failed to fetch latest properties"
      );
    }

    return result?.data || [];
  } catch (error) {
    console.error("Latest Properties Error:", error);

    return [];
  }
}


// ======================================================
// GET PROPERTIES BY TYPE
// Residential / Commercial / Industrial
// ======================================================

export async function getPropertiesByType(type) {
  try {
    if (!type) return [];

    const formattedType = formatFilterValue(type);
    const isAll = formattedType.toLowerCase() === "all";

    const params = new URLSearchParams();

    if (!isAll) {
      params.append(
        "filters[Property_Type][$eq]",
        formattedType
      );
    }

    params.append("populate", "*");

    const response = await fetch(
      `${API_URL}/properties?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("GET TYPE ERROR:", result);

      throw new Error(
        result?.error?.message ||
          "Failed to fetch property type"
      );
    }

    return result?.data || [];
  } catch (error) {
    console.error("Get Type Error:", error);

    return [];
  }
}


// ======================================================
// GET SINGLE PROPERTY
// Uses Strapi documentId
// ======================================================

export async function getProperty(documentId) {
  try {
    if (!documentId) return null;

    // ── Deep populate to ensure all components including
    // ── PropertyAmenities, ResidentialDetails, CommercialDetails,
    // ── IndustrialDetails, PropertyOverview are fetched correctly.
    const params = new URLSearchParams();

    appendFilter(params, "documentId", "$eq", documentId);

    // Media
    params.append("populate[CoverImage]", "true");
    params.append("populate[PropertyImage]", "true");

    // Owner relation
    params.append("populate[Owner]", "true");

    // Components
    params.append("populate[PropertyAmenities]", "true");
    params.append("populate[PropertyCommonDetails]", "true");
    params.append("populate[ResidentialDetails]", "true");
    params.append("populate[CommercialDetails]", "true");
    params.append("populate[IndustrialDetails]", "true");
    params.append("populate[PropertyOverview]", "true");
    params.append("populate[PropertyFeatures]", "true");

    const response = await fetch(
      `${API_URL}/properties?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("GET PROPERTY ERROR:", result);

      throw new Error(
        result?.error?.message ||
          "Property fetch failed"
      );
    }

    if (
      !result?.data ||
      result.data.length === 0
    ) {
      return null;
    }

    return result.data[0];
  } catch (error) {
    console.error("Get Property Error:", error);

    return null;
  }
}



// ======================================================
// SEARCH PROPERTIES
// ======================================================

export async function searchProperties(searchText) {
  try {
    if (!searchText?.trim()) {
      return getProperties();
    }

    const query = encodeURIComponent(
      searchText.trim()
    );

    const response = await fetch(
      `${API_URL}/properties?` +
        `filters[$or][0][Title][$containsi]=${query}` +
        `&filters[$or][1][Area][$containsi]=${query}` +
        `&filters[$or][2][City][$containsi]=${query}` +
        `&filters[$or][3][Address][$containsi]=${query}` +
        `&filters[$or][4][Category][$containsi]=${query}` +
        `&filters[$or][5][Property_Type][$containsi]=${query}` +
        `&filters[$or][6][Purpose][$containsi]=${query}` +
        `&populate=*`,
      {
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("SEARCH ERROR:", result);

      throw new Error(
        result?.error?.message ||
          "Search failed"
      );
    }

    return result?.data || [];
  } catch (error) {
    console.error("Search Error:", error);

    return [];
  }
}

// ======================================================
// SEARCH PROPERTIES WITH MULTIPLE FILTERS
// ======================================================

export async function searchPropertiesWithFilters({
  q = "",
  purpose = "",
  location = "",
  type = "",
  budget = "",
  category = "",
}) {
  try {
    const params = new URLSearchParams();

    if (q.trim()) {
      const query = q.trim();
      params.append("filters[$or][0][Title][$containsi]", query);
      params.append("filters[$or][1][Area][$containsi]", query);
      params.append("filters[$or][2][City][$containsi]", query);
      params.append("filters[$or][3][Address][$containsi]", query);
      params.append("filters[$or][4][Category][$containsi]", query);
      params.append("filters[$or][5][Property_Type][$containsi]", query);
      params.append("filters[$or][6][Purpose][$containsi]", query);
    }

    if (purpose) {
      params.append("filters[Purpose][$eq]", purpose);
    }
    
    if (location.trim()) {
      params.append("filters[City][$containsi]", location.trim());
    }
    
    if (type.trim()) {
      params.append("filters[Property_Type][$containsi]", type.trim());
    }

    // Category filter: used by header nav (e.g. Two BHK, Office, Warehouse)
    if (category.trim()) {
      params.append("filters[Category][$eq]", category.trim());
    }
    
    if (budget.trim()) {
      const numericBudget = parseInt(budget.replace(/\D/g, ""), 10);
      if (!isNaN(numericBudget)) {
        params.append("filters[Price][$lte]", numericBudget.toString());
      }
    }

    params.append("populate", "*");
    params.append("sort", "createdAt:desc");

    const response = await fetch(`${API_URL}/properties?${params.toString()}`, {
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("SEARCH MULTI ERROR:", result);
      throw new Error(result?.error?.message || "Search failed");
    }

    return result?.data || [];
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}


// ======================================================
// PROPERTY COUNTS
// ======================================================

export function getPropertyCounts(properties = []) {
  return {
    residential: properties.filter(
      (item) =>
        item?.Property_Type === "Residential"
    ).length,

    commercial: properties.filter(
      (item) =>
        item?.Property_Type === "Commercial"
    ).length,

    industrial: properties.filter(
      (item) =>
        item?.Property_Type === "Industrial"
    ).length,
  };
}


// ======================================================
// CREATE PROPERTY
// ======================================================
// THIS IS THE IMPORTANT FUNCTION FOR
// POST PROPERTY
// ======================================================

export async function createProperty(data, token) {
  try {
    console.log("================================");
    console.log("CREATE PROPERTY");
    console.log("API URL:", `${API_URL}/properties`);
    console.log("TOKEN EXISTS:", !!token);
    console.log("PROPERTY DATA:", data);
    console.log("================================");

    if (!token) {
      throw new Error(
        "Login token not found. Please login first."
      );
    }

    if (!data) {
      throw new Error(
        "Property data is missing."
      );
    }

    const response = await fetch(
      `${API_URL}/properties`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          data: data,
        }),
      }
    );

    const result = await response.json();

    console.log(
      "CREATE PROPERTY STATUS:",
      response.status
    );

    console.log(
      "CREATE PROPERTY RESPONSE:",
      result
    );

    if (!response.ok) {
      let errMsg =
        result?.error?.message ||
        result?.message ||
        `Property creation failed (${response.status})`;

      if (
        result?.error?.details?.errors &&
        Array.isArray(result.error.details.errors)
      ) {
        const details = result.error.details.errors
          .map(
            (err) =>
              `${err.path ? err.path.join(".") + ": " : ""}${err.message}`
          )
          .join("\n");

        if (details) {
          errMsg += `:\n${details}`;
        }
      }

      throw new Error(errMsg);
    }

    return result?.data || null;
  } catch (error) {
    console.error(
      "Create Property Error:",
      error
    );

    throw error;
  }
}


// ======================================================
// UPDATE PROPERTY
// ======================================================

export async function updateProperty(
  documentId,
  data,
  token
) {
  try {
    if (!documentId) {
      throw new Error(
        "Property documentId is required."
      );
    }

    if (!token) {
      throw new Error(
        "Login token not found."
      );
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
          data: data,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.error?.message ||
          result?.message ||
          "Property update failed"
      );
    }

    return result?.data || null;
  } catch (error) {
    console.error(
      "Update Property Error:",
      error
    );

    throw error;
  }
}


// ======================================================
// DELETE PROPERTY
// ======================================================

export async function deleteProperty(
  documentId,
  token
) {
  try {
    if (!documentId) {
      throw new Error(
        "Property documentId is required."
      );
    }

    if (!token) {
      throw new Error(
        "Login token not found."
      );
    }

    const response = await fetch(
      `${API_URL}/properties/${documentId}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "DELETE PROPERTY ERROR:",
        result
      );

      throw new Error(
        result?.error?.message ||
          result?.message ||
          "Property delete failed"
      );
    }

    return true;
  } catch (error) {
    console.error(
      "Delete Property Error:",
      error
    );

    return false;
  }
}


// ======================================================
// GET FILTERED PROPERTIES
// ======================================================

export async function getFilteredProperties(
  type = "",
  purpose = ""
) {
  try {
    const params = new URLSearchParams();

    const normalizedType =
      formatFilterValue(type);

    const normalizedPurpose =
      formatFilterValue(purpose);

    appendFilter(
      params,
      "Property_Type",
      "$eq",
      normalizedType
    );

    appendFilter(
      params,
      "Purpose",
      "$eq",
      normalizedPurpose
    );

    params.append("populate", "*");
    params.append(
      "sort",
      "createdAt:desc"
    );

    const response = await fetch(
      `${API_URL}/properties?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "FILTERED PROPERTY ERROR:",
        result
      );

      throw new Error(
        result?.error?.message ||
          "Failed to fetch filtered properties"
      );
    }

    return result?.data || [];
  } catch (error) {
    console.error(
      "Filtered Property Error:",
      error
    );

    return [];
  }
}


// ======================================================
// UPLOAD PROPERTY IMAGES
// ======================================================

export async function uploadImages(
  files,
  token
) {
  try {
    if (!files?.length) {
      return [];
    }

    if (!token) {
      throw new Error(
        "Login token not found."
      );
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append(
        "files",
        file
      );
    });

    const response = await fetch(
      `${API_URL}/upload`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "UPLOAD ERROR:",
        result
      );

      throw new Error(
        result?.error?.message ||
          "Image upload failed"
      );
    }

    return result;
  } catch (error) {
    console.error(
      "Upload Images Error:",
      error
    );

    throw error;
  }
}


// ======================================================
// GET RELATED PROPERTIES
// ======================================================

export async function getRelatedProperties(
  type = "",
  purpose = "",
  documentId = ""
) {
  try {
    const params = new URLSearchParams();

    appendFilter(
      params,
      "Property_Type",
      "$eq",
      formatFilterValue(type)
    );

    appendFilter(
      params,
      "Purpose",
      "$eq",
      formatFilterValue(purpose)
    );

    if (documentId) {
      appendFilter(
        params,
        "documentId",
        "$ne",
        documentId
      );
    }

    params.append("populate", "*");

    params.append(
      "pagination[limit]",
      "3"
    );

    params.append(
      "sort",
      "createdAt:desc"
    );

    const response = await fetch(
      `${API_URL}/properties?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.error?.message ||
          "Failed to fetch related properties"
      );
    }

    return result?.data || [];
  } catch (error) {
    console.error(
      "Related Property Error:",
      error
    );

    return [];
  }
}


// ======================================================
// GET PROPERTY FORM SETTINGS
// ======================================================

export async function getPropertyFormSettings() {
  try {
    const response = await fetch(
      `${API_URL}/property-form?populate=*`,
      {
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "PROPERTY FORM SETTINGS ERROR:",
        result
      );

      throw new Error(
        result?.error?.message ||
          "Failed to fetch Property Form settings"
      );
    }

    return result?.data || null;
  } catch (error) {
    console.error(
      "Property Form Error:",
      error
    );

    return null;
  }
}