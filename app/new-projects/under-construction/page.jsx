"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Search, MapPin, Building2, Activity, X, RefreshCw } from "lucide-react";

import { getHomePage } from "@/services/homePage";
import { getProperties } from "@/services/property";

import HomeHeader from "@/app/home/HomeHeader";
import Footer from "@/app/home/Footer";
import NewProjectsPropertyCard from "@/components/NewProjectsPropertyCard";

function SkeletonCard() {
  return (
    <div className="np-skeleton-card">
      <div className="np-skeleton-img" />
      <div className="np-skeleton-body">
        <div className="np-skeleton-line np-skeleton-line--wide" />
        <div className="np-skeleton-line np-skeleton-line--mid" />
        <div className="np-skeleton-line np-skeleton-line--narrow" />
        <div className="np-skeleton-btn" />
      </div>
    </div>
  );
}

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function UnderConstructionProjectsPage() {
  const [homeData, setHomeData] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [projectStatus, setProjectStatus] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [homePage, properties] = await Promise.all([
        getHomePage().catch(() => null),
        getProperties().catch(() => []),
      ]);

      setHomeData(homePage);

      const VALID_STATUSES = new Set(["PENDING", "ACTIVE", "Available", "PUBLISHED"]);

      const ucProjects = (properties || []).filter((p) => {
        if (!VALID_STATUSES.has(p.PropertyStatus)) return false;
        const cond =
          p.ResidentialDetails?.PropertyCondition ||
          p.CommercialDetails?.PropertyCondition ||
          p.IndustrialDetails?.PropertyCondition;
        return cond === "Under Construction";
      });

      setAllProjects(ucProjects);
    } catch (err) {
      console.error("UNDER CONSTRUCTION PROJECTS ERROR:", err);
      setError("Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const availableLocations = useMemo(() => {
    const m = new Map();
    allProjects.forEach((p) => {
      if (p.City) { const r = p.City.trim(); if (!m.has(r.toLowerCase())) m.set(r.toLowerCase(), r); }
    });
    return Array.from(m.values()).sort();
  }, [allProjects]);

  const availableTypes = useMemo(
    () => [...new Set(allProjects.map((p) => p.Property_Type).filter(Boolean))],
    [allProjects]
  );

  const availableStatuses = useMemo(() => {
    const s = new Set();
    allProjects.forEach((p) => {
      const cond = p.ResidentialDetails?.PropertyCondition || p.CommercialDetails?.PropertyCondition || p.IndustrialDetails?.PropertyCondition;
      if (cond) s.add(cond);
    });
    return [...s];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.Title?.toLowerCase().includes(q) && !p.City?.toLowerCase().includes(q) && !p.Area?.toLowerCase().includes(q)) return false;
      }
      if (location && p.City?.toLowerCase() !== location.toLowerCase()) return false;
      if (propertyType && p.Property_Type !== propertyType) return false;
      if (projectStatus) {
        const cond = p.ResidentialDetails?.PropertyCondition || p.CommercialDetails?.PropertyCondition || p.IndustrialDetails?.PropertyCondition;
        if (cond !== projectStatus) return false;
      }
      return true;
    });
  }, [allProjects, searchQuery, location, propertyType, projectStatus]);

  const hasActiveFilters = searchQuery || location || propertyType || projectStatus;

  function clearFilters() {
    setSearchQuery(""); setLocation(""); setPropertyType(""); setProjectStatus("");
  }

  const stats = useMemo(() => ({
    total: allProjects.length,
    residential: allProjects.filter((p) => p.Property_Type === "Residential").length,
    commercial: allProjects.filter((p) => p.Property_Type === "Commercial").length,
    locations: new Set(allProjects.map((p) => p.City).filter(Boolean)).size,
  }), [allProjects]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      {homeData && <HomeHeader header={homeData.Header} />}

      {/* HERO */}
      <section className="np-hero">
        <div className="np-hero__bg" />
        <div className="np-hero__content">
          <motion.div variants={heroVariants} initial="hidden" animate="visible">
            <div className="np-hero__eyebrow">
              <span className="np-hero__eyebrow-dot" />
              Under Construction
            </div>
            <h1 className="np-hero__heading">
              Invest Early,<br />
              <span className="np-hero__heading-muted">Build Future</span>
            </h1>
            <p className="np-hero__desc">
              Discover projects currently under development — secure your stake in tomorrow's premium properties at today's prices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      {!loading && !error && allProjects.length > 0 && (
        <motion.div className="np-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="np-stats__inner">
            {[
              { num: stats.total, label: "Projects" },
              { num: stats.locations, label: "Cities" },
              { num: stats.residential, label: "Residential" },
              { num: stats.commercial, label: "Commercial" },
            ].map((s, i) => (
              <motion.div key={i} className="np-stat" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}>
                <span className="np-stat__num">{s.num}</span>
                <span className="np-stat__label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-12">

        {/* Filter Bar */}
        <motion.div className="np-filter-bar" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="np-filter-grid">
            <div className="np-filter-field">
              <label className="np-filter-label">Search</label>
              <div className="np-filter-input-wrap">
                <Search className="np-filter-icon" />
                <input type="text" placeholder="Project name, area or city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="np-filter-input" />
              </div>
            </div>
            <div className="np-filter-field">
              <label className="np-filter-label">City</label>
              <div className="np-filter-input-wrap">
                <MapPin className="np-filter-icon" />
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="np-filter-select">
                  <option value="">All Cities</option>
                  {availableLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>
            <div className="np-filter-field">
              <label className="np-filter-label">Type</label>
              <div className="np-filter-input-wrap">
                <Building2 className="np-filter-icon" />
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="np-filter-select">
                  <option value="">All Types</option>
                  {availableTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="np-filter-field">
              <label className="np-filter-label">Status</label>
              <div className="np-filter-input-wrap">
                <Activity className="np-filter-icon" />
                <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)} className="np-filter-select">
                  <option value="">All Statuses</option>
                  {availableStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div className="np-filter-actions" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <button onClick={clearFilters} className="np-filter-clear"><X size={13} />Clear Filters</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {loading && <div className="np-grid">{[1,2,3,4,5,6].map((i) => <SkeletonCard key={i} />)}</div>}

        {!loading && error && (
          <div className="np-state-box">
            <div className="np-state-icon">⚠️</div>
            <h3 className="np-state-title">Unable to Load Projects</h3>
            <p className="np-state-desc">{error}</p>
            <button onClick={fetchData} className="np-state-btn"><RefreshCw size={14} />Try Again</button>
          </div>
        )}

        {!loading && !error && filteredProjects.length === 0 && (
          <div className="np-state-box">
            <div className="np-state-icon">🏗️</div>
            <h3 className="np-state-title">No Projects Found</h3>
            <p className="np-state-desc">
              {hasActiveFilters ? "No projects match your filters." : "No under-construction projects are available right now."}
            </p>
            {hasActiveFilters && <button onClick={clearFilters} className="np-state-btn np-state-btn--outline">Clear Filters</button>}
          </div>
        )}

        {!loading && !error && filteredProjects.length > 0 && (
          <>
            <div className="np-results-header">
              <h2 className="np-results-title">Under Construction Projects</h2>
              <span className="np-results-count">{filteredProjects.length} found</span>
            </div>
            <motion.div className="np-grid" variants={containerVariants} initial="hidden" animate="show">
              {filteredProjects.map((property, idx) => (
                <motion.div key={property.documentId} variants={cardVariants}>
                  <NewProjectsPropertyCard property={property} priority={idx < 3} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </main>

      {homeData && <Footer data={homeData.Footer} />}
    </div>
  );
}
