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
  History,
  Clock,
  Filter,
} from "lucide-react";
import {
  getOwnerEnquiries,
  markOwnerEnquiryAsContacted,
} from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function NewEnquiriesPage() {
  const router = useRouter();
  const [allOwnerEnquiries, setAllOwnerEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Filters & Sorting state
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [sortBy, setSortBy] = useState("Newest First");

  // Modal / Detail state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [confirmContactedEnquiry, setConfirmContactedEnquiry] = useState(null);

  // History modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("All Status");
  const [historyPropertyFilter, setHistoryPropertyFilter] = useState("All Properties");

  // =====================================================
  // FETCH ENQUIRIES FROM STRAPI
  // =====================================================
  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      console.log("=================================");
      console.log("NEW ENQUIRIES PAGE");
      console.log("Loading owner enquiries from Strapi...");
      console.log("=================================");

      const result = await getOwnerEnquiries();

      console.log("OWNER ENQUIRIES RESULT:", result);
      setAllOwnerEnquiries(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("NEW ENQUIRIES PAGE ERROR:", err);
      setError(err?.message || "Unable to load enquiries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  // Clear toast after 4s
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
      confirmContactedEnquiry ||
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
    confirmContactedEnquiry,
    historyModalOpen,
  ]);

  // =====================================================
  // STATUS HELPERS & CALCULATED COUNTS
  // =====================================================
  function getStatus(item) {
    return String(
      item?.Status || item?.status || item?.Statuss || "Pending"
    ).trim();
  }

  function isNewStatus(item) {
    const status = getStatus(item).toLowerCase();
    return status === "new" || status === "pending";
  }

  function isContactedStatus(item) {
    const status = getStatus(item).toLowerCase();
    return (
      status === "contacted" ||
      status === "follow-up required" ||
      status === "followup required"
    );
  }

  function isSiteVisitStatus(item) {
    const status = getStatus(item).toLowerCase();
    // Must match the actual Strapi enum value: "Site Visit Pending"
    return status === "site visit pending";
  }

  function isClosedStatus(item) {
    const status = getStatus(item).toLowerCase();
    return (
      status === "closed" ||
      status === "not interested" ||
      status === "notinterested" ||
      status === "converted" ||
      status === "archived"
    );
  }

  // Real-time summary counts dynamically derived from all owner enquiries
  const countNew = useMemo(
    () => allOwnerEnquiries.filter(isNewStatus).length,
    [allOwnerEnquiries]
  );
  const countContacted = useMemo(
    () => allOwnerEnquiries.filter(isContactedStatus).length,
    [allOwnerEnquiries]
  );
  const countSiteVisit = useMemo(
    () => allOwnerEnquiries.filter(isSiteVisitStatus).length,
    [allOwnerEnquiries]
  );
  const countClosed = useMemo(
    () => allOwnerEnquiries.filter(isClosedStatus).length,
    [allOwnerEnquiries]
  );

  // Filter out only New / Pending enquiries for this page list
  const newEnquiriesList = useMemo(
    () => allOwnerEnquiries.filter(isNewStatus),
    [allOwnerEnquiries]
  );

  // =====================================================
  // DYNAMIC FILTER DROPDOWNS
  // =====================================================
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

  const propertyOptions = useMemo(() => {
    const titles = newEnquiriesList.map(getPropertyName).filter(Boolean);
    return ["All Properties", ...Array.from(new Set(titles))];
  }, [newEnquiriesList]);

  const cityOptions = useMemo(() => {
    const cities = newEnquiriesList.map(getPropertyCity).filter(Boolean);
    return ["All Cities", ...Array.from(new Set(cities))];
  }, [newEnquiriesList]);

  // =====================================================
  // FILTERING AND SORTING LOGIC
  // =====================================================
  const filteredAndSortedEnquiries = useMemo(() => {
    let result = [...newEnquiriesList];

    // Search query matching against name, phone, email, property title, city
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

    // Property dropdown filter
    if (propertyFilter !== "All Properties") {
      result = result.filter(
        (item) => getPropertyName(item) === propertyFilter
      );
    }

    // City dropdown filter
    if (cityFilter !== "All Cities") {
      result = result.filter(
        (item) => getPropertyCity(item) === cityFilter
      );
    }

    // Sorting
    result.sort((a, b) => {
      const timeA = new Date(a?.createdAt || a?.created_at || 0).getTime();
      const timeB = new Date(b?.createdAt || b?.created_at || 0).getTime();
      return sortBy === "Newest First" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [newEnquiriesList, search, propertyFilter, cityFilter, sortBy]);

  // History property options
  const historyPropertyOptions = useMemo(() => {
    const titles = allOwnerEnquiries.map(getPropertyName).filter(Boolean);
    return ["All Properties", ...Array.from(new Set(titles))];
  }, [allOwnerEnquiries]);

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
    let result = [...allOwnerEnquiries];

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
  }, [allOwnerEnquiries, historySearch, historyPropertyFilter, historyStatusFilter]);

  // =====================================================
  // CONTACT & COMMUNICATION HELPERS
  // =====================================================
  const [actionNotice, setActionNotice] = useState("");

  function getCleanPhone(enquiry) {
    const raw = String(enquiry?.Phone || enquiry?.phone || "").trim();
    const digitsOnly = raw.replace(/\D/g, "");
    return digitsOnly;
  }

  function getCallTelUrl(enquiry) {
    const raw = String(enquiry?.Phone || enquiry?.phone || "").trim();
    if (!raw) return "";
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 10) {
      // 10-digit Indian standard
      return `tel:+91${digits}`;
    } else if (digits.length > 10) {
      return `tel:+${digits}`;
    }
    return `tel:${digits}`;
  }

  function getWhatsAppUrl(enquiry) {
    const digits = getCleanPhone(enquiry);
    if (!digits) return "";
    let fullNumber = digits;
    if (digits.length === 10 && /^[6-9]/.test(digits)) {
      fullNumber = `91${digits}`;
    }
    const propName = getPropertyName(enquiry);
    const buyerName = enquiry?.Name || enquiry?.name || "Customer";
    const text = encodeURIComponent(
      `Hello ${buyerName}, thank you for your enquiry regarding ${propName} on HomeHub. How can I assist you?`
    );
    return `https://wa.me/${fullNumber}?text=${text}`;
  }

  function getBuyerEmail(enquiry) {
    if (!enquiry) return "";
    const raw =
      enquiry?.Email ||
      enquiry?.email ||
      enquiry?.users_permissions_user?.email ||
      enquiry?.users_permissions_user?.data?.attributes?.email ||
      "";
    return String(raw).trim();
  }

  function getMailtoUrl(enquiry) {
    const email = getBuyerEmail(enquiry);
    if (!email || !email.includes("@")) return "";
    const propName = getPropertyName(enquiry);
    const buyerName = enquiry?.Name || enquiry?.name || "Customer";
    const subject = encodeURIComponent(`Regarding your enquiry for ${propName} on HomeHub`);
    const body = encodeURIComponent(
      `Hello ${buyerName},\n\nThank you for reaching out regarding ${propName} on HomeHub.\n\n`
    );
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

  function handleCallClick(e, enquiry) {
    const tel = getCallTelUrl(enquiry);
    if (!tel) {
      if (e) e.preventDefault();
      setActionNotice("No valid phone number is available for this enquiry.");
      setTimeout(() => setActionNotice(""), 4000);
      return;
    }
  }

  function handleWhatsAppClick(e, enquiry) {
    const waUrl = getWhatsAppUrl(enquiry);
    if (!waUrl) {
      if (e) e.preventDefault();
      setActionNotice("No valid phone number is available for WhatsApp.");
      setTimeout(() => setActionNotice(""), 4000);
      return;
    }
  }

  function handleEmailClick(e, enquiry) {
    const mailto = getMailtoUrl(enquiry);
    if (!mailto) {
      if (e) e.preventDefault();
      setActionNotice("No valid email address is available for this enquiry.");
      setTimeout(() => setActionNotice(""), 4000);
      return;
    }

    // Direct invocation to ensure email composer opens reliably
    if (typeof window !== "undefined") {
      window.location.href = mailto;
    }
  }

  // =====================================================
  // MARK AS CONTACTED HANDLER
  // =====================================================
  async function handleMarkAsContacted(enquiry) {
    const docId = enquiry?.documentId || enquiry?.id;
    if (!docId) return;

    try {
      setActionLoadingId(docId);
      console.log("Marking enquiry as contacted:", docId);

      await markOwnerEnquiryAsContacted(docId);

      // Update local state directly for instant snappy UI update
      setAllOwnerEnquiries((prev) =>
        prev.map((item) => {
          const currentId = item?.documentId || item?.id;
          if (String(currentId) === String(docId)) {
            return {
              ...item,
              Status: "Contacted",
              status: "Contacted",
              Statuss: "Contacted",
            };
          }
          return item;
        })
      );

      setSuccessMessage(
        `Enquiry from ${enquiry?.Name || "Customer"} marked as Contacted!`
      );
      setConfirmContactedEnquiry(null);
      if (selectedEnquiry && String(selectedEnquiry?.documentId || selectedEnquiry?.id) === String(docId)) {
        setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error("FAILED TO MARK AS CONTACTED:", err);
      setError(err?.message || "Failed to update enquiry status. Please try again.");
      // Auto-clear after 5s
      setTimeout(() => setError(""), 5000);
    } finally {
      setActionLoadingId(null);
    }
  }

  // =====================================================
  // RENDER LOADING STATE
  // =====================================================
  if (loading) {
    return (
      <div className="seller-page-wrapper flex flex-col font-sans">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <p className="text-xs sm:text-sm font-semibold text-[#D7AE62] uppercase tracking-wider">
              Seller Portal
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--seller-text)] mt-1">
              New Enquiries
            </h1>

            <p className="text-sm sm:text-base text-[var(--seller-text-muted)] mt-1">
              Respond to enquiries received for your properties.
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-12 text-center shadow-sm">
              <div className="inline-block w-10 h-10 border-4 border-[#0D3326] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[var(--seller-text)] font-semibold mt-4">
                Loading enquiries...
              </p>
              <p className="text-[var(--seller-text-muted)] text-sm mt-1">
                Fetching real-time property enquiries from Strapi.
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
      <div className="seller-page-wrapper flex flex-col font-sans">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <p className="text-xs sm:text-sm font-semibold text-[#D7AE62] uppercase tracking-wider">
              Seller Portal
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--seller-text)] mt-1">
              New Enquiries
            </h1>

            <p className="text-sm sm:text-base text-[var(--seller-text-muted)] mt-1">
              Respond to enquiries received for your properties.
            </p>

            <div className="mt-8 rounded-2xl border border-red-200 bg-[var(--seller-surface)] p-10 text-center shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl font-bold mb-3">
                ⚠️
              </div>

              <h2 className="text-xl font-bold text-red-700">
                Unable to load enquiries
              </h2>

              <p className="text-[var(--seller-text-muted)] mt-2 max-w-md mx-auto text-sm sm:text-base">
                Something went wrong while loading your enquiries. Please check your connection or Strapi server status.
              </p>

              <p className="text-xs font-mono bg-red-50 text-red-800 p-2 rounded mt-3 max-w-lg mx-auto overflow-x-auto">
                {error}
              </p>

              <button
                type="button"
                onClick={loadEnquiries}
                className="mt-6 px-6 py-3 rounded-xl bg-[#0D3326] text-[#F6F0E5] font-semibold hover:bg-[#134534] transition shadow"
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
  // MAIN NEW ENQUIRIES PAGE UI
  // =====================================================
  return (
    <div className="seller-page-wrapper flex flex-col font-sans">
      <Header />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">

          {/* SUCCESS TOAST NOTIFICATION */}
          {successMessage && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-[var(--seller-border-focus)] bg-[var(--seller-surface)] p-3.5 shadow-sm text-xs font-semibold text-[var(--seller-text)] animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--seller-primary)] text-[var(--seller-bg)] text-[10px] font-black">✓</span>
                <span className="font-semibold text-xs sm:text-sm">
                  {successMessage}
                </span>
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
              Respond to enquiries received for your properties and track buyer interest.
            </p>
          </header>

          {/* Tab switcher: New, Contacted, Site Visits, Closed */}
          <div className="mb-6 flex justify-center overflow-x-auto pb-1">
            <div className="inline-flex rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-1 shadow-xs">
              {[
                { label: `New (${countNew})`, href: "/owner/enquiries/new", active: true },
                { label: `Contacted (${countContacted})`, href: "/owner/enquiries/contacted", active: false },
                { label: `Closed (${countClosed})`, href: "/owner/enquiries/closed", active: false },
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

          {/* =================================================
              2. CLEAN, COMPACT ENQUIRIES TOOLBAR
          ================================================= */}
          <section className="mb-6 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-3 sm:p-4 shadow-[var(--seller-shadow)]">
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2.5">

              {/* Search input */}
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

              {/* History Button beside search bar */}
              <button
                type="button"
                onClick={() => setHistoryModalOpen(true)}
                className="h-10 inline-flex items-center gap-1.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] px-3.5 text-xs font-semibold text-[var(--seller-text)] hover:border-[var(--seller-border-focus)] hover:bg-[var(--seller-surface-hover,var(--seller-surface))] transition shadow-2xs whitespace-nowrap"
                title="View All Enquiry History"
              >
                <History size={14} className="text-[var(--seller-text-muted)]" />
                <span>History</span>
                <span className="ml-1 rounded-full bg-[var(--seller-border)] px-1.5 py-0.2 text-[10px] font-bold text-[var(--seller-text-muted)]">
                  {allOwnerEnquiries.length}
                </span>
              </button>

              {/* Property filter */}
              <div className="relative w-auto min-w-[140px]">
                <Tag
                  size={13}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                />
                <select
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
                >
                  {propertyOptions.map((propName) => (
                    <option key={propName} value={propName}>
                      {propName}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                />
              </div>

              {/* City filter */}
              <div className="relative w-auto min-w-[130px]">
                <MapPin
                  size={13}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                />
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
                >
                  {cityOptions.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
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
                  <option value="Newest First">Newest First</option>
                  <option value="Oldest First">Oldest First</option>
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
                />
              </div>

            </div>
          </section>

          {/* 3. RESULTS HEADER */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
                New Enquiries
              </h2>
              <span className="text-xs font-extrabold bg-[var(--seller-primary)] text-[var(--seller-bg)] px-2.5 py-0.5 rounded-full">
                {filteredAndSortedEnquiries.length}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--seller-text-muted)]">
              Total <span className="font-semibold text-[var(--seller-text)]">{filteredAndSortedEnquiries.length}</span> enquiries
            </p>
          </div>

          {/* 4. ENQUIRIES LIST / CARDS */}
          <div className="space-y-4">
            {filteredAndSortedEnquiries.length === 0 ? (
              /* EMPTY STATE */
              <div className="seller-card p-10 sm:p-12 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--seller-bg)] border border-[var(--seller-border)] flex items-center justify-center text-[var(--seller-text-muted)] mb-3">
                  💬
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
                  No New Enquiries
                </h3>

                <p className="text-[var(--seller-text-muted)] text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  You don't have any new property enquiries right now.
                </p>

                {(search || propertyFilter !== "All Properties" || cityFilter !== "All Cities") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setPropertyFilter("All Properties");
                      setCityFilter("All Cities");
                    }}
                    className="mt-5 px-4 py-2 rounded-xl border border-[var(--seller-border)] text-[var(--seller-text-muted)] text-xs font-semibold hover:text-[var(--seller-text)] transition"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              /* ENQUIRY CARDS */
              filteredAndSortedEnquiries.map((enquiry) => {
                const docId = enquiry?.documentId || enquiry?.id;
                const name = enquiry?.Name || enquiry?.name || "Unknown User";
                const phone = enquiry?.Phone || enquiry?.phone || "Not provided";
                const email = enquiry?.Email || enquiry?.email || "Not provided";
                const message = enquiry?.Message || enquiry?.message || "No message provided.";
                const status = getStatus(enquiry);

                const propTitle = getPropertyName(enquiry);
                const propCity = getPropertyCity(enquiry);
                const propPrice = getPropertyPrice(enquiry);

                const createdAt = enquiry?.createdAt || enquiry?.created_at;
                const formattedDate = createdAt
                  ? new Date(createdAt).toLocaleString("en-IN", {
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

                const isActionLoading = actionLoadingId === docId;

                return (
                  <div
                    key={docId}
                    className="seller-card p-4 sm:p-5 relative"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.9fr_auto] gap-5 items-center">

                      {/* ENQUIRER INFO */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center font-bold text-sm shrink-0 border border-[var(--seller-border)]">
                          {initials}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm sm:text-base text-[var(--seller-text)] truncate">
                              {name}
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--seller-border)] bg-[var(--seller-bg)] text-[var(--seller-text-muted)] uppercase tracking-wider">
                              {status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs text-[var(--seller-text-muted)] mt-1 truncate">
                            <span>☎</span> {phone}
                          </p>

                          <p className="text-xs text-[var(--seller-text-muted)] truncate">
                            <span>✉</span> {email}
                          </p>
                        </div>
                      </div>

                      {/* PROPERTY INFO */}
                      <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Enquired for
                        </p>

                        <h4 className="font-bold text-xs sm:text-sm text-[var(--seller-text)] mt-0.5 line-clamp-1">
                          {propTitle}
                        </h4>

                        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 mt-1 flex-wrap">
                          {propCity && (
                            <span className="flex items-center gap-1">
                              📍 {propCity}
                            </span>
                          )}
                          {propPrice && (
                            <span className="text-xs font-extrabold text-[var(--seller-text)] mt-0.5">
                              {propPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ENQUIRING TIMELINE & STATUS */}
                      <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Enquired On
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 mt-0.5">
                          {formattedDate}
                        </p>

                        <p className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mt-2">
                          Status
                        </p>
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--seller-border)] bg-[var(--seller-bg)] text-[var(--seller-text-muted)] uppercase tracking-wider mt-0.5">
                          {status}
                        </span>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex sm:flex-row lg:flex-col gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--seller-border)] lg:min-w-[130px]">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="flex-1 lg:w-full px-3.5 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition shadow-2xs text-center"
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => setConfirmContactedEnquiry(enquiry)}
                          className="flex-1 lg:w-full px-3.5 py-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition flex items-center justify-center gap-1 disabled:opacity-50"
                        >
                          {isActionLoading ? (
                            <span className="inline-block w-4 h-4 border-2 border-[var(--seller-text)] border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            "Mark as Contacted"
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

      </main>

      {/* =====================================================
          ENQUIRY DETAILS MODAL
      ===================================================== */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in duration-200 my-8">

            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] w-8 h-8 rounded-full bg-[var(--seller-bg)] flex items-center justify-center font-bold text-sm transition border border-[var(--seller-border)]"
            >
              ✕
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center font-black text-xl border border-[var(--seller-border)]">
                {(selectedEnquiry?.Name || "U")[0]}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--seller-text)]">
                  Enquiry Details
                </h3>
                <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                  Document ID: {selectedEnquiry?.documentId || selectedEnquiry?.id}
                </p>
              </div>
              <span className="ml-auto mr-8 text-xs font-bold px-3 py-1 rounded-full bg-[var(--seller-bg)] text-[var(--seller-text)] uppercase tracking-wider border border-[var(--seller-border)]">
                {getStatus(selectedEnquiry)}
              </span>
            </div>

            <div className="space-y-6 text-sm">

              {/* ENQUIRER SECTION */}
              <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">
                  Enquirer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[var(--seller-text-subtle)] block text-xs">Name</span>
                    <p className="font-bold text-[var(--seller-text)]">
                      {selectedEnquiry?.Name || selectedEnquiry?.name || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[var(--seller-text-subtle)] block text-xs">Phone</span>
                    <p className="font-bold text-[var(--seller-text)]">
                      {getCallTelUrl(selectedEnquiry) ? (
                        <a href={getCallTelUrl(selectedEnquiry)} onClick={(e) => handleCallClick(e, selectedEnquiry)} className="hover:underline text-[var(--seller-text)]">
                          ☎ {selectedEnquiry?.Phone || "Not provided"}
                        </a>
                      ) : (
                        <span className="text-gray-400 font-normal">☎ Not provided</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-[var(--seller-text-subtle)] block text-xs">Email</span>
                    <p className="font-bold text-[var(--seller-text)] truncate">
                      {getMailtoUrl(selectedEnquiry) ? (
                        <a href={getMailtoUrl(selectedEnquiry)} onClick={(e) => handleEmailClick(e, selectedEnquiry)} className="hover:underline text-[var(--seller-text)]">
                          ✉ {selectedEnquiry?.Email || "Not provided"}
                        </a>
                      ) : (
                        <span className="text-gray-400 font-normal">✉ Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* PROPERTY SECTION */}
              <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">
                  Property Details
                </h4>

                <div className="flex gap-4 items-start">
                  {getPropertyImage(selectedEnquiry) && (
                    <img
                      src={getPropertyImage(selectedEnquiry)}
                      alt="Property"
                      className="w-20 h-20 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 space-y-1">
                    <h5 className="font-bold text-sm sm:text-base text-[var(--seller-text)]">
                      {getPropertyName(selectedEnquiry)}
                    </h5>

                    <p className="text-xs text-[var(--seller-text-muted)]">
                      📍 {getPropertyCity(selectedEnquiry) || "City not specified"}
                    </p>

                    {getPropertyPrice(selectedEnquiry) && (
                      <p className="text-xs sm:text-sm font-extrabold text-[var(--seller-text)] pt-1">
                        {getPropertyPrice(selectedEnquiry)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* MESSAGE / REQUEST SECTION */}
              <div className="bg-[var(--seller-bg)] p-4 sm:p-5 rounded-2xl border border-[var(--seller-border)]">
                <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-3">
                  Enquiry Message
                </h4>
                <p className="text-[var(--seller-text)] bg-[var(--seller-surface)] p-3 rounded-xl border border-[var(--seller-border)] italic text-xs sm:text-sm">
                  &ldquo;{selectedEnquiry?.Message || selectedEnquiry?.message || "No message provided."}&rdquo;
                </p>
                <p className="text-[11px] text-[var(--seller-text-subtle)] mt-2">
                  Enquired On:{" "}
                  {selectedEnquiry?.createdAt
                    ? new Date(selectedEnquiry.createdAt).toLocaleString("en-IN")
                    : "N/A"}
                </p>
              </div>

              {/* ACTION NOTICE TOAST */}
              {actionNotice && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between">
                  <span>⚠️ {actionNotice}</span>
                  <button onClick={() => setActionNotice("")} className="text-amber-800 font-bold ml-2">✕</button>
                </div>
              )}

              {/* MODAL ACTIONS */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2.5 pt-2">
                {/* 1. CALL ACTION */}
                {getCallTelUrl(selectedEnquiry) ? (
                  <a
                    href={getCallTelUrl(selectedEnquiry)}
                    onClick={(e) => handleCallClick(e, selectedEnquiry)}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-bold text-xs hover:border-[var(--seller-border-focus)] transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>📞</span> Call Enquirer
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleCallClick(e, selectedEnquiry)}
                    className="flex-1 text-center px-3 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-400 font-bold text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-1.5"
                    title="No phone number provided"
                  >
                    <span>📞</span> Call Enquirer
                  </button>
                )}

                {/* 2. WHATSAPP ACTION */}
                {getWhatsAppUrl(selectedEnquiry) ? (
                  <a
                    href={getWhatsAppUrl(selectedEnquiry)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleWhatsAppClick(e, selectedEnquiry)}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-bold text-xs hover:border-[var(--seller-border-focus)] transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>💬</span> WhatsApp
                  </a>
                ) : null}

                {/* 3. EMAIL ACTION */}
                {getMailtoUrl(selectedEnquiry) ? (
                  <a
                    href={getMailtoUrl(selectedEnquiry)}
                    onClick={(e) => handleEmailClick(e, selectedEnquiry)}
                    className="flex-1 text-center px-4 py-2.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-bold text-xs hover:border-[var(--seller-border-focus)] transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>✉</span> Email Enquirer
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleEmailClick(e, selectedEnquiry)}
                    className="flex-1 text-center px-3 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-400 font-bold text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-1.5"
                    title="No valid email provided"
                  >
                    <span>✉</span> Email Enquirer
                  </button>
                )}

                {/* 4. MARK AS CONTACTED */}
                <button
                  type="button"
                  onClick={() => {
                    handleMarkAsContacted(selectedEnquiry);
                  }}
                  disabled={actionLoadingId === (selectedEnquiry?.documentId || selectedEnquiry?.id)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap shadow-2xs"
                >
                  Mark as Contacted
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CONFIRM MARK AS CONTACTED MODAL
      ===================================================== */}
      {confirmContactedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 text-[var(--seller-text)]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center text-xl mx-auto mb-4 border border-[var(--seller-border)]">
              ✓
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[var(--seller-text)]">
              Mark as Contacted?
            </h3>

            <p className="text-xs text-[var(--seller-text-muted)] mt-2">
              This enquiry for <span className="font-semibold text-[var(--seller-text)]">{getPropertyName(confirmContactedEnquiry)}</span> from <span className="font-semibold text-[var(--seller-text)]">{confirmContactedEnquiry?.Name || "Customer"}</span> will be moved from New Enquiries to Contacted Enquiries.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmContactedEnquiry(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--seller-border)] text-[var(--seller-text-muted)] font-semibold text-xs hover:text-[var(--seller-text)] transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleMarkAsContacted(confirmContactedEnquiry)}
                disabled={actionLoadingId === (confirmContactedEnquiry?.documentId || confirmContactedEnquiry?.id)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition disabled:opacity-50"
              >
                {actionLoadingId === (confirmContactedEnquiry?.documentId || confirmContactedEnquiry?.id) ? (
                  "Updating..."
                ) : (
                  "Yes, Mark Contacted"
                )}
              </button>
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
                      {filteredHistoryEnquiries.length} of {allOwnerEnquiries.length}
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