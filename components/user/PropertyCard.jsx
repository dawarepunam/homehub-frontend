"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Heart, BedDouble, Bath, Maximize, Eye, Phone, Layers, Building, Warehouse } from "lucide-react";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

import {
  addToWishlist,
  removeFromWishlist,
  isPropertyInWishlist,
} from "@/services/wishlistService";
import ContactOwnerModal from "./ContactOwnerModal";

/* =====================================================
   STRAPI URL
===================================================== */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

/* =====================================================
   SAFE VALUE
===================================================== */

function getSafeValue(value, fallback = "") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((v) => getSafeValue(v, "")).filter(Boolean).join(", ") || fallback;
  }
  if (typeof value === "object") {
    if (value?.name) return value.name;
    if (value?.label) return value.label;
    if (value?.title) return value.title;
    if (value?.value) return String(value.value);
    if (value?.documentId) return value.documentId;
    return fallback;
  }
  return fallback;
}

/* =====================================================
   INDIAN PRICE FORMATTER
   e.g. 8500000 => "₹85 Lac", 15000000 => "₹1.50 Cr"
===================================================== */

function formatIndianPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "Price on Request";
  }

  if (typeof value === "object") {
    value =
      value?.Price ??
      value?.price ??
      value?.value ??
      value?.amount ??
      "";
  }

  if (value === null || value === undefined || value === "") {
    return "Price on Request";
  }

  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return typeof value === "string" && value.trim() ? value : "Price on Request";
  }

  if (num >= 10000000) {
    const cr = num / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    const lac = num / 100000;
    return `₹${lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(2)} Lac`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

/* =====================================================
   IMAGE URL RESOLVER
===================================================== */

function getImageUrl(image) {
  if (!image) {
    return "/no-property.png";
  }

  if (image?.url) {
    if (image.url.startsWith("http")) {
      return image.url;
    }
    return `${STRAPI_URL}${image.url}`;
  }

  if (Array.isArray(image) && image.length > 0) {
    return getImageUrl(image[0]);
  }

  if (image?.data) {
    if (Array.isArray(image.data)) {
      return getImageUrl(image.data[0]);
    }
    return getImageUrl(image.data);
  }

  if (typeof image === "string") {
    if (image.startsWith("http") || image.startsWith("/")) {
      return image;
    }
    return `${STRAPI_URL}/${image}`;
  }

  return "/no-property.png";
}

/* =====================================================
   PROPERTY CARD COMPONENT
===================================================== */

export default function PropertyCard({ property, onContact }) {
  const pathname = usePathname();

  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const documentId = property?.documentId || property?.id;

  /* Wishlist verification hook */
  useEffect(() => {
    let mounted = true;

    async function checkWishlist() {
      if (!documentId) return;

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") ||
            localStorage.getItem("jwt") ||
            localStorage.getItem("strapi_jwt")
          : null;

      if (!token) return;

      try {
        const result = await isPropertyInWishlist(documentId);
        if (mounted) {
          setLiked(Boolean(result));
        }
      } catch (error) {
        // silent fail on initial wishlist query
      }
    }

    checkWishlist();

    return () => {
      mounted = false;
    };
  }, [documentId]);

  if (!property) {
    return null;
  }

  /* Safe Property Extraction */
  const title = getSafeValue(property?.Title, "Untitled Property");
  const city = getSafeValue(property?.City);
  const area = getSafeValue(property?.Area || property?.Locality);
  const purpose = getSafeValue(property?.Purpose, "Sale");
  const propertyType = getSafeValue(property?.Property_Type, "Residential");
  const category = getSafeValue(property?.Category);
  const propertyStatus = getSafeValue(property?.PropertyStatus || property?.Status, "Available");

  const commonDetails = property?.PropertyCommonDetails || {};
  const residentialDetails = property?.ResidentialDetails || {};
  const commercialDetails = property?.CommercialDetails || {};
  const industrialDetails = property?.IndustrialDetails || {};

  /* Price */
  const rawPrice =
    property?.Price ??
    commonDetails?.Price ??
    property?.price;
  const price = formatIndianPrice(rawPrice);

  /* Specifications */
  const bedrooms =
    residentialDetails?.Bedrooms ??
    commonDetails?.Bedrooms ??
    property?.Bedrooms ??
    property?.BHK ??
    null;

  const bathrooms =
    residentialDetails?.Bathrooms ??
    commonDetails?.Bathrooms ??
    property?.Bathrooms ??
    null;

  const areaUnit = commonDetails?.Area_Unit || commonDetails?.AreaUnit || "sq.ft";
  const builtUpArea =
    commonDetails?.Built_upArea ??
    commonDetails?.BuiltUpArea ??
    commonDetails?.CarpetArea ??
    commonDetails?.Area ??
    property?.BuiltUpArea ??
    property?.AreaSize ??
    null;

  const floors =
    residentialDetails?.Total_Floors ??
    commercialDetails?.Total_Floors ??
    commonDetails?.TotalFloors ??
    null;

  const isCommercial = propertyType.toLowerCase().includes("commercial");
  const isIndustrial = propertyType.toLowerCase().includes("industrial");

  /* Wishlist toggle */
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") ||
          localStorage.getItem("jwt") ||
          localStorage.getItem("strapi_jwt")
        : null;

    if (!token) {
      toast.error("Please login to use wishlist.");
      return;
    }

    if (!documentId) {
      toast.error("Property ID not found.");
      return;
    }

    try {
      setLoading(true);
      if (liked) {
        await removeFromWishlist(documentId);
        setLiked(false);
        toast.success("Property removed from wishlist.");
      } else {
        await addToWishlist(documentId);
        setLiked(true);
        toast.success("Property saved to wishlist ❤️");
      }
    } catch (error) {
      toast.error(error?.message || "Wishlist update failed.");
    } finally {
      setLoading(false);
    }
  };

  const rawImage = property?.CoverImage || property?.PropertyImage || property?.image;
  const imageUrl = getImageUrl(rawImage);
  const location = [area, city].filter(Boolean).join(", ");

  const isOwnerPage = pathname?.startsWith("/owner");
  const viewRoute = documentId
    ? isOwnerPage
      ? `/owner/properties/${documentId}`
      : `/user/property/${documentId}`
    : "#";

  return (
    <div className="w-full h-full">
      <article className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--border-hover,rgba(255,255,255,0.18))]">
        
        {/* =================================================
            MEDIA / IMAGE CONTAINER (Fixed 16:10 compact ratio)
        ================================================= */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-section)]">
          <Link href={viewRoute} className="block w-full h-full relative cursor-pointer">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 280px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              unoptimized
            />
            {/* Subtle atmospheric vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />
          </Link>

          {/* BADGES (Top-Left) */}
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 flex-wrap">
            {purpose && (
              <span className="rounded-md bg-[var(--accent)] text-[var(--accent-text)] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                {purpose}
              </span>
            )}
            {propertyStatus && (
              <span className="rounded-md bg-[var(--bg-card)]/90 backdrop-blur-md text-[var(--text-primary)] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider shadow-sm border border-[var(--border-subtle)]">
                {propertyStatus}
              </span>
            )}
          </div>

          {/* WISHLIST BUTTON (Top-Right) */}
          <button
            type="button"
            onClick={handleWishlist}
            disabled={loading}
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-card)]/90 backdrop-blur-md shadow-sm border border-[var(--border-subtle)] transition-all hover:scale-110 active:scale-95"
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              size={13} 
              className={liked ? "fill-red-500 text-red-500" : "text-[var(--text-primary)] transition-colors"} 
            />
          </button>

          {/* PRICE (Bottom-Left on Media) */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-baseline justify-between text-white pointer-events-none">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold tracking-tight drop-shadow-md">
                {price}
              </span>
              {purpose?.toLowerCase() === "rent" && (
                <span className="text-[10px] font-medium text-white/80">/mo</span>
              )}
            </div>
            {category && (
              <span className="text-[10px] font-bold text-white/85 tracking-wide px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm">
                {category}
              </span>
            )}
          </div>
        </div>

        {/* =================================================
            CARD CONTENT
        ================================================= */}
        <div className="flex flex-1 flex-col p-3.5 sm:p-4 justify-between">
          <div>
            {/* Type & Location */}
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <span>{propertyType}</span>
              {location && (
                <span className="flex items-center gap-1 font-semibold normal-case text-xs text-[var(--text-secondary)] truncate max-w-[55%]">
                  <MapPin size={11} className="shrink-0 text-[var(--text-muted)]" />
                  <span className="truncate">{location}</span>
                </span>
              )}
            </div>

            {/* Title (Limited to 2 lines) */}
            <h3 
              className="mt-1.5 line-clamp-2 text-sm font-bold text-[var(--text-primary)] leading-snug transition-colors group-hover:text-[var(--text-primary)]" 
              title={title}
            >
              <Link href={viewRoute}>
                {title}
              </Link>
            </h3>

            {/* Specifications Bar (Residential, Commercial, Industrial) */}
            <div className="mt-3 flex items-center gap-2.5 border-t border-[var(--border-subtle)] pt-2.5 text-[11px] text-[var(--text-secondary)] font-medium">
              {/* Residential: Bedrooms */}
              {!isCommercial && !isIndustrial && bedrooms !== null && bedrooms !== undefined && (
                <span className="flex items-center gap-1">
                  <BedDouble size={13} className="text-[var(--text-muted)]" />
                  <span>{getSafeValue(bedrooms)} Beds</span>
                </span>
              )}

              {/* Residential: Bathrooms */}
              {!isCommercial && !isIndustrial && bathrooms !== null && bathrooms !== undefined && (
                <span className="flex items-center gap-1">
                  <Bath size={13} className="text-[var(--text-muted)]" />
                  <span>{getSafeValue(bathrooms)} Baths</span>
                </span>
              )}

              {/* Commercial / Industrial: Type badges */}
              {isCommercial && (
                <span className="flex items-center gap-1">
                  <Building size={13} className="text-[var(--text-muted)]" />
                  <span>{category || "Office"}</span>
                </span>
              )}

              {isIndustrial && (
                <span className="flex items-center gap-1">
                  <Warehouse size={13} className="text-[var(--text-muted)]" />
                  <span>{category || "Industrial"}</span>
                </span>
              )}

              {/* Area */}
              {builtUpArea !== null && builtUpArea !== undefined && (
                <span className="flex items-center gap-1">
                  <Maximize size={13} className="text-[var(--text-muted)]" />
                  <span>{getSafeValue(builtUpArea)} {areaUnit}</span>
                </span>
              )}

              {/* Floors if available and bedrooms not shown */}
              {(isCommercial || isIndustrial || bedrooms === null) && floors && (
                <span className="flex items-center gap-1">
                  <Layers size={13} className="text-[var(--text-muted)]" />
                  <span>{floors} Floors</span>
                </span>
              )}
            </div>
          </div>

          {/* =================================================
              ACTIONS (Details & Contact)
          ================================================= */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-[var(--border-subtle)] pt-3">
            <Link
              href={viewRoute}
              onClick={(e) => { 
                if (!documentId) { 
                  e.preventDefault(); 
                  toast.error("Property ID not found."); 
                } 
              }}
              className="hh-btn hh-btn-primary hh-btn-sm w-full text-center justify-center font-bold text-xs"
            >
              <Eye size={12} />
              <span>Details</span>
            </Link>

            <button
              type="button"
              onClick={(e) => { 
                e.preventDefault(); 
                if (!documentId) { 
                  toast.error("Property ID not found."); 
                } else if (onContact) {
                  onContact(property);
                } else { 
                  setIsContactModalOpen(true); 
                } 
              }}
              className="hh-btn hh-btn-secondary hh-btn-sm w-full text-center justify-center font-bold text-xs"
            >
              <Phone size={12} />
              <span>Contact</span>
            </button>
          </div>
        </div>

      </article>

      {/* Standalone Contact Modal */}
      <ContactOwnerModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        property={property} 
      />
    </div>
  );
}