import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyList from "@/components/PropertyList";

import { getOwnerDashboard } from "@/services/ownerDashboard";
import { getPropertiesByType } from "@/services/property";

export default async function PropertyTypePage({ params }) {
  const dashboard = await getOwnerDashboard();

  const { type } = await params;

  const properties = await getPropertiesByType(type);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <Header headerData={dashboard?.header} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold capitalize">
              {type} Properties
            </h1>

            <p className="mt-2 text-gray-500">
              Browse all available {type.toLowerCase()} properties.
            </p>
          </div>

          <div className="rounded-lg bg-blue-600 px-5 py-3 text-white shadow">
            <p className="text-sm">Total Properties</p>
            <p className="text-2xl font-bold">
              {properties.length}
            </p>
          </div>

        </div>

        {/* Property List */}
        {properties?.length > 0 ? (
          <PropertyList properties={properties} />
        ) : (
          <div className="rounded-xl bg-white p-12 text-center shadow">

            <h2 className="text-2xl font-semibold text-gray-700">
              No {type} Properties Found
            </h2>

            <p className="mt-3 text-gray-500">
              There are currently no {type.toLowerCase()} properties available.
            </p>

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer copyrightData={dashboard?.copyright} />

    </div>
  );
}