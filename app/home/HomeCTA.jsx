"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getPropertiesByType } from "@/services/property";

export default function HomeCTA() {
  const [propertiesCount, setPropertiesCount] = useState("Loading...");
  const [citiesCount, setCitiesCount] = useState("Loading...");

  useEffect(() => {
    async function fetchStats() {
      try {
        const props = await getPropertiesByType("all");
        if (Array.isArray(props)) {
          setPropertiesCount(props.length.toString());
          const cities = new Set(props.map(p => p.City).filter(Boolean));
          setCitiesCount(cities.size.toString());
        }
      } catch (err) {
        console.error("Failed to fetch stats for CTA:", err);
        setPropertiesCount("0");
        setCitiesCount("0");
      }
    }
    fetchStats();
  }, []);

  return (
    <section
      style={{
        width: "100%",
        padding: "96px 0",
        background: "linear-gradient(135deg, #0b100e 0%, #1a2c24 50%, #0b100e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background accents */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,148,61,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,66,53,0.4) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(780px, calc(100% - 48px))",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
        }}
      >
        {/* Tag */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            border: "1px solid rgba(200,148,61,0.3)",
            borderRadius: "999px",
            color: "#c8943d",
            fontSize: "11px",
            fontWeight: "800",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#c8943d" }} />
          Start Your Journey
        </span>

        <h2
          style={{
            margin: "0 0 20px",
            color: "#f7f1e5",
            fontSize: "clamp(36px, 5vw, 66px)",
            fontWeight: "800",
            lineHeight: "1.06",
            letterSpacing: "-2px",
          }}
        >
          Find the place that<br />
          <span style={{ color: "#c8943d" }}>feels like home.</span>
        </h2>

        <p
          style={{
            margin: "0 0 44px",
            color: "rgba(247,241,229,0.65)",
            fontSize: "clamp(16px, 2vw, 20px)",
            lineHeight: "1.6",
            maxWidth: "520px",
          }}
        >
          Thousands of verified properties across India&apos;s top cities. Your perfect home is one search away.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/properties/all"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "15px 32px",
              borderRadius: "14px",
              background: "#c8943d",
              color: "#0b100e",
              fontSize: "15px",
              fontWeight: "800",
              textDecoration: "none",
              transition: "background 0.2s ease, transform 0.15s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e3a948"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#c8943d"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            ⌕ Explore Properties
          </Link>

          <Link
            href="/post-property"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "15px 32px",
              borderRadius: "14px",
              background: "transparent",
              border: "1px solid rgba(247,241,229,0.2)",
              color: "#f7f1e5",
              fontSize: "15px",
              fontWeight: "700",
              textDecoration: "none",
              transition: "border-color 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(247,241,229,0.5)"; e.currentTarget.style.background = "rgba(247,241,229,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(247,241,229,0.2)"; e.currentTarget.style.background = "transparent"; }}
          >
            + Post Property
          </Link>
        </div>

        {/* Social proof numbers */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            marginTop: "56px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { value: propertiesCount, label: "Properties Listed" },
            { value: "5,000+", label: "Happy Families" },
            { value: citiesCount, label: "Cities Covered" },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ color: "#c8943d", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px" }}>
                {stat.value}
              </div>
              <div style={{ color: "#6e7e78", fontSize: "13px", fontWeight: "500", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
