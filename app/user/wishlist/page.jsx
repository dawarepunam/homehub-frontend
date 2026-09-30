
import { Suspense } from "react";
import UserHeader from "@/components/user/UserHeader";
import WishlistClient from "@/components/user/WishlistClient";
import { getUserSiteSettings } from "@/services/userSiteSettings";

export default async function WishlistPage() {
  // Fetch siteSettings for the header
  const siteSettings = await getUserSiteSettings();

  return (
    <main className="min-h-screen bg-[#F7F4EF]">
      {/* ── Header ─────────────────────────────────────────────── */}
      <UserHeader headerData={siteSettings?.UserHeader} />

      {/* ── Wishlist Client ─────────────────────────────────────── */}
      <Suspense fallback={<div className="flex h-[60vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0D3326] border-t-transparent" /></div>}>
        <WishlistClient />
      </Suspense>
    </main>
  );
}
