"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../Footer";
import {
  getOwnerEnquiries,
  updateOwnerEnquiryStatus,
} from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function ClosedEnquiriesPage() {
  const router = useRouter();

  // Primary data state
  const [allEnquiries, setAllEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [purposeFilter, setPurposeFilter] = useState("All Purposes");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Latest Closed");

  // Modal Detail state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // =====================================================
  // FETCH CLOSED ENQUIRIES FROM STRAPI
  // =====================================================
  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      console.log("=================================");
      console.log("CLOSED ENQUIRIES PAGE");
      console.log("Fetching owner enquiries from Strapi...");
      console.log("=================================");

      const data = await getOwnerEnquiries();
      console.log("STRAPI ENQUIRIES FOR CLOSED:", data);

      setAllEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("CLOSED ENQUIRIES ERROR:", err);
      setError(err?.message || "Unable to load closed enquiries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  // Clear toast timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // =====================================================
  // STRAPI HELPER PARSERS
  // =====================================================
  function getStatus(item) {
    return String(
      item?.Status || item?.status || item?.Statuss || "Pending"
    ).trim();
  }

  function isClosedItem(item) {
    const s = getStatus(item).toLowerCase();
    return (
      s === "closed" ||
      s === "not interested" ||
      s === "converted" ||
      s === "archived"
    );
  }

  function getPropertyRelation(item) {
    const rel = item?.property;
    if (!rel) return {};
    if (rel?.data?.attributes) return rel.data.attributes;
    if (rel?.attributes) return rel.attributes;
    if (rel?.data) return rel.data;
    return rel;
  }

  function getPropertyName(item) {
    const prop = getPropertyRelation(item);
    return prop?.Title || prop?.title || prop?.Name || prop?.name || "Untitled Property";
  }

  function getPropertyCity(item) {
    const prop = getPropertyRelation(item);
    return prop?.City || prop?.city || prop?.Location || prop?.location || "";
  }

  function getPropertyArea(item) {
    const prop = getPropertyRelation(item);
    return prop?.Area || prop?.area || prop?.Locality || prop?.locality || "";
  }

  function getPropertyPurpose(item) {
    const prop = getPropertyRelation(item);
    return prop?.Purpose || prop?.purpose || prop?.ListingType || prop?.listingType || "Sale";
  }

  function getPropertyType(item) {
    const prop = getPropertyRelation(item);
    return prop?.PropertyType || prop?.propertyType || prop?.Category || prop?.category || "Apartment";
  }

  function getPropertyPrice(item) {
    const prop = getPropertyRelation(item);
    const rawPrice = prop?.Price || prop?.price || prop?.ExpectedPrice || prop?.expectedPrice;
    if (!rawPrice) return null;
    if (typeof rawPrice === "number") {
      if (rawPrice >= 10000000) return `₹${(rawPrice / 10000000).toFixed(2)} Cr`;
      if (rawPrice >= 100000) return `₹${(rawPrice / 100000).toFixed(2)} Lakh`;
      return `₹${rawPrice.toLocaleString("en-IN")}`;
    }
    return `₹${rawPrice}`;
  }

  function getPropertyImage(item) {
    const prop = getPropertyRelation(item);
    const images = prop?.Images || prop?.images || prop?.Media || prop?.media;
    if (Array.isArray(images) && images.length > 0) {
      const imgObj = images[0];
      const url = imgObj?.url || imgObj?.attributes?.url;
      if (url) {
        return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
      }
    }
    return null;
  }

  // =====================================================
  // METRICS & CARDS
  // =====================================================
  const closedBucket = useMemo(() => {
    return allEnquiries.filter(isClosedItem);
  }, [allEnquiries]);

  // Card 1: Total Closed
  const countTotalClosed = closedBucket.length;

  // Card 2: Not Interested
  const countNotInterested = useMemo(() => {
    return closedBucket.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "not interested";
    }).length;
  }, [closedBucket]);

  // Card 3: Converted
  const countConverted = useMemo(() => {
    return closedBucket.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "converted";
    }).length;
  }, [closedBucket]);

  // Card 4: Archived/Other Closed
  const countArchived = useMemo(() => {
    return closedBucket.filter((item) => {
      const s = getStatus(item).toLowerCase();
      return s === "closed" || s === "archived";
    }).length;
  }, [closedBucket]);

  // Dynamic property options
  const propertyOptions = useMemo(() => {
    const names = closedBucket.map(getPropertyName).filter(Boolean);
    return ["All Properties", ...Array.from(new Set(names))];
  }, [closedBucket]);

  const purposeOptions = useMemo(() => {
    const purposes = closedBucket.map(getPropertyPurpose).filter(Boolean);
    return ["All Purposes", ...Array.from(new Set(purposes))];
  }, [closedBucket]);

  // Filter and Sort logic
  const filteredAndSortedEnquiries = useMemo(() => {
    let result = [...closedBucket];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((item) => {
        const name = String(item?.Name || item?.name || "").toLowerCase();
        const phone = String(item?.Phone || item?.phone || "").toLowerCase();
        const email = String(item?.Email || item?.email || "").toLowerCase();
        const propTitle = getPropertyName(item).toLowerCase();
        const city = getPropertyCity(item).toLowerCase();

        return (
          name.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          propTitle.includes(q) ||
          city.includes(q)
        );
      });
    }

    // Property filter
    if (propertyFilter !== "All Properties") {
      result = result.filter((item) => getPropertyName(item) === propertyFilter);
    }

    // Purpose filter
    if (purposeFilter !== "All Purposes") {
      result = result.filter((item) => getPropertyPurpose(item) === purposeFilter);
    }

    // Status filter
    if (statusFilter !== "All Status") {
      result = result.filter((item) => getStatus(item).toLowerCase() === statusFilter.toLowerCase());
    }

    // Sort
    result.sort((a, b) => {
      const timeA = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
      const timeB = new Date(b?.updatedAt || b?.createdAt || 0).getTime();

      if (sortBy === "Latest Closed") {
        return timeB - timeA;
      }
      if (sortBy === "Oldest Closed") {
        return timeA - timeB;
      }
      if (sortBy === "Name") {
        return (a?.Name || "").localeCompare(b?.Name || "");
      }
      if (sortBy === "Property") {
        return getPropertyName(a).localeCompare(getPropertyName(b));
      }
      return 0;
    });

    return result;
  }, [closedBucket, search, propertyFilter, purposeFilter, statusFilter, sortBy]);

  // =====================================================
  // STRAPI ACTION HANDLERS
  // =====================================================
  async function handleReopenEnquiry(enquiry) {
    const docId = enquiry?.documentId || enquiry?.id;
    if (!docId) return;

    try {
      setActionLoadingId(docId);
      console.log("Reopening enquiry:", docId);

      await updateOwnerEnquiryStatus(docId, "Contacted");

      setAllEnquiries((prev) =>
        prev.map((item) => {
          const currentId = item?.documentId || item?.id;
          if (String(currentId) === String(docId)) {
            return {
              ...item,
              Status: "Contacted",
              status: "Contacted",
              Statuss: "Contacted",
            };
          }
          return item;
        })
      );

      setSuccessMessage(`Enquiry from ${enquiry?.Name || "Customer"} reopened and moved to Contacted Enquiries!`);
      if (selectedEnquiry && String(selectedEnquiry?.documentId || selectedEnquiry?.id) === String(docId)) {
        setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error("REOPEN ERROR:", err);
      alert(err?.message || "Failed to reopen enquiry.");
    } finally {
      setActionLoadingId(null);
    }
  }

  // =====================================================
  // RENDER LOADING STATE
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-1">
              <span>Enquiries</span>
              <span>›</span>
              <span>Closed Enquiries</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">
              Closed Enquiries
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mt-1">
              View enquiries that are no longer active.
            </p>

            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="inline-block w-10 h-10 border-4 border-[#064d3b] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#064d3b] font-semibold mt-4">
                Loading closed enquiries...
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Fetching real-time data from Strapi backend.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =====================================================
  // RENDER ERROR STATE
  // =====================================================
  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-1">
              <span>Enquiries</span>
              <span>›</span>
              <span>Closed Enquiries</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">
              Closed Enquiries
            </h1>

            <div className="mt-8 bg-white rounded-2xl border border-red-200 p-10 text-center shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl font-bold mb-3">
                ⚠️
              </div>

              <h2 className="text-xl font-bold text-red-700">
                Unable to load closed enquiries
              </h2>

              <p className="text-gray-600 mt-2 max-w-md mx-auto text-sm sm:text-base">
                Something went wrong while loading your closed enquiries. Please try again.
              </p>

              <p className="text-xs font-mono bg-red-50 text-red-800 p-2 rounded mt-3 max-w-lg mx-auto overflow-x-auto">
                {error}
              </p>

              <button
                type="button"
                onClick={loadEnquiries}
                className="mt-6 px-6 py-3 rounded-xl bg-[#064d3b] text-white font-semibold hover:bg-[#053d30] transition shadow"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =====================================================
  // MAIN CLOSED ENQUIRIES PAGE UI
  // =====================================================
  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* SUCCESS TOAST */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-700 text-white flex items-center justify-between shadow-lg animate-bounce">
              <div className="flex items-center gap-3">
                <span className="text-xl">✓</span>
                <span className="font-semibold text-sm sm:text-base">
                  {successMessage}
                </span>
              </div>
              <button
                onClick={() => setSuccessMessage("")}
                className="text-white hover:text-gray-200 font-bold px-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-1">
                <Link href="/owner/enquiries" className="hover:underline">
                  Enquiries
                </Link>
                <span>›</span>
                <span>Closed Enquiries</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">
                Closed Enquiries
              </h1>

              <p className="text-sm sm:text-base text-gray-600 mt-1">
                View enquiries that are no longer active.
              </p>
            </div>

            <Link
              href="/owner/enquiries/new"
              className="px-5 py-2.5 rounded-xl border border-[#064d3b] text-[#064d3b] font-bold text-xs sm:text-sm hover:bg-[#e6f2ed] transition self-start sm:self-auto"
            >
              Back to Enquiries
            </Link>
          </div>

          {/* 1. SUMMARY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8">

            {/* Card 1: Total Closed */}
            <div className="bg-white rounded-2xl border-2 border-[#064d3b] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center text-lg font-bold">
                  📂
                </div>
                <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Closed
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Closed
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#064d3b] mt-0.5">
                  {countTotalClosed}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  All inactive enquiries
                </p>
              </div>
            </div>

            {/* Card 2: Not Interested */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-red-300 transition flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg font-bold">
                  🚫
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Not Interested
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countNotInterested}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Customer not interested
                </p>
              </div>
            </div>

            {/* Card 3: Converted */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-emerald-300 transition flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">
                  🎉
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Converted
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countConverted}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Successfully converted
                </p>
              </div>
            </div>

            {/* Card 4: Archived / Closed */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-blue-300 transition flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                  📦
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Archived
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countArchived}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Closed / Archived
                </p>
              </div>
            </div>

          </div>

          {/* 2. SEARCH & FILTER BAR */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 mb-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

              {/* Search */}
              <div className="relative lg:col-span-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, phone, property..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#064d3b] focus:bg-white transition"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                  🔍
                </span>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Property filter */}
              <div>
                <select
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition cursor-pointer"
                >
                  {propertyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition cursor-pointer"
                >
                  <option value="All Status">All Status</option>
                  <option value="Closed">Closed</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Converted">Converted</option>
                </select>
              </div>

              {/* Sort dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition cursor-pointer font-medium"
                >
                  <option value="Latest Closed">Latest Closed</option>
                  <option value="Oldest Closed">Oldest Closed</option>
                  <option value="Name">Name</option>
                  <option value="Property">Property</option>
                </select>
              </div>

            </div>
          </div>

          {/* 3. RESULTS COUNTER */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#064d3b]">
                Closed Enquiries List
              </h2>
              <span className="text-xs font-extrabold bg-[#064d3b] text-white px-2.5 py-0.5 rounded-full">
                {filteredAndSortedEnquiries.length}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-500">
              Total <span className="font-semibold text-gray-800">{filteredAndSortedEnquiries.length}</span> enquiries
            </p>
          </div>

          {/* 4. CLOSED ENQUIRY LIST (CARDS) */}
          <div className="space-y-4">
            {filteredAndSortedEnquiries.length === 0 ? (
              /* EMPTY STATE */
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#f2ead7] flex items-center justify-center text-3xl mb-4">
                  📂
                </div>

                <h3 className="text-xl font-bold text-[#064d3b]">
                  No Closed Enquiries
                </h3>

                <p className="text-gray-500 text-sm sm:text-base mt-1 max-w-md mx-auto">
                  You don't have any closed or inactive enquiries yet.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/owner/enquiries/contacted"
                    className="px-5 py-2.5 rounded-xl bg-[#064d3b] text-white text-sm font-semibold hover:bg-[#053d30] transition shadow"
                  >
                    View Contacted Enquiries
                  </Link>

                  {(search || propertyFilter !== "All Properties" || statusFilter !== "All Status") && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setPropertyFilter("All Properties");
                        setStatusFilter("All Status");
                      }}
                      className="px-5 py-2.5 rounded-xl border border-[#c99838] text-[#064d3b] text-sm font-semibold hover:bg-[#faf4e5] transition"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* ENQUIRY CARDS */
              filteredAndSortedEnquiries.map((enquiry) => {
                const docId = enquiry?.documentId || enquiry?.id;
                const name = enquiry?.Name || enquiry?.name || "Unknown Customer";
                const phone = enquiry?.Phone || enquiry?.phone || "Not provided";
                const email = enquiry?.Email || enquiry?.email || "Not provided";
                const status = getStatus(enquiry);

                const propTitle = getPropertyName(enquiry);
                const propCity = getPropertyCity(enquiry);
                const propArea = getPropertyArea(enquiry);
                const propPrice = getPropertyPrice(enquiry);

                const closedDate = enquiry?.updatedAt || enquiry?.createdAt;
                const formattedClosedDate = closedDate
                  ? new Date(closedDate).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Date unavailable";

                const initials = name
                  .split(" ")
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "U";

                // Dynamic Status Badge Color
                let statusBadgeStyle = "bg-gray-100 text-gray-800 border-gray-200";
                if (status.toLowerCase() === "converted") {
                  statusBadgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-200";
                } else if (status.toLowerCase() === "not interested") {
                  statusBadgeStyle = "bg-red-100 text-red-800 border-red-200";
                }

                const isActionLoading = actionLoadingId === docId;

                return (
                  <div
                    key={docId}
                    className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[#c99838]/40 transition relative"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.9fr_auto] gap-5 items-center">

                      {/* CUSTOMER INFO */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center font-black text-lg flex-shrink-0 border border-gray-200">
                          {initials}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-base sm:text-lg text-[#064d3b]">
                              {name}
                            </h3>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusBadgeStyle}`}>
                              {status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <span>☎</span> {phone}
                          </p>

                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                            <span>✉</span> {email}
                          </p>
                        </div>
                      </div>

                      {/* PROPERTY INFO */}
                      <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Enquired Property
                        </p>

                        <h4 className="font-bold text-sm sm:text-base text-[#064d3b] mt-0.5 line-clamp-1">
                          {propTitle}
                        </h4>

                        <p className="text-xs text-gray-500 mt-1">
                          📍 {[propArea, propCity].filter(Boolean).join(", ") || "Location specified"}
                        </p>

                        {propPrice && (
                          <p className="text-xs sm:text-sm font-bold text-[#c99838] mt-1">
                            {propPrice}
                          </p>
                        )}
                      </div>

                      {/* TIMELINE */}
                      <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Closed On
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 mt-0.5">
                          {formattedClosedDate}
                        </p>

                        {enquiry?.ClosedReason && (
                          <p className="text-xs text-red-600 mt-1 italic">
                            Reason: {enquiry.ClosedReason}
                          </p>
                        )}
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex sm:flex-row lg:flex-col gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 lg:min-w-[140px]">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="flex-1 lg:w-full px-4 py-2.5 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold text-xs sm:text-sm hover:bg-[#c99838] transition shadow-sm"
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleReopenEnquiry(enquiry)}
                          className="flex-1 lg:w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition disabled:opacity-50"
                        >
                          {isActionLoading ? "Updating..." : "Reopen Enquiry"}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>

      {/* =====================================================
          CLOSED ENQUIRY DETAILS MODAL / DRAWER
      ===================================================== */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-base transition"
            >
              ✕
            </button>

            {/* Header Banner */}
            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center font-black text-2xl border border-gray-200">
                {(selectedEnquiry?.Name || "U")[0]}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#064d3b]">
                  Closed Enquiry Details
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedEnquiry?.Name} (☎ {selectedEnquiry?.Phone} | ✉ {selectedEnquiry?.Email})
                </p>
              </div>

              <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-800 uppercase tracking-wider border">
                {getStatus(selectedEnquiry)}
              </span>
            </div>

            {/* Grid Layout: Left Details, Right Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-5 text-sm">

                {/* Customer Details Box */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Customer Details
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-400 block text-xs">Customer Name</span>
                      <span className="font-bold text-gray-800">
                        {selectedEnquiry?.Name || selectedEnquiry?.name || "N/A"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-xs">Preferred Location</span>
                      <span className="font-bold text-gray-800">
                        {getPropertyCity(selectedEnquiry) || "Pune"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-xs">Purpose</span>
                      <span className="font-bold text-gray-800">
                        {getPropertyPurpose(selectedEnquiry)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-xs">Property Type</span>
                      <span className="font-bold text-gray-800">
                        {getPropertyType(selectedEnquiry)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Details Box */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Target Property
                  </h4>

                  <div className="flex gap-4 items-start">
                    {getPropertyImage(selectedEnquiry) && (
                      <img
                        src={getPropertyImage(selectedEnquiry)}
                        alt="Property"
                        className="w-24 h-24 rounded-2xl object-cover border border-gray-200 shrink-0"
                      />
                    )}

                    <div className="space-y-1">
                      <h5 className="font-bold text-base text-[#064d3b]">
                        {getPropertyName(selectedEnquiry)}
                      </h5>

                      <p className="text-xs text-gray-600">
                        📍 {[getPropertyArea(selectedEnquiry), getPropertyCity(selectedEnquiry)].filter(Boolean).join(", ")}
                      </p>

                      {getPropertyPrice(selectedEnquiry) && (
                        <p className="text-sm font-extrabold text-[#c99838] pt-1">
                          {getPropertyPrice(selectedEnquiry)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enquiry Message */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Enquiry Message
                  </h4>
                  <p className="text-gray-700 bg-white p-3 rounded-xl border border-gray-100 italic">
                    "{selectedEnquiry?.Message || selectedEnquiry?.message || "No message provided."}"
                  </p>
                </div>

                {/* Contact History */}
                <div className="bg-[#faf8f5] p-5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Contact History
                  </h4>
                  <p className="text-xs text-gray-500 italic">
                    {selectedEnquiry?.ClosedReason ? `Closed Reason: ${selectedEnquiry.ClosedReason}` : "Enquiry closed."}
                  </p>
                </div>

              </div>

              {/* Right Column: Actions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Actions
                </h4>

                <button
                  type="button"
                  onClick={() => handleReopenEnquiry(selectedEnquiry)}
                  className="w-full px-4 py-3 rounded-xl bg-[#064d3b] text-white font-bold text-sm hover:bg-[#053d30] transition block shadow-sm"
                >
                  🔄 Reopen Enquiry
                </button>

                {selectedEnquiry?.Phone && (
                  <a
                    href={`tel:${selectedEnquiry.Phone}`}
                    className="w-full text-center px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 font-bold text-sm hover:bg-gray-50 transition block shadow-xs"
                  >
                    📞 Call Customer
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
