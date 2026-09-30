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
// NEW LAUNCHES PAGE
// ==============================================================
export default function NewLaunchesPage() {
  const [homeData, setHomeData] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [projectStatus, setProjectStatus] = useState("");

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

      // ── Filter: New Launches = "New" PropertyCondition or "New" PropertyAge,
      // or Under Construction. Handles both ACTIVE and Available status values.
      const NEW_STATUSES = new Set(["ACTIVE", "Available", "PUBLISHED"]);
      const NEW_CONDITIONS = new Set(["New", "Under Construction"]);
      const NEW_AGES = new Set(["New ", "New", "Years 0-1"]);

      const newLaunches = (properties || []).filter((p) => {
        // Only active/available listings
        if (!NEW_STATUSES.has(p.PropertyStatus)) return false;

        const cond =
          p.ResidentialDetails?.PropertyCondition ||
          p.CommercialDetails?.PropertyCondition ||
          p.IndustrialDetails?.PropertyCondition;

        const age = p.PropertyCommonDetails?.PropertyAge;

        // Match if condition says New/Under Construction, OR age says New/0-1
        if (cond && NEW_CONDITIONS.has(cond)) return true;
        if (age && NEW_AGES.has(age)) return true;

        // If neither condition nor age is set at all, include if recently created
        // (within last 90 days) — do NOT include if condition is set but not New
        if (!cond && !age) {
          const created = new Date(p.createdAt);
          const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          return created >= ninetyDaysAgo;
        }

        return false;
      });


      setAllProjects(newLaunches);
    } catch (err) {
      console.error("NEW LAUNCHES ERROR:", err);
      setError("Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }

  // ── Derived filter options ─────────────────────────────────
  const availableLocations = useMemo(() => {
    return [...new Set(allProjects.map((p) => p.City).filter(Boolean))];
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

  // ── Filtered projects ──────────────────────────────────────
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !p.Title?.toLowerCase().includes(q) &&
          !p.City?.toLowerCase().includes(q) &&
          !p.Area?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (location && p.City !== location) return false;
      if (propertyType && p.Property_Type !== propertyType) return false;
      if (projectStatus) {
        const cond =
          p.ResidentialDetails?.PropertyCondition ||
          p.CommercialDetails?.PropertyCondition ||
          p.IndustrialDetails?.PropertyCondition;
        if (cond !== projectStatus) return false;
      }
      return true;
    });
  }, [allProjects, searchQuery, location, propertyType, projectStatus]);

  const hasActiveFilters = searchQuery || location || propertyType || projectStatus;

  function clearFilters() {
    setSearchQuery("");
    setLocation("");
    setPropertyType("");
    setProjectStatus("");
  }

  // ── Stats ──────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: allProjects.length,
      residential: allProjects.filter((p) => p.Property_Type === "Residential").length,
      commercial: allProjects.filter((p) => p.Property_Type === "Commercial").length,
      locations: new Set(allProjects.map((p) => p.City).filter(Boolean)).size,
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
           NEW LAUNCHES – Scoped Styles
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
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 900px) { .nl-filter-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 540px) { .nl-filter-grid { grid-template-columns: 1fr; } }

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
        .nl-filter-footer { display: flex; justify-content: flex-end; margin-top: 14px; }
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
              alt="New Launch Projects Background"
              fill
              className="nl-hero-bg"
              unoptimized
              priority
            />
          )}
          <div className="nl-hero-overlay" />
          <div className="nl-hero-content">
            <div className="nl-hero-badge">
              <span>✦</span> New Launches
            </div>
            <h1 className="nl-hero-title">
              Discover New Launch{" "}
              <span>Projects</span>
            </h1>
            <p className="nl-hero-subtitle">
              Explore newly launched residential and commercial projects and find
              a property that fits your lifestyle.
            </p>
          </div>
        </section>

        {/* ── STATS BAR ──────────────────────────────────────── */}
        {!loading && !error && allProjects.length > 0 && (
          <div className="nl-stats">
            <div className="nl-stat">
              <div className="nl-stat-num">{stats.total}</div>
              <div className="nl-stat-lbl">New Launch Projects</div>
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
              <div className="nl-filter-group">
                <label htmlFor="nl-search">Search</label>
                <div className="nl-input-wrap">
                  <Search className="nl-input-icon" size={16} />
                  <input
                    id="nl-search"
                    type="text"
                    className="nl-input"
                    placeholder="Search by project name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
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
                    {availableLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
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

              {/* Status */}
              <div className="nl-filter-group">
                <label htmlFor="nl-status">Project Status</label>
                <div className="nl-input-wrap">
                  <Activity className="nl-input-icon" size={16} />
                  <select
                    id="nl-status"
                    className="nl-select"
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    {availableStatuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="nl-filter-footer">
                <button className="nl-clear-btn" onClick={clearFilters}>
                  <X size={15} /> Clear Filters
                </button>
              </div>
            )}
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
              <h3 className="nl-state-title">No New Launch Projects Found</h3>
              <p className="nl-state-sub">
                There are currently no new launch projects matching your
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
                  New Launches{" "}
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
