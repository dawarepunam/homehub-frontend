import UserHeader from "@/components/user/UserHeader";
import EmiCalculatorClient from "@/components/user/EmiCalculatorClient";
import { getUserSiteSettings } from "@/services/userSiteSettings";

export const metadata = {
  title: "EMI Calculator | HomeHub",
  description:
    "Calculate your estimated monthly EMI for home loans. Enter property price, down payment, interest rate, and tenure to get instant results.",
};

export default async function EmiCalculatorPage() {
  const siteSettings = await getUserSiteSettings();

  return (
    <main className="min-h-screen" style={{ background: "#F5F3EE" }}>
      {/* Reuse existing UserHeader — same as every other user page */}
      <UserHeader headerData={siteSettings?.UserHeader} />

      {/* Full interactive EMI calculator */}
      <EmiCalculatorClient />
    </main>
  );
}
