"use client";

import Link from "next/link";
import styles from "./PopularLocations.module.css";
import { getStrapiMedia } from "@/utils/getStrapiMedia";

export default function PopularLocations({ data }) {
  if (!data) return null;
  const sectionData = Array.isArray(data) ? data[0] : data;
  if (!sectionData) return null;

  const locations = Array.isArray(sectionData.PopularLocationItem)
    ? sectionData.PopularLocationItem.filter((l) => l?.IsActive !== false)
    : [];

  if (locations.length === 0) return null;

  return (
    <section id="popular-locations" className={styles.section}>
      <div className={styles.container}>

        <div className={styles.heading}>
          <div className={styles.headingText}>
            <span className={styles.sectionLabel}>Explore Locations</span>
            <h2>{sectionData.Title || "Popular Locations"}</h2>
            <p>
              {sectionData.Subtitle ||
                "Discover properties in India's most sought-after cities."}
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {locations.map((location, index) => {
            const imageUrl = getStrapiMedia(location.Image);
            const cityName = location.Name || "";
            const href = cityName
              ? `/search?location=${encodeURIComponent(cityName)}`
              : "/search";

            return (
              <Link
                key={location.id || location.documentId || index}
                href={href}
                className={styles.card}
              >
                {/* ── Fixed aspect-ratio image container ── */}
                <div className={styles.imageContainer}>
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={cityName || "Location image"}
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.iconFallback}>⌖</div>
                  )}
                  <div className={styles.imageScrim} aria-hidden="true" />
                </div>

                {/* ── Text content — always below image ── */}
                <div className={styles.content}>
                  <h3 className={styles.locationName}>
                    {cityName || "Location"}
                    <span className={styles.locationArrow} aria-hidden="true">→</span>
                  </h3>
                  {location.Description && (
                    <span className={styles.locationDesc}>
                      {location.Description}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}