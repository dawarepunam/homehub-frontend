"use client";

import Image from "next/image";
import { Building2, Eye, MessageSquare } from "lucide-react";

// =====================================================
// OWNER WELCOME — IMAGE HERO + 3 METRIC CARDS
// Reference: getsitego.in — hero image with overlapping
// stat cards at the bottom edge.
// Scope: Seller/Owner dashboard only (/owner).
// =====================================================

export default function OwnerWelcome({
  welcomeData,
  owner,
  properties = [],
  totalLeads = null,
  totalTraffic = null,
}) {
  // =====================================================
  // METRIC DERIVATION — real data only, no invented stats
  // =====================================================

  // Listed Properties — real count from the API
  const listedCount = Array.isArray(properties) ? properties.length : 0;

  // Total Leads — enquiry count passed by parent
  const leadsValue =
    typeof totalLeads === "number" ? totalLeads : null;

  // Traffic — summed Views across all properties, or value from parent
  const trafficValue =
    typeof totalTraffic === "number"
      ? totalTraffic
      : Array.isArray(properties)
      ? properties.reduce((sum, p) => sum + (Number(p?.Views) || 0), 0)
      : null;

  // =====================================================
  // FORMAT HELPER  — 14200 → "14.2K", null → "—"
  // =====================================================

  function fmt(n) {
    if (n === null || n === undefined) return "—";
    if (typeof n !== "number") return "—";
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 10_000)    return `${Math.round(n / 1000)}K`;
    if (n >= 1_000)     return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  }

  // =====================================================
  // CARD DEFINITIONS
  // =====================================================

  const CARDS = [
    {
      id:    "listed",
      label: welcomeData?.PropertyCountLabel || "Listed Properties",
      value: listedCount,
      icon:  <Building2 size={16} aria-hidden="true" />,
      color: "var(--seller-text)",
      bg:    "var(--seller-gold-subtle)",
    },
    {
      id:    "leads",
      label: welcomeData?.EnquiryCountLabel || "Total Leads",
      value: leadsValue,
      icon:  <MessageSquare size={16} aria-hidden="true" />,
      color: "var(--seller-text)",
      bg:    "var(--seller-gold-subtle)",
    },
    {
      id:    "traffic",
      label: welcomeData?.ViewCountLabel || "Traffic",
      value: trafficValue,
      icon:  <Eye size={16} aria-hidden="true" />,
      color: "var(--seller-text)",
      bg:    "var(--seller-gold-subtle)",
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      className="owner-hero-section"
      aria-label="Dashboard overview"
    >
      {/* ================================================
          HERO IMAGE BAND — centered, no text, no CTAs
      ================================================ */}
      <div className="owner-hero-image-wrap" aria-hidden="true">
        <Image
          src="/seller-hero-globe.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1400px) 100vw, 1400px"
          className="owner-hero-img"
        />
        {/* Theme-aware refined gradient overlay */}
        <div className="owner-hero-overlay" />
      </div>

      {/* ================================================
          METRIC CARDS — compact, perfectly centered row
          overlapping bottom edge of hero image
      ================================================ */}
      <div className="owner-hero-cards-wrapper">
        <div className="owner-hero-cards-row" role="list">
          {CARDS.map((card) => (
            <div
              key={card.id}
              id={`owner-hero-card-${card.id}`}
              className="owner-hero-card"
              role="listitem"
            >
              <div
                className="owner-hero-card__icon"
                style={{ background: card.bg, color: card.color }}
              >
                {card.icon}
              </div>
              <div className="owner-hero-card__body">
                <span className="owner-hero-card__label">{card.label}</span>
                <span className="owner-hero-card__value">{fmt(card.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
