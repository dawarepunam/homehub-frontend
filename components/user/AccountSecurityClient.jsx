"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  User,
  Shield,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Loader2,
  Smartphone,
  Pencil,
  Info,
} from "lucide-react";
import { getUserProfile, getCurrentUser } from "@/services/userProfile";
import toast from "react-hot-toast";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("strapi_jwt")
  );
}

// ─── Password Requirement Row ─────────────────────────────────────────────────
function RequirementRow({ met, text }) {
  return (
    <li className="flex items-center gap-2 text-xs text-[#0D3326]/70">
      {met ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <XCircle className="h-4 w-4 shrink-0 text-[#0D3326]/20" />
      )}
      {text}
    </li>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-[#E5DDD0] bg-white p-8 space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#EAE5DC]" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-[#EAE5DC]" />
              <div className="h-3 w-56 rounded bg-[#EAE5DC]" />
            </div>
          </div>
          <div className="h-12 w-full rounded-xl bg-[#EAE5DC]" />
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AccountSecurityClient() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  // Password form
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // System info
  const [sysInfo, setSysInfo] = useState({ browser: "Browser", os: "Device" });

  useEffect(() => {
    loadAll();
    detectSystem();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [u, p] = await Promise.all([getCurrentUser(), getUserProfile()]);
      setUser(u);
      setProfile(p);
    } catch (err) {
      console.error("Account Security load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const detectSystem = () => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent;
    let browser = "Chrome";
    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edg")) browser = "Edge";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    let os = "Windows";
    if (ua.includes("Mac")) os = "MacOS";
    else if (ua.includes("Linux") && !ua.includes("Android")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (/iPhone|iPad/.test(ua)) os = "iOS";
    setSysInfo({ browser, os });
  };

  // Password requirements
  const pwdChecks = {
    length: newPwd.length >= 8,
    upper: /[A-Z]/.test(newPwd),
    lower: /[a-z]/.test(newPwd),
    number: /[0-9]/.test(newPwd),
  };
  const pwdValid = Object.values(pwdChecks).every(Boolean);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPwd) return toast.error("Enter your current password.");
    if (!pwdValid) return toast.error("New password does not meet requirements.");
    if (newPwd !== confirmPwd) return toast.error("Passwords do not match.");

    try {
      setPwdLoading(true);
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated. Please log in again.");

      const res = await fetch(`${STRAPI_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: currentPwd,
          password: newPwd,
          passwordConfirmation: confirmPwd,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || "Failed to change password.");
      }

      // Update stored JWT if Strapi returns a new one
      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("strapi_jwt", data.jwt);
      }

      toast.success("Password changed successfully!");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err) {
      console.error("Change password error:", err);
      toast.error(err.message || "Failed to change password.");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      ["token", "jwt", "strapi_jwt", "user"].forEach((k) =>
        localStorage.removeItem(k)
      );
    }
    toast.success("Logged out successfully.");
    router.push("/user/login");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error('Type DELETE to confirm.');
      return;
    }
    try {
      setDeleting(true);
      const token = getAuthToken();
      if (!token) throw new Error("Not authenticated.");

      const res = await fetch(`${STRAPI_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || "Failed to delete account.");
      }

      // Clear all local auth
      if (typeof window !== "undefined") {
        ["token", "jwt", "strapi_jwt", "user"].forEach((k) =>
          localStorage.removeItem(k)
        );
      }

      toast.success("Account deleted. Goodbye!");
      router.push("/user/login");
    } catch (err) {
      console.error("Delete account error:", err);
      toast.error(err.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : "—";

  const mobile = profile?.ProfileDetails?.Mobile || null;

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-5 max-w-4xl">
      {/* ── 1. Password & Login ─────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#E5DDD0] bg-white shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center gap-4 border-b border-[#E5DDD0] bg-[#FBF4E6]/40 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
            <Lock className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0D3326]">
              Password &amp; Login
            </h2>
            <p className="text-sm text-[#0D3326]/60">
              Keep your account secure with a strong password.
            </p>
          </div>
        </div>

        {/* Form + requirements */}
        <div className="flex flex-col md:flex-row gap-8 p-6 md:p-8">
          {/* Form */}
          <form
            onSubmit={handleChangePassword}
            className="flex-1 space-y-5"
          >
            {/* Current password */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/60 px-4 py-3 pr-11 text-sm font-medium text-[#0D3326] outline-none transition focus:border-[#D7AE62] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0D3326]/40 hover:text-[#D7AE62] transition-colors"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/60 px-4 py-3 pr-11 text-sm font-medium text-[#0D3326] outline-none transition focus:border-[#D7AE62] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0D3326]/40 hover:text-[#D7AE62] transition-colors"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/60 px-4 py-3 text-sm font-medium text-[#0D3326] outline-none transition focus:border-[#D7AE62] focus:bg-white"
              />
              {confirmPwd && newPwd !== confirmPwd && (
                <p className="text-xs text-red-500 font-medium mt-1">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={pwdLoading || !currentPwd || !newPwd || !confirmPwd}
              className="flex items-center gap-2 rounded-xl bg-[#0D3326] px-8 py-3 text-sm font-bold text-[#D7AE62] transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pwdLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Change Password
            </button>
          </form>

          {/* Requirements panel */}
          <div className="md:w-72 shrink-0 rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/60 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-[#D7AE62]" />
              <h3 className="text-sm font-bold text-[#0D3326]">
                Password Requirements
              </h3>
            </div>
            <ul className="space-y-3">
              <RequirementRow met={pwdChecks.length} text="At least 8 characters long" />
              <RequirementRow met={pwdChecks.upper} text="Include one uppercase letter" />
              <RequirementRow met={pwdChecks.lower} text="Include one lowercase letter" />
              <RequirementRow met={pwdChecks.number} text="Include one number" />
            </ul>
          </div>
        </div>
      </section>

      {/* ── 2. Account Information ──────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#E5DDD0] bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DDD0] bg-[#FBF4E6]/40 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0D3326]">Account Information</h2>
              <p className="text-sm text-[#0D3326]/60">Your personal and account details.</p>
            </div>
          </div>
          <Link
            href="/user/profile/edit"
            className="flex w-fit items-center gap-2 rounded-xl border border-[#E5DDD0] bg-white px-5 py-2.5 text-sm font-bold text-[#0D3326] transition hover:bg-[#F7F4EF] shadow-sm"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 md:p-8">
          {[
            {
              icon: <Mail className="h-5 w-5 text-[#D7AE62]" />,
              label: "Email Address",
              value: user?.email || "Not provided",
            },
            {
              icon: <User className="h-5 w-5 text-[#D7AE62]" />,
              label: "Account Type",
              value: "Buyer",
            },
            {
              icon: <Phone className="h-5 w-5 text-[#D7AE62]" />,
              label: "Mobile Number",
              value: mobile || "Not provided",
            },
            {
              icon: <Calendar className="h-5 w-5 text-[#D7AE62]" />,
              label: "Member Since",
              value: memberSince,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/50">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#0D3326]">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Login Security ───────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#E5DDD0] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 border-b border-[#E5DDD0] bg-[#FBF4E6]/40 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
            <Shield className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0D3326]">Login Security</h2>
            <p className="text-sm text-[#0D3326]/60">
              Manage your login sessions and account access.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#E5DDD0] bg-[#F7F4EF]/60 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5DDD0] bg-white shrink-0">
                <Smartphone className="h-5 w-5 text-[#0D3326]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0D3326]">Current Session</p>
                <p className="text-xs text-[#0D3326]/60 mt-0.5">
                  {sysInfo.browser} · {sysInfo.os}
                </p>
                <span className="mt-1 inline-block rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Active Now
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. Danger Zone ──────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-red-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 border-b border-red-100 bg-red-50/60 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 border border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-red-700">Danger Zone</h2>
            <p className="text-sm text-red-600/70">
              Permanently delete your account and all associated data.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-red-100 bg-red-50/40 p-5">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700">Delete Account</p>
                <p className="text-xs text-red-600/70 mt-0.5 max-w-sm">
                  This action is permanent and cannot be undone. All your
                  saved properties, messages and profile data will be
                  permanently erased.
                </p>
              </div>
            </div>
            <button
              onClick={() => { setDeleteConfirmText(""); setShowDeleteModal(true); }}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>
      </section>

      {/* ── Delete Confirmation Modal ──────────────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 border-b border-red-100 bg-red-50 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="font-bold text-red-700">Delete Account?</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#0D3326]/80">
                This will <strong>permanently</strong> delete your HomeHub account, your profile, saved properties, and all data. <br />
                <span className="text-red-600 font-bold">This cannot be undone.</span>
              </p>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0D3326]/60">
                  Type <span className="text-red-600 font-mono">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  className="w-full rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 text-sm font-bold text-[#0D3326] outline-none focus:border-red-400 focus:bg-white"
                />
              </div>
            </div>
            <div className="flex gap-3 border-t border-[#E5DDD0] bg-white px-6 py-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-[#E5DDD0] py-2.5 text-sm font-bold text-[#0D3326]/70 hover:bg-[#F7F4EF] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== "DELETE"}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
