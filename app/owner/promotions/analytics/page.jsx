"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Loader2,
  Eye,
  MessageSquare,
  Bookmark,
  PhoneCall,
  Rocket,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Filter,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../Footer";
import { getOwnerDashboard } from "@/services/ownerDashboard";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function calcGrowth(before, after) {
  if (!before || before === 0) return null;
  return (((after - before) / before) * 100).toFixed(1);
}

const STATUS_FILTERS = ["All", "Active", "Completed", "Expired"];
const TYPE_FILTERS = ["All Types", "Boost", "Featured", "Highlight"];

export default function PromotionAnalyticsPage() {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    async function loadPromotions() {
      try {
        setIsLoading(true);

        // Fetch owner first to get their id
        const meRes = await fetch(`${STRAPI_URL}/users/me`, { headers: getAuthHeaders() });
        if (!meRes.ok) throw new Error("Authentication required.");
        const me = await meRes.json();

        // Build query filtering by owner
        const populate = "populate[property][fields][0]=Title&populate[property][fields][1]=Area&populate[property][fields][2]=City&populate[property][fields][3]=Views&populate[property][fields][4]=Saves";
        const url = `${STRAPI_URL}/promotions?filters[owner][id][$eq]=${me.id}&${populate}&sort=createdAt:desc`;

        const [res, dashboardData] = await Promise.all([
          fetch(url, { headers: getAuthHeaders(), cache: "no-store" }),
          getOwnerDashboard()
        ]);
        if (!res.ok) throw new Error("Failed to load promotions.");
        const result = await res.json();
        setPromotions(result?.data || []);
        setDashboard(dashboardData || null);
      } catch (err) {
        setError(err.message || "Failed to load analytics.");
      } finally {
        setIsLoading(false);
      }
    }
    loadPromotions();
  }, []);

  // Apply filters
  const filtered = promotions.filter((p) => {
    const statusMatch =
      statusFilter === "All" ||
      p.status?.toLowerCase() === statusFilter.toLowerCase();
    const typeMatch =
      typeFilter === "All Types" ||
      p.promotionType?.toLowerCase() === typeFilter.toLowerCase();
    return statusMatch && typeMatch;
  });

  // Summary totals
  const activeCount = promotions.filter((p) => p.status === "active").length;
  const completedCount = promotions.filter((p) => p.status === "expired" || p.status === "completed").length;
  const totalViewsBefore = promotions.reduce((s, p) => s + (p.viewsBefore || 0), 0);
  const totalViewsAfter = promotions.reduce((s, p) => s + (p.viewsAfter || p.property?.Views || 0), 0);
  const totalEnqBefore = promotions.reduce((s, p) => s + (p.enquiriesBefore || 0), 0);
  const totalEnqAfter = promotions.reduce((s, p) => s + (p.enquiriesAfter || 0), 0);

  const summaryCards = [
    { label: "Total Promotions", value: promotions.length, sub: `${activeCount} active · ${completedCount} completed` },
    { label: "Total Views (Before)", value: totalViewsBefore, sub: "Before boost tracking" },
    { label: "Total Views (After)", value: totalViewsAfter, sub: "After boost tracking" },
    { label: "Total Enquiries Before", value: totalEnqBefore, sub: "Before boost" },
    { label: "Total Enquiries After", value: totalEnqAfter, sub: "After boost" },
  ];

  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FBF9] font-sans">
      <Header
        headerData={
          dashboard?.header ||
          dashboard?.Header ||
          null
        }
      />
      <main className="flex-1 pb-16 pt-8">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/owner/promotions")}
            className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#103D2E] hover:underline"
          >
            <ChevronLeft size={16} /> Back to Promotions
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103D2E]">
              <BarChart3 className="h-5 w-5 text-[#F3D59B]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#103D2E]">Promotion Analytics</h1>
          </div>
          <p className="text-gray-600 mt-1">Overview of all your active and past promotions.</p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
            <p>Loading your promotion data...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600 mb-6">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Summary Cards */}
            <div className="mb-10 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1 leading-tight">{card.label}</p>
                  <p className="text-3xl font-bold text-[#103D2E]">{card.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                <Filter className="h-4 w-4" /> Filter:
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                      statusFilter === s
                        ? "bg-[#103D2E] text-[#F3D59B]"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-[#F0F5F2]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="h-5 w-px bg-gray-200 hidden sm:block" />

              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                {TYPE_FILTERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                      typeFilter === t
                        ? "bg-[#103D2E] text-[#F3D59B]"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-[#F0F5F2]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
                <Rocket className="mb-4 h-12 w-12 text-gray-300" />
                <p className="text-lg font-bold text-[#103D2E]">
                  {promotions.length === 0 ? "No promotions yet" : "No promotions match your filters"}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {promotions.length === 0 ? "Boost a listing to see analytics here." : "Try changing your filter selection."}
                </p>
                {promotions.length === 0 && (
                  <Link
                    href="/owner/promotions/boost"
                    className="mt-6 rounded-xl bg-[#103D2E] px-6 py-3 text-sm font-bold text-[#F3D59B] hover:bg-[#1A5C47] transition-all"
                  >
                    Boost a Listing
                  </Link>
                )}
              </div>
            )}

            {/* Promotions Table */}
            {filtered.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#103D2E]">
                    {filtered.length} Promotion{filtered.length !== 1 ? "s" : ""}
                    {statusFilter !== "All" || typeFilter !== "All Types"
                      ? ` (filtered)`
                      : ""}
                  </h2>
                </div>

                {filtered.map((promo) => {
                  const property = promo.property;
                  const viewsGrowth = calcGrowth(promo.viewsBefore, promo.viewsAfter);
                  const enqGrowth = calcGrowth(promo.enquiriesBefore, promo.enquiriesAfter);
                  const isActive = promo.status === "active";

                  return (
                    <div key={promo.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4 border-b border-gray-50 px-6 py-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#103D2E] truncate">{property?.Title || "Property"}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {property?.Area}{property?.City ? `, ${property.City}` : ""}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 capitalize">
                            {promo.promotionType || "Boost"} Promotion · {formatDate(promo.startDate)} – {formatDate(promo.endDate)}
                          </p>
                        </div>
                        <span className={`shrink-0 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {promo.status || "Unknown"}
                        </span>
                      </div>

                      {/* Metrics row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-50">
                        {/* Views */}
                        <div className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                            <Eye className="h-3.5 w-3.5 text-blue-400" />
                            Views
                          </div>
                          <div className="flex items-end gap-3">
                            <div className="text-xs text-gray-400">
                              <div>Before: <span className="font-semibold text-gray-600">{promo.viewsBefore ?? "—"}</span></div>
                              <div>After: <span className="font-semibold text-[#103D2E]">{promo.viewsAfter ?? "—"}</span></div>
                            </div>
                            {viewsGrowth !== null && (
                              <span className={`flex items-center gap-0.5 text-xs font-bold ${parseFloat(viewsGrowth) >= 0 ? "text-green-600" : "text-red-500"}`}>
                                {parseFloat(viewsGrowth) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {viewsGrowth}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Enquiries */}
                        <div className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                            <MessageSquare className="h-3.5 w-3.5 text-purple-400" />
                            Enquiries
                          </div>
                          <div className="flex items-end gap-3">
                            <div className="text-xs text-gray-400">
                              <div>Before: <span className="font-semibold text-gray-600">{promo.enquiriesBefore ?? "—"}</span></div>
                              <div>After: <span className="font-semibold text-[#103D2E]">{promo.enquiriesAfter ?? "—"}</span></div>
                            </div>
                            {enqGrowth !== null && (
                              <span className={`flex items-center gap-0.5 text-xs font-bold ${parseFloat(enqGrowth) >= 0 ? "text-green-600" : "text-red-500"}`}>
                                {parseFloat(enqGrowth) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {enqGrowth}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Saves */}
                        <div className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                            <Bookmark className="h-3.5 w-3.5 text-amber-400" />
                            Saves
                          </div>
                          <div className="text-xs text-gray-400">
                            <div>Before: <span className="font-semibold text-gray-600">{promo.savesBefore ?? "—"}</span></div>
                            <div>After: <span className="font-semibold text-[#103D2E]">{promo.savesAfter ?? "—"}</span></div>
                          </div>
                        </div>

                        {/* Calls + CTA */}
                        <div className="px-5 py-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                              <PhoneCall className="h-3.5 w-3.5 text-green-400" />
                              Calls
                            </div>
                            <div className="text-xs text-gray-400">
                              <div>Before: <span className="font-semibold text-gray-600">{promo.callsBefore ?? "—"}</span></div>
                              <div>After: <span className="font-semibold text-[#103D2E]">{promo.callsAfter ?? "—"}</span></div>
                            </div>
                          </div>
                          <Link
                            href={`/owner/promotions/boost/performance?promotionId=${promo.documentId || promo.id}`}
                            className="mt-3 flex items-center gap-1 text-xs font-bold text-[#103D2E] hover:underline"
                          >
                            View Details <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      </main>

      <Footer
        data={
          dashboard?.Footer ||
          dashboard?.footer ||
          null
        }
      />
    </div>
  );
}
