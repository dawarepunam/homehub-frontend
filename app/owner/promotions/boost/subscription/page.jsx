"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Loader2, CheckCircle2, Rocket, Star, TrendingUp } from "lucide-react";
import { getOwnerDetails, getPricingConfig, getPropertyById, getSubscriptionPlans } from "../../services/promotionService";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import { getOwnerDashboard } from "@/services/ownerDashboard";

function SubscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const planId = searchParams.get("planId");
  const promotionType = searchParams.get("promotionType") || "boost";
  
  const [owner, setOwner] = useState(null);
  const [property, setProperty] = useState(null);
  const [selectedPromotionPlan, setSelectedPromotionPlan] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        if (!propertyId || !planId) {
          throw new Error("Missing property or plan information.");
        }

        // 1. Verify property ownership
        const prop = await getPropertyById(propertyId);
        if (!prop) {
          throw new Error("Property not found or access denied.");
        }
        setProperty(prop);

        // 2. Fetch owner & pricing config & subscriptions concurrently
        const [ownerData, configData, subPlans] = await Promise.all([
          getOwnerDetails(),
          getPricingConfig(),
          getSubscriptionPlans()
        ]);
        
        setOwner(ownerData);
        setSubscriptionPlans(subPlans);

        // 3. Find the selected promotion plan
        const promoPlans = configData?.promotionPlans || [];
        const selected = promoPlans.find(p => p.id == planId);
        if (!selected) {
          throw new Error("Selected promotion plan is invalid or no longer available.");
        }
        setSelectedPromotionPlan(selected);

      } catch (err) {
        setError(err.message || "Unable to load details.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [propertyId, planId]);

  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState(null);

  const handleUseCredit = async () => {
    if (isActivating) return; // prevent double-click
    setIsActivating(true);
    setActivationError(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) throw new Error("You are not logged in. Please log in and try again.");

      const response = await fetch("/api/owner/promotions/boost/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId, planId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Activation failed. Please try again.");
      }

      // Navigate to activated page with the returned promotion ID
      router.push(`/owner/promotions/boost/activated?promotionId=${result.promotionId}`);
    } catch (err) {
      setActivationError(err.message || "An error occurred during activation.");
      setIsActivating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
        <p>Checking your credits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600 mt-8">
        {error}
        <button onClick={() => router.push("/owner/promotions/boost")} className="mt-4 block text-sm font-semibold underline mx-auto">
          Go Back
        </button>
      </div>
    );
  }

  // Fallback defaults in case creditsRequired is missing in strapi
  const creditsRequired = selectedPromotionPlan?.creditsRequired || 1;
  const hasCredits = owner?.boostCredits >= creditsRequired;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <>
      <div className="mb-8">
        <button
          onClick={() => router.push("/owner/promotions/boost")}
          className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#103D2E] hover:underline"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-[#103D2E]">
          Check Credits
        </h1>
      </div>

      {hasCredits ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F5F2]">
            <Rocket className="h-8 w-8 text-[#103D2E]" />
          </div>
          
          <h2 className="text-xl text-gray-800 mb-2 font-bold">You can use your available Boost Credit to activate this promotion.</h2>
          
          <div className="mx-auto mb-8 mt-6 max-w-md rounded-xl border border-[#4A7465]/20 bg-[#F8FBF9] p-5 text-left text-sm text-[#103D2E]">
            {owner.subscriptionTier && (
              <div className="mb-4 border-b border-gray-200 pb-4">
                <p className="text-gray-500 mb-1">Current Plan</p>
                <p className="font-bold text-lg">{owner.subscriptionTier}</p>
                <p className="text-green-700 text-xs font-semibold uppercase mt-1">Active</p>
                <p className="text-gray-500 text-xs mt-1">
                  Valid until {formatDate(owner.subscriptionValidUntil)}
                </p>
              </div>
            )}
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Available Boost Credits</span>
              <span className="font-bold">{owner.boostCredits || 0}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Selected Property</span>
              <span className="font-bold text-right max-w-[200px] truncate" title={property?.Title}>
                {property?.Title || "Property"}
              </span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Boost Duration</span>
              <span className="font-bold">{selectedPromotionPlan.name || `${selectedPromotionPlan.durationDays} Days`}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Credits Required</span>
              <span className="font-bold">{creditsRequired}</span>
            </div>

            <div className="flex justify-between py-2 pt-4">
              <span className="text-gray-600 font-semibold">Credits Remaining After Activation</span>
              <span className="font-bold text-lg text-green-700">
                {(owner.boostCredits || 0) - creditsRequired}
              </span>
            </div>
          </div>

          {activationError && (
            <div className="mb-4 mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 text-center">
              {activationError}
            </div>
          )}

          <button
            onClick={handleUseCredit}
            disabled={isActivating}
            className="flex w-full max-w-md mx-auto items-center justify-center gap-2 rounded-xl bg-[#103D2E] px-4 py-4 text-base font-bold text-[#F3D59B] transition-all hover:bg-[#1A5C47] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isActivating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Activating...
              </>
            ) : (
              `Use ${creditsRequired} Credit & Boost`
            )}
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">No Boost Credits Available</h2>
            <p className="text-red-700 mb-4">
              You need {creditsRequired} Boost Credit{creditsRequired > 1 ? 's' : ''} to activate this promotion.
            </p>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <p className="text-xs text-red-600 uppercase font-semibold">Your Available Credits</p>
                <p className="text-2xl font-bold text-red-800">{owner.boostCredits || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-red-600 uppercase font-semibold">Required Credits</p>
                <p className="text-2xl font-bold text-red-800">{creditsRequired}</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-[#103D2E] mb-6 text-center">
            Choose a Subscription Plan
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subscriptionPlans.length === 0 && (
              <div className="col-span-full py-10 text-center text-gray-500">
                No subscription plans currently available. Please check back later.
              </div>
            )}
            
            {subscriptionPlans.map((sub) => (
              <div key={sub.id} className={`relative flex flex-col rounded-2xl border-2 bg-white p-6 transition-all hover:border-[#103D2E] ${sub.isPopular ? 'border-[#103D2E] shadow-md' : 'border-gray-100'}`}>
                {sub.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#103D2E] px-3 py-1 text-xs font-bold text-[#F3D59B]">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#103D2E]">{sub.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1 text-[#103D2E]">
                    <span className="text-3xl font-bold">₹{sub.price}</span>
                    <span className="text-sm text-gray-500">/{sub.interval}</span>
                  </div>
                </div>
                
                <ul className="mb-8 flex flex-col gap-3 flex-grow">
                  {sub.boostCredits > 0 && (
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <Rocket className="h-4 w-4 text-[#4A7465]" />
                      <span className="font-semibold">{sub.boostCredits}</span> Boost Credits
                    </li>
                  )}
                  {sub.featuredCredits > 0 && (
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <Star className="h-4 w-4 text-[#D7AE62]" />
                      <span className="font-semibold">{sub.featuredCredits}</span> Featured Credits
                    </li>
                  )}
                  {sub.highlightCredits > 0 && (
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <Star className="h-4 w-4 text-[#D7AE62]" />
                      <span className="font-semibold">{sub.highlightCredits}</span> Highlight Credits
                    </li>
                  )}
                  {sub.advancedAnalytics && (
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <TrendingUp className="h-4 w-4 text-[#4A7465]" />
                      Advanced Analytics
                    </li>
                  )}
                  {sub.priorityVisibility && (
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#4A7465]" />
                      Priority Visibility
                    </li>
                  )}
                  {sub.smartRecommendations && (
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#4A7465]" />
                      Smart Recommendations
                    </li>
                  )}
                  {sub.benefits && sub.benefits.split('\n').map((benefit, i) => {
                    if (!benefit.trim()) return null;
                    return (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
                        {benefit}
                      </li>
                    );
                  })}
                </ul>
                
                <Link
                  href={`/owner/promotions/boost/payment-summary?propertyId=${propertyId}&planId=${planId}&promotionType=${promotionType}&subscriptionId=${sub.id}&flowType=SUBSCRIPTION`}
                  className={`mt-auto flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    sub.isPopular 
                      ? "bg-[#103D2E] text-[#F3D59B] hover:bg-[#1A5C47]" 
                      : "bg-[#F0F5F2] text-[#103D2E] hover:bg-[#E2EBE6]"
                  }`}
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function SubscriptionSelectionPage() {
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
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
            </div>
          }>
            <SubscriptionContent />
          </Suspense>
        </div>
      </main>
      <Footer data={dashboard?.Footer || dashboard?.footer || null} />
    </div>
  );
}
