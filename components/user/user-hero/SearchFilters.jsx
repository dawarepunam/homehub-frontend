"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import homeStyles from "@/app/home/HomeSearch.module.css";
import styles from "./SearchFilters.module.css";
import { getProperties } from "@/services/property";
import { normalizeStr, formatLabel } from "@/utils/normalize";
import { MapPin, Navigation, Building2, Home, Search } from "lucide-react";

export default function SearchFilters({ activePurpose }) {
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function loadProperties() {
      const data = await getProperties();
      setProperties(data || []);
    }
    loadProperties();
  }, []);

  // Filter properties by active purpose (Buy/Sale -> Sale, Rent -> Rent)
  const baseProperties = useMemo(() => {
    return properties.filter((p) => {
      if (!activePurpose) return true;
      const targetPurpose =
        activePurpose.toLowerCase() === "buy" ? "sale" : activePurpose.toLowerCase();
      return normalizeStr(p.Purpose) === targetPurpose;
    });
  }, [properties, activePurpose]);

  // Reset dependent filters when purpose changes
  useEffect(() => {
    setSelectedCity("");
    setSelectedArea("");
    setSelectedType("");
    setSelectedCategory("");
  }, [activePurpose]);

  // ================= Cities =================
  const cities = useMemo(() => {
    const unique = new Set(baseProperties.map((p) => normalizeStr(p.City)).filter(Boolean));
    return Array.from(unique).map(formatLabel).sort();
  }, [baseProperties]);

  // ================= Areas =================
  const areas = useMemo(() => {
    let source = baseProperties;
    if (selectedCity) {
      source = source.filter((p) => normalizeStr(p.City) === normalizeStr(selectedCity));
    }
    const unique = new Set(source.map((p) => normalizeStr(p.Area)).filter(Boolean));
    return Array.from(unique).map(formatLabel).sort();
  }, [baseProperties, selectedCity]);

  // ================= Property Types =================
  const propertyTypes = useMemo(() => {
    let source = baseProperties;
    if (selectedCity) source = source.filter((p) => normalizeStr(p.City) === normalizeStr(selectedCity));
    if (selectedArea) source = source.filter((p) => normalizeStr(p.Area) === normalizeStr(selectedArea));
    
    return [...new Set(source.map((p) => p.Property_Type).filter(Boolean))].sort();
  }, [baseProperties, selectedCity, selectedArea]);

  // ================= Categories =================
  const categories = useMemo(() => {
    let source = baseProperties;
    if (selectedCity) source = source.filter((p) => normalizeStr(p.City) === normalizeStr(selectedCity));
    if (selectedArea) source = source.filter((p) => normalizeStr(p.Area) === normalizeStr(selectedArea));
    if (selectedType) source = source.filter((p) => normalizeStr(p.Property_Type) === normalizeStr(selectedType));

    return [...new Set(source.map((p) => p.Category).filter(Boolean))].sort();
  }, [baseProperties, selectedCity, selectedArea, selectedType]);

  // ================= Search =================
  const handleSearch = () => {
    const query = new URLSearchParams();
    if (activePurpose) query.set("purpose", activePurpose);
    if (selectedCity) query.set("city", selectedCity);
    if (selectedArea) query.set("area", selectedArea);
    if (selectedType) query.set("type", selectedType);
    if (selectedCategory) query.set("category", selectedCategory);

    router.push(`/user/search?${query.toString()}`);
  };

  const handleFilterChange = (setter, resetters = []) => (e) => {
    const val = e.target.value;
    setter(val);
    resetters.forEach((reset) => reset(""));
  };

  return (
    <div className={`${homeStyles.fields} ${styles.userFieldsGrid}`}>
      {/* 1. Location / City */}
      <div className={homeStyles.field}>
        <div className={homeStyles.fieldIcon} aria-hidden="true">
          <MapPin size={16} strokeWidth={2} />
        </div>
        <div className={homeStyles.fieldBody}>
          <label className={homeStyles.fieldLabel}>Location</label>
          <select
            value={selectedCity}
            onChange={handleFilterChange(setSelectedCity, [setSelectedArea, setSelectedType, setSelectedCategory])}
            className={homeStyles.fieldInput}
            style={{ cursor: "pointer" }}
            aria-label="Select City"
          >
            <option value="" className={homeStyles.dropdownItem}>Select City</option>
            {cities.map((city) => (
              <option key={city} value={city} className={homeStyles.dropdownItem}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Area */}
      <div className={homeStyles.field}>
        <div className={homeStyles.fieldIcon} aria-hidden="true">
          <Navigation size={16} strokeWidth={2} />
        </div>
        <div className={homeStyles.fieldBody}>
          <label className={homeStyles.fieldLabel}>Area</label>
          <select
            value={selectedArea}
            onChange={handleFilterChange(setSelectedArea, [setSelectedType, setSelectedCategory])}
            className={homeStyles.fieldInput}
            style={{ cursor: "pointer" }}
            aria-label="Select Area"
          >
            <option value="" className={homeStyles.dropdownItem}>Select Area</option>
            {areas.map((area) => (
              <option key={area} value={area} className={homeStyles.dropdownItem}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Property Type */}
      <div className={homeStyles.field}>
        <div className={homeStyles.fieldIcon} aria-hidden="true">
          <Building2 size={16} strokeWidth={2} />
        </div>
        <div className={homeStyles.fieldBody}>
          <label className={homeStyles.fieldLabel}>Type</label>
          <select
            value={selectedType}
            onChange={handleFilterChange(setSelectedType, [setSelectedCategory])}
            className={homeStyles.fieldInput}
            style={{ cursor: "pointer" }}
            aria-label="Select Property Type"
          >
            <option value="" className={homeStyles.dropdownItem}>All Types</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type} className={homeStyles.dropdownItem}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Category */}
      <div className={homeStyles.field}>
        <div className={homeStyles.fieldIcon} aria-hidden="true">
          <Home size={16} strokeWidth={2} />
        </div>
        <div className={homeStyles.fieldBody}>
          <label className={homeStyles.fieldLabel}>Category</label>
          <select
            value={selectedCategory}
            onChange={handleFilterChange(setSelectedCategory, [])}
            className={homeStyles.fieldInput}
            style={{ cursor: "pointer" }}
            aria-label="Select Category"
          >
            <option value="" className={homeStyles.dropdownItem}>All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category} className={homeStyles.dropdownItem}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. Search Button */}
      <button
        type="button"
        onClick={handleSearch}
        className={homeStyles.searchButton}
        aria-label="Search Properties"
      >
        <Search size={16} strokeWidth={2.5} className={homeStyles.searchBtnIcon} />
        <span>Search</span>
      </button>
    </div>
  );
}
