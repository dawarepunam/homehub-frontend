"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { MapPin, ArrowRight, Eye, Calendar, Clock, CheckCircle2, MoreVertical, Trash2, X, Loader2 } from "lucide-react";
// Using direct fetch instead of deleteMyEnquiry to mark BuyerDeleted=true
import toast from "react-hot-toast";

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  `${STRAPI_BASE_URL}/api`;

const STRAPI_URL = STRAPI_BASE_URL;

export default function EnquiryCard({ enquiry, onRemove }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    const docId = enquiry?.documentId;
    if (!docId) {
      toast.error("Cannot remove this enquiry: missing ID.");
      return;
    }
    try {
      setIsDeleting(true);

      // Get auth token
      const token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("token") ||
            localStorage.getItem("jwt") ||
            localStorage.getItem("strapi_jwt"))) ||
        null;

      if (!token) {
        throw new Error("Not authenticated.");
      }

      // Mark BuyerDeleted=true via PUT — persists across refresh.
      // getMyEnquiries already filters filters[BuyerDeleted][$ne]=true.
      const res = await fetch(
        `${STRAPI_API_URL}/enquiries/${docId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data: { BuyerDeleted: true } }),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.error?.message ||
            `Server error: ${res.status}`
        );
      }

      toast.success("Enquiry removed successfully.");
      setIsDeleteModalOpen(false);
      if (onRemove) onRemove(docId);
    } catch (error) {
      console.error("Remove enquiry error:", error);
      toast.error("Failed to remove enquiry. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const property = enquiry?.property;
  const documentId = enquiry?.documentId || enquiry?.id;
  const propertyDocumentId = property?.documentId || property?.id;
  
  const title = property?.Title || "Untitled Property";
  const area = property?.Area || "";
  const city = property?.City || "";
  const purpose = property?.Purpose || "";
  const propertyType = property?.Property_Type || "";
  const category = property?.Category || "";

  // Status — schema field is "Statuss" (double s). Trim to handle schema typos like " Confirmed"
  const status = (enquiry?.Statuss || enquiry?.Status || "Pending").trim();
  const statusLower = status.toLowerCase().trim();
  const date = enquiry?.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "";

  // Build image URL — CoverImage lives inside property
  let imageUrl = null;
  const coverImg = property?.CoverImage;
  if (coverImg?.url) {
    imageUrl = coverImg.url.startsWith("http") ? coverImg.url : `${STRAPI_URL}${coverImg.url}`;
  } else if (Array.isArray(coverImg) && coverImg[0]?.url) {
    const u = coverImg[0].url;
    imageUrl = u.startsWith("http") ? u : `${STRAPI_URL}${u}`;
  } else if (coverImg?.data?.attributes?.url) {
    const u = coverImg.data.attributes.url;
    imageUrl = u.startsWith("http") ? u : `${STRAPI_URL}${u}`;
  }

  const getStatusStyles = () => {
    if (["pending", "new"].includes(statusLower))
      return "bg-amber-100 text-amber-800";
    if (["contacted", "interested", "follow-up required"].includes(statusLower))
      return "bg-emerald-100 text-emerald-800";
    if (["site visit", "site visit pending", "scheduled", "confirmed", "rescheduled"].includes(statusLower))
      return "bg-teal-50 border border-teal-200 text-teal-700";
    if (["closed", "completed", "converted"].includes(statusLower))
      return "bg-stone-100 text-stone-600";
    if (["cancelled", "notinterested"].includes(statusLower))
      return "bg-red-50 text-red-600";
    return "bg-stone-100 text-stone-700";
  };

  const StatusIcon = () => {
    if (["pending", "new"].includes(statusLower))
      return <Clock size={12} className="mr-1" />;
    if (["contacted", "interested", "follow-up required"].includes(statusLower))
      return <div className="mr-1.5 h-2 w-2 rounded-full bg-emerald-600" />;
    if (["site visit", "site visit pending", "scheduled", "confirmed", "rescheduled"].includes(statusLower))
      return <Calendar size={12} className="mr-1" />;
    if (["closed", "completed", "converted", "cancelled", "notinterested"].includes(statusLower))
      return <CheckCircle2 size={12} className="mr-1" />;
    return null;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Property Image */}
      <div className="relative h-48 w-full overflow-hidden bg-stone-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div
          className="hidden h-full w-full items-center justify-center bg-stone-100"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <span className="text-4xl">🏠</span>
        </div>
        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {propertyType && <span className="rounded-full bg-stone-900/70 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">{propertyType}</span>}
          {purpose && <span className="rounded-full bg-amber-500/90 px-2 py-1 text-[10px] font-semibold text-emerald-900 backdrop-blur-sm">{purpose}</span>}
        </div>
        {/* Status badge top-right */}
        <div className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${getStatusStyles()}`}>
          <StatusIcon />
          {status}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">{category}</p>
        <h3 className="mt-1 text-lg font-bold text-emerald-900 line-clamp-1">{title}</h3>
        <p className="mt-1 flex items-center text-sm text-stone-500">
          <MapPin size={14} className="mr-1 shrink-0 text-emerald-700" />
          <span className="truncate">{area}{area && city ? ", " : ""}{city || "Location not specified"}</span>
        </p>

        <div className="mt-3 flex items-center gap-4 border-t border-stone-100 pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase text-stone-400">Enquiry Sent</p>
            <p className="mt-0.5 text-sm font-medium text-stone-700">{date || "-"}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <Link
            href={`/user/enquiries/${documentId}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-amber-400"
          >
            View Enquiry <ArrowRight size={16} />
          </Link>
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-stone-600 transition hover:bg-stone-100 hover:text-emerald-900"
            >
              <MoreVertical size={18} />
            </button>
            
            {isMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 rounded-xl border border-stone-200 bg-white p-1 shadow-lg z-10">
                <Link
                  href={`/user/enquiries/${documentId}`}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-emerald-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Eye size={16} /> View Enquiry
                </Link>
                {propertyDocumentId && (
                  <Link
                    href={`/user/property/${propertyDocumentId}`}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-emerald-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MapPin size={16} /> View Property
                  </Link>
                )}
                <div className="my-1 h-px w-full bg-stone-100" />
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} /> Remove Enquiry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50 p-4">
              <h3 className="font-bold text-emerald-900">Remove Enquiry</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="rounded-lg p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-stone-600">Are you sure you want to remove this enquiry from your enquiries?</p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-amber-500 transition hover:bg-emerald-800 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Remove Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
