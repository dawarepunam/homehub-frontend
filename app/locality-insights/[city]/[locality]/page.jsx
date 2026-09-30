import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import { getHomePage } from "@/services/homePage";
import {
  getLocalityOverview,
  getPropertiesForLocality,
} from "@/services/localityInsights";
import LocalityDetailClient from "./LocalityDetailClient";

// ─────────────────────────────────────────────────────────────────────────────
// Next.js 14+ requires awaiting params before use in Server Components.
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  // MUST await params in Next.js 14+
  const { city: cityParam, locality: localityParam } = await params;

  return {
    title: `${decodeURIComponent(localityParam).replace(/-/g, " ")}, ${decodeURIComponent(cityParam).replace(/-/g, " ")} Real Estate Insights | HomeHub`,
    description: `Explore property prices, average rent, and real estate market trends in ${decodeURIComponent(localityParam).replace(/-/g, " ")}, ${decodeURIComponent(cityParam).replace(/-/g, " ")}.`,
  };
}

export default async function LocalityDetailPage({ params }) {
  // ── STEP 1: Await params (required by Next.js 14+) ──────────────────────
  const { city: cityParam, locality: localityParam } = await params;

  // ── STEP 2: Fetch home page (for header/footer) and locality overview ────
  // Pass the raw slug params directly — getLocalityOverview handles decoding.
  const [homePage, overview] = await Promise.all([
    getHomePage(),
    getLocalityOverview(cityParam, localityParam),
  ]);

  // ── STEP 3: Locality genuinely not found ────────────────────────────────
  if (!overview) {
    return (
      <main className="min-h-screen flex flex-col bg-[#F6F0E5]">
        <HomeHeader header={homePage?.Header} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-[#0D3326]/5 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#0D3326]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0D3326] mb-3">Locality Not Found</h1>
          <p className="text-gray-500 mb-8 max-w-md">
            We couldn&apos;t find this locality. It may not have any active property listings yet.
          </p>
          <a
            href="/locality-insights"
            className="px-8 py-3 bg-[#0D3326] text-white rounded-full font-bold hover:bg-[#1a5040] transition-colors"
          >
            Back to Localities
          </a>
        </div>
        <Footer data={homePage?.Footer} />
      </main>
    );
  }

  // ── STEP 4: Fetch actual full property records for this locality ─────────
  // Uses dedicated City + Area Strapi filters (not OR-text search).
  const properties = await getPropertiesForLocality(overview.city, overview.locality);

  return (
    <main className="min-h-screen flex flex-col bg-[#F6F0E5]">
      <HomeHeader header={homePage?.Header} />

      <LocalityDetailClient
        overview={overview}
        initialProperties={properties}
      />

      <Footer data={homePage?.Footer} />
    </main>
  );
}
