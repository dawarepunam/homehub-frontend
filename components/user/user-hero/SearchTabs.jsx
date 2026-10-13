"use client";

import { useEffect, useState } from "react";
import homeStyles from "@/app/home/HomeSearch.module.css";

const TABS = [
  { label: "Buy", value: "buy", icon: "⌂" },
  { label: "Rent", value: "rent", icon: "⚿" },
  { label: "Sale", value: "sale", icon: "₹" },
];

export default function SearchTabs({
  activePurpose,
  onPurposeChange,
}) {
  const defaultTab = "buy";
  const [activeTab, setActiveTab] = useState(activePurpose || defaultTab);

  // Sync with parent state
  useEffect(() => {
    if (activePurpose && activePurpose !== activeTab) {
      setActiveTab(activePurpose);
    }
  }, [activePurpose]);

  const handleTabClick = (value) => {
    setActiveTab(value);
    onPurposeChange?.(value);
  };

  return (
    <div className={homeStyles.tabs} role="tablist">
      {TABS.map(({ label, value, icon }) => {
        const isActive = activeTab?.toLowerCase() === value.toLowerCase();
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleTabClick(value)}
            className={`${homeStyles.tab} ${isActive ? homeStyles.activeTab : ""}`}
          >
            <span className={homeStyles.tabIcon}>{icon}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
