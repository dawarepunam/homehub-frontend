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
  XCircle,
  Filter,
  History,
  Clock,
} from "lucide-react";
import { getOwnerEnquiries } from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function CancelledSiteVisitsPage() {
  const router = useRouter();

  // Primary state
  const [allEnquiries, setAllEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // History modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("All Status");
  const [historyPropertyFilter, setHistoryPropertyFilter] = useState("All Properties");

  // Search, Filters & Sort state
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [sortBy, setSortBy] = useState("Latest First");

  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null); // String YYYY-MM-DD

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
      setError(err?.message || "Unable to load cancelled site visits.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisits();
  }, []);

  // =====================================================
  // HELPER FUNCTIONS FOR STRAPI DATA PARSING
  // =====================================================
  function getStatus(item) {
    return String(item?.Status || item?.status || item?.Statuss || "Pending").trim();
  }

  function isCancelledVisit(item) {
    return getStatus(item).toLowerCase() === "cancelled";
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

  function getVisitDateStr(item) {
    return item?.VisitDate || item?.visitDate || item?.FollowUpDate || item?.updatedAt || item?.createdAt;
  }

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

  // =====================================================
  // CALCULATED METRICS & CARDS
  // =====================================================
  const siteVisitsBucket = useMemo(() => {
    return allEnquiries.filter(isSiteVisitItem);
  }, [allEnquiries]);

  const cancelledVisits = useMemo(() => {
    return siteVisitsBucket.filter(isCancelledVisit);
  }, [siteVisitsBucket]);

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

  const countCompletedVisits = useMemo(() => {
    return siteVisitsBucket.filter((item) => {
      return getStatus(item).toLowerCase() === "completed";
    }).length;
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

  // History filtered list
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
        return name.includes(q) || phone.includes(q) || email.includes(q) || propTitle.includes(q) || city.includes(q) || msg.includes(q) || status.includes(q);
      });
    }
    if (historyPropertyFilter !== "All Properties") {
      result = result.filter((item) => getPropertyName(item) === historyPropertyFilter);
    }
    if (historyStatusFilter !== "All Status") {
      result = result.filter((item) => getStatus(item).toLowerCase() === historyStatusFilter.toLowerCase());
    }
    result.sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());
    return result;
  }, [allEnquiries, historySearch, historyPropertyFilter, historyStatusFilter]);

  const totalCancelled = cancelledVisits.length;

  let thisMonthCount = 0;
  let thisWeekCount = 0;
  const uniqueProperties = new Set();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  cancelledVisits.forEach((v) => {
    const propName = getPropertyName(v);
    if (propName && propName !== "Untitled Property") uniqueProperties.add(propName);

    const dStr = getVisitDateStr(v);
    if (dStr) {
      const d = new Date(dStr);
      if (!isNaN(d.getTime())) {
        if (d >= startOfMonth && d <= now) {
          thisMonthCount++;
        }
        if (d >= startOfWeek && d <= now) {
          thisWeekCount++;
        }
      }
    }
  });

  const propertyOptions = useMemo(() => {
    return ["All Properties", ...Array.from(uniqueProperties)].sort();
  }, [uniqueProperties]);

  // =====================================================
  // FILTERING AND SORTING
  // =====================================================
  const filteredAndSortedVisits = useMemo(() => {
    let result = [...cancelledVisits];

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

    if (propertyFilter !== "All Properties") {
      result = result.filter((item) => {
        return getPropertyName(item) === propertyFilter;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) => {
        const cName = (item?.Name || item?.name || "").toLowerCase();
        const cPhone = (item?.Phone || item?.phone || "").toLowerCase();
        const cEmail = (item?.Email || item?.email || "").toLowerCase();
        const pName = getPropertyName(item).toLowerCase();
        return (
          cName.includes(q) ||
          cPhone.includes(q) ||
          cEmail.includes(q) ||
          pName.includes(q)
        );
      });
    }

    if (dateFilter !== "All Dates") {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      result = result.filter((item) => {
        const dStr = getVisitDateStr(item);
        if (!dStr) return false;
        const d = new Date(dStr);
        if (isNaN(d.getTime())) return false;

        if (dateFilter === "Today") {
          return d.toDateString() === todayDate.toDateString();
        } else if (dateFilter === "This Week") {
          return d >= startOfWeek;
        } else if (dateFilter === "This Month") {
          return d >= startOfMonth;
        }
        return true;
      });
    }

    result.sort((a, b) => {
      const d1 = new Date(getVisitDateStr(a) || 0).getTime();
      const d2 = new Date(getVisitDateStr(b) || 0).getTime();
      return sortBy === "Latest First" ? d2 - d1 : d1 - d2;
    });

    return result;
  }, [
    cancelledVisits,
    propertyFilter,
    search,
    sortBy,
    dateFilter,
    selectedCalendarDate,
    startOfWeek,
    startOfMonth,
  ]);

  if (loading) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
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
            <p className="text-[var(--seller-text)] font-semibold mt-4 text-sm">Loading cancelled visits...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
      <Header />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        
        {/* Navigation Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/owner/site-visits/upcoming"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
          >
            <ArrowLeft size={14} />
            Back to Active Visits
          </Link>
        </div>

        {/* Header */}
        <header className="mx-auto mb-8 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3.5 py-1 text-[11px] font-semibold text-[var(--seller-text-muted)] shadow-xs">
            <XCircle size={12} strokeWidth={2} />
            <span>Closed Records</span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
            Cancelled Visits
          </h1>

          <p className="mt-2.5 text-sm text-[var(--seller-text-muted)] sm:text-base sm:leading-relaxed">
            Record of cancelled site visits and cancellation reasons.
          </p>
        </header>

        {/* Tab switcher: Upcoming, Completed, Cancelled */}
        <div className="mb-6 flex justify-center overflow-x-auto pb-1">
          <div className="inline-flex rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-1 shadow-xs">
            {[
              { label: `Upcoming (${countUpcomingVisits})`, href: "/owner/site-visits/upcoming", active: false },
              { label: `Completed (${countCompletedVisits})`, href: "/owner/site-visits/completed", active: false },
              { label: `Cancelled (${totalCancelled})`, href: "/owner/site-visits/cancelled", active: true },
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
              { id: "all", label: `All Cancelled (${totalCancelled})` },
              { id: "this-week", label: `This Week (${thisWeekCount})` },
            ].map((chip) => {
              const isActive = (chip.id === "all" && dateFilter === "All Dates" && !selectedCalendarDate) ||
                               (chip.id === "this-week" && dateFilter === "This Week");
              return (
                <button
                  key={chip.id}
                  onClick={() => {
                    if (chip.id === "all") {
                      setDateFilter("All Dates");
                      setSelectedCalendarDate(null);
                    } else if (chip.id === "this-week") {
                      setDateFilter("This Week");
                      setSelectedCalendarDate(null);
                    }
                  }}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all border whitespace-nowrap ${
                    isActive
                      ? "bg-[var(--seller-primary)] text-[var(--seller-bg)] border-[var(--seller-primary)] shadow-xs"
                      : "bg-[var(--seller-surface)] text-[var(--seller-text-muted)] border-[var(--seller-border)] hover:text-[var(--seller-text)] hover:border-[var(--seller-border-focus)]"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar */}
        <section className="mb-6 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-3 sm:p-4 shadow-[var(--seller-shadow)]">
          <div className="flex flex-1 flex-wrap items-center justify-between gap-2.5">
            <div className="relative min-w-[200px] flex-1 sm:min-w-[240px]">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]" />
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

            <div className="relative w-auto min-w-[150px]">
              <Tag size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]" />
              <select
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
              >
                {propertyOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]" />
            </div>

            <div className="relative w-auto min-w-[120px]">
              <Calendar size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]" />
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
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]" />
            </div>

            <div className="relative w-auto min-w-[130px]">
              <ArrowUpDown size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
              >
                <option value="Latest First">Latest First</option>
                <option value="Oldest First">Oldest First</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]" />
            </div>
          </div>

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

        {/* Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[var(--seller-text)]">
                  Cancelled Visits
                </h2>
                <span className="rounded-full bg-[var(--seller-primary)] px-2 py-0.5 text-[10px] font-bold text-[var(--seller-bg)]">
                  {filteredAndSortedVisits.length}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              {filteredAndSortedVisits.length === 0 ? (
                <div className="seller-card p-12 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[var(--seller-bg)] text-[var(--seller-text-muted)] border border-[var(--seller-border)] flex items-center justify-center text-xl mb-3">
                    ✕
                  </div>
                  <h3 className="text-base font-bold text-[var(--seller-text)]">No Cancelled Visits</h3>
                  <p className="text-xs text-[var(--seller-text-muted)] mt-1 max-w-sm mx-auto">
                    Any visits that have been cancelled will appear in this history log.
                  </p>
                </div>
              ) : (
                filteredAndSortedVisits.map((visit) => {
                  const docId = visit?.documentId || visit?.id;
                  const name = visit?.Name || visit?.name || "Unknown Customer";
                  const phone = visit?.Phone || visit?.phone || "Not provided";
                  const propTitle = getPropertyName(visit);
                  const propCity = getPropertyCity(visit);
                  const propArea = getPropertyArea(visit);
                  const propPrice = getPropertyPrice(visit);
                  const visitDateStr = getVisitDateStr(visit);
                  const { date: formattedDate, time: formattedTime } = formatVisitDateTime(visitDateStr);
                  const initials = name.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "U";
                  const cancelReason = visit?.ClosedReason || visit?.closedReason || "Cancelled";

                  return (
                    <div key={docId} className="seller-card p-4 sm:p-5 relative">
                      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.9fr_auto] gap-4 sm:gap-5 items-center">
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--seller-bg)] text-[var(--seller-text)] flex items-center justify-center font-bold text-sm shrink-0 border border-[var(--seller-border)]">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-sm sm:text-base text-[var(--seller-text)] truncate">{name}</h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-500 uppercase tracking-wider">
                                Cancelled
                              </span>
                            </div>
                            <p className="text-xs text-[var(--seller-text-muted)] mt-1 truncate">☎ {phone}</p>
                            <p className="text-[11px] text-red-500 mt-0.5 truncate">Reason: {cancelReason}</p>
                          </div>
                        </div>

                        <div className="border-t lg:border-t-0 lg:border-l border-[var(--seller-border)] pt-3 lg:pt-0 lg:pl-5">
                          <p className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider">Property</p>
                          <h4 className="font-bold text-xs sm:text-sm text-[var(--seller-text)] mt-0.5 line-clamp-1">{propTitle}</h4>
                          <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">📍 {[propArea, propCity].filter(Boolean).join(", ") || "Location specified"}</p>
                          {propPrice && <p className="text-xs font-extrabold text-[var(--seller-text)] mt-0.5">{propPrice}</p>}
                        </div>

                        <div className="border-t lg:border-t-0 lg:border-l border-[var(--seller-border)] pt-3 lg:pt-0 lg:pl-5">
                          <p className="text-[10px] font-bold text-[var(--seller-text-subtle)] uppercase tracking-wider">Original Visit Date</p>
                          <span className="text-xs font-bold text-[var(--seller-text)] mt-0.5 block">{formattedDate}</span>
                          <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">🕒 {formattedTime}</p>
                        </div>

                        <div className="flex sm:flex-row lg:flex-col gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--seller-border)] lg:min-w-[130px]">
                          <button
                            type="button"
                            onClick={() => router.push(`/owner/site-visits/cancelled/${docId}`)}
                            className="w-full px-3.5 py-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition text-center"
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
          </div>

          {/* Sidebar */}
          <div className="hidden xl:block space-y-6">
            <div className="seller-card p-5">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                  className="text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] p-1 rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg)]"
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
                >
                  ❯
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[var(--seller-text-subtle)] mb-2 uppercase">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {(() => {
                  const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
                  const startDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();

                  const datesWithVisits = new Set();
                  cancelledVisits.forEach((v) => {
                    const dStr = getVisitDateStr(v);
                    if (dStr) {
                      const d = new Date(dStr);
                      if (!isNaN(d.getTime())) datesWithVisits.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
                    }
                  });

                  const days = [];
                  for (let i = 0; i < startDayOfMonth; i++) {
                    days.push(<div key={`empty-${i}`} className="p-1"></div>);
                  }
                  for (let i = 1; i <= daysInMonth; i++) {
                    const dateKey = `${calendarDate.getFullYear()}-${calendarDate.getMonth()}-${i}`;
                    const hasVisit = datesWithVisits.has(dateKey);
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
                        className={`w-7 h-7 mx-auto rounded-full flex flex-col items-center justify-center relative text-xs font-semibold ${
                          isSelected
                            ? "bg-[var(--seller-primary)] text-[var(--seller-bg)]"
                            : hasVisit
                            ? "text-[var(--seller-text)] font-bold hover:bg-[var(--seller-bg)] cursor-pointer"
                            : "text-[var(--seller-text-muted)] hover:bg-[var(--seller-bg)]"
                        }`}
                      >
                        {i}
                        {hasVisit && !isSelected && (
                          <span className="w-1 h-1 rounded-full bg-red-500 -mt-0.5"></span>
                        )}
                      </button>
                    );
                  }
                  return days;
                })()}
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--seller-border)] flex items-center justify-center gap-4 text-[10px] text-[var(--seller-text-muted)] font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Cancelled Visit
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

            <div className="seller-card p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--seller-text)] mb-4">
                Cancellation Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-1 border-b border-[var(--seller-border)] pb-2.5">
                  <span className="text-xs font-semibold text-[var(--seller-text-muted)]">Total Cancelled</span>
                  <span className="font-black text-xs text-[var(--seller-text)]">{totalCancelled}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[var(--seller-border)] pb-2.5">
                  <span className="text-xs font-semibold text-[var(--seller-text-muted)]">This Week</span>
                  <span className="font-black text-xs text-[var(--seller-text)]">{thisWeekCount}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-semibold text-[var(--seller-text-muted)]">Properties Affected</span>
                  <span className="font-black text-xs text-[var(--seller-text)]">{uniqueProperties.size}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* ENQUIRY HISTORY MODAL */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[var(--seller-surface)] rounded-3xl max-w-4xl w-full max-h-[85vh] my-auto flex flex-col shadow-2xl border border-[var(--seller-border)] animate-in fade-in zoom-in duration-150 overflow-hidden text-[var(--seller-text)]">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[var(--seller-border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--seller-bg)] flex items-center justify-center border border-[var(--seller-border)]">
                  <History size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--seller-text)] flex items-center gap-2">
                    Enquiry History
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--seller-primary)] text-[var(--seller-bg)] font-bold">
                      {filteredHistoryEnquiries.length} of {allEnquiries.length}
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">All past and current enquiries across properties.</p>
                </div>
              </div>
              <button type="button" onClick={() => setHistoryModalOpen(false)} className="w-9 h-9 rounded-xl border border-[var(--seller-border)] text-[var(--seller-text-muted)] hover:text-[var(--seller-text)] hover:bg-[var(--seller-bg)] flex items-center justify-center transition">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 border-b border-[var(--seller-border)] bg-[var(--seller-bg)]">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]" />
                  <input type="text" value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} placeholder="Search by buyer, phone, email, property..." className="h-9 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] pl-8 pr-7 text-xs font-medium text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)]" />
                  {historySearch && <button type="button" onClick={() => setHistorySearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--seller-text-subtle)] hover:text-[var(--seller-text)]"><X size={11} /></button>}
                </div>
                <div className="relative min-w-[130px]">
                  <select value={historyStatusFilter} onChange={(e) => setHistoryStatusFilter(e.target.value)} className="h-9 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3 text-xs font-semibold text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)] cursor-pointer pr-7">
                    {historyStatusOptions.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                  <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]" />
                </div>
                <div className="relative min-w-[140px]">
                  <select value={historyPropertyFilter} onChange={(e) => setHistoryPropertyFilter(e.target.value)} className="h-9 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3 text-xs font-semibold text-[var(--seller-text)] outline-none focus:border-[var(--seller-border-focus)] cursor-pointer pr-7 max-w-[200px] truncate">
                    {historyPropertyOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]" />
                </div>
                {(historySearch || historyStatusFilter !== "All Status" || historyPropertyFilter !== "All Properties") && (
                  <button type="button" onClick={() => { setHistorySearch(""); setHistoryStatusFilter("All Status"); setHistoryPropertyFilter("All Properties"); }} className="h-9 px-3 rounded-xl border border-dashed border-[var(--seller-border)] text-xs font-semibold text-[var(--seller-text-muted)] hover:text-red-500 hover:border-red-300 transition">Reset</button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {filteredHistoryEnquiries.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-[var(--seller-border)] bg-[var(--seller-bg)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--seller-surface)] text-[var(--seller-text-muted)] border border-[var(--seller-border)] flex items-center justify-center mx-auto mb-2 text-base">🔍</div>
                  <h4 className="font-bold text-sm text-[var(--seller-text)]">No enquiries found in history</h4>
                  <p className="text-xs text-[var(--seller-text-muted)] mt-1">Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                filteredHistoryEnquiries.map((enq) => {
                  const docId = enq?.documentId || enq?.id;
                  const currentStatus = getStatus(enq);
                  const createdDate = enq?.createdAt ? new Date(enq.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A";
                  return (
                    <div key={docId} className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-bg)] p-4 sm:p-5 transition hover:border-[var(--seller-border-focus)] hover:shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm text-[var(--seller-text)]">{enq?.Name || enq?.name || "Unknown Enquirer"}</span>
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-semibold bg-[var(--seller-bg)] text-[var(--seller-text-muted)] border-[var(--seller-border)]">{currentStatus}</span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-[var(--seller-text-muted)]">
                            {enq?.Phone && <span className="font-semibold text-[var(--seller-text)]">☎ {enq.Phone}</span>}
                            {enq?.Email && <span>✉ {enq.Email}</span>}
                          </div>
                          <div className="text-xs pt-1 flex flex-wrap items-center gap-2">
                            <span className="font-bold text-[var(--seller-text)]">🏢 {getPropertyName(enq)}</span>
                            {getPropertyCity(enq) && <span className="text-[var(--seller-text-subtle)]">• 📍 {getPropertyCity(enq)}</span>}
                            {getPropertyPrice(enq) && <span className="font-extrabold text-[var(--seller-text)]">• {getPropertyPrice(enq)}</span>}
                          </div>
                          <div className="pt-1 text-[11px] text-[var(--seller-text-subtle)]">📅 Received: {createdDate}</div>
                        </div>

                        <div className="pt-2 sm:pt-0 sm:pl-3 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => router.push(`/owner/site-visits/cancelled/${docId}`)}
                            className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] font-semibold text-xs hover:border-[var(--seller-border-focus)] transition shadow-2xs whitespace-nowrap"
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

            <div className="p-4 border-t border-[var(--seller-border)] bg-[var(--seller-surface)] flex items-center justify-between gap-3 text-xs text-[var(--seller-text-muted)]">
              <div className="flex items-center gap-1.5 text-[11px]">
                <Clock size={12} className="text-[var(--seller-text-subtle)]" />
                <span>Enquiries synced live from Strapi backend.</span>
              </div>
              <button type="button" onClick={() => setHistoryModalOpen(false)} className="px-4 py-2 rounded-xl border border-[var(--seller-border)] text-xs font-bold text-[var(--seller-text)] hover:bg-[var(--seller-bg)] transition">Close History</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
