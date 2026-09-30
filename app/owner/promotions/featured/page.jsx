"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { Search, ChevronLeft, Building, Loader2, Star, TrendingUp, Eye, PhoneCall } from "lucide-react";
import Header from "@/components/Header";
import Footer from "../../Footer";
import { getOwnerProperties } from "../../../../services/ownerProperties";
import { getOwnerDashboard } from "@/services/ownerDashboard";

const BENEFITS = [
  { icon: Star, title: "Premium Placement", desc: "Your property appears in the Featured section on the homepage." },
  { icon: Eye, title: "Maximum Exposure", desc: "Get 3x more views than standard listings." },
  { icon: TrendingUp, title: "Priority Discovery", desc: "Featured listings rank higher in every search result." },
  { icon: PhoneCall, title: "More Enquiries", desc: "Reach serious buyers actively looking for properties." },
];

export default function FeaturedListingPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProperties, setShowProperties] = useState(false);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  const filtered = properties.filter(
    (p) =>
      p.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.Locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.City?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="mx-auto max-w-[960px] px-4 md:px-6 lg:px-8">

        {/* Back */}
        <button
          onClick={() => router.push("/owner/promotions")}
          className="mb-6 flex items-center gap-1 text-sm font-semibold text-[#103D2E] hover:underline"
        >
          <ChevronLeft size={16} /> Back to Promotions
        </button>

        {/* Hero */}
        {!showProperties && (
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#103D2E] to-[#1A5C47] p-8 md:p-12 text-white mb-10 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F3D59B]/20 px-4 py-1.5 mb-4">
                  <Star className="h-4 w-4 text-[#F3D59B]" />
                  <span className="text-xs font-bold text-[#F3D59B] uppercase tracking-widest">Featured Listing</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                  Give Your Property <span className="text-[#F3D59B]">Star Treatment</span>
                </h1>
                <p className="text-white/75 text-base mb-6 max-w-lg">
                  Feature your property to get premium placement, maximum visibility, and significantly more enquiries from serious buyers.
                </p>
                <button
                  onClick={() => setShowProperties(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F3D59B] px-6 py-3 text-sm font-bold text-[#103D2E] hover:bg-[#E5C384] transition-all shadow"
                >
                  <Star className="h-4 w-4" /> Feature a Property
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 shrink-0">
                {BENEFITS.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="rounded-2xl bg-white/10 backdrop-blur p-4 text-sm">
                    <Icon className="h-5 w-5 text-[#F3D59B] mb-2" />
                    <p className="font-bold mb-0.5">{title}</p>
                    <p className="text-white/65 text-xs">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Property Selection */}
        {showProperties && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#103D2E] mb-1">Select Property to Feature</h2>
              <p className="text-gray-600 text-sm">Choose which property you want to promote with Featured placement.</p>
            </div>

            <div className="mb-6 relative">
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

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
                <p>Loading your properties...</p>
              </div>
            )}
            {error && <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600">{error}</div>}
            {!isLoading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-gray-500">
                <Building className="mb-4 h-12 w-12 text-gray-300" />
                <p className="text-lg font-medium text-[#103D2E]">No properties found</p>
                <p className="mt-1 text-sm">You don&apos;t have any properties available for promotion.</p>
              </div>
            )}
            {!isLoading && !error && filtered.length > 0 && (
              <div className="flex flex-col gap-5">
                {filtered.map((property) => (
                  <div
                    key={property.documentId || property.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all sm:flex-row hover:shadow-md"
                  >
                    <div className="relative h-48 w-full bg-gray-100 sm:h-auto sm:w-48 shrink-0">
                      {property.CoverImage?.url ? (
                        <NextImage
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") || "http://localhost:1337"}${property.CoverImage.url}`}
                          alt={property.Title || "Property"}
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
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <h3 className="text-lg font-bold text-[#103D2E]">{property.Title}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {[property.Locality, property.City].filter(Boolean).join(", ")}
                        </p>
                        <p className="mt-2 font-bold text-[#103D2E]">
                          ₹ {property.Price?.toLocaleString("en-IN")} {property.PriceUnits}
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
                            <span className="font-semibold text-[#103D2E]">{property.enquiries?.length || 0}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-gray-400">Saves</span>
                            <span className="font-semibold text-[#103D2E]">{property.Saves || 0}</span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            router.push(
                              `/owner/promotions/featured/duration?propertyId=${property.documentId || property.id}`
                            )
                          }
                          className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-[#103D2E] transition-all hover:bg-amber-300 flex items-center gap-1.5"
                        >
                          <Star className="h-4 w-4" /> Feature This
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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
