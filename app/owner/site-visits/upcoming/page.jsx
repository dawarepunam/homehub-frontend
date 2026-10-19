"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../Footer";
import {
  ArrowLeft,
  CalendarCheck,
  Search,
  Tag,
  MapPin,
  ArrowUpDown,
  ChevronDown,
  X,
  Calendar,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  Filter,
  Eye,
  MoreVertical,
  Plus,
  History,
} from "lucide-react";
import {
  getOwnerEnquiries,
  updateOwnerEnquiryFields,
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
  const [errorMessage, setErrorMessage] = useState("");

  // History modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("All Status");
  const [historyPropertyFilter, setHistoryPropertyFilter] = useState("All Properties");

  // Search, Filters & Sort state
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [sortBy, setSortBy] = useState("Nearest Visit");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null); // 'YYYY-MM-DD' filter

  // Detail Drawer / Modal state
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

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

      const data = await getOwnerEnquiries();
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

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Lock background body scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      selectedVisit ||
      rescheduleModalVisit ||
      completeModalVisit ||
      cancelModalVisit ||
      scheduleModalOpen ||
      historyModalOpen
    );

    if (isAnyModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [
    selectedVisit,
    rescheduleModalVisit,
    completeModalVisit,
    cancelModalVisit,
    scheduleModalOpen,
    historyModalOpen,
  ]);

  // Close More dropdown when clicking outside (do NOT intercept clicks inside the dropdown menu)
  useEffect(() => {
    if (!activeDropdownId) return;
    function handleClickOutside(e) {
      if (e.target && e.target.closest && e.target.closest("[data-more-dropdown]")) {
        return;
      }
      setActiveDropdownId(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdownId]);

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
      s === "pending" ||
      s === "new" ||
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

  // Card 1: Today's Visits count
  const countTodayVisits = useMemo(() => {
    const todayStr = new Date().toDateString();
    return siteVisitsBucket.filter((item) => {
      const dStr = getVisitDateStr(item);
      return dStr && new Date(dStr).toDateString() === todayStr;
    }).length;
  }, [siteVisitsBucket]);

  // Card 2: Upcoming Visits count (matches all scheduled, confirmed, rescheduled, and pending site visits)
  const countUpcomingVisits = useMemo(() => {
    return siteVisitsBucket.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return (
        s === "site visit" ||
        s === "site_visit" ||
        s === "site-visit" ||
        s === "site visit pending" ||
        s === "pending" ||
        s === "new" ||
        s === "scheduled" ||
        s === "confirmed" ||
        s === "rescheduled"
      );
    }).length;
  }, [siteVisitsBucket]);

  // Card 3: Completed Visits count
  const countCompletedVisits = useMemo(() => {
    return siteVisitsBucket.filter((item) => {
      return getStatus(item).toLowerCase() === "completed";
    }).length;
  }, [siteVisitsBucket]);

  // Card 4: Cancelled Visits count
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

  // History property options
  const historyPropertyOptions = useMemo(() => {
    const titles = allEnquiries.map(getPropertyName).filter(Boolean);
    return ["All Properties", ...Array.from(new Set(titles))];
  }, [allEnquiries]);

  // History status options
  const historyStatusOptions = [
    "All Status",
    "Pending",
    "Contacted",
    "Interested",
    "Follow-up Required",
    "Site Visit Pending",
    "Scheduled",
    "Confirmed",
    "Completed",
    "Cancelled",
    "Converted",
    "Not Interested",
    "Closed",
  ];

  // History filtered list (all enquiries across New, Contacted, Site Visits, Closed)
  const filteredHistoryEnquiries = useMemo(() => {
    let result = [...allEnquiries];

    if (historySearch.trim()) {
      const q = historySearch.toLowerCase().trim();
      result = result.filter((item) => {
        const name = String(item?.Name || item?.name || "").toLowerCase();
        const phone = String(item?.Phone || item?.phone || "").toLowerCase();
        const email = String(item?.Email || item?.email || "").toLowerCase();
        const propTitle = getPropertyName(item).toLowerCase();
        const city = getPropertyCity(item).toLowerCase();
        const msg = String(item?.Message || item?.message || "").toLowerCase();
        const status = getStatus(item).toLowerCase();

        return (
          name.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          propTitle.includes(q) ||
          city.includes(q) ||
          msg.includes(q) ||
          status.includes(q)
        );
      });
    }

    if (historyPropertyFilter !== "All Properties") {
      result = result.filter(
        (item) => getPropertyName(item) === historyPropertyFilter
      );
    }

    if (historyStatusFilter !== "All Status") {
      result = result.filter(
        (item) => getStatus(item).toLowerCase() === historyStatusFilter.toLowerCase()
      );
    }

    // Sort newest first
    result.sort((a, b) => {
      const timeA = new Date(a?.createdAt || a?.created_at || 0).getTime();
      const timeB = new Date(b?.createdAt || b?.created_at || 0).getTime();
      return timeB - timeA;
    });

    return result;
  }, [allEnquiries, historySearch, historyPropertyFilter, historyStatusFilter]);

  // Filter & Sort Logic
  const filteredAndSortedVisits = useMemo(() => {
    let result = [...siteVisitsBucket];

    // Calendar Specific Date filter (if selected by clicking calendar)
    if (selectedCalendarDate) {
      result = result.filter((item) => {
        const dStr = getVisitDateStr(item);
        if (!dStr) return false;
        const d = new Date(dStr);
        if (isNaN(d.getTime())) return false;
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        return key === selectedCalendarDate;
      });
    }

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
    } else {
      result = result.filter((item) => {
        const s = getStatus(item).toLowerCase();
        return s !== "completed" && s !== "cancelled";
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
  }, [siteVisitsBucket, search, propertyFilter, statusFilter, dateFilter, sortBy, selectedCalendarDate]);

  // =====================================================
  // STRAPI API ACTION HANDLERS
  // =====================================================

  async function updateVisitStatusInStrapi(docId, newStatus, extraFields = {}) {
    if (!docId) return false;
    try {
      setActionLoadingId(docId);

      let mappedStatus = newStatus;
      if (newStatus === "Confirmed") mappedStatus = " Confirmed";
      if (newStatus === "Cancelled") mappedStatus = "Cancelled ";

      await updateOwnerEnquiryFields(docId, {
        Statuss: mappedStatus,
        ...extraFields,
      });

      // Immediate optimistic update for zero delay in UI response
      setAllEnquiries((prev) =>
        prev.map((item) => {
          const currentId = item?.documentId || item?.id;
          if (String(currentId) === String(docId)) {
            return {
              ...item,
              Status: newStatus,
              status: newStatus,
              Statuss: mappedStatus,
              ...extraFields,
            };
          }
          return item;
        })
      );

      setSelectedVisit((prev) => {
        if (!prev) return prev;
        const prevId = prev?.documentId || prev?.id;
        if (String(prevId) !== String(docId)) return prev;
        return {
          ...prev,
          Status: newStatus,
          status: newStatus,
          Statuss: mappedStatus,
          ...extraFields,
        };
      });

      // Background re-fetch to keep all relations, counts and Strapi backend 100% in sync
      getOwnerEnquiries()
        .then((fresh) => {
          if (Array.isArray(fresh)) setAllEnquiries(fresh);
        })
        .catch((e) => console.warn("Background refresh error:", e));

      return true;
    } catch (err) {
      console.error("SITE VISIT UPDATE ERROR:", err);
      setErrorMessage(err?.message || "Failed to update site visit. Please try again.");
      return false;
    } finally {
      setActionLoadingId(null);
    }
  }

  // Action: Confirm Visit
  async function handleConfirmVisit(visit) {
    if (!visit) return;
    const docId = visit?.documentId || visit?.id;
    const success = await updateVisitStatusInStrapi(docId, "Confirmed", {});
    if (success) {
      setSuccessMessage("Site visit confirmed! Customer has been notified.");
      setActiveDropdownId(null);
    }
  }

  // Action: Reschedule Visit
  async function handleRescheduleVisit() {
    if (!rescheduleModalVisit) return;
    if (!rescheduleDate) {
      setErrorMessage("Please select a new date for the visit.");
      return;
    }
    const docId = rescheduleModalVisit?.documentId || rescheduleModalVisit?.id;
    const newDateStr = `${rescheduleDate}T${rescheduleTime}:00`;

    const success = await updateVisitStatusInStrapi(docId, "Rescheduled", {
      VisitDate: newDateStr,
      OwnerResponse: rescheduleNote || undefined,
    });

    if (success) {
      setSuccessMessage(`Site visit rescheduled for ${rescheduleDate} at ${rescheduleTime}.`);
      setRescheduleModalVisit(null);
      setRescheduleNote("");
      setRescheduleDate("");
      setActiveDropdownId(null);
    }
  }

  // Action: Mark as Completed
  async function handleMarkCompleted() {
    if (!completeModalVisit) return;
    const docId = completeModalVisit?.documentId || completeModalVisit?.id;

    const success = await updateVisitStatusInStrapi(docId, "Completed", {
      OwnerResponse: [completeOutcome ? `Outcome: ${completeOutcome}` : "", completeFeedback].filter(Boolean).join(". ") || undefined,
    });

    if (success) {
      setSuccessMessage(`Site visit marked as completed.`);
      setCompleteModalVisit(null);
      setCompleteFeedback("");
      setActiveDropdownId(null);
      if (selectedVisit && (selectedVisit.documentId === docId || selectedVisit.id === docId)) {
        setSelectedVisit(null);
      }
    }
  }

  // Action: Cancel Visit
  async function handleCancelVisit() {
    if (!cancelModalVisit) return;
    const docId = cancelModalVisit?.documentId || cancelModalVisit?.id;

    const success = await updateVisitStatusInStrapi(docId, "Cancelled", {
      ClosedReason: cancelReason,
      OwnerResponse: cancelNote || undefined,
    });

    if (success) {
      setSuccessMessage("Site visit cancelled.");
      setCancelModalVisit(null);
      setCancelNote("");
      setActiveDropdownId(null);
      if (selectedVisit && (selectedVisit.documentId === docId || selectedVisit.id === docId)) {
        setSelectedVisit(null);
      }
    }
  }

  // Quick summary counts
  const confirmedCount = useMemo(() => {
    return filteredAndSortedVisits.filter(v => getStatus(v).toLowerCase() === 'confirmed').length;
  }, [filteredAndSortedVisits]);

  const pendingConfCount = useMemo(() => {
    return filteredAndSortedVisits.filter(v => ['pending', 'scheduled', 'site visit', 'site_visit'].includes(getStatus(v).toLowerCase())).length;
  }, [filteredAndSortedVisits]);

  const todayFilteredCount = useMemo(() => {
    const todayStr = new Date().toDateString();
    return filteredAndSortedVisits.filter(v => {
      const dStr = getVisitDateStr(v);
      return dStr && new Date(dStr).toDateString() === todayStr;
    }).length;
  }, [filteredAndSortedVisits]);

  // =====================================================
  // RENDER LOADING STATE
  // =====================================================
  if (loading) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
          <div className="mb-6">
            <Link
              href="/owner"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>
          </div>

          <header className="mx-auto mb-8 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3.5 py-1 text-[11px] font-semibold text-[var(--seller-text-muted)] shadow-xs">
              <CalendarCheck size={12} strokeWidth={2} />
              <span>Seller Portal</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
              Site Visits
            </h1>
            <p className="mt-2.5 text-sm text-[var(--seller-text-muted)] sm:text-base sm:leading-relaxed">
              Manage property visits scheduled with your customers.
            </p>
          </header>

          <div className="seller-card p-12 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[var(--seller-primary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[var(--seller-text)] font-semibold mt-4 text-sm">Loading site visits...</p>
            <p className="text-[var(--seller-text-muted)] text-xs mt-1">Fetching real-time property visits from Strapi.</p>
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
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
          <div className="mb-6">
            <Link
              href="/owner"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>
          </div>

          <header className="mx-auto mb-8 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3.5 py-1 text-[11px] font-semibold text-[var(--seller-text-muted)] shadow-xs">
              <CalendarCheck size={12} strokeWidth={2} />
              <span>Seller Portal</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
              Site Visits
            </h1>
          </header>

          <div className="seller-card p-10 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-xl font-bold mb-3">⚠️</div>
            <h2 className="text-lg font-bold text-[var(--seller-text)]">Unable to load site visits</h2>
            <p className="text-[var(--seller-text-muted)] mt-2 max-w-md mx-auto text-xs sm:text-sm">
              Something went wrong while loading your scheduled visits. Please try again.
            </p>
            <p className="text-xs font-mono bg-[var(--seller-bg)] border border-[var(--seller-border)] text-red-500 p-2.5 rounded-xl mt-3 max-w-lg mx-auto overflow-x-auto">{error}</p>
            <button
              type="button"
              onClick={loadVisits}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-semibold text-xs hover:opacity-90 transition shadow-xs"
            >
              Try Again
            </button>
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
    <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
      <Header />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">

        {/* SUCCESS TOAST NOTIFICATION */}
        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-[var(--seller-border-focus)] bg-[var(--seller-surface)] p-3.5 shadow-sm text-xs font-semibold text-[var(--seller-text)] animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--seller-primary)] text-[var(--seller-bg)] text-[10px] font-black">✓</span>
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* ERROR TOAST NOTIFICATION */}
        {errorMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 shadow-sm text-xs font-semibold text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-black">!</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-300 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Navigation Row: Back Link & Schedule Action */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/owner"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>

          <button
            type="button"
            onClick={() => setScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--seller-primary)] px-4 py-2 text-xs font-bold text-[var(--seller-bg)] shadow-xs transition hover:opacity-90"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Schedule Visit</span>
          </button>
        </div>

        {/* CENTERED PAGE HEADING */}
        <header className="mx-auto mb-8 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3.5 py-1 text-[11px] font-semibold text-[var(--seller-text-muted)] shadow-xs">
            <CalendarCheck size={12} strokeWidth={2} />
            <span>Seller Portal</span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
            Site Visits
          </h1>

          <p className="mt-2.5 text-sm text-[var(--seller-text-muted)] sm:text-base sm:leading-relaxed">
            Manage property visits scheduled with your customers.
          </p>
        </header>

        {/* Tab switcher: Upcoming, Completed, Cancelled */}
        <div className="mb-6 flex justify-center overflow-x-auto pb-1">
          <div className="inline-flex rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-1 shadow-xs">
            {[
              { label: `Upcoming (${countUpcomingVisits})`, href: "/owner/site-visits/upcoming", active: true },
              { label: `Completed (${countCompletedVisits})`, href: "/owner/site-visits/completed", active: false },
              { label: `Cancelled (${countCancelledVisits})`, href: "/owner/site-visits/cancelled", active: false },
            ].map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  tab.active
                    ? "bg-[var(--seller-primary)] text-[var(--seller-bg)] shadow-xs"
                    : "text-[var(--seller-text-muted)] hover:text-[var(--seller-text)]"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Sub-filter chips */}
        <div className="mb-6 flex justify-center overflow-x-auto pb-1">
          <div className="inline-flex gap-2">
            {[
              { id: "all", label: `All Upcoming (${countUpcomingVisits})` },
              { id: "today", label: `Today's Visits (${countTodayVisits})` },
            ].map((chip) => {
              const isActive = (chip.id === "all" && dateFilter !== "Today" && !selectedCalendarDate) ||
                               (chip.id === "today" && dateFilter === "Today");
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setSelectedCalendarDate(null);
                    if (chip.id === "today") {
                      setDateFilter("Today");
                    } else {
                      setDateFilter("All Dates");
                    }
                  }}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition border ${
                    isActive
                      ? "bg-[var(--seller-primary)] text-[var(--seller-bg)] border-[var(--seller-primary)]"
                      : "bg-[var(--seller-surface)] text-[var(--seller-text-muted)] border-[var(--seller-border)] hover:border-[var(--seller-border-focus)] hover:text-[var(--seller-text)]"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. REFINED TOOLBAR (Matching Contacted/Closed Design System) */}
        <section className="mb-6 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-3 sm:p-4 shadow-[var(--seller-shadow)]">
          <div className="flex flex-1 flex-wrap items-center justify-between gap-2.5">

            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:min-w-[240px]">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer name, phone, property..."
                className="h-10 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-9 pr-8 text-xs font-medium text-[var(--seller-text)] outline-none transition placeholder:text-[var(--seller-text-subtle)] focus:border-[var(--seller-border-focus)]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--seller-text-subtle)] hover:text-[var(--seller-text)]"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* History button beside search bar */}
            <button
              type="button"
              onClick={() => setHistoryModalOpen(true)}
              className="h-10 inline-flex items-center gap-1.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3.5 text-xs font-semibold text-[var(--seller-text)] hover:border-[var(--seller-border-focus)] hover:bg-[var(--seller-surface-hover,var(--seller-surface))] transition shadow-2xs whitespace-nowrap"
              title="View All Enquiry History"
            >
              <History size={14} className="text-[var(--seller-text-muted)]" />
              <span>History</span>
              <span className="ml-1 rounded-full bg-[var(--seller-border)] px-1.5 py-0.2 text-[10px] font-bold text-[var(--seller-text-muted)]">
                {allEnquiries.length}
              </span>
            </button>

            {/* Property Filter */}
            <div className="relative w-auto min-w-[150px]">
              <Tag
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
              <select
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
              >
                {propertyOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-auto min-w-[130px]">
              <Filter
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
            </div>

            {/* Date Quick Filter */}
            <div className="relative w-auto min-w-[120px]">
              <Calendar
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
              <select
                value={dateFilter}
                onChange={(e) => {
                  setSelectedCalendarDate(null);
                  setDateFilter(e.target.value);
                }}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
              >
                <option value="All Dates">All Dates</option>
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-auto min-w-[130px]">
              <ArrowUpDown
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
              >
                <option value="Nearest Visit">Nearest Visit</option>
                <option value="Latest First">Latest First</option>
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
            </div>

          </div>

          {/* Active Calendar Date Chip */}
          {selectedCalendarDate && (
            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-[var(--seller-border)]">
              <span className="text-xs text-[var(--seller-text-muted)] font-medium">Filtering by date:</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 py-0.5 text-xs font-semibold text-[var(--seller-text)]">
                📅 {selectedCalendarDate}
                <button
                  onClick={() => setSelectedCalendarDate(null)}
                  className="hover:text-red-500 font-bold ml-1"
                >
                  ✕
                </button>
              </span>
            </div>
          )}
        </section>

        {/* 3. MAIN CONTENT: LIST & SIDEBAR */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

          {/* LEFT: SITE VISIT LIST */}
          <div>
            {/* Results Counter Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[var(--seller-text)]">
                  Scheduled Site Visits
                </h2>
                <span className="rounded-full bg-[var(--seller-primary)] px-2 py-0.5 text-[10px] font-bold text-[var(--seller-bg)]">
                  {filteredAndSortedVisits.length}
                </span>
              </div>

              <p className="text-xs text-[var(--seller-text-muted)]">
                Showing <span className="font-semibold text-[var(--seller-text)]">{filteredAndSortedVisits.length}</span> visits
              </p>
            </div>

            {/* Visit Cards Stack */}
            <div className="space-y-3.5">
              {filteredAndSortedVisits.length === 0 ? (
                /* EMPTY STATE */
                <div className="seller-card p-12 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[var(--seller-bg)] text-[var(--seller-text-muted)] border border-[var(--seller-border)] flex items-center justify-center text-xl mb-3">
                    🚗
                  </div>

                  <h3 className="text-base font-bold text-[var(--seller-text)]">
                    No Site Visits Found
                  </h3>

                  <p className="text-xs text-[var(--seller-text-muted)] mt-1 max-w-sm mx-auto">
                    {search || propertyFilter !== "All Properties" || statusFilter !== "All Status" || dateFilter !== "All Dates" || selectedCalendarDate
                      ? "No visits match your current search or filter criteria."
                      : "When a customer requests a site visit, it will appear here."}
                  </p>

                  <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                    {(search || propertyFilter !== "All Properties" || statusFilter !== "All Status" || dateFilter !== "All Dates" || selectedCalendarDate) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setPropertyFilter("All Properties");
                          setStatusFilter("All Status");
                          setDateFilter("All Dates");
                          setSelectedCalendarDate(null);
                        }}
                        className="px-4 py-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] text-xs font-semibold hover:border-[var(--seller-border-focus)] transition"
                      >
                        Reset All Filters
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setScheduleModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] text-xs font-bold hover:opacity-90 transition shadow-2xs"
                    >
                      + Schedule New Visit
                    </button>
                  </div>
                </div>
              ) : (
                /* CARDS */
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

                  return (
                    <div
                      key={docId}
                      className="seller-card p-4 sm:p-5 relative transition"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.9fr_auto] gap-4 sm:gap-5 items-center">

                        {/* 1. CUSTOMER INFO */}
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center font-bold text-sm shrink-0 border border-[var(--seller-border)]">
                            {initials}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-sm sm:text-base text-[var(--seller-text)] truncate">
                                {name}
                              </h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--seller-border)] bg-[var(--seller-bg)] text-[var(--seller-text-muted)] uppercase tracking-wider">
                                {status}
                              </span>
                            </div>

                            <p className="text-xs text-[var(--seller-text-muted)] mt-1 truncate">
                              ☎ {phone}
                            </p>
                          </div>
                        </div>

                        {/* 2. PROPERTY DETAILS */}
                        <div className="border-t lg:border-t-0 lg:border-l border-[var(--seller-border)] pt-3 lg:pt-0 lg:pl-5">
                          <p className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider">
                            Property
                          </p>

                          <h4 className="font-bold text-xs sm:text-sm text-[var(--seller-text)] mt-0.5 line-clamp-1">
                            {propTitle}
                          </h4>

                          <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                            📍 {[propArea, propCity].filter(Boolean).join(", ") || "Location specified"}
                          </p>

                          {propPrice && (
                            <p className="text-xs font-extrabold text-[var(--seller-text)] mt-0.5">
                              {propPrice}
                            </p>
                          )}
                        </div>

                        {/* 3. VISIT DATE & TIME */}
                        <div className="border-t lg:border-t-0 lg:border-l border-[var(--seller-border)] pt-3 lg:pt-0 lg:pl-5">
                          <p className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider">
                            Scheduled Date
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-bold text-[var(--seller-text)]">
                              {formattedDate}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                            🕒 {formattedTime}
                          </p>
                        </div>

                        {/* 4. ACTIONS */}
                        <div className="flex sm:flex-row lg:flex-col gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--seller-border)] lg:min-w-[130px] relative">
                          <button
                            type="button"
                            onClick={() => setSelectedVisit(visit)}
                            className="flex-1 lg:w-full px-3.5 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition shadow-2xs text-center"
                          >
                            View Details
                          </button>

                          <button
                            type="button"
                            disabled={actionLoadingId === docId}
                            onClick={() => setCompleteModalVisit(visit)}
                            className="flex-1 lg:w-full px-3 py-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            {actionLoadingId === docId ? (
                              <span className="w-3 h-3 border-2 border-[var(--seller-text)] border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <span>✓ Complete</span>
                            )}
                          </button>

                          {/* More dropdown trigger */}
                          <div className="relative" data-more-dropdown>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveDropdownId(isDropdownOpen ? null : docId)
                              }
                              className="px-3 py-1.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] font-medium text-xs hover:border-[var(--seller-border-focus)] transition flex items-center justify-center gap-1 w-full"
                            >
                              <span>More</span>
                              <ChevronDown size={12} />
                            </button>

                            {/* Dropdown Menu Popup */}
                            {isDropdownOpen && (
                              <div className="absolute right-0 bottom-full lg:bottom-auto lg:top-full mb-1 lg:mb-0 lg:mt-1 w-52 bg-[var(--seller-surface)] rounded-2xl shadow-xl border border-[var(--seller-border)] py-1.5 z-20 text-xs font-semibold text-[var(--seller-text)] animate-in fade-in duration-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    setSelectedVisit(visit);
                                  }}
                                  className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition"
                                >
                                  👁️ View Details
                                </button>

                                {status.toLowerCase() !== "completed" && status.toLowerCase() !== "cancelled" && (
                                  <>
                                    {status.toLowerCase() !== "confirmed" && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveDropdownId(null);
                                          handleConfirmVisit(visit);
                                        }}
                                        className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition"
                                      >
                                        ✓ Confirm Visit
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveDropdownId(null);
                                        setRescheduleModalVisit(visit);
                                      }}
                                      className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition"
                                    >
                                      📅 Reschedule Visit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveDropdownId(null);
                                        setCompleteModalVisit(visit);
                                      }}
                                      className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition"
                                    >
                                      ✓ Mark as Completed
                                    </button>

                                    <hr className="my-1 border-[var(--seller-border)]" />

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveDropdownId(null);
                                        setCancelModalVisit(visit);
                                      }}
                                      className="w-full text-left px-3.5 py-2 text-red-500 hover:bg-red-500/10 transition"
                                    >
                                      ✕ Cancel Visit
                                    </button>
                                  </>
                                )}
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

          {/* RIGHT SIDEBAR: CALENDAR & QUICK SUMMARY */}
          <div className="hidden xl:block space-y-6">

            {/* Calendar Widget */}
            <div className="seller-card p-5">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                  className="text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] p-1 rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg)]"
                  aria-label="Previous month"
                >
                  ❮
                </button>
                <h3 className="font-bold text-[var(--seller-text)] text-xs uppercase tracking-wider">
                  {calendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h3>
                <button
                  type="button"
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                  className="text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] p-1 rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg)]"
                  aria-label="Next month"
                >
                  ❯
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[var(--seller-text-subtle)] mb-2 uppercase">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {(() => {
                  const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
                  const startDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();

                  const datesWithVisits = new Set();
                  siteVisitsBucket.forEach((v) => {
                    const dStr = getVisitDateStr(v);
                    if (dStr) {
                      const d = new Date(dStr);
                      if (!isNaN(d.getTime())) {
                        datesWithVisits.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
                      }
                    }
                  });

                  const today = new Date();
                  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

                  const days = [];
                  for (let i = 0; i < startDayOfMonth; i++) {
                    days.push(<div key={`empty-${i}`} className="p-1"></div>);
                  }
                  for (let i = 1; i <= daysInMonth; i++) {
                    const dateKey = `${calendarDate.getFullYear()}-${calendarDate.getMonth()}-${i}`;
                    const hasVisit = datesWithVisits.has(dateKey);
                    const isToday = dateKey === todayKey;
                    const isSelected = selectedCalendarDate === dateKey;

                    days.push(
                      <button
                        key={`day-${i}`}
                        type="button"
                        onClick={() => {
                          if (hasVisit || isSelected) {
                            setSelectedCalendarDate(isSelected ? null : dateKey);
                          }
                        }}
                        className={`w-7 h-7 mx-auto rounded-full flex flex-col items-center justify-center relative transition text-xs font-semibold ${
                          isSelected
                            ? "bg-[var(--seller-primary)] text-[var(--seller-bg)]"
                            : isToday
                            ? "border border-[var(--seller-border-focus)] text-[var(--seller-text)]"
                            : hasVisit
                            ? "text-[var(--seller-text)] font-bold hover:bg-[var(--seller-bg)] cursor-pointer"
                            : "text-[var(--seller-text-muted)] hover:bg-[var(--seller-bg)]"
                        }`}
                      >
                        {i}
                        {hasVisit && !isSelected && (
                          <span className="w-1 h-1 rounded-full bg-[var(--seller-primary)] -mt-0.5"></span>
                        )}
                      </button>
                    );
                  }
                  return days;
                })()}
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--seller-border)] flex items-center justify-center gap-4 text-[10px] text-[var(--seller-text-muted)] font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--seller-primary)]"></span> Has Visits
                </div>
                {selectedCalendarDate && (
                  <button
                    onClick={() => setSelectedCalendarDate(null)}
                    className="underline text-[var(--seller-text)] hover:opacity-80"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Quick Summary Panel */}
            <div className="seller-card p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--seller-text)] mb-4">
                Quick Summary
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-1 border-b border-[var(--seller-border)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--seller-bg)] border border-[var(--seller-border)] flex items-center justify-center text-xs">✓</span>
                    <span className="text-xs font-semibold text-[var(--seller-text-muted)]">Confirmed Visits</span>
                  </div>
                  <span className="font-black text-xs text-[var(--seller-text)]">{confirmedCount}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[var(--seller-border)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--seller-bg)] border border-[var(--seller-border)] flex items-center justify-center text-xs">⏳</span>
                    <span className="text-xs font-semibold text-[var(--seller-text-muted)]">Pending Confirmation</span>
                  </div>
                  <span className="font-black text-xs text-[var(--seller-text)]">{pendingConfCount}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--seller-bg)] border border-[var(--seller-border)] flex items-center justify-center text-xs">📅</span>
                    <span className="text-xs font-semibold text-[var(--seller-text-muted)]">Today&apos;s Filtered Visits</span>
                  </div>
                  <span className="font-black text-xs text-[var(--seller-text)]">{todayFilteredCount}</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)]">
                <div className="flex gap-2">
                  <span className="text-sm">💡</span>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--seller-text)]">Pro Tip</h4>
                    <p className="text-[11px] text-[var(--seller-text-muted)] mt-0.5 leading-relaxed">
                      Confirm visits early to reduce buyer no-shows and keep your schedule on track.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* =====================================================
          VIEW DETAILS MODAL
      ===================================================== */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border border-[var(--seller-border)] my-auto max-h-[85vh] overflow-y-auto text-[var(--seller-text)]">

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedVisit(null)}
              className="absolute top-5 right-5 text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] w-8 h-8 rounded-full bg-[var(--seller-bg)] flex items-center justify-center font-bold text-sm transition border border-[var(--seller-border)]"
            >
              ✕
            </button>

            {/* Header Banner */}
            <div className="flex items-center gap-4 mb-6 border-b border-[var(--seller-border)] pb-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center font-black text-xl border border-[var(--seller-border)]">
                {(selectedVisit?.Name || selectedVisit?.name || "U")[0]}
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--seller-text)]">
                  {selectedVisit?.Name || selectedVisit?.name || "Customer Visit"}
                </h3>
                <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                  ☎ {selectedVisit?.Phone || "Not provided"} | ✉ {selectedVisit?.Email || "Not provided"}
                </p>
              </div>

              <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-[var(--seller-bg)] text-[var(--seller-text)] uppercase tracking-wider border border-[var(--seller-border)]">
                {getStatus(selectedVisit)}
              </span>
            </div>

            {/* Grid Layout: Left Details, Right Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-4 text-sm">

                {/* Visit Schedule Box */}
                <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                  <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">
                    Visit Schedule Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-[var(--seller-text-subtle)] block text-xs">Date</span>
                      <span className="font-bold text-[var(--seller-text)]">
                        {formatVisitDateTime(getVisitDateStr(selectedVisit)).date}
                      </span>
                    </div>

                    <div>
                      <span className="text-[var(--seller-text-subtle)] block text-xs">Time</span>
                      <span className="font-bold text-[var(--seller-text)]">
                        {formatVisitDateTime(getVisitDateStr(selectedVisit)).time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Details Box */}
                <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                  <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">
                    Customer Details
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-[var(--seller-text-subtle)] block text-xs">Preferred City</span>
                      <span className="font-bold text-[var(--seller-text)]">
                        {getPropertyCity(selectedVisit) || "Pune"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[var(--seller-text-subtle)] block text-xs">Purpose</span>
                      <span className="font-bold text-[var(--seller-text)]">
                        {getPropertyPurpose(selectedVisit)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[var(--seller-text-subtle)] block text-xs">Property Type</span>
                      <span className="font-bold text-[var(--seller-text)]">
                        {getPropertyType(selectedVisit)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Target Property Box */}
                <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                  <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">
                    Target Property
                  </h4>

                  <div className="flex gap-4 items-start">
                    {getPropertyImage(selectedVisit) && (
                      <img
                        src={getPropertyImage(selectedVisit)}
                        alt="Property"
                        className="w-20 h-20 rounded-xl object-cover border border-[var(--seller-border)] shrink-0"
                      />
                    )}

                    <div className="space-y-1">
                      <h5 className="font-bold text-sm sm:text-base text-[var(--seller-text)]">
                        {getPropertyName(selectedVisit)}
                      </h5>

                      <p className="text-xs text-[var(--seller-text-muted)]">
                        📍 {[getPropertyArea(selectedVisit), getPropertyCity(selectedVisit)].filter(Boolean).join(", ")}
                      </p>

                      {getPropertyPrice(selectedVisit) && (
                        <p className="text-xs sm:text-sm font-extrabold text-[var(--seller-text)] pt-0.5">
                          {getPropertyPrice(selectedVisit)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {(selectedVisit?.Message || selectedVisit?.message) && (
                  <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                    <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-2">
                      Customer Note
                    </h4>
                    <p className="text-[var(--seller-text)] bg-[var(--seller-surface)] p-3 rounded-xl border border-[var(--seller-border)] italic text-xs">
                      &quot;{selectedVisit.Message || selectedVisit.message}&quot;
                    </p>
                  </div>
                )}

              </div>

              {/* Right Column: Quick Actions */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-2">
                  Quick Actions
                </h4>

                {selectedVisit?.Phone && (
                  <a
                    href={`tel:${selectedVisit.Phone}`}
                    className="w-full text-center px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition block shadow-2xs"
                  >
                    📞 Call Customer
                  </a>
                )}

                {selectedVisit?.Email && (
                  <a
                    href={`mailto:${selectedVisit.Email}`}
                    className="w-full text-center px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition block"
                  >
                    ✉ Send Email
                  </a>
                )}

                {getStatus(selectedVisit).toLowerCase() !== "confirmed" && (
                  <button
                    type="button"
                    onClick={() => handleConfirmVisit(selectedVisit)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition block"
                  >
                    ✓ Confirm Visit
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setRescheduleModalVisit(selectedVisit)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition block"
                >
                  📅 Reschedule Visit
                </button>

                <button
                  type="button"
                  onClick={() => setCompleteModalVisit(selectedVisit)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition block"
                >
                  ✓ Mark as Completed
                </button>

                <button
                  type="button"
                  onClick={() => setCancelModalVisit(selectedVisit)}
                  className="w-full px-4 py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 font-semibold text-xs transition block"
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
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 text-[var(--seller-text)]">
            <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
              Schedule Site Visit
            </h3>
            <p className="text-xs text-[var(--seller-text-muted)] mt-1">
              Select customer and scheduled date for the property visit
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={scheduleCustomerName}
                  onChange={(e) => setScheduleCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Customer Phone
                </label>
                <input
                  type="text"
                  value={scheduleCustomerPhone}
                  onChange={(e) => setScheduleCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                    Visit Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                    Visit Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={scheduleNote}
                  onChange={(e) => setScheduleNote(e.target.value)}
                  placeholder="Special requests or requirements..."
                  className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--seller-border)] font-semibold text-[var(--seller-text-muted)] text-xs hover:text-[var(--seller-text)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!scheduleCustomerName.trim()) {
                      setErrorMessage("Please enter customer name.");
                      return;
                    }
                    setSuccessMessage(`Site Visit scheduled for ${scheduleCustomerName}`);
                    setScheduleModalOpen(false);
                    setScheduleCustomerName("");
                    setScheduleCustomerPhone("");
                    setScheduleDate("");
                    setScheduleNote("");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90"
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
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 text-[var(--seller-text)]">
            <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
              Reschedule Site Visit
            </h3>
            <p className="text-xs text-[var(--seller-text-muted)] mt-1">
              Select new date and time for {rescheduleModalVisit?.Name || "Customer"}
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Reason / Note
                </label>
                <input
                  type="text"
                  value={rescheduleNote}
                  onChange={(e) => setRescheduleNote(e.target.value)}
                  placeholder="e.g. Customer requested weekend slot..."
                  className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  disabled={Boolean(actionLoadingId)}
                  onClick={() => setRescheduleModalVisit(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--seller-border)] font-semibold text-[var(--seller-text-muted)] text-xs hover:text-[var(--seller-text)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={Boolean(actionLoadingId)}
                  onClick={handleRescheduleVisit}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {actionLoadingId ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[var(--seller-bg)] border-t-transparent rounded-full animate-spin"></span>
                      <span>Rescheduling...</span>
                    </>
                  ) : (
                    <span>Reschedule Visit</span>
                  )}
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
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 text-[var(--seller-text)]">
            <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
              Complete Site Visit
            </h3>
            <p className="text-xs text-[var(--seller-text-muted)] mt-1">
              Mark visit for {completeModalVisit?.Name || "Customer"} as completed
            </p>

            <div className="mt-4 space-y-4 text-sm text-left">
              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-2">
                  Visit Outcome
                </label>
                <div className="space-y-2 text-xs font-semibold text-[var(--seller-text)]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="completeOutcome"
                      value="Interested"
                      checked={completeOutcome === "Interested"}
                      onChange={(e) => setCompleteOutcome(e.target.value)}
                      className="accent-[var(--seller-primary)]"
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
                      className="accent-[var(--seller-primary)]"
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
                      className="accent-[var(--seller-primary)]"
                    />
                    <span>✕ Not Interested</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Feedback / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={completeFeedback}
                  onChange={(e) => setCompleteFeedback(e.target.value)}
                  placeholder="Customer liked the floor plan and asked for negotiation..."
                  className="w-full p-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] text-xs text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={Boolean(actionLoadingId)}
                  onClick={() => setCompleteModalVisit(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--seller-border)] font-semibold text-[var(--seller-text-muted)] text-xs hover:text-[var(--seller-text)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={Boolean(actionLoadingId)}
                  onClick={handleMarkCompleted}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {actionLoadingId ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[var(--seller-bg)] border-t-transparent rounded-full animate-spin"></span>
                      <span>Completing...</span>
                    </>
                  ) : (
                    <span>✓ Complete Visit</span>
                  )}
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
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 text-[var(--seller-text)]">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-xl mx-auto mb-3">
              ✕
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
              Cancel Site Visit?
            </h3>

            <p className="text-xs text-[var(--seller-text-muted)] mt-1">
              Please specify a reason for cancelling this visit.
            </p>

            <div className="mt-4 space-y-3 text-left text-sm">
              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Cancellation Reason
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-semibold text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)] cursor-pointer"
                >
                  <option value="Customer cancelled">Customer cancelled</option>
                  <option value="Owner unavailable">Owner unavailable</option>
                  <option value="Property unavailable">Property unavailable</option>
                  <option value="Customer requested reschedule">Customer requested reschedule</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  placeholder="Additional context..."
                  className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  disabled={Boolean(actionLoadingId)}
                  onClick={() => setCancelModalVisit(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--seller-border)] font-semibold text-[var(--seller-text-muted)] text-xs hover:text-[var(--seller-text)] disabled:opacity-50"
                >
                  Keep Visit
                </button>

                <button
                  type="button"
                  disabled={Boolean(actionLoadingId)}
                  onClick={handleCancelVisit}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {actionLoadingId ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Cancel Visit</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ENQUIRY HISTORY MODAL / PANEL
      ===================================================== */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-4xl w-full max-h-[85vh] my-auto flex flex-col shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 overflow-hidden text-[var(--seller-text)]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[var(--seller-border)] bg-[var(--seller-surface)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center border border-[var(--seller-border)]">
                  <History size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[var(--seller-text)] flex items-center gap-2">
                    <span>Enquiry History</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold">
                      {filteredHistoryEnquiries.length} of {allEnquiries.length}
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                    View all past and current enquiries received across properties.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                className="w-9 h-9 rounded-xl border border-[var(--seller-border)] text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] hover:bg-[var(--seller-bg)] flex items-center justify-center transition"
                aria-label="Close History Modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Filters Toolbar */}
            <div className="p-4 sm:p-5 border-b border-[var(--seller-border)] bg-[var(--seller-bg)]">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                  />
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search by buyer, phone, email, property, message..."
                    className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] pl-8 pr-7 text-xs font-medium text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)]"
                  />
                  {historySearch && (
                    <button
                      type="button"
                      onClick={() => setHistorySearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--seller-text-subtle)] hover:text-[var(--seller-text)]"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative min-w-[130px]">
                  <select
                    value={historyStatusFilter}
                    onChange={(e) => setHistoryStatusFilter(e.target.value)}
                    className="h-9 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer pr-7"
                  >
                    {historyStatusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                  />
                </div>

                {/* Property Filter */}
                <div className="relative min-w-[140px]">
                  <select
                    value={historyPropertyFilter}
                    onChange={(e) => setHistoryPropertyFilter(e.target.value)}
                    className="h-9 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer pr-7 max-w-[200px] truncate"
                  >
                    {historyPropertyOptions.map((prop) => (
                      <option key={prop} value={prop}>
                        {prop}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                  />
                </div>

                {/* Reset Filters */}
                {(historySearch || historyStatusFilter !== "All Status" || historyPropertyFilter !== "All Properties") && (
                  <button
                    type="button"
                    onClick={() => {
                      setHistorySearch("");
                      setHistoryStatusFilter("All Status");
                      setHistoryPropertyFilter("All Properties");
                    }}
                    className="h-9 px-3 rounded-xl border border-dashed border-[var(--seller-border)] text-xs font-semibold text-[var(--seller-text-muted)] hover:text-red-500 hover:border-red-300 transition"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body: Enquiry List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {filteredHistoryEnquiries.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-[var(--seller-border)] bg-[var(--seller-bg)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--seller-surface)] text-[var(--seller-text-muted)] border border-[var(--seller-border)] flex items-center justify-center mx-auto mb-2 text-base">
                    🔍
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[var(--seller-text)]">
                    No enquiries found in history
                  </h4>
                  <p className="text-xs text-[var(--seller-text-muted)] mt-1">
                    Try adjusting your search terms or filters above.
                  </p>
                </div>
              ) : (
                filteredHistoryEnquiries.map((enq) => {
                  const docId = enq?.documentId || enq?.id;
                  const currentStatus = getStatus(enq);
                  const isNew = currentStatus.toLowerCase() === "new" || currentStatus.toLowerCase() === "pending";
                  const isContacted = currentStatus.toLowerCase() === "contacted";
                  const isConverted = currentStatus.toLowerCase() === "converted";
                  const isNotInterested = currentStatus.toLowerCase() === "not interested";

                  let statusBadgeClass = "bg-[var(--seller-bg)] text-[var(--seller-text-muted)] border-[var(--seller-border)]";
                  if (isNew) statusBadgeClass = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
                  else if (isContacted) statusBadgeClass = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
                  else if (isConverted) statusBadgeClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
                  else if (isNotInterested) statusBadgeClass = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";

                  const createdDate = enq?.createdAt
                    ? new Date(enq.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A";

                  const updatedDate = enq?.updatedAt && enq.updatedAt !== enq.createdAt
                    ? new Date(enq.updatedAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : null;

                  return (
                    <div
                      key={docId}
                      className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-bg)] p-4 sm:p-5 transition hover:border-[var(--seller-border-focus)] hover:shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          {/* Buyer Name & Status */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm sm:text-base text-[var(--seller-text)]">
                              {enq?.Name || enq?.name || "Unknown Enquirer"}
                            </span>
                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${statusBadgeClass}`}
                            >
                              {currentStatus}
                            </span>
                          </div>

                          {/* Contact Info */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--seller-text-muted)]">
                            {enq?.Phone && (
                              <span className="inline-flex items-center gap-1 font-semibold text-[var(--seller-text)]">
                                ☎ {enq.Phone}
                              </span>
                            )}
                            {enq?.Email && (
                              <span className="inline-flex items-center gap-1">
                                ✉ {enq.Email}
                              </span>
                            )}
                          </div>

                          {/* Property Details */}
                          <div className="text-xs pt-1 flex flex-wrap items-center gap-2">
                            <span className="font-bold text-[var(--seller-text)]">
                              🏢 {getPropertyName(enq)}
                            </span>
                            {getPropertyCity(enq) && (
                              <span className="text-[var(--seller-text-subtle)]">
                                • 📍 {getPropertyCity(enq)}
                              </span>
                            )}
                            {getPropertyPrice(enq) && (
                              <span className="font-extrabold text-[var(--seller-text)]">
                                • {getPropertyPrice(enq)}
                              </span>
                            )}
                          </div>

                          {/* Enquiry Message */}
                          {(enq?.Message || enq?.message) && (
                            <p className="text-xs italic text-[var(--seller-text-muted)] bg-[var(--seller-surface)] p-2.5 rounded-xl border border-[var(--seller-border)] mt-2">
                              &ldquo;{enq?.Message || enq?.message}&rdquo;
                            </p>
                          )}

                          {/* Timeline / Additional Notes */}
                          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--seller-text-subtle)]">
                            <span>📅 Received: {createdDate}</span>
                            {updatedDate && (
                              <span>• Last Activity: {updatedDate}</span>
                            )}
                            {enq?.FollowUpDate && (
                              <span className="text-purple-600 font-semibold">
                                • Follow-up: {enq.FollowUpDate}
                              </span>
                            )}
                            {enq?.ClosedReason && (
                              <span className="text-red-500 font-semibold">
                                • Reason: {enq.ClosedReason}
                              </span>
                            )}
                          </div>

                          {/* Owner Response / Notes if present */}
                          {(enq?.OwnerResponse || enq?.OwnerNote) && (
                            <div className="mt-2 text-xs bg-[var(--seller-surface)] text-[var(--seller-text)] p-2 rounded-xl border border-[var(--seller-border)]">
                              <span className="font-bold">Owner Note: </span>
                              {enq?.OwnerResponse || enq?.OwnerNote}
                            </div>
                          )}
                        </div>

                        {/* View Details Action */}
                        <div className="pt-2 sm:pt-0 sm:pl-3 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVisit(enq);
                            }}
                            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition shadow-2xs whitespace-nowrap"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--seller-border)] bg-[var(--seller-surface)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--seller-text-muted)]">
              <div className="flex items-center gap-1.5 text-[11px]">
                <Clock size={12} className="text-[var(--seller-text-subtle)]" />
                <span>Enquiries are securely synced live from Strapi backend.</span>
              </div>
              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--seller-border)] text-xs font-bold text-[var(--seller-text)] hover:bg-[var(--seller-bg)] transition ml-auto"
              >
                Close History
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
