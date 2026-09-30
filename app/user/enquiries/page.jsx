import UserHeader from "@/components/user/UserHeader";
import { getUserSiteSettings } from "@/services/userSiteSettings";
import MyEnquiriesClient from "@/components/user/MyEnquiriesClient";
import { Suspense } from "react";

export default async function MyEnquiriesPage() {
  // Load User Site Settings from Strapi
  const siteSettings = await getUserSiteSettings();

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Buyer Header */}
      <UserHeader headerData={siteSettings?.UserHeader} />

      {/* Main Content (Client Component) */}
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <MyEnquiriesClient />
      </Suspense>
    </div>
  );
}
