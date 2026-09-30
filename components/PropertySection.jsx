"use client";

import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import PropertyCard from "./PropertyCard";

export default function PropertySection({ properties = [] }) {
  const displayProperties = properties.slice(0, 4);

  if (!Array.isArray(properties) || properties.length === 0) {
    return (
      <section className="mt-10 w-full">
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-[#D9D1C2] bg-[#F7F0E3] px-6 py-12 text-center shadow-[0_10px_30px_rgba(30,61,48,0.06)]">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5E8DE]">
            <span className="text-2xl">🏠</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#123F32]">
            No Properties Found
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#718177]">
            You have not added any properties yet. Once you add a
            property, it will appear here automatically.
          </p>
          <Link
            href="/owner/properties/add"
            className="mt-6 inline-flex items-center rounded-xl bg-[#174B3B] px-5 py-3 text-sm font-bold text-[#F7F0E3] transition hover:bg-[#123F32]"
          >
            + Add Property
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 w-full">
      {/* SECTION HEADER */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-[#123F32]">
              Your Properties
            </h2>
            <span className="rounded-full bg-[#E5E8DE] px-3 py-1 text-xs font-bold text-[#416353]">
              {properties.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#718177]">
            Manage properties listed by you
          </p>
        </div>

        {/* VIEW ALL BUTTON (DESKTOP) */}
        {properties.length > 0 && (
          <div className="hidden sm:block">
            <Link
              href="/owner/properties"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D7AE62] px-6 py-2.5 text-sm font-extrabold text-[#123F32] shadow-sm transition hover:bg-[#C99D4C]"
            >
              View All Properties
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* OWNER PROPERTY GRID (MAX 4) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayProperties.map((property, index) => (
          <PropertyCard
            key={property?.documentId || property?.id || `property-${index}`}
            property={property}
            ownerMode={true}
          />
        ))}
      </div>


    </section>
  );
}