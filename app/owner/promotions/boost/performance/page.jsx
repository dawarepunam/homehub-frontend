"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  Bookmark,
  PhoneCall,
  Calendar,
  Rocket,
  ChevronLeft,
  Clock,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import { getOwnerDashboard } from "@/services/ownerDashboard";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function calcGrowth(before, after) {
  if (before === 0 && after === 0) return null;
  if (before === 0) return null; // can't calculate % from 0
  return (((after - before) / before) * 100).toFixed(1);
}

function getRemainingDays(endDate) {
  if (!endDate) return null;
  const now = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff;
}

function MetricCard({ icon: Icon, label, before, after, iconColor }) {
  const growth = calcGrowth(before, after);
  const increased = after > before;
  const decreased = after < before;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <span className="font-bold text-[#103D2E]">{label}</span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Before Boost</span>
            <span className="font-semibold text-gray-700">{before}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-gray-300" style={{ width: "100%" }} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">After Boost</span>
            <span className="font-semibold text-[#103D2E]">{after}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#103D2E]"
              style={{
                width: before > 0 && after > 0
                  ? `${Math.min((after / Math.max(after, before)) * 100, 100)}%`
                  : after > 0 ? "100%" : "0%"
              }}
            />
          </div>
        </div>

        <div className="text-right shrink-0">
          {growth !== null ? (
            <div className={`flex items-center gap-1 text-lg font-bold ${increased ? "text-green-600" : decreased ? "text-red-500" : "text-gray-400"}`}>
              {increased ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {increased ? "+" : ""}{growth}%
            </div>
          ) : (
            <div className="text-sm text-gray-400 max-w-[80px] text-right">
              {after === 0 && before === 0 ? "No data yet" : "Tracking..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PerformanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promotionId = searchParams.get("promotionId");

  const [promotion, setPromotion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPromotion() {
      if (!promotionId) {
        setError("Promotion ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Try by documentId first
        const res = await fetch(
          `${STRAPI_URL}/promotions?filters[documentId][$eq]=${promotionId}&populate[property][fields][0]=Title&populate[property][fields][1]=Area&populate[property][fields][2]=City`,
          { headers: getAuthHeaders(), cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to load promotion.");
        const result = await res.json();
        let promo = result?.data?.[0] || null;

        if (!promo) {
          // Fallback by numeric id
          const res2 = await fetch(
            `${STRAPI_URL}/promotions/${promotionId}?populate[property][fields][0]=Title&populate[property][fields][1]=Area&populate[property][fields][2]=City`,
            { headers: getAuthHeaders(), cache: "no-store" }
          );
          if (!res2.ok) throw new Error("Promotion not found.");
          const result2 = await res2.json();
          promo = result2?.data || null;
        }

        if (!promo) throw new Error("Promotion not found.");
        setPromotion(promo);
      } catch (err) {
        setError(err.message || "Unable to load performance data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPromotion();
  }, [promotionId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
        <p>Loading performance data...</p>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-100 bg-red-50 p-8 text-center text-red-600 mt-8">
        <p className="font-semibold mb-2">{error || "Promotion not found."}</p>
        <Link href="/owner/promotions" className="mt-4 inline-block text-sm font-bold underline">
          Back to Promotions
        </Link>
      </div>
    );
  }

  const remainingDays = getRemainingDays(promotion.endDate);
  const isActive = promotion.status === "active";
  const isExpired = promotion.status === "expired" || promotion.status === "completed";

  const metrics = [
    {
      icon: Eye,
      label: "Views",
      before: promotion.viewsBefore || 0,
      after: promotion.viewsAfter || 0,
      iconColor: "text-blue-500",
    },
    {
      icon: MessageSquare,
      label: "Enquiries",
      before: promotion.enquiriesBefore || 0,
      after: promotion.enquiriesAfter || 0,
      iconColor: "text-purple-500",
    },
    {
      icon: Bookmark,
      label: "Saves",
      before: promotion.savesBefore || 0,
      after: promotion.savesAfter || 0,
      iconColor: "text-amber-500",
    },
    {
      icon: PhoneCall,
      label: "Calls",
      before: promotion.callsBefore || 0,
      after: promotion.callsAfter || 0,
      iconColor: "text-green-500",
    },
  ];

  const hasAnyAfterData = metrics.some((m) => m.after > 0);

  return (
    <>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#103D2E] hover:underline"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-[#103D2E]">
          Boost Performance
        </h1>
        <p className="mt-2 text-gray-600">
          {promotion.property?.Title || "Your property"} — Tracking boost impact
        </p>
      </div>

      {/* Status bar */}
      <div className="mb-8 rounded-2xl border bg-white p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? "bg-green-100" : "bg-gray-100"}`}>
            <Rocket className={`h-5 w-5 ${isActive ? "text-green-700" : "text-gray-400"}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Promotion Status</p>
            <p className={`font-bold uppercase text-sm ${isActive ? "text-green-700" : "text-gray-600"}`}>
              {promotion.status || "Active"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Start: <strong>{formatDate(promotion.startDate)}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>End: <strong>{formatDate(promotion.endDate)}</strong></span>
          </div>
          {isActive && remainingDays !== null && (
            <div className="flex items-center gap-2 text-[#103D2E]">
              <Clock className="h-4 w-4 text-[#4A7465]" />
              <span className="font-bold">{remainingDays > 0 ? `${remainingDays} day${remainingDays !== 1 ? "s" : ""} remaining` : "Ending today"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics */}
      {!hasAnyAfterData && isActive && (
        <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <strong>Tracking in progress.</strong> After-boost metrics will be updated as your property receives more activity. Check back soon.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {isExpired && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600 text-center">
          This promotion has ended. The metrics shown are the final performance snapshot.
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/owner/promotions/boost"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#103D2E] px-4 py-3.5 text-sm font-bold text-[#F3D59B] hover:bg-[#1A5C47] transition-all shadow-sm"
        >
          <Rocket className="h-4 w-4" />
          Boost Another Property
        </Link>
        <Link
          href="/owner/promotions"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
        >
          All Promotions
        </Link>
      </div>
    </>
  );
}

export default function PerformancePage() {
  const [dashboard, setDashboard] = React.useState(null);

  React.useEffect(() => {
    getOwnerDashboard().then(d => setDashboard(d || null)).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FBF9] font-sans">
      <Header headerData={dashboard?.header || dashboard?.Header || null} />
      <main className="flex-1 pb-16 pt-8">
        <div className="mx-auto max-w-[900px] px-4 md:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
                <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
              </div>
            }
          >
            <PerformanceContent />
          </Suspense>
        </div>
      </main>
      <Footer data={dashboard?.Footer || dashboard?.footer || null} />
    </div>
  );
}
