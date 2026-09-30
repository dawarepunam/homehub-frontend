"use client";

import { useState, useEffect, useMemo } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSummaryCard from "@/components/admin/AdminSummaryCard";
import AdminPropertyCard from "@/components/admin/AdminPropertyCard";
import {
  Search, Building, Clock, CheckCircle, AlertCircle,
  BarChart2, ChevronDown, X, SlidersHorizontal,
  Home, TrendingUp, MapPin
} from "lucide-react";
import { useRouter } from "next/navigation";

// Normalise env — handles both http://localhost:1337/api and http://localhost:1337
const _STRAPI_BASE = (
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
).replace(/\/api\/?$/, "");
const API_URL = `${_STRAPI_BASE}/api`;

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token") || localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Actual PropertyStatus enum from schema.json
const STATUS_META = {
  ACTIVE:   { label: "Active",   dot: "#22c55e" },
  PENDING:  { label: "Pending",  dot: "#f59e0b" },
  DRAFT:    { label: "Draft",    dot: "#9ca3af" },
  SOLD:     { label: "Sold",     dot: "#3b82f6" },
  RENTED:   { label: "Rented",   dot: "#a855f7" },
  INACTIVE: { label: "Inactive", dot: "#ef4444" },
  RESERVED: { label: "Reserved", dot: "#f97316" },
};

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc",  label: "Oldest First" },
  { value: "Price:asc",      label: "Price: Low to High" },
  { value: "Price:desc",     label: "Price: High to Low" },
];

export default function AdminPropertiesClient({ initialFilter = "all" }) {
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [searchQuery, setSearchQuery]     = useState("");
  const [activeFilter, setActiveFilter]   = useState(initialFilter);
  const [typeFilter, setTypeFilter]       = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [sortOrder, setSortOrder]         = useState("createdAt:desc");
  const [showFilters, setShowFilters]     = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) { router.replace("/admin/login"); return; }
    fetchProperties();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOrder]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      // CRITICAL: raw string — NOT URLSearchParams.
      // URLSearchParams encodes [ ] as %5B %5D which Strapi v5 rejects (400).
      const query =
        "populate[Owner]=true" +
        "&populate[CoverImage]=true" +
        "&populate[PropertyImage]=true" +
        `&sort=${sortOrder}` +
        "&pagination[pageSize]=200";

      const res = await fetch(`${API_URL}/properties?${query}`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        console.error("[AdminProperties] Strapi error:", res.status, errBody);
        throw new Error(`Strapi ${res.status}`);
      }

      const data = await res.json();
      setProperties(data?.data || []);
    } catch (err) {
      console.error("[AdminProperties]", err);
      setError("Unable to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Normalise Strapi v4 { id, attributes:{} } vs v5 flat shape
  const allProperties = useMemo(() =>
    properties.map(p =>
      p?.attributes ? { id: p.id, documentId: p.documentId, ...p.attributes } : p
    ),
  [properties]);

  // Status counts across ALL properties
  const counts = useMemo(() => {
    const c = { ALL: allProperties.length };
    allProperties.forEach(p => {
      if (p.PropertyStatus) c[p.PropertyStatus] = (c[p.PropertyStatus] || 0) + 1;
    });
    return c;
  }, [allProperties]);

  // Unique filter options from real data
  const availableTypes    = useMemo(() => [...new Set(allProperties.map(p => p.Property_Type).filter(Boolean))], [allProperties]);
  const availablePurposes = useMemo(() => [...new Set(allProperties.map(p => p.Purpose).filter(Boolean))], [allProperties]);

  // Statuses that actually appear
  const presentStatuses = useMemo(() =>
    Object.keys(STATUS_META).filter(s => (counts[s] || 0) > 0),
  [counts]);

  const filteredProperties = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allProperties.filter(p => {
      if (activeFilter !== "all" && p.PropertyStatus !== activeFilter) return false;
      if (typeFilter !== "all" && p.Property_Type !== typeFilter) return false;
      if (purposeFilter !== "all" && p.Purpose !== purposeFilter) return false;
      if (q) {
        const ownerName = p.Owner?.name || p.Owner?.username || "";
        const hay = [p.Title, p.City, p.Area, p.Address, ownerName].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allProperties, activeFilter, typeFilter, purposeFilter, searchQuery]);

  // Property Snapshot
  const snapshot = useMemo(() => {
    if (allProperties.length === 0) return null;
    const byType = {}, byPurpose = {}, byCity = {};
    allProperties.forEach(p => {
      if (p.Property_Type) byType[p.Property_Type]   = (byType[p.Property_Type] || 0) + 1;
      if (p.Purpose)        byPurpose[p.Purpose]       = (byPurpose[p.Purpose] || 0) + 1;
      if (p.City)           byCity[p.City]             = (byCity[p.City] || 0) + 1;
    });
    const topCity = Object.entries(byCity).sort((a, b) => b[1] - a[1])[0]?.[0];
    return { byType, byPurpose, topCity };
  }, [allProperties]);

  const tabs = [
    { id: "all", label: "All Properties", count: counts.ALL },
    ...presentStatuses.map(s => ({ id: s, label: STATUS_META[s].label, count: counts[s] || 0 })),
  ];
  const hasActiveFilters = typeFilter !== "all" || purposeFilter !== "all" || searchQuery;

  return (
    <div className="min-h-screen bg-[#F3EBDD] font-sans relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-96 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(220,204,176,0.45) 0%, transparent 70%)" }}
      />
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">

        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0D3326] tracking-tight">Properties</h1>
            <p className="mt-1.5 text-sm text-[#3E4B32]">
              Manage, review and monitor all properties listed on HomeHub.
            </p>
          </div>
          <div className="relative">
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="appearance-none rounded-lg bg-white border border-[#DCCCB0] py-2 pl-3 pr-8 text-sm font-semibold text-[#0D3326] focus:outline-none focus:ring-2 focus:ring-[#D7AE62] cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0D3326]/50" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AdminSummaryCard
            title="All Properties"
            value={loading ? "—" : counts.ALL}
            icon={Building}
            surface="emerald"
            description="Total listed on HomeHub"
          />
          <AdminSummaryCard
            title="Pending Review"
            value={loading ? "—" : (counts.PENDING || 0)}
            icon={Clock}
            surface="sand"
            description="Awaiting admin approval"
          />
          <AdminSummaryCard
            title="Active"
            value={loading ? "—" : (counts.ACTIVE || 0)}
            icon={CheckCircle}
            surface="olive"
            description="Visible to buyers"
          />
        </div>

        {/* Tabs + Search */}
        <div className="mb-6 rounded-2xl bg-white/60 border border-white/50 backdrop-blur-sm shadow-sm overflow-hidden">
          {/* Status Tabs */}
          <div className="flex items-center gap-0.5 px-4 pt-4 overflow-x-auto">
            {loading ? (
              <div className="flex gap-2 pb-4">
                {[1,2,3].map(i => <div key={i} className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />)}
              </div>
            ) : tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 border-b-2 ${
                  activeFilter === tab.id
                    ? "bg-[#0D3326] text-white border-[#D7AE62]"
                    : "text-[#3E4B32] border-transparent hover:text-[#0D3326] hover:bg-[#F3EBDD]"
                }`}
              >
                {tab.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                  activeFilter === tab.id ? "bg-[#D7AE62] text-[#0D3326]" : "bg-gray-100 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search + Filter toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-4 border-t border-gray-100">
            <div className="relative flex-1 max-w-xl w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0D3326]/40" />
              <input
                type="text"
                placeholder="Search title, city, area or seller…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border border-[#DCCCB0] py-2.5 pl-9 pr-9 text-sm text-[#0D3326] placeholder:text-gray-400 focus:outline-none focus:border-[#D7AE62] focus:ring-1 focus:ring-[#D7AE62] bg-white transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all ${
                hasActiveFilters
                  ? "border-[#D7AE62] bg-[#D7AE62]/10 text-[#9B6848]"
                  : "border-[#DCCCB0] bg-white text-[#0D3326] hover:border-[#D7AE62]"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D7AE62] text-[9px] font-bold text-[#0D3326]">!</span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-4 px-4 pb-4 border-t border-gray-100 pt-3">
              {availableTypes.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Property Type</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {["all", ...availableTypes].map(t => (
                      <button key={t} onClick={() => setTypeFilter(t)}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold border transition-all ${
                          typeFilter === t ? "bg-[#0D3326] text-white border-[#0D3326]" : "bg-white text-[#0D3326] border-[#DCCCB0] hover:border-[#0D3326]"
                        }`}>
                        {t === "all" ? "All Types" : t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {availablePurposes.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Purpose</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {["all", ...availablePurposes].map(p => (
                      <button key={p} onClick={() => setPurposeFilter(p)}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold border transition-all ${
                          purposeFilter === p ? "bg-[#0D3326] text-white border-[#0D3326]" : "bg-white text-[#0D3326] border-[#DCCCB0] hover:border-[#0D3326]"
                        }`}>
                        {p === "all" ? "All Purposes" : `For ${p}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {hasActiveFilters && (
                <button
                  onClick={() => { setTypeFilter("all"); setPurposeFilter("all"); setSearchQuery(""); }}
                  className="self-end flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-all"
                >
                  <X className="h-3 w-3" /> Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {/* Result count */}
        {!loading && !error && (
          <p className="mb-4 text-xs font-semibold text-[#3E4B32]/70 uppercase tracking-wider">
            Showing {filteredProperties.length} of {counts.ALL} {counts.ALL === 1 ? "property" : "properties"}
          </p>
        )}

        {/* Data States */}
        {error ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-red-100">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Unable to load properties</h3>
            <p className="mt-1 text-sm text-gray-500">Please try again. Check the browser console for details.</p>
            <button onClick={fetchProperties}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0D3326] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#174638] transition-colors">
              Retry
            </button>
          </div>

        ) : loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse rounded-2xl bg-white border border-gray-100 shadow-sm flex overflow-hidden h-48">
                <div className="w-52 flex-shrink-0 bg-gray-100" />
                <div className="flex-1 p-5 space-y-3">
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                  <div className="h-5 w-3/4 bg-gray-100 rounded" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded" />
                  <div className="h-4 w-1/3 bg-gray-100 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>

        ) : filteredProperties.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-[#DCCCB0]/40">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3EBDD] mb-4">
              <Search className="h-7 w-7 text-[#9B6848]" />
            </div>
            <h3 className="text-base font-semibold text-[#0D3326]">
              {searchQuery || typeFilter !== "all" || purposeFilter !== "all"
                ? "No properties match your filters."
                : counts.ALL === 0
                  ? "No properties have been listed on HomeHub yet."
                  : "No properties found for the selected status."}
            </h3>
            {hasActiveFilters && (
              <button
                onClick={() => { setSearchQuery(""); setTypeFilter("all"); setPurposeFilter("all"); setActiveFilter("all"); }}
                className="mt-4 text-sm font-semibold text-[#D7AE62] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredProperties.map(property => (
              <AdminPropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Property Snapshot */}
        {!loading && !error && snapshot && allProperties.length > 0 && (
          <div className="mt-10 rounded-2xl bg-[#0D3326] p-6 text-white">
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 className="h-5 w-5 text-[#D7AE62]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#D7AE62]">Property Snapshot</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(snapshot.byType).map(([type, c]) => (
                <div key={type} className="rounded-xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Home className="h-3.5 w-3.5 text-[#D7AE62]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{type}</span>
                  </div>
                  <span className="text-2xl font-extrabold">{c}</span>
                </div>
              ))}
              {Object.entries(snapshot.byPurpose).map(([purpose, c]) => (
                <div key={purpose} className="rounded-xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-[#D7AE62]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">For {purpose}</span>
                  </div>
                  <span className="text-2xl font-extrabold">{c}</span>
                </div>
              ))}
              {snapshot.topCity && (
                <div className="rounded-xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-3.5 w-3.5 text-[#D7AE62]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Top City</span>
                  </div>
                  <span className="text-lg font-extrabold">{snapshot.topCity}</span>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
