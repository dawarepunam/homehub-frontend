"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "../../Footer";
import {
  getPerformanceData,
  generateChartData,
  calculatePerformanceScore,
  STRAPI_MEDIA_URL,
} from "@/services/ownerInsights";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Eye, MessageSquare, Heart, Phone, Calendar, TrendingUp, TrendingDown, RefreshCw, ChevronDown } from "lucide-react";

// =====================================================
// CONSTANTS
// =====================================================

const PERIOD_OPTIONS = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "This Year", value: "1y" },
];

const ENQUIRY_COLORS = {
  Pending: "#94a3b8",
  New: "#064d3b",
  Contacted: "#c99838",
  "Site Visit": "#0ea5e9",
  Completed: "#22c55e",
  Cancelled: "#ef4444",
  Converted: "#a855f7",
  Closed: "#f97316",
  Scheduled: "#06b6d4",
  Interested: "#84cc16",
  "Follow-up Required": "#f59e0b",
};

function formatNum(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

// =====================================================
// KPI CARD
// =====================================================

function KpiCard({ icon, title, value, growth, subtitle, onClick, color }) {
  const isPositive = growth >= 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-[#064d3b] transition text-left w-full group cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {growth !== null && growth !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? "+" : ""}{growth}%
          </span>
        )}
      </div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-extrabold text-gray-900 mt-1">{formatNum(value)}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </button>
  );
}

// =====================================================
// SKELETON LOADERS
// =====================================================

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-gray-100 mb-3"></div>
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
      <div className="h-8 bg-gray-100 rounded w-3/4"></div>
    </div>
  );
}

// =====================================================
// PERFORMANCE SCORE WIDGET
// =====================================================

function PerformanceScoreWidget({ score, label, details }) {
  const color =
    score >= 90 ? "#22c55e" : score >= 75 ? "#064d3b" : score >= 60 ? "#c99838" : "#ef4444";

  const bars = [
    { key: "listingQuality", label: "Listing Quality", value: details.listingQuality },
    { key: "viewsScore", label: "Views", value: details.viewsScore },
    { key: "engagementScore", label: "Engagement", value: details.engagementScore },
    { key: "enquiryScore", label: "Enquiries", value: details.enquiryScore },
    { key: "responseRate", label: "Response Rate", value: details.responseRate },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-5">Performance Score</h3>
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={color} strokeWidth="3"
              strokeDasharray={`${score} ${100 - score}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-gray-900">{score}</span>
            <span className="text-[9px] text-gray-400 font-bold">/100</span>
          </div>
        </div>
        <div>
          <p className="text-lg font-extrabold" style={{ color }}>{label}</p>
          <p className="text-xs text-gray-400 mt-1">Overall Performance</p>
        </div>
      </div>
      <div className="space-y-3">
        {bars.map((b) => (
          <div key={b.key}>
            <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
              <span>{b.label}</span>
              <span>{b.value}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${b.value}%`, backgroundColor: color }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// SMART INSIGHT ITEM
// =====================================================

function InsightItem({ insight, router }) {
  const iconMap = {
    trending: "📈",
    warning: "⚠️",
    photo: "🖼️",
    message: "💬",
    chart: "📊",
    calendar: "📅",
  };

  const colorMap = {
    positive: "bg-emerald-50 border-emerald-200",
    warning: "bg-amber-50 border-amber-200",
    action: "bg-blue-50 border-blue-200",
    info: "bg-[#e6f2ed] border-emerald-200",
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border ${colorMap[insight.type] || "bg-gray-50 border-gray-200"} ${insight.action ? "cursor-pointer hover:opacity-80 transition" : ""}`}
      onClick={() => insight.action && router.push(insight.action)}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{iconMap[insight.icon] || "💡"}</span>
        <p className="text-xs font-semibold text-gray-800">{insight.text}</p>
      </div>
      {insight.action && <span className="text-gray-400 text-sm">›</span>}
    </div>
  );
}

// =====================================================
// MAIN PAGE
// =====================================================

export default function PerformancePage() {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("30d");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [chartTab, setChartTab] = useState("daily");
  const [showMoreProps, setShowMoreProps] = useState(false);

  const fetchData = useCallback(async (p, propId) => {
    try {
      setLoading(true);
      setError("");
      const result = await getPerformanceData(p, propId);
      setData(result);
    } catch (err) {
      setError(err?.message || "Unable to load performance data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period, selectedPropertyId);
  }, [period, selectedPropertyId, fetchData]);

  // ---- CHART DATA (generated from actual totalViews) ----
  const chartData = useMemo(() => {
    if (!data) return [];
    return generateChartData(data.kpis.views.value, period, chartTab);
  }, [data, period, chartTab]);

  // ---- DONUT CHART DATA ----
  const donutData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.enquiryStatusBreakdown).map(([name, value]) => ({
      name,
      value,
    }));
  }, [data]);

  // ---- AGGREGATE PERFORMANCE SCORE ----
  const overallScore = useMemo(() => {
    if (!data || !data.propertyPerformance.length) return null;
    const avg = Math.round(
      data.propertyPerformance.reduce((s, p) => s + p.score, 0) /
        data.propertyPerformance.length
    );
    const label =
      avg >= 90 ? "Excellent" : avg >= 75 ? "Good" : avg >= 60 ? "Average" : "Needs Improvement";
    // Aggregate score details
    const details = {
      listingQuality: Math.round(data.propertyPerformance.reduce((s, p) => s + p.scoreDetails.listingQuality, 0) / data.propertyPerformance.length),
      viewsScore: Math.round(data.propertyPerformance.reduce((s, p) => s + p.scoreDetails.viewsScore, 0) / data.propertyPerformance.length),
      engagementScore: Math.round(data.propertyPerformance.reduce((s, p) => s + p.scoreDetails.engagementScore, 0) / data.propertyPerformance.length),
      enquiryScore: Math.round(data.propertyPerformance.reduce((s, p) => s + p.scoreDetails.enquiryScore, 0) / data.propertyPerformance.length),
      responseRate: Math.round(data.propertyPerformance.reduce((s, p) => s + p.scoreDetails.responseRate, 0) / data.propertyPerformance.length),
    };
    return { score: avg, label, details };
  }, [data]);

  // ---- PROPERTY OPTIONS FOR FILTER ----
  const propertyOptions = useMemo(() => {
    if (!data) return [];
    return data.allProperties.map((p) => ({
      id: p?.documentId || p?.id,
      label: p?.Title || "Untitled",
    }));
  }, [data]);

  // ---- VISIBLE PROPERTIES ----
  const visibleProperties = useMemo(() => {
    if (!data) return [];
    const all = data.propertyPerformance;
    return showMoreProps ? all : all.slice(0, 5);
  }, [data, showMoreProps]);

  // =====================================================
  // LOADING STATE
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans">
        <Header />
        <main className="flex-1 py-10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="h-8 bg-gray-200 rounded-xl w-40 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-60 animate-pulse"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 h-64 animate-pulse"></div>
              <div className="bg-white rounded-3xl border border-gray-100 p-6 h-64 animate-pulse"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================
  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-2xl flex items-center justify-center mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-red-700">Unable to load performance data</h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => fetchData(period, selectedPropertyId)}
            className="mt-6 px-6 py-3 rounded-xl bg-[#064d3b] text-white font-bold hover:bg-[#053d30] transition"
          >
            Try Again
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // =====================================================
  // EMPTY STATE (no properties)
  // =====================================================
  if (!loading && !error && data?.allProperties?.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-[#e6f2ed] flex items-center justify-center text-3xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Properties Found</h2>
          <p className="text-gray-500 mb-6">Add your first property to start seeing performance analytics.</p>
          <Link href="/owner/properties/add" className="px-6 py-3 rounded-xl bg-[#064d3b] text-white font-bold hover:bg-[#053d30] transition">
            + Add Property
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // =====================================================
  // FULL PAGE
  // =====================================================
  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* ---- PAGE HEADER ---- */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#c99838] uppercase tracking-wider mb-1">
                <Link href="/owner/dashboard" className="hover:underline">Home</Link>
                <span>›</span>
                <span>Insights</span>
                <span>›</span>
                <span>Performance</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">Performance</h1>
              <p className="text-gray-500 text-sm mt-1">Track how your properties are performing.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Property Filter */}
              <div className="relative">
                <select
                  value={selectedPropertyId || ""}
                  onChange={(e) => setSelectedPropertyId(e.target.value || null)}
                  className="appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 cursor-pointer outline-none focus:border-[#064d3b] shadow-sm"
                >
                  <option value="">All Properties</option>
                  {propertyOptions.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
                <span className="absolute left-3 top-2.5 text-gray-400">🏠</span>
                <ChevronDown size={14} className="absolute right-2 top-3 text-gray-400" />
              </div>

              {/* Period Filter */}
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 cursor-pointer outline-none focus:border-[#064d3b] shadow-sm"
                >
                  {PERIOD_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="absolute left-3 top-2.5 text-gray-400">📅</span>
                <ChevronDown size={14} className="absolute right-2 top-3 text-gray-400" />
              </div>

              {/* Refresh */}
              <button
                onClick={() => fetchData(period, selectedPropertyId)}
                className="p-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 shadow-sm transition"
                title="Refresh data"
              >
                <RefreshCw size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* ---- KPI CARDS ---- */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            <KpiCard
              icon={<Eye size={18} className="text-[#064d3b]" />}
              title="Property Views"
              value={data?.kpis?.views?.value}
              growth={data?.kpis?.views?.growth}
              subtitle="Total property page views"
              color="bg-[#e6f2ed]"
              onClick={() => router.push("/owner/insights/performance")}
            />
            <KpiCard
              icon={<MessageSquare size={18} className="text-[#c99838]" />}
              title="Enquiries"
              value={data?.kpis?.enquiries?.value}
              growth={data?.kpis?.enquiries?.growth}
              subtitle="vs previous period"
              color="bg-[#fef6e7]"
              onClick={() => router.push("/owner/enquiries")}
            />
            <KpiCard
              icon={<Heart size={18} className="text-pink-500" />}
              title="Saves"
              value={data?.kpis?.saves?.value}
              growth={null}
              subtitle="Wishlist saves"
              color="bg-pink-50"
              onClick={() => router.push("/owner/insights/performance")}
            />
            <KpiCard
              icon={<Phone size={18} className="text-blue-600" />}
              title="Contact Actions"
              value={data?.kpis?.contactActions?.value}
              growth={null}
              subtitle="Owner contact attempts"
              color="bg-blue-50"
              onClick={() => router.push("/owner/enquiries")}
            />
            <KpiCard
              icon={<Calendar size={18} className="text-purple-600" />}
              title="Site Visits"
              value={data?.kpis?.siteVisits?.value}
              growth={null}
              subtitle="Scheduled / Confirmed"
              color="bg-purple-50"
              onClick={() => router.push("/owner/site-visits/upcoming")}
            />
          </div>

          {/* ---- CHARTS ROW ---- */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

            {/* Views Analytics */}
            <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Views Analytics</h3>
                  <p className="text-2xl font-extrabold text-[#064d3b]">{formatNum(data?.kpis?.views?.value)} <span className="text-sm font-semibold text-gray-400">Views</span></p>
                </div>
                <div className="flex rounded-xl overflow-hidden border border-gray-200">
                  {["daily", "weekly", "monthly"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setChartTab(tab)}
                      className={`px-4 py-1.5 text-xs font-bold capitalize transition ${chartTab === tab ? "bg-[#064d3b] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e5e7eb" }}
                    labelStyle={{ fontWeight: 700 }}
                  />
                  <Line
                    type="monotone" dataKey="value"
                    stroke="#064d3b" strokeWidth={2.5}
                    dot={false} activeDot={{ r: 5, fill: "#064d3b" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Enquiry Analytics Donut */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-gray-900 mb-3">Enquiry Analytics</h3>
              {donutData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%" cy="50%"
                        innerRadius={50} outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {donutData.map((entry) => (
                          <Cell key={entry.name} fill={ENQUIRY_COLORS[entry.name] || "#94a3b8"} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-2 space-y-1.5 flex-1 overflow-y-auto max-h-40">
                    {donutData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: ENQUIRY_COLORS[d.name] || "#94a3b8" }}></span>
                          <span className="text-gray-600 font-medium">{d.name}</span>
                        </div>
                        <span className="font-bold text-gray-700">{d.value} ({Math.round((d.value / (data?.kpis?.enquiries?.value || 1)) * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  No enquiry data for this period.
                </div>
              )}
            </div>

          </div>

          {/* ---- PROPERTY-WISE PERFORMANCE ---- */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Property-wise Performance</h3>
            </div>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
              <span>Property</span>
              <span>Views</span>
              <span>Enquiries</span>
              <span>Saves</span>
              <span>Site Visits</span>
              <span>Score</span>
              <span>Action</span>
            </div>
            {visibleProperties.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No property data available.</div>
            ) : (
              visibleProperties.map((prop) => {
                const scoreColor =
                  prop.score >= 90 ? "#22c55e" : prop.score >= 75 ? "#064d3b" : prop.score >= 60 ? "#c99838" : "#ef4444";
                return (
                  <div
                    key={prop.id}
                    className="grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition items-center"
                  >
                    <div className="flex items-center gap-3">
                      {prop.imgUrl ? (
                        <img src={prop.imgUrl} alt={prop.title} className="w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#e6f2ed] flex items-center justify-center text-sm font-bold text-[#064d3b] flex-shrink-0">🏠</div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{prop.title}</p>
                        <p className="text-xs text-gray-400">{[prop.area, prop.city].filter(Boolean).join(", ")}</p>
                        <p className="text-xs text-gray-300">{prop.type}</p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-700">{formatNum(prop.views)}</div>
                    <div className="text-sm font-bold text-gray-700">{formatNum(prop.enquiries)}</div>
                    <div className="text-sm font-bold text-gray-700">{formatNum(prop.saves)}</div>
                    <div className="text-sm font-bold text-gray-700">{formatNum(prop.siteVisits)}</div>
                    <div className="flex items-center gap-2">
                      <div className="relative w-9 h-9">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3.5" />
                          <circle
                            cx="18" cy="18" r="15.9" fill="none"
                            stroke={scoreColor} strokeWidth="3.5"
                            strokeDasharray={`${prop.score} ${100 - prop.score}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[9px] font-extrabold" style={{ color: scoreColor }}>{prop.score}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold" style={{ color: scoreColor }}>{prop.score}/100</p>
                        <p className="text-[9px] text-gray-400">{prop.scoreLabel}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/owner/insights/performance/property/${prop.documentId || prop.id}`)}
                      className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-[#064d3b] transition whitespace-nowrap"
                    >
                      View Details
                    </button>
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
                  <ChevronDown size={14} className={`transition ${showMoreProps ? "rotate-180" : ""}`} />
                </button>
              </div>
            )}
          </div>

          {/* ---- PERFORMANCE SCORE + SMART INSIGHTS ---- */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

            {overallScore && (
              <PerformanceScoreWidget
                score={overallScore.score}
                label={overallScore.label}
                details={overallScore.details}
              />
            )}

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4">Smart Insights</h3>
              {data?.insights?.length > 0 ? (
                <div className="space-y-3">
                  {data.insights.map((ins, i) => (
                    <InsightItem key={i} insight={ins} router={router} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <span className="text-3xl mb-2">✨</span>
                  <p className="text-sm">Your properties are performing great! No recommendations right now.</p>
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-4 text-right">
                ⏱ All data updated as of {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
