"use client";
import NextImage from "next/image";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Building, Loader2, Rocket } from "lucide-react";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import { getPropertyById } from "../../services/promotionService";
import { getOwnerDashboard } from "@/services/ownerDashboard";

function SelectPropertyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProperty() {
      if (!propertyId) {
        setError("No property selected.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await getPropertyById(propertyId);
        if (!data) {
          setError("Property not found or you don't have permission.");
        } else {
          setProperty(data);
        }
      } catch (err) {
        setError(err.message || "Unable to load property details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProperty();
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600 mt-8">
        {error}
        <button
          onClick={() => router.push("/owner/promotions/boost")}
          className="mt-4 block text-sm font-semibold underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/owner/promotions/boost")}
          className="mb-4 flex items-center gap-1 text-sm font-semibold text-[#103D2E] hover:underline"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-[#103D2E]">
          Confirm Property
        </h1>
        <p className="mt-2 text-gray-600">
          Review the property details before choosing a boost duration.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Side: Property Card */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="relative h-64 w-full bg-gray-100 sm:h-80">
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
                  <Building size={64} />
                </div>
              )}
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-[#103D2E]">{property.Title}</h2>
              <p className="mt-2 text-gray-600">
                {[property.Locality, property.City, property.State].filter(Boolean).join(", ")}
              </p>
              <p className="mt-4 text-xl font-bold text-[#103D2E]">
                ₹ {property.Price?.toLocaleString('en-IN')} {property.PriceUnits}
              </p>

              <div className="mt-8 flex items-center gap-8 border-t border-gray-50 pt-6">
                <div>
                  <span className="block text-sm text-gray-500">Views</span>
                  <span className="text-lg font-semibold text-[#103D2E]">{property.Views || 0}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">Enquiries</span>
                  <span className="text-lg font-semibold text-[#103D2E]">
                    {property.enquiries?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">Saves</span>
                  <span className="text-lg font-semibold text-[#103D2E]">{property.Saves || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Action Box */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="rounded-2xl border border-[#4A7465]/20 bg-[#F0F5F2] p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <Rocket className="h-6 w-6 text-[#103D2E]" />
            </div>
            <h3 className="text-lg font-bold text-[#103D2E]">Boost Listing</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Boosting this property will increase its visibility in search results and help you get more potential enquiries faster.
            </p>
            
            <Link
              href={`/owner/promotions/boost/duration?propertyId=${propertyId}`}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#103D2E] px-4 py-3.5 text-sm font-bold text-[#F3D59B] transition-all hover:bg-[#1A5C47] shadow-sm hover:shadow-md"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SelectPropertyPage() {
  const [dashboard, setDashboard] = React.useState(null);

  React.useEffect(() => {
    getOwnerDashboard().then(d => setDashboard(d || null)).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FBF9] font-sans">
      <Header headerData={dashboard?.header || dashboard?.Header || null} />
      <main className="flex-1 pb-16 pt-8">
        <div className="mx-auto max-w-[1000px] px-4 md:px-6 lg:px-8">
          <Suspense fallback={
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-500">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#103D2E]" />
            </div>
          }>
            <SelectPropertyContent />
          </Suspense>
        </div>
      </main>
      <Footer data={dashboard?.Footer || dashboard?.footer || null} />
    </div>
  );
}
