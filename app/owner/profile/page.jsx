"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  AlertCircle, BarChart3, Briefcase, Building, Building2,
  Calendar, CalendarDays, Camera, CheckCircle2, ChevronRight,
  Globe, Home, KeyRound, Loader2, Lock, LogOut, Mail, MapPin,
  MessageSquare, Pencil, Phone, RefreshCw, Save, ShieldCheck,
  Tag, User, UserRound, X, BadgeCheck, Star, Award, Eye, EyeOff, Hash, Link2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "../Footer";
import { getOwnerDashboard } from "@/services/ownerDashboard";
import { getUserProfile, updateUserProfile, uploadMedia, STRAPI_BASE_URL } from "@/services/userProfile";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ((STRAPI_BASE_URL || "http://localhost:1337").replace(/\/$/, "") + "/api");
const INPUT_CLS = "w-full rounded-xl border border-[#E5DDD0] bg-[#FDFAF6] px-4 py-2.5 text-sm font-semibold text-[#0D3326] outline-none transition placeholder:text-[#0D3326]/30 focus:border-[#0D3326] focus:ring-2 focus:ring-[#0D3326]/10";

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || localStorage.getItem("jwt") || localStorage.getItem("strapi_jwt");
}
function buildMediaUrl(media) {
  if (!media) return null;
  const raw = Array.isArray(media) ? media[0] : media;
  const item = raw?.data ?? raw;
  const attrs = item?.attributes ?? item;
  const url = attrs?.formats?.large?.url ?? attrs?.formats?.medium?.url ?? attrs?.url;
  if (!url) return null;
  const base = (STRAPI_BASE_URL || "http://localhost:1337").replace(/\/$/, "");
  return url.startsWith("http") ? url : (base + url);
}
function getMediaId(media) {
  if (!media) return null;
  const raw = Array.isArray(media) ? media[0] : media;
  const item = raw?.data ?? raw;
  const attrs = item?.attributes ?? item;
  return attrs?.id ?? item?.id ?? null;
}
function getInitials(name) {
  if (!name?.trim()) return "O";
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
}
function formatDate(d) {
  if (!d) return null;
  try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }); }
  catch { return d; }
}
function calcCompletion(pd, email) {
  const checks = [!!email, !!pd?.FirstName, !!pd?.Phone, !!pd?.Gender, !!pd?.DOB, !!pd?.ProfileImage, !!pd?.Occupation, !!pd?.Bio, !!pd?.City, !!pd?.State];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

const SIDEBAR_SECTIONS = [
  { group: "PROFILE", items: [{ label: "My Profile", href: "/owner/profile", icon: UserRound }] },
  { group: "PROPERTY", items: [{ label: "My Properties", href: "/owner/properties", icon: Building2 }] },
  { group: "ACTIVITY", items: [{ label: "Enquiries", href: "/owner/enquiries", icon: MessageSquare }, { label: "Site Visits", href: "/owner/site-visits", icon: CalendarDays }] },
  { group: "BUSINESS", items: [{ label: "Promotions", href: "/owner/promotions", icon: Tag }, { label: "Insights", href: "/owner/insights", icon: BarChart3 }] },
];

function InfoRow({ icon: Icon, label, value, accent }) {
  return (
    <div className="grid grid-cols-[1fr_1.5fr] items-start gap-2 py-3 border-b border-[#F0EAE0] last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        {Icon && <Icon size={13} className="shrink-0 text-[#0D3326]/35" />}
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/50 truncate">{label}</span>
      </div>
      {value ? (
        <span className={`text-sm font-semibold break-words leading-relaxed ${accent ? "text-[#D7AE62]" : "text-[#0D3326]"}`}>{value}</span>
      ) : (
        <span className="text-sm italic text-[#0D3326]/30">Not provided</span>
      )}
    </div>
  );
}

function SectionCard({ icon: Icon, title, badge, onEdit, children }) {
  return (
    <section className="rounded-2xl border border-[#E8E0D5] bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EAE0]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F2]"><Icon size={15} className="text-[#0D3326]" /></div>
          <div>
            <h2 className="text-sm font-extrabold text-[#0D3326]">{title}</h2>
            {badge && <span className="text-[10px] font-semibold text-[#0D3326]/50">{badge}</span>}
          </div>
        </div>
        {onEdit && (
          <button type="button" onClick={onEdit} className="flex items-center gap-1.5 rounded-lg border border-[#E5DDD0] px-3 py-1.5 text-xs font-bold text-[#0D3326] transition hover:bg-[#F0F5F2]">
            <Pencil size={11} /> Edit
          </button>
        )}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function FieldGroup({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="overflow-hidden rounded-2xl border border-[#E5DDD0] bg-white">
        <div className="h-52 bg-[#E5DDD0]" />
        <div className="px-8 pb-8">
          <div className="-mt-14 flex items-end gap-5">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-[#E5DDD0]" />
            <div className="mb-2 space-y-2 flex-1">
              <div className="h-7 w-48 rounded-full bg-[#E5DDD0]" />
              <div className="h-4 w-32 rounded-full bg-[#E5DDD0]" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-12 rounded-2xl bg-[#E5DDD0]" />
      <div className="h-64 rounded-2xl bg-[#E5DDD0]" />
    </div>
  );
}

function EditModal({ title, onClose, onSave, saving, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[#E5DDD0] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5DDD0] px-6 py-4">
          <h3 className="text-base font-extrabold text-[#0D3326]">{title}</h3>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0D3326]/40 transition hover:bg-[#F0F5F2]"><X size={16} /></button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-6 space-y-4">{children}</div>
        <div className="flex items-center justify-end gap-3 border-t border-[#E5DDD0] px-6 py-4">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-[#E5DDD0] px-5 py-2.5 text-sm font-bold text-[#0D3326] transition hover:bg-[#F0F5F2] disabled:opacity-50">Cancel</button>
          <button type="button" onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-2.5 text-sm font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f] disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  function validate() {
    const e = {};
    if (!form.current) e.current = "Required.";
    if (!form.newPass || form.newPass.length < 6) e.newPass = "Min 6 characters.";
    if (form.newPass !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  }
  async function handleSave() {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const token = getAuthToken();
      const res = await fetch(API_URL + "/auth/change-password", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ currentPassword: form.current, password: form.newPass, passwordConfirmation: form.confirm }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) throw new Error(result?.error?.message || "Failed.");
      toast.success("Password changed!", { style: { background: "#0D3326", color: "#D7AE62", fontWeight: "bold" } });
      onClose();
    } catch(err) { toast.error(err?.message || "Failed."); }
    finally { setSaving(false); }
  }
  return (
    <EditModal title="Change Password" onClose={onClose} onSave={handleSave} saving={saving}>
      <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-700 font-semibold">Choose a strong password with at least 6 characters.</div>
      {[["current","Current Password"],["newPass","New Password"],["confirm","Confirm New Password"]].map(([field,label]) => (
        <FieldGroup key={field} label={label} error={errors[field]}>
          <div className="relative">
            <input type={show[field] ? "text" : "password"} className={INPUT_CLS + " pr-10"} value={form[field]}
              onChange={(e) => setForm(p => ({...p, [field]: e.target.value}))}
              placeholder={field === "current" ? "Current password" : field === "newPass" ? "Min 6 characters" : "Repeat new password"} />
            <button type="button" onClick={() => setShow(p => ({...p, [field]: !p[field]}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0D3326]/40 hover:text-[#0D3326]">
              {show[field] ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </FieldGroup>
      ))}
    </EditModal>
  );
}

function CompletionBar({ pct }) {
  const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#D7AE62" : "#ef4444";
  const label = pct >= 80 ? "Great profile!" : pct >= 50 ? "Good start" : "Needs attention";
  return (
    <div className="rounded-2xl border border-[#E8E0D5] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-extrabold uppercase tracking-wider text-[#0D3326]/60">Profile Completeness</p>
        <span className="text-xs font-bold" style={{ color }}>{pct}% — {label}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0EAE0]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: pct + "%", background: color }} />
      </div>
      {pct < 100 && <p className="mt-2 text-[11px] text-[#0D3326]/50">Complete your profile to attract more enquiries and build trust with buyers.</p>}
    </div>
  );
}
function OwnerSidebar({ fullName, initials, profileImageUrl, location, completion, onLogout }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  function SidebarLink({ item }) {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link href={item.href} onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${isActive ? "bg-[#0D3326] text-[#D7AE62]" : "text-[#0D3326]/70 hover:bg-[#F0F5F2] hover:text-[#0D3326]"}`}>
        <Icon size={15} className={isActive ? "text-[#D7AE62]" : "text-[#0D3326]/40"} />{item.label}
      </Link>
    );
  }
  return (
    <>
      <div className="lg:hidden mb-5">
        <div className="rounded-2xl border border-[#E5DDD0] bg-white shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#E5DDD0]">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#D7AE62] bg-[#F0F5F2]">
                {profileImageUrl ? <img src={profileImageUrl} alt={fullName} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-sm font-extrabold text-[#0D3326]">{initials}</div>}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-[#0D3326]">{fullName}</p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">Owner / Seller</span>
              </div>
            </div>
            <button onClick={() => setMobileOpen(p => !p)} className="flex w-full items-center justify-between text-sm font-bold text-[#0D3326]/70">
              <span>Navigation</span><ChevronRight size={16} className={mobileOpen ? "rotate-90 transition-transform" : "transition-transform"} />
            </button>
          </div>
          {mobileOpen && (
            <div className="border-t border-[#E5DDD0] p-3 space-y-4">
              {SIDEBAR_SECTIONS.map((sec,si) => (
                <div key={si}>
                  <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#0D3326]/40">{sec.group}</p>
                  <div className="space-y-0.5">{sec.items.map(item => <SidebarLink key={item.href} item={item} />)}</div>
                </div>
              ))}
              <div className="pt-2 border-t border-[#E5DDD0]">
                <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"><LogOut size={15} />Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <aside className="hidden lg:block w-[268px] shrink-0">
        <div className="sticky top-28 rounded-2xl border border-[#E8E0D5] bg-[#FDFAF6] shadow-sm overflow-hidden">
          <div className="px-5 py-5 border-b border-[#E5DDD0] bg-white">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <div className="h-16 w-16 overflow-hidden rounded-full border-[3px] border-[#D7AE62] bg-[#F0F5F2]">
                  {profileImageUrl ? <img src={profileImageUrl} alt={fullName} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0D3326] to-[#175740] text-xl font-extrabold text-[#D7AE62]">{initials}</div>}
                </div>
                {completion >= 80 && <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 border-2 border-white"><CheckCircle2 size={10} className="text-white" /></span>}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-extrabold text-[#0D3326]">{fullName}</p>
                <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Owner / Seller</span>
                {location && <p className="mt-1 flex items-center gap-1 truncate text-xs font-semibold text-[#0D3326]/50"><MapPin size={10} className="text-[#D7AE62]" />{location}</p>}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-bold text-[#0D3326]/50 uppercase">Profile</span>
                <span className="text-[10px] font-bold text-[#0D3326]/50">{completion}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F0EAE0]">
                <div className="h-full rounded-full" style={{ width: completion + "%", background: completion >= 80 ? "#22c55e" : completion >= 50 ? "#D7AE62" : "#ef4444" }} />
              </div>
            </div>
          </div>
          <nav className="px-3 py-4 space-y-5">
            {SIDEBAR_SECTIONS.map((sec,si) => (
              <div key={si}>
                <h4 className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#0D3326]/40">{sec.group}</h4>
                <div className="space-y-0.5">{sec.items.map(item => <SidebarLink key={item.href} item={item} />)}</div>
              </div>
            ))}
          </nav>
          <div className="px-3 pb-4">
            <div className="h-px bg-[#E8E0D5] mb-3" />
            <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50">
              <LogOut size={15} className="text-red-500" />Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function OwnerProfilePage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(null);
  const [strapiUser, setStrapiUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const securityRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true); setPageError(null);
      const token = getAuthToken();
      if (!token) { router.replace("/login"); return; }
      const [dashResult, profileResult] = await Promise.allSettled([getOwnerDashboard(), getUserProfile()]);
      if (dashResult.status === "fulfilled") setDashboard(dashResult.value);
      if (profileResult.status === "fulfilled") setProfile(profileResult.value);
      try {
        const res = await fetch(API_URL + "/users/me", { headers: { Authorization: "Bearer " + token }, cache: "no-store" });
        if (res.ok) setStrapiUser(await res.json());
      } catch(_) {}
      try { const raw = localStorage.getItem("user"); if (raw) setStrapiUser(p => p || JSON.parse(raw)); } catch(_) {}
    } catch(err) { setPageError(err?.message || "Unable to load profile."); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const pd = profile?.ProfileDetails ?? {};
  const email = strapiUser?.email || pd?.Email || "";
  const firstName = pd?.FirstName || strapiUser?.firstName || "";
  const lastName = pd?.LastName || strapiUser?.lastName || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || strapiUser?.username || "Owner";
  const initials = getInitials(fullName);
  const city = pd?.City || ""; const state = pd?.State || "";
  const location = [city, state].filter(Boolean).join(", ");
  const profileImageUrl = buildMediaUrl(pd?.ProfileImage);
  const isVerified = pd?.IsVerified === true;
  const memberSince = profile?.createdAt ? formatDate(profile.createdAt) : null;
  const completion = calcCompletion(pd, email);

  function openModal(type) {
    setFormErrors({});
    const base = {
      personal: { FirstName: pd?.FirstName||"", LastName: pd?.LastName||"", Phone: pd?.Phone||"", Gender: pd?.Gender||"", DOB: pd?.DOB||"" },
      seller: { Occupation: pd?.Occupation||"", Company: pd?.Company||"", AgencyName: pd?.AgencyName||"", LicenseNumber: pd?.LicenseNumber||"", YearsExperience: pd?.YearsExperience||"", Specialization: pd?.Specialization||"", Website: pd?.Website||"" },
      bio: { Bio: pd?.Bio||"" },
      address: { Address: pd?.Address||"", City: pd?.City||"", State: pd?.State||"", pincode: pd?.pincode||"", Country: pd?.Country||"India" },
    }[type] || {};
    setForm(base); setActiveModal(type);
  }

  function closeModal() {
    setActiveModal(null); setSaving(false); setFormErrors({});
    setPhotoFile(null);
    if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
  }

  function f(key, val) { setForm(prev => ({...prev, [key]: val})); }

  function validateForm(type) {
    const e = {};
    if (type === "personal") {
      if (!form.FirstName?.trim()) e.FirstName = "First name is required.";
      if (form.Phone && !/^[6-9]\d{9}$/.test(form.Phone.replace(/\s/g,""))) e.Phone = "Enter a valid 10-digit number.";
    }
    if (type === "address" && form.pincode && !/^\d{6}$/.test(form.pincode)) e.pincode = "Pincode must be 6 digits.";
    if (type === "seller" && form.Website && !/^https?:\/\//i.test(form.Website)) e.Website = "URL must start with https://";
    return e;
  }

  async function handleSave() {
    const docId = profile?.documentId || profile?.id;
    if (!docId) { toast.error("Profile ID not found."); return; }
    if (activeModal !== "photo") {
      const errs = validateForm(activeModal);
      if (Object.keys(errs).length) { setFormErrors(errs); return; }
    }
    setSaving(true);
    try {
      const existingPd = profile?.ProfileDetails ?? {};
      const { id: _ignore, ...existingFields } = existingPd;
      const existingImgId = getMediaId(existingPd.ProfileImage);
      let payload = {...existingFields};
      if (existingImgId) payload.ProfileImage = existingImgId;
      if (activeModal === "photo") {
        if (!photoFile) { closeModal(); return; }
        const uploaded = await uploadMedia(photoFile);
        if (!uploaded?.id) throw new Error("Image upload failed.");
        payload.ProfileImage = uploaded.id;
      } else { payload = {...payload, ...form}; }
      await updateUserProfile(docId, { ProfileDetails: payload });
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (activeModal === "personal") {
            if (form.FirstName !== undefined) parsed.firstName = form.FirstName;
            if (form.LastName !== undefined) parsed.lastName = form.LastName;
          }
          if (activeModal === "photo") {
            const fresh = await getUserProfile();
            const freshUrl = buildMediaUrl(fresh?.ProfileDetails?.ProfileImage);
            if (freshUrl) parsed.profileImage = freshUrl;
          }
          localStorage.setItem("user", JSON.stringify(parsed));
          window.dispatchEvent(new Event("userProfileUpdated"));
        }
      } catch(_) {}
      toast.success("Profile updated!", { style: { background: "#0D3326", color: "#D7AE62", fontWeight: "bold" } });
      closeModal(); await loadData();
    } catch(err) { toast.error(err?.message || "Failed to save."); }
    finally { setSaving(false); }
  }

  function handleLogout() {
    ["token","jwt","strapi_jwt","user","activeMode"].forEach(k => localStorage.removeItem(k));
    router.replace("/login");
  }

  function onPhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file));
  }

  const headerData = dashboard?.header || dashboard?.Header || null;
  const footerData = dashboard?.Footer || dashboard?.footer || null;

  if (loading) return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EF]">
      <Header headerData={headerData} /><main className="flex-1 py-8"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><ProfileSkeleton /></div></main><Footer data={footerData} />
    </div>
  );

  if (pageError) return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EF]">
      <Header headerData={headerData} />
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="flex max-w-sm flex-col items-center text-center">
          <AlertCircle size={40} className="text-red-400" />
          <h2 className="mt-4 text-lg font-extrabold text-[#0D3326]">Unable to Load Profile</h2>
          <p className="mt-1 text-sm text-[#0D3326]/60">{pageError}</p>
          <button onClick={loadData} className="mt-6 flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 text-sm font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f]"><RefreshCw size={15} />Try Again</button>
        </div>
      </main>
      <Footer data={footerData} />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EF]">
      <Toaster position="top-right" />
      <Header headerData={headerData} />

      {activeModal === "photo" && (
        <EditModal title="Update Profile Photo" onClose={closeModal} onSave={handleSave} saving={saving}>
          <div className="flex flex-col items-center gap-5 py-4">
            <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-[#D7AE62] bg-[#F0F5F2] shadow-lg">
              {(photoPreview || profileImageUrl) ? <img src={photoPreview || profileImageUrl} alt="Preview" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-4xl font-extrabold text-[#0D3326]">{initials}</div>}
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E5DDD0] bg-[#F0F5F2] px-5 py-2.5 text-sm font-bold text-[#0D3326] transition hover:bg-[#E5DDD0]">
              <Camera size={15} />Choose Photo<input type="file" accept="image/*" className="sr-only" onChange={onPhotoSelect} />
            </label>
            {photoFile && <p className="text-xs text-[#0D3326]/50">Selected: {photoFile.name}</p>}
            <p className="text-center text-xs text-[#0D3326]/50 max-w-xs">Upload a clear, professional photo. JPG, PNG or WEBP, max 5MB.</p>
          </div>
        </EditModal>
      )}
      {activeModal === "personal" && (
        <EditModal title="Edit Personal Information" onClose={closeModal} onSave={handleSave} saving={saving}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldGroup label="First Name *" error={formErrors.FirstName}><input className={INPUT_CLS} value={form.FirstName} onChange={e => f("FirstName",e.target.value)} placeholder="First name" /></FieldGroup>
            <FieldGroup label="Last Name"><input className={INPUT_CLS} value={form.LastName} onChange={e => f("LastName",e.target.value)} placeholder="Last name" /></FieldGroup>
            <FieldGroup label="Phone Number" error={formErrors.Phone}><input className={INPUT_CLS} type="tel" value={form.Phone} onChange={e => f("Phone",e.target.value)} placeholder="10-digit mobile" /></FieldGroup>
            <FieldGroup label="Gender"><select className={INPUT_CLS} value={form.Gender} onChange={e => f("Gender",e.target.value)}><option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option><option value="Prefer not to say">Prefer not to say</option></select></FieldGroup>
            <FieldGroup label="Date of Birth"><input className={INPUT_CLS} type="date" value={form.DOB} onChange={e => f("DOB",e.target.value)} /></FieldGroup>
          </div>
        </EditModal>
      )}
      {activeModal === "seller" && (
        <EditModal title="Edit Seller Information" onClose={closeModal} onSave={handleSave} saving={saving}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldGroup label="Occupation / Role"><input className={INPUT_CLS} value={form.Occupation} onChange={e => f("Occupation",e.target.value)} placeholder="e.g. Real Estate Agent" /></FieldGroup>
            <FieldGroup label="Company / Business"><input className={INPUT_CLS} value={form.Company} onChange={e => f("Company",e.target.value)} placeholder="Company name" /></FieldGroup>
            <FieldGroup label="Agency Name"><input className={INPUT_CLS} value={form.AgencyName} onChange={e => f("AgencyName",e.target.value)} placeholder="Agency or brokerage" /></FieldGroup>
            <FieldGroup label="RERA / License Number"><input className={INPUT_CLS} value={form.LicenseNumber} onChange={e => f("LicenseNumber",e.target.value)} placeholder="License number" /></FieldGroup>
            <FieldGroup label="Years of Experience"><input className={INPUT_CLS} type="number" min="0" max="50" value={form.YearsExperience} onChange={e => f("YearsExperience",e.target.value)} placeholder="e.g. 5" /></FieldGroup>
            <FieldGroup label="Specialization"><select className={INPUT_CLS} value={form.Specialization} onChange={e => f("Specialization",e.target.value)}><option value="">Select</option><option value="Residential">Residential</option><option value="Commercial">Commercial</option><option value="Luxury">Luxury</option><option value="Plots">Plots &amp; Land</option><option value="Industrial">Industrial</option><option value="Rental">Rental Management</option></select></FieldGroup>
            <div className="sm:col-span-2"><FieldGroup label="Website URL" error={formErrors.Website}><input className={INPUT_CLS} type="url" value={form.Website} onChange={e => f("Website",e.target.value)} placeholder="https://yourwebsite.com" /></FieldGroup></div>
          </div>
        </EditModal>
      )}
      {activeModal === "bio" && (
        <EditModal title="Edit About / Bio" onClose={closeModal} onSave={handleSave} saving={saving}>
          <FieldGroup label="About Me / Bio">
            <textarea className={INPUT_CLS + " resize-none"} rows={6} value={form.Bio} onChange={e => f("Bio",e.target.value)} placeholder="Write a short intro about yourself..." maxLength={500} />
            <p className="mt-1 text-right text-[11px] text-[#0D3326]/40">{(form.Bio||"").length}/500</p>
          </FieldGroup>
        </EditModal>
      )}
      {activeModal === "address" && (
        <EditModal title="Edit Address" onClose={closeModal} onSave={handleSave} saving={saving}>
          <FieldGroup label="Full Address"><textarea className={INPUT_CLS + " resize-none"} rows={3} value={form.Address} onChange={e => f("Address",e.target.value)} placeholder="Street address" /></FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldGroup label="City"><input className={INPUT_CLS} value={form.City} onChange={e => f("City",e.target.value)} placeholder="City" /></FieldGroup>
            <FieldGroup label="State"><input className={INPUT_CLS} value={form.State} onChange={e => f("State",e.target.value)} placeholder="State" /></FieldGroup>
            <FieldGroup label="Pincode" error={formErrors.pincode}><input className={INPUT_CLS} value={form.pincode} onChange={e => f("pincode",e.target.value)} placeholder="6-digit pincode" /></FieldGroup>
            <FieldGroup label="Country"><input className={INPUT_CLS} value={form.Country} onChange={e => f("Country",e.target.value)} placeholder="Country" /></FieldGroup>
          </div>
        </EditModal>
      )}
      {activeModal === "password" && <ChangePasswordModal onClose={closeModal} />}

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-[13px] font-semibold text-[#0D3326]/50">
            <Link href="/owner/properties" className="flex items-center gap-1 hover:text-[#0D3326] transition"><Home size={13} /><span>Owner Portal</span></Link>
            <ChevronRight size={11} /><span className="text-[#0D3326]">My Profile</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-start gap-7">
            <OwnerSidebar fullName={fullName} initials={initials} profileImageUrl={profileImageUrl} location={location} completion={completion} onLogout={handleLogout} />
            <div className="flex-1 min-w-0 space-y-5">
              {/* HERO */}
              <div className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white shadow-sm">
                <div className="relative h-44 sm:h-52 w-full" style={{ background: "linear-gradient(135deg, #0D3326 0%, #175740 40%, #0D3326 100%)" }}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(ellipse at 25% 60%, #D7AE62 0%, transparent 55%)" }} />
                  {isVerified && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5">
                      <BadgeCheck size={14} className="text-emerald-400" /><span className="text-xs font-bold text-white">Verified Seller</span>
                    </div>
                  )}
                </div>
                <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="flex items-end gap-5 -mt-14 sm:-mt-16">
                      <div className="relative shrink-0 z-10">
                        <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-white bg-[#F0F5F2] shadow-lg">
                          {profileImageUrl ? <img src={profileImageUrl} alt={fullName} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0D3326] to-[#175740] text-4xl font-extrabold text-[#D7AE62]">{initials}</div>}
                        </div>
                        <button type="button" onClick={() => setActiveModal("photo")} className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#D7AE62] shadow-md transition hover:bg-[#C49A30]"><Camera size={14} className="text-[#0D3326]" /></button>
                      </div>
                      <div className="mb-2 sm:mb-3">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0D3326]">{fullName}</h1>
                          {isVerified ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700"><BadgeCheck size={10} />Verified</span> : <span className="inline-flex rounded-full bg-amber-50 border border-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600">Pending Verification</span>}
                        </div>
                        {pd?.Occupation && <p className="text-sm font-bold text-[#0D3326]/70">{pd.Occupation}{pd?.Company && " @ " + pd.Company}</p>}
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                          {location && <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D3326]/60"><MapPin size={11} className="text-[#D7AE62]" />{location}</span>}
                          {pd?.YearsExperience && <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D3326]/60"><Award size={11} className="text-[#D7AE62]" />{pd.YearsExperience} yrs</span>}
                          {pd?.Specialization && <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D3326]/60"><Star size={11} className="text-[#D7AE62]" />{pd.Specialization}</span>}
                          {memberSince && <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D3326]/60"><Calendar size={11} className="text-[#D7AE62]" />Since {memberSince}</span>}
                        </div>
                        {pd?.Bio && <p className="mt-2 max-w-lg text-sm text-[#0D3326]/65 leading-relaxed line-clamp-2">{pd.Bio}</p>}
                      </div>
                    </div>
                    <div className="pb-2 shrink-0">
                      <button type="button" onClick={() => openModal("personal")} className="flex items-center gap-2 rounded-xl bg-[#0D3326] px-5 py-2.5 text-sm font-bold text-[#D7AE62] transition hover:bg-[#0a2b1f] shadow-sm"><Pencil size={13} />Edit Profile</button>
                    </div>
                  </div>
                </div>
              </div>

              <CompletionBar pct={completion} />

              <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">
                <div className="space-y-5">
                  <SectionCard icon={User} title="Personal Information" onEdit={() => openModal("personal")}>
                    <InfoRow icon={User} label="Full Name" value={fullName} />
                    <InfoRow icon={Mail} label="Email Address" value={email} />
                    <InfoRow icon={Phone} label="Phone Number" value={pd?.Phone} />
                    <InfoRow icon={User} label="Gender" value={pd?.Gender} />
                    <InfoRow icon={Calendar} label="Date of Birth" value={pd?.DOB ? formatDate(pd.DOB) : null} />
                    <div className="mt-4 rounded-xl bg-[#F7F4EF] border border-[#EDE7DC] px-4 py-3"><p className="text-[11px] font-bold text-[#0D3326]/50">📧 Email is your primary login ID and cannot be changed here.</p></div>
                  </SectionCard>

                  <SectionCard icon={Briefcase} title="Seller Information" badge="Professional details visible to buyers" onEdit={() => openModal("seller")}>
                    <InfoRow icon={Briefcase} label="Occupation / Role" value={pd?.Occupation} />
                    <InfoRow icon={Building} label="Company / Business" value={pd?.Company} />
                    <InfoRow icon={Building2} label="Agency Name" value={pd?.AgencyName} />
                    <InfoRow icon={Hash} label="RERA / License No." value={pd?.LicenseNumber} accent={true} />
                    <InfoRow icon={Award} label="Years of Experience" value={pd?.YearsExperience ? pd.YearsExperience + " years" : null} />
                    <InfoRow icon={Star} label="Specialization" value={pd?.Specialization} />
                    {pd?.Website && (
                      <div className="grid grid-cols-[1fr_1.5fr] items-center gap-2 py-3">
                        <div className="flex items-center gap-2"><Link2 size={13} className="text-[#0D3326]/35" /><span className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/50">Website</span></div>
                        <a href={pd.Website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#D7AE62] hover:underline truncate">{pd.Website}</a>
                      </div>
                    )}
                    {!pd?.Occupation && !pd?.Company && !pd?.LicenseNumber && (
                      <div className="text-center py-4">
                        <p className="text-sm text-[#0D3326]/40 italic">Add your seller details to build trust with buyers.</p>
                        <button type="button" onClick={() => openModal("seller")} className="mt-2 text-xs font-bold text-[#D7AE62] hover:underline">+ Add Seller Details</button>
                      </div>
                    )}
                  </SectionCard>

                  <SectionCard icon={User} title="About Me" badge="Shown to prospective buyers" onEdit={() => openModal("bio")}>
                    {pd?.Bio ? <p className="text-sm leading-relaxed text-[#0D3326]/75">{pd.Bio}</p> : (
                      <div className="rounded-xl bg-[#F7F4EF] border border-[#EDE7DC] p-5 text-center">
                        <p className="text-sm text-[#0D3326]/50">No introduction added yet.</p>
                        <button type="button" onClick={() => openModal("bio")} className="mt-3 text-xs font-bold text-[#D7AE62] hover:underline">+ Add Introduction</button>
                      </div>
                    )}
                  </SectionCard>

                  <SectionCard icon={MapPin} title="Address & Location" onEdit={() => openModal("address")}>
                    <InfoRow icon={MapPin} label="Full Address" value={pd?.Address} />
                    <InfoRow icon={MapPin} label="City" value={city} />
                    <InfoRow icon={MapPin} label="State" value={state} />
                    <InfoRow icon={MapPin} label="Pincode" value={pd?.pincode} />
                    <InfoRow icon={Globe} label="Country" value={pd?.Country || "India"} />
                  </SectionCard>
                </div>

                <div className="space-y-5">
                  <SectionCard icon={ShieldCheck} title="Account Information">
                    <InfoRow icon={User} label="Account Type" value="Owner / Seller" />
                    <InfoRow icon={Mail} label="Email" value={email} />
                    <InfoRow icon={Calendar} label="Member Since" value={memberSince || "Recently joined"} />
                    <div className="grid grid-cols-[1fr_1.5fr] items-center gap-2 py-3 border-b border-[#F0EAE0]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/50">Status</span>
                      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Active</span>
                    </div>
                    <div className="grid grid-cols-[1fr_1.5fr] items-center gap-2 py-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/50">Verification</span>
                      {isVerified ? <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700"><BadgeCheck size={11} />Verified</span> : <span className="inline-flex w-fit items-center rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-600">Pending</span>}
                    </div>
                  </SectionCard>

                  <SectionCard icon={Building2} title="Portal Modules">
                    <div className="space-y-1.5">
                      {[
                        { label: "My Properties", href: "/owner/properties", icon: Building2, desc: "Manage your listings" },
                        { label: "Enquiries", href: "/owner/enquiries", icon: MessageSquare, desc: "Buyer enquiries" },
                        { label: "Site Visits", href: "/owner/site-visits", icon: CalendarDays, desc: "Scheduled visits" },
                        { label: "Promotions", href: "/owner/promotions", icon: Tag, desc: "Boost your listings" },
                        { label: "Insights", href: "/owner/insights", icon: BarChart3, desc: "Analytics" },
                      ].map(({ label, href, icon: Icon, desc }) => (
                        <Link key={href} href={href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[#F0F5F2]">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7F4EF] group-hover:bg-[#E8F4F0] transition"><Icon size={14} className="text-[#0D3326]/60 group-hover:text-[#0D3326]" /></div>
                          <div className="flex-1 min-w-0"><p className="text-sm font-bold text-[#0D3326]">{label}</p><p className="text-[11px] text-[#0D3326]/50">{desc}</p></div>
                          <ChevronRight size={13} className="text-[#0D3326]/30 group-hover:text-[#0D3326]/60" />
                        </Link>
                      ))}
                    </div>
                  </SectionCard>

                  <div ref={securityRef}>
                    <SectionCard icon={Lock} title="Account & Security">
                      <div className="space-y-2">
                        <button type="button" onClick={() => setActiveModal("password")} className="group flex w-full items-center gap-3 rounded-xl border border-[#E8E0D5] px-4 py-3.5 text-left transition hover:bg-[#F0F5F2]">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F2]"><KeyRound size={14} className="text-[#0D3326]/60" /></div>
                          <div className="flex-1 min-w-0"><p className="text-sm font-bold text-[#0D3326]">Change Password</p><p className="text-[11px] text-[#0D3326]/50">Update your login credentials</p></div>
                          <ChevronRight size={13} className="text-[#0D3326]/30" />
                        </button>
                        <button type="button" onClick={handleLogout} className="group flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-left transition hover:bg-red-100">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100"><LogOut size={14} className="text-red-500" /></div>
                          <div className="flex-1 min-w-0"><p className="text-sm font-bold text-red-600">Sign Out</p><p className="text-[11px] text-red-400">Log out of your account</p></div>
                          <ChevronRight size={13} className="text-red-300" />
                        </button>
                      </div>
                    </SectionCard>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer data={footerData} />
    </div>
  );
}
