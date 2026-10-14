import Link from "next/link";
import { ArrowUpRight, Building2, Home, Store, Warehouse } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// EXPLORE CATEGORIES
//
// Built from actual Strapi Property collection values (inspected 2026-09-30):
//
//   Residential → One BHK | Two BHK | Three BHK | Four BHK
//   Commercial  → Office  | Shop
//   Industrial  → Warehouse | Shop
//
// Two filter modes:
//   • categoryContains = "BHK"   → matches any Category containing "BHK"
//                                  (One BHK, Two BHK, Three BHK, Four BHK, etc.)
//   • category = "Office"        → exact Category match
//
// When Sellers add new BHK variants (e.g. Five BHK), they appear automatically
// because the filter uses $containsi on the Category field, not an exact list.
// ─────────────────────────────────────────────────────────────────────────────

const EXPLORE_CATEGORIES = [
  {
    id: 1,
    name: "BHK Apartments",
    subtitle: "1 BHK · 2 BHK · 3 BHK · 4 BHK",
    desc: "Browse apartments from compact studios to spacious family homes.",
    icon: Home,
    // Uses containsi filter — matches any "X BHK" variant from Strapi
    filterMode: "categoryContains",
    filterValue: "BHK",
  },
  {
    id: 2,
    name: "Office Spaces",
    subtitle: "Commercial Offices",
    desc: "Modern offices and business centres for teams of all sizes.",
    icon: Building2,
    filterMode: "category",
    filterValue: "Office",
  },
  {
    id: 3,
    name: "Retail Shops",
    subtitle: "Commercial Retail",
    desc: "Prime retail locations in high-footfall commercial areas.",
    icon: Store,
    filterMode: "category",
    filterValue: "Shop",
  },
  {
    id: 4,
    name: "Warehouses",
    subtitle: "Storage & Industrial",
    desc: "Large-format industrial and storage facilities across India.",
    icon: Warehouse,
    filterMode: "category",
    filterValue: "Warehouse",
  },
];

export default function ExploreByCategory() {
  return (
    <section id="explore-categories" className="bg-[var(--bg-section)] border-y border-[var(--border-subtle)]" style={{ marginTop: "40px" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

        {/* ── Section Header ── */}
        <div className="mb-10 flex flex-col items-center text-center gap-3">
          <span className="hh-eyebrow">
            <span className="hh-eyebrow-dot" aria-hidden="true" />
            Browse by Type
          </span>
          <h2 className="hh-section-title">Explore by Category</h2>
          <p className="hh-section-subtitle max-w-lg">
            Find your ideal property type — all results sourced directly from verified listings.
          </p>
        </div>

        {/* ── Category Cards Grid ── */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXPLORE_CATEGORIES.map((cat, i) => {
            // Build the href based on filterMode — preserving original navigation logic
            const href =
              cat.filterMode === "categoryContains"
                ? `/user/properties?categoryContains=${encodeURIComponent(cat.filterValue)}&from=explore-categories`
                : `/user/properties?category=${encodeURIComponent(cat.filterValue)}&from=explore-categories`;

            return (
              <Link
                key={cat.id}
                href={href}
                className="group relative flex flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-focus)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Icon box */}
                <div className="hh-icon-box">
                  <cat.icon size={22} strokeWidth={1.75} />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <span className="block text-sm font-bold text-[var(--text-primary)] leading-snug">
                    {cat.name}
                  </span>
                  <span className="block text-xs text-[var(--text-muted)] mt-0.5 mb-2 font-medium">
                    {cat.subtitle}
                  </span>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                    {cat.desc}
                  </p>
                </div>

                {/* Arrow cue */}
                <div className="flex items-center justify-end mt-auto pt-2 border-t border-[var(--border-subtle)]">
                  <ArrowUpRight
                    size={16}
                    strokeWidth={2}
                    className="text-[var(--text-muted)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text-primary)]"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── View All CTA ── */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/user/properties?from=explore-categories"
            className="hh-btn hh-btn-secondary"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
