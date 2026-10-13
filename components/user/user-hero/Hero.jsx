import HeroBanner from "./HeroBanner";
import SearchBox from "./SearchBox";

export default function Hero({ heroData, searchData }) {
  if (!heroData) {
    return null;
  }

  return (
    <HeroBanner data={heroData}>
      <SearchBox searchData={searchData} />
    </HeroBanner>
  );
}
