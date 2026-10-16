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
} from "recharts";
import {
  Eye,
  MessageSquare,
  Bookmark,
  PhoneCall,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  RotateCw,
  ChevronDown,
  Building2,
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
} from "lucide-react";

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

// Monochrome / Neutral palette for enquiry statuses
const ENQUIRY_MONOCHROME_COLORS = [
  "#18181B",
  "#3F3F46",
  "#71717A",
  "#A1A1AA",
  "#D4D4D8",
  "#52525B",
  "#27272A",
];

function formatNum(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

// =====================================================
// KPI METRIC CARD (MONOCHROME & REFINED)
// =====================================================

function KpiCard({ icon: Icon, title, value, growth, subtitle, onClick }) {
  const hasGrowth = growth !== null && growth !== undefined;
  const isPositive = growth >= 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--seller-border-focus)] hover:shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--seller-text)]"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold tracking-wider text-[var(--seller-text-muted)] uppercase">
            {title}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] text-[var(--seller-text)] transition-colors group-hover:bg-[var(--seller-surface-hover)]">
            <Icon size={15} strokeWidth={1.8} />
          </div>
        </div>

        <div className="mt-3">
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--seller-text)]">
            {formatNum(value)}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--seller-border-subtle)] flex items-center justify-between text-xs">
        {subtitle && (
          <span className="truncate text-[11px] text-[var(--seller-text-subtle)]">
            {subtitle}
          </span>
        )}
        {hasGrowth && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {isPositive ? "+" : ""}
            {growth}%
          </span>
        )}
      </div>
    </button>
  );
}

// =====================================================
// SKELETON LOADERS
// =====================================================

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-5 shadow-xs animate-pulse">
      <div className="flex justify-between items-center mb-3">
        <div className="h-3 bg-[var(--seller-bg-subtle)] rounded w-20"></div>
        <div className="w-8 h-8 rounded-lg bg-[var(--seller-bg-subtle)]"></div>
      </div>
      <div className="h-7 bg-[var(--seller-bg-subtle)] rounded w-24 my-2"></div>
      <div className="h-3 bg-[var(--seller-bg-subtle)] rounded w-32 mt-3"></div>
    </div>
  );
}

// =====================================================
// PERFORMANCE SCORE WIDGET
// =====================================================

function PerformanceScoreWidget({ score, label, details }) {
  const bars = [
    { key: "listingQuality", label: "Listing Quality", value: details.listingQuality },
    { key: "viewsScore", label: "Views", value: details.viewsScore },
    { key: "engagementScore", label: "Engagement", value: details.engagementScore },
    { key: "enquiryScore", label: "Enquiries", value: details.enquiryScore },
    { key: "responseRate", label: "Response Rate", value: details.responseRate },
  ];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 shadow-xs">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[var(--seller-border-subtle)]">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-[var(--seller-text)]">
              Performance Score
            </h3>
            <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
              Composite rating of listing completeness and engagement
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--seller-text)]">
            <BarChart3 size={11} strokeWidth={2} />
            {label}
          </span>
        </div>

        {/* Circular Progress + Value */}
        <div className="flex items-center gap-6 my-6">
          <div className="relative h-24 w-24 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                className="text-[var(--seller-border-subtle)]"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeDasharray={`${score} ${100 - score}`}
                strokeLinecap="round"
                className="text-[var(--seller-text)] transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold tracking-tight text-[var(--seller-text)]">
                {score}
              </span>
              <span className="text-[10px] font-medium text-[var(--seller-text-muted)]">
                / 100
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[var(--seller-text)]">{label} Rating</span>
            </div>
            <p className="text-xs text-[var(--seller-text-muted)] mt-1 leading-relaxed">
              Based on overall view-to-lead ratios, profile completeness, and timely responses to enquiries.
            </p>
          </div>
        </div>

        {/* Breakdown Bars */}
        <div className="space-y-3.5">
          {bars.map((b) => (
            <div key={b.key}>
              <div className="flex justify-between text-xs font-semibold text-[var(--seller-text-muted)] mb-1.5">
                <span>{b.label}</span>
                <span className="text-[var(--seller-text)] font-bold">{b.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--seller-bg-subtle)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--seller-text)] transition-all duration-700"
                  style={{ width: `${b.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--seller-border-subtle)] text-[11px] text-[var(--seller-text-subtle)]">
        Calculated dynamically from real property activity
      </div>
    </div>
  );
}

// =====================================================
// SMART INSIGHT ITEM (MONOCHROME & REFINED)
// =====================================================

function InsightItem({ insight, router }) {
  const isClickable = Boolean(insight.action);

  return (
    <div
      onClick={() => isClickable && router.push(insight.action)}
      className={`group flex items-start justify-between gap-3 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] p-3.5 transition-all ${
        isClickable
          ? "cursor-pointer hover:border-[var(--seller-border-focus)] hover:bg-[var(--seller-surface-hover)]"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[var(--seller-border)] bg-[var(--seller-surface)] text-[var(--seller-text)] text-xs">
          <Sparkles size={13} strokeWidth={2} />
        </div>
        <div>
          <p className="text-xs font-semibold leading-relaxed text-[var(--seller-text)]">
            {insight.text}
          </p>
        </div>
      </div>

      {isClickable && (
        <span className="shrink-0 text-[var(--seller-text-muted)] group-hover:text-[var(--seller-text)] transition-transform group-hover:translate-x-0.5">
          <ArrowRight size={14} />
        </span>
      )}
    </div>
  );
}

// =====================================================
// MAIN PERFORMANCE PAGE
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
  const [refreshing, setRefreshing] = useState(false);

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
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period, selectedPropertyId);
  }, [period, selectedPropertyId, fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(period, selectedPropertyId);
  };

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

    const details = {
      listingQuality: Math.round(
        data.propertyPerformance.reduce((s, p) => s + p.scoreDetails.listingQuality, 0) /
          data.propertyPerformance.length
      ),
      viewsScore: Math.round(
        data.propertyPerformance.reduce((s, p) => s + p.scoreDetails.viewsScore, 0) /
          data.propertyPerformance.length
      ),
      engagementScore: Math.round(
        data.propertyPerformance.reduce((s, p) => s + p.scoreDetails.engagementScore, 0) /
          data.propertyPerformance.length
      ),
      enquiryScore: Math.round(
        data.propertyPerformance.reduce((s, p) => s + p.scoreDetails.enquiryScore, 0) /
          data.propertyPerformance.length
      ),
      responseRate: Math.round(
        data.propertyPerformance.reduce((s, p) => s + p.scoreDetails.responseRate, 0) /
          data.propertyPerformance.length
      ),
    };
    return { score: avg, label, details };
  }, [data]);

  // ---- PROPERTY OPTIONS FOR FILTER ----
  const propertyOptions = useMemo(() => {
    if (!data) return [];
    return data.allProperties.map((p) => ({
      id: p?.documentId || p?.id,
      label: p?.Title || "Untitled Property",
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
  if (loading && !data) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
          <div className="mb-6">
            <div className="h-4 w-48 rounded bg-[var(--seller-bg-subtle)] animate-pulse" />
          </div>

          <header className="mx-auto mb-8 max-w-2xl text-center">
            <div className="mx-auto h-6 w-28 rounded-full bg-[var(--seller-bg-subtle)] animate-pulse" />
            <div className="mx-auto mt-3 h-9 w-56 rounded-xl bg-[var(--seller-bg-subtle)] animate-pulse" />
            <div className="mx-auto mt-2 h-4 w-72 rounded bg-[var(--seller-bg-subtle)] animate-pulse" />
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 h-72 animate-pulse" />
            <div className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 h-72 animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================
  if (error && !data) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] flex items-center justify-center text-xl mb-4 shadow-xs">
            <AlertTriangle size={24} className="text-[var(--seller-text-muted)]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--seller-text)]">
            Unable to load performance data
          </h2>
          <p className="text-sm text-[var(--seller-text-muted)] mt-1.5 max-w-md">
            {error}
          </p>
          <button
            type="button"
            onClick={() => fetchData(period, selectedPropertyId)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--seller-primary)] px-5 py-2.5 text-xs font-bold text-[var(--seller-bg)] shadow-xs transition hover:opacity-90 active:scale-95 cursor-pointer"
          >
            <RotateCw size={13} />
            Try Again
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // =====================================================
  // EMPTY STATE (No Properties)
  // =====================================================
  if (!loading && !error && data?.allProperties?.length === 0) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
        <Header />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] flex items-center justify-center text-2xl mb-4 shadow-xs">
            <Building2 size={28} className="text-[var(--seller-text-muted)]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--seller-text)] mb-2">
            No Properties Found
          </h2>
          <p className="text-sm text-[var(--seller-text-muted)] max-w-md mb-6">
            Add your first property listing to begin tracking views, enquiries, saves, and overall listing performance.
          </p>
          <Link
            href="/add-property"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--seller-primary)] px-5 py-2.5 text-xs font-bold text-[var(--seller-bg)] shadow-xs transition hover:opacity-90 active:scale-95"
          >
            + Add Property
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // =====================================================
  // FULL DASHBOARD RENDER
  // =====================================================
  return (
    <div className="seller-page-wrapper flex min-h-screen flex-col font-sans">
      <Header />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <nav
            aria-label="Breadcrumb"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--seller-text-muted)]"
          >
            <Link
              href="/owner"
              className="hover:text-[var(--seller-text)] transition-colors"
            >
              Home
            </Link>
            <span className="text-[var(--seller-text-subtle)]">›</span>
            <span>Insights</span>
            <span className="text-[var(--seller-text-subtle)]">›</span>
            <span className="text-[var(--seller-text)] font-bold">Performance</span>
          </nav>
        </div>

        {/* 2. CENTERED PAGE HEADING & DESCRIPTION */}
        <header className="mx-auto mb-6 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3.5 py-1 text-[11px] font-semibold text-[var(--seller-text-muted)] shadow-xs">
            <BarChart3 size={12} strokeWidth={2} />
            <span>Seller Analytics</span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
            Performance
          </h1>

          <p className="mt-2 text-sm text-[var(--seller-text-muted)] sm:text-base sm:leading-relaxed">
            Track how your properties are performing.
          </p>
        </header>

        {/* 3. FILTER TOOLBAR (Compact, aligned to right on desktop) */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-2.5 sm:p-3 shadow-xs">
          <div className="flex items-center gap-2 px-2 text-xs font-semibold text-[var(--seller-text-muted)]">
            <span className="hidden md:inline">Dashboard Filters</span>
            {selectedPropertyId && (
              <span className="rounded-md bg-[var(--seller-bg-subtle)] px-2 py-0.5 text-[11px] font-bold text-[var(--seller-text)]">
                Filtered: 1 Property
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
            {/* Property Selector */}
            <div className="relative flex-1 sm:flex-initial min-w-[160px]">
              <select
                value={selectedPropertyId || ""}
                onChange={(e) => setSelectedPropertyId(e.target.value || null)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] pl-3.5 pr-8 text-xs font-semibold text-[var(--seller-text)] outline-none transition-colors hover:border-[var(--seller-border-focus)] focus:border-[var(--seller-border-focus)] focus:bg-[var(--seller-surface)] cursor-pointer"
              >
                <option value="">All Properties</option>
                {propertyOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-muted)]"
              />
            </div>

            {/* Date-Range Period Selector */}
            <div className="relative min-w-[130px]">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] pl-3.5 pr-8 text-xs font-semibold text-[var(--seller-text)] outline-none transition-colors hover:border-[var(--seller-border-focus)] focus:border-[var(--seller-border-focus)] focus:bg-[var(--seller-surface)] cursor-pointer"
              >
                {PERIOD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-muted)]"
              />
            </div>

            {/* Refresh Action Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] text-[var(--seller-text)] transition-colors hover:border-[var(--seller-border-focus)] hover:bg-[var(--seller-surface-hover)] cursor-pointer active:scale-95 disabled:opacity-50"
              title="Refresh Analytics"
              aria-label="Refresh data"
            >
              <RotateCw size={14} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* 4. PERFORMANCE METRIC CARDS (5 Balanced KPI Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
          <KpiCard
            icon={Eye}
            title="Property Views"
            value={data?.kpis?.views?.value}
            growth={data?.kpis?.views?.growth}
            subtitle="Page visits"
            onClick={() => router.push("/owner/insights/performance")}
          />
          <KpiCard
            icon={MessageSquare}
            title="Enquiries"
            value={data?.kpis?.enquiries?.value}
            growth={data?.kpis?.enquiries?.growth}
            subtitle="Customer leads"
            onClick={() => router.push("/owner/enquiries/new")}
          />
          <KpiCard
            icon={Bookmark}
            title="Saves"
            value={data?.kpis?.saves?.value}
            growth={null}
            subtitle="User wishlists"
            onClick={() => router.push("/owner/insights/performance")}
          />
          <KpiCard
            icon={PhoneCall}
            title="Contact Actions"
            value={data?.kpis?.contactActions?.value}
            growth={null}
            subtitle="Direct outreach"
            onClick={() => router.push("/owner/enquiries/contacted")}
          />
          <KpiCard
            icon={CalendarCheck}
            title="Site Visits"
            value={data?.kpis?.siteVisits?.value}
            growth={null}
            subtitle="Booked / Scheduled"
            onClick={() => router.push("/owner/site-visits/upcoming")}
          />
        </div>

        {/* 5. BALANCED ANALYTICS CHARTS (2 Columns on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
          {/* Views Analytics Card (2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 shadow-xs">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--seller-border-subtle)] mb-5">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-[var(--seller-text)]">
                    Views Analytics
                  </h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[var(--seller-text)]">
                      {formatNum(data?.kpis?.views?.value)}
                    </span>
                    <span className="text-xs font-semibold text-[var(--seller-text-muted)]">
                      Total views in period
                    </span>
                  </div>
                </div>

                {/* Daily / Weekly / Monthly Segmented Control */}
                <div className="inline-flex rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] p-1">
                  {["daily", "weekly", "monthly"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setChartTab(tab)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                        chartTab === tab
                          ? "bg-[var(--seller-surface)] text-[var(--seller-text)] shadow-xs"
                          : "text-[var(--seller-text-muted)] hover:text-[var(--seller-text)]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="text-[var(--seller-border-subtle)] opacity-60"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "var(--seller-text-muted)" }}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--seller-text-muted)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--seller-surface)",
                        borderColor: "var(--seller-border)",
                        borderRadius: 12,
                        color: "var(--seller-text)",
                        fontSize: 12,
                        boxShadow: "0 8px 24px -4px rgba(0,0,0,0.15)",
                      }}
                      labelStyle={{
                        fontWeight: 700,
                        color: "var(--seller-text)",
                        marginBottom: 4,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--seller-text)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: "var(--seller-surface)",
                        stroke: "var(--seller-text)",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--seller-border-subtle)] flex items-center justify-between text-[11px] text-[var(--seller-text-subtle)]">
              <span>Timeline: {period.toUpperCase()}</span>
              <span>Updated automatically</span>
            </div>
          </div>

          {/* Enquiry Analytics Card (1 col) */}
          <div className="flex flex-col justify-between rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[var(--seller-border-subtle)] mb-4">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-[var(--seller-text)]">
                    Enquiry Analytics
                  </h3>
                  <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                    Breakdown by current lead stage
                  </p>
                </div>
                <span className="text-xs font-bold text-[var(--seller-text)]">
                  {data?.kpis?.enquiries?.value || 0} Total
                </span>
              </div>

              {donutData.length > 0 ? (
                <>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={72}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {donutData.map((_, idx) => (
                            <Cell
                              key={`cell-${idx}`}
                              fill={ENQUIRY_MONOCHROME_COLORS[idx % ENQUIRY_MONOCHROME_COLORS.length]}
                              stroke="var(--seller-surface)"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--seller-surface)",
                            borderColor: "var(--seller-border)",
                            borderRadius: 10,
                            color: "var(--seller-text)",
                            fontSize: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
                    {donutData.map((d, idx) => {
                      const totalEnq = data?.kpis?.enquiries?.value || 1;
                      const pct = Math.round((d.value / totalEnq) * 100);
                      const color =
                        ENQUIRY_MONOCHROME_COLORS[idx % ENQUIRY_MONOCHROME_COLORS.length];
                      return (
                        <div
                          key={d.name}
                          className="flex items-center justify-between text-xs py-0.5"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-medium text-[var(--seller-text-muted)] truncate">
                              {d.name}
                            </span>
                          </div>
                          <span className="font-bold text-[var(--seller-text)] pl-2 shrink-0">
                            {d.value} <span className="font-normal text-[var(--seller-text-subtle)]">({pct}%)</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--seller-text-muted)]">
                  <Info size={24} className="mb-2 text-[var(--seller-text-subtle)]" />
                  <p className="text-xs">No enquiry status data for this period.</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--seller-border-subtle)] text-[11px] text-[var(--seller-text-subtle)] text-right">
              Live Strapi lead states
            </div>
          </div>
        </div>

        {/* 6. PROPERTY-WISE PERFORMANCE TABLE */}
        <div className="rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] shadow-xs mb-8 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--seller-border-subtle)]">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-[var(--seller-text)]">
                Property-wise Performance
              </h3>
              <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                Detailed metrics, activity rates and quality scores per listing
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--seller-text-muted)]">
              Showing {visibleProperties.length} of {data?.propertyPerformance?.length || 0}
            </span>
          </div>

          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_1.4fr_auto] gap-4 px-6 py-3 text-[11px] font-bold text-[var(--seller-text-muted)] uppercase tracking-wider bg-[var(--seller-bg-subtle)] border-b border-[var(--seller-border-subtle)]">
            <span>Property</span>
            <span className="text-center">Views</span>
            <span className="text-center">Enquiries</span>
            <span className="text-center">Saves</span>
            <span className="text-center">Site Visits</span>
            <span className="text-center">Score</span>
            <span className="text-right">Action</span>
          </div>

          {/* Table Rows */}
          {visibleProperties.length === 0 ? (
            <div className="p-12 text-center text-sm text-[var(--seller-text-muted)]">
              No property data available.
            </div>
          ) : (
            <div className="divide-y divide-[var(--seller-border-subtle)]">
              {visibleProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="flex flex-col md:grid md:grid-cols-[2.5fr_1fr_1fr_1fr_1fr_1.4fr_auto] gap-3 md:gap-4 px-5 py-4 transition-colors hover:bg-[var(--seller-surface-hover)] items-start md:items-center"
                >
                  {/* Property Info */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {prop.imgUrl ? (
                      <img
                        src={prop.imgUrl}
                        alt={prop.title}
                        className="h-11 w-11 rounded-xl object-cover border border-[var(--seller-border)] shrink-0"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] text-[var(--seller-text)]">
                        <Building2 size={16} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-[var(--seller-text)] truncate">
                        {prop.title}
                      </p>
                      <p className="text-[11px] text-[var(--seller-text-muted)] truncate">
                        {[prop.area, prop.city].filter(Boolean).join(", ") || "Location unlisted"}
                      </p>
                      <span className="inline-block text-[10px] uppercase font-semibold tracking-wider text-[var(--seller-text-subtle)]">
                        {prop.type || "Residential"}
                      </span>
                    </div>
                  </div>

                  {/* Metrics on Mobile / Desktop */}
                  <div className="grid grid-cols-4 md:contents w-full pt-2 md:pt-0 border-t md:border-t-0 border-[var(--seller-border-subtle)] text-center">
                    <div>
                      <span className="block text-[10px] md:hidden text-[var(--seller-text-subtle)] uppercase">Views</span>
                      <span className="text-xs sm:text-sm font-bold text-[var(--seller-text)]">
                        {formatNum(prop.views)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] md:hidden text-[var(--seller-text-subtle)] uppercase">Enq</span>
                      <span className="text-xs sm:text-sm font-bold text-[var(--seller-text)]">
                        {formatNum(prop.enquiries)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] md:hidden text-[var(--seller-text-subtle)] uppercase">Saves</span>
                      <span className="text-xs sm:text-sm font-bold text-[var(--seller-text)]">
                        {formatNum(prop.saves)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] md:hidden text-[var(--seller-text-subtle)] uppercase">Visits</span>
                      <span className="text-xs sm:text-sm font-bold text-[var(--seller-text)]">
                        {formatNum(prop.siteVisits)}
                      </span>
                    </div>
                  </div>

                  {/* Score Indicator */}
                  <div className="flex items-center justify-between md:justify-center gap-3 w-full md:w-auto">
                    <span className="text-[11px] md:hidden font-semibold text-[var(--seller-text-muted)]">Performance Score:</span>
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 shrink-0">
                        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                          <circle
                            cx="18"
                            cy="18"
                            r="15.9"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            className="text-[var(--seller-border-subtle)]"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="15.9"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeDasharray={`${prop.score} ${100 - prop.score}`}
                            strokeLinecap="round"
                            className="text-[var(--seller-text)]"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[9px] font-extrabold text-[var(--seller-text)]">
                            {prop.score}
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-[11px] font-bold text-[var(--seller-text)] leading-none">
                          {prop.score}/100
                        </p>
                        <p className="text-[9px] text-[var(--seller-text-muted)] mt-0.5">
                          {prop.scoreLabel}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="w-full md:w-auto flex justify-end pt-2 md:pt-0">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/owner/insights/performance/property/${prop.documentId || prop.id}`
                        )
                      }
                      className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] px-3.5 py-1.5 text-xs font-bold text-[var(--seller-text)] transition-all hover:border-[var(--seller-border-focus)] hover:bg-[var(--seller-surface-hover)] cursor-pointer active:scale-95 whitespace-nowrap"
                    >
                      <span>View Details</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show More toggle */}
          {data?.propertyPerformance?.length > 5 && (
            <div className="p-3 text-center border-t border-[var(--seller-border-subtle)] bg-[var(--seller-bg-subtle)]">
              <button
                type="button"
                onClick={() => setShowMoreProps(!showMoreProps)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--seller-text)] hover:underline cursor-pointer"
              >
                {showMoreProps
                  ? "Show Less"
                  : `View More Properties (${data.propertyPerformance.length - 5} more)`}
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    showMoreProps ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        {/* 7. PERFORMANCE SCORE + SMART INSIGHTS (Side-by-side on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
          {overallScore && (
            <PerformanceScoreWidget
              score={overallScore.score}
              label={overallScore.label}
              details={overallScore.details}
            />
          )}

          {/* Smart Insights */}
          <div className="flex flex-col justify-between rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-6 shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--seller-border-subtle)] mb-5">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-[var(--seller-text)]">
                    Smart Insights
                  </h3>
                  <p className="text-xs text-[var(--seller-text-muted)] mt-0.5">
                    Actionable suggestions generated from user engagement
                  </p>
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] text-[var(--seller-text)]">
                  <Sparkles size={14} />
                </span>
              </div>

              {data?.insights?.length > 0 ? (
                <div className="space-y-3">
                  {data.insights.map((ins, i) => (
                    <InsightItem key={i} insight={ins} router={router} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--seller-text-muted)]">
                  <CheckCircle2 size={28} className="mb-2 text-[var(--seller-text-subtle)]" />
                  <p className="text-xs font-semibold text-[var(--seller-text)]">
                    Your properties are performing optimally
                  </p>
                  <p className="text-[11px] text-[var(--seller-text-muted)] mt-1 max-w-xs">
                    No urgent action items or suggestions detected for this period.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--seller-border-subtle)] flex items-center justify-between text-[11px] text-[var(--seller-text-subtle)]">
              <span>Automated recommendations</span>
              <span>
                Updated {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
