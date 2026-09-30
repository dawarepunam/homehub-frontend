import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import { getHomePage } from "@/services/homePage";
import PropertyGuidesClient from "./PropertyGuidesClient";
import { getGuideArticles, getFeaturedGuide, getGuideCategories } from "@/services/propertyGuides";

export const metadata = {
  title: "Property Guides | HomeHub",
  description: "Explore helpful insights and practical advice for buying, selling, renting, and investing in property.",
};

export default async function PropertyGuidesPage() {
  const [homePage, featured, categoriesData, initialArticles] = await Promise.all([
    getHomePage(),
    getFeaturedGuide(),
    getGuideCategories(),
    getGuideArticles({ pageSize: 12 }),
  ]);

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#F6F0E5" }}>
      <HomeHeader header={homePage?.Header} />

      <PropertyGuidesClient
        featured={featured}
        categories={categoriesData}
        initialArticles={initialArticles.data}
        initialMeta={initialArticles.meta}
      />

      <Footer data={homePage?.Footer} />
    </main>
  );
}
