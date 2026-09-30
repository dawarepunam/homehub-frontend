import UserHeader from "@/components/user/UserHeader";
import Hero from "@/components/user/user-hero/Hero";
import UserFeaturedProperties from "@/components/user/UserFeaturedProperties";
import ExploreByCategory from "@/components/user/ExploreByCategory";
import PopularLocations from "@/components/user/PopularLocations";
import HomeHubTools from "@/components/user/HomeHubTools";
import WhyChooseHomeHub from "@/components/user/WhyChooseHomeHub";

import { getUserSiteSettings } from "@/services/userSiteSettings";
import { getLatestProperties, getProperties } from "@/services/property";

export default async function UserHomePage() {
  // Load User Site Settings from Strapi
  const siteSettings = await getUserSiteSettings();

  // Load ALL properties for city-count accuracy in PopularLocations
  const allProperties = await getProperties();

  // Load latest 6 properties for the Featured Properties carousel
  const latestProperties = await getLatestProperties();

  // Hero Section data
  const heroData = Array.isArray(siteSettings?.HeroSection)
    ? siteSettings.HeroSection[0] || null
    : siteSettings?.HeroSection || null;

  const searchData = {
    ...(siteSettings?.SearchSection?.[0] || {}),
    SearchTabs: siteSettings?.SearchTabs || [],
    PopularSearches: siteSettings?.PopularSearches || [],
  };

  return (
    <main className="min-h-screen" style={{ background: "#F5F3EE" }}>
      {/* 1. Buyer Header */}
      <UserHeader headerData={siteSettings?.UserHeader} />

      {/* 2. Hero + Property Search */}
      <Hero heroData={heroData} searchData={searchData} />

      {/* 3. Explore by Property Type */}
      <ExploreByCategory />

      {/* 4. Popular Locations — receives ALL properties for accurate per-city counts */}
      <PopularLocations properties={allProperties || []} />

      {/* 5. Featured / Recommended Properties */}
      <UserFeaturedProperties properties={latestProperties || []} />

      {/* 7. HomeHub Tools */}
      <HomeHubTools />

      {/* 8. Why Choose HomeHub */}
      <WhyChooseHomeHub />
    </main>
  );
}