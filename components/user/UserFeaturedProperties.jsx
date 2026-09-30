"use client";

import Link from "next/link";
import PropertyCard from "./PropertyCard";

export default function UserFeaturedProperties({ properties }) {
  if (!properties || properties.length === 0) {
    return null;
  }

  const featuredProperties = properties.slice(0, 4);

  return (
    <section id="featured-properties" className="mx-auto max-w-7xl px-5 py-16">

      {/* Section Heading */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold" style={{ color: "#0D3326" }}>
            Featured Properties
          </h2>
          <p className="mt-2 text-[#0D3326]/70 font-medium text-lg">
            Discover the latest verified properties on HomeHub.
          </p>
        </div>
        <Link 
          href="/user/properties"
          className="rounded-xl border-2 border-[#D7AE62] px-6 py-2.5 text-[#0D3326] font-bold transition hover:bg-[#D7AE62] hover:text-white shadow-sm hover:shadow-md text-center"
        >
          View All Properties
        </Link>
      </div>

      {/* Property Cards Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center sm:place-items-start">
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