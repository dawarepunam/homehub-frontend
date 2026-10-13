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
      return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
    if (["contacted", "interested", "follow-up required"].includes(statusLower))
      return "bg-blue-500/10 text-blue-600 border border-blue-500/20";
    if (["site visit", "site visit pending", "scheduled", "confirmed", "rescheduled"].includes(statusLower))
      return "bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]";
    if (["closed", "completed", "converted"].includes(statusLower))
      return "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]";
    if (["cancelled", "notinterested"].includes(statusLower))
      return "bg-red-500/10 text-red-500 border border-red-500/20";
    return "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]";
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
    <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm transition hover:shadow-md hover:border-[var(--text-primary)]/30">
      {/* Property Image */}
      <div className="relative h-48 w-full overflow-hidden bg-[var(--bg-surface)]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div
          className="hidden h-full w-full items-center justify-center bg-[var(--bg-surface)]"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <span className="text-4xl">🏠</span>
        </div>
        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {propertyType && <span className="rounded-full bg-[var(--bg-card)]/90 border border-[var(--border-subtle)] px-2 py-1 text-[10px] font-semibold text-[var(--text-primary)] backdrop-blur-sm">{propertyType}</span>}
          {purpose && <span className="rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] px-2 py-1 text-[10px] font-semibold backdrop-blur-sm">{purpose}</span>}
        </div>
        {/* Status badge top-right */}
        <div className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${getStatusStyles()}`}>
          <StatusIcon />
          {status}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{category}</p>
        <h3 className="mt-1 text-lg font-bold text-[var(--text-primary)] line-clamp-1">{title}</h3>
        <p className="mt-1 flex items-center text-sm text-[var(--text-secondary)]">
          <MapPin size={14} className="mr-1 shrink-0 text-[var(--text-primary)]" />
          <span className="truncate">{area}{area && city ? ", " : ""}{city || "Location not specified"}</span>
        </p>

        <div className="mt-3 flex items-center gap-4 border-t border-[var(--border-subtle)] pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase text-[var(--text-secondary)]">Enquiry Sent</p>
            <p className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">{date || "-"}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <Link
            href={`/user/enquiries/${documentId}`}
            className="hh-btn hh-btn-primary flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            View Enquiry <ArrowRight size={16} />
          </Link>
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2.5 text-[var(--text-secondary)] transition hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
            >
              <MoreVertical size={18} />
            </button>
            
            {isMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-1 shadow-lg z-10">
                <Link
                  href={`/user/enquiries/${documentId}`}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Eye size={16} /> View Enquiry
                </Link>
                {propertyDocumentId && (
                  <Link
                    href={`/user/property/${propertyDocumentId}`}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MapPin size={16} /> View Property
                  </Link>
                )}
                <div className="my-1 h-px w-full bg-[var(--border-subtle)]" />
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <h3 className="font-bold text-[var(--text-primary)]">Remove Enquiry</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="rounded-lg p-1 text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)]">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[var(--text-secondary)]">Are you sure you want to remove this enquiry from your enquiries?</p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="hh-btn hh-btn-secondary px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
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
