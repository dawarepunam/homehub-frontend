"use client";

import { useMemo, useState } from "react";
import { Search, MapPin, Building2, Home, Tag } from "lucide-react";

export default function UserSearchCard({ searchData }) {
  if (!searchData) return null;

  // ===============================
  // Property Categories
  // ===============================

  const categories = useMemo(() => {
    return [...(searchData.PropertyCategory || [])]
      .filter((item) => item.IsActive)
      .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));
  }, [searchData]);

  // ===============================
  // Property Types
  // ===============================

  const propertyTypes = useMemo(() => {
    return [...(searchData.PropertyTypes || [])]
      .filter((item) => item.IsActive)
      .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));
  }, [searchData]);

  // ===============================
  // Locations
  // ===============================

  const locations = useMemo(() => {
    return [...(searchData.Locations || [])]
      .filter((item) => item.IsActive)
      .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));
  }, [searchData]);

  // ===============================
  // Tabs
  // ===============================

  const tabs = [
    {
      title: "Buy",
      icon: <Home size={18} />,
    },
    {
      title: "Rent",
      icon: <Building2 size={18} />,
    },
    {
      title: "Sale",
      icon: <Tag size={18} />,
    },
  ];

  // ===============================
  // States
  // ===============================

  const [purpose, setPurpose] = useState(searchData.Purpose || "Buy");

  const [location, setLocation] = useState(locations[0]?.Slug || "");

  const [category, setCategory] = useState(categories[0]?.Slug || "");

  const [propertyType, setPropertyType] = useState(
    propertyTypes[0]?.Slug || "",
  );

  // ===============================
  // Search
  // ===============================

  const handleSearch = () => {
    console.log({
      purpose,
      location,
      category,
      propertyType,
    });
  };
  return (
    <div className="relative z-30 mt-10 w-full">
      <div className="overflow-hidden rounded-[30px] bg-white shadow-2xl">
        {/* ================= Tabs ================= */}

        <div className="flex border-b border-gray-200 px-6 pt-6">
          {tabs.map((tab) => (
            <button
              key={tab.title}
              onClick={() => setPurpose(tab.title)}
              className={`mr-3 flex items-center gap-2 rounded-t-xl px-7 py-4 text-base font-semibold transition-all ${
                purpose === tab.title
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.icon}
              {tab.title}
            </button>
          ))}
        </div>

        {/* ================= Search Row ================= */}

        <div className="grid gap-5 p-6 lg:grid-cols-5">
          {/* Location */}
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="mb-2 text-sm text-gray-500">Location</p>

            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border-none bg-transparent text-lg font-semibold outline-none"
              >
                {locations.map((item) => (
                  <option key={item.id} value={item.Slug}>
                    {item.Title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Category */}
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="mb-2 text-sm text-gray-500">Category</p>

            <div className="flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-none bg-transparent text-lg font-semibold outline-none"
              >
                {categories.map((item) => (
                  <option key={item.id} value={item.Slug}>
                    {item.Title}
                  </option>
                ))}
              </select>
            </div>
          </div>{" "}
          {/* Property Type */}
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="mb-2 text-sm text-gray-500">Property Type</p>

            <div className="flex items-center gap-2">
              <Home size={20} className="text-blue-600" />

              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full border-none bg-transparent text-lg font-semibold outline-none"
              >
                {propertyTypes.map((item) => (
                  <option key={item.id} value={item.Slug}>
                    {item.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="flex h-full min-h-[92px] items-center justify-center gap-3 rounded-2xl bg-blue-600 text-lg font-semibold text-white transition hover:bg-blue-700"
          >
            <Search size={22} />
            {searchData.SearchButtonText || "Search Properties"}
          </button>
        </div>

        {/* ================= Popular Searches ================= */}

        <div className="border-t border-gray-200 px-6 py-5">
          <h3 className="mb-4 text-lg font-semibold">Popular Searches</h3>

          <div className="flex flex-wrap gap-3">
            {propertyTypes
              .filter((item) => item.IsPopular)
              .map((item) => (
                <button
                  key={item.id}
                  className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium transition hover:border-blue-600 hover:text-blue-600"
                >
                  {item.Name}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
