"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { getSubscribedUser, getSubscriptionConfig, getSubscriptionPayments } from "@/services/adminSubscriptions";
import { 
  ChevronLeft, Crown, AlertCircle, RefreshCw, User, Calendar, 
  CreditCard, TrendingUp, CheckCircle, Zap, Star, Shield
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

function StatusBadge({ status, lg = false }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.Unknown;
  const padding = lg ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[10px]";
  const dotSize = lg ? "h-2 w-2" : "h-1.5 w-1.5";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-widest ${padding} ${style.bg} ${style.text}`}>
      <span className={`${dotSize} rounded-full`} style={{ background: style.dot }} />
      {status}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-[#F3EBDD]">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 bg-[#DCCCB0]/60 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               <div className="h-64 bg-white/60 rounded-2xl border border-[#DCCCB0]/40"></div>
               <div className="h-64 bg-white/60 rounded-2xl border border-[#DCCCB0]/40"></div>
            </div>
            <div className="space-y-6">
               <div className="h-48 bg-white/60 rounded-2xl border border-[#DCCCB0]/40"></div>
               <div className="h-48 bg-white/60 rounded-2xl border border-[#DCCCB0]/40"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value, col = false }) {
  if (!value && value !== 0) return null;
  return (
    <div className={`py-3 border-b border-gray-50 last:border-0 ${col ? 'flex flex-col gap-1' : 'flex justify-between items-start gap-4'}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex-shrink-0 mt-0.5">{label}</span>
      <span className={`text-sm font-semibold text-[#0D3326] ${col ? '' : 'text-right'}`}>{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminSubscriptionDetailPage({ params }) {
  const router = useRouter();
  
  // Next.js 15: unwrap Promise
  const { id: documentId } = use(params);

  const [user, setUser] = useState(null);
  const [planConfig, setPlanConfig] = useState(null);
  const [payments, setPayments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchData();
  }, [documentId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const [fetchedUser, allPlans, allPayments] = await Promise.all([
        getSubscribedUser(documentId),
        getSubscriptionConfig(),
        getSubscriptionPayments(documentId)
      ]);

      setUser(fetchedUser);

      // Match the user's plan name to the config limits
      if (fetchedUser.subscriptionTier) {
        const pConf = allPlans.find(p => p.name.toLowerCase() === fetchedUser.subscriptionTier.toLowerCase());
        setPlanConfig(pConf || null);
      }
      
      setPayments(allPayments);
    } catch (err) {
      console.error("[AdminSubscriptionDetail]", err);
      if (err.message?.toLowerCase().includes("not found")) {
        setNotFound(true);
      } else {
        setError("Unable to load subscription details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Renderers ─────────────────────────────────────────────────────────────
  if (loading) return <Skeleton />;

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#F3EBDD]">
        <AdminHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-white p-12 shadow-sm border border-[#DCCCB0]/40">
            <Crown className="mx-auto h-16 w-16 text-[#DCCCB0] mb-6" />
            <h2 className="text-2xl font-bold text-[#0D3326] mb-3">Subscription Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">The requested subscription could not be found. The user might have been deleted or the ID is incorrect.</p>
            <Link href="/admin/subscriptions" className="inline-flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 text-sm font-bold text-white hover:bg-[#174638] transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back to Subscriptions
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#F3EBDD]">
        <AdminHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-white p-12 shadow-sm border border-red-100">
            <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-6" />
            <h2 className="text-2xl font-bold text-[#0D3326] mb-3">Error Loading Details</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{error}</p>
            <div className="flex justify-center gap-3">
              <button onClick={fetchData} className="inline-flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 text-sm font-bold text-white hover:bg-[#174638] transition-colors">
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
              <Link href="/admin/subscriptions" className="inline-flex items-center gap-2 rounded-xl border border-[#DCCCB0] bg-white px-6 py-3 text-sm font-bold text-[#0D3326] hover:bg-[#F3EBDD] transition-colors">
                Back
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const computedStatus = getSubscriptionStatus(user.subscriptionValidUntil);
  const sellerName = user.username || user.name || "Unknown Seller";
  const fmtDate = (d) => d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "N/A";
  const fmtOnlyDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "N/A";

  const renderUsageBar = (label, icon, current, max) => {
    const p = max && max > 0 ? Math.min(100, Math.round(((max - current) / max) * 100)) : 0;
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-[#0D3326] font-bold text-sm">
            {icon} {label}
          </div>
          <span className="text-xs font-bold text-gray-500">{current} remaining</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#D7AE62] rounded-full transition-all" style={{ width: `${p}%` }}></div>
        </div>
        {max ? <p className="text-[10px] text-gray-400 mt-2 text-right">Out of {max} total</p> : null}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3EBDD] font-sans pb-16">
      <AdminHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Top Bar */}
        <div className="mb-6">
          <Link href="/admin/subscriptions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D3326] hover:text-[#D7AE62] transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to Subscriptions
          </Link>
        </div>

        {/* Page Title & Status */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D3326] tracking-tight">Subscription Details</h1>
              <StatusBadge status={computedStatus} lg />
            </div>
            <p className="text-sm font-medium text-gray-500">Document ID: <code className="bg-white px-1.5 py-0.5 rounded border border-[#DCCCB0]/40">{documentId}</code></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Seller Info */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCCCB0]/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D7AE62]/5 rounded-bl-full -z-0"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-6 flex items-center gap-2 relative z-10">
                <User className="h-4 w-4 text-[#D7AE62]" /> Seller Information
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
                <div className="h-16 w-16 rounded-full bg-[#174638] text-white flex flex-shrink-0 items-center justify-center font-extrabold text-2xl shadow-inner border-2 border-white">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    <InfoRow label="Name" value={sellerName} col />
                    <InfoRow label="Email" value={user.email} col />
                    <InfoRow label="Phone" value={user.phone || "Not provided"} col />
                    <InfoRow label="Joined On" value={fmtOnlyDate(user.createdAt)} col />
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Usage & Limits */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCCCB0]/40 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-6 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#D7AE62]" /> Promotional Credits & Usage
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderUsageBar("Boost Credits", <Zap className="h-4 w-4 text-amber-500" />, user.boostCredits || 0, planConfig?.boostCredits)}
                {renderUsageBar("Featured Credits", <Star className="h-4 w-4 text-emerald-500" />, user.featuredCredits || 0, planConfig?.featuredCredits)}
                {renderUsageBar("Highlight Credits", <Shield className="h-4 w-4 text-blue-500" />, user.highlightCredits || 0, planConfig?.highlightCredits)}
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCCCB0]/40 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-6 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#D7AE62]" /> Payment History
              </h3>
              
              {payments.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500">No subscription payments found for this user.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map(payment => (
                    <div key={payment.id} className="flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:border-[#DCCCB0]/60 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0D3326]">
                            {(payment.totalAmount || payment.amount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                          </p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">{payment.razorpayPaymentId || "Manual Entry"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={payment.status === "paid" ? "Active" : "Unknown"} />
                        <p className="text-xs text-gray-500 mt-1">{fmtDate(payment.paymentDate || payment.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Plan Info Card */}
            <div className="rounded-2xl border-2 border-[#D7AE62]/40 bg-[#0D3326] p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-10"><Crown className="w-48 h-48" /></div>
              
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D7AE62] mb-5 flex items-center gap-2 relative z-10">
                <Crown className="h-4 w-4" /> Current Plan
              </h3>
              
              <div className="relative z-10 text-center mb-6">
                <span className="inline-block px-4 py-1.5 bg-[#D7AE62] text-[#0D3326] font-black text-xl rounded-lg shadow-sm">
                  {user.subscriptionTier || "None"}
                </span>
              </div>
              
              <div className="space-y-3 relative z-10 bg-black/20 rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Status</span>
                  <span className="font-bold text-white">{computedStatus}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Expiry Date</span>
                  <span className="font-bold text-white">{fmtOnlyDate(user.subscriptionValidUntil)}</span>
                </div>
                {planConfig && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Cycle</span>
                    <span className="font-bold text-white capitalize">{planConfig.billingCycle || "Monthly"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Management (Read Only Constraint) */}
            <div className="bg-[#F3EBDD] rounded-2xl p-6 border border-[#DCCCB0] shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-4 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#D7AE62]" /> Plan Management
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Subscription purchases, upgrades, and renewals are handled via the Seller portal using the Razorpay gateway. 
                Manual tier edits are restricted here to prevent out-of-sync payment states.
              </p>
              
              <Link href={`/admin/users/${user.documentId || user.id}`} className="flex w-full justify-center items-center gap-1.5 rounded-xl border border-[#0D3326] bg-transparent px-4 py-2 text-xs font-bold text-[#0D3326] hover:bg-[#0D3326] hover:text-white transition-colors">
                View User Profile <User className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
