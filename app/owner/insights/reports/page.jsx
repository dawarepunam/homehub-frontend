"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "../../Footer";
import {
  getPerformanceData,
  generateChartData,
  generateSmartInsights,
  getDateRange,
  STRAPI_MEDIA_URL,
} from "@/services/ownerInsights";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import {
  Eye, MessageSquare, Heart, Phone, Calendar, TrendingUp, TrendingDown,
  RefreshCw, ChevronDown, Download, MoreVertical, Star,
} from "lucide-react";

// =====================================================
// CONSTANTS
// =====================================================

const PERIOD_OPTIONS = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "Last 1 Year", value: "1y" },
];

const REPORT_TYPES = [
  { label: "Property Performance", value: "performance" },
  { label: "Enquiry Report", value: "enquiry" },
  { label: "Site Visit Report", value: "sitevisit" },
  { label: "Listing Activity", value: "listing" },
  { label: "Engagement Report", value: "engagement" },
];

const FUNNEL_COLORS = ["#064d3b", "#1a7a5e", "#c99838", "#e07b2a", "#e84545"];

function formatNum(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

// =====================================================
// SKELETON
// =====================================================
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-gray-100 mb-3"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
      <div className="h-7 bg-gray-100 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-1/3"></div>
    </div>
  );
}

// =====================================================
// KPI CARD
// =====================================================
function KpiCard({ icon, title, value, growth, subtitle, onClick, iconBg, active }) {
  const isPos = growth >= 0;
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition text-left w-full group cursor-pointer ${active ? "border-[#064d3b] ring-2 ring-[#064d3b]/10" : "border-gray-200 hover:border-[#064d3b]/40"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>{icon}</div>
        {growth != null && (
          <span className={`flex items-center gap-1 text-xs font-bold ${isPos ? "text-emerald-600" : "text-red-500"}`}>
            {isPos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isPos ? "+" : ""}{growth}%
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{formatNum(value)}</p>
      {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
    </button>
  );
}

// =====================================================
// FUNNEL STAGE
// =====================================================
function FunnelStage({ label, count, pct, color, total, onClick }) {
  const barW = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <button onClick={onClick} className="w-full group text-left">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></span>
          <span className="text-xs font-semibold text-gray-700 group-hover:text-[#064d3b] transition">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-gray-900">{count}</span>
          <span className="text-[10px] text-gray-400 w-14 text-right">({pct}%)</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${barW}%`, backgroundColor: color }}></div>
      </div>
    </button>
  );
}

// =====================================================
// EXPORT DROPDOWN
// =====================================================
function ExportDropdown({ open, setOpen }) {
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition"
      >
        <Download size={15} /> Export Report <ChevronDown size={13} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 overflow-hidden">
          {[
            { icon: "📄", label: "Export PDF", note: "Coming soon" },
            { icon: "📊", label: "Export CSV", note: "Coming soon" },
            { icon: "📋", label: "Export Excel", note: "Coming soon" },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => { alert(`${opt.label}: ${opt.note}`); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition text-left"
            >
              <span className="text-base">{opt.icon}</span>
              <div>
                <p>{opt.label}</p>
                <p className="text-[10px] text-gray-400">{opt.note}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================
// SMART INSIGHTS PANEL
// =====================================================
function SmartInsightsPanel({ insights, router }) {
  const iconMap = { trending: "📈", warning: "⚠️", photo: "🖼️", message: "💬", chart: "📊", calendar: "📅" };
  const colorMap = { positive: "bg-emerald-50 border-emerald-100", warning: "bg-amber-50 border-amber-100", action: "bg-blue-50 border-blue-100", info: "bg-[#e6f2ed] border-emerald-100" };
  return (
    <div className="space-y-2">
      {insights.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No new insights available for this period.</p>
      ) : (
        insights.map((ins, i) => (
          <div
            key={i}
            onClick={() => ins.action && router.push(ins.action)}
            className={`flex items-center justify-between p-3 rounded-xl border ${colorMap[ins.type] || "bg-gray-50 border-gray-100"} ${ins.action ? "cursor-pointer hover:opacity-80 transition" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-base flex-shrink-0">{iconMap[ins.icon] || "💡"}</span>
              <p className="text-xs font-semibold text-gray-800">{ins.text}</p>
            </div>
            {ins.action && <span className="text-gray-400 text-sm flex-shrink-0">›</span>}
          </div>
        ))
      )}
    </div>
  );
}

// =====================================================
// RECOMMENDED ACTIONS
// =====================================================
function RecommendedActions({ router, pendingEnquiries }) {
  const actions = [
    { icon: "🖼️", title: "Improve Listing Quality", desc: "Add photos and complete missing details.", label: "Take Action", href: "/owner/properties" },
    { icon: "💬", title: "Follow-up Enquiries", desc: `${pendingEnquiries} enquir${pendingEnquiries !== 1 ? "ies" : "y"} waiting for your response.`, label: "View Enquiries", href: "/owner/enquiries" },
    { icon: "📢", title: "Promote Top Property", desc: "Get more visibility for your top performing property.", label: "Promote Now", href: "/owner/promotions" },
  ];
  return (
    <div className="space-y-3">
      {actions.map((a) => (
        <div key={a.title} className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-gray-100 hover:border-[#064d3b]/20 transition">
          <div className="flex items-center gap-3">
            <span className="text-xl">{a.icon}</span>
            <div>
              <p className="text-xs font-bold text-gray-900">{a.title}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{a.desc}</p>
            </div>
          </div>
          <button
            onClick={() => router.push(a.href)}
            className="ml-3 px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-[10px] font-bold text-gray-700 hover:bg-[#064d3b] hover:text-white hover:border-[#064d3b] transition whitespace-nowrap flex-shrink-0"
          >
            {a.label}
          </button>
        </div>
      ))}
    </div>
  );
}

// =====================================================
// PROPERTY ROW MENU
// =====================================================
function PropertyRowMenu({ prop, router }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition"
      >
        <MoreVertical size={15} className="text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
          {[
            { label: "View Report", href: `/owner/insights/reports/property/${prop.documentId || prop.id}` },
            { label: "View Property", href: `/owner/properties/${prop.documentId || prop.id}` },
            { label: "View Enquiries", href: "/owner/enquiries" },
            { label: "View Site Visits", href: "/owner/site-visits/upcoming" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => { router.push(item.href); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================
// ENQUIRY REPORT VIEW
// =====================================================
function EnquiryReportView({ data, chartData, chartTab, setChartTab }) {
  if (!data) return null;
  const breakdown = data.enquiryStatusBreakdown || {};
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  const funnelStages = [
    { label: "Total Enquiries", key: "total", color: FUNNEL_COLORS[0] },
    { label: "Contacted", key: "Contacted", color: FUNNEL_COLORS[1] },
    { label: "Site Visit", key: "Site Visit", color: FUNNEL_COLORS[2] },
    { label: "Negotiation", key: "Negotiation", color: FUNNEL_COLORS[3] },
    { label: "Converted", key: "Converted", color: FUNNEL_COLORS[4] },
  ];
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-5">Enquiry Breakdown</h3>
        <div className="space-y-4">
          {funnelStages.map((s) => {
            const count = s.key === "total" ? total : (breakdown[s.key] || 0);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return <FunnelStage key={s.label} label={s.label} count={count} pct={pct} color={s.color} total={total} onClick={() => {}} />;
          })}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SITE VISIT REPORT VIEW
// =====================================================
function SiteVisitReportView({ data }) {
  if (!data) return null;
  const breakdown = data.enquiryStatusBreakdown || {};
  const stats = [
    { label: "Scheduled", value: breakdown["Scheduled"] || breakdown["Site Visit Pending"] || 0, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Confirmed", value: breakdown[" Confirmed"] || breakdown["Confirmed"] || 0, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Completed", value: breakdown["Completed"] || 0, color: "text-green-700", bg: "bg-green-50" },
    { label: "Cancelled", value: breakdown["Cancelled "] || breakdown["Cancelled"] || 0, color: "text-red-600", bg: "bg-red-50" },
    { label: "Rescheduled", value: breakdown["Rescheduled"] || 0, color: "text-amber-600", bg: "bg-amber-50" },
  ];
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-5">Site Visit Breakdown</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.bg}`}>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{s.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// LISTING ACTIVITY VIEW
// =====================================================
function ListingActivityView({ data }) {
  if (!data) return null;
  const props = data.propertyPerformance || [];
  const active = props.filter(p => p.status === "ACTIVE").length;
  const draft = props.filter(p => p.status === "DRAFT").length;
  const pending = props.filter(p => p.status === "PENDING").length;
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-5">Listing Activity</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Active Listings", value: active, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Draft Listings", value: draft, color: "text-gray-600", bg: "bg-gray-50" },
          { label: "Pending Review", value: pending, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Total Properties", value: props.length, color: "text-[#064d3b]", bg: "bg-[#e6f2ed]" },
          { label: "Total Views", value: props.reduce((s, p) => s + p.views, 0), color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Saves", value: props.reduce((s, p) => s + p.saves, 0), color: "text-pink-600", bg: "bg-pink-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.bg}`}>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{s.label}</p>
            <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>{formatNum(s.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// MAIN PAGE
// =====================================================
export default function ReportsPage() {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("30d");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [reportType, setReportType] = useState("performance");
  const [chartTab, setChartTab] = useState("daily");
  const [exportOpen, setExportOpen] = useState(false);
  const [showMoreProps, setShowMoreProps] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const fetchData = useCallback(async (p, propId) => {
    try {
      setLoading(true);
      setError("");
      const result = await getPerformanceData(p, propId);
      setData(result);
    } catch (err) {
      setError(err?.message || "Unable to load report data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period, selectedPropertyId);
  }, [period, selectedPropertyId, fetchData]);

  // Close export on outside click
  useEffect(() => {
    const handler = () => setExportOpen(false);
    if (exportOpen) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [exportOpen]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return generateChartData(data.kpis.views.value, period, chartTab);
  }, [data, period, chartTab]);

  const funnelData = useMemo(() => {
    if (!data) return [];
    const breakdown = data.enquiryStatusBreakdown || {};
    const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
    const stages = [
      { label: "Total Enquiries", count: total, color: FUNNEL_COLORS[0] },
      { label: "Contacted", count: breakdown["Contacted"] || 0, color: FUNNEL_COLORS[1] },
      { label: "Site Visit", count: breakdown["Site Visit"] || breakdown["Scheduled"] || 0, color: FUNNEL_COLORS[2] },
      { label: "Negotiation", count: breakdown["Negotiation"] || breakdown["Interested"] || 0, color: FUNNEL_COLORS[3] },
      { label: "Converted", count: breakdown["Converted"] || 0, color: FUNNEL_COLORS[4] },
    ];
    return stages.map((s) => ({
      ...s,
      pct: total > 0 ? Math.round((s.count / total) * 100) : 0,
    }));
  }, [data]);

  const propertyOptions = useMemo(() => {
    if (!data) return [];
    return data.allProperties.map((p) => ({ id: p?.documentId || p?.id, label: p?.Title || "Untitled" }));
  }, [data]);

  const visibleProperties = useMemo(() => {
    if (!data) return [];
    return showMoreProps ? data.propertyPerformance : data.propertyPerformance.slice(0, 5);
  }, [data, showMoreProps]);

  const overallScore = useMemo(() => {
    if (!data || !data.propertyPerformance.length) return 82;
    return Math.round(data.propertyPerformance.reduce((s, p) => s + p.score, 0) / data.propertyPerformance.length);
  }, [data]);

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans">
        <Header />
        <main className="flex-1 py-8 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-8 bg-gray-200 rounded-xl w-28 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-72 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-100 rounded-xl w-36 animate-pulse"></div>
            </div>
            <div className="h-14 bg-white rounded-2xl border border-gray-100 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
            <div className="h-64 bg-white rounded-3xl border border-gray-100 animate-pulse mb-6"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================
  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="text-3xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Unable to load report data</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={() => fetchData(period, selectedPropertyId)} className="px-6 py-3 rounded-xl bg-[#064d3b] text-white font-bold hover:bg-[#053d30] transition">
            Retry
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // =====================================================
  // EMPTY (no properties)
  // =====================================================
  if (!loading && !error && data?.allProperties?.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="text-4xl mb-3">🏠</div>
          <h2 className="text-2xl font-bold mb-2">No Properties Available Yet</h2>
          <p className="text-gray-500 mb-6">Add your first property to start seeing reports.</p>
          <Link href="/owner/properties/add" className="px-6 py-3 rounded-xl bg-[#064d3b] text-white font-bold">
            + Add Property
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* ---- PAGE HEADER ---- */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#c99838] uppercase tracking-wider mb-1">
                <Link href="/owner" className="hover:underline">Home</Link>
                <span>›</span>
                <span>Insights</span>
                <span>›</span>
                <span>Reports</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">Reports</h1>
              <p className="text-sm text-gray-500 mt-1 max-w-xl">
                Analyze your property performance, enquiries, site visits and listing activity.
              </p>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <ExportDropdown open={exportOpen} setOpen={setExportOpen} />
            </div>
          </div>

          {/* ---- FILTER BAR ---- */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Property Filter */}
              <div className="relative">
                <select
                  value={selectedPropertyId || ""}
                  onChange={(e) => setSelectedPropertyId(e.target.value || null)}
                  className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 bg-[#faf8f5] text-sm font-semibold text-gray-700 outline-none focus:border-[#064d3b] cursor-pointer"
                >
                  <option value="">All Properties</option>
                  {propertyOptions.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
                <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">🏠</span>
                <ChevronDown size={13} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
              </div>

              {/* Report Type */}
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 bg-[#faf8f5] text-sm font-semibold text-gray-700 outline-none focus:border-[#064d3b] cursor-pointer"
                >
                  {REPORT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">📊</span>
                <ChevronDown size={13} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
              </div>

              {/* Date Range */}
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 bg-[#faf8f5] text-sm font-semibold text-gray-700 outline-none focus:border-[#064d3b] cursor-pointer"
                >
                  {PERIOD_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">📅</span>
                <ChevronDown size={13} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
              </div>

              {/* Custom Range placeholder + Refresh */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-[#faf8f5] text-sm font-semibold text-gray-500 text-left cursor-not-allowed opacity-60">
                  📆 Custom Range
                </button>
                <button
                  onClick={() => fetchData(period, selectedPropertyId)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 bg-[#faf8f5] hover:bg-white transition"
                  title="Refresh"
                >
                  <RefreshCw size={15} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* ---- SUMMARY CARDS ---- */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
            <KpiCard
              icon={<Eye size={16} className="text-[#064d3b]" />}
              title="Property Views" value={data?.kpis?.views?.value}
              growth={data?.kpis?.views?.growth} subtitle={`vs previous ${PERIOD_OPTIONS.find(p => p.value === period)?.label}`}
              iconBg="bg-[#e6f2ed]" active={activeCard === "views"}
              onClick={() => { setActiveCard("views"); setReportType("engagement"); }}
            />
            <KpiCard
              icon={<MessageSquare size={16} className="text-[#c99838]" />}
              title="Enquiries" value={data?.kpis?.enquiries?.value}
              growth={data?.kpis?.enquiries?.growth} subtitle="vs previous period"
              iconBg="bg-[#fef6e7]" active={activeCard === "enquiries"}
              onClick={() => { setActiveCard("enquiries"); setReportType("enquiry"); }}
            />
            <KpiCard
              icon={<Heart size={16} className="text-pink-500" />}
              title="Saves" value={data?.kpis?.saves?.value}
              growth={null} subtitle="Wishlist saves"
              iconBg="bg-pink-50" active={activeCard === "saves"}
              onClick={() => { setActiveCard("saves"); setReportType("engagement"); }}
            />
            <KpiCard
              icon={<Phone size={16} className="text-blue-600" />}
              title="Contact Actions" value={data?.kpis?.contactActions?.value}
              growth={null} subtitle="Owner contact attempts"
              iconBg="bg-blue-50" active={activeCard === "contact"}
              onClick={() => { setActiveCard("contact"); setReportType("engagement"); }}
            />
            <KpiCard
              icon={<Calendar size={16} className="text-purple-600" />}
              title="Site Visits" value={data?.kpis?.siteVisits?.value}
              growth={null} subtitle="Scheduled / Confirmed"
              iconBg="bg-purple-50" active={activeCard === "sitevisits"}
              onClick={() => { setActiveCard("sitevisits"); setReportType("sitevisit"); }}
            />
            <KpiCard
              icon={<Star size={16} className="text-[#c99838]" />}
              title="Avg. Score" value={`${overallScore}/100`}
              growth={null} subtitle="Overall performance"
              iconBg="bg-[#fef6e7]" active={activeCard === "score"}
              onClick={() => { setActiveCard("score"); router.push("/owner/insights/performance"); }}
            />
          </div>

          {/* ---- REPORT TYPE SPECIFIC VIEW ---- */}
          {reportType === "enquiry" && (
            <div className="mb-6">
              <EnquiryReportView data={data} chartData={chartData} chartTab={chartTab} setChartTab={setChartTab} />
            </div>
          )}
          {reportType === "sitevisit" && (
            <div className="mb-6">
              <SiteVisitReportView data={data} />
            </div>
          )}
          {reportType === "listing" && (
            <div className="mb-6">
              <ListingActivityView data={data} />
            </div>
          )}

          {/* ---- VIEWS OVERVIEW + ENQUIRY FUNNEL ---- */}
          {(reportType === "performance" || reportType === "engagement") && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

              {/* Views Overview Chart */}
              <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Views Overview</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-extrabold text-[#064d3b]">
                        {formatNum(data?.kpis?.views?.value)}
                      </span>
                      <span className="text-xs text-gray-400 font-semibold">Total Views</span>
                    </div>
                  </div>
                  <div className="flex rounded-xl overflow-hidden border border-gray-200">
                    {["daily", "weekly", "monthly"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setChartTab(tab)}
                        className={`px-4 py-1.5 text-xs font-bold capitalize transition ${chartTab === tab ? "bg-[#064d3b] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#064d3b" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#064d3b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e5e7eb" }} />
                      <Area type="monotone" dataKey="value" stroke="#064d3b" strokeWidth={2.5} fill="url(#viewsGrad)" dot={false} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                    No view data available for the selected period.
                  </div>
                )}
              </div>

              {/* Enquiry Funnel */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 mb-5">Enquiry Funnel</h3>
                {funnelData.length > 0 && funnelData[0].count > 0 ? (
                  <div className="space-y-4">
                    {funnelData.map((s, i) => (
                      <FunnelStage
                        key={s.label}
                        label={s.label}
                        count={s.count}
                        pct={s.pct}
                        color={s.color}
                        total={funnelData[0].count}
                        onClick={() => router.push("/owner/enquiries")}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                    No enquiry data available.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ---- PROPERTY PERFORMANCE TABLE ---- */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Property Performance</h3>
              <span className="text-xs text-gray-400 font-semibold">
                Showing {visibleProperties.length} of {data?.propertyPerformance?.length} properties
              </span>
            </div>

            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_1fr_1.5fr_auto] gap-3 px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
              <span>Property</span>
              <span>Views</span>
              <span>Enquiries</span>
              <span>Saves</span>
              <span>Site Visits</span>
              <span>Contact</span>
              <span>Performance Score</span>
              <span>Action</span>
            </div>

            {visibleProperties.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                No property data available for the selected period.
              </div>
            ) : (
              visibleProperties.map((prop) => {
                const scoreColor =
                  prop.score >= 90 ? "#22c55e" : prop.score >= 75 ? "#064d3b" : prop.score >= 60 ? "#c99838" : "#ef4444";
                return (
                  <div
                    key={prop.id}
                    className="grid lg:grid-cols-[2.5fr_1fr_1fr_1fr_1fr_1fr_1.5fr_auto] gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition items-center"
                  >
                    {/* Property Info */}
                    <div className="flex items-center gap-3">
                      {prop.imgUrl ? (
                        <img src={prop.imgUrl} alt={prop.title} className="w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#e6f2ed] flex items-center justify-center text-sm flex-shrink-0">🏠</div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{prop.title}</p>
                        <p className="text-[10px] text-gray-400">{[prop.area, prop.city].filter(Boolean).join(", ")}</p>
                        <p className="text-[10px] text-gray-300">{prop.type}</p>
                      </div>
                    </div>

                    <div className="text-sm font-bold text-gray-700">{formatNum(prop.views)}</div>
                    <div className="text-sm font-bold text-gray-700">{formatNum(prop.enquiries)}</div>
                    <div className="text-sm font-bold text-gray-700">{formatNum(prop.saves)}</div>
                    <div className="text-sm font-bold text-gray-700">{formatNum(prop.siteVisits)}</div>
                    <div className="text-sm font-bold text-gray-700">—</div>

                    {/* Score Ring */}
                    <div className="flex items-center gap-2">
                      <div className="relative w-9 h-9 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="4" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor} strokeWidth="4"
                            strokeDasharray={`${prop.score} ${100 - prop.score}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[8px] font-extrabold" style={{ color: scoreColor }}>{prop.score}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold" style={{ color: scoreColor }}>{prop.score}/100</p>
                        <p className="text-[9px] text-gray-400">{prop.scoreLabel}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => router.push(`/owner/insights/reports/property/${prop.documentId || prop.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[10px] font-bold text-gray-700 hover:bg-[#064d3b] hover:text-white hover:border-[#064d3b] transition whitespace-nowrap"
                      >
                        View Report
                      </button>
                      <PropertyRowMenu prop={prop} router={router} />
                    </div>
                  </div>
                );
              })
            )}

            {data?.propertyPerformance?.length > 5 && (
              <div className="p-4 text-center border-t border-gray-50">
                <button
                  onClick={() => setShowMoreProps(!showMoreProps)}
                  className="flex items-center gap-2 mx-auto text-sm font-bold text-[#064d3b] hover:underline"
                >
                  {showMoreProps ? "Show Less" : `View More Properties (${data.propertyPerformance.length - 5} more)`}
                  <ChevronDown size={13} className={`transition ${showMoreProps ? "rotate-180" : ""}`} />
                </button>
              </div>
            )}
          </div>

          {/* ---- SMART INSIGHTS + RECOMMENDED ACTIONS ---- */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Smart Insights</h3>
                <Link href="/owner/insights/performance" className="text-xs font-bold text-[#064d3b] hover:underline">View All</Link>
              </div>
              <SmartInsightsPanel insights={data?.insights || []} router={router} />
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Recommended Actions</h3>
              <RecommendedActions router={router} pendingEnquiries={data?.pendingEnquiries || 0} />
              <p className="text-[10px] text-gray-400 mt-4 text-right">
                ⏱ All data updated as of {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}, {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
