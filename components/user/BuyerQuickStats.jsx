"use client";

import { useEffect, useState } from "react";
import { Heart, MessageSquare, Eye, Clock } from "lucide-react";
import { getUserWishlist } from "@/services/wishlistService";
import { getMyEnquiries } from "@/services/enquiry";
import Link from "next/link";

export default function BuyerQuickStats() {
  const [stats, setStats] = useState({
    saved: null,
    enquiries: null,
    siteVisits: null,
    recentlyViewed: null,
  });

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token") || localStorage.getItem("jwt");
      if (!token) {
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      try {
        const [wishlist, enquiries] = await Promise.all([
          getUserWishlist().catch(() => null),
          getMyEnquiries().catch(() => []),
        ]);

        const savedCount = wishlist?.Wishlist?.properties?.length || 0;
        const enquiriesCount = enquiries?.length || 0;

        setStats({
          saved: savedCount,
          enquiries: enquiriesCount,
          siteVisits: 0, // Fallback since no clear API identified
          recentlyViewed: 0, // Fallback
        });
      } catch (error) {
        console.error("Failed to fetch quick stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Your Activity</h2>
        <p className="mt-2 text-lg text-gray-600">Overview of your property interactions</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Saved Properties */}
        <Link href="/user/wishlist" className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-red-100 hover:shadow-lg">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition-colors group-hover:bg-red-100">
            <Heart size={28} />
          </div>
          <h3 className="text-4xl font-extrabold text-gray-900">
            {loading ? "-" : stats.saved}
          </h3>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Saved Properties</p>
          {!loading && stats.saved === 0 && (
            <p className="mt-3 text-sm text-gray-400">No saved properties yet</p>
          )}
        </Link>

        {/* Enquiries */}
        <Link href="/user/enquiries" className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-100">
            <MessageSquare size={28} />
          </div>
          <h3 className="text-4xl font-extrabold text-gray-900">
            {loading ? "-" : stats.enquiries}
          </h3>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Enquiries</p>
          {!loading && stats.enquiries === 0 && (
            <p className="mt-3 text-sm text-gray-400">No enquiries yet</p>
          )}
        </Link>

        {/* Site Visits */}
        <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 transition-colors group-hover:bg-emerald-100">
            <Eye size={28} />
          </div>
          <h3 className="text-4xl font-extrabold text-gray-900">
            {loading ? "-" : stats.siteVisits}
          </h3>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Site Visits</p>
          {!loading && stats.siteVisits === 0 && (
            <p className="mt-3 text-sm text-gray-400">No upcoming visits</p>
          )}
        </div>

        {/* Recently Viewed */}
        <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-purple-100 hover:shadow-lg">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-500 transition-colors group-hover:bg-purple-100">
            <Clock size={28} />
          </div>
          <h3 className="text-4xl font-extrabold text-gray-900">
            {loading ? "-" : stats.recentlyViewed}
          </h3>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Recently Viewed</p>
          {!loading && stats.recentlyViewed === 0 && (
            <p className="mt-3 text-sm text-gray-400">No properties viewed</p>
          )}
        </div>
      </div>
    </section>
  );
}
