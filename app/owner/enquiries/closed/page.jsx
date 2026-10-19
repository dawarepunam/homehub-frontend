"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../Footer";
import {
  Search,
  Tag,
  ArrowUpDown,
  ChevronDown,
  X,
  MessageSquare,
  ArrowLeft,
  Filter,
  History,
  Clock,
  Archive,
  RefreshCw,
  Eye,
  Phone,
  Mail,
} from "lucide-react";
import {
  getOwnerEnquiries,
  updateOwnerEnquiryStatus,
} from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function ClosedEnquiriesPage() {
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
  const [sortBy, setSortBy] = useState("Latest Closed");

  // Summary filter chips — controls which category is active
  // Values: "all" | "not-interested" | "converted" | "archived"
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modals & Action Drawer state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // History modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("All Status");
  const [historyPropertyFilter, setHistoryPropertyFilter] = useState("All Properties");

  // =====================================================
  // FETCH ENQUIRIES FROM STRAPI API
  // =====================================================
  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      const data = await getOwnerEnquiries();
      setAllEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("CLOSED ENQUIRIES ERROR:", err);
      setError(err?.message || "Unable to load closed enquiries");
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

  // Lock background body scroll when any modal is open to prevent duplicate competing scrollbars
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      selectedEnquiry ||
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
    selectedEnquiry,
    historyModalOpen,
  ]);

  // =====================================================
  // HELPER FUNCTIONS FOR STRAPI DATA PARSING
  // =====================================================
  function getStatus(item) {
    return String(
      item?.Status || item?.status || item?.Statuss || "Pending"
    ).trim();
  }

  function isClosedItem(item) {
    const s = getStatus(item).toLowerCase();
    return (
      s === "closed" ||
      s === "not interested" ||
      s === "notinterested" ||
      s === "converted" ||
      s === "archived"
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
        title: item?.ClosedReason ? `Closed: ${item.ClosedReason}` : "Status Changed",
        note: item?.OwnerNote || item?.OwnerResponse || item?.Message || "Enquiry archived or closed.",
      });
    }
    return history;
  }

  // =====================================================
  // FILTERED LIST & CALCULATED METRICS
  // =====================================================
  const closedBucket = useMemo(() => {
    return allEnquiries.filter(isClosedItem);
  }, [allEnquiries]);

  // Tab Counts (matches Contacted and New pages with real Strapi data)
  const countNewEnquiries = useMemo(() => {
    return allEnquiries.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "new" || s === "pending";
    }).length;
  }, [allEnquiries]);

  const countContactedEnquiries = useMemo(() => {
    return allEnquiries.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return (
        s === "contacted" ||
        s === "follow-up required" ||
        s === "followup required"
      );
    }).length;
  }, [allEnquiries]);

  // Category counts from real Strapi data
  const countTotalClosed = closedBucket.length;

  const countNotInterested = useMemo(() => {
    return closedBucket.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "not interested" || s === "notinterested";
    }).length;
  }, [closedBucket]);

  const countConverted = useMemo(() => {
    return closedBucket.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "converted";
    }).length;
  }, [closedBucket]);

  const countArchived = useMemo(() => {
    return closedBucket.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "closed" || s === "archived";
    }).length;
  }, [closedBucket]);

  // Dynamic dropdown options
  const propertyOptions = useMemo(() => {
    const names = closedBucket.map(getPropertyName).filter(Boolean);
    return ["All Properties", ...Array.from(new Set(names))];
  }, [closedBucket]);

  const purposeOptions = useMemo(() => {
    const purposes = closedBucket.map(getPropertyPurpose).filter(Boolean);
    return ["All Purposes", ...Array.from(new Set(purposes))];
  }, [closedBucket]);

  const statusOptions = [
    "All Status",
    "Not Interested",
    "Converted",
    "Closed",
    "Archived",
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
    "Archived",
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

  // Category labels for chip and title display
  const categoryLabels = {
    all: "All Closed",
    "not-interested": "Not Interested",
    converted: "Converted",
    archived: "Archived",
  };

  // Applied Filtering and Sorting logic
  const filteredAndSortedEnquiries = useMemo(() => {
    let result = [...closedBucket];

    // Stage 1: Chip category filter
    if (categoryFilter === "not-interested") {
      result = result.filter((item) => {
        const s = getStatus(item).toLowerCase();
        return s === "not interested" || s === "notinterested";
      });
    } else if (categoryFilter === "converted") {
      result = result.filter((item) => getStatus(item).toLowerCase() === "converted");
    } else if (categoryFilter === "archived") {
      result = result.filter((item) => {
        const s = getStatus(item).toLowerCase();
        return s === "closed" || s === "archived";
      });
    }

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
      const timeA = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
      const timeB = new Date(b?.updatedAt || b?.createdAt || 0).getTime();

      if (sortBy === "Latest Closed") {
        return timeB - timeA;
      }
      if (sortBy === "Oldest Closed") {
        return timeA - timeB;
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
  }, [closedBucket, categoryFilter, search, propertyFilter, purposeFilter, statusFilter, dateFilter, sortBy]);

  // =====================================================
  // STRAPI ACTION HANDLERS
  // =====================================================
  async function handleReopenEnquiry(enquiry) {
    const docId = enquiry?.documentId || enquiry?.id;
    if (!docId) return;

    try {
      setActionLoadingId(docId);

      // Reopen returns the existing enquiry to Pending (New) in Strapi without creating duplicates
      await updateOwnerEnquiryStatus(docId, "Pending");

      setAllEnquiries((prev) =>
        prev.map((item) => {
          const currentId = item?.documentId || item?.id;
          if (String(currentId) === String(docId)) {
            return {
              ...item,
              Status: "Pending",
              status: "Pending",
              Statuss: "Pending",
            };
          }
          return item;
        })
      );

      setSuccessMessage(`Enquiry from ${enquiry?.Name || "Customer"} reopened and returned to New Enquiries!`);
      if (selectedEnquiry && String(selectedEnquiry?.documentId || selectedEnquiry?.id) === String(docId)) {
        setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error("REOPEN ERROR:", err);
      alert(err?.message || "Failed to reopen enquiry.");
    } finally {
      setActionLoadingId(null);
    }
  }

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
              <MessageSquare size={12} strokeWidth={2} />
              <span>Seller Portal</span>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
              Enquiries
            </h1>

            <p className="mt-2.5 text-sm text-[var(--seller-text-muted)] sm:text-base sm:leading-relaxed">
              View enquiries that are no longer active.
            </p>
          </header>

          <div className="seller-card p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--seller-border-focus)] border-t-transparent" />
            <p className="mt-4 text-sm font-semibold text-[var(--seller-text)]">
              Loading closed enquiries...
            </p>
            <p className="mt-1 text-xs text-[var(--seller-text-muted)]">
              Syncing live records from Strapi backend.
            </p>
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
              <MessageSquare size={12} strokeWidth={2} />
              <span>Seller Portal</span>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
              Enquiries
            </h1>
          </header>

          <div className="seller-card p-10 text-center border-red-500/20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-3 text-xl">
              ⚠️
            </div>

            <h2 className="text-lg font-bold text-[var(--seller-text)]">
              Unable to load closed enquiries
            </h2>

            <p className="mt-1.5 text-xs sm:text-sm text-[var(--seller-text-muted)] max-w-md mx-auto">
              Something went wrong while loading your closed enquiries. Please check connection and try again.
            </p>

            <p className="mt-3 inline-block max-w-lg overflow-x-auto rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg)] p-2 font-mono text-[11px] text-[var(--seller-text-muted)]">
              {error}
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={loadEnquiries}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--seller-primary)] px-5 py-2.5 text-xs font-bold text-[var(--seller-bg)] transition hover:opacity-90"
              >
                <RefreshCw size={13} />
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
  // MAIN CLOSED ENQUIRIES PAGE UI
  // =====================================================
  return (
    <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
      <Header />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">

        {/* TOAST NOTIFICATION */}
        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-[var(--seller-border-focus)] bg-[var(--seller-surface)] p-3.5 shadow-sm text-xs font-semibold text-[var(--seller-text)] animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--seller-primary)] text-[var(--seller-bg)] text-[10px] font-black">
                ✓
              </span>
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
            View enquiries that are no longer active.
          </p>
        </header>

        {/* Tab switcher: New, Contacted, Closed */}
        <div className="mb-6 flex justify-center overflow-x-auto pb-1">
          <div className="inline-flex rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-1 shadow-xs">
            {[
              { label: `New (${countNewEnquiries})`, href: "/owner/enquiries/new", active: false },
              { label: `Contacted (${countContactedEnquiries})`, href: "/owner/enquiries/contacted", active: false },
              { label: `Closed (${countTotalClosed})`, href: "/owner/enquiries/closed", active: true },
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

        {/* Compact Filter Chips for Closed Categories */}
        <div className="mb-6 flex justify-center overflow-x-auto pb-1">
          <div className="inline-flex gap-2">
            {[
              { id: "all", label: `All Closed (${countTotalClosed})` },
              { id: "not-interested", label: `Not Interested (${countNotInterested})` },
              { id: "converted", label: `Converted (${countConverted})` },
              { id: "archived", label: `Archived (${countArchived})` },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setCategoryFilter(chip.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition border ${
                  categoryFilter === chip.id
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
                <option value="Latest Closed">Latest Closed</option>
                <option value="Oldest Closed">Oldest Closed</option>
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

        {/* 3. RESULTS COUNTER — Restrained Monochrome GetSiteGo Polish */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-[var(--seller-text)] tracking-tight">
              {categoryLabels[categoryFilter] ?? "Closed Enquiries"}
            </h2>
            <span className="text-[11px] font-semibold bg-[var(--seller-surface)] text-[var(--seller-text)] border border-[var(--seller-border)] px-2.5 py-0.5 rounded-full shadow-2xs">
              {filteredAndSortedEnquiries.length}
            </span>
          </div>

          <p className="text-xs text-[var(--seller-text-muted)]">
            {filteredAndSortedEnquiries.length === 1 ? "1 enquiry" : `${filteredAndSortedEnquiries.length} enquiries`}
            {categoryFilter !== "all" && (
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className="ml-2 font-semibold text-[var(--seller-text)] hover:underline"
              >
                ✕ Clear
              </button>
            )}
          </p>
        </div>

        {/* 4. CLOSED ENQUIRY LIST (CARDS) */}
        <div className="space-y-3.5">
          {filteredAndSortedEnquiries.length === 0 ? (
            /* REDESIGNED PREMIUM EMPTY STATE — Clean, Balanced, GetSiteGo Style */
            <div className="seller-card p-8 sm:p-10 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-bg)] text-[var(--seller-text-muted)] flex items-center justify-center mb-3.5 shadow-2xs">
                <Archive size={20} strokeWidth={1.8} />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
                No {categoryLabels[categoryFilter] ?? "Closed"} Enquiries
              </h3>

              <p className="text-[var(--seller-text-muted)] text-xs sm:text-sm mt-1 max-w-sm mx-auto leading-relaxed">
                {categoryFilter === "all"
                  ? "You don't have any closed or inactive enquiries matching your current filters."
                  : `No enquiries match the "${categoryLabels[categoryFilter]}" category filter.`}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                {categoryFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setCategoryFilter("all")}
                    className="px-4 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] text-xs font-semibold transition hover:opacity-90 shadow-2xs"
                  >
                    Show All Closed
                  </button>
                )}

                <Link
                  href="/owner/enquiries/contacted"
                  className="px-4 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] text-xs font-semibold transition hover:opacity-90 shadow-2xs"
                >
                  View Contacted Enquiries
                </Link>

                {(search || propertyFilter !== "All Properties" || purposeFilter !== "All Purposes" || statusFilter !== "All Status") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPropertyFilter("All Properties");
                      setPurposeFilter("All Purposes");
                      setStatusFilter("All Status");
                    }}
                    className="px-4 py-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] text-xs font-semibold hover:border-[var(--seller-border-focus)] transition shadow-2xs"
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

              const closedDate = enquiry?.updatedAt || enquiry?.createdAt;
              const formattedClosedDate = closedDate
                ? new Date(closedDate).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Date unavailable";

              const initials = name
                .split(" ")
                .filter(Boolean)
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "U";

              const isDropdownOpen = activeDropdownId === docId;
              const isActionLoading = actionLoadingId === docId;

              // Restrained, readable status badge styling
              let statusBadgeStyle = "bg-[var(--seller-bg)] text-[var(--seller-text-muted)] border-[var(--seller-border)]";
              const sLower = status.toLowerCase();
              if (sLower === "converted") {
                statusBadgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
              } else if (sLower === "not interested" || sLower === "notinterested") {
                statusBadgeStyle = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
              }

              return (
                <div
                  key={docId}
                  className="seller-card p-4 sm:p-5 transition hover:border-[var(--seller-border-focus)] relative"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.9fr_auto] gap-4 sm:gap-5 items-center">

                    {/* CUSTOMER SECTION */}
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0 border border-[var(--seller-border)]">
                        {initials}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm sm:text-base text-[var(--seller-text)]">
                            {name}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusBadgeStyle}`}>
                            {status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--seller-text-muted)] mt-1 flex items-center gap-1.5">
                          <Phone size={12} className="text-[var(--seller-text-subtle)]" />
                          <span>{phone}</span>
                        </p>

                        <p className="text-xs text-[var(--seller-text-muted)] mt-0.5 flex items-center gap-1.5">
                          <Mail size={12} className="text-[var(--seller-text-subtle)]" />
                          <span>{email}</span>
                        </p>
                      </div>
                    </div>

                    {/* PROPERTY SECTION */}
                    <div className="border-t lg:border-t-0 lg:border-l border-[var(--seller-border)] pt-3 lg:pt-0 lg:pl-5">
                      <p className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider">
                        Enquired Property
                      </p>

                      <h4 className="font-bold text-xs sm:text-sm text-[var(--seller-text)] mt-0.5 line-clamp-1">
                        {propTitle}
                      </h4>

                      <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                        📍 {[propArea, propCity].filter(Boolean).join(", ") || "Location specified"}
                      </p>

                      {propPrice && (
                        <p className="text-xs sm:text-sm font-extrabold text-[var(--seller-text)] mt-1">
                          {propPrice}
                        </p>
                      )}
                    </div>

                    {/* TIMELINE SECTION */}
                    <div className="border-t lg:border-t-0 lg:border-l border-[var(--seller-border)] pt-3 lg:pt-0 lg:pl-5">
                      <p className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider">
                        Closed On
                      </p>
                      <p className="text-xs font-medium text-[var(--seller-text)] mt-0.5">
                        {formattedClosedDate}
                      </p>

                      {enquiry?.ClosedReason && (
                        <p className="text-xs text-[var(--seller-text-muted)] mt-1 italic">
                          Reason: <span className="text-[var(--seller-text)]">{enquiry.ClosedReason}</span>
                        </p>
                      )}
                    </div>

                    {/* ACTION BUTTONS & MORE MENU — Refined Monochrome Styling */}
                    <div className="flex sm:flex-row lg:flex-col gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--seller-border)] lg:min-w-[130px] relative">
                      <button
                        type="button"
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="flex-1 lg:w-full px-3.5 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition shadow-2xs"
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
                          className="w-full px-3 py-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <span>More</span>
                          <span>⋮</span>
                        </button>

                        {/* Dropdown Menu Popup */}
                        {isDropdownOpen && (
                          <div className="absolute right-0 top-full mt-1.5 w-52 bg-[var(--seller-surface)] rounded-2xl border border-[var(--seller-border)] shadow-xl z-30 py-1.5 text-xs font-semibold text-[var(--seller-text)] animate-in fade-in zoom-in-95 duration-100">
                            <button
                              onClick={() => {
                                setActiveDropdownId(null);
                                setSelectedEnquiry(enquiry);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] transition flex items-center gap-2"
                            >
                              <Eye size={13} className="text-[var(--seller-text-muted)]" />
                              <span>View Details</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveDropdownId(null);
                                handleReopenEnquiry(enquiry);
                              }}
                              disabled={isActionLoading}
                              className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] text-[var(--seller-text)] transition font-bold flex items-center gap-2"
                            >
                              <RefreshCw size={13} className="text-[var(--seller-text-muted)]" />
                              <span>Re-enquiry (Move to New)</span>
                            </button>

                            {enquiry?.Phone && (
                              <a
                                href={`tel:${enquiry.Phone}`}
                                className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] text-[var(--seller-text)] transition flex items-center gap-2"
                              >
                                <Phone size={13} className="text-[var(--seller-text-muted)]" />
                                <span>Call Customer</span>
                              </a>
                            )}

                            {enquiry?.Email && (
                              <a
                                href={`mailto:${enquiry.Email}`}
                                className="w-full text-left px-3.5 py-2 hover:bg-[var(--seller-bg)] text-[var(--seller-text)] transition flex items-center gap-2"
                              >
                                <Mail size={13} className="text-[var(--seller-text-muted)]" />
                                <span>Send Email</span>
                              </a>
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

      </main>

      {/* =====================================================
          CLOSED ENQUIRY DETAILS MODAL / DRAWER
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
              <div className="lg:col-span-2 space-y-4 text-sm">

                {/* Customer Details Box */}
                <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                  <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">
                    Customer Requirements
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-[var(--seller-text-subtle)] block text-xs">Customer Name</span>
                      <span className="font-bold text-[var(--seller-text)]">
                        {selectedEnquiry?.Name || selectedEnquiry?.name || "N/A"}
                      </span>
                    </div>

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
                        className="w-20 h-20 rounded-xl object-cover border border-[var(--seller-border)] shrink-0"
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
                    &ldquo;{selectedEnquiry?.Message || selectedEnquiry?.message || "No message provided."}&rdquo;
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
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-2">
                  Quick Actions
                </h4>

                <button
                  type="button"
                  onClick={() => handleReopenEnquiry(selectedEnquiry)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition block shadow-2xs"
                >
                  🔄 Reopen Enquiry (Move to New)
                </button>

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
                    ✉ Send Email
                  </a>
                )}
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
