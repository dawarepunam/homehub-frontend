"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Bell,
  Building2,
  Calendar,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Home,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getNotifications, getUnreadCount, markAsRead as apiMarkAsRead } from "@/services/notification";

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/api$/, "") ||
  "http://localhost:1337";

function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("strapi_jwt")
  );
}

// ─────────────────────────────────────────────────────────────────
// Time helpers
// ─────────────────────────────────────────────────────────────────
function relativeTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMin = Math.floor((now - date) / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getGroup(dateStr) {
  if (!dateStr) return "Earlier";
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (d.getTime() === today.getTime()) return "Today";
  if (d.getTime() === yesterday.getTime()) return "Yesterday";
  return "Earlier";
}

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

// ─────────────────────────────────────────────────────────────────
// Icon component
// ─────────────────────────────────────────────────────────────────
function NotifIcon({ type, size = 18 }) {
  const t = (type || "").toLowerCase();
  if (t.includes("sitevisit") || t.includes("visit") || t.includes("schedule"))
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50">
        <Calendar size={size} className="text-amber-600" />
      </div>
    );
  if (t.includes("enquiry") || t.includes("seller") || t.includes("response"))
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50">
        <MessageCircle size={size} className="text-emerald-600" />
      </div>
    );
  if (t.includes("property") || t.includes("saved"))
    return (
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ background: "#F7F4EF" }}
      >
        <Home size={size} style={{ color: "#0D3326" }} />
      </div>
    );
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
      style={{ background: "#F7F4EF" }}
    >
      <Bell size={size} style={{ color: "#0D3326" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Filter tabs
// ─────────────────────────────────────────────────────────────────
const FILTERS = ["All", "Unread", "Enquiries", "Site Visits"];

function matchesFilter(notification, filter) {
  if (filter === "All") return true;
  const isRead = notification.IsRead ?? notification.isRead ?? false;
  if (filter === "Unread") return !isRead;
  const t = (notification.Type || notification.type || notification.Title || "").toLowerCase();
  if (filter === "Enquiries") return t.includes("enquiry") || t.includes("seller") || t.includes("response");
  if (filter === "Site Visits") return t.includes("sitevisit") || t.includes("visit") || t.includes("schedule");
  return true;
}

// ─────────────────────────────────────────────────────────────────
// Notification card
// ─────────────────────────────────────────────────────────────────
function NotificationCard({ notification: n, onRead }) {
  const title = n.Title || n.title || "Notification";
  const message = n.Message || n.message || "";
  const type = n.Type || n.type || "";
  const isRead = n.IsRead || n.isRead || false;
  const propAttrs = n.property?.data?.attributes || n.property || {};
  const propertyTitle = propAttrs?.Title || "";
  const propertyImg = getMediaUrl(propAttrs?.CoverImage);
  const link = n.Link || n.link;

  const handleClick = () => {
    if (!isRead) onRead(n.documentId || n.id);
    if (link) window.location.href = link;
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex cursor-pointer items-start gap-4 overflow-hidden rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        borderColor: isRead ? "#E5DDD0" : "rgba(13,51,38,0.18)",
        background: isRead ? "rgba(247,244,239,0.50)" : "#fff",
        boxShadow: isRead ? "none" : "0 2px 12px rgba(13,51,38,0.06)",
      }}
    >
      {/* Unread left accent */}
      {!isRead && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ background: "linear-gradient(180deg, #D7AE62, #0D3326)" }}
        />
      )}

      <NotifIcon type={type} />

      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`text-sm leading-snug ${isRead ? "font-semibold" : "font-extrabold"}`}
            style={{ color: "#0D3326" }}
          >
            {title}
            {!isRead && (
              <span
                className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ background: "#FEE2E2", color: "#DC2626" }}
              >
                New
              </span>
            )}
          </h3>
          <span
            className="shrink-0 text-[11px] font-semibold whitespace-nowrap"
            style={{ color: "#9CA3AF" }}
          >
            {relativeTime(n.createdAt)}
          </span>
        </div>

        {message && (
          <p
            className="mt-1.5 text-[13px] leading-relaxed"
            style={{ color: isRead ? "#9CA3AF" : "#4B5563" }}
          >
            {message}
          </p>
        )}

        {propertyTitle && (
          <div className="mt-2 flex items-center gap-1.5">
            <Building2 size={12} style={{ color: "#D7AE62" }} />
            <span
              className="text-[12px] font-semibold truncate"
              style={{ color: "#0D3326", opacity: 0.6 }}
            >
              {propertyTitle}
            </span>
          </div>
        )}
      </div>

      <div className="shrink-0 self-center">
        {propertyImg ? (
          <img
            src={propertyImg}
            alt=""
            className="h-16 w-16 rounded-xl object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <ChevronRight
            size={16}
            className="text-gray-300 group-hover:text-gray-400 transition"
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────
export default function NotificationsClient() {
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      
      const [notifs, count] = await Promise.all([
        getNotifications(token),
        getUnreadCount(token)
      ]);
      setNotifications(notifs || []);
      setUnreadCount(count || 0);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      const token = getToken();
      if (token) {
        await apiMarkAsRead(id, token);
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      const token = getToken();
      if (!token) return;
      const unreadNotifs = notifications.filter(n => !(n.IsRead ?? n.isRead));
      await Promise.all(unreadNotifs.map(n => apiMarkAsRead(n.documentId || n.id, token)));
      toast.success("All notifications marked as read", {
        style: { background: "#0D3326", color: "#D7AE62", fontWeight: "bold" },
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark all as read");
    }
  };

  // Apply filter
  const filtered = notifications.filter((n) => matchesFilter(n, filter));

  // Group
  const groups = { Today: [], Yesterday: [], Earlier: [] };
  filtered.forEach((n) => { groups[getGroup(n.createdAt)].push(n); });

  // Filter badge counts
  const counts = {
    All: notifications.length,
    Unread: unreadCount,
    Enquiries: notifications.filter((n) => matchesFilter(n, "Enquiries")).length,
    "Site Visits": notifications.filter((n) => matchesFilter(n, "Site Visits")).length,
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* ─── Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/user/profile"
              className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-gray-100"
            >
              <ChevronLeft size={18} style={{ color: "#0D3326" }} />
            </Link>
            <h1 className="text-2xl font-extrabold" style={{ color: "#0D3326" }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span
                className="flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-extrabold"
                style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}
              >
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-1 pl-11 text-sm" style={{ color: "rgba(13,51,38,0.60)" }}>
            Stay updated on your enquiries, site visits and property activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition hover:opacity-80"
              style={{ background: "#0D3326", color: "#D7AE62" }}
            >
              <CheckCheck size={15} />
              Mark all as read
            </button>
          )}
          <button
            onClick={fetchNotifications}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:bg-gray-50"
            style={{ borderColor: "#E5DDD0" }}
            title="Refresh"
          >
            <RefreshCw size={14} style={{ color: "#0D3326" }} />
          </button>
        </div>
      </div>

      {/* ─── Filter Tabs ──────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-2 pb-4"
        style={{ borderBottom: "1px solid #E5DDD0" }}
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          const count = counts[f] ?? 0;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition-all"
              style={
                active
                  ? { background: "#0D3326", color: "#fff", border: "1.5px solid #0D3326" }
                  : { background: "#fff", color: "rgba(13,51,38,0.55)", border: "1.5px solid #E5DDD0" }
              }
            >
              {f}
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px]"
                style={
                  active
                    ? { background: "rgba(255,255,255,0.20)", color: "#fff" }
                    : { background: "#F7F4EF", color: "#0D3326" }
                }
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Content ──────────────────────────────────────────── */}
      {loading ? (
        /* Skeleton */
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border p-5 animate-pulse"
              style={{ borderColor: "#E5DDD0", background: "#fff" }}
            >
              <div className="h-12 w-12 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-1/3 rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
                <div className="h-3 w-1/2 rounded bg-gray-100" />
              </div>
              <div className="h-16 w-16 rounded-xl bg-gray-100 shrink-0" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error */
        <div
          className="flex flex-col items-center justify-center rounded-2xl border p-14 text-center"
          style={{ borderColor: "#E5DDD0", background: "#fff", minHeight: "360px" }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
            <AlertCircle size={26} className="text-red-400" />
          </div>
          <h2 className="text-lg font-extrabold" style={{ color: "#0D3326" }}>
            Unable to Load Notifications
          </h2>
          <p className="mt-1 max-w-xs text-sm text-gray-400">{error}</p>
          <button
            onClick={fetchNotifications}
            className="mt-6 flex items-center gap-2 rounded-xl px-6 py-3 font-bold transition hover:opacity-80"
            style={{ background: "#0D3326", color: "#D7AE62" }}
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty */
        <div
          className="flex flex-col items-center justify-center rounded-2xl border p-16 text-center"
          style={{ borderColor: "#E5DDD0", background: "#fff", minHeight: "400px" }}
        >
          <div
            className="mb-5 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: "#F7F4EF" }}
          >
            <Bell size={34} style={{ color: "#0D3326", opacity: 0.25 }} />
          </div>
          <h2 className="text-xl font-extrabold" style={{ color: "#0D3326" }}>
            {filter === "All" ? "No Notifications Yet" : `No ${filter} notifications`}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-gray-400">
            {filter === "All"
              ? "You're all caught up. Your property enquiries, site visits and updates will appear here."
              : `You don't have any ${filter.toLowerCase()} notifications at the moment.`}
          </p>
          {filter !== "All" && (
            <button
              onClick={() => setFilter("All")}
              className="mt-6 font-bold transition hover:opacity-70"
              style={{ color: "#D7AE62" }}
            >
              View all notifications
            </button>
          )}
          <Link
            href="/user"
            className="mt-4 flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition hover:opacity-80"
            style={{ background: "#0D3326", color: "#D7AE62" }}
          >
            Back to Dashboard
          </Link>
        </div>
      ) : (
        /* Grouped notifications */
        <div className="space-y-8">
          {["Today", "Yesterday", "Earlier"].map((group) => {
            const items = groups[group];
            if (!items || items.length === 0) return null;
            return (
              <div key={group} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-extrabold" style={{ color: "#0D3326" }}>
                    {group}
                  </h2>
                  <div className="h-px flex-1" style={{ background: "#E5DDD0" }} />
                </div>
                <div className="space-y-3">
                  {items.map((n) => (
                    <NotificationCard
                      key={n.documentId || n.id}
                      notification={n}
                      onRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
