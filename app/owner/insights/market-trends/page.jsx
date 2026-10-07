"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "../../Footer";
import {
  getMarketTrendsOwner,
  getOwnerPropertiesForMarket,
  getMarketTrends,
  getAvailableFilters,
} from "@/services/marketTrends";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import {
  TrendingUp, TrendingDown, RefreshCw, ChevronDown, 
  MapPin, Home, Info, ArrowRight, Building, Search
} from "lucide-react";

// =====================================================
// CONSTANTS
// =====================================================
const PERIOD_OPTIONS = [
  { label: "3 Months", value: "ThreeMonths" },
  { label: "6 Months", value: "SixMonths" },
  { label: "1 Year", value: "OneYear" },
];

const CATEGORY_OPTIONS = [
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Plot", value: "Plot" },
];

const PURPOSE_OPTIONS = [
  { label: "Sale", value: "Sale" },
  { label: "Rent", value: "Rent" },
];

function formatNum(n) {
  if (!n && n !== 0) return "0";
  return Number(n).toLocaleString("en-IN");
}

function formatPrice(price) {
  if (!price) return "N/A";
  const num = Number(price);
  return `₹${num.toLocaleString("en-IN")}`;
}

// =====================================================
// SKELETON
// =====================================================
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-pulse">
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
      <div className="h-8 bg-gray-100 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-100 rounded w-1/3"></div>
    </div>
  );
}

// =====================================================
// KPI CARD
// =====================================================
function KpiCard({ title, value, growth, subtitle, type = "number", onClick }) {
  const isPos = growth >= 0;
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-[#064d3b] transition text-left w-full group cursor-pointer`}
    >
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">{title}</p>
      
      <div className="flex items-end justify-between">
        <p className={`text-2xl font-extrabold ${type === "string" ? "text-[#064d3b]" : "text-gray-900"}`}>
          {value}
        </p>
        
        {growth != null && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${isPos ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPos ? "+" : ""}{growth}%
          </div>
        )}
      </div>

      {subtitle && <p className="text-[10px] text-gray-400 mt-2">{subtitle}</p>}
    </button>
  );
}

// =====================================================
// MAIN PAGE
// =====================================================
export default function MarketTrendsPage() {
  const router = useRouter();

  // Filter State
  const [filters, setFilters] = useState({
    city: "",
    locality: "",
    category: "Residential",
    purpose: "Sale",
    period: "SixMonths",
  });
  
  // Available filter options from API
  const [availableCities, setAvailableCities] = useState([]);
  const [availableLocalities, setAvailableLocalities] = useState([]);

  // Data State
  const [marketData, setMarketData] = useState([]);
  const [ownerProperties, setOwnerProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load Filter Options & Owner Data on mount
  useEffect(() => {
    async function init() {
      try {
        const { cities, localities } = await getAvailableFilters();
        setAvailableCities(cities);
        setAvailableLocalities(localities);
        
        // Auto-select first city if available
        if (cities.length > 0 && !filters.city) {
          setFilters(prev => ({ ...prev, city: cities[0] }));
        }

        const owner = await getMarketTrendsOwner();
        if (owner?.id) {
          const props = await getOwnerPropertiesForMarket(owner.id);
          setOwnerProperties(props);
        }
      } catch (err) {
        console.error("Filter init error:", err);
      }
    }
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load Market Data when filters change
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await getMarketTrends(filters);
      setMarketData(data);
    } catch (err) {
      setError(err?.message || "Unable to load market trends.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived Data (Primary active market trend object)
  const activeTrend = marketData.length > 0 ? marketData[0] : null;

  // Chart Data Preparation (Safely parsing JSON if present)
  const priceChartData = useMemo(() => {
    if (!activeTrend?.HistoricalPrices) return [];
    try {
      // Assuming HistoricalPrices is stored as JSON array: [{ date: "Jan", price: 12000 }]
      const parsed = typeof activeTrend.HistoricalPrices === "string" 
        ? JSON.parse(activeTrend.HistoricalPrices) 
        : activeTrend.HistoricalPrices;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [activeTrend]);

  const demandSupplyData = useMemo(() => {
    if (!activeTrend) return [];
    return [
      { name: "Demand", value: activeTrend.DemandScore || 0, color: "#064d3b" },
      { name: "Supply", value: activeTrend.SupplyScore || 0, color: "#c99838" },
    ];
  }, [activeTrend]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      if (key === "city") updated.locality = ""; // Reset locality if city changes
      return updated;
    });
  };

  // Find overlapping owner properties
  const matchingProperties = useMemo(() => {
    if (!activeTrend || !ownerProperties.length) return [];
    return ownerProperties.filter(p => 
      p.City === activeTrend.City && 
      (p.Locality === activeTrend.Locality || !activeTrend.Locality)
    );
  }, [activeTrend, ownerProperties]);


  // =====================================================
  // LOADING STATE
  // =====================================================
  if (loading && !marketData.length) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans">
        <Header />
        <main className="flex-1 py-8 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 bg-gray-200 rounded-xl w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-96 animate-pulse mb-8"></div>
            <div className="h-16 bg-white rounded-2xl border border-gray-100 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
            <div className="h-80 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // =====================================================
  // FULL PAGE RENDER
  // =====================================================
  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
      <Header />
      
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* ---- PAGE HEADER ---- */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#c99838] uppercase tracking-wider mb-1">
              <Link href="/owner/insights" className="hover:underline">Insights</Link>
              <span>›</span>
              <span>Market Trends</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">Market Trends</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              Understand property prices, demand and market movement in your city and locality.
            </p>
          </div>

          {/* ---- FILTER BAR ---- */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-6 flex flex-wrap gap-3">
            
            <div className="relative flex-1 min-w-[140px]">
              <select
                value={filters.city} onChange={(e) => handleFilterChange("city", e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 bg-[#faf8f5] text-sm font-semibold text-gray-700 outline-none focus:border-[#064d3b] cursor-pointer"
              >
                <option value="">All Cities</option>
                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <MapPin size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <ChevronDown size={13} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-[140px]">
              <select
                value={filters.locality} onChange={(e) => handleFilterChange("locality", e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 bg-[#faf8f5] text-sm font-semibold text-gray-700 outline-none focus:border-[#064d3b] cursor-pointer"
              >
                <option value="">All Localities</option>
                {availableLocalities.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <Search size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <ChevronDown size={13} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-[140px]">
              <select
                value={filters.category} onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 bg-[#faf8f5] text-sm font-semibold text-gray-700 outline-none focus:border-[#064d3b] cursor-pointer"
              >
                {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <Building size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <ChevronDown size={13} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-[120px]">
              <select
                value={filters.purpose} onChange={(e) => handleFilterChange("purpose", e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 bg-[#faf8f5] text-sm font-semibold text-gray-700 outline-none focus:border-[#064d3b] cursor-pointer"
              >
                {PURPOSE_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-[120px]">
              <select
                value={filters.period} onChange={(e) => handleFilterChange("period", e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 bg-[#faf8f5] text-sm font-semibold text-gray-700 outline-none focus:border-[#064d3b] cursor-pointer"
              >
                {PERIOD_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
            
            <button
              onClick={fetchData}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-[#faf8f5] hover:bg-white transition flex-shrink-0"
              title="Refresh"
            >
              <RefreshCw size={15} className={`text-gray-500 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* ---- ERROR STATE ---- */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
              <p className="text-red-700 font-bold mb-2">Unable to load market trends</p>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <button onClick={fetchData} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700">Try Again</button>
            </div>
          )}

          {/* ---- EMPTY STATE ---- */}
          {!loading && !error && !activeTrend && (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center mb-6 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">📍</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No market data available</h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm mb-6">
                There is currently no market trend data for the selected location and filters in Strapi. 
                Please adjust your filters or wait for market reports to be published.
              </p>
              <button 
                onClick={() => setFilters({ city: availableCities[0] || "", locality: "", category: "Residential", purpose: "Sale", period: "SixMonths" })}
                className="px-6 py-2.5 bg-[#064d3b] text-white rounded-xl font-semibold text-sm hover:bg-[#053d30]"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* ---- DATA VIEW ---- */}
          {!loading && !error && activeTrend && (
            <>
              {/* MARKET SNAPSHOT */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard
                  title="Average Price"
                  value={`${formatPrice(activeTrend.AveragePrice)} ${filters.purpose === "Sale" ? "/ sq.ft" : "/ mo"}`}
                  growth={activeTrend.PriceChange}
                  subtitle={`vs previous ${PERIOD_OPTIONS.find(p=>p.value===filters.period)?.label}`}
                  onClick={() => router.push(`/owner/insights/market-trends/${activeTrend.documentId || activeTrend.id}`)}
                />
                <KpiCard
                  title="Price Trend"
                  value={activeTrend.PriceChange > 0 ? "Upward" : activeTrend.PriceChange < 0 ? "Downward" : "Stable"}
                  type="string"
                  subtitle="Overall market direction"
                  onClick={() => router.push(`/owner/insights/market-trends/${activeTrend.documentId || activeTrend.id}`)}
                />
                <KpiCard
                  title="Demand Score"
                  value={`${activeTrend.DemandScore || 0} / 100`}
                  growth={activeTrend.DemandChange}
                  subtitle="Buyer/Tenant interest"
                  onClick={() => {}}
                />
                <KpiCard
                  title="Supply Score"
                  value={`${activeTrend.SupplyScore || 0} / 100`}
                  growth={activeTrend.SupplyChange}
                  subtitle="Active listings availability"
                  onClick={() => {}}
                />
              </div>

              {/* CHARTS ROW */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                
                {/* Price Trends */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Property Price Trends</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">Historical average price for selected filters</p>
                    </div>
                  </div>
                  
                  {priceChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={priceChartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#064d3b" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#064d3b" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                        <Tooltip 
                          contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e5e7eb" }}
                          formatter={(value) => [`₹${value.toLocaleString()}`, "Avg Price"]}
                        />
                        <Area type="monotone" dataKey="price" stroke="#064d3b" strokeWidth={2.5} fill="url(#priceGrad)" activeDot={{ r: 5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">
                      No historical price data available in Strapi.
                    </div>
                  )}
                </div>

                {/* Demand vs Supply */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col">
                  <h3 className="text-base font-bold text-gray-900 mb-6">Demand vs Supply</h3>
                  <div className="flex-1 flex flex-col justify-center gap-6">
                    
                    <div className="relative">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-[#064d3b]">Market Demand</span>
                        <span className="text-gray-900">{activeTrend.DemandScore}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#064d3b] rounded-full" style={{ width: `${activeTrend.DemandScore || 0}%` }}></div>
                      </div>
                      {activeTrend.DemandChange && (
                        <p className={`text-[10px] mt-1.5 font-semibold ${activeTrend.DemandChange > 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {activeTrend.DemandChange > 0 ? "↑" : "↓"} {Math.abs(activeTrend.DemandChange)}% vs last period
                        </p>
                      )}
                    </div>
                    
                    <div className="relative">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-[#c99838]">Market Supply</span>
                        <span className="text-gray-900">{activeTrend.SupplyScore}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#c99838] rounded-full" style={{ width: `${activeTrend.SupplyScore || 0}%` }}></div>
                      </div>
                      {activeTrend.SupplyChange && (
                        <p className={`text-[10px] mt-1.5 font-semibold ${activeTrend.SupplyChange > 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {activeTrend.SupplyChange > 0 ? "↑" : "↓"} {Math.abs(activeTrend.SupplyChange)}% vs last period
                        </p>
                      )}
                    </div>

                  </div>
                </div>

              </div>

              {/* WHAT THIS MEANS FOR YOUR PROPERTY */}
              <div className="bg-[#064d3b] text-white rounded-3xl p-6 shadow-md mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 text-[150px] leading-none transform translate-x-4 -translate-y-4">
                  <Home />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Info size={18} className="text-[#c99838]" />
                    <h3 className="text-lg font-bold">What This Means For Your Property</h3>
                  </div>
                  
                  {matchingProperties.length > 0 ? (
                    <div className="space-y-4 max-w-3xl">
                      <p className="text-sm text-emerald-50 leading-relaxed">
                        You have <strong>{matchingProperties.length}</strong> propert{matchingProperties.length > 1 ? "ies" : "y"} 
                        in <strong>{activeTrend.Locality || activeTrend.City}</strong>. 
                        Currently, this area is experiencing a <strong>{activeTrend.MarketStatus || "Balanced"}</strong> market 
                        with {activeTrend.PriceChange > 0 ? "an upward" : "a downward"} price trend of {Math.abs(activeTrend.PriceChange || 0)}%.
                      </p>
                      
                      <div className="bg-[#053d30] rounded-2xl p-4 border border-emerald-900/50">
                        <p className="text-xs font-semibold text-[#c99838] mb-2 uppercase tracking-wide">Recommendation</p>
                        <p className="text-sm">
                          {activeTrend.DemandScore > activeTrend.SupplyScore 
                            ? "Demand is outstripping supply. It's a great time to list properties as competition among buyers/tenants is high. Ensure your listings have high-quality images to capture this demand." 
                            : "Supply is higher than demand. You may need to price competitively or invest in promotions to stand out."}
                        </p>
                      </div>

                      <button 
                        onClick={() => router.push("/owner/insights/performance")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#064d3b] text-sm font-bold rounded-xl hover:bg-gray-50 transition"
                      >
                        View Property Performance <ArrowRight size={14} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-emerald-50 max-w-2xl">
                      You currently do not have any properties listed in <strong>{activeTrend.Locality || activeTrend.City}</strong>. 
                      However, if you are looking to invest, the {activeTrend.Category} {activeTrend.Purpose} market here 
                      is showing a <strong>{activeTrend.MarketStatus || "Balanced"}</strong> status.
                    </p>
                  )}
                </div>
              </div>

            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
