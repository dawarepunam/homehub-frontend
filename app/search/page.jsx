import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

import { getHomePage } from "@/services/homePage";
import { searchPropertiesWithFilters } from "@/services/property";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;

  const q = params?.q || "";
  const purpose = params?.purpose || "";
  const location = params?.location || "";
  const type = params?.type || "";
  const budget = params?.budget || "";
  const category = params?.category || "";

  // Header Data
  const homePage = await getHomePage();

  // Search Result
  const hasFilters = q || purpose || location || type || budget || category;
  const properties = hasFilters
    ? await searchPropertiesWithFilters({ q, purpose, location, type, budget, category })
    : [];

  const formattedBudget = budget
    ? `Up to ₹${parseInt(budget, 10).toLocaleString("en-IN")}`
    : "";

  let displayLocation = "";
  if (location && purpose) displayLocation = `${purpose} in ${location}`;
  else if (location) displayLocation = `In ${location}`;
  else if (purpose) displayLocation = purpose;

  const searchTerms = [
    type && category ? `${type} › ${category}` : type || category,
    displayLocation,
    formattedBudget,
    q,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <HomeHeader header={homePage?.Header} />

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
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
          
          <p className="text-gray-600 mt-2">
            Search :<span className="font-semibold ml-2">{searchTerms || "All"}</span>
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {properties.length} Properties Found
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center max-w-2xl mx-auto mt-12">
            <div className="text-gray-300 mb-4 text-5xl">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-800">No properties found</h2>
            <p className="text-gray-500 mt-3 text-lg">
              We couldn't find properties matching your search.
            </p>
            <p className="text-gray-500 mt-1">
              Try changing your location, property type, or budget.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.documentId} property={property} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer data={homePage?.Footer} />
    </div>
  );
}
