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
    <div className="seller-page-wrapper flex min-h-screen flex-col">
      <Header headerData={dashboard?.header || dashboard?.Header || null} />
      
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--seller-gold)]">
              Seller Portal
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-[var(--seller-text)] sm:text-3xl lg:text-4xl">
              Add New Property
            </h1>
            <p className="mt-1 text-sm text-[var(--seller-text-muted)]">
              List your residential, commercial, or industrial property on HomeHub
            </p>
          </div>
          <PropertyForm />
        </div>
      </main>
      
      <Footer data={dashboard?.Footer || dashboard?.footer || null} />
    </div>
  );
}