"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MessageSquare, Search, Filter, Loader2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import { getMyEnquiries, getMyEnquiriesFallback } from "@/services/enquiry";
import EnquirySummary from "./EnquirySummary";
import EnquiryCard from "./EnquiryCard";

function MyEnquiriesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  
  // Map URL status query to ActiveFilter
  const rawStatus = searchParams.get("status");
  
  // Format for internal logic (All, Pending, Contacted, Site Visit, Closed)
  let activeFilter = "All";
  if (rawStatus) {
    const s = rawStatus.toLowerCase();
    if (s === "pending") activeFilter = "Pending";
    else if (s === "contacted") activeFilter = "Contacted";
    else if (s === "site_visit") activeFilter = "Site Visit";
    else if (s === "closed") activeFilter = "Closed";
  }

  const handleFilterChange = (filter) => {
    const params = new URLSearchParams(searchParams);
    
    if (filter === "All") params.delete("status");
    else if (filter === "Pending") params.set("status", "pending");
    else if (filter === "Contacted") params.set("status", "contacted");
    else if (filter === "Site Visit") params.set("status", "site_visit");
    else if (filter === "Closed") params.set("status", "closed");

    router.replace(`${pathname}?${params.toString()}`);
  };

  const loadEnquiries = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      let data = [];
      try {
        data = await getMyEnquiries();
      } catch (primaryErr) {
        console.warn("Primary enquiries query failed, trying fallback:", primaryErr?.message);
        // Fallback: use simpler query
        data = await getMyEnquiriesFallback();
      }
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Enquiries Page Error:", err);
      setError("Unable to load your enquiries.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  // Instantly remove a card from local state after delete (optimistic UI)
  const handleEnquiryRemove = (removedId) => {
    setEnquiries((prev) =>
      prev.filter((e) => (e.documentId || e.id) !== removedId)
    );
  };

  // Calculate summary counts
  const counts = enquiries.reduce(
    (acc, enq) => {
      acc.all++;
      const status = (enq.Statuss || enq.Status || "").toLowerCase().trim();
      
      const isSiteVisit = ["site visit", "site visit pending", "scheduled", "confirmed", "rescheduled"].includes(status);
      const isClosed = ["closed", "completed", "cancelled", "notinterested", "converted"].includes(status);

      if (status === "pending" || status === "new" || status === "") acc.pending++;
      else if (status === "contacted" || status === "interested" || status === "follow-up required") acc.contacted++;
      else if (isSiteVisit) acc.siteVisits++;
      else if (isClosed) acc.closed++;
      return acc;
    },
    { all: 0, pending: 0, contacted: 0, siteVisits: 0, closed: 0 }
  );

  // Filter & Search Logic
  const filteredEnquiries = enquiries.filter((enq) => {
    const status = (enq.Status || enq.Statuss || "Pending").toLowerCase().trim();
    const isSiteVisit = ["site visit", "site visit pending", "scheduled", "confirmed", "rescheduled"].includes(status);
    const isClosed = ["closed", "completed", "cancelled", "notinterested", "converted"].includes(status);
    
    // Filter matches
    let matchesFilter = true;
    if (activeFilter !== "All") {
      if (activeFilter === "Pending" && status !== "pending" && status !== "new") matchesFilter = false;
      if (activeFilter === "Contacted" && status !== "contacted" && status !== "interested" && status !== "follow-up required") matchesFilter = false;
      if (activeFilter === "Site Visit" && !isSiteVisit) matchesFilter = false;
      if (activeFilter === "Closed" && !isClosed) matchesFilter = false;
    }

    // Search matches
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = (enq.property?.Title || "").toLowerCase();
      const area = (enq.property?.Area || "").toLowerCase();
      const city = (enq.property?.City || "").toLowerCase();
      matchesSearch = title.includes(q) || area.includes(q) || city.includes(q);
    }

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--text-primary)]" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-10 text-center">
          <h2 className="text-xl font-bold text-red-500">Oops!</h2>
          <p className="mt-2 text-red-400">{error}</p>
          <button 
            onClick={() => loadEnquiries()}
            className="hh-btn hh-btn-primary mt-6"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (enquiries.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <MessageSquare size={36} className="text-[var(--text-secondary)]" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-[var(--text-primary)]">No enquiries yet</h1>
          <p className="mt-3 text-[var(--text-secondary)] text-lg">
            You haven't contacted any property owners yet. Start exploring to find your dream home.
          </p>
          <Link
            href="/user"
            className="hh-btn hh-btn-primary mt-8 inline-block px-8 py-3.5 text-base"
          >
            Explore Properties
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Enquiries</h1>
          <p className="mt-2 text-[var(--text-secondary)]">Track your property enquiries, owner responses and site visits.</p>
        </div>
        <button
          onClick={() => loadEnquiries(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-surface)] disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Summary */}
      <div className="mb-10">
        <EnquirySummary counts={counts} activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </div>

      {/* Search & Filters */}
      <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search by property title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={18} className="text-[var(--text-secondary)] mr-1" />
          {["All", "Pending", "Contacted", "Site Visit", "Closed"].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeFilter === filter
                  ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filteredEnquiries.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] py-16 text-center">
          <p className="text-lg font-medium text-[var(--text-secondary)]">No enquiries found for the selected filters.</p>
          <button 
            onClick={() => { setSearchQuery(""); handleFilterChange("All"); }}
            className="mt-4 text-[var(--text-primary)] font-semibold underline underline-offset-4"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredEnquiries.map((enq) => (
            <EnquiryCard
              key={enq.id || enq.documentId}
              enquiry={enq}
              onRemove={handleEnquiryRemove}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default function MyEnquiriesClient() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--text-primary)]" size={24} /></div>}>
      <MyEnquiriesContent />
    </Suspense>
  );
}
