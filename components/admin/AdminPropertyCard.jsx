"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, MapPin, Eye, Bookmark, MessageSquare, ChevronRight } from "lucide-react";

// Normalise STRAPI_BASE so image URLs resolve correctly
const STRAPI_BASE = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337")
  .replace(/\/api\/?$/, "");

// All actual PropertyStatus enum values from schema.json
const STATUS_STYLE = {
  ACTIVE:   "bg-emerald-100 text-emerald-800 border-emerald-200",
  PENDING:  "bg-amber-100   text-amber-800   border-amber-200",
  DRAFT:    "bg-gray-100    text-gray-700    border-gray-200",
  SOLD:     "bg-blue-100    text-blue-800    border-blue-200",
  RENTED:   "bg-purple-100  text-purple-800  border-purple-200",
  INACTIVE: "bg-red-100     text-red-700     border-red-200",
  RESERVED: "bg-orange-100  text-orange-800  border-orange-200",
};

function resolveImageUrl(CoverImage, PropertyImage) {
  // CoverImage is a single media object
  if (CoverImage?.url) return `${STRAPI_BASE}${CoverImage.url}`;
  // PropertyImage is a multiple media field — array of objects
  if (Array.isArray(PropertyImage) && PropertyImage.length > 0 && PropertyImage[0]?.url) {
    return `${STRAPI_BASE}${PropertyImage[0].url}`;
  }
  return null;
}

function resolveEnquiryCount(enquiries) {
  if (!enquiries) return 0;
  // Strapi v5 with count=true returns { count: N }
  if (typeof enquiries === "object" && !Array.isArray(enquiries) && "count" in enquiries) {
    return enquiries.count;
  }
  // Array format (v4 or full populate)
  if (Array.isArray(enquiries)) return enquiries.length;
  return 0;
}

export default function AdminPropertyCard({ property }) {
  const [imgError, setImgError] = useState(false);

  const {
    id,
    documentId,
    Title,
    Property_Type,
    Purpose,
    Category,
    Price,
    PriceUnits,
    PropertyStatus,
    City,
    Area,
    CoverImage,
    PropertyImage,
    Owner,
    Views   = 0,
    Saves   = 0,
    enquiries,
  } = property;

  const imageUrl    = !imgError ? resolveImageUrl(CoverImage, PropertyImage) : null;
  const ownerName   = Owner?.name || Owner?.username || "Unknown Seller";
  const enquiryCount = resolveEnquiryCount(enquiries);
  const statusStyle = STATUS_STYLE[PropertyStatus] || "bg-gray-100 text-gray-700 border-gray-200";
  // Use documentId for the admin detail route (Strapi v5 requirement)
  const detailHref  = `/admin/properties/${documentId || id}`;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D7AE62]/70 hover:shadow-2xl hover:shadow-black/10 flex flex-col sm:flex-row">

      {/* Image Panel */}
      <div className="sm:w-56 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden bg-[#F3EBDD]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={Title || "Property"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#DCCCB0]">
            <Home className="h-12 w-12 mb-2 opacity-40" />
            <span className="text-xs font-semibold text-[#9B6848]/60">No Image</span>
          </div>
        )}

        {/* Gold accent line on hover */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#D7AE62] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm ${statusStyle}`}>
            {PropertyStatus || "UNKNOWN"}
          </span>
        </div>
      </div>

      {/* Content Panel */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Type + Purpose */}
          <div className="flex items-center gap-2 mb-1.5">
            {Property_Type && (
              <span className="text-[10px] font-bold text-[#0D3326] uppercase tracking-widest">{Property_Type}</span>
            )}
            {Property_Type && Purpose && <span className="text-gray-300 text-xs">•</span>}
            {Purpose && (
              <span className="text-[10px] font-bold text-[#9B6848] uppercase tracking-widest">For {Purpose}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[#0D3326] leading-tight group-hover:text-[#174638] transition-colors line-clamp-1">
            {Title || "Untitled Property"}
          </h3>

          {/* Location */}
          <p className="mt-1 flex items-center text-sm text-gray-500">
            <MapPin className="mr-1 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <span className="truncate">{[Area, City].filter(Boolean).join(", ") || "Location N/A"}</span>
          </p>

          {/* Category */}
          {Category && (
            <p className="mt-1 text-xs text-[#3E4B32]/70 font-medium">{Category}</p>
          )}

          {/* Metrics — appear on hover */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-1.5" title="Views">
              <Eye className="h-4 w-4 text-gray-400" />
              <span>{Views}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Saves">
              <Bookmark className="h-4 w-4 text-gray-400" />
              <span>{Saves}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Enquiries">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <span>{enquiryCount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          {/* Price + Seller */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xl font-extrabold text-[#0D3326] leading-none">
              {Price ? `₹${Number(Price).toLocaleString("en-IN")}${PriceUnits ? ` ${PriceUnits}` : ""}` : "Price N/A"}
            </span>
            <div className="mt-1.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Seller</span>
              <p className="text-sm font-semibold text-[#0D3326] truncate max-w-[140px] sm:max-w-[180px]">
                {ownerName}
              </p>
            </div>
          </div>

          {/* View Details */}
          <Link
            href={detailHref}
            className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#F3EBDD] px-4 py-2.5 text-sm font-bold text-[#0D3326] transition-all duration-200 hover:bg-[#D7AE62] hover:text-white hover:shadow-md"
          >
            View
            <ChevronRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
