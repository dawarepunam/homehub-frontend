"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Building2, MessageSquare, MapPin, CreditCard, UserCheck,
  ArrowRight, Clock, CheckCircle2, XCircle, AlertTriangle, CalendarDays,
  TrendingUp, LayoutGrid, Zap, FileText, Eye, ChevronRight, Star
} from "lucide-react";
import AdminSummaryCard from "./AdminSummaryCard";
import { AdminLoadingState, AdminErrorState, AdminEmptyState } from "./AdminStates";

// ─── Token & URL helpers ────────────────────────────────────────────
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}
const STRAPI = () =>
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";
const MEDIA_BASE = () =>
  (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api").replace(/\/api\/?$/, "");

// ─── Status pill config ─────────────────────────────────────────────
const statusStyles = {
  Pending: { bg: "rgba(215,174,98,0.18)", color: "#A07B1E", label: "Pending" },
  New: { bg: "rgba(215,174,98,0.18)", color: "#A07B1E", label: "New" },
  Contacted: { bg: "rgba(23,70,56,0.15)", color: "#174638", label: "Contacted" },
  "Site Visit": { bg: "rgba(62,75,50,0.18)", color: "#3E4B32", label: "Site Visit" },
  "Site Visit Pending": { bg: "rgba(62,75,50,0.18)", color: "#3E4B32", label: "Visit Pending" },
  Scheduled: { bg: "rgba(23,70,56,0.15)", color: "#174638", label: "Scheduled" },
  Confirmed: { bg: "rgba(23,70,56,0.15)", color: "#174638", label: "Confirmed" },
  Completed: { bg: "rgba(13,51,38,0.12)", color: "#0D3326", label: "Completed" },
  Cancelled: { bg: "rgba(155,104,72,0.15)", color: "#7a3e1e", label: "Cancelled" },
  "Cancelled ": { bg: "rgba(155,104,72,0.15)", color: "#7a3e1e", label: "Cancelled" },
  Closed: { bg: "rgba(155,104,72,0.15)", color: "#7a3e1e", label: "Closed" },
  Interested: { bg: "rgba(23,70,56,0.15)", color: "#174638", label: "Interested" },
  NotInterested: { bg: "rgba(155,104,72,0.15)", color: "#7a3e1e", label: "Not Interested" },
  Rescheduled: { bg: "rgba(215,174,98,0.18)", color: "#A07B1E", label: "Rescheduled" },
  Converted: { bg: "rgba(13,51,38,0.12)", color: "#0D3326", label: "Converted" },
  "Follow-up Required": { bg: "rgba(155,104,72,0.12)", color: "#7a3e1e", label: "Follow-up" },
};

function StatusPill({ status }) {
  const s = statusStyles[status?.trim()] || { bg: "rgba(62,75,50,0.12)", color: "#3E4B32", label: status || "—" };
  return (
    <span style={{
      background: s.bg, color: s.color, padding: "3px 10px",
      borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

// ─── Property status pipeline stages (actual Strapi enum values) ────
const PIPELINE_STAGES = [
  { status: "DRAFT", label: "Draft", icon: FileText, color: "#8a9a8a" },
  { status: "PENDING", label: "Pending Review", icon: Clock, color: "#D7AE62" },
  { status: "ACTIVE", label: "Active", icon: CheckCircle2, color: "#4CAF50" },
  { status: "RESERVED", label: "Reserved", icon: Star, color: "#9B6848" },
  { status: "SOLD", label: "Sold / Rented", icon: TrendingUp, color: "#0D3326" },
];

// ─── Section wrapper component ──────────────────────────────────────
function Section({ title, subtitle, surface = "white", action, children, style }) {
  const surfaces = {
    white: { bg: "#FFFFFF", border: "rgba(220,204,176,0.5)", title: "#17231E", sub: "#7a8f7a" },
    forest: { bg: "#0D3326", border: "rgba(215,174,98,0.15)", title: "#F5EDD9", sub: "rgba(245,237,217,0.6)" },
    emerald: { bg: "#174638", border: "rgba(215,174,98,0.12)", title: "#F5EDD9", sub: "rgba(245,237,217,0.6)" },
    olive: { bg: "#3E4B32", border: "rgba(215,174,98,0.1)", title: "#F5EDD9", sub: "rgba(245,237,217,0.6)" },
    earth: { bg: "#9B6848", border: "rgba(215,174,98,0.15)", title: "#F5EDD9", sub: "rgba(245,237,217,0.6)" },
    sand: { bg: "#DCCCB0", border: "rgba(13,51,38,0.1)", title: "#0D3326", sub: "#5a6b5a" },
    cream: { bg: "#F3EBDD", border: "rgba(13,51,38,0.08)", title: "#17231E", sub: "#6b7f6b" },
  };
  const s = surfaces[surface] || surfaces.white;
  return (
    <div style={{
      background: s.bg, borderRadius: 20, border: `1px solid ${s.border}`,
      overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      ...style,
    }}>
      <div style={{
        padding: "20px 24px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        borderBottom: `1px solid ${s.border}`,
      }}>
        <div>
          <h3 style={{ color: s.title, fontSize: 15, fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
          {subtitle && <p style={{ color: s.sub, fontSize: 12, marginTop: 3, fontWeight: 500 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminName, setAdminName] = useState("Admin");
  const [dash, setDash] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u.username || u.name) setAdminName(u.username || u.name);
    } catch (_) {}
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");
      const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      const api = STRAPI();

      const [usersRes, propsRes, enqRes] = await Promise.all([
        fetch(`${api}/users?populate=role&pagination[limit]=500`, { headers: h }),
        fetch(`${api}/properties?populate=*&pagination[limit]=500&sort=createdAt:desc`, { headers: h }),
        fetch(`${api}/enquiries?populate=*&pagination[limit]=500&sort=createdAt:desc`, { headers: h }),
      ]);

      const users = usersRes.ok ? await usersRes.json() : [];
      const propsData = propsRes.ok ? await propsRes.json() : { data: [] };
      const enqData = enqRes.ok ? await enqRes.json() : { data: [] };

      const properties = propsData.data || [];
      const enquiries = enqData.data || [];
      const now = new Date();

      // ── Users ──
      const totalUsers = users.length;
      const activeSellers = users.filter(u =>
        u.role?.name === "Owner" || u.role?.type === "owner" || u.role?.name === "Authenticated"
      ).length;

      // ── Subscriptions ──
      let subActive = 0, subExpiring = 0, subExpired = 0;
      users.forEach(u => {
        if (u.subscriptionValidUntil) {
          const d = new Date(u.subscriptionValidUntil);
          const days = (d - now) / 86400000;
          if (days < 0) subExpired++;
          else if (days <= 7) { subExpiring++; subActive++; }
          else subActive++;
        }
      });

      // ── Properties ──
      const totalProperties = properties.length;
      const pipelineCounts = {};
      PIPELINE_STAGES.forEach(s => { pipelineCounts[s.status] = 0; });
      properties.forEach(p => {
        const st = p.PropertyStatus;
        if (st && pipelineCounts[st] !== undefined) pipelineCounts[st]++;
      });

      // ── Enquiries ──
      const totalEnquiries = enquiries.length;
      const siteVisits = enquiries.filter(e =>
        e.EnquiryType === "Schedule Visit" ||
        (e.Statuss && (e.Statuss.includes("Site Visit") || e.Statuss === "Scheduled" || e.Statuss === " Confirmed"))
      );

      const pendingEnquiries = enquiries.filter(e =>
        !e.Statuss || e.Statuss === "Pending" || e.Statuss === "New"
      );

      const todayVisits = siteVisits.filter(v => {
        if (!v.VisitDate) return false;
        const d = new Date(v.VisitDate);
        return d.toDateString() === now.toDateString();
      });

      const upcomingVisits = siteVisits
        .filter(v => v.VisitDate && new Date(v.VisitDate) >= now)
        .sort((a, b) => new Date(a.VisitDate) - new Date(b.VisitDate))
        .slice(0, 5);

      // ── Intelligence ──
      const cityCount = {};
      const typeCount = {};
      const purposeCount = {};
      const oneWeekAgo = new Date(now.getTime() - 7 * 86400000);
      let newThisWeek = 0;

      properties.forEach(p => {
        if (p.City) cityCount[p.City] = (cityCount[p.City] || 0) + 1;
        if (p.Property_Type) typeCount[p.Property_Type] = (typeCount[p.Property_Type] || 0) + 1;
        if (p.Purpose) purposeCount[p.Purpose] = (purposeCount[p.Purpose] || 0) + 1;
        if (p.createdAt && new Date(p.createdAt) >= oneWeekAgo) newThisWeek++;
      });

      const topCity = Object.entries(cityCount).sort((a, b) => b[1] - a[1])[0];
      const topType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0];
      const topPurpose = Object.entries(purposeCount).sort((a, b) => b[1] - a[1])[0];

      // Most enquired property
      const propEnqCount = {};
      enquiries.forEach(e => {
        const pTitle = e.property?.Title;
        if (pTitle) propEnqCount[pTitle] = (propEnqCount[pTitle] || 0) + 1;
      });
      const topEnquiredProp = Object.entries(propEnqCount).sort((a, b) => b[1] - a[1])[0];

      // ── Pending approvals ──
      const pendingApprovals = properties.filter(p => p.PropertyStatus === "PENDING" || p.PropertyStatus === "DRAFT");

      setDash({
        totalUsers, activeSellers, subActive, subExpiring, subExpired,
        totalProperties, pipelineCounts,
        totalEnquiries, siteVisitsTotal: siteVisits.length,
        pendingEnquiries: pendingEnquiries.length,
        todayVisits: todayVisits.length,
        upcomingVisits,
        recentEnquiries: enquiries.slice(0, 6),
        pendingApprovals: pendingApprovals.slice(0, 5),
        intelligence: {
          topCity: topCity ? topCity[0] : null,
          topType: topType ? topType[0] : null,
          topPurpose: topPurpose ? topPurpose[0] : null,
          topEnquiredProp: topEnquiredProp ? topEnquiredProp[0] : null,
          newThisWeek,
          pendingCount: pendingApprovals.length,
        },
        // Seller health
        sellerHealth: {
          activeSellers,
          activeListings: properties.filter(p => p.PropertyStatus === "ACTIVE").length,
          pendingListings: properties.filter(p => p.PropertyStatus === "PENDING").length,
          sellerEnquiries: enquiries.length,
          upcomingVisits: upcomingVisits.length,
          activeSubscriptions: subActive,
        },
      });
    } catch (e) {
      setError(e.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  function getImgUrl(prop) {
    const img = prop?.CoverImage;
    if (!img?.url) return null;
    const base = MEDIA_BASE();
    return img.url.startsWith("http") ? img.url : `${base}${img.url}`;
  }

  if (loading) return <AdminLoadingState message="Loading HomeHub Administration…" />;
  if (error) return <AdminErrorState message={error} onRetry={loadData} />;
  if (!dash) return null;

  const { totalUsers, activeSellers, subActive, subExpiring, subExpired,
    totalProperties, pipelineCounts, totalEnquiries, siteVisitsTotal,
    pendingEnquiries, todayVisits, upcomingVisits, recentEnquiries,
    pendingApprovals, intelligence, sellerHealth } = dash;

  const attentionItems = [
    pendingApprovals.length > 0 && {
      icon: Building2, label: "Property Approvals", desc: "Properties waiting for review", count: pendingApprovals.length, color: "#D7AE62",
    },
    pendingEnquiries > 0 && {
      icon: MessageSquare, label: "Enquiries", desc: "Enquiries awaiting response", count: pendingEnquiries, color: "#C9A94F",
    },
    todayVisits > 0 && {
      icon: CalendarDays, label: "Site Visits Today", desc: "Visits scheduled for today", count: todayVisits, color: "#4a9b6b",
    },
    subExpiring > 0 && {
      icon: CreditCard, label: "Subscriptions", desc: "Expiring within 7 days", count: subExpiring, color: "#D7AE62",
    },
  ].filter(Boolean);

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* ── WELCOME BANNER ── */}
      <div style={{
        background: "linear-gradient(120deg, #0A2E1E 0%, #0D3326 55%, #183D2C 100%)",
        borderRadius: 24, padding: "36px 40px", position: "relative", overflow: "hidden",
        boxShadow: "0 8px 40px rgba(13,51,38,0.25)",
      }}>
        {/* Decorative architectural lines */}
        <svg style={{ position: "absolute", top: 0, right: 0, width: "340px", height: "100%", opacity: 0.07 }} viewBox="0 0 340 180" fill="none">
          <path d="M340 0 L200 0 L100 90 L200 180 L340 180Z" fill="#D7AE62" />
          <path d="M340 20 L240 20 L160 90 L240 160 L340 160Z" fill="#D7AE62" />
          <circle cx="280" cy="90" r="60" stroke="#D7AE62" strokeWidth="1" fill="none" />
          <circle cx="280" cy="90" r="40" stroke="#D7AE62" strokeWidth="1" fill="none" />
        </svg>
        {/* Botanical silhouette */}
        <svg style={{ position: "absolute", bottom: 0, right: 80, width: 160, height: "100%", opacity: 0.08 }} viewBox="0 0 160 180" fill="none">
          <ellipse cx="80" cy="120" rx="60" ry="80" fill="#D7AE62" />
          <ellipse cx="110" cy="80" rx="40" ry="55" fill="#D7AE62" />
          <rect x="75" y="90" width="10" height="90" rx="5" fill="#D7AE62" />
        </svg>

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "#D7AE62", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            {greeting} ☀️
          </p>
          <h1 style={{ color: "#F5EDD9", fontSize: 32, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Welcome back, {adminName}
          </h1>
          <p style={{ color: "rgba(245,237,217,0.65)", fontSize: 15, fontWeight: 500, marginBottom: 20 }}>
            Here's what's happening across HomeHub today.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(215,174,98,0.12)", borderRadius: 20, padding: "6px 14px", border: "1px solid rgba(215,174,98,0.2)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4CAF50", display: "inline-block", boxShadow: "0 0 6px #4CAF50" }} />
              <span style={{ color: "#F5EDD9", fontSize: 12, fontWeight: 600 }}>Platform Operational</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(215,174,98,0.08)", borderRadius: 20, padding: "6px 14px", border: "1px solid rgba(215,174,98,0.12)" }}>
              <span style={{ color: "rgba(245,237,217,0.7)", fontSize: 12 }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUMMARY CARDS (6) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
        <AdminSummaryCard title="Total Users" value={totalUsers} icon={Users}
          surface="forest" description="Registered buyers & sellers" href="/admin/users"
          secondaryStats={[{ label: "total registered", value: totalUsers }]}
        />
        <AdminSummaryCard title="Total Properties" value={totalProperties} icon={Building2}
          surface="emerald" description="Listed across all categories" href="/admin/properties"
          secondaryStats={[
            { label: "Active", value: pipelineCounts["ACTIVE"] || 0 },
            { label: "Pending", value: pipelineCounts["PENDING"] || 0 },
          ]}
        />
        <AdminSummaryCard title="Total Enquiries" value={totalEnquiries} icon={MessageSquare}
          surface="earth" description="Messages and contact requests" href="/admin/enquiries"
          secondaryStats={[{ label: "Awaiting response", value: pendingEnquiries }]}
        />
        <AdminSummaryCard title="Site Visits" value={siteVisitsTotal} icon={MapPin}
          surface="olive" description="Scheduled and completed" href="/admin/enquiries"
          secondaryStats={[{ label: "Today", value: todayVisits }, { label: "Upcoming", value: upcomingVisits.length }]}
        />
        <AdminSummaryCard title="Active Sellers" value={activeSellers} icon={UserCheck}
          surface="sand" description="Owners with active listings" href="/admin/users/sellers"
        />
        <AdminSummaryCard title="Active Subscriptions" value={subActive} icon={CreditCard}
          surface="forest" description="Premium seller plans" href="/admin/subscriptions"
          secondaryStats={[{ label: "Expiring soon", value: subExpiring }, { label: "Expired", value: subExpired }]}
        />
      </div>

      {/* ── PROPERTY PIPELINE ── */}
      <div style={{
        background: "#0D3326", borderRadius: 20, padding: "26px 28px",
        boxShadow: "0 4px 24px rgba(13,51,38,0.2)", border: "1px solid rgba(215,174,98,0.1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h3 style={{ color: "#F5EDD9", fontSize: 15, fontWeight: 800, margin: 0 }}>Property Pipeline</h3>
            <p style={{ color: "rgba(245,237,217,0.5)", fontSize: 12, marginTop: 3 }}>Track property status across the lifecycle</p>
          </div>
          <Link href="#" style={{ display: "flex", alignItems: "center", gap: 5, color: "#D7AE62", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
          {PIPELINE_STAGES.map((stage, i) => {
            const count = pipelineCounts[stage.status] || 0;
            const StageIcon = stage.icon;
            return (
              <div key={stage.status} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 100 }}>
                <PipelineStage stage={stage} count={count} StageIcon={StageIcon} />
                {i < PIPELINE_STAGES.length - 1 && (
                  <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, rgba(215,174,98,0.4), rgba(215,174,98,0.1))", minWidth: 20 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MAIN GRID: LEFT 2/3 + RIGHT 1/3 ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>

        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ATTENTION REQUIRED */}
          <div style={{
            background: "#9B6848", borderRadius: 20, overflow: "hidden",
            boxShadow: "0 4px 20px rgba(155,104,72,0.2)", border: "1px solid rgba(215,174,98,0.15)",
          }}>
            <div style={{ padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(215,174,98,0.12)" }}>
              <div>
                <h3 style={{ color: "#F5EDD9", fontSize: 15, fontWeight: 800, margin: 0 }}>Attention Required</h3>
                <p style={{ color: "rgba(245,237,217,0.55)", fontSize: 12, marginTop: 3 }}>Items requiring immediate action</p>
              </div>
              <AlertTriangle size={18} color="#D7AE62" />
            </div>
            {attentionItems.length === 0 ? (
              <div style={{ padding: "32px 24px", textAlign: "center" }}>
                <CheckCircle2 size={28} color="rgba(245,237,217,0.4)" style={{ margin: "0 auto 10px" }} />
                <p style={{ color: "rgba(245,237,217,0.7)", fontWeight: 700, fontSize: 14 }}>All caught up</p>
                <p style={{ color: "rgba(245,237,217,0.45)", fontSize: 12, marginTop: 4 }}>No pending actions at this time.</p>
              </div>
            ) : (
              <div>
                {attentionItems.map((item, i) => (
                  <AttentionRow key={i} item={item} last={i === attentionItems.length - 1} />
                ))}
              </div>
            )}
          </div>

          {/* RECENT ENQUIRIES */}
          <Section
            title="Recent Enquiries"
            subtitle="Latest enquiries from buyers"
            surface="emerald"
            action={
              <Link href="#" style={{ display: "flex", alignItems: "center", gap: 5, color: "#D7AE62", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                View All <ArrowRight size={13} />
              </Link>
            }
          >
            {recentEnquiries.length === 0 ? (
              <AdminEmptyState title="No recent enquiries" description="Enquiries will appear here once submitted." icon={MessageSquare} />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(215,174,98,0.1)" }}>
                      {["Buyer", "Property", "Type", "Status", "Date"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "rgba(245,237,217,0.45)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentEnquiries.map((enq, i) => (
                      <EnquiryRow key={enq.documentId || enq.id || i} enq={enq} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* PROPERTY INTELLIGENCE */}
          <IntelligencePanel intelligence={intelligence} properties={dash.pendingApprovals} />

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* QUICK ACTIONS */}
          <div style={{
            background: "#174638", borderRadius: 20, padding: "20px 20px 16px",
            boxShadow: "0 4px 18px rgba(23,70,56,0.2)", border: "1px solid rgba(215,174,98,0.1)",
          }}>
            <h3 style={{ color: "#F5EDD9", fontSize: 14, fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.01em" }}>Quick Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Users", icon: Users, href: "#" },
                { label: "Properties", icon: Building2, href: "#" },
                { label: "Enquiries", icon: MessageSquare, href: "#" },
                { label: "Site Visits", icon: MapPin, href: "#" },
                { label: "Subscriptions", icon: CreditCard, href: "#" },
                { label: "Reports", icon: FileText, href: "#" },
              ].map(a => <QuickActionTile key={a.label} {...a} />)}
            </div>
          </div>

          {/* SELLER SUBSCRIPTIONS */}
          <div style={{
            background: "#3E4B32", borderRadius: 20, padding: "20px 22px",
            boxShadow: "0 4px 18px rgba(62,75,50,0.2)", border: "1px solid rgba(215,174,98,0.1)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ color: "#F5EDD9", fontSize: 14, fontWeight: 800, margin: 0 }}>Seller Subscriptions</h3>
              <Link href="#" style={{ color: "#D7AE62", fontSize: 11, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                View All <ArrowRight size={11} />
              </Link>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "Active", val: subActive, color: "#4CAF50" },
                { label: "Expiring", val: subExpiring, color: "#D7AE62" },
                { label: "Expired", val: subExpired, color: "#9B6848" },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, background: "rgba(0,0,0,0.15)", borderRadius: 14, padding: "14px 10px",
                  textAlign: "center", border: `1px solid ${s.color}22`,
                }}>
                  <p style={{ color: s.color, fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.val}</p>
                  <p style={{ color: "rgba(245,237,217,0.6)", fontSize: 10, fontWeight: 700, marginTop: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SELLER HEALTH */}
          <div style={{
            background: "#174638", borderRadius: 20, padding: "20px 22px",
            boxShadow: "0 4px 18px rgba(23,70,56,0.18)", border: "1px solid rgba(215,174,98,0.1)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ color: "#F5EDD9", fontSize: 14, fontWeight: 800, margin: 0 }}>Seller Health</h3>
              <Link href="#" style={{ color: "#D7AE62", fontSize: 11, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                Details <ArrowRight size={11} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Active Sellers", val: sellerHealth.activeSellers },
                { label: "Active Listings", val: sellerHealth.activeListings },
                { label: "Pending Listings", val: sellerHealth.pendingListings },
                { label: "Seller Enquiries", val: sellerHealth.sellerEnquiries },
                { label: "Upcoming Visits", val: sellerHealth.upcomingVisits },
                { label: "Active Subscriptions", val: sellerHealth.activeSubscriptions },
              ].map(m => (
                <div key={m.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ color: "rgba(245,237,217,0.65)", fontSize: 12, fontWeight: 600, margin: 0 }}>{m.label}</p>
                  <p style={{ color: "#F5EDD9", fontSize: 16, fontWeight: 800, margin: 0 }}>{m.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* UPCOMING SITE VISITS */}
          <div style={{
            background: "#0D3326", borderRadius: 20, overflow: "hidden",
            boxShadow: "0 4px 18px rgba(13,51,38,0.18)", border: "1px solid rgba(215,174,98,0.1)",
          }}>
            <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid rgba(215,174,98,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "#F5EDD9", fontSize: 14, fontWeight: 800, margin: 0 }}>Upcoming Site Visits</h3>
              <CalendarDays size={15} color="#D7AE62" />
            </div>
            {upcomingVisits.length === 0 ? (
              <AdminEmptyState title="No upcoming visits" description="No site visits scheduled." icon={CalendarDays} />
            ) : (
              <div>
                {upcomingVisits.map((v, i) => (
                  <VisitRow key={v.documentId || v.id || i} visit={v} last={i === upcomingVisits.length - 1} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── PENDING PROPERTY APPROVALS ── */}
      {pendingApprovals.length > 0 && (
        <Section title="Property Approval Queue" subtitle="Properties waiting for admin review" surface="cream"
          action={
            <Link href="#" style={{ display: "flex", alignItems: "center", gap: 5, color: "#0D3326", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
              View All <ArrowRight size={13} />
            </Link>
          }
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {pendingApprovals.map((prop, i) => (
              <PendingPropertyRow key={prop.documentId || prop.id || i} prop={prop} imgUrl={getImgUrl(prop)} last={i === pendingApprovals.length - 1} />
            ))}
          </div>
        </Section>
      )}

    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function PipelineStage({ stage, count, StageIcon }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        padding: "10px 12px", borderRadius: 14, cursor: "default",
        background: hov ? "rgba(215,174,98,0.1)" : "transparent",
        transition: "background 200ms ease",
        minWidth: 80,
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        border: `2px solid ${hov ? "#D7AE62" : "rgba(215,174,98,0.3)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: hov ? "rgba(215,174,98,0.12)" : "rgba(215,174,98,0.06)",
        transition: "all 220ms ease",
        transform: hov ? "scale(1.08)" : "scale(1)",
      }}>
        <StageIcon size={18} color={hov ? "#D7AE62" : "rgba(245,237,217,0.6)"} strokeWidth={1.8} />
      </div>
      <p style={{ color: hov ? "#D7AE62" : "rgba(245,237,217,0.55)", fontSize: 10, fontWeight: 700, margin: 0, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {stage.label}
      </p>
      <p style={{ color: hov ? "#F5EDD9" : "rgba(245,237,217,0.8)", fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1 }}>
        {count}
      </p>
    </div>
  );
}

function AttentionRow({ item, last }) {
  const [hov, setHov] = useState(false);
  const ItemIcon = item.icon;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 22px",
        borderBottom: last ? "none" : "1px solid rgba(215,174,98,0.1)",
        background: hov ? "rgba(215,174,98,0.08)" : "transparent",
        borderLeft: hov ? "3px solid #D7AE62" : "3px solid transparent",
        transition: "all 200ms ease", cursor: "default",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "rgba(215,174,98,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <ItemIcon size={16} color={item.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: "#F5EDD9", fontSize: 13, fontWeight: 700, margin: 0 }}>{item.label}</p>
        <p style={{ color: "rgba(245,237,217,0.55)", fontSize: 11, marginTop: 2, fontWeight: 500 }}>{item.desc}</p>
      </div>
      <span style={{
        background: "rgba(215,174,98,0.2)", color: "#D7AE62",
        borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 800, flexShrink: 0,
      }}>
        {item.count}
      </span>
      <ChevronRight size={14} color={hov ? "#D7AE62" : "rgba(245,237,217,0.25)"} style={{ transition: "color 200ms", flexShrink: 0 }} />
    </div>
  );
}

function EnquiryRow({ enq }) {
  const [hov, setHov] = useState(false);
  const prop = enq.property;
  const date = enq.createdAt ? new Date(enq.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) : "—";
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: "1px solid rgba(215,174,98,0.08)",
        background: hov ? "rgba(215,174,98,0.05)" : "transparent",
        borderLeft: hov ? "3px solid #D7AE62" : "3px solid transparent",
        transition: "all 200ms ease", cursor: "default",
      }}
    >
      <td style={{ padding: "12px 16px", color: "#F5EDD9", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{enq.Name || "—"}</td>
      <td style={{ padding: "12px 16px", color: "rgba(245,237,217,0.65)", fontSize: 12, maxWidth: 160 }}>
        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {prop?.Title || "—"}
        </div>
        {prop?.City && <div style={{ color: "rgba(245,237,217,0.4)", fontSize: 10, marginTop: 2 }}>{prop.City}</div>}
      </td>
      <td style={{ padding: "12px 16px", color: "rgba(245,237,217,0.55)", fontSize: 11, whiteSpace: "nowrap" }}>{enq.EnquiryType || "—"}</td>
      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}><StatusPill status={enq.Statuss} /></td>
      <td style={{ padding: "12px 16px", color: "rgba(245,237,217,0.45)", fontSize: 11, whiteSpace: "nowrap" }}>{date}</td>
    </tr>
  );
}

function VisitRow({ visit, last }) {
  const [hov, setHov] = useState(false);
  const vd = visit.VisitDate ? new Date(visit.VisitDate) : null;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
        borderBottom: last ? "none" : "1px solid rgba(215,174,98,0.08)",
        background: hov ? "rgba(215,174,98,0.06)" : "transparent",
        transition: "background 200ms ease",
      }}
    >
      {vd && (
        <div style={{
          background: "rgba(215,174,98,0.12)", borderRadius: 12, padding: "8px 10px",
          textAlign: "center", minWidth: 44, flexShrink: 0,
        }}>
          <p style={{ color: "#D7AE62", fontSize: 18, fontWeight: 800, margin: 0, lineHeight: 1 }}>
            {vd.getDate()}
          </p>
          <p style={{ color: "rgba(245,237,217,0.55)", fontSize: 9, fontWeight: 700, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {vd.toLocaleString("en-IN", { month: "short" })}
          </p>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: "#F5EDD9", fontSize: 12, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {visit.Name || "Buyer"}
        </p>
        <p style={{ color: "rgba(245,237,217,0.45)", fontSize: 10, margin: "3px 0 0" }}>
          {visit.property?.Title || visit.EnquiryType || "Site Visit"}
        </p>
      </div>
      {visit.Statuss && <StatusPill status={visit.Statuss} />}
    </div>
  );
}

function QuickActionTile({ label, icon: Icon, href }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        background: hov ? "rgba(215,174,98,0.12)" : "rgba(0,0,0,0.15)",
        borderRadius: 14, padding: "16px 10px", textDecoration: "none",
        border: `1.5px solid ${hov ? "#D7AE62" : "rgba(215,174,98,0.08)"}`,
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 6px 20px rgba(0,0,0,0.15)" : "none",
        transition: "all 200ms ease", cursor: "pointer",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: "rgba(215,174,98,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: hov ? "scale(1.1)" : "scale(1)", transition: "transform 200ms ease",
      }}>
        <Icon size={17} color={hov ? "#D7AE62" : "rgba(245,237,217,0.7)"} strokeWidth={1.8} />
      </div>
      <span style={{ color: hov ? "#F5EDD9" : "rgba(245,237,217,0.65)", fontSize: 11, fontWeight: 700, textAlign: "center" }}>{label}</span>
    </Link>
  );
}

function IntelligencePanel({ intelligence }) {
  const items = [
    intelligence.topCity && { label: "Most Listed City", value: intelligence.topCity, icon: MapPin },
    intelligence.topType && { label: "Most Listed Type", value: intelligence.topType, icon: Building2 },
    intelligence.topPurpose && { label: "Most Listed Purpose", value: intelligence.topPurpose, icon: LayoutGrid },
    intelligence.topEnquiredProp && { label: "Most Enquired Property", value: intelligence.topEnquiredProp, icon: TrendingUp },
    { label: "New This Week", value: intelligence.newThisWeek > 0 ? intelligence.newThisWeek + " properties" : "None yet", icon: Zap },
    { label: "Pending Approval", value: intelligence.pendingCount > 0 ? intelligence.pendingCount + " properties" : "All clear", icon: Eye },
  ].filter(Boolean);

  return (
    <div style={{
      background: "#F3EBDD", borderRadius: 20, padding: "20px 24px",
      boxShadow: "0 2px 14px rgba(0,0,0,0.06)", border: "1px solid rgba(13,51,38,0.1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h3 style={{ color: "#17231E", fontSize: 15, fontWeight: 800, margin: 0 }}>Property Intelligence</h3>
          <p style={{ color: "#7a8f7a", fontSize: 12, marginTop: 3 }}>Based on current platform data</p>
        </div>
        <Star size={15} color="#D7AE62" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {items.map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <div key={i} style={{
              background: "#FFFFFF", borderRadius: 14, padding: "14px 14px",
              border: "1px solid rgba(13,51,38,0.06)",
            }}>
              <ItemIcon size={14} color="#0D3326" style={{ marginBottom: 8 }} />
              <p style={{ color: "#7a8f7a", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 5px" }}>{item.label}</p>
              <p style={{ color: "#17231E", fontSize: 13, fontWeight: 800, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.value || <span style={{ color: "#aaa", fontWeight: 500 }}>Not enough data yet</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PendingPropertyRow({ prop, imgUrl, last }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 16, padding: "16px 22px",
        borderBottom: last ? "none" : "1px solid rgba(13,51,38,0.07)",
        background: hov ? "rgba(13,51,38,0.03)" : "transparent",
        borderLeft: hov ? "3px solid #D7AE62" : "3px solid transparent",
        transition: "all 200ms ease",
      }}
    >
      <div style={{ width: 64, height: 52, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#e8dfd0" }}>
        {imgUrl ? (
          <img src={imgUrl} alt={prop.Title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Building2 size={20} color="#9B6848" />
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: "#17231E", fontSize: 13, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prop.Title}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
          {prop.City && <span style={{ color: "#7a8f7a", fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}><MapPin size={10} />{prop.City}</span>}
          <span style={{ background: "rgba(215,174,98,0.18)", color: "#A07B1E", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 12 }}>{prop.PropertyStatus}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button style={{
          background: "#0D3326", color: "#F5EDD9", border: "none", borderRadius: 8,
          padding: "7px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer",
        }}>Approve</button>
        <button style={{
          background: "transparent", color: "#9B6848", border: "1.5px solid rgba(155,104,72,0.3)", borderRadius: 8,
          padding: "7px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer",
        }}>Reject</button>
      </div>
    </div>
  );
}
