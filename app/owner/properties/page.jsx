"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "../Footer";
import PropertyList from "@/components/PropertyList";

import {
  getOwnerDashboard,
  getOwnerProperties,
} from "@/services/ownerDashboard";

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

  // =====================================================
  // NEW - SEARCH / FILTER STATE
  // =====================================================

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
      setProperties(
        Array.isArray(ownerData?.properties)
          ? ownerData.properties
          : []
      );
    } catch (error) {
      console.error(
        "OWNER PROPERTIES PAGE ERROR:",
        error
      );
      setErrorMessage(
        error?.message ||
          "Unable to load your properties."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerProperties();
  }, []);

  // =====================================================
  // OWNER NAME
  // =====================================================

  const ownerName =
    owner?.username ||
    owner?.name ||
    owner?.email ||
    "Owner";

  // =====================================================
  // AVAILABLE TYPES
  // =====================================================

  const propertyTypes = useMemo(() => {
    const types = properties
      .map((property) =>
        property?.Property_Type
          ?.toString()
          .trim()
      )
      .filter(Boolean);

    return [
      "All Types",
      ...Array.from(new Set(types)),
    ];
  }, [properties]);

  // =====================================================
  // AVAILABLE STATUSES
  // =====================================================

  const propertyStatuses = useMemo(() => {
    const statuses = properties
      .map((property) =>
        property?.PropertyStatus
          ?.toString()
          .trim()
      )
      .filter(Boolean);

    return [
      "All Status",
      ...Array.from(new Set(statuses)),
    ];
  }, [properties]);

  // =====================================================
  // AVAILABLE CITIES
  // =====================================================

  const cities = useMemo(() => {
    const cityList = properties
      .map((property) =>
        property?.City
          ?.toString()
          .trim()
      )
      .filter(Boolean);

    return [
      "All Cities",
      ...Array.from(new Set(cityList)),
    ];
  }, [properties]);

  const categories = useMemo(() => {
    const catList = properties.map((property) => property?.Category?.toString().trim()).filter(Boolean);
    return ["All Categories", ...Array.from(new Set(catList))];
  }, [properties]);

  const purposes = useMemo(() => {
    const purposeList = properties.map((property) => property?.Purpose?.toString().trim()).filter(Boolean);
    return ["All Purposes", ...Array.from(new Set(purposeList))];
  }, [properties]);

  const areas = useMemo(() => {
    const areaList = properties
      .filter((p) => selectedCity === "All Cities" || p?.City?.toString().toLowerCase() === selectedCity.toLowerCase())
      .map((property) => property?.Area?.toString().trim())
      .filter(Boolean);
    return ["All Areas", ...Array.from(new Set(areaList))];
  }, [properties, selectedCity]);

  // =====================================================
  // FILTERED PROPERTIES
  // =====================================================

  const filteredProperties = useMemo(() => {
    let result = properties.filter((property) => {
      const category = property?.Category?.toString().trim() || "";
      const purpose = property?.Purpose?.toString().trim() || "";
      const title =
        property?.Title
          ?.toString()
          .toLowerCase() || "";

      const city =
        property?.City
          ?.toString()
          .toLowerCase() || "";

      const area =
        property?.Area
          ?.toString()
          .toLowerCase() || "";

      const type =
        property?.Property_Type
          ?.toString()
          .trim() || "";

      const status =
        property?.PropertyStatus
          ?.toString()
          .trim() || "";

      // -----------------------------------------------
      // SEARCH
      // -----------------------------------------------

      const searchValue =
        searchTerm
          .trim()
          .toLowerCase();

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        city.includes(searchValue) ||
        area.includes(searchValue);

      // -----------------------------------------------
      // TYPE
      // -----------------------------------------------

      const matchesType =
        selectedType === "All Types" ||
        type.toLowerCase() ===
          selectedType.toLowerCase();

      // -----------------------------------------------
      // STATUS
      // -----------------------------------------------

      const matchesStatus =
        selectedStatus === "All Status" ||
        status.toLowerCase() ===
          selectedStatus.toLowerCase();

      // -----------------------------------------------
      // CITY
      // -----------------------------------------------

      const matchesCity =
        selectedCity === "All Cities" ||
        city.toLowerCase() ===
          selectedCity.toLowerCase();

      const matchesCategory = selectedCategory === "All Categories" || category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesPurpose = selectedPurpose === "All Purposes" || purpose.toLowerCase() === selectedPurpose.toLowerCase();
      const matchesArea = selectedArea === "All Areas" || area.toLowerCase() === selectedArea.toLowerCase();

      // -----------------------------------------------
      // TAB NAVIGATION
      // -----------------------------------------------
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
    sortOption
  ]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

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

  // =====================================================
  // CHECK ACTIVE FILTERS
  // =====================================================

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
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F0E8] px-4">
        <div className="rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] px-8 py-6 text-center shadow-sm">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#D9D1C2] border-t-[#174B3B]" />

          <p className="text-sm font-semibold text-[#416353]">
            Loading your properties...
          </p>

        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F0E8] px-4">

        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-[#F7F0E3] p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold text-red-600">
            Unable to load properties
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#718177]">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-[#174B3B] px-5 py-3 text-sm font-bold text-[#F7F0E3] transition hover:bg-[#123F32]"
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F0E8]">

      {/* =================================================
          OWNER HEADER
      ================================================= */}

      <Header
        headerData={dashboard?.header}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="mx-auto w-full max-w-[1400px] px-6 pt-6 lg:px-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#174B3B] transition hover:text-[#123F32]">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 pb-8 lg:px-10">

        {/* =================================================
            PAGE TOP
        ================================================= */}

        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm font-semibold text-[#B99852]">
              OWNER PORTAL
            </p>

            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#123F32] sm:text-4xl">
              My Properties
            </h1>

            <p className="mt-1 text-sm text-[#718177]">
              Manage all your properties from one place
            </p>

          </div>

          {/* =================================================
              ADD NEW PROPERTY
          ================================================= */}

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/owner/post-property";
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D7AE62] px-6 py-3.5 text-sm font-extrabold text-[#123F32] shadow-sm transition hover:bg-[#C99D4C] hover:shadow-md"
          >
            <Plus size={18} />
            Add New Property
          </button>

        </div>

        {/* =================================================
            TAB NAVIGATION
        ================================================= */}

        <div className="mb-6 flex gap-6 border-b border-[#D9D1C2]">
          {["All Properties", "Active", "Sold / Rented"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab
                  ? "border-[#174B3B] text-[#174B3B]"
                  : "border-transparent text-[#718177] hover:text-[#123F32] hover:border-[#D9D1C2]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* =================================================
            SEARCH + FILTER BAR
        ================================================= */}

        <section className="rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] p-2.5 shadow-sm">

          <div className="flex flex-col gap-2 lg:flex-row">

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B99852]"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search by property name, city, locality or project..."
                className="h-12 w-full rounded-xl border border-[#E0D8CA] bg-[#F3F0E8] pl-11 pr-10 text-sm text-[#123F32] outline-none transition placeholder:text-[#8A968D] focus:border-[#B99852] focus:ring-2 focus:ring-[#B99852]/20"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchTerm("")
                  }
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-[#718177] hover:bg-[#E5E8DE] hover:text-[#123F32]"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}

            </div>

            {/* =================================================
                TYPE
            ================================================= */}

            <div className="relative lg:w-48">

              <Grid2X2
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B99852]"
              />

              <select
                value={selectedType}
                onChange={(event) =>
                  setSelectedType(
                    event.target.value
                  )
                }
                className="h-12 w-full appearance-none rounded-xl border border-[#E0D8CA] bg-[#F3F0E8] pl-10 pr-9 text-sm font-semibold text-[#416353] outline-none transition focus:border-[#B99852] focus:ring-2 focus:ring-[#B99852]/20"
              >
                {propertyTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#718177]"
              />

            </div>

            {/* =================================================
                STATUS
            ================================================= */}

            <div className="relative lg:w-48">

              <Tag
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B99852]"
              />

              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(
                    event.target.value
                  )
                }
                className="h-12 w-full appearance-none rounded-xl border border-[#E0D8CA] bg-[#F3F0E8] pl-10 pr-9 text-sm font-semibold text-[#416353] outline-none transition focus:border-[#B99852] focus:ring-2 focus:ring-[#B99852]/20"
              >
                {propertyStatuses.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#718177]"
              />

            </div>

            {/* =================================================
                CITY
            ================================================= */}

            <div className="relative lg:w-48">

              <MapPin
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B99852]"
              />

              <select
                value={selectedCity}
                onChange={(event) =>
                  setSelectedCity(
                    event.target.value
                  )
                }
                className="h-12 w-full appearance-none rounded-xl border border-[#E0D8CA] bg-[#F3F0E8] pl-10 pr-9 text-sm font-semibold text-[#416353] outline-none transition focus:border-[#B99852] focus:ring-2 focus:ring-[#B99852]/20"
              >
                {cities.map((city) => (
                  <option
                    key={city}
                    value={city}
                  >
                    {city}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#718177]"
              />

            </div>

            {/* =================================================
                FILTER BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (value) => !value
                )
              }
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-bold transition lg:w-32 ${
                showFilters || hasActiveFilters
                  ? "border-[#B99852] bg-[#E5D3A8] text-[#123F32]"
                  : "border-[#E0D8CA] bg-[#F3F0E8] text-[#416353] hover:border-[#B99852] hover:bg-[#E5E8DE]"
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

          </div>

          {/* =================================================
              EXTRA FILTER PANEL
          ================================================= */}

          {showFilters && (
            <div className="mt-4 flex flex-col gap-4 border-t border-[#E0D8CA] px-2 pt-4 sm:flex-row sm:flex-wrap">
              <div className="w-full sm:w-auto">
                <label className="mb-1 block text-xs font-bold text-[#718177]">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 rounded-xl border border-[#E0D8CA] bg-[#F3F0E8] px-3 text-sm font-semibold text-[#416353] outline-none"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="mb-1 block text-xs font-bold text-[#718177]">Purpose</label>
                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="h-10 rounded-xl border border-[#E0D8CA] bg-[#F3F0E8] px-3 text-sm font-semibold text-[#416353] outline-none"
                >
                  {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="mb-1 block text-xs font-bold text-[#718177]">Area</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="h-10 rounded-xl border border-[#E0D8CA] bg-[#F3F0E8] px-3 text-sm font-semibold text-[#416353] outline-none"
                >
                  {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="mb-1 block text-xs font-bold text-[#718177]">Sort By</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="h-10 rounded-xl border border-[#E0D8CA] bg-[#F3F0E8] px-3 text-sm font-semibold text-[#416353] outline-none"
                >
                  {["Newest", "Oldest", "Price: Low to High", "Price: High to Low"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end sm:ml-auto">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#718177]">Active Results</p>
                  <p className="mt-1 text-sm font-semibold text-[#123F32]">{filteredProperties.length} of {properties.length} properties</p>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#D9D1C2] bg-white px-4 text-xs font-bold text-[#174B3B] transition hover:border-[#B99852]"
                  >
                    <X size={14} /> Clear
                  </button>
                )}
              </div>
            </div>
          )}

        </section>

        {/* =================================================
            RESULT INFO
        ================================================= */}

        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-extrabold text-[#123F32]">
              {activeTab}
            </h2>

            <p className="mt-1 text-sm text-[#718177]">
              Showing{" "}
              <span className="font-bold text-[#174B3B]">
                {filteredProperties.length}
              </span>{" "}
              {filteredProperties.length === 1
                ? "property"
                : "properties"}
            </p>

          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-left text-sm font-bold text-[#B99852] hover:text-[#174B3B] sm:text-right"
            >
              Clear filters
            </button>
          )}

        </div>

        {/* =================================================
            PROPERTY LIST / EMPTY STATE
        ================================================= */}

        {filteredProperties.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] px-6 py-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E5E8DE] text-3xl">
              {activeTab === "Sold / Rented" ? "🏁" : activeTab === "Active" ? "✨" : "🏠"}
            </div>
            <h3 className="mt-5 text-lg font-extrabold text-[#123F32]">
              {activeTab === "Active"
                ? "No Active Properties"
                : activeTab === "Sold / Rented"
                ? "No Sold or Rented Properties"
                : "No Properties Found"}
            </h3>
            <p className="mt-2 text-sm text-[#718177]">
              {activeTab === "Active"
                ? "You don't have any active properties right now."
                : activeTab === "Sold / Rented"
                ? "Your completed property history will appear here."
                : hasActiveFilters
                ? "No properties match your current filters. Try clearing them."
                : "You haven't listed any properties yet."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-[#B99852] px-5 py-2.5 text-sm font-bold text-[#174B3B] transition hover:bg-[#D7AE62] hover:text-[#123F32]"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <PropertyList
            ownerMode={true}
            properties={filteredProperties}
            onUpdate={loadOwnerProperties}
          />
        )}

      </main>

      {/* =================================================
          OWNER FOOTER
          EXISTING FOOTER KEPT
      ================================================= */}

      <Footer
        data={
          dashboard?.Footer ||
          dashboard?.footer ||
          null
        }
      />

    </div>
  );
}
