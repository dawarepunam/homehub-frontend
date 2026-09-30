import { NextResponse } from "next/server";
import Razorpay from "razorpay";

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

export async function POST(request) {
  try {
    // 1. Read and validate token
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // 2. Extract payload
    const body = await request.json().catch(() => ({}));
    const { subscriptionPlanId, propertyId, planId, promotionType } = body;

    if (!subscriptionPlanId) {
      return NextResponse.json({ error: "Missing subscriptionPlanId." }, { status: 400 });
    }

    // 3. Verify owner
    const meResult = await strapiGet("/users/me?populate=*", token);
    if (!meResult || !meResult.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const ownerId = meResult.id;

    // 4. Verify property if propertyId is provided (context preservation)
    if (propertyId) {
      const propertyResult = await strapiGet(`/properties/${propertyId}?filters[Owner][id][$eq]=${ownerId}&populate=*`, token);
      const property = propertyResult?.data?.[0] || propertyResult?.data; // handle single vs array depending on filter
      if (!property) {
        return NextResponse.json({ error: "Property not found or access denied." }, { status: 403 });
      }
    }

    // 5. Fetch PricingConfig from Strapi
    const pricingResult = await strapiGet("/pricing-config?populate=*", token);
    const pricingConfig = pricingResult?.data;
    if (!pricingConfig) {
      return NextResponse.json({ error: "Pricing config unavailable." }, { status: 503 });
    }

    // 6. Find subscription plan
    const subPlans = pricingConfig.subscriptionPlans || [];
    const selectedPlan = subPlans.find(p => p.id == subscriptionPlanId);

    if (!selectedPlan) {
      return NextResponse.json({ error: "Invalid subscription plan." }, { status: 400 });
    }
    if (selectedPlan.isActive === false) {
      return NextResponse.json({ error: "Subscription plan is inactive." }, { status: 400 });
    }

    // 7. Calculate total amount
    const price = parseFloat(selectedPlan.price || 0);
    const gstPercentage = parseFloat(pricingConfig.gstPercentage || 18);
    const gstAmount = (price * gstPercentage) / 100;
    const totalAmount = price + gstAmount;

    // Convert to paise
    const amountInPaise = Math.round(totalAmount * 100);

    // 8. Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${ownerId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscriptionPlanName: selectedPlan.name,
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
