import Header from "@/components/user/UserHeader";
import BuyerAccountLayout from "@/components/user/BuyerAccountLayout";
import { getUserSiteSettings } from "@/services/userSiteSettings";

export const metadata = {
  title: "My Account — HomeHub",
  description: "Manage your HomeHub buyer profile, saved properties, enquiries and account settings.",
};

export default async function ProfileAreaLayout({ children }) {
  const settings = await getUserSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EF]">
      {/* Header */}
      <Header headerData={settings?.UserHeader} />

      {/* Main Account Layout */}
      <div className="flex-1">
        <BuyerAccountLayout>
          {children}
        </BuyerAccountLayout>
      </div>
    </div>
  );
}
