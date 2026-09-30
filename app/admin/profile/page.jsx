"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  User, Mail, Phone, Shield, Key, LogOut, Edit3, Save, X,
  AlertCircle, RefreshCw, CheckCircle, Eye, EyeOff, ChevronRight
} from "lucide-react";

// ─── API Config ────────────────────────────────────────────────────────────
const STRAPI_BASE = (
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  "http://localhost:1337"
).replace(/\/api\/?$/, "").replace(/\/$/, "");

const API = `${STRAPI_BASE}/api`;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || localStorage.getItem("jwt");
}

function authHeaders() {
  const t = getToken();
  return {
    "Content-Type": "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  };
}

// ─── API Calls ─────────────────────────────────────────────────────────────
async function fetchMe() {
  const res = await fetch(`${API}/users/me?populate=role`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Failed to load profile");
  return data;
}

async function updateMe(userId, payload) {
  const res = await fetch(`${API}/users/${userId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Failed to update profile");
  return data;
}

async function changePassword(currentPassword, password, passwordConfirmation) {
  const res = await fetch(`${API}/auth/change-password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, password, passwordConfirmation }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Failed to change password");
  return data;
}

// ─── Sub-components ────────────────────────────────────────────────────────
function InfoField({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-[#DCCCB0]/50 bg-[#F9F5EE] p-5 transition-all hover:border-[#D7AE62]/60">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0D3326]/10">
        <Icon className="h-5 w-5 text-[#0D3326]" />
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-[#17231E] truncate">{value}</p>
      </div>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-5 flex items-center gap-2">
      <span className="h-[2px] w-6 rounded-full bg-[#D7AE62] inline-block"></span>
      {children}
    </h2>
  );
}

function PasswordInput({ id, label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm font-medium text-[#17231E] placeholder-gray-300 focus:outline-none focus:border-[#D7AE62] focus:ring-2 focus:ring-[#D7AE62]/20 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-[#F3EBDD]">
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-56 rounded-3xl bg-[#0D3326]/20"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-10 w-48 rounded-lg bg-[#DCCCB0]/60"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-20 rounded-2xl bg-white/60 border border-[#DCCCB0]/40"></div>)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-48 rounded-2xl bg-white/60 border border-[#DCCCB0]/40"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function AdminProfilePage() {
  const router = useRouter();

  const [admin, setAdmin]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // Edit profile state
  const [editMode, setEditMode]   = useState(false);
  const [editForm, setEditForm]   = useState({ username: "", phone: "" });
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState(null);

  // Password state
  const [pwMode, setPwMode]       = useState(false);
  const [pwForm, setPwForm]       = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving]   = useState(false);
  const [pwMsg, setPwMsg]         = useState(null);

  // ─── Load ────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!getToken()) { router.replace("/admin/login"); return; }
      const me = await fetchMe();
      setAdmin(me);
      setEditForm({ username: me.username || "", phone: me.phone || "" });
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        router.replace("/admin/login");
      } else {
        setError(err.message || "Unable to load your profile.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  // ─── Edit Profile ────────────────────────────────────────────────────────
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      await updateMe(admin.id, {
        username: editForm.username.trim(),
        ...(editForm.phone.trim() ? { phone: editForm.phone.trim() } : {}),
      });
      const refreshed = await fetchMe();
      setAdmin(refreshed);
      setEditForm({ username: refreshed.username || "", phone: refreshed.phone || "" });
      setSaveMsg({ type: "success", text: "Profile updated successfully." });
      setEditMode(false);
    } catch (err) {
      setSaveMsg({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  // ─── Change Password ─────────────────────────────────────────────────────
  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePwSave = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwMsg({ type: "error", text: "All password fields are required." }); return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "New passwords do not match." }); return;
    }
    if (pwForm.next.length < 6) {
      setPwMsg({ type: "error", text: "Password must be at least 6 characters." }); return;
    }
    setPwSaving(true);
    try {
      await changePassword(pwForm.current, pwForm.next, pwForm.confirm);
      setPwMsg({ type: "success", text: "Password changed successfully." });
      setPwForm({ current: "", next: "", confirm: "" });
      setPwMode(false);
    } catch (err) {
      setPwMsg({ type: "error", text: err.message || "Failed to change password." });
    } finally {
      setPwSaving(false);
    }
  };

  // ─── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.replace("/admin/login");
  };

  // ─── Renders ─────────────────────────────────────────────────────────────
  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#F3EBDD]">
        <AdminHeader />
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <div className="rounded-3xl bg-white p-12 shadow-sm border border-red-100">
            <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-5" />
            <h2 className="text-xl font-bold text-[#0D3326] mb-3">Unable to load your profile</h2>
            <p className="text-sm text-gray-500 mb-8">{error}</p>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-3 text-sm font-bold text-white hover:bg-[#174638] transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!admin) return null;

  const initials = (admin.username || admin.email || "A").charAt(0).toUpperCase();
  const roleName = admin.role?.name || "Administrator";

  return (
    <div className="min-h-screen bg-[#F3EBDD] font-sans pb-20">
      <AdminHeader />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-gray-400">
          <Link href="/admin" className="hover:text-[#D7AE62] transition-colors">Administration</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#0D3326]">My Profile</span>
        </nav>

        {/* Toast messages */}
        {saveMsg && (
          <div className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold border ${saveMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
            {saveMsg.type === "success" ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
            <span>{saveMsg.text}</span>
            <button onClick={() => setSaveMsg(null)} className="ml-auto text-current opacity-60 hover:opacity-100"><X className="h-4 w-4" /></button>
          </div>
        )}
        {pwMsg && (
          <div className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold border ${pwMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
            {pwMsg.type === "success" ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
            <span>{pwMsg.text}</span>
            <button onClick={() => setPwMsg(null)} className="ml-auto text-current opacity-60 hover:opacity-100"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-[#0D3326] p-8 sm:p-10 shadow-xl">
          {/* Subtle decorative shapes */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#D7AE62]/8"></div>
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/3"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="h-24 w-24 rounded-2xl bg-[#D7AE62] flex items-center justify-center text-4xl font-black text-[#0D3326] shadow-lg border-2 border-white/20">
                {initials}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-400 border-2 border-[#0D3326]"></div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7AE62] mb-1">HomeHub Administration</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                {admin.username || admin.email}
              </h1>
              <p className="text-sm text-white/60 font-medium">{admin.email}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-bold text-white/80">
                <Shield className="h-3.5 w-3.5 text-[#D7AE62]" />
                {roleName}
              </div>
            </div>

            {/* Edit Button */}
            {!editMode && (
              <button
                onClick={() => { setEditMode(true); setSaveMsg(null); }}
                className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl border border-[#D7AE62]/50 bg-[#D7AE62]/10 px-5 py-2.5 text-sm font-bold text-[#D7AE62] hover:bg-[#D7AE62]/20 transition-all"
              >
                <Edit3 className="h-4 w-4" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN (Account + Edit + Password) ───────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* ACCOUNT INFORMATION */}
            <div className="rounded-2xl bg-white border border-[#DCCCB0]/40 p-6 sm:p-8 shadow-sm">
              <SectionHeader>Account Information</SectionHeader>

              {!editMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoField icon={User} label="Username" value={admin.username} />
                  <InfoField icon={Mail} label="Email" value={admin.email} />
                  {admin.phone && <InfoField icon={Phone} label="Phone" value={admin.phone} />}
                  <InfoField icon={Shield} label="Account Type" value={roleName} />
                  <InfoField
                    icon={CheckCircle}
                    label="Account Status"
                    value={admin.confirmed ? "Verified & Active" : "Pending Verification"}
                  />
                  {admin.createdAt && (
                    <InfoField
                      icon={Key}
                      label="Member Since"
                      value={new Date(admin.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    />
                  )}
                </div>
              ) : (
                /* ── EDIT FORM ── */
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5" htmlFor="username">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={editForm.username}
                        onChange={handleEditChange}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-[#17231E] focus:outline-none focus:border-[#D7AE62] focus:ring-2 focus:ring-[#D7AE62]/20 transition-all"
                        placeholder="Your username"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-[#17231E] focus:outline-none focus:border-[#D7AE62] focus:ring-2 focus:ring-[#D7AE62]/20 transition-all"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  {/* Email is read-only to keep Strapi authentication safe */}
                  <div className="rounded-xl border border-dashed border-[#DCCCB0] bg-[#F9F5EE] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email (Read-only)</p>
                    <p className="text-sm font-semibold text-gray-500">{admin.email}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Contact your Strapi Super Admin to change the account email.</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#174638] transition-colors disabled:opacity-60"
                    >
                      {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditMode(false); setSaveMsg(null); setEditForm({ username: admin.username || "", phone: admin.phone || "" }); }}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* SECURITY — Change Password */}
            <div className="rounded-2xl bg-white border border-[#DCCCB0]/40 p-6 sm:p-8 shadow-sm">
              <SectionHeader>Security</SectionHeader>

              {!pwMode ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#DCCCB0]/50 bg-[#F9F5EE] p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0D3326]/10">
                      <Key className="h-5 w-5 text-[#0D3326]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#17231E]">Password</p>
                      <p className="text-xs text-gray-500 mt-0.5">• • • • • • • • • • • •</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setPwMode(true); setPwMsg(null); }}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#0D3326]/30 bg-[#0D3326] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#174638] transition-colors flex-shrink-0"
                  >
                    <Key className="h-3.5 w-3.5" /> Change Password
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePwSave} className="space-y-4">
                  <PasswordInput
                    id="current"
                    label="Current Password"
                    value={pwForm.current}
                    onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                    placeholder="Enter your current password"
                  />
                  <PasswordInput
                    id="next"
                    label="New Password"
                    value={pwForm.next}
                    onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                    placeholder="At least 6 characters"
                  />
                  <PasswordInput
                    id="confirm"
                    label="Confirm New Password"
                    value={pwForm.confirm}
                    onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                    placeholder="Repeat your new password"
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={pwSaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0D3326] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#174638] transition-colors disabled:opacity-60"
                    >
                      {pwSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                      {pwSaving ? "Updating…" : "Update Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPwMode(false); setPwForm({ current: "", next: "", confirm: "" }); setPwMsg(null); }}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN (Session + Quick Nav) ───────────────────────── */}
          <div className="space-y-6">

            {/* CURRENT SESSION */}
            <div className="rounded-2xl bg-[#0D3326] border border-[#0D3326] p-6 shadow-lg relative overflow-hidden">
              <div className="pointer-events-none absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-[#D7AE62]/10"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D7AE62] mb-5 flex items-center gap-2">
                <span className="h-[2px] w-5 rounded-full bg-[#D7AE62] inline-block"></span>
                Current Session
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                </span>
                <span className="text-sm font-bold text-white">Active</span>
              </div>
              <p className="text-xs text-white/50 font-medium mb-1">Logged in as</p>
              <p className="text-sm font-bold text-white mb-0.5">{admin.username}</p>
              <p className="text-xs text-white/50 truncate">{admin.email}</p>

              <div className="mt-6 pt-5 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-600/20 px-4 py-2.5 text-sm font-bold text-red-300 hover:bg-red-600/30 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>

            {/* QUICK NAVIGATION */}
            <div className="rounded-2xl bg-white border border-[#DCCCB0]/40 p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D3326] mb-4 flex items-center gap-2">
                <span className="h-[2px] w-5 rounded-full bg-[#D7AE62] inline-block"></span>
                Quick Navigation
              </h3>
              <nav className="space-y-1.5">
                {[
                  { label: "Dashboard", href: "/admin" },
                  { label: "Properties", href: "/admin/properties" },
                  { label: "Enquiries", href: "/admin/enquiries" },
                  { label: "Subscriptions", href: "/admin/subscriptions" },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0D3326] hover:bg-[#F3EBDD] hover:text-[#D7AE62] transition-colors"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                ))}
              </nav>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
