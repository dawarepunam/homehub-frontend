"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getOwnerPropertiesForInsights,
  getOwnerEnquiriesForInsights,
  calculatePerformanceScore,
  generateChartData,
  STRAPI_MEDIA_URL,
} from "@/services/ownerInsights";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ArrowLeft, Eye, MessageSquare, Heart, Phone, Calendar } from "lucide-react";

const FUNNEL_COLORS = ["#064d3b", "#1a7a5e", "#c99838", "#e07b2a", "#e84545"];

function formatNum(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function formatPrice(price, unit) {
  if (!price) return "N/A";
  const num = Number(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function ScoreBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );
}

function FunnelStage({ label, count, pct, color, total }) {
  const barW = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></span>
          <span className="text-xs font-semibold text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-gray-900">{count}</span>
          <span className="text-[10px] text-gray-400 w-10 text-right">({pct}%)</span>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${barW}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );
}

export default function PropertyReportPage({ params }) {
  const router = useRouter();
  const unwrapped = use(params);
  const propertyId = unwrapped?.propertyId;

  const [property, setProperty] = useState(null);
  const [propEnquiries, setPropEnquiries] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("30d");
  const [chartTab, setChartTab] = useState("daily");

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const { properties } = await getOwnerPropertiesForInsights();
      const found = properties.find(
        (p) => String(p?.documentId) === String(propertyId) || String(p?.id) === String(propertyId)
      );
      if (!found) throw new Error("Property not found or not owned by you.");

      const enq = await getOwnerEnquiriesForInsights([String(found?.id)]);
      setProperty(found);
      setPropEnquiries(enq);

      const views = Number(found?.Views) || 0;
      const saves = Number(found?.Saves) || 0;
      const siteVisits = enq.filter((e) => {
        const s = (e?.Statuss || "").toLowerCase();
        return s.includes("site visit") || s === "scheduled" || s === "completed";
      }).length;

      const computed = calculatePerformanceScore({
        views,
        enquiries: enq.length,
        saves,
        siteVisits,
        hasImages: !!(found?.CoverImage || (Array.isArray(found?.PropertyImage) && found.PropertyImage.length)),
        hasDescription: !!(found?.Description),
        propertyStatus: found?.PropertyStatus || "ACTIVE",
      });
      setScore(computed);
    } catch (err) {
      setError(err?.message || "Unable to load property report.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (propertyId) loadData();
  }, [propertyId]);

  const chartData = property ? generateChartData(Number(property?.Views) || 0, period, chartTab) : [];

  const breakdown = propEnquiries.reduce((acc, e) => {
    const s = e?.Statuss || "Pending";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const total = propEnquiries.length;
  const funnelStages = [
    { label: "Total Enquiries", count: total, color: FUNNEL_COLORS[0] },
    { label: "Contacted", count: breakdown["Contacted"] || 0, color: FUNNEL_COLORS[1] },
    { label: "Site Visit", count: breakdown["Site Visit"] || breakdown["Scheduled"] || 0, color: FUNNEL_COLORS[2] },
    { label: "Negotiation", count: breakdown["Negotiation"] || breakdown["Interested"] || 0, color: FUNNEL_COLORS[3] },
    { label: "Converted", count: breakdown["Converted"] || 0, color: FUNNEL_COLORS[4] },
  ].map((s) => ({ ...s, pct: total > 0 ? Math.round((s.count / total) * 100) : 0 }));

  const recentEnq = [...propEnquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const scoreColor = score?.score >= 90 ? "#22c55e" : score?.score >= 75 ? "#064d3b" : score?.score >= 60 ? "#c99838" : "#ef4444";

  let coverImg = null;
  if (property?.CoverImage?.url) coverImg = `${STRAPI_MEDIA_URL}${property.CoverImage.url}`;
  else if (Array.isArray(property?.PropertyImage) && property.PropertyImage.length)
    coverImg = `${STRAPI_MEDIA_URL}${property.PropertyImage[0]?.url}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#064d3b] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-semibold animate-pulse">Loading property report...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <p className="text-red-600 font-bold text-xl mb-4">⚠️ {error}</p>
          <button onClick={loadData} className="px-6 py-3 rounded-xl bg-[#064d3b] text-white font-bold">Try Again</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-4">
            <Link href="/owner" className="hover:text-[#064d3b]">Home</Link> ›
            <Link href="/owner/insights/reports" className="hover:text-[#064d3b]">Reports</Link> ›
            <span className="text-[#064d3b] truncate max-w-xs">{property?.Title || "Property"}</span>
          </div>

          <button onClick={() => router.push("/owner/insights/reports")} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#064d3b] mb-6 transition">
            <ArrowLeft size={15} /> Back to Reports
          </button>

          {/* ---- TOP: Property Header + Period Filter ---- */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="relative h-36 sm:h-48 bg-[#e6f2ed]">
              {coverImg && <img src={coverImg} alt={property?.Title} className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-5 text-white">
                <h1 className="text-xl sm:text-2xl font-extrabold drop-shadow-sm">{property?.Title}</h1>
                <p className="text-sm opacity-80">📍 {[property?.Area, property?.City, property?.State].filter(Boolean).join(", ")}</p>
              </div>
              <div className="absolute top-4 right-4">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-white/30 bg-black/30 text-white text-xs font-bold backdrop-blur-sm outline-none cursor-pointer"
                >
                  {[
                    { label: "Last 7 Days", value: "7d" },
                    { label: "Last 30 Days", value: "30d" },
                    { label: "Last 3 Months", value: "3m" },
                    { label: "Last 6 Months", value: "6m" },
                  ].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-50">
              {[
                { label: "Price", value: formatPrice(property?.Price, property?.PriceUnits) },
                { label: "Type", value: property?.Property_Type || "—" },
                { label: "Category", value: property?.Category || "—" },
                { label: "Status", value: property?.PropertyStatus || "—" },
              ].map((d) => (
                <div key={d.label}>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{d.label}</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ---- LEFT COLUMN ---- */}
            <div className="space-y-5">

              {/* Performance Score */}
              {score && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Performance Score</h3>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="4" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor} strokeWidth="4"
                          strokeDasharray={`${score.score} ${100 - score.score}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-extrabold" style={{ color: scoreColor }}>{score.score}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xl font-extrabold" style={{ color: scoreColor }}>{score.score}/100</p>
                      <p className="text-xs font-bold text-gray-500">{score.label}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <ScoreBar label="Listing Quality" value={score.listingQuality} color={scoreColor} />
                    <ScoreBar label="Views" value={score.viewsScore} color={scoreColor} />
                    <ScoreBar label="Engagement" value={score.engagementScore} color={scoreColor} />
                    <ScoreBar label="Enquiries" value={score.enquiryScore} color={scoreColor} />
                    <ScoreBar label="Response Rate" value={score.responseRate} color={scoreColor} />
                  </div>
                </div>
              )}

              {/* Enquiry Funnel */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Enquiry Funnel</h3>
                {total > 0 ? (
                  <div className="space-y-4">
                    {funnelStages.map((s) => (
                      <FunnelStage key={s.label} label={s.label} count={s.count} pct={s.pct} color={s.color} total={funnelStages[0].count} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6">No enquiries yet for this property.</p>
                )}
              </div>

              {/* Listing Quality */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Listing Quality</h3>
                <div className="space-y-3">
                  {[
                    { label: "Has Cover Image", ok: !!(property?.CoverImage) },
                    { label: "Has Property Images", ok: Array.isArray(property?.PropertyImage) && property.PropertyImage.length > 0 },
                    { label: "Has Description", ok: !!(property?.Description) },
                    { label: "Has Address", ok: !!(property?.Address) },
                    { label: "Has Price", ok: !!(property?.Price) },
                    { label: "Listing Active", ok: property?.PropertyStatus === "ACTIVE" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">{item.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                        {item.ok ? "✓ Yes" : "✗ Missing"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- RIGHT COLUMN ---- */}
            <div className="lg:col-span-2 space-y-5">

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Eye size={15} />, label: "Views", value: property?.Views || 0, bg: "bg-[#e6f2ed] text-[#064d3b]" },
                  { icon: <MessageSquare size={15} />, label: "Enquiries", value: propEnquiries.length, bg: "bg-[#fef6e7] text-[#c99838]" },
                  { icon: <Heart size={15} />, label: "Saves", value: property?.Saves || 0, bg: "bg-pink-50 text-pink-600" },
                  { icon: <Calendar size={15} />, label: "Site Visits", value: propEnquiries.filter(e => (e?.Statuss || "").toLowerCase().includes("site visit")).length, bg: "bg-purple-50 text-purple-600" },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.bg} mb-2`}>{kpi.icon}</div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{kpi.label}</p>
                    <p className="text-2xl font-extrabold text-gray-900">{formatNum(kpi.value)}</p>
                  </div>
                ))}
              </div>

              {/* Views Trend Chart */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Views Trend</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Based on {formatNum(property?.Views || 0)} total views</p>
                  </div>
                  <div className="flex rounded-xl overflow-hidden border border-gray-200">
                    {["daily", "weekly", "monthly"].map((tab) => (
                      <button key={tab} onClick={() => setChartTab(tab)}
                        className={`px-3 py-1.5 text-[10px] font-bold capitalize transition ${chartTab === tab ? "bg-[#064d3b] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={170}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="propGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#064d3b" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#064d3b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e5e7eb" }} />
                    <Area type="monotone" dataKey="value" stroke="#064d3b" strokeWidth={2} fill="url(#propGrad)" dot={false} activeDot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Enquiries */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Recent Enquiries</h3>
                  <Link href="/owner/enquiries" className="text-xs font-bold text-[#064d3b] hover:underline">View All →</Link>
                </div>
                {recentEnq.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No enquiries for this property yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {recentEnq.map((enq) => {
                      const initials = (enq?.Name || "C").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                      const statusColors = { "Completed": "bg-emerald-50 text-emerald-700", "Site Visit": "bg-blue-50 text-blue-700", "Cancelled ": "bg-red-50 text-red-700", "Pending": "bg-gray-100 text-gray-500", "New": "bg-[#e6f2ed] text-[#064d3b]" };
                      const sColor = statusColors[enq?.Statuss] || "bg-gray-100 text-gray-600";
                      return (
                        <div key={enq?.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e6f2ed] text-[#064d3b] font-bold text-xs flex items-center justify-center flex-shrink-0">{initials}</div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{enq?.Name || "Unknown"}</p>
                              <p className="text-[10px] text-gray-400">{enq?.Phone} · {new Date(enq?.createdAt).toLocaleDateString("en-IN")}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sColor}`}>{enq?.Statuss || "Pending"}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Smart Insights for this property */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {[
                    {
                      show: !(property?.CoverImage),
                      icon: "🖼️",
                      text: "Add a cover image to significantly improve visibility.",
                      href: `/owner/properties/${property?.documentId || property?.id}/edit`,
                      label: "Add Image",
                      bg: "bg-amber-50 border-amber-100",
                    },
                    {
                      show: propEnquiries.filter(e => ["Pending", "New"].includes(e?.Statuss)).length > 0,
                      icon: "💬",
                      text: `${propEnquiries.filter(e => ["Pending", "New"].includes(e?.Statuss)).length} enquiries need your response.`,
                      href: "/owner/enquiries",
                      label: "Respond Now",
                      bg: "bg-blue-50 border-blue-100",
                    },
                    {
                      show: true,
                      icon: "📢",
                      text: "Boost this property for more visibility and faster conversions.",
                      href: "/owner/promotions",
                      label: "Promote",
                      bg: "bg-[#e6f2ed] border-emerald-100",
                    },
                  ].filter(r => r.show).map((r) => (
                    <div key={r.icon} className={`flex items-center justify-between p-3 rounded-xl border ${r.bg}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{r.icon}</span>
                        <p className="text-xs font-semibold text-gray-800">{r.text}</p>
                      </div>
                      <button
                        onClick={() => router.push(r.href)}
                        className="ml-3 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[10px] font-bold text-gray-700 hover:bg-[#064d3b] hover:text-white hover:border-[#064d3b] transition whitespace-nowrap flex-shrink-0"
                      >
                        {r.label}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
