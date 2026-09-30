"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Sparkles, TrendingUp, Eye, Bookmark, MessageSquare, ArrowRight, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "../../Footer";
import { getSmartRecommendations } from "../services/recommendationService";
import { getOwnerDashboard } from "@/services/ownerDashboard";

function RecommendationCard({ recommendation, type = "best" }) {
  const router = useRouter();
  
  if (!recommendation) return null;

  const isBest = type === "best";
  const badgeColor = isBest ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800";
  const badgeText = isBest ? "Top Pick" : "Performance Opportunity";
  const Icon = isBest ? Sparkles : Lightbulb;
  const iconColor = isBest ? "text-amber-500" : "text-purple-500";

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-[#103D2E] relative">
      {/* Decorative top border */}
      <div className={`h-1.5 w-full ${isBest ? "bg-gradient-to-r from-amber-400 to-amber-600" : "bg-gradient-to-r from-purple-400 to-purple-600"}`} />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeColor}`}>
            <Icon size={14} className={iconColor} /> {badgeText}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Score</span>
            <span className={`text-2xl font-black ${isBest ? "text-amber-600" : "text-purple-600"}`}>{recommendation.score}<span className="text-sm text-gray-400 font-semibold">/100</span></span>
          </div>
        </div>

        <div className="flex gap-4 mb-5 border-b border-gray-100 pb-5">
          <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 relative">
            {recommendation.image ? (
              <img src={recommendation.image} alt={recommendation.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 text-xs">No Image</div>
            )}
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <h3 className="truncate text-lg font-bold text-[#103D2E]">{recommendation.title}</h3>
            <p className="truncate text-sm text-gray-500">{recommendation.location}</p>
            <p className="mt-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{recommendation.propertyType}</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#F8FBF9] p-3 text-center">
            <Eye className="mb-1 h-5 w-5 text-[#4A7465]" />
            <span className="text-lg font-bold text-[#103D2E]">{recommendation.views}</span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase">Views</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#F8FBF9] p-3 text-center">
            <MessageSquare className="mb-1 h-5 w-5 text-[#4A7465]" />
            <span className="text-lg font-bold text-[#103D2E]">{recommendation.enquiries}</span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase">Enquiries</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#F8FBF9] p-3 text-center">
            <Bookmark className="mb-1 h-5 w-5 text-[#4A7465]" />
            <span className="text-lg font-bold text-[#103D2E]">{recommendation.saves}</span>
            <span className="text-[10px] font-semibold text-gray-500 uppercase">Saves</span>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-gray-50 p-4 border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed"><span className="font-semibold text-gray-900">Insight:</span> {recommendation.reason}</p>
        </div>

        <button 
          onClick={() => router.push(`/owner/promotions/boost/duration?propertyId=${recommendation.id}`)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white transition-all shadow-sm ${
            isBest ? "bg-[#103D2E] hover:bg-[#1A5C47]" : "bg-[#103D2E] hover:bg-[#1A5C47]"
          }`}
        >
          <TrendingUp className="h-4 w-4" /> {recommendation.suggestedAction} <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

function RecommendationsContent() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setIsLoading(true);
        const result = await getSmartRecommendations();
        setData(result);
      } catch (err) {
        setError(err.message || "Unable to load your recommendations.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
        <p className="font-semibold">Analyzing property performance...</p>
        <p className="text-sm text-gray-400 mt-2">Calculating smart recommendations</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600 shadow-sm">
        <p className="font-bold text-lg mb-2">{error}</p>
        <p className="text-sm text-red-500 mb-6">There was a problem communicating with the server.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 shadow"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data?.properties || data.properties.length === 0) {
    return (
      <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
            <Lightbulb className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mb-3 text-2xl font-bold text-[#103D2E]">No properties available</h2>
        <p className="mb-8 text-gray-500">Add a property to receive smart promotion recommendations based on actual performance data.</p>
        <button 
          onClick={() => router.push("/post-property")} 
          className="inline-flex rounded-xl bg-[#103D2E] px-8 py-3.5 text-sm font-bold text-[#F3D59B] transition-all hover:bg-[#1A5C47] shadow"
        >
          Add Property
        </button>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="mb-10">
        <button 
          onClick={() => router.push("/owner/promotions")} 
          className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-[#103D2E] hover:underline"
        >
          <ChevronLeft size={16} /> Back to Promotions
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <Sparkles className="h-5 w-5 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#103D2E] md:text-4xl">Smart Recommendations</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl">
          Data-driven insights to help you promote the right property at the right time based on actual views, enquiries, and saves.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 mb-12">
        {data.bestProperty && (
          <div>
            <h2 className="text-xl font-bold text-[#103D2E] mb-4">Best Property to Promote</h2>
            <RecommendationCard recommendation={data.bestProperty} type="best" />
          </div>
        )}
        
        {data.performanceOpportunity && (
          <div>
            <h2 className="text-xl font-bold text-[#103D2E] mb-4">Performance Opportunity</h2>
            <RecommendationCard recommendation={data.performanceOpportunity} type="opportunity" />
          </div>
        )}
      </div>

      {data.recommendations.length > 1 && (
        <div>
          <h2 className="text-2xl font-bold text-[#103D2E] mb-6">All Property Recommendations</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.recommendations.map((rec) => (
              <div key={rec.id} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="h-32 w-full overflow-hidden bg-gray-100">
                  {rec.image ? (
                    <img src={rec.image} alt={rec.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="truncate pr-3 text-base font-bold text-[#103D2E]">{rec.title}</h3>
                    <div className="flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 shrink-0">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      <span className="text-xs font-bold text-gray-700">{rec.score}</span>
                    </div>
                  </div>
                  <p className="truncate text-xs text-gray-500 mb-4">{rec.location}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center"><p className="text-sm font-bold text-[#103D2E]">{rec.views}</p><p className="text-[9px] uppercase font-semibold text-gray-400">Views</p></div>
                    <div className="text-center border-l border-r border-gray-100"><p className="text-sm font-bold text-[#103D2E]">{rec.enquiries}</p><p className="text-[9px] uppercase font-semibold text-gray-400">Enquiries</p></div>
                    <div className="text-center"><p className="text-sm font-bold text-[#103D2E]">{rec.saves}</p><p className="text-[9px] uppercase font-semibold text-gray-400">Saves</p></div>
                  </div>
                  
                  <div className="mb-5 mt-auto rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-600 line-clamp-3">{rec.reason}</p>
                  </div>

                  <button 
                    onClick={() => router.push(`/owner/promotions/boost/duration?propertyId=${rec.id}`)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F0F5F2] px-4 py-2.5 text-sm font-bold text-[#103D2E] transition-all hover:bg-[#E2EBE6]"
                  >
                    Boost Property
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SmartRecommendationsPage() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOwnerDashboard();
        setDashboard(data || null);
      } catch (err) {}
    }
    load();
  }, []);

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
        <Suspense fallback={
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
          </div>
        }>
          <RecommendationsContent />
        </Suspense>
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
