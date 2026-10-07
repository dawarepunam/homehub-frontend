"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Loader2, Highlighter, CheckCircle2, TrendingUp } from "lucide-react";
import { getOwnerDetails, getPricingConfig, getPropertyById, getSubscriptionPlans } from "../../services/promotionService";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import { getOwnerDashboard } from "@/services/ownerDashboard";

function CreditsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const planId = searchParams.get("planId");
  const promotionType = "highlight";

  const [owner, setOwner] = useState(null);
  const [property, setProperty] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState(null);

  useEffect(() => {
    if (!propertyId || !planId) return;
    async function load() {
      try {
        setIsLoading(true);
        const prop = await getPropertyById(propertyId);
        if (!prop) throw new Error("Property not found or access denied.");
        setProperty(prop);

        const [ownerData, configData, subPlans] = await Promise.all([
          getOwnerDetails(),
          getPricingConfig(),
          getSubscriptionPlans(),
        ]);
        setOwner(ownerData);
        setSubscriptionPlans(subPlans);

        const plan = (configData?.promotionPlans || []).find((p) => p.id == planId);
        if (!plan) throw new Error("Selected plan is invalid.");
        setSelectedPlan(plan);
      } catch (err) {
        setError(err.message || "Unable to load details.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [propertyId, planId]);

  const handleUseCredit = async () => {
    if (isActivating) return;
    setIsActivating(true);
    setActivationError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) throw new Error("Please log in to continue.");

      const res = await fetch("/api/owner/promotions/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ propertyId, planId, promotionType }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Activation failed.");
      router.push(`/owner/promotions/highlight/activated?promotionId=${result.promotionId}`);
    } catch (err) {
      setActivationError(err.message || "An error occurred.");
      setIsActivating(false);
    }
  };

  if (isLoading) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
      <Loader2 className="mb-4 h-8 w-8 animate-spin text-purple-600" /><p>Checking your Highlight Credits...</p>
    </div>
  );

  if (error) return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600 mt-8">
      {error}<button onClick={() => router.push("/owner/promotions/highlight")} className="mt-4 block text-sm font-semibold underline mx-auto">Go Back</button>
    </div>
  );

  const creditsRequired = selectedPlan?.creditsRequired || 1;
  const hasCredits = (owner?.highlightCredits || 0) >= creditsRequired;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "N/A";

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
        <h1 className="text-3xl font-bold tracking-tight text-[#103D2E]">Check Highlight Credits</h1>
      </div>

      {hasCredits ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-purple-100 bg-white p-8 shadow-sm text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50">
            <Highlighter className="h-8 w-8 text-purple-500" />
          </div>
          <h2 className="text-xl text-gray-800 mb-2 font-bold">You have Highlight Credits available!</h2>
          <p className="text-gray-500 text-sm mb-6">Use your Highlight Credit to activate this promotion without any payment.</p>

          <div className="mx-auto mb-8 max-w-md rounded-xl border border-purple-100 bg-purple-50 p-5 text-left text-sm text-[#103D2E]">
            {owner?.subscriptionTier && (
              <div className="mb-4 border-b border-purple-100 pb-4">
                <p className="text-gray-500 mb-1">Current Plan</p>
                <p className="font-bold text-lg">{owner.subscriptionTier}</p>
                <p className="text-green-700 text-xs font-semibold uppercase mt-1">Active</p>
                <p className="text-gray-500 text-xs mt-1">Valid until {formatDate(owner.subscriptionValidUntil)}</p>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-purple-100">
              <span className="text-gray-600">Available Highlight Credits</span>
              <span className="font-bold">{owner?.highlightCredits || 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-purple-100">
              <span className="text-gray-600">Selected Property</span>
              <span className="font-bold text-right max-w-[200px] truncate">{property?.Title}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-purple-100">
              <span className="text-gray-600">Highlight Duration</span>
              <span className="font-bold">{selectedPlan?.name || `${selectedPlan?.durationDays} Days`}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-purple-100">
              <span className="text-gray-600">Credits Required</span>
              <span className="font-bold">{creditsRequired}</span>
            </div>
            <div className="flex justify-between py-2 pt-4">
              <span className="text-gray-600 font-semibold">Credits Remaining After</span>
              <span className="font-bold text-lg text-green-700">{(owner?.highlightCredits || 0) - creditsRequired}</span>
            </div>
          </div>

          {activationError && (
            <div className="mb-4 mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{activationError}</div>
          )}
          <button
            onClick={handleUseCredit}
            disabled={isActivating}
            className="flex w-full max-w-md mx-auto items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-4 text-base font-bold text-white hover:bg-purple-700 transition-all shadow disabled:opacity-60"
          >
            {isActivating ? <><Loader2 className="h-5 w-5 animate-spin" /> Activating...</> : `Use ${creditsRequired} Highlight Credit & Activate`}
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 rounded-2xl border border-purple-100 bg-purple-50 p-6 text-center">
            <h2 className="text-xl font-bold text-purple-800 mb-2">No Highlight Credits Available</h2>
            <p className="text-purple-700 mb-4">You need {creditsRequired} Highlight Credit{creditsRequired > 1 ? "s" : ""} to activate this promotion.</p>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <p className="text-xs text-purple-600 uppercase font-semibold">Your Credits</p>
                <p className="text-2xl font-bold text-purple-800">{owner?.highlightCredits || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-purple-600 uppercase font-semibold">Required</p>
                <p className="text-2xl font-bold text-purple-800">{creditsRequired}</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#103D2E] mb-6 text-center">Choose a Subscription Plan to get Highlight Credits</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subscriptionPlans.length === 0 && (
              <div className="col-span-full py-10 text-center text-gray-500">No subscription plans available.</div>
            )}
            {subscriptionPlans.map((sub) => (
              <div key={sub.id} className={`relative flex flex-col rounded-2xl border-2 bg-white p-6 transition-all hover:border-[#103D2E] ${sub.isPopular ? "border-[#103D2E] shadow-md" : "border-gray-100"}`}>
                {sub.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#103D2E] px-3 py-1 text-xs font-bold text-[#F3D59B]">Most Popular</div>
                )}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#103D2E]">{sub.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1"><span className="text-3xl font-bold text-[#103D2E]">₹{sub.price}</span><span className="text-sm text-gray-500">/{sub.interval}</span></div>
                </div>
                <ul className="mb-6 flex flex-col gap-2 flex-grow text-sm">
                  {sub.highlightCredits > 0 && (
                    <li className="flex items-center gap-2 font-semibold text-purple-700">
                      <Highlighter className="h-4 w-4 text-purple-500" /> {sub.highlightCredits} Highlight Credits
                    </li>
                  )}
                  {sub.boostCredits > 0 && (
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-[#4A7465]" /> {sub.boostCredits} Boost Credits
                    </li>
                  )}
                  {sub.advancedAnalytics && (
                    <li className="flex items-center gap-2 text-gray-700">
                      <TrendingUp className="h-4 w-4 text-[#4A7465]" /> Advanced Analytics
                    </li>
                  )}
                </ul>
                <a
                  href={`/owner/promotions/boost/payment-summary?propertyId=${propertyId}&planId=${planId}&promotionType=${promotionType}&subscriptionId=${sub.id}&flowType=SUBSCRIPTION`}
                  className={`mt-auto flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    sub.isPopular ? "bg-[#103D2E] text-[#F3D59B] hover:bg-[#1A5C47]" : "bg-[#F0F5F2] text-[#103D2E] hover:bg-[#E2EBE6]"
                  }`}
                >
                  Choose Plan
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function HighlightCreditsPage() {
  const [dashboard, setDashboard] = React.useState(null);

  React.useEffect(() => {
    getOwnerDashboard().then(d => setDashboard(d || null)).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FBF9] font-sans">
      <Header headerData={dashboard?.header || dashboard?.Header || null} />
      <main className="flex-1 pb-16 pt-8">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <Suspense fallback={
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-purple-600" />
            </div>
          }>
            <CreditsContent />
          </Suspense>
        </div>
      </main>
      <Footer data={dashboard?.Footer || dashboard?.footer || null} />
    </div>
  );
}
