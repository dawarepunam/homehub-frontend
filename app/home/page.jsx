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
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "HomeHub – Find a Place You'll Love | Real Estate in India",
  description:
    "Discover verified homes, apartments, villas, and commercial properties across India's top cities. Buy, rent, sell or post — all on HomeHub.",
};

export default async function HomePage() {
  const homePage = await getHomePage();

  return (
    <main
      className="homePage w-full min-h-screen bg-[#050505] text-[#E5E5E5] font-sans overflow-x-hidden selection:bg-white/10"
    >
      {/* ── HEADER ── sticky dark glass bar */}
      <HomeHeader header={homePage?.Header} />

      {/* ── HERO + SEARCH ── no absolute positioning, hero stretches to fit */}
      <HomeHero
        hero={homePage?.Hero}
        search={homePage?.Search}
      />

      {/* ── POPULAR LOCATIONS ── */}
      <ScrollReveal>
        <PopularLocations data={homePage?.PopularLocations} />
      </ScrollReveal>

      {/* ── PROPERTY CATEGORIES ── */}
      <ScrollReveal>
        <PropertyCategories data={homePage?.PropertyCategories} />
      </ScrollReveal>

      {/* ── FEATURED PROPERTIES ── */}
      <ScrollReveal>
        <FeaturedProperties
          data={homePage?.FeaturedProperties}
          properties={homePage?.FeaturedProperties?.properties || []}
        />
      </ScrollReveal>

      {/* ── ADVICE & TOOLS ── */}
      <ScrollReveal>
        <AdviceTools data={homePage?.AdviceTools} />
      </ScrollReveal>

      {/* ── WHY CHOOSE HOMEHUB ── */}
      <ScrollReveal>
        <WhyChooseHomeHub data={homePage?.WhyChooseHomeHub} />
      </ScrollReveal>

      {/* ── PROPERTY GUIDES ── */}
      <ScrollReveal>
        <PropertyGuides data={homePage?.PropertyGuides} />
      </ScrollReveal>

      {/* ── CTA SECTION ── */}
      <ScrollReveal>
        <HomeCTA />
      </ScrollReveal>

      {/* ── FOOTER ── */}
      <ScrollReveal>
        <Footer data={homePage?.Footer} />
      </ScrollReveal>
    </main>
  );
}
