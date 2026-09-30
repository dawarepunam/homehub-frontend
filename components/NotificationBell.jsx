"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Calendar,
  CheckCheck,
  ChevronRight,
  MessageCircle,
  Home,
  X,
  Building2,
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
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
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
  if (t.includes("sitevisit") || t.includes("visit") || t.includes("schedule"))
    return (
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Calendar size={16} style={{ color: "#D97706" }} />
      </div>
    );
  if (t.includes("enquiry") || t.includes("seller") || t.includes("response"))
    return (
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <MessageCircle size={16} style={{ color: "#059669" }} />
      </div>
    );
  if (t.includes("property") || t.includes("saved"))
    return (
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Home size={16} style={{ color: "#0D3326" }} />
      </div>
    );
  return (
    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Bell size={16} style={{ color: "#0D3326" }} />
    </div>
  );
}

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
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

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const markAsRead = async (id, link) => {
    try {
      const token = getToken();
      if (token) {
        await apiMarkAsRead(id, token);
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
    setOpen(false);
    if (link) router.push(link);
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

  const preview = notifications.slice(0, 5);

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      {/* Bell button */}
      <button
        type="button"
        onClick={() => { setOpen((p) => !p); if (!open) fetchNotifications(); }}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} new` : ""}`}
        style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "18px",
            height: "18px",
            borderRadius: "9px",
            background: "#E53E3E",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 800,
            padding: "0 4px",
            lineHeight: 1,
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "calc(100% + 12px)",
          zIndex: 99999,
          width: "360px",
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #EDE8DF",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#0D3326" }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{ background: "#FEE2E2", color: "#DC2626", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 800 }}>{unreadCount} new</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "#D7AE62", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                >
                  <CheckCheck size={13} />
                  Mark all as read
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#9CA3AF" }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
                <div style={{ width: 24, height: 24, border: "3px solid #E5E7EB", borderTopColor: "#0D3326", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F7F4EF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Bell size={28} style={{ color: "#0D3326", opacity: 0.3 }} />
                </div>
                <p style={{ fontWeight: 800, color: "#0D3326", marginBottom: 4 }}>No Notifications Yet</p>
                <p>You're all caught up. We'll show important updates here.</p>
              </div>
            ) : (
              preview.map((n) => {
                const title = n.Title || n.title || "Notification";
                const message = n.Message || n.message || "";
                const type = n.Type || n.type || "";
                const isRead = n.IsRead || n.isRead || false;
                const propAttrs = n.property?.data?.attributes || n.property || {};
                const propTitle = propAttrs?.Title || "";
                const propImg = getMediaUrl(propAttrs?.CoverImage);
                const link = n.Link || n.link || "/notifications"; // Owner notification fallback route
                
                return (
                  <button
                    key={n.documentId || n.id}
                    onClick={() => markAsRead(n.documentId || n.id, link)}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "14px 18px",
                      background: isRead ? "transparent" : "rgba(13,51,38,0.03)",
                      borderBottom: "1px solid #F9FAFB",
                      cursor: "pointer",
                      border: "none",
                      textAlign: "left",
                    }}
                  >
                    <NotifIcon type={type} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <p style={{ fontSize: 13, fontWeight: isRead ? 600 : 800, color: "#0D3326", margin: 0 }}>
                          {title}
                          {!isRead && <span style={{ marginLeft: 6, background: "#FEE2E2", color: "#DC2626", borderRadius: 8, padding: "1px 6px", fontSize: 10 }}>New</span>}
                        </p>
                        <span style={{ fontSize: 10, color: "#9CA3AF", whiteSpace: "nowrap" }}>{relativeTime(n.createdAt)}</span>
                      </div>
                      <p style={{ fontSize: 12, color: isRead ? "#9CA3AF" : "#4B5563", margin: "4px 0 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {message}
                      </p>
                      {propTitle && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                          <Building2 size={11} style={{ color: "#D7AE62" }} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {propTitle}
                          </span>
                        </div>
                      )}
                    </div>
                    {propImg ? (
                      <img src={propImg} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <ChevronRight size={14} style={{ color: "#D1D5DB", marginTop: 4, flexShrink: 0 }} />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid #F3F4F6" }}>
            <button
              onClick={() => { setOpen(false); router.push("/notifications"); }}
              style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: 6, padding: "14px 18px", fontSize: 13, fontWeight: 700, color: "#0D3326", background: "none", border: "none", cursor: "pointer" }}
            >
              View All Notifications <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}