"use client";

import { useState } from "react";
import homeStyles from "@/app/home/HomeSearch.module.css";
import SearchTabs from "./SearchTabs";
import SearchFilters from "./SearchFilters";

export default function SearchBox({ searchData }) {
  const defaultPurpose =
    searchData?.SearchTabs?.find((item) => item.isDefault)?.value ||
    searchData?.SearchTabs?.[0]?.value ||
    "buy";

  const [activePurpose, setActivePurpose] = useState(defaultPurpose);

  if (!searchData) return null;

  return (
    <div className={homeStyles.searchCard}>
      {/* ================= Tabs (Buy / Rent / Sale) ================= */}
      <SearchTabs
        searchData={searchData}
        activePurpose={activePurpose}
        onPurposeChange={setActivePurpose}
      />

      {/* ================= Filters Grid ================= */}
      <SearchFilters
        searchData={searchData}
        activePurpose={activePurpose}
      />
    </div>
  );
}