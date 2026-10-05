"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./PropertyCategories.module.css";

const ICON_MAP = {
  home: "⌂", residential: "⌂", apartment: "⌂", villa: "⌂",
  building: "▥", commercial: "▥", office: "▥", shop: "▥",
  factory: "▦", industrial: "▦", warehouse: "▦",
  land: "◫", plot: "◫", agricultural: "◫", leaf: "♧",
};

function getIcon(icon) {
  return ICON_MAP[String(icon || "").toLowerCase()] || "⌂";
}

export default function PropertyCategories({ data }) {
  const [showAll, setShowAll] = useState(false);
  if (!data) return null;

  const categories = Array.isArray(data.PropertyCategories)
    ? data.PropertyCategories.filter(c => c?.IsActive !== false)
    : [];

  if (categories.length === 0) return null;

  const visible = showAll ? categories : categories.slice(0, 8);

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

        <div className={styles.grid}>
          {visible.map((category, index) => {
            const name = category.Text || category.Name || "Property";
            const slug = category.Slug || "";
            return (
              <Link
                key={category.id || category.documentId || slug || index}
                href={`/search?category=${encodeURIComponent(name)}`}
                className={styles.card}
              >
                <div className={styles.iconWrapper}>
                  <span>{getIcon(category.Icon)}</span>
                </div>
                <h3 className={styles.cardTitle}>{name}</h3>
                {category.Description && (
                  <p className={styles.cardDesc}>{category.Description}</p>
                )}
                <span className={styles.cardArrow}>Explore →</span>
              </Link>
            );
          })}
        </div>

        {categories.length > 8 && (
          <div className={styles.toggleWrapper}>
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowAll(v => !v)}
            >
              {showAll ? "Show Less ↑" : `View All ${categories.length} Categories →`}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
