"use client";

import { useState, useEffect } from "react";
import { getProperties } from "@/services/property";
import PropertyCard from "@/components/PropertyCard";
import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Dynamically import LeafletMap with ssr: false since it relies on window
const LeafletMap = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 flex-col gap-4 p-8 text-center rounded-xl">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#D7AE62] rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading Map...</p>
      </div>
    )
  }
);

// Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
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
      setLocationError("Geolocation is not supported by your browser");
      setLocationState("error");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationState("success");
      },
      (error) => {
        setLocationError("Location access is turned off. Allow location access or search manually.");
        setLocationState("error");
      }
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
      result = result.filter(p => p.Purpose === filterPurpose);
    }
    
    if (filterType) {
      result = result.filter(p => p.Property_Type === filterType);
    }
    
    if (searchCity) {
      const q = searchCity.toLowerCase();
      result = result.filter(p => 
        (p.City && p.City.toLowerCase().includes(q)) || 
        (p.Locality && p.Locality.toLowerCase().includes(q)) ||
        (p.Address && p.Address.toLowerCase().includes(q))
      );
    }
    
    if (userLocation) {
      result = result.map(p => {
        const pLat = parseFloat(p.Latitude);
        const pLng = parseFloat(p.Longitude);
        
        if (!isNaN(pLat) && !isNaN(pLng)) {
          const distance = calculateDistance(userLocation.lat, userLocation.lng, pLat, pLng);
          return { ...p, distance };
        }
        return { ...p, distance: null };
      });
      
      result = result.filter(p => typeof p.distance === 'number' && p.distance <= filterRadius);
      result.sort((a, b) => a.distance - b.distance);
    }
    
    setFilteredProperties(result);
  }, [allProperties, userLocation, filterPurpose, filterType, filterRadius, searchCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0D3326] mb-2">Properties Near Me</h1>
        <p className="text-gray-600">Discover properties in your area using real-time location.</p>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search city, locality, or area..." 
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D7AE62] focus:border-transparent"
          />
        </div>
        
        <button 
          onClick={requestLocation}
          className="flex items-center gap-2 bg-[#0D3326] text-white px-4 py-2 rounded-md hover:bg-[#0a271d] transition-colors whitespace-nowrap"
        >
          <MapPin className="w-4 h-4" /> Use My Location
        </button>
        
        <select 
          value={filterPurpose} 
          onChange={(e) => setFilterPurpose(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#D7AE62]"
        >
          <option value="">Buy / Rent</option>
          <option value="Sale">Buy</option>
          <option value="Rent">Rent</option>
        </select>
        
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#D7AE62]"
        >
          <option value="">Property Type</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
        
        <select 
          value={filterRadius} 
          onChange={(e) => setFilterRadius(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#D7AE62]"
        >
          <option value={5}>5 km Radius</option>
          <option value={10}>10 km Radius</option>
          <option value={20}>20 km Radius</option>
          <option value={50}>50 km Radius</option>
          <option value={100}>100 km Radius</option>
        </select>
      </div>

      {locationState === "loading" && (
        <div className="bg-blue-50 text-blue-800 p-4 rounded-md mb-6 border border-blue-200">
          Finding your location...
        </div>
      )}
      
      {locationState === "error" && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6 flex justify-between items-center border border-red-200">
          <span>{locationError}</span>
          <button onClick={requestLocation} className="underline font-medium hover:text-red-900">Enable Location</button>
        </div>
      )}

      {propsError && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6 border border-red-200">
          {propsError}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Property List */}
        <div className="lg:w-1/2 flex flex-col gap-6 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
          {isLoadingProps ? (
            <div className="p-12 text-center text-gray-500 bg-white rounded-lg border border-gray-100">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D7AE62] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
              <p>Finding properties near you...</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <div 
                key={property.id} 
                className="cursor-pointer transition-all duration-300 hover:-translate-y-1 relative"
                onClick={() => {
                  const pLat = parseFloat(property.Latitude);
                  const pLng = parseFloat(property.Longitude);
                  if (!isNaN(pLat) && !isNaN(pLng)) {
                    setSelectedProperty(property);
                    window.scrollTo({ top: document.querySelector('.leaflet-container')?.offsetTop || 0, behavior: 'smooth' });
                  }
                }}
              >
                {typeof property.distance === 'number' && (
                  <div className="absolute -top-3 left-4 z-10 bg-[#D7AE62] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {property.distance.toFixed(1)} km away
                  </div>
                )}
                <div className={typeof property.distance === 'number' ? "pt-2" : ""}>
                  <PropertyCard property={property} />
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
              <MapPin className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found nearby.</h3>
              <p className="text-gray-500">Try increasing the distance or searching another location.</p>
            </div>
          )}
        </div>
        
        {/* Map */}
        <div className="lg:w-1/2 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 min-h-[600px] relative shadow-inner">
          <LeafletMap 
            userLocation={userLocation} 
            filteredProperties={filteredProperties} 
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
          />
        </div>
      </div>
    </div>
  );
}
