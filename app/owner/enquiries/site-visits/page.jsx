"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../Footer";
import {
  getOwnerEnquiries,
  updateOwnerEnquiryStatus,
} from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function SiteVisitsPage() {
  const router = useRouter();

  // Primary state
  const [allEnquiries, setAllEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Search, Filters & Sort state
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [sortBy, setSortBy] = useState("Nearest Visit");

  // Detail Drawer / Modal state
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Sub-action Modals
  const [rescheduleModalVisit, setRescheduleModalVisit] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("11:00");
  const [rescheduleNote, setRescheduleNote] = useState("");

  const [completeModalVisit, setCompleteModalVisit] = useState(null);
  const [completeOutcome, setCompleteOutcome] = useState("Interested");
  const [completeFeedback, setCompleteFeedback] = useState("");

  const [cancelModalVisit, setCancelModalVisit] = useState(null);
  const [cancelReason, setCancelReason] = useState("Customer cancelled");
  const [cancelNote, setCancelNote] = useState("");

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleCustomerName, setScheduleCustomerName] = useState("");
  const [scheduleCustomerPhone, setScheduleCustomerPhone] = useState("");
  const [scheduleProperty, setScheduleProperty] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("11:00");
  const [scheduleNote, setScheduleNote] = useState("");

  // =====================================================
  // FETCH VISITS / ENQUIRIES FROM STRAPI
  // =====================================================
  async function loadVisits() {
    try {
      setLoading(true);
      setError("");

      console.log("=================================");
      console.log("SITE VISITS PAGE");
      console.log("Loading owner site visits from Strapi...");
      console.log("=================================");

      const data = await getOwnerEnquiries();
      console.log("STRAPI ENQUIRIES FOR SITE VISITS:", data);

      setAllEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("SITE VISITS PAGE ERROR:", err);
      setError(err?.message || "Unable to load site visits");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisits();
  }, []);

  // Toast message timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // =====================================================
  // HELPER FUNCTIONS FOR STRAPI DATA PARSING
  // =====================================================
  function getStatus(item) {
    return String(
      item?.Status || item?.status || item?.Statuss || "Pending"
    ).trim();
  }

  function isSiteVisitItem(item) {
    const s = getStatus(item).toLowerCase();
    return (
      s === "site visit" ||
      s === "site_visit" ||
      s === "site-visit" ||
      s === "site visit pending" ||
      s === "scheduled" ||
      s === "confirmed" ||
      s === "completed" ||
      s === "cancelled" ||
      s === "rescheduled"
    );
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

  // Format date helper
  function formatVisitDateTime(dateStr) {
    if (!dateStr) return { date: "Date TBA", time: "--:--" };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: String(dateStr), time: "--:--" };
    const dateFormatted = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
    const timeFormatted = d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: dateFormatted, time: timeFormatted };
  }

  // =====================================================
  // CALCULATED METRICS & CARDS
  // =====================================================
  const siteVisitsBucket = useMemo(() => {
    return allEnquiries.filter(isSiteVisitItem);
  }, [allEnquiries]);

  // Card 1: Today's Visits
  const countTodayVisits = useMemo(() => {
    const todayStr = new Date().toDateString();
    return siteVisitsBucket.filter((item) => {
      const d = getVisitDateStr(item);
      if (!d) return false;
      return new Date(d).toDateString() === todayStr;
    }).length;
  }, [siteVisitsBucket]);

  // Card 2: Upcoming Visits
  const countUpcomingVisits = useMemo(() => {
    return siteVisitsBucket.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return (
        s === "site visit" ||
        s === "site_visit" ||
        s === "site-visit" ||
        s === "scheduled" ||
        s === "confirmed" ||
        s === "rescheduled"
      );
    }).length;
  }, [siteVisitsBucket]);

  // Card 3: Completed Visits
  const countCompletedVisits = useMemo(() => {
    return siteVisitsBucket.filter((item) => {
      return getStatus(item).toLowerCase() === "completed";
    }).length;
  }, [siteVisitsBucket]);

  // Card 4: Cancelled Visits
  const countCancelledVisits = useMemo(() => {
    return siteVisitsBucket.filter((item) => {
      return getStatus(item).toLowerCase() === "cancelled";
    }).length;
  }, [siteVisitsBucket]);

  // Dynamic Property Options
  const propertyOptions = useMemo(() => {
    const names = siteVisitsBucket.map(getPropertyName).filter(Boolean);
    return ["All Properties", ...Array.from(new Set(names))];
  }, [siteVisitsBucket]);

  // Filter & Sort Logic
  const filteredAndSortedVisits = useMemo(() => {
    let result = [...siteVisitsBucket];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((item) => {
        const name = String(item?.Name || item?.name || "").toLowerCase();
        const phone = String(item?.Phone || item?.phone || "").toLowerCase();
        const email = String(item?.Email || item?.email || "").toLowerCase();
        const propTitle = getPropertyName(item).toLowerCase();
        const city = getPropertyCity(item).toLowerCase();

        return (
          name.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          propTitle.includes(q) ||
          city.includes(q)
        );
      });
    }

    // Property filter
    if (propertyFilter !== "All Properties") {
      result = result.filter((item) => getPropertyName(item) === propertyFilter);
    }

    // Status filter
    if (statusFilter !== "All Status") {
      result = result.filter((item) => {
        const s = getStatus(item).toLowerCase();
        return s === statusFilter.toLowerCase();
      });
    }

    // Date filter
    if (dateFilter !== "All Dates") {
      const now = new Date();
      result = result.filter((item) => {
        const visitDate = new Date(getVisitDateStr(item) || 0);
        if (dateFilter === "Today") {
          return visitDate.toDateString() === now.toDateString();
        }
        if (dateFilter === "Tomorrow") {
          const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          return visitDate.toDateString() === tomorrow.toDateString();
        }
        if (dateFilter === "This Week") {
          const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return visitDate >= now && visitDate <= sevenDays;
        }
        if (dateFilter === "This Month") {
          return visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(getVisitDateStr(a) || 0).getTime();
      const dateB = new Date(getVisitDateStr(b) || 0).getTime();

      if (sortBy === "Nearest Visit") {
        return dateA - dateB;
      }
      if (sortBy === "Latest First") {
        return dateB - dateA;
      }
      return dateA - dateB;
    });

    return result;
  }, [siteVisitsBucket, search, propertyFilter, statusFilter, dateFilter, sortBy]);

  // =====================================================
  // STRAPI API ACTION HANDLERS
  // =====================================================
  async function updateVisitStatusInStrapi(docId, newStatus, extraFields = {}) {
    if (!docId) return false;
    try {
      setActionLoadingId(docId);
      console.log(`Updating site visit ${docId} to: ${newStatus}`);

      await updateOwnerEnquiryStatus(docId, newStatus);

      // Local state update for instant responsive UI
      setAllEnquiries((prev) =>
        prev.map((item) => {
          const currentId = item?.documentId || item?.id;
          if (String(currentId) === String(docId)) {
            return {
              ...item,
              Status: newStatus,
              status: newStatus,
              Statuss: newStatus,
              ...extraFields,
            };
          }
          return item;
        })
      );

      return true;
    } catch (err) {
      console.error("SITE VISIT UPDATE ERROR:", err);
      alert(err?.message || "Failed to update site visit status.");
      return false;
    } finally {
      setActionLoadingId(null);
    }
  }

  // Action: Reschedule Visit
  async function handleRescheduleVisit() {
    if (!rescheduleModalVisit) return;
    const docId = rescheduleModalVisit?.documentId || rescheduleModalVisit?.id;

    const newDateStr = `${rescheduleDate} ${rescheduleTime}`;
    const success = await updateVisitStatusInStrapi(docId, "Rescheduled", {
      VisitDate: newDateStr,
      RescheduleNote: rescheduleNote,
    });

    if (success) {
      setSuccessMessage(`Site visit rescheduled for ${rescheduleDate} at ${rescheduleTime}`);
      setRescheduleModalVisit(null);
      setRescheduleNote("");
      if (selectedVisit && String(selectedVisit?.documentId || selectedVisit?.id) === String(docId)) {
        setSelectedVisit((prev) => ({
          ...prev,
          Status: "Rescheduled",
          VisitDate: newDateStr,
        }));
      }
    }
  }

  // Action: Mark as Completed
  async function handleMarkCompleted() {
    if (!completeModalVisit) return;
    const docId = completeModalVisit?.documentId || completeModalVisit?.id;

    const success = await updateVisitStatusInStrapi(docId, "Completed", {
      VisitOutcome: completeOutcome,
      VisitFeedback: completeFeedback,
    });

    if (success) {
      setSuccessMessage(`Site visit completed! Outcome: ${completeOutcome}`);
      setCompleteModalVisit(null);
      setCompleteFeedback("");
      if (selectedVisit && String(selectedVisit?.documentId || selectedVisit?.id) === String(docId)) {
        setSelectedVisit((prev) => ({
          ...prev,
          Status: "Completed",
          VisitOutcome: completeOutcome,
        }));
      }
    }
  }

  // Action: Cancel Visit
  async function handleCancelVisit() {
    if (!cancelModalVisit) return;
    const docId = cancelModalVisit?.documentId || cancelModalVisit?.id;

    const success = await updateVisitStatusInStrapi(docId, "Cancelled", {
      CancelReason: cancelReason,
      CancelNote: cancelNote,
    });

    if (success) {
      setSuccessMessage("Site visit cancelled.");
      setCancelModalVisit(null);
      setCancelNote("");
      if (selectedVisit && String(selectedVisit?.documentId || selectedVisit?.id) === String(docId)) {
        setSelectedVisit((prev) => ({ ...prev, Status: "Cancelled" }));
      }
    }
  }

  // =====================================================
  // RENDER LOADING STATE
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-1">
              <span>Enquiries</span>
              <span>›</span>
              <span>Site Visits</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">
              Site Visits
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage property visits scheduled with your customers.
            </p>

            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="inline-block w-10 h-10 border-4 border-[#064d3b] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#064d3b] font-semibold mt-4">
                Loading site visits...
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Fetching real-time property visits from Strapi.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =====================================================
  // RENDER ERROR STATE
  // =====================================================
  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-1">
              <span>Enquiries</span>
              <span>›</span>
              <span>Site Visits</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">
              Site Visits
            </h1>

            <div className="mt-8 bg-white rounded-2xl border border-red-200 p-10 text-center shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl font-bold mb-3">
                ⚠️
              </div>

              <h2 className="text-xl font-bold text-red-700">
                Unable to load site visits
              </h2>

              <p className="text-gray-600 mt-2 max-w-md mx-auto text-sm sm:text-base">
                Something went wrong while loading your scheduled visits. Please try again.
              </p>

              <p className="text-xs font-mono bg-red-50 text-red-800 p-2 rounded mt-3 max-w-lg mx-auto overflow-x-auto">
                {error}
              </p>

              <button
                type="button"
                onClick={loadVisits}
                className="mt-6 px-6 py-3 rounded-xl bg-[#064d3b] text-white font-semibold hover:bg-[#053d30] transition shadow"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =====================================================
  // MAIN SITE VISITS PAGE UI
  // =====================================================
  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* SUCCESS TOAST NOTIFICATION */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-700 text-white flex items-center justify-between shadow-lg animate-bounce">
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span className="font-semibold text-sm sm:text-base">
                  {successMessage}
                </span>
              </div>
              <button
                onClick={() => setSuccessMessage("")}
                className="text-white hover:text-gray-200 font-bold px-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <button onClick={() => router.push("/owner/enquiries")} className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#064d3b] transition">
                <span className="text-xl leading-none">←</span> Back to Enquiries
              </button>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-1">
                <Link href="/owner/enquiries" className="hover:underline">
                  Enquiries
                </Link>
                <span>›</span>
                <span>Site Visits</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">
                Site Visits
              </h1>

              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage property visits scheduled with your customers.
              </p>
            </div>

            {/* SCHEDULE SITE VISIT BUTTON */}
            <button
              type="button"
              onClick={() => setScheduleModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold text-sm hover:bg-[#c99838] transition shadow-md flex items-center gap-2 self-start sm:self-auto"
            >
              <span>+</span> Schedule Site Visit
            </button>
          </div>

          {/* 1. SUMMARY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8">

            {/* Card 1: Today's Visits */}
            <div className="bg-white rounded-2xl border-2 border-[#064d3b] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#e6f2ed] text-[#064d3b] flex items-center justify-center text-lg font-bold">
                  📅
                </div>
                <span className="text-[10px] font-bold text-[#064d3b] bg-[#e6f2ed] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Today
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Today's Visits
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#064d3b] mt-0.5">
                  {countTodayVisits}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Visits scheduled today
                </p>
              </div>
            </div>

            {/* Card 2: Upcoming */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-[#c99838] transition flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#fef6e7] text-[#c99838] flex items-center justify-center text-lg font-bold">
                  ⏰
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Upcoming
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countUpcomingVisits}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Upcoming site visits
                </p>
              </div>
            </div>

            {/* Card 3: Completed */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-emerald-300 transition flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">
                  ✅
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Completed
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countCompletedVisits}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Completed visits
                </p>
              </div>
            </div>

            {/* Card 4: Cancelled */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-red-300 transition flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg font-bold">
                  ✕
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Cancelled
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countCancelledVisits}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Cancelled visits
                </p>
              </div>
            </div>

          </div>

          {/* 2. SEARCH & FILTER SECTION */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 mb-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

              {/* Search */}
              <div className="relative lg:col-span-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by customer, phone, property..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#064d3b] focus:bg-white transition"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                  🔍
                </span>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Property filter */}
              <div>
                <select
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition cursor-pointer"
                >
                  {propertyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visit Status filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition cursor-pointer"
                >
                  <option value="All Status">All Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>

              {/* Sort dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition cursor-pointer font-medium"
                >
                  <option value="Nearest Visit">Nearest Visit</option>
                  <option value="Latest First">Latest First</option>
                </select>
              </div>

            </div>
          </div>

          {/* 3. RESULTS COUNTER */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#064d3b]">
                Scheduled Site Visits
              </h2>
              <span className="text-xs font-extrabold bg-[#064d3b] text-white px-2.5 py-0.5 rounded-full">
                {filteredAndSortedVisits.length}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-500">
              Total <span className="font-semibold text-gray-800">{filteredAndSortedVisits.length}</span> site visits
            </p>
          </div>

          {/* 4. SITE VISIT LIST CARDS */}
          <div className="space-y-4">
            {filteredAndSortedVisits.length === 0 ? (
              /* EMPTY STATE */
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#f2ead7] flex items-center justify-center text-3xl mb-4">
                  🚗
                </div>

                <h3 className="text-xl font-bold text-[#064d3b]">
                  No Site Visits Yet
                </h3>

                <p className="text-gray-500 text-sm sm:text-base mt-1 max-w-md mx-auto">
                  When a customer schedules a property visit, it will appear here.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/owner/enquiries/new"
                    className="px-5 py-2.5 rounded-xl bg-[#064d3b] text-white text-sm font-semibold hover:bg-[#053d30] transition shadow"
                  >
                    View Enquiries
                  </Link>

                  {(search || propertyFilter !== "All Properties" || statusFilter !== "All Status") && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setPropertyFilter("All Properties");
                        setStatusFilter("All Status");
                      }}
                      className="px-5 py-2.5 rounded-xl border border-[#c99838] text-[#064d3b] text-sm font-semibold hover:bg-[#faf4e5] transition"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* SITE VISIT CARDS */
              filteredAndSortedVisits.map((visit) => {
                const docId = visit?.documentId || visit?.id;
                const name = visit?.Name || visit?.name || "Unknown Customer";
                const phone = visit?.Phone || visit?.phone || "Not provided";
                const email = visit?.Email || visit?.email || "Not provided";
                const status = getStatus(visit);

                const propTitle = getPropertyName(visit);
                const propCity = getPropertyCity(visit);
                const propArea = getPropertyArea(visit);
                const propPrice = getPropertyPrice(visit);

                const visitDateStr = getVisitDateStr(visit);
                const { date: formattedDate, time: formattedTime } = formatVisitDateTime(visitDateStr);

                const initials = name
                  .split(" ")
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "U";

                const isDropdownOpen = activeDropdownId === docId;

                // Visual status badge styles
                let statusBadgeStyle = "bg-amber-100 text-amber-800 border-amber-200";
                if (status.toLowerCase() === "confirmed") {
                  statusBadgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200";
                } else if (status.toLowerCase() === "completed") {
                  statusBadgeStyle = "bg-blue-100 text-blue-800 border-blue-200";
                } else if (status.toLowerCase() === "cancelled") {
                  statusBadgeStyle = "bg-red-100 text-red-800 border-red-200";
                } else if (status.toLowerCase() === "rescheduled") {
                  statusBadgeStyle = "bg-purple-100 text-purple-800 border-purple-200";
                }

                return (
                  <div
                    key={docId}
                    className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[#c99838]/40 transition relative"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.9fr_auto] gap-5 items-center">

                      {/* CUSTOMER INFO */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#fef6e7] text-[#c99838] flex items-center justify-center font-black text-lg flex-shrink-0 border border-[#f5e4c3]">
                          {initials}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-base sm:text-lg text-[#064d3b]">
                              {name}
                            </h3>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <span>☎</span> {phone}
                          </p>
                        </div>
                      </div>

                      {/* PROPERTY INFO */}
                      <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-5">
                        <h4 className="font-bold text-sm sm:text-base text-[#064d3b] line-clamp-1">
                          {propTitle}
                        </h4>

                        <p className="text-xs text-gray-500 mt-0.5">
                          📍 {[propArea, propCity].filter(Boolean).join(", ") || "Location specified"}
                        </p>

                        {propPrice && (
                          <p className="text-xs sm:text-sm font-bold text-[#c99838] mt-1">
                            {propPrice}
                          </p>
                        )}
                      </div>

                      {/* VISIT DATE & STATUS */}
                      <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📅</span>
                          <span className="text-xs sm:text-sm font-bold text-gray-800">
                            {formattedDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">🕒 {formattedTime}</span>
                        </div>

                        <div className="mt-2">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${statusBadgeStyle}`}>
                            {status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex sm:flex-row lg:flex-col gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 lg:min-w-[140px] relative">
                        <button
                          type="button"
                          onClick={() => setSelectedVisit(visit)}
                          className="flex-1 lg:w-full px-4 py-2.5 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold text-xs sm:text-sm hover:bg-[#c99838] transition shadow-sm"
                        >
                          View Details
                        </button>

                        {/* More Menu */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveDropdownId(isDropdownOpen ? null : docId)
                            }
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition flex items-center justify-center gap-1"
                          >
                            <span>More</span>
                            <span>⋮</span>
                          </button>

                          {/* Dropdown Menu Popup */}
                          {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl border border-gray-200 shadow-xl z-30 py-2 text-xs font-semibold text-gray-700 animate-in fade-in zoom-in duration-100">
                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setSelectedVisit(visit);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-[#faf8f5] hover:text-[#064d3b] transition"
                              >
                                👁️ View Details
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setRescheduleModalVisit(visit);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-[#faf8f5] hover:text-[#064d3b] transition"
                              >
                                📅 Reschedule Visit
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setCompleteModalVisit(visit);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-700 transition"
                              >
                                ✅ Mark as Completed
                              </button>

                              <hr className="my-1 border-gray-100" />

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setCancelModalVisit(visit);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition"
                              >
                                ✕ Cancel Visit
                              </button>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>

      {/* =====================================================
          SITE VISIT DETAILS MODAL / DRAWER
      ===================================================== */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedVisit(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-base transition"
            >
              ✕
            </button>

            {/* Header Banner */}
            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#fef6e7] text-[#c99838] flex items-center justify-center font-black text-2xl border border-[#f5e4c3]">
                {(selectedVisit?.Name || "U")[0]}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#064d3b]">
                  {selectedVisit?.Name || selectedVisit?.name || "Customer Visit"}
                </h3>
                <p className="text-xs text-gray-500">
                  ☎ {selectedVisit?.Phone} | ✉ {selectedVisit?.Email}
                </p>
              </div>

              <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                {getStatus(selectedVisit)}
              </span>
            </div>

            {/* Grid Layout: Left Details, Right Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-5 text-sm">

                {/* Visit Schedule Box */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Visit Schedule Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-400 block text-xs">Visit Date & Time</span>
                      <span className="font-bold text-gray-800">
                        {formatVisitDateTime(getVisitDateStr(selectedVisit)).date} at {formatVisitDateTime(getVisitDateStr(selectedVisit)).time}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-xs">Status</span>
                      <span className="font-bold text-[#064d3b]">
                        {getStatus(selectedVisit)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Details Box */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Customer Details
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-400 block text-xs">Preferred Location</span>
                      <span className="font-bold text-gray-800">
                        {getPropertyCity(selectedVisit) || "Pune"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-xs">Purpose</span>
                      <span className="font-bold text-gray-800">
                        {getPropertyPurpose(selectedVisit)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-xs">Property Type</span>
                      <span className="font-bold text-gray-800">
                        {getPropertyType(selectedVisit)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enquired Property Box */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Target Property
                  </h4>

                  <div className="flex gap-4 items-start">
                    {getPropertyImage(selectedVisit) && (
                      <img
                        src={getPropertyImage(selectedVisit)}
                        alt="Property"
                        className="w-24 h-24 rounded-2xl object-cover border border-gray-200 shrink-0"
                      />
                    )}

                    <div className="space-y-1">
                      <h5 className="font-bold text-base text-[#064d3b]">
                        {getPropertyName(selectedVisit)}
                      </h5>

                      <p className="text-xs text-gray-600">
                        📍 {[getPropertyArea(selectedVisit), getPropertyCity(selectedVisit)].filter(Boolean).join(", ")}
                      </p>

                      {getPropertyPrice(selectedVisit) && (
                        <p className="text-sm font-extrabold text-[#c99838] pt-1">
                          {getPropertyPrice(selectedVisit)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedVisit?.Message && (
                  <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Customer Note / Request
                    </h4>
                    <p className="text-gray-700 bg-white p-3 rounded-xl border border-gray-100 italic">
                      "{selectedVisit.Message}"
                    </p>
                  </div>
                )}

              </div>

              {/* Right Column: Actions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Quick Actions
                </h4>

                {selectedVisit?.Phone && (
                  <a
                    href={`tel:${selectedVisit.Phone}`}
                    className="w-full text-center px-4 py-3 rounded-xl bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 transition block shadow-sm"
                  >
                    📞 Call Customer
                  </a>
                )}

                {selectedVisit?.Email && (
                  <a
                    href={`mailto:${selectedVisit.Email}`}
                    className="w-full text-center px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 font-bold text-sm hover:bg-gray-50 transition block shadow-xs"
                  >
                    ✉ Send Message
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setRescheduleModalVisit(selectedVisit)}
                  className="w-full px-4 py-3 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold text-sm hover:bg-[#c99838] transition block shadow-xs"
                >
                  📅 Reschedule Visit
                </button>

                <button
                  type="button"
                  onClick={() => setCompleteModalVisit(selectedVisit)}
                  className="w-full px-4 py-3 rounded-xl bg-[#064d3b] text-white font-bold text-sm hover:bg-[#053d30] transition block"
                >
                  ✅ Mark as Completed
                </button>

                <button
                  type="button"
                  onClick={() => setCancelModalVisit(selectedVisit)}
                  className="w-full px-4 py-3 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition block"
                >
                  ✕ Cancel Visit
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          SCHEDULE NEW SITE VISIT MODAL
      ===================================================== */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <h3 className="text-xl font-bold text-[#064d3b]">
              Schedule Site Visit
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Set up a new site visit with customer
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={scheduleCustomerName}
                  onChange={(e) => setScheduleCustomerName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Customer Phone
                </label>
                <input
                  type="text"
                  value={scheduleCustomerPhone}
                  onChange={(e) => setScheduleCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Visit Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Visit Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={scheduleNote}
                  onChange={(e) => setScheduleNote(e.target.value)}
                  placeholder="Customer wants to visit with family..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSuccessMessage(`Site Visit scheduled for ${scheduleCustomerName || "Customer"}`);
                    setScheduleModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold hover:bg-[#c99838]"
                >
                  Schedule Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          RESCHEDULE VISIT MODAL
      ===================================================== */}
      {rescheduleModalVisit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <h3 className="text-xl font-bold text-[#064d3b]">
              Reschedule Site Visit
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Select a new date and time for {rescheduleModalVisit?.Name}
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reason / Note
                </label>
                <input
                  type="text"
                  value={rescheduleNote}
                  onChange={(e) => setRescheduleNote(e.target.value)}
                  placeholder="Customer requested weekend slot..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setRescheduleModalVisit(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRescheduleVisit}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold hover:bg-[#c99838]"
                >
                  Reschedule Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MARK AS COMPLETED MODAL
      ===================================================== */}
      {completeModalVisit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <h3 className="text-xl font-bold text-[#064d3b]">
              Complete Site Visit
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Mark visit for {completeModalVisit?.Name} as completed
            </p>

            <div className="mt-4 space-y-4 text-sm text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  How did the visit go? (Outcome)
                </label>
                <div className="space-y-2 text-xs font-semibold text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="completeOutcome"
                      value="Interested"
                      checked={completeOutcome === "Interested"}
                      onChange={(e) => setCompleteOutcome(e.target.value)}
                      className="accent-[#064d3b]"
                    />
                    <span>⭐ Interested</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="completeOutcome"
                      value="Follow-up Required"
                      checked={completeOutcome === "Follow-up Required"}
                      onChange={(e) => setCompleteOutcome(e.target.value)}
                      className="accent-[#064d3b]"
                    />
                    <span>⏰ Follow-up Required</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="completeOutcome"
                      value="Not Interested"
                      checked={completeOutcome === "Not Interested"}
                      onChange={(e) => setCompleteOutcome(e.target.value)}
                      className="accent-red-600"
                    />
                    <span>🚫 Not Interested</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Feedback (Optional)
                </label>
                <textarea
                  rows={2}
                  value={completeFeedback}
                  onChange={(e) => setCompleteFeedback(e.target.value)}
                  placeholder="Customer liked the property and wants to discuss final price..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCompleteModalVisit(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMarkCompleted}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#064d3b] text-white font-bold hover:bg-[#053d30]"
                >
                  Complete Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CANCEL VISIT MODAL
      ===================================================== */}
      {cancelModalVisit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto mb-3">
              ✕
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Cancel Site Visit?
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Please provide a reason for cancelling this visit.
            </p>

            <div className="mt-4 space-y-3 text-left text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reason
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-red-500"
                >
                  <option value="Customer cancelled">Customer cancelled</option>
                  <option value="Owner unavailable">Owner unavailable</option>
                  <option value="Property unavailable">Property unavailable</option>
                  <option value="Customer requested reschedule">Customer requested reschedule</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  placeholder="Additional context..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCancelModalVisit(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Keep Visit
                </button>

                <button
                  type="button"
                  onClick={handleCancelVisit}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700"
                >
                  Cancel Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
