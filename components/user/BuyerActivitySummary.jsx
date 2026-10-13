"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MessageSquare, Eye, Clock } from "lucide-react";
import { getUserWishlist } from "@/services/wishlistService";
import { getMyEnquiries } from "@/services/enquiry";

export default function BuyerActivitySummary() {
  const [stats, setStats] = useState({ saved: null, enquiries: null, siteVisits: 0, recentlyViewed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("jwt");
        if (!token) {
          setLoading(false);
          return;
        }

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
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-6">Your Activity</h2>
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm lg:grid-cols-4">
        {/* Saved */}
        <Link href="/user/wishlist" className="group flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:bg-[var(--bg-surface)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-all group-hover:scale-105">
            <Heart size={20} />
          </div>
          <span className="text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.saved ?? "—"}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Saved</span>
        </Link>

        {/* Enquiries */}
        <Link href="/user/enquiries" className="group flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all hover:bg-[var(--bg-surface)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-all group-hover:scale-105">
            <MessageSquare size={20} />
          </div>
          <span className="text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.enquiries ?? "—"}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Enquiries</span>
        </Link>

        {/* Site Visits */}
        <div className="flex flex-col items-center gap-2 rounded-xl p-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
            <Eye size={20} />
          </div>
          <span className="text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.siteVisits ?? "—"}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Site Visits</span>
        </div>

        {/* Recently Viewed */}
        <div className="flex flex-col items-center gap-2 rounded-xl p-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
            <Clock size={20} />
          </div>
          <span className="text-3xl font-extrabold text-[var(--text-primary)]">
            {stats.recentlyViewed ?? "—"}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Viewed</span>
        </div>
      </div>
    </section>
  );
}
