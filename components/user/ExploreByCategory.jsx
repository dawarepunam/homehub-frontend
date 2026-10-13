import Link from "next/link";
import { Building2, Home, Hotel, Building, Warehouse, Store, BrickWall } from "lucide-react";

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
    name: "BHK",
    subtitle: "1 BHK · 2 BHK · 3 BHK · 4 BHK",
    icon: Home,
    // Uses containsi filter — matches any "X BHK" variant from Strapi
    filterMode: "categoryContains",
    filterValue: "BHK",
  },
  {
    id: 2,
    name: "Office",
    subtitle: "Commercial Offices",
    icon: Building2,
    filterMode: "category",
    filterValue: "Office",
  },
  {
    id: 3,
    name: "Shop",
    subtitle: "Retail Shops",
    icon: Store,
    filterMode: "category",
    filterValue: "Shop",
  },
  {
    id: 4,
    name: "Warehouse",
    subtitle: "Storage & Industrial",
    icon: Warehouse,
    filterMode: "category",
    filterValue: "Warehouse",
  },
];

export default function ExploreByCategory() {
  return (
    <section id="explore-categories" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center justify-center text-center">
        <h2 className="hh-section-title">
          Explore by Category
        </h2>
        <p className="hh-section-subtitle mt-3">
          Browse properties by type — all results come directly from Strapi.
        </p>
      </div>

      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
        {EXPLORE_CATEGORIES.map((cat) => {
          // Build the href based on filterMode
          const href =
            cat.filterMode === "categoryContains"
              ? `/user/properties?categoryContains=${encodeURIComponent(cat.filterValue)}&from=explore-categories`
              : `/user/properties?category=${encodeURIComponent(cat.filterValue)}&from=explore-categories`;

          return (
            <Link
              key={cat.id}
              href={href}
              className="group flex flex-col items-center justify-center gap-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border-focus)] hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-text)]">
                <cat.icon size={24} />
              </div>
              <div>
                <span className="block text-sm font-bold text-[var(--text-primary)]">{cat.name}</span>
                <span className="block text-xs text-[var(--text-muted)] mt-0.5">{cat.subtitle}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
