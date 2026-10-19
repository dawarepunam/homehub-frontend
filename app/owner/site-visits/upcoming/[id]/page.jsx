"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import {
  ArrowLeft,
  CalendarCheck,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { getOwnerEnquiry, updateOwnerEnquiryFields } from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function SiteVisitDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Modals
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("11:00");
  const [rescheduleNote, setRescheduleNote] = useState("");

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Customer cancelled");
  const [cancelNote, setCancelNote] = useState("");

  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeOutcome, setCompleteOutcome] = useState("Interested");
  const [completeFeedback, setCompleteFeedback] = useState("");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadVisit();
    }
  }, [id]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Lock background body scroll when modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      rescheduleModalOpen || cancelModalOpen || completeModalOpen || confirmModalOpen
    );
    if (isAnyModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [rescheduleModalOpen, cancelModalOpen, completeModalOpen, confirmModalOpen]);

  async function loadVisit() {
    try {
      setLoading(true);
      setError("");
      const data = await getOwnerEnquiry(id);
      setVisit(data);
    } catch (err) {
      setError(err?.message || "Failed to load visit details.");
    } finally {
      setLoading(false);
    }
  }

  // Helpers
  function getStatus(item) {
    return String(item?.Status || item?.status || item?.Statuss || "Pending").trim();
  }
  function getPropertyRelation(item) {
    const rel = item?.property;
    if (!rel) return {};
    if (rel?.data?.attributes) return rel.data.attributes;
    if (rel?.attributes) return rel.attributes;
    if (rel?.data) return rel.data;
    return rel;
  }
  function getPropertyName(item) {
    const prop = getPropertyRelation(item);
    return prop?.Title || prop?.title || prop?.Name || prop?.name || "Untitled Property";
  }
  function getPropertyCity(item) {
    const prop = getPropertyRelation(item);
    return prop?.City || prop?.city || prop?.Location || prop?.location || "";
  }
  function getPropertyArea(item) {
    const prop = getPropertyRelation(item);
    return prop?.Area || prop?.area || prop?.Locality || prop?.locality || "";
  }
  function getPropertyPurpose(item) {
    const prop = getPropertyRelation(item);
    return prop?.Purpose || prop?.purpose || prop?.ListingType || prop?.listingType || "Sale";
  }
  function getPropertyType(item) {
    const prop = getPropertyRelation(item);
    return prop?.PropertyType || prop?.propertyType || prop?.Category || prop?.category || "Apartment";
  }
  function getPropertyPrice(item) {
    const prop = getPropertyRelation(item);
    const rawPrice = prop?.Price || prop?.price || prop?.ExpectedPrice || prop?.expectedPrice;
    if (!rawPrice) return null;
    if (typeof rawPrice === "number") {
      if (rawPrice >= 10000000) return `₹${(rawPrice / 10000000).toFixed(2)} Cr`;
      if (rawPrice >= 100000) return `₹${(rawPrice / 100000).toFixed(2)} Lakh`;
      return `₹${rawPrice.toLocaleString("en-IN")}`;
    }
    return `₹${rawPrice}`;
  }
  function getPropertyImage(item) {
    const prop = getPropertyRelation(item);
    const images = prop?.Images || prop?.images || prop?.Media || prop?.media;
    if (Array.isArray(images) && images.length > 0) {
      const imgObj = images[0];
      const url = imgObj?.url || imgObj?.attributes?.url;
      if (url) {
        return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
      }
    }
    return null;
  }
  function getVisitDateStr(item) {
    return item?.VisitDate || item?.visitDate || item?.FollowUpDate || item?.updatedAt || item?.createdAt;
  }
  function formatVisitDateTime(dateStr) {
    if (!dateStr) return { date: "Date TBA", time: "--:--" };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: String(dateStr), time: "--:--" };
    const dateFormatted = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", weekday: "short" });
    const timeFormatted = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    return { date: dateFormatted, time: timeFormatted };
  }

  async function updateVisit(newStatus, extraFields = {}) {
    setActionLoading(true);
    try {
      let mappedStatus = newStatus;
      if (newStatus === "Confirmed") mappedStatus = " Confirmed";
      if (newStatus === "Cancelled") mappedStatus = "Cancelled ";

      await updateOwnerEnquiryFields(id, {
        Statuss: mappedStatus,
        ...extraFields,
      });

      await loadVisit();
      return true;
    } catch (err) {
      console.error("SITE VISIT UPDATE ERROR:", err);
      setErrorMessage(err?.message || "Failed to update site visit.");
      return false;
    } finally {
      setActionLoading(false);
    }
  }

  async function handleConfirm() {
    const success = await updateVisit("Confirmed");
    if (success) {
      setSuccessMessage("Site visit confirmed! Customer has been notified.");
      setConfirmModalOpen(false);
    }
  }

  async function handleReschedule() {
    if (!rescheduleDate) {
      setErrorMessage("Please select a new date.");
      return;
    }
    const newDateStr = `${rescheduleDate}T${rescheduleTime}:00`;
    const success = await updateVisit("Rescheduled", {
      VisitDate: newDateStr,
      OwnerResponse: rescheduleNote || undefined,
    });
    if (success) {
      setSuccessMessage("Site visit rescheduled successfully.");
      setRescheduleModalOpen(false);
      setRescheduleNote("");
      setRescheduleDate("");
    }
  }

  async function handleCancel() {
    const success = await updateVisit("Cancelled", {
      ClosedReason: cancelReason,
      OwnerResponse: cancelNote || undefined,
    });
    if (success) {
      setSuccessMessage("Site visit cancelled.");
      setCancelModalOpen(false);
      setTimeout(() => router.push("/owner/site-visits/cancelled"), 1200);
    }
  }

  async function handleComplete() {
    const success = await updateVisit("Completed", {
      OwnerResponse: [completeOutcome ? `Outcome: ${completeOutcome}` : "", completeFeedback].filter(Boolean).join(". ") || undefined,
    });
    if (success) {
      setSuccessMessage("Site visit marked as completed.");
      setCompleteModalOpen(false);
      setTimeout(() => router.push("/owner/site-visits/completed"), 1200);
    }
  }

  if (loading) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
          <div className="mb-6">
            <Link
              href="/owner/site-visits/upcoming"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
            >
              <ArrowLeft size={14} />
              Back to Site Visits
            </Link>
          </div>
          <div className="seller-card p-12 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[var(--seller-primary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[var(--seller-text)] font-semibold mt-4 text-sm">Loading visit details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
          <div className="mb-6">
            <Link
              href="/owner/site-visits/upcoming"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
            >
              <ArrowLeft size={14} />
              Back to Site Visits
            </Link>
          </div>
          <div className="seller-card p-10 text-center">
            <h2 className="text-lg font-bold text-[var(--seller-text)]">Visit Not Found</h2>
            <p className="text-xs text-[var(--seller-text-muted)] mt-1">{error || "The requested visit could not be loaded."}</p>
            <Link href="/owner/site-visits/upcoming" className="mt-4 inline-block px-4 py-2 bg-[var(--seller-primary)] text-[var(--seller-bg)] text-xs font-bold rounded-xl">
              Go Back
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const status = getStatus(visit);
  const isPending = status.toLowerCase() === "pending" || status.toLowerCase() === "scheduled" || status.toLowerCase() === "site visit" || status.toLowerCase() === "site_visit";
  const isConfirmed = status.toLowerCase() === "confirmed";

  return (
    <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
      <Header />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">

        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-[var(--seller-border-focus)] bg-[var(--seller-surface)] p-3.5 shadow-sm text-xs font-semibold text-[var(--seller-text)] animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--seller-primary)] text-[var(--seller-bg)] text-[10px] font-black">✓</span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 shadow-sm text-xs font-semibold text-red-600 dark:text-red-400">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)]">
          <Link href="/owner" className="hover:text-[var(--seller-text)]">Home</Link>
          <span>›</span>
          <Link href="/owner/site-visits/upcoming" className="hover:text-[var(--seller-text)]">Site Visits</Link>
          <span>›</span>
          <span className="text-[var(--seller-text)]">Visit Details</span>
        </div>

        {/* Main Card */}
        <div className="seller-card p-6 sm:p-8">
          
          {/* Header Banner */}
          <div className="flex items-center gap-4 mb-6 border-b border-[var(--seller-border)] pb-5">
            <div className="w-12 h-12 rounded-2xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center font-black text-xl border border-[var(--seller-border)]">
              {(visit?.Name || visit?.name || "U")[0]}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--seller-text)]">
                {visit?.Name || visit?.name || "Customer Visit"}
              </h3>
              <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                ☎ {visit?.Phone || "Not provided"} | ✉ {visit?.Email || "Not provided"}
              </p>
            </div>
            <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-[var(--seller-bg)] text-[var(--seller-text)] uppercase tracking-wider border border-[var(--seller-border)]">
              {status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column Details */}
            <div className="lg:col-span-2 space-y-4">
              
              <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">Visit Schedule</h4>
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-[var(--seller-text-subtle)] block text-xs">Date</span>
                    <span className="font-bold text-[var(--seller-text)]">{formatVisitDateTime(getVisitDateStr(visit)).date}</span>
                  </div>
                  <div>
                    <span className="text-[var(--seller-text-subtle)] block text-xs">Time</span>
                    <span className="font-bold text-[var(--seller-text)]">{formatVisitDateTime(getVisitDateStr(visit)).time}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">Target Property</h4>
                <div className="flex gap-4 items-start">
                  {getPropertyImage(visit) && (
                    <img src={getPropertyImage(visit)} alt="Property" className="w-20 h-20 rounded-xl object-cover border border-[var(--seller-border)] shrink-0" />
                  )}
                  <div>
                    <h5 className="font-bold text-sm sm:text-base text-[var(--seller-text)]">{getPropertyName(visit)}</h5>
                    <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">📍 {[getPropertyArea(visit), getPropertyCity(visit)].filter(Boolean).join(", ") || "Location specified"}</p>
                    {getPropertyPrice(visit) && <p className="text-xs sm:text-sm font-extrabold text-[var(--seller-text)] pt-0.5">{getPropertyPrice(visit)}</p>}
                  </div>
                </div>
              </div>

              {(visit?.Message || visit?.message) && (
                <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                  <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-2">Customer Note</h4>
                  <p className="text-xs text-[var(--seller-text)] italic">&quot;{visit.Message || visit.message}&quot;</p>
                </div>
              )}

            </div>

            {/* Right Column Actions */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-2">Actions</h4>

              {visit?.Phone && (
                <a
                  href={`tel:${visit.Phone}`}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition block shadow-2xs"
                >
                  📞 Call Customer
                </a>
              )}

              {isPending && (
                <button
                  type="button"
                  onClick={() => setConfirmModalOpen(true)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition block"
                >
                  ✓ Confirm Visit
                </button>
              )}

              {(isPending || isConfirmed) && (
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(true)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition block"
                >
                  📅 Reschedule Visit
                </button>
              )}

              {isConfirmed && (
                <button
                  type="button"
                  onClick={() => setCompleteModalOpen(true)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition block"
                >
                  ✓ Mark as Completed
                </button>
              )}

              {(isPending || isConfirmed) && (
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  className="w-full px-4 py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 font-semibold text-xs transition block"
                >
                  ✕ Cancel Visit
                </button>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Confirm Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--seller-surface)] rounded-3xl p-6 w-full max-w-sm text-center border border-[var(--seller-border)] text-[var(--seller-text)]">
            <h3 className="text-base font-bold mb-2">Confirm Site Visit?</h3>
            <p className="text-xs text-[var(--seller-text-muted)] mb-6">Are you sure you want to confirm this scheduled visit?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModalOpen(false)} className="flex-1 py-2 rounded-xl border border-[var(--seller-border)] font-semibold text-xs">Cancel</button>
              <button onClick={handleConfirm} className="flex-1 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 border border-[var(--seller-border)] text-[var(--seller-text)]">
            <h3 className="text-base font-bold">Reschedule Visit</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">New Date</label>
                  <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs outline-none focus:border-[var(--seller-border-focus)]" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">New Time</label>
                  <input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs outline-none focus:border-[var(--seller-border-focus)]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Reason / Note</label>
                <input type="text" value={rescheduleNote} onChange={(e) => setRescheduleNote(e.target.value)} placeholder="Reason for reschedule..." className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs outline-none focus:border-[var(--seller-border-focus)]" />
              </div>
              <div className="flex gap-3 pt-3">
                <button onClick={() => setRescheduleModalOpen(false)} className="flex-1 py-2 rounded-xl border border-[var(--seller-border)] font-semibold text-xs">Cancel</button>
                <button onClick={handleReschedule} className="flex-1 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90">Reschedule</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {completeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 border border-[var(--seller-border)] text-[var(--seller-text)]">
            <h3 className="text-base font-bold">Complete Visit</h3>
            <div className="mt-4 space-y-4 text-xs font-semibold">
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="outcome" value="Interested" checked={completeOutcome === "Interested"} onChange={(e) => setCompleteOutcome(e.target.value)} className="accent-[var(--seller-primary)]" />
                  <span>⭐ Interested</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="outcome" value="Follow-up Required" checked={completeOutcome === "Follow-up Required"} onChange={(e) => setCompleteOutcome(e.target.value)} className="accent-[var(--seller-primary)]" />
                  <span>⏰ Follow-up Required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="outcome" value="Not Interested" checked={completeOutcome === "Not Interested"} onChange={(e) => setCompleteOutcome(e.target.value)} className="accent-[var(--seller-primary)]" />
                  <span>✕ Not Interested</span>
                </label>
              </div>
              <textarea rows={2} value={completeFeedback} onChange={(e) => setCompleteFeedback(e.target.value)} placeholder="Customer feedback..." className="w-full p-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] text-xs outline-none focus:border-[var(--seller-border-focus)] resize-none" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setCompleteModalOpen(false)} className="flex-1 py-2 rounded-xl border border-[var(--seller-border)] font-semibold text-xs">Cancel</button>
                <button onClick={handleComplete} className="flex-1 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90">Complete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 text-center border border-[var(--seller-border)] text-[var(--seller-text)]">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-xl mx-auto mb-3">✕</div>
            <h3 className="text-base font-bold">Cancel Visit?</h3>
            <div className="mt-4 space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold mb-1">Reason</label>
                <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-semibold outline-none focus:border-[var(--seller-border-focus)] cursor-pointer">
                  <option value="Customer cancelled">Customer cancelled</option>
                  <option value="Owner unavailable">Owner unavailable</option>
                  <option value="Property unavailable">Property unavailable</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Note (Optional)</label>
                <input type="text" value={cancelNote} onChange={(e) => setCancelNote(e.target.value)} placeholder="Context..." className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs outline-none focus:border-[var(--seller-border-focus)]" />
              </div>
              <div className="flex gap-3 pt-3">
                <button onClick={() => setCancelModalOpen(false)} className="flex-1 py-2 rounded-xl border border-[var(--seller-border)] font-semibold text-xs">Keep</button>
                <button onClick={handleCancel} className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700">Cancel Visit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
