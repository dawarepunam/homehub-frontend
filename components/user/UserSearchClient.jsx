"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Home,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import ContactOwnerModal from "@/components/user/ContactOwnerModal";

// =====================================================
// CONFIG
// =====================================================

const STRAPI_BASE =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/api$/, "") ||
  "http://localhost:1337";

const STRAPI_API =
  process.env.NEXT_PUBLIC_STRAPI_URL || `${STRAPI_BASE}/api`;

// =====================================================
// IMAGE RESOLVER
// =====================================================

function resolveImageUrl(property) {
  function fromMedia(media) {
    if (!media) return null;
    // Strapi v5 flat (no .attributes wrapper)
    const url =
      media?.formats?.medium?.url ||
      media?.formats?.small?.url ||
      media?.formats?.thumbnail?.url ||
      media?.url;
    if (!url) return null;
    return url.startsWith("http") ? url : `${STRAPI_BASE}${url}`;
  }

  // 1. CoverImage (single media)
  const cover = property?.CoverImage;
  if (cover) {
    const u = fromMedia(cover);
    if (u) return u;
  }

  // 2. PropertyImage (array)
  const gallery = property?.PropertyImage;
  if (Array.isArray(gallery) && gallery.length > 0) {
    const u = fromMedia(gallery[0]);
    if (u) return u;
  }

  return null;
}

// =====================================================
// PRICE FORMATTER
// =====================================================

function formatPrice(price) {
  if (!price && price !== 0) return null;
  const n = Number(price);
  if (isNaN(n)) return String(price);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

// =====================================================
// SORT OPTIONS
// =====================================================

const SORT_OPTIONS = [
  { label: "Relevance", value: "createdAt:desc" },
  { label: "Newest", value: "createdAt:desc" },
  { label: "Price: Low to High", value: "Price:asc" },
  { label: "Price: High to Low", value: "Price:desc" },
];

// =====================================================
// PROPERTY CARD
// =====================================================

function SearchPropertyCard({ property, onContact }) {
  const imgUrl = resolveImageUrl(property);
  const title = property?.Title || "Untitled Property";
  const type = property?.Property_Type || "";
  const category = property?.Category || "";
  const purpose = property?.Purpose || "";
  const city = property?.City || "";
  const area = property?.Area || "";
  const price = formatPrice(property?.Price);
  const docId = property?.documentId || property?.id;

  return (
    <div className="group overflow-hidden rounded-2xl bg-[var(--bg-card)] shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-[var(--border-subtle)] hover:border-[var(--border-focus)]">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-[var(--bg-section)]">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center flex-col gap-2 text-[var(--text-muted)]">
            <Home size={32} />
            <span className="text-xs font-semibold">No Image</span>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {type && (
            <span className="rounded-lg bg-[var(--accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-text)] shadow-sm">
              {type}
            </span>
          )}
          {purpose && (
            <span className="rounded-lg bg-[var(--bg-card)]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-sm">
              {purpose}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between">
        <div>
          {category && (
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {category}
            </p>
          )}
          <h3 className="text-base font-bold text-[var(--text-primary)] line-clamp-1 leading-snug">
            {title}
          </h3>

          {(city || area) && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <MapPin size={13} className="shrink-0 text-[var(--text-muted)]" />
              {[area, city].filter(Boolean).join(", ")}
            </p>
          )}

          {price && (
            <p className="mt-3 text-lg font-extrabold text-[var(--text-primary)]">
              {price}
              {purpose?.toLowerCase() === "rent" && (
                <span className="ml-1 text-xs font-normal text-[var(--text-muted)]">/month</span>
              )}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3">
          {docId ? (
            <>
              <Link
                href={`/user/property/${docId}`}
                className="hh-btn hh-btn-primary hh-btn-sm flex-1 text-center justify-center"
              >
                <span>Details</span>
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (onContact) onContact();
                }}
                className="hh-btn hh-btn-secondary hh-btn-sm flex-1 text-center justify-center"
              >
                <span>Contact</span>
              </button>
            </>
          ) : (
            <span className="w-full text-center text-xs font-semibold text-[var(--text-muted)] py-2">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SKELETON
// =====================================================

function SearchSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-md border border-stone-100">
          <div className="h-52 w-full animate-pulse bg-stone-200" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-stone-200" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-stone-200" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function UserSearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL params
  const purpose = searchParams.get("purpose") || "";
  const city = searchParams.get("city") || "";
  const area = searchParams.get("area") || "";
  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || "createdAt:desc";

  // State
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState(sortParam);
  const [contactModalProperty, setContactModalProperty] = useState(null);

  // ---- Fetch from Strapi with proper filters ----
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      // Apply filters only if set — use $containsi for robust whitespace/case tolerance
      if (city) params.append("filters[City][$containsi]", city);
      if (area) params.append("filters[Area][$containsi]", area);
      if (type) params.append("filters[Property_Type][$eqi]", type);
      if (category) params.append("filters[Category][$eqi]", category);
      // Purpose: "buy" tab → "Sale" in Strapi, "rent" tab → "Rent"
      if (purpose) {
        const purposeValue =
          purpose.toLowerCase() === "buy"
            ? "Sale"
            : purpose.charAt(0).toUpperCase() + purpose.slice(1).toLowerCase();
        params.append("filters[Purpose][$eqi]", purposeValue);
      }

      // Populate only valid fields (no PropertyImages - schema doesn't have it)
      params.append("populate[CoverImage]", "true");
      params.append("populate[PropertyImage]", "true");

      // Sort
      const [sortField, sortDir] = sort.split(":");
      params.append("sort[0]", `${sortField}:${sortDir || "desc"}`);

      params.append("pagination[pageSize]", "50");

      const url = `${STRAPI_API}/properties?${params.toString()}`;
      console.log("[UserSearch] Fetching:", url);

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.error?.message || `Server error: ${res.status}`
        );
      }

      const data = await res.json();
      const list = data?.data || [];
      setProperties(list);
      setTotal(data?.meta?.pagination?.total ?? list.length);
    } catch (err) {
      console.error("[UserSearch] Error:", err);
      setError(err.message || "Failed to load search results.");
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [city, area, type, category, purpose, sort]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // ---- Remove single filter chip ----
  function removeFilter(key) {
    const p = new URLSearchParams(searchParams.toString());
    p.delete(key);
    router.replace(`/user/search?${p.toString()}`);
  }

  // ---- Clear all filters ----
  function clearAll() {
    if (purpose) {
      router.replace(`/user/search?purpose=${encodeURIComponent(purpose)}`);
    } else {
      router.replace("/user/search");
    }
  }

  // ---- Update sort ----
  function handleSortChange(val) {
    setSort(val);
    const p = new URLSearchParams(searchParams.toString());
    p.set("sort", val);
    router.replace(`/user/search?${p.toString()}`);
  }

  // Active filter chips
  const activeFilters = [
    purpose && { key: "purpose", label: purpose.charAt(0).toUpperCase() + purpose.slice(1) },
    city && { key: "city", label: city },
    area && { key: "area", label: area },
    type && { key: "type", label: type },
    category && { key: "category", label: category },
  ].filter(Boolean);

  const hasFilters = activeFilters.length > 0;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:px-8">
        {/* ---- Back Button ---- */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/user")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* ---- Results Count + Sort ---- */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            {loading ? (
              <div className="h-6 w-36 animate-pulse rounded bg-[var(--skeleton-base)]" />
            ) : error ? null : (
              <p className="text-xl font-extrabold text-[var(--text-primary)]">
                {total}{" "}
                <span className="text-sm font-normal text-[var(--text-muted)]">
                  {total === 1 ? "Property" : "Properties"} Found
                </span>
              </p>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1.5 shadow-sm">
            <ArrowUpDown size={14} className="text-[var(--text-muted)] shrink-0" />
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-[var(--text-primary)] outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.label} value={o.value} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                  Sort: {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ---- Active Filter Chips ---- */}
        {hasFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={14} className="text-[var(--text-muted)] shrink-0" />
            {activeFilters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => removeFilter(key)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--accent)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-text)] transition hover:opacity-80"
              >
                {label}
                <X size={11} className="opacity-80" />
              </button>
            ))}
            <button
              onClick={clearAll}
              className="ml-2 text-xs font-semibold text-[var(--text-muted)] underline hover:text-[var(--text-primary)]"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ---- Loading ---- */}
        {loading && <SearchSkeleton />}

        {/* ---- Error ---- */}
        {!loading && error && (
          <div className="mx-auto max-w-lg rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-500">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <h2 className="text-lg font-bold">
              Unable to load search results
            </h2>
            <p className="mt-1 text-xs">{error}</p>
            <button
              onClick={fetchProperties}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        )}

        {/* ---- No Results ---- */}
        {!loading && !error && properties.length === 0 && (
          <div className="mx-auto max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-10 text-center shadow-sm">
            <Search className="mx-auto mb-4 h-12 w-12 text-[var(--text-muted)] opacity-40" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              No Properties Found
            </h2>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              No properties match your selected filters. Try changing your search
              criteria.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="hh-btn hh-btn-secondary hh-btn-sm"
                >
                  Clear All Filters
                </button>
              )}
              <Link
                href="/user"
                className="hh-btn hh-btn-primary hh-btn-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {/* ---- Results Grid ---- */}
        {!loading && !error && properties.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <SearchPropertyCard
                key={property.documentId || property.id}
                property={property}
                onContact={() => setContactModalProperty(property)}
              />
            ))}
          </div>
        )}

      </div>

      <ContactOwnerModal
        isOpen={Boolean(contactModalProperty)}
        onClose={() => setContactModalProperty(null)}
        property={contactModalProperty}
      />
    </>
  );
}
