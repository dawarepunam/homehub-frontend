
// import HomeHeader from "./HomeHeader";
// import HomeHero from "./HomeHero";
// import PopularLocations from "./PopularLocations";
// import PropertyCategories from "./PropertyCategories";
// import FeaturedProperties from "./FeaturedProperties";

// import { getHomePage } from "@/services/homePage";

// export default async function HomePage() {
//   const homePage = await getHomePage();

//   return (
//     <main>

//       {/* Header */}
//       <HomeHeader
//         header={homePage?.Header}
//       />

//       {/* Hero + Search */}
//       <HomeHero
//         hero={homePage?.Hero}
//         search={homePage?.Search}
//       />

//       {/* Popular Locations */}
//       <PopularLocations
//         data={homePage?.PopularLocations}
//       />

//       {/* Property Categories */}
//       <PropertyCategories
//         data={homePage?.PropertyCategories}
//       />

//       {/* Featured Properties */}
//       <FeaturedProperties
//         data={homePage?.FeaturedProperties}
//       />

//     </main>
//   );
// }

// import HomeHeader from "./HomeHeader";
// import HomeHero from "./HomeHero";
// import PopularLocations from "./PopularLocations";
// import PropertyCategories from "./PropertyCategories";
// import FeaturedProperties from "./FeaturedProperties";

// import { getHomePage } from "@/services/homePage";

// export default async function HomePage() {
//   const homePage = await getHomePage();

//   return (
//     <main>

//       {/* Header */}
//       <HomeHeader
//         header={homePage?.Header}
//       />

//       {/* Hero + Search */}
//       <HomeHero
//         hero={homePage?.Hero}
//         search={homePage?.Search}
//       />

//       {/* Popular Locations */}
//       <PopularLocations
//         data={homePage?.PopularLocations}
//       />

//       {/* Property Categories */}
//       <PropertyCategories
//         data={homePage?.PropertyCategories}
//       />

//       {/* Featured Properties */}
//       <FeaturedProperties
//         properties={homePage?.FeaturedProperties?.properties || []}
//       />

//     </main>
//   );
// }




import HomeHeader from "./HomeHeader";
import HomeHero from "./HomeHero";
import PopularLocations from "./PopularLocations";
import PropertyCategories from "./PropertyCategories";
import FeaturedProperties from "./FeaturedProperties";
import AdviceTools from "./AdviceTools";
import WhyChooseHomeHub from "./WhyChooseHomeHub";
import PropertyGuides from "./PropertyGuides";
import Footer from "./Footer";
import { getHomePage } from "@/services/homePage";

export default async function HomePage() {
  const homePage = await getHomePage();

  return (
    <main className="homePage">

      {/* Header */}
      <HomeHeader
        header={homePage?.Header}
      />

      {/* Hero + Search */}
      <HomeHero
        hero={homePage?.Hero}
        search={homePage?.Search}
      />

      {/* Popular Locations */}
      <PopularLocations
        data={homePage?.PopularLocations}
      />

      {/* Property Categories */}
      <PropertyCategories
        data={homePage?.PropertyCategories}
      />

      {/* Featured Properties */}
      <FeaturedProperties
        properties={
          homePage?.FeaturedProperties?.properties || []
        }
      />

      {/* Advice & Tools */}
      <AdviceTools
        data={homePage?.AdviceTools}
      />

      {/* Why Choose HomeHub */}
      <WhyChooseHomeHub
        data={homePage?.WhyChooseHomeHub}
      />

      {/* Property Guides */}
      <PropertyGuides
        data={homePage?.PropertyGuides}
      />
<Footer
  data={homePage?.Footer}
/>
    </main>
  );
}
