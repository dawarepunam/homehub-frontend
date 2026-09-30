"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  CheckCheck,
  Home,
  MessageCircle,
  X,
  ChevronRight,
  Building2,
} from "lucide-react";
import { getNotifications, getUnreadCount, markAsRead as apiMarkAsRead } from "@/services/notification";

// ── Auth helpers ──────────────────────────────────────────────────
function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("strapi_jwt")
  );
}

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/api$/, "") ||
  "http://localhost:1337";

// ── Time formatting ───────────────────────────────────────────────
function relativeTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getGroup(dateStr) {
  if (!dateStr) return "Earlier";
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const notifDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (notifDay.getTime() === today.getTime()) return "Today";
  if (notifDay.getTime() === yesterday.getTime()) return "Yesterday";
  return "Earlier";
}

// ── Media URL helper ──────────────────────────────────────────────
function getMediaUrl(media) {
  if (!media) return null;
  const raw = Array.isArray(media) ? media[0] : media;
  const item = raw?.data || raw;
  const attrs = item?.attributes || item;
  const url =
    attrs?.formats?.thumbnail?.url ||
    attrs?.formats?.small?.url ||
    attrs?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_BASE_URL}${url}`;
}

// ── Icon per notification type ────────────────────────────────────
function NotifIcon({ type }) {
  const t = (type || "").toLowerCase();
  if (t.includes("sitevisit") || t.includes("visit") || t.includes("schedule"))
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
        <Calendar size={16} className="text-amber-600" />
      </div>
    );
  if (t.includes("enquiry") || t.includes("seller") || t.includes("response"))
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
        <MessageCircle size={16} className="text-emerald-600" />
      </div>
    );
  if (t.includes("property") || t.includes("saved"))
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: "#F7F4EF" }}>
        <Home size={16} style={{ color: "#0D3326" }} />
      </div>
    );
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: "#F7F4EF" }}>
      <Bell size={16} style={{ color: "#0D3326" }} />
    </div>
  );
}

export default function UserNotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch from existing services
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      // We use the existing service API. If it returns 404, it gracefully returns []
      const [notifs, count] = await Promise.all([
        getNotifications(token),
        getUnreadCount(token)
      ]);
      setNotifications(notifs || []);
      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Failed to load notifications", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click or Escape
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const handleOpen = useCallback(() => {
    setOpen((prev) => {
      if (!prev) fetchNotifications();
      return !prev;
    });
  }, [fetchNotifications]);

  const markAsRead = async (id, link) => {
    try {
      const token = getToken();
      if (token) {
        // Use existing API to mark as read
        await apiMarkAsRead(id, token);
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
    setOpen(false);
    if (link) window.location.href = link;
  };

  const markAllAsRead = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const unreadNotifs = notifications.filter(n => !n.IsRead);
      await Promise.all(unreadNotifs.map(n => apiMarkAsRead(n.documentId || n.id, token)));
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Group notifications
  const groups = { Today: [], Yesterday: [], Earlier: [] };
  notifications.slice(0, 12).forEach((n) => {
    const g = getGroup(n.createdAt);
    groups[g].push(n);
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Bell button ─────────────────────────────── */}
      <button
        id="user-notification-bell"
        type="button"
        onClick={handleOpen}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 hover:bg-white/10"
        style={
          open
            ? { borderColor: "#D7AE62", background: "rgba(215,174,98,0.18)", color: "#D7AE62" }
            : { borderColor: "rgba(215,174,98,0.30)", color: "#F3E7D2" }
        }
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-extrabold"
            style={{ background: "#E53E3E", color: "#fff" }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown ─────────────────────────────────── */}
      {open && (
        <div
          className="absolute right-0 top-full mt-3 z-[99999] overflow-hidden rounded-2xl shadow-2xl"
          style={{
            width: "360px",
            background: "#fff",
            border: "1px solid #EDE8DF",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #EDE8DF" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold" style={{ color: "#0D3326" }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  className="flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-extrabold"
                  style={{ background: "#FEE2E2", color: "#DC2626" }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs font-bold transition hover:opacity-70"
                  style={{ color: "#D7AE62" }}
                >
                  <CheckCheck size={13} />
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-gray-100"
              >
                <X size={14} style={{ color: "#6B7280" }} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-gray-200 border-t-[#0D3326]" />
                <p className="text-xs font-semibold text-gray-400">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                <div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: "#F7F4EF" }}
                >
                  <Bell size={28} style={{ color: "#0D3326", opacity: 0.3 }} />
                </div>
                <p className="text-sm font-extrabold" style={{ color: "#0D3326" }}>
                  No Notifications Yet
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  You&apos;re all caught up. Your property enquiries, site visits and updates will appear here.
                </p>
              </div>
            ) : (
              <div>
                {["Today", "Yesterday", "Earlier"].map((group) => {
                  const items = groups[group];
                  if (items.length === 0) return null;
                  return (
                    <div key={group}>
                      <div
                        className="px-5 py-2 text-[10px] font-extrabold uppercase tracking-widest"
                        style={{ color: "#9CA3AF", background: "#FAFAF9" }}
                      >
                        {group}
                      </div>
                      {items.map((n) => {
                        // Support actual fields from Strapi schema if they exist
                        const title = n.Title || n.title || "Notification";
                        const message = n.Message || n.message || "";
                        const type = n.Type || n.type || "";
                        const isRead = n.IsRead || n.isRead || false;
                        const propAttrs = n.property?.data?.attributes || n.property || {};
                        const propertyTitle = propAttrs?.Title || "";
                        const propertyImg = getMediaUrl(propAttrs?.CoverImage);
                        const link = n.Link || n.link || "/user/profile/notifications";

                        return (
                          <button
                            key={n.documentId || n.id}
                            onClick={() => markAsRead(n.documentId || n.id, link)}
                            className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50"
                            style={{
                              background: isRead ? "transparent" : "rgba(13,51,38,0.03)",
                              borderBottom: "1px solid #F3F4F6",
                            }}
                          >
                            <NotifIcon type={type} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={`text-[13px] leading-snug ${isRead ? "font-semibold" : "font-extrabold"}`}
                                  style={{ color: "#0D3326" }}
                                >
                                  {title}
                                </p>
                                <div className="flex shrink-0 items-center gap-1">
                                  {!isRead && (
                                    <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 mt-1" />
                                  )}
                                  <span className="text-[10px] font-semibold text-gray-400 whitespace-nowrap">
                                    {relativeTime(n.createdAt)}
                                  </span>
                                </div>
                              </div>
                              {message && (
                                <p
                                  className="mt-0.5 text-[12px] leading-relaxed line-clamp-2"
                                  style={{ color: isRead ? "#9CA3AF" : "#4B5563" }}
                                >
                                  {message}
                                </p>
                              )}
                              {propertyTitle && (
                                <div className="mt-1.5 flex items-center gap-1">
                                  <Building2 size={11} style={{ color: "#D7AE62" }} />
                                  <span className="text-[11px] font-semibold text-gray-400 truncate">
                                    {propertyTitle}
                                  </span>
                                </div>
                              )}
                            </div>
                            {propertyImg ? (
                              <img
                                src={propertyImg}
                                alt=""
                                className="h-12 w-12 shrink-0 rounded-lg object-cover"
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            ) : (
                              <ChevronRight size={14} className="shrink-0 mt-1 text-gray-300" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid #EDE8DF" }}>
            <Link
              href="/user/profile/notifications"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 py-3.5 text-[13px] font-bold transition hover:bg-gray-50"
              style={{ color: "#0D3326" }}
            >
              View All Notifications
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
