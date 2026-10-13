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
    <div className="w-full max-w-[360px] h-[460px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden animate-pulse mx-auto">
      <div className="h-[220px] bg-[var(--skeleton-base)]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-24 rounded bg-[var(--skeleton-base)]" />
        <div className="h-5 w-3/4 rounded bg-[var(--skeleton-base)]" />
        <div className="h-3 w-1/2 rounded bg-[var(--skeleton-base)]" />
        <div className="h-6 w-28 rounded bg-[var(--skeleton-base)]" />
        <div className="mt-4 flex gap-2">
          <div className="h-3 w-12 rounded bg-[var(--skeleton-base)]" />
          <div className="h-3 w-12 rounded bg-[var(--skeleton-base)]" />
          <div className="h-3 w-16 rounded bg-[var(--skeleton-base)]" />
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2">
          <div className="h-9 rounded-lg bg-[var(--skeleton-base)]" />
          <div className="h-9 rounded-lg bg-[var(--skeleton-base)]" />
        </div>
      </div>
    </div>
  );
}

// ─── Filter Dropdown ─────────────────────────────────────────────────────────

function FilterSelect({ icon: Icon, label, value, onChange, options, placeholder }) {
  return (
    <div className="group flex h-[62px] items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 transition hover:border-[var(--border-focus)]">
      <Icon size={16} className="shrink-0 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition" />
      <div className="flex w-full min-w-0 flex-col">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full truncate bg-transparent text-[13px] font-semibold text-[var(--text-primary)] outline-none cursor-pointer"
        >
          <option value="" className="bg-[var(--bg-card)] text-[var(--text-primary)]">{placeholder}</option>
          {options.map((opt) =>
            typeof opt === "string" ? (
              <option key={opt} value={opt} className="bg-[var(--bg-card)] text-[var(--text-primary)]">{opt}</option>
            ) : (
              <option key={opt.value} value={opt.value} className="bg-[var(--bg-card)] text-[var(--text-primary)]">{opt.label}</option>
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
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">

      {/* ─── Top Banner ─────────────────────────────────────────── */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-subtle)]">
        <div className="mx-auto max-w-[1400px] px-5 py-6 lg:px-8">

          {/* Back Button */}
          <nav className="mb-4">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
            >
              &larr; Back
            </Link>
          </nav>

          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
                {pageHeading}
              </h1>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {/* BHK group badge */}
                {selectedCategoryContains && (
                  <span className="hh-badge hh-badge--muted">
                    {selectedCategoryContains.toUpperCase()} Group
                  </span>
                )}
                {/* Exact category badge */}
                {selectedCategory && !selectedCategoryContains && (
                  <span className="hh-badge hh-badge--muted">
                    {selectedCategory}
                  </span>
                )}
                {/* Type badge only when no specific category at all */}
                {selectedType && !selectedCategory && !selectedCategoryContains && (
                  <span className="hh-badge hh-badge--muted">
                    Type: {selectedType}
                  </span>
                )}
              </div>
            </div>

            {/* Result Count */}
            <div className="flex shrink-0 items-center gap-2 rounded-xl bg-[var(--accent)] text-[var(--accent-text)] px-4 py-2.5 shadow-sm">
              <span className="text-xl font-extrabold">{filteredProperties.length}</span>
              <span className="text-xs font-semibold opacity-90">
                {filteredProperties.length === 1 ? "Property" : "Properties"} Found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Filter Bar ─────────────────────────────────────────── */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-subtle)] shadow-sm">
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
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mr-1">
                Active:
              </span>
            )}
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => removeFilter(filter.key)}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--accent)] text-[var(--accent-text)] px-2.5 py-1 text-xs font-semibold transition hover:opacity-80"
              >
                {filter.label}
                <X size={11} className="opacity-80" />
              </button>
            ))}
            {activeFilters.length > 1 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition underline underline-offset-2"
              >
                Clear All
              </button>
            )}
            {activeFilters.length === 0 && (
              <span className="text-xs text-[var(--text-muted)] italic">No filters applied</span>
            )}
          </div>

          {/* Sort + View Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Sort */}
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1.5 shadow-sm">
              <ArrowUpDown size={13} className="text-[var(--text-muted)]" />
              <span className="text-xs font-semibold text-[var(--text-muted)] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-[var(--text-primary)] outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[var(--bg-card)] text-[var(--text-primary)]">{opt.label}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-sm overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex h-8 w-8 items-center justify-center transition ${
                  viewMode === "grid" ? "bg-[var(--accent)] text-[var(--accent-text)]" : "text-[var(--text-muted)] hover:bg-[var(--border-subtle)]/30"
                }`}
                title="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex h-8 w-8 items-center justify-center transition border-l border-[var(--border-subtle)] ${
                  viewMode === "list" ? "bg-[var(--accent)] text-[var(--accent-text)]" : "text-[var(--text-muted)] hover:bg-[var(--border-subtle)]/30"
                }`}
                title="List view"
              >
                <List size={14} />
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
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-card)] py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
              <RefreshCcw size={28} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Unable to Load Properties</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Please check your connection and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[var(--btn-primary-bg)] px-6 py-2.5 text-sm font-bold text-[var(--btn-primary-text)] transition hover:opacity-90"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasError && filteredProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-card)] py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-surface)] mb-5">
              <SearchX size={36} className="text-[var(--text-muted)]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">No Properties Found</h2>
            <p className="mt-3 max-w-md text-sm text-[var(--text-secondary)]">
              No properties match your current filters. Try adjusting the search criteria or clear all filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-7 rounded-xl bg-[var(--btn-primary-bg)] px-8 py-3 text-sm font-bold text-[var(--btn-primary-text)] transition hover:opacity-90 shadow-md"
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
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] transition hover:border-[var(--border-focus)] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={15} />
              </button>

              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center text-[var(--text-muted)] text-xs">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition ${
                      currentPage === page
                        ? "bg-[var(--accent)] text-[var(--accent-text)] shadow-sm"
                        : "border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-[var(--border-focus)]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] transition hover:border-[var(--border-focus)] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChRight size={15} />
              </button>
            </div>

            {/* Per Page */}
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="font-semibold">Show:</span>
              <div className="flex items-center gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1 shadow-sm">
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-transparent text-xs font-bold text-[var(--text-primary)] outline-none cursor-pointer"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n} className="bg-[var(--bg-card)] text-[var(--text-primary)]">{n} per page</option>
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
      className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-sm transition hover:shadow-md hover:border-[var(--border-focus)] cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-[200px] sm:h-[130px] w-full sm:w-[200px] shrink-0 overflow-hidden rounded-xl bg-[var(--bg-section)]">
        <img src={imageUrl} alt={property?.Title || "Property"} className="h-full w-full object-cover" />
        <span className="absolute bottom-2 left-2 rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent-text)] uppercase tracking-wider">
          {property?.Purpose || ""}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 min-w-0 flex-col justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            {property?.Category || property?.Property_Type || ""}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--text-primary)] line-clamp-1">{property?.Title || "Untitled"}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <MapPin size={12} className="text-[var(--text-muted)]" />
            {[property?.Area, property?.City].filter(Boolean).join(", ") || "Location not specified"}
          </p>
        </div>
        <p className="text-lg font-extrabold text-[var(--text-primary)]">{formatPriceRow(property)}</p>
      </div>

      {/* Action */}
      <div className="flex shrink-0 items-center">
        <Link
          href={viewRoute}
          onClick={(e) => e.stopPropagation()}
          className="hh-btn hh-btn-primary hh-btn-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
