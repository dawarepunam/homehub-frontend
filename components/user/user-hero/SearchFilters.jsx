// "use client";
// function handleSearch() {
//   router.push(
//     `/user/search?city=${encodeURIComponent(selectedCity)}&area=${encodeURIComponent(selectedArea)}&type=${encodeURIComponent(selectedType)}&category=${encodeURIComponent(selectedCategory)}`,
//   );
// }
// import { useEffect, useMemo, useState } from "react";
// import { Search, MapPin, Map, Building2, Home } from "lucide-react";
// import { getProperties } from "@/services/property";

// export default function SearchFilters() {
//   const [properties, setProperties] = useState([]);

//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedType, setSelectedType] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");

//   useEffect(() => {
//     async function loadProperties() {
//       const data = await getProperties();
//       setProperties(data || []);
//     }

//     loadProperties();
//   }, []);

//   const cities = useMemo(() => {
//     return [...new Set(properties.map((p) => p.City).filter(Boolean))];
//   }, [properties]);

//   const areas = useMemo(() => {
//     if (!selectedCity) return [];

//     return [
//       ...new Set(
//         properties
//           .filter((p) => p.City === selectedCity)
//           .map((p) => p.Area)
//           .filter(Boolean),
//       ),
//     ];
//   }, [properties, selectedCity]);

//   const propertyTypes = useMemo(() => {
//     return [...new Set(properties.map((p) => p.Property_Type).filter(Boolean))];
//   }, [properties]);

//   const categories = useMemo(() => {
//     if (!selectedType) return [];

//     return [
//       ...new Set(
//         properties
//           .filter((p) => p.Property_Type === selectedType)
//           .map((p) => p.Category)
//           .filter(Boolean),
//       ),
//     ];
//   }, [properties, selectedType]);

//   const handleSearch = () => {
//     console.log({
//       city: selectedCity,
//       area: selectedArea,
//       propertyType: selectedType,
//       category: selectedCategory,
//     });
//   };

//   return (
//     <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-5">
//       {/* City */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <MapPin className="text-blue-600" size={20} />

//         <select
//           value={selectedCity}
//           onChange={(e) => {
//             setSelectedCity(e.target.value);
//             setSelectedArea("");
//           }}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">City</option>

//           {cities.map((city) => (
//             <option key={city}>{city}</option>
//           ))}
//         </select>
//       </div>

//       {/* Area */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Map className="text-blue-600" size={20} />

//         <select
//           value={selectedArea}
//           onChange={(e) => setSelectedArea(e.target.value)}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Area</option>

//           {areas.map((area) => (
//             <option key={area}>{area}</option>
//           ))}
//         </select>
//       </div>

//       {/* Property Type */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Building2 className="text-blue-600" size={20} />

//         <select
//           value={selectedType}
//           onChange={(e) => {
//             setSelectedType(e.target.value);
//             setSelectedCategory("");
//           }}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Property Type</option>

//           {propertyTypes.map((type) => (
//             <option key={type}>{type}</option>
//           ))}
//         </select>
//       </div>

//       {/* Category */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Home className="text-blue-600" size={20} />

//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Category</option>

//           {categories.map((category) => (
//             <option key={category}>{category}</option>
//           ))}
//         </select>
//       </div>

//       {/* Search */}

//       <button
//         onClick={handleSearch}
//         className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700"
//       >
//         <Search size={20} />
//         Search
//       </button>
//     </div>
//   );
// // }
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Search, MapPin, Map, Building2, Home } from "lucide-react";
// import { getProperties } from "@/services/property";

// export default function SearchFilters() {
//   const router = useRouter();

//   const [properties, setProperties] = useState([]);

//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedType, setSelectedType] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");

//   useEffect(() => {
//     async function loadProperties() {
//       const data = await getProperties();
//       setProperties(data || []);
//     }

//     loadProperties();
//   }, []);

//   // ================= Cities =================

//   const cities = useMemo(() => {
//     return [...new Set(properties.map((p) => p.City).filter(Boolean))];
//   }, [properties]);

//   // ================= Areas =================

//   const areas = useMemo(() => {
//     if (!selectedCity) return [];

//     return [
//       ...new Set(
//         properties
//           .filter((p) => p.City === selectedCity)
//           .map((p) => p.Area)
//           .filter(Boolean),
//       ),
//     ];
//   }, [properties, selectedCity]);

//   // ================= Property Types =================

//   const propertyTypes = useMemo(() => {
//     return [...new Set(properties.map((p) => p.Property_Type).filter(Boolean))];
//   }, [properties]);

//   // ================= Categories =================

//   const categories = useMemo(() => {
//     if (!selectedType) return [];

//     return [
//       ...new Set(
//         properties
//           .filter((p) => p.Property_Type === selectedType)
//           .map((p) => p.Category)
//           .filter(Boolean),
//       ),
//     ];
//   }, [properties, selectedType]);

//   // ================= Search =================

//   const handleSearch = () => {
//     if (!selectedCity || !selectedArea || !selectedType || !selectedCategory) {
//       alert("Please select all filters.");
//       return;
//     }

//     const query = new URLSearchParams({
//       city: selectedCity,
//       area: selectedArea,
//       type: selectedType,
//       category: selectedCategory,
//     });

//     router.push(`/user/search?${query.toString()}`);
//   };

//   return (
//     <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-5">
//       {/* City */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <MapPin className="text-blue-600" size={20} />

//         <select
//           value={selectedCity}
//           onChange={(e) => {
//             setSelectedCity(e.target.value);
//             setSelectedArea("");
//           }}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Select City</option>

//           {cities.map((city) => (
//             <option key={city} value={city}>
//               {city}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Area */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Map className="text-blue-600" size={20} />

//         <select
//           value={selectedArea}
//           onChange={(e) => setSelectedArea(e.target.value)}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Select Area</option>

//           {areas.map((area) => (
//             <option key={area} value={area}>
//               {area}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Property Type */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Building2 className="text-blue-600" size={20} />

//         <select
//           value={selectedType}
//           onChange={(e) => {
//             setSelectedType(e.target.value);
//             setSelectedCategory("");
//           }}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Property Type</option>

//           {propertyTypes.map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Category */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Home className="text-blue-600" size={20} />

//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Category</option>

//           {categories.map((category) => (
//             <option key={category} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Search Button */}

//       <button
//         onClick={handleSearch}
//         className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
//       >
//         <Search size={20} />
//         Search
//       </button>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Search, MapPin, Map, Building2, Home } from "lucide-react";
// import { getProperties } from "@/services/property";

// export default function SearchFilters({ activePurpose }) {
//   const router = useRouter();

//   const [properties, setProperties] = useState([]);

//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedType, setSelectedType] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");

//   useEffect(() => {
//     async function loadProperties() {
//       const data = await getProperties();
//       setProperties(data || []);
//     }

//     loadProperties();
//   }, []);

//   // ================= Cities =================

//   const cities = useMemo(() => {
//     return [...new Set(properties.map((p) => p.City).filter(Boolean))];
//   }, [properties]);

//   // ================= Areas =================

//   const areas = useMemo(() => {
//     if (!selectedCity) return [];

//     return [
//       ...new Set(
//         properties
//           .filter((p) => p.City === selectedCity)
//           .map((p) => p.Area)
//           .filter(Boolean),
//       ),
//     ];
//   }, [properties, selectedCity]);

//   // ================= Property Types =================

//   const propertyTypes = useMemo(() => {
//     return [...new Set(properties.map((p) => p.Property_Type).filter(Boolean))];
//   }, [properties]);

//   // ================= Categories =================

//   const categories = useMemo(() => {
//     if (!selectedType) return [];

//     return [
//       ...new Set(
//         properties
//           .filter((p) => p.Property_Type === selectedType)
//           .map((p) => p.Category)
//           .filter(Boolean),
//       ),
//     ];
//   }, [properties, selectedType]);

//   // ================= Search =================

//   const handleSearch = () => {
//     if (!selectedCity || !selectedArea || !selectedType || !selectedCategory) {
//       alert("Please select all filters.");
//       return;
//     }

//     const query = new URLSearchParams({
//       purpose: activePurpose,
//       city: selectedCity,
//       area: selectedArea,
//       type: selectedType,
//       category: selectedCategory,
//     });

//     router.push(`/user/search?${query.toString()}`);
//   };

//   return (
//     <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-5">
//       {/* City */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <MapPin className="text-blue-600" size={20} />

//         <select
//           value={selectedCity}
//           onChange={(e) => {
//             setSelectedCity(e.target.value);
//             setSelectedArea("");
//           }}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Select City</option>

//           {cities.map((city) => (
//             <option key={city} value={city}>
//               {city}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Area */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Map className="text-blue-600" size={20} />

//         <select
//           value={selectedArea}
//           onChange={(e) => setSelectedArea(e.target.value)}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Select Area</option>

//           {areas.map((area) => (
//             <option key={area} value={area}>
//               {area}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Property Type */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Building2 className="text-blue-600" size={20} />

//         <select
//           value={selectedType}
//           onChange={(e) => {
//             setSelectedType(e.target.value);
//             setSelectedCategory("");
//           }}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Property Type</option>

//           {propertyTypes.map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Category */}

//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Home className="text-blue-600" size={20} />

//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Category</option>

//           {categories.map((category) => (
//             <option key={category} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Search Button */}

//       <button
//         onClick={handleSearch}
//         className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
//       >
//         <Search size={20} />
//         Search
//       </button>
//     </div>
//   );
// }
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Search, MapPin, Map, Building2, Home } from "lucide-react";
// import { getProperties } from "@/services/property";

// export default function SearchFilters({ activePurpose }) {
//   const router = useRouter();

//   const [properties, setProperties] = useState([]);

//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedType, setSelectedType] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");

//   useEffect(() => {
//     async function loadProperties() {
//       const data = await getProperties();
//       setProperties(data || []);
//     }

//     loadProperties();
//   }, []);

//   // ================= Cities =================

//   const cities = useMemo(() => {
//     return [...new Set(properties.map((p) => p.City).filter(Boolean))];
//   }, [properties]);

//   // ================= Areas =================

//   const areas = useMemo(() => {
//     if (!selectedCity) return [];

//     return [
//       ...new Set(
//         properties
//           .filter((p) => p.City === selectedCity)
//           .map((p) => p.Area)
//           .filter(Boolean),
//       ),
//     ];
//   }, [properties, selectedCity]);

//   // ================= Property Types =================

//   const propertyTypes = useMemo(() => {
//     return [...new Set(properties.map((p) => p.Property_Type).filter(Boolean))];
//   }, [properties]);

//   // ================= Categories =================

//   const categories = useMemo(() => {
//     if (!selectedType) return [];

//     return [
//       ...new Set(
//         properties
//           .filter((p) => p.Property_Type === selectedType)
//           .map((p) => p.Category)
//           .filter(Boolean),
//       ),
//     ];
//   }, [properties, selectedType]);

//   // ================= Search =================

//   const handleSearch = () => {
//     if (!selectedCity || !selectedArea || !selectedType || !selectedCategory) {
//       alert("Please select all filters.");
//       return;
//     }

//     const query = new URLSearchParams();

//     query.set("purpose", activePurpose || "");
//     query.set("city", selectedCity);
//     query.set("area", selectedArea);
//     query.set("type", selectedType);
//     query.set("category", selectedCategory);

//     router.push(`/user/search?${query.toString()}`);
//   };

//   return (
//     <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-5">
//       {/* City */}
//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <MapPin className="text-blue-600" size={20} />

//         <select
//           value={selectedCity}
//           onChange={(e) => {
//             setSelectedCity(e.target.value);
//             setSelectedArea("");
//           }}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Select City</option>

//           {cities.map((city) => (
//             <option key={city} value={city}>
//               {city}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Area */}
//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Map className="text-blue-600" size={20} />

//         <select
//           value={selectedArea}
//           onChange={(e) => setSelectedArea(e.target.value)}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Select Area</option>

//           {areas.map((area) => (
//             <option key={area} value={area}>
//               {area}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Property Type */}
//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Building2 className="text-blue-600" size={20} />

//         <select
//           value={selectedType}
//           onChange={(e) => {
//             setSelectedType(e.target.value);
//             setSelectedCategory("");
//           }}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Property Type</option>

//           {propertyTypes.map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Category */}
//       <div className="flex items-center gap-3 rounded-xl border p-4">
//         <Home className="text-blue-600" size={20} />

//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="w-full bg-transparent outline-none"
//         >
//           <option value="">Category</option>

//           {categories.map((category) => (
//             <option key={category} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Search Button */}
//       <button
//         type="button"
//         onClick={handleSearch}
//         className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
//       >
//         <Search size={20} />
//         Search
//       </button>
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Map, Building2, Home } from "lucide-react";
import { getProperties } from "@/services/property";
import { normalizeStr, formatLabel } from "@/utils/normalize";

export default function SearchFilters({ activePurpose }) {
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function loadProperties() {
      const data = await getProperties();
      setProperties(data || []);
    }
    loadProperties();
  }, []);

  // Filter properties by active purpose (Buy/Sale -> Sale, Rent -> Rent)
  const baseProperties = useMemo(() => {
    return properties.filter((p) => {
      if (!activePurpose) return true;
      const targetPurpose =
        activePurpose.toLowerCase() === "buy" ? "sale" : activePurpose.toLowerCase();
      return normalizeStr(p.Purpose) === targetPurpose;
    });
  }, [properties, activePurpose]);

  // Reset dependent filters when purpose changes
  useEffect(() => {
    setSelectedCity("");
    setSelectedArea("");
    setSelectedType("");
    setSelectedCategory("");
  }, [activePurpose]);

  // ================= Cities =================
  const cities = useMemo(() => {
    const unique = new Set(baseProperties.map((p) => normalizeStr(p.City)).filter(Boolean));
    return Array.from(unique).map(formatLabel).sort();
  }, [baseProperties]);

  // ================= Areas =================
  const areas = useMemo(() => {
    let source = baseProperties;
    if (selectedCity) {
      source = source.filter((p) => normalizeStr(p.City) === normalizeStr(selectedCity));
    }
    const unique = new Set(source.map((p) => normalizeStr(p.Area)).filter(Boolean));
    return Array.from(unique).map(formatLabel).sort();
  }, [baseProperties, selectedCity]);

  // ================= Property Types =================
  const propertyTypes = useMemo(() => {
    let source = baseProperties;
    if (selectedCity) source = source.filter((p) => normalizeStr(p.City) === normalizeStr(selectedCity));
    if (selectedArea) source = source.filter((p) => normalizeStr(p.Area) === normalizeStr(selectedArea));
    
    return [...new Set(source.map((p) => p.Property_Type).filter(Boolean))].sort();
  }, [baseProperties, selectedCity, selectedArea]);

  // ================= Categories =================
  const categories = useMemo(() => {
    let source = baseProperties;
    if (selectedCity) source = source.filter((p) => normalizeStr(p.City) === normalizeStr(selectedCity));
    if (selectedArea) source = source.filter((p) => normalizeStr(p.Area) === normalizeStr(selectedArea));
    if (selectedType) source = source.filter((p) => normalizeStr(p.Property_Type) === normalizeStr(selectedType));

    return [...new Set(source.map((p) => p.Category).filter(Boolean))].sort();
  }, [baseProperties, selectedCity, selectedArea, selectedType]);

  // ================= Search =================
  const handleSearch = () => {
    const query = new URLSearchParams();
    if (activePurpose) query.set("purpose", activePurpose);
    if (selectedCity) query.set("city", selectedCity);
    if (selectedArea) query.set("area", selectedArea);
    if (selectedType) query.set("type", selectedType);
    if (selectedCategory) query.set("category", selectedCategory);

    router.push(`/user/search?${query.toString()}`);
  };

  const handleFilterChange = (setter, resetters = []) => (e) => {
    const val = e.target.value;
    setter(val);
    resetters.forEach((reset) => reset(""));
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      {/* City */}

      <div className="flex h-20 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 transition hover:border-[#D7AE62]">
        <MapPin className="text-[#0D3326]" size={22} />

        <div className="flex w-full flex-col">
          <span className="mb-1 text-xs font-medium text-gray-500">
            Location
          </span>

          <select
            value={selectedCity}
            onChange={handleFilterChange(setSelectedCity, [setSelectedArea, setSelectedType, setSelectedCategory])}
            className="w-full bg-transparent text-base font-semibold outline-none"
          >
            <option value="">Select City</option>

            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Area */}

      <div className="flex h-20 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 transition hover:border-[#D7AE62]">
        <Map className="text-[#0D3326]" size={22} />

        <div className="flex w-full flex-col">
          <span className="mb-1 text-xs font-medium text-gray-500">Area</span>

          <select
            value={selectedArea}
            onChange={handleFilterChange(setSelectedArea, [setSelectedType, setSelectedCategory])}
            className="w-full bg-transparent text-base font-semibold outline-none"
          >
            <option value="">Select Area</option>

            {areas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Type */}

      <div className="flex h-20 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 transition hover:border-[#D7AE62]">
        <Building2 className="text-[#0D3326]" size={22} />

        <div className="flex w-full flex-col">
          <span className="mb-1 text-xs font-medium text-gray-500">
            Property Type
          </span>

          <select
            value={selectedType}
            onChange={handleFilterChange(setSelectedType, [setSelectedCategory])}
            className="w-full bg-transparent text-base font-semibold outline-none"
          >
            <option value="">Property Type</option>

            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category */}

      <div className="flex h-20 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 transition hover:border-[#D7AE62]">
        <Home className="text-[#0D3326]" size={22} />

        <div className="flex w-full flex-col">
          <span className="mb-1 text-xs font-medium text-gray-500">
            Category
          </span>

          <select
            value={selectedCategory}
            onChange={handleFilterChange(setSelectedCategory, [])}
            className="w-full bg-transparent text-base font-semibold outline-none"
          >
            <option value="">Category</option>

            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}

      <button
        type="button"
        onClick={handleSearch}
        className="flex h-20 items-center justify-center gap-3 rounded-2xl bg-[#D7AE62] text-lg font-bold text-[#0D3326] transition hover:bg-[#C99A40]"
      >
        <Search size={22} />
        Search
      </button>
    </div>
  );
}
