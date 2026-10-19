"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../Footer";
import {
  Search,
  Tag,
  MapPin,
  ArrowUpDown,
  ChevronDown,
  X,
  MessageSquare,
  ArrowLeft,
  Filter,
  History,
  Clock,
} from "lucide-react";
import {
  getOwnerEnquiries,
  updateOwnerEnquiryFields,
} from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function ContactedPage() {
  const router = useRouter();

  // Primary data state
  const [allEnquiries, setAllEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Filters & Sorting state
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [purposeFilter, setPurposeFilter] = useState("All Purposes");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [sortBy, setSortBy] = useState("Latest Contacted");

  // Summary-card filter — controls which card is active
  // Values: "all" | "follow-ups" | "site-visit" | "converted"
  const [cardFilter, setCardFilter] = useState("all");

  // Modals & Action Drawer state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // History modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("All Status");
  const [historyPropertyFilter, setHistoryPropertyFilter] = useState("All Properties");

  // Sub-modals
  const [noteModalEnquiry, setNoteModalEnquiry] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteOutcome, setNoteOutcome] = useState("Interested");

  const [followUpModalEnquiry, setFollowUpModalEnquiry] = useState(null);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("11:00");
  const [reminderType, setReminderType] = useState("Call");
  const [followUpNote, setFollowUpNote] = useState("");

  const [notInterestedModalEnquiry, setNotInterestedModalEnquiry] = useState(null);
  const [notInterestedReason, setNotInterestedReason] = useState("Price is high");
  const [notInterestedNote, setNotInterestedNote] = useState("");

  const [archiveModalEnquiry, setArchiveModalEnquiry] = useState(null);
  const [archiveReason, setArchiveReason] = useState("Archived by Owner");

  // =====================================================
  // FETCH ENQUIRIES FROM STRAPI API
  // =====================================================
  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      console.log("=================================");
      console.log("CONTACTED ENQUIRIES PAGE");
      console.log("Fetching owner enquiries from Strapi...");
      console.log("=================================");

      const data = await getOwnerEnquiries();
      console.log("STRAPI ENQUIRIES LOADED:", data);

      setAllEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("CONTACTED ENQUIRIES ERROR:", err);
      setError(err?.message || "Unable to load contacted enquiries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  // Clear toast message after 4 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear error toast after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Lock background body scroll when any modal is open to prevent duplicate competing scrollbars
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      selectedEnquiry ||
      historyModalOpen ||
      noteModalEnquiry ||
      followUpModalEnquiry ||
      notInterestedModalEnquiry ||
      archiveModalEnquiry
    );

    if (isAnyModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [
    selectedEnquiry,
    historyModalOpen,
    noteModalEnquiry,
    followUpModalEnquiry,
    notInterestedModalEnquiry,
  ]);

  // =====================================================
  // HELPER FUNCTIONS FOR STRAPI DATA PARSING
  // =====================================================
  function getStatus(item) {
    return String(
      item?.Status || item?.status || item?.Statuss || "Pending"
    ).trim();
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

  function getPropertyType(item) {
    const prop = getPropertyRelation(item);
    return prop?.PropertyType || prop?.propertyType || prop?.Category || prop?.category || "Apartment";
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

  function getContactHistory(item) {
    if (Array.isArray(item?.ContactHistory) && item.ContactHistory.length > 0) {
      return item.ContactHistory;
    }
    // Fallback constructed history from timeline timestamps if available
    const history = [];
    const dateStr = item?.updatedAt || item?.createdAt;
    if (dateStr) {
      const formatted = new Date(dateStr).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      history.push({
        date: formatted,
        title: "Contacted Customer",
        note: item?.OwnerNote || item?.OwnerResponse || item?.Message || "Customer contacted regarding property inquiry.",
      });
    }
    return history;
  }

  // =====================================================
  // FILTERED LIST & CALCULATED METRICS
  // =====================================================
  // Contacted status bucket includes: Contacted, Follow-up Required
  const contactedBucket = useMemo(() => {
    return allEnquiries.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return (
        s === "contacted" ||
        s === "follow-up required" ||
        s === "followup required"
      );
    });
  }, [allEnquiries]);

  // Metric 1: Total Contacted
  const countTotalContacted = contactedBucket.length;

  // New enquiries count for tabs
  const countNewEnquiries = useMemo(() => {
    return allEnquiries.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "new" || s === "pending";
    }).length;
  }, [allEnquiries]);

  // Metric 2: Follow-ups Due — scoped to contactedBucket only
  const countFollowUpsDue = useMemo(() => {
    return contactedBucket.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "follow-up required" || s === "followup required" || Boolean(item?.FollowUpDate);
    }).length;
  }, [contactedBucket]);

  // Metric 3: Site Visit Pending — scoped to contactedBucket
  const countSiteVisitPending = useMemo(() => {
    return contactedBucket.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "site visit pending" || s === "site visit scheduled" || s === "site visit";
    }).length;
  }, [contactedBucket]);

  // Metric 4: Converted — scoped to contactedBucket, exclude "closed"
  const countConverted = useMemo(() => {
    return contactedBucket.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "converted" || s === "interested";
    }).length;
  }, [contactedBucket]);

  // Closed count for tabs (matches isClosedItem: closed, not interested, converted, archived)
  const countClosedEnquiries = useMemo(() => {
    return allEnquiries.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return (
        s === "closed" ||
        s === "not interested" ||
        s === "notinterested" ||
        s === "converted" ||
        s === "archived"
      );
    }).length;
  }, [allEnquiries]);

  // Dynamic dropdown options
  const propertyOptions = useMemo(() => {
    const names = contactedBucket.map(getPropertyName).filter(Boolean);
    return ["All Properties", ...Array.from(new Set(names))];
  }, [contactedBucket]);

  const purposeOptions = useMemo(() => {
    const purposes = contactedBucket.map(getPropertyPurpose).filter(Boolean);
    return ["All Purposes", ...Array.from(new Set(purposes))];
  }, [contactedBucket]);

  const statusOptions = [
    "All Status",
    "Contacted",
    "Follow-up Required",
  ];

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

  // =====================================================
  // CARD FILTER LABELS (for empty-state messaging)
  // =====================================================
  const cardFilterLabel = {
    all: "All Contacted",
    "follow-ups": "Follow-ups Due",
  };

  // Applied Filtering and Sorting logic
  const filteredAndSortedEnquiries = useMemo(() => {
    // Stage 0: start from the contacted bucket
    let result = [...contactedBucket];

    // Stage 1: summary-card filter (before search/dropdowns so they combine)
    if (cardFilter === "follow-ups") {
      result = result.filter((item) => {
        const s = getStatus(item).toLowerCase();
        // Follow-ups Due = has a FollowUpDate set, OR status is explicitly "follow-up required"
        return (
          s === "follow-up required" ||
          s === "followup required" ||
          Boolean(item?.FollowUpDate)
        );
      });
    }
    // "all" = no additional card filter

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((item) => {
        const name = String(item?.Name || item?.name || "").toLowerCase();
        const phone = String(item?.Phone || item?.phone || "").toLowerCase();
        const email = String(item?.Email || item?.email || "").toLowerCase();
        const title = getPropertyName(item).toLowerCase();
        const city = getPropertyCity(item).toLowerCase();
        const area = getPropertyArea(item).toLowerCase();

        return (
          name.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          title.includes(q) ||
          city.includes(q) ||
          area.includes(q)
        );
      });
    }

    // Property filter
    if (propertyFilter !== "All Properties") {
      result = result.filter((item) => getPropertyName(item) === propertyFilter);
    }

    // Purpose filter
    if (purposeFilter !== "All Purposes") {
      result = result.filter((item) => getPropertyPurpose(item) === purposeFilter);
    }

    // Status filter
    if (statusFilter !== "All Status") {
      result = result.filter((item) => getStatus(item).toLowerCase() === statusFilter.toLowerCase());
    }

    // Date filter
    if (dateFilter !== "All Time") {
      const now = new Date();
      result = result.filter((item) => {
        const itemDate = new Date(item?.updatedAt || item?.createdAt || 0);
        if (dateFilter === "Today") {
          return itemDate.toDateString() === now.toDateString();
        }
        if (dateFilter === "This Week") {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= sevenDaysAgo;
        }
        if (dateFilter === "This Month") {
          return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "Latest Contacted") {
        return new Date(b?.updatedAt || b?.createdAt || 0) - new Date(a?.updatedAt || a?.createdAt || 0);
      }
      if (sortBy === "Follow-up Date") {
        return new Date(a?.FollowUpDate || "9999-12-31") - new Date(b?.FollowUpDate || "9999-12-31");
      }
      if (sortBy === "Property") {
        return getPropertyName(a).localeCompare(getPropertyName(b));
      }
      if (sortBy === "Name") {
        return (a?.Name || "").localeCompare(b?.Name || "");
      }
      return 0;
    });

    return result;
  }, [contactedBucket, cardFilter, search, propertyFilter, purposeFilter, statusFilter, dateFilter, sortBy]);

  // =====================================================
  // STRAPI STATUS & NOTE UPDATE HANDLERS
  // =====================================================
  async function updateEnquiryStatusInStrapi(docId, newStatus, extraFields = {}) {
    if (!docId) return;
    try {
      setActionLoadingId(docId);
      console.log(`Updating enquiry ${docId} to status: ${newStatus}`, extraFields);

      // Normalize status values to match actual Strapi enum (some have whitespace or casing quirks in schema)
      let mappedStatus = newStatus;
      if (newStatus === "Confirmed") mappedStatus = " Confirmed";
      if (newStatus === "Cancelled") mappedStatus = "Cancelled ";
      if (newStatus === "Not Interested" || newStatus === "not interested") mappedStatus = "NotInterested";

      // Send status + extra fields in ONE call so the backend controller
      // receives all data together and can trigger the correct email.
      await updateOwnerEnquiryFields(docId, {
        Statuss: mappedStatus,
        ...extraFields,
      });

      // Optimistic local state update for instant UI feedback (no page reload needed)
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

      // Also update selectedEnquiry panel if it's open for this record
      setSelectedEnquiry((prev) => {
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

      return true;
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
      setSuccessMessage("");
      setErrorMessage(err?.message || "Failed to update enquiry. Please try again.");
      return false;
    } finally {
      setActionLoadingId(null);
    }
  }

  // Action: Save Contact Note
  async function handleSaveNote() {
    if (!noteModalEnquiry) return;
    const docId = noteModalEnquiry?.documentId || noteModalEnquiry?.id;

    // OwnerResponse is the actual Strapi schema field for notes.
    const success = await updateEnquiryStatusInStrapi(docId, noteOutcome, {
      OwnerResponse: noteContent,
    });

    if (success) {
      setSuccessMessage(`Note saved and status updated to ${noteOutcome}`);
      setNoteModalEnquiry(null);
      setNoteContent("");
    }
  }

  // Action: Schedule Follow-up
  async function handleScheduleFollowUp() {
    if (!followUpModalEnquiry) return;
    const docId = followUpModalEnquiry?.documentId || followUpModalEnquiry?.id;

    if (!followUpDate) {
      setErrorMessage("Please select a follow-up date.");
      return;
    }

    // FollowUpDate in Strapi schema is type 'date' — must be YYYY-MM-DD only.
    // Time and reminder type are stored in OwnerResponse.
    const noteText = [
      reminderType ? `Reminder: ${reminderType}` : "",
      followUpTime ? `Time: ${followUpTime}` : "",
      followUpNote ? followUpNote : "",
    ].filter(Boolean).join(" | ");

    const success = await updateEnquiryStatusInStrapi(docId, "Follow-up Required", {
      FollowUpDate: followUpDate,          // YYYY-MM-DD only (Strapi date field)
      OwnerResponse: noteText || undefined, // embed reminder time + note in OwnerResponse
    });

    if (success) {
      setSuccessMessage(`Follow-up scheduled for ${followUpDate} at ${followUpTime}`);
      setFollowUpModalEnquiry(null);
      setFollowUpNote("");
    }
  }

  // Action: Mark Not Interested (Moves to Closed)
  async function handleMarkNotInterested() {
    if (!notInterestedModalEnquiry) return;
    const docId = notInterestedModalEnquiry?.documentId || notInterestedModalEnquiry?.id;

    // ClosedReason exists in the schema; the optional note goes into OwnerResponse.
    const success = await updateEnquiryStatusInStrapi(docId, "Not Interested", {
      ClosedReason: notInterestedReason,
      OwnerResponse: notInterestedNote || undefined,
    });

    if (success) {
      setSuccessMessage("Enquiry marked as Not Interested and moved to Closed Enquiries.");
      setNotInterestedModalEnquiry(null);
      setNotInterestedNote("");
      setSelectedEnquiry(null); // Close the details panel — it's no longer Contacted
    }
  }

  // Action: Archive Enquiry (Moves to Closed/Archived)
  async function handleArchiveEnquiry() {
    if (!archiveModalEnquiry) return;
    const docId = archiveModalEnquiry?.documentId || archiveModalEnquiry?.id;

    // Use "Closed" status in Strapi enum with ClosedReason = "Archived"
    const success = await updateEnquiryStatusInStrapi(docId, "Closed", {
      ClosedReason: archiveReason || "Archived by Owner",
    });

    if (success) {
      setSuccessMessage("Enquiry archived and moved to Closed Enquiries.");
      setArchiveModalEnquiry(null);
      setSelectedEnquiry(null);
    }
  }

  // Action: Move to Site Visit
  async function handleMoveToSiteVisit(enquiry) {
    const docId = enquiry?.documentId || enquiry?.id;
    // Use the exact Strapi enum value: "Site Visit Pending"
    const success = await updateEnquiryStatusInStrapi(docId, "Site Visit Pending");
    if (success) {
      setSuccessMessage("Site visit scheduled! The buyer will be notified via email.");
      setActiveDropdownId(null);
    }
  }

  // =====================================================
  // RENDER LOADING STATE
  // =====================================================
  if (loading) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <button
              onClick={() => router.push("/owner")}
              className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>

            <header className="mx-auto mb-8 max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3.5 py-1 text-[11px] font-semibold text-[var(--seller-text-muted)] shadow-xs">
                <MessageSquare size={12} strokeWidth={2} />
                <span>Seller Portal</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
                Contacted Enquiries
              </h1>
              <p className="mt-2.5 text-sm text-[var(--seller-text-muted)] sm:text-base">
                Enquiries you have already contacted and are following up on.
              </p>
            </header>

            <div className="seller-card p-12 text-center">
              <div className="inline-block w-9 h-9 border-3 border-[var(--seller-primary)] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[var(--seller-text)] font-semibold mt-4 text-sm">
                Loading contacted enquiries...
              </p>
              <p className="text-[var(--seller-text-muted)] text-xs mt-1">
                Fetching real-time data from Strapi backend.
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
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <button
              onClick={() => router.push("/owner")}
              className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>

            <header className="mx-auto mb-8 max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3.5 py-1 text-[11px] font-semibold text-[var(--seller-text-muted)] shadow-xs">
                <MessageSquare size={12} strokeWidth={2} />
                <span>Seller Portal</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
                Contacted Enquiries
              </h1>
            </header>

            <div className="seller-card p-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-xl font-bold mb-3">
                ⚠️
              </div>

              <h2 className="text-lg font-bold text-[var(--seller-text)]">
                Unable to load contacted enquiries
              </h2>

              <p className="text-[var(--seller-text-muted)] mt-2 max-w-md mx-auto text-xs sm:text-sm">
                Something went wrong while loading your enquiries. Please try again.
              </p>

              <p className="text-xs font-mono bg-[var(--seller-bg)] border border-[var(--seller-border)] text-red-500 p-2.5 rounded-xl mt-3 max-w-lg mx-auto overflow-x-auto">
                {error}
              </p>

              <button
                type="button"
                onClick={loadEnquiries}
                className="mt-6 px-6 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-semibold text-xs hover:opacity-90 transition shadow-xs"
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
  // MAIN CONTACTED ENQUIRIES PAGE UI
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

          {/* Navigation Breadcrumb / Back Link */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/owner"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </Link>
          </div>

          {/* =================================================
              1. HORIZONTALLY CENTERED HEADING & DESCRIPTION
          ================================================= */}
          <header className="mx-auto mb-8 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3.5 py-1 text-[11px] font-semibold text-[var(--seller-text-muted)] shadow-xs">
              <MessageSquare size={12} strokeWidth={2} />
              <span>Seller Portal</span>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
              Enquiries
            </h1>

            <p className="mt-2.5 text-sm text-[var(--seller-text-muted)] sm:text-base sm:leading-relaxed">
              Enquiries you have already contacted and are following up on.
            </p>
          </header>

          {/* Tab switcher: New, Contacted, Site Visits, Closed */}
          <div className="mb-6 flex justify-center overflow-x-auto pb-1">
            <div className="inline-flex rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-1 shadow-xs">
              {[
                { label: `New (${countNewEnquiries})`, href: "/owner/enquiries/new", active: false },
                { label: `Contacted (${countTotalContacted})`, href: "/owner/enquiries/contacted", active: true },
                { label: `Closed (${countClosedEnquiries})`, href: "/owner/enquiries/closed", active: false },
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

          {/* Sub-filter chips for Contacted */}
          <div className="mb-6 flex justify-center overflow-x-auto pb-1">
            <div className="inline-flex gap-2">
              {[
                { id: "all", label: `All Contacted (${countTotalContacted})` },
                { id: "follow-ups", label: `Follow-ups Due (${countFollowUpsDue})` },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setCardFilter(chip.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition border ${
                    cardFilter === chip.id
                      ? "bg-[var(--seller-primary)] text-[var(--seller-bg)] border-[var(--seller-primary)]"
                      : "bg-[var(--seller-surface)] text-[var(--seller-text-muted)] border-[var(--seller-border)] hover:border-[var(--seller-border-focus)] hover:text-[var(--seller-text)]"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* =================================================
              2. CLEAN, COMPACT ENQUIRIES TOOLBAR
          ================================================= */}
          <section className="mb-6 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-3 sm:p-4 shadow-[var(--seller-shadow)]">
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2.5">

              {/* Search */}
              <div className="relative min-w-[180px] flex-1 sm:min-w-[220px]">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, phone, property..."
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

              {/* Property filter */}
              <div className="relative w-auto min-w-[130px]">
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

              {/* Purpose filter */}
              <div className="relative w-auto min-w-[120px]">
                <Filter
                  size={13}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                />
                <select
                  value={purposeFilter}
                  onChange={(e) => setPurposeFilter(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
                >
                  {purposeOptions.map((opt) => (
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

              {/* Status filter */}
              <div className="relative w-auto min-w-[120px]">
                <Tag
                  size={13}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
                >
                  {statusOptions.map((opt) => (
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

              {/* Sort dropdown */}
              <div className="relative w-auto min-w-[140px]">
                <ArrowUpDown
                  size={13}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
                >
                  <option value="Latest Contacted">Latest Contacted</option>
                  <option value="Follow-up Date">Follow-up Date</option>
                  <option value="Property">Property</option>
                  <option value="Name">Name</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                />
              </div>

            </div>
          </section>

          {/* 3. RESULTS COUNTER */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
                {cardFilterLabel[cardFilter] ?? "Contacted Customers"}
              </h2>
              <span className="text-xs font-extrabold bg-[var(--seller-primary)] text-[var(--seller-bg)] px-2.5 py-0.5 rounded-full">
                {filteredAndSortedEnquiries.length}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--seller-text-muted)]">
              {filteredAndSortedEnquiries.length === 1 ? "1 enquiry" : `${filteredAndSortedEnquiries.length} enquiries`}
              {cardFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setCardFilter("all")}
                  className="ml-2 font-semibold text-[var(--seller-text)] hover:underline"
                >
                  ✕ Clear
                </button>
              )}
            </p>
          </div>

          {/* 4. CONTACTED ENQUIRY LIST (CARDS) */}
          <div className="space-y-3.5">
            {filteredAndSortedEnquiries.length === 0 ? (
              /* EMPTY STATE */
              <div className="seller-card p-10 sm:p-12 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--seller-bg)] border border-[var(--seller-border)] flex items-center justify-center text-[var(--seller-text-muted)] mb-3">
                  <MessageSquare size={20} />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
                  No {cardFilterLabel[cardFilter] ?? "Contacted"} Enquiries
                </h3>

                <p className="text-[var(--seller-text-muted)] text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  {cardFilter === "all"
                    ? "You don't have any contacted enquiries matching your criteria."
                    : `No enquiries match the "${cardFilterLabel[cardFilter]}" filter.`}
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                  {cardFilter !== "all" && (
                    <button
                      type="button"
                      onClick={() => setCardFilter("all")}
                      className="px-4 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] text-xs font-semibold hover:opacity-90 transition shadow-2xs"
                    >
                      Show All Contacted
                    </button>
                  )}

                  <Link
                    href="/owner/enquiries/new"
                    className="px-4 py-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] text-xs font-semibold hover:border-[var(--seller-border-focus)] transition"
                  >
                    View New Enquiries
                  </Link>

                  {(search || propertyFilter !== "All Properties" || statusFilter !== "All Status") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setPropertyFilter("All Properties");
                        setPurposeFilter("All Purposes");
                        setStatusFilter("All Status");
                      }}
                      className="px-4 py-2 rounded-xl border border-[var(--seller-border)] text-[var(--seller-text-muted)] text-xs font-semibold hover:text-[var(--seller-text)] transition"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* ENQUIRY CARDS */
              filteredAndSortedEnquiries.map((enquiry) => {
                const docId = enquiry?.documentId || enquiry?.id;
                const name = enquiry?.Name || enquiry?.name || "Unknown Customer";
                const phone = enquiry?.Phone || enquiry?.phone || "Not provided";
                const email = enquiry?.Email || enquiry?.email || "Not provided";
                const status = getStatus(enquiry);

                const propTitle = getPropertyName(enquiry);
                const propCity = getPropertyCity(enquiry);
                const propArea = getPropertyArea(enquiry);
                const propPrice = getPropertyPrice(enquiry);

                const contactedDate = enquiry?.updatedAt || enquiry?.createdAt;
                const formattedContactedDate = contactedDate
                  ? new Date(contactedDate).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Date unavailable";

                const followUpDateStr = enquiry?.FollowUpDate;
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
                    className="seller-card p-4 sm:p-5 relative"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.9fr_auto] gap-4 sm:gap-5 items-center">

                      {/* CUSTOMER SECTION */}
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

                          <p className="text-xs text-[var(--seller-text-muted)] truncate">
                            ✉ {email}
                          </p>
                        </div>
                      </div>

                      {/* PROPERTY SECTION */}
                      <div className="border-t lg:border-t-0 lg:border-l border-[var(--seller-border)] pt-3 lg:pt-0 lg:pl-5">
                        <p className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider">
                          Interested in
                        </p>

                        <h4 className="font-bold text-xs sm:text-sm text-[var(--seller-text)] mt-0.5 line-clamp-1">
                          {propTitle}
                        </h4>

                        <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                          📍 {[propArea, propCity].filter(Boolean).join(", ") || "Location not specified"}
                        </p>

                        {propPrice && (
                          <p className="text-xs font-extrabold text-[var(--seller-text)] mt-0.5">
                            {propPrice}
                          </p>
                        )}
                      </div>

                      {/* TIMELINE & FOLLOW-UP */}
                      <div className="border-t lg:border-t-0 lg:border-l border-[var(--seller-border)] pt-3 lg:pt-0 lg:pl-5">
                        <p className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider">
                          Contacted On
                        </p>
                        <p className="text-xs font-medium text-[var(--seller-text-muted)] mt-0.5">
                          {formattedContactedDate}
                        </p>

                        {followUpDateStr && (
                          <div className="mt-2">
                            <p className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider">
                              Follow-up On
                            </p>
                            <p className="text-xs font-bold text-[var(--seller-text)]">
                              {followUpDateStr}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* ACTION BUTTONS & MORE MENU */}
                      <div className="flex sm:flex-row lg:flex-col gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--seller-border)] lg:min-w-[130px] relative">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="flex-1 lg:w-full px-3.5 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition shadow-2xs text-center"
                        >
                          View Details
                        </button>

                        {/* More dropdown trigger */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveDropdownId(isDropdownOpen ? null : docId)
                            }
                            className="px-3 py-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition flex items-center justify-center gap-1 w-full"
                          >
                            <span>More</span>
                            <ChevronDown size={12} />
                          </button>

                          {/* Dropdown Menu Popup */}
                          {isDropdownOpen && (
                            <div className="absolute right-0 bottom-full lg:bottom-auto lg:top-full mb-1 lg:mb-0 lg:mt-1 w-52 bg-[var(--seller-surface)] rounded-2xl shadow-xl border border-[var(--seller-border)] py-1.5 z-20 text-xs font-semibold text-[var(--seller-text)] animate-in fade-in duration-100">
                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setSelectedEnquiry(enquiry);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition"
                              >
                                👁️ View Details
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setNoteModalEnquiry(enquiry);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition"
                              >
                                📝 Add Contact Note
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setFollowUpModalEnquiry(enquiry);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition"
                              >
                                📅 Schedule Follow-up
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  updateEnquiryStatusInStrapi(docId, "Interested");
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition"
                              >
                                ⭐ Mark as Interested
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  handleMoveToSiteVisit(enquiry);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition"
                              >
                                🚗 Move to Site Visit
                              </button>

                              <button
                                onClick={async () => {
                                  setActiveDropdownId(null);
                                  const success = await updateEnquiryStatusInStrapi(docId, "Converted");
                                  if (success) {
                                    setSuccessMessage("Enquiry marked as Converted and moved to Closed Enquiries.");
                                    if (selectedEnquiry && (selectedEnquiry?.documentId === docId || selectedEnquiry?.id === docId)) {
                                      setSelectedEnquiry(null);
                                    }
                                  }
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition text-[var(--seller-text)]"
                              >
                                🏆 Mark as Converted
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setArchiveModalEnquiry(enquiry);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition text-[var(--seller-text)]"
                              >
                                📦 Archive Enquiry
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setNotInterestedModalEnquiry(enquiry);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-red-500/10 text-red-500 transition"
                              >
                                🚫 Mark as Not Interested
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

      </main>

      {/* =====================================================
          ENQUIRY DETAILS MODAL / DRAWER
      ===================================================== */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative border border-[var(--seller-border)] my-8 max-h-[90vh] overflow-y-auto text-[var(--seller-text)]">

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] w-8 h-8 rounded-full bg-[var(--seller-bg)] flex items-center justify-center font-bold text-sm transition border border-[var(--seller-border)]"
            >
              ✕
            </button>

            {/* Header / Customer Banner */}
            <div className="flex items-center gap-4 mb-6 border-b border-[var(--seller-border)] pb-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center font-black text-xl border border-[var(--seller-border)]">
                {(selectedEnquiry?.Name || "U")[0]}
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--seller-text)]">
                  {selectedEnquiry?.Name || selectedEnquiry?.name || "Customer Details"}
                </h3>
                <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                  ☎ {selectedEnquiry?.Phone} | ✉ {selectedEnquiry?.Email}
                </p>
              </div>

              <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-[var(--seller-bg)] text-[var(--seller-text)] uppercase tracking-wider border border-[var(--seller-border)]">
                {getStatus(selectedEnquiry)}
              </span>
            </div>

            {/* Grid Layout: Left Details, Right Actions & Property */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column: Customer & Property Details */}
              <div className="lg:col-span-2 space-y-5 text-sm">

                {/* Customer Details Box */}
                <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                  <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">
                    Customer Requirements
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-[var(--seller-text-subtle)] block text-xs">Preferred Location</span>
                      <span className="font-bold text-[var(--seller-text)]">
                        {getPropertyCity(selectedEnquiry) || "Pune"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[var(--seller-text-subtle)] block text-xs">Purpose</span>
                      <span className="font-bold text-[var(--seller-text)]">
                        {getPropertyPurpose(selectedEnquiry)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[var(--seller-text-subtle)] block text-xs">Property Type</span>
                      <span className="font-bold text-[var(--seller-text)]">
                        {getPropertyType(selectedEnquiry)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enquired Property Box */}
                <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                  <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">
                    Enquired Property
                  </h4>

                  <div className="flex gap-4 items-start">
                    {getPropertyImage(selectedEnquiry) && (
                      <img
                        src={getPropertyImage(selectedEnquiry)}
                        alt="Property"
                        className="w-24 h-24 rounded-2xl object-cover border border-gray-200 shrink-0"
                      />
                    )}

                    <div className="space-y-1">
                      <h5 className="font-bold text-sm sm:text-base text-[var(--seller-text)]">
                        {getPropertyName(selectedEnquiry)}
                      </h5>

                      <p className="text-xs text-[var(--seller-text-muted)]">
                        📍 {[getPropertyArea(selectedEnquiry), getPropertyCity(selectedEnquiry)].filter(Boolean).join(", ")}
                      </p>

                      {getPropertyPrice(selectedEnquiry) && (
                        <p className="text-xs sm:text-sm font-extrabold text-[var(--seller-text)] pt-1">
                          {getPropertyPrice(selectedEnquiry)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enquiry Message */}
                <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                  <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-2">
                    Enquiry Message
                  </h4>
                  <p className="text-[var(--seller-text)] bg-[var(--seller-surface)] p-3 rounded-xl border border-[var(--seller-border)] italic text-xs sm:text-sm">
                    "{selectedEnquiry?.Message || selectedEnquiry?.message || "No message provided."}"
                  </p>
                </div>

                {/* Contact History */}
                <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                  <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">
                    Contact History
                  </h4>

                  <div className="space-y-3 pl-2">
                    {getContactHistory(selectedEnquiry).map((item, idx) => (
                      <div key={idx} className="relative pl-5 border-l-2 border-[var(--seller-border-focus)] pb-1">
                        <span className="absolute -left-[5px] top-0.5 w-2 h-2 rounded-full bg-[var(--seller-text)]"></span>
                        <p className="text-[11px] font-semibold text-[var(--seller-text-muted)]">{item.date}</p>
                        <p className="font-bold text-[var(--seller-text)] text-xs">{item.title}</p>
                        <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Quick Actions */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-2">
                  Quick Actions
                </h4>

                {selectedEnquiry?.Phone && (
                  <a
                    href={`tel:${selectedEnquiry.Phone}`}
                    className="w-full text-center px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-bold text-xs hover:border-[var(--seller-border-focus)] transition block shadow-2xs"
                  >
                    📞 Call Customer
                  </a>
                )}

                {selectedEnquiry?.Email && (
                  <a
                    href={`mailto:${selectedEnquiry.Email}`}
                    className="w-full text-center px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-bold text-xs hover:border-[var(--seller-border-focus)] transition block shadow-2xs"
                  >
                    ✉ Send Message
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setNoteModalEnquiry(selectedEnquiry)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition block shadow-2xs"
                >
                  📝 Add Contact Note
                </button>

                <button
                  type="button"
                  onClick={() => setFollowUpModalEnquiry(selectedEnquiry)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-bold text-xs hover:border-[var(--seller-border-focus)] transition block shadow-2xs"
                >
                  📅 Schedule Follow-up
                </button>

                <button
                  type="button"
                  onClick={() => handleMoveToSiteVisit(selectedEnquiry)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-bold text-xs hover:border-[var(--seller-border-focus)] transition block shadow-2xs"
                >
                  🚗 Move to Site Visit
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const docId = selectedEnquiry?.documentId || selectedEnquiry?.id;
                    const success = await updateEnquiryStatusInStrapi(docId, "Converted");
                    if (success) {
                      setSuccessMessage("Enquiry marked as Converted and moved to Closed Enquiries.");
                      setSelectedEnquiry(null);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-bold text-xs hover:border-[var(--seller-border-focus)] transition block shadow-2xs"
                >
                  🏆 Mark as Converted
                </button>

                <button
                  type="button"
                  onClick={() => setArchiveModalEnquiry(selectedEnquiry)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-bold text-xs hover:border-[var(--seller-border-focus)] transition block shadow-2xs"
                >
                  📦 Archive Enquiry
                </button>

                <button
                  type="button"
                  onClick={() => setNotInterestedModalEnquiry(selectedEnquiry)}
                  className="w-full px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-950/20 transition block shadow-2xs"
                >
                  🚫 Mark as Not Interested
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          ADD CONTACT NOTE MODAL
      ===================================================== */}
      {noteModalEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 text-[var(--seller-text)]">
            <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
              Contact with Customer
            </h3>
            <p className="text-xs text-[var(--seller-text-muted)] mt-1">
              {noteModalEnquiry?.Name} (☎ {noteModalEnquiry?.Phone})
            </p>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Add Note
                </label>
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Spoke with customer. She liked the flat and wants to visit on Saturday morning..."
                  className="w-full p-3 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] text-xs text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-2">
                  Outcome of Conversation
                </label>
                <div className="space-y-2 text-xs font-semibold text-[var(--seller-text)]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="outcome"
                      value="Interested"
                      checked={noteOutcome === "Interested"}
                      onChange={(e) => setNoteOutcome(e.target.value)}
                      className="accent-[var(--seller-primary)]"
                    />
                    <span>⭐ Interested</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="outcome"
                      value="Follow-up Required"
                      checked={noteOutcome === "Follow-up Required"}
                      onChange={(e) => setNoteOutcome(e.target.value)}
                      className="accent-[var(--seller-primary)]"
                    />
                    <span>⏰ Follow-up Required</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="outcome"
                      value="Not Interested"
                      checked={noteOutcome === "Not Interested"}
                      onChange={(e) => setNoteOutcome(e.target.value)}
                      className="accent-red-600"
                    />
                    <span>🚫 Not Interested</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNoteModalEnquiry(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--seller-border)] font-semibold text-[var(--seller-text-muted)] text-xs hover:text-[var(--seller-text)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          SCHEDULE FOLLOW-UP MODAL
      ===================================================== */}
      {followUpModalEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 text-[var(--seller-text)]">
            <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
              Schedule Follow-up
            </h3>
            <p className="text-xs text-[var(--seller-text-muted)] mt-1">
              Set a reminder to contact {followUpModalEnquiry?.Name}
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                    Follow-up Date
                  </label>
                  <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                    Follow-up Time
                  </label>
                  <input type="time" value={followUpTime} onChange={(e) => setFollowUpTime(e.target.value)} className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Reminder Type
                </label>
                <select value={reminderType} onChange={(e) => setReminderType(e.target.value)} className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-semibold text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]">
                  <option value="Call">Call</option>
                  <option value="Message">Message</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Note / Reminder
                </label>
                <input type="text" value={followUpNote} onChange={(e) => setFollowUpNote(e.target.value)} placeholder="Confirm site visit and finalize price..." className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]" />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setFollowUpModalEnquiry(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--seller-border)] font-semibold text-[var(--seller-text-muted)] text-xs hover:text-[var(--seller-text)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleScheduleFollowUp}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90"
                >
                  Schedule Follow-up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MARK AS NOT INTERESTED MODAL
      ===================================================== */}
      {notInterestedModalEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 text-[var(--seller-text)]">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto mb-3">
              🚫
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
              Mark as Not Interested?
            </h3>

            <p className="text-xs text-[var(--seller-text-muted)] mt-1">
              This enquiry will be moved to Closed Enquiries.
            </p>

            <div className="mt-4 space-y-3 text-left text-sm">
              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Reason
                </label>
                <select
                  value={notInterestedReason}
                  onChange={(e) => setNotInterestedReason(e.target.value)}
                  className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-semibold text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                >
                  <option value="Price is high">Price is high</option>
                  <option value="Location mismatch">Location mismatch</option>
                  <option value="Found another property">Found another property</option>
                  <option value="Not responsive">Not responsive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Additional Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notInterestedNote}
                  onChange={(e) => setNotInterestedNote(e.target.value)}
                  placeholder="Budget is not matching..."
                  className="w-full p-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] text-xs text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)] placeholder:text-[var(--seller-text-subtle)]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setNotInterestedModalEnquiry(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--seller-border)] font-semibold text-[var(--seller-text-muted)] text-xs hover:text-[var(--seller-text)]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleMarkNotInterested}
                  disabled={actionLoadingId === (notInterestedModalEnquiry?.documentId || notInterestedModalEnquiry?.id)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition disabled:opacity-50"
                >
                  {actionLoadingId === (notInterestedModalEnquiry?.documentId || notInterestedModalEnquiry?.id)
                    ? "Updating..."
                    : "Mark as Not Interested"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ARCHIVE ENQUIRY MODAL
      ===================================================== */}
      {archiveModalEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 text-[var(--seller-text)]">
            <div className="w-14 h-14 rounded-full bg-[var(--seller-bg)] text-[var(--seller-text)] border border-[var(--seller-border)] flex items-center justify-center text-2xl mx-auto mb-3">
              📦
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
              Archive Enquiry?
            </h3>

            <p className="text-xs text-[var(--seller-text-muted)] mt-1">
              This enquiry will be moved to the Archived section under Closed Enquiries.
            </p>

            <div className="mt-4 space-y-3 text-left text-sm">
              <div>
                <label className="block text-xs font-bold text-[var(--seller-text)] mb-1">
                  Reason for Archiving
                </label>
                <select
                  value={archiveReason}
                  onChange={(e) => setArchiveReason(e.target.value)}
                  className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3 text-xs font-semibold text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]"
                >
                  <option value="Archived by Owner">Archived by Owner</option>
                  <option value="Deal completed elsewhere">Deal completed elsewhere</option>
                  <option value="Property no longer available">Property no longer available</option>
                  <option value="Inactive for too long">Inactive for too long</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setArchiveModalEnquiry(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--seller-border)] font-semibold text-[var(--seller-text-muted)] text-xs hover:text-[var(--seller-text)]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleArchiveEnquiry}
                  disabled={actionLoadingId === (archiveModalEnquiry?.documentId || archiveModalEnquiry?.id)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition disabled:opacity-50"
                >
                  {actionLoadingId === (archiveModalEnquiry?.documentId || archiveModalEnquiry?.id)
                    ? "Archiving..."
                    : "Confirm Archive"}
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 overflow-hidden text-[var(--seller-text)]">
            
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
                              setSelectedEnquiry(enq);
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