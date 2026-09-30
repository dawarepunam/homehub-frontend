import { Suspense } from "react";

import UserHeader from "@/components/user/UserHeader";
import PropertyListingClient from "@/components/user/PropertyListingClient";
import { getProperties } from "@/services/property";
import { getUserSiteSettings } from "@/services/userSiteSettings";

const cleanLabel = (value) =>
  value ? value.toString().trim() : "";

// Loading fallback shown while the page shell hydrates
function ListingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F4EF" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#D7AE62] border-t-transparent" />
        <p className="text-sm font-medium text-[#0D3326]/60">Loading properties…</p>
      </div>
    </div>
  );
}

export default async function PropertiesPage({ searchParams }) {
  const params = await searchParams;
  const type = cleanLabel(params?.type);
  const purpose = cleanLabel(params?.purpose);

  // Fetch siteSettings for the header
  const siteSettings = await getUserSiteSettings();

  // Fetch ALL properties so the client can do client-side filtering, sorting, pagination
  // This avoids additional round-trips and matches the existing service pattern
  let properties = [];
  try {
    properties = await getProperties();
  } catch {
    properties = [];
  }

  return (
    <main className="min-h-screen">
      {/* ── Header ─────────────────────────────────────────────── */}
      <UserHeader headerData={siteSettings?.UserHeader} />

      {/* ── Listing Client ─────────────────────────────────────── */}
      <Suspense fallback={<ListingFallback />}>
        <PropertyListingClient
          initialProperties={properties}
          initialType={type}
          initialPurpose={purpose}
        />
      </Suspense>
    </main>
  );
}

