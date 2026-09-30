"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Loader2, CheckCircle2, Highlighter } from "lucide-react";
import { getPricingConfig, getPropertyById } from "../../services/promotionService";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import { getOwnerDashboard } from "@/services/ownerDashboard";

function DurationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");

  const [property, setProperty] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!propertyId) return;
    async function loadData() {
      try {
        setIsLoading(true);
        const prop = await getPropertyById(propertyId);
        if (!prop) throw new Error("Property not found or access denied.");
        setProperty(prop);

        const config = await getPricingConfig();
        const highlightPlans = (config?.promotionPlans || [])
          .filter((p) => p.promotionType === "highlight" && p.isActive !== false)
          .sort((a, b) => a.durationDays - b.durationDays);
        setPlans(highlightPlans);

        if (highlightPlans.length > 0) {
          const recommended = highlightPlans.find((p) => p.isRecommended);
          setSelectedPlanId(recommended?.id || highlightPlans[0].id);
        }
      } catch (err) {
        setError(err.message || "Unable to load data.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [propertyId]);

  if (!propertyId) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600 mt-8">
        No property selected.
        <button onClick={() => router.push("/owner/promotions/highlight")} className="mt-4 block text-sm font-semibold underline mx-auto">
          Go Back
        </button>
      </div>
    );
  }

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  return (
    <>
      <div className="mb-8">
        <button onClick={() => router.push("/owner/promotions/highlight")} className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#103D2E] hover:underline">
          <ChevronLeft size={16} /> Back
        </button>
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 mb-3">
          <Highlighter className="h-3.5 w-3.5 text-purple-600" />
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Highlight Listing</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#103D2E]">Choose Highlight Duration</h1>
        <p className="mt-2 text-gray-600">
          Select how long you want to highlight: <span className="font-semibold text-[#103D2E]">{property?.Title}</span>
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-purple-600" /><p>Loading highlight plans...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600">{error}</div>
          ) : plans.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
              No highlight plans are currently available. Please contact your admin.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-[#103D2E] mb-2">Highlight Duration</h3>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all flex items-center justify-between ${
                    selectedPlanId === plan.id ? "border-purple-500 bg-purple-50" : "border-gray-100 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${selectedPlanId === plan.id ? "border-purple-500" : "border-gray-300"}`}>
                      {selectedPlanId === plan.id && <div className="h-3 w-3 rounded-full bg-purple-500" />}
                    </div>
                    <div>
                      <span className="font-bold text-[#103D2E] text-lg">{plan.name || `${plan.durationDays} Days`}</span>
                      {plan.isRecommended && (
                        <span className="ml-3 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">Recommended</span>
                      )}
                      {plan.benefits && <p className="mt-1 text-xs text-gray-500 max-w-sm">{plan.benefits}</p>}
                    </div>
                  </div>
                  <div className="font-bold text-[#103D2E] text-lg shrink-0 ml-4">₹{plan.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-[340px] shrink-0">
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Highlighter className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-bold text-[#103D2E]">Highlight Benefits</h3>
            </div>
            <ul className="space-y-3 mb-6">
              {[
                "Distinct highlight badge on your listing card",
                "Instantly noticed in search results",
                "More clicks and property page visits",
                "Better conversion to enquiries",
                "Stand out from non-highlighted listings",
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>

            {selectedPlan && (
              <div className="mb-5 rounded-xl bg-purple-50 border border-purple-200 p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-[#103D2E]">{selectedPlan.durationDays} Days</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Price</span>
                  <span className="font-semibold text-[#103D2E]">₹{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credits Required</span>
                  <span className="font-semibold text-[#103D2E]">{selectedPlan.creditsRequired || 1}</span>
                </div>
              </div>
            )}

            <button
              disabled={!selectedPlanId}
              onClick={() => router.push(`/owner/promotions/highlight/credits?propertyId=${propertyId}&planId=${selectedPlanId}&promotionType=highlight`)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-purple-700 transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Highlighter className="h-4 w-4" /> Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function HighlightDurationPage() {
  const [dashboard, setDashboard] = React.useState(null);

  React.useEffect(() => {
    getOwnerDashboard().then(d => setDashboard(d || null)).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FBF9] font-sans">
      <Header headerData={dashboard?.header || dashboard?.Header || null} />
      <main className="flex-1 pb-16 pt-8">
        <div className="mx-auto max-w-[1000px] px-4 md:px-6 lg:px-8">
          <Suspense fallback={
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-purple-600" />
            </div>
          }>
            <DurationContent />
          </Suspense>
        </div>
      </main>
      <Footer data={dashboard?.Footer || dashboard?.footer || null} />
    </div>
  );
}
