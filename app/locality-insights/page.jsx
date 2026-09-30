import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import { getHomePage } from "@/services/homePage";
import { getLocalityCities, getPopularLocalities } from "@/services/localityInsights";
import LocalityClient from "./LocalityClient";

export const metadata = {
  title: "Locality Insights | HomeHub",
  description: "Explore real estate localities, property prices, and neighborhood insights.",
};

export default async function LocalityInsightsPage() {
  const [homePage, initialCities, popularLocalities] = await Promise.all([
    getHomePage(),
    getLocalityCities(),
    getPopularLocalities(6)
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-[#F6F0E5]">
      <HomeHeader header={homePage?.Header} />
      
      <LocalityClient 
        initialCities={initialCities}
        popularLocalities={popularLocalities}
      />
      
      <Footer data={homePage?.Footer} />
    </main>
  );
}
