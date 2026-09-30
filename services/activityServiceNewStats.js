export async function getPropertyStats(propertyDocumentId) {
  try {
    const res = await fetch(`${API_URL}/properties/stats/${propertyDocumentId}`, {
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.warn("Error fetching stats:", data);
      return { views: [], saves: [], enquiries: [] };
    }
    return data;
  } catch (error) {
    console.warn("Could not fetch property stats:", error);
    return { views: [], saves: [], enquiries: [] };
  }
}
