"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAllSubscribedUsers, getSubscriptionConfig, getSubscriptionPayments } from "@/services/adminSubscriptions";
import { 
  Search, Filter, Eye, AlertCircle, RefreshCw, Crown, IndianRupee,
  Calendar, CheckCircle, Clock, X, TrendingUp
} from "lucide-react";

// ─── Status Helpers ────────────────────────────────────────────────────────
const getSubscriptionStatus = (validUntil) => {
  if (!validUntil) return "Unknown";
  const now = new Date();
  const end = new Date(validUntil);
  const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return "Expired";
  if (diffDays <= 7) return "Expiring Soon";
  return "Active";
};

const STATUS_STYLE = {
  Active: { bg: "bg-emerald-100", text: "text-emerald-800", dot: "#10b981" },
  "Expiring Soon": { bg: "bg-amber-100", text: "text-amber-800", dot: "#f59e0b" },
  Expired: { bg: "bg-red-100", text: "text-red-700", dot: "#ef4444" },
  Unknown: { bg: "bg-gray-100", text: "text-gray-700", dot: "#9ca3af" }
};

function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.Unknown;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.dot }} />
      {status}
    </span>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-[#F3EBDD]">
      <AdminHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-[#DCCCB0]/60 rounded-lg"></div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-28 bg-white/50 rounded-2xl border border-[#DCCCB0]/40"></div>)}
          </div>
          <div className="h-16 bg-white/50 rounded-2xl border border-[#DCCCB0]/40"></div>
          <div className="h-96 bg-white/50 rounded-2xl border border-[#DCCCB0]/40"></div>
        </div>
      </main>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function AdminSubscriptionsPage() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [revenue, setRevenue] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Expiry Date");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedUsers, fetchedPlans, fetchedPayments] = await Promise.all([
        getAllSubscribedUsers(),
        getSubscriptionConfig(),
        getSubscriptionPayments()
      ]);
      
      // Calculate derived statuses for users
      const usersWithStatus = fetchedUsers.map(u => ({
        ...u,
        computedStatus: getSubscriptionStatus(u.subscriptionValidUntil)
      }));

      // Calculate Total Revenue
      const totalRevenue = fetchedPayments.reduce((acc, curr) => acc + (curr.totalAmount || curr.amount || 0), 0);

      setUsers(usersWithStatus);
      setPlans(fetchedPlans);
      setRevenue(totalRevenue);
    } catch (err) {
      console.error("[AdminSubscriptionsPage] fetch error:", err);
      setError("Unable to load subscriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Filtering & Sorting ──────────────────────────────────────────────────
  const uniquePlans = useMemo(() => {
    const s = new Set(users.map(u => u.subscriptionTier).filter(Boolean));
    return ["All", ...Array.from(s).sort()];
  }, [users]);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (statusFilter !== "All") {
      result = result.filter(u => u.computedStatus === statusFilter);
    }

    if (planFilter !== "All") {
      result = result.filter(u => u.subscriptionTier === planFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u => 
        (u.username || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.subscriptionTier || "").toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortOrder === "Expiry Date") {
        const dateA = new Date(a.subscriptionValidUntil || 0).getTime();
        const dateB = new Date(b.subscriptionValidUntil || 0).getTime();
        return dateB - dateA;
      }
      if (sortOrder === "Newest") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // descending
      }
      return 0;
    });

    return result;
  }, [users, search, statusFilter, planFilter, sortOrder]);

  // ─── Metrics ─────────────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.computedStatus === "Active").length,
      expiringSoon: users.filter(u => u.computedStatus === "Expiring Soon").length,
      expired: users.filter(u => u.computedStatus === "Expired").length,
    };
  }, [users]);

  // ─── Error State ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#F3EBDD]">
        <AdminHeader />
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-white p-12 shadow-sm border border-red-100">
            <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-6" />
            <h2 className="text-2xl font-bold text-[#0D3326] mb-3">{error}</h2>
            <button onClick={fetchData} className="inline-flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 text-sm font-bold text-white hover:bg-[#174638] transition-colors">
              <RefreshCw className="h-4 w-4" /> Retry Connection
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (loading) return <Skeleton />;

  return (
    <div className="min-h-screen bg-[#F3EBDD] font-sans pb-16">
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D3326] tracking-tight">Subscriptions</h1>
          <p className="mt-2 text-sm text-gray-600 font-medium">Platform-level management of Seller/Owner subscriptions.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          
          <div className="bg-white rounded-2xl p-5 border border-[#DCCCB0]/40 shadow-sm flex flex-col justify-between group hover:border-[#D7AE62] transition-colors lg:col-span-1 col-span-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
              <IndianRupee className="h-5 w-5 text-[#0D3326]/40 group-hover:text-[#D7AE62] transition-colors" />
            </div>
            <div className="mt-4 text-3xl font-extrabold text-[#0D3326]">
              {revenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#DCCCB0]/40 shadow-sm flex flex-col justify-between group hover:border-[#D7AE62] transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Plans</span>
              <Crown className="h-5 w-5 text-[#0D3326]/40 group-hover:text-[#D7AE62] transition-colors" />
            </div>
            <div className="mt-4 text-3xl font-extrabold text-[#0D3326]">{metrics.total}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-[#DCCCB0]/40 shadow-sm flex flex-col justify-between group hover:border-[#D7AE62] transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active</span>
              <CheckCircle className="h-5 w-5 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="mt-4 text-3xl font-extrabold text-[#0D3326]">{metrics.active}</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#DCCCB0]/40 shadow-sm flex flex-col justify-between group hover:border-[#D7AE62] transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expiring Soon</span>
              <Clock className="h-5 w-5 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
            </div>
            <div className="mt-4 text-3xl font-extrabold text-[#0D3326]">{metrics.expiringSoon}</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#DCCCB0]/40 shadow-sm flex flex-col justify-between group hover:border-[#D7AE62] transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Expired</span>
              <Calendar className="h-5 w-5 text-red-500/50 group-hover:text-red-500 transition-colors" />
            </div>
            <div className="mt-4 text-3xl font-extrabold text-[#0D3326]">{metrics.expired}</div>
          </div>

        </div>

        {users.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#DCCCB0]/40 shadow-sm p-16 text-center">
            <Crown className="mx-auto h-16 w-16 text-[#DCCCB0] mb-6" />
            <h3 className="text-xl font-bold text-[#0D3326] mb-2">No Seller Subscriptions</h3>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">There are no subscription records available yet. Once sellers purchase plans, they will appear here.</p>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#DCCCB0]/40 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search seller or plan..."
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
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Expired">Expired</option>
                </select>

                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#D7AE62] focus:ring-1 focus:ring-[#D7AE62]"
                >
                  <option value="All">All Plans</option>
                  {uniquePlans.filter(p => p !== "All").map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#D7AE62] focus:ring-1 focus:ring-[#D7AE62]"
                >
                  <option value="Expiry Date">Sort by Expiry</option>
                  <option value="Newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Table */}
            {filteredUsers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#DCCCB0]/40 p-12 text-center shadow-sm">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-[#0D3326] mb-1">No matches found</h3>
                <p className="text-sm text-gray-500">Adjust your search or filters to see results.</p>
                <button onClick={() => { setSearch(""); setStatusFilter("All"); setPlanFilter("All"); }} className="mt-4 text-[#D7AE62] font-semibold text-sm hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#DCCCB0]/40 shadow-sm overflow-hidden">
                <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-4">Seller</div>
                  <div className="col-span-2">Plan</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Expiry Date</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => {
                    const sellerName = user.username || user.name || "Unknown Seller";
                    
                    return (
                      <div key={user.documentId || user.id} className="p-4 lg:p-0 hover:bg-gray-50 transition-colors">
                        
                        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 items-center">
                          <div className="col-span-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#174638] text-white flex flex-shrink-0 items-center justify-center font-bold text-sm">
                              {sellerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-[#0D3326] truncate">{sellerName}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#D7AE62]/10 px-2.5 py-1 text-xs font-bold text-[#b58f4a]">
                              <Crown className="h-3.5 w-3.5" />
                              {user.subscriptionTier}
                            </span>
                          </div>

                          <div className="col-span-2">
                            <StatusBadge status={user.computedStatus} />
                          </div>

                          <div className="col-span-2 text-sm text-gray-600 font-medium">
                            {user.subscriptionValidUntil 
                              ? new Date(user.subscriptionValidUntil).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })
                              : "N/A"
                            }
                          </div>

                          <div className="col-span-2 flex justify-end">
                            <Link
                              href={`/admin/subscriptions/${user.documentId || user.id}`}
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
                              <div className="h-10 w-10 rounded-full bg-[#174638] text-white flex flex-shrink-0 items-center justify-center font-bold text-sm">
                                {sellerName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#0D3326]">{sellerName}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            <StatusBadge status={user.computedStatus} />
                          </div>
                          
                          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 border border-gray-100">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Plan</p>
                              <span className="inline-flex items-center gap-1 text-sm font-bold text-[#b58f4a]">
                                <Crown className="h-3.5 w-3.5" /> {user.subscriptionTier}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Expiry</p>
                              <p className="text-sm font-medium text-gray-700">
                                {user.subscriptionValidUntil ? new Date(user.subscriptionValidUntil).toLocaleDateString("en-IN") : "N/A"}
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/admin/subscriptions/${user.documentId || user.id}`}
                            className="flex w-full justify-center items-center gap-1.5 rounded-lg border border-[#DCCCB0] bg-white px-4 py-2 text-xs font-bold text-[#0D3326] hover:bg-[#F3EBDD] transition-colors"
                          >
                            View Details <Eye className="h-3.5 w-3.5" />
                          </Link>
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
