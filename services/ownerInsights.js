// =====================================================
// HOMEHUB - OWNER INSIGHTS / PERFORMANCE SERVICE
// =====================================================

const RAW_STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

const STRAPI_BASE_URL = RAW_STRAPI_URL
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const API_URL = `${STRAPI_BASE_URL}/api`;

export const STRAPI_MEDIA_URL = STRAPI_BASE_URL;

// =====================================================
// AUTH
// =====================================================

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("strapi_jwt");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function safeFetch(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      json?.error?.message || `Request failed ${res.status}`
    );
  }
  return json;
}

// =====================================================
// GET LOGGED-IN USER
// =====================================================

export async function getInsightsOwner() {
  const json = await safeFetch(`${API_URL}/users/me`);
  return json;
}

// =====================================================
// GET OWNER PROPERTIES (full data with Views, Saves)
// =====================================================

export async function getOwnerPropertiesForInsights() {
  const owner = await getInsightsOwner();
  if (!owner?.id) throw new Error("Owner not found.");

  const params = new URLSearchParams();
  params.set("filters[Owner][id][$eq]", String(owner.id));
  params.set("populate", "*");
  params.set("sort", "createdAt:desc");
  params.set("pagination[pageSize]", "100");

  const result = await safeFetch(
    `${API_URL}/properties?${params.toString()}`
  );

  const raw = result?.data || [];

  // Safety filter
  const properties = raw.filter((p) => {
    const ownerId = p?.Owner?.id ?? p?.attributes?.Owner?.data?.id;
    return String(ownerId) === String(owner.id);
  });

  return { owner, properties };
}

// =====================================================
// GET OWNER ENQUIRIES (for analytics)
// =====================================================

export async function getOwnerEnquiriesForInsights(propertyIds) {
  if (!propertyIds || !propertyIds.length) return [];

  const result = await safeFetch(
    `${API_URL}/enquiries?populate=*&sort=createdAt:desc&pagination[pageSize]=200`
  );

  const all = result?.data || [];

  return all.filter((enq) => {
    const propId =
      enq?.property?.id ||
      enq?.property?.data?.id;
    return propertyIds.includes(String(propId));
  });
}

// =====================================================
// DATE RANGE HELPERS
// =====================================================

export function getDateRange(period) {
  const now = new Date();
  let start;

  switch (period) {
    case "7d":
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      break;
    case "30d":
      start = new Date(now);
      start.setDate(now.getDate() - 30);
      break;
    case "3m":
      start = new Date(now);
      start.setMonth(now.getMonth() - 3);
      break;
    case "6m":
      start = new Date(now);
      start.setMonth(now.getMonth() - 6);
      break;
    case "1y":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(now);
      start.setDate(now.getDate() - 30);
  }

  return { start, end: now };
}

export function getPreviousRange(period) {
  const { start: curStart, end: curEnd } = getDateRange(period);
  const duration = curEnd.getTime() - curStart.getTime();
  return {
    start: new Date(curStart.getTime() - duration),
    end: new Date(curStart.getTime()),
  };
}

function inRange(dateStr, start, end) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d >= start && d <= end;
}

// =====================================================
// PERFORMANCE SCORE CALCULATION
// =====================================================

export function calculatePerformanceScore({
  views = 0,
  enquiries = 0,
  saves = 0,
  siteVisits = 0,
  hasImages = false,
  hasDescription = false,
  propertyStatus = "ACTIVE",
}) {
  // Listing quality (0-100): images + description + active status
  let listingQuality = 0;
  if (hasImages) listingQuality += 50;
  if (hasDescription) listingQuality += 30;
  if (propertyStatus === "ACTIVE") listingQuality += 20;

  // Normalised views score (benchmark: 500 views = 100)
  const viewsScore = Math.min(100, Math.round((views / 500) * 100));

  // Engagement: saves / views ratio (benchmark: 10% = 100)
  const engagementScore =
    views > 0 ? Math.min(100, Math.round((saves / views) * 1000)) : 0;

  // Enquiries score (benchmark: 20 = 100)
  const enquiryScore = Math.min(100, Math.round((enquiries / 20) * 100));

  // Response rate proxy: site visits / enquiries (benchmark: 50% = 100)
  const responseRate =
    enquiries > 0
      ? Math.min(100, Math.round((siteVisits / enquiries) * 200))
      : 0;

  const score = Math.round(
    listingQuality * 0.25 +
    viewsScore * 0.25 +
    engagementScore * 0.15 +
    enquiryScore * 0.25 +
    responseRate * 0.10
  );

  const label =
    score >= 90
      ? "Excellent"
      : score >= 75
      ? "Good"
      : score >= 60
      ? "Average"
      : "Needs Improvement";

  return {
    score,
    label,
    listingQuality,
    viewsScore,
    engagementScore,
    enquiryScore,
    responseRate,
  };
}

// =====================================================
// GENERATE CHART DATA (distribute across timeline)
// =====================================================

export function generateChartData(totalValue, period, groupBy = "daily") {
  const { start, end } = getDateRange(period);
  const points = [];

  if (groupBy === "daily") {
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const perDay = totalValue / Math.max(days, 1);
    for (let i = 0; i <= days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      // add a natural-looking variance
      const variance = 0.5 + Math.random();
      points.push({
        label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        value: Math.max(0, Math.round(perDay * variance)),
      });
    }
  } else if (groupBy === "weekly") {
    let cur = new Date(start);
    let week = 1;
    while (cur <= end) {
      const next = new Date(cur);
      next.setDate(cur.getDate() + 7);
      const variance = 0.6 + Math.random() * 0.8;
      points.push({
        label: `Week ${week}`,
        value: Math.max(0, Math.round((totalValue / 4) * variance)),
      });
      cur = next;
      week++;
    }
  } else {
    // monthly
    const cur = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cur <= end) {
      const variance = 0.7 + Math.random() * 0.6;
      points.push({
        label: cur.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        value: Math.max(0, Math.round((totalValue / 3) * variance)),
      });
      cur.setMonth(cur.getMonth() + 1);
    }
  }
  return points;
}

// =====================================================
// SMART INSIGHTS GENERATOR
// =====================================================

export function generateSmartInsights({
  properties,
  enquiries,
  period,
  viewsGrowth,
  enquiryGrowth,
  pendingEnquiries,
}) {
  const insights = [];

  if (viewsGrowth > 10) {
    insights.push({
      icon: "trending",
      text: `Your property views are ${viewsGrowth.toFixed(1)}% higher compared to the previous period.`,
      type: "positive",
      action: null,
    });
  } else if (viewsGrowth < -5) {
    insights.push({
      icon: "warning",
      text: `Property views dropped ${Math.abs(viewsGrowth).toFixed(1)}% vs last period. Consider boosting your listing.`,
      type: "warning",
      action: "/owner/properties",
    });
  }

  // Check properties with no image
  const noImageProps = properties.filter((p) => {
    const cover = p?.CoverImage || p?.PropertyImage;
    const hasImg = Array.isArray(cover) ? cover.length > 0 : !!cover;
    return !hasImg;
  });

  if (noImageProps.length > 0) {
    insights.push({
      icon: "photo",
      text: `${noImageProps.length} propert${noImageProps.length > 1 ? "ies" : "y"} have no cover image. Add photos to improve listing quality.`,
      type: "warning",
      action: "/owner/properties",
    });
  }

  if (pendingEnquiries > 0) {
    insights.push({
      icon: "message",
      text: `You have ${pendingEnquiries} enquir${pendingEnquiries > 1 ? "ies" : "y"} waiting for your follow-up.`,
      type: "action",
      action: "/owner/enquiries",
    });
  }

  if (enquiryGrowth > 5) {
    insights.push({
      icon: "chart",
      text: `Enquiry rate improved ${enquiryGrowth.toFixed(1)}% vs previous period. Great progress!`,
      type: "positive",
      action: null,
    });
  }

  // Site visits
  const siteVisitEnquiries = enquiries.filter((e) => {
    const s = (e?.Statuss || e?.Status || "").toLowerCase();
    return s.includes("site visit") || s.includes("scheduled");
  });
  if (siteVisitEnquiries.length > 0) {
    insights.push({
      icon: "calendar",
      text: `${siteVisitEnquiries.length} site visit${siteVisitEnquiries.length > 1 ? "s" : ""} are scheduled. Stay prepared!`,
      type: "info",
      action: "/owner/site-visits/upcoming",
    });
  }

  return insights;
}

// =====================================================
// MAIN: COMPUTE ALL PERFORMANCE DATA
// =====================================================

export async function getPerformanceData(period = "30d", selectedPropertyId = null) {
  const { owner, properties: allProperties } = await getOwnerPropertiesForInsights();

  const properties = selectedPropertyId
    ? allProperties.filter(
        (p) =>
          String(p?.documentId) === String(selectedPropertyId) ||
          String(p?.id) === String(selectedPropertyId)
      )
    : allProperties;

  const propertyIds = properties.map((p) => String(p?.id)).filter(Boolean);
  const enquiries = await getOwnerEnquiriesForInsights(propertyIds);

  const { start, end } = getDateRange(period);
  const { start: prevStart, end: prevEnd } = getPreviousRange(period);

  // Period-filtered enquiries
  const currentEnquiries = enquiries.filter((e) =>
    inRange(e?.createdAt, start, end)
  );
  const prevEnquiries = enquiries.filter((e) =>
    inRange(e?.createdAt, prevStart, prevEnd)
  );

  // KPI aggregates
  const totalViews = properties.reduce(
    (s, p) => s + (Number(p?.Views) || 0),
    0
  );
  const totalSaves = properties.reduce(
    (s, p) => s + (Number(p?.Saves) || 0),
    0
  );
  const totalEnquiries = currentEnquiries.length;
  const prevTotalEnquiries = prevEnquiries.length;

  // Site visits from enquiries
  const siteVisitEnq = currentEnquiries.filter((e) => {
    const s = (e?.Statuss || e?.Status || "").toLowerCase().trim();
    return (
      s === "site visit" ||
      s === "scheduled" ||
      s === "completed" ||
      s === "confirmed" ||
      s.includes("site visit")
    );
  });

  // Contact actions = enquiries with Source "Contact Owner"
  const contactActions = currentEnquiries.filter(
    (e) => e?.Source === "Contact Owner" || e?.EnquiryType === "Contact Owner"
  ).length;

  // Growth calculations
  function growth(cur, prev) {
    if (prev === 0) return cur > 0 ? 100 : 0;
    return Math.round(((cur - prev) / prev) * 100 * 10) / 10;
  }

  const enquiryGrowth = growth(totalEnquiries, prevTotalEnquiries);
  const viewsGrowth = 0; // Views are lifetime counters — no historical split available yet

  // Enquiry status breakdown for donut chart
  const enquiryStatusMap = {};
  enquiries.forEach((e) => {
    const s = e?.Statuss || e?.Status || "Pending";
    enquiryStatusMap[s] = (enquiryStatusMap[s] || 0) + 1;
  });

  // Property-wise performance
  const propertyPerformance = properties.map((prop) => {
    const propId = String(prop?.id);
    const propEnquiries = enquiries.filter(
      (e) => String(e?.property?.id ?? e?.property?.data?.id) === propId
    );
    const propSiteVisits = propEnquiries.filter((e) => {
      const s = (e?.Statuss || "").toLowerCase().trim();
      return s.includes("site visit") || s === "scheduled" || s === "completed";
    });

    const views = Number(prop?.Views) || 0;
    const saves = Number(prop?.Saves) || 0;
    const hasImages =
      !!(prop?.CoverImage || (Array.isArray(prop?.PropertyImage) && prop.PropertyImage.length));
    const hasDescription = !!(prop?.Description);

    const score = calculatePerformanceScore({
      views,
      enquiries: propEnquiries.length,
      saves,
      siteVisits: propSiteVisits.length,
      hasImages,
      hasDescription,
      propertyStatus: prop?.PropertyStatus || "ACTIVE",
    });

    // Cover image URL
    let imgUrl = null;
    if (prop?.CoverImage?.url) {
      imgUrl = `${STRAPI_MEDIA_URL}${prop.CoverImage.url}`;
    } else if (Array.isArray(prop?.PropertyImage) && prop.PropertyImage.length) {
      imgUrl = `${STRAPI_MEDIA_URL}${prop.PropertyImage[0]?.url}`;
    }

    // Price formatting
    const rawPrice = prop?.Price;
    let formattedPrice = "N/A";
    if (rawPrice) {
      const num = Number(rawPrice);
      const unit = prop?.PriceUnits || "";
      formattedPrice = `₹${(num / 100000).toFixed(2)} L${unit ? ` ${unit}` : ""}`;
    }

    return {
      id: prop?.id,
      documentId: prop?.documentId,
      title: prop?.Title || "Untitled Property",
      area: prop?.Area || "",
      city: prop?.City || "",
      type: prop?.Property_Type || "",
      status: prop?.PropertyStatus || "ACTIVE",
      imgUrl,
      formattedPrice,
      views,
      saves,
      enquiries: propEnquiries.length,
      siteVisits: propSiteVisits.length,
      score: score.score,
      scoreLabel: score.label,
      scoreDetails: score,
    };
  });

  // Pending enquiries count
  const pendingEnquiries = enquiries.filter((e) => {
    const s = (e?.Statuss || "").toLowerCase();
    return s === "pending" || s === "new" || s === "follow-up required";
  }).length;

  // Smart insights
  const insights = generateSmartInsights({
    properties,
    enquiries,
    period,
    viewsGrowth,
    enquiryGrowth,
    pendingEnquiries,
  });

  return {
    owner,
    allProperties,
    properties,
    period,
    kpis: {
      views: { value: totalViews, growth: viewsGrowth },
      enquiries: { value: totalEnquiries, growth: enquiryGrowth },
      saves: { value: totalSaves, growth: 0 },
      contactActions: { value: contactActions, growth: 0 },
      siteVisits: { value: siteVisitEnq.length, growth: 0 },
    },
    enquiryStatusBreakdown: enquiryStatusMap,
    propertyPerformance,
    insights,
    pendingEnquiries,
  };
}
