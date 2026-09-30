"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Surface definitions:
// forest   → #0D3326  (cream text, gold accent)
// emerald  → #174638  (cream text, gold accent)
// olive    → #3E4B32  (cream text, muted gold)
// sand     → #DCCCB0  (dark green text)
// earth    → #9B6848  (cream text, gold accent)

const surfaceConfig = {
  forest: {
    bg: "#0D3326",
    text: "#F5EDD9",
    sub: "rgba(245,237,217,0.55)",
    iconBg: "rgba(215,174,98,0.15)",
    iconColor: "#D7AE62",
    border: "rgba(215,174,98,0.0)",
    hoverBorder: "#D7AE62",
    decor: "rgba(215,174,98,0.06)",
  },
  emerald: {
    bg: "#174638",
    text: "#F5EDD9",
    sub: "rgba(245,237,217,0.55)",
    iconBg: "rgba(215,174,98,0.15)",
    iconColor: "#D7AE62",
    border: "rgba(215,174,98,0.0)",
    hoverBorder: "#D7AE62",
    decor: "rgba(215,174,98,0.06)",
  },
  olive: {
    bg: "#3E4B32",
    text: "#F5EDD9",
    sub: "rgba(245,237,217,0.55)",
    iconBg: "rgba(215,174,98,0.12)",
    iconColor: "#C9A94F",
    border: "rgba(215,174,98,0.0)",
    hoverBorder: "#D7AE62",
    decor: "rgba(215,174,98,0.05)",
  },
  sand: {
    bg: "#DCCCB0",
    text: "#0D3326",
    sub: "#5a6b5a",
    iconBg: "rgba(13,51,38,0.1)",
    iconColor: "#0D3326",
    border: "rgba(13,51,38,0.0)",
    hoverBorder: "#0D3326",
    decor: "rgba(13,51,38,0.04)",
  },
  earth: {
    bg: "#9B6848",
    text: "#F5EDD9",
    sub: "rgba(245,237,217,0.6)",
    iconBg: "rgba(215,174,98,0.15)",
    iconColor: "#D7AE62",
    border: "rgba(215,174,98,0.0)",
    hoverBorder: "#D7AE62",
    decor: "rgba(215,174,98,0.06)",
  },
};

export default function AdminSummaryCard({
  title,
  value,
  icon: Icon,
  description,
  surface = "forest",
  href,
  secondaryStats,   // array of { label, value } — only pass real data
}) {
  const [hovered, setHovered] = useState(false);
  const s = surfaceConfig[surface] || surfaceConfig.forest;

  const cardStyle = {
    background: s.bg,
    border: `1.5px solid ${hovered ? s.hoverBorder : s.border}`,
    borderRadius: "20px",
    padding: "28px 24px 22px",
    position: "relative",
    overflow: "hidden",
    cursor: href ? "pointer" : "default",
    transform: hovered ? "translateY(-4px)" : "translateY(0)",
    boxShadow: hovered
      ? "0 16px 48px rgba(0,0,0,0.22), 0 0 0 1.5px " + s.hoverBorder + "33"
      : "0 4px 18px rgba(0,0,0,0.13)",
    transition: "transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease",
  };

  const inner = (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Decorative corner circle */}
      <div style={{
        position: "absolute", top: -28, right: -28,
        width: 90, height: 90, borderRadius: "50%",
        background: s.decor,
        transition: "transform 300ms ease",
        transform: hovered ? "scale(1.3)" : "scale(1)",
      }} />
      {/* Gold accent line at top */}
      <div style={{
        position: "absolute", top: 0, left: 24, right: 24, height: 2,
        background: hovered ? `linear-gradient(90deg, ${s.hoverBorder}, transparent)` : "transparent",
        borderRadius: 2,
        transition: "background 250ms ease",
      }} />

      {/* Icon */}
      <div style={{
        width: 46, height: 46,
        background: s.iconBg,
        borderRadius: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 18,
        transition: "transform 250ms ease",
        transform: hovered ? "scale(1.1)" : "scale(1)",
      }}>
        <Icon size={22} color={s.iconColor} strokeWidth={1.8} />
      </div>

      {/* Title */}
      <p style={{ color: s.sub, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
        {title}
      </p>

      {/* Value */}
      <p style={{ color: s.text, fontSize: 40, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: 8 }}>
        {value}
      </p>

      {/* Description or secondary stats on hover */}
      <div style={{ minHeight: 36 }}>
        {hovered && secondaryStats && secondaryStats.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
            {secondaryStats.map((st, i) => (
              <span key={i} style={{ color: s.sub, fontSize: 12, fontWeight: 600 }}>
                {st.value} {st.label}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: s.sub, fontSize: 12, fontWeight: 500 }}>{description}</p>
        )}
      </div>

      {/* Arrow — appears on hover */}
      <div style={{
        position: "absolute", bottom: 18, right: 20,
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateX(0)" : "translateX(6px)",
        transition: "opacity 230ms ease, transform 230ms ease",
        color: s.iconColor,
        display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700,
      }}>
        {href && <><span>View</span><ArrowRight size={13} /></>}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: "none", display: "block" }}>{inner}</Link>;
  }
  return inner;
}
