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
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
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
    return "https://placehold.co/800x600/1B1916/D7AE62?text=No+Image+Available";
  }

  const url =
    image?.url ||
    image?.data?.attributes?.url ||
    image?.data?.url ||
    "";

  if (!url) {
    return "https://placehold.co/800x600/1B1916/D7AE62?text=No+Image+Available";
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `${STRAPI_URL}${url}`;
}

/* =====================================================
   NORMALIZE PROPERTY
===================================================== */

function normalizeProperty(data) {
  if (!data) {
    return null;
  }

  if (data.attributes) {
    return {
      id: data.id,
      ...data.attributes,
    };
  }

  return data;
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
   PRICE FORMAT
===================================================== */

function formatPrice(price, units) {
  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return "Price on Request";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return safeText(price, "Price on Request");
  }

  const formatted = new Intl.NumberFormat(
    "en-IN"
  ).format(numericPrice);

  const unit = safeText(units, "INR");

  if (
    unit &&
    unit.toLowerCase() !== "inr"
  ) {
    return `₹${formatted} ${unit}`;
  }

  return `₹${formatted}`;
}

/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(date) {
  if (!date) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  } catch {
    return "";
  }
}

/* =====================================================
   CATEGORY → BEDROOM FALLBACK

   Example:
   Two BHK → 2
   Three BHK → 3
===================================================== */

function getBedroomsFromCategory(category) {
  const value = safeText(category).toLowerCase();

  if (value.includes("one bhk") || value.includes("1 bhk")) {
    return 1;
  }

  if (value.includes("two bhk") || value.includes("2 bhk")) {
    return 2;
  }

  if (value.includes("three bhk") || value.includes("3 bhk")) {
    return 3;
  }

  if (value.includes("four bhk") || value.includes("4 bhk")) {
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
    .replace(/^./, (char) =>
      char.toUpperCase()
    )
    .trim();
}

/* =====================================================
   STATUS STYLE
===================================================== */

function getStatusClass(status) {
  const value = safeText(status).toLowerCase();

  if (
    value === "available" ||
    value === "active"
  ) {
    return "bg-[#0E7658] text-white";
  }

  if (value === "pending") {
    return "bg-[#C98619] text-white";
  }

  if (value === "sold") {
    return "bg-[#B42318] text-white";
  }

  if (value === "rented") {
    return "bg-[#7651A8] text-white";
  }

  if (value === "inactive" || value === "draft") {
    return "bg-[#64748B] text-white";
  }

  if (value === "reserved") {
    return "bg-[#0369A1] text-white";
  }

  return "bg-[#64748B] text-white";
}

/* =====================================================
   PAGE
===================================================== */

export default function OwnerPropertyDetailsPage({
  params,
}) {
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
  const [errorMessage, setErrorMessage] =
    useState("");

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

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
      
      // Update local state to show as inactive
      setProperty((prev) => ({
        ...prev,
        PropertyStatus: "INACTIVE"
      }));
      setShowDeactivateModal(false);
    } catch (err) {
      toast.error(err.message || "Failed to deactivate property.");
    } finally {
      setIsDeactivating(false);
    }
  };

  const [activeImage, setActiveImage] =
    useState(0);

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
          typeof params?.then === "function"
            ? await params
            : params;

        const id = resolvedParams?.id;

        if (!id) {
          throw new Error(
            "Property ID not found."
          );
        }

        /* ---------------------------------------------
           OWNER DASHBOARD
        --------------------------------------------- */

        try {
          const dashboardData =
            await getOwnerDashboard();

          if (!cancelled) {
            setDashboard(
              dashboardData || null
            );
          }
        } catch (dashboardError) {
          console.warn(
            "Owner dashboard could not load:",
            dashboardError
          );
        }

        /* ---------------------------------------------
           TOKEN
        --------------------------------------------- */

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") ||
              localStorage.getItem("jwt") ||
              localStorage.getItem("strapi_jwt")
            : null;

        /* ---------------------------------------------
           STRAPI PROPERTY
        --------------------------------------------- */

        const response = await fetch(
          `${STRAPI_URL}/api/properties/${id}?populate=*`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load property. Status: ${response.status}`
          );
        }

        const result =
          await response.json();

        const propertyData = result?.data;

        if (!propertyData) {
          throw new Error(
            "Property not found."
          );
        }

        if (!cancelled) {
          setProperty(propertyData);
        }
      } catch (error) {
        console.error(
          "OWNER PROPERTY DETAILS ERROR:",
          error
        );

        if (!cancelled) {
          setErrorMessage(
            error?.message ||
              "Unable to load property details."
          );
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
     LOADING
  =================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F0E8] px-4">
        <div className="rounded-3xl border border-[#D9D1C2] bg-[#F7F0E3] px-10 py-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#D9D1C2] border-t-[#174B3B]" />

          <p className="text-sm font-bold text-[#416353]">
            Loading property details...
          </p>
        </div>
      </main>
    );
  }

  /* ===================================================
     ERROR
  =================================================== */

  if (errorMessage || !property) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F0E8] px-4">
        <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-[#F7F0E3] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
            !
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-[#123F32]">
            Unable to load property
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#718177]">
            {errorMessage ||
              "Property information could not be found."}
          </p>

          <Link
            href="/owner/properties"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#174B3B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123F32]"
          >
            <ArrowLeft size={16} />
            Back to My Properties
          </Link>
        </div>
      </main>
    );
  }

  /* ===================================================
     PROPERTY BASIC DATA
  =================================================== */

  const propertyId =
    property?.documentId ||
    property?.id;

  const title = safeText(
    property?.Title,
    "Untitled Property"
  );

  const description = safeText(
    property?.Description,
    ""
  );

  const purpose = safeText(
    property?.Purpose,
    "Sale"
  );

  const propertyType = safeText(
    property?.Property_Type,
    "Property"
  );

  const category = safeText(
    property?.Category,
    ""
  );

  const city = safeText(
    property?.City,
    ""
  );

  const area = safeText(
    property?.Area,
    ""
  );

  const address = safeText(
    property?.Address,
    ""
  );

  const state = safeText(
    property?.State,
    ""
  );

  const pinCode = safeText(
    property?.PinCode,
    ""
  );

  const status = safeText(
    property?.PropertyStatus,
    "Available"
  );

  /* ===================================================
     DETAIL COMPONENTS
  =================================================== */

  const commonDetails =
    property?.PropertyCommonDetails &&
    typeof property.PropertyCommonDetails ===
      "object"
      ? property.PropertyCommonDetails
      : {};

  const residentialDetails =
    property?.ResidentialDetails &&
    typeof property.ResidentialDetails ===
      "object"
      ? property.ResidentialDetails
      : {};

  const commercialDetails =
    property?.CommercialDetails &&
    typeof property.CommercialDetails ===
      "object"
      ? property.CommercialDetails
      : {};

  const industrialDetails =
    property?.IndustrialDetails &&
    typeof property.IndustrialDetails ===
      "object"
      ? property.IndustrialDetails
      : {};

  const amenities =
    property?.PropertyAmenities &&
    typeof property.PropertyAmenities ===
      "object"
      ? property.PropertyAmenities
      : property?.Amenities &&
          typeof property.Amenities ===
            "object"
        ? property.Amenities
        : {};

  /* ===================================================
     PRICE
  =================================================== */

  const rawPrice =
    property?.Price ??
    commonDetails?.Price ??
    commonDetails?.price;

  const priceUnits =
    property?.PriceUnits ??
    property?.Price_Units ??
    commonDetails?.PriceUnits ??
    commonDetails?.Price_Units;

  const price = formatPrice(
    rawPrice,
    priceUnits
  );

  /* ===================================================
     QUICK DETAILS
  =================================================== */

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

  /* ===================================================
     IMAGES
  =================================================== */

  const coverImages = getMediaArray(
    property?.CoverImage
  );

  const propertyImages = getMediaArray(
    property?.PropertyImage || property?.PropertyImages
  );

  const allImages = [
    ...coverImages,
    ...propertyImages,
  ];

  const uniqueImages = [];

  allImages.forEach((image) => {
    const imageUrl =
      image?.url ||
      image?.data?.attributes?.url ||
      image?.data?.url ||
      "";

    const alreadyExists =
      uniqueImages.some(
        (existing) => {
          const existingUrl =
            existing?.url ||
            existing?.data?.attributes?.url ||
            existing?.data?.url ||
            "";

          return (
            existingUrl &&
            existingUrl === imageUrl
          );
        }
      );

    if (!alreadyExists) {
      uniqueImages.push(image);
    }
  });

  const galleryImages =
    uniqueImages.length > 0
      ? uniqueImages
      : [null];

  /* ===================================================
     RESET ACTIVE IMAGE IF NEEDED
  =================================================== */

  const safeActiveImage =
    activeImage >= galleryImages.length
      ? 0
      : activeImage;

  /* ===================================================
     LISTED DATE
  =================================================== */

  const listedDate = formatDate(
    property?.createdAt ||
      property?.publishedAt
  );

  /* ===================================================
     AMENITIES
  =================================================== */

  const amenityEntries =
    Object.entries(amenities).filter(
      ([, value]) =>
        value === true ||
        value === "true" ||
        value === "Yes" ||
        value === "yes"
    );

  /* ===================================================
     PROPERTY FEATURES

     If Strapi has PropertyFeatures component,
     show those also.
  =================================================== */

  const propertyFeatures =
    Array.isArray(property?.PropertyFeatures)
      ? property.PropertyFeatures
      : Array.isArray(
            property?.PropertyFeatures?.data
          )
        ? property.PropertyFeatures.data
        : [];

  /* ===================================================
     LOCATION
  =================================================== */

  const locationText =
    address ||
    [area, city, state]
      .filter(Boolean)
      .join(", ");

  const lat = property?.Latitude;
  const lng = property?.Longitude;

  const fullAddressToEncode = [address, area, city, state, pinCode].filter(Boolean).join(", ");
  
  let googleMapsUrl = property?.GoogleMapLink || null;
  if (!googleMapsUrl) {
    if (lat && lng) {
      googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else if (fullAddressToEncode) {
      googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressToEncode)}`;
    }
  }

  /* ===================================================
     PAGE
  =================================================== */

  return (
    <div className="min-h-screen bg-[#F3F0E8]">
      {/* =================================================
          HEADER
      ================================================= */}

      <Header
        headerData={dashboard?.header}
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D9D1C2] bg-[#F7F0E3] px-4 py-2.5 text-sm font-bold text-[#174B3B] transition hover:border-[#B99852]"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>

          <div className="flex items-center gap-2">
            {status?.toLowerCase() !== "inactive" && (
              <button
                onClick={() => setShowDeactivateModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-extrabold text-red-600 transition hover:bg-red-100"
              >
                Deactivate
              </button>
            )}

            <Link
              href={`/owner/properties/${propertyId}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D7AE62] px-5 py-2.5 text-sm font-extrabold text-[#123F32] transition hover:bg-[#C99D4C]"
            >
              <Pencil size={16} />
              Edit Property
            </Link>
          </div>
        </div>

        {/* =================================================
            MAIN DARK PROPERTY PANEL

            THIS IS THE IMPORTANT UI CHANGE.
            Similar structure to your 1st reference image.
        ================================================= */}

        <section className="overflow-hidden rounded-3xl border border-[#2B2925] bg-[#12110F] p-4 shadow-[0_18px_50px_rgba(18,17,15,0.22)] sm:p-5 lg:p-6">
          <div className="grid gap-5 lg:grid-cols-[70px_minmax(0,1fr)_300px]">
            {/* =================================================
                LEFT THUMBNAILS
            ================================================= */}

            <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveImage(
                      safeActiveImage === 0
                        ? galleryImages.length - 1
                        : safeActiveImage - 1
                    )
                  }
                  className="hidden h-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#1B1916] text-[#D7AE62] transition hover:bg-[#25211C] lg:flex"
                  aria-label="Previous image"
                >
                  <ChevronUp size={18} />
                </button>
              )}

              {galleryImages.map(
                (image, index) => (
                  <button
                    key={
                      image?.id ||
                      image?.url ||
                      index
                    }
                    type="button"
                    onClick={() =>
                      setActiveImage(index)
                    }
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition lg:h-[58px] lg:w-[70px] ${
                      safeActiveImage === index
                        ? "border-[#D7AE62] opacity-100"
                        : "border-transparent opacity-55 hover:opacity-90"
                    }`}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${title} ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />

                    {safeActiveImage === index && (
                      <div className="absolute inset-0 bg-[#D7AE62]/10" />
                    )}
                  </button>
                )
              )}

              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveImage(
                      safeActiveImage ===
                        galleryImages.length - 1
                        ? 0
                        : safeActiveImage + 1
                    )
                  }
                  className="hidden h-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#1B1916] text-[#D7AE62] transition hover:bg-[#25211C] lg:flex"
                  aria-label="Next image"
                >
                  <ChevronDown size={18} />
                </button>
              )}
            </div>

            {/* =================================================
                MAIN IMAGE
            ================================================= */}

            <div className="order-1 min-w-0 lg:order-2">
              <div className="relative h-[280px] overflow-hidden rounded-2xl bg-[#1B1916] sm:h-[390px] lg:h-[430px]">
                <Image
                  src={getImageUrl(
                    galleryImages[
                      safeActiveImage
                    ]
                  )}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  unoptimized
                />

                {/* IMAGE DARK OVERLAY */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/10" />

                {/* BOOKMARK */}

                <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black/45 text-white backdrop-blur-sm">
                  <Bookmark size={18} />
                </div>

                {/* PHOTO COUNT */}

                {galleryImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 rounded-lg bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                    {safeActiveImage + 1} /{" "}
                    {galleryImages.length}
                  </div>
                )}

                {/* IMAGE TITLE */}

                <div className="absolute bottom-5 left-5 right-5">
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#D7AE62]">
                    {category ||
                      propertyType}
                  </p>

                  <h1 className="max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                    {title}
                  </h1>

                  {locationText && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
                      <MapPin size={15} />
                      {locationText}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT PROPERTY SUMMARY
            ================================================= */}

            <div className="order-3 flex flex-col justify-center border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
              {/* STATUS / TYPE */}

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-md px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide ${getStatusClass(
                    status
                  )}`}
                >
                  {status}
                </span>

                <span className="rounded-md bg-[#E5E8DE] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[#174B3B]">
                  {propertyType}
                </span>

                <span className="rounded-md bg-[#F4E7C7] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[#3C311C]">
                  {purpose}
                </span>
              </div>

              {/* TITLE */}

              <h2 className="mt-6 text-2xl font-extrabold leading-tight text-white">
                {title}
              </h2>

              {/* LOCATION */}

              <div className="mt-3 flex flex-col gap-3">
                <p className="flex items-start gap-2 text-sm text-white/65">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-[#D7AE62]"
                  />

                  <span>
                    {locationText ||
                      "Location not available"}
                  </span>
                </p>

                {googleMapsUrl && (
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D7AE62] hover:text-[#F4E7C7] transition-colors ml-6">
                    <span>📍 View on Google Maps</span>
                  </a>
                )}
              </div>

              {/* PRICE */}

              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D7AE62]">
                  Asking Price
                </p>

                <p className="mt-2 text-3xl font-extrabold text-[#4FC69A]">
                  {price}
                </p>

                {purpose
                  .toLowerCase()
                  .includes("rent") && (
                  <p className="mt-1 text-xs text-white/50">
                    per month
                  </p>
                )}
              </div>

              {/* DATE */}

              {listedDate && (
                <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-white/60">
                  <CalendarDays
                    size={15}
                    className="text-[#D7AE62]"
                  />

                  Listed on {listedDate}
                </div>
              )}

              {/* EDIT */}

              <Link
                href={`/owner/properties/${propertyId}/edit`}
                className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#D7AE62] px-4 py-3 text-sm font-extrabold text-[#123F32] transition hover:bg-[#C99D4C]"
              >
                <Pencil size={16} />
                Edit Property
              </Link>
            </div>
          </div>
        </section>

        {/* =================================================
            QUICK PROPERTY DETAILS
        ================================================= */}

        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <OverviewCard
            icon={<BedDouble size={20} />}
            label="Bedrooms"
            value={
              bedrooms !== null &&
              bedrooms !== undefined
                ? bedrooms
                : "--"
            }
          />

          <OverviewCard
            icon={<Bath size={20} />}
            label="Bathrooms"
            value={
              bathrooms !== null &&
              bathrooms !== undefined
                ? bathrooms
                : "--"
            }
          />

          <OverviewCard
            icon={<Car size={20} />}
            label="Parking"
            value={
              parking !== null &&
              parking !== undefined
                ? parking
                : "--"
            }
          />

          <OverviewCard
            icon={<Maximize size={20} />}
            label="Built-up Area"
            value={
              builtUpArea
                ? `${safeText(
                    builtUpArea
                  )} ${
                    safeText(
                      commonDetails?.Area_Unit,
                      "sq.ft"
                    )
                  }`
                : "--"
            }
          />

          <OverviewCard
            icon={<Building2 size={20} />}
            label="Floor"
            value={
              floor !== null &&
              floor !== undefined
                ? floor
                : "--"
            }
          />
        </section>

        {/* =================================================
            LOWER CONTENT
        ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="min-w-0">
            {/* =================================================
                ABOUT
            ================================================= */}

            {description && (
              <section className="rounded-3xl border border-[#D9D1C2] bg-[#F7F0E3] p-6 shadow-sm sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5E8DE] text-[#174B3B]">
                    <Home size={19} />
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-[#123F32]">
                      About This Property
                    </h2>

                    <p className="text-xs text-[#718177]">
                      Property description
                    </p>
                  </div>
                </div>

                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#5F6F66]">
                  {description}
                </p>
              </section>
            )}

            {/* =================================================
                AMENITIES
            ================================================= */}

            {(amenityEntries.length > 0 ||
              propertyFeatures.length > 0) && (
              <section className="mt-5 rounded-3xl border border-[#D9D1C2] bg-[#F7F0E3] p-6 shadow-sm sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5E8DE] text-[#174B3B]">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-[#123F32]">
                      Amenities
                    </h2>

                    <p className="text-xs text-[#718177]">
                      Available property features
                    </p>
                  </div>
                </div>

                {/* BOOLEAN AMENITIES */}

                {amenityEntries.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {amenityEntries.map(
                      ([key]) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#B99852]/40 bg-white px-4 py-2.5 text-[13px] font-bold text-[#123F32] shadow-sm transition hover:border-[#B99852] hover:shadow-md"
                        >
                          {(() => {
                            const k = key.toLowerCase();
                            if (k.includes("park")) return <Car size={16} className="text-[#0E7658]" />;
                            if (k.includes("lift") || k.includes("elev")) return <Building2 size={16} className="text-[#0E7658]" />;
                            if (k.includes("secur")) return <Shield size={16} className="text-[#0E7658]" />;
                            if (k.includes("cctv")) return <Cctv size={16} className="text-[#0E7658]" />;
                            if (k.includes("power") || k.includes("backup")) return <Zap size={16} className="text-[#0E7658]" />;
                            if (k.includes("gym") || k.includes("fit")) return <Dumbbell size={16} className="text-[#0E7658]" />;
                            if (k.includes("swim") || k.includes("pool") || k.includes("water")) return <Waves size={16} className="text-[#0E7658]" />;
                            if (k.includes("garden") || k.includes("tree")) return <TreePine size={16} className="text-[#0E7658]" />;
                            return <CheckCircle2 size={16} className="text-[#0E7658]" />;
                          })()}

                          {formatAmenityName(
                            key
                          )}
                        </span>
                      )
                    )}
                  </div>
                )}

                {/* PROPERTY FEATURES */}

                {propertyFeatures.length >
                  0 && (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {propertyFeatures.map(
                      (feature, index) => {
                        const featureTitle =
                          safeText(
                            feature?.Title ||
                              feature?.title ||
                              feature?.name,
                            ""
                          );

                        if (!featureTitle) {
                          return null;
                        }

                        return (
                          <span
                            key={
                              feature?.id ||
                              index
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-[#B99852]/40 bg-white px-4 py-2.5 text-[13px] font-bold text-[#123F32] shadow-sm transition hover:border-[#B99852] hover:shadow-md"
                          >
                            {(() => {
                              const k = featureTitle.toLowerCase();
                              if (k.includes("park")) return <Car size={16} className="text-[#0E7658]" />;
                              if (k.includes("lift") || k.includes("elev")) return <Building2 size={16} className="text-[#0E7658]" />;
                              if (k.includes("secur")) return <Shield size={16} className="text-[#0E7658]" />;
                              if (k.includes("cctv")) return <Cctv size={16} className="text-[#0E7658]" />;
                              if (k.includes("power") || k.includes("backup")) return <Zap size={16} className="text-[#0E7658]" />;
                              if (k.includes("gym") || k.includes("fit")) return <Dumbbell size={16} className="text-[#0E7658]" />;
                              if (k.includes("swim") || k.includes("pool") || k.includes("water")) return <Waves size={16} className="text-[#0E7658]" />;
                              if (k.includes("garden") || k.includes("tree")) return <TreePine size={16} className="text-[#0E7658]" />;
                              return <CheckCircle2 size={16} className="text-[#0E7658]" />;
                            })()}

                            {featureTitle}
                          </span>
                        );
                      }
                    )}
                  </div>
                )}
              </section>
            )}

            {/* =================================================
                PROPERTY INFORMATION
            ================================================= */}

            <section className="mt-5 rounded-3xl border border-[#D9D1C2] bg-[#F7F0E3] p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5E8DE] text-[#174B3B]">
                  <Building2 size={19} />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#123F32]">
                    Property Information
                  </h2>

                  <p className="text-xs text-[#718177]">
                    Details entered in your property listing
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <InfoRow
                  label="Property Type"
                  value={propertyType}
                />

                <InfoRow
                  label="Purpose"
                  value={purpose}
                />

                <InfoRow
                  label="Category"
                  value={
                    category || "--"
                  }
                />

                <InfoRow
                  label="Status"
                  value={status}
                />

                <InfoRow
                  label="Area / Locality"
                  value={
                    area || "--"
                  }
                />

                <InfoRow
                  label="City"
                  value={
                    city || "--"
                  }
                />

                <InfoRow
                  label="State"
                  value={
                    state || "--"
                  }
                />

                <InfoRow
                  label="PIN Code"
                  value={
                    pinCode || "--"
                  }
                />

                <InfoRow
                  label="Address"
                  value={
                    address || "--"
                  }
                />

                <InfoRow
                  label="Property Age"
                  value={
                    commonDetails?.PropertyAge ||
                    "--"
                  }
                />

                <InfoRow
                  label="Facing"
                  value={
                    commonDetails?.Facing ||
                    "--"
                  }
                />

                <InfoRow
                  label="Area Unit"
                  value={
                    commonDetails?.Area_Unit ||
                    "--"
                  }
                />
              </div>
            </section>

            {/* =================================================
                LOCATION
            ================================================= */}

            <section className="mt-5 rounded-3xl border border-[#D9D1C2] bg-[#F7F0E3] p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5E8DE] text-[#174B3B]">
                  <MapPin size={19} />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#123F32]">
                    Location
                  </h2>

                  <p className="text-xs text-[#718177]">
                    Property location
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-[#5F6F66]">
                {locationText ||
                  "Location information not available."}
              </p>

              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#D9D1C2] bg-[#F3F0E8] px-4 py-2.5 text-sm font-bold text-[#174B3B] transition hover:border-[#B99852]"
                >
                  <MapPin size={16} />
                  Open in Google Maps
                </a>
              )}
            </section>

            {/* =================================================
                PROPERTY ACTIVITY
            ================================================= */}
            <PropertyActivitySection propertyDocumentId={propertyId} />

          </div>

          {/* =================================================
              RIGHT OWNER PANEL
          ================================================= */}

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl bg-[#174B3B] p-6 text-white shadow-[0_12px_35px_rgba(23,75,59,0.18)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D7AE62]">
                Owner Panel
              </p>

              <h2 className="mt-2 text-2xl font-extrabold">
                Manage Property
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/70">
                Review all the information you
                entered and update your property
                whenever required.
              </p>

              <Link
                href={`/owner/properties/${propertyId}/edit`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D7AE62] px-4 py-3.5 text-sm font-extrabold text-[#123F32] transition hover:bg-[#C99D4C]"
              >
                <Pencil size={16} />
                Edit Property
              </Link>

              <Link
                href="/owner/properties"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <ArrowLeft size={16} />
                All My Properties
              </Link>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs text-white/50">
                  Property ID
                </p>

                <p className="mt-1 break-all text-xs font-semibold text-white/80">
                  {safeText(
                    propertyId,
                    "--"
                  )}
                </p>
              </div>
            </div>

            {/* =================================================
                LISTING SUMMARY
            ================================================= */}

            <div className="mt-4 rounded-3xl border border-[#D9D1C2] bg-[#F7F0E3] p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B99852]">
                Listing Summary
              </p>

              <div className="mt-4 space-y-3">
                <SummaryRow
                  label="Purpose"
                  value={purpose}
                />

                <SummaryRow
                  label="Type"
                  value={propertyType}
                />

                <SummaryRow
                  label="Category"
                  value={
                    category || "--"
                  }
                />

                <SummaryRow
                  label="Status"
                  value={status}
                />

                <SummaryRow
                  label="City"
                  value={
                    city || "--"
                  }
                />
              </div>
            </div>

            {/* =================================================
                PRICE SUMMARY
            ================================================= */}

            <div className="mt-4 rounded-3xl border border-[#D9D1C2] bg-[#F7F0E3] p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B99852]">
                Property Value
              </p>

              <p className="mt-2 text-2xl font-extrabold text-[#174B3B]">
                {price}
              </p>

              {listedDate && (
                <div className="mt-4 flex items-center gap-2 text-xs text-[#718177]">
                  <CalendarDays size={14} />
                  Listed {listedDate}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* =================================================
          DEACTIVATE MODAL
      ================================================= */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Deactivate Property</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to deactivate <strong>{title}</strong>? The property will be
              set to <strong>INACTIVE</strong> and will no longer be visible to buyers. Your property
              data, images, and ownership will be fully preserved.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                disabled={isDeactivating}
                onClick={() => setShowDeactivateModal(false)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                disabled={isDeactivating}
                onClick={handleDeactivate}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {isDeactivating ? "Deactivating..." : "Deactivate Property"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer
        data={
          dashboard?.Footer ||
          dashboard?.footer ||
          null
        }
      />
    </div>
  );
}

/* =====================================================
   OVERVIEW CARD
===================================================== */

function OverviewCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#B99852]">
      <div className="flex items-center gap-2 text-[#174B3B]">
        {icon}

        <span className="text-lg font-extrabold text-[#123F32]">
          {safeText(value, "--")}
        </span>
      </div>

      <p className="mt-2 text-[11px] font-semibold text-[#718177]">
        {label}
      </p>
    </div>
  );
}

/* =====================================================
   INFO ROW
===================================================== */

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="border-b border-[#E2DBCE] pb-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A968D]">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-[#123F32]">
        {safeText(value, "--")}
      </p>
    </div>
  );
}

/* =====================================================
   SUMMARY ROW
===================================================== */

function SummaryRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#E2DBCE] pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-semibold text-[#718177]">
        {label}
      </span>

      <span className="text-right text-xs font-extrabold text-[#174B3B]">
        {safeText(value, "--")}
      </span>
    </div>
  );
}