"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  Pencil,
  MapPin,
  BedDouble,
  Bath,
  Car,
  Maximize,
  Building2,
  CalendarDays,
  Home,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Shield,
  Cctv,
  Zap,
  Dumbbell,
  Waves,
  TreePine,
  ExternalLink,
  Layers,
  Compass,
  Clock,
  Sparkles,
  Eye,
  Heart,
  MessageSquare,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "../../Footer";
import PropertyActivitySection from "@/components/PropertyActivitySection";

import { getOwnerDashboard, updatePropertyStatus } from "@/services/ownerDashboard";
import toast from "react-hot-toast";

/* =====================================================
   STRAPI URL
===================================================== */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:1337";

/* =====================================================
   SAFE TEXT
===================================================== */

function safeText(value, fallback = "") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => safeText(item))
      .filter(Boolean)
      .join(" ");
  }

  if (typeof value === "object") {
    if (typeof value.text === "string") {
      return value.text;
    }

    if (Array.isArray(value.children)) {
      return value.children
        .map((child) => safeText(child))
        .filter(Boolean)
        .join(" ");
    }

    if (value.children) {
      return safeText(value.children);
    }

    if (value.value !== undefined) {
      return safeText(value.value);
    }

    return fallback;
  }

  return fallback;
}

/* =====================================================
   IMAGE URL
===================================================== */

function getImageUrl(image) {
  if (!image) {
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";
  }

  const url =
    image?.url ||
    image?.data?.attributes?.url ||
    image?.data?.url ||
    "";

  if (!url) {
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `${STRAPI_URL}${url}`;
}

/* =====================================================
   MEDIA ARRAY
===================================================== */

function getMediaArray(value) {
  if (!value) {
    return [];
  }

  // Strapi v5 single image object
  if (value.url) {
    return [value];
  }

  // Already an array
  if (Array.isArray(value)) {
    return value;
  }

  // Strapi v4 array
  if (Array.isArray(value?.data)) {
    return value.data.map((item) => {
      if (item?.attributes) {
        return {
          id: item.id,
          ...item.attributes,
        };
      }
      return item;
    });
  }

  // Strapi v4 single object
  if (value?.data) {
    const item = value.data;
    if (item?.attributes) {
      return [
        {
          id: item.id,
          ...item.attributes,
        },
      ];
    }
    return [item];
  }

  return [];
}

/* =====================================================
   PRICE FORMAT (INDIAN CURRENCY & UNITS)
===================================================== */

function formatPrice(price, units) {
  if (price === null || price === undefined || price === "") {
    return "Price on Request";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return safeText(price, "Price on Request");
  }

  const formatted = new Intl.NumberFormat("en-IN").format(numericPrice);
  const unit = safeText(units, "").trim();

  if (unit && unit.toLowerCase() !== "inr") {
    return `₹${formatted} ${unit}`;
  }

  return `₹${formatted}`;
}

/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(date) {
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

/* =====================================================
   CATEGORY → BEDROOM FALLBACK
===================================================== */

function getBedroomsFromCategory(category) {
  const value = safeText(category).toLowerCase();

  if (value.includes("one bhk") || value.includes("1 bhk") || value.includes("1bhk")) {
    return 1;
  }
  if (value.includes("two bhk") || value.includes("2 bhk") || value.includes("2bhk")) {
    return 2;
  }
  if (value.includes("three bhk") || value.includes("3 bhk") || value.includes("3bhk")) {
    return 3;
  }
  if (value.includes("four bhk") || value.includes("4 bhk") || value.includes("4bhk")) {
    return 4;
  }
  return null;
}

/* =====================================================
   AMENITY NAME
===================================================== */

function formatAmenityName(key) {
  return safeText(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function getAmenityIcon(key) {
  const k = key.toLowerCase();
  if (k.includes("park") || k.includes("car")) return <Car size={15} className="text-[var(--seller-text)]" />;
  if (k.includes("lift") || k.includes("elev")) return <Building2 size={15} className="text-[var(--seller-text)]" />;
  if (k.includes("secur")) return <Shield size={15} className="text-[var(--seller-text)]" />;
  if (k.includes("cctv")) return <Cctv size={15} className="text-[var(--seller-text)]" />;
  if (k.includes("power") || k.includes("backup") || k.includes("elect")) return <Zap size={15} className="text-[var(--seller-text)]" />;
  if (k.includes("gym") || k.includes("fit")) return <Dumbbell size={15} className="text-[var(--seller-text)]" />;
  if (k.includes("swim") || k.includes("pool") || k.includes("water")) return <Waves size={15} className="text-[var(--seller-text)]" />;
  if (k.includes("garden") || k.includes("tree") || k.includes("park")) return <TreePine size={15} className="text-[var(--seller-text)]" />;
  return <CheckCircle2 size={15} className="text-[var(--seller-text-muted)]" />;
}

/* =====================================================
   STATUS BADGE STYLING
===================================================== */

function getStatusBadge(status) {
  const s = safeText(status).toLowerCase();
  if (s === "available" || s === "active") {
    return {
      label: "Active",
      classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
      dot: "bg-emerald-500",
    };
  }
  if (s === "pending") {
    return {
      label: "Pending",
      classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
      dot: "bg-amber-500",
    };
  }
  if (s === "sold") {
    return {
      label: "Sold",
      classes: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
      dot: "bg-red-500",
    };
  }
  if (s === "rented") {
    return {
      label: "Rented",
      classes: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
      dot: "bg-purple-500",
    };
  }
  return {
    label: safeText(status, "Draft"),
    classes: "bg-[var(--seller-bg-subtle)] text-[var(--seller-text-muted)] border border-[var(--seller-border)]",
    dot: "bg-[var(--seller-text-subtle)]",
  };
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function OwnerPropertyDetailsPage({ params }) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  let backLink = "/owner/properties";
  let backLabel = "Back to My Properties";

  if (from === "residential") {
    backLink = "/owner/properties/residential";
    backLabel = "Back to Residential";
  } else if (from === "commercial") {
    backLink = "/owner/properties/commercial";
    backLabel = "Back to Commercial";
  } else if (from === "industrial") {
    backLink = "/owner/properties/industrial";
    backLabel = "Back to Industrial";
  }

  const [property, setProperty] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const handleDeactivate = async () => {
    const docId = property?.documentId || property?.id;
    if (!docId) {
      toast.error("Property ID not found. Please refresh and try again.");
      return;
    }
    try {
      setIsDeactivating(true);
      await updatePropertyStatus(docId, "INACTIVE");
      toast.success("Property has been deactivated successfully.");
      setProperty((prev) => ({
        ...prev,
        PropertyStatus: "INACTIVE",
      }));
      setShowDeactivateModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to deactivate property.");
    } finally {
      setIsDeactivating(false);
    }
  };

  /* ===================================================
     LOAD PROPERTY
  =================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadProperty() {
      try {
        setLoading(true);
        setErrorMessage("");

        const resolvedParams =
          typeof params?.then === "function" ? await params : params;
        const id = resolvedParams?.id;

        if (!id) {
          throw new Error("Property ID not found.");
        }

        try {
          const dashboardData = await getOwnerDashboard();
          if (!cancelled) {
            setDashboard(dashboardData || null);
          }
        } catch (dashboardError) {
          console.warn("Owner dashboard could not load:", dashboardError);
        }

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") ||
              localStorage.getItem("jwt") ||
              localStorage.getItem("strapi_jwt")
            : null;

        const response = await fetch(
          `${STRAPI_URL}/api/properties/${id}?populate=*`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Unable to load property. Status: ${response.status}`);
        }

        const result = await response.json();
        const propertyData = result?.data;

        if (!propertyData) {
          throw new Error("Property not found.");
        }

        if (!cancelled) {
          setProperty(propertyData);
        }
      } catch (error) {
        console.error("OWNER PROPERTY DETAILS ERROR:", error);
        if (!cancelled) {
          setErrorMessage(error?.message || "Unable to load property details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProperty();

    return () => {
      cancelled = true;
    };
  }, [params]);

  /* ===================================================
     LOADING STATE
  =================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--seller-bg)] px-4">
        <div className="flex flex-col items-center rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-10 py-8 shadow-sm">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--seller-border)] border-t-[var(--seller-text)]" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)]">
            Loading property details...
          </p>
        </div>
      </main>
    );
  }

  /* ===================================================
     ERROR STATE
  =================================================== */

  if (errorMessage || !property) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--seller-bg)] px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200/50 bg-[var(--seller-surface)] p-8 text-center shadow-sm dark:border-red-900/40">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 font-bold">
            !
          </div>
          <h1 className="mt-4 text-xl font-bold text-[var(--seller-text)]">
            Unable to load property
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-[var(--seller-text-muted)]">
            {errorMessage || "Property information could not be found."}
          </p>
          <Link
            href="/owner/properties"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--seller-primary)] px-5 py-2.5 text-xs font-bold text-[var(--seller-surface)] transition hover:opacity-90"
          >
            <ArrowLeft size={14} />
            Back to My Properties
          </Link>
        </div>
      </main>
    );
  }

  /* ===================================================
     PROPERTY DATA PARSING
  =================================================== */

  const propertyId = property?.documentId || property?.id;
  const title = safeText(property?.Title, "Untitled Property");
  const description = safeText(property?.Description, "");
  const purpose = safeText(property?.Purpose, "Sale");
  const propertyType = safeText(property?.Property_Type, "Property");
  const category = safeText(property?.Category, "");
  const city = safeText(property?.City, "");
  const area = safeText(property?.Area, "");
  const address = safeText(property?.Address, "");
  const state = safeText(property?.State, "");
  const pinCode = safeText(property?.PinCode, "");
  const status = safeText(property?.PropertyStatus, "Available");

  const commonDetails =
    property?.PropertyCommonDetails && typeof property.PropertyCommonDetails === "object"
      ? property.PropertyCommonDetails
      : {};

  const residentialDetails =
    property?.ResidentialDetails && typeof property.ResidentialDetails === "object"
      ? property.ResidentialDetails
      : {};

  const commercialDetails =
    property?.CommercialDetails && typeof property.CommercialDetails === "object"
      ? property.CommercialDetails
      : {};

  const industrialDetails =
    property?.IndustrialDetails && typeof property.IndustrialDetails === "object"
      ? property.IndustrialDetails
      : {};

  const amenities =
    property?.PropertyAmenities && typeof property.PropertyAmenities === "object"
      ? property.PropertyAmenities
      : property?.Amenities && typeof property.Amenities === "object"
      ? property.Amenities
      : {};

  const rawPrice =
    property?.Price ?? commonDetails?.Price ?? commonDetails?.price;
  const priceUnits =
    property?.PriceUnits ??
    property?.Price_Units ??
    commonDetails?.PriceUnits ??
    commonDetails?.Price_Units;
  const price = formatPrice(rawPrice, priceUnits);

  const bedrooms =
    residentialDetails?.Bedrooms ??
    residentialDetails?.Bedroom ??
    commonDetails?.Bedrooms ??
    commonDetails?.Bedroom ??
    property?.Bedrooms ??
    property?.BHK ??
    getBedroomsFromCategory(category);

  const bathrooms =
    residentialDetails?.Bathrooms ??
    residentialDetails?.Bathroom ??
    commonDetails?.Bathrooms ??
    commonDetails?.Bathroom ??
    property?.Bathrooms ??
    null;

  const parking =
    residentialDetails?.Parking ??
    commercialDetails?.Parking ??
    industrialDetails?.Parking ??
    commonDetails?.Parking ??
    property?.Parking ??
    null;

  const builtUpArea =
    commonDetails?.Built_upArea ??
    commonDetails?.BuiltUpArea ??
    commonDetails?.Built_up_area ??
    commonDetails?.Area ??
    property?.BuiltUpArea ??
    property?.AreaSize ??
    null;

  const floor =
    residentialDetails?.Floor ??
    residentialDetails?.floor ??
    commercialDetails?.Floor ??
    industrialDetails?.Floor ??
    commonDetails?.Floor ??
    property?.Floor ??
    null;

  // IMAGES
  const coverImages = getMediaArray(property?.CoverImage);
  const propertyImages = getMediaArray(
    property?.PropertyImage || property?.PropertyImages
  );
  const allImages = [...coverImages, ...propertyImages];
  const uniqueImages = [];

  allImages.forEach((img) => {
    const url =
      img?.url || img?.data?.attributes?.url || img?.data?.url || "";
    const exists = uniqueImages.some((e) => {
      const eUrl = e?.url || e?.data?.attributes?.url || e?.data?.url || "";
      return eUrl && eUrl === url;
    });
    if (!exists) uniqueImages.push(img);
  });

  const galleryImages = uniqueImages.length > 0 ? uniqueImages : [null];
  const safeActiveImage =
    activeImage >= galleryImages.length ? 0 : activeImage;

  const listedDate = formatDate(
    property?.createdAt || property?.publishedAt
  );

  const amenityEntries = Object.entries(amenities).filter(
    ([, val]) =>
      val === true || val === "true" || val === "Yes" || val === "yes"
  );

  const propertyFeatures = Array.isArray(property?.PropertyFeatures)
    ? property.PropertyFeatures
    : Array.isArray(property?.PropertyFeatures?.data)
    ? property.PropertyFeatures.data
    : [];

  const locationText =
    address || [area, city, state].filter(Boolean).join(", ");
  const lat = property?.Latitude;
  const lng = property?.Longitude;
  const fullAddressToEncode = [address, area, city, state, pinCode]
    .filter(Boolean)
    .join(", ");

  let googleMapsUrl = property?.GoogleMapLink || null;
  if (!googleMapsUrl) {
    if (lat && lng) {
      googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else if (fullAddressToEncode) {
      googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        fullAddressToEncode
      )}`;
    }
  }

  const statusBadge = getStatusBadge(status);

  /* ===================================================
     RENDER VIEW
  =================================================== */

  return (
    <div className="seller-page-wrapper min-h-screen bg-[var(--seller-bg)] text-[var(--seller-text)] transition-colors duration-200">
      {/* FLOATING HEADER */}
      <Header headerData={dashboard?.header} />

      <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8">
        {/* TOP BAR / BREADCRUMB + ACTIONS */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3.5 py-2 text-xs font-semibold text-[var(--seller-text)] shadow-xs transition hover:border-[var(--seller-border-focus)] hover:bg-[var(--seller-surface-hover)]"
          >
            <ArrowLeft size={14} />
            <span>{backLabel}</span>
          </Link>

          <div className="flex items-center gap-2">
            {status?.toLowerCase() !== "inactive" && (
              <button
                type="button"
                onClick={() => setShowDeactivateModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500/20 dark:text-red-400"
              >
                Deactivate
              </button>
            )}

            <Link
              href={`/owner/properties/${propertyId}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--seller-primary)] px-4 py-2 text-xs font-semibold text-[var(--seller-surface)] shadow-xs transition hover:opacity-90 active:scale-95"
            >
              <Pencil size={13} />
              <span>Edit Property</span>
            </Link>
          </div>
        </div>

        {/* =================================================
            HERO PROPERTY SHOWCASE: GALLERY & OVERVIEW
            GetSiteGo Inspired Sophisticated Monochrome Panel
        ================================================= */}
        <section className="overflow-hidden rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] shadow-[var(--seller-shadow)] transition-all">
          <div className="grid gap-0 lg:grid-cols-12">
            {/* LEFT / THUMBNAILS COLUMN (Desktop only if multiple images) */}
            {galleryImages.length > 1 && (
              <div className="hidden lg:col-span-1 lg:flex lg:flex-col lg:items-center lg:gap-2.5 lg:border-r lg:border-[var(--seller-border)] lg:bg-[var(--seller-bg-subtle)] lg:p-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveImage(
                      safeActiveImage === 0
                        ? galleryImages.length - 1
                        : safeActiveImage - 1
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
                  aria-label="Previous thumbnail"
                >
                  <ChevronUp size={14} />
                </button>

                <div className="flex flex-col gap-2 overflow-y-auto max-h-[380px] pr-0.5">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={img?.id || img?.url || idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        safeActiveImage === idx
                          ? "border-[var(--seller-text)] shadow-xs opacity-100 ring-1 ring-[var(--seller-text)]"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={getImageUrl(img)}
                        alt={`${title} preview ${idx + 1}`}
                        fill
                        sizes="56px"
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveImage(
                      safeActiveImage === galleryImages.length - 1
                        ? 0
                        : safeActiveImage + 1
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
                  aria-label="Next thumbnail"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            )}

            {/* MAIN PROPERTY IMAGE CONTAINER */}
            <div
              className={`relative ${
                galleryImages.length > 1
                  ? "lg:col-span-6"
                  : "lg:col-span-7"
              } bg-[var(--seller-bg-subtle)] min-h-[300px] sm:min-h-[400px] lg:min-h-[460px]`}
            >
              <div className="relative h-full w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[460px] overflow-hidden">
                <Image
                  src={getImageUrl(galleryImages[safeActiveImage])}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />

                {/* Subtle scrim for badge readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Status Badges Overlay */}
                <div className="absolute left-4 top-4 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase shadow-xs backdrop-blur-md ${statusBadge.classes}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dot}`} />
                    {statusBadge.label}
                  </span>
                  <span className="rounded-md border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {purpose}
                  </span>
                </div>

                {/* Photo counter */}
                {galleryImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 rounded-md border border-white/20 bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    {safeActiveImage + 1} / {galleryImages.length}
                  </div>
                )}
              </div>

              {/* Mobile thumbnail strip */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3 lg:hidden bg-[var(--seller-bg-subtle)] border-t border-[var(--seller-border)]">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={img?.id || img?.url || idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${
                        safeActiveImage === idx
                          ? "border-[var(--seller-text)] opacity-100"
                          : "border-transparent opacity-60"
                      }`}
                    >
                      <Image
                        src={getImageUrl(img)}
                        alt={`${title} thumb ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SUMMARY COLUMN */}
            <div
              className={`flex flex-col justify-between p-6 sm:p-7 ${
                galleryImages.length > 1
                  ? "lg:col-span-5"
                  : "lg:col-span-5"
              } lg:border-l lg:border-[var(--seller-border)]`}
            >
              <div>
                {/* CATEGORY & PROPERTY TYPE TAG */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--seller-text-muted)]">
                    {propertyType}
                  </span>
                  {category && (
                    <>
                      <span className="text-[var(--seller-text-subtle)]">•</span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--seller-text-muted)]">
                        {category}
                      </span>
                    </>
                  )}
                </div>

                {/* TITLE */}
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--seller-text)] sm:text-3xl leading-snug">
                  {title}
                </h1>

                {/* LOCATION */}
                <div className="mt-3 flex items-start gap-2 text-xs text-[var(--seller-text-muted)]">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-[var(--seller-text)]" />
                  <span className="leading-relaxed">
                    {locationText || "Location not specified"}
                  </span>
                </div>

                {googleMapsUrl && (
                  <div className="mt-1 ml-5">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--seller-text)] hover:underline"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}

                {/* PRICING BLOCK */}
                <div className="mt-6 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--seller-text-muted)]">
                    {purpose.toLowerCase().includes("rent")
                      ? "Monthly Rental Price"
                      : "Asking Price"}
                  </p>
                  <p className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--seller-text)]">
                    {price}
                  </p>
                  {purpose.toLowerCase().includes("rent") && (
                    <span className="text-[11px] font-medium text-[var(--seller-text-muted)]">
                      / month
                    </span>
                  )}
                </div>

                {/* LISTING DATE METADATA */}
                {listedDate && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-[var(--seller-text-muted)]">
                    <CalendarDays size={14} className="text-[var(--seller-text-subtle)]" />
                    <span>Listed on {listedDate}</span>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-6 border-t border-[var(--seller-border)] pt-5">
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href={`/owner/properties/${propertyId}/edit`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--seller-primary)] px-4 py-2.5 text-xs font-bold text-[var(--seller-surface)] shadow-xs transition hover:opacity-90 active:scale-95"
                  >
                    <Pencil size={14} />
                    <span>Edit Property</span>
                  </Link>

                  <Link
                    href="/owner/properties"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--seller-text)] shadow-xs transition hover:bg-[var(--seller-surface-hover)]"
                  >
                    <span>All Listings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            KEY PROPERTY HIGHLIGHTS
            Compact outline cards: Beds, Baths, Parking, Area, Floor
        ================================================= */}
        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <HighlightCard
            icon={<BedDouble size={18} />}
            label="Bedrooms"
            value={bedrooms !== null && bedrooms !== undefined ? bedrooms : null}
          />
          <HighlightCard
            icon={<Bath size={18} />}
            label="Bathrooms"
            value={bathrooms !== null && bathrooms !== undefined ? bathrooms : null}
          />
          <HighlightCard
            icon={<Car size={18} />}
            label="Parking"
            value={parking !== null && parking !== undefined ? parking : null}
          />
          <HighlightCard
            icon={<Maximize size={18} />}
            label="Built-up Area"
            value={
              builtUpArea
                ? `${safeText(builtUpArea)} ${safeText(
                    commonDetails?.Area_Unit,
                    "sq.ft"
                  )}`
                : null
            }
          />
          <HighlightCard
            icon={<Building2 size={18} />}
            label="Floor"
            value={floor !== null && floor !== undefined ? floor : null}
          />
        </section>

        {/* =================================================
            MAIN CONTENT & SIDEBAR GRID
        ================================================= */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* LEFT 8 COLUMNS: MAIN SECTIONS */}
          <div className="space-y-6 lg:col-span-8">
            {/* 1. ABOUT THIS PROPERTY */}
            {description && (
              <section className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[var(--seller-border)] pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] text-[var(--seller-text)]">
                    <Home size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[var(--seller-text)]">
                      About This Property
                    </h2>
                    <p className="text-[11px] text-[var(--seller-text-muted)]">
                      Detailed listing overview
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-xs sm:text-sm leading-relaxed text-[var(--seller-text-muted)] whitespace-pre-line">
                  {description}
                </div>
              </section>
            )}

            {/* 2. AMENITIES & FEATURES */}
            {(amenityEntries.length > 0 || propertyFeatures.length > 0) && (
              <section className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-[var(--seller-border)] pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] text-[var(--seller-text)]">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[var(--seller-text)]">
                      Amenities & Features
                    </h2>
                    <p className="text-[11px] text-[var(--seller-text-muted)]">
                      Facilities available with this listing
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {amenityEntries.map(([key]) => (
                    <div
                      key={key}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] px-3 py-2 text-xs font-medium text-[var(--seller-text)] transition hover:border-[var(--seller-border-focus)]"
                    >
                      {getAmenityIcon(key)}
                      <span>{formatAmenityName(key)}</span>
                    </div>
                  ))}

                  {propertyFeatures.map((feat, idx) => {
                    const featName = safeText(
                      feat?.Title || feat?.title || feat?.name,
                      ""
                    );
                    if (!featName) return null;
                    return (
                      <div
                        key={feat?.id || idx}
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] px-3 py-2 text-xs font-medium text-[var(--seller-text)] transition hover:border-[var(--seller-border-focus)]"
                      >
                        {getAmenityIcon(featName)}
                        <span>{featName}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3. PROPERTY SPECIFICATIONS / INFORMATION */}
            <section className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 shadow-xs">
              <div className="flex items-center gap-3 border-b border-[var(--seller-border)] pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] text-[var(--seller-text)]">
                  <Building2 size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--seller-text)]">
                    Property Specifications
                  </h2>
                  <p className="text-[11px] text-[var(--seller-text-muted)]">
                    Listing attributes and technical facts
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                <SpecRow label="Property Type" value={propertyType} />
                <SpecRow label="Purpose" value={purpose} />
                <SpecRow label="Category" value={category || "--"} />
                <SpecRow label="Status" value={status} />
                <SpecRow label="Locality / Area" value={area || "--"} />
                <SpecRow label="City" value={city || "--"} />
                <SpecRow label="State" value={state || "--"} />
                <SpecRow label="PIN Code" value={pinCode || "--"} />
                <SpecRow label="Complete Address" value={address || "--"} />
                <SpecRow
                  label="Property Age"
                  value={commonDetails?.PropertyAge || "--"}
                />
                <SpecRow
                  label="Facing"
                  value={commonDetails?.Facing || "--"}
                />
                <SpecRow
                  label="Area Unit"
                  value={commonDetails?.Area_Unit || "sq.ft"}
                />
              </div>
            </section>

            {/* 4. LOCATION DETAILS */}
            <section className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 shadow-xs">
              <div className="flex items-center gap-3 border-b border-[var(--seller-border)] pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] text-[var(--seller-text)]">
                  <MapPin size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--seller-text)]">
                    Location & Map
                  </h2>
                  <p className="text-[11px] text-[var(--seller-text-muted)]">
                    Verified property address & directions
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-xs sm:text-sm text-[var(--seller-text-muted)] leading-relaxed">
                  <p className="font-semibold text-[var(--seller-text)]">
                    {locationText || "Address not provided"}
                  </p>
                  {pinCode && (
                    <p className="mt-0.5 text-xs text-[var(--seller-text-subtle)]">
                      PIN: {pinCode}
                    </p>
                  )}
                </div>

                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] px-4 py-2.5 text-xs font-semibold text-[var(--seller-text)] transition hover:border-[var(--seller-border-focus)] hover:bg-[var(--seller-surface-hover)] shrink-0"
                  >
                    <MapPin size={14} />
                    <span>Open in Google Maps</span>
                    <ExternalLink size={12} className="text-[var(--seller-text-muted)]" />
                  </a>
                )}
              </div>
            </section>

            {/* 5. BUYER ACTIVITY WITH REAL BACKEND COUNTS */}
            <PropertyActivitySection propertyDocumentId={propertyId} />
          </div>

          {/* RIGHT 4 COLUMNS: OWNER MANAGEMENT SIDEBAR */}
          <aside className="space-y-5 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            {/* MANAGE PROPERTY CARD */}
            <div className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--seller-text-muted)]">
                  Management
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${statusBadge.classes}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dot}`} />
                  {statusBadge.label}
                </span>
              </div>

              <h3 className="mt-2 text-base font-bold text-[var(--seller-text)]">
                Manage Listing
              </h3>

              <p className="mt-1 text-xs text-[var(--seller-text-muted)] leading-relaxed">
                Update specifications, pricing, gallery photos or toggle listing visibility.
              </p>

              <div className="mt-5 space-y-2.5">
                <Link
                  href={`/owner/properties/${propertyId}/edit`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--seller-primary)] px-4 py-2.5 text-xs font-bold text-[var(--seller-surface)] shadow-xs transition hover:opacity-90 active:scale-95"
                >
                  <Pencil size={13} />
                  <span>Edit Property Details</span>
                </Link>

                <Link
                  href="/owner/properties"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] px-4 py-2 text-xs font-semibold text-[var(--seller-text)] transition hover:border-[var(--seller-border-focus)] hover:bg-[var(--seller-surface-hover)]"
                >
                  <ArrowLeft size={13} />
                  <span>All My Properties</span>
                </Link>
              </div>

              <div className="mt-5 border-t border-[var(--seller-border)] pt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--seller-text-subtle)]">
                  Property ID
                </p>
                <p className="mt-1 font-mono text-xs text-[var(--seller-text-muted)] break-all select-all">
                  {safeText(propertyId, "--")}
                </p>
              </div>
            </div>

            {/* LISTING SUMMARY CARD */}
            <div className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--seller-text-muted)]">
                Listing Overview
              </span>

              <div className="mt-3 space-y-2.5">
                <SidebarSummaryRow label="Purpose" value={purpose} />
                <SidebarSummaryRow label="Type" value={propertyType} />
                <SidebarSummaryRow label="Category" value={category || "--"} />
                <SidebarSummaryRow label="City" value={city || "--"} />
                <SidebarSummaryRow label="Status" value={status} />
              </div>
            </div>

            {/* PROPERTY VALUE CARD */}
            <div className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--seller-text-muted)]">
                Property Value
              </span>

              <p className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--seller-text)]">
                {price}
              </p>

              {listedDate && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--seller-text-muted)]">
                  <CalendarDays size={13} className="text-[var(--seller-text-subtle)]" />
                  <span>Listed on {listedDate}</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* DEACTIVATE MODAL */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[var(--seller-text)]">
              Deactivate Property
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--seller-text-muted)]">
              Are you sure you want to deactivate <strong>{title}</strong>? The
              property will be set to <strong>INACTIVE</strong> and will no
              longer be visible to buyers. Your property data, images, and
              ownership will remain safely preserved.
            </p>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeactivating}
                onClick={() => setShowDeactivateModal(false)}
                className="rounded-xl border border-[var(--seller-border)] px-4 py-2 text-xs font-semibold text-[var(--seller-text)] hover:bg-[var(--seller-surface-hover)] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeactivating}
                onClick={handleDeactivate}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {isDeactivating ? "Deactivating..." : "Deactivate Property"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer data={dashboard?.Footer || dashboard?.footer || null} />
    </div>
  );
}

/* =====================================================
   HIGHLIGHT CARD (Bedrooms, Bathrooms, Area, etc.)
===================================================== */

function HighlightCard({ icon, label, value }) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-3.5 shadow-xs transition hover:border-[var(--seller-border-focus)]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[var(--seller-text-muted)]">
          {label}
        </span>
        <div className="text-[var(--seller-text-muted)]">{icon}</div>
      </div>
      <p className="mt-2 text-base font-bold tracking-tight text-[var(--seller-text)]">
        {safeText(value, "--")}
      </p>
    </div>
  );
}

/* =====================================================
   SPECIFICATION ROW (2-Column Key/Value)
===================================================== */

function SpecRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--seller-border)] py-2.5 text-xs">
      <span className="font-medium text-[var(--seller-text-muted)]">
        {label}
      </span>
      <span className="font-semibold text-[var(--seller-text)] text-right">
        {safeText(value, "--")}
      </span>
    </div>
  );
}

/* =====================================================
   SIDEBAR SUMMARY ROW
===================================================== */

function SidebarSummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--seller-border)] pb-2 text-xs last:border-0 last:pb-0">
      <span className="text-[var(--seller-text-muted)]">{label}</span>
      <span className="font-semibold text-[var(--seller-text)]">{safeText(value, "--")}</span>
    </div>
  );
}