import HomeHeader from "./HomeHeader";
import HomeHero from "./HomeHero";
import PopularLocations from "./PopularLocations";
import PropertyCategories from "./PropertyCategories";
import FeaturedProperties from "./FeaturedProperties";
import AdviceTools from "./AdviceTools";
import WhyChooseHomeHub from "./WhyChooseHomeHub";
import PropertyGuides from "./PropertyGuides";
import HomeCTA from "./HomeCTA";
import Footer from "./Footer";
import { getHomePage } from "@/services/homePage";

export const metadata = {
  title: "HomeHub – Find a Place You'll Love | Real Estate in India",
  description:
    "Discover verified homes, apartments, villas, and commercial properties across India's top cities. Buy, rent, sell or post — all on HomeHub.",
};

export default async function HomePage() {
  const homePage = await getHomePage();

  return (
    <main
      className="homePage"
      style={{ background: "#0f1311", minHeight: "100vh" }}
    >
      {/* ── HEADER ── sticky dark glass bar */}
      <HomeHeader header={homePage?.Header} />

      {/* ── HERO + SEARCH ── no absolute positioning, hero stretches to fit */}
      <HomeHero
        hero={homePage?.Hero}
        search={homePage?.Search}
      />

      {/* ── POPULAR LOCATIONS ── #0f1311 bg */}
      <PopularLocations data={homePage?.PopularLocations} />

      {/* ── PROPERTY CATEGORIES ── #111513 bg */}
      <PropertyCategories data={homePage?.PropertyCategories} />

      {/* ── FEATURED PROPERTIES ── #0f1311 bg */}
      <FeaturedProperties
        data={homePage?.FeaturedProperties}
        properties={homePage?.FeaturedProperties?.properties || []}
      />

      {/* ── ADVICE & TOOLS ── #111513 bg */}
      <AdviceTools data={homePage?.AdviceTools} />

      {/* ── WHY CHOOSE HOMEHUB ── #0f1311 bg */}
      <WhyChooseHomeHub data={homePage?.WhyChooseHomeHub} />

      {/* ── PROPERTY GUIDES ── #111513 bg */}
      <PropertyGuides data={homePage?.PropertyGuides} />

      {/* ── CTA SECTION ── before footer */}
      <HomeCTA />

      {/* ── FOOTER ── */}
      <Footer data={homePage?.Footer} />
    </main>
  );
}
