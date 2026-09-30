import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import PropertiesNearMe from "./PropertiesNearMe";
import { getHomePage } from "@/services/homePage";

export default async function PropertiesNearMePage() {
  const homePage = await getHomePage();

  return (
    <main className="flex min-h-screen flex-col">
      <HomeHeader header={homePage?.Header} />
      
      <div className="flex-1 bg-[#F6F0E5]">
        <PropertiesNearMe />
      </div>

      <Footer data={homePage?.Footer} />
    </main>
  );
}
