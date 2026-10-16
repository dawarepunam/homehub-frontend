"use client";

import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import PropertyCard from "./PropertyCard";

export default function PropertySection({ properties = [] }) {
  const displayProperties = properties.slice(0, 4);

  if (!Array.isArray(properties) || properties.length === 0) {
    return (
      <section className="mt-10 w-full">
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-6 py-12 text-center shadow-[var(--seller-shadow)]">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--seller-gold-subtle)] text-2xl text-[var(--seller-gold)]">
            🏠
          </div>
          <h2 className="text-xl font-bold text-[var(--seller-text)]">
            No Properties Found
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--seller-text-muted)]">
            You have not added any properties yet. Once you add a
            property, it will appear here automatically.
          </p>
          <Link
            href="/add-property"
            className="mt-6 inline-flex items-center rounded-xl bg-[var(--seller-primary)] px-6 py-3 text-sm font-bold text-[var(--seller-bg)] shadow-sm transition hover:opacity-90"
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
            <h2 className="text-xl font-bold tracking-tight text-[var(--seller-text)]">
              Your Properties
            </h2>
            <span className="rounded-full border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 py-0.5 text-xs font-bold text-[var(--seller-text-muted)]">
              {properties.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--seller-text-muted)]">
            Manage properties listed by you
          </p>
        </div>

        {/* VIEW ALL BUTTON (DESKTOP) */}
        {properties.length > 0 && (
          <div className="hidden sm:block">
            <Link
              href="/owner/properties"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-5 py-2.5 text-sm font-bold text-[var(--seller-text)] shadow-xs transition hover:bg-[var(--seller-surface-hover)]"
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