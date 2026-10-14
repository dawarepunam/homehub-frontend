"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  MapPin,
  Phone,
  Share2,
  Image as ImageIcon,
  X,
  ChevronDown,
  ChevronUp,
  BedDouble,
  Bath,
  Maximize,
  Sofa,
  CarFront,
  SearchX,
  ArrowUpDown,
  ShieldCheck,
  Camera,
  Zap,
  Dumbbell,
  Waves,
  Trees,
  Club,
  Droplets,
  Flame,
  Car,
  Wifi,
  PhoneCall,
  Wind,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Building2,
  Calendar,
  Tag,
} from "lucide-react";

import PropertyCard from "./PropertyCard";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

// =====================================================
// MEDIA URL
// =====================================================

const getMediaUrl = (media) => {
  if (!media) return null;
  const url =
    media?.url ||
    media?.formats?.large?.url ||
    media?.formats?.medium?.url ||
    media?.formats?.small?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
};

// =====================================================
// GALLERY
// =====================================================

const getGallery = (property) => {
  const gallery =
    property?.PropertyImage ||
    property?.PropertyImages ||
    property?.Gallery ||
    property?.GalleryImages ||
    property?.PropertyGallery ||
    property?.Images ||
    [];
  if (!Array.isArray(gallery)) return [];
  return gallery.map(getMediaUrl).filter(Boolean);
};

// =====================================================
// PRICE FORMATTER — Indian system (actual raw number)
// Matches logic in ownerInsights.js / localityInsights.js
// e.g. 8500000 => "Rs 85 Lac", 15000000 => "Rs 1.50 Cr"
// =====================================================

function formatIndianPrice(raw) {
  if (raw === null || raw === undefined || raw === "") return null;
  const num = Number(raw);
  if (isNaN(num) || num <= 0) return typeof raw === "string" && raw.trim() ? raw : null;

  if (num >= 10000000) {
    const cr = num / 10000000;
    return `\u20B9${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    const lac = num / 100000;
    return `\u20B9${lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(2)} Lac`;
  }
  return `\u20B9${num.toLocaleString("en-IN")}`;
}

// =====================================================
// GOOGLE MAPS URL BUILDER
// Uses lat/lng if available; otherwise builds from address
// =====================================================

function buildMapsUrl(property) {
  const lat = property?.Latitude || property?.latitude || property?.Lat;
  const lng = property?.Longitude || property?.longitude || property?.Lng;
  if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return `https://www.google.com/maps?q=${Number(lat)},${Number(lng)}`;
  }
  const parts = [
    property?.Address,
    property?.Locality,
    property?.Area,
    property?.City,
    property?.State,
    property?.PinCode,
  ].filter(Boolean);
  if (parts.length === 0) return null;
  const query = encodeURIComponent(parts.join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

// =====================================================
// VALUE FORMATTER
// =====================================================

const renderValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return "-";
  return value.toString();
};

// =====================================================
// RICH TEXT
// =====================================================

const renderRichText = (description) => {
  if (!description) return "No description available.";
  if (typeof description === "string") return description;
  if (Array.isArray(description)) {
    return description
      .map((block) =>
        block?.children?.map((child) => child?.text || "").join("")
      )
      .filter(Boolean)
      .join("\n\n");
  }
  return "No description available.";
};

// =====================================================
// DETAIL GRID — compact, 2-col mobile, 3-col desktop
// =====================================================

function DetailGrid({ title, items }) {
  const visibleItems = items.filter(
    (item) =>
      item?.value !== null &&
      item?.value !== undefined &&
      item?.value !== "" &&
      item?.value !== "-"
  );
  if (visibleItems.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-sm">
      <h2 className="text-base font-extrabold text-[var(--text-primary)] mb-5">{title}</h2>
      <div className="grid gap-x-6 gap-y-4 grid-cols-2 sm:grid-cols-3">
        {visibleItems.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              {item.label}
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
              {renderValue(item.value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// =====================================================
// PROPERTY DETAILS — MAIN COMPONENT
// =====================================================

export default function PropertyDetails({ property, relatedProperties = [] }) {
  const [liked, setLiked] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showLightbox ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showLightbox]);

  const coverImage = getMediaUrl(property?.CoverImage) || "/no-property.png";
  const gallery = getGallery(property);
  const allImages = useMemo(() => {
    return [coverImage, ...gallery.filter((img) => img !== coverImage)];
  }, [coverImage, gallery]);

  // ===================================================
  // NOT FOUND
  // ===================================================

  if (!property) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-20 bg-[var(--bg-page)]">
        <div className="w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-surface)]">
            <SearchX size={28} className="text-[var(--text-muted)]" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold text-[var(--text-primary)]">Property Not Found</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">This property may have been removed or is no longer available.</p>
          <Link
            href="/user"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--btn-primary-bg)] px-6 py-3 font-bold text-[var(--btn-primary-text)] transition hover:opacity-90"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </section>
    );
  }

  // ===================================================
  // DATA EXTRACTION
  // ===================================================

  const commonDetails = property?.PropertyCommonDetails || {};
  const residentialDetails =
    property?.ResidentialDetails ||
    property?.ResidentialPropertyDetails ||
    property?.PropertyResidentialDetails;

  const descriptionText = renderRichText(property?.Description);
  const isLongDescription = descriptionText.length > 400;

  // Price
  const rawPrice = commonDetails?.Price || property?.Price;
  const formattedPrice = formatIndianPrice(rawPrice) || "Price on Request";

  // Amenities
  const rawAmenities = property?.PropertyAmenities || {};
  const fallbackFeatures = Array.isArray(property?.Features)
    ? property.Features
    : typeof property?.Features === "string"
    ? property.Features.split(",")
    : [];

  const amenityIconMap = {
    Parking:        { icon: CarFront,   label: "Parking" },
    Lift:           { icon: ArrowUpDown,label: "Elevator / Lift" },
    Security:       { icon: ShieldCheck,label: "24/7 Security" },
    CCTV:           { icon: Camera,     label: "CCTV" },
    PowerBackup:    { icon: Zap,        label: "Power Backup" },
    Gym:            { icon: Dumbbell,   label: "Gymnasium" },
    SwimmingPool:   { icon: Waves,      label: "Swimming Pool" },
    Garden:         { icon: Trees,      label: "Garden / Park" },
    ClubHouse:      { icon: Club,       label: "Club House" },
    WaterSupply:    { icon: Droplets,   label: "Water Supply" },
    FireSafety:     { icon: Flame,      label: "Fire Safety" },
    VisitorParking: { icon: Car,        label: "Visitor Parking" },
    Wifi:           { icon: Wifi,       label: "Wi-Fi" },
    Intercom:       { icon: PhoneCall,  label: "Intercom" },
    AC:             { icon: Wind,       label: "Air Conditioning" },
  };

  const featureList = [];
  if (typeof rawAmenities === "object" && Object.keys(rawAmenities).length > 0) {
    Object.entries(rawAmenities).forEach(([key, value]) => {
      if (value === true && !["id", "__component"].includes(key)) {
        const mapped = amenityIconMap[key] || {
          icon: CheckCircle2,
          label: key.replace(/([A-Z])/g, " $1").trim(),
        };
        featureList.push(mapped);
      }
    });
  }
  fallbackFeatures.forEach((feature) => {
    const featureStr = renderValue(feature).trim();
    if (featureStr && !featureList.some((f) => f.label.toLowerCase() === featureStr.toLowerCase())) {
      featureList.push({ icon: CheckCircle2, label: featureStr });
    }
  });

  // Key highlights
  const areaUnit   = commonDetails?.Area_Unit || commonDetails?.AreaUnit || "";
  const carpetArea = commonDetails?.CarpetArea ? `${commonDetails.CarpetArea} ${areaUnit}`.trim() : null;
  const builtupArea = commonDetails?.Built_upArea ? `${commonDetails.Built_upArea} ${areaUnit}`.trim() : null;
  const beds    = residentialDetails?.Bedrooms   || commonDetails?.Bedrooms   || property?.Bedrooms;
  const baths   = residentialDetails?.Bathrooms  || commonDetails?.Bathrooms  || property?.Bathrooms;
  const furnish = residentialDetails?.Furnishing || commonDetails?.Furnishing;
  const park    = commonDetails?.Parking;
  const propArea = carpetArea || builtupArea || null;

  // Overview
  const strapiOverview = Array.isArray(property?.PropertyOverview)
    ? property.PropertyOverview.map((item) => ({ label: item?.Title, value: item?.Value }))
    : [];

  const overviewItems = [
    ...strapiOverview,
    { label: "Carpet Area",   value: carpetArea },
    { label: "Built-up Area", value: builtupArea },
    { label: "Floor",         value: residentialDetails?.Floor_No || commonDetails?.Floor },
    { label: "Total Floors",  value: residentialDetails?.Total_Floors || commonDetails?.TotalFloors },
    { label: "Furnishing",    value: furnish },
    { label: "Parking",       value: park },
    { label: "Facing",        value: commonDetails?.Facing },
    { label: "Property Age",  value: commonDetails?.PropertyAge },
    { label: "Available From",value: commonDetails?.AvailableForm || commonDetails?.AvailableFrom },
    { label: "Status",        value: property?.PropertyStatus },
    {
      label: "Listed On",
      value: property?.publishedAt
        ? new Date(property.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : null,
    },
  ];

  // Location
  const addressParts = [
    property?.Address,
    property?.Locality,
    property?.Area,
    property?.City,
    property?.State,
    property?.PinCode,
  ].filter(Boolean);
  const displayAddress  = addressParts.length > 0 ? addressParts.join(", ") : null;
  const shortLocation   = [property?.Area, property?.City, property?.State].filter(Boolean).join(", ");
  const mapsUrl         = buildMapsUrl(property);

  // Share
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: property.Title, text: "Check out this property on HomeHub", url: window.location.href }).catch(() => {});
    } else if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="bg-[var(--bg-page)] text-[var(--text-primary)] min-h-screen pb-24 lg:pb-12">

      {/* ── Lightbox ── */}
      {showLightbox && (
        <div className="fixed inset-0 z-[99999] flex flex-col bg-black/96 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-b border-white/10">
            <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">
              {lightboxIndex + 1} / {allImages.length}
            </span>
            <button
              onClick={() => setShowLightbox(false)}
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
              aria-label="Close gallery"
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 relative">
            <button
              onClick={() => setLightboxIndex((p) => (p > 0 ? p - 1 : allImages.length - 1))}
              className="absolute left-3 sm:left-6 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
              aria-label="Previous"
            >
              <ChevronLeft size={22} />
            </button>
            <img
              src={allImages[lightboxIndex]}
              alt={`Gallery image ${lightboxIndex + 1}`}
              className="max-h-full max-w-full object-contain select-none rounded-lg"
            />
            <button
              onClick={() => setLightboxIndex((p) => (p < allImages.length - 1 ? p + 1 : 0))}
              className="absolute right-3 sm:right-6 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
              aria-label="Next"
            >
              <ChevronRight size={22} />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 p-4 overflow-x-auto border-t border-white/10">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className={`shrink-0 h-14 w-20 rounded-lg overflow-hidden border-2 transition ${
                  lightboxIndex === idx ? "border-white opacity-100" : "border-transparent opacity-40 hover:opacity-70"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Page Container ── */}
      <div className="mx-auto max-w-[1280px] px-4 pt-5 pb-6 sm:px-6 lg:px-8">

        {/* Top Bar */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="hh-btn hh-btn-secondary hh-btn-sm inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={handleShare} className="hh-btn hh-btn-secondary hh-btn-sm inline-flex items-center gap-1.5">
              <Share2 size={14} /> Share
            </button>
            <button type="button" onClick={() => setLiked(!liked)} className="hh-btn hh-btn-secondary hh-btn-sm inline-flex items-center gap-1.5">
              <Heart size={14} className={liked ? "fill-red-500 text-red-500" : ""} />
              {liked ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* ── GALLERY — compact two-column layout ── */}
        {/* Desktop: 360px; Tablet: 300px; Mobile: 220px */}
        <div className="relative mb-6 rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-sm bg-[var(--bg-section)]">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[3px] h-[220px] sm:h-[300px] lg:h-[360px]">

            {/* Primary image */}
            <div
              className="relative h-full cursor-pointer overflow-hidden group"
              onClick={() => { setLightboxIndex(0); setShowLightbox(true); }}
            >
              <img
                src={allImages[0]}
                alt={property.Title || "Property"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {/* Status badges */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {property?.Purpose && (
                  <span className="rounded-lg bg-[var(--accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-text)]">
                    For {property.Purpose}
                  </span>
                )}
                {property?.PropertyStatus && (
                  <span className="rounded-lg bg-[var(--bg-card)]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-primary)] border border-[var(--border-subtle)]">
                    {property.PropertyStatus}
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition pointer-events-none flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-bold text-white flex items-center gap-1.5 backdrop-blur">
                  <Maximize size={12} /> View
                </span>
              </div>
            </div>

            {/* Secondary thumbnails — desktop only */}
            <div className="hidden lg:grid grid-rows-2 gap-[3px] h-full">
              {allImages.length >= 2 ? (
                <>
                  {allImages.slice(1, 3).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative cursor-pointer overflow-hidden group"
                      onClick={() => { setLightboxIndex(idx + 1); setShowLightbox(true); }}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 2}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                      {idx === 1 && allImages.length > 3 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                          <span className="text-white font-bold text-sm">+{allImages.length - 3} more</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {allImages.length === 2 && (
                    <div className="bg-[var(--bg-surface)] flex items-center justify-center">
                      <ImageIcon size={24} className="text-[var(--text-muted)] opacity-25" />
                    </div>
                  )}
                </>
              ) : (
                <div className="row-span-2 bg-[var(--bg-surface)] flex items-center justify-center">
                  <ImageIcon size={28} className="text-[var(--text-muted)] opacity-25" />
                </div>
              )}
            </div>
          </div>

          {/* Photo count badge */}
          <button
            onClick={() => { setLightboxIndex(0); setShowLightbox(true); }}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-[var(--bg-card)]/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-[var(--text-primary)] border border-[var(--border-subtle)] shadow transition hover:bg-[var(--bg-card)]"
          >
            <ImageIcon size={12} />
            {allImages.length === 1 ? "1 Photo" : `View all ${allImages.length} photos`}
          </button>
        </div>

        {/* ── Two Column Layout ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT COLUMN */}
          <div className="flex-1 w-full min-w-0 space-y-5">

            {/* Title, Location & Price card */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-sm">
              {/* Eyebrow */}
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-2 flex items-center gap-2 flex-wrap">
                {property?.Property_Type && <span>{property.Property_Type}</span>}
                {property?.Category && (
                  <><span className="opacity-30">•</span><span>{property.Category}</span></>
                )}
              </p>
              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] leading-tight">
                {property.Title}
              </h1>
              {/* Location */}
              {shortLocation && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                  <MapPin size={14} className="shrink-0 text-[var(--text-primary)]" />
                  {shortLocation}
                </p>
              )}
              <div className="my-4 border-t border-[var(--border-subtle)]" />
              {/* Price + badges row */}
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">
                    {property?.Purpose === "Rent" ? "Monthly Rent" : "Asking Price"}
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                    {formattedPrice}
                  </p>
                  {property?.Purpose === "Rent" && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">per month</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {property?.Purpose && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-bold text-[var(--text-primary)]">
                      <Tag size={11} /> For {property.Purpose}
                    </span>
                  )}
                  {property?.PropertyStatus && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--badge-success-border,rgba(22,163,74,0.2))] bg-[var(--badge-success-bg,rgba(22,163,74,0.08))] px-3 py-1 text-xs font-bold text-[var(--badge-success-text,#15803d)]">
                      {property.PropertyStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            {(beds || baths || propArea || furnish || park) && (
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-4 shadow-sm overflow-x-auto">
                <div className="flex gap-0 min-w-0">
                  {[
                    beds    && { icon: BedDouble, label: "Bedrooms",   value: beds },
                    baths   && { icon: Bath,      label: "Bathrooms",  value: baths },
                    propArea&& { icon: Maximize,  label: "Area",       value: propArea },
                    furnish && { icon: Sofa,      label: "Furnishing", value: furnish },
                    park    && { icon: CarFront,  label: "Parking",    value: park },
                  ].filter(Boolean).map((stat, idx, arr) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2.5 flex-1 min-w-[90px] px-3 ${idx < arr.length - 1 ? "border-r border-[var(--border-subtle)]" : ""}`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                          <Icon size={15} className="text-[var(--text-primary)]" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{stat.label}</p>
                          <p className="text-sm font-bold text-[var(--text-primary)] whitespace-nowrap">{stat.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* About This Property */}
            <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-[var(--text-primary)] mb-3">About This Property</h2>
              <div className="relative">
                <div
                  className={`text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-line overflow-hidden transition-all duration-300 ${
                    !isDescExpanded && isLongDescription ? "max-h-[130px]" : "max-h-none"
                  }`}
                >
                  {descriptionText}
                </div>
                {!isDescExpanded && isLongDescription && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--bg-card)] to-transparent pointer-events-none" />
                )}
              </div>
              {isLongDescription && (
                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[var(--text-primary)] hover:underline transition"
                >
                  {isDescExpanded ? <><ChevronUp size={14} /> Read Less</> : <><ChevronDown size={14} /> Read More</>}
                </button>
              )}
            </section>

            {/* Property Overview */}
            <DetailGrid title="Property Overview" items={overviewItems} />

            {/* Amenities */}
            {featureList.length > 0 && (
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-sm">
                <h2 className="text-base font-extrabold text-[var(--text-primary)] mb-4">Amenities &amp; Features</h2>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {featureList.map((feature, index) => {
                    const IconComp = feature?.icon || CheckCircle2;
                    const label = feature?.label || "";
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 transition hover:border-[var(--text-primary)]/30 hover:shadow-sm"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                          <IconComp size={14} className="text-[var(--text-primary)]" />
                        </div>
                        <span className="text-xs font-semibold text-[var(--text-primary)] leading-snug">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Location — clickable to Google Maps */}
            <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-[var(--text-primary)] mb-4">Location</h2>
              <div className="flex items-start gap-4 rounded-xl bg-[var(--bg-surface)] p-4 border border-[var(--border-subtle)]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
                  <MapPin size={18} className="text-[var(--text-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">Property Address</h3>
                  {displayAddress ? (
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{displayAddress}</p>
                  ) : (
                    <p className="mt-1 text-sm text-[var(--text-muted)] italic">Address not provided by the owner.</p>
                  )}
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2 text-xs font-bold text-[var(--text-primary)] shadow-sm transition hover:border-[var(--text-primary)] hover:shadow-md"
                    >
                      <ExternalLink size={12} /> View on Google Maps
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* Mobile: inline contact card */}
            <div className="block lg:hidden">
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-sm">
                <h3 className="text-base font-extrabold text-[var(--text-primary)]">Interested in this property?</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Connect with the owner to arrange a viewing.</p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <Link
                    href={`/user/contact-owner/${property.documentId || property.id}`}
                    className="hh-btn hh-btn-primary w-full py-3 text-center font-bold flex items-center justify-center gap-2 text-sm"
                  >
                    <Phone size={16} /> Contact Owner
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLiked(!liked)}
                    className="hh-btn hh-btn-secondary w-full py-2.5 text-center font-bold flex items-center justify-center gap-2 text-sm"
                  >
                    <Heart size={16} className={liked ? "fill-current" : ""} />
                    {liked ? "Saved to Wishlist" : "Save Property"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — sticky sidebar, desktop only */}
          <aside className="hidden lg:block w-[320px] xl:w-[340px] shrink-0">
            <div className="sticky top-[88px] space-y-4">

              {/* Price + CTA */}
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-lg shadow-black/5">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] mb-1">
                  {property?.Purpose === "Rent" ? "Monthly Rent" : "Asking Price"}
                </p>
                <p className="text-2xl font-extrabold text-[var(--text-primary)]">{formattedPrice}</p>
                {property?.Purpose === "Rent" && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">per month</p>
                )}
                <div className="mt-4 border-t border-[var(--border-subtle)] pt-4 flex flex-col gap-2.5">
                  <Link
                    href={`/user/contact-owner/${property.documentId || property.id}`}
                    className="hh-btn hh-btn-primary w-full py-3 text-center font-bold flex items-center justify-center gap-2 text-sm"
                  >
                    <Phone size={16} /> Contact Owner
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLiked(!liked)}
                    className="hh-btn hh-btn-secondary w-full py-2.5 text-center font-bold flex items-center justify-center gap-2 text-sm"
                  >
                    <Heart size={16} className={liked ? "fill-current" : ""} />
                    {liked ? "Saved to Wishlist" : "Save Property"}
                  </button>
                </div>
              </div>

              {/* Listed By */}
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <Building2 size={17} className="text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Listed By</p>
                    <p className="text-sm font-extrabold text-[var(--text-primary)]">
                      {property?.Owner?.username || property?.Owner?.name || "Owner"}
                    </p>
                  </div>
                </div>
                {property?.publishedAt && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <Calendar size={11} />
                    Posted {new Date(property.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                )}
              </div>

              {/* Location quick card */}
              {(shortLocation || displayAddress) && (
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Location</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                    {shortLocation || displayAddress}
                  </p>
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-bold text-[var(--text-primary)] shadow-sm transition hover:border-[var(--text-primary)]"
                    >
                      <ExternalLink size={12} /> View on Google Maps
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* ── You May Also Like ── */}
        {relatedProperties.length > 0 && (
          <section className="mt-14 border-t border-[var(--border-subtle)] pt-10">
            <div className="mb-6">
              <p className="hh-eyebrow mb-2 inline-flex items-center gap-2">
                <span className="hh-eyebrow-dot" aria-hidden="true" /> More Like This
              </p>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)]">You May Also Like</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Similar properties in this category.</p>
            </div>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {relatedProperties.map((item) => (
                <PropertyCard key={item.documentId || item.id} property={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-card)]/95 backdrop-blur-md p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden">
        <button
          onClick={() => setLiked(!liked)}
          className="hh-btn hh-btn-secondary flex-1 h-11 flex items-center justify-center gap-2 text-sm font-bold"
        >
          <Heart size={16} className={liked ? "fill-current" : ""} />
          {liked ? "Saved" : "Save"}
        </button>
        <Link
          href={`/user/contact-owner/${property.documentId || property.id}`}
          className="hh-btn hh-btn-primary flex-1 h-11 flex items-center justify-center gap-2 text-sm font-bold"
        >
          <Phone size={16} /> Contact Owner
        </Link>
      </div>

    </div>
  );
}