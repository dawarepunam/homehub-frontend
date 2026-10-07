"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "../../../../Footer";
import {
  getOwnerPropertiesForInsights,
  getOwnerEnquiriesForInsights,
  calculatePerformanceScore,
  generateChartData,
  STRAPI_MEDIA_URL,
} from "@/services/ownerInsights";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { ArrowLeft, Eye, MessageSquare, Heart, Phone, Calendar } from "lucide-react";

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
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );
}

export default function PropertyPerformanceDetailPage({ params }) {
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
        (p) =>
          String(p?.documentId) === String(propertyId) ||
          String(p?.id) === String(propertyId)
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

      const hasImages =
        !!(found?.CoverImage || (Array.isArray(found?.PropertyImage) && found.PropertyImage.length));
      const hasDescription = !!(found?.Description);

      const computed = calculatePerformanceScore({
        views,
        enquiries: enq.length,
        saves,
        siteVisits,
        hasImages,
        hasDescription,
        propertyStatus: found?.PropertyStatus || "ACTIVE",
      });
      setScore(computed);
    } catch (err) {
      setError(err?.message || "Unable to load property analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (propertyId) loadData();
  }, [propertyId]);

  const scoreColor =
    score?.score >= 90 ? "#22c55e" : score?.score >= 75 ? "#064d3b" : score?.score >= 60 ? "#c99838" : "#ef4444";

  let coverImg = null;
  if (property?.CoverImage?.url) coverImg = `${STRAPI_MEDIA_URL}${property.CoverImage.url}`;
  else if (Array.isArray(property?.PropertyImage) && property.PropertyImage.length)
    coverImg = `${STRAPI_MEDIA_URL}${property.PropertyImage[0]?.url}`;

  const chartData = property ? generateChartData(Number(property?.Views) || 0, period, chartTab) : [];

  const recentEnquiries = [...propEnquiries]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#064d3b] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-semibold animate-pulse">Loading property analytics...</p>
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
          <p className="text-red-600 font-bold text-xl mb-3">⚠️ {error}</p>
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
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-5">
            <Link href="/owner" className="hover:text-[#064d3b]">Home</Link> ›
            <Link href="/owner/insights/performance" className="hover:text-[#064d3b]">Performance</Link> ›
            <span className="text-[#064d3b]">{property?.Title || "Property"}</span>
          </div>

          <button onClick={() => router.push("/owner/insights/performance")} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#064d3b] mb-6 transition">
            <ArrowLeft size={16} /> Back to Performance
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT: Property Info */}
            <div className="lg:col-span-1 space-y-5">
              {/* Property Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {coverImg ? (
                  <img src={coverImg} alt={property?.Title} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-[#e6f2ed] flex items-center justify-center text-5xl">🏠</div>
                )}
                <div className="p-5">
                  <h1 className="text-lg font-extrabold text-gray-900">{property?.Title}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {[property?.Area, property?.City, property?.State].filter(Boolean).join(", ")}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Price</p>
                      <p className="text-sm font-extrabold text-[#c99838]">{formatPrice(property?.Price, property?.PriceUnits)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Type</p>
                      <p className="text-sm font-bold text-gray-700">{property?.Property_Type}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Category</p>
                      <p className="text-sm font-bold text-gray-700">{property?.Category}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Status</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${property?.PropertyStatus === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {property?.PropertyStatus || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Score */}
              {score && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Performance Score</h3>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-16 h-16">
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
            </div>

            {/* RIGHT: Analytics */}
            <div className="lg:col-span-2 space-y-5">

              {/* KPI mini cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Eye size={16} />, label: "Views", value: property?.Views || 0, color: "bg-[#e6f2ed] text-[#064d3b]" },
                  { icon: <MessageSquare size={16} />, label: "Enquiries", value: propEnquiries.length, color: "bg-[#fef6e7] text-[#c99838]" },
                  { icon: <Heart size={16} />, label: "Saves", value: property?.Saves || 0, color: "bg-pink-50 text-pink-600" },
                  { icon: <Calendar size={16} />, label: "Site Visits", value: propEnquiries.filter(e => (e?.Statuss || "").toLowerCase().includes("site visit")).length, color: "bg-purple-50 text-purple-600" },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.color} mb-2`}>{kpi.icon}</div>
                    <p className="text-xs text-gray-500 font-semibold">{kpi.label}</p>
                    <p className="text-2xl font-extrabold text-gray-900">{formatNum(kpi.value)}</p>
                  </div>
                ))}
              </div>

              {/* Views Chart */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Views Trend</h3>
                  <div className="flex rounded-xl overflow-hidden border border-gray-200">
                    {["daily", "weekly", "monthly"].map((tab) => (
                      <button key={tab} onClick={() => setChartTab(tab)}
                        className={`px-3 py-1 text-xs font-bold capitalize transition ${chartTab === tab ? "bg-[#064d3b] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e5e7eb" }} />
                    <Line type="monotone" dataKey="value" stroke="#064d3b" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "#064d3b" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Enquiries */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Enquiries</h3>
                {recentEnquiries.length === 0 ? (
                  <p className="text-gray-400 text-sm">No enquiries for this property yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recentEnquiries.map((enq) => {
                      const initials = (enq?.Name || "C").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                      const statusColor = {
                        "Completed": "bg-emerald-50 text-emerald-700",
                        "Site Visit": "bg-blue-50 text-blue-700",
                        "Cancelled": "bg-red-50 text-red-700",
                        "Pending": "bg-gray-100 text-gray-600",
                      }[enq?.Statuss] || "bg-gray-100 text-gray-600";
                      return (
                        <div key={enq?.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e6f2ed] text-[#064d3b] font-bold text-xs flex items-center justify-center">{initials}</div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{enq?.Name || "Unknown"}</p>
                              <p className="text-[10px] text-gray-400">{enq?.Phone}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>{enq?.Statuss || "Pending"}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <Link href="/owner/enquiries" className="block mt-4 text-xs text-[#064d3b] font-bold hover:underline text-right">
                  View All Enquiries →
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
