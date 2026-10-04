"use client";

import Link from "next/link";
import styles from "./PopularLocations.module.css";
import { getStrapiMedia } from "@/utils/getStrapiMedia";

export default function PopularLocations({ data }) {
  if (!data) {
    return null;
  }

  // Handle both single object and array (Strapi component types)
  const sectionData = Array.isArray(data) ? data[0] : data;

  if (!sectionData) {
    return null;
  }

  const locations = Array.isArray(sectionData.PopularLocationItem)
    ? sectionData.PopularLocationItem
    : [];

  const activeLocations = locations.filter(
    (location) => location?.IsActive !== false
  );

  return (
    <section id="popular-locations" className={styles.section}>
      <div className={styles.container}>

        {/* Heading */}
        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            EXPLORE LOCATIONS
          </span>

          <h2>
            {sectionData.Title || "Popular Locations"}
          </h2>

          <p>
            {sectionData.Subtitle ||
              "Discover properties in India's most sought-after cities and localities."}
          </p>
        </div>

        {/* Cards */}
        {activeLocations.length > 0 ? (
          <div className={styles.locationGrid}>
            {activeLocations.map((location, index) => {
              // Use canonical utility — handles /uploads/... relative paths correctly
              const imageUrl = getStrapiMedia(location.Image);

              const cityName = location.Name || "";
              const locationUrl = cityName
                ? `/search?location=${encodeURIComponent(cityName)}`
                : "/search";

              return (
                <Link
                  key={location.id || location.documentId || index}
                  href={locationUrl}
                  className={styles.locationCard}
                >
                  {/* Image or icon fallback */}
                  {imageUrl ? (
                    <div className={styles.imageWrapper}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={location.Name || "Property location"}
                        className={styles.locationImage}
                      />
                    </div>
                  ) : (
                    <div className={styles.icon}>
                      <span>⌖</span>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className={styles.cardContent}>
                    <h3>
                      {location.Name || "Location"}
                    </h3>

                    {location.Description && (
                      <p>
                        {location.Description}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <span className={styles.arrow}>
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No popular locations available.</p>
          </div>
        )}

      </div>
    </section>
  );
}