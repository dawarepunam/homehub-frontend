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
      <h2 className="text-2xl font-extrabold mb-6" style={{ color: "#0D3326" }}>Your Activity</h2>
      <div
        className="grid grid-cols-2 gap-4 rounded-2xl p-6 shadow-sm lg:grid-cols-4"
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
            {stats.saved ?? "—"}
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
            {stats.enquiries ?? "—"}
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
            {stats.siteVisits ?? "—"}
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
            {stats.recentlyViewed ?? "—"}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Viewed</span>
        </div>
      </div>
    </section>
  );
}
