
"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "@/components/Header";
import Footer from "../../Footer";
import PropertyList from "@/components/PropertyList";

import {
  getOwnerDashboard,
  getOwnerProperties,
} from "@/services/ownerDashboard";

import {
  Search,
  MapPin,
  Plus,
  X,
} from "lucide-react";

export default function ActivePropertiesPage() {
  // =====================================================
  // STATE
  // =====================================================

  const [dashboard, setDashboard] = useState(null);
  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // =====================================================
  // LOAD OWNER PROPERTIES FROM STRAPI
  // =====================================================

  useEffect(() => {
    async function loadActiveProperties() {
      try {
        setLoading(true);
        setErrorMessage("");

        const dashboardData = await getOwnerDashboard();
        const ownerData = await getOwnerProperties();

        setDashboard(dashboardData || null);

        const ownerProperties = Array.isArray(
          ownerData?.properties
        )
          ? ownerData.properties
          : [];

        // =================================================
        // ONLY ACTIVE PROPERTIES
        // =================================================

        const activeProperties = ownerProperties.filter(
          (property) => {
            const status = property?.PropertyStatus
              ?.toString()
              .trim()
              .toLowerCase();

            return (
              status === "active" ||
              status === "available"
            );
          }
        );

        setProperties(activeProperties);
      } catch (error) {
        console.error(
          "ACTIVE PROPERTIES PAGE ERROR:",
          error
        );

        setErrorMessage(
          error?.message ||
            "Unable to load active properties."
        );
      } finally {
        setLoading(false);
      }
    }

    loadActiveProperties();
  }, []);

  // =====================================================
  // SEARCH ACTIVE PROPERTIES
  // =====================================================

  const filteredProperties = useMemo(() => {
    const searchValue = searchTerm
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return properties;
    }

    return properties.filter((property) => {
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

      return (
        title.includes(searchValue) ||
        city.includes(searchValue) ||
        area.includes(searchValue)
      );
    });
  }, [properties, searchTerm]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F3F0E8] px-4">
        <div className="rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] px-8 py-6 text-center shadow-sm">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#D9D1C2] border-t-[#174B3B]" />

          <p className="text-sm font-semibold text-[#416353]">
            Loading active properties...
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
            Unable to load active properties
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#718177]">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
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

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-8 lg:px-10">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-semibold text-[#B99852]">
              OWNER PORTAL
            </p>

            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#123F32] sm:text-4xl">
              Active Properties
            </h1>

            <p className="mt-1 text-sm text-[#718177]">
              Manage properties that are currently active
            </p>

          </div>

          {/* ADD PROPERTY */}

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
            ACTIVE SUMMARY
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] p-5 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wide text-[#718177]">
              Active Listings
            </p>

            <p className="mt-2 text-3xl font-extrabold text-[#123F32]">
              {properties.length}
            </p>

            <p className="mt-1 text-xs text-[#718177]">
              Currently active properties
            </p>

          </div>

          <div className="rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] p-5 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wide text-[#718177]">
              Search Results
            </p>

            <p className="mt-2 text-3xl font-extrabold text-[#174B3B]">
              {filteredProperties.length}
            </p>

            <p className="mt-1 text-xs text-[#718177]">
              Matching active listings
            </p>

          </div>

          <div className="rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] p-5 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wide text-[#718177]">
              Status
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#DDEFE5] px-3 py-1.5 text-xs font-extrabold text-[#0E7658]">
              <span className="h-2 w-2 rounded-full bg-[#0E7658]" />
              ACTIVE
            </div>

            <p className="mt-2 text-xs text-[#718177]">
              Listings available to users
            </p>

          </div>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="rounded-2xl border border-[#D9D1C2] bg-[#F7F0E3] p-3 shadow-sm">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B99852]"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search active properties by name, city or locality..."
              className="h-12 w-full rounded-xl border border-[#E0D8CA] bg-[#F3F0E8] pl-11 pr-10 text-sm text-[#123F32] outline-none transition placeholder:text-[#8A968D] focus:border-[#B99852] focus:ring-2 focus:ring-[#B99852]/20"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-[#718177] hover:bg-[#E5E8DE] hover:text-[#123F32]"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}

          </div>

        </section>

        {/* =================================================
            RESULT HEADER
        ================================================= */}

        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <h2 className="text-lg font-extrabold text-[#123F32]">
                Active Listings
              </h2>

              <span className="rounded-full bg-[#DDEFE5] px-3 py-1 text-xs font-extrabold text-[#0E7658]">
                {filteredProperties.length}
              </span>

            </div>

            <p className="mt-1 text-sm text-[#718177]">
              Properties currently available on HomeHub
            </p>

          </div>

        </div>

        {/* =================================================
            PROPERTY LIST
        ================================================= */}

        <PropertyList
          ownerMode={true}
          properties={filteredProperties}
        />

      </main>

      {/* =================================================
          FOOTER
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