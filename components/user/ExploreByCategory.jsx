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
    <section id="explore-categories" className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <h2 className="text-2xl font-extrabold mb-2" style={{ color: "#0D3326" }}>
        Explore by Category
      </h2>
      <p className="text-sm text-[#0D3326]/60 mb-8">
        Browse properties by type — all results come directly from Strapi.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
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
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:border-[#D7AE62] hover:shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F3EE] transition-colors group-hover:bg-[#0D3326]">
                <cat.icon size={28} className="text-[#D7AE62]" />
              </div>
              <div>
                <span className="block text-sm font-bold text-[#0D3326]">{cat.name}</span>
                <span className="block text-[11px] text-[#0D3326]/50 mt-0.5">{cat.subtitle}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
