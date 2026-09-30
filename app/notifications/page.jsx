import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getOwnerDashboard } from "@/services/ownerDashboard";
import OwnerNotificationsClient from "./OwnerNotificationsClient";

export const metadata = {
  title: "Notifications — HomeHub",
  description: "View buyer enquiries and property updates.",
};

export default async function NotificationsPage() {
  // Fetch header/footer data only — no dead notification API calls
  let dashboard = null;
  try {
    dashboard = await getOwnerDashboard();
  } catch {
    // Continue without dashboard data
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F4EF" }}>
      <Header headerData={dashboard?.header} />
      <main className="flex-1">
        <OwnerNotificationsClient />
      </main>
      <Footer copyrightData={dashboard?.copyright} />
    </div>
  );
}