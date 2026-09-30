const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";
const API_URL = STRAPI_BASE_URL.endsWith("/api") ? STRAPI_BASE_URL : `${STRAPI_BASE_URL}/api`;

export async function POST(request) {
  try {
    const { propertyId, promotionPlanId } = await request.json();
    const token = request.headers.get("Authorization");

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 1. Fetch Owner and Pricing Config
    const [ownerRes, configRes] = await Promise.all([
      fetch(`${API_URL}/users/me?populate=*`, { headers: { Authorization: token } }),
      fetch(`${API_URL}/pricing-config?populate=*`, { headers: { Authorization: token } })
    ]);

    const owner = await ownerRes.json();
    const config = (await configRes.json()).data;
    
    const promoPlan = (config?.promotionPlans || []).find(p => p.id.toString() === promotionPlanId.toString());

    if (!promoPlan) {
      throw new Error("Invalid promotion plan");
    }

    const creditsRequired = promoPlan.creditsRequired || 1;
    let newBoostCredits = owner.boostCredits || 0;
    let newFeaturedCredits = owner.featuredCredits || 0;
    let newHighlightCredits = owner.highlightCredits || 0;

    if (promoPlan.promotionType === "boost") {
      if (newBoostCredits < creditsRequired) throw new Error("Insufficient Boost Credits");
      newBoostCredits -= creditsRequired;
    } else if (promoPlan.promotionType === "featured") {
      if (newFeaturedCredits < creditsRequired) throw new Error("Insufficient Featured Credits");
      newFeaturedCredits -= creditsRequired;
    } else if (promoPlan.promotionType === "highlight") {
      if (newHighlightCredits < creditsRequired) throw new Error("Insufficient Highlight Credits");
      newHighlightCredits -= creditsRequired;
    } else {
      throw new Error("Unknown promotion type");
    }

    // 2. Update Owner Credits
    await fetch(`${API_URL}/users/${owner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        boostCredits: newBoostCredits,
        featuredCredits: newFeaturedCredits,
        highlightCredits: newHighlightCredits
      })
    });

    // 3. Create Promotion Record
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + promoPlan.durationDays);

    const promotionRes = await fetch(`${API_URL}/promotions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        data: {
          promotionType: promoPlan.promotionType,
          status: "active",
          startDate: new Date().toISOString(),
          endDate: endDate.toISOString(),
          owner: owner.id,
          property: propertyId,
          // No payment link since this used a credit directly
        }
      })
    });

    if (!promotionRes.ok) throw new Error("Failed to create promotion record");
    const promotionData = await promotionRes.json();

    return new Response(JSON.stringify({
      success: true,
      promotionId: promotionData.data.documentId || promotionData.data.id
    }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (error) {
    console.error("USE CREDIT ERROR:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
