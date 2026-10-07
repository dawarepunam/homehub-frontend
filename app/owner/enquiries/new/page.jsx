"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../Footer";
import {
  getOwnerEnquiries,
  markOwnerEnquiryAsContacted,
} from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function NewEnquiriesPage() {
  const router = useRouter();
  const [allOwnerEnquiries, setAllOwnerEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Filters & Sorting state
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [sortBy, setSortBy] = useState("Newest First");

  // Modal / Detail state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [confirmContactedEnquiry, setConfirmContactedEnquiry] = useState(null);

  // =====================================================
  // FETCH ENQUIRIES FROM STRAPI
  // =====================================================
  async function loadEnquiries() {
    try {
      setLoading(true);
      setError("");

      console.log("=================================");
      console.log("NEW ENQUIRIES PAGE");
      console.log("Loading owner enquiries from Strapi...");
      console.log("=================================");

      const result = await getOwnerEnquiries();

      console.log("OWNER ENQUIRIES RESULT:", result);
      setAllOwnerEnquiries(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("NEW ENQUIRIES PAGE ERROR:", err);
      setError(err?.message || "Unable to load enquiries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  // Clear toast after 4s
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // =====================================================
  // STATUS HELPERS & CALCULATED COUNTS
  // =====================================================
  function getStatus(item) {
    return String(
      item?.Status || item?.status || item?.Statuss || "Pending"
    ).trim();
  }

  function isNewStatus(item) {
    const status = getStatus(item).toLowerCase();
    return status === "new" || status === "pending";
  }

  function isContactedStatus(item) {
    return getStatus(item).toLowerCase() === "contacted";
  }

  function isSiteVisitStatus(item) {
    const status = getStatus(item).toLowerCase();
    return (
      status === "site visit" ||
      status === "site_visit" ||
      status === "site-visit"
    );
  }

  function isClosedStatus(item) {
    return getStatus(item).toLowerCase() === "closed";
  }

  // Real-time summary counts dynamically derived from all owner enquiries
  const countNew = useMemo(
    () => allOwnerEnquiries.filter(isNewStatus).length,
    [allOwnerEnquiries]
  );
  const countContacted = useMemo(
    () => allOwnerEnquiries.filter(isContactedStatus).length,
    [allOwnerEnquiries]
  );
  const countSiteVisit = useMemo(
    () => allOwnerEnquiries.filter(isSiteVisitStatus).length,
    [allOwnerEnquiries]
  );
  const countClosed = useMemo(
    () => allOwnerEnquiries.filter(isClosedStatus).length,
    [allOwnerEnquiries]
  );

  // Filter out only New / Pending enquiries for this page list
  const newEnquiriesList = useMemo(
    () => allOwnerEnquiries.filter(isNewStatus),
    [allOwnerEnquiries]
  );

  // =====================================================
  // DYNAMIC FILTER DROPDOWNS
  // =====================================================
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

  const propertyOptions = useMemo(() => {
    const titles = newEnquiriesList.map(getPropertyName).filter(Boolean);
    return ["All Properties", ...Array.from(new Set(titles))];
  }, [newEnquiriesList]);

  const cityOptions = useMemo(() => {
    const cities = newEnquiriesList.map(getPropertyCity).filter(Boolean);
    return ["All Cities", ...Array.from(new Set(cities))];
  }, [newEnquiriesList]);

  // =====================================================
  // FILTERING AND SORTING LOGIC
  // =====================================================
  const filteredAndSortedEnquiries = useMemo(() => {
    let result = [...newEnquiriesList];

    // Search query matching against name, phone, email, property title, city
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

    // Property dropdown filter
    if (propertyFilter !== "All Properties") {
      result = result.filter(
        (item) => getPropertyName(item) === propertyFilter
      );
    }

    // City dropdown filter
    if (cityFilter !== "All Cities") {
      result = result.filter(
        (item) => getPropertyCity(item) === cityFilter
      );
    }

    // Sorting
    result.sort((a, b) => {
      const timeA = new Date(a?.createdAt || a?.created_at || 0).getTime();
      const timeB = new Date(b?.createdAt || b?.created_at || 0).getTime();
      return sortBy === "Newest First" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [newEnquiriesList, search, propertyFilter, cityFilter, sortBy]);

  // =====================================================
  // MARK AS CONTACTED HANDLER
  // =====================================================
  async function handleMarkAsContacted(enquiry) {
    const docId = enquiry?.documentId || enquiry?.id;
    if (!docId) return;

    try {
      setActionLoadingId(docId);
      console.log("Marking enquiry as contacted:", docId);

      await markOwnerEnquiryAsContacted(docId);

      // Update local state directly for instant snappy UI update
      setAllOwnerEnquiries((prev) =>
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

      setSuccessMessage(
        `Enquiry from ${enquiry?.Name || "Customer"} marked as Contacted!`
      );
      setConfirmContactedEnquiry(null);
      if (selectedEnquiry && String(selectedEnquiry?.documentId || selectedEnquiry?.id) === String(docId)) {
        setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error("FAILED TO MARK AS CONTACTED:", err);
      setError(err?.message || "Failed to update enquiry status. Please try again.");
      // Auto-clear after 5s
      setTimeout(() => setError(""), 5000);
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
            <p className="text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider">
              Owner Portal
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b] mt-1">
              New Enquiries
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Respond to enquiries received for your properties.
            </p>

            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="inline-block w-10 h-10 border-4 border-[#064d3b] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#064d3b] font-semibold mt-4">
                Loading enquiries...
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Fetching real-time property enquiries from Strapi.
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
            <p className="text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider">
              Owner Portal
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b] mt-1">
              New Enquiries
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Respond to enquiries received for your properties.
            </p>

            <div className="mt-8 bg-white rounded-2xl border border-red-200 p-10 text-center shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl font-bold mb-3">
                ⚠️
              </div>

              <h2 className="text-xl font-bold text-red-700">
                Unable to load enquiries
              </h2>

              <p className="text-gray-600 mt-2 max-w-md mx-auto text-sm sm:text-base">
                Something went wrong while loading your enquiries. Please check your connection or Strapi server status.
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
  // MAIN NEW ENQUIRIES PAGE UI
  // =====================================================
  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* SUCCESS TOAST NOTIFICATION */}
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
          <div className="mb-8">
            <button onClick={() => router.push("/owner")} className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#064d3b] transition">
              <span className="text-xl leading-none">←</span> Back to Dashboard
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-1">
              <Link href="/owner" className="hover:underline">Dashboard</Link>
              <span>›</span>
              <Link href="/owner/enquiries" className="hover:underline">Enquiries</Link>
              <span>›</span>
              <span>New</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b] mt-1">
              New Enquiries
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Respond to enquiries received for your properties.
            </p>
          </div>

          {/* 1. SUMMARY CARDS (DYNAMIC API COUNTS) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8">

            {/* Card 1: New Enquiries — same-page, resets all filters to show all new enquiries */}
            <button
              type="button"
              onClick={() => {
                // Same page — just reset all filters to show the full new enquiries list
                setSearch("");
                setPropertyFilter("All Properties");
                setCityFilter("All Cities");
              }}
              className="bg-white rounded-2xl border-2 border-[#064d3b] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between text-left w-full cursor-pointer hover:shadow-md hover:bg-[#f6fbf8] transition focus:outline-none focus:ring-2 focus:ring-[#064d3b]/50"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#e6f2ed] text-[#064d3b] flex items-center justify-center text-lg font-bold">
                  💬
                </div>
                <span className="text-xs font-bold text-[#064d3b] bg-[#e6f2ed] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Active
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  New Enquiries
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#064d3b] mt-0.5">
                  {countNew}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Unresponded enquiries
                </p>
              </div>
            </button>

            {/* Card 2: Contacted — navigates to contacted section */}
            <Link
              href="/owner/enquiries/contacted"
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-[#c99838] transition flex flex-col justify-between cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#c99838]/50 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#fef6e7] text-[#c99838] flex items-center justify-center text-lg font-bold">
                  📞
                </div>
                <span className="text-xs font-bold text-[#c99838]">
                  View →
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Contacted
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countContacted}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Enquiries already contacted
                </p>
              </div>
            </Link>

            {/* Card 3: Site Visits — navigates to site-visits section */}
            <Link
              href="/owner/enquiries/site-visits"
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-purple-300 transition flex flex-col justify-between cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300/50 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg font-bold">
                  📅
                </div>
                <span className="text-xs font-bold text-purple-600">
                  View →
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Site Visits
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countSiteVisit}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Visits scheduled
                </p>
              </div>
            </Link>

            {/* Card 4: Closed — navigates to closed section */}
            <Link
              href="/owner/enquiries/closed"
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-blue-300 transition flex flex-col justify-between cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300/50 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                  ✅
                </div>
                <span className="text-xs font-bold text-blue-600">
                  View →
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Closed
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">
                  {countClosed}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Closed enquiries
                </p>
              </div>
            </Link>

          </div>

          {/* 2. SEARCH & FILTER AREA */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 mb-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

              {/* Search input */}
              <div className="relative">
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
                  {propertyOptions.map((propName) => (
                    <option key={propName} value={propName}>
                      {propName}
                    </option>
                  ))}
                </select>
              </div>

              {/* City filter */}
              <div>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition cursor-pointer"
                >
                  {cityOptions.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition cursor-pointer font-medium"
                >
                  <option value="Newest First">Newest First</option>
                  <option value="Oldest First">Oldest First</option>
                </select>
              </div>

            </div>
          </div>

          {/* 3. RESULTS HEADER */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#064d3b]">
                New Enquiries
              </h2>
              <span className="text-xs font-extrabold bg-[#064d3b] text-white px-2.5 py-0.5 rounded-full">
                {filteredAndSortedEnquiries.length}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-500">
              Total <span className="font-semibold text-gray-800">{filteredAndSortedEnquiries.length}</span> enquiries
            </p>
          </div>

          {/* 4. ENQUIRIES LIST / CARDS */}
          <div className="space-y-4">
            {filteredAndSortedEnquiries.length === 0 ? (
              /* EMPTY STATE */
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#f2ead7] flex items-center justify-center text-3xl mb-4">
                  💬
                </div>

                <h3 className="text-xl font-bold text-[#064d3b]">
                  No New Enquiries
                </h3>

                <p className="text-gray-500 text-sm sm:text-base mt-1 max-w-md mx-auto">
                  You don't have any new property enquiries right now.
                </p>

                {(search || propertyFilter !== "All Properties" || cityFilter !== "All Cities") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setPropertyFilter("All Properties");
                      setCityFilter("All Cities");
                    }}
                    className="mt-5 px-5 py-2.5 rounded-xl border border-[#c99838] text-[#064d3b] text-sm font-semibold hover:bg-[#faf4e5] transition"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              /* ENQUIRY CARDS */
              filteredAndSortedEnquiries.map((enquiry) => {
                const docId = enquiry?.documentId || enquiry?.id;
                const name = enquiry?.Name || enquiry?.name || "Unknown User";
                const phone = enquiry?.Phone || enquiry?.phone || "Not provided";
                const email = enquiry?.Email || enquiry?.email || "Not provided";
                const message = enquiry?.Message || enquiry?.message || "No message provided.";
                const status = getStatus(enquiry);

                const propTitle = getPropertyName(enquiry);
                const propCity = getPropertyCity(enquiry);
                const propPrice = getPropertyPrice(enquiry);

                const createdAt = enquiry?.createdAt || enquiry?.created_at;
                const formattedDate = createdAt
                  ? new Date(createdAt).toLocaleString("en-IN", {
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

                const isActionLoading = actionLoadingId === docId;

                return (
                  <div
                    key={docId}
                    className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[#c99838]/40 transition"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.9fr_auto] gap-5 items-center">

                      {/* ENQUIRER INFO */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#dceee7] text-[#064d3b] flex items-center justify-center font-black text-lg flex-shrink-0">
                          {initials}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-base sm:text-lg text-[#064d3b]">
                              {name}
                            </h3>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
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
                          Enquired for
                        </p>

                        <h4 className="font-bold text-sm sm:text-base text-[#064d3b] mt-0.5 line-clamp-1">
                          {propTitle}
                        </h4>

                        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 mt-1 flex-wrap">
                          {propCity && (
                            <span className="flex items-center gap-1">
                              📍 {propCity}
                            </span>
                          )}
                          {propPrice && (
                            <span className="font-bold text-[#c99838]">
                              {propPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ENQUIRING TIMELINE & STATUS */}
                      <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Enquired On
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 mt-0.5">
                          {formattedDate}
                        </p>

                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-2">
                          Status
                        </p>
                        <span className="inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                          {status}
                        </span>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex sm:flex-row lg:flex-col gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 lg:min-w-[160px]">
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
                          onClick={() => setConfirmContactedEnquiry(enquiry)}
                          className="flex-1 lg:w-full px-4 py-2.5 rounded-xl border border-[#d6a744] text-[#064d3b] font-semibold text-xs sm:text-sm hover:bg-[#faf4e5] transition flex items-center justify-center gap-1 disabled:opacity-50"
                        >
                          {isActionLoading ? (
                            <span className="inline-block w-4 h-4 border-2 border-[#064d3b] border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            "Mark as Contacted"
                          )}
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
          ENQUIRY DETAILS MODAL
      ===================================================== */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in duration-200 my-8">

            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-base transition"
            >
              ✕
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#dceee7] text-[#064d3b] flex items-center justify-center font-black text-xl">
                {(selectedEnquiry?.Name || "U")[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#064d3b]">
                  Enquiry Details
                </h3>
                <p className="text-xs text-gray-500">
                  Document ID: {selectedEnquiry?.documentId || selectedEnquiry?.id}
                </p>
              </div>
              <span className="ml-auto mr-8 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {getStatus(selectedEnquiry)}
              </span>
            </div>

            <div className="space-y-6 text-sm">

              {/* ENQUIRER SECTION */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Enquirer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-xs text-gray-500">Name</span>
                    <p className="font-bold text-gray-800">
                      {selectedEnquiry?.Name || selectedEnquiry?.name || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Phone</span>
                    <p className="font-bold text-gray-800">
                      <a href={`tel:${selectedEnquiry?.Phone}`} className="hover:underline text-[#064d3b]">
                        ☎ {selectedEnquiry?.Phone || "Not provided"}
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Email</span>
                    <p className="font-bold text-gray-800 truncate">
                      <a href={`mailto:${selectedEnquiry?.Email}`} className="hover:underline text-[#064d3b]">
                        ✉ {selectedEnquiry?.Email || "Not provided"}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* PROPERTY SECTION */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Property Details
                </h4>

                <div className="flex gap-4 items-start">
                  {getPropertyImage(selectedEnquiry) && (
                    <img
                      src={getPropertyImage(selectedEnquiry)}
                      alt="Property"
                      className="w-20 h-20 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 space-y-1">
                    <h5 className="font-bold text-base text-[#064d3b]">
                      {getPropertyName(selectedEnquiry)}
                    </h5>

                    <p className="text-xs text-gray-600">
                      📍 {getPropertyCity(selectedEnquiry) || "City not specified"}
                    </p>

                    {getPropertyPrice(selectedEnquiry) && (
                      <p className="text-sm font-extrabold text-[#c99838]">
                        {getPropertyPrice(selectedEnquiry)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* MESSAGE / REQUEST SECTION */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Enquiry Message
                </h4>
                <p className="text-gray-700 bg-white p-3 rounded-xl border border-gray-100 italic">
                  &ldquo;{selectedEnquiry?.Message || selectedEnquiry?.message || "No message provided."}&rdquo;
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Enquired On:{" "}
                  {selectedEnquiry?.createdAt
                    ? new Date(selectedEnquiry.createdAt).toLocaleString("en-IN")
                    : "N/A"}
                </p>
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-2">
                {selectedEnquiry?.Phone && (
                  <a
                    href={`tel:${selectedEnquiry.Phone}`}
                    className="flex-1 text-center px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-100 transition"
                  >
                    📞 Call Enquirer
                  </a>
                )}

                {selectedEnquiry?.Email && (
                  <a
                    href={`mailto:${selectedEnquiry.Email}`}
                    className="flex-1 text-center px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold hover:bg-blue-100 transition"
                  >
                    ✉ Email Enquirer
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleMarkAsContacted(selectedEnquiry);
                  }}
                  disabled={actionLoadingId === (selectedEnquiry?.documentId || selectedEnquiry?.id)}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#064d3b] text-white font-bold hover:bg-[#053d30] transition disabled:opacity-50"
                >
                  Mark as Contacted
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CONFIRM MARK AS CONTACTED MODAL
      ===================================================== */}
      {confirmContactedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>

            <h3 className="text-xl font-bold text-[#064d3b]">
              Mark as Contacted?
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              This enquiry for <span className="font-semibold text-gray-800">{getPropertyName(confirmContactedEnquiry)}</span> from <span className="font-semibold text-gray-800">{confirmContactedEnquiry?.Name || "Customer"}</span> will be moved from New Enquiries to Contacted Enquiries.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmContactedEnquiry(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleMarkAsContacted(confirmContactedEnquiry)}
                disabled={actionLoadingId === (confirmContactedEnquiry?.documentId || confirmContactedEnquiry?.id)}
                className="flex-1 px-4 py-3 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold hover:bg-[#c99838] transition disabled:opacity-50"
              >
                {actionLoadingId === (confirmContactedEnquiry?.documentId || confirmContactedEnquiry?.id) ? (
                  "Updating..."
                ) : (
                  "Yes, Mark Contacted"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}