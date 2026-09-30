"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAdminEnquiry, updateAdminEnquiryStatus } from "@/services/enquiry";
import {
  ChevronLeft,
  User,
  MapPin,
  Home,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  RefreshCw,
  Building,
  Eye,
  ArrowRight
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

const ALLOWED_STATUSES = [
  "Pending", "New", "Contacted", "Interested", "Follow-up Required",
  "Site Visit Pending", "Not Interested", "Site Visit", "Scheduled",
  "Confirmed", "Completed", "Cancelled", "Rescheduled", "Closed"
];

function StatusBadge({ status, lg = false }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.Default;
  const padding = lg ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[10px]";
  const dotSize = lg ? "h-2 w-2" : "h-1.5 w-1.5";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-widest ${padding} ${style.bg} ${style.text}`}>
      <span className={`${dotSize} rounded-full`} style={{ background: style.dot }} />
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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 bg-[#DCCCB0]/60 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
               <div className="h-48 bg-white/60 rounded-2xl border border-[#DCCCB0]/40"></div>
               <div className="h-72 bg-white/60 rounded-2xl border border-[#DCCCB0]/40"></div>
               <div className="h-32 bg-white/60 rounded-2xl border border-[#DCCCB0]/40"></div>
            </div>
            <div className="space-y-4">
               <div className="h-64 bg-white/60 rounded-2xl border border-[#DCCCB0]/40"></div>
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
export default function AdminEnquiryDetailPage({ params }) {
  const router = useRouter();
  
  // Next.js 15: use() unwraps the Promise
  const { id: documentId } = use(params);

  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchData();
  }, [documentId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await getAdminEnquiry(documentId);
      // Flat structure support
      setEnquiry(data.attributes ? { id: data.id, documentId: data.documentId, ...data.attributes } : data);
    } catch (err) {
      console.error("[AdminEnquiryDetail]", err);
      if (err.message?.includes("not found") || err.message?.includes("404")) {
        setNotFound(true);
      } else {
        setError("Unable to load enquiry. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === enquiry?.Statuss) return;
    setStatusUpdateLoading(true);
    try {
      await updateAdminEnquiryStatus(documentId, newStatus);
      alert(`Enquiry status updated to ${newStatus}`);
      await fetchData();
    } catch (err) {
      alert(err.message || "Failed to update status");
    } finally {
      setStatusUpdateLoading(false);
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
            <MessageSquare className="mx-auto h-16 w-16 text-[#DCCCB0] mb-6" />
            <h2 className="text-2xl font-bold text-[#0D3326] mb-3">Enquiry Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">The requested enquiry could not be found. It may have been deleted or the ID is incorrect.</p>
            <Link href="/admin/enquiries" className="inline-flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 text-sm font-bold text-white hover:bg-[#174638] transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back to Enquiries
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="min-h-screen bg-[#F3EBDD]">
        <AdminHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-white p-12 shadow-sm border border-red-100">
            <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-6" />
            <h2 className="text-2xl font-bold text-[#0D3326] mb-3">Error Loading Enquiry</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{error}</p>
            <div className="flex justify-center gap-3">
              <button onClick={fetchData} className="inline-flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 text-sm font-bold text-white hover:bg-[#174638] transition-colors">
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
              <Link href="/admin/enquiries" className="inline-flex items-center gap-2 rounded-xl border border-[#DCCCB0] bg-white px-6 py-3 text-sm font-bold text-[#0D3326] hover:bg-[#F3EBDD] transition-colors">
                Back to Enquiries
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Data Extraction ───────────────────────────────────────────────────────
  const prop = getAttr(enquiry.property);
  const owner = getAttr(prop?.Owner);
  const buyer = getAttr(enquiry.users_permissions_user);
  
  const coverImg = prop?.CoverImage?.url ? `${STRAPI_BASE}${prop.CoverImage.url}` : null;
  const buyerName = enquiry.Name || buyer?.username || "Unknown Buyer";
  const sellerName = owner?.name || owner?.username || "Unknown Seller";

  const fmtDate = (d) => d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "N/A";
  const fmtOnlyDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "N/A";

  const hasSiteVisit = enquiry.Statuss === "Site Visit" || enquiry.Statuss === "Scheduled" || enquiry.Statuss === "Confirmed" || enquiry.VisitDate;

  return (
    <div className="min-h-screen bg-[#F3EBDD] font-sans pb-16">
      <AdminHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Top Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/admin/enquiries" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D3326] hover:text-[#D7AE62] transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back to Enquiries
          </Link>
        </div>

        {/* Page Title & Status */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D3326] tracking-tight">Property Enquiry</h1>
              <StatusBadge status={enquiry.Statuss} lg />
            </div>
            <p className="text-sm font-medium text-gray-500">ID: <code className="bg-white px-1.5 py-0.5 rounded border border-[#DCCCB0]/40">{documentId}</code> • Received {fmtDate(enquiry.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Buyer Info */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCCCB0]/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D7AE62]/5 rounded-bl-full -z-0"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-6 flex items-center gap-2 relative z-10">
                <User className="h-4 w-4 text-[#D7AE62]" /> Buyer Information
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
                <div className="h-16 w-16 rounded-full bg-[#0D3326] text-white flex flex-shrink-0 items-center justify-center font-extrabold text-2xl shadow-inner border-2 border-white">
                  {buyerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    <InfoRow label="Name" value={buyerName} col />
                    <InfoRow label="Email" value={enquiry.Email || buyer?.email} col />
                    <InfoRow label="Phone" value={enquiry.Phone} col />
                    {buyer?.id && <InfoRow label="Registered Buyer ID" value={buyer.id} col />}
                  </div>
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCCCB0]/40 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-6 flex items-center gap-2">
                <Home className="h-4 w-4 text-[#D7AE62]" /> Property Information
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-48 h-32 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative group">
                  {coverImg ? (
                    <img src={coverImg} alt={prop?.Title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Home className="h-10 w-10" /></div>
                  )}
                  {prop?.Category && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {prop.Category}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-1 w-full">
                  <p className="text-lg font-bold text-[#0D3326]">{prop?.Title || "Unknown Property"}</p>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 pb-3">
                    <MapPin className="h-4 w-4 text-[#D7AE62]" /> {[prop?.Address, prop?.Area, prop?.City].filter(Boolean).join(", ")}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <InfoRow label="Type" value={prop?.Property_Type} />
                    <InfoRow label="Purpose" value={prop?.Purpose ? `For ${prop.Purpose}` : null} />
                    <InfoRow label="Price" value={prop?.Price ? `₹${prop.Price} ${prop.PriceUnits || ''}` : null} />
                  </div>

                  {prop?.documentId && (
                    <Link href={`/admin/properties/${prop.documentId}`} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#D7AE62] hover:text-[#c49a50] transition-colors">
                      View Property Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Enquiry Message */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCCCB0]/40 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-6 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#D7AE62]" /> Enquiry Details
              </h3>
              
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 relative">
                <div className="absolute top-4 right-4 text-gray-200">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14.017 21L16.411 14.976C15.004 14.976 13.689 14.505 12.661 13.636C11.633 12.768 11.058 11.59 11.058 10.313C11.058 7.378 13.784 5 17.151 5C20.519 5 23.245 7.378 23.245 10.313C23.245 14.91 19.349 19.986 16.591 21H14.017ZM3.722 21L6.116 14.976C4.709 14.976 3.394 14.505 2.366 13.636C1.338 12.768 0.763 11.59 0.763 10.313C0.763 7.378 3.489 5 6.856 5C10.224 5 12.95 7.378 12.95 10.313C12.95 14.91 9.054 19.986 6.296 21H3.722Z"/></svg>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed relative z-10 italic">
                  {enquiry.Message || "No message provided by the buyer."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 mt-4">
                <InfoRow label="Received On" value={fmtDate(enquiry.createdAt)} col />
                <InfoRow label="Last Updated" value={fmtDate(enquiry.updatedAt)} col />
              </div>
            </div>

            {/* Site Visit Info (If applicable) */}
            {hasSiteVisit && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 bg-purple-500 h-full"></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-6 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" /> Site Visit Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  <InfoRow label="Visit Date" value={fmtOnlyDate(enquiry.VisitDate) || "Not Scheduled"} col />
                  <InfoRow label="Visit Time" value={enquiry.VisitTime || "Not Specified"} col />
                  <InfoRow label="Status" value={<StatusBadge status={enquiry.Statuss} />} col />
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Admin Actions */}
            <div className="rounded-2xl border-2 border-[#D7AE62]/40 bg-[#0D3326] p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10"><AlertCircle className="w-48 h-48" /></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D7AE62] mb-5 flex items-center gap-2 relative z-10">
                <Clock className="h-4 w-4" /> Admin Controls
              </h3>
              
              <div className="space-y-4 relative z-10 mb-6">
                <div>
                  <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1.5">Current Status</span>
                  <StatusBadge status={enquiry.Statuss} />
                </div>
                
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1.5">Update Status</label>
                  <select 
                    value={newStatus || enquiry.Statuss}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#D7AE62] appearance-none"
                  >
                    {ALLOWED_STATUSES.map(s => <option key={s} value={s} className="text-gray-900">{s}</option>)}
                  </select>
                </div>
              </div>
              
              <button 
                onClick={handleUpdateStatus}
                disabled={statusUpdateLoading || !newStatus || newStatus === enquiry.Statuss}
                className="w-full relative z-10 rounded-xl bg-[#D7AE62] hover:bg-[#c49a50] text-[#0D3326] disabled:opacity-50 disabled:hover:bg-[#D7AE62] font-bold py-2.5 text-sm transition-colors shadow-md"
              >
                {statusUpdateLoading ? "Updating..." : "Update Enquiry Status"}
              </button>
            </div>

            {/* Seller Info */}
            <div className="bg-[#F3EBDD] rounded-2xl p-6 border border-[#DCCCB0] shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-5 flex items-center gap-2">
                <Building className="h-4 w-4 text-[#D7AE62]" /> Seller Information
              </h3>
              
              <div className="flex items-center gap-3 mb-5">
                <div className="h-12 w-12 rounded-full bg-[#174638] text-white flex flex-shrink-0 items-center justify-center font-extrabold text-lg">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-[#0D3326] text-sm truncate">{sellerName}</p>
                  <p className="text-xs text-gray-600 truncate mt-0.5">{owner?.email || "No email"}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-5">
                {owner?.phone && <InfoRow label="Phone" value={owner.phone} col />}
                {owner?.createdAt && <InfoRow label="Joined" value={fmtOnlyDate(owner.createdAt)} col />}
              </div>

              {owner?.id && (
                <Link href={`/admin/users/${owner.id}`} className="flex items-center justify-center gap-2 w-full rounded-xl bg-white border border-[#DCCCB0] text-[#0D3326] text-xs font-bold py-2.5 hover:bg-[#0D3326] hover:text-white transition-colors">
                  View Seller Profile <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
