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
        <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: "#0D3326" }}>
          Featured Properties
        </h2>
        <p className="mt-4 text-base text-[#0D3326]/70 sm:text-lg">
          Discover the latest verified properties on HomeHub.
        </p>
        <Link 
          href="/user/properties"
          className="mt-8 inline-flex items-center justify-center rounded-xl border-2 border-[#D7AE62] px-6 py-2.5 text-[#0D3326] font-bold transition hover:bg-[#D7AE62] hover:text-white shadow-sm hover:shadow-md"
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