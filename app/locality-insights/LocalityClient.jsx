"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Building2,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/services/localityInsights";
import { motion, AnimatePresence } from "framer-motion";

const STRAPI_BASE = (
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
).replace(/\/api\/?$/, "");

function resolveImageUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_BASE}${url}`;
}

export default function LocalityClient({ initialCities, popularLocalities }) {
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");

  const filteredLocalities = useMemo(() => {
    return popularLocalities.filter((l) => {
      const matchCity = !city || l.city.toLowerCase() === city.toLowerCase();
      const matchQuery =
        !query || l.locality.toLowerCase().includes(query.toLowerCase());
      return matchCity && matchQuery;
    });
  }, [popularLocalities, city, query]);

  const handleExplore = (e) => {
    e.preventDefault();
    document
      .getElementById("localities-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="flex-1 bg-[var(--bg-page)]">
      {/* HERO SECTION */}
      <div className="relative pt-32 pb-24 px-6 text-center overflow-hidden bg-[var(--bg-section)] border-b border-[var(--border-subtle)]">
        <div className="relative max-w-4xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-block text-[var(--text-primary)] text-xs md:text-sm font-extrabold tracking-[0.3em] uppercase mb-6">
              Neighborhood Intelligence
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold text-[var(--text-primary)] mb-8 leading-[1.05] tracking-tighter">
              Discover Your
              <br />
              Next Locality
            </h1>
            <p className="text-[var(--text-muted)] text-lg md:text-2xl mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
              Data-driven insights, property availability, and market trends for
              India's premium neighborhoods.
            </p>
          </motion.div>

          {/* SEARCH BOX */}
          <motion.form
            onSubmit={handleExplore}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-[var(--bg-card)] p-2 rounded-2xl md:rounded-full shadow-[var(--shadow-card)] border border-[var(--border-subtle)] max-w-3xl mx-auto flex flex-col md:flex-row gap-2 relative z-20"
          >
            {/* CITY SELECTOR */}
            <div className="relative flex-1 md:border-r border-[var(--border-subtle)] flex items-center">
              <MapPin className="absolute left-5 w-5 h-5 text-[var(--text-muted)]" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-14 pr-10 py-4 appearance-none bg-transparent font-bold text-[var(--text-primary)] outline-none cursor-pointer uppercase tracking-widest text-xs"
              >
                <option value="">All Cities</option>
                {initialCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* QUERY INPUT */}
            <div className="relative flex-[2] flex items-center">
              <Search className="absolute left-5 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search neighborhood..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-transparent font-medium text-[var(--text-primary)] text-base outline-none placeholder-[var(--text-muted)]"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="bg-[var(--text-primary)] text-[var(--bg-page)] px-10 py-4 rounded-xl md:rounded-full font-bold uppercase tracking-widest hover:opacity-80 transition-opacity text-sm"
            >
              Explore
            </button>
          </motion.form>
        </div>
      </div>

      {/* POPULAR LOCALITIES */}
      <div
        id="localities-grid"
        className="max-w-[1200px] mx-auto px-6 py-24 scroll-mt-20"
      >
        <div className="flex flex-col mb-16 border-b border-[var(--border-subtle)] pb-6">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            Popular Markets
          </h2>
          <p className="text-[var(--text-muted)] text-lg font-medium">
            Active neighborhoods based on current property availability.
          </p>
        </div>

        {filteredLocalities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-[var(--bg-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)]"
          >
            <MapPin className="w-12 h-12 text-[var(--border-subtle)] mx-auto mb-6" />
            <h3 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">
              No localities found
            </h3>
            <p className="text-[var(--text-muted)] font-medium text-lg">
              Try adjusting your search query or city selection.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredLocalities.map((loc, i) => (
              <LocalityCard key={i} locality={loc} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function LocalityCard({ locality }) {
  const imgUrl = resolveImageUrl(locality.image);
  const citySlug =
    locality.citySlug || locality.city.toLowerCase().replace(/\s+/g, "-");
  const localitySlug =
    locality.localitySlug ||
    locality.locality.toLowerCase().replace(/\s+/g, "-");

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div variants={itemVariants}>
      <Link
        href={`/locality-insights/${encodeURIComponent(citySlug)}/${encodeURIComponent(localitySlug)}`}
        className="group relative flex flex-col h-full bg-[var(--bg-card)] rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
      >
        <div className="relative h-64 bg-[var(--bg-page)] overflow-hidden shrink-0">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={""}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              unoptimized={true}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
              <Building2 className="w-12 h-12 text-[var(--text-muted)] opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white z-10">
            <div>
              <h3 className="text-3xl font-extrabold mb-2 tracking-tight drop-shadow-lg">
                {locality.locality}
              </h3>
              <div className="flex items-center text-sm font-bold uppercase tracking-widest opacity-90 drop-shadow-md">
                <MapPin className="w-4 h-4 mr-2" />
                {locality.city}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 flex flex-col flex-1 bg-[var(--bg-card)]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-page)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1">
                  Available
                </div>
                <div className="text-xl font-extrabold text-[var(--text-primary)]">
                  {locality.propertyCount}
                </div>
              </div>
            </div>

            {locality.startingPrice && (
              <div className="text-right">
                <div className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1">
                  Starting From
                </div>
                <div className="text-xl font-extrabold text-[var(--text-primary)]">
                  {formatPrice(locality.startingPrice.price)}
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase ml-1 block mt-1">
                    {locality.startingPrice.purpose === "Rent"
                      ? "/ Month"
                      : "Purchase"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between text-[var(--text-primary)] font-bold uppercase tracking-widest text-xs">
            <span>Market Insights</span>
            <div className="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-page)] group-hover:border-[var(--text-primary)] transition-all duration-300 transform group-hover:translate-x-1">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
