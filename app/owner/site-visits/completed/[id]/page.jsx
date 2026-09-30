"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import { getOwnerEnquiry } from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function CompletedVisitDetailPage({ params }) {
  const router = useRouter();

  // React 19 / Next 15 specific approach to accessing params safely if needed, but since it's Next.js 14 mostly, we can just use params directly or React.use(params). We'll assume typical Next.js params.id handling:
  const unwrappedParams = use(params);
  const id = unwrappedParams?.id;

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVisit() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getOwnerEnquiry(id);
        if (!data) throw new Error("Visit not found.");
        setVisit(data);
      } catch (err) {
        setError(err?.message || "Failed to load visit details.");
      } finally {
        setLoading(false);
      }
    }
    fetchVisit();
  }, [id]);

  // Helpers
  function getPropertyRelation() {
    const rel = visit?.property;
    if (!rel) return {};
    if (rel?.data?.attributes) return rel.data.attributes;
    if (rel?.attributes) return rel.attributes;
    if (rel?.data) return rel.data;
    return rel;
  }

  const prop = getPropertyRelation();
  const name = visit?.Name || visit?.name || "Customer";
  const phone = visit?.Phone || visit?.phone || "N/A";
  const email = visit?.Email || visit?.email || "N/A";
  const status = visit?.Status || visit?.status || visit?.Statuss || "Pending";
  const message = visit?.Message || visit?.message || "No specific message provided.";
  const enqDateStr = visit?.createdAt || visit?.EnquiryDate || null;

  const propTitle = prop?.Title || prop?.title || prop?.Name || prop?.name || "Untitled Property";
  const propCity = prop?.City || prop?.city || prop?.Location || prop?.location || "";
  const propArea = prop?.Area || prop?.area || prop?.Locality || prop?.locality || "";
  const propType = prop?.Type || prop?.type || prop?.PropertyType || prop?.propertyType || "N/A";

  const rawPrice = prop?.Price || prop?.price || prop?.ExpectedPrice || prop?.expectedPrice;
  const propPrice = typeof rawPrice === "number"
    ? (rawPrice >= 10000000 ? `₹${(rawPrice / 10000000).toFixed(2)} Cr` : `₹${rawPrice.toLocaleString("en-IN")}`)
    : rawPrice || "N/A";

  const images = prop?.Images || prop?.images || prop?.Media || prop?.media;
  let propImage = null;
  if (Array.isArray(images) && images.length > 0) {
    const url = images[0]?.url || images[0]?.attributes?.url;
    if (url) propImage = url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
  }
  const initials = name.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "C";

  const visitDateStr = visit?.VisitDate || visit?.visitDate || visit?.FollowUpDate || null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };
  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />
        <main className="flex-1 p-10 flex flex-col items-center justify-center">
          <div className="inline-block w-12 h-12 border-4 border-[#064d3b] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-semibold animate-pulse">Loading detail...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />
        <main className="flex-1 p-10 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl font-bold mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-red-700">Unable to load detail</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <Link href="/owner/site-visits/completed" className="mt-6 px-6 py-3 rounded-xl bg-[#064d3b] text-white font-semibold hover:bg-[#053d30] transition">
            ← Back to Completed Visits
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 mb-6">
            <Link href="/owner/dashboard" className="hover:text-[#064d3b]">Home</Link>
            <span>›</span>
            <Link href="/owner/site-visits/upcoming" className="hover:text-[#064d3b]">Site Visits</Link>
            <span>›</span>
            <Link href="/owner/site-visits/completed" className="hover:text-[#064d3b]">Completed</Link>
            <span>›</span>
            <span className="text-[#064d3b]">Visit Details</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-[#064d3b]">Completed Visit</h1>
            <Link href="/owner/site-visits/completed" className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50">
              ← Back to Completed
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COL: Property & Info */}
            <div className="lg:col-span-2 space-y-6">

              {/* Profile Banner */}
              <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#e6f2ed] text-[#064d3b] flex items-center justify-center font-black text-2xl border border-emerald-200">
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ COMPLETED
                    </span>
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500 font-medium">
                    <span>☎ {phone}</span>
                    {email && <span>✉ {email}</span>}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-5">Property Details</h3>
                <div className="flex flex-col sm:flex-row gap-6">
                  {propImage ? (
                    <img src={propImage} alt={propTitle} className="w-full sm:w-40 h-40 object-cover rounded-2xl border border-gray-200" />
                  ) : (
                    <div className="w-full sm:w-40 h-40 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-xl font-bold text-[#064d3b]">{propTitle}</h4>
                    <p className="text-sm text-gray-500 mt-1">📍 {[propArea, propCity].filter(Boolean).join(", ")}</p>
                    <div className="mt-3 inline-block bg-[#fef6e7] text-[#c99838] font-black text-lg px-3 py-1 rounded-lg">
                      {propPrice}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Property Type</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{propType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Message */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-5">Enquiry Information</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Enquiry ID</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">ENQ-{visit?.id || "---"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Enquiry Date</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{formatDate(enqDateStr)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Customer Message</p>
                  <div className="bg-[#faf8f5] p-4 rounded-xl mt-2 text-sm text-gray-700 leading-relaxed border border-gray-200">
                    {message}
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COL: Status & Actions */}
            <div className="space-y-6">

              {/* Visit Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-5">Visit Information</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">📅</div>
                      <span className="text-sm font-semibold text-gray-600">Visit Date</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatDate(visitDateStr)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">🕒</div>
                      <span className="text-sm font-semibold text-gray-600">Visit Time</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatTime(visitDateStr)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">📊</div>
                      <span className="text-sm font-semibold text-gray-600">Status</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ {status.toUpperCase()}
                    </span>
                  </div>

                  {visit?.updatedAt && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-xs font-semibold text-gray-400">Last Updated</span>
                      <span className="text-xs font-bold text-gray-500">{formatDate(visit.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const propId = prop?.id || prop?.documentId;
                      if (propId) router.push(`/owner/properties/${propId}`);
                      else alert("Property ID not found");
                    }}
                    className="px-4 py-3 rounded-xl bg-[#d6a744] text-[#064d3b] text-xs font-bold hover:bg-[#c99838] transition shadow flex items-center justify-center"
                  >
                    View Property
                  </button>
                  <button
                    onClick={() => router.push(`/owner/enquiries/${id}`)}
                    className="px-4 py-3 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition shadow flex items-center justify-center border border-gray-200"
                  >
                    View Enquiry
                  </button>
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
