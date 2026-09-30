import UserHeader from "@/components/user/UserHeader";
import PropertyValuationClient from "@/components/user/PropertyValuationClient";
import { getUserSiteSettings } from "@/services/userSiteSettings";
import { getProperties } from "@/services/property";

export const metadata = {
  title: "Property Valuation | HomeHub",
  description: "Estimate the value of your property based on available HomeHub property data.",
};

export default async function PropertyValuationPage() {
  const siteSettings = await getUserSiteSettings();
  const allProperties = await getProperties();

  return (
    <main className="min-h-screen" style={{ background: "#F5F3EE" }}>
      <UserHeader headerData={siteSettings?.UserHeader} />
      <PropertyValuationClient allProperties={allProperties || []} />
    </main>
  );
}
