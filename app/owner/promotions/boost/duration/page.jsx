"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import { getPricingConfig, getPropertyById } from "../../services/promotionService";
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
    async function loadData() {
      if (!propertyId) return;

      try {
        setIsLoading(true);
        setError(null);

        // 1. Verify property ownership
        const prop = await getPropertyById(propertyId);
        if (!prop) {
          throw new Error("Property not found or access denied.");
        }
        setProperty(prop);

        // 2. Load pricing config
        const config = await getPricingConfig();
        
        // Filter only active boost plans
        const boostPlans = (config?.promotionPlans || [])
          .filter(p => p.promotionType === "boost" && p.isActive !== false)
          .sort((a, b) => a.durationDays - b.durationDays);
        
        setPlans(boostPlans);
        
        // Select recommended or first plan by default
        if (boostPlans.length > 0) {
          const recommended = boostPlans.find(p => p.isRecommended);
          setSelectedPlanId(recommended?.id || boostPlans[0].id);
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
        <button onClick={() => router.push("/owner/promotions/boost")} className="mt-4 block text-sm font-semibold underline">
          Go Back
        </button>
      </div>
    );
  }

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  return (
    <>
      <div className="mb-8">
        <button
          onClick={() => router.push(`/owner/promotions/boost/select-property?propertyId=${propertyId}`)}
          className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#103D2E] hover:underline"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-[#103D2E]">
          Choose Boost Duration
        </h1>
        <p className="mt-2 text-gray-600">
          Select duration to start boosting your property.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
              <p>Loading plans...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
              {error}
            </div>
          ) : plans.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
              No boost plans are currently available.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-[#103D2E] mb-2">Boost Duration</h3>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all flex items-center justify-between ${
                    selectedPlanId === plan.id
                      ? "border-[#103D2E] bg-[#F0F5F2]"
                      : "border-gray-100 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      selectedPlanId === plan.id ? "border-[#103D2E]" : "border-gray-300"
                    }`}>
                      {selectedPlanId === plan.id && <div className="h-3 w-3 rounded-full bg-[#103D2E]" />}
                    </div>
                    <div>
                      <span className="font-bold text-[#103D2E] text-lg">{plan.name || `${plan.durationDays} Days`}</span>
                      {plan.isRecommended && (
                        <span className="ml-3 rounded-full bg-[#F3D59B] px-2.5 py-0.5 text-xs font-bold text-[#103D2E]">
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="font-bold text-[#103D2E] text-lg">
                    ₹{plan.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Benefits & Continue */}
        <div className="w-full lg:w-[340px] shrink-0">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-[#103D2E] mb-4">You will get</h3>
            <ul className="space-y-4 mb-8">
              {[
                "More visibility in search results",
                "More property views",
                "More potential enquiries",
                "Better chance of reaching buyers"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#4A7465] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <button
              disabled={!selectedPlanId}
              onClick={() => router.push(`/owner/promotions/boost/subscription?propertyId=${propertyId}&planId=${selectedPlanId}&promotionType=boost`)}
              className="flex w-full items-center justify-center rounded-xl bg-[#F3D59B] px-4 py-3.5 text-sm font-bold text-[#103D2E] transition-all hover:bg-[#E5C384] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DurationSelectionPage() {
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
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
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
