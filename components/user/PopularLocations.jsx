"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MapPin } from "lucide-react";

// Normalize a city string: trim whitespace, collapse internal spaces, lowercase.
// Used for grouping/counting so "Pune", "pune", "PUNE", " Pune " all merge.
function normalizeCity(raw) {
  return String(raw).trim().replace(/\s+/g, " ").toLowerCase();
}

// Produce a Title-Cased display label from a normalised city string.
function displayCity(normalised) {
  return normalised
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function PopularLocations({ properties = [] }) {
  // Group ALL Strapi properties by normalised city to get accurate counts.
  const cities = useMemo(() => {
    const cityCounts = {};

    properties.forEach((p) => {
      // Support flat (p.City) and component-nested (p.PropertyCommonDetails.City).
      // Prioritise p.City because PropertyListingClient filters on p.City directly.
      const cityRaw = p?.City || p?.PropertyCommonDetails?.City;
      if (!cityRaw) return;

      const normalised = normalizeCity(cityRaw);
      const display = displayCity(normalised);

      cityCounts[display] = (cityCounts[display] || 0) + 1;
    });

    // Sort by count descending; show top 6 cities.
    return Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [properties]);

  if (cities.length === 0) {
    return null;
  }

  return (
    // id="popular-locations" lets the Back button anchor back to this section.
    <section id="popular-locations" className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: "#0D3326" }}>
          Explore Popular Locations
        </h2>
        <p className="mt-3 text-sm text-[#0D3326]/70 sm:text-base">
          Discover properties in India's most sought-after cities.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <Link
            key={city.name}
            href={`/user/properties?city=${encodeURIComponent(city.name)}&from=popular-locations`}
            className="group relative h-48 overflow-hidden rounded-2xl bg-gray-900 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 transition-opacity group-hover:opacity-40"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2744&auto=format&fit=crop")',
                backgroundColor: "#0D3326",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="absolute bottom-6 left-6 flex flex-col">
              <span className="text-2xl font-bold text-white">{city.name}</span>
              <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#D7AE62]">
                <MapPin size={14} />
                {city.count} {city.count === 1 ? "Property" : "Properties"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
