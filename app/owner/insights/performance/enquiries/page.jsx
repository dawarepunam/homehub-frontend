"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Tag,
  MapPin,
  ChevronDown,
  X,
  Phone,
  Mail,
  Clock,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  ExternalLink,
  RotateCw,
} from "lucide-react";
import { getOwnerEnquiries } from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function PerformanceEnquiriesPage() {
  const router = useRouter();

  // Primary state
  const [allEnquiries, setAllEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [sortBy, setSortBy] = useState("Newest First");

  // Detail Modal state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // =====================================================
  // FETCH ALL OWNER ENQUIRIES
  // =====================================================
  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");
      const result = await getOwnerEnquiries();
      setAllEnquiries(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("PERFORMANCE ENQUIRIES PAGE ERROR:", err);
      setError(err?.message || "Unable to load enquiries.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadEnquiries();
  };

  // Helper getters
  function getStatus(item) {
    return String(
      item?.Statuss || item?.Status || item?.status || "Pending"
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
    return (
      prop?.Title ||
      prop?.title ||
      prop?.Name ||
      prop?.name ||
      "Untitled Property"
    );
  }

  function getPropertyDocId(item) {
    const prop = getPropertyRelation(item);
    return prop?.documentId || prop?.id || "";
  }

  function getPropertyCity(item) {
    const prop = getPropertyRelation(item);
    return prop?.City || prop?.city || prop?.Location || prop?.location || "";
  }

  function getPropertyArea(item) {
    const prop = getPropertyRelation(item);
    return prop?.Area || prop?.area || prop?.Locality || prop?.locality || "";
  }

  function getPropertyPrice(item) {
    const prop = getPropertyRelation(item);
    const rawPrice =
      prop?.Price || prop?.price || prop?.ExpectedPrice || prop?.expectedPrice;
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

  // Aggregate stage counts
  const stageCounts = useMemo(() => {
    let newCount = 0;
    let contactedCount = 0;
    let siteVisitCount = 0;
    let closedCount = 0;

    allEnquiries.forEach((item) => {
      const s = getStatus(item).toLowerCase();
      if (s === "new" || s === "pending") {
        newCount++;
      } else if (
        s === "contacted" ||
        s === "interested" ||
        s === "follow-up required" ||
        s.includes("contact")
      ) {
        contactedCount++;
      } else if (
        s.includes("site visit") ||
        s === "scheduled" ||
        s === "confirmed" ||
        s === "rescheduled"
      ) {
        siteVisitCount++;
      } else if (
        s === "completed" ||
        s === "converted" ||
        s.startsWith("cancelled") ||
        s === "closed" ||
        s === "not interested" ||
        s === "notinterested"
      ) {
        closedCount++;
      }
    });

    return {
      total: allEnquiries.length,
      new: newCount,
      contacted: contactedCount,
      siteVisit: siteVisitCount,
      closed: closedCount,
    };
  }, [allEnquiries]);

  // Active Card Filter: "all" | "new" | "contacted" | "siteVisit" | "closed"
  const [activeCardFilter, setActiveCardFilter] = useState("all");

  // Dynamic filter options
  const propertyOptions = useMemo(() => {
    const names = allEnquiries.map(getPropertyName).filter(Boolean);
    return ["All Properties", ...Array.from(new Set(names))];
  }, [allEnquiries]);

  const cityOptions = useMemo(() => {
    const cities = allEnquiries.map(getPropertyCity).filter(Boolean);
    return ["All Cities", ...Array.from(new Set(cities))];
  }, [allEnquiries]);

  const statusOptions = [
    "All Status",
    "New",
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
    "Closed",
  ];

  // Filtered & sorted enquiries
  const filteredEnquiries = useMemo(() => {
    let list = [...allEnquiries];

    // Card filter
    if (activeCardFilter === "new") {
      list = list.filter((item) => {
        const s = getStatus(item).toLowerCase();
        return s === "new" || s === "pending";
      });
    } else if (activeCardFilter === "contacted") {
      list = list.filter((item) => {
        const s = getStatus(item).toLowerCase();
        return (
          s === "contacted" ||
          s === "interested" ||
          s === "follow-up required" ||
          s.includes("contact")
        );
      });
    } else if (activeCardFilter === "siteVisit") {
      list = list.filter((item) => {
        const s = getStatus(item).toLowerCase();
        return (
          s.includes("site visit") ||
          s === "scheduled" ||
          s === "confirmed" ||
          s === "rescheduled"
        );
      });
    } else if (activeCardFilter === "closed") {
      list = list.filter((item) => {
        const s = getStatus(item).toLowerCase();
        return (
          s === "completed" ||
          s === "converted" ||
          s.startsWith("cancelled") ||
          s === "closed" ||
          s === "not interested" ||
          s === "notinterested"
        );
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((item) => {
        const name = String(item?.Name || item?.name || "").toLowerCase();
        const phone = String(item?.Phone || item?.phone || "").toLowerCase();
        const email = String(item?.Email || item?.email || "").toLowerCase();
        const propTitle = getPropertyName(item).toLowerCase();
        const city = getPropertyCity(item).toLowerCase();
        const msg = String(item?.Message || item?.message || "").toLowerCase();
        return (
          name.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          propTitle.includes(q) ||
          city.includes(q) ||
          msg.includes(q)
        );
      });
    }

    if (statusFilter !== "All Status") {
      list = list.filter((item) => {
        const s = getStatus(item).toLowerCase();
        const target = statusFilter.toLowerCase();
        if (target === "new") return s === "new" || s === "pending";
        if (target === "contacted") return s === "contacted" || s === "interested" || s === "follow-up required";
        if (target === "site visit pending") return s.includes("site visit") || s === "scheduled" || s === "confirmed";
        if (target === "cancelled") return s.startsWith("cancelled");
        if (target === "completed") return s === "completed";
        if (target === "converted") return s === "converted";
        if (target === "closed") return s === "completed" || s === "converted" || s.startsWith("cancelled") || s === "closed";
        return s === target;
      });
    }

    if (propertyFilter !== "All Properties") {
      list = list.filter((item) => getPropertyName(item) === propertyFilter);
    }

    if (cityFilter !== "All Cities") {
      list = list.filter((item) => getPropertyCity(item) === cityFilter);
    }

    // Sort
    list.sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0).getTime();
      const dateB = new Date(b?.createdAt || 0).getTime();
      if (sortBy === "Newest First") return dateB - dateA;
      if (sortBy === "Oldest First") return dateA - dateB;
      if (sortBy === "Name (A-Z)") return String(a?.Name || "").localeCompare(String(b?.Name || ""));
      return dateB - dateA;
    });

    return list;
  }, [allEnquiries, activeCardFilter, search, statusFilter, propertyFilter, cityFilter, sortBy]);

  return (
    <div className="seller-page-wrapper flex flex-col font-sans min-h-screen bg-[var(--seller-bg)] text-[var(--seller-text)]">
      <Header />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">

        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/owner/insights/performance"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
          >
            <ArrowLeft size={14} />
            Back to Performance
          </Link>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--seller-text)] hover:border-[var(--seller-border-focus)] transition shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
            title="Refresh Enquiries"
          >
            <RotateCw size={12} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Header Banner */}
        <header className="mx-auto mb-8 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3.5 py-1 text-[11px] font-semibold text-[var(--seller-text-muted)] shadow-xs">
            <MessageSquare size={12} strokeWidth={2} />
            <span>Performance Analytics</span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
            All Property Enquiries
          </h1>

          <p className="mt-2.5 text-sm text-[var(--seller-text-muted)] sm:text-base sm:leading-relaxed">
            Complete historical log of all customer enquiries and leads received across your properties.
          </p>
        </header>

        {/* Stage Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Total Enquiries", count: stageCounts.total, id: "all", color: "border-[var(--seller-border)]" },
            { label: "New / Pending", count: stageCounts.new, id: "new", color: "border-amber-500/30" },
            { label: "Contacted", count: stageCounts.contacted, id: "contacted", color: "border-blue-500/30" },
            { label: "Site Visits", count: stageCounts.siteVisit, id: "siteVisit", color: "border-purple-500/30" },
            { label: "Closed / Done", count: stageCounts.closed, id: "closed", color: "border-emerald-500/30" },
          ].map((card) => {
            const isActive = activeCardFilter === card.id;
            return (
              <button
                key={card.label}
                type="button"
                onClick={() => {
                  setActiveCardFilter(card.id);
                  setStatusFilter("All Status");
                }}
                className={`p-4 rounded-2xl text-left border bg-[var(--seller-surface)] shadow-xs transition cursor-pointer hover:-translate-y-0.5 ${card.color} ${
                  isActive ? "ring-2 ring-[var(--seller-text)]" : ""
                }`}
              >
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[var(--seller-text-muted)]">
                  {card.label}
                </p>
                <p className="text-2xl font-black text-[var(--seller-text)] mt-1">
                  {card.count}
                </p>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="mb-6 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-3 sm:p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2.5">

            {/* Search */}
            <div className="relative min-w-[200px] flex-1 sm:min-w-[260px]">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by buyer name, phone, property..."
                className="h-10 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-9 pr-8 text-xs font-medium text-[var(--seller-text)] outline-none transition placeholder:text-[var(--seller-text-subtle)] focus:border-[var(--seller-border-focus)]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--seller-text-subtle)] hover:text-[var(--seller-text)]"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[130px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-3 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
              >
                {statusOptions.map((st) => (
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
            <div className="relative min-w-[150px] max-w-[220px]">
              <Tag
                size={12}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
              <select
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer truncate"
              >
                {propertyOptions.map((propName) => (
                  <option key={propName} value={propName}>
                    {propName}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
            </div>

            {/* City Filter */}
            <div className="relative min-w-[130px]">
              <MapPin
                size={12}
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
                size={12}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
            </div>

            {/* Sort By */}
            <div className="relative min-w-[130px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-3 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Name (A-Z)">Name (A-Z)</option>
              </select>
              <ChevronDown
                size={12}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
            </div>

            {/* Reset */}
            {(search || activeCardFilter !== "all" || statusFilter !== "All Status" || propertyFilter !== "All Properties" || cityFilter !== "All Cities") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCardFilter("all");
                  setStatusFilter("All Status");
                  setPropertyFilter("All Properties");
                  setCityFilter("All Cities");
                }}
                className="h-10 px-3 rounded-xl border border-dashed border-[var(--seller-border)] text-xs font-semibold text-[var(--seller-text-muted)] hover:text-red-500 hover:border-red-300 transition"
              >
                Reset
              </button>
            )}

          </div>
        </div>

        {/* Content State: Loading, Error, Empty, or List */}
        {loading ? (
          <div className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-12 text-center shadow-xs">
            <div className="w-8 h-8 border-2 border-[var(--seller-text-muted)] border-t-[var(--seller-text)] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-[var(--seller-text)]">Loading Enquiries...</p>
            <p className="text-xs text-[var(--seller-text-muted)] mt-1">Fetching all past customer enquiries from Strapi.</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
            <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
            <h3 className="text-sm font-bold text-red-600">Failed to load enquiries</h3>
            <p className="text-xs text-[var(--seller-text-muted)] mt-1">{error}</p>
            <button
              type="button"
              onClick={loadEnquiries}
              className="mt-4 px-4 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--seller-border)] bg-[var(--seller-surface)] p-12 text-center shadow-xs">
            <MessageSquare size={36} className="mx-auto text-[var(--seller-text-subtle)] mb-2" />
            <h3 className="text-sm font-bold text-[var(--seller-text)]">No enquiries match your filters</h3>
            <p className="text-xs text-[var(--seller-text-muted)] mt-1">
              Try adjusting your search criteria or resetting filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredEnquiries.map((enq) => {
              const docId = enq?.documentId || enq?.id;
              const currentStatus = getStatus(enq);
              const isNew = currentStatus.toLowerCase() === "new" || currentStatus.toLowerCase() === "pending";
              const isContacted = currentStatus.toLowerCase() === "contacted";
              const isConverted = currentStatus.toLowerCase() === "converted" || currentStatus.toLowerCase() === "completed";
              const isCancelled = currentStatus.toLowerCase() === "cancelled" || currentStatus.toLowerCase() === "not interested";

              let badgeStyle = "bg-[var(--seller-bg-subtle)] text-[var(--seller-text-muted)] border-[var(--seller-border)]";
              if (isNew) badgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
              else if (isContacted) badgeStyle = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
              else if (isConverted) badgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
              else if (isCancelled) badgeStyle = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";

              const createdDate = enq?.createdAt
                ? new Date(enq.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A";

              const propImg = getPropertyImage(enq);
              const propDocId = getPropertyDocId(enq);

              return (
                <div
                  key={docId}
                  className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-5 transition hover:border-[var(--seller-border-focus)] hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                    {/* Customer & Property Details */}
                    <div className="flex-1 min-w-0 space-y-2">

                      {/* Header Row: Name & Status */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-extrabold text-base text-[var(--seller-text)]">
                          {enq?.Name || enq?.name || "Customer Lead"}
                        </span>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${badgeStyle}`}
                        >
                          {currentStatus}
                        </span>
                        {enq?.Source && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--seller-bg-subtle)] text-[var(--seller-text-muted)]">
                            Source: {enq.Source}
                          </span>
                        )}
                      </div>

                      {/* Contact Badges */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--seller-text-muted)]">
                        {enq?.Phone && (
                          <a
                            href={`tel:${enq.Phone}`}
                            className="inline-flex items-center gap-1 font-semibold text-[var(--seller-text)] hover:underline"
                          >
                            <Phone size={12} />
                            {enq.Phone}
                          </a>
                        )}
                        {enq?.Email && (
                          <a
                            href={`mailto:${enq.Email}`}
                            className="inline-flex items-center gap-1 text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] hover:underline"
                          >
                            <Mail size={12} />
                            {enq.Email}
                          </a>
                        )}
                      </div>

                      {/* Property Badge */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="font-bold text-[var(--seller-text)]">
                          🏢 {getPropertyName(enq)}
                        </span>
                        {getPropertyCity(enq) && (
                          <span className="text-[var(--seller-text-subtle)]">
                            • 📍 {[getPropertyArea(enq), getPropertyCity(enq)].filter(Boolean).join(", ")}
                          </span>
                        )}
                        {getPropertyPrice(enq) && (
                          <span className="font-extrabold text-[var(--seller-text)]">
                            • {getPropertyPrice(enq)}
                          </span>
                        )}
                        {propDocId && (
                          <Link
                            href={`/property/${propDocId}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] ml-1 hover:underline"
                          >
                            <ExternalLink size={10} />
                            View Listing
                          </Link>
                        )}
                      </div>

                      {/* Enquiry Message */}
                      {(enq?.Message || enq?.message) && (
                        <p className="text-xs italic text-[var(--seller-text-muted)] bg-[var(--seller-bg)] p-3 rounded-xl border border-[var(--seller-border)] mt-2">
                          &ldquo;{enq?.Message || enq?.message}&rdquo;
                        </p>
                      )}

                      {/* Meta Footer */}
                      <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--seller-text-subtle)]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={11} /> Received: {createdDate}
                        </span>
                        {enq?.VisitDate && (
                          <span className="text-purple-600 font-semibold inline-flex items-center gap-1">
                            <Clock size={11} /> Visit: {new Date(enq.VisitDate).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                        {enq?.ClosedReason && (
                          <span className="text-red-500 font-semibold">
                            Reason: {enq.ClosedReason}
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Right side: Thumbnail & Detail Button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 flex-shrink-0">
                      {propImg && (
                        <img
                          src={propImg}
                          alt={getPropertyName(enq)}
                          className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl object-cover border border-[var(--seller-border)]"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedEnquiry(enq)}
                        className="px-4 py-2 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] text-xs font-bold hover:opacity-90 transition shadow-2xs whitespace-nowrap"
                      >
                        View Full Details
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* FULL ENQUIRY DETAIL MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-[var(--seller-border)] my-8 max-h-[90vh] overflow-y-auto text-[var(--seller-text)]">
            <button
              type="button"
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] w-8 h-8 rounded-full bg-[var(--seller-bg)] flex items-center justify-center font-bold text-sm transition border border-[var(--seller-border)] cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6 border-b border-[var(--seller-border)] pb-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center font-black text-xl border border-[var(--seller-border)]">
                {(selectedEnquiry?.Name || "U")[0]}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--seller-text)]">
                  {selectedEnquiry?.Name || selectedEnquiry?.name || "Customer Lead"}
                </h3>
                <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                  Received on {new Date(selectedEnquiry?.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-[var(--seller-bg)] text-[var(--seller-text)] uppercase tracking-wider border border-[var(--seller-border)]">
                {getStatus(selectedEnquiry)}
              </span>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Contact info */}
              <div className="bg-[var(--seller-bg)] p-4 rounded-2xl border border-[var(--seller-border)]">
                <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-2">
                  Customer Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[var(--seller-text-subtle)] block text-xs">Phone Number</span>
                    <span className="font-bold text-[var(--seller-text)]">{selectedEnquiry?.Phone || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[var(--seller-text-subtle)] block text-xs">Email Address</span>
                    <span className="font-bold text-[var(--seller-text)]">{selectedEnquiry?.Email || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-[var(--seller-bg)] p-4 rounded-2xl border border-[var(--seller-border)]">
                <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-2">
                  Property Enquired About
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[var(--seller-text)] text-sm">{getPropertyName(selectedEnquiry)}</p>
                    <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                      📍 {[getPropertyArea(selectedEnquiry), getPropertyCity(selectedEnquiry)].filter(Boolean).join(", ")}
                    </p>
                    <p className="font-extrabold text-[var(--seller-text)] mt-1">{getPropertyPrice(selectedEnquiry)}</p>
                  </div>
                  {getPropertyDocId(selectedEnquiry) && (
                    <Link
                      href={`/property/${getPropertyDocId(selectedEnquiry)}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-xl border border-[var(--seller-border)] text-xs font-bold text-[var(--seller-text)] hover:bg-[var(--seller-surface)] transition inline-flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> Live Listing
                    </Link>
                  )}
                </div>
              </div>

              {/* Message */}
              {selectedEnquiry?.Message && (
                <div className="bg-[var(--seller-bg)] p-4 rounded-2xl border border-[var(--seller-border)]">
                  <h4 className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider mb-2">
                    Customer Message
                  </h4>
                  <p className="text-xs text-[var(--seller-text)] italic leading-relaxed">
                    &ldquo;{selectedEnquiry.Message}&rdquo;
                  </p>
                </div>
              )}

              {/* Additional Meta */}
              <div className="bg-[var(--seller-bg)] p-4 rounded-2xl border border-[var(--seller-border)] grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[var(--seller-text-subtle)] block text-[11px]">Enquiry Source</span>
                  <span className="font-bold text-[var(--seller-text)]">{selectedEnquiry?.Source || "Website"}</span>
                </div>
                <div>
                  <span className="text-[var(--seller-text-subtle)] block text-[11px]">Status</span>
                  <span className="font-bold text-[var(--seller-text)]">{getStatus(selectedEnquiry)}</span>
                </div>
                {selectedEnquiry?.VisitDate && (
                  <div className="col-span-2">
                    <span className="text-[var(--seller-text-subtle)] block text-[11px]">Scheduled Visit Date</span>
                    <span className="font-bold text-purple-600">
                      {new Date(selectedEnquiry.VisitDate).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}
                {selectedEnquiry?.ClosedReason && (
                  <div className="col-span-2">
                    <span className="text-[var(--seller-text-subtle)] block text-[11px]">Closure / Cancellation Reason</span>
                    <span className="font-bold text-red-500">{selectedEnquiry.ClosedReason}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--seller-border)] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2.5 rounded-xl bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold text-xs hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
