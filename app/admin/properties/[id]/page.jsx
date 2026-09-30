"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  MapPin, ChevronLeft, User, CheckCircle, Home,
  Maximize, Bath, AlertCircle, Calendar, Clock,
  Building, Tag, ArrowRight, X, RefreshCw, ChevronRight
} from "lucide-react";
import Link from "next/link";

// ─── Strapi v5 base URL ──────────────────────────────────────────────────────
const _BASE = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(/\/api\/?$/, "");
const API_URL = `${_BASE}/api`;
const STRAPI_BASE = _BASE;

// ─── Auth ─────────────────────────────────────────────────────────────────────
function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token") || localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Status colours ───────────────────────────────────────────────────────────
const STATUS_STYLE = {
  Available:  { badge: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "#22c55e" },
  ACTIVE:     { badge: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "#22c55e" },
  PENDING:    { badge: "bg-amber-100   text-amber-800   border-amber-200",   dot: "#f59e0b" },
  DRAFT:      { badge: "bg-gray-100    text-gray-700    border-gray-200",    dot: "#9ca3af" },
  SOLD:       { badge: "bg-[#9B6848]/15 text-[#9B6848]  border-[#9B6848]/30", dot: "#9B6848" },
  RENTED:     { badge: "bg-purple-100  text-purple-800  border-purple-200",  dot: "#a855f7" },
  INACTIVE:   { badge: "bg-red-100     text-red-700     border-red-200",     dot: "#ef4444" },
  RESERVED:   { badge: "bg-orange-100  text-orange-800  border-orange-200",  dot: "#f97316" },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || { badge: "bg-gray-100 text-gray-700 border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${style.badge}`}>
      {style.dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.dot }} />}
      {status || "Unknown"}
    </span>
  );
}

// ─── Approve / Reject — statuses that support transitions ────────────────────
const CAN_APPROVE = ["Available", "PENDING", "DRAFT", "INACTIVE"];
const CAN_REJECT  = ["Available", "PENDING", "ACTIVE"];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-[#F3EBDD]">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 bg-[#DCCCB0]/60 rounded-lg" />
          <div className="rounded-2xl overflow-hidden bg-white border border-[#DCCCB0]/40 shadow-sm">
            <div className="h-72 bg-[#DCCCB0]/50" />
            <div className="p-6 space-y-4">
              <div className="h-5 w-32 bg-[#DCCCB0]/40 rounded" />
              <div className="h-8 w-2/3 bg-[#DCCCB0]/50 rounded" />
              <div className="h-4 w-1/2 bg-[#DCCCB0]/30 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-[#DCCCB0]/40" />)}
            </div>
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-40 bg-white rounded-2xl border border-[#DCCCB0]/40" />)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="py-2.5 border-b border-gray-50 last:border-0">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</span>
      <span className="block text-sm font-semibold text-[#0D3326]">{value}</span>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function ConfirmModal({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-bold text-[#0D3326] mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} disabled={loading}
            className="rounded-lg border border-[#DCCCB0] px-4 py-2 text-sm font-semibold text-[#0D3326] hover:bg-[#F3EBDD] transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className={`rounded-lg px-5 py-2 text-sm font-bold text-white transition-colors disabled:opacity-50 ${confirmClass}`}>
            {loading ? "Updating…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "success" ? "bg-[#0D3326] text-white" : "bg-red-600 text-white";
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-xl ${bg}`}>
      {type === "success" ? <CheckCircle className="h-5 w-5 text-[#D7AE62]" /> : <AlertCircle className="h-5 w-5" />}
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="h-4 w-4" /></button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminPropertyDetailPage({ params }) {
  const router = useRouter();
  // Next.js 15 / React 19: params is a Promise — unwrap with React.use()
  const { id: documentId } = use(params);
  console.log("[Admin Property Detail] route id:", documentId);

  const [property, setProperty]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [notFound, setNotFound]   = useState(false);

  // Modal state
  const [modal, setModal]         = useState(null); // { action: "approve"|"reject" }
  const [actionLoading, setActionLoading] = useState(false);

  // Toast
  const [toast, setToast]         = useState(null); // { message, type }

  // Image gallery
  const [activeImg, setActiveImg] = useState(0);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) { router.replace("/admin/login"); return; }
    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchProperty = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      // Strapi v5: fetch by documentId. Raw string to avoid %5B%5D encoding.
      const query =
        "populate[Owner]=true" +
        "&populate[CoverImage]=true" +
        "&populate[PropertyImage]=true" +
        "&populate[PropertyCommonDetails]=true" +
        "&populate[ResidentialDetails]=true" +
        "&populate[CommercialDetails]=true" +
        "&populate[IndustrialDetails]=true" +
        "&populate[PropertyAmenities]=true" +
        "&populate[enquiries]=true";

      const res = await fetch(`${API_URL}/properties/${documentId}?${query}`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (res.status === 404) { setNotFound(true); return; }
      if (!res.ok) throw new Error(`Strapi ${res.status}`);

      const json = await res.json();

      // Strapi v5: response is { data: { id, documentId, ...fields }, meta: {} }
      // No "attributes" wrapper.
      const raw = json?.data;
      if (!raw) { setNotFound(true); return; }

      // Normalise: if old v4 shape (has attributes), flatten it; v5 is already flat.
      const flat = raw.attributes
        ? { id: raw.id, documentId: raw.documentId, ...raw.attributes }
        : raw;

      setProperty(flat);
      setActiveImg(0);
    } catch (err) {
      console.error("[AdminPropertyDetail] fetch error:", err);
      setError("Unable to load property. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  // ── Status update ───────────────────────────────────────────────────────────
  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/properties/${documentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ data: { PropertyStatus: newStatus } }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error?.message || `Strapi ${res.status}`);
      }
      setModal(null);
      setToast({ message: `Property status updated to ${newStatus} successfully.`, type: "success" });
      await fetchProperty();
    } catch (err) {
      console.error("[AdminPropertyDetail] update error:", err);
      setToast({ message: err.message || "Failed to update property status.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (loading) return <Skeleton />;

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#F3EBDD]">
        <AdminHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl bg-white p-12 shadow-sm border border-[#DCCCB0]/40">
            <Home className="mx-auto h-14 w-14 text-[#DCCCB0] mb-4" />
            <h2 className="text-xl font-bold text-[#0D3326] mb-2">Property not found</h2>
            <p className="text-sm text-gray-500 mb-6">The property with ID <code className="font-mono bg-gray-100 px-1 rounded">{documentId}</code> does not exist.</p>
            <Link href="/admin/properties"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0D3326] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#174638] transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back to Properties
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F3EBDD]">
        <AdminHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl bg-white p-12 shadow-sm border border-red-100">
            <AlertCircle className="mx-auto h-14 w-14 text-red-400 mb-4" />
            <h2 className="text-xl font-bold text-[#0D3326] mb-2">Unable to load property</h2>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={fetchProperty}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0D3326] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#174638] transition-colors">
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
              <Link href="/admin/properties"
                className="inline-flex items-center gap-2 rounded-lg border border-[#DCCCB0] bg-white px-5 py-2.5 text-sm font-bold text-[#0D3326] hover:bg-[#F3EBDD] transition-colors">
                <ChevronLeft className="h-4 w-4" /> Back to Properties
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!property) return null;

  // ── Destructure real Strapi fields ──────────────────────────────────────────
  const {
    id: numericId,
    Title,
    Description,
    Property_Type,
    Purpose,
    Category,
    Price,
    PriceUnits,
    PropertyStatus,
    Area,
    City,
    State,
    PinCode,
    Address,
    GoogleMapLink,
    CoverImage,
    PropertyImage,
    Owner,
    enquiries = [],
    PropertyCommonDetails,
    ResidentialDetails,
    CommercialDetails,
    IndustrialDetails,
    PropertyAmenities,
    createdAt,
    updatedAt,
    publishedAt,
  } = property;

  // ── Image gallery ────────────────────────────────────────────────────────────
  const allImages = [];
  if (CoverImage?.url) allImages.push(`${STRAPI_BASE}${CoverImage.url}`);
  if (Array.isArray(PropertyImage)) {
    PropertyImage.forEach(img => { if (img?.url) allImages.push(`${STRAPI_BASE}${img.url}`); });
  }

  // ── Seller ───────────────────────────────────────────────────────────────────
  const ownerName  = Owner?.name || Owner?.username || null;
  const ownerEmail = Owner?.email || null;
  const ownerPhone = Owner?.phone || null;

  // ── Property details ─────────────────────────────────────────────────────────
  const bedrooms  = ResidentialDetails?.Bedrooms;
  const bathrooms = ResidentialDetails?.Bathrooms;
  const balconies = ResidentialDetails?.Balconies;
  const furnishing = ResidentialDetails?.Furnishing;
  const floorNo   = ResidentialDetails?.FloorNo;
  const totalFloors = ResidentialDetails?.TotalFloors;

  const carpetArea  = PropertyCommonDetails?.CarpetArea;
  const builtUpArea = PropertyCommonDetails?.Built_upArea;
  const propAge     = PropertyCommonDetails?.PropertyAge;
  const facing      = PropertyCommonDetails?.Facing;
  const areaUnit    = PropertyCommonDetails?.Area_Unit;

  // ── Amenities ────────────────────────────────────────────────────────────────
  const amenityEntries = PropertyAmenities
    ? Object.entries(PropertyAmenities).filter(([k, v]) => k !== "id" && typeof v === "boolean" && v)
    : [];

  // ── Approve/Reject support ───────────────────────────────────────────────────
  const canApprove = CAN_APPROVE.includes(PropertyStatus);
  const canReject  = CAN_REJECT.includes(PropertyStatus);

  // ── Format helpers ───────────────────────────────────────────────────────────
  const fmtDate = (d) => d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "N/A";
  const fmtPrice = () => {
    if (!Price) return null;
    const num = parseFloat(Price);
    if (isNaN(num)) return `₹${Price}${PriceUnits ? ` ${PriceUnits}` : ""}`;
    return `₹${num.toLocaleString("en-IN")}${PriceUnits ? ` ${PriceUnits}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-[#F3EBDD] font-sans">
      <AdminHeader />

      {/* Modals */}
      <ConfirmModal
        open={modal?.action === "approve"}
        title="Approve Property?"
        message="Are you sure you want to approve this property? It will become Active and visible to buyers."
        confirmLabel="Approve Property"
        confirmClass="bg-[#0D3326] hover:bg-[#174638]"
        loading={actionLoading}
        onConfirm={() => handleStatusUpdate("ACTIVE")}
        onCancel={() => setModal(null)}
      />
      <ConfirmModal
        open={modal?.action === "reject"}
        title="Reject Property?"
        message="Are you sure you want to reject this property? The seller will need to resubmit."
        confirmLabel="Reject Property"
        confirmClass="bg-red-600 hover:bg-red-700"
        loading={actionLoading}
        onConfirm={() => handleStatusUpdate("INACTIVE")}
        onCancel={() => setModal(null)}
      />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Back + Status bar ─────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/admin/properties"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#0D3326] hover:text-[#D7AE62] transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Properties
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={PropertyStatus} />
            {canApprove && (
              <button onClick={() => setModal({ action: "approve" })}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0D3326] px-4 py-2 text-sm font-bold text-white hover:bg-[#174638] transition-colors shadow-sm">
                <CheckCircle className="h-4 w-4" /> Approve Property
              </button>
            )}
            {canReject && (
              <button onClick={() => setModal({ action: "reject" })}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100 transition-colors">
                <X className="h-4 w-4" /> Reject Property
              </button>
            )}
          </div>
        </div>

        {/* ── Hero: Gallery + Summary ────────────────────────────────────────── */}
        <div className="rounded-2xl bg-white shadow-lg border border-[#DCCCB0]/40 overflow-hidden mb-6">

          {/* Image Gallery */}
          <div className="relative h-72 sm:h-96 bg-[#0D3326]">
            {allImages.length > 0 ? (
              <>
                <img
                  key={activeImg}
                  src={allImages[activeImg]}
                  alt={Title || "Property"}
                  className="w-full h-full object-cover"
                />
                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {allImages.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`h-14 w-20 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? "border-[#D7AE62] scale-105" : "border-white/30 opacity-70 hover:opacity-100"}`}
                      >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                {/* Nav arrows */}
                {allImages.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg(i => (i - 1 + allImages.length) % allImages.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={() => setActiveImg(i => (i + 1) % allImages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
                <Home className="h-20 w-20 mb-3 opacity-20" />
                <span className="text-sm font-semibold opacity-40">No Image Available</span>
              </div>
            )}
            {/* Gradient overlay for title */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none" style={{ paddingBottom: allImages.length > 1 ? "5.5rem" : "1.25rem" }}>
              <div className="flex flex-wrap gap-2 mb-2">
                {Property_Type && (
                  <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur px-2 py-0.5 rounded uppercase tracking-wider">
                    {Property_Type}
                  </span>
                )}
                {Purpose && (
                  <span className="text-[10px] font-bold text-[#D7AE62] bg-black/30 backdrop-blur px-2 py-0.5 rounded uppercase tracking-wider">
                    For {Purpose}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug drop-shadow">{Title || "Untitled Property"}</h1>
              <p className="mt-1 text-white/80 text-sm flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                {[Address, Area, City].filter(Boolean).join(", ") || "Location N/A"}
              </p>
            </div>
          </div>

          {/* Price bar */}
          <div className="bg-[#0D3326] px-6 py-4 flex flex-wrap items-center gap-6 border-b-4 border-[#D7AE62]">
            <div>
              <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-0.5">Price</div>
              <div className="text-2xl font-extrabold text-[#D7AE62]">{fmtPrice() || "Price N/A"}</div>
            </div>
            {Category && (
              <div>
                <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-0.5">Category</div>
                <div className="text-base font-semibold text-white">{Category}</div>
              </div>
            )}
            <div className="ml-auto text-xs text-white/50 font-semibold">
              {enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"}
            </div>
          </div>
        </div>

        {/* ── Quick stats strip ─────────────────────────────────────────────── */}
        {(bedrooms || bathrooms || carpetArea || builtUpArea || propAge || facing || areaUnit) && (
          <div className="mb-6 rounded-2xl bg-white border border-[#DCCCB0]/40 shadow-sm px-6 py-4">
            <div className="flex flex-wrap gap-6">
              {bedrooms && (
                <div className="flex flex-col items-center gap-1">
                  <Home className="h-5 w-5 text-[#9B6848]" />
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">BHK</span>
                  <span className="text-sm font-bold text-[#0D3326]">{bedrooms}</span>
                </div>
              )}
              {bathrooms && (
                <div className="flex flex-col items-center gap-1">
                  <Bath className="h-5 w-5 text-[#9B6848]" />
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Baths</span>
                  <span className="text-sm font-bold text-[#0D3326]">{bathrooms}</span>
                </div>
              )}
              {carpetArea && (
                <div className="flex flex-col items-center gap-1">
                  <Maximize className="h-5 w-5 text-[#9B6848]" />
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Carpet</span>
                  <span className="text-sm font-bold text-[#0D3326]">{carpetArea} {areaUnit || ""}</span>
                </div>
              )}
              {builtUpArea && (
                <div className="flex flex-col items-center gap-1">
                  <Building className="h-5 w-5 text-[#9B6848]" />
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Built-up</span>
                  <span className="text-sm font-bold text-[#0D3326]">{builtUpArea} {areaUnit || ""}</span>
                </div>
              )}
              {propAge && (
                <div className="flex flex-col items-center gap-1">
                  <Calendar className="h-5 w-5 text-[#9B6848]" />
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Age</span>
                  <span className="text-sm font-bold text-[#0D3326]">{propAge}</span>
                </div>
              )}
              {facing && (
                <div className="flex flex-col items-center gap-1">
                  <ArrowRight className="h-5 w-5 text-[#9B6848]" />
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Facing</span>
                  <span className="text-sm font-bold text-[#0D3326]">{facing}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Main grid: Left col + Right col ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <section className="rounded-2xl bg-white border border-[#DCCCB0]/40 shadow-sm p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#0D3326] mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#D7AE62]" /> About This Property
              </h2>
              {Description ? (
                <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                  {Array.isArray(Description)
                    ? Description.map((block, i) => {
                        const text = block?.children?.map(c => c.text || "").join("") || "";
                        return text ? <p key={i}>{text}</p> : null;
                      })
                    : <p>{Description}</p>
                  }
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No description provided.</p>
              )}
            </section>

            {/* Property Information */}
            <section className="rounded-2xl bg-white border border-[#DCCCB0]/40 shadow-sm p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#0D3326] mb-4 flex items-center gap-2">
                <Building className="h-4 w-4 text-[#D7AE62]" /> Property Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <div>
                  <InfoRow label="Property Type" value={Property_Type} />
                  <InfoRow label="Purpose" value={Purpose ? `For ${Purpose}` : null} />
                  <InfoRow label="Category" value={Category} />
                  <InfoRow label="Status" value={PropertyStatus} />
                  <InfoRow label="Property Age" value={propAge} />
                  <InfoRow label="Facing" value={facing} />
                  <InfoRow label="Furnishing" value={furnishing} />
                </div>
                <div>
                  <InfoRow label="Carpet Area" value={carpetArea ? `${carpetArea} ${areaUnit || ""}`.trim() : null} />
                  <InfoRow label="Built-up Area" value={builtUpArea ? `${builtUpArea} ${areaUnit || ""}`.trim() : null} />
                  <InfoRow label="Bedrooms" value={bedrooms} />
                  <InfoRow label="Bathrooms" value={bathrooms} />
                  <InfoRow label="Balconies" value={balconies} />
                  <InfoRow label="Floor" value={floorNo && totalFloors ? `${floorNo} / ${totalFloors}` : (floorNo || null)} />
                </div>
              </div>
            </section>

            {/* Amenities */}
            {amenityEntries.length > 0 && (
              <section className="rounded-2xl bg-white border border-[#DCCCB0]/40 shadow-sm p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#0D3326] mb-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#D7AE62]" /> Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenityEntries.map(([key]) => (
                    <div key={key} className="flex items-center gap-2.5 bg-[#F3EBDD] border border-[#DCCCB0] rounded-lg px-3 py-2.5">
                      <div className="h-2 w-2 rounded-full bg-[#D7AE62] flex-shrink-0" />
                      <span className="text-xs font-semibold text-[#0D3326]">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Location */}
            <section className="rounded-2xl bg-white border border-[#DCCCB0]/40 shadow-sm p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#0D3326] mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#D7AE62]" /> Location
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <InfoRow label="Address" value={Address} />
                <InfoRow label="Area / Locality" value={Area} />
                <InfoRow label="City" value={City} />
                <InfoRow label="State" value={State} />
                <InfoRow label="PIN Code" value={PinCode} />
              </div>
              {GoogleMapLink && (
                <a href={GoogleMapLink} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#0D3326] hover:text-[#D7AE62] transition-colors">
                  Open in Google Maps <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}
            </section>

            {/* Listing Details */}
            <section className="rounded-2xl bg-white border border-[#DCCCB0]/40 shadow-sm p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#0D3326] mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#D7AE62]" /> Listing Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <InfoRow label="Property ID" value={documentId || numericId} />
                <InfoRow label="Numeric ID" value={numericId} />
                <InfoRow label="Created At" value={fmtDate(createdAt)} />
                <InfoRow label="Updated At" value={fmtDate(updatedAt)} />
                <InfoRow label="Published At" value={fmtDate(publishedAt)} />
              </div>
            </section>

          </div>

          {/* RIGHT column */}
          <div className="space-y-5">

            {/* Admin Review Panel */}
            <div className="rounded-2xl border-2 border-[#D7AE62]/40 bg-[#0D3326] p-5 text-white shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D7AE62] mb-4 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Admin Review
              </h3>
              <div className="space-y-3 mb-5">
                <div>
                  <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Current Status</span>
                  <div className="mt-1">
                    <StatusBadge status={PropertyStatus} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Submitted By</span>
                  <p className="text-sm font-semibold text-white mt-0.5">{ownerName || "Unknown Seller"}</p>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Submitted On</span>
                  <p className="text-sm font-semibold text-white mt-0.5">{fmtDate(createdAt)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Last Updated</span>
                  <p className="text-sm font-semibold text-white mt-0.5">{fmtDate(updatedAt)}</p>
                </div>
              </div>
              {canApprove && (
                <button onClick={() => setModal({ action: "approve" })}
                  className="w-full rounded-xl bg-[#D7AE62] hover:bg-[#c49a50] text-[#0D3326] font-bold py-2.5 text-sm transition-colors mb-2">
                  ✓ Approve Property
                </button>
              )}
              {canReject && (
                <button onClick={() => setModal({ action: "reject" })}
                  className="w-full rounded-xl bg-white/10 hover:bg-red-600 text-white font-bold py-2.5 text-sm transition-colors border border-white/20">
                  ✕ Reject Property
                </button>
              )}
              {!canApprove && !canReject && (
                <p className="text-xs text-white/50 text-center italic">No further actions available for current status.</p>
              )}
            </div>

            {/* Seller Information */}
            <div className="rounded-2xl bg-[#F3EBDD] border border-[#DCCCB0] p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-[#D7AE62]" /> Seller Information
              </h3>
              {ownerName ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-11 w-11 rounded-full bg-[#0D3326] text-white flex items-center justify-center text-lg font-extrabold flex-shrink-0">
                      {ownerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#0D3326] text-sm">{ownerName}</p>
                      {ownerEmail && <p className="text-xs text-gray-500 mt-0.5">{ownerEmail}</p>}
                      {ownerPhone && <p className="text-xs text-gray-500 mt-0.5">{ownerPhone}</p>}
                    </div>
                  </div>
                  {Owner?.id && (
                    <Link href={`/admin/users/${Owner.id}`}
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-white border border-[#DCCCB0] text-[#0D3326] text-xs font-bold py-2 hover:bg-[#0D3326] hover:text-white transition-colors">
                      View Seller Profile <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">Seller information unavailable.</p>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
