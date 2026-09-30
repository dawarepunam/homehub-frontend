"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Rocket,
  Star,
  Sparkles,
  BarChart3,
  CreditCard,
  ChevronRight,
  Lightbulb,
  Loader2,
  Crown,
  AlertCircle
} from "lucide-react";
import { getOwnerDetails, getSubscriptionPlans, getActivePromotionsCount } from "./services/promotionService";
import Header from "@/components/Header";
import Footer from "../Footer";
import { getOwnerDashboard } from "@/services/ownerDashboard";

export default function PromotionsLandingPage() {
  const [owner, setOwner] = useState(null);
  const [plans, setPlans] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ownerData, plansData, countData, dashboardData] = await Promise.all([
          getOwnerDetails(),
          getSubscriptionPlans(),
          getActivePromotionsCount(),
          getOwnerDashboard()
        ]);
        setOwner(ownerData);
        setPlans(plansData);
        setActiveCount(countData);
        setDashboard(dashboardData || null);
      } catch (err) {
        console.error("Failed to load promotions hub data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const promotionOptions = [
    {
      title: "Boost Listing",
      description: "Increase visibility in search results and get more views.",
      icon: <Rocket className="h-6 w-6 text-[#103D2E]" />,
      buttonText: "Boost Listing",
      href: "/owner/promotions/boost",
    },
    {
      title: "Featured Listing",
      description: "Get premium visibility across high-traffic sections.",
      icon: <Star className="h-6 w-6 text-[#D7AE62]" />,
      buttonText: "Explore",
      href: "/owner/promotions/featured",
    },
    {
      title: "Highlight Listing",
      description: "Make your property stand out with a special highlight.",
      icon: <Sparkles className="h-6 w-6 text-[#103D2E]" />,
      buttonText: "Explore",
      href: "/owner/promotions/highlight",
    },
    {
      title: "Promotion Analytics",
      description: "Track views, enquiries, saves, calls and promotion performance.",
      icon: <BarChart3 className="h-6 w-6 text-[#103D2E]" />,
      buttonText: "View Analytics",
      href: "/owner/promotions/analytics",
    },
    {
      title: "Subscription",
      description: "Manage plans, credits, billing and payments.",
      icon: <CreditCard className="h-6 w-6 text-[#103D2E]" />,
      buttonText: "Manage Subscription",
      href: "/owner/promotions/subscription",
    },
    {
      title: "Smart Recommendations",
      description: "Get data-driven AI insights on which property to promote and why.",
      icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
      buttonText: "View Recommendations",
      href: "/owner/promotions/recommendations",
    },
  ];

  const currentPlanName = owner?.subscriptionTier;
  const currentPlan = plans.find((p) => p.name === currentPlanName);
  
  const isExpired = owner?.subscriptionValidUntil 
    ? new Date(owner.subscriptionValidUntil) < new Date()
    : true;

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
          

        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-[#103D2E] md:text-4xl">
            Grow Your Property Visibility
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Promote your properties, reach more buyers and tenants, and get more enquiries.
          </p>
        </div>

        {/* Subscription Status Card */}
        <div className="mb-10">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-gray-100 bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-[#103D2E]" />
            </div>
          ) : owner ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <Crown className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#103D2E]">
                      {currentPlanName || "Free Plan"}
                    </h2>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      {isExpired ? (
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <AlertCircle size={14} /> Expired
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                      {owner.subscriptionValidUntil && (
                        <span className="text-gray-500">
                          Valid until: {new Date(owner.subscriptionValidUntil).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 md:gap-8 w-full md:w-auto">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Boost Credits</span>
                  <span className="text-2xl font-bold text-[#103D2E]">
                    {owner.boostCredits || 0}
                    <span className="text-sm text-gray-400 font-normal ml-1">/ {currentPlan?.boostCredits || 0}</span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Featured Credits</span>
                  <span className="text-2xl font-bold text-[#D7AE62]">
                    {owner.featuredCredits || 0}
                    <span className="text-sm text-gray-400 font-normal ml-1">/ {currentPlan?.featuredCredits || 0}</span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Highlight Credits</span>
                  <span className="text-2xl font-bold text-[#103D2E]">
                    {owner.highlightCredits || 0}
                    <span className="text-sm text-gray-400 font-normal ml-1">/ {currentPlan?.highlightCredits || 0}</span>
                  </span>
                </div>
                <div className="flex flex-col border-l border-gray-100 pl-4 md:pl-8">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Active Limit</span>
                  <span className="text-2xl font-bold text-[#103D2E]">
                    {activeCount}
                    <span className="text-sm text-gray-400 font-normal ml-1">/ {currentPlan?.maxActivePromotions || 0}</span>
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                <Link
                  href="/owner/promotions/subscription"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-[#F3D59B] px-5 py-2.5 text-sm font-bold text-[#103D2E] transition-all hover:bg-[#E5C384]"
                >
                  {isExpired || !currentPlanName ? "Upgrade Plan" : "Renew Plan"}
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {promotionOptions.map((option, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#4A7465]"
            >
              <div className="p-6 flex-grow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F5F2]">
                  {option.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#103D2E]">
                  {option.title}
                </h3>
                <p className="text-[15px] text-gray-600 leading-relaxed">
                  {option.description}
                </p>
              </div>
              <div className="border-t border-gray-50 bg-gray-50/50 p-4">
                <Link
                  href={option.href}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#103D2E] px-4 py-3 text-sm font-semibold text-[#F3D59B] transition-all hover:bg-[#1A5C47]"
                >
                  {option.buttonText}
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

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
