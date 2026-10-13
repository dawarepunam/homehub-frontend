"use client";

import Link from "next/link";
import PropertyCard from "./PropertyCard";

export default function UserFeaturedProperties({ properties }) {
  if (!properties || properties.length === 0) {
    return null;
  }

  const featuredProperties = properties.slice(0, 4);

  return (
    <section id="featured-properties" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

      {/* Section Heading */}
      <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center justify-center text-center">
        <h2 className="hh-section-title">
          Featured Properties
        </h2>
        <p className="hh-section-subtitle mt-3">
          Discover the latest verified properties on HomeHub.
        </p>
        <Link 
          href="/user/properties"
          className="hh-btn hh-btn-secondary mt-6"
        >
          View All Properties
        </Link>
      </div>

      {/* Property Cards Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-stretch">
        {featuredProperties.map((property) => (
          <PropertyCard
            key={property.documentId || property.id}
            property={property}
          />
        ))}
      </div>

    </section>
  );
}