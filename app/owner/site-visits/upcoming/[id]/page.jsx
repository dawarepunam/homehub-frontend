"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../../Footer";
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

  /**
   * Core update function — sends status + all extra fields in ONE PUT request.
   * Two separate calls cause the backend to detect oldStatus === cleanStatus
   * on the second call and skip the email notification entirely.
   */
  async function updateVisit(newStatus, extraFields = {}) {
    setActionLoading(true);
    try {
      // Normalize enum values to match exact Strapi schema (whitespace quirks)
      let mappedStatus = newStatus;
      if (newStatus === "Confirmed") mappedStatus = " Confirmed";
      if (newStatus === "Cancelled") mappedStatus = "Cancelled ";

      await updateOwnerEnquiryFields(id, {
        Statuss: mappedStatus,
        ...extraFields,
      });

      // Reload to get the latest data from Strapi
      await loadVisit();
      return true;
    } catch (err) {
      console.error("SITE VISIT UPDATE ERROR:", err);
      alert(err?.message || "Failed to update site visit. Please try again.");
      return false;
    } finally {
      setActionLoading(false);
    }
  }

  // Action: Confirm Visit
  async function handleConfirm() {
    const success = await updateVisit("Confirmed");
    if (success) {
      setSuccessMessage("Site visit confirmed! Buyer has been notified via email.");
      setConfirmModalOpen(false);
    }
  }

  // Action: Reschedule Visit
  async function handleReschedule() {
    if (!rescheduleDate) {
      alert("Please select a new date.");
      return;
    }
    const newDateStr = `${rescheduleDate}T${rescheduleTime}:00`;
    const success = await updateVisit("Rescheduled", {
      VisitDate: newDateStr,
      OwnerResponse: rescheduleNote || undefined,
    });
    if (success) {
      setSuccessMessage("Site visit rescheduled! Buyer has been notified via email.");
      setRescheduleModalOpen(false);
      setRescheduleNote("");
      setRescheduleDate("");
    }
  }

  // Action: Cancel Visit
  async function handleCancel() {
    const success = await updateVisit("Cancelled", {
      ClosedReason: cancelReason,
      OwnerResponse: cancelNote || undefined,
    });
    if (success) {
      setSuccessMessage("Site visit cancelled. Buyer has been notified via email.");
      setCancelModalOpen(false);
      // Redirect to cancelled list after a short delay
      setTimeout(() => router.push("/owner/site-visits/cancelled"), 1500);
    }
  }

  // Action: Mark as Completed
  async function handleComplete() {
    const outcome = [completeOutcome ? `Outcome: ${completeOutcome}` : "", completeFeedback].filter(Boolean).join(". ");
    const success = await updateVisit("Completed", {
      OwnerResponse: outcome || undefined,
    });
    if (success) {
      setSuccessMessage("Site visit marked as completed! Buyer has been notified via email.");
      setCompleteModalOpen(false);
      // Redirect to completed list after a short delay
      setTimeout(() => router.push("/owner/site-visits/completed"), 1500);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />
        <main className="flex-1 p-10 flex items-center justify-center">
          <div className="inline-block w-10 h-10 border-4 border-[#064d3b] border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />
        <main className="flex-1 p-10 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-red-700">Error</h2>
          <p className="mt-2 text-gray-600">{error || "Visit not found"}</p>
          <Link href="/owner/site-visits/upcoming" className="mt-4 px-4 py-2 bg-[#064d3b] text-white rounded-xl">Go Back</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const status = getStatus(visit);
  const isPending = status.toLowerCase() === "pending" || status.toLowerCase() === "scheduled";
  const isConfirmed = status.toLowerCase() === "confirmed";

  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-700 text-white shadow-lg animate-bounce text-sm font-semibold">
            ✓ {successMessage}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-6">
          <Link href="/owner" className="hover:underline">Home</Link>
          <span>›</span>
          <Link href="/owner/site-visits/upcoming" className="hover:underline">Site Visits</Link>
          <span>›</span>
          <Link href="/owner/site-visits/upcoming" className="hover:underline">Upcoming</Link>
          <span>›</span>
          <span>Visit Details</span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#fef6e7] text-[#c99838] flex items-center justify-center font-black text-2xl border border-[#f5e4c3]">
              {(visit?.Name || visit?.name || "U")[0]}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#064d3b]">
                {visit?.Name || visit?.name || "Customer"}
              </h3>
              <p className="text-xs text-gray-500">
                ☎ {visit?.Phone || "N/A"} | ✉ {visit?.Email || "N/A"}
              </p>
            </div>
            <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              {status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              
              <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Visit Schedule</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block text-xs">Date</span>
                    <span className="font-bold">{formatVisitDateTime(getVisitDateStr(visit)).date}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs">Time</span>
                    <span className="font-bold">{formatVisitDateTime(getVisitDateStr(visit)).time}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block text-xs">Message</span>
                    <span className="font-bold">{visit?.Message || "None"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200 flex gap-4">
                {getPropertyImage(visit) && (
                  <img src={getPropertyImage(visit)} alt="Property" className="w-24 h-24 rounded-2xl object-cover border border-gray-200" />
                )}
                <div>
                  <h5 className="font-bold text-base text-[#064d3b]">{getPropertyName(visit)}</h5>
                  <p className="text-xs text-gray-600">📍 {[getPropertyArea(visit), getPropertyCity(visit)].filter(Boolean).join(", ")}</p>
                  <p className="text-sm font-extrabold text-[#c99838] pt-1">{getPropertyPrice(visit)}</p>
                </div>
              </div>

            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Actions</h4>
              
              {(isPending || isConfirmed) && (
                <button onClick={() => setRescheduleModalOpen(true)} className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 font-bold hover:bg-gray-200 block text-sm border border-gray-200 shadow-sm transition">
                  Reschedule
                </button>
              )}

              {isPending && (
                <button onClick={() => setConfirmModalOpen(true)} className="w-full px-4 py-3 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold hover:bg-[#c99838] block text-sm transition">
                  Confirm Visit
                </button>
              )}
              
              {isConfirmed && (
                <button onClick={() => setCompleteModalOpen(true)} className="w-full px-4 py-3 rounded-xl bg-[#064d3b] text-white font-bold hover:bg-[#053d30] block text-sm transition">
                  Mark as Completed
                </button>
              )}

              {(isPending || isConfirmed) && (
                <button onClick={() => setCancelModalOpen(true)} className="w-full px-4 py-3 rounded-xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 block text-sm transition">
                  Cancel Visit
                </button>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* Confirm Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Site Visit?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to confirm this visit?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModalOpen(false)} className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
              <button onClick={handleConfirm} className="flex-1 py-2 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold">Confirm Visit</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reschedule Visit</h3>
            <input type="date" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} className="w-full mb-3 p-2 border rounded-xl" />
            <input type="time" value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)} className="w-full mb-3 p-2 border rounded-xl" />
            <input type="text" value={rescheduleNote} onChange={e => setRescheduleNote(e.target.value)} placeholder="Note" className="w-full mb-6 p-2 border rounded-xl" />
            <div className="flex gap-3">
              <button onClick={() => setRescheduleModalOpen(false)} className="flex-1 py-2 rounded-xl bg-gray-100 font-bold text-gray-700">Cancel</button>
              <button onClick={handleReschedule} className="flex-1 py-2 rounded-xl bg-[#064d3b] text-white font-bold">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Site Visit?</h3>
            <select value={cancelReason} onChange={e => setCancelReason(e.target.value)} className="w-full mb-3 p-2 border rounded-xl">
              <option>Customer requested cancellation</option>
              <option>Owner unavailable</option>
              <option>Property unavailable</option>
              <option>Other</option>
            </select>
            <input type="text" value={cancelNote} onChange={e => setCancelNote(e.target.value)} placeholder="Additional Note" className="w-full mb-6 p-2 border rounded-xl" />
            <div className="flex gap-3">
              <button onClick={() => setCancelModalOpen(false)} className="flex-1 py-2 rounded-xl bg-gray-100 font-bold text-gray-700">Keep Visit</button>
              <button onClick={handleCancel} className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold">Cancel Visit</button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {completeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Visit</h3>
            <select value={completeOutcome} onChange={e => setCompleteOutcome(e.target.value)} className="w-full mb-3 p-2 border rounded-xl">
              <option>Interested</option>
              <option>Follow-up Required</option>
              <option>Not Interested</option>
            </select>
            <input type="text" value={completeFeedback} onChange={e => setCompleteFeedback(e.target.value)} placeholder="Feedback" className="w-full mb-6 p-2 border rounded-xl" />
            <div className="flex gap-3">
              <button onClick={() => setCompleteModalOpen(false)} className="flex-1 py-2 rounded-xl bg-gray-100 font-bold text-gray-700">Cancel</button>
              <button onClick={handleComplete} className="flex-1 py-2 rounded-xl bg-[#064d3b] text-white font-bold">Mark Completed</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
