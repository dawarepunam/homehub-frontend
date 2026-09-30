"use client";

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PropertyCard from "@/components/PropertyCard";

// Fix for default marker icons in Leaflet with Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultPropertyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedPropertyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Helper component to center map when selected property changes
function MapController({ center, zoom, selectedProperty, properties }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedProperty && selectedProperty.Latitude && selectedProperty.Longitude) {
      map.flyTo(
        [parseFloat(selectedProperty.Latitude), parseFloat(selectedProperty.Longitude)], 
        15,
        { duration: 1.5 }
      );
    } else if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, selectedProperty, map]);
  
  return null;
}

export default function LeafletMap({ 
  userLocation, 
  filteredProperties, 
  selectedProperty, 
  setSelectedProperty 
}) {
  const router = useRouter();
  const mapRef = useRef(null);

  const center = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : (filteredProperties.length > 0 && filteredProperties[0].Latitude 
        ? [parseFloat(filteredProperties[0].Latitude), parseFloat(filteredProperties[0].Longitude)] 
        : [20.5937, 78.9629]); // Default India

  const zoom = userLocation ? 12 : 5;

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%', minHeight: '600px', zIndex: 10 }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController 
        center={center} 
        zoom={zoom} 
        selectedProperty={selectedProperty} 
        properties={filteredProperties} 
      />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {filteredProperties.map(property => {
        const lat = parseFloat(property.Latitude);
        const lng = parseFloat(property.Longitude);
        if (isNaN(lat) || isNaN(lng)) return null;
        
        const isSelected = selectedProperty?.id === property.id;
        
        return (
          <Marker 
            key={`marker-${property.id}`}
            position={[lat, lng]}
            icon={isSelected ? selectedPropertyIcon : defaultPropertyIcon}
            eventHandlers={{
              click: () => {
                setSelectedProperty(property);
              },
            }}
          >
            <Popup>
              <div className="max-w-[220px] p-0 m-0">
                {property.CoverImage?.url && (
                  <img 
                    src={property.CoverImage.url.startsWith("http") ? property.CoverImage.url : `${STRAPI_URL}${property.CoverImage.url}`} 
                    alt={property.Title}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                )}
                <h4 className="font-bold text-[#0D3326] mb-1 truncate text-sm m-0 leading-tight">{property.Title}</h4>
                <p className="text-xs text-gray-600 truncate mb-2 flex items-center gap-1 m-0">
                  <MapPin className="w-3 h-3" /> {property.Locality || property.City}
                </p>
                {property.Price && (
                  <p className="font-bold text-[#D7AE62] text-sm mb-2 m-0">₹ {property.Price} {property.PriceUnits}</p>
                )}
                <button 
                  className="text-xs font-medium bg-[#0D3326] text-white px-4 py-2 rounded-md w-full hover:bg-[#0a271d] transition-colors mt-1 border-none cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/property/${property.documentId || property.id}`);
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
