// =====================================================
// HOMEHUB - ENQUIRY SERVICE
// =====================================================

// Supports both:
// NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
// OR
// NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api

const RAW_STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  "http://localhost:1337";

const STRAPI_BASE_URL = RAW_STRAPI_URL
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const API_URL = `${STRAPI_BASE_URL}/api`;

console.log("==============================================");
console.log("HOMEHUB ENQUIRY SERVICE");
console.log("RAW STRAPI URL:", RAW_STRAPI_URL);
console.log("STRAPI BASE URL:", STRAPI_BASE_URL);
console.log("STRAPI API URL:", API_URL);
console.log("==============================================");


// =====================================================
// AUTH TOKEN
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
// PARSE STRAPI RESPONSE
// =====================================================

async function parseResponse(response) {
  const result = await response.json().catch(() => null);

  console.log(
    "STRAPI RESPONSE:",
    response.status,
    response.statusText,
    result
  );

  if (!response.ok) {
    const message =
      result?.error?.message ||
      result?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return result;
}


// =====================================================
// NORMALIZE STRAPI RELATION
// Supports Strapi v4 + v5
// =====================================================

function normalizeRelation(relation) {
  if (!relation) {
    return null;
  }

  // Strapi v4
  if (relation?.data) {
    return relation.data;
  }

  // Strapi v5
  return relation;
}


// =====================================================
// NORMALIZE ATTRIBUTES
// =====================================================

function normalizeAttributes(item) {
  if (!item) {
    return {};
  }

  if (item?.attributes) {
    return item.attributes;
  }

  return item;
}


// =====================================================
// GET LOGGED-IN USER
// =====================================================

export async function getLoggedInUser() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  const url = `${API_URL}/users/me`;

  console.log("==============================================");
  console.log("GET LOGGED-IN USER");
  console.log("URL:", url);
  console.log("==============================================");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  const user = await parseResponse(response);

  console.log("LOGGED-IN USER:", user);

  return user;
}


// =====================================================
// GET PROPERTY BY DOCUMENT ID
// =====================================================

export async function getPropertyForEnquiry(
  propertyDocumentId
) {
  if (!propertyDocumentId) {
    throw new Error("Property ID is required.");
  }

  const query =
    `filters[documentId][$eq]=${encodeURIComponent(
      propertyDocumentId
    )}` +
    `&populate=*`;

  const url = `${API_URL}/properties?${query}`;

  console.log("==============================================");
  console.log("GET PROPERTY FOR ENQUIRY");
  console.log("URL:", url);
  console.log("==============================================");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  const result = await parseResponse(response);

  if (!result?.data?.length) {
    throw new Error("Property not found.");
  }

  return result.data[0];
}


// =====================================================
// CHECK EXISTING ENQUIRY
// =====================================================

export async function checkExistingEnquiry(
  propertyDocumentId
) {
  if (!propertyDocumentId) {
    throw new Error("Property ID is required.");
  }

  const user = await getLoggedInUser();

  if (!user?.id) {
    throw new Error("Logged-in user not found.");
  }

  const property =
    await getPropertyForEnquiry(
      propertyDocumentId
    );

  if (!property?.id) {
    throw new Error("Property not found.");
  }

  const query =
    `filters[users_permissions_user][id][$eq]=${user.id}` +
    `&filters[property][id][$eq]=${property.id}` +
    `&filters[BuyerDeleted][$ne]=true` +
    `&pagination[pageSize]=1`;

  const url = `${API_URL}/enquiries?${query}`;

  console.log("==============================================");
  console.log("CHECK EXISTING ENQUIRY");
  console.log("URL:", url);
  console.log("==============================================");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  const result = await parseResponse(response);

  return Boolean(
    result?.data?.length
  );
}


// =====================================================
// SEND ENQUIRY
// USER SIDE
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

  // ---------------------------------------------------
  // 1. USER
  // ---------------------------------------------------

  const user = await getLoggedInUser();

  if (!user?.id) {
    throw new Error("Logged-in user not found.");
  }

  // ---------------------------------------------------
  // 2. PROPERTY
  // ---------------------------------------------------

  const property =
    await getPropertyForEnquiry(
      propertyDocumentId
    );

  if (!property?.id) {
    throw new Error("Property not found.");
  }

  // ---------------------------------------------------
  // 3. DUPLICATE CHECK
  // ---------------------------------------------------

  const alreadyExists =
    await checkExistingEnquiry(
      propertyDocumentId
    );

  if (alreadyExists) {
    throw new Error(
      "You have already sent an enquiry for this property."
    );
  }

  // ---------------------------------------------------
  // 4. CREATE
  // ---------------------------------------------------

  const url = `${API_URL}/enquiries`;

  console.log("==============================================");
  console.log("CREATE ENQUIRY");
  console.log("URL:", url);
  console.log("==============================================");

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },

    body: JSON.stringify({
      data: {
        Name:
          name ||
          user.username ||
          "",

        Phone:
          phone ||
          "",

        Email:
          email ||
          user.email ||
          "",

        Message:
          message ||
          "I am interested in this property.",

        Status: "Pending",

        property: property.id,

        users_permissions_user: user.id,
      },
    }),
  });

  return await parseResponse(response);
}


// =====================================================
// GET MY ENQUIRIES
// USER SIDE
// =====================================================

export async function getMyEnquiries() {
  try {
    const user = await getLoggedInUser();

    if (!user?.id) {
      throw new Error(
        "Logged-in user not found."
      );
    }

    const query =
      `filters[users_permissions_user][id][$eq]=${user.id}` +
      `&filters[BuyerDeleted][$ne]=true` +
      `&populate[property][populate][CoverImage]=true` +
      `&sort=createdAt:desc` +
      `&pagination[pageSize]=100`;

    const url = `${API_URL}/enquiries?${query}`;

    console.log("==============================================");
    console.log("GET MY ENQUIRIES");
    console.log("URL:", url);
    console.log("==============================================");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
      cache: "no-store",
    });

    const result =
      await parseResponse(response);

    const enquiries =
      result?.data || [];

    console.log(
      "TOTAL MY ENQUIRIES:",
      enquiries.length
    );

    return enquiries;

  } catch (error) {
    console.error(
      "GET MY ENQUIRIES ERROR:",
      error
    );

    throw error;
  }
}


// =====================================================
// GET MY ENQUIRIES (FALLBACK - simple populate)
// =====================================================

export async function getMyEnquiriesFallback() {
  const user = await getLoggedInUser();

  if (!user?.id) {
    throw new Error("Logged-in user not found.");
  }

  const query =
    `filters[users_permissions_user][id][$eq]=${user.id}` +
    `&filters[BuyerDeleted][$ne]=true` +
    `&populate=*` +
    `&sort=createdAt:desc` +
    `&pagination[pageSize]=100`;

  const url = `${API_URL}/enquiries?${query}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { ...getAuthHeaders() },
    cache: "no-store",
  });

  const result = await parseResponse(response);
  return result?.data || [];
}


// =====================================================
// DELETE MY ENQUIRY
// =====================================================

export async function deleteMyEnquiry(
  enquiryDocumentId
) {
  if (!enquiryDocumentId) {
    throw new Error(
      "Enquiry documentId is required."
    );
  }

  const user =
    await getLoggedInUser();

  if (!user?.id) {
    throw new Error(
      "Logged-in user not found."
    );
  }

  const query =
    `filters[documentId][$eq]=${encodeURIComponent(
      enquiryDocumentId
    )}` +
    `&populate=*`;

  const url =
    `${API_URL}/enquiries?${query}`;

  const response =
    await fetch(url, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
      cache: "no-store",
    });

  const result =
    await parseResponse(response);

  const enquiry =
    result?.data?.[0];

  if (!enquiry) {
    throw new Error(
      "Enquiry not found."
    );
  }

  const enquiryUser =
    normalizeRelation(
      enquiry?.users_permissions_user
    );

  const enquiryUserId =
    enquiryUser?.id;

  if (
    enquiryUserId &&
    String(enquiryUserId) !==
      String(user.id)
  ) {
    throw new Error(
      "You cannot delete this enquiry."
    );
  }

  const deleteUrl =
    `${API_URL}/enquiries/${enquiry.documentId}`;

  const deleteResponse =
    await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });

  await parseResponse(deleteResponse);

  return true;
}


// =====================================================
// GET OWNER PROPERTIES
// =====================================================

async function getOwnerPropertyIds(
  ownerId
) {
  if (!ownerId) {
    throw new Error(
      "Owner ID is required."
    );
  }

  const query =
    `filters[Owner][id][$eq]=${ownerId}` +
    `&fields[0]=documentId` +
    `&fields[1]=id`;

  const url =
    `${API_URL}/properties?${query}`;

  console.log("==============================================");
  console.log("GET OWNER PROPERTIES");
  console.log("OWNER ID:", ownerId);
  console.log("URL:", url);
  console.log("==============================================");

  const response =
    await fetch(url, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
      cache: "no-store",
    });

  const result =
    await parseResponse(response);

  const properties =
    result?.data || [];

  console.log(
    "OWNER PROPERTIES:",
    properties
  );

  return properties;
}


// =====================================================
// GET ALL ENQUIRIES
// =====================================================

export async function getAllEnquiries() {
  const query =
    `populate=*` +
    `&filters[BuyerDeleted][$ne]=true` +
    `&sort=createdAt:desc` +
    `&pagination[pageSize]=100`;

  const url =
    `${API_URL}/enquiries?${query}`;

  console.log("==============================================");
  console.log("GET ALL ENQUIRIES");
  console.log("URL:", url);
  console.log("==============================================");

  const response =
    await fetch(url, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
      cache: "no-store",
    });

  const result =
    await parseResponse(response);

  const enquiries =
    result?.data || [];

  console.log(
    "TOTAL ALL ENQUIRIES:",
    enquiries.length
  );

  console.log(
    "ALL ENQUIRIES:",
    enquiries
  );

  return enquiries;
}


// =====================================================
// GET OWNER ENQUIRIES
//
// Owner
//   ↓
// Owner Properties
//   ↓
// All Enquiries
//   ↓
// Match Property
//   ↓
// Owner Enquiries
// =====================================================

export async function getOwnerEnquiries() {
  try {
    console.log("");
    console.log(
      "=============================================="
    );
    console.log(
      "START GET OWNER ENQUIRIES"
    );
    console.log(
      "=============================================="
    );

    // -------------------------------------------------
    // 1. OWNER
    // -------------------------------------------------

    const owner =
      await getLoggedInUser();

    if (!owner?.id) {
      throw new Error(
        "Logged-in owner not found."
      );
    }

    console.log(
      "OWNER ID:",
      owner.id
    );

    console.log(
      "OWNER USERNAME:",
      owner.username
    );

    // -------------------------------------------------
    // 2. OWNER PROPERTIES
    // -------------------------------------------------

    const properties =
      await getOwnerPropertyIds(
        owner.id
      );

    console.log(
      "OWNER PROPERTY COUNT:",
      properties.length
    );

    if (!properties.length) {
      console.log(
        "OWNER HAS NO PROPERTIES"
      );

      return [];
    }

    // -------------------------------------------------
    // 3. PROPERTY IDS
    // -------------------------------------------------

    const ownerPropertyIds =
      properties
        .map(
          (property) =>
            property?.id
        )
        .filter(Boolean);

    const ownerPropertyDocumentIds =
      properties
        .map(
          (property) =>
            property?.documentId
        )
        .filter(Boolean);

    console.log(
      "OWNER PROPERTY IDS:",
      ownerPropertyIds
    );

    console.log(
      "OWNER PROPERTY DOCUMENT IDS:",
      ownerPropertyDocumentIds
    );

    // -------------------------------------------------
    // 4. ALL ENQUIRIES
    // -------------------------------------------------

    const allEnquiries =
      await getAllEnquiries();

    console.log(
      "ALL ENQUIRY COUNT:",
      allEnquiries.length
    );

    // -------------------------------------------------
    // 5. MATCH
    // -------------------------------------------------

    const ownerEnquiries =
      allEnquiries.filter(
        (enquiry) => {

          const relation =
            normalizeRelation(
              enquiry?.property
            );

          if (!relation) {
            return false;
          }

          const property =
            normalizeAttributes(
              relation
            );

          const enquiryPropertyId =
            relation?.id ||
            property?.id;

          const enquiryPropertyDocumentId =
            relation?.documentId ||
            property?.documentId;

          // Match documentId
          if (
            enquiryPropertyDocumentId &&
            ownerPropertyDocumentIds.some(
              (id) =>
                String(id) ===
                String(
                  enquiryPropertyDocumentId
                )
            )
          ) {
            return true;
          }

          // Match numeric id
          if (
            enquiryPropertyId &&
            ownerPropertyIds.some(
              (id) =>
                String(id) ===
                String(
                  enquiryPropertyId
                )
            )
          ) {
            return true;
          }

          return false;
        }
      );

    // -------------------------------------------------
    // 6. FINAL
    // -------------------------------------------------

    console.log(
      "=============================================="
    );

    console.log(
      "OWNER ENQUIRIES RESULT"
    );

    console.log(
      "TOTAL ALL ENQUIRIES:",
      allEnquiries.length
    );

    console.log(
      "TOTAL OWNER ENQUIRIES:",
      ownerEnquiries.length
    );

    console.log(
      "OWNER ENQUIRIES:",
      ownerEnquiries
    );

    console.log(
      "=============================================="
    );

    return ownerEnquiries;

  } catch (error) {

    console.error(
      "=============================================="
    );

    console.error(
      "GET OWNER ENQUIRIES ERROR:"
    );

    console.error(error);

    console.error(
      "=============================================="
    );

    throw error;
  }
}


// =====================================================
// GET SINGLE OWNER ENQUIRY
// =====================================================

export async function getOwnerEnquiry(
  enquiryDocumentId
) {
  if (!enquiryDocumentId) {
    throw new Error(
      "Enquiry documentId is required."
    );
  }

  // -------------------------------------------------
  // 1. OWNER
  // -------------------------------------------------

  const owner =
    await getLoggedInUser();

  if (!owner?.id) {
    throw new Error(
      "Logged-in owner not found."
    );
  }

  // -------------------------------------------------
  // 2. OWNER PROPERTIES
  // -------------------------------------------------

  const properties =
    await getOwnerPropertyIds(
      owner.id
    );

  const ownerPropertyIds =
    properties
      .map(
        (property) =>
          property?.id
      )
      .filter(Boolean);

  const ownerPropertyDocumentIds =
    properties
      .map(
        (property) =>
          property?.documentId
      )
      .filter(Boolean);

  if (
    !ownerPropertyIds.length &&
    !ownerPropertyDocumentIds.length
  ) {
    throw new Error(
      "No properties found for this owner."
    );
  }

  // -------------------------------------------------
  // 3. ALL ENQUIRIES
  // -------------------------------------------------

  const allEnquiries =
    await getAllEnquiries();

  // -------------------------------------------------
  // 4. FIND ENQUIRY
  // -------------------------------------------------

  const enquiry =
    allEnquiries.find(
      (item) =>
        String(item?.documentId) ===
        String(enquiryDocumentId)
    );

  if (!enquiry) {
    throw new Error(
      "Enquiry not found."
    );
  }

  // -------------------------------------------------
  // 5. PROPERTY
  // -------------------------------------------------

  const relation =
    normalizeRelation(
      enquiry?.property
    );

  if (!relation) {
    throw new Error(
      "Property information not found."
    );
  }

  const property =
    normalizeAttributes(
      relation
    );

  const propertyId =
    relation?.id ||
    property?.id;

  const propertyDocumentId =
    relation?.documentId ||
    property?.documentId;

  // -------------------------------------------------
  // 6. SECURITY
  // -------------------------------------------------

  const belongsToOwner =
    ownerPropertyIds.some(
      (id) =>
        String(id) ===
        String(propertyId)
    ) ||
    ownerPropertyDocumentIds.some(
      (id) =>
        String(id) ===
        String(propertyDocumentId)
    );

  if (!belongsToOwner) {
    throw new Error(
      "You are not authorized to view this enquiry."
    );
  }

  // -------------------------------------------------
  // 7. RETURN
  // -------------------------------------------------

  console.log(
    "SINGLE OWNER ENQUIRY:",
    enquiry
  );

  return enquiry;
}


// =====================================================
// UPDATE OWNER ENQUIRY STATUS
// =====================================================

export async function updateOwnerEnquiryStatus(
  enquiryDocumentId,
  status
) {
  if (!enquiryDocumentId) {
    throw new Error(
      "Enquiry documentId is required."
    );
  }

  if (!status) {
    throw new Error(
      "Enquiry status is required."
    );
  }

  const allowedStatuses = [
    "Pending",
    "New",
    "Contacted",
    "Interested",
    "Follow-up Required",
    "Site Visit Pending",
    "Not Interested",
    "Site Visit",
    "Scheduled",
    "Confirmed",
    "Completed",
    "Cancelled",
    "Rescheduled",
    "Closed",
  ];

  if (
    !allowedStatuses.includes(status)
  ) {
    throw new Error(
      `Invalid enquiry status: ${status}`
    );
  }

  // -------------------------------------------------
  // VERIFY OWNER
  // -------------------------------------------------

  const owner =
    await getLoggedInUser();

  if (!owner?.id) {
    throw new Error(
      "Logged-in owner not found."
    );
  }

  // -------------------------------------------------
  // VERIFY ENQUIRY
  // -------------------------------------------------

  const enquiry =
    await getOwnerEnquiry(
      enquiryDocumentId
    );

  if (!enquiry) {
    throw new Error(
      "Enquiry not found."
    );
  }

  // -------------------------------------------------
  // UPDATE
  // -------------------------------------------------

  const url =
    `${API_URL}/enquiries/${enquiryDocumentId}`;

  let mappedStatus = status;
  if (status === "Confirmed") mappedStatus = " Confirmed";
  if (status === "Cancelled") mappedStatus = "Cancelled ";

  console.log("==============================================");
  console.log("UPDATE OWNER ENQUIRY");
  console.log("URL:", url);
  console.log("STATUS:", status);
  console.log("MAPPED STATUS:", mappedStatus);
  console.log("==============================================");

  const response =
    await fetch(url, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },

      body: JSON.stringify({
        data: {
          Statuss: mappedStatus,
        },
      }),
    });

  const result =
    await parseResponse(response);

  console.log(
    "UPDATED ENQUIRY:",
    result
  );

  return (
    result?.data ||
    result
  );
}


// =====================================================
// MARK AS CONTACTED
// =====================================================

export async function markOwnerEnquiryAsContacted(
  enquiryDocumentId
) {
  return await updateOwnerEnquiryStatus(
    enquiryDocumentId,
    "Contacted"
  );
}


// =====================================================
// MARK AS SITE VISIT
// =====================================================

export async function markOwnerEnquiryAsSiteVisit(
  enquiryDocumentId
) {
  return await updateOwnerEnquiryStatus(
    enquiryDocumentId,
    "Site Visit"
  );
}


// =====================================================
// CLOSE ENQUIRY
// =====================================================

export async function closeOwnerEnquiry(
  enquiryDocumentId
) {
  return await updateOwnerEnquiryStatus(
    enquiryDocumentId,
    "Closed"
  );
}
// =====================================================
// GET OWNER CONTACTED ENQUIRIES
// =====================================================

export async function getOwnerContactedEnquiries() {
  try {
    const enquiries = await getOwnerEnquiries();

    const contactedEnquiries = enquiries.filter(
      (enquiry) => enquiry?.Statuss === "Contacted"
    );

    console.log(
      "TOTAL OWNER CONTACTED ENQUIRIES:",
      contactedEnquiries.length
    );

    console.log(
      "OWNER CONTACTED ENQUIRIES:",
      contactedEnquiries
    );

    return contactedEnquiries;
  } catch (error) {
    console.error(
      "GET OWNER CONTACTED ENQUIRIES ERROR:",
      error
    );

    throw error;
  }
}


// =====================================================
// UPDATE OWNER ENQUIRY FIELDS
// For reschedule: update VisitDate, VisitTime, Notes
// For cancel: update CancellationReason along with status
// =====================================================

export async function updateOwnerEnquiryFields(
  enquiryDocumentId,
  fields = {}
) {
  if (!enquiryDocumentId) {
    throw new Error(
      "Enquiry documentId is required."
    );
  }

  // Verify owner has access
  const owner = await getLoggedInUser();

  if (!owner?.id) {
    throw new Error(
      "Logged-in owner not found."
    );
  }

  // Verify the enquiry belongs to this owner
  await getOwnerEnquiry(enquiryDocumentId);

  const url =
    `${API_URL}/enquiries/${enquiryDocumentId}`;

  console.log("==============================================");
  console.log("UPDATE OWNER ENQUIRY FIELDS");
  console.log("URL:", url);
  console.log("FIELDS:", fields);
  console.log("==============================================");

  const response = await fetch(url, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },

    body: JSON.stringify({
      data: {
        ...fields,
      },
    }),
  });

  const result = await parseResponse(response);

  console.log(
    "UPDATED ENQUIRY FIELDS RESULT:",
    result
  );

  return (
    result?.data ||
    result
  );
}


// =====================================================
// GET ADMIN ENQUIRY (SINGLE)
// =====================================================

export async function getAdminEnquiry(documentId) {
  if (!documentId) throw new Error("Enquiry documentId is required.");

  const query = `filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`;
  const url = `${API_URL}/enquiries?${query}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { ...getAuthHeaders() },
    cache: "no-store",
  });

  const result = await parseResponse(response);
  const enquiry = result?.data?.[0];

  if (!enquiry) throw new Error("Enquiry not found.");
  return enquiry;
}

// =====================================================
// UPDATE ADMIN ENQUIRY STATUS
// =====================================================

export async function updateAdminEnquiryStatus(documentId, status) {
  if (!documentId) throw new Error("Enquiry documentId is required.");
  if (!status) throw new Error("Enquiry status is required.");

  const url = `${API_URL}/enquiries/${documentId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      data: { Statuss: status }, // using 'Statuss' based on Strapi response
    }),
  });

  const result = await parseResponse(response);
  return result?.data || result;
}