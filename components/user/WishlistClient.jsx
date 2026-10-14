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
  Phone,
  SlidersHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getUserWishlist,
  removeFromWishlist,
} from "@/services/wishlistService";

import ContactOwnerModal from "@/components/user/ContactOwnerModal";

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
    <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm animate-pulse">
      <div className="h-52 bg-[var(--bg-surface)]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded-full bg-[var(--border-subtle)]" />
        <div className="h-3 w-1/2 rounded-full bg-[var(--border-subtle)]" />
        <div className="h-5 w-1/3 rounded-full bg-[var(--border-subtle)]" />
        <div className="flex gap-2 pt-2">
          <div className="h-10 flex-1 rounded-xl bg-[var(--border-subtle)]" />
          <div className="h-10 w-12 rounded-xl bg-[var(--border-subtle)]" />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SAVED PROPERTY CARD
// =====================================================

function SavedPropertyCard({ property, onRemove, removingId, onContact }) {
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

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--border-hover,rgba(255,255,255,0.18))]"
      aria-label={`Saved property: ${title}`}
    >
      {/* Image Container (16:10 aspect ratio) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-section)] shrink-0">
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
            <span className="text-xs text-[var(--text-secondary)] font-semibold">No Image</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 pointer-events-none" />

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 flex-wrap">
          {purpose && (
            <span className="rounded-md bg-[var(--accent)] text-[var(--accent-text)] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
              {purpose}
            </span>
          )}
          {propertyType && (
            <span className="rounded-md bg-[var(--bg-card)]/90 backdrop-blur-md text-[var(--text-primary)] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider shadow-sm border border-[var(--border-subtle)]">
              {propertyType}
            </span>
          )}
        </div>

        {/* Wishlist Heart Remove */}
        <button
          type="button"
          onClick={() => onRemove(property)}
          disabled={isRemoving}
          aria-label="Remove property from saved properties"
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-card)]/90 backdrop-blur-md shadow-sm border border-[var(--border-subtle)] transition-all hover:scale-110 active:scale-95 disabled:opacity-60"
        >
          {isRemoving ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
          ) : (
            <Heart size={13} className="fill-red-500 text-red-500" />
          )}
        </button>

        {/* Price on Image */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-baseline justify-between text-white pointer-events-none">
          <span className="text-lg font-extrabold tracking-tight drop-shadow-md">
            {price}
          </span>
          {category && (
            <span className="text-[10px] font-bold text-white/85 tracking-wide px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4 justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <span>{propertyType || "Property"}</span>
            {locationStr && (
              <span className="flex items-center gap-1 font-semibold normal-case text-xs text-[var(--text-secondary)] truncate max-w-[55%]">
                <MapPin size={11} className="shrink-0 text-[var(--text-muted)]" />
                <span className="truncate">{locationStr}</span>
              </span>
            )}
          </div>

          <h3 
            className="mt-1.5 line-clamp-2 text-sm font-bold text-[var(--text-primary)] leading-snug transition-colors group-hover:text-[var(--text-primary)]"
            title={title}
          >
            <Link href={`/user/property/${documentId}`}>
              {title}
            </Link>
          </h3>

          <div className="mt-3 flex items-center gap-2.5 border-t border-[var(--border-subtle)] pt-2.5 text-[11px] text-[var(--text-secondary)] font-medium">
            {bedrooms && (
              <span className="flex items-center gap-1">
                <BedDouble size={13} className="text-[var(--text-muted)]" />
                <span>{bedrooms} Beds</span>
              </span>
            )}
            {bathrooms && (
              <span className="flex items-center gap-1">
                <Bath size={13} className="text-[var(--text-muted)]" />
                <span>{bathrooms} Baths</span>
              </span>
            )}
            {builtArea && (
              <span className="flex items-center gap-1">
                <Maximize size={13} className="text-[var(--text-muted)]" />
                <span>{builtArea} {areaUnit}</span>
              </span>
            )}
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-[var(--border-subtle)] pt-3">
          <Link
            href={`/user/property/${documentId}`}
            className="hh-btn hh-btn-primary hh-btn-sm w-full text-center justify-center font-bold text-xs"
            aria-label={`View details for ${title}`}
          >
            <Eye size={12} />
            <span>Details</span>
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onContact) onContact();
            }}
            className="hh-btn hh-btn-secondary hh-btn-sm w-full text-center justify-center font-bold text-xs"
          >
            <Phone size={12} />
            <span>Contact</span>
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
  const [contactModalProperty, setContactModalProperty] = useState(null);

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

      toast.success("Property removed from saved list.");
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
            <div className="h-9 w-56 animate-pulse rounded-full bg-[var(--border-subtle)]" />
            <div className="h-4 w-40 animate-pulse rounded-full bg-[var(--border-subtle)]" />
          </div>
          <div className="h-10 w-40 animate-pulse rounded-xl bg-[var(--border-subtle)]" />
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertCircle size={28} />
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-[var(--text-primary)]">Unable to Load Saved Properties</h2>
          <p className="mt-2 max-w-xs text-sm text-[var(--text-secondary)]">{error}</p>
          <button
            type="button"
            onClick={loadWishlist}
            className="hh-btn hh-btn-primary mt-6 flex items-center gap-2"
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-16 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-surface)] ring-4 ring-[var(--border-subtle)]">
            <Heart size={36} className="text-[var(--text-secondary)]" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-[var(--text-primary)]">No Saved Properties Yet</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
            Save properties you are interested in and they will appear here for easy access anytime.
          </p>
          <Link
            href="/user/properties"
            className="hh-btn hh-btn-primary mt-8 flex items-center gap-2"
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]">
              <Heart size={20} className="fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)] sm:text-3xl">Saved Properties</h1>
              <p className="text-sm text-[var(--text-secondary)]">Properties you have saved for later</p>
            </div>
          </div>
          <p className="mt-4 inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-1.5 text-sm font-bold text-[var(--text-primary)] shadow-sm">
            <Heart size={13} className="mr-1.5 fill-current text-red-500" />
            {count} {count === 1 ? "Property" : "Properties"} Saved
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
          {/* Sort */}
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 shadow-sm">
            <SlidersHorizontal size={15} className="text-[var(--text-secondary)]" />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="appearance-none bg-transparent text-sm font-semibold text-[var(--text-primary)] outline-none cursor-pointer"
              aria-label="Sort saved properties"
            >
              <option value="recent" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Recently Saved</option>
              <option value="price_asc" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Price: Low to High</option>
              <option value="price_desc" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Price: High to Low</option>
            </select>
          </div>

          <Link
            href="/user/properties"
            className="hh-btn hh-btn-primary flex items-center gap-2"
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
              onContact={() => setContactModalProperty(property)}
            />
          );
        })}
      </div>

      <ContactOwnerModal
        isOpen={Boolean(contactModalProperty)}
        onClose={() => setContactModalProperty(null)}
        property={contactModalProperty}
      />
    </div>
  );
}
