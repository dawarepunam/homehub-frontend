import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyOverview from "@/components/PropertyOverview";
import PropertyFeatures from "@/components/PropertyFeatures";
import PropertyLocation from "@/components/PropertyLocation";
import PropertyViewTracker from "@/components/PropertyViewTracker";

import { getOwnerDashboard } from "@/services/ownerDashboard";
import { getProperty } from "@/services/property";

export default async function PropertyDetailsPage({ params }) {

  // Dashboard Data
  const dashboard = await getOwnerDashboard();

  // Next.js 16
  const { documentId } = await params;

  // Property Data
  const property = await getProperty(documentId);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold text-red-600">
          Property Not Found
        </h1>
      </div>
    );
  }

  // Rich Text Description
  const description =
    property?.Description?.[0]?.children?.[0]?.text || "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Track this view (client-only, no-op if not logged in) */}
      <PropertyViewTracker propertyDocumentId={documentId} />

      {/* Header */}
      <Header headerData={dashboard?.header} />

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

        <div className="mb-6">
          <Link
            href="/home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#18352a",
              textDecoration: "none",
            }}
          >
            ← Back
          </Link>
        </div>

        {/* Gallery */}
        <PropertyGallery property={property} />

        {/* Overview */}
        <PropertyOverview property={property} />

        {/* Features */}
        <PropertyFeatures property={property} />

        {/* Location */}
        <PropertyLocation property={property} />

        {/* Property Information */}
        <section className="mt-12 rounded-2xl bg-white p-8 shadow">

          <h1 className="text-4xl font-bold text-gray-900">
            {property.Title}
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            📍 {property.Address}, {property.Area}, {property.City}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              {property.Property_Type}
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              {property.PropertyStatus}
            </span>

            <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
              {property.Purpose}
            </span>

            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
              {property.Category}
            </span>

          </div>

        </section>

        {/* Description */}
        <section className="mt-10 rounded-2xl bg-white p-8 shadow">

          <h2 className="mb-5 text-3xl font-bold text-gray-900">
            Description
          </h2>

          <p className="text-lg leading-8 text-gray-600">
            {description}
          </p>

        </section>

      </main>

      {/* Footer */}
      <Footer copyrightData={dashboard?.copyright} />

    </div>
  );
}