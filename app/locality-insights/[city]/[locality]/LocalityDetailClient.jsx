"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Building2, MapPin, ChevronLeft, Filter, Tag } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { formatPrice } from "@/services/localityInsights";

export default function LocalityDetailClient({ overview, initialProperties }) {
  const [activeTab, setActiveTab] = useState("All");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredProperties = useMemo(() => {
    return initialProperties.filter((p) => {
      if (activeTab !== "All" && p.Purpose !== activeTab) return false;
      if (typeFilter && p.Property_Type !== typeFilter) return false;

      if (budgetFilter) {
        const price = Number(p.Price);
        if (price) {
          if (budgetFilter === "0-5000000" && price > 5000000) return false;
          if (budgetFilter === "5000000-15000000" && (price < 5000000 || price > 15000000)) return false;
          if (budgetFilter === "15000000+" && price < 15000000) return false;
        }
      }
      return true;
    });
  }, [initialProperties, activeTab, budgetFilter, typeFilter]);

  const hasFilters = activeTab !== "All" || typeFilter || budgetFilter;

  return (
    <div className="flex-1 pb-24">
      {/* ── LOCALITY HEADER ─────────────────────────────────────── */}
      <div
        style={{ background: "linear-gradient(135deg, #0D3326 0%, #1a5040 100%)" }}
        className="py-16 px-4 text-center relative overflow-hidden"
      >
        <div className="relative max-w-5xl mx-auto z-10 flex flex-col items-center">
          <Link
            href="/locality-insights"
            className="flex items-center text-[#D7AE62] mb-6 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Localities
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            {overview.locality}
          </h1>
          <div className="flex items-center gap-2 text-white/80 text-lg mb-4">
            <MapPin className="w-5 h-5 text-[#D7AE62]" />
            <span>{overview.city}</span>
          </div>
          <div className="bg-white/10 text-white text-sm font-semibold px-5 py-2 rounded-full">
            {overview.propertyCount}{" "}
            {overview.propertyCount === 1 ? "Property" : "Properties"} Available
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT COL: Overview & Price stats ─────────────────── */}
          <div className="lg:col-span-1 space-y-8">

            {/* Overview card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[rgba(13,51,38,0.06)]">
              <h2 className="text-2xl font-extrabold text-[#0D3326] mb-6">Overview</h2>
              <div className="space-y-5">
                <StatRow label="Total Listings" value={overview.propertyCount} />
                <StatRow label="For Sale" value={overview.totalSale} />
                <StatRow label="For Rent" value={overview.totalRent} />
              </div>

              {overview.propertyTypes.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                    Property Types
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {overview.propertyTypes.map((t) => (
                      <span
                        key={t}
                        className="bg-[#0D3326]/5 text-[#0D3326] text-xs font-bold px-3 py-1.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prices card */}
            <div className="bg-[#0D3326] rounded-3xl p-8 shadow-sm text-white">
              <h2 className="text-2xl font-extrabold mb-6">Average Prices</h2>
              <div className="space-y-6">
                <div>
                  <div className="text-white/60 text-sm font-medium mb-1">Average Sale Price</div>
                  <div className="text-3xl font-bold text-[#D7AE62]">
                    {overview.averageSalePrice ? formatPrice(overview.averageSalePrice) : "N/A"}
                  </div>
                  {overview.averageSalePrice && (
                    <div className="text-xs text-white/40 mt-1">
                      Based on {overview.totalSale} listing{overview.totalSale !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="text-white/60 text-sm font-medium mb-1">Average Rent</div>
                  <div className="text-3xl font-bold text-[#D7AE62]">
                    {overview.averageRent ? formatPrice(overview.averageRent) : "N/A"}
                  </div>
                  {overview.averageRent && (
                    <div className="text-xs text-white/40 mt-1">
                      Based on {overview.totalRent} listing{overview.totalRent !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COL: Properties ────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[rgba(13,51,38,0.06)] min-h-[600px]">

              {/* Header row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0D3326]">
                    Properties in {overview.locality}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredProperties.length} of {overview.propertyCount}{" "}
                    {overview.propertyCount === 1 ? "property" : "properties"}
                    {hasFilters ? " (filtered)" : ""}
                  </p>
                </div>

                {/* Buy / Rent tabs */}
                <div className="flex items-center gap-2">
                  {["All", "Sale", "Rent"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                        activeTab === tab
                          ? "bg-[#0D3326] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              {overview.propertyTypes.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <div className="relative flex-1">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none"
                    >
                      <option value="">All Property Types</option>
                      {overview.propertyTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={budgetFilter}
                      onChange={(e) => setBudgetFilter(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none"
                    >
                      <option value="">Any Budget</option>
                      <option value="0-5000000">Under ₹50 Lacs</option>
                      <option value="5000000-15000000">₹50 Lacs – ₹1.5 Cr</option>
                      <option value="15000000+">Above ₹1.5 Cr</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ── No properties in this locality at all ─── */}
              {initialProperties.length === 0 ? (
                <EmptyState
                  icon={<Building2 className="w-10 h-10" />}
                  title="No Properties Available"
                  description={`There are currently no properties listed in ${overview.locality}.`}
                  action={
                    <Link
                      href="/locality-insights"
                      className="px-6 py-2.5 bg-[#0D3326] text-white rounded-full text-sm font-bold hover:bg-[#1a5040] transition-colors"
                    >
                      Back to Localities
                    </Link>
                  }
                />
              ) : filteredProperties.length === 0 ? (
                /* ── Filters removed all results ─── */
                <EmptyState
                  icon={<Filter className="w-10 h-10" />}
                  title="No Results for Selected Filters"
                  description="Adjust or clear your filters to see properties."
                  action={
                    <button
                      onClick={() => {
                        setActiveTab("All");
                        setTypeFilter("");
                        setBudgetFilter("");
                      }}
                      className="px-6 py-2.5 bg-[#D7AE62] text-[#0D3326] rounded-full text-sm font-bold hover:bg-[#c49a51] transition-colors"
                    >
                      Clear Filters
                    </button>
                  }
                />
              ) : (
                /* ── Property grid ─── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>

            {/* Price trends placeholder */}
            <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-[rgba(13,51,38,0.06)] text-center">
              <h3 className="text-xl font-extrabold text-[#0D3326] mb-2">
                Price Trends &amp; Connectivity
              </h3>
              <p className="text-gray-500 text-sm">
                Historical price trends and detailed nearby facility data are not yet
                available for this locality.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Small helpers ────────────────────────────────────────────────────────── */

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-xl font-bold text-[#0D3326]">{value}</span>
    </div>
  );
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-100 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  );
}
