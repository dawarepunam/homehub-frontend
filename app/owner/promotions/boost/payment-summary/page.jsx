"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Loader2, CheckCircle2, Building, Receipt, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import { getPropertyById, getPricingConfig, getSubscriptionPlans } from "../../services/promotionService";
import { getOwnerDashboard } from "@/services/ownerDashboard";

function PaymentSummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const planId = searchParams.get("planId");
  const subscriptionId = searchParams.get("subscriptionId");
  const flowType = searchParams.get("flowType"); // "CREDIT" or "SUBSCRIPTION"
  const promotionType = searchParams.get("promotionType") || "boost";
  
  const [property, setProperty] = useState(null);
  const [promotionPlan, setPromotionPlan] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [gstPercentage, setGstPercentage] = useState(18);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        if (!flowType) {
          throw new Error("Missing flowType for payment summary.");
        }

        // Fetch pricing config globally
        const configData = await getPricingConfig();
        setGstPercentage(configData?.gstPercentage || 18);

        // 1. Fetch Subscription details if applicable
        if (subscriptionId) {
          const subPlans = await getSubscriptionPlans();
          const selectedSub = subPlans.find((p) => p.id == subscriptionId);
          if (!selectedSub) throw new Error("Selected subscription plan is invalid.");
          setSubscriptionPlan(selectedSub);
        }

        // 2. Verify property and promotion plan ONLY if propertyId is provided (Boost flow)
        if (propertyId) {
          if (!planId) throw new Error("Missing promotion plan ID for the property.");
          const prop = await getPropertyById(propertyId);
          if (!prop) {
            throw new Error("Property not found or access denied.");
          }
          setProperty(prop);

          const promoPlans = configData?.promotionPlans || [];
          const selectedPromo = promoPlans.find((p) => p.id == planId);
          if (!selectedPromo) throw new Error("Selected promotion plan is invalid.");
          setPromotionPlan(selectedPromo);
        }

        if (!propertyId && !subscriptionId) {
           throw new Error("Missing required information for payment summary.");
        }
      } catch (err) {
        setError(err.message || "Unable to load summary details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [propertyId, planId, subscriptionId, flowType]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleContinue = async () => {
    if (flowType === "CREDIT") {
      if (isProcessing) return;
      setIsProcessing(true);
      setPaymentError(null);
      
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) throw new Error("Please log in to continue.");

        const activateRes = await fetch("/api/owner/promotions/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            propertyId,
            planId,
            promotionType
          }),
        });

        const activateData = await activateRes.json();
        
        if (!activateRes.ok) {
          throw new Error(activateData.error || "Failed to activate promotion using credits.");
        }

        const queryParams = new URLSearchParams({
          paymentId: "CREDIT",
          promotionId: activateData.promotionId || "",
        });
        router.push(`/owner/promotions/boost/success?${queryParams.toString()}`);
      } catch (err) {
        setPaymentError(err.message || "An error occurred during activation.");
        setIsProcessing(false);
      }
    } else {
      if (isProcessing) return;
      setIsProcessing(true);
      setPaymentError(null);

      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) throw new Error("Please log in to continue.");

        // 1. Create Order
        const orderRes = await fetch("/api/owner/promotions/payment/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subscriptionPlanId: subscriptionId,
            propertyId,
            planId,
            promotionType
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.error || "Failed to create payment order");

        // 2. Open Razorpay Checkout
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "HomeHub",
          description: `Subscription: ${orderData.subscriptionPlanName}`,
          image: "https://res.cloudinary.com/dsssespbm/image/upload/f_auto,q_auto/burger1_g6tdrdhe",
          order_id: orderData.orderId,
          handler: async function (response) {
            try {
              // 3. Verify Payment on server side
              const verifyRes = await fetch("/api/owner/promotions/payment/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  subscriptionPlanId: subscriptionId,
                  propertyId,
                  planId,
                  promotionType
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");

              // 4. Redirect to Success page with verified data
              const queryParams = new URLSearchParams({
                paymentId: verifyData.paymentId || "",
                promotionId: verifyData.promotionId || "",
              });
              router.push(`/owner/promotions/boost/success?${queryParams.toString()}`);

            } catch (err) {
              setPaymentError(err.message || "Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          },
          prefill: {
            name: property?.Title ? `Owner of ${property.Title}` : "HomeHub Owner",
          },
          notes: {
            propertyId: propertyId || "",
            subscriptionPlan: subscriptionId || "",
          },
          theme: {
            color: "#103D2E",
          },
          modal: {
            ondismiss: function() {
              setPaymentError("Payment cancelled. Your subscription has not been activated.");
              setIsProcessing(false);
            },
            escape: true,
            animation: true,
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
           setPaymentError(`Payment Failed: ${response.error.description}`);
           setIsProcessing(false);
        });
        rzp.open();

      } catch (error) {
        setPaymentError(error.message || "An error occurred during payment processing.");
        setIsProcessing(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
        <p>Loading payment summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600 mt-8">
        {error}
        <button onClick={() => router.back()} className="mt-4 block text-sm font-semibold underline mx-auto">
          Go Back
        </button>
      </div>
    );
  }

  const renderCreditSummary = () => {
    const creditsRequired = promotionPlan.creditsRequired || 1;
    
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="bg-[#F0F5F2] px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#103D2E] flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment Summary
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start pb-4 border-b border-gray-50">
              <span className="text-gray-500">Property</span>
              <div className="text-right flex items-center justify-end gap-2 text-[#103D2E] font-medium max-w-[60%]">
                <Building className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="truncate" title={property.Title}>{property.Title}</span>
              </div>
            </div>
            
            <div className="flex justify-between pb-4 border-b border-gray-50">
              <span className="text-gray-500">Promotion</span>
              <span className="font-medium text-[#103D2E] capitalize">{promotionType} Listing</span>
            </div>
            
            <div className="flex justify-between pb-4 border-b border-gray-50">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium text-[#103D2E]">{promotionPlan.name || `${promotionPlan.durationDays} Days`}</span>
            </div>
            
            <div className="flex justify-between pb-4 border-b border-gray-50">
              <span className="text-gray-500">Promotion Cost</span>
              <span className="font-medium text-[#103D2E]">₹{promotionPlan.price}</span>
            </div>
            
            <div className="flex justify-between pb-4 border-b border-gray-50">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-semibold text-[#103D2E] flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-[#4A7465]" />
                Boost Credit
              </span>
            </div>
            
            <div className="flex justify-between pb-4 border-b border-gray-50">
              <span className="text-gray-500">Credit Required</span>
              <span className="font-bold text-[#103D2E]">{creditsRequired}</span>
            </div>
          </div>
          
          <div className="mt-6 rounded-xl bg-[#F8FBF9] p-4 flex justify-between items-center border border-[#103D2E]/10">
            <span className="font-bold text-gray-700">Amount Payable</span>
            <span className="text-2xl font-bold text-green-700">₹0</span>
          </div>
          
          {paymentError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 text-center font-medium">
              {paymentError}
            </div>
          )}
          
          <button
            onClick={handleContinue}
            disabled={isProcessing}
            className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#103D2E] px-4 py-4 text-base font-bold text-[#F3D59B] transition-all hover:bg-[#1A5C47] shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderSubscriptionSummary = () => {
    const subPrice = parseFloat(subscriptionPlan.price || 0);
    const gstAmount = (subPrice * gstPercentage) / 100;
    const totalAmount = subPrice + gstAmount;

    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="bg-[#F0F5F2] px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#103D2E] flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment Summary
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between pb-4 border-b border-gray-50">
              <span className="text-gray-500">Selected Subscription</span>
              <span className="font-bold text-[#103D2E]">{subscriptionPlan.name}</span>
            </div>
            
            <div className="flex justify-between pb-4 border-b border-gray-50">
              <span className="text-gray-500">Billing Cycle</span>
              <span className="font-medium text-[#103D2E] capitalize">{subscriptionPlan.interval}</span>
            </div>
            
            <div className="flex justify-between pb-4 border-b border-gray-50">
              <span className="text-gray-500">Subscription Price</span>
              <span className="font-medium text-[#103D2E]">₹{subPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between pb-4 border-b border-gray-50">
              <span className="text-gray-500">GST ({gstPercentage}%)</span>
              <span className="font-medium text-gray-600">₹{gstAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-6 rounded-xl bg-[#F8FBF9] p-4 flex justify-between items-center border border-[#103D2E]/10">
            <span className="font-bold text-gray-700">Total Amount</span>
            <span className="text-3xl font-bold text-[#103D2E]">₹{totalAmount.toFixed(2)}</span>
          </div>
          
          <p className="mt-4 text-center text-xs text-gray-500">
            You will be redirected to our secure payment partner.
          </p>

          {paymentError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 text-center font-medium">
              {paymentError}
            </div>
          )}
          
          <button
            onClick={handleContinue}
            disabled={isProcessing}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#103D2E] px-4 py-4 text-base font-bold text-[#F3D59B] transition-all hover:bg-[#1A5C47] shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Proceed to Payment
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#103D2E] hover:underline"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-[#103D2E]">
          Review & Pay
        </h1>
        <p className="mt-2 text-gray-600">
          Please review your promotion details before continuing.
        </p>
      </div>

      {flowType === "CREDIT" ? renderCreditSummary() : renderSubscriptionSummary()}
    </>
  );
}

export default function PaymentSummaryPage() {
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
            <PaymentSummaryContent />
          </Suspense>
        </div>
      </main>
      <Footer data={dashboard?.Footer || dashboard?.footer || null} />
    </div>
  );
}
