// import HeroBanner from "./HeroBanner";
// import SearchBox from "./SearchBox";
// import PopularSearch from "./PopularSearch";

// export default function Hero({ heroData, searchData }) {
//   return (
//     <section className="relative">
//       {/* Hero Banner */}
//       <HeroBanner data={heroData} />

//       {/* Search Box */}
//       <SearchBox searchData={searchData} />

//       {/* Popular Searches */}
//       <PopularSearch searchData={searchData} />
//     </section>
//   );
// }
import HeroBanner from "./HeroBanner";
import SearchBox from "./SearchBox";

export default function Hero({ heroData, searchData }) {
  if (!heroData) {
    return null;
  }

  return (
    <section className="relative">
      {/* Hero Banner */}
      <HeroBanner data={heroData} />

      {/* Search Box */}
      <SearchBox searchData={searchData} />
    </section>
  );
}
