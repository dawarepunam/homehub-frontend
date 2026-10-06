"use client";

import Link from "next/link";
import { getStrapiMedia } from "@/utils/getStrapiMedia";
import styles from "./PropertyGuides.module.css";

const GUIDE_ICONS = {
  buy: "⌂", rent: "⚿", sell: "↗", post: "+", home: "⌂", key: "⚿",
};

// Default guides shown when Strapi has no PropertyGuides (only 3 now)
const DEFAULT_GUIDES = [
  { id: "buy",  Title: "Buy a Property", Category: "Buyer Guide",   Icon: "buy",  Description: "Step-by-step guide to buying your dream property in India." },
  { id: "rent", Title: "Rent a Property", Category: "Renter Guide", Icon: "rent", Description: "Find and secure the right rental property for your needs." },
  { id: "sell", Title: "Sell Your Property", Category: "Seller Guide", Icon: "sell", Description: "Get the best price and sell faster with our expert tips." }
];

export default function PropertyGuides({ data }) {
  let guides = Array.isArray(data)
    ? [...data]
        .filter(g => g?.IsActive !== false && !g?.Title?.toLowerCase().includes("post"))
        .sort((a, b) => (a?.DisplayOrder ?? 999) - (b?.DisplayOrder ?? 999))
    : [];

  if (guides.length > 3) {
    guides = guides.slice(0, 3);
  }

  const displayGuides = guides.length > 0 ? guides : DEFAULT_GUIDES;

  const getHref = (guide) => {
    const title = (guide?.Title || "").toLowerCase();
    
    // Redirect to the existing STATIC routes
    if (title.includes("buy")) {
      return "/property-guides/7-things-to-check-before-buying-a-home";
    }
    if (title.includes("rent")) {
      return "/property-guides/property-guide-article";
    }
    if (title.includes("sell")) {
      return "/property-guides/property-guide-article-1";
    }

    // Fallback for real Strapi Property Guide Articles if any other titles come up
    if (guide?.Slug) {
      return `/property-guides/${guide.Slug}`;
    }
    
    return "/property-guides";
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headingRow}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Property Guides</span>
            <h2>Make Your Property Journey Easier</h2>
            <p>Helpful guides for buying, renting, and selling properties.</p>
          </div>
        </div>

        <div className={styles.grid}>
          {displayGuides.map((guide, index) => {
            const imageUrl = getStrapiMedia(guide?.Image);
            const iconEmoji = GUIDE_ICONS[guide?.Icon?.toLowerCase()?.trim()] || "⌂";
            const href = getHref(guide);

            return (
              <Link
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
                    <p className={styles.description}>
                      {guide.Description}
                    </p>
                  )}
                  <span className={styles.readMore}>Read Guide →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
