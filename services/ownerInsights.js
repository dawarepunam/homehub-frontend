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
// GET ALL PROPERTY VIEWS (for owner analytics)
// =====================================================

export async function getOwnerPropertyViewsForInsights(propertyIds) {
  if (!propertyIds || !propertyIds.length) return [];

  const idSet = new Set(propertyIds.map(String));
  const viewsList = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const res = await safeFetch(
        `${API_URL}/property-views?pagination[pageSize]=100&pagination[page]=${page}&populate[property][fields][0]=id&populate[property][fields][1]=documentId&populate[viewer][fields][0]=id&sort=createdAt:desc`
      );
      const items = res?.data || [];
      for (const item of items) {
        const propId = String(item?.property?.id || "");
        const propDocId = String(item?.property?.documentId || "");
        if (idSet.has(propId) || idSet.has(propDocId)) {
          viewsList.push(item);
        }
      }
      const pageCount = res?.meta?.pagination?.pageCount || 1;
      if (page >= pageCount || items.length === 0) {
        hasMore = false;
      } else {
        page++;
      }
    } catch (e) {
      console.warn("Could not fetch page of property-views:", e);
      hasMore = false;
    }
  }

  return viewsList;
}

// =====================================================
// GET ALL USER SAVES (from buyer wishlists)
// =====================================================

export async function getOwnerPropertySavesForInsights(propertyIds) {
  if (!propertyIds || !propertyIds.length) return { savesByProp: {}, savesList: [] };

  const idSet = new Set(propertyIds.map(String));
  const savesList = [];
  const savesByProp = {};

  try {
    const res = await safeFetch(
      `${API_URL}/user-profiles?pagination[pageSize]=100&populate[Wishlist][populate][properties][populate][CoverImage]=true&populate[users_permissions_user][fields][0]=id&populate[users_permissions_user][fields][1]=username&populate[users_permissions_user][fields][2]=email`
    );
    const profiles = res?.data || [];

    for (const profile of profiles) {
      const buyer = profile?.users_permissions_user;
      const wishlistProps = profile?.Wishlist?.properties || [];

      for (const prop of wishlistProps) {
        const propId = String(prop?.id || "");
        const propDocId = String(prop?.documentId || "");

        if (idSet.has(propId) || idSet.has(propDocId)) {
          const matchKey = idSet.has(propId) ? propId : propDocId;
          savesByProp[matchKey] = (savesByProp[matchKey] || 0) + 1;
          savesByProp[propDocId] = (savesByProp[propDocId] || 0) + 1;
          savesByProp[propId] = (savesByProp[propId] || 0) + 1;

          savesList.push({
            id: `${profile.id}_${prop.id}`,
            savedAt: profile.updatedAt || profile.createdAt,
            buyerName: buyer?.username || "Buyer",
            buyerEmail: buyer?.email || "",
            property: prop,
          });
        }
      }
    }
  } catch (e) {
    console.warn("Could not fetch user-profiles for saves:", e);
  }

  return { savesByProp, savesList };
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

  // Normalised views score (benchmark: 50 views = 100)
  const viewsScore = Math.min(100, Math.round((views / 50) * 100));

  // Engagement: saves / views ratio (benchmark: 10% = 100)
  const engagementScore =
    views > 0 ? Math.min(100, Math.round((saves / views) * 1000)) : 0;

  // Enquiries score (benchmark: 10 enquiries = 100)
  const enquiryScore = Math.min(100, Math.round((enquiries / 10) * 100));

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
// GENERATE CHART DATA (From ACTUAL recorded views)
// =====================================================

export function generateChartData(totalValue, period, groupBy = "daily", actualViewRecords = []) {
  const { start, end } = getDateRange(period);
  const points = [];

  // Group actual view records by date bucket
  const viewTimestamps = (actualViewRecords || []).map((v) => new Date(v.createdAt));

  if (groupBy === "daily") {
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    for (let i = 0; i <= days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const count = viewTimestamps.filter((ts) => ts >= dayStart && ts <= dayEnd).length;
      points.push({
        label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        value: count,
      });
    }
  } else if (groupBy === "weekly") {
    let cur = new Date(start);
    let week = 1;
    while (cur <= end) {
      const next = new Date(cur);
      next.setDate(cur.getDate() + 7);
      const count = viewTimestamps.filter((ts) => ts >= cur && ts < next).length;
      points.push({
        label: `Week ${week}`,
        value: count,
      });
      cur = next;
      week++;
    }
  } else {
    // monthly
    const cur = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cur <= end) {
      const nextMonth = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
      const count = viewTimestamps.filter((ts) => ts >= cur && ts < nextMonth).length;
      points.push({
        label: cur.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        value: count,
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
  hasViewsData,
  hasEnquiriesData,
}) {
  const insights = [];

  if (hasViewsData && viewsGrowth !== null && viewsGrowth > 10) {
    insights.push({
      icon: "trending",
      text: `Your property views are ${viewsGrowth.toFixed(1)}% higher compared to the previous period.`,
      type: "positive",
      action: null,
    });
  } else if (hasViewsData && viewsGrowth !== null && viewsGrowth < -5) {
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
      text: `You have ${pendingEnquiries} active enquir${pendingEnquiries > 1 ? "ies" : "y"} waiting for your follow-up.`,
      type: "action",
      action: "/owner/enquiries/new",
    });
  }

  if (hasEnquiriesData && enquiryGrowth !== null && enquiryGrowth > 5) {
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
      text: `${siteVisitEnquiries.length} site visit${siteVisitEnquiries.length > 1 ? "s" : ""} scheduled. Stay prepared!`,
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
  const propertyDocIds = properties.map((p) => String(p?.documentId)).filter(Boolean);
  const allTargetIds = [...propertyIds, ...propertyDocIds];

  // Parallel fetch: Enquiries, Property Views, and User Wishlists (Saves)
  const [enquiries, allViewRecords, { savesByProp, savesList }] = await Promise.all([
    getOwnerEnquiriesForInsights(propertyIds),
    getOwnerPropertyViewsForInsights(allTargetIds),
    getOwnerPropertySavesForInsights(allTargetIds),
  ]);

  const { start, end } = getDateRange(period);
  const { start: prevStart, end: prevEnd } = getPreviousRange(period);

  // Period-filtered enquiries
  const currentEnquiries = enquiries.filter((e) =>
    inRange(e?.createdAt, start, end)
  );
  const prevEnquiries = enquiries.filter((e) =>
    inRange(e?.createdAt, prevStart, prevEnd)
  );

  // Period-filtered views
  const currentViewRecords = allViewRecords.filter((v) =>
    inRange(v?.createdAt, start, end)
  );
  const prevViewRecords = allViewRecords.filter((v) =>
    inRange(v?.createdAt, prevStart, prevEnd)
  );

  // Actual Views counts
  const totalViews = currentViewRecords.length;
  const prevTotalViews = prevViewRecords.length;

  // Actual Saves count for selected properties
  const propertySavesList = savesList.filter((s) => {
    const pid = String(s?.property?.id || "");
    const pdoc = String(s?.property?.documentId || "");
    return allTargetIds.includes(pid) || allTargetIds.includes(pdoc);
  });
  const totalSaves = propertySavesList.length;

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
    if (prev === 0 && cur === 0) return null; // Not enough data to fabricate a percentage
    if (prev === 0) return cur > 0 ? 100 : null;
    return Math.round(((cur - prev) / prev) * 100 * 10) / 10;
  }

  const enquiryGrowth = growth(totalEnquiries, prevTotalEnquiries);
  const viewsGrowth = growth(totalViews, prevTotalViews);

  // Enquiry status breakdown for donut chart
  const enquiryStatusMap = {};
  currentEnquiries.forEach((e) => {
    const s = e?.Statuss || e?.Status || "Pending";
    enquiryStatusMap[s] = (enquiryStatusMap[s] || 0) + 1;
  });

  // Pre-index views by property
  const viewsByProp = {};
  for (const v of currentViewRecords) {
    const pid = String(v?.property?.id || "");
    const pdoc = String(v?.property?.documentId || "");
    if (pid) viewsByProp[pid] = (viewsByProp[pid] || 0) + 1;
    if (pdoc) viewsByProp[pdoc] = (viewsByProp[pdoc] || 0) + 1;
  }

  // Property-wise performance table
  const propertyPerformance = properties.map((prop) => {
    const propId = String(prop?.id);
    const propDocId = String(prop?.documentId || "");

    const propEnquiries = currentEnquiries.filter(
      (e) => String(e?.property?.id ?? e?.property?.data?.id) === propId
    );
    const propSiteVisits = propEnquiries.filter((e) => {
      const s = (e?.Statuss || "").toLowerCase().trim();
      return s.includes("site visit") || s === "scheduled" || s === "completed";
    });

    const views = viewsByProp[propDocId] || viewsByProp[propId] || 0;
    const saves = savesByProp[propDocId] || savesByProp[propId] || 0;

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
    enquiries: currentEnquiries,
    period,
    viewsGrowth,
    enquiryGrowth,
    pendingEnquiries,
    hasViewsData: prevTotalViews > 0,
    hasEnquiriesData: prevTotalEnquiries > 0,
  });

  return {
    owner,
    allProperties,
    properties,
    period,
    kpis: {
      views: { value: totalViews, growth: viewsGrowth },
      enquiries: { value: totalEnquiries, growth: enquiryGrowth },
      saves: { value: totalSaves, growth: null },
      contactActions: { value: contactActions, growth: null },
      siteVisits: { value: siteVisitEnq.length, growth: null },
    },
    enquiryStatusBreakdown: enquiryStatusMap,
    propertyPerformance,
    insights,
    pendingEnquiries,
    currentViewRecords,
    savedProperties: propertySavesList,
  };
}
