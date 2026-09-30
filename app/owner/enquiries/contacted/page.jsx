"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../Footer";
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
  // Contacted status bucket includes: Contacted, Interested, Follow-up Required, Site Visit Pending
  const contactedBucket = useMemo(() => {
    return allEnquiries.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return (
        s === "contacted" ||
        s === "interested" ||
        s === "follow-up required" ||
        s === "followup required" ||
        s === "site visit pending"
      );
    });
  }, [allEnquiries]);

  // Metric 1: Total Contacted
  const countTotalContacted = contactedBucket.length;

  // Metric 2: Follow-ups Due
  const countFollowUpsDue = useMemo(() => {
    return allEnquiries.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "follow-up required" || s === "followup required" || Boolean(item?.FollowUpDate);
    }).length;
  }, [allEnquiries]);

  // Metric 3: Site Visit Pending
  const countSiteVisitPending = useMemo(() => {
    return allEnquiries.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "site visit pending";
    }).length;
  }, [allEnquiries]);

  // Metric 4: Converted
  const countConverted = useMemo(() => {
    return allEnquiries.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "converted" || s === "closed";
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
    "Interested",
    "Follow-up Required",
    "Site Visit Pending",
  ];

  // =====================================================
  // CARD FILTER LABELS (for empty-state messaging)
  // =====================================================
  const cardFilterLabel = {
    all: "All Contacted",
    "follow-ups": "Follow-ups Due",
    "site-visit": "Site Visit Pending",
    converted: "Converted",
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
    } else if (cardFilter === "site-visit") {
      result = result.filter((item) => {
        const s = getStatus(item).toLowerCase();
        // Site Visit Pending = status is "site visit pending"
        return s === "site visit pending";
      });
    } else if (cardFilter === "converted") {
      result = result.filter((item) => {
        const s = getStatus(item).toLowerCase();
        // Converted = existing project logic: "converted" or "closed"
        return s === "converted" || s === "closed";
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

      // Normalize status values to match actual Strapi enum (some have whitespace quirks in schema)
      let mappedStatus = newStatus;
      if (newStatus === "Confirmed") mappedStatus = " Confirmed";
      if (newStatus === "Cancelled") mappedStatus = "Cancelled ";

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
              Statuss: newStatus,
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
          Statuss: newStatus,
          ...extraFields,
        };
      });

      return true;
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
      setSuccessMessage("");
      alert(err?.message || "Failed to update enquiry. Please try again.");
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
      alert("Please select a follow-up date.");
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
    const success = await updateEnquiryStatusInStrapi(docId, "Closed", {
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

  // Action: Move to Site Visit
  async function handleMoveToSiteVisit(enquiry) {
    const docId = enquiry?.documentId || enquiry?.id;
    const success = await updateEnquiryStatusInStrapi(docId, "Site Visit");
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
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-1">
              <span>Enquiries</span>
              <span>›</span>
              <span>Contacted Enquiries</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">
              Contacted Enquiries
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Enquiries you have already contacted and are following up on.
            </p>

            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="inline-block w-10 h-10 border-4 border-[#064d3b] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#064d3b] font-semibold mt-4">
                Loading contacted enquiries...
              </p>
              <p className="text-gray-500 text-sm mt-1">
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
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-1">
              <span>Enquiries</span>
              <span>›</span>
              <span>Contacted Enquiries</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">
              Contacted Enquiries
            </h1>

            <div className="mt-8 bg-white rounded-2xl border border-red-200 p-10 text-center shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl font-bold mb-3">
                ⚠️
              </div>

              <h2 className="text-xl font-bold text-red-700">
                Unable to load contacted enquiries
              </h2>

              <p className="text-gray-600 mt-2 max-w-md mx-auto text-sm sm:text-base">
                Something went wrong while loading your enquiries. Please try again.
              </p>

              <p className="text-xs font-mono bg-red-50 text-red-800 p-2 rounded mt-3 max-w-lg mx-auto overflow-x-auto">
                {error}
              </p>

              <button
                type="button"
                onClick={loadEnquiries}
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
  // MAIN CONTACTED ENQUIRIES PAGE UI
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

          {/* BREADCRUMB & PAGE HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-1">
              <Link href="/owner/enquiries" className="hover:underline">
                Enquiries
              </Link>
              <span>›</span>
              <span>Contacted Enquiries</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">
              Contacted Enquiries
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Enquiries you have already contacted and are following up on.
            </p>
          </div>

          {/* 1. TOP SUMMARY CARDS — each card is a same-page filter button */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8">

            {/* Card 1: Total Contacted — default/all filter */}
            <button
              type="button"
              onClick={() => setCardFilter("all")}
              className={`bg-white rounded-2xl border-2 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between text-left w-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064d3b]/50 ${
                cardFilter === "all"
                  ? "border-[#064d3b] ring-2 ring-[#064d3b]/10 bg-[#f0f7f4]"
                  : "border-[#064d3b] hover:shadow-md hover:bg-[#f6fbf8]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#e6f2ed] text-[#064d3b] flex items-center justify-center text-lg font-bold">
                  📞
                </div>
                <span className="text-[10px] font-bold text-[#064d3b] bg-[#e6f2ed] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {cardFilter === "all" ? "Active" : "All"}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Contacted
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#064d3b] mt-0.5">
                  {countTotalContacted}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {cardFilter === "all" ? "Showing all →" : "All contacted enquiries"}
                </p>
              </div>
            </button>

            {/* Card 2: Follow-ups Due */}
            <button
              type="button"
              onClick={() => setCardFilter(cardFilter === "follow-ups" ? "all" : "follow-ups")}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between text-left w-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c99838]/50 ${
                cardFilter === "follow-ups"
                  ? "border-[#c99838] ring-2 ring-[#c99838]/20 bg-[#fffdf6]"
                  : "border-gray-200 hover:border-[#c99838] hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#fef6e7] text-[#c99838] flex items-center justify-center text-lg font-bold">
                  ⏰
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Follow-ups Due
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countFollowUpsDue}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {cardFilter === "follow-ups" ? "Showing due ↑" : "Need your follow-up"}
                </p>
              </div>
            </button>

            {/* Card 3: Site Visit Pending */}
            <button
              type="button"
              onClick={() => setCardFilter(cardFilter === "site-visit" ? "all" : "site-visit")}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between text-left w-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300/50 ${
                cardFilter === "site-visit"
                  ? "border-purple-400 ring-2 ring-purple-100 bg-purple-50/30"
                  : "border-gray-200 hover:border-purple-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg font-bold">
                  📅
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Site Visit Pending
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countSiteVisitPending}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {cardFilter === "site-visit" ? "Showing pending ↑" : "Visits to be scheduled"}
                </p>
              </div>
            </button>

            {/* Card 4: Converted */}
            <button
              type="button"
              onClick={() => setCardFilter(cardFilter === "converted" ? "all" : "converted")}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between text-left w-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300/50 ${
                cardFilter === "converted"
                  ? "border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50/30"
                  : "border-gray-200 hover:border-emerald-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">
                  ✅
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Converted
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countConverted}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {cardFilter === "converted" ? "Showing converted ↑" : "Successfully converted"}
                </p>
              </div>
            </button>

          </div>

          {/* 2. SEARCH & FILTER BAR */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 mb-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">

              {/* Search */}
              <div className="relative lg:col-span-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, phone, property..."
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

              {/* Purpose filter */}
              <div>
                <select
                  value={purposeFilter}
                  onChange={(e) => setPurposeFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition cursor-pointer"
                >
                  {purposeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition cursor-pointer"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition cursor-pointer font-medium"
                >
                  <option value="Latest Contacted">Latest Contacted</option>
                  <option value="Follow-up Date">Follow-up Date</option>
                  <option value="Property">Property</option>
                  <option value="Name">Name</option>
                </select>
              </div>

            </div>
          </div>

          {/* 3. RESULTS COUNTER */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#064d3b]">
                {cardFilterLabel[cardFilter] ?? "Contacted Customers"}
              </h2>
              <span className="text-xs font-extrabold bg-[#064d3b] text-white px-2.5 py-0.5 rounded-full">
                {filteredAndSortedEnquiries.length}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-500">
              {filteredAndSortedEnquiries.length === 1 ? "1 enquiry" : `${filteredAndSortedEnquiries.length} enquiries`}
              {cardFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setCardFilter("all")}
                  className="ml-2 text-[#c99838] font-semibold hover:underline"
                >
                  ✕ Clear
                </button>
              )}
            </p>
          </div>

          {/* 4. CONTACTED ENQUIRY LIST (CARDS) */}
          <div className="space-y-4">
            {filteredAndSortedEnquiries.length === 0 ? (
              /* EMPTY STATE */
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#f2ead7] flex items-center justify-center text-3xl mb-4">
                  📞
                </div>

                <h3 className="text-xl font-bold text-[#064d3b]">
                  No {cardFilterLabel[cardFilter] ?? "Contacted"} Enquiries
                </h3>

                <p className="text-gray-500 text-sm sm:text-base mt-1 max-w-md mx-auto">
                  {cardFilter === "all"
                    ? "You don't have any contacted enquiries matching your criteria."
                    : `No enquiries match the "${cardFilterLabel[cardFilter]}" filter.`}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {cardFilter !== "all" && (
                    <button
                      type="button"
                      onClick={() => setCardFilter("all")}
                      className="px-5 py-2.5 rounded-xl bg-[#064d3b] text-white text-sm font-semibold hover:bg-[#053d30] transition shadow"
                    >
                      Show All Contacted
                    </button>
                  )}

                  <Link
                    href="/owner/enquiries/new"
                    className="px-5 py-2.5 rounded-xl border border-[#064d3b] text-[#064d3b] text-sm font-semibold hover:bg-[#f0f7f4] transition"
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
                      className="px-5 py-2.5 rounded-xl border border-[#c99838] text-[#064d3b] text-sm font-semibold hover:bg-[#faf4e5] transition"
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

                // Dynamic Status Badge Color
                let statusBadgeStyle = "bg-amber-100 text-amber-800 border-amber-200";
                if (status.toLowerCase() === "interested") {
                  statusBadgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200";
                } else if (status.toLowerCase().includes("follow")) {
                  statusBadgeStyle = "bg-amber-100 text-amber-900 border-amber-300";
                } else if (status.toLowerCase().includes("visit")) {
                  statusBadgeStyle = "bg-purple-100 text-purple-800 border-purple-200";
                }

                return (
                  <div
                    key={docId}
                    className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[#c99838]/40 transition relative"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.9fr_auto] gap-5 items-center">

                      {/* CUSTOMER SECTION */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#fef6e7] text-[#c99838] flex items-center justify-center font-black text-lg flex-shrink-0 border border-[#f5e4c3]">
                          {initials}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-base sm:text-lg text-[#064d3b]">
                              {name}
                            </h3>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusBadgeStyle}`}>
                              {status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <span>☎</span> {phone}
                          </p>

                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                            <span>✉</span> {email}
                          </p>
                        </div>
                      </div>

                      {/* PROPERTY SECTION */}
                      <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Interested in
                        </p>

                        <h4 className="font-bold text-sm sm:text-base text-[#064d3b] mt-0.5 line-clamp-1">
                          {propTitle}
                        </h4>

                        <p className="text-xs text-gray-500 mt-1">
                          📍 {[propArea, propCity].filter(Boolean).join(", ") || "Location not specified"}
                        </p>

                        {propPrice && (
                          <p className="text-xs sm:text-sm font-bold text-[#c99838] mt-1">
                            {propPrice}
                          </p>
                        )}
                      </div>

                      {/* TIMELINE & FOLLOW-UP */}
                      <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Contacted On
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 mt-0.5">
                          {formattedContactedDate}
                        </p>

                        {followUpDateStr && (
                          <>
                            <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mt-2">
                              Follow-up On
                            </p>
                            <p className="text-xs sm:text-sm font-bold text-amber-800">
                              {followUpDateStr}
                            </p>
                          </>
                        )}
                      </div>

                      {/* ACTION BUTTONS & MORE MENU */}
                      <div className="flex sm:flex-row lg:flex-col gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 lg:min-w-[140px] relative">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="flex-1 lg:w-full px-4 py-2.5 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold text-xs sm:text-sm hover:bg-[#c99838] transition shadow-sm"
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
                                  setSelectedEnquiry(enquiry);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-[#faf8f5] hover:text-[#064d3b] transition"
                              >
                                👁️ View Details
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setNoteModalEnquiry(enquiry);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-[#faf8f5] hover:text-[#064d3b] transition"
                              >
                                📝 Add Contact Note
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setFollowUpModalEnquiry(enquiry);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-[#faf8f5] hover:text-[#064d3b] transition"
                              >
                                📅 Schedule Follow-up
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  updateEnquiryStatusInStrapi(docId, "Interested");
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-[#faf8f5] hover:text-emerald-700 transition"
                              >
                                ⭐ Mark as Interested
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  handleMoveToSiteVisit(enquiry);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-[#faf8f5] hover:text-purple-700 transition"
                              >
                                🚗 Move to Site Visit
                              </button>

                              <hr className="my-1 border-gray-100" />

                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setNotInterestedModalEnquiry(enquiry);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition"
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

        </div>
      </main>

      {/* =====================================================
          ENQUIRY DETAILS MODAL / DRAWER
      ===================================================== */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-base transition"
            >
              ✕
            </button>

            {/* Header / Customer Banner */}
            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#fef6e7] text-[#c99838] flex items-center justify-center font-black text-2xl border border-[#f5e4c3]">
                {(selectedEnquiry?.Name || "U")[0]}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#064d3b]">
                  {selectedEnquiry?.Name || selectedEnquiry?.name || "Customer Details"}
                </h3>
                <p className="text-xs text-gray-500">
                  ☎ {selectedEnquiry?.Phone} | ✉ {selectedEnquiry?.Email}
                </p>
              </div>

              <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                {getStatus(selectedEnquiry)}
              </span>
            </div>

            {/* Grid Layout: Left Details, Right Actions & Property */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column: Customer & Property Details */}
              <div className="lg:col-span-2 space-y-5 text-sm">

                {/* Customer Details Box */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Customer Requirements
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-400 block text-xs">Preferred Location</span>
                      <span className="font-bold text-gray-800">
                        {getPropertyCity(selectedEnquiry) || "Pune"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-xs">Purpose</span>
                      <span className="font-bold text-gray-800">
                        {getPropertyPurpose(selectedEnquiry)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-xs">Property Type</span>
                      <span className="font-bold text-gray-800">
                        {getPropertyType(selectedEnquiry)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enquired Property Box */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
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
                      <h5 className="font-bold text-base text-[#064d3b]">
                        {getPropertyName(selectedEnquiry)}
                      </h5>

                      <p className="text-xs text-gray-600">
                        📍 {[getPropertyArea(selectedEnquiry), getPropertyCity(selectedEnquiry)].filter(Boolean).join(", ")}
                      </p>

                      {getPropertyPrice(selectedEnquiry) && (
                        <p className="text-sm font-extrabold text-[#c99838] pt-1">
                          {getPropertyPrice(selectedEnquiry)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enquiry Message */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Enquiry Message
                  </h4>
                  <p className="text-gray-700 bg-white p-3 rounded-xl border border-gray-100 italic">
                    "{selectedEnquiry?.Message || selectedEnquiry?.message || "No message provided."}"
                  </p>
                </div>

                {/* Contact History */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Contact History
                  </h4>

                  <div className="space-y-3 pl-2">
                    {getContactHistory(selectedEnquiry).map((item, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-emerald-500 pb-2">
                        <span className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-emerald-600"></span>
                        <p className="text-xs font-bold text-gray-500">{item.date}</p>
                        <p className="font-bold text-gray-800 text-xs sm:text-sm">{item.title}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Quick Actions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Quick Actions
                </h4>

                {selectedEnquiry?.Phone && (
                  <a
                    href={`tel:${selectedEnquiry.Phone}`}
                    className="w-full text-center px-4 py-3 rounded-xl bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 transition block shadow-sm"
                  >
                    📞 Call Customer
                  </a>
                )}

                {selectedEnquiry?.Email && (
                  <a
                    href={`mailto:${selectedEnquiry.Email}`}
                    className="w-full text-center px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 font-bold text-sm hover:bg-gray-50 transition block shadow-xs"
                  >
                    ✉ Send Message
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setNoteModalEnquiry(selectedEnquiry)}
                  className="w-full px-4 py-3 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold text-sm hover:bg-[#c99838] transition block shadow-xs"
                >
                  📝 Add Contact Note
                </button>

                <button
                  type="button"
                  onClick={() => setFollowUpModalEnquiry(selectedEnquiry)}
                  className="w-full px-4 py-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 font-bold text-sm hover:bg-purple-100 transition block"
                >
                  📅 Schedule Follow-up
                </button>

                <button
                  type="button"
                  onClick={() => handleMoveToSiteVisit(selectedEnquiry)}
                  className="w-full px-4 py-3 rounded-xl bg-[#064d3b] text-white font-bold text-sm hover:bg-[#053d30] transition block"
                >
                  🚗 Move to Site Visit
                </button>

                <button
                  type="button"
                  onClick={() => setNotInterestedModalEnquiry(selectedEnquiry)}
                  className="w-full px-4 py-3 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition block"
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <h3 className="text-xl font-bold text-[#064d3b]">
              Contact with Customer
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {noteModalEnquiry?.Name} (☎ {noteModalEnquiry?.Phone})
            </p>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Add Note
                </label>
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Spoke with customer. She liked the flat and wants to visit on Saturday morning..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#064d3b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Outcome of Conversation
                </label>
                <div className="space-y-2 text-xs font-semibold text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="outcome"
                      value="Interested"
                      checked={noteOutcome === "Interested"}
                      onChange={(e) => setNoteOutcome(e.target.value)}
                      className="accent-[#064d3b]"
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
                      className="accent-[#064d3b]"
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
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold hover:bg-[#c99838]"
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <h3 className="text-xl font-bold text-[#064d3b]">
              Schedule Follow-up
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Set a reminder to contact {followUpModalEnquiry?.Name}
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Follow-up Time
                  </label>
                  <input
                    type="time"
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reminder Type
                </label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                >
                  <option value="Call">Call</option>
                  <option value="Message">Message</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Note / Reminder
                </label>
                <input
                  type="text"
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  placeholder="Confirm site visit and finalize price..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#064d3b]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setFollowUpModalEnquiry(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleScheduleFollowUp}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold hover:bg-[#c99838]"
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto mb-3">
              🚫
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Mark as Not Interested?
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              This enquiry will be moved to Closed Enquiries.
            </p>

            <div className="mt-4 space-y-3 text-left text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Reason
                </label>
                <select
                  value={notInterestedReason}
                  onChange={(e) => setNotInterestedReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-red-500"
                >
                  <option value="Price is high">Price is high</option>
                  <option value="Location mismatch">Location mismatch</option>
                  <option value="Found another property">Found another property</option>
                  <option value="Not responsive">Not responsive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Additional Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notInterestedNote}
                  onChange={(e) => setNotInterestedNote(e.target.value)}
                  placeholder="Budget is not matching..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setNotInterestedModalEnquiry(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleMarkNotInterested}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700"
                >
                  Mark as Not Interested
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