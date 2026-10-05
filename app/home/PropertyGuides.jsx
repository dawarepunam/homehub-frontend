"use client";

import Link from "next/link";
import { getStrapiMedia } from "@/utils/getStrapiMedia";
import styles from "./PropertyGuides.module.css";

const GUIDE_ICONS = {
  buy: "⌂", rent: "⚿", sell: "↗", post: "+", home: "⌂", key: "⚿",
};

// Default guides shown when Strapi has no PropertyGuides
const DEFAULT_GUIDES = [
  { id: "buy",  Title: "How to Buy a Property", Category: "Buyer Guide",   Icon: "buy",  Description: "Step-by-step guide to buying your dream property in India." },
  { id: "rent", Title: "How to Rent a Property", Category: "Renter Guide", Icon: "rent", Description: "Find and secure the right rental property for your needs." },
  { id: "sell", Title: "How to Sell Your Property", Category: "Seller Guide", Icon: "sell", Description: "Get the best price and sell faster with our expert tips." },
  { id: "post", Title: "How to Post a Property", Category: "Owner Guide",  Icon: "post", Description: "List your property on HomeHub and reach thousands of buyers." },
];

export default function PropertyGuides({ data }) {
  const guides = Array.isArray(data)
    ? [...data]
        .filter(g => g?.IsActive !== false)
        .sort((a, b) => (a?.DisplayOrder ?? 999) - (b?.DisplayOrder ?? 999))
    : [];

  const displayGuides = guides.length > 0 ? guides : DEFAULT_GUIDES;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headingRow}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Property Guides</span>
            <h2>Make Your Property Journey Easier</h2>
            <p>Helpful guides for buying, renting, selling and posting properties.</p>
          </div>
        </div>

        <div className={styles.grid}>
          {displayGuides.map((guide, index) => {
            const imageUrl = getStrapiMedia(guide?.Image);
            const iconEmoji = GUIDE_ICONS[guide?.Icon?.toLowerCase()?.trim()] || "⌂";
            const href = guide?.id && typeof guide.id === "number"
              ? `/property-guides/${guide.id}`
              : "#";

            return (
              <a
                key={guide?.id || guide?.documentId || index}
                href={href}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={guide?.Title || "Property Guide"}
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.iconFallback}>{iconEmoji}</div>
                  )}
                </div>
                <div className={styles.content}>
                  {guide?.Category && (
                    <span className={styles.tag}>{guide.Category}</span>
                  )}
                  <h3 className={styles.title}>
                    {guide?.Title || "Property Guide"}
                  </h3>
                  {guide?.Description && (
                    <p style={{ margin: 0, color: "#6e7e78", fontSize: "13px", lineHeight: "1.5" }}>
                      {guide.Description}
                    </p>
                  )}
                  <span className={styles.readMore}>Read Guide →</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
