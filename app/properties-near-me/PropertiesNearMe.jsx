"use client";

import { useState, useEffect } from "react";
import { getProperties } from "@/services/property";
import PropertyCard from "@/components/PropertyCard";
import { MapPin, Search, Navigation, Filter, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Dynamically import LeafletMap with ssr: false since it relies on window
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-card)] flex-col gap-4 p-8 text-center rounded-[var(--radius-card)] border border-[var(--border-subtle)]">
      <Loader2 className="w-10 h-10 animate-spin text-[var(--text-primary)]" />
      <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">
        Initializing Map
      </p>
    </div>
  ),
});

// Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function PropertiesNearMe() {
  const router = useRouter();

  const [locationState, setLocationState] = useState("idle");
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoadingProps, setIsLoadingProps] = useState(false);
  const [propsError, setPropsError] = useState("");

  const [searchCity, setSearchCity] = useState("");

  // Filters
  const [filterPurpose, setFilterPurpose] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterRadius, setFilterRadius] = useState(20);

  // Map State
  const [selectedProperty, setSelectedProperty] = useState(null);

  const requestLocation = () => {
    setLocationState("loading");
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationState("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationState("success");
      },
      (error) => {
        setLocationError(
          "Location access denied. Please enable it or search manually.",
        );
        setLocationState("error");
      },
    );
  };

  useEffect(() => {
    requestLocation();

    const fetchProps = async () => {
      setIsLoadingProps(true);
      try {
        const props = await getProperties();
        setAllProperties(props || []);
      } catch (e) {
        setPropsError("Unable to load properties. Please try again.");
      } finally {
        setIsLoadingProps(false);
      }
    };

    fetchProps();
  }, []);

  useEffect(() => {
    if (!allProperties || !Array.isArray(allProperties)) return;

    let result = [...allProperties];

    if (filterPurpose) {
      result = result.filter((p) => p.Purpose === filterPurpose);
    }

    if (filterType) {
      result = result.filter((p) => p.Property_Type === filterType);
    }

    if (searchCity) {
      const q = searchCity.toLowerCase();
      result = result.filter(
        (p) =>
          (p.City && p.City.toLowerCase().includes(q)) ||
          (p.Locality && p.Locality.toLowerCase().includes(q)) ||
          (p.Address && p.Address.toLowerCase().includes(q)),
      );
    }

    if (userLocation) {
      result = result.map((p) => {
        const pLat = parseFloat(p.Latitude);
        const pLng = parseFloat(p.Longitude);

        if (!isNaN(pLat) && !isNaN(pLng)) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            pLat,
            pLng,
          );
          return { ...p, distance };
        }
        return { ...p, distance: null };
      });

      result = result.filter(
        (p) => typeof p.distance === "number" && p.distance <= filterRadius,
      );
      result.sort((a, b) => a.distance - b.distance);
    }

    setFilteredProperties(result);
  }, [
    allProperties,
    userLocation,
    filterPurpose,
    filterType,
    filterRadius,
    searchCity,
  ]);

  const listVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="bg-[var(--bg-page)] min-h-screen pt-12 pb-24">
      <div className="max-w-[1440px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="inline-block text-[var(--text-primary)] text-[11px] font-extrabold tracking-[0.3em] uppercase mb-4">
            Proximity Search
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">
            Properties Near Me
          </h1>
          <p className="text-[var(--text-muted)] text-lg font-medium max-w-2xl">
            Discover real estate within your immediate vicinity using real-time
            geolocation.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-[var(--bg-card)] p-5 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--border-subtle)] mb-8 flex flex-col md:flex-row flex-wrap gap-4 items-center z-20 relative"
        >
          <div className="flex-1 min-w-[280px] w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
            <input
              type="text"
              placeholder="Search city, locality, or area..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-page)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-[8px] focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] font-medium"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto">
            <button
              onClick={requestLocation}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg-page)] px-6 py-3.5 rounded-[8px] hover:opacity-80 transition-opacity whitespace-nowrap font-bold text-sm uppercase tracking-widest"
            >
              {locationState === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              Locate Me
            </button>

            <div className="relative flex-1 md:flex-none">
              <select
                value={filterPurpose}
                onChange={(e) => setFilterPurpose(e.target.value)}
                className="w-full appearance-none border border-[var(--border-subtle)] rounded-[8px] pl-4 pr-10 py-3.5 bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] font-semibold text-sm cursor-pointer"
              >
                <option value="">Any Purpose</option>
                <option value="Sale">Buy</option>
                <option value="Rent">Rent</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            </div>

            <div className="relative flex-1 md:flex-none">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full appearance-none border border-[var(--border-subtle)] rounded-[8px] pl-4 pr-10 py-3.5 bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] font-semibold text-sm cursor-pointer"
              >
                <option value="">Any Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            </div>

            <div className="relative flex-1 md:flex-none">
              <select
                value={filterRadius}
                onChange={(e) => setFilterRadius(Number(e.target.value))}
                className="w-full appearance-none border border-[var(--border-subtle)] rounded-[8px] pl-4 pr-10 py-3.5 bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] font-semibold text-sm cursor-pointer"
              >
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={20}>Within 20 km</option>
                <option value={50}>Within 50 km</option>
                <option value={100}>Within 100 km</option>
              </select>
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {locationState === "error" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black text-white p-4 rounded-[var(--radius-card)] mb-8 flex flex-col sm:flex-row justify-between items-center gap-4"
            >
              <span className="font-medium text-sm">{locationError}</span>
              <button
                onClick={requestLocation}
                className="border border-white/30 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors whitespace-nowrap"
              >
                Retry
              </button>
            </motion.div>
          )}

          {propsError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black text-white p-4 rounded-[var(--radius-card)] mb-8 font-medium text-sm"
            >
              {propsError}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Property List */}
          <div className="lg:w-[45%] flex flex-col gap-6 overflow-y-auto max-h-[850px] pr-2 custom-scrollbar">
            {isLoadingProps || locationState === "loading" ? (
              <div className="p-16 text-center bg-[var(--bg-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)] flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-[var(--text-primary)] mb-6" />
                <p className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-sm">
                  Locating Properties...
                </p>
              </div>
            ) : filteredProperties.length > 0 ? (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-6"
              >
                {filteredProperties.map((property) => (
                  <motion.div
                    variants={itemVariants}
                    key={property.id}
                    className={`cursor-pointer transition-all duration-300 relative rounded-[var(--radius-card)] border ${selectedProperty?.id === property.id ? "border-[var(--text-primary)] ring-2 ring-[var(--text-primary)] ring-offset-2 ring-offset-[var(--bg-page)]" : "border-transparent"} hover:border-[var(--text-primary)]`}
                    onClick={() => {
                      const pLat = parseFloat(property.Latitude);
                      const pLng = parseFloat(property.Longitude);
                      if (!isNaN(pLat) && !isNaN(pLng)) {
                        setSelectedProperty(property);
                        window.scrollTo({
                          top:
                            document.querySelector(".leaflet-container")
                              ?.offsetTop || 0,
                          behavior: "smooth",
                        });
                      }
                    }}
                  >
                    {typeof property.distance === "number" && (
                      <div className="absolute top-4 left-4 z-20 bg-[var(--text-primary)] text-[var(--bg-page)] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                        {property.distance.toFixed(1)} km away
                      </div>
                    )}
                    <div className="pointer-events-none group rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:shadow-xl transition-all duration-500">
                      <PropertyCard property={property} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-16 text-center bg-[var(--bg-card)] rounded-[var(--radius-card)] border border-[var(--border-subtle)] flex flex-col items-center justify-center min-h-[400px]"
              >
                <MapPin className="w-12 h-12 text-[var(--border-subtle)] mb-6" />
                <h3 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">
                  No properties nearby
                </h3>
                <p className="text-[var(--text-muted)] font-medium">
                  Try increasing the radius or searching another location.
                </p>
              </motion.div>
            )}
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:w-[55%] bg-[var(--bg-card)] rounded-[var(--radius-card)] overflow-hidden border border-[var(--border-subtle)] min-h-[600px] lg:h-[850px] relative shadow-[var(--shadow-card)] z-10"
          >
            <LeafletMap
              userLocation={userLocation}
              filteredProperties={filteredProperties}
              selectedProperty={selectedProperty}
              setSelectedProperty={setSelectedProperty}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
