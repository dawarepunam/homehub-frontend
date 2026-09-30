import UserHeader from "@/components/user/UserHeader";
import EligibilityCheckClient from "@/components/user/EligibilityCheckClient";
import { getUserSiteSettings } from "@/services/userSiteSettings";

export const metadata = {
  title: "Home Loan Eligibility | HomeHub",
  description: "Check your estimated home loan eligibility based on your income and existing obligations.",
};

export default async function EligibilityCheckPage() {
  const siteSettings = await getUserSiteSettings();

  return (
    <main className="min-h-screen" style={{ background: "#F5F3EE" }}>
      <UserHeader headerData={siteSettings?.UserHeader} />
      <EligibilityCheckClient />
    </main>
  );
}
