import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import Link from "next/link";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyOverview from "@/components/PropertyOverview";
import PropertyFeatures from "@/components/PropertyFeatures";
import PropertyLocation from "@/components/PropertyLocation";
import PropertyViewTracker from "@/components/PropertyViewTracker";
import { ArrowLeft } from "lucide-react";

import { getHomePage } from "@/services/homePage";
import { getProperty } from "@/services/property";

export default async function PropertyDetailsPage({ params }) {

  // Public home page data for Header / Footer
  const homePage = await getHomePage();

  // Next.js 16
  const { documentId } = await params;

  // Property Data
  const property = await getProperty(documentId);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">
          Property Not Found
        </h1>
      </div>
    );
  }

  // Rich Text Description
  const description =
    property?.Description?.[0]?.children?.[0]?.text || "";

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* Track this view (client-only, no-op if not logged in) */}
      <PropertyViewTracker propertyDocumentId={documentId} />

      {/* PUBLIC HOMEHUB HEADER */}
      <HomeHeader header={homePage?.Header} />

      {/* Main */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-12">
        <div className="mb-8">
          <Link
            href="/new-projects/new-launches"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Properties
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
        <section className="mt-12 rounded-[var(--radius-card)] bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            {property.Title}
          </h1>

          <p className="text-lg text-[var(--text-muted)] font-medium mb-8">
            📍 {property.Address ? `${property.Address}, ` : ''}{property.Area ? `${property.Area}, ` : ''}{property.City}
          </p>

          <div className="flex flex-wrap gap-3">
            {property.Property_Type && (
              <span className="rounded-full bg-[var(--bg-page)] border border-[var(--border-subtle)] px-4 py-2 text-sm font-bold tracking-wide">
                {property.Property_Type}
              </span>
            )}
            {property.PropertyStatus && (
              <span className="rounded-full bg-[var(--bg-page)] border border-[var(--border-subtle)] px-4 py-2 text-sm font-bold tracking-wide">
                {property.PropertyStatus}
              </span>
            )}
            {property.Purpose && (
              <span className="rounded-full bg-[var(--bg-page)] border border-[var(--border-subtle)] px-4 py-2 text-sm font-bold tracking-wide">
                {property.Purpose}
              </span>
            )}
            {property.Category && (
              <span className="rounded-full bg-[var(--bg-page)] border border-[var(--border-subtle)] px-4 py-2 text-sm font-bold tracking-wide">
                {property.Category}
              </span>
            )}
          </div>
        </section>

        {/* Description */}
        {description && (
          <section className="mt-8 rounded-[var(--radius-card)] bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 shadow-[var(--shadow-card)]">
            <h2 className="text-2xl font-extrabold mb-6 tracking-tight">
              Description
            </h2>
            <p className="text-lg leading-relaxed text-[var(--text-muted)] font-medium whitespace-pre-wrap">
              {description}
            </p>
          </section>
        )}
      </main>

      {/* PUBLIC HOMEHUB FOOTER */}
      <Footer data={homePage?.Footer} />
    </div>
  );
}