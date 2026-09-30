import PropertyForm from "@/components/property-form/PropertyForm";
import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import { getHomePage } from "@/services/homePage";
import Link from "next/link";

export default async function PostPropertyPage() {
  const homePage = await getHomePage();

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f6f2]">
      <HomeHeader header={homePage?.Header} />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pt-10 pb-16">
        <Link 
          href="/home"
          className="inline-flex items-center text-[#c8943d] hover:text-[#b08030] font-bold text-sm mb-6 transition-colors"
        >
          <span className="mr-2 text-lg">←</span> Back
        </Link>
        
        <PropertyForm />
      </main>

      <Footer data={homePage?.Footer} />
    </div>
  );
}