"use client";

import { useEffect, useState } from "react";

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
    <div
      className="flex items-center gap-1 p-1 bg-[var(--search-field-bg)] rounded-xl overflow-x-auto scrollbar-none mb-3.5"
      role="tablist"
    >
      {TABS.map((tab) => {
        const isActive = activeTab?.toLowerCase() === tab.value.toLowerCase();
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleTabClick(tab.value)}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-[9px] text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
              isActive
                ? "bg-[var(--border-subtle)] text-[var(--text-primary)] border border-white/20 shadow-sm font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 border border-transparent"
            }`}
          >
            <span className="text-[15px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
