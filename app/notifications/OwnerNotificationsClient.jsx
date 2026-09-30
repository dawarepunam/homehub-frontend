"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Bell,
  Building2,
  Calendar,
  CheckCheck,
  ChevronRight,
  MessageCircle,
  Home,
  RefreshCw,
} from "lucide-react";
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
  const url = attrs?.formats?.thumbnail?.url || attrs?.formats?.small?.url || attrs?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_BASE_URL}${url}`;
}

function NotifIcon({ type }) {
  const t = (type || "").toLowerCase();
  if (t.includes("site visit") || t.includes("visit") || t.includes("schedule"))
    return (
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Calendar size={18} style={{ color: "#D97706" }} />
      </div>
    );
  if (t.includes("enquiry") || t.includes("seller") || t.includes("response"))
    return (
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <MessageCircle size={18} style={{ color: "#059669" }} />
      </div>
    );
  if (t.includes("property") || t.includes("saved"))
    return (
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Home size={18} style={{ color: "#0D3326" }} />
      </div>
    );
  return (
    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Bell size={18} style={{ color: "#0D3326" }} />
    </div>
  );
}

function matchesFilter(n, filter) {
  if (filter === "All") return true;
  const isRead = n.IsRead || n.isRead || false;
  if (filter === "Unread") return !isRead;
  const t = (n.Type || n.type || n.Title || "").toLowerCase();
  if (filter === "Enquiries") return t.includes("enquiry");
  if (filter === "Site Visits") return t.includes("site visit") || t.includes("visit") || t.includes("schedule");
  if (filter === "Properties") return t.includes("property");
  return true;
}

function NotificationCard({ notification: n, onRead }) {
  const title = n.Title || n.title || "Notification";
  const message = n.Message || n.message || "";
  const type = n.Type || n.type || "";
  const isRead = n.IsRead || n.isRead || false;
  const propAttrs = n.property?.data?.attributes || n.property || {};
  const propertyTitle = propAttrs?.Title || "";
  const propertyImg = getMediaUrl(propAttrs?.CoverImage);
  const link = n.Link || n.link;

  return (
    <div
      onClick={() => onRead(n.documentId || n.id, link)}
      className="group relative flex cursor-pointer items-start gap-4 overflow-hidden rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        borderColor: isRead ? "#E5DDD0" : "rgba(13,51,38,0.18)",
        background: isRead ? "rgba(247,244,239,0.5)" : "#fff",
        boxShadow: isRead ? "none" : "0 2px 12px rgba(13,51,38,0.06)",
      }}
    >
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
            className="text-sm leading-snug"
            style={{ color: "#0D3326", fontWeight: isRead ? 600 : 800 }}
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
            className="mt-1.5 text-[13px] leading-relaxed line-clamp-2"
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
              style={{ color: "#0D3326", opacity: 0.65 }}
            >
              {propertyTitle}
            </span>
          </div>
        )}
      </div>

      <div className="shrink-0 self-start pt-0.5">
        {propertyImg ? (
          <img
            src={propertyImg}
            alt=""
            className="h-16 w-16 rounded-xl object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 transition" />
        )}
      </div>
    </div>
  );
}

const FILTERS = ["All", "Unread", "Enquiries", "Site Visits", "Properties"];

export default function OwnerNotificationsClient() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error("You must be logged in to view notifications.");

      const [notifs, count] = await Promise.all([
        getNotifications(token),
        getUnreadCount(token)
      ]);
      setNotifications(notifs || []);
      setUnreadCount(count || 0);
    } catch (err) {
      setError(err.message || "Unable to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const handleRead = async (id, link) => {
    try {
      const token = getToken();
      if (token) {
        await apiMarkAsRead(id, token);
        loadNotifications();
      }
    } catch (err) {
      console.error(err);
    }
    if (link) router.push(link);
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const unreadNotifs = notifications.filter(n => !(n.IsRead ?? n.isRead));
      await Promise.all(unreadNotifs.map(n => apiMarkAsRead(n.documentId || n.id, token)));
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = notifications.filter(n => matchesFilter(n, filter));

  const groups = { Today: [], Yesterday: [], Earlier: [] };
  filtered.forEach(n => { groups[getGroup(n.createdAt)].push(n); });

  const counts = {};
  FILTERS.forEach(f => {
    counts[f] = f === "Unread" ? unreadCount : notifications.filter(n => matchesFilter(n, f)).length;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4EF" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0D3326", margin: 0 }}>
                Notifications
              </h1>
              <p style={{ marginTop: 4, fontSize: 14, color: "rgba(13,51,38,0.55)" }}>
                Stay updated on buyer enquiries, site visits, and property activity.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {unreadCount > 0 && (
                <>
                  <span style={{ background: "#FEE2E2", color: "#DC2626", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 800 }}>
                    {unreadCount} unread
                  </span>
                  <button
                    onClick={handleMarkAllAsRead}
                    style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 12, padding: "8px 16px", background: "#0D3326", color: "#D7AE62", fontWeight: 700, fontSize: 13, cursor: "pointer", border: "none" }}
                  >
                    <CheckCheck size={14} />
                    Mark all as read
                  </button>
                </>
              )}
              <button
                onClick={loadNotifications}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, border: "1.5px solid #E5DDD0", background: "#fff", cursor: "pointer" }}
                title="Refresh"
              >
                <RefreshCw size={14} style={{ color: "#0D3326" }} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingBottom: 24, borderBottom: "1px solid #E5DDD0", marginBottom: 24 }}>
          {FILTERS.map((f) => {
            const active = filter === f;
            const count = counts[f] ?? 0;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: active ? "#0D3326" : "#fff",
                  color: active ? "#fff" : "rgba(13,51,38,0.55)",
                  border: `1.5px solid ${active ? "#0D3326" : "#E5DDD0"}`,
                }}
              >
                {f}
                <span style={{
                  borderRadius: 999,
                  padding: "1px 6px",
                  fontSize: 10,
                  fontWeight: 800,
                  background: active ? "rgba(255,255,255,0.2)" : "#F7F4EF",
                  color: active ? "#fff" : "#0D3326",
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, borderRadius: 16, border: "1px solid #E5DDD0", padding: 20, background: "#fff", animation: "pulse 1.5s ease-in-out infinite" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F3F4F6", flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ width: "40%", height: 14, borderRadius: 6, background: "#F3F4F6" }} />
                  <div style={{ width: "70%", height: 12, borderRadius: 6, background: "#F3F4F6" }} />
                  <div style={{ width: "55%", height: 12, borderRadius: 6, background: "#F3F4F6" }} />
                </div>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: "#F3F4F6", flexShrink: 0 }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 20, border: "1px solid #E5DDD0", padding: "60px 24px", background: "#fff", textAlign: "center", minHeight: 360 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <AlertCircle size={24} style={{ color: "#F87171" }} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0D3326", margin: "0 0 8px" }}>Unable to Load Notifications</h2>
            <p style={{ fontSize: 14, color: "#9CA3AF", margin: "0 0 24px", maxWidth: 320 }}>{error}</p>
            <button
              onClick={loadNotifications}
              style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 12, padding: "10px 24px", background: "#0D3326", color: "#D7AE62", fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none" }}
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 20, border: "1px solid #E5DDD0", padding: "70px 24px", background: "#fff", textAlign: "center", minHeight: 420 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Bell size={32} style={{ color: "#0D3326", opacity: 0.25 }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0D3326", margin: "0 0 8px" }}>
              {filter === "All" ? "No Notifications Yet" : `No ${filter} Notifications`}
            </h2>
            <p style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 340, margin: "0 0 24px" }}>
              {filter === "All"
                ? "You're all caught up. Buyer enquiries, site visits, and property updates will appear here."
                : `You don't have any ${filter.toLowerCase()} notifications at the moment.`}
            </p>
            {filter !== "All" && (
              <button
                onClick={() => setFilter("All")}
                style={{ fontWeight: 700, color: "#D7AE62", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {["Today", "Yesterday", "Earlier"].map((group) => {
              const items = groups[group];
              if (!items || items.length === 0) return null;
              return (
                <div key={group}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <h2 style={{ fontSize: 13, fontWeight: 800, color: "#0D3326", margin: 0 }}>{group}</h2>
                    <div style={{ flex: 1, height: 1, background: "#E5DDD0" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {items.map((n) => (
                      <NotificationCard
                        key={n.documentId || n.id}
                        notification={n}
                        onRead={handleRead}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
