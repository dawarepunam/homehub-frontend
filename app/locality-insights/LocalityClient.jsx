"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Building2, TrendingUp, ChevronRight } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/services/localityInsights";

const STRAPI_BASE = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(/\/api\/?$/, "");

function resolveImageUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_BASE}${url}`;
}

export default function LocalityClient({ initialCities, popularLocalities }) {
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Fallback to client side filtering on the initial popular list if needed, 
  // though a real autocomplete should call the API.
  const filteredLocalities = useMemo(() => {
    return popularLocalities.filter(l => {
      const matchCity = !city || l.city.toLowerCase() === city.toLowerCase();
      const matchQuery = !query || l.locality.toLowerCase().includes(query.toLowerCase());
      return matchCity && matchQuery;
    });
  }, [popularLocalities, city, query]);

  return (
    <div className="flex-1 bg-[#F6F0E5]">
      {/* HERO SECTION */}
      <div 
        style={{ background: "linear-gradient(135deg, #0D3326 0%, #1a5040 100%)" }}
        className="relative py-24 px-4 text-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #D7AE62 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
        
        <div className="relative max-w-4xl mx-auto z-10">
          <span className="inline-block text-[#D7AE62] text-xs md:text-sm font-extrabold tracking-[0.25em] uppercase mb-4">
            Locality Insights
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Explore Your Neighborhood
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover property prices, connectivity, nearby amenities, and insights about the neighborhoods you love.
          </p>

          {/* SEARCH BOX */}
          <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
            
            {/* CITY SELECTOR */}
            <div className="relative flex-1 md:border-r border-gray-100 flex items-center">
              <MapPin className="absolute left-4 w-5 h-5 text-gray-400" />
              <select 
                value={city} 
                onChange={e => setCity(e.target.value)}
                className="w-full pl-12 pr-4 py-4 md:py-3 appearance-none bg-transparent font-medium text-gray-700 outline-none focus:ring-0 cursor-pointer"
              >
                <option value="">All Cities</option>
                {initialCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* QUERY INPUT */}
            <div className="relative flex-[2] flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search locality (e.g. Baner, Andheri)..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 md:py-3 bg-transparent font-medium text-gray-700 outline-none placeholder-gray-400"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button className="bg-[#D7AE62] text-[#0D3326] px-8 py-4 md:py-3 rounded-xl md:rounded-full font-bold hover:bg-[#c49a51] transition-colors whitespace-nowrap">
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* POPULAR LOCALITIES */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D3326] mb-4">
              Explore Popular Localities
            </h2>
            <p className="text-gray-600 text-lg">
              Top neighborhoods based on actual property availability.
            </p>
          </div>
        </div>

        {filteredLocalities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[rgba(13,51,38,0.05)]">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0D3326] mb-2">No localities found</h3>
            <p className="text-gray-500">Try adjusting your search query or city selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLocalities.map((loc, i) => (
              <LocalityCard key={i} locality={loc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LocalityCard({ locality }) {
  const imgUrl = resolveImageUrl(locality.image);
  // Use pre-computed slugs from the service to guarantee URL ↔ map-key consistency.
  const citySlug = locality.citySlug || locality.city.toLowerCase().replace(/\s+/g, "-");
  const localitySlug = locality.localitySlug || locality.locality.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      href={`/locality-insights/${encodeURIComponent(citySlug)}/${encodeURIComponent(localitySlug)}`}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-[rgba(13,51,38,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-56 bg-gray-100 overflow-hidden shrink-0">
        {imgUrl ? (
          <Image src={imgUrl} alt={""} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized={true} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0D3326]/5">
            <Building2 className="w-16 h-16 text-[#0D3326]/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <h3 className="text-2xl font-extrabold mb-1 drop-shadow-md">
              {locality.locality}
            </h3>
            <div className="flex items-center text-sm font-medium opacity-90 drop-shadow-md">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {locality.city}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0D3326]/5 flex items-center justify-center text-[#0D3326]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Available</div>
              <div className="text-lg font-bold text-[#0D3326]">{locality.propertyCount} Properties</div>
            </div>
          </div>
          
          {locality.startingPrice && (
            <div className="text-right">
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Starting</div>
              <div className="text-lg font-bold text-[#D7AE62]">
                {formatPrice(locality.startingPrice.price)}
                <span className="text-sm font-medium text-gray-400 ml-1">/{locality.startingPrice.purpose === 'Rent' ? 'mo' : 'buy'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[#0D3326] font-bold text-sm">
          <span>Explore Locality</span>
          <div className="w-8 h-8 rounded-full bg-[#D7AE62]/10 flex items-center justify-center group-hover:bg-[#D7AE62] group-hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
