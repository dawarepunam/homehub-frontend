import PropertyForm from "@/components/property-form/PropertyForm";
import Header from "@/components/Header";
import Footer from "../owner/Footer";
import { getOwnerDashboard } from "@/services/ownerDashboard";

export const dynamic = "force-dynamic";

export default async function AddPropertyPage() {
  let dashboard = null;
  try {
    dashboard = await getOwnerDashboard();
  } catch (err) {
    console.error("Failed to load dashboard in AddProperty", err);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header headerData={dashboard?.header || dashboard?.Header || null} />
      
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="mb-8 text-3xl font-bold text-[#0D3326]">
            Add Property
          </h1>
          <PropertyForm />
        </div>
      </main>
      
      <Footer data={dashboard?.Footer || dashboard?.footer || null} />
    </div>
  );
}