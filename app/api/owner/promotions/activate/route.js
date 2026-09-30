import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

async function strapiGet(path, token) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Strapi PUT error: ${res.status} on ${path}`);
  }
  return res.json();
}

// Maps promotionType → which credit field on the user object
const CREDIT_FIELD_MAP = {
  boost: "boostCredits",
  featured: "featuredCredits",
  highlight: "highlightCredits",
};

export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const { propertyId, planId, promotionType: clientPromoType } = body;

    if (!propertyId || !planId) {
      return NextResponse.json({ error: "Missing required parameters: propertyId and planId." }, { status: 400 });
    }

    // 1. Verify owner
    const meResult = await strapiGet("/users/me?populate=*", token);
    if (!meResult?.id) return NextResponse.json({ error: "Unable to verify identity." }, { status: 401 });
    const ownerId = meResult.id;

    // 2. Verify property belongs to owner
    const propertyResult = await strapiGet(`/properties/${propertyId}?filters[Owner][id][$eq]=${ownerId}&populate=*`, token);
    const property = propertyResult?.data;
    if (!property) return NextResponse.json({ error: "Property not found or does not belong to your account." }, { status: 403 });

    // 3. Fetch PricingConfig (NEVER trust client-sent price/duration/credits)
    const pricingResult = await strapiGet("/pricing-config?populate=*", token);
    const pricingConfig = pricingResult?.data;
    if (!pricingConfig) return NextResponse.json({ error: "Pricing configuration unavailable." }, { status: 503 });

    // 4. Find & validate the selected promotion plan from Strapi
    const selectedPlan = (pricingConfig.promotionPlans || []).find((p) => p.id == planId);
    if (!selectedPlan) return NextResponse.json({ error: "Selected promotion plan is invalid." }, { status: 400 });
    if (selectedPlan.isActive === false) return NextResponse.json({ error: "This promotion plan is currently inactive." }, { status: 400 });

    // 5. Validate promotion type (use Strapi value — never trust client)
    const promotionType = selectedPlan.promotionType;
    const creditField = CREDIT_FIELD_MAP[promotionType];
    if (!creditField) {
      return NextResponse.json({ error: `Invalid promotion type: ${promotionType}` }, { status: 400 });
    }

    const creditsRequired = selectedPlan.creditsRequired || 1;
    const durationDays = selectedPlan.durationDays;
    if (!durationDays || durationDays <= 0) return NextResponse.json({ error: "Promotion plan has invalid duration." }, { status: 500 });

    // 6. Verify owner has sufficient credits (server-side)
    const ownerCredits = meResult[creditField] || 0;
    if (ownerCredits < creditsRequired) {
      return NextResponse.json(
        { error: `Insufficient ${promotionType} credits. You have ${ownerCredits} but need ${creditsRequired}.` },
        { status: 402 }
      );
    }

    // 6a. Check subscription validity
    const now = new Date();
    const validUntil = meResult.subscriptionValidUntil ? new Date(meResult.subscriptionValidUntil) : null;
    if (!meResult.subscriptionTier || !validUntil || validUntil < now) {
      return NextResponse.json(
        { error: `Active subscription required for new promotions. Your subscription has expired.` },
        { status: 403 }
      );
    }

    // 6b. Active Promotion Limit Check
    const activeSubPlan = (pricingConfig.subscriptionPlans || []).find(p => p.name === meResult.subscriptionTier);
    const maxActivePromotions = activeSubPlan?.maxActivePromotions || 0;

    const allActivePromosResult = await strapiGet(
      `/promotions?filters[owner][id][$eq]=${ownerId}&filters[status][$eq]=active`,
      token
    );
    const activePromosCount = allActivePromosResult?.meta?.pagination?.total || (allActivePromosResult?.data?.length || 0);

    if (activePromosCount >= maxActivePromotions) {
      return NextResponse.json(
        { error: `Your active promotion limit (${maxActivePromotions}) has been reached. Please upgrade your plan.` },
        { status: 403 }
      );
    }

    // 7. Duplicate activation protection
    const existingPromos = await strapiGet(
      `/promotions?filters[property][id][$eq]=${propertyId}&filters[owner][id][$eq]=${ownerId}&filters[status][$eq]=active&filters[promotionType][$eq]=${promotionType}`,
      token
    );
    if (existingPromos?.data?.length > 0) {
      return NextResponse.json(
        { error: `This property already has an active ${promotionType} promotion.` },
        { status: 409 }
      );
    }

    // 8. Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    // 9. Capture before-metrics
    const viewsBefore = property.Views || 0;
    const savesBefore = property.Saves || 0;
    const enquiriesBeforeCount = property.enquiries?.length || 0;

    // 10. Create Promotion record in Strapi
    const createResult = await strapiPost("/promotions", {
      data: {
        promotionType,
        status: "active",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        durationDays,
        creditsUsed: creditsRequired,
        viewsBefore,
        savesBefore,
        enquiriesBefore: enquiriesBeforeCount,
        callsBefore: 0,
        viewsAfter: 0,
        savesAfter: 0,
        enquiriesAfter: 0,
        callsAfter: 0,
        owner: ownerId,
        property: parseInt(propertyId, 10),
      },
    }, token);

    const promotion = createResult?.data;
    if (!promotion) throw new Error("Failed to create the promotion record.");

    // 11. Deduct credits atomically
    const newCredits = ownerCredits - creditsRequired;
    await strapiPut(`/users/${ownerId}`, { [creditField]: newCredits }, token);

    return NextResponse.json({
      success: true,
      promotionId: promotion.documentId || promotion.id,
      promotionType,
      promotion: {
        id: promotion.id,
        documentId: promotion.documentId,
        promotionType: promotion.promotionType,
        status: promotion.status || "active",
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        durationDays: promotion.durationDays,
        creditsUsed: promotion.creditsUsed,
      },
      creditField,
      remainingCredits: newCredits,
      propertyTitle: property.Title,
    });
  } catch (error) {
    console.error("PROMOTION ACTIVATION ERROR:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
