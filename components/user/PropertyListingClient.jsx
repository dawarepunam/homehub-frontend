"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Home,
  ChevronRight,
  MapPin,
  Map,
  Building2,
  LayoutGrid,
  List,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight as ChRight,
  SearchX,
  RefreshCcw,
  IndianRupee,
  BedDouble,
} from "lucide-react";

import PropertyCard from "@/components/user/PropertyCard";

// ─── Constants ───────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36];

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const BUDGET_OPTIONS = [
  { label: "Any Budget", value: "" },
  { label: "Under ₹10 Lakh", value: "0-1000000" },
  { label: "₹10L – ₹25L", value: "1000000-2500000" },
  { label: "₹25L – ₹50L", value: "2500000-5000000" },
  { label: "₹50L – ₹1 Cr", value: "5000000-10000000" },
  { label: "Above ₹1 Cr", value: "10000000-999999999" },
];

// ─── String Normalization Helper ───────────────────────────────────────────────

// Helpers imported from utils
import { normalizeStr, formatLabel } from "@/utils/normalize";

// ─── Price Extractor ─────────────────────────────────────────────────────────

function extractPrice(property) {
  const raw =
    property?.Price ??
    property?.PropertyCommonDetails?.Price ??
    property?.price;
  if (!raw) return 0;
  const num = parseFloat(String(raw).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="w-full max-w-[270px] h-[460px] rounded-[20px] border border-[#E5DDD0] bg-white overflow-hidden animate-pulse mx-auto">
      <div className="h-[220px] bg-[#EAE5DC]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-24 rounded bg-[#EAE5DC]" />
        <div className="h-5 w-3/4 rounded bg-[#EAE5DC]" />
        <div className="h-3 w-1/2 rounded bg-[#EAE5DC]" />
        <div className="h-6 w-28 rounded bg-[#EAE5DC]" />
        <div className="mt-4 flex gap-2">
          <div className="h-3 w-12 rounded bg-[#EAE5DC]" />
          <div className="h-3 w-12 rounded bg-[#EAE5DC]" />
          <div className="h-3 w-16 rounded bg-[#EAE5DC]" />
        </div>
        <div className="mt-auto grid grid-cols-3 gap-2">
          <div className="h-9 rounded-lg bg-[#EAE5DC]" />
          <div className="h-9 rounded-lg bg-[#EAE5DC]" />
          <div className="h-9 rounded-lg bg-[#EAE5DC]" />
        </div>
      </div>
    </div>
  );
}

// ─── Filter Dropdown ─────────────────────────────────────────────────────────

function FilterSelect({ icon: Icon, label, value, onChange, options, placeholder }) {
  return (
    <div className="group flex h-[68px] items-center gap-3 rounded-xl border border-[#E5DDD0] bg-white px-4 transition hover:border-[#D7AE62] hover:shadow-sm">
      <Icon size={18} className="shrink-0 text-[#0D3326]/60 group-hover:text-[#D7AE62] transition" />
      <div className="flex w-full min-w-0 flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0D3326]/50">
          {label}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full truncate bg-transparent text-[13px] font-semibold text-[#0D3326] outline-none cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) =>
            typeof opt === "string" ? (
              <option key={opt} value={opt}>{opt}</option>
            ) : (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )
          )}
        </select>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PropertyListingClient({ initialProperties, initialType, initialPurpose }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ─── Filter State ───────────────────────────────────────────────────────────
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [selectedArea, setSelectedArea] = useState(searchParams.get("area") || "");
  const [selectedType, setSelectedType] = useState(initialType || searchParams.get("type") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  // categoryContains: used for BHK group — matches any Category value containing this string
  const [selectedCategoryContains, setSelectedCategoryContains] = useState(searchParams.get("categoryContains") || "");
  const [selectedPurpose, setSelectedPurpose] = useState(initialPurpose || searchParams.get("purpose") || "");
  const [selectedBudget, setSelectedBudget] = useState(searchParams.get("budget") || "");

  // ─── UI State ───────────────────────────────────────────────────────────────
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [allProperties, setAllProperties] = useState(initialProperties || []);

  // ─── Read source context to determine Back button destination ─────────────
  const fromPopularLocations = searchParams.get("from") === "popular-locations";
  const cityParam = searchParams.get("city") || "";

  // Sync state when URL search params or initial props change (e.g., during soft navigation)
  useEffect(() => {
    setSelectedCity(searchParams.get("city") || "");
    setSelectedArea(searchParams.get("area") || "");
    setSelectedType(initialType || searchParams.get("type") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedCategoryContains(searchParams.get("categoryContains") || "");
    setSelectedPurpose(initialPurpose || searchParams.get("purpose") || "");
    setSelectedBudget(searchParams.get("budget") || "");
  }, [searchParams, initialType, initialPurpose]);

  // ─── Base-filtered pool (for scoping City/Area options to active category) ────
  const categoryBasePool = useMemo(() => {
    let pool = [...allProperties];
    if (selectedCategory) pool = pool.filter((p) => normalizeStr(p.Category) === normalizeStr(selectedCategory));
    else if (selectedCategoryContains) pool = pool.filter((p) => normalizeStr(p.Category || "").includes(normalizeStr(selectedCategoryContains)));
    else if (selectedType) pool = pool.filter((p) => (p.Property_Type || "").toLowerCase() === selectedType.toLowerCase());
    return pool;
  }, [allProperties, selectedCategory, selectedCategoryContains, selectedType]);

  // ─── Derive filter options scoped to the active category base ──────────────
  const cities = useMemo(() => {
    const unique = new Set(categoryBasePool.map((p) => normalizeStr(p.City)).filter(Boolean));
    return Array.from(unique).map(formatLabel).sort();
  }, [categoryBasePool]);

  const areas = useMemo(() => {
    let source = categoryBasePool;
    if (selectedCity) {
      source = source.filter((p) => normalizeStr(p.City) === normalizeStr(selectedCity));
    }
    const unique = new Set(source.map((p) => normalizeStr(p.Area)).filter(Boolean));
    return Array.from(unique).map(formatLabel).sort();
  }, [categoryBasePool, selectedCity]);

  const propertyTypes = useMemo(() => [...new Set(allProperties.map((p) => p.Property_Type).filter(Boolean))], [allProperties]);
  const categories = useMemo(() => {
    if (!selectedType) return [...new Set(allProperties.map((p) => p.Category).filter(Boolean))];
    return [...new Set(allProperties.filter((p) => p.Property_Type === selectedType).map((p) => p.Category).filter(Boolean))];
  }, [allProperties, selectedType]);
  const purposes = useMemo(() => [...new Set(categoryBasePool.map((p) => p.Purpose).filter(Boolean))], [categoryBasePool]);

  // ─── Filter properties client-side ─────────────────────────────────────────
  const filteredProperties = useMemo(() => {
    let result = [...allProperties];

    // ── Category base filter (applied first, before city/area/purpose) ────────
    // Exact match (e.g. Office, Shop, Warehouse)
    if (selectedCategory) {
      result = result.filter((p) => normalizeStr(p.Category) === normalizeStr(selectedCategory));
    }
    // Contains match (e.g. BHK → One BHK, Two BHK, Three BHK, Four BHK …)
    else if (selectedCategoryContains) {
      result = result.filter((p) =>
        normalizeStr(p.Category || "").includes(normalizeStr(selectedCategoryContains))
      );
    }

    if (selectedCity) result = result.filter((p) => normalizeStr(p.City) === normalizeStr(selectedCity));
    if (selectedArea) result = result.filter((p) => normalizeStr(p.Area) === normalizeStr(selectedArea));
    if (selectedType) result = result.filter((p) => (p.Property_Type || "").toLowerCase() === selectedType.toLowerCase());
    if (selectedPurpose) result = result.filter((p) => (p.Purpose || "").toLowerCase() === selectedPurpose.toLowerCase());

    if (selectedBudget) {
      const [min, max] = selectedBudget.split("-").map(Number);
      result = result.filter((p) => {
        const price = extractPrice(p);
        return price >= min && price <= max;
      });
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "price_asc") {
      result.sort((a, b) => extractPrice(a) - extractPrice(b));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => extractPrice(b) - extractPrice(a));
    }

    return result;
  }, [allProperties, selectedCity, selectedArea, selectedType, selectedCategory, selectedCategoryContains, selectedPurpose, selectedBudget, sortBy]);

  // ─── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredProperties.length / pageSize);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProperties.slice(start, start + pageSize);
  }, [filteredProperties, currentPage, pageSize]);

  useEffect(() => { setCurrentPage(1); }, [selectedCity, selectedArea, selectedType, selectedCategory, selectedCategoryContains, selectedPurpose, selectedBudget, sortBy, pageSize]);

  const activeFilters = useMemo(() => {
    const filters = [];
    // Category base — always first (shows user's explore selection)
    if (selectedCategoryContains) filters.push({ key: "categoryContains", label: selectedCategoryContains });
    else if (selectedCategory) filters.push({ key: "category", label: selectedCategory });
    else if (selectedType) filters.push({ key: "type", label: selectedType });
    // User refinements
    if (selectedCity) filters.push({ key: "city", label: selectedCity });
    if (selectedArea) filters.push({ key: "area", label: selectedArea });
    if (selectedPurpose) filters.push({ key: "purpose", label: selectedPurpose });
    if (selectedBudget) {
      const found = BUDGET_OPTIONS.find((b) => b.value === selectedBudget);
      if (found) filters.push({ key: "budget", label: found.label });
    }
    return filters;
  }, [selectedType, selectedCity, selectedArea, selectedCategory, selectedCategoryContains, selectedPurpose, selectedBudget]);

  const removeFilter = useCallback((key) => {
    if (key === "type") { setSelectedType(""); setSelectedCategory(""); setSelectedCategoryContains(""); }
    else if (key === "city") { setSelectedCity(""); setSelectedArea(""); }
    else if (key === "area") setSelectedArea("");
    else if (key === "category") setSelectedCategory("");
    else if (key === "categoryContains") setSelectedCategoryContains("");
    else if (key === "purpose") setSelectedPurpose("");
    else if (key === "budget") setSelectedBudget("");
  }, []);

  const clearAllFilters = useCallback(() => {
    // Keep the active category/group base — only clear refinements
    setSelectedCity("");
    setSelectedArea("");
    setSelectedPurpose("");
    setSelectedBudget("");
  }, []);



  // ─── Page heading ────────────────────────────────────────────────────────────
  // Build a meaningful heading:
  //   • If a city is active:  "Pune Properties"  (not "Properties Properties")
  //   • If a type is active:  "Residential Properties"
  //   • Otherwise:            "All Properties"
  const pageHeading = useMemo(() => {
    // 1. Exact category (e.g. "Office Properties", "Warehouse Properties")
    const activeCategory = selectedCategory || searchParams.get("category");
    if (activeCategory) {
      const display =
        activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).toLowerCase();
      return `${display} Properties`;
    }
    // 2. Category group / contains (e.g. "BHK Properties")
    const activeCatContains = selectedCategoryContains || searchParams.get("categoryContains");
    if (activeCatContains) {
      const display =
        activeCatContains.toUpperCase(); // "BHK" should stay uppercase
      return `${display} Properties`;
    }
    // 3. City (from Popular Locations flow)
    const activeCity = selectedCity || cityParam;
    if (activeCity) {
      const display = formatLabel(activeCity);
      return `${display} Properties`;
    }
    // 4. Property Type
    const activeType = selectedType || initialType;
    if (activeType) {
      const display =
        activeType.charAt(0).toUpperCase() + activeType.slice(1).toLowerCase();
      return `${display} Properties`;
    }
    return "All Properties";
  }, [selectedCity, cityParam, selectedType, initialType, selectedCategory, selectedCategoryContains, searchParams]);

  // ─── (legacy) typeLabel kept for breadcrumb badge only ───────────────────────
  const typeLabel = selectedType
    ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1).toLowerCase()
    : initialType
    ? initialType.charAt(0).toUpperCase() + initialType.slice(1).toLowerCase()
    : "";

  // ─── Back button href ────────────────────────────────────────────────────────
  // When the user arrived from Popular Locations, send them back to that section.
  const fromExploreCategories = searchParams.get("from") === "explore-categories";
  
  let backHref = "/user";
  if (fromPopularLocations) {
    backHref = "/user#popular-locations";
  } else if (fromExploreCategories) {
    backHref = "/user#explore-categories";
  }

  // ─── Page number range helper ────────────────────────────────────────────────
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#F7F4EF" }}>

      {/* ─── Top Banner ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E5DDD0]">
        <div className="mx-auto max-w-[1400px] px-5 py-6 lg:px-8">

          {/* Back Button */}
          <nav className="mb-5">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D3326]/60 hover:text-[#D7AE62] transition"
            >
              &larr; Back
            </Link>
          </nav>

          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0D3326] lg:text-4xl">
                {pageHeading}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {/* BHK group badge */}
                {selectedCategoryContains && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D7AE62]/60 bg-[#FBF4E6] px-4 py-1.5 text-xs font-bold text-[#9A7230]">
                    {selectedCategoryContains.toUpperCase()} Group
                  </span>
                )}
                {/* Exact category badge */}
                {selectedCategory && !selectedCategoryContains && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0D3326]/20 bg-[#E8F0EB] px-4 py-1.5 text-xs font-bold text-[#0D3326]">
                    {selectedCategory}
                  </span>
                )}
                {/* Type badge only when no specific category at all */}
                {selectedType && !selectedCategory && !selectedCategoryContains && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0D3326]/20 bg-[#E8F0EB] px-4 py-1.5 text-xs font-bold text-[#0D3326]">
                    Type: {selectedType}
                  </span>
                )}
              </div>
            </div>

            {/* Result Count */}
            <div className="flex shrink-0 items-center gap-2 rounded-xl bg-[#0D3326] px-5 py-3 shadow-sm">
              <span className="text-2xl font-extrabold text-[#D7AE62]">{filteredProperties.length}</span>
              <span className="text-sm font-medium text-white/80">
                {filteredProperties.length === 1 ? "Property" : "Properties"} Found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Filter Bar ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E5DDD0] shadow-sm">
        <div className="mx-auto max-w-[1400px] px-5 py-5 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            <FilterSelect
              icon={MapPin}
              label="City"
              value={selectedCity}
              onChange={(v) => { setSelectedCity(v); setSelectedArea(""); }}
              options={cities}
              placeholder="Select City"
            />

            <FilterSelect
              icon={Map}
              label="Area"
              value={selectedArea}
              onChange={setSelectedArea}
              options={areas}
              placeholder="Select Area"
            />

            <FilterSelect
              icon={Building2}
              label="Property Type"
              value={selectedType}
              onChange={(v) => { 
                setSelectedType(v); 
                setSelectedCategory("");
                setSelectedCategoryContains("");
                setSelectedCity("");
                setSelectedArea("");
                setSelectedPurpose("");
                setSelectedBudget("");
              }}
              options={propertyTypes}
              placeholder="Any Type"
            />

            <FilterSelect
              icon={Home}
              label="Category"
              value={selectedCategory}
              onChange={(v) => {
                setSelectedCategory(v);
                setSelectedCategoryContains("");
                setSelectedCity("");
                setSelectedArea("");
                setSelectedPurpose("");
                setSelectedBudget("");
              }}
              options={categories}
              placeholder="Any Category"
            />

            <FilterSelect
              icon={BedDouble}
              label="Purpose"
              value={selectedPurpose}
              onChange={setSelectedPurpose}
              options={purposes}
              placeholder="Any Purpose"
            />

            <FilterSelect
              icon={IndianRupee}
              label="Budget"
              value={selectedBudget}
              onChange={setSelectedBudget}
              options={BUDGET_OPTIONS.filter((b) => b.value !== "")}
              placeholder="Any Budget"
            />



          </div>
        </div>
      </div>

      {/* ─── Active Filters + Sort Row ───────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-5 py-4 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.length > 0 && (
              <span className="text-xs font-semibold text-[#0D3326]/60 uppercase tracking-wide mr-1">
                Active Filters:
              </span>
            )}
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => removeFilter(filter.key)}
                className="flex items-center gap-1.5 rounded-full border border-[#0D3326]/20 bg-[#0D3326] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0D3326]/80"
              >
                {filter.label}
                <X size={11} className="opacity-70" />
              </button>
            ))}
            {activeFilters.length > 1 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-[#D7AE62] hover:text-[#C99A40] transition underline underline-offset-2"
              >
                Clear All
              </button>
            )}
            {activeFilters.length === 0 && (
              <span className="text-xs text-[#0D3326]/40 italic">No filters applied</span>
            )}
          </div>

          {/* Sort + View Toggle */}
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="flex items-center gap-2 rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 shadow-sm">
              <ArrowUpDown size={14} className="text-[#0D3326]/50" />
              <span className="text-xs font-semibold text-[#0D3326]/60 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#0D3326] outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center rounded-xl border border-[#E5DDD0] bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex h-9 w-9 items-center justify-center transition ${
                  viewMode === "grid" ? "bg-[#0D3326] text-[#D7AE62]" : "text-[#0D3326]/50 hover:bg-[#F0EBE2]"
                }`}
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex h-9 w-9 items-center justify-center transition border-l border-[#E5DDD0] ${
                  viewMode === "list" ? "bg-[#0D3326] text-[#D7AE62]" : "text-[#0D3326]/50 hover:bg-[#F0EBE2]"
                }`}
                title="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Property Grid ───────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-5 pb-10 lg:px-8">

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {hasError && !isLoading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5DDD0] bg-white py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
              <RefreshCcw size={28} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-[#0D3326]">Unable to Load Properties</h2>
            <p className="mt-2 text-sm text-[#0D3326]/60">Please check your connection and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#0D3326] px-6 py-2.5 text-sm font-bold text-[#D7AE62] transition hover:opacity-90"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasError && filteredProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5DDD0] bg-white py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F0EBE2] mb-5">
              <SearchX size={36} className="text-[#0D3326]/40" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0D3326]">No Properties Found</h2>
            <p className="mt-3 max-w-md text-sm text-[#0D3326]/60">
              No properties match your current filters. Try adjusting the search criteria or clear all filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-7 rounded-xl bg-[#0D3326] px-8 py-3 text-sm font-bold text-[#D7AE62] transition hover:opacity-90 shadow-md"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Cards */}
        {!isLoading && !hasError && paginatedProperties.length > 0 && (
          viewMode === "grid" ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
              {paginatedProperties.map((property) => (
                <PropertyCard
                  key={property.documentId || property.id}
                  property={property}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="flex flex-col gap-4">
              {paginatedProperties.map((property) => (
                <ListPropertyRow key={property.documentId || property.id} property={property} />
              ))}
            </div>
          )
        )}

        {/* ─── Pagination ─────────────────────────────────────────── */}
        {!isLoading && !hasError && filteredProperties.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5DDD0] bg-white text-[#0D3326] transition hover:border-[#D7AE62] hover:text-[#D7AE62] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-[#0D3326]/40 text-sm">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-[#0D3326] text-[#D7AE62] shadow-sm"
                        : "border border-[#E5DDD0] bg-white text-[#0D3326] hover:border-[#D7AE62]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5DDD0] bg-white text-[#0D3326] transition hover:border-[#D7AE62] hover:text-[#D7AE62] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChRight size={16} />
              </button>
            </div>

            {/* Per Page */}
            <div className="flex items-center gap-2 text-sm text-[#0D3326]/70">
              <span className="font-medium">Show:</span>
              <div className="flex items-center gap-1 rounded-xl border border-[#E5DDD0] bg-white px-3 py-1.5 shadow-sm">
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-transparent text-sm font-bold text-[#0D3326] outline-none cursor-pointer"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n} per page</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── List View Row ────────────────────────────────────────────────────────────

const STRAPI_BASE =
  (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace("/api", "");

function formatPriceRow(property) {
  const raw =
    property?.Price ?? property?.PropertyCommonDetails?.Price ?? property?.price;
  if (!raw) return "Price on Request";
  const num = parseFloat(String(raw).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return String(raw);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakh`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function ListPropertyRow({ property }) {
  const router = useRouter();
  const docId = property?.documentId || property?.id;
  const viewRoute = `/user/property/${docId}`;
  const imageUrl = property?.CoverImage?.url
    ? property.CoverImage.url.startsWith("http")
      ? property.CoverImage.url
      : `${STRAPI_BASE}${property.CoverImage.url}`
    : "/no-property.png";

  return (
    <div
      onClick={() => router.push(viewRoute)}
      className="flex gap-5 rounded-2xl border border-[#E5DDD0] bg-white p-4 shadow-sm transition hover:shadow-md hover:border-[#D7AE62] cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-[130px] w-[200px] shrink-0 overflow-hidden rounded-xl bg-[#EAE5DC]">
        <img src={imageUrl} alt={property?.Title || "Property"} className="h-full w-full object-cover" />
        <span className="absolute bottom-2 left-2 rounded-md bg-[#D7AE62] px-2 py-0.5 text-[10px] font-extrabold text-[#0D3326] uppercase">
          {property?.Purpose || ""}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 min-w-0 flex-col justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#D7AE62]">
            {property?.Category || property?.Property_Type || ""}
          </p>
          <h3 className="mt-1 text-base font-extrabold text-[#0D3326] line-clamp-1">{property?.Title || "Untitled"}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-[#0D3326]/60">
            <MapPin size={11} className="text-[#D7AE62]" />
            {[property?.Area, property?.City].filter(Boolean).join(", ") || "Location not specified"}
          </p>
        </div>
        <p className="text-xl font-extrabold text-[#0D3326]">{formatPriceRow(property)}</p>
      </div>

      {/* Action */}
      <div className="flex shrink-0 items-center">
        <Link
          href={viewRoute}
          onClick={(e) => e.stopPropagation()}
          className="rounded-xl bg-[#0D3326] px-5 py-2.5 text-xs font-bold text-[#D7AE62] transition hover:opacity-90"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
