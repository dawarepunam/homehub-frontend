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
    // Extract price from PropertyCommonDetails if it exists, otherwise root
    const priceA = a?.PropertyCommonDetails?.PricingDetails?.ExpectedPrice || a?.Price || 0;
    const priceB = b?.PropertyCommonDetails?.PricingDetails?.ExpectedPrice || b?.Price || 0;
    
    if (sort === "price-low") return priceA - priceB;
    if (sort === "price-high") return priceB - priceA;
    // newest
    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
  });

  return (
    <div
      style={{ background: "#0f1311", minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* ── PUBLIC HOMEHUB HEADER ── */}
      <HomeHeader header={homeData?.Header} />

      {/* ── MAIN CONTENT ── */}
      <main
        style={{
          flex: 1,
          width: "min(1480px, 94%)",
          margin: "0 auto",
          paddingTop: "40px",
          paddingBottom: "80px",
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
              border: "1px solid rgba(185,152,82,0.35)",
              borderRadius: "10px",
              color: "#B99852",
              fontSize: "14px",
              fontWeight: "600",
              padding: "9px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(185,152,82,0.12)";
              e.currentTarget.style.borderColor = "#B99852";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(185,152,82,0.35)";
            }}
          >
            ← Back to Home
          </button>
        </div>

        {/* ── PAGE HEADING ── */}
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "clamp(26px, 5vw, 42px)",
              fontWeight: "800",
              color: "#F7F0E3",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: "10px",
            }}
          >
            {label} Properties
          </h1>
          <p
            style={{
              color: "#8D9E95",
              fontSize: "clamp(14px, 2vw, 16px)",
              marginTop: "6px",
            }}
          >
            Browse available properties listed by verified owners.
          </p>
        </div>

        {/* ── CONTROLS (FILTER & SORT) ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "40px",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#161b18",
          padding: "16px 24px",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: "#8D9E95", fontSize: "14px", fontWeight: "600" }}>Property Type:</span>
            <select
              value={type?.toLowerCase()}
              onChange={(e) => router.push(`/properties/${e.target.value}`)}
              style={{
                background: "#0f1311",
                color: "#F7F0E3",
                border: "1px solid rgba(185,152,82,0.3)",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
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
          
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: "#8D9E95", fontSize: "14px", fontWeight: "600" }}>Sort By:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                background: "#0f1311",
                color: "#F7F0E3",
                border: "1px solid rgba(185,152,82,0.3)",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
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
              minHeight: "320px",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                border: "3px solid rgba(185,152,82,0.15)",
                borderTop: "3px solid #B99852",
                borderRadius: "50%",
                animation: "spin 0.9s linear infinite",
              }}
            />
            <p style={{ color: "#8D9E95", fontSize: "15px" }}>
              Loading {label.toLowerCase()} properties…
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {!loading && error && (
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "16px",
              padding: "40px 32px",
              textAlign: "center",
              color: "#F87171",
              fontSize: "15px",
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
                gap: "8px",
                background: "rgba(185,152,82,0.10)",
                border: "1px solid rgba(185,152,82,0.25)",
                borderRadius: "20px",
                padding: "6px 18px",
                marginBottom: "28px",
              }}
            >
              <span style={{ color: "#B99852", fontWeight: "700", fontSize: "15px" }}>
                {sortedProperties.length}
              </span>
              <span style={{ color: "#8D9E95", fontSize: "14px" }}>
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
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(217,209,194,0.12)",
              borderRadius: "20px",
              padding: "clamp(40px, 8vw, 80px) 32px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(185,152,82,0.08)",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "28px",
              }}
            >
              🏘️
            </div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#F7F0E3",
                marginBottom: "10px",
              }}
            >
              No {label} Properties Found
            </h2>
            <p
              style={{
                color: "#8D9E95",
                fontSize: "15px",
                maxWidth: "420px",
                margin: "0 auto 28px",
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
                background: "linear-gradient(135deg, #B99852, #D7AE62)",
                color: "#0f1311",
                fontWeight: "700",
                fontSize: "14px",
                padding: "12px 28px",
                borderRadius: "10px",
                textDecoration: "none",
                letterSpacing: "0.03em",
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