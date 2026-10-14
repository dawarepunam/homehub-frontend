"use client";

import Link from "next/link";
import PropertyCard from "./PropertyCard";

export default function UserFeaturedProperties({ properties }) {
  if (!properties || properties.length === 0) {
    return null;
  }

  const featuredProperties = properties.slice(0, 4);

  return (
    <section id="featured-properties" className="border-t border-[var(--border-subtle)] bg-[var(--bg-section)]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16 sm:py-20">

        {/* ── Section Header ── */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="hh-eyebrow self-start">
              <span className="hh-eyebrow-dot" aria-hidden="true" />
              Latest Listings
            </span>
            <h2 className="hh-section-title">Featured Properties</h2>
            <p className="hh-section-subtitle max-w-md">
              Discover the latest verified properties handpicked for you.
            </p>
          </div>

          <Link
            href="/user/properties"
            className="hh-btn hh-btn-secondary shrink-0 self-start sm:self-auto"
          >
            View All
          </Link>
        </div>

        {/* ── Property Cards Grid ── */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.documentId || property.id}
              property={property}
            />
          ))}
        </div>

      </div>
    </section>
  );
}