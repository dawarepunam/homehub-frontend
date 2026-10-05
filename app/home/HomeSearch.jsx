"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getProperties } from "@/services/property";
import styles from "./HomeSearch.module.css";

export default function HomeSearch({ search }) {
  const router = useRouter();
  const [purpose, setPurpose] = useState(search?.Purpose || "Buy");
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
      const types = Array.from(new Set((data || []).map(p => p.Property_Type).filter(Boolean)));
      setPropertyTypes(types);
      setIsLoading(false);
    }
    loadProperties();
  }, []);

  useEffect(() => {
    if (!properties || properties.length === 0) { setBudgetOptions([]); return; }
    const normalizedPurpose = purpose === "Buy" ? "Sale" : purpose;
    const relevantProperties = properties.filter(p => p.Purpose === normalizedPurpose);
    const prices = relevantProperties.map(p => {
      const priceStr = p.Price ? p.Price.toString().replace(/\D/g, "") : "";
      return parseInt(priceStr, 10);
    }).filter(p => !isNaN(p) && p > 0);

    if (prices.length === 0) { setBudgetOptions([]); return; }
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    let baseOptions = [];
    if (normalizedPurpose === "Rent") {
      baseOptions = [
        { label: "Up to ₹10,000", value: "10000" },
        { label: "Up to ₹20,000", value: "20000" },
        { label: "Up to ₹50,000", value: "50000" },
        { label: "Up to ₹1 Lakh", value: "100000" },
      ];
    } else {
      baseOptions = [
        { label: "Up to ₹20 Lakh", value: "2000000" },
        { label: "Up to ₹50 Lakh", value: "5000000" },
        { label: "Up to ₹80 Lakh", value: "8000000" },
        { label: "Up to ₹1 Crore", value: "10000000" },
        { label: "Up to ₹2 Crore", value: "20000000" },
        { label: "Up to ₹5 Crore", value: "50000000" },
      ];
    }
    const filteredOptions = baseOptions.filter(opt => {
      const val = parseInt(opt.value, 10);
      return val >= minPrice && val <= maxPrice * 2;
    });
    setBudgetOptions(filteredOptions);
  }, [purpose, properties]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeRef.current && !typeRef.current.contains(event.target)) setIsTypeOpen(false);
      if (budgetRef.current && !budgetRef.current.contains(event.target)) setIsBudgetOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchData = search || {};

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (purpose) params.append("purpose", purpose);
    if (location.trim()) params.append("location", location.trim());
    if (propertyType.trim() && propertyType !== "All Property Types") params.append("type", propertyType.trim());
    if (budget.trim() && budget !== "Any Budget") params.append("budget", budget.trim());
    router.push(`/search?${params.toString()}`);
  };

  const TABS = ["Buy", "Rent", "Commercial"];

  return (
    <div className={styles.searchCard}>
      {/* TABS */}
      <div className={styles.tabs}>
        {TABS.map(item => (
          <button
            key={item}
            type="button"
            onClick={() => setPurpose(item)}
            className={`${styles.tab} ${purpose === item ? styles.activeTab : ""}`}
          >
            <span className={styles.tabIcon}>
              {item === "Buy" ? "⌂" : item === "Rent" ? "⚿" : "▥"}
            </span>
            {item}
          </button>
        ))}
      </div>

      {/* FIELDS */}
      <div className={styles.fields}>

        {/* LOCATION */}
        <div className={styles.field}>
          <div className={styles.fieldIcon}>⌖</div>
          <div className={styles.fieldBody}>
            <label className={styles.fieldLabel}>Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder={searchData.LocationPlaceholder || "City, locality or project"}
              className={styles.fieldInput}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        {/* PROPERTY TYPE */}
        <div
          className={styles.field}
          ref={typeRef}
          onClick={() => { setIsTypeOpen(v => !v); setIsBudgetOpen(false); }}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <div className={styles.fieldIcon}>⌂</div>
          <div className={styles.fieldBody}>
            <label className={styles.fieldLabel}>Property Type</label>
            <div className={styles.fieldValue}>
              {isLoading ? "Loading…" : propertyType || "All Property Types"}
            </div>
          </div>
          <span className={`${styles.chevron} ${isTypeOpen ? styles.chevronOpen : ""}`}>⌄</span>

          {isTypeOpen && (
            <div className={styles.dropdown}>
              <div
                className={`${styles.dropdownItem} ${propertyType === "" ? styles.dropdownItemActive : ""}`}
                onClick={e => { e.stopPropagation(); setPropertyType(""); setIsTypeOpen(false); }}
              >
                All Property Types
              </div>
              {propertyTypes.map(type => (
                <div
                  key={type}
                  className={`${styles.dropdownItem} ${propertyType === type ? styles.dropdownItemActive : ""}`}
                  onClick={e => { e.stopPropagation(); setPropertyType(type); setIsTypeOpen(false); }}
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
          onClick={() => { setIsBudgetOpen(v => !v); setIsTypeOpen(false); }}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <div className={styles.fieldIcon}>₹</div>
          <div className={styles.fieldBody}>
            <label className={styles.fieldLabel}>Budget</label>
            <div className={styles.fieldValue}>
              {isLoading ? "Loading…" : budgetOptions.find(o => o.value === budget)?.label || "Any Budget"}
            </div>
          </div>
          <span className={`${styles.chevron} ${isBudgetOpen ? styles.chevronOpen : ""}`}>⌄</span>

          {isBudgetOpen && (
            <div className={styles.dropdown}>
              <div
                className={`${styles.dropdownItem} ${budget === "" ? styles.dropdownItemActive : ""}`}
                onClick={e => { e.stopPropagation(); setBudget(""); setIsBudgetOpen(false); }}
              >
                Any Budget
              </div>
              {budgetOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`${styles.dropdownItem} ${budget === opt.value ? styles.dropdownItemActive : ""}`}
                  onClick={e => { e.stopPropagation(); setBudget(opt.value); setIsBudgetOpen(false); }}
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
        >
          <span className={styles.searchBtnIcon}>⌕</span>
          {searchData.SearchButtonText || "Search"}
        </button>

      </div>

      {/* ADVANCED */}
      <div className={styles.advanced}>
        <button type="button" className={styles.advancedBtn}>
          {searchData.AdvancedSearchText || "Advanced Search"} →
        </button>
      </div>
    </div>
  );
}