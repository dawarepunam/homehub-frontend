"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// CITY GRADIENT PALETTE
// Each city gets a unique dark charcoal gradient so cards look distinct
// without relying on the single Unsplash image that was previously hardcoded.
// These are purely decorative background gradients — no content is affected.
// ─────────────────────────────────────────────────────────────────────────────

const CITY_GRADIENTS = [
  "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
  "linear-gradient(135deg, #111820 0%, #1d2d3a 50%, #111820 100%)",
  "linear-gradient(135deg, #1c1410 0%, #2e2018 50%, #1c1410 100%)",
  "linear-gradient(135deg, #101810 0%, #1a2a1a 50%, #101810 100%)",
  "linear-gradient(135deg, #181018 0%, #271827 50%, #181018 100%)",
  "linear-gradient(135deg, #0f1520 0%, #1a2535 50%, #0f1520 100%)",
];

// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZE / DISPLAY
// ─────────────────────────────────────────────────────────────────────────────

function normalizeCity(raw) {
  return String(raw).trim().replace(/\s+/g, " ").toLowerCase();
}

function displayCity(normalised) {
  return normalised
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─────────────────────────────────────────────────────────────────────────────
// POPULAR LOCATIONS
// ─────────────────────────────────────────────────────────────────────────────

export default function PopularLocations({ properties = [] }) {
  const cities = useMemo(() => {
    const cityCounts = {};

    properties.forEach((p) => {
      const cityRaw = p?.City || p?.PropertyCommonDetails?.City;
      if (!cityRaw) return;

      const normalised = normalizeCity(cityRaw);
      const display = displayCity(normalised);

      cityCounts[display] = (cityCounts[display] || 0) + 1;
    });

    return Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [properties]);

  if (cities.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.09 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 280, damping: 22 },
    },
  };

  return (
    <section
      id="popular-locations"
      className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16 sm:py-20"
    >
      {/* ── Section Header ── */}
      <div className="mb-12 flex flex-col items-center text-center gap-3">
        <span className="hh-eyebrow">
          <span className="hh-eyebrow-dot" aria-hidden="true" />
          Cities
        </span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hh-section-title"
        >
          Popular Locations
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="hh-section-subtitle max-w-lg"
        >
          Discover prime real estate in the most sought-after cities across India.
        </motion.p>
      </div>

      {/* ── Location Cards ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {cities.map((city, index) => (
          <motion.div key={city.name} variants={itemVariants}>
            <Link
              href={`/user/properties?city=${encodeURIComponent(city.name)}&from=popular-locations`}
              className="group relative block h-[260px] w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)] transition-all duration-400 hover:-translate-y-1 hover:border-[var(--border-hover)] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
            >
              {/* Charcoal gradient background — unique per city */}
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ background: CITY_GRADIENTS[index % CITY_GRADIENTS.length] }}
                aria-hidden="true"
              />

              {/* Subtle architectural grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
                aria-hidden="true"
              />

              {/* Gradient scrim for text legibility */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5 transition-opacity duration-400 group-hover:from-black/90"
                aria-hidden="true"
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                {/* City Name */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none mb-2 drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1">
                  {city.name}
                </h3>

                {/* Property count pill */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white/90 transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white">
                    <MapPin
                      size={12}
                      strokeWidth={2.5}
                      className="shrink-0"
                      aria-hidden="true"
                    />
                    {city.count} {city.count === 1 ? "Property" : "Properties"}
                  </span>

                  {/* Arrow cue — appears on hover */}
                  <span className="ml-auto flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-white/10 text-white opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
