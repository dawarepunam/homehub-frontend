"use client";

import { useState } from "react";
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
    <div className="w-full rounded-[18px] bg-[var(--search-bg)] border border-[var(--search-border)] backdrop-blur-[24px] shadow-2xl p-3 sm:p-3.5 transition-all duration-200">
      {/* ================= Tabs (Buy / Rent / Sale) ================= */}
      <SearchTabs
        searchData={searchData}
        activePurpose={activePurpose}
        onPurposeChange={setActivePurpose}
      />

      {/* ================= Filters Grid ================= */}
      <div className="pt-1">
        <SearchFilters
          searchData={searchData}
          activePurpose={activePurpose}
        />
      </div>
    </div>
  );
}