"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, MessageSquare, Eye, Clock, ArrowRight, Home, Store } from "lucide-react";
import { getUserWishlist } from "@/services/wishlistService";
import { getMyEnquiries } from "@/services/enquiry";

export default function BuyerDashboardClient({ heroData, properties }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");
  const [stats, setStats] = useState({ saved: null, enquiries: null, siteVisits: 0, recentlyViewed: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // ─── Auth Guard ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) {
      router.replace("/user/login");
      return;
    }
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        const hour = new Date().getHours();
        const time = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
        setGreeting(`${time}, ${parsed.username || parsed.name || "Buyer"}`);
      }
    } catch (_) {}
    setAuthChecked(true);
  }, [router]);

  // ─── Load Stats ─────────────────────────────────────────
  useEffect(() => {
    if (!authChecked) return;
    async function fetchStats() {
      try {
        const [wishlist, enquiries] = await Promise.all([
          getUserWishlist().catch(() => null),
          getMyEnquiries().catch(() => []),
        ]);
        setStats({
          saved: wishlist?.Wishlist?.properties?.length ?? 0,
          enquiries: Array.isArray(enquiries) ? enquiries.length : 0,
          siteVisits: 0,
          recentlyViewed: 0,
        });
      } catch (_) {
        setStats({ saved: 0, enquiries: 0, siteVisits: 0, recentlyViewed: 0 });
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, [authChecked]);

  // ─── Not yet checked ────────────────────────────────────
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#0D3326" }}>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#D7AE62]/30 border-t-[#D7AE62]" />
      </div>
    );
  }

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") || "http://localhost:1337";

  return (
    <main className="min-h-screen" style={{ background: "#F5F3EE" }}>

      {/* ═══════════════════════════════════════════════════
          HERO BANNER — premium dark green gradient
      ═══════════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0D3326 0%, #123F32 50%, #1A5240 100%)",
          minHeight: "420px",
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #D7AE62 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Gold accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #D7AE62, transparent)" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          {/* Badge */}
          <span
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(215,174,98,0.12)", color: "#D7AE62", border: "1px solid rgba(215,174,98,0.25)" }}
          >
            <Home size={12} />
            Buyer Dashboard
          </span>

          {/* Greeting */}
          <h1 className="text-4xl font-extrabold leading-tight text-white lg:text-5xl xl:text-6xl">
            {greeting}
          </h1>
          <p className="mt-3 text-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            Find a place that feels like home.
          </p>

          {/* Mode switch CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/user/properties"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #D7AE62, #C99A40)",
                color: "#0D3326",
                boxShadow: "0 6px 18px rgba(215,174,98,0.30)",
              }}
            >
              Browse Properties
              <ArrowRight size={15} />
            </Link>

            <button
              onClick={() => {
                localStorage.setItem("activeMode", "seller");
                router.push("/");
              }}
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{
                borderColor: "rgba(215,174,98,0.35)",
                background: "rgba(215,174,98,0.08)",
                color: "#D7AE62",
              }}
            >
              <Store size={15} />
              Switch to Seller Mode
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          QUICK STATS
      ═══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="-mt-10 grid grid-cols-2 gap-4 rounded-2xl p-6 shadow-xl lg:grid-cols-4"
          style={{ background: "#fff", borderTop: "4px solid #D7AE62" }}
        >
          {/* Saved */}
          <Link href="/user/wishlist" className="group flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:bg-[#F5F3EE]">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full transition-all group-hover:scale-110"
              style={{ background: "rgba(215,174,98,0.12)" }}
            >
              <Heart size={22} style={{ color: "#D7AE62" }} />
            </div>
            <span className="text-3xl font-extrabold" style={{ color: "#0D3326" }}>
              {statsLoading ? "—" : stats.saved}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Saved</span>
          </Link>

          {/* Enquiries */}
          <Link href="/user/enquiries" className="group flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:bg-[#F5F3EE]">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full transition-all group-hover:scale-110"
              style={{ background: "rgba(34,110,88,0.10)" }}
            >
              <MessageSquare size={22} style={{ color: "#226E58" }} />
            </div>
            <span className="text-3xl font-extrabold" style={{ color: "#0D3326" }}>
              {statsLoading ? "—" : stats.enquiries}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Enquiries</span>
          </Link>

          {/* Site Visits */}
          <div className="flex flex-col items-center gap-2 rounded-xl p-4 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "rgba(15,100,110,0.10)" }}
            >
              <Eye size={22} style={{ color: "#0F646E" }} />
            </div>
            <span className="text-3xl font-extrabold" style={{ color: "#0D3326" }}>
              {statsLoading ? "—" : stats.siteVisits}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Site Visits</span>
          </div>

          {/* Recently Viewed */}
          <div className="flex flex-col items-center gap-2 rounded-xl p-4 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "rgba(100,60,15,0.08)" }}
            >
              <Clock size={22} style={{ color: "#8B5E1A" }} />
            </div>
            <span className="text-3xl font-extrabold" style={{ color: "#0D3326" }}>
              {statsLoading ? "—" : stats.recentlyViewed}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Viewed</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PROPERTIES
      ═══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold" style={{ color: "#0D3326" }}>
              Featured Properties
            </h2>
            <p className="mt-1 text-sm text-gray-500">Discover the latest verified listings</p>
          </div>
          <Link
            href="/user/properties"
            className="inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ borderColor: "#D7AE62", color: "#0D3326" }}
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(properties || []).length === 0 ? (
            <div className="col-span-3 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
              <Home size={40} className="text-gray-300" />
              <p className="font-semibold text-gray-400">No properties yet</p>
            </div>
          ) : (
            (properties || []).slice(0, 6).map((property) => {
              const cover = property?.CoverImage?.[0] || property?.CoverImage || null;
              const imageUrl = cover?.url
                ? cover.url.startsWith("http")
                  ? cover.url
                  : `${STRAPI_URL}${cover.url}`
                : null;

              const common = property?.PropertyCommonDetails || {};
              const title = property?.Title || property?.title || "Property";
              const city = common?.City || property?.City || "";
              const area = common?.Area || property?.Area || "";
              const price = common?.Price || property?.Price || null;
              const listingType = property?.Listing_Type || "SALE";
              const status = property?.Status || "Available";

              return (
                <Link
                  key={property?.documentId || property?.id}
                  href={`/user/property/${property?.documentId || property?.id}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  style={{ border: "1px solid #EDE8DF" }}
                >
                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center" style={{ background: "#E8E3D8" }}>
                        <Home size={36} className="text-gray-400" />
                      </div>
                    )}

                    {/* Status badge */}
                    <span
                      className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide"
                      style={{
                        background: status === "Available" ? "#D7AE62" : "#0D3326",
                        color: status === "Available" ? "#0D3326" : "#D7AE62",
                      }}
                    >
                      {status}
                    </span>

                    {/* Type badge */}
                    <span
                      className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                      style={{ background: "rgba(13,51,38,0.80)", color: "#fff", backdropFilter: "blur(4px)" }}
                    >
                      {listingType}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="truncate text-base font-bold" style={{ color: "#0D3326" }}>
                      {title}
                    </h3>
                    {(city || area) && (
                      <p className="mt-1 truncate text-sm text-gray-500">
                        {[area, city].filter(Boolean).join(", ")}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      {price ? (
                        <span className="text-lg font-extrabold" style={{ color: "#0D3326" }}>
                          ₹{Number(price).toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-gray-400">Price on Request</span>
                      )}

                      <span
                        className="rounded-lg px-3 py-1.5 text-xs font-bold transition-all group-hover:translate-x-0.5"
                        style={{ background: "rgba(215,174,98,0.12)", color: "#8B5E1A" }}
                      >
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

    </main>
  );
}
