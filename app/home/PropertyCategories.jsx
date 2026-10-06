"use client";

import Link from "next/link";
import styles from "./PropertyCategories.module.css";

// Icon mapping — emoji fallbacks
const ICON_MAP = {
  home: "⌂", residential: "⌂", apartment: "⌂", villa: "⌂", flat: "⌂",
  building: "▣", commercial: "▣", office: "▣", shop: "▣", retail: "▣",
  factory: "▥", industrial: "▥", warehouse: "▥", plant: "▥",
  land: "⊞", plot: "⊞", agricultural: "⊛", leaf: "⊛",
};

function getIcon(icon) {
  return ICON_MAP[String(icon || "").toLowerCase()] || "⌂";
}

// ── AGRICULTURAL FILTER ──
// Excluded from Home display only; Strapi data/schema is untouched.
const EXCLUDED_CATEGORIES = ["agricultural"];

function isExcluded(category) {
  const name = (category.Text || category.Name || "").toLowerCase().trim();
  const slug = (category.Slug || "").toLowerCase().trim();
  const icon = (category.Icon || "").toLowerCase().trim();
  return (
    EXCLUDED_CATEGORIES.includes(name) ||
    EXCLUDED_CATEGORIES.includes(slug) ||
    EXCLUDED_CATEGORIES.includes(icon)
  );
}

export default function PropertyCategories({ data }) {
  if (!data) return null;

  const allCategories = Array.isArray(data.PropertyCategories)
    ? data.PropertyCategories.filter(
        (c) => c?.IsActive !== false && !isExcluded(c)
      )
    : [];

  if (allCategories.length === 0) return null;

  return (
    <section id="property-categories" className={styles.section}>
      <div className={styles.container}>

        <div className={styles.headingRow}>
          <div className={styles.headingText}>
            <span className={styles.sectionLabel}>Property Collection</span>
            <h2>{data.Title || "Explore by Category"}</h2>
            <p>{data.Subtitle || "Find the right property type for your needs."}</p>
          </div>
        </div>

        {/* Grid auto-adjusts: 3 cards on desktop, 2 on tablet, 1 on mobile */}
        <div className={styles.grid}>
          {allCategories.map((category, index) => {
            const name = category.Text || category.Name || "Property";
              const description = category.Description ||
                (name.toLowerCase() === "residential" ? "Find homes, apartments, and villas for you and your family." :
                 name.toLowerCase() === "commercial" ? "Explore office spaces, retail shops, and commercial buildings." :
                 name.toLowerCase() === "industrial" ? "Discover warehouses, factories, and industrial plots." :
                 `Explore all ${name.toLowerCase()} properties.`);

              return (
                <Link
                  key={category.id || category.documentId || name || index}
                  href={`/properties/${encodeURIComponent(name.toLowerCase())}`}
                  className={styles.card}
                >
                  <div className={styles.iconWrapper} aria-hidden="true">
                    <span>{getIcon(category.Icon)}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{name}</h3>
                  <p className={styles.cardDesc}>{description}</p>
                <span className={styles.cardArrow} aria-hidden="true">
                  Explore →
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
