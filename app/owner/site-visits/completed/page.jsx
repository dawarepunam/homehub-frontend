"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "../../Footer";
import { getOwnerEnquiries } from "@/services/enquiry";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export default function CompletedSiteVisitsPage() {
  const router = useRouter();

  // Primary state
  const [allEnquiries, setAllEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search, Filters & Sort state
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [sortBy, setSortBy] = useState("Latest First");

  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null); // String YYYY-MM-DD

  // =====================================================
  // FETCH VISITS / ENQUIRIES FROM STRAPI
  // =====================================================
  async function loadVisits() {
    try {
      setLoading(true);
      setError("");
      const data = await getOwnerEnquiries();
      setAllEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Unable to load completed site visits.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisits();
  }, []);

  // =====================================================
  // HELPER FUNCTIONS FOR STRAPI DATA PARSING
  // =====================================================
  function getStatus(item) {
    return String(item?.Status || item?.status || item?.Statuss || "Pending").trim();
  }

  function isCompletedVisit(item) {
    return getStatus(item).toLowerCase() === "completed";
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
      if (url) return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
    }
    return null; // Handle fallback in UI
  }

  function getVisitDateStr(item) {
    return item?.VisitDate || item?.visitDate || item?.FollowUpDate || item?.updatedAt || item?.createdAt;
  }

  function formatVisitDateTime(dateStr) {
    if (!dateStr) return { date: "Date TBA", time: "--:--" };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: String(dateStr), time: "--:--" };
    const dateFormatted = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
    const timeFormatted = d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: dateFormatted, time: timeFormatted };
  }

  // =====================================================
  // CALCULATED METRICS & CARDS
  // =====================================================
  const completedVisits = useMemo(() => {
    return allEnquiries.filter(isCompletedVisit);
  }, [allEnquiries]);

  // Card 1: Total Completed
  const totalCompleted = completedVisits.length;

  // Compute This Month & This Week
  let thisMonthCount = 0;
  let thisWeekCount = 0;
  const uniqueProperties = new Set();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start

  completedVisits.forEach(v => {
    // Unique Properties
    const propName = getPropertyName(v);
    if (propName && propName !== "Untitled Property") uniqueProperties.add(propName);

    // Dates
    const dStr = getVisitDateStr(v);
    if (dStr) {
      const d = new Date(dStr);
      if (!isNaN(d.getTime())) {
        if (d >= startOfMonth && d <= now) {
          thisMonthCount++;
        }
        if (d >= startOfWeek && d <= now) {
          thisWeekCount++;
        }
      }
    }
  });

  // Unique properties list for dropdown filter
  const propertyOptions = useMemo(() => {
    return ["All Properties", ...Array.from(uniqueProperties)].sort();
  }, [uniqueProperties]);

  // =====================================================
  // FILTERING AND SORTING
  // =====================================================
  const filteredAndSortedVisits = useMemo(() => {
    let result = [...completedVisits];

    // Calendar Specific Date filter (Top priority)
    if (selectedCalendarDate) {
      result = result.filter(item => {
        const dStr = getVisitDateStr(item);
        if (!dStr) return false;
        const d = new Date(dStr);
        if (isNaN(d.getTime())) return false;
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        return key === selectedCalendarDate;
      });
    }

    // Property filter
    if (propertyFilter !== "All Properties") {
      result = result.filter((item) => {
        return getPropertyName(item) === propertyFilter;
      });
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) => {
        const cName = (item?.Name || item?.name || "").toLowerCase();
        const cPhone = (item?.Phone || item?.phone || "").toLowerCase();
        const cEmail = (item?.Email || item?.email || "").toLowerCase();
        const pName = getPropertyName(item).toLowerCase();
        return (
          cName.includes(q) ||
          cPhone.includes(q) ||
          cEmail.includes(q) ||
          pName.includes(q)
        );
      });
    }

    // Date Range Dropdown Filter
    if (dateFilter !== "All Dates") {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      result = result.filter((item) => {
        const dStr = getVisitDateStr(item);
        if (!dStr) return false;
        const d = new Date(dStr);
        if (isNaN(d.getTime())) return false;

        if (dateFilter === "Today") {
          return d.toDateString() === todayDate.toDateString();
        } else if (dateFilter === "This Week") {
          return d >= startOfWeek;
        } else if (dateFilter === "This Month") {
          return d >= startOfMonth;
        }
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      const d1 = new Date(getVisitDateStr(a) || 0).getTime();
      const d2 = new Date(getVisitDateStr(b) || 0).getTime();
      return sortBy === "Latest First" ? d2 - d1 : d1 - d2;
    });

    return result;
  }, [
    completedVisits,
    propertyFilter,
    search,
    sortBy,
    dateFilter,
    selectedCalendarDate
  ]);


  // =====================================================
  // RENDER HELPERS
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-10">
          <div className="inline-block w-12 h-12 border-4 border-[#064d3b] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-semibold animate-pulse">
            Loading completed visits...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
        <Header />
        <main className="flex-1 p-10 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl font-bold mb-3">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-red-700">Unable to load completed visits</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={loadVisits}
            className="mt-6 px-6 py-3 rounded-xl bg-[#064d3b] text-white font-semibold hover:bg-[#053d30] transition"
          >
            Try Again
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] flex flex-col font-sans text-gray-800">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <button onClick={() => router.push("/owner/site-visits")} className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#064d3b] transition">
                <span className="text-xl leading-none">←</span> Back to Site Visits
              </button>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#c99838] uppercase tracking-wider mb-1">
                <Link href="/owner" className="hover:underline">Home</Link>
                <span>›</span>
                <Link href="/owner/site-visits" className="hover:underline">Site Visits</Link>
                <span>›</span>
                <span>Completed</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064d3b]">
                Completed Site Visits
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                View and manage your completed property visits.
              </p>
            </div>
            {/* The schedule button is not strictly necessary on completed, but requested by prompt matching header */}
            <Link
              href="/owner/enquiries/new"
              className="px-5 py-3 rounded-xl bg-[#d6a744] text-[#064d3b] font-bold text-sm hover:bg-[#c99838] transition shadow-md flex items-center gap-2 self-start sm:self-auto"
            >
              <span>+</span> Schedule Site Visit
            </Link>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8">
            
            <div className="bg-white rounded-2xl border-2 border-[#064d3b] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#e6f2ed] text-[#064d3b] flex items-center justify-center text-lg font-bold">
                  ✅
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Completed Visits</p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#064d3b] mt-0.5">{totalCompleted}</h3>
                <p className="text-xs text-gray-400 mt-1">Total completed visits</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-[#c99838] transition flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#fef6e7] text-[#c99838] flex items-center justify-center text-lg font-bold">
                  📅
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">This Month</p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">{thisMonthCount}</h3>
                <p className="text-xs text-gray-400 mt-1">Completed this month</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-blue-300 transition flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                  🗓️
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">This Week</p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">{thisWeekCount}</h3>
                <p className="text-xs text-gray-400 mt-1">Completed this week</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-purple-300 transition flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg font-bold">
                  🏠
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Properties Visited</p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-0.5">{uniqueProperties.size}</h3>
                <p className="text-xs text-gray-400 mt-1">Unique properties</p>
              </div>
            </div>

          </div>

          {/* GRID LAYOUT FOR LIST & CALENDAR */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
            
            {/* LEFT COLUMN */}
            <div>
              {/* FILTERS */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 mb-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="relative lg:col-span-2">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search customer, property or phone..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white transition"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                  </div>

                  <select
                    value={propertyFilter}
                    onChange={(e) => setPropertyFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white cursor-pointer"
                  >
                    {propertyOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  <div className="flex gap-2">
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-gray-300 bg-[#faf8f5] text-sm text-gray-800 outline-none focus:border-[#064d3b] focus:bg-white cursor-pointer"
                    >
                      <option value="All Dates">All Dates</option>
                      <option value="Today">Today</option>
                      <option value="This Week">This Week</option>
                      <option value="This Month">This Month</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-12 bg-transparent text-gray-400 focus:text-gray-800 outline-none cursor-pointer text-center"
                      title="Sort"
                    >
                      <option value="Latest First">↓ Latest</option>
                      <option value="Oldest First">↑ Oldest</option>
                    </select>
                  </div>
                </div>
                {selectedCalendarDate && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs bg-[#c99838]/20 text-[#c99838] font-bold px-3 py-1 rounded-full">
                      Filtered by Date: {selectedCalendarDate}
                    </span>
                    <button 
                      onClick={() => setSelectedCalendarDate(null)}
                      className="text-xs text-gray-500 hover:text-gray-800 underline"
                    >
                      Clear date filter
                    </button>
                  </div>
                )}
              </div>

              {/* LIST */}
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-bold text-[#064d3b]">Completed Visits ({filteredAndSortedVisits.length})</h2>
              </div>

              <div className="space-y-4">
                {filteredAndSortedVisits.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-3xl mb-4">
                      ✅
                    </div>
                    <h3 className="text-xl font-bold text-[#064d3b]">No Completed Visits</h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
                      {completedVisits.length > 0 
                        ? "No completed visits match your current filters."
                        : "Completed property visits will appear here once a visit is marked as completed."}
                    </p>
                    <div className="mt-6">
                      <Link href="/owner/site-visits/upcoming" className="px-5 py-2.5 rounded-xl bg-[#064d3b] text-white text-sm font-semibold hover:bg-[#053d30] transition shadow">
                        View Upcoming Visits
                      </Link>
                    </div>
                  </div>
                ) : (
                  filteredAndSortedVisits.map((visit) => {
                    const docId = visit?.documentId || visit?.id;
                    const name = visit?.Name || visit?.name || "Customer";
                    const phone = visit?.Phone || visit?.phone || "Not provided";
                    const email = visit?.Email || visit?.email;
                    
                    const propTitle = getPropertyName(visit);
                    const propCity = getPropertyCity(visit);
                    const propArea = getPropertyArea(visit);
                    const propPrice = getPropertyPrice(visit);
                    const propImage = getPropertyImage(visit);

                    const visitDateStr = getVisitDateStr(visit);
                    const { date: formattedDate, time: formattedTime } = formatVisitDateTime(visitDateStr);

                    const initials = name.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "C";

                    return (
                      <div key={docId} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition flex flex-col md:flex-row gap-5">
                        
                        {/* PROPERTY IMAGE (if exists, or fallback avatar) */}
                        <div className="flex-shrink-0 flex gap-4 w-full md:w-auto">
                           {propImage ? (
                             <img src={propImage} alt="Property" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-100" />
                           ) : (
                             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#fef6e7] text-[#c99838] flex items-center justify-center font-black text-2xl border border-[#f5e4c3]">
                               {initials}
                             </div>
                           )}
                           
                           {/* MOBILE INFO (hidden on desktop) */}
                           <div className="md:hidden flex-1">
                              <h3 className="font-bold text-base text-[#064d3b]">{name}</h3>
                              <p className="text-xs text-gray-600 mt-1">☎ {phone}</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_auto] gap-5 items-center flex-1">
                          
                          {/* DESKTOP CUSTOMER INFO */}
                          <div className="hidden md:block">
                            <h3 className="font-bold text-base sm:text-lg text-[#064d3b] flex items-center gap-2">
                              {name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">☎ {phone}</p>
                            {email && <p className="text-xs text-gray-400 mt-0.5">✉ {email}</p>}
                          </div>

                          {/* PROPERTY INFO */}
                          <div className="md:border-l border-gray-100 md:pl-5">
                            <h4 className="font-bold text-sm sm:text-base text-gray-800 line-clamp-1">{propTitle}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">📍 {[propArea, propCity].filter(Boolean).join(", ") || "Location unknown"}</p>
                            {propPrice && <p className="text-xs font-bold text-[#c99838] mt-1">{propPrice}</p>}
                          </div>

                          {/* VISIT & ACTION */}
                          <div className="md:border-l border-gray-100 md:pl-5 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3">
                            <div className="text-left md:text-right w-full">
                              <div className="flex items-center md:justify-end gap-2 text-sm font-bold text-gray-800">
                                <span>📅 {formattedDate}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                🕒 {formattedTime}
                              </div>
                              <div className="mt-2 inline-block bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                ✓ COMPLETED
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => router.push(`/owner/site-visits/completed/${docId}`)}
                              className="px-4 py-2 rounded-xl bg-white border border-[#064d3b] text-[#064d3b] font-bold text-xs sm:text-sm hover:bg-[#064d3b] hover:text-white transition whitespace-nowrap"
                            >
                              View Details →
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="hidden xl:block space-y-6">
              
              {/* Calendar Widget */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                    className="text-gray-400 hover:text-gray-800 p-1"
                  >
                    ❮
                  </button>
                  <h3 className="font-bold text-[#064d3b] text-sm">
                    {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button 
                    onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                    className="text-gray-400 hover:text-gray-800 p-1"
                  >
                    ❯
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                  <span className="font-bold text-gray-400">Su</span>
                  <span className="font-bold text-gray-400">Mo</span>
                  <span className="font-bold text-gray-400">Tu</span>
                  <span className="font-bold text-gray-400">We</span>
                  <span className="font-bold text-gray-400">Th</span>
                  <span className="font-bold text-gray-400">Fr</span>
                  <span className="font-bold text-gray-400">Sa</span>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {(() => {
                    const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
                    const startDayOfMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
                    
                    const datesWithVisits = new Set();
                    completedVisits.forEach(v => {
                      const dStr = getVisitDateStr(v);
                      if (dStr) {
                        const d = new Date(dStr);
                        if (!isNaN(d.getTime())) datesWithVisits.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
                      }
                    });

                    const days = [];
                    for (let i = 0; i < startDayOfMonth; i++) {
                      days.push(<div key={`empty-${i}`} className="p-2"></div>);
                    }
                    for (let i = 1; i <= daysInMonth; i++) {
                      const dateKey = `${calendarDate.getFullYear()}-${calendarDate.getMonth()}-${i}`;
                      const hasVisit = datesWithVisits.has(dateKey);
                      const isSelected = selectedCalendarDate === dateKey;
                      
                      days.push(
                        <div 
                          key={`day-${i}`} 
                          onClick={() => {
                            if (isSelected) setSelectedCalendarDate(null);
                            else if (hasVisit) setSelectedCalendarDate(dateKey);
                          }}
                          className={`p-2 w-8 h-8 mx-auto flex items-center justify-center relative rounded-full 
                            ${hasVisit ? 'cursor-pointer hover:bg-emerald-50 font-bold text-[#064d3b]' : 'text-gray-400'} 
                            ${isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}`}
                        >
                          {i}
                          {hasVisit && <span className="absolute bottom-0.5 w-1 h-1 bg-emerald-500 rounded-full"></span>}
                        </div>
                      );
                    }
                    return days;
                  })()}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center text-[10px] text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                    Completed Visit
                  </div>
                </div>
              </div>
              
              {/* Quick Summary */}
              <div className="bg-[#faf8f5] rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-5">Quick Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">✅</div>
                      <span className="text-sm font-semibold text-gray-700">Completed Visits</span>
                    </div>
                    <span className="font-black text-gray-900">{totalCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm">🗓️</div>
                      <span className="text-sm font-semibold text-gray-700">This Week</span>
                    </div>
                    <span className="font-black text-gray-900">{thisWeekCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-sm">🏠</div>
                      <span className="text-sm font-semibold text-gray-700">Properties Visited</span>
                    </div>
                    <span className="font-black text-gray-900">{uniqueProperties.size}</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white rounded-2xl border border-emerald-100">
                  <div className="flex gap-2">
                    <span className="text-emerald-500 text-lg">💡</span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Tip</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Great work! Keep managing your visits to build strong customer relationships.</p>
                    </div>
                  </div>
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
