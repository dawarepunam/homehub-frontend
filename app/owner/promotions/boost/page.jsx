"use client";
import NextImage from "next/image";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, Building, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "../../Footer";
import { getOwnerProperties } from "../../../../services/ownerProperties";
import { getOwnerDashboard } from "@/services/ownerDashboard";

export default function BoostListingPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadProperties() {
      try {
        setIsLoading(true);
        const [data, dashboardData] = await Promise.all([
          getOwnerProperties(),
          getOwnerDashboard()
        ]);
        setProperties(data);
        setDashboard(dashboardData || null);
      } catch (err) {
        setError(err.message || "Unable to load properties.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProperties();
  }, []);

  const filteredProperties = properties.filter((prop) =>
    prop.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.Locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.City?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FBF9] font-sans">
      <Header
        headerData={
          dashboard?.header ||
          dashboard?.Header ||
          null
        }
      />
      <main className="flex-1 pb-16 pt-8">
        <div className="mx-auto max-w-[900px] px-4 md:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push("/owner/promotions")}
              className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#103D2E] hover:underline"
            >
              <ChevronLeft size={16} /> Back to Promotions
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-[#103D2E]">
              Select Property to Boost
            </h1>
            <p className="mt-2 text-gray-600">
              Choose the property you want to promote for more visibility.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#4A7465] focus:ring-2 focus:ring-[#4A7465]/20"
            placeholder="Search your property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* State Handling */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
            <p>Loading your properties...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        )}

        {!isLoading && !error && filteredProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-gray-500">
            <Building className="mb-4 h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium text-[#103D2E]">No properties found</p>
            <p className="mt-1 text-sm">You don&apos;t have any properties available for promotion.</p>
          </div>
        )}

        {/* Property List */}
        {!isLoading && !error && filteredProperties.length > 0 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-[#103D2E]">Your Properties</h2>
            
            {filteredProperties.map((property) => (
              <div
                key={property.documentId || property.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all sm:flex-row"
              >
                {/* Image Placeholder or Actual Image */}
                <div className="relative h-48 w-full bg-gray-100 sm:h-auto sm:w-48 shrink-0">
                  {property.CoverImage?.url ? (
                    <NextImage
                      src={`${process.env.NEXT_PUBLIC_STRAPI_URL?.replace('/api', '') || 'http://localhost:1337'}${property.CoverImage.url}`}
                      alt={property.Title || 'Property image'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <Building size={32} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="text-lg font-bold text-[#103D2E]">
                      {property.Title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {[property.Locality, property.City].filter(Boolean).join(", ")}
                    </p>
                    <p className="mt-2 font-bold text-[#103D2E]">
                      ₹ {property.Price?.toLocaleString('en-IN')} {property.PriceUnits}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div>
                        <span className="block text-xs text-gray-400">Views</span>
                        <span className="font-semibold text-[#103D2E]">{property.Views || 0}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-400">Enquiries</span>
                        <span className="font-semibold text-[#103D2E]">
                          {property.enquiries?.length || 0}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-400">Saves</span>
                        <span className="font-semibold text-[#103D2E]">{property.Saves || 0}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/owner/promotions/boost/select-property?propertyId=${property.documentId || property.id}`}
                      className="rounded-lg bg-[#F3D59B] px-4 py-2 text-sm font-bold text-[#103D2E] transition-all hover:bg-[#E5C384]"
                    >
                      Boost This Property
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </main>

      <Footer
        data={
          dashboard?.Footer ||
          dashboard?.footer ||
          null
        }
      />
    </div>
  );
}
