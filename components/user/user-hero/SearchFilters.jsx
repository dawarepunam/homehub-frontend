"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Map, Building2, Home } from "lucide-react";
import { getProperties } from "@/services/property";
import { normalizeStr, formatLabel } from "@/utils/normalize";

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
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-5 items-stretch min-h-[52px]">
      {/* 1. Location / City */}
      <div className="relative flex items-center gap-2 px-2.5 py-2 rounded-[10px] border border-[var(--search-border)] bg-[var(--search-field-bg)] transition-colors hover:border-[var(--border-hover)]">
        <div className="w-8 h-8 rounded-[8px] bg-[var(--border-subtle)] flex items-center justify-center shrink-0 text-[var(--text-primary)]">
          <MapPin size={16} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <label className="text-[10px] font-bold uppercase tracking-[0.8px] text-[var(--text-muted)] leading-none mb-1">
            Location
          </label>
          <select
            value={selectedCity}
            onChange={handleFilterChange(setSelectedCity, [setSelectedArea, setSelectedType, setSelectedCategory])}
            className="w-full bg-transparent text-sm font-medium text-[var(--text-primary)] outline-none cursor-pointer truncate"
            aria-label="Select City"
          >
            <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city} className="bg-[var(--bg-card)] text-[var(--text-primary)]">{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Area */}
      <div className="relative flex items-center gap-2 px-2.5 py-2 rounded-[10px] border border-[var(--search-border)] bg-[var(--search-field-bg)] transition-colors hover:border-[var(--border-hover)]">
        <div className="w-8 h-8 rounded-[8px] bg-[var(--border-subtle)] flex items-center justify-center shrink-0 text-[var(--text-primary)]">
          <Map size={16} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <label className="text-[10px] font-bold uppercase tracking-[0.8px] text-[var(--text-muted)] leading-none mb-1">
            Area
          </label>
          <select
            value={selectedArea}
            onChange={handleFilterChange(setSelectedArea, [setSelectedType, setSelectedCategory])}
            className="w-full bg-transparent text-sm font-medium text-[var(--text-primary)] outline-none cursor-pointer truncate"
            aria-label="Select Area"
          >
            <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Select Area</option>
            {areas.map((area) => (
              <option key={area} value={area} className="bg-[var(--bg-card)] text-[var(--text-primary)]">{area}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Property Type */}
      <div className="relative flex items-center gap-2 px-2.5 py-2 rounded-[10px] border border-[var(--search-border)] bg-[var(--search-field-bg)] transition-colors hover:border-[var(--border-hover)]">
        <div className="w-8 h-8 rounded-[8px] bg-[var(--border-subtle)] flex items-center justify-center shrink-0 text-[var(--text-primary)]">
          <Building2 size={16} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <label className="text-[10px] font-bold uppercase tracking-[0.8px] text-[var(--text-muted)] leading-none mb-1">
            Property Type
          </label>
          <select
            value={selectedType}
            onChange={handleFilterChange(setSelectedType, [setSelectedCategory])}
            className="w-full bg-transparent text-sm font-medium text-[var(--text-primary)] outline-none cursor-pointer truncate"
            aria-label="Select Property Type"
          >
            <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">All Types</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type} className="bg-[var(--bg-card)] text-[var(--text-primary)]">{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Category */}
      <div className="relative flex items-center gap-2 px-2.5 py-2 rounded-[10px] border border-[var(--search-border)] bg-[var(--search-field-bg)] transition-colors hover:border-[var(--border-hover)]">
        <div className="w-8 h-8 rounded-[8px] bg-[var(--border-subtle)] flex items-center justify-center shrink-0 text-[var(--text-primary)]">
          <Home size={16} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <label className="text-[10px] font-bold uppercase tracking-[0.8px] text-[var(--text-muted)] leading-none mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={handleFilterChange(setSelectedCategory, [])}
            className="w-full bg-transparent text-sm font-semibold text-[var(--text-primary)] outline-none cursor-pointer truncate"
            aria-label="Select Category"
          >
            <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category} className="bg-[var(--bg-card)] text-[var(--text-primary)]">{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. Search Button */}
      <button
        type="button"
        onClick={handleSearch}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-[13px] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-extrabold text-sm border border-white/20 transition-all duration-200 hover:bg-transparent hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] hover:-translate-y-0.5 hover:shadow-lg col-span-1 sm:col-span-2 lg:col-span-1 min-h-[50px] cursor-pointer"
        aria-label="Search Properties"
      >
        <Search size={16} />
        <span>Search</span>
      </button>
    </div>
  );
}
