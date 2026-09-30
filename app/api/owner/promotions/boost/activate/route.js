import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

// Helper: make authenticated requests to Strapi from the server
async function strapiGet(path, token) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Strapi error: ${res.status} on ${path}`);
  }
  return res.json();
}

async function strapiPost(path, body, token) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Strapi POST error: ${res.status} on ${path}`);
  }
  return res.json();
}

async function strapiPut(path, body, token) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Strapi PUT error: ${res.status} on ${path}`);
  }
  return res.json();
}

export async function POST(request) {
  try {
    // --- 1. Read and validate the Bearer token from the incoming request ---
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }

    // --- 2. Read only propertyId and planId from client (never trust credits/price/duration) ---
    const body = await request.json().catch(() => ({}));
    const { propertyId, planId } = body;

    if (!propertyId || !planId) {
      return NextResponse.json(
        { error: "Missing required parameters: propertyId and planId." },
        { status: 400 }
      );
    }

    // --- 3. Verify the authenticated owner via Strapi /users/me ---
    const meResult = await strapiGet("/users/me?populate=*", token);
    if (!meResult || !meResult.id) {
      return NextResponse.json(
        { error: "Unable to verify your identity. Please log in again." },
        { status: 401 }
      );
    }
    const ownerId = meResult.id;
    const ownerBoostCredits = meResult.boostCredits || 0;

    // --- 4. Verify property belongs to authenticated owner ---
    const propertyResult = await strapiGet(
      `/properties/${propertyId}?filters[Owner][id][$eq]=${ownerId}&populate=*`,
      token
    );
    const property = propertyResult?.data;
    if (!property) {
      return NextResponse.json(
        { error: "Property not found or does not belong to your account." },
        { status: 403 }
      );
    }

    // --- 5. Fetch PricingConfig from Strapi (NEVER trust client-sent price/duration/credits) ---
    const pricingResult = await strapiGet("/pricing-config?populate=*", token);
    const pricingConfig = pricingResult?.data;

    if (!pricingConfig) {
      return NextResponse.json(
        { error: "Pricing configuration is currently unavailable. Please try again later." },
        { status: 503 }
      );
    }

    // --- 6. Find and validate the selected promotion plan ---
    const promotionPlans = pricingConfig.promotionPlans || [];
    const selectedPlan = promotionPlans.find((p) => p.id == planId);

    if (!selectedPlan) {
      return NextResponse.json(
        { error: "Selected promotion plan is invalid or no longer available." },
        { status: 400 }
      );
    }

    if (selectedPlan.isActive === false) {
      return NextResponse.json(
        { error: "The selected promotion plan is currently inactive." },
        { status: 400 }
      );
    }

    if (selectedPlan.promotionType !== "boost") {
      return NextResponse.json(
        { error: "Invalid promotion type for this endpoint." },
        { status: 400 }
      );
    }

    const creditsRequired = selectedPlan.creditsRequired || 1;
    const durationDays = selectedPlan.durationDays;

    if (!durationDays || durationDays <= 0) {
      return NextResponse.json(
        { error: "Promotion plan has an invalid duration. Contact support." },
        { status: 500 }
      );
    }

    // --- 7. Verify owner has sufficient boost credits (server-side check) ---
    if (ownerBoostCredits < creditsRequired) {
      return NextResponse.json(
        {
          error: `Insufficient boost credits. You have ${ownerBoostCredits} credit(s) but this promotion requires ${creditsRequired}.`,
        },
        { status: 402 }
      );
    }

    // --- 8. Duplicate activation protection: check if this property already has an active boost ---
    const existingPromos = await strapiGet(
      `/promotions?filters[property][id][$eq]=${propertyId}&filters[owner][id][$eq]=${ownerId}&filters[status][$eq]=active&filters[promotionType][$eq]=boost`,
      token
    );
    if (existingPromos?.data?.length > 0) {
      return NextResponse.json(
        { error: "This property already has an active Boost promotion running." },
        { status: 409 }
      );
    }

    // --- 9. Calculate dates ---
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    // --- 10. Capture before-metrics from the property ---
    const viewsBefore = property.Views || 0;
    const savesBefore = property.Saves || 0;
    // Enquiries before — count from property enquiries relation
    const enquiriesBeforeCount = property.enquiries?.length || 0;

    // --- 11. Create the Promotion record in Strapi ---
    const createResult = await strapiPost(
      "/promotions",
      {
        data: {
          promotionType: "boost",
          status: "active",
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          durationDays: durationDays,
          creditsUsed: creditsRequired,
          viewsBefore: viewsBefore,
          savesBefore: savesBefore,
          enquiriesBefore: enquiriesBeforeCount,
          callsBefore: 0,
          viewsAfter: 0,
          savesAfter: 0,
          enquiriesAfter: 0,
          callsAfter: 0,
          owner: ownerId,
          property: parseInt(propertyId, 10),
        },
      },
      token
    );

    const promotion = createResult?.data;
    if (!promotion) {
      throw new Error("Failed to create the promotion record.");
    }

    // --- 12. Deduct credits from owner ---
    const newBoostCredits = ownerBoostCredits - creditsRequired;
    await strapiPut(
      `/users/${ownerId}`,
      { boostCredits: newBoostCredits },
      token
    );

    // --- 13. Return success response ---
    return NextResponse.json({
      success: true,
      promotionId: promotion.documentId || promotion.id,
      promotion: {
        id: promotion.id,
        documentId: promotion.documentId,
        promotionType: promotion.promotionType || "boost",
        status: promotion.status || "active",
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        durationDays: promotion.durationDays,
        creditsUsed: promotion.creditsUsed,
      },
      remainingBoostCredits: newBoostCredits,
      propertyTitle: property.Title,
    });
  } catch (error) {
    console.error("BOOST ACTIVATION ERROR:", error);
    return NextResponse.json(
      {
        error:
          error.message?.includes("Strapi") || error.message?.includes("fetch")
            ? "Unable to reach the server. Please try again."
            : error.message || "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
