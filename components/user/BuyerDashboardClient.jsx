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
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border-subtle)] border-t-[var(--text-primary)]" />
      </div>
    );
  }

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") || "http://localhost:1337";

  return (
    <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">

      {/* ═══════════════════════════════════════════════════
          HERO BANNER — sleek neutral aesthetic
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-14 lg:py-20">
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          {/* Badge */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            <Home size={12} />
            Buyer Dashboard
          </span>

          {/* Greeting */}
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] lg:text-5xl">
            {greeting}
          </h1>
          <p className="mt-3 text-base text-[var(--text-secondary)] sm:text-lg">
            Find a place that feels like home.
          </p>

          {/* Mode switch CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/user/properties"
              className="hh-btn hh-btn-primary"
            >
              Browse Properties
              <ArrowRight size={15} />
            </Link>

            <button
              onClick={() => {
                localStorage.setItem("activeMode", "seller");
                router.push("/");
              }}
              className="hh-btn hh-btn-secondary"
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
        <div className="-mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm lg:grid-cols-4">
          {/* Saved */}
          <Link href="/user/wishlist" className="group flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:bg-[var(--bg-surface)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-all group-hover:scale-105">
              <Heart size={20} />
            </div>
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">
              {statsLoading ? "—" : stats.saved}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Saved</span>
          </Link>

          {/* Enquiries */}
          <Link href="/user/enquiries" className="group flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:bg-[var(--bg-surface)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-all group-hover:scale-105">
              <MessageSquare size={20} />
            </div>
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">
              {statsLoading ? "—" : stats.enquiries}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Enquiries</span>
          </Link>

          {/* Site Visits */}
          <div className="flex flex-col items-center gap-2 rounded-xl p-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
              <Eye size={20} />
            </div>
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">
              {statsLoading ? "—" : stats.siteVisits}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Site Visits</span>
          </div>

          {/* Recently Viewed */}
          <div className="flex flex-col items-center gap-2 rounded-xl p-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
              <Clock size={20} />
            </div>
            <span className="text-3xl font-extrabold text-[var(--text-primary)]">
              {statsLoading ? "—" : stats.recentlyViewed}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Viewed</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PROPERTIES
      ═══════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Featured Properties
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Discover the latest verified listings</p>
          </div>
          <Link
            href="/user/properties"
            className="hh-btn hh-btn-secondary"
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(properties || []).length === 0 ? (
            <div className="col-span-3 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[var(--border-subtle)] py-16 text-center">
              <Home size={40} className="text-[var(--text-secondary)]" />
              <p className="font-semibold text-[var(--text-secondary)]">No properties yet</p>
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
                  className="group overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-[var(--bg-surface)]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--text-secondary)]">
                        <Home size={36} />
                      </div>
                    )}

                    {/* Status badge */}
                    <span className="absolute left-3 top-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] shadow-sm">
                      {status}
                    </span>

                    {/* Type badge */}
                    <span className="absolute right-3 top-3 rounded-full bg-[var(--text-primary)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--bg-card)]">
                      {listingType}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="truncate text-base font-bold text-[var(--text-primary)]">
                      {title}
                    </h3>
                    {(city || area) && (
                      <p className="mt-1 truncate text-sm text-[var(--text-secondary)]">
                        {[area, city].filter(Boolean).join(", ")}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
                      {price ? (
                        <span className="text-lg font-bold text-[var(--text-primary)]">
                          ₹{Number(price).toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-[var(--text-secondary)]">Price on Request</span>
                      )}

                      <span className="text-xs font-semibold text-[var(--text-primary)] transition-all group-hover:translate-x-0.5">
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
