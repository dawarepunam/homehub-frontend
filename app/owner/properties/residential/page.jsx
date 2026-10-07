"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
  Home,
  MapPin,
  Search,
  X,
  Plus,
  Eye,
  Pencil,
  MoreVertical,
  BedDouble,
  Bath,
  Car,
  Maximize,
  ExternalLink,
  Loader2,
  Bookmark,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "../../Footer";

import {
  getOwnerDashboard,
  getOwnerProperties,
} from "@/services/ownerDashboard";

/* =====================================================
   STRAPI URL
===================================================== */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:1337";

/* =====================================================
   HELPERS
===================================================== */

function safeValue(value, fallback = "") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return String(value);
}

function getImageUrl(property) {
  const img =
    property?.CoverImage?.url ||
    property?.CoverImage?.data?.attributes?.url ||
    property?.PropertyImage?.[0]?.url ||
    "";

  if (!img) {
    return "https://placehold.co/600x400/1B1916/D7AE62?text=No+Image";
  }

  return img.startsWith("http") ? img : `${STRAPI_URL}${img}`;
}

function formatPrice(price, units) {
  if (price === null || price === undefined || price === "") {
    return "Price on Request";
  }

  const num = Number(price);

  if (Number.isNaN(num)) {
    return safeValue(price, "Price on Request");
  }

  const formatted = new Intl.NumberFormat("en-IN").format(num);
  const unit = safeValue(units, "INR");

  if (unit && unit.toLowerCase() !== "inr") {
    return `₹${formatted} ${unit}`;
  }

  return `₹${formatted}`;
}

function getStatusBadge(status) {
  const value = safeValue(status).toUpperCase();

  switch (value) {
    case "ACTIVE":
    case "AVAILABLE":
      return "bg-[#0E7658] text-white";
    case "PENDING":
      return "bg-[#E68A17] text-white";
    case "SOLD":
      return "bg-[#C92A2A] text-white";
    case "RENTED":
      return "bg-[#8B3FC7] text-white";
    case "DRAFT":
      return "bg-[#7C3AED] text-white";
    case "RESERVED":
      return "bg-[#A66A12] text-white";
    default:
      return "bg-[#667085] text-white";
  }
}

/* =====================================================
   PROPERTY CARD
===================================================== */

function OwnerPropertyCard({ property }) {
  const [showMore, setShowMore] = useState(false);

  const documentId = property?.documentId || property?.id;
  const title = safeValue(property?.Title, "Untitled Property");
  const city = safeValue(property?.City);
  const area = safeValue(property?.Area);
  const purpose = safeValue(property?.Purpose, "Sale");
  const status = safeValue(property?.PropertyStatus, "Available");
  const imageUrl = getImageUrl(property);

  const commonDetails = property?.PropertyCommonDetails || {};
  const residentialDetails = property?.ResidentialDetails || {};

  const bedrooms =
    residentialDetails?.Bedrooms ??
    commonDetails?.Bedrooms ??
    property?.Bedrooms ??
    null;

  const bathrooms =
    residentialDetails?.Bathrooms ??
    commonDetails?.Bathrooms ??
    property?.Bathrooms ??
    null;

  const parking =
    residentialDetails?.Parking ??
    commonDetails?.Parking ??
    property?.Parking ??
    null;

  const builtUpArea =
    commonDetails?.Built_upArea ??
    commonDetails?.BuiltUpArea ??
    commonDetails?.Area ??
    property?.BuiltUpArea ??
    null;

  const rawPrice =
    property?.Price ?? commonDetails?.Price ?? null;

  const priceUnits =
    property?.PriceUnits ?? property?.Price_Units ?? commonDetails?.PriceUnits ?? null;

  const price = formatPrice(rawPrice, priceUnits);

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#3A3329] bg-[#171411] shadow-[0_12px_35px_rgba(0,0,0,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B99852] hover:shadow-[0_20px_45px_rgba(0,0,0,0.25)]">
      {/* IMAGE */}
      <div className="relative h-[215px] w-full overflow-hidden bg-[#24201B]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-all duration-500 group-hover:scale-105"
          unoptimized
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5" />

        {/* STATUS */}
        <span
          className={`absolute left-3 top-3 rounded-md px-3 py-1.5 text-[10px] font-extrabold tracking-wide shadow-lg ${getStatusBadge(status)}`}
        >
          {status.toUpperCase()}
        </span>

        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/70"
          aria-label="Bookmark property"
        >
          <Bookmark size={16} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h2 className="line-clamp-1 text-[16px] font-extrabold text-white">
          {title}
        </h2>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#B8B0A5]">
          <MapPin size={13} className="shrink-0 text-[#D0A54A]" />
          <span className="line-clamp-1">
            {area}
            {area && city ? ", " : ""}
            {city}
          </span>
        </p>

        <div className="mt-3">
          <span className="text-lg font-extrabold text-[#4CCB63]">
            {price}
          </span>
          {purpose.toLowerCase() === "rent" && (
            <span className="ml-1 text-[11px] font-medium text-[#A9A19A]">
              / month
            </span>
          )}
        </div>

        {/* FEATURES */}
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-[10px] text-[#C7C0B7]">
          {bedrooms !== null && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} />
              {bedrooms} Beds
            </span>
          )}
          {bathrooms !== null && (
            <span className="flex items-center gap-1">
              <Bath size={13} />
              {bathrooms} Baths
            </span>
          )}
          {parking !== null && (
            <span className="flex items-center gap-1">
              <Car size={13} />
              {parking} Parking
            </span>
          )}
          {builtUpArea !== null && (
            <span className="flex items-center gap-1">
              <Maximize size={12} />
              {builtUpArea} sq.ft
            </span>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-4 flex gap-2">
          {/* VIEW */}
          <Link
            href={`/owner/properties/${documentId}?from=residential`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#4A4034] bg-[#24201B] px-2 py-2.5 text-[11px] font-bold text-white transition hover:border-[#B99852] hover:bg-[#302A23]"
          >
            <Eye size={14} />
            View
          </Link>

          {/* EDIT */}
          <Link
            href={`/owner/properties/${documentId}/edit`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#806322] px-2 py-2.5 text-[11px] font-bold text-[#FFF4D6] transition hover:bg-[#9A7830]"
          >
            <Pencil size={14} />
            Edit
          </Link>

          {/* MORE */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="flex h-full min-w-[40px] items-center justify-center rounded-lg border border-[#40382F] bg-[#24201B] text-white transition hover:border-[#B99852]"
              aria-label="More actions"
            >
              <MoreVertical size={16} />
            </button>

            {showMore && (
              <div className="absolute bottom-12 right-0 z-30 w-40 overflow-hidden rounded-xl border border-[#40382F] bg-[#211D18] p-1 shadow-2xl">
                <Link
                  href={`/owner/properties/${documentId}?from=residential`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-white hover:bg-[#302A23]"
                  onClick={() => setShowMore(false)}
                >
                  <ExternalLink size={13} />
                  View Property
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   PAGE
===================================================== */

export default function ResidentialPropertiesPage() {
  const [dashboard, setDashboard] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // =====================================================
  // LOAD — Owner's Residential properties only
  // =====================================================

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErrorMessage("");

        const [dashboardData, ownerData] = await Promise.all([
          getOwnerDashboard(),
          getOwnerProperties(),
        ]);

        setDashboard(dashboardData || null);

        const allProperties = Array.isArray(ownerData?.properties)
          ? ownerData.properties
          : [];

        // Filter ONLY Residential
        const residential = allProperties.filter(
          (p) =>
            p?.Property_Type?.toString().trim().toLowerCase() === "residential"
        );

        setProperties(residential);
      } catch (error) {
        console.error("RESIDENTIAL PROPERTIES ERROR:", error);
        setErrorMessage(
          error?.message || "Unable to load Residential properties."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // =====================================================
  // SEARCH FILTER
  // =====================================================

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return properties;

    return properties.filter((p) => {
      const title = p?.Title?.toString().toLowerCase() || "";
      const city = p?.City?.toString().toLowerCase() || "";
      const area = p?.Area?.toString().toLowerCase() || "";

      return (
        title.includes(term) || city.includes(term) || area.includes(term)
      );
    });
  }, [properties, searchTerm]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F0E8] px-4">
        <div className="rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] px-8 py-6 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#D9D1C2] border-t-[#174B3B]" />
          <p className="text-sm font-semibold text-[#416353]">
            Loading Residential properties...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F0E8] px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-[#F7F0E3] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
            !
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-[#123F32]">
            Unable to load properties
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#718177]">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-[#174B3B] px-5 py-3 text-sm font-bold text-[#F7F0E3] transition hover:bg-[#123F32]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F0E8]">
      {/* =================================================
          OWNER HEADER
      ================================================= */}

      <Header headerData={dashboard?.header} />

      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <div className="mx-auto w-full max-w-[1400px] px-6 pt-6 lg:px-10">
        <Link
          href="/owner"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#174B3B] transition hover:text-[#123F32]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 pb-8 lg:px-10">

        {/* PAGE HEADER */}
        <div className="mb-6 mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D7AE62]/20">
                <Home size={20} className="text-[#D7AE62]" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#B99852]">
                  Owner Portal
                </p>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#123F32] sm:text-3xl">
                  Residential Properties
                </h1>
              </div>
            </div>
            <p className="mt-2 text-sm text-[#718177]">
              Browse your residential properties.
            </p>
          </div>

          {/* ADD NEW */}
          <Link
            href="/add-property"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D7AE62] px-5 py-3 text-sm font-extrabold text-[#123F32] shadow-sm transition hover:bg-[#C99D4C] hover:shadow-md"
          >
            <Plus size={16} />
            Add Property
          </Link>
        </div>

        {/* SEARCH */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] p-2.5 shadow-sm">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B99852]"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, city or locality..."
              className="h-11 w-full rounded-xl border border-[#E0D8CA] bg-[#F3F0E8] pl-10 pr-10 text-sm text-[#123F32] outline-none placeholder:text-[#8A968D] focus:border-[#B99852] focus:ring-2 focus:ring-[#B99852]/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#718177] hover:bg-[#E5E8DE]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* COUNT */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#718177]">
            Showing{" "}
            <span className="font-extrabold text-[#174B3B]">
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "property" : "properties"}
          </p>

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="text-sm font-bold text-[#B99852] hover:text-[#174B3B]"
            >
              Clear search
            </button>
          )}
        </div>

        {/* PROPERTIES GRID */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((property, index) => (
              <OwnerPropertyCard
                key={property?.documentId || property?.id || index}
                property={property}
              />
            ))}
          </div>
        ) : (
          // EMPTY STATE
          <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#D9D1C2] bg-[#F7F0E3] px-6 py-12 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5E8DE]">
              <Home size={28} className="text-[#174B3B]" />
            </div>

            <h2 className="text-xl font-extrabold text-[#123F32]">
              {searchTerm
                ? "No results found"
                : "No Residential Properties"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718177]">
              {searchTerm
                ? `No residential properties match "${searchTerm}".`
                : "You haven't added any Residential properties yet."}
            </p>

            {!searchTerm && (
              <Link
                href="/add-property"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#174B3B] px-5 py-3 text-sm font-bold text-[#F7F0E3] transition hover:bg-[#123F32]"
              >
                <Plus size={16} />
                Add Property
              </Link>
            )}
          </div>
        )}
      </main>

      {/* =================================================
          OWNER FOOTER
      ================================================= */}

      <Footer
        data={dashboard?.Footer || dashboard?.footer || null}
      />
    </div>
  );
}
