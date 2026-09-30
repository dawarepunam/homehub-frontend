import { NextResponse } from "next/server";
import crypto from "crypto";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

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
    throw new Error(err?.error?.message || `Strapi GET error: ${res.status} on ${path}`);
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
    // 1. Validate Token
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subscriptionPlanId,
      propertyId,
      planId, // Promotion Plan ID
      promotionType,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification parameters." }, { status: 400 });
    }

    // 2. Verify Razorpay Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error("RAZORPAY_KEY_SECRET is not configured on the server.");

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
    }

    // 3. Verify Owner
    const meResult = await strapiGet("/users/me?populate=*", token);
    const ownerId = meResult.id;
    if (!ownerId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    // 4. Duplicate Check (Idempotency)
    const existingPayment = await strapiGet(`/payments?filters[razorpayPaymentId][$eq]=${razorpay_payment_id}`, token);
    if (existingPayment?.data?.length > 0) {
       // Return existing successful data. In a real app we'd fetch and return the promotion/subscription details.
       return NextResponse.json({ success: true, message: "Payment already processed." });
    }

    // 5. Fetch Subscription Plan Details
    const pricingResult = await strapiGet("/pricing-config?populate=*", token);
    const pricingConfig = pricingResult?.data;
    const subPlan = (pricingConfig.subscriptionPlans || []).find(p => p.id == subscriptionPlanId);
    
    if (!subPlan) throw new Error("Subscription plan not found.");

    const price = parseFloat(subPlan.price || 0);
    const gstPct = parseFloat(pricingConfig.gstPercentage || 18);
    const gst = (price * gstPct) / 100;
    const totalAmount = price + gst;

    // 6. Create Payment Record
    const paymentRecord = await strapiPost("/payments", {
      data: {
        amount: price,
        gst: gst,
        totalAmount: totalAmount,
        currency: "INR",
        paymentType: "subscription",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
        paymentDate: new Date().toISOString(),
        owner: ownerId,
      }
    }, token);

    // 7. Activate Subscription — add all credits from the plan
    const boostCreditsToAdd = parseInt(subPlan.boostCredits || 0);
    const featuredCreditsToAdd = parseInt(subPlan.featuredCredits || 0);
    const highlightCreditsToAdd = parseInt(subPlan.highlightCredits || 0);

    const newBoostCredits = (meResult.boostCredits || 0) + boostCreditsToAdd;
    const newFeaturedCredits = (meResult.featuredCredits || 0) + featuredCreditsToAdd;
    const newHighlightCredits = (meResult.highlightCredits || 0) + highlightCreditsToAdd;

    const validUntil = new Date();
    if (subPlan.billingCycle === "yearly") {
      validUntil.setFullYear(validUntil.getFullYear() + 1);
    } else {
      validUntil.setMonth(validUntil.getMonth() + 1);
    }

    await strapiPut(`/users/${ownerId}`, {
      subscriptionTier: subPlan.name,
      subscriptionValidUntil: validUntil.toISOString(),
      boostCredits: newBoostCredits,
      featuredCredits: newFeaturedCredits,
      highlightCredits: newHighlightCredits,
    }, token);

    // 8. Handle Boost/Featured/Highlight context (if a property promotion was bundled)
    const CREDIT_FIELD_MAP = {
      boost: "boostCredits",
      featured: "featuredCredits",
      highlight: "highlightCredits",
    };
    const creditFieldMap = { boost: newBoostCredits, featured: newFeaturedCredits, highlight: newHighlightCredits };

    let promotionData = null;
    let finalCredits = { ...creditFieldMap };

    if (propertyId && planId && promotionType && CREDIT_FIELD_MAP[promotionType]) {
      const propResult = await strapiGet(`/properties/${propertyId}?filters[Owner][id][$eq]=${ownerId}&populate=*`, token);
      const property = propResult?.data?.[0] || propResult?.data;

      if (property) {
        const promoPlan = (pricingConfig.promotionPlans || []).find(p => p.id == planId);
        if (promoPlan && promoPlan.isActive && promoPlan.promotionType === promotionType) {
          const creditsRequired = promoPlan.creditsRequired || 1;
          const durationDays = promoPlan.durationDays || 7;
          const creditField = CREDIT_FIELD_MAP[promotionType];
          const availableCredits = finalCredits[promotionType] || 0;

          if (availableCredits >= creditsRequired) {
            const promoStartDate = new Date();
            const promoEndDate = new Date();
            promoEndDate.setDate(promoEndDate.getDate() + durationDays);

            const promoResult = await strapiPost("/promotions", {
              data: {
                promotionType,
                status: "active",
                startDate: promoStartDate.toISOString(),
                endDate: promoEndDate.toISOString(),
                durationDays,
                creditsUsed: creditsRequired,
                viewsBefore: property.Views || 0,
                savesBefore: property.Saves || 0,
                enquiriesBefore: property.enquiries?.length || 0,
                callsBefore: 0,
                viewsAfter: 0,
                savesAfter: 0,
                enquiriesAfter: 0,
                callsAfter: 0,
                owner: ownerId,
                property: property.id || parseInt(propertyId, 10),
                payment: paymentRecord?.data?.id,
              }
            }, token);

            promotionData = promoResult?.data;

            // Deduct the correct credits
            finalCredits[promotionType] = availableCredits - creditsRequired;
            await strapiPut(`/users/${ownerId}`, { [creditField]: finalCredits[promotionType] }, token);
          }
        }
      }
    }

    // 9. Return Unified Success Response
    const promotionCreditsUsed = promotionData ? (promotionData.creditsUsed || 1) : 0;
    return NextResponse.json({
      success: true,
      paymentId: paymentRecord?.data?.documentId || paymentRecord?.data?.id,
      razorpayPaymentId: razorpay_payment_id,
      amount: totalAmount,
      subscriptionName: subPlan.name,
      subscriptionValidUntil: validUntil.toISOString(),
      boostCreditsAdded: boostCreditsToAdd,
      featuredCreditsAdded: featuredCreditsToAdd,
      highlightCreditsAdded: highlightCreditsToAdd,
      creditsAdded: boostCreditsToAdd,
      creditsUsed: promotionCreditsUsed,
      remainingCredits: promotionType ? (finalCredits[promotionType] ?? newBoostCredits) : newBoostCredits,
      promotionType: promotionData?.promotionType || null,
      promotionId: promotionData ? (promotionData.documentId || promotionData.id) : null,
      promotionStartDate: promotionData ? promotionData.startDate : null,
      promotionEndDate: promotionData ? promotionData.endDate : null,
      promotionStatus: promotionData ? promotionData.status : null,
    });

  } catch (error) {
    console.error("PAYMENT VERIFY ERROR:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
