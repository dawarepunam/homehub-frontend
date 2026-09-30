"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Trash2,
  Search,
  BedDouble,
  Bath,
  Maximize,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getUserWishlist,
  removeFromWishlist,
} from "@/services/wishlistService";

// =====================================================
// CONSTANTS
// =====================================================

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

// =====================================================
// HELPERS
// =====================================================

function getImageUrl(property) {
  if (!property) return null;

  function extractUrl(media) {
    if (!media) return null;
    const mediaData = media?.data || media;
    const attrs = mediaData?.attributes || mediaData;
    
    if (!attrs?.url) return null;

    // Use optimized formats if available
    let path =
      attrs?.formats?.medium?.url ||
      attrs?.formats?.small?.url ||
      attrs?.formats?.thumbnail?.url ||
      attrs?.url;

    if (!path) return null;
    return path.startsWith("http") ? path : `${STRAPI_URL}${path}`;
  }

  // Try CoverImage
  const rawCover = property?.CoverImage || property?.attributes?.CoverImage;
  const cover = Array.isArray(rawCover) ? rawCover[0] : rawCover;
  const coverUrl = extractUrl(cover);
  if (coverUrl) return coverUrl;

  // Try PropertyImage
  const rawGallery = property?.PropertyImage || property?.attributes?.PropertyImage;
  const galleryData = rawGallery?.data || rawGallery;
  if (Array.isArray(galleryData) && galleryData.length > 0) {
    const galleryUrl = extractUrl(galleryData[0]);
    if (galleryUrl) return galleryUrl;
  }

  // Try PropertyImages
  const rawGalleryMulti = property?.PropertyImages || property?.attributes?.PropertyImages;
  const galleryMultiData = rawGalleryMulti?.data || rawGalleryMulti;
  if (Array.isArray(galleryMultiData) && galleryMultiData.length > 0) {
    const galleryMultiUrl = extractUrl(galleryMultiData[0]);
    if (galleryMultiUrl) return galleryMultiUrl;
  }

  return null;
}

function formatPrice(property) {
  const p = property?.attributes || property || {};
  const raw = p?.Price ?? p?.PropertyCommonDetails?.Price ?? p?.price;
  const units = p?.PriceUnits || p?.PropertyCommonDetails?.PriceUnits || "";
  if (raw === null || raw === undefined || raw === "") return "Price on Request";
  const num = Number(raw);
  if (isNaN(num)) return "Price on Request";
  const formatted = `\u20b9${new Intl.NumberFormat("en-IN").format(num)}`;
  return units ? `${formatted} ${units}` : formatted;
}

function getSafe(val, fallback = "") {
  if (val === null || val === undefined || val === "") return fallback;
  return String(val);
}

function getPropValue(property, key) {
  if (!property) return null;
  return property[key] ?? property?.attributes?.[key];
}

function sortProperties(list, sortKey) {
  if (!list || list.length === 0) return list;
  const copy = [...list];
  if (sortKey === "price_asc") {
    return copy.sort((a, b) => {
      const pa = Number(a?.Price ?? a?.PropertyCommonDetails?.Price ?? 0) || 0;
      const pb = Number(b?.Price ?? b?.PropertyCommonDetails?.Price ?? 0) || 0;
      return pa - pb;
    });
  }
  if (sortKey === "price_desc") {
    return copy.sort((a, b) => {
      const pa = Number(a?.Price ?? a?.PropertyCommonDetails?.Price ?? 0) || 0;
      const pb = Number(b?.Price ?? b?.PropertyCommonDetails?.Price ?? 0) || 0;
      return pb - pa;
    });
  }
  return copy;
}

// =====================================================
// SKELETON CARD
// =====================================================

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5DDD0] bg-white shadow-sm animate-pulse">
      <div className="h-52 bg-[#E5DDD0]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded-full bg-[#E5DDD0]" />
        <div className="h-3 w-1/2 rounded-full bg-[#E5DDD0]" />
        <div className="h-5 w-1/3 rounded-full bg-[#E5DDD0]" />
        <div className="flex gap-2 pt-2">
          <div className="h-10 flex-1 rounded-xl bg-[#E5DDD0]" />
          <div className="h-10 w-12 rounded-xl bg-[#E5DDD0]" />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SAVED PROPERTY CARD
// =====================================================

function SavedPropertyCard({ property, onRemove, removingId }) {
  const documentId = getPropValue(property, "documentId") || getPropValue(property, "id");
  const isRemoving = removingId === documentId;

  const title = getSafe(getPropValue(property, "Title"), "Untitled Property");
  const city = getSafe(getPropValue(property, "City"));
  const area = getSafe(getPropValue(property, "Locality") || getPropValue(property, "Area"));
  const purpose = getSafe(getPropValue(property, "Purpose"));
  const propertyType = getSafe(getPropValue(property, "Property_Type"));
  const category = getSafe(getPropValue(property, "Category"));
  const price = formatPrice(property);
  const imageUrl = getImageUrl(property);

  const commonDetails = getPropValue(property, "PropertyCommonDetails") || {};
  const residentialDetails = getPropValue(property, "ResidentialDetails") || {};

  const bedrooms =
    residentialDetails?.Bedrooms ??
    commonDetails?.Bedrooms ??
    getPropValue(property, "Bedrooms") ??
    null;

  const bathrooms =
    residentialDetails?.Bathrooms ??
    commonDetails?.Bathrooms ??
    getPropValue(property, "Bathrooms") ??
    null;

  const builtArea =
    commonDetails?.Built_upArea ??
    commonDetails?.CarpetArea ??
    getPropValue(property, "BuiltUpArea") ??
    null;

  const areaUnit = commonDetails?.Area_Unit || commonDetails?.AreaUnit || "sq.ft";

  const locationStr = [area, city].filter(Boolean).join(", ");

  const purposeBadge =
    purpose === "Sale"
      ? "bg-[#0D3326] text-[#D7AE62]"
      : purpose === "Rent"
      ? "bg-[#1a4d3a] text-[#D7AE62]"
      : "bg-[#0D3326]/80 text-[#D7AE62]";

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E5DDD0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#D7AE62]/30"
      aria-label={`Saved property: ${title}`}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#EAE5DC] shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.parentElement.classList.add("show-fallback");
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0D3326]/10">
              <svg className="h-7 w-7 text-[#0D3326]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
              </svg>
            </div>
            <span className="mt-2 text-xs text-[#0D3326]/40 font-semibold">No Image</span>
          </div>
        )}

        {/* Property Type badge */}
        {propertyType && (
          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-[#0D3326] backdrop-blur-sm shadow-sm">
            {propertyType}
          </span>
        )}

        {/* Purpose badge */}
        {purpose && (
          <span className={`absolute top-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-sm ${purposeBadge} ${propertyType ? "right-12" : "right-3"}`}>
            {purpose === "Sale" ? "For Sale" : purpose === "Rent" ? "For Rent" : purpose}
          </span>
        )}

        {/* Remove heart */}
        <button
          type="button"
          onClick={() => onRemove(property)}
          disabled={isRemoving}
          aria-label="Remove property from saved properties"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-red-50 disabled:opacity-60"
        >
          {isRemoving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
          ) : (
            <Heart size={16} className="fill-red-500 text-red-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <span className="mb-2 inline-block w-fit rounded-full border border-[#E5DDD0] bg-[#F7F4EF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0D3326]/60">
            {category}
          </span>
        )}

        <h2 className="line-clamp-2 text-base font-extrabold leading-snug text-[#0D3326]">
          {title}
        </h2>

        {locationStr && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#0D3326]/60">
            <MapPin size={12} className="shrink-0 text-[#D7AE62]" />
            <span className="line-clamp-1">{locationStr}</span>
          </p>
        )}

        <p className="mt-3 text-lg font-extrabold text-[#0D3326]">{price}</p>

        {(bedrooms || bathrooms || builtArea) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            {bedrooms && (
              <span className="flex items-center gap-1 text-xs font-semibold text-[#0D3326]/60">
                <BedDouble size={12} className="text-[#D7AE62]" />
                {bedrooms} Bed
              </span>
            )}
            {bathrooms && (
              <span className="flex items-center gap-1 text-xs font-semibold text-[#0D3326]/60">
                <Bath size={12} className="text-[#D7AE62]" />
                {bathrooms} Bath
              </span>
            )}
            {builtArea && (
              <span className="flex items-center gap-1 text-xs font-semibold text-[#0D3326]/60">
                <Maximize size={12} className="text-[#D7AE62]" />
                {builtArea} {areaUnit}
              </span>
            )}
          </div>
        )}

        <div className="flex-1" />
        <div className="mt-4 border-t border-[#E5DDD0]/60" />

        <div className="mt-4 flex gap-2.5">
          <Link
            href={`/user/property/${documentId}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0D3326] py-2.5 text-sm font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f]"
            aria-label={`View details for ${title}`}
          >
            <Eye size={15} />
            View Property
          </Link>
          <button
            type="button"
            onClick={() => onRemove(property)}
            disabled={isRemoving}
            aria-label="Remove property from saved properties"
            className="flex items-center justify-center rounded-xl border border-[#E5DDD0] bg-white px-3 text-[#0D3326]/50 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRemoving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

// =====================================================
// MAIN WISHLIST CLIENT
// =====================================================

export default function WishlistClient() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [sortKey, setSortKey] = useState("recent");

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const profile = await getUserWishlist();

      if (!profile) {
        setProperties([]);
        return;
      }

      const wishlist = profile?.Wishlist;

      if (!wishlist) {
        setProperties([]);
        return;
      }

      let raw = wishlist?.properties || [];
      if (raw?.data) raw = raw.data;
      if (!Array.isArray(raw)) raw = [];

      const seen = new Set();
      const unique = [];

      raw.forEach((p) => {
        const id = p?.documentId || p?.id;
        if (!id) return;
        if (!seen.has(String(id))) {
          seen.add(String(id));
          unique.push(p?.data ?? p);
        }
      });

      // ---- ENRICHMENT LOGIC ----
      // The getUserWishlist service does not populate nested images inside properties relation.
      // We fetch them directly to ensure images appear.
      if (unique.length > 0) {
        try {
          const ids = unique.map((p) => p.documentId).filter(Boolean);
          if (ids.length > 0) {
            const fetchPromises = ids.map((id) => {
              const q = `filters[documentId][$eq]=${id}&populate[CoverImage]=true&populate[PropertyImage]=true`;
              return fetch(`${STRAPI_URL}/api/properties?${q}`, {
                cache: "no-store",
              }).then((res) => (res.ok ? res.json() : null));
            });

            const results = await Promise.all(fetchPromises);
            
            const enrichedMap = {};
            results.forEach((res) => {
              if (res && res.data && res.data.length > 0) {
                const p = res.data[0];
                enrichedMap[p.documentId || p.id] = p;
              }
            });

              for (let i = 0; i < unique.length; i++) {
                const pDocId = unique[i].documentId;
                if (enrichedMap[pDocId]) {
                  unique[i] = { ...unique[i], ...enrichedMap[pDocId] };
                }
              }
          }
        } catch (e) {
          console.error("Enrichment failed", e);
        }
      }

      setProperties(unique);
    } catch (err) {
      console.error("LOAD WISHLIST ERROR:", err);
      setError(err?.message || "Unable to load your saved properties.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleRemove = async (property) => {
    const propertyDocumentId = property?.documentId;

    if (!propertyDocumentId) {
      toast.error("Property ID not found.");
      return;
    }

    try {
      setRemovingId(propertyDocumentId);
      await removeFromWishlist(propertyDocumentId);

      setProperties((prev) =>
        prev.filter((item) => item?.documentId !== propertyDocumentId)
      );

      toast.success("Property removed from saved list.", {
        style: { background: "#0D3326", color: "#D7AE62", fontWeight: "bold" },
      });
    } catch (err) {
      console.error("REMOVE ERROR:", err);
      toast.error(err?.message || "Unable to remove property.");
    } finally {
      setRemovingId(null);
    }
  };

  const sorted = sortProperties(properties, sortKey);

  // LOADING
  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="h-9 w-56 animate-pulse rounded-full bg-[#E5DDD0]" />
            <div className="h-4 w-40 animate-pulse rounded-full bg-[#E5DDD0]" />
          </div>
          <div className="h-10 w-40 animate-pulse rounded-xl bg-[#E5DDD0]" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5DDD0] bg-white p-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-[#0D3326]">Unable to Load Saved Properties</h2>
          <p className="mt-2 max-w-xs text-sm text-[#0D3326]/60">{error}</p>
          <button
            type="button"
            onClick={loadWishlist}
            className="mt-6 flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f]"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // EMPTY
  if (properties.length === 0) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5DDD0] bg-white p-16 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F4EF] ring-4 ring-[#E5DDD0]">
            <Heart size={36} className="text-[#D7AE62]" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-[#0D3326]">No Saved Properties Yet</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#0D3326]/60">
            Save properties you are interested in and they will appear here for easy access anytime.
          </p>
          <Link
            href="/user/properties"
            className="mt-8 flex items-center gap-2 rounded-xl bg-[#0D3326] px-8 py-3.5 font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f]"
          >
            <Search size={16} />
            Explore Properties
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const count = properties.length;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0D3326]">
              <Heart size={20} className="fill-[#D7AE62] text-[#D7AE62]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0D3326] sm:text-3xl">Saved Properties</h1>
              <p className="text-sm text-[#0D3326]/60">Properties you have saved for later</p>
            </div>
          </div>
          <p className="mt-4 inline-flex items-center rounded-full border border-[#E5DDD0] bg-white px-4 py-1.5 text-sm font-bold text-[#0D3326] shadow-sm">
            <Heart size={13} className="mr-1.5 fill-[#D7AE62] text-[#D7AE62]" />
            {count} {count === 1 ? "Property" : "Properties"} Saved
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
          {/* Sort */}
          <div className="flex items-center gap-2 rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 shadow-sm">
            <SlidersHorizontal size={15} className="text-[#0D3326]/50" />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="appearance-none bg-transparent text-sm font-semibold text-[#0D3326] outline-none cursor-pointer"
              aria-label="Sort saved properties"
            >
              <option value="recent">Recently Saved</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <Link
            href="/user/properties"
            className="flex items-center gap-2 rounded-xl bg-[#0D3326] px-5 py-2.5 text-sm font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f]"
          >
            Explore More
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((property) => {
          const id = property?.documentId || property?.id;
          return (
            <SavedPropertyCard
              key={id}
              property={property}
              onRemove={handleRemove}
              removingId={removingId}
            />
          );
        })}
      </div>
      </div>
  );
}
