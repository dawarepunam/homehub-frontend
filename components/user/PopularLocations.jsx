"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

// Normalize a city string: trim whitespace, collapse internal spaces, lowercase.
function normalizeCity(raw) {
  return String(raw).trim().replace(/\s+/g, " ").toLowerCase();
}

// Produce a Title-Cased display label from a normalised city string.
function displayCity(normalised) {
  return normalised
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

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
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <section
      id="popular-locations"
      className="mx-auto max-w-[1200px] px-6 py-20 lg:px-8"
    >
      <div className="mx-auto mb-16 flex max-w-3xl flex-col items-center justify-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[var(--text-primary)]"
        >
          Popular Locations
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-4 text-base text-[var(--text-muted)] sm:text-lg font-medium"
        >
          Discover prime real estate in the most sought-after cities.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {cities.map((city) => (
          <motion.div key={city.name} variants={itemVariants}>
            <Link
              href={`/user/properties?city=${encodeURIComponent(city.name)}&from=popular-locations`}
              className="group relative block h-[280px] w-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl border border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2744&auto=format&fit=crop")',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

              <div className="absolute bottom-6 left-6 right-6 flex flex-col transform transition-transform duration-500 group-hover:-translate-y-2">
                <span className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {city.name}
                </span>
                <div className="mt-2 flex items-center gap-2 overflow-hidden">
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-1.5 text-sm font-semibold text-white/90 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 transition-colors group-hover:bg-white group-hover:text-black group-hover:border-white"
                  >
                    <MapPin size={14} className="group-hover:text-black" />
                    {city.count} {city.count === 1 ? "Property" : "Properties"}
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
