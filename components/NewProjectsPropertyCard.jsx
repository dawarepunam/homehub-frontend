"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, ArrowUpRight, Heart, BedDouble, Bath, Car, Maximize } from "lucide-react";
import toast from "react-hot-toast";
import { addToWishlist, removeFromWishlist, isPropertyInWishlist } from "@/services/wishlistService";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function getImageUrl(property) {
  let image = property?.CoverImage;
  if (!image) {
    const images = property?.PropertyImages || property?.PropertyImage;
    if (Array.isArray(images) && images.length > 0) image = images[0];
  }
  if (!image) return null;
  const url =
    image?.formats?.medium?.url ||
    image?.formats?.small?.url ||
    image?.formats?.thumbnail?.url ||
    image?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

function formatPrice(price, units) {
  if (price === null || price === undefined || price === "") return null;
  const n = Number(price);
  if (isNaN(n)) return null;
  const formatted = new Intl.NumberFormat("en-IN").format(n);
  const unit = (units || "INR").toLowerCase();
  return unit !== "inr" ? `₹${formatted} ${units}` : `₹${formatted}`;
}

/* ─────────────────────────────────────────
   CATEGORY BADGE CONFIG
───────────────────────────────────────── */
function getCategoryConfig(category) {
  const c = (category || "").toLowerCase();
  if (c.includes("launch")) return { label: "New Launch", dot: "#22c55e" };
  if (c.includes("upcoming")) return { label: "Upcoming", dot: "#f59e0b" };
  if (c.includes("under") || c.includes("construction")) return { label: "Under Construction", dot: "#3b82f6" };
  if (c.includes("ready")) return { label: "Ready to Move", dot: "#10b981" };
  return { label: category || "Project", dot: "#888" };
}

/* ─────────────────────────────────────────
   LUXURY PROPERTY CARD
───────────────────────────────────────── */
export default function NewProjectsPropertyCard({ property, priority = false }) {
  const [liked, setLiked] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!property) return null;

  const documentId = property?.documentId || property?.id;
  const title = property?.Title || "Untitled Property";
  const city = property?.City || "";
  const area = property?.Area || "";
  const purpose = property?.Purpose || "Sale";
  const propertyType = property?.Property_Type || "";
  const category = property?.Category || "";
  const imageUrl = !imageError ? getImageUrl(property) : null;

  const commonDetails = property?.PropertyCommonDetails || {};
  const residentialDetails = property?.ResidentialDetails || {};
  const commercialDetails = property?.CommercialDetails || {};

  const bedrooms = residentialDetails?.Bedrooms ?? commonDetails?.Bedrooms ?? property?.Bedrooms ?? null;
  const bathrooms = residentialDetails?.Bathrooms ?? commonDetails?.Bathrooms ?? property?.Bathrooms ?? null;
  const parking = residentialDetails?.Parking ?? commonDetails?.Parking ?? property?.Parking ?? null;
  const builtUpArea = commonDetails?.BuiltUpArea ?? commonDetails?.Built_upArea ?? property?.BuiltUpArea ?? null;

  const price = formatPrice(
    property?.Price ?? commonDetails?.Price,
    property?.PriceUnits ?? commonDetails?.PriceUnits
  );

  const catConfig = getCategoryConfig(category);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlistLoading) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please login to save properties.");
      return;
    }
    try {
      setWishlistLoading(true);
      const alreadyLiked = await isPropertyInWishlist(documentId);
      if (alreadyLiked) {
        await removeFromWishlist(documentId);
        setLiked(false);
        toast.success("Removed from saved.");
      } else {
        await addToWishlist(documentId);
        setLiked(true);
        toast.success("Saved to wishlist ❤️");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to update wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <article
      className="np-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── IMAGE BLOCK ── */}
      <Link
        href={`/property/${documentId}`}
        className="np-card__img-wrap"
        tabIndex={-1}
        aria-hidden="true"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={`np-card__img ${isHovered ? "np-card__img--zoomed" : ""}`}
            unoptimized
            priority={priority}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="np-card__img-placeholder">
            <span className="np-card__img-placeholder-text">No Image</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="np-card__gradient" />

        {/* Category badge */}
        <div className="np-card__badges">
          <span className="np-card__badge">
            <span
              className="np-card__badge-dot"
              style={{ background: catConfig.dot }}
            />
            {catConfig.label}
          </span>
          {propertyType && (
            <span className="np-card__badge np-card__badge--type">
              {propertyType}
            </span>
          )}
        </div>

        {/* Price overlay on image */}
        {price && (
          <div className="np-card__price-overlay">
            <span className="np-card__price-text">{price}</span>
            {purpose.toLowerCase() === "rent" && (
              <span className="np-card__price-unit">/mo</span>
            )}
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading}
          className={`np-card__wishlist ${liked ? "np-card__wishlist--liked" : ""}`}
          aria-label={liked ? "Remove from wishlist" : "Save property"}
        >
          <Heart
            size={16}
            className={liked ? "fill-current" : ""}
          />
        </button>
      </Link>

      {/* ── CONTENT BLOCK ── */}
      <div className="np-card__body">
        {/* Title */}
        <Link href={`/property/${documentId}`} className="np-card__title-link">
          <h2 className="np-card__title">{title}</h2>
        </Link>

        {/* Location */}
        {(area || city) && (
          <p className="np-card__location">
            <MapPin size={12} className="np-card__location-icon" />
            <span>
              {area}
              {area && city ? ", " : ""}
              {city}
            </span>
          </p>
        )}

        {/* Features row */}
        {(bedrooms !== null || bathrooms !== null || parking !== null || builtUpArea !== null) && (
          <div className="np-card__features">
            {bedrooms !== null && (
              <span className="np-card__feature">
                <BedDouble size={12} />
                {bedrooms} {Number(bedrooms) === 1 ? "Bed" : "Beds"}
              </span>
            )}
            {bathrooms !== null && (
              <span className="np-card__feature">
                <Bath size={12} />
                {bathrooms} {Number(bathrooms) === 1 ? "Bath" : "Baths"}
              </span>
            )}
            {parking !== null && (
              <span className="np-card__feature">
                <Car size={12} />
                {parking} Parking
              </span>
            )}
            {builtUpArea !== null && (
              <span className="np-card__feature">
                <Maximize size={11} />
                {builtUpArea} sq.ft
              </span>
            )}
          </div>
        )}

        {/* CTA row */}
        <div className="np-card__actions">
          <Link
            href={`/property/${documentId}`}
            className="np-card__cta"
          >
            View Details
            <ArrowUpRight size={14} className="np-card__cta-icon" />
          </Link>
          <Link
            href={`/user/contact-owner/${documentId}`}
            className="np-card__contact"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
