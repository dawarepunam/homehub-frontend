"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMarketTrendById } from "@/services/marketTrends";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown, MapPin, Building } from "lucide-react";

function formatNum(n) {
  if (!n && n !== 0) return "0";
  return Number(n).toLocaleString("en-IN");
}

function formatPrice(price) {
  if (!price) return "N/A";
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

export default function MarketTrendDetailPage({ params }) {
  const router = useRouter();
  const unwrapped = use(params);
  const id = unwrapped?.id;

  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getMarketTrendById(id);
        if (!data) throw new Error("Market trend not found.");
        setTrend(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  let chartData = [];
  if (trend?.HistoricalPrices) {
    try {
      const p = typeof trend.HistoricalPrices === "string" ? JSON.parse(trend.HistoricalPrices) : trend.HistoricalPrices;
      if (Array.isArray(p)) chartData = p;
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#064d3b] border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-red-600 font-bold">{error}</p>
          <button onClick={() => router.push("/owner/insights/market-trends")} className="px-6 py-2 bg-[#064d3b] text-white rounded-xl">Go Back</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          <button onClick={() => router.push("/owner/insights/market-trends")} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#064d3b] mb-6 transition">
            <ArrowLeft size={16} /> Back to Market Trends
          </button>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="bg-[#064d3b] p-8 text-white">
              <h1 className="text-3xl font-extrabold mb-2">Market Details</h1>
              <div className="flex items-center gap-6 text-emerald-100 text-sm font-semibold">
                <span className="flex items-center gap-1.5"><MapPin size={16}/> {trend.Locality ? `${trend.Locality}, ` : ""}{trend.City}</span>
                <span className="flex items-center gap-1.5"><Building size={16}/> {trend.PropertyCategory} • {trend.Purpose}</span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">Avg Price</p>
                  <p className="text-2xl font-extrabold text-[#064d3b]">{formatPrice(trend.AveragePrice)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">Change</p>
                  <p className={`text-xl font-bold flex items-center gap-1 mt-1 ${trend.PriceChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {trend.PriceChange >= 0 ? <TrendingUp size={18}/> : <TrendingDown size={18}/>} 
                    {Math.abs(trend.PriceChange || 0)}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">Demand</p>
                  <p className="text-2xl font-extrabold text-gray-900">{trend.DemandScore}/100</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wide">Supply</p>
                  <p className="text-2xl font-extrabold text-gray-900">{trend.SupplyScore}/100</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Historical Price Trend</h3>
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#064d3b" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#064d3b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="price" stroke="#064d3b" strokeWidth={2} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No historical data available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
