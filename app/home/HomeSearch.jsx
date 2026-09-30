"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getProperties } from "@/services/property";
import styles from "./HomeSearch.module.css";

export default function HomeSearch({ search }) {
  const router = useRouter();
  const [purpose, setPurpose] = useState(
    search?.Purpose || "Buy"
  );

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
    if (!properties || properties.length === 0) {
      setBudgetOptions([]);
      return;
    }
    
    const normalizedPurpose = purpose === "Buy" ? "Sale" : purpose;
    const relevantProperties = properties.filter(p => p.Purpose === normalizedPurpose);
    
    const prices = relevantProperties.map(p => {
       const priceStr = p.Price ? p.Price.toString().replace(/\D/g, "") : "";
       return parseInt(priceStr, 10);
    }).filter(p => !isNaN(p) && p > 0);
    
    if (prices.length === 0) {
       setBudgetOptions([]);
       return;
    }
    
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
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setIsTypeOpen(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(event.target)) {
        setIsBudgetOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchData = search || {};

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (purpose) params.append("purpose", purpose);
    
    // Budget is stored as the raw value, e.g. "5000000", so we can pass it directly
    if (location.trim()) params.append("location", location.trim());
    if (propertyType.trim() && propertyType !== "All Property Types") params.append("type", propertyType.trim());
    if (budget.trim() && budget !== "Any Budget") params.append("budget", budget.trim());
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchCard}>

        {/* PURPOSE TABS */}
        <div className={styles.tabs}>
          {["Buy", "Rent", "Commercial"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPurpose(item)}
              className={`${styles.tab} ${
                purpose === item ? styles.activeTab : ""
              }`}
            >
              <span className={styles.tabIcon}>
                {item === "Buy"
                  ? "▣"
                  : item === "Rent"
                  ? "⚿"
                  : "▥"}
              </span>

              {item}
            </button>
          ))}
        </div>

        {/* SEARCH FIELDS */}
        <div className={styles.fields}>

          {/* LOCATION */}
          <div className={styles.field}>
            <div className={styles.iconCircle}>
              {searchData.LocationIcon || "⌖"}
            </div>

            <div className={styles.fieldContent}>
              <label>Location</label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={
                  searchData.LocationPlaceholder ||
                  "Search city, locality or project"
                }
              />
            </div>
          </div>

          {/* PROPERTY TYPE */}
          <div className={styles.field} ref={typeRef} onClick={() => { setIsTypeOpen(!isTypeOpen); setIsBudgetOpen(false); }} style={{ cursor: "pointer" }}>
            <div className={styles.iconCircle}>
              {searchData.PropertyTypeIcon || "⌂"}
            </div>

            <div className={styles.fieldContent}>
              <label>Property Type</label>

              <div style={{ color: propertyType ? "#000" : "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {isLoading ? "Loading..." : propertyType || "All Property Types"}
              </div>
            </div>

            <span className={styles.chevron} style={{ transform: isTypeOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
            
            {isTypeOpen && (
              <div style={{ position: "absolute", top: "100%", left: 0, width: "100%", backgroundColor: "#fff", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", borderRadius: "8px", zIndex: 50, marginTop: "8px", maxHeight: "200px", overflowY: "auto" }}>
                {isLoading ? (
                  <div style={{ padding: "12px", color: "#6b7280", fontSize: "14px" }}>Loading property types...</div>
                ) : propertyTypes.length > 0 ? (
                  <>
                    <div
                      onClick={() => setPropertyType("")}
                      style={{ padding: "10px 16px", cursor: "pointer", fontSize: "15px", backgroundColor: propertyType === "" ? "#f3f4f6" : "transparent" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = propertyType === "" ? "#f3f4f6" : "transparent"}
                    >
                      All Property Types
                    </div>
                    {propertyTypes.map(type => (
                      <div
                        key={type}
                        onClick={() => setPropertyType(type)}
                        style={{ padding: "10px 16px", cursor: "pointer", fontSize: "15px", backgroundColor: propertyType === type ? "#f3f4f6" : "transparent" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = propertyType === type ? "#f3f4f6" : "transparent"}
                      >
                        {type}
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{ padding: "12px", color: "#6b7280", fontSize: "14px" }}>No property types available</div>
                )}
              </div>
            )}
          </div>

          {/* BUDGET */}
          <div className={styles.field} ref={budgetRef} onClick={() => { setIsBudgetOpen(!isBudgetOpen); setIsTypeOpen(false); }} style={{ cursor: "pointer" }}>
            <div className={styles.iconCircle}>
              ₹
            </div>

            <div className={styles.fieldContent}>
              <label>Budget</label>

              <div style={{ color: budget ? "#000" : "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {isLoading ? "Loading..." : budgetOptions.find(opt => opt.value === budget)?.label || "Any Budget"}
              </div>
            </div>

            <span className={styles.chevron} style={{ transform: isBudgetOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
            
            {isBudgetOpen && (
              <div style={{ position: "absolute", top: "100%", left: 0, width: "100%", backgroundColor: "#fff", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", borderRadius: "8px", zIndex: 50, marginTop: "8px", maxHeight: "200px", overflowY: "auto" }}>
                {isLoading ? (
                  <div style={{ padding: "12px", color: "#6b7280", fontSize: "14px" }}>Loading budgets...</div>
                ) : budgetOptions.length > 0 ? (
                  <>
                    <div
                      onClick={() => setBudget("")}
                      style={{ padding: "10px 16px", cursor: "pointer", fontSize: "15px", backgroundColor: budget === "" ? "#f3f4f6" : "transparent" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = budget === "" ? "#f3f4f6" : "transparent"}
                    >
                      Any Budget
                    </div>
                    {budgetOptions.map(opt => (
                      <div
                        key={opt.value}
                        onClick={() => setBudget(opt.value)}
                        style={{ padding: "10px 16px", cursor: "pointer", fontSize: "15px", backgroundColor: budget === opt.value ? "#f3f4f6" : "transparent" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = budget === opt.value ? "#f3f4f6" : "transparent"}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{ padding: "12px", color: "#6b7280", fontSize: "14px" }}>Budget options unavailable</div>
                )}
              </div>
            )}
          </div>

          {/* SEARCH BUTTON */}
          <button
            type="button"
            className={styles.searchButton}
            onClick={handleSearch}
          >
            <span className={styles.searchIcon}>⌕</span>

            {searchData.SearchButtonText ||
              "Search Properties"}
          </button>
        </div>

        {/* ADVANCED SEARCH */}
        <div className={styles.advancedWrapper}>
          <button type="button" className={styles.advancedButton}>
            {searchData.AdvancedSearchText ||
              "Advanced Search"}
            <span>→</span>
          </button>
        </div>

      </div>
    </div>
  );
}