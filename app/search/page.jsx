import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

import { getHomePage } from "@/services/homePage";
import { searchPropertiesWithFilters } from "@/services/property";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;

  const q = params?.q || "";
  const purpose = params?.purpose || "";
  const location = params?.location || "";
  const type = params?.type || "";
  const budget = params?.budget || "";
  const category = params?.category || "";

  // Header Data
  const homePage = await getHomePage();

  // Search Result
  const hasFilters = q || purpose || location || type || budget || category;
  const properties = hasFilters
    ? await searchPropertiesWithFilters({ q, purpose, location, type, budget, category })
    : [];

  const formattedBudget = budget
    ? `Up to ₹${parseInt(budget, 10).toLocaleString("en-IN")}`
    : "";

  let displayLocation = "";
  if (location && purpose) displayLocation = `${purpose} in ${location}`;
  else if (location) displayLocation = `In ${location}`;
  else if (purpose) displayLocation = purpose;

  const searchTerms = [
    type && category ? `${type} › ${category}` : type || category,
    displayLocation,
    formattedBudget,
    q,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <HomeHeader header={homePage?.Header} />

      {/* Main */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "var(--container-max-width)",
          margin: "0 auto",
          padding: "40px var(--container-padding) 80px",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <Link
            href="/home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-btn)",
              color: "var(--text-muted)",
              fontSize: "13px",
              fontWeight: "600",
              padding: "8px 18px",
              cursor: "pointer",
              transition: "all 0.2s",
              textDecoration: "none"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-hover)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            ← Back
          </Link>
          
          <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "16px" }}>
            Search :<span style={{ fontWeight: "700", marginLeft: "8px", color: "var(--text-primary)" }}>{searchTerms || "All"}</span>
          </p>

          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
            {properties.length} Properties Found
          </p>
        </div>

        {properties.length === 0 ? (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-card)",
              padding: "clamp(40px, 6vw, 64px) 32px",
              textAlign: "center",
              marginTop: "48px"
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "var(--bg-section)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              🔍
            </div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "800",
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              No properties found
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                maxWidth: "380px",
                margin: "0 auto 4px",
                lineHeight: 1.6,
              }}
            >
              We couldn't find properties matching your search.
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
              }}
            >
              Try changing your location, property type, or budget.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {properties.map((property) => (
              <PropertyCard key={property.documentId} property={property} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer data={homePage?.Footer} />
    </div>
  );
}
