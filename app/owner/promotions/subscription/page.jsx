"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Crown,
  Loader2,
  Zap,
  Star,
  Highlight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Receipt,
  ArrowUpRight,
  CreditCard,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "../../Footer";
import { getSubscriptionPlans } from "../services/promotionService";
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

function formatAmount(amount) {
  if (amount == null) return "N/A";
  return `₹${parseFloat(amount).toFixed(2)}`;
}

function getStatusBadge(status) {
  const map = {
    active: "bg-green-100 text-green-700",
    paid: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-600",
    expired: "bg-gray-100 text-gray-500",
  };
  return map[status?.toLowerCase()] || "bg-gray-100 text-gray-600";
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [owner, setOwner] = useState(null);
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // 1. Fetch owner profile
        const meRes = await fetch(`${STRAPI_URL}/users/me?populate=*`, {
          headers: getAuthHeaders(),
          cache: "no-store",
        });
        if (!meRes.ok) throw new Error("Authentication required. Please log in.");
        const ownerData = await meRes.json();
        setOwner(ownerData);

        // 2. Fetch subscription plans and dashboard
        const [planData, dashboardData] = await Promise.all([
          getSubscriptionPlans(),
          getOwnerDashboard()
        ]);
        setPlans(planData || []);
        setDashboard(dashboardData || null);

        // 3. Fetch payment history for this owner
        const payRes = await fetch(
          `${STRAPI_URL}/payments?filters[owner][id][$eq]=${ownerData.id}&sort=paymentDate:desc&populate=*`,
          { headers: getAuthHeaders(), cache: "no-store" }
        );
        if (payRes.ok) {
          const payResult = await payRes.json();
          setPayments(payResult?.data || []);
        }
      } catch (err) {
        setError(err.message || "Failed to load subscription details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FBF9] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#103D2E]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FBF9] flex items-center justify-center p-6">
        <div className="max-w-md text-center rounded-2xl border border-red-100 bg-red-50 p-8 text-red-600">
          <AlertCircle className="mx-auto mb-4 h-10 w-10" />
          <p className="font-semibold">{error}</p>
          <Link href="/owner/promotions" className="mt-4 inline-block text-sm underline font-bold">
            Back to Promotions
          </Link>
        </div>
      </div>
    );
  }

  const hasActiveSub = owner?.subscriptionTier && owner.subscriptionTier !== "free" && owner.subscriptionTier !== "Free";
  const boostCredits = owner?.boostCredits || 0;
  const featuredCredits = owner?.featuredCredits || 0;
  const highlightCredits = owner?.highlightCredits || 0;

  // Find current plan details
  const currentPlan = plans.find(
    (p) => p.name?.toLowerCase() === owner?.subscriptionTier?.toLowerCase()
  );
  const totalBoost = currentPlan?.boostCredits || boostCredits;
  const totalFeatured = currentPlan?.featuredCredits || featuredCredits;
  const totalHighlight = currentPlan?.highlightCredits || highlightCredits;

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
        <div className="mx-auto max-w-[1100px] px-4 md:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103D2E]">
              <Crown className="h-5 w-5 text-[#F3D59B]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#103D2E]">My Subscription</h1>
          </div>
          <p className="text-gray-600 mt-1">Manage your promotion subscription, credits and payment history.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT: Current Subscription Status */}
          <div className="lg:col-span-2 space-y-6">

            {/* Current Plan Card */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="bg-[#103D2E] px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#F3D59B] font-semibold uppercase tracking-widest mb-1">Current Plan</p>
                  <p className="text-2xl font-bold text-white">{owner?.subscriptionTier || "Free"}</p>
                </div>
                <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
                  hasActiveSub ? "bg-green-400/20 text-green-300" : "bg-white/10 text-white/70"
                }`}>
                  {hasActiveSub ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="p-6 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#F8FBF9] p-4">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Valid Until
                    </p>
                    <p className="font-bold text-[#103D2E]">{formatDate(owner?.subscriptionValidUntil)}</p>
                  </div>
                  <div className="rounded-xl bg-[#F8FBF9] p-4">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                      hasActiveSub ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {hasActiveSub ? "Active" : "No Active Subscription"}
                    </span>
                  </div>
                </div>

                {/* Credits */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Credits Available</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-gray-100 p-3 text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Zap className="h-4 w-4 text-[#103D2E]" />
                      </div>
                      <p className="text-2xl font-bold text-[#103D2E]">{boostCredits}</p>
                      <p className="text-xs text-gray-500">Boost</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-3 text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="h-4 w-4 text-amber-500" />
                      </div>
                      <p className="text-2xl font-bold text-[#103D2E]">{featuredCredits}</p>
                      <p className="text-xs text-gray-500">Featured</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-3 text-center">
                      <div className="flex items-center justify-center mb-1">
                        <ArrowUpRight className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-2xl font-bold text-[#103D2E]">{highlightCredits}</p>
                      <p className="text-xs text-gray-500">Highlight</p>
                    </div>
                  </div>
                </div>

                {/* Usage (only if we have plan data) */}
                {currentPlan && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Usage Overview</p>
                    <div className="space-y-3">
                      {[
                        { label: "Boost Credits", used: totalBoost - boostCredits, total: totalBoost, color: "bg-[#103D2E]" },
                        { label: "Featured Credits", used: totalFeatured - featuredCredits, total: totalFeatured, color: "bg-amber-400" },
                        { label: "Highlight Credits", used: totalHighlight - highlightCredits, total: totalHighlight, color: "bg-purple-400" },
                      ].map(({ label, used, total, color }) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{label}</span>
                            <span>{Math.max(0, used)} used / {total} total</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full ${color} transition-all`}
                              style={{ width: total > 0 ? `${Math.min(100, (Math.max(0, used) / total) * 100)}%` : "0%" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {hasActiveSub ? (
                    <>
                      <Link
                        href="/owner/promotions/boost"
                        className="flex items-center gap-2 rounded-xl bg-[#103D2E] px-5 py-2.5 text-sm font-bold text-[#F3D59B] hover:bg-[#1A5C47] transition-all"
                      >
                        <Zap className="h-4 w-4" /> Boost a Property
                      </Link>
                      <button
                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                        onClick={() => alert("Upgrade flow coming soon. Select a plan below.")}
                      >
                        <RefreshCw className="h-4 w-4" /> Upgrade Plan
                      </button>
                    </>
                  ) : (
                    <button
                      className="flex items-center gap-2 rounded-xl bg-[#103D2E] px-5 py-2.5 text-sm font-bold text-[#F3D59B] hover:bg-[#1A5C47] transition-all"
                      onClick={() => {
                        const plansSection = document.getElementById("plans-section");
                        plansSection?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <Crown className="h-4 w-4" /> Choose a Plan
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="bg-[#F0F5F2] px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[#103D2E]" />
                <h2 className="font-bold text-[#103D2E]">Payment History</h2>
              </div>

              {payments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <CreditCard className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                  <p className="text-sm">No payment records yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3 text-left">Date</th>
                        <th className="px-5 py-3 text-left">Type</th>
                        <th className="px-5 py-3 text-left">Amount</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-left">Razorpay ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {payments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                            {formatDate(pay.paymentDate)}
                          </td>
                          <td className="px-5 py-4 capitalize text-gray-700">
                            {pay.paymentType || "—"}
                          </td>
                          <td className="px-5 py-4 font-semibold text-[#103D2E]">
                            {formatAmount(pay.totalAmount)}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${getStatusBadge(pay.status)}`}>
                              {pay.status || "Unknown"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-500 font-mono text-xs truncate max-w-[140px]">
                            {pay.razorpayPaymentId || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Upgrade Plans */}
          <div id="plans-section" className="space-y-4">
            <h2 className="text-lg font-bold text-[#103D2E]">
              {hasActiveSub ? "Upgrade Plan" : "Choose a Plan"}
            </h2>
            <p className="text-sm text-gray-500">
              All plans are dynamic and priced by Strapi admin.
            </p>

            {plans.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                No plans available. Contact your admin.
              </div>
            )}

            {plans.map((plan) => {
              const isCurrent = plan.name?.toLowerCase() === owner?.subscriptionTier?.toLowerCase();
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border ${plan.isPopular ? "border-[#103D2E]" : "border-gray-100"} bg-white shadow-sm overflow-hidden transition-all hover:shadow-md`}
                >
                  {plan.isPopular && (
                    <div className="bg-[#103D2E] text-center py-1 text-xs font-bold text-[#F3D59B] uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-[#103D2E]">{plan.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{plan.interval}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#103D2E]">₹{plan.price}</p>
                        <p className="text-xs text-gray-400">+ GST</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#103D2E] shrink-0" />
                        {plan.boostCredits} Boost Credits
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#103D2E] shrink-0" />
                        {plan.featuredCredits} Featured Credits
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#103D2E] shrink-0" />
                        {plan.highlightCredits} Highlight Credits
                      </div>
                      {plan.maxActivePromotions > 0 && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#103D2E] shrink-0" />
                          Up to {plan.maxActivePromotions} Active Promotions
                        </div>
                      )}
                      {plan.advancedAnalytics && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#103D2E] shrink-0" />
                          Advanced Analytics
                        </div>
                      )}
                      {plan.priorityVisibility && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#103D2E] shrink-0" />
                          Priority Visibility
                        </div>
                      )}
                    </div>

                    {isCurrent ? (
                      <div className="w-full rounded-xl bg-green-50 border border-green-200 py-2.5 text-center text-xs font-bold text-green-700 flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Current Plan
                      </div>
                    ) : (
                      <Link
                        href={`/owner/promotions/boost/payment-summary?subscriptionId=${plan.id}&flowType=SUBSCRIPTION&planId=&propertyId=&promotionType=`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#103D2E] px-4 py-2.5 text-xs font-bold text-[#F3D59B] hover:bg-[#1A5C47] transition-all"
                      >
                        <Crown className="h-3.5 w-3.5" />
                        {hasActiveSub ? "Switch to This Plan" : "Get Started"}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

            <p className="text-xs text-gray-400 pt-2">
              Prices shown exclude GST. Final amount calculated at checkout from Strapi.
            </p>
          </div>
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
