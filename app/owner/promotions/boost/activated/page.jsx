"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  Rocket,
  Building,
  Calendar,
  Zap,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import { getOwnerDashboard } from "@/services/ownerDashboard";

const STRAPI_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api"
    : process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

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

function ActivatedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promotionId = searchParams.get("promotionId");

  const [promotion, setPromotion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPromotion() {
      if (!promotionId) {
        setError("Promotion ID is missing. Cannot load activation details.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Try by documentId first, then by numeric id
        const res = await fetch(
          `${STRAPI_URL}/promotions?filters[documentId][$eq]=${promotionId}&populate[property][fields][0]=Title&populate[property][fields][1]=Area&populate[property][fields][2]=City&populate[owner][fields][0]=boostCredits`,
          { headers: getAuthHeaders(), cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to load promotion details.");
        const result = await res.json();
        const promo = result?.data?.[0] || null;

        if (!promo) {
          // Try numeric id fallback
          const res2 = await fetch(
            `${STRAPI_URL}/promotions/${promotionId}?populate[property][fields][0]=Title&populate[property][fields][1]=Area&populate[property][fields][2]=City&populate[owner][fields][0]=boostCredits`,
            { headers: getAuthHeaders(), cache: "no-store" }
          );
          if (!res2.ok) throw new Error("Promotion not found.");
          const result2 = await res2.json();
          setPromotion(result2?.data || null);
        } else {
          setPromotion(promo);
        }
      } catch (err) {
        setError(err.message || "Unable to load activation details.");
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
        <p>Loading activation details...</p>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-100 bg-red-50 p-8 text-center text-red-600 mt-8">
        <p className="font-semibold mb-2">{error || "Promotion details unavailable."}</p>
        <Link href="/owner/promotions" className="mt-4 inline-block text-sm font-bold underline">
          Back to Promotions
        </Link>
      </div>
    );
  }

  const property = promotion.property;
  const owner = promotion.owner;
  const remainingCredits = owner?.boostCredits ?? "N/A";
  const creditsUsed = promotion.creditsUsed || 1;
  const durationDays = promotion.durationDays || "N/A";

  return (
    <div className="flex flex-col items-center py-8">
      {/* Success animation */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#F0F5F2] shadow-inner">
          <CheckCircle2 className="h-14 w-14 text-[#103D2E]" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#103D2E]">
          Boost Activated!
        </h1>
        <p className="mt-3 max-w-md text-gray-600">
          Your property is now boosted and will receive increased visibility in search results.
        </p>
      </div>

      {/* Details card */}
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="bg-[#F0F5F2] px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-[#103D2E]" />
          <span className="font-bold text-[#103D2E]">Activation Summary</span>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-50">
            <span className="text-gray-500 flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-400" />
              Property
            </span>
            <span className="font-semibold text-[#103D2E] text-right max-w-[55%]">
              {property?.Title || "—"}
              {property?.Area && (
                <span className="block text-xs font-normal text-gray-500">
                  {property.Area}{property.City ? `, ${property.City}` : ""}
                </span>
              )}
            </span>
          </div>

          <div className="flex justify-between pb-4 border-b border-gray-50">
            <span className="text-gray-500 flex items-center gap-2">
              <Zap className="h-4 w-4 text-gray-400" />
              Promotion
            </span>
            <span className="font-semibold text-[#103D2E] capitalize">
              {promotion.promotionType || "Boost"} Listing
            </span>
          </div>

          <div className="flex justify-between pb-4 border-b border-gray-50">
            <span className="text-gray-500">Duration</span>
            <span className="font-semibold text-[#103D2E]">{durationDays} Days</span>
          </div>

          <div className="flex justify-between pb-4 border-b border-gray-50">
            <span className="text-gray-500 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              Start Date
            </span>
            <span className="font-semibold text-[#103D2E]">{formatDate(promotion.startDate)}</span>
          </div>

          <div className="flex justify-between pb-4 border-b border-gray-50">
            <span className="text-gray-500 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              End Date
            </span>
            <span className="font-semibold text-[#103D2E]">{formatDate(promotion.endDate)}</span>
          </div>

          <div className="flex justify-between pb-4 border-b border-gray-50">
            <span className="text-gray-500">Credits Used</span>
            <span className="font-semibold text-[#103D2E]">{creditsUsed}</span>
          </div>

          <div className="flex justify-between pb-4 border-b border-gray-50">
            <span className="text-gray-500">Remaining Boost Credits</span>
            <span className="font-semibold text-[#103D2E]">{remainingCredits}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 uppercase">
              <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
              {promotion.status || "Active"}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-lg">
        <Link
          href={`/owner/promotions/boost/performance?promotionId=${promotionId}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#103D2E] px-4 py-3.5 text-sm font-bold text-[#F3D59B] transition-all hover:bg-[#1A5C47] shadow-sm"
        >
          <TrendingUp className="h-4 w-4" />
          View Performance
        </Link>

        <Link
          href="/owner/properties"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#103D2E] bg-white px-4 py-3.5 text-sm font-bold text-[#103D2E] transition-all hover:bg-[#F0F5F2]"
        >
          <LayoutDashboard className="h-4 w-4" />
          My Properties
        </Link>

        <Link
          href="/owner/promotions"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
        >
          <ArrowRight className="h-4 w-4" />
          Promotions
        </Link>
      </div>
    </div>
  );
}

export default function ActivatedPage() {
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
            <ActivatedContent />
          </Suspense>
        </div>
      </main>
      <Footer data={dashboard?.Footer || dashboard?.footer || null} />
    </div>
  );
}
