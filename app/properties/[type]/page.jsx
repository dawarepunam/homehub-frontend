"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import PropertyList from "@/components/PropertyList";
import { getHomePage } from "@/services/homePage";
import { getPropertiesByType } from "@/services/property";

/* ─────────────────────────────────────────────────────────────
   CATEGORY LABEL MAP
───────────────────────────────────────────────────────────── */
const CATEGORY_LABELS = {
  all: "All",
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
};

export default function PropertyTypePage() {
  const params = useParams();
  const router = useRouter();
  const type = params?.type || "all";

  const [homeData, setHomeData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Sort State
  const [sort, setSort] = useState("newest");

  const label = CATEGORY_LABELS[type?.toLowerCase()] || "All";

  /* ── Fetch home page data for Header / Footer ── */
  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        const [home, props] = await Promise.all([
          getHomePage(),
          getPropertiesByType(type),
        ]);
        setHomeData(home);
        setProperties(Array.isArray(props) ? props : []);
      } catch (err) {
        console.error("PropertyTypePage fetch error:", err);
        setError("Failed to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [type]);

  // Client-side Sort
  const sortedProperties = [...properties].sort((a, b) => {
    const priceA = a?.PropertyCommonDetails?.PricingDetails?.ExpectedPrice || a?.Price || 0;
    const priceB = b?.PropertyCommonDetails?.PricingDetails?.ExpectedPrice || b?.Price || 0;
    
    if (sort === "price-low") return priceA - priceB;
    if (sort === "price-high") return priceB - priceA;
    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
  });

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── PUBLIC HOMEHUB HEADER ── */}
      <HomeHeader header={homeData?.Header} />

      {/* ── MAIN CONTENT ── */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "var(--container-max-width)",
          margin: "0 auto",
          padding: "40px var(--container-padding) 80px",
        }}
      >
        {/* ── BACK BUTTON ── */}
        <div style={{ marginBottom: "24px" }}>
          <button
            onClick={() => router.push("/home")}
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
            ← Back to Home
          </button>
        </div>

        {/* ── PAGE HEADING ── */}
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: "800",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: "8px",
            }}
          >
            {label} Properties
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            Browse available properties listed by verified owners.
          </p>
        </div>

        {/* ── CONTROLS (FILTER & SORT) ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "32px",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-card)",
          padding: "12px 20px",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)"
        }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: "600" }}>Property Type:</span>
            <select
              value={type?.toLowerCase()}
              onChange={(e) => router.push(`/properties/${e.target.value}`)}
              style={{
                background: "var(--bg-page)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
                padding: "7px 14px",
                borderRadius: "var(--radius-btn)",
                fontSize: "13px",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="all">All</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
          
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: "600" }}>Sort By:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                background: "var(--bg-page)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
                padding: "7px 14px",
                borderRadius: "var(--radius-btn)",
                fontSize: "13px",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ── LOADING STATE ── */}
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "280px",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                border: "2px solid var(--border-subtle)",
                borderTop: "2px solid var(--text-primary)",
                borderRadius: "50%",
                animation: "spin 0.9s linear infinite",
              }}
            />
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Loading {label.toLowerCase()} properties…
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {!loading && error && (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-card)",
              padding: "32px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* ── PROPERTY LIST ── */}
        {!loading && !error && sortedProperties.length > 0 && (
          <>
            {/* Count badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "20px",
                padding: "5px 14px",
                marginBottom: "24px",
              }}
            >
              <span style={{ color: "var(--text-primary)", fontWeight: "700", fontSize: "14px" }}>
                {sortedProperties.length}
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                {sortedProperties.length === 1 ? "property" : "properties"} found
              </span>
            </div>

            {/* Responsive grid wrapper */}
            <PropertyList properties={sortedProperties} ownerMode={false} />
          </>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && !error && properties.length === 0 && (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-card)",
              padding: "clamp(40px, 6vw, 64px) 32px",
              textAlign: "center",
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
              🏘️
            </div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "800",
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              No {label} Properties Found
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                maxWidth: "380px",
                margin: "0 auto 24px",
                lineHeight: 1.6,
              }}
            >
              There are currently no {label.toLowerCase()} properties available.
              Check back later or explore another category.
            </p>
            <Link
              href="/home"
              style={{
                display: "inline-block",
                background: "var(--btn-primary-bg)",
                color: "var(--btn-primary-text)",
                fontWeight: "700",
                fontSize: "13px",
                padding: "10px 24px",
                borderRadius: "var(--radius-btn)",
                textDecoration: "none",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        )}
      </main>

      {/* ── PUBLIC HOMEHUB FOOTER ── */}
      <Footer data={homeData?.Footer} />
    </div>
  );
}