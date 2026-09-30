"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAllEnquiries } from "@/services/enquiry";
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle,
  MapPin,
  Home,
  User,
  X,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

// ─── Status helpers ────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  Pending: { bg: "bg-amber-100", text: "text-amber-800", dot: "#f59e0b" },
  "Site Visit": { bg: "bg-purple-100", text: "text-purple-800", dot: "#a855f7" },
  Scheduled: { bg: "bg-purple-100", text: "text-purple-800", dot: "#a855f7" },
  Confirmed: { bg: "bg-emerald-100", text: "text-emerald-800", dot: "#10b981" },
  Completed: { bg: "bg-[#0D3326]/10", text: "text-[#0D3326]", dot: "#0D3326" },
  Cancelled: { bg: "bg-red-100", text: "text-red-700", dot: "#ef4444" },
  Contacted: { bg: "bg-blue-100", text: "text-blue-800", dot: "#3b82f6" },
  Interested: { bg: "bg-emerald-100", text: "text-emerald-800", dot: "#10b981" },
  Closed: { bg: "bg-gray-100", text: "text-gray-700", dot: "#6b7280" },
  Default: { bg: "bg-gray-100", text: "text-gray-700", dot: "#9ca3af" }
};

function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.Default;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.dot }} />
      {status || "Unknown"}
    </span>
  );
}

// ─── Normalise Relations ──────────────────────────────────────────────────────
const STRAPI_BASE = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(/\/api\/?$/, "");

function getAttr(relation) {
  if (!relation) return null;
  return relation.attributes || relation;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-[#F3EBDD]">
      <AdminHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-[#DCCCB0]/60 rounded-lg"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white/50 rounded-2xl border border-[#DCCCB0]/40"></div>)}
          </div>
          <div className="h-16 bg-white/50 rounded-2xl border border-[#DCCCB0]/40"></div>
          <div className="h-96 bg-white/50 rounded-2xl border border-[#DCCCB0]/40"></div>
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminEnquiriesPage() {
  const router = useRouter();
  
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest First");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // getAllEnquiries returns the data array directly
      const data = await getAllEnquiries();
      // Normalise if v4 { id, attributes } wrapper exists
      const normalised = data.map(item => ({
        id: item.id,
        documentId: item.documentId,
        ...(item.attributes || item)
      }));
      setEnquiries(normalised);
    } catch (err) {
      console.error("[AdminEnquiriesPage]", err);
      setError("Unable to load enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Derived Data & Filters ────────────────────────────────────────────────
  const uniqueStatuses = useMemo(() => {
    const s = new Set(enquiries.map(e => e.Statuss).filter(Boolean));
    return ["All", ...Array.from(s).sort()];
  }, [enquiries]);

  const uniqueCities = useMemo(() => {
    const s = new Set(enquiries.map(e => {
      const prop = getAttr(e.property);
      return prop?.City;
    }).filter(Boolean));
    return ["All", ...Array.from(s).sort()];
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    let result = [...enquiries];

    if (statusFilter !== "All") {
      result = result.filter(e => e.Statuss === statusFilter);
    }
    
    if (cityFilter !== "All") {
      result = result.filter(e => {
        const prop = getAttr(e.property);
        return prop?.City === cityFilter;
      });
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => {
        const prop = getAttr(e.property);
        const owner = getAttr(prop?.Owner);
        const buyer = getAttr(e.users_permissions_user);
        
        return (
          e.Name?.toLowerCase().includes(q) ||
          e.Email?.toLowerCase().includes(q) ||
          e.Phone?.includes(q) ||
          prop?.Title?.toLowerCase().includes(q) ||
          prop?.Area?.toLowerCase().includes(q) ||
          owner?.username?.toLowerCase().includes(q) ||
          owner?.name?.toLowerCase().includes(q) ||
          buyer?.username?.toLowerCase().includes(q)
        );
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "Newest First" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [enquiries, search, statusFilter, cityFilter, sortOrder]);

  // ─── Summary Metrics ──────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    return {
      total: enquiries.length,
      pending: enquiries.filter(e => e.Statuss === "Pending" || e.Statuss === "New").length,
      siteVisits: enquiries.filter(e => e.Statuss === "Site Visit" || e.Statuss === "Scheduled" || e.VisitDate).length,
      completed: enquiries.filter(e => e.Statuss === "Completed" || e.Statuss === "Closed").length
    };
  }, [enquiries]);

  // ─── Renderers ─────────────────────────────────────────────────────────────
  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#F3EBDD]">
        <AdminHeader />
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-white p-12 shadow-sm border border-red-100">
            <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-6" />
            <h2 className="text-2xl font-bold text-[#0D3326] mb-3">{error}</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">There was a problem retrieving the platform enquiries from the database.</p>
            <button onClick={fetchData} className="inline-flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 text-sm font-bold text-white hover:bg-[#174638] transition-colors">
              <RefreshCw className="h-4 w-4" /> Retry Connection
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EBDD] font-sans pb-16">
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D3326] tracking-tight">Platform Enquiries</h1>
          <p className="mt-2 text-sm text-gray-600 font-medium">Manage and monitor property enquiries across HomeHub.</p>
        </div>

        {/* Summary Cards */}
        {enquiries.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-[#DCCCB0]/40 shadow-sm flex flex-col justify-between group hover:border-[#D7AE62] transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Enquiries</span>
                <MessageSquare className="h-5 w-5 text-[#0D3326]/40 group-hover:text-[#D7AE62] transition-colors" />
              </div>
              <div className="mt-4 text-3xl font-extrabold text-[#0D3326]">{metrics.total}</div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-[#DCCCB0]/40 shadow-sm flex flex-col justify-between group hover:border-[#D7AE62] transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">New / Pending</span>
                <Clock className="h-5 w-5 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
              </div>
              <div className="mt-4 text-3xl font-extrabold text-[#0D3326]">{metrics.pending}</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#DCCCB0]/40 shadow-sm flex flex-col justify-between group hover:border-[#D7AE62] transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Site Visits</span>
                <Calendar className="h-5 w-5 text-purple-500/50 group-hover:text-purple-500 transition-colors" />
              </div>
              <div className="mt-4 text-3xl font-extrabold text-[#0D3326]">{metrics.siteVisits}</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#DCCCB0]/40 shadow-sm flex flex-col justify-between group hover:border-[#D7AE62] transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</span>
                <CheckCircle className="h-5 w-5 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="mt-4 text-3xl font-extrabold text-[#0D3326]">{metrics.completed}</div>
            </div>
          </div>
        )}

        {enquiries.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#DCCCB0]/40 shadow-sm p-16 text-center">
            <MessageSquare className="mx-auto h-16 w-16 text-[#DCCCB0] mb-6" />
            <h3 className="text-xl font-bold text-[#0D3326] mb-2">No Enquiries Yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">There are currently no platform enquiries to display. Once buyers start inquiring about properties, they will appear here.</p>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#DCCCB0]/40 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search buyer, property, seller..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D7AE62]/50 focus:border-[#D7AE62] transition-all"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Select Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase">Filter:</span>
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#D7AE62] focus:ring-1 focus:ring-[#D7AE62]"
                >
                  <option value="All">All Statuses</option>
                  {uniqueStatuses.filter(s => s !== "All").map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#D7AE62] focus:ring-1 focus:ring-[#D7AE62]"
                >
                  <option value="All">All Cities</option>
                  {uniqueCities.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#D7AE62] focus:ring-1 focus:ring-[#D7AE62]"
                >
                  <option value="Newest First">Newest First</option>
                  <option value="Oldest First">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Empty Search Result */}
            {filteredEnquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#DCCCB0]/40 p-12 text-center shadow-sm">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-[#0D3326] mb-1">No matches found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                <button onClick={() => { setSearch(""); setStatusFilter("All"); setCityFilter("All"); }} className="mt-4 text-[#D7AE62] font-semibold text-sm hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              /* Enquiries Table/List */
              <div className="bg-white rounded-2xl border border-[#DCCCB0]/40 shadow-sm overflow-hidden">
                
                {/* Desktop Table Header */}
                <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-3">Buyer</div>
                  <div className="col-span-3">Property</div>
                  <div className="col-span-2">Seller</div>
                  <div className="col-span-2">Status / Date</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-100">
                  {filteredEnquiries.map((enquiry) => {
                    const prop = getAttr(enquiry.property);
                    const owner = getAttr(prop?.Owner);
                    const buyer = getAttr(enquiry.users_permissions_user);
                    const coverImg = prop?.CoverImage?.url ? `${STRAPI_BASE}${prop.CoverImage.url}` : null;
                    
                    const buyerName = enquiry.Name || buyer?.username || "Unknown Buyer";
                    const sellerName = owner?.name || owner?.username || "Unknown Seller";

                    return (
                      <div key={enquiry.documentId || enquiry.id} className="p-4 lg:p-0 hover:bg-gray-50 transition-colors">
                        
                        {/* Desktop Layout */}
                        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 items-center">
                          
                          {/* Buyer */}
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#0D3326] text-white flex flex-shrink-0 items-center justify-center font-bold text-sm">
                              {buyerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-[#0D3326] truncate">{buyerName}</p>
                              {enquiry.Phone && <p className="text-xs text-gray-500 truncate">{enquiry.Phone}</p>}
                            </div>
                          </div>

                          {/* Property */}
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="h-12 w-16 rounded-md bg-gray-200 overflow-hidden flex-shrink-0">
                              {coverImg ? (
                                <img src={coverImg} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400"><Home className="h-5 w-5" /></div>
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-[#0D3326] truncate">{prop?.Title || "Unknown Property"}</p>
                              <p className="text-xs text-gray-500 truncate">{[prop?.Area, prop?.City].filter(Boolean).join(", ")}</p>
                            </div>
                          </div>

                          {/* Seller */}
                          <div className="col-span-2 flex flex-col justify-center">
                            <p className="text-sm font-semibold text-gray-900 truncate">{sellerName}</p>
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Seller</span>
                          </div>

                          {/* Status & Date */}
                          <div className="col-span-2 flex flex-col justify-center items-start gap-1.5">
                            <StatusBadge status={enquiry.Statuss} />
                            <span className="text-xs text-gray-500 font-medium">{new Date(enquiry.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>

                          {/* Action */}
                          <div className="col-span-2 flex justify-end">
                            <Link
                              href={`/admin/enquiries/${enquiry.documentId || enquiry.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCCCB0] bg-white px-3 py-1.5 text-xs font-bold text-[#0D3326] hover:bg-[#0D3326] hover:text-white transition-colors"
                            >
                              View Details <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="lg:hidden flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[#0D3326] text-white flex flex-shrink-0 items-center justify-center font-bold text-sm">
                                {buyerName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#0D3326]">{buyerName}</p>
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Buyer</span>
                              </div>
                            </div>
                            <StatusBadge status={enquiry.Statuss} />
                          </div>

                          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 flex gap-3">
                            <div className="h-14 w-20 rounded-md bg-gray-200 overflow-hidden flex-shrink-0">
                              {coverImg ? (
                                <img src={coverImg} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400"><Home className="h-5 w-5" /></div>
                              )}
                            </div>
                            <div className="flex-1 overflow-hidden flex flex-col justify-center">
                              <p className="text-sm font-bold text-[#0D3326] line-clamp-1">{prop?.Title || "Unknown Property"}</p>
                              <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                <User className="h-3 w-3" /> {sellerName}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" /> {new Date(enquiry.createdAt).toLocaleDateString("en-IN")}
                            </span>
                            <Link
                              href={`/admin/enquiries/${enquiry.documentId || enquiry.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCCCB0] bg-white px-4 py-2 text-xs font-bold text-[#0D3326] hover:bg-[#F3EBDD] transition-colors shadow-sm"
                            >
                              View Details <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
