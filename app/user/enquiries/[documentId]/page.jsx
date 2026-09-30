import UserHeader from "@/components/user/UserHeader";
import { getUserSiteSettings } from "@/services/userSiteSettings";
import EnquiryDetailsClient from "@/components/user/EnquiryDetailsClient";

export default async function EnquiryDetailsPage({ params }) {
  const { documentId } = await params;
  
  // Load User Site Settings from Strapi
  const siteSettings = await getUserSiteSettings();

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Buyer Header */}
      <UserHeader headerData={siteSettings?.UserHeader} />

      {/* Main Content (Client Component) */}
      <EnquiryDetailsClient documentId={documentId} />
    </div>
  );
}
