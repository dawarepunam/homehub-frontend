"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  ChevronRight,
  Heart,
  Home,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  User,
  X,
  AlertCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { getUserProfile, updateUserProfile, uploadMedia } from "@/services/userProfile";
import { getUserWishlist } from "@/services/wishlistService";
import { getMyEnquiries } from "@/services/enquiry";

/* ─── Constants ─────────────────────────────────────────────────────── */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

/* ─── Utility helpers ───────────────────────────────────────────────── */

function getMediaUrl(media) {
  if (!media) return null;
  const raw = Array.isArray(media) ? media[0] : media;
  const item = raw?.data || raw;
  const attrs = item?.attributes || item;
  const url = attrs?.formats?.large?.url || attrs?.formats?.medium?.url || attrs?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

function getMediaId(media) {
  if (!media) return null;
  const raw = Array.isArray(media) ? media[0] : media;
  const item = raw?.data || raw;
  const attrs = item?.attributes || item;
  return attrs?.id || item?.id || null;
}

function getPropertyImageUrl(property) {
  if (!property) return null;
  const rawCover = property?.CoverImage;
  const cover = Array.isArray(rawCover) ? rawCover[0] : rawCover;
  const coverData = cover?.data || cover;
  const coverAttrs = coverData?.attributes || coverData;
  if (coverAttrs?.url) {
    return coverAttrs.url.startsWith("http") ? coverAttrs.url : `${STRAPI_URL}${coverAttrs.url}`;
  }
  return null;
}

function formatPrice(property) {
  const p = property?.attributes || property || {};
  const raw = p?.Price ?? p?.PropertyCommonDetails?.Price ?? p?.price;
  const units = p?.PriceUnits || p?.PropertyCommonDetails?.PriceUnits || "";
  if (raw === null || raw === undefined || raw === "") return "Price on Request";
  const num = Number(raw);
  if (isNaN(num)) return "Price on Request";
  const formatted = `Rs.${new Intl.NumberFormat("en-IN").format(num)}`;
  return units ? `${formatted} ${units}` : formatted;
}

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/* ─── Small reusable UI ─────────────────────────────────────────────── */

function EnquiryStatusBadge({ status }) {
  const map = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Contacted: "bg-[#E8F4F0] text-[#0D3326] border-[#0D3326]/20",
    Replied: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Closed: "bg-[#F7F4EF] text-[#0D3326]/50 border-[#E5DDD0]",
  };
  const cls = map[status] || "bg-[#F7F4EF] text-[#0D3326]/50 border-[#E5DDD0]";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${cls}`}>
      {status || "Unknown"}
    </span>
  );
}

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#E5DDD0] last:border-0">
      {Icon && <Icon size={15} className="mt-0.5 shrink-0 text-[#0D3326]/40" />}
      <div className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0D3326]/50">{label}</span>
        {value ? (
          <span className="mt-0.5 block text-sm font-semibold text-[#0D3326] break-words">{value}</span>
        ) : (
          <span className="mt-0.5 block text-sm italic text-[#0D3326]/35">Not added yet</span>
        )}
      </div>
    </div>
  );
}

function NotificationToggle({ label, description, icon: Icon, value, onChange, loading }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#E5DDD0] last:border-0">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7F4EF]">
          <Icon size={16} className="text-[#0D3326]" />
        </div>
        <div>
          <span className="block text-sm font-bold text-[#0D3326]">{label}</span>
          {description && <span className="mt-0.5 block text-[11px] text-[#0D3326]/50">{description}</span>}
        </div>
      </div>
      <button
        type="button"
        disabled={loading}
        onClick={() => onChange(!value)}
        aria-checked={value}
        role="switch"
        className={`relative ml-4 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${value ? "bg-[#0D3326]" : "bg-[#E5DDD0]"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

function SectionCard({ icon: Icon, title, onEdit, children }) {
  return (
    <section className="rounded-2xl border border-[#E5DDD0] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E5DDD0] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F4EF]">
            <Icon size={14} className="text-[#0D3326]" />
          </div>
          <h2 className="text-sm font-extrabold text-[#0D3326]">{title}</h2>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5DDD0] bg-white px-3 py-1.5 text-xs font-bold text-[#0D3326] transition hover:bg-[#F7F4EF]"
          >
            <Pencil size={11} />Edit
          </button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function SavedMiniCard({ property }) {
  const docId = property?.documentId || property?.id;
  const title = property?.Title || "Untitled Property";
  const city = property?.City || "";
  const area = property?.Locality || property?.Area || "";
  const location = [area, city].filter(Boolean).join(", ");
  const purpose = property?.Purpose || "";
  const type = property?.Property_Type || "";
  const price = formatPrice(property);
  const imageUrl = getPropertyImageUrl(property);
  return (
    <Link href={`/user/property/${docId}`} className="group flex flex-col overflow-hidden rounded-xl border border-[#E5DDD0] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-28 overflow-hidden bg-[#EAE5DC]">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        ) : (
          <div className="flex h-full items-center justify-center"><Building2 size={22} className="text-[#0D3326]/20" /></div>
        )}
        {purpose && <span className="absolute right-2 top-2 rounded-full bg-[#0D3326] px-2 py-0.5 text-[10px] font-bold text-[#D7AE62]">{purpose === "Sale" ? "For Sale" : "For Rent"}</span>}
      </div>
      <div className="flex flex-col p-3">
        <p className="line-clamp-1 text-sm font-extrabold text-[#0D3326]">{title}</p>
        {location && <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#0D3326]/50"><MapPin size={9} className="text-[#D7AE62]" /><span className="line-clamp-1">{location}</span></p>}
        <p className="mt-1 text-sm font-extrabold text-[#D7AE62]">{price}</p>
      </div>
    </Link>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="overflow-hidden rounded-2xl border border-[#E5DDD0] bg-white">
        <div className="h-48 bg-[#E5DDD0]" />
        <div className="px-8 pb-8 pt-0">
          <div className="-mt-14 flex items-end gap-5">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-[#E5DDD0]" />
            <div className="mb-2 space-y-2"><div className="h-7 w-44 rounded-full bg-[#E5DDD0]" /><div className="h-4 w-28 rounded-full bg-[#E5DDD0]" /></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-2xl bg-[#E5DDD0]" />)}</div>
    </div>
  );
}

/* ─── Inline Edit Modal ──────────────────────────────────────────────── */

function EditModal({ title, onClose, onSave, saving, children }) {
  const ref = useRef(null);
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div ref={ref} className="relative w-full max-w-lg rounded-2xl border border-[#E5DDD0] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5DDD0] px-6 py-4">
          <h3 className="text-base font-extrabold text-[#0D3326]">Edit {title}</h3>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0D3326]/50 transition hover:bg-[#F7F4EF] hover:text-[#0D3326]">
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
          {children}
        </div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E5DDD0] px-6 py-4">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-[#E5DDD0] px-5 py-2.5 text-sm font-bold text-[#0D3326] transition hover:bg-[#F7F4EF] disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-2.5 text-sm font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f] disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-[#E5DDD0] bg-[#FDFAF6] px-4 py-2.5 text-sm font-semibold text-[#0D3326] outline-none transition placeholder:text-[#0D3326]/30 focus:border-[#0D3326] focus:ring-2 focus:ring-[#0D3326]/10";

/* ─── Main Component ─────────────────────────────────────────────────── */

export default function ProfilePageClient() {
  const [profile, setProfile] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifSaving, setNotifSaving] = useState(false);
  const [user, setUser] = useState(null);

  /* ── modal state ── */
  const [activeModal, setActiveModal] = useState(null); // "personal" | "professional" | "address" | "bio" | "cover" | "photo"
  const [modalSaving, setModalSaving] = useState(false);
  const [modalValues, setModalValues] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  /* ── load ── */
  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let storedUser = null;
      if (typeof window !== "undefined") {
        try { storedUser = JSON.parse(localStorage.getItem("user") || "{}"); } catch { storedUser = {}; }
      }
      setUser(storedUser);
      const [profileResult, wishlistResult, enquiriesResult] = await Promise.allSettled([
        getUserProfile(),
        getUserWishlist(),
        getMyEnquiries(),
      ]);
      if (profileResult.status === "fulfilled") setProfile(profileResult.value);
      if (wishlistResult.status === "fulfilled") {
        const wl = wishlistResult.value;
        let props = wl?.Wishlist?.properties || wl?.properties || [];
        if (props?.data) props = props.data;
        if (!Array.isArray(props)) props = [];
        const seen = new Set();
        const unique = [];
        props.forEach((p) => {
          const id = p?.documentId || p?.id;
          if (id && !seen.has(String(id))) { seen.add(String(id)); unique.push(p?.data ?? p); }
        });
        setSavedProperties(unique);
      }
      if (enquiriesResult.status === "fulfilled") setEnquiries(enquiriesResult.value || []);
    } catch (err) {
      setError(err?.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  /* ── derived values ── */
  const profileDetails = profile?.ProfileDetails || {};
  const settings = profile?.Settings || {};
  const username = user?.username || "";
  const email = user?.email || profileDetails?.Email || "";
  const firstName = profileDetails?.FirstName || "";
  const lastName = profileDetails?.LastName || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || username || "HomeHub Member";
  const initials = getInitials(fullName);
  const city = profileDetails?.City || "";
  const state = profileDetails?.State || "";
  const locationStr = [city, state].filter(Boolean).join(", ");
  const profileImageUrl = getMediaUrl(profileDetails?.ProfileImage);
  const coverImageUrl = getMediaUrl(profileDetails?.CoverImage);
  const savedCount = savedProperties.length;
  const enquiryCount = enquiries.length;
  const recentEnquiries = enquiries.slice(0, 4);
  const previewProperties = savedProperties.slice(0, 3);
  const isVerified = profileDetails?.IsVerified === true;
  const allFields = [firstName, lastName, profileDetails?.Phone, profileDetails?.Gender, profileDetails?.DOB, profileDetails?.Address, city, state, profileDetails?.pincode, profileDetails?.Bio, profileDetails?.Occupation, profileDetails?.Company, profileImageUrl, coverImageUrl];
  const completionScore = Math.round((allFields.filter(Boolean).length / allFields.length) * 100);

  /* ── open modal ── */
  function openModal(type) {
    const pd = profile?.ProfileDetails || {};
    if (type === "personal") {
      setModalValues({ FirstName: pd.FirstName || "", LastName: pd.LastName || "", Phone: pd.Phone || "", Gender: pd.Gender || "", DOB: pd.DOB || "" });
    } else if (type === "professional") {
      setModalValues({ Occupation: pd.Occupation || "", Company: pd.Company || "" });
    } else if (type === "address") {
      setModalValues({ Address: pd.Address || "", City: pd.City || "", State: pd.State || "", pincode: pd.pincode || "" });
    } else if (type === "bio") {
      setModalValues({ Bio: pd.Bio || "" });
    }
    setActiveModal(type);
  }

  function closeModal() {
    setActiveModal(null);
    setModalValues({});
    setPhotoFile(null);
    setPhotoPreview(null);
    setCoverFile(null);
    setCoverPreview(null);
    setModalSaving(false);
  }

  function mv(field, value) {
    setModalValues((prev) => ({ ...prev, [field]: value }));
  }

  /* ── save modal ── */
  async function saveModal() {
    const docId = profile?.documentId || profile?.id;
    if (!docId) { toast.error("Profile ID not found. Please refresh."); return; }
    setModalSaving(true);
    try {
      const pd = profile?.ProfileDetails || {};
      
      // Clean up the existing pd object to prevent Strapi component relations error.
      // We explicitly omit 'id' and pass all other fields to recreate/update the component safely.
      const { id: _ignore, ...existingFields } = pd;
      
      const existingProfileImageId = getMediaId(pd.ProfileImage);
      const existingCoverImageId = getMediaId(pd.CoverImage);

      let profileDetailsPayload = { ...existingFields };

      // Ensure existing images are preserved by default as IDs
      if (existingProfileImageId) profileDetailsPayload.ProfileImage = existingProfileImageId;
      if (existingCoverImageId) profileDetailsPayload.CoverImage = existingCoverImageId;

      if (activeModal === "photo") {
        if (!photoFile) { closeModal(); return; }
        const uploaded = await uploadMedia(photoFile);
        if (!uploaded?.id) throw new Error("Image upload failed");
        profileDetailsPayload.ProfileImage = uploaded.id;

      } else if (activeModal === "cover") {
        if (!coverFile) { closeModal(); return; }
        const uploaded = await uploadMedia(coverFile);
        if (!uploaded?.id) throw new Error("Image upload failed");
        profileDetailsPayload.CoverImage = uploaded.id;

      } else {
        // Text-based modals (personal, professional, address, bio)
        profileDetailsPayload = { ...profileDetailsPayload, ...modalValues };
      }

      await updateUserProfile(docId, { ProfileDetails: profileDetailsPayload });

      // ── Sync profile data into localStorage so Header avatar/name updates ──
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);

          // Always sync name fields from the final payload
          const finalPd = { ...profileDetailsPayload, ...( activeModal !== "photo" && activeModal !== "cover" ? modalValues : {}) };
          if (finalPd.FirstName !== undefined) parsed.firstName = finalPd.FirstName || "";
          if (finalPd.LastName  !== undefined) parsed.lastName  = finalPd.LastName  || "";

          // Sync profile image if photo was changed
          if (activeModal === "photo" || activeModal === "cover") {
            const freshProfile = await (await import("@/services/userProfile")).getUserProfile();
            const freshImg = freshProfile?.ProfileDetails?.ProfileImage;
            const buildUrl = (media) => {
              const m = media?.data?.attributes || media;
              const url = m?.formats?.medium?.url || m?.formats?.small?.url || m?.url;
              if (!url) return null;
              return url.startsWith("http") ? url : `${STRAPI_URL.replace(/\/$/, "")}${url}`;
            };
            parsed.profileImage = buildUrl(freshImg) || null;
          }

          localStorage.setItem("user", JSON.stringify(parsed));
          window.dispatchEvent(new Event("userProfileUpdated"));
        }
      } catch (_) {
        // Non-fatal — header will sync on next refresh
      }

      toast.success("Saved successfully!", { style: { background: "#0D3326", color: "#D7AE62", fontWeight: "bold" } });
      closeModal();
      await loadAll();
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err?.message || "Failed to save. Please try again.");
    } finally {
      setModalSaving(false);
    }
  }

  /* ── notifications ── */
  const handleNotifToggle = async (field, newValue) => {
    if (!profile?.documentId) return;
    setNotifSaving(true);
    const prev = profile;
    const updatedSettings = { ...profile.Settings, [field]: newValue };
    setProfile((p) => ({ ...p, Settings: updatedSettings }));
    try {
      const settingsPayload = { ...updatedSettings };
      if (profile.Settings?.id) settingsPayload.id = profile.Settings.id;
      await updateUserProfile(profile.documentId, { Settings: settingsPayload });
      toast.success("Saved!", { style: { background: "#0D3326", color: "#D7AE62", fontWeight: "bold" } });
    } catch {
      setProfile(prev);
      toast.error("Failed to save preference.");
    } finally {
      setNotifSaving(false);
    }
  };

  /* ── logout ── */
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("jwt");
      localStorage.removeItem("strapi_jwt");
      localStorage.removeItem("user");
    }
    window.location.href = "/user/login";
  };

  /* ── image handlers ── */
  function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleCoverSelect(e) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  /* ── render states ── */
  if (loading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5DDD0] bg-white p-16 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <h2 className="mt-4 text-lg font-extrabold text-[#0D3326]">Unable to Load Profile</h2>
        <p className="mt-1 text-sm text-[#0D3326]/60">{error}</p>
        <button type="button" onClick={loadAll} className="mt-6 flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f]">
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  /* ─────────────── MAIN RENDER ─────────────── */
  return (
    <>
      <Toaster position="top-right" />

      {/* ── Modals ── */}

      {activeModal === "personal" && (
        <EditModal title="Personal Information" onClose={closeModal} onSave={saveModal} saving={modalSaving}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First Name"><input className={inputCls} value={modalValues.FirstName} onChange={(e) => mv("FirstName", e.target.value)} placeholder="First name" /></Field>
            <Field label="Last Name"><input className={inputCls} value={modalValues.LastName} onChange={(e) => mv("LastName", e.target.value)} placeholder="Last name" /></Field>
            <Field label="Phone"><input className={inputCls} type="tel" value={modalValues.Phone} onChange={(e) => mv("Phone", e.target.value)} placeholder="Phone number" /></Field>
            <Field label="Gender">
              <select className={inputCls} value={modalValues.Gender} onChange={(e) => mv("Gender", e.target.value)}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Date of Birth"><input className={inputCls} type="date" value={modalValues.DOB} onChange={(e) => mv("DOB", e.target.value)} /></Field>
          </div>
        </EditModal>
      )}

      {activeModal === "professional" && (
        <EditModal title="Professional Information" onClose={closeModal} onSave={saveModal} saving={modalSaving}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Occupation"><input className={inputCls} value={modalValues.Occupation} onChange={(e) => mv("Occupation", e.target.value)} placeholder="Your occupation" /></Field>
            <Field label="Company"><input className={inputCls} value={modalValues.Company} onChange={(e) => mv("Company", e.target.value)} placeholder="Company name" /></Field>
          </div>
        </EditModal>
      )}

      {activeModal === "address" && (
        <EditModal title="Address" onClose={closeModal} onSave={saveModal} saving={modalSaving}>
          <div className="grid gap-4">
            <Field label="Full Address"><textarea className={`${inputCls} resize-none`} rows={3} value={modalValues.Address} onChange={(e) => mv("Address", e.target.value)} placeholder="Enter your full address" /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="City"><input className={inputCls} value={modalValues.City} onChange={(e) => mv("City", e.target.value)} placeholder="City" /></Field>
              <Field label="State"><input className={inputCls} value={modalValues.State} onChange={(e) => mv("State", e.target.value)} placeholder="State" /></Field>
              <Field label="Pincode"><input className={inputCls} value={modalValues.pincode} onChange={(e) => mv("pincode", e.target.value)} placeholder="Pincode" /></Field>
            </div>
          </div>
        </EditModal>
      )}

      {activeModal === "bio" && (
        <EditModal title="About Me" onClose={closeModal} onSave={saveModal} saving={modalSaving}>
          <Field label="Bio">
            <textarea className={`${inputCls} resize-none`} rows={5} value={modalValues.Bio} onChange={(e) => mv("Bio", e.target.value)} placeholder="Write a short introduction about yourself..." />
          </Field>
        </EditModal>
      )}

      {activeModal === "photo" && (
        <EditModal title="Profile Photo" onClose={closeModal} onSave={saveModal} saving={modalSaving}>
          <div className="flex flex-col items-center gap-5">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#E5DDD0] bg-[#F7F4EF]">
              {(photoPreview || profileImageUrl) ? (
                <img src={photoPreview || profileImageUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-[#0D3326]">{initials}</div>
              )}
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E5DDD0] bg-[#F7F4EF] px-5 py-2.5 text-sm font-bold text-[#0D3326] transition hover:bg-[#E5DDD0]">
              <Camera size={15} />Choose Photo
              <input type="file" accept="image/*" className="sr-only" onChange={handlePhotoSelect} />
            </label>
            {photoFile && <p className="text-xs text-[#0D3326]/60">Selected: {photoFile.name}</p>}
          </div>
        </EditModal>
      )}

      {activeModal === "cover" && (
        <EditModal title="Cover Image" onClose={closeModal} onSave={saveModal} saving={modalSaving}>
          <div className="flex flex-col gap-4">
            <div
              className="h-36 w-full rounded-xl overflow-hidden"
              style={coverPreview || coverImageUrl
                ? { backgroundImage: `url(${coverPreview || coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                : { background: "linear-gradient(135deg, #0D3326 0%, #1a4d3a 100%)" }}
            />
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E5DDD0] bg-[#F7F4EF] px-5 py-2.5 text-sm font-bold text-[#0D3326] transition hover:bg-[#E5DDD0]">
              <Camera size={15} />Choose Cover Image
              <input type="file" accept="image/*" className="sr-only" onChange={handleCoverSelect} />
            </label>
            {coverFile && <p className="text-xs text-[#0D3326]/60">Selected: {coverFile.name}</p>}
          </div>
        </EditModal>
      )}

      {/* ── Page Content ── */}
      <div className="mx-auto max-w-7xl space-y-5 pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0D3326]/60">
          <Link href="/user" className="flex items-center gap-1 transition hover:text-[#0D3326]"><Home size={13} /><span>Home</span></Link>
          <ChevronRight size={11} />
          <span className="text-[#0D3326]">My Profile</span>
        </nav>

        {/* Hero */}
        <div className="overflow-hidden rounded-2xl border border-[#E5DDD0] bg-white shadow-sm">
          {/* Cover */}
          <div
            className="relative h-48 w-full sm:h-56"
            style={coverImageUrl
              ? { backgroundImage: `url(${coverImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: "linear-gradient(135deg, #0D3326 0%, #1a4d3a 60%, #0D3326 100%)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25" />
            <button
              type="button"
              onClick={() => setActiveModal("cover")}
              className="absolute right-5 top-5 flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2 text-sm font-bold text-[#0D3326] shadow-sm backdrop-blur-sm transition hover:bg-white"
            >
              <Camera size={13} />Edit Cover
            </button>
          </div>

          {/* Profile info */}
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-5 -mt-14 sm:-mt-16">
                {/* Avatar */}
                <div className="relative shrink-0 z-10">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-md sm:h-36 sm:w-36">
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt={fullName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#F7F4EF] text-4xl font-extrabold text-[#0D3326]">{initials}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal("photo")}
                    className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#D7AE62] shadow-md transition hover:bg-[#C99A40]"
                    title="Change photo"
                  >
                    <Camera size={14} className="text-[#0D3326]" />
                  </button>
                </div>
                {/* Name */}
                <div className="mb-2 sm:mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-extrabold text-[#0D3326] sm:text-2xl">{fullName}</h1>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F4F0] px-2 py-0.5 text-[10px] font-bold text-emerald-700"><BadgeCheck size={11} />Verified</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[#F7F4EF] px-2 py-0.5 text-[10px] font-bold text-[#0D3326]/50">Verification Pending</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-[#0D3326]/60">Buyer</p>
                  {locationStr && <p className="mt-1 flex items-center gap-1 text-xs text-[#0D3326]/60"><MapPin size={12} className="text-[#D7AE62]" />{locationStr}</p>}
                  {profileDetails?.Bio && <p className="mt-2 max-w-md text-sm text-[#0D3326]/70 leading-relaxed">{profileDetails.Bio}</p>}
                </div>
              </div>
              <div className="pb-2">
                <button type="button" onClick={() => openModal("personal")} className="flex items-center gap-2 rounded-xl bg-[#0D3326] px-5 py-2.5 text-sm font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f]">
                  <Pencil size={14} />Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Link href="/user/wishlist" className="group flex flex-col items-center justify-center rounded-2xl border border-[#E5DDD0] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <Heart size={18} className="fill-red-500 text-red-500 mb-2" />
            <p className="text-3xl font-extrabold text-[#0D3326]">{savedCount}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0D3326]/50">Saved</p>
          </Link>
          <Link href="/user/enquiries" className="group flex flex-col items-center justify-center rounded-2xl border border-[#E5DDD0] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <MessageCircle size={18} className="text-[#0D3326] mb-2" />
            <p className="text-3xl font-extrabold text-[#0D3326]">{enquiryCount}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0D3326]/50">Enquiries</p>
          </Link>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5DDD0] bg-white p-5 shadow-sm">
            <div className="relative flex items-center justify-center mb-2">
              <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                <path stroke="#F7F4EF" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path stroke="#0D3326" strokeWidth="4" strokeDasharray={`${completionScore}, 100`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-[10px] font-extrabold text-[#0D3326]">{completionScore}%</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0D3326]/50">Complete</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5DDD0] bg-white p-5 shadow-sm">
            <ShieldCheck size={18} className="text-[#D7AE62] mb-2" />
            <p className="text-lg font-extrabold text-[#0D3326]">Active</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0D3326]/50">Account</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* LEFT */}
          <div className="space-y-5">

            <SectionCard icon={User} title="Personal Information" onEdit={() => openModal("personal")}>
              <InfoRow icon={User} label="Full Name" value={fullName} />
              <InfoRow icon={Mail} label="Email" value={email} />
              <InfoRow icon={Phone} label="Phone" value={profileDetails?.Phone} />
              <InfoRow icon={User} label="Gender" value={profileDetails?.Gender} />
              <InfoRow icon={Calendar} label="Date of Birth" value={profileDetails?.DOB ? formatDate(profileDetails.DOB) : null} />
            </SectionCard>

            <SectionCard icon={Briefcase} title="Professional Information" onEdit={() => openModal("professional")}>
              <InfoRow icon={Briefcase} label="Occupation" value={profileDetails?.Occupation} />
              <InfoRow icon={Building2} label="Company" value={profileDetails?.Company} />
            </SectionCard>

            <SectionCard icon={User} title="About Me" onEdit={() => openModal("bio")}>
              {profileDetails?.Bio ? (
                <p className="text-sm leading-relaxed text-[#0D3326]/80">{profileDetails.Bio}</p>
              ) : (
                <div className="rounded-xl bg-[#F7F4EF] p-4 text-center">
                  <p className="text-sm text-[#0D3326]/50">No introduction added yet.</p>
                  <button type="button" onClick={() => openModal("bio")} className="mt-2 text-xs font-bold text-[#D7AE62]">Add Introduction</button>
                </div>
              )}
            </SectionCard>

            <SectionCard icon={MapPin} title="Address" onEdit={() => openModal("address")}>
              <InfoRow icon={MapPin} label="Address" value={profileDetails?.Address} />
              <InfoRow icon={MapPin} label="City" value={city} />
              <InfoRow icon={MapPin} label="State" value={state} />
              <InfoRow icon={MapPin} label="Pincode" value={profileDetails?.pincode} />
            </SectionCard>

            {/* Saved Properties */}
            <SectionCard icon={Heart} title={`Saved Properties${savedCount > 0 ? ` (${savedCount})` : ""}`}>
              {previewProperties.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <Heart size={28} className="text-[#E5DDD0] mb-3" />
                  <p className="text-sm font-semibold text-[#0D3326]/60">No saved properties yet</p>
                  <Link href="/user/properties" className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#D7AE62]"><Search size={12} />Explore Properties</Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{previewProperties.map((p) => <SavedMiniCard key={p?.documentId || p?.id} property={p} />)}</div>
                  <div className="mt-4 border-t border-[#E5DDD0] pt-4">
                    <Link href="/user/wishlist" className="flex items-center justify-center gap-1 text-xs font-bold text-[#D7AE62]">View All Saved Properties <ChevronRight size={13} /></Link>
                  </div>
                </>
              )}
            </SectionCard>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <SectionCard icon={ShieldCheck} title="Account">
              <InfoRow icon={Mail} label="Email" value={email} />
              <InfoRow icon={Calendar} label="Member Since" value={profile?.createdAt ? formatDate(profile.createdAt) : "Recently"} />
              <div className="flex items-center justify-between py-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D3326]/50">Status</span>
                <span className="rounded-full bg-[#E8F4F0] px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">Active</span>
              </div>
            </SectionCard>

            <SectionCard icon={Bell} title="Notifications">
              <NotificationToggle label="Email Notifications" description="Enquiry updates via email" icon={Mail} value={!!settings?.Email_Notification} onChange={(val) => handleNotifToggle("Email_Notification", val)} loading={notifSaving} />
              <NotificationToggle label="SMS Notifications" description="SMS alerts for updates" icon={Phone} value={!!settings?.SMS_Notification} onChange={(val) => handleNotifToggle("SMS_Notification", val)} loading={notifSaving} />
              <NotificationToggle label="Push Notifications" description="Browser notifications" icon={Bell} value={!!settings?.Push_Notification} onChange={(val) => handleNotifToggle("Push_Notification", val)} loading={notifSaving} />
            </SectionCard>

            <SectionCard icon={Lock} title="Account & Security">
              <div className="space-y-2.5">
                <Link href="/user/settings" className="flex w-full items-center justify-between rounded-xl border border-[#E5DDD0] px-4 py-3.5 text-sm font-bold text-[#0D3326] transition hover:bg-[#F7F4EF]">
                  <span className="flex items-center gap-2.5"><KeyRound size={15} className="text-[#0D3326]/40" />Change Password</span>
                  <ChevronRight size={13} className="text-[#0D3326]/30" />
                </Link>
                <button type="button" onClick={handleLogout} className="flex w-full items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-100">
                  <span className="flex items-center gap-2.5"><LogOut size={15} />Sign Out</span>
                  <ChevronRight size={13} className="text-red-400" />
                </button>
              </div>
            </SectionCard>

            {/* Recent Enquiries */}
            <SectionCard icon={MessageCircle} title="Recent Enquiries">
              {recentEnquiries.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <MessageCircle size={26} className="text-[#E5DDD0] mb-2" />
                  <p className="text-sm font-semibold text-[#0D3326]/60">No enquiries yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-0.5">
                    {recentEnquiries.map((enquiry) => {
                      const eId = enquiry?.documentId || enquiry?.id;
                      const prop = enquiry?.property?.data || enquiry?.property || {};
                      const propTitle = prop?.Title || prop?.attributes?.Title || "Property";
                      const status = enquiry?.Status || enquiry?.attributes?.Status || "Pending";
                      const date = enquiry?.createdAt || enquiry?.attributes?.createdAt;
                      return (
                        <div key={eId} className="flex items-start justify-between py-3 border-b border-[#E5DDD0] last:border-0">
                          <div className="min-w-0 pr-3">
                            <p className="truncate text-sm font-bold text-[#0D3326]">{propTitle}</p>
                            {date && <p className="mt-0.5 text-[11px] text-[#0D3326]/50">{formatDate(date)}</p>}
                          </div>
                          <div className="shrink-0"><EnquiryStatusBadge status={status} /></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 border-t border-[#E5DDD0] pt-3">
                    <Link href="/user/enquiries" className="flex items-center justify-center gap-1 text-xs font-bold text-[#D7AE62]">View All Enquiries <ChevronRight size={13} /></Link>
                  </div>
                </>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  );
}
