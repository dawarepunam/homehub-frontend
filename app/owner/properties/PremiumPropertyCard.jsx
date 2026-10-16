"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Eye,
  Bookmark,
  MessageCircle,
  Building,
  Maximize,
  Calendar,
  Pencil,
  ExternalLink,
  Loader2,
  ImageOff,
} from "lucide-react";
import styles from "./properties.module.css";
import {
  getPropertyViews,
  getPropertySaves,
  getPropertyEnquiries,
} from "@/services/activityService";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:1337";

function safeValue(value, fallback = "") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") {
    if (value?.name) return value.name;
    if (value?.label) return value.label;
    if (value?.value) return value.value;
    return fallback;
  }
  return String(value);
}

function getImageUrl(property) {
  let image = property?.CoverImage;

  if (!image) {
    const images = property?.PropertyImages || property?.PropertyImage;
    if (Array.isArray(images) && images.length > 0) {
      image = images[0];
    } else if (images?.data) {
      const imagesArr = Array.isArray(images.data) ? images.data : [images.data];
      const parsedImages = imagesArr.map((img) => img?.attributes || img);
      if (parsedImages.length > 0) {
        image = parsedImages[0];
      }
    }
  }

  if (!image) return null;

  const url =
    image?.formats?.medium?.url ||
    image?.formats?.small?.url ||
    image?.formats?.thumbnail?.url ||
    image?.url;

  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

function formatPriceDisplay(price, units, purpose) {
  if (price === null || price === undefined || price === "") {
    return { priceText: "Price on Request", periodText: "" };
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice)) {
    const str = String(price).trim();
    if (!str || str.toLowerCase() === "price on request" || str === "--") {
      return { priceText: "Price on Request", periodText: "" };
    }
    return { priceText: str, periodText: "" };
  }

  const formatted = new Intl.NumberFormat("en-IN").format(numericPrice);
  const rawUnit = safeValue(units, "").trim();
  const lowerUnit = rawUnit.toLowerCase();
  const isRent = safeValue(purpose, "").trim().toLowerCase() === "rent";

  // Check if unit is rental period like "/month", "monthly", "per month"
  const isMonthUnit =
    lowerUnit === "/month" ||
    lowerUnit === "monthly" ||
    lowerUnit === "month" ||
    lowerUnit === "/ month";

  let priceText = `₹${formatted}`;
  let periodText = "";

  if (isMonthUnit) {
    periodText = "/month";
  } else if (rawUnit && lowerUnit !== "inr" && lowerUnit !== "rs" && lowerUnit !== "rs.") {
    priceText = `₹${formatted} ${rawUnit}`;
  }

  if (isRent && !periodText) {
    periodText = "/month";
  }

  return { priceText, periodText };
}

function formatListedDate(date) {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

export default function PremiumPropertyCard({ property, index = 0, onUpdate, stats }) {
  // stats: pre-loaded batch stats from the parent page { views, saves, enquiries }
  // If stats prop is provided, skip individual API calls entirely.
  const [activityStats, setActivityStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const docId = property?.documentId || property?.id;

  useEffect(() => {
    // If parent has provided pre-loaded batch stats, use them immediately
    if (stats) {
      setActivityStats(stats);
      return;
    }

    // Fallback: fetch stats individually when used as standalone card
    if (!docId) return;
    let cancelled = false;

    async function fetchStats(isInitial = false) {
      if (isInitial) setStatsLoading(true);
      try {
        const [views, saves, enquiries] = await Promise.all([
          getPropertyViews(docId),
          getPropertySaves(docId),
          getPropertyEnquiries(docId),
        ]);
        if (!cancelled) {
          setActivityStats({
            views: views?.length ?? (property?.Views ?? property?.views ?? 0),
            saves: saves?.length ?? (property?.Saves ?? property?.saves ?? 0),
            enquiries: enquiries?.length ?? (property?.enquiries?.length ?? property?.Enquiries ?? 0),
          });
        }
      } catch {
        if (!cancelled && isInitial) {
          setActivityStats({
            views: property?.Views ?? property?.views ?? 0,
            saves: property?.Saves ?? property?.saves ?? 0,
            enquiries: property?.enquiries?.length ?? property?.Enquiries ?? 0,
          });
        }
      } finally {
        if (!cancelled && isInitial) setStatsLoading(false);
      }
    }

    fetchStats(true);
    // Only poll when no pre-loaded stats (standalone use)
    const interval = setInterval(() => fetchStats(false), 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [docId, property, stats]);

  if (!property) return null;

  const rawStatus = (property?.PropertyStatus || "ACTIVE").toString().trim();
  const upperStatus = rawStatus.toUpperCase();

  // Subtle monochrome status badge class
  let statusBadgeClass = styles["seller-status-default"];
  if (upperStatus === "ACTIVE" || upperStatus === "AVAILABLE") {
    statusBadgeClass = styles["seller-status-active"];
  } else if (upperStatus === "PENDING") {
    statusBadgeClass = styles["seller-status-pending"];
  } else if (upperStatus === "REJECTED") {
    statusBadgeClass = styles["seller-status-rejected"];
  } else if (upperStatus === "SOLD") {
    statusBadgeClass = styles["seller-status-sold"];
  } else if (upperStatus === "RENTED") {
    statusBadgeClass = styles["seller-status-rented"];
  }

  const title = safeValue(property?.Title, "Untitled Property");
  const city = safeValue(property?.City);
  const area = safeValue(property?.Area);
  const locationText = area && city ? `${area}, ${city}` : area || city || "Location not specified";

  const commonDetails = property?.PropertyCommonDetails || {};
  const residentialDetails = property?.ResidentialDetails || {};
  const commercialDetails = property?.CommercialDetails || {};

  const rawPrice = property?.Price ?? commonDetails?.Price;
  const rawUnits = property?.PriceUnits ?? commonDetails?.PriceUnits;
  const purpose = property?.Purpose || "";
  const { priceText, periodText } = formatPriceDisplay(rawPrice, rawUnits, purpose);

  // Property facts: Area and Property Type
  const builtUpArea =
    commonDetails?.BuiltUpArea ??
    commonDetails?.Built_upArea ??
    commonDetails?.Area ??
    property?.BuiltUpArea ??
    property?.AreaSize ??
    null;

  const propertyType = safeValue(property?.Property_Type || property?.Category, "");

  // Real stats
  const viewsCount = activityStats
    ? activityStats.views
    : (property?.Views ?? property?.views ?? 0);
  const savesCount = activityStats
    ? activityStats.saves
    : (property?.Saves ?? property?.saves ?? 0);
  const enquiriesCount = activityStats
    ? activityStats.enquiries
    : (property?.enquiries?.length ?? property?.Enquiries ?? 0);

  const listingDate = formatListedDate(property?.createdAt || property?.publishedAt);
  const imageUrl = getImageUrl(property);

  // Stagger entrance animation via inline style delay
  const animationDelay = `${Math.min(index * 60, 480)}ms`;

  return (
    <article
      className={styles["seller-property-card"]}
      style={{ animationDelay }}
    >
      {/* 1. Property Image with Status Badge */}
      <div className={styles["seller-card-image-wrap"]}>
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles["seller-card-img"]}
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--seller-bg-subtle)] text-[var(--seller-text-subtle)]">
            <ImageOff size={32} strokeWidth={1.5} />
            <span className="mt-1.5 text-xs font-semibold">No Image Available</span>
          </div>
        )}

        {/* 2. Actual Status Badge */}
        <span className={`${styles["seller-status-badge"]} ${statusBadgeClass}`}>
          {upperStatus}
        </span>
      </div>

      {/* Card Content */}
      <div className={styles["seller-card-body"]}>
        {/* 3. Property Title */}
        <h3 className={styles["seller-card-title"]} title={title}>
          {title}
        </h3>

        {/* 4. Property Address / Location */}
        <p className={styles["seller-card-location"]} title={locationText}>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} className="shrink-0 text-[var(--seller-text-subtle)]" />
            <span>{locationText}</span>
          </span>
        </p>

        {/* 5. Price and Rental Period */}
        <div className={styles["seller-card-price-row"]}>
          <span className={styles["seller-card-price"]}>{priceText}</span>
          {periodText && (
            <span className={styles["seller-card-period"]}>{periodText}</span>
          )}
        </div>

        {/* 6. Area and Property Type */}
        <div className={styles["seller-card-facts"]}>
          {builtUpArea && (
            <span className={styles["seller-card-fact-item"]}>
              <Maximize size={11} strokeWidth={2} />
              <span>{builtUpArea} sq.ft</span>
            </span>
          )}
          {propertyType && (
            <span className={styles["seller-card-fact-item"]}>
              <Building size={11} strokeWidth={2} />
              <span>{propertyType}</span>
            </span>
          )}
        </div>

        {/* 7. Line Icons & Metrics (Views, Saves, Enquiries) */}
        <div className={styles["seller-card-metrics"]}>
          {/* Eye - Views */}
          <div className={styles["seller-metric-item"]} title="Total Views">
            <span className={styles["seller-metric-val"]}>
              <Eye size={13} strokeWidth={1.8} />
              {statsLoading ? (
                <Loader2 size={11} className="animate-spin text-[var(--seller-text-muted)]" />
              ) : (
                viewsCount
              )}
            </span>
            <span className={styles["seller-metric-lbl"]}>Views</span>
          </div>

          {/* Bookmark - Saves */}
          <div className={styles["seller-metric-item"]} title="Saved by Buyers">
            <span className={styles["seller-metric-val"]}>
              <Bookmark size={13} strokeWidth={1.8} />
              {statsLoading ? (
                <Loader2 size={11} className="animate-spin text-[var(--seller-text-muted)]" />
              ) : (
                savesCount
              )}
            </span>
            <span className={styles["seller-metric-lbl"]}>Saves</span>
          </div>

          {/* Message Circle - Enquiries */}
          <div className={styles["seller-metric-item"]} title="Total Enquiries">
            <span className={styles["seller-metric-val"]}>
              <MessageCircle size={13} strokeWidth={1.8} />
              {statsLoading ? (
                <Loader2 size={11} className="animate-spin text-[var(--seller-text-muted)]" />
              ) : (
                enquiriesCount
              )}
            </span>
            <span className={styles["seller-metric-lbl"]}>Enquiries</span>
          </div>
        </div>

        {/* 8. Listing Date */}
        {listingDate && (
          <div className={styles["seller-card-date"]}>
            <Calendar size={11} strokeWidth={1.8} />
            <span>Listed on {listingDate}</span>
          </div>
        )}

        {/* 9. View and Edit Buttons */}
        <div className={styles["seller-card-actions"]}>
          <Link
            href={`/owner/properties/${docId}`}
            className={styles["seller-btn-view"]}
            id={`view-property-${docId}`}
          >
            <Eye size={13} strokeWidth={1.8} />
            <span>View</span>
          </Link>
          <Link
            href={`/owner/properties/${docId}/edit`}
            className={styles["seller-btn-edit"]}
            id={`edit-property-${docId}`}
          >
            <Pencil size={13} strokeWidth={1.8} />
            <span>Edit</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
