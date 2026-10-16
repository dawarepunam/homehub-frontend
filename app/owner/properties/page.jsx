"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "../Footer";
import PremiumPropertyCard from "./PremiumPropertyCard";
import styles from "./properties.module.css";

import {
  getOwnerDashboard,
  getOwnerProperties,
} from "@/services/ownerDashboard";

import { getBatchActivityStats } from "@/services/activityService";

import {
  Search,
  Grid2X2,
  Tag,
  MapPin,
  SlidersHorizontal,
  Plus,
  ChevronDown,
  X,
  ArrowLeft,
  ArrowUpDown,
  Building2,
  Sparkles,
} from "lucide-react";

export default function OwnerPropertiesPage() {
  // =====================================================
  // STATE
  // =====================================================
  const [dashboard, setDashboard] = useState(null);
  const [owner, setOwner] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  // Batch activity stats map: { [documentId]: { views, saves, enquiries } }
  const [activityStatsMap, setActivityStatsMap] = useState({});

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Properties");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPurpose, setSelectedPurpose] = useState("All Purposes");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [sortOption, setSortOption] = useState("Newest");
  const [showFilters, setShowFilters] = useState(false);

  // =====================================================
  // LOAD OWNER DATA
  // =====================================================
  const loadOwnerProperties = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const dashboardData = await getOwnerDashboard();
      const ownerData = await getOwnerProperties();

      setDashboard(dashboardData || null);
      setOwner(ownerData?.owner || null);
      const loadedProperties = Array.isArray(ownerData?.properties)
        ? ownerData.properties
        : [];
      setProperties(loadedProperties);

      // Batch-load activity stats for all properties in 3 API calls
      if (loadedProperties.length > 0) {
        try {
          const statsMap = await getBatchActivityStats();
          setActivityStatsMap(statsMap || {});
        } catch (statsErr) {
          console.warn("Could not load activity stats:", statsErr);
          setActivityStatsMap({});
        }
      }
    } catch (error) {
      console.error("OWNER PROPERTIES PAGE ERROR:", error);
      setErrorMessage(error?.message || "Unable to load your properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerProperties();
  }, []);

  // Filter options derived from actual properties
  const propertyTypes = useMemo(() => {
    const types = properties
      .map((p) => p?.Property_Type?.toString().trim())
      .filter(Boolean);
    return ["All Types", ...Array.from(new Set(types))];
  }, [properties]);

  const propertyStatuses = useMemo(() => {
    const statuses = properties
      .map((p) => p?.PropertyStatus?.toString().trim())
      .filter(Boolean);
    return ["All Status", ...Array.from(new Set(statuses))];
  }, [properties]);

  const cities = useMemo(() => {
    const cityList = properties
      .map((p) => p?.City?.toString().trim())
      .filter(Boolean);
    return ["All Cities", ...Array.from(new Set(cityList))];
  }, [properties]);

  const categories = useMemo(() => {
    const catList = properties
      .map((p) => p?.Category?.toString().trim())
      .filter(Boolean);
    return ["All Categories", ...Array.from(new Set(catList))];
  }, [properties]);

  const purposes = useMemo(() => {
    const purposeList = properties
      .map((p) => p?.Purpose?.toString().trim())
      .filter(Boolean);
    return ["All Purposes", ...Array.from(new Set(purposeList))];
  }, [properties]);

  const areas = useMemo(() => {
    const areaList = properties
      .filter(
        (p) =>
          selectedCity === "All Cities" ||
          p?.City?.toString().toLowerCase() === selectedCity.toLowerCase()
      )
      .map((p) => p?.Area?.toString().trim())
      .filter(Boolean);
    return ["All Areas", ...Array.from(new Set(areaList))];
  }, [properties, selectedCity]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    let result = properties.filter((property) => {
      const category = property?.Category?.toString().trim() || "";
      const purpose = property?.Purpose?.toString().trim() || "";
      const title = property?.Title?.toString().toLowerCase() || "";
      const city = property?.City?.toString().toLowerCase() || "";
      const area = property?.Area?.toString().toLowerCase() || "";
      const type = property?.Property_Type?.toString().trim() || "";
      const status = property?.PropertyStatus?.toString().trim() || "";

      // Search term
      const searchValue = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        city.includes(searchValue) ||
        area.includes(searchValue);

      // Type
      const matchesType =
        selectedType === "All Types" ||
        type.toLowerCase() === selectedType.toLowerCase();

      // Status
      const matchesStatus =
        selectedStatus === "All Status" ||
        status.toLowerCase() === selectedStatus.toLowerCase();

      // City
      const matchesCity =
        selectedCity === "All Cities" ||
        city.toLowerCase() === selectedCity.toLowerCase();

      // Category / Purpose / Area
      const matchesCategory =
        selectedCategory === "All Categories" ||
        category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesPurpose =
        selectedPurpose === "All Purposes" ||
        purpose.toLowerCase() === selectedPurpose.toLowerCase();
      const matchesArea =
        selectedArea === "All Areas" ||
        area.toLowerCase() === selectedArea.toLowerCase();

      // Tab navigation
      let matchesTab = true;
      const lowerStatus = status.toLowerCase();
      if (activeTab === "Active") {
        matchesTab = ["active", "available"].includes(lowerStatus);
      } else if (activeTab === "Sold / Rented") {
        matchesTab = ["sold", "rented"].includes(lowerStatus);
      }

      return (
        matchesTab &&
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesCity &&
        matchesCategory &&
        matchesPurpose &&
        matchesArea
      );
    });

    if (sortOption === "Newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortOption === "Oldest") {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortOption === "Price: Low to High") {
      result.sort((a, b) => (Number(a.Price) || 0) - (Number(b.Price) || 0));
    } else if (sortOption === "Price: High to Low") {
      result.sort((a, b) => (Number(b.Price) || 0) - (Number(a.Price) || 0));
    }

    return result;
  }, [
    properties,
    searchTerm,
    activeTab,
    selectedType,
    selectedStatus,
    selectedCity,
    selectedCategory,
    selectedPurpose,
    selectedArea,
    sortOption,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("All Types");
    setSelectedStatus("All Status");
    setSelectedCity("All Cities");
    setSelectedCategory("All Categories");
    setSelectedPurpose("All Purposes");
    setSelectedArea("All Areas");
    setSortOption("Newest");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedType !== "All Types" ||
    selectedStatus !== "All Status" ||
    selectedCity !== "All Cities" ||
    selectedCategory !== "All Categories" ||
    selectedPurpose !== "All Purposes" ||
    selectedArea !== "All Areas" ||
    sortOption !== "Newest";

  // =====================================================
  // LOADING SKELETON (Matching final card dimensions)
  // =====================================================
  if (loading) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col">
        <Header headerData={dashboard?.header} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 lg:px-10">
          {/* Centered Heading Skeleton */}
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <div className="mx-auto h-9 w-64 animate-pulse rounded-lg bg-[var(--seller-border)]" />
            <div className="mx-auto mt-3 h-4 w-96 max-w-full animate-pulse rounded-md bg-[var(--seller-border-subtle)]" />
          </div>

          {/* Toolbar Skeleton */}
          <div className="mb-8 h-14 w-full animate-pulse rounded-2xl bg-[var(--seller-surface)] border border-[var(--seller-border)]" />

          {/* Cards Grid Skeleton */}
          <div className={styles["seller-properties-grid"]}>
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <div
                key={k}
                className="overflow-hidden rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] shadow-xs"
              >
                <div className="h-[215px] w-full animate-pulse bg-[var(--seller-bg-subtle)]" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--seller-border)]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--seller-border-subtle)]" />
                  <div className="h-6 w-1/3 animate-pulse rounded bg-[var(--seller-border)]" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--seller-border-subtle)]" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-[var(--seller-bg-subtle)]" />
                </div>
              </div>
            ))}
          </div>
        </main>
        <Footer data={dashboard?.Footer || dashboard?.footer || null} />
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================
  if (errorMessage) {
    return (
      <div className="seller-page-wrapper flex min-h-screen flex-col">
        <Header headerData={dashboard?.header} />
        <main className="mx-auto flex w-full max-w-[1400px] flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-md rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-8 text-center shadow-lg">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--seller-bg-subtle)] text-2xl font-bold text-[var(--seller-text)]">
              !
            </div>
            <h1 className="mt-5 text-xl font-bold text-[var(--seller-text)]">
              Unable to load properties
            </h1>
            <p className="mt-2 text-sm text-[var(--seller-text-muted)]">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[var(--seller-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--seller-bg)] transition hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer data={dashboard?.Footer || dashboard?.footer || null} />
      </div>
    );
  }

  // =====================================================
  // MAIN RENDER
  // =====================================================
  return (
    <div className="seller-page-wrapper flex min-h-screen flex-col">
      {/* Existing Floating Header */}
      <Header headerData={dashboard?.header} />

      {/* Main Content Container (Aligned with Dashboard standard max-w-[1400px]) */}
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/owner"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--seller-text-muted)] transition hover:text-[var(--seller-text)]"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>

          <Link
            href="/add-property"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--seller-primary)] px-4 py-2 text-xs font-bold text-[var(--seller-bg)] shadow-xs transition hover:opacity-90 active:scale-95 sm:hidden"
          >
            <Plus size={14} strokeWidth={2.5} />
            Post Property
          </Link>
        </div>

        {/* =================================================
            1. HORIZONTALLY CENTERED HEADING & DESCRIPTION
            Aligned within the Seller Dashboard's main content container
        ================================================= */}
        <header className="mx-auto mb-8 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3.5 py-1 text-[11px] font-semibold text-[var(--seller-text-muted)] shadow-xs">
            <Building2 size={12} strokeWidth={2} />
            <span>Seller Portal</span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--seller-text)] sm:text-4xl lg:text-[40px]">
            My Properties
          </h1>

          <p className="mt-2.5 text-sm text-[var(--seller-text-muted)] sm:text-base sm:leading-relaxed">
            Manage your property listings, track performance, and keep your details up to date.
          </p>
        </header>

        {/* Tab switcher: All Properties, Active, Sold / Rented */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-1 shadow-xs">
            {["All Properties", "Active", "Sold / Rented"].map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-[var(--seller-primary)] text-[var(--seller-bg)] shadow-xs"
                      : "text-[var(--seller-text-muted)] hover:text-[var(--seller-text)]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================
            2. CLEAN, COMPACT PROPERTY TOOLBAR
            Search, status filter, sort & additional controls
        ================================================= */}
        <section className="mb-6 rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] p-3 sm:p-4 shadow-[var(--seller-shadow)]">
          <div className="flex flex-1 flex-wrap items-center justify-between gap-2.5">
            {/* Search input */}
            <div className="relative min-w-[200px] flex-1 sm:min-w-[260px]">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search listings..."
                className="h-10 w-full rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-9 pr-8 text-xs font-medium text-[var(--seller-text)] outline-none transition placeholder:text-[var(--seller-text-subtle)] focus:border-[var(--seller-border-focus)]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--seller-text-subtle)] hover:text-[var(--seller-text)]"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative w-auto min-w-[130px]">
              <Tag
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
              >
                {propertyStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
            </div>

            {/* Sorting */}
            <div className="relative w-auto min-w-[140px]">
              <ArrowUpDown
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[var(--seller-border)] bg-[var(--seller-bg)] pl-8 pr-7 text-xs font-semibold text-[var(--seller-text)] outline-none transition focus:border-[var(--seller-border-focus)] cursor-pointer"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--seller-text-subtle)]"
              />
            </div>

            {/* Extra Filters Toggle */}
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition cursor-pointer ${
                showFilters || hasActiveFilters
                  ? "border-[var(--seller-border-focus)] bg-[var(--seller-primary)] text-[var(--seller-bg)]"
                  : "border-[var(--seller-border)] bg-[var(--seller-bg)] text-[var(--seller-text)] hover:border-[var(--seller-border-focus)]"
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="ml-0.5 rounded-full bg-[var(--seller-bg)] px-1.5 py-0.2 text-[10px] font-bold text-[var(--seller-primary)]">
                  •
                </span>
              )}
            </button>
          </div>

          {/* Collapsible Secondary Filter Bar */}
          {showFilters && (
            <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-[var(--seller-border-subtle)] pt-3 sm:grid-cols-4 lg:grid-cols-5">
              {/* Type */}
              <div>
                <label className="mb-1 block text-[10.5px] font-bold uppercase tracking-wider text-[var(--seller-text-subtle)]">
                  Property Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg)] px-2.5 text-xs font-medium text-[var(--seller-text)] outline-none"
                >
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="mb-1 block text-[10.5px] font-bold uppercase tracking-wider text-[var(--seller-text-subtle)]">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg)] px-2.5 text-xs font-medium text-[var(--seller-text)] outline-none"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purpose */}
              <div>
                <label className="mb-1 block text-[10.5px] font-bold uppercase tracking-wider text-[var(--seller-text-subtle)]">
                  Purpose
                </label>
                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg)] px-2.5 text-xs font-medium text-[var(--seller-text)] outline-none"
                >
                  {purposes.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="mb-1 block text-[10.5px] font-bold uppercase tracking-wider text-[var(--seller-text-subtle)]">
                  Locality / Area
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[var(--seller-border)] bg-[var(--seller-bg)] px-2.5 text-xs font-medium text-[var(--seller-text)] outline-none"
                >
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category & Clear Button */}
              <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end justify-between lg:justify-end gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--seller-border)] bg-[var(--seller-surface)] px-3 text-xs font-semibold text-[var(--seller-text-muted)] hover:text-[var(--seller-text)]"
                  >
                    <X size={12} />
                    <span>Reset All</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* =================================================
            3. PROPERTY GRID (3 / 2 / 1 Responsive Columns)
            Desktop: 3 cols (1024px+)
            Tablet: 2 cols (640px–1023px)
            Mobile: 1 col (below 640px)
        ================================================= */}
        {filteredProperties.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-6 py-16 text-center shadow-[var(--seller-shadow)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--seller-border)] bg-[var(--seller-bg-subtle)] text-2xl text-[var(--seller-text)]">
              🏢
            </div>
            <h3 className="mt-4 text-lg font-bold text-[var(--seller-text)]">
              {hasActiveFilters
                ? "No matching properties found"
                : activeTab === "Active"
                ? "No Active Properties"
                : activeTab === "Sold / Rented"
                ? "No Sold or Rented Properties"
                : "No Properties Listed Yet"}
            </h3>
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-[var(--seller-text-muted)]">
              {hasActiveFilters
                ? "Try adjusting or clearing your search filters to find what you're looking for."
                : "Post your first property listing to begin tracking views, buyer saves, and enquiries."}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-[var(--seller-border)] bg-[var(--seller-surface)] px-4 py-2 text-xs font-semibold text-[var(--seller-text)] hover:bg-[var(--seller-surface-hover)]"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/add-property"
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[var(--seller-primary)] px-5 py-2.5 text-xs font-bold text-[var(--seller-bg)] shadow-xs hover:opacity-90"
              >
                <Plus size={14} />
                <span>Add Property</span>
              </Link>
            )}
          </div>
        ) : (
          <div className={styles["seller-properties-grid"]}>
            {filteredProperties.map((property, index) => {
              const docId = property?.documentId || String(property?.id || "");
              const numId = String(property?.id || "");
              // Resolve stats: prefer documentId key, fallback to numeric id key
              const preloadedStats =
                activityStatsMap[docId] ||
                activityStatsMap[numId] ||
                null;
              return (
                <PremiumPropertyCard
                  key={docId || `prop-${index}`}
                  property={property}
                  index={index}
                  onUpdate={loadOwnerProperties}
                  stats={preloadedStats}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Existing Owner Footer */}
      <Footer data={dashboard?.Footer || dashboard?.footer || null} />
    </div>
  );
}
