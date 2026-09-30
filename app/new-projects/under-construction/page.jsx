"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { getHomePage } from "@/services/homePage";
import { getProperties } from "@/services/property";

import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import PropertyCard from "@/components/PropertyCard";

import {
  Search,
  MapPin,
  Building2,
  Activity,
  X,
  RefreshCw,
  Calendar,
} from "lucide-react";

const STRAPI_BASE_URL =
  (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(
    /\/api\/?$/,
    ""
  );

// ==============================================================
// SKELETON CARD
// ==============================================================
function SkeletonCard() {
  return (
    <div className="nl-skeleton-card animate-pulse">
      <div className="nl-skeleton-img" />
      <div className="nl-skeleton-body">
        <div className="nl-skeleton-line nl-skeleton-line--wide" />
        <div className="nl-skeleton-line nl-skeleton-line--mid" />
        <div className="nl-skeleton-line nl-skeleton-line--narrow" />
        <div className="nl-skeleton-btn" />
      </div>
    </div>
  );
}

// ==============================================================
// UNDER CONSTRUCTION PROJECTS PAGE
// ==============================================================
export default function UnderConstructionProjectsPage() {
  const [homeData, setHomeData] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [possessionYear, setPossessionYear] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // ────────────────────────────────────────────
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const [homePage, properties] = await Promise.all([
        getHomePage().catch(() => null),
        getProperties().catch(() => []),
      ]);

      setHomeData(homePage);

      // ── Filter: Under Construction Projects
      const VALID_STATUSES = new Set(["PENDING", "ACTIVE", "Available", "PUBLISHED"]);
      
      const ucProjects = (properties || []).filter((p) => {
        // Must be in a valid status to be shown
        if (!VALID_STATUSES.has(p.PropertyStatus)) return false;

        const cond =
          p.ResidentialDetails?.PropertyCondition ||
          p.CommercialDetails?.PropertyCondition ||
          p.IndustrialDetails?.PropertyCondition;

        // Is under construction?
        if (cond === "Under Construction") return true;

        return false;
      });

      setAllProjects(ucProjects);
    } catch (err) {
      console.error("UNDER CONSTRUCTION PROJECTS ERROR:", err);
      setError("Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }

  // ── Derived filter options ─────────────────────────────────
  const availableLocations = useMemo(() => {
    const cityMap = new Map();
    allProjects.forEach((p) => {
      if (p.City) {
        const raw = p.City.trim();
        const lower = raw.toLowerCase();
        if (raw && !cityMap.has(lower)) {
          cityMap.set(lower, raw); // Store original capitalization of first encounter
        }
      }
    });
    return Array.from(cityMap.values()).sort();
  }, [allProjects]);

  const availableTypes = useMemo(() => {
    return [...new Set(allProjects.map((p) => p.Property_Type).filter(Boolean))];
  }, [allProjects]);

  const availableStatuses = useMemo(() => {
    const s = new Set();
    allProjects.forEach((p) => {
      const cond =
        p.ResidentialDetails?.PropertyCondition ||
        p.CommercialDetails?.PropertyCondition ||
        p.IndustrialDetails?.PropertyCondition;
      if (cond) s.add(cond);
    });
    return [...s];
  }, [allProjects]);

  const availablePossessionYears = useMemo(() => {
    const years = new Set();
    allProjects.forEach((p) => {
      const dateStr = p.PropertyCommonDetails?.AvailableForm;
      if (dateStr) {
        const year = new Date(dateStr).getFullYear();
        if (!isNaN(year)) years.add(year.toString());
      }
    });
    return [...years].sort();
  }, [allProjects]);

  // ── Autocomplete Logic ─────────────────────────────────────
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) return [];
    
    const q = searchQuery.toLowerCase().trim();
    const suggestionsMap = new Map(); // to prevent exact duplicates

    allProjects.forEach(p => {
      // Check Title
      if (p.Title?.toLowerCase().includes(q)) {
        suggestionsMap.set(p.Title, p.Title);
      }
      // Check City
      if (p.City?.toLowerCase().includes(q)) {
        suggestionsMap.set(p.City, p.City);
      }
      // Check Area
      if (p.Area?.toLowerCase().includes(q)) {
        suggestionsMap.set(p.Area, p.Area);
      }
      // Check Category
      if (p.Category?.toLowerCase().includes(q)) {
        suggestionsMap.set(p.Category, p.Category);
      }
      // Check Property Type
      if (p.Property_Type?.toLowerCase().includes(q)) {
        suggestionsMap.set(p.Property_Type, p.Property_Type);
      }
    });

    return Array.from(suggestionsMap.values()).slice(0, 8); // Top 8 suggestions
  }, [allProjects, searchQuery]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".nl-input-wrap")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    
    // If the suggestion matches an exact available city, auto-select the location filter too
    const matchedCity = availableLocations.find(loc => loc.toLowerCase() === suggestion.toLowerCase());
    if (matchedCity) {
      setLocation(matchedCity);
    }
  };

  // ── Filtered and Sorted projects ───────────────────────────
  const filteredProjects = useMemo(() => {
    let result = allProjects.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        if (
          !p.Title?.toLowerCase().includes(q) &&
          !p.City?.toLowerCase().includes(q) &&
          !p.Area?.toLowerCase().includes(q) &&
          !p.Property_Type?.toLowerCase().includes(q) &&
          !p.Category?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (location && p.City?.toLowerCase() !== location.toLowerCase()) return false;
      if (propertyType && p.Property_Type !== propertyType) return false;
      if (projectStatus) {
        const cond =
          p.ResidentialDetails?.PropertyCondition ||
          p.CommercialDetails?.PropertyCondition ||
          p.IndustrialDetails?.PropertyCondition;
        if (cond !== projectStatus) return false;
      }
      if (possessionYear) {
        const dateStr = p.PropertyCommonDetails?.AvailableForm;
        if (!dateStr || new Date(dateStr).getFullYear().toString() !== possessionYear) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "price_asc") {
        return (a.Price || 0) - (b.Price || 0);
      }
      if (sortBy === "price_desc") {
        return (b.Price || 0) - (a.Price || 0);
      }
      if (sortBy === "possession") {
        const dateA = a.PropertyCommonDetails?.AvailableForm ? new Date(a.PropertyCommonDetails.AvailableForm).getTime() : 0;
        const dateB = b.PropertyCommonDetails?.AvailableForm ? new Date(b.PropertyCommonDetails.AvailableForm).getTime() : 0;
        return dateA - dateB;
      }
      // default: latest
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return result;
  }, [allProjects, searchQuery, location, propertyType, projectStatus, possessionYear, sortBy]);

  const hasActiveFilters = searchQuery || location || propertyType || projectStatus || possessionYear;

  function clearFilters() {
    setSearchQuery("");
    setLocation("");
    setPropertyType("");
    setProjectStatus("");
    setPossessionYear("");
    setSortBy("latest");
  }

  // ── Stats ──────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: allProjects.length,
      residential: allProjects.filter((p) => p.Property_Type === "Residential").length,
      commercial: allProjects.filter((p) => p.Property_Type === "Commercial").length,
      locations: new Set(allProjects.map((p) => p.City?.trim().toLowerCase()).filter(Boolean)).size,
    }),
    [allProjects]
  );

  const heroBg = homeData?.Hero?.BackgroundImage?.url
    ? `${STRAPI_BASE_URL}${homeData.Hero.BackgroundImage.url}`
    : null;

  // ==============================================================
  // RENDER
  // ==============================================================
  return (
    <>
      <style>{`
        /* ====================================================
           UNDER CONSTRUCTION PROJECTS – Scoped Styles
        ==================================================== */
        .nl-page { min-height: 100vh; background: #F6F0E5; display: flex; flex-direction: column; }

        /* HERO */
        .nl-hero {
          position: relative;
          min-height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0D3326;
          overflow: hidden;
        }
        .nl-hero-bg {
          position: absolute; inset: 0;
          object-fit: cover; opacity: 0.18;
        }
        .nl-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(13,51,38,0.92) 0%, rgba(13,51,38,0.75) 100%);
        }
        .nl-hero-content { position: relative; z-index: 1; text-align: center; padding: 80px 24px 60px; max-width: 800px; }
        .nl-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(215,174,98,0.15); border: 1px solid rgba(215,174,98,0.4);
          color: #D7AE62; padding: 6px 16px; border-radius: 999px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 18px;
        }
        .nl-hero-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 14px;
        }
        .nl-hero-title span { color: #D7AE62; }
        .nl-hero-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          color: rgba(246,240,229,0.85); max-width: 560px; margin: 0 auto;
        }

        /* STATS BAR */
        .nl-stats {
          background: #0D3326;
          border-top: 1px solid rgba(215,174,98,0.2);
          padding: 14px 24px;
          display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;
        }
        .nl-stat { text-align: center; }
        .nl-stat-num { font-size: 1.4rem; font-weight: 800; color: #D7AE62; }
        .nl-stat-lbl { font-size: 11px; font-weight: 600; color: rgba(246,240,229,0.65); text-transform: uppercase; letter-spacing: 0.08em; }

        /* MAIN */
        .nl-main { flex: 1; max-width: 1400px; margin: 0 auto; width: 100%; padding: 40px 20px 60px; }

        /* FILTER CARD */
        .nl-filter-card {
          background: #fff; border-radius: 20px;
          box-shadow: 0 8px 40px rgba(13,51,38,0.10);
          border: 1px solid rgba(215,174,98,0.18);
          padding: 28px;
          margin-bottom: 40px;
        }
        .nl-filter-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 1024px) { .nl-filter-grid { grid-template-columns: 1fr 1fr 1fr; } }
        @media (max-width: 768px) { .nl-filter-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .nl-filter-grid { grid-template-columns: 1fr; } }

        .nl-filter-group label {
          display: block; font-size: 10px; font-weight: 700;
          color: #0D3326; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px;
        }
        .nl-input-wrap { position: relative; }
        .nl-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
        .nl-input, .nl-select {
          width: 100%; padding: 11px 14px 11px 38px;
          background: #f9fafb; border: 1.5px solid #e5e7eb;
          border-radius: 12px; font-size: 13px; color: #1a1a1a;
          outline: none; transition: all 0.2s; appearance: none;
        }
        .nl-input:focus, .nl-select:focus { border-color: #D7AE62; box-shadow: 0 0 0 3px rgba(215,174,98,0.15); }
        
        /* AUTOCOMPLETE DROPDOWN */
        .nl-suggestions {
          position: absolute; top: calc(100% + 4px); left: 0; right: 0;
          background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 50;
          max-height: 250px; overflow-y: auto;
          list-style: none; padding: 6px 0; margin: 0;
        }
        .nl-suggestion-item {
          padding: 10px 16px; font-size: 13px; color: #374151; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: background 0.15s, color 0.15s;
        }
        .nl-suggestion-item:hover { background: #F6F0E5; color: #0D3326; font-weight: 500; }
        .nl-suggestion-empty { padding: 10px 16px; font-size: 13px; color: #9ca3af; font-style: italic; }

        .nl-filter-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }
        
        .nl-sort-group { display: flex; align-items: center; gap: 8px; }
        .nl-sort-label { font-size: 12px; font-weight: 600; color: #4b5563; }
        .nl-sort-select { padding: 6px 12px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 13px; outline: none; }

        .nl-clear-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #6b7280;
          background: none; border: none; cursor: pointer;
          padding: 6px 12px; border-radius: 8px; transition: all 0.2s;
        }
        .nl-clear-btn:hover { color: #dc2626; background: #fef2f2; }

        /* RESULTS HEADER */
        .nl-results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .nl-results-title { font-size: 1.4rem; font-weight: 800; color: #0D3326; }
        .nl-results-count { color: #D7AE62; }

        /* GRID */
        .nl-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) { .nl-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .nl-grid { grid-template-columns: 1fr; } }

        /* SKELETON */
        .nl-skeleton-card { background: #fff; border-radius: 18px; overflow: hidden; border: 1px solid #f0f0f0; }
        .nl-skeleton-img { height: 220px; background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        .nl-skeleton-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; }
        .nl-skeleton-line { height: 14px; border-radius: 6px; background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        .nl-skeleton-line--wide { width: 75%; }
        .nl-skeleton-line--mid { width: 55%; }
        .nl-skeleton-line--narrow { width: 40%; }
        .nl-skeleton-btn { height: 40px; border-radius: 10px; background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; margin-top: 6px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* STATES */
        .nl-state-box {
          text-align: center; padding: 72px 24px;
          background: #fff; border-radius: 20px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .nl-state-icon { font-size: 3rem; margin-bottom: 16px; }
        .nl-state-title { font-size: 1.2rem; font-weight: 800; color: #0D3326; margin-bottom: 8px; }
        .nl-state-sub { font-size: 14px; color: #6b7280; margin-bottom: 24px; max-width: 400px; margin-left: auto; margin-right: auto; }
        .nl-state-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 24px; border-radius: 10px; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; border: none;
        }
        .nl-state-btn--primary { background: #0D3326; color: #F6F0E5; }
        .nl-state-btn--primary:hover { background: #0a2920; }
        .nl-state-btn--outline { background: transparent; border: 1.5px solid #D7AE62; color: #0D3326; }
        .nl-state-btn--outline:hover { background: #D7AE62; color: #fff; }
      `}</style>

      <div className="nl-page">
        {/* ── HOME HEADER ────────────────────────────────────── */}
        {homeData && <HomeHeader header={homeData.Header} />}

        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="nl-hero">
          {heroBg && (
            <Image
              src={heroBg}
              alt="Under Construction Projects Background"
              fill
              className="nl-hero-bg"
              unoptimized
              priority
            />
          )}
          <div className="nl-hero-overlay" />
          <div className="nl-hero-content">
            <div className="nl-hero-badge">
              <span>✦</span> Under Construction Projects
            </div>
            <h1 className="nl-hero-title">
              Discover Under Construction{" "}
              <span>Projects</span>
            </h1>
            <p className="nl-hero-subtitle">
              Explore properties currently under construction and discover homes
              that are taking shape for your future.
            </p>
          </div>
        </section>

        {/* ── STATS BAR ──────────────────────────────────────── */}
        {!loading && !error && allProjects.length > 0 && (
          <div className="nl-stats">
            <div className="nl-stat">
              <div className="nl-stat-num">{stats.total}</div>
              <div className="nl-stat-lbl">Under Construction Projects</div>
            </div>
            <div className="nl-stat">
              <div className="nl-stat-num">{stats.locations}</div>
              <div className="nl-stat-lbl">Locations</div>
            </div>
            <div className="nl-stat">
              <div className="nl-stat-num">{stats.residential}</div>
              <div className="nl-stat-lbl">Residential</div>
            </div>
            <div className="nl-stat">
              <div className="nl-stat-num">{stats.commercial}</div>
              <div className="nl-stat-lbl">Commercial</div>
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT ───────────────────────────────────── */}
        <main className="nl-main">

          {/* SEARCH & FILTER */}
          <div className="nl-filter-card">
            <div className="nl-filter-grid">
              {/* Search */}
              <div className="nl-filter-group" style={{ gridColumn: "span 2" }}>
                <label htmlFor="nl-search">Search</label>
                <div className="nl-input-wrap">
                  <Search className="nl-input-icon" size={16} />
                  <input
                    id="nl-search"
                    type="text"
                    className="nl-input"
                    placeholder="Search by project name or location..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    autoComplete="off"
                  />
                  
                  {/* AUTOCOMPLETE DROPDOWN */}
                  {showSuggestions && searchQuery.trim().length > 0 && (
                    <ul className="nl-suggestions">
                      {searchSuggestions.length > 0 ? (
                        searchSuggestions.map((suggestion, idx) => (
                          <li
                            key={idx}
                            className="nl-suggestion-item"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <Search size={14} className="nl-input-icon" style={{position: 'static', transform: 'none', color: '#D7AE62'}} />
                            {suggestion}
                          </li>
                        ))
                      ) : (
                        <li className="nl-suggestion-empty">
                          No suggestions found.
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="nl-filter-group">
                <label htmlFor="nl-location">Location</label>
                <div className="nl-input-wrap">
                  <MapPin className="nl-input-icon" size={16} />
                  <select
                    id="nl-location"
                    className="nl-select"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {availableLocations.length > 0 ? (
                      availableLocations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))
                    ) : (
                      <option value="" disabled>No locations available</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div className="nl-filter-group">
                <label htmlFor="nl-type">Property Type</label>
                <div className="nl-input-wrap">
                  <Building2 className="nl-input-icon" size={16} />
                  <select
                    id="nl-type"
                    className="nl-select"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {availableTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Possession Year */}
              <div className="nl-filter-group">
                <label htmlFor="nl-possession">Possession Year</label>
                <div className="nl-input-wrap">
                  <Calendar className="nl-input-icon" size={16} />
                  <select
                    id="nl-possession"
                    className="nl-select"
                    value={possessionYear}
                    onChange={(e) => setPossessionYear(e.target.value)}
                  >
                    <option value="">Any Year</option>
                    {availablePossessionYears.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="nl-filter-footer">
              <div className="nl-sort-group">
                <span className="nl-sort-label">Sort By:</span>
                <select 
                  className="nl-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Latest Projects</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="possession">Expected Possession (Earliest)</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button className="nl-clear-btn" onClick={clearFilters}>
                  <X size={15} /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* ── LOADING ──────────────────────────────────────── */}
          {loading && (
            <div className="nl-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* ── ERROR ────────────────────────────────────────── */}
          {!loading && error && (
            <div className="nl-state-box">
              <div className="nl-state-icon">⚠️</div>
              <h3 className="nl-state-title">Unable to load projects.</h3>
              <p className="nl-state-sub">Please try again.</p>
              <button className="nl-state-btn nl-state-btn--primary" onClick={fetchData}>
                <RefreshCw size={15} /> Retry
              </button>
            </div>
          )}

          {/* ── EMPTY ────────────────────────────────────────── */}
          {!loading && !error && filteredProjects.length === 0 && (
            <div className="nl-state-box">
              <div className="nl-state-icon">🏗️</div>
              <h3 className="nl-state-title">No Under Construction Projects Found</h3>
              <p className="nl-state-sub">
                There are currently no under construction projects matching your
                selection.
              </p>
              {hasActiveFilters && (
                <button className="nl-state-btn nl-state-btn--outline" onClick={clearFilters}>
                  <X size={15} /> Clear Filters
                </button>
              )}
            </div>
          )}

          {/* ── RESULTS GRID ─────────────────────────────────── */}
          {!loading && !error && filteredProjects.length > 0 && (
            <>
              <div className="nl-results-header">
                <h2 className="nl-results-title">
                  Under Construction Projects{" "}
                  <span className="nl-results-count">
                    ({filteredProjects.length})
                  </span>
                </h2>
              </div>

              <div className="nl-grid">
                {filteredProjects.map((property) => (
                  <PropertyCard
                    key={property.documentId}
                    property={property}
                  />
                ))}
              </div>
            </>
          )}
        </main>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        {homeData && <Footer data={homeData.Footer} />}
      </div>
    </>
  );
}
