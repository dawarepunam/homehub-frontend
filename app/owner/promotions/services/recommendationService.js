import { getOwnerProperties } from "../../../../services/ownerProperties";

/**
 * Normalizes an array of values to a 0-1 range relative to min/max.
 */
function normalizeScore(value, min, max) {
  if (max === min) return 0.5; // If all properties have same value, score it average
  return (value - min) / (max - min);
}

/**
 * Generates a dynamic reason based on the property metrics.
 */
function generateReason(prop, allPropsStats) {
  if (prop.enquiries > allPropsStats.avgEnquiries * 1.5) {
    return "This property is already generating strong enquiries and may benefit from additional visibility.";
  }
  
  if (prop.views > allPropsStats.avgViews && prop.enquiries < allPropsStats.avgEnquiries) {
    return "Your property is getting strong visibility but fewer enquiries. Consider boosting it to capture more leads.";
  }
  
  if (prop.saves > allPropsStats.avgSaves * 1.2) {
    return "This property is receiving strong interest from users based on saves.";
  }

  if (prop.views < allPropsStats.avgViews * 0.5) {
    return "This property has relatively low visibility compared with your other listings. Boosting will help get it noticed.";
  }

  if (prop.recencyScore > 0.8) {
    return "This is a recently added or updated property. Promoting it early can help build momentum.";
  }

  return "Steady overall performance. A boost can help maintain or improve its visibility in search results.";
}

/**
 * Fetches owner properties and calculates AI Recommendations.
 */
export async function getSmartRecommendations() {
  try {
    // 1. Reuse existing authenticated fetching logic (safely gets ONLY this owner's properties)
    const properties = await getOwnerProperties();

    if (!properties || properties.length === 0) {
      return { properties: [], bestProperty: null, performanceOpportunity: null };
    }

    // 2. Extract and format metrics
    const now = Date.now();
    const propsWithMetrics = properties.map(p => {
      // Calculate recency based on updatedAt (fallback to createdAt). Closer to 'now' means higher timestamp.
      const lastActive = new Date(p.updatedAt || p.createdAt || Date.now()).getTime();
      
      return {
        id: p.id,
        documentId: p.documentId,
        title: p.Title || "Untitled Property",
        location: p.Locality ? `${p.Locality}, ${p.City}` : (p.City || "Unknown Location"),
        image: p.CoverImage?.[0]?.url || p.PropertyImage?.[0]?.url || null,
        propertyType: p.Property_Type || "Property",
        views: parseInt(p.Views) || 0,
        saves: parseInt(p.Saves) || 0,
        enquiries: Array.isArray(p.enquiries) ? p.enquiries.length : 0,
        lastActiveMs: lastActive,
        originalData: p
      };
    });

    // 3. Find global min/max/averages for normalization
    let minViews = Infinity, maxViews = -Infinity, totalViews = 0;
    let minSaves = Infinity, maxSaves = -Infinity, totalSaves = 0;
    let minEnq = Infinity, maxEnq = -Infinity, totalEnq = 0;
    let minRecency = Infinity, maxRecency = -Infinity;

    propsWithMetrics.forEach(p => {
      if (p.views < minViews) minViews = p.views;
      if (p.views > maxViews) maxViews = p.views;
      totalViews += p.views;

      if (p.saves < minSaves) minSaves = p.saves;
      if (p.saves > maxSaves) maxSaves = p.saves;
      totalSaves += p.saves;

      if (p.enquiries < minEnq) minEnq = p.enquiries;
      if (p.enquiries > maxEnq) maxEnq = p.enquiries;
      totalEnq += p.enquiries;

      if (p.lastActiveMs < minRecency) minRecency = p.lastActiveMs;
      if (p.lastActiveMs > maxRecency) maxRecency = p.lastActiveMs;
    });

    const count = propsWithMetrics.length;
    const stats = {
      avgViews: totalViews / count,
      avgSaves: totalSaves / count,
      avgEnquiries: totalEnq / count
    };

    // 4. Calculate Scores (0-100)
    // Weights: Views = 30%, Enquiries = 30%, Saves = 20%, Recency = 20%
    propsWithMetrics.forEach(p => {
      const vScore = normalizeScore(p.views, minViews, maxViews);
      const eScore = normalizeScore(p.enquiries, minEnq, maxEnq);
      const sScore = normalizeScore(p.saves, minSaves, maxSaves);
      const rScore = normalizeScore(p.lastActiveMs, minRecency, maxRecency);
      
      p.recencyScore = rScore; // Save for reason generation

      // If only one property exists, max === min, so normalizeScore gives 0.5 for all. 
      // That would mean 50/100 score. To make it look a bit more realistic for single property:
      let finalScore = (vScore * 30) + (eScore * 30) + (sScore * 20) + (rScore * 20);
      
      if (count === 1) {
        // Fallback for single property: just base it on arbitrary good thresholds so it isn't always exactly 50
        const syntheticV = Math.min(p.views / 500, 1) * 30;
        const syntheticE = Math.min(p.enquiries / 10, 1) * 30;
        const syntheticS = Math.min(p.saves / 20, 1) * 20;
        finalScore = Math.round(syntheticV + syntheticE + syntheticS + 15); // +15 base recency
      } else {
        finalScore = Math.round(finalScore);
      }

      // Clamp between 10 and 99 for aesthetic realism
      p.score = Math.max(10, Math.min(99, finalScore));
      
      // 5. Generate Data-driven Reason
      p.reason = generateReason(p, stats);
      p.suggestedAction = "Boost This Property";
    });

    // Sort by highest score
    propsWithMetrics.sort((a, b) => b.score - a.score);

    // Identify recommendations
    const bestProperty = propsWithMetrics[0] || null;
    let performanceOpportunity = null;

    if (propsWithMetrics.length > 1) {
      // Find a property with high views but low enquiries, or just the second best property
      performanceOpportunity = propsWithMetrics.find(p => p.id !== bestProperty.id && p.views > stats.avgViews && p.enquiries < stats.avgEnquiries) 
                            || propsWithMetrics[1];
    }

    return {
      bestProperty,
      performanceOpportunity,
      recommendations: propsWithMetrics
    };

  } catch (error) {
    console.error("SMART RECOMMENDATION ERROR:", error);
    throw error;
  }
}
