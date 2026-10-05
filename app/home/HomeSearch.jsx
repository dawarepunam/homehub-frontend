"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getProperties } from "@/services/property";
import styles from "./HomeSearch.module.css";

// Map UI tab label → Strapi Purpose value used in property filtering
const TAB_TO_PURPOSE = {
  Buy:  "Sale",   // Strapi stores "Sale" for buy-intent properties
  Rent: "Rent",
  Sale: "Sale",   // "Sale" tab also maps to Sale (commercial/other sale listings)
};

const TABS = [
  { label: "Buy",  icon: "⌂" },
  { label: "Rent", icon: "⚿" },
  { label: "Sale", icon: "₹" },
];

export default function HomeSearch({ search }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [budgetOptions, setBudgetOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const typeRef = useRef(null);
  const budgetRef = useRef(null);

  useEffect(() => {
    async function loadProperties() {
      setIsLoading(true);
      const data = await getProperties();
      setProperties(data || []);
      const types = Array.from(
        new Set((data || []).map((p) => p.Property_Type).filter(Boolean))
      );
      setPropertyTypes(types);
      setIsLoading(false);
    }
    loadProperties();
  }, []);

  useEffect(() => {
    if (!properties || properties.length === 0) {
      setBudgetOptions([]);
      return;
    }
    const strapiPurpose = TAB_TO_PURPOSE[activeTab] || "Sale";
    const relevantProperties = properties.filter(
      (p) => p.Purpose === strapiPurpose
    );
    const prices = relevantProperties
      .map((p) => {
        const s = p.Price ? p.Price.toString().replace(/\D/g, "") : "";
        return parseInt(s, 10);
      })
      .filter((p) => !isNaN(p) && p > 0);

    if (prices.length === 0) { setBudgetOptions([]); return; }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    let base = [];
    if (activeTab === "Rent") {
      base = [
        { label: "Up to ₹10,000",  value: "10000"   },
        { label: "Up to ₹20,000",  value: "20000"   },
        { label: "Up to ₹50,000",  value: "50000"   },
        { label: "Up to ₹1 Lakh",  value: "100000"  },
      ];
    } else {
      base = [
        { label: "Up to ₹20 Lakh", value: "2000000"  },
        { label: "Up to ₹50 Lakh", value: "5000000"  },
        { label: "Up to ₹80 Lakh", value: "8000000"  },
        { label: "Up to ₹1 Crore", value: "10000000" },
        { label: "Up to ₹2 Crore", value: "20000000" },
        { label: "Up to ₹5 Crore", value: "50000000" },
      ];
    }
    setBudgetOptions(
      base.filter((o) => {
        const v = parseInt(o.value, 10);
        return v >= minPrice && v <= maxPrice * 2;
      })
    );
  }, [activeTab, properties]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (typeRef.current && !typeRef.current.contains(e.target))
        setIsTypeOpen(false);
      if (budgetRef.current && !budgetRef.current.contains(e.target))
        setIsBudgetOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    // Send the Strapi-mapped purpose value
    params.append("purpose", TAB_TO_PURPOSE[activeTab] || "Sale");
    if (location.trim()) params.append("location", location.trim());
    if (propertyType && propertyType !== "All Property Types")
      params.append("type", propertyType);
    if (budget && budget !== "Any Budget") params.append("budget", budget);
    router.push(`/search?${params.toString()}`);
  };

  const searchData = search || {};

  return (
    <div className={styles.searchCard}>

      {/* ── TABS: Buy / Rent / Sale ── */}
      <div className={styles.tabs} role="tablist">
        {TABS.map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={activeTab === label}
            onClick={() => {
              setActiveTab(label);
              setBudget("");
              setPropertyType("");
            }}
            className={`${styles.tab} ${activeTab === label ? styles.activeTab : ""}`}
          >
            <span className={styles.tabIcon}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* ── SEARCH FIELDS ── */}
      <div className={styles.fields}>

        {/* LOCATION */}
        <div className={styles.field}>
          <div className={styles.fieldIcon}>⌖</div>
          <div className={styles.fieldBody}>
            <label className={styles.fieldLabel}>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={
                searchData.LocationPlaceholder || "City, locality or project"
              }
              className={styles.fieldInput}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              aria-label="Search location"
            />
          </div>
        </div>

        {/* PROPERTY TYPE */}
        <div
          className={styles.field}
          ref={typeRef}
          onClick={() => {
            setIsTypeOpen((v) => !v);
            setIsBudgetOpen(false);
          }}
          style={{ cursor: "pointer", userSelect: "none" }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setIsTypeOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={isTypeOpen}
          aria-label="Select property type"
        >
          <div className={styles.fieldIcon}>⌂</div>
          <div className={styles.fieldBody}>
            <label className={styles.fieldLabel}>Property Type</label>
            <div className={styles.fieldValue}>
              {isLoading ? "Loading…" : propertyType || "All Property Types"}
            </div>
          </div>
          <span
            className={`${styles.chevron} ${isTypeOpen ? styles.chevronOpen : ""}`}
          >⌄</span>

          {isTypeOpen && (
            <div className={styles.dropdown} role="listbox">
              <div
                className={`${styles.dropdownItem} ${propertyType === "" ? styles.dropdownItemActive : ""}`}
                role="option"
                aria-selected={propertyType === ""}
                onClick={(e) => {
                  e.stopPropagation();
                  setPropertyType("");
                  setIsTypeOpen(false);
                }}
              >
                All Property Types
              </div>
              {propertyTypes.map((type) => (
                <div
                  key={type}
                  className={`${styles.dropdownItem} ${propertyType === type ? styles.dropdownItemActive : ""}`}
                  role="option"
                  aria-selected={propertyType === type}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPropertyType(type);
                    setIsTypeOpen(false);
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BUDGET */}
        <div
          className={styles.field}
          ref={budgetRef}
          onClick={() => {
            setIsBudgetOpen((v) => !v);
            setIsTypeOpen(false);
          }}
          style={{ cursor: "pointer", userSelect: "none" }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setIsBudgetOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={isBudgetOpen}
          aria-label="Select budget"
        >
          <div className={styles.fieldIcon}>₹</div>
          <div className={styles.fieldBody}>
            <label className={styles.fieldLabel}>Budget</label>
            <div className={styles.fieldValue}>
              {isLoading
                ? "Loading…"
                : budgetOptions.find((o) => o.value === budget)?.label ||
                  "Any Budget"}
            </div>
          </div>
          <span
            className={`${styles.chevron} ${isBudgetOpen ? styles.chevronOpen : ""}`}
          >⌄</span>

          {isBudgetOpen && (
            <div className={styles.dropdown} role="listbox">
              <div
                className={`${styles.dropdownItem} ${budget === "" ? styles.dropdownItemActive : ""}`}
                role="option"
                aria-selected={budget === ""}
                onClick={(e) => {
                  e.stopPropagation();
                  setBudget("");
                  setIsBudgetOpen(false);
                }}
              >
                Any Budget
              </div>
              {budgetOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`${styles.dropdownItem} ${budget === opt.value ? styles.dropdownItemActive : ""}`}
                  role="option"
                  aria-selected={budget === opt.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    setBudget(opt.value);
                    setIsBudgetOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEARCH BUTTON */}
        <button
          type="button"
          className={styles.searchButton}
          onClick={handleSearch}
          aria-label="Search properties"
        >
          <span className={styles.searchBtnIcon}>⌕</span>
          <span>{searchData.SearchButtonText || "Search"}</span>
        </button>

      </div>
      {/* Advanced Search removed intentionally */}
    </div>
  );
}