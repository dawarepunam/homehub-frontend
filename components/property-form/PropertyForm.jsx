// "use client";

// import { useState } from "react";

// import BasicInfo from "./BasicInfo";
// import Location from "./Location";
// import PropertyDetails from "./PropertyDetails";
// import Media from "./Media";
// import Review from "./Review";

// import { createProperty } from "@/services/property";

// export default function PropertyForm() {
//   const [step, setStep] = useState(1);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",

//     propertyType: "",
//     purpose: "",
//     category: "",
//     propertyStatus: "",

//     address: "",
//     area: "",
//     city: "",
//     state: "",
//     pinCode: "",

//     propertyCommonDetails: {},

//     residentialDetails: {},
//     commercialDetails: {},
//     industrialDetails: {},

//     coverImage: null,
//     propertyImages: [],
//   });

//   function nextStep() {
//     if (step < 5) {
//       setStep((prev) => prev + 1);
//     }
//   }

//   function previousStep() {
//     if (step > 1) {
//       setStep((prev) => prev - 1);
//     }
//   }

//   async function handleSubmit() {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         alert("Please Login First");
//         return;
//       }

//       const propertyData = {
//         Title: formData.title,
//         Description: formData.description,

//         Property_Type: formData.propertyType,
//         Purpose: formData.purpose,
//         Category: formData.category,

//         Address: formData.address,
//         Area: formData.area,
//         City: formData.city,
//         State: formData.state,
//         PinCode: Number(formData.pinCode),

//         PropertyStatus: formData.propertyStatus,

//         PropertyCommonDetails: formData.propertyCommonDetails,

//         ResidentialDetails: formData.residentialDetails,

//         CommercialDetails: formData.commercialDetails,

//         IndustrialDetails: formData.industrialDetails,
//       };

//       console.log("Sending Data");
//       console.log(propertyData);

//       const result = await createProperty(
//         propertyData,
//         token
//       );

//       if (result) {
//         alert("Property Added Successfully");

//         console.log(result);

//         setFormData({
//           title: "",
//           description: "",

//           propertyType: "",
//           purpose: "",
//           category: "",
//           propertyStatus: "",

//           address: "",
//           area: "",
//           city: "",
//           state: "",
//           pinCode: "",

//           propertyCommonDetails: {},

//           residentialDetails: {},
//           commercialDetails: {},
//           industrialDetails: {},

//           coverImage: null,
//           propertyImages: [],
//         });

//         setStep(1);
//       } else {
//         alert("Property Creation Failed");
//       }
//     } catch (error) {
//       console.error(error);

//       alert("Something went wrong");
//     }
//   }

//   return (
//     <div className="mx-auto mt-10 max-w-5xl rounded-xl bg-white p-8 shadow-lg">

//       <h2 className="mb-2 text-3xl font-bold">
//         Add Property
//       </h2>

//       <p className="mb-8 text-gray-500">
//         Step {step} of 5
//       </p>

//       {step === 1 && (
//         <BasicInfo
//           formData={formData}
//           setFormData={setFormData}
//         />
//       )}

//       {step === 2 && (
//         <Location
//           formData={formData}
//           setFormData={setFormData}
//         />
//       )}

//       {step === 3 && (
//         <PropertyDetails
//           formData={formData}
//           setFormData={setFormData}
//         />
//       )}

//       {step === 4 && (
//         <Media
//           formData={formData}
//           setFormData={setFormData}
//         />
//       )}

//       {step === 5 && (
//         <Review
//           formData={formData}
//         />
//       )}

//       <div className="mt-10 flex items-center justify-between">

//         <button
//           onClick={previousStep}
//           disabled={step === 1}
//           className="rounded-lg border px-6 py-3 disabled:cursor-not-allowed disabled:opacity-40"
//         >
//           Previous
//         </button>

//         {step < 5 ? (
//           <button
//             onClick={nextStep}
//             className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700"
//           >
//             Submit Property
//           </button>
//         )}

//       </div>

//     </div>
//   );
// // }
// "use client";

// import { useMemo, useState } from "react";
// import { createProperty } from "@/services/property";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// const initialFormData = {
//   title: "",
//   description: "",

//   purpose: "",
//   propertyType: "",
//   category: "",
//   propertyStatus: "Available",

//   address: "",
//   area: "",
//   city: "",
//   state: "",
//   pinCode: "",

//   price: "",
//   priceUnits: "INR",

//   propertyCommonDetails: {
//     carpetArea: "",
//     built_upArea: "",
//     propertyAge: "",
//     facing: "",
//     availableFrom: "",
//     area_unit: "Sq.ft",
//   },

//   residentialDetails: {
//     bedrooms: "",
//     bathrooms: "",
//     balconies: "",
//     furnishing: "",
//     floorNo: "",
//     totalFloors: "",
//     propertyCondition: "",
//   },

//   commercialDetails: {
//     commercialType: "",
//     washrooms: "",
//     cabins: "",
//     meetingRooms: "",
//     pantry: false,
//     receptionArea: false,
//   },

//   industrialDetails: {
//     industrialType: "",
//     warehouseArea: "",
//     loadingDock: false,
//     powerSupply: "",
//     officeSpace: false,
//     craneFacility: false,
//   },

//   amenities: {
//     Parking: false,
//     Lift: false,
//     Security: false,
//     CCTV: false,
//     PowerBackup: false,
//     Gym: false,
//     SwimmingPool: false,
//     Garden: false,
//   },

//   coverImage: null,
//   propertyImages: [],
// };

// const categoryMap = {
//   Residential: [
//     "One BHK",
//     "Two BHK",
//     "Three BHK",
//     "Four BHK",
//     "Villa",
//   ],
//   Commercial: ["Office", "Shop", "Warehouse"],
//   Industrial: ["Factory"],
// };

// export default function PropertyForm() {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState(initialFormData);
//   const [saving, setSaving] = useState(false);

//   const totalSteps = 7;

//   const categories = useMemo(() => {
//     return categoryMap[formData.propertyType] || [];
//   }, [formData.propertyType]);

//   // ----------------------------------------------------
//   // UPDATE MAIN FIELD
//   // ----------------------------------------------------

//   function updateField(field, value) {
//     setFormData((previous) => ({
//       ...previous,
//       [field]: value,
//     }));
//   }

//   // ----------------------------------------------------
//   // UPDATE NESTED OBJECT
//   // ----------------------------------------------------

//   function updateSection(section, field, value) {
//     setFormData((previous) => ({
//       ...previous,
//       [section]: {
//         ...previous[section],
//         [field]: value,
//       },
//     }));
//   }

//   // ----------------------------------------------------
//   // PURPOSE
//   // ----------------------------------------------------

//   function selectPurpose(value) {
//     setFormData((previous) => ({
//       ...previous,
//       purpose: value,
//     }));
//   }

//   // ----------------------------------------------------
//   // PROPERTY TYPE
//   // ----------------------------------------------------

//   function selectPropertyType(value) {
//     setFormData((previous) => ({
//       ...previous,
//       propertyType: value,
//       category: "",
//     }));
//   }

//   // ----------------------------------------------------
//   // AMENITY
//   // ----------------------------------------------------

//   function toggleAmenity(name) {
//     setFormData((previous) => ({
//       ...previous,
//       amenities: {
//         ...previous.amenities,
//         [name]: !previous.amenities[name],
//       },
//     }));
//   }

//   // ----------------------------------------------------
//   // NEXT
//   // ----------------------------------------------------

//   function nextStep() {
//     if (step === 1 && !formData.purpose) {
//       alert("Please select Sell, Rent or PG.");
//       return;
//     }

//     if (step === 2 && !formData.propertyType) {
//       alert("Please select property type.");
//       return;
//     }

//     if (step === 2 && !formData.category) {
//       alert("Please select property category.");
//       return;
//     }

//     if (step < totalSteps) {
//       setStep((previous) => previous + 1);
//     }
//   }

//   // ----------------------------------------------------
//   // PREVIOUS
//   // ----------------------------------------------------

//   function previousStep() {
//     if (step > 1) {
//       setStep((previous) => previous - 1);
//     }
//   }

//   // ----------------------------------------------------
//   // SUBMIT
//   // ----------------------------------------------------

//   async function handleSubmit() {
//     try {
//       setSaving(true);

//       const token = localStorage.getItem("token");

//       if (!token) {
//         alert("Please login first.");
//         setSaving(false);
//         return;
//       }

//       const userRole = localStorage.getItem("userRole");

//       if (userRole && userRole.toLowerCase() !== "owner") {
//         alert("Only an Owner can post a property.");
//         setSaving(false);
//         return;
//       }

//       // ----------------------------------------------
//       // GET CURRENT USER
//       // ----------------------------------------------

//       const userResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         cache: "no-store",
//       });

//       const currentUser = await userResponse.json();

//       if (!userResponse.ok || !currentUser?.id) {
//         console.error("CURRENT USER ERROR:", currentUser);

//         alert(
//           currentUser?.error?.message ||
//             "Unable to identify logged-in owner."
//         );

//         setSaving(false);
//         return;
//       }

//       // ----------------------------------------------
//       // PROPERTY DATA
//       // ----------------------------------------------

//       const propertyData = {
//         Title: formData.title,
//         Description: formData.description,

//         Property_Type: formData.propertyType,
//         Purpose: formData.purpose,
//         Category: formData.category,

//         Address: formData.address,
//         Area: formData.area,
//         City: formData.city,
//         State: formData.state,
//         PinCode: Number(formData.pinCode),

//         PropertyStatus: formData.propertyStatus,

//         Price: Number(formData.price) || 0,
//         PriceUnits: formData.priceUnits,

//         PropertyCommonDetails: formData.propertyCommonDetails,

//         ResidentialDetails:
//           formData.propertyType === "Residential"
//             ? formData.residentialDetails
//             : {},

//         CommercialDetails:
//           formData.propertyType === "Commercial"
//             ? formData.commercialDetails
//             : {},

//         IndustrialDetails:
//           formData.propertyType === "Industrial"
//             ? formData.industrialDetails
//             : {},

//         PropertyAmenities: formData.amenities,

//         Owner: currentUser.id,
//       };

//       console.log("PROPERTY DATA:", propertyData);

//       const result = await createProperty(propertyData, token);

//       if (result) {
//         alert("Property Added Successfully!");

//         setFormData(initialFormData);
//         setStep(1);
//       } else {
//         alert("Property creation failed.");
//       }
//     } catch (error) {
//       console.error("PROPERTY SUBMIT ERROR:", error);

//       alert(
//         error?.message ||
//           "Something went wrong while creating property."
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   // ----------------------------------------------------
//   // SELECTED AMENITIES
//   // ----------------------------------------------------

//   const selectedAmenities = Object.entries(formData.amenities)
//     .filter(([, value]) => value)
//     .map(([key]) => key);

//   // ----------------------------------------------------
//   // UI
//   // ----------------------------------------------------

//   return (
//     <>
//       <div className="property-page">
//         <div className="property-container">

//           {/* HEADER */}

//           <div className="property-header">
//             <div>
//               <div className="brand-small">
//                 HOMEHUB
//               </div>

//               <h1>Post Your Property</h1>

//               <p>
//                 Tell us about your property and reach the right
//                 buyers and tenants.
//               </p>
//             </div>

//             <div className="step-count">
//               Step {step} of {totalSteps}
//             </div>
//           </div>

//           {/* PROGRESS */}

//           <div className="progress-wrapper">
//             <div className="progress-line">
//               <div
//                 className="progress-active"
//                 style={{
//                   width: `${((step - 1) / (totalSteps - 1)) * 100}%`,
//                 }}
//               />
//             </div>

//             <div className="progress-steps">
//               {[
//                 "Purpose",
//                 "Property",
//                 "Details",
//                 "Location",
//                 "Amenities",
//                 "Photos",
//                 "Review",
//               ].map((item, index) => (
//                 <div
//                   key={item}
//                   className={`progress-item ${
//                     step >= index + 1 ? "active" : ""
//                   }`}
//                 >
//                   <span>{index + 1}</span>
//                   <small>{item}</small>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* MAIN CARD */}

//           <div className="form-card">

//             {/* =========================================
//                 STEP 1 — PURPOSE
//             ========================================= */}

//             {step === 1 && (
//               <div className="step-content">

//                 <div className="section-heading">
//                   <span>01</span>

//                   <div>
//                     <h2>What do you want to do?</h2>
//                     <p>
//                       Choose how you want to list your property.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="purpose-grid">

//                   {[
//                     {
//                       value: "Sell",
//                       icon: "⌂",
//                       title: "Sell",
//                       text: "Sell your property",
//                     },
//                     {
//                       value: "Rent",
//                       icon: "↗",
//                       title: "Rent",
//                       text: "Rent out your property",
//                     },
//                     {
//                       value: "PG",
//                       icon: "♟",
//                       title: "PG / Co-living",
//                       text: "Offer PG or co-living",
//                     },
//                   ].map((item) => (
//                     <button
//                       type="button"
//                       key={item.value}
//                       onClick={() => selectPurpose(item.value)}
//                       className={`purpose-card ${
//                         formData.purpose === item.value
//                           ? "selected"
//                           : ""
//                       }`}
//                     >
//                       <div className="purpose-icon">
//                         {item.icon}
//                       </div>

//                       <strong>{item.title}</strong>

//                       <span>{item.text}</span>

//                       {formData.purpose === item.value && (
//                         <div className="selected-check">
//                           ✓
//                         </div>
//                       )}
//                     </button>
//                   ))}
//                 </div>

//               </div>
//             )}

//             {/* =========================================
//                 STEP 2 — PROPERTY TYPE + CATEGORY
//             ========================================= */}

//             {step === 2 && (
//               <div className="step-content">

//                 <div className="section-heading">
//                   <span>02</span>

//                   <div>
//                     <h2>What type of property is it?</h2>

//                     <p>
//                       Select the property type and then choose
//                       its category.
//                     </p>
//                   </div>
//                 </div>

//                 {/* PROPERTY TYPE */}

//                 <label className="field-label">
//                   Property Type
//                 </label>

//                 <div className="type-grid">

//                   {[
//                     {
//                       value: "Residential",
//                       icon: "⌂",
//                       text: "Homes & Apartments",
//                     },
//                     {
//                       value: "Commercial",
//                       icon: "▦",
//                       text: "Office & Shops",
//                     },
//                     {
//                       value: "Industrial",
//                       icon: "▥",
//                       text: "Factory & Industrial",
//                     },
//                   ].map((item) => (
//                     <button
//                       type="button"
//                       key={item.value}
//                       onClick={() =>
//                         selectPropertyType(item.value)
//                       }
//                       className={`type-card ${
//                         formData.propertyType === item.value
//                           ? "selected"
//                           : ""
//                       }`}
//                     >
//                       <div className="type-icon">
//                         {item.icon}
//                       </div>

//                       <strong>{item.value}</strong>

//                       <span>{item.text}</span>

//                       {formData.propertyType === item.value && (
//                         <div className="selected-check">
//                           ✓
//                         </div>
//                       )}
//                     </button>
//                   ))}

//                 </div>

//                 {/* CATEGORY */}

//                 {formData.propertyType && (
//                   <div className="category-section">

//                     <label className="field-label">
//                       {formData.propertyType} Category
//                     </label>

//                     <div className="category-grid">

//                       {categories.map((category) => (
//                         <button
//                           type="button"
//                           key={category}
//                           onClick={() =>
//                             updateField("category", category)
//                           }
//                           className={`category-card ${
//                             formData.category === category
//                               ? "selected"
//                               : ""
//                           }`}
//                         >
//                           {category}

//                           {formData.category === category && (
//                             <span>✓</span>
//                           )}
//                         </button>
//                       ))}

//                     </div>

//                   </div>
//                 )}

//               </div>
//             )}

//             {/* =========================================
//                 STEP 3 — DETAILS
//             ========================================= */}

//             {step === 3 && (
//               <div className="step-content">

//                 <div className="section-heading">
//                   <span>03</span>

//                   <div>
//                     <h2>Property Details</h2>

//                     <p>
//                       Add the important information about your
//                       property.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="form-grid">

//                   <div className="field full">
//                     <label>Property Title</label>

//                     <input
//                       value={formData.title}
//                       onChange={(e) =>
//                         updateField("title", e.target.value)
//                       }
//                       placeholder="e.g. Spacious 2 BHK Apartment"
//                     />
//                   </div>

//                   <div className="field full">
//                     <label>Description</label>

//                     <textarea
//                       value={formData.description}
//                       onChange={(e) =>
//                         updateField(
//                           "description",
//                           e.target.value
//                         )
//                       }
//                       placeholder="Describe your property..."
//                       rows={5}
//                     />
//                   </div>

//                   <div className="field">
//                     <label>Price</label>

//                     <input
//                       type="number"
//                       value={formData.price}
//                       onChange={(e) =>
//                         updateField("price", e.target.value)
//                       }
//                       placeholder="Enter price"
//                     />
//                   </div>

//                   <div className="field">
//                     <label>Price Unit</label>

//                     <select
//                       value={formData.priceUnits}
//                       onChange={(e) =>
//                         updateField(
//                           "priceUnits",
//                           e.target.value
//                         )
//                       }
//                     >
//                       <option value="INR">INR</option>
//                       <option value="Lakh">Lakh</option>
//                       <option value="Crore">Crore</option>
//                       <option value="Monthly">Monthly</option>
//                     </select>
//                   </div>

//                   <div className="field">
//                     <label>Carpet Area</label>

//                     <input
//                       type="number"
//                       value={
//                         formData.propertyCommonDetails
//                           .carpetArea
//                       }
//                       onChange={(e) =>
//                         updateSection(
//                           "propertyCommonDetails",
//                           "carpetArea",
//                           e.target.value
//                         )
//                       }
//                       placeholder="e.g. 1200"
//                     />
//                   </div>

//                   <div className="field">
//                     <label>Built-up Area</label>

//                     <input
//                       type="number"
//                       value={
//                         formData.propertyCommonDetails
//                           .built_upArea
//                       }
//                       onChange={(e) =>
//                         updateSection(
//                           "propertyCommonDetails",
//                           "built_upArea",
//                           e.target.value
//                         )
//                       }
//                       placeholder="e.g. 1350"
//                     />
//                   </div>

//                   <div className="field">
//                     <label>Property Age</label>

//                     <select
//                       value={
//                         formData.propertyCommonDetails
//                           .propertyAge
//                       }
//                       onChange={(e) =>
//                         updateSection(
//                           "propertyCommonDetails",
//                           "propertyAge",
//                           e.target.value
//                         )
//                       }
//                     >
//                       <option value="">Select age</option>
//                       <option>New</option>
//                       <option>0-5 Years</option>
//                       <option>5-10 Years</option>
//                       <option>10+ Years</option>
//                     </select>
//                   </div>

//                   <div className="field">
//                     <label>Facing</label>

//                     <select
//                       value={
//                         formData.propertyCommonDetails.facing
//                       }
//                       onChange={(e) =>
//                         updateSection(
//                           "propertyCommonDetails",
//                           "facing",
//                           e.target.value
//                         )
//                       }
//                     >
//                       <option value="">Select facing</option>
//                       <option>East</option>
//                       <option>West</option>
//                       <option>North</option>
//                       <option>South</option>
//                       <option>North-East</option>
//                       <option>North-West</option>
//                       <option>South-East</option>
//                       <option>South-West</option>
//                     </select>
//                   </div>

//                   {/* RESIDENTIAL */}

//                   {formData.propertyType === "Residential" && (
//                     <>
//                       <div className="sub-heading full">
//                         Residential Details
//                       </div>

//                       <div className="field">
//                         <label>Bedrooms</label>

//                         <select
//                           value={
//                             formData.residentialDetails
//                               .bedrooms
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "residentialDetails",
//                               "bedrooms",
//                               e.target.value
//                             )
//                           }
//                         >
//                           <option value="">Select</option>
//                           <option>1</option>
//                           <option>2</option>
//                           <option>3</option>
//                           <option>4</option>
//                           <option>5+</option>
//                         </select>
//                       </div>

//                       <div className="field">
//                         <label>Bathrooms</label>

//                         <input
//                           type="number"
//                           value={
//                             formData.residentialDetails
//                               .bathrooms
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "residentialDetails",
//                               "bathrooms",
//                               e.target.value
//                             )
//                           }
//                           placeholder="Bathrooms"
//                         />
//                       </div>

//                       <div className="field">
//                         <label>Balconies</label>

//                         <input
//                           type="number"
//                           value={
//                             formData.residentialDetails
//                               .balconies
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "residentialDetails",
//                               "balconies",
//                               e.target.value
//                             )
//                           }
//                           placeholder="Balconies"
//                         />
//                       </div>

//                       <div className="field">
//                         <label>Furnishing</label>

//                         <select
//                           value={
//                             formData.residentialDetails
//                               .furnishing
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "residentialDetails",
//                               "furnishing",
//                               e.target.value
//                             )
//                           }
//                         >
//                           <option value="">
//                             Select furnishing
//                           </option>
//                           <option>Unfurnished</option>
//                           <option>Semi Furnished</option>
//                           <option>Fully Furnished</option>
//                         </select>
//                       </div>

//                       <div className="field">
//                         <label>Floor No.</label>

//                         <input
//                           type="number"
//                           value={
//                             formData.residentialDetails
//                               .floorNo
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "residentialDetails",
//                               "floorNo",
//                               e.target.value
//                             )
//                           }
//                           placeholder="Floor"
//                         />
//                       </div>

//                       <div className="field">
//                         <label>Total Floors</label>

//                         <input
//                           type="number"
//                           value={
//                             formData.residentialDetails
//                               .totalFloors
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "residentialDetails",
//                               "totalFloors",
//                               e.target.value
//                             )
//                           }
//                           placeholder="Total floors"
//                         />
//                       </div>
//                     </>
//                   )}

//                   {/* COMMERCIAL */}

//                   {formData.propertyType === "Commercial" && (
//                     <>
//                       <div className="sub-heading full">
//                         Commercial Details
//                       </div>

//                       <div className="field">
//                         <label>Commercial Type</label>

//                         <select
//                           value={
//                             formData.commercialDetails
//                               .commercialType
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "commercialDetails",
//                               "commercialType",
//                               e.target.value
//                             )
//                           }
//                         >
//                           <option value="">Select</option>
//                           <option>Office</option>
//                           <option>Shop</option>
//                           <option>Warehouse</option>
//                         </select>
//                       </div>

//                       <div className="field">
//                         <label>Washrooms</label>

//                         <input
//                           type="number"
//                           value={
//                             formData.commercialDetails
//                               .washrooms
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "commercialDetails",
//                               "washrooms",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>

//                       <div className="field">
//                         <label>Cabins</label>

//                         <input
//                           type="number"
//                           value={
//                             formData.commercialDetails
//                               .cabins
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "commercialDetails",
//                               "cabins",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>

//                       <div className="field">
//                         <label>Meeting Rooms</label>

//                         <input
//                           type="number"
//                           value={
//                             formData.commercialDetails
//                               .meetingRooms
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "commercialDetails",
//                               "meetingRooms",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                     </>
//                   )}

//                   {/* INDUSTRIAL */}

//                   {formData.propertyType === "Industrial" && (
//                     <>
//                       <div className="sub-heading full">
//                         Industrial Details
//                       </div>

//                       <div className="field">
//                         <label>Industrial Type</label>

//                         <select
//                           value={
//                             formData.industrialDetails
//                               .industrialType
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "industrialDetails",
//                               "industrialType",
//                               e.target.value
//                             )
//                           }
//                         >
//                           <option value="">Select</option>
//                           <option>Factory</option>
//                           <option>Warehouse</option>
//                           <option>Industrial Land</option>
//                         </select>
//                       </div>

//                       <div className="field">
//                         <label>Warehouse Area</label>

//                         <input
//                           type="number"
//                           value={
//                             formData.industrialDetails
//                               .warehouseArea
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "industrialDetails",
//                               "warehouseArea",
//                               e.target.value
//                             )
//                           }
//                           placeholder="Sq.ft"
//                         />
//                       </div>

//                       <div className="field">
//                         <label>Power Supply</label>

//                         <select
//                           value={
//                             formData.industrialDetails
//                               .powerSupply
//                           }
//                           onChange={(e) =>
//                             updateSection(
//                               "industrialDetails",
//                               "powerSupply",
//                               e.target.value
//                             )
//                           }
//                         >
//                           <option value="">Select</option>
//                           <option>Single Phase</option>
//                           <option>Three Phase</option>
//                           <option>High Voltage</option>
//                         </select>
//                       </div>
//                     </>
//                   )}
//                 </div>

//               </div>
//             )}

//             {/* =========================================
//                 STEP 4 — LOCATION
//             ========================================= */}

//             {step === 4 && (
//               <div className="step-content">

//                 <div className="section-heading">
//                   <span>04</span>

//                   <div>
//                     <h2>Where is your property?</h2>

//                     <p>
//                       Add the exact location details.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="form-grid">

//                   <div className="field full">
//                     <label>Address</label>

//                     <input
//                       value={formData.address}
//                       onChange={(e) =>
//                         updateField(
//                           "address",
//                           e.target.value
//                         )
//                       }
//                       placeholder="Building, street, locality"
//                     />
//                   </div>

//                   <div className="field">
//                     <label>Area / Locality</label>

//                     <input
//                       value={formData.area}
//                       onChange={(e) =>
//                         updateField("area", e.target.value)
//                       }
//                       placeholder="e.g. Baner"
//                     />
//                   </div>

//                   <div className="field">
//                     <label>City</label>

//                     <input
//                       value={formData.city}
//                       onChange={(e) =>
//                         updateField("city", e.target.value)
//                       }
//                       placeholder="e.g. Pune"
//                     />
//                   </div>

//                   <div className="field">
//                     <label>State</label>

//                     <input
//                       value={formData.state}
//                       onChange={(e) =>
//                         updateField(
//                           "state",
//                           e.target.value
//                         )
//                       }
//                       placeholder="e.g. Maharashtra"
//                     />
//                   </div>

//                   <div className="field">
//                     <label>PIN Code</label>

//                     <input
//                       type="number"
//                       value={formData.pinCode}
//                       onChange={(e) =>
//                         updateField(
//                           "pinCode",
//                           e.target.value
//                         )
//                       }
//                       placeholder="411045"
//                     />
//                   </div>

//                 </div>

//               </div>
//             )}

//             {/* =========================================
//                 STEP 5 — AMENITIES
//             ========================================= */}

//             {step === 5 && (
//               <div className="step-content">

//                 <div className="section-heading">
//                   <span>05</span>

//                   <div>
//                     <h2>Amenities & Facilities</h2>

//                     <p>
//                       Select only the facilities available
//                       at your property.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="amenities-grid">

//                   {[
//                     ["Parking", "Dedicated parking"],
//                     ["Lift", "Lift facility"],
//                     ["Security", "24×7 security"],
//                     ["CCTV", "CCTV surveillance"],
//                     ["PowerBackup", "Power backup"],
//                     ["Gym", "Fitness centre"],
//                     ["SwimmingPool", "Swimming pool"],
//                     ["Garden", "Garden / green area"],
//                   ].map(([key, description]) => (
//                     <label
//                       key={key}
//                       className={`amenity-card ${
//                         formData.amenities[key]
//                           ? "selected"
//                           : ""
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={formData.amenities[key]}
//                         onChange={() =>
//                           toggleAmenity(key)
//                         }
//                       />

//                       <div className="amenity-check">
//                         {formData.amenities[key] ? "✓" : ""}
//                       </div>

//                       <div>
//                         <strong>
//                           {key === "PowerBackup"
//                             ? "Power Backup"
//                             : key === "SwimmingPool"
//                             ? "Swimming Pool"
//                             : key}
//                         </strong>

//                         <span>{description}</span>
//                       </div>
//                     </label>
//                   ))}

//                 </div>

//                 {selectedAmenities.length > 0 && (
//                   <div className="selected-summary">
//                     <strong>
//                       {selectedAmenities.length} facilities
//                       selected
//                     </strong>

//                     <span>
//                       {selectedAmenities.join(" • ")}
//                     </span>
//                   </div>
//                 )}

//               </div>
//             )}

//             {/* =========================================
//                 STEP 6 — PHOTOS
//             ========================================= */}

//             {step === 6 && (
//               <div className="step-content">

//                 <div className="section-heading">
//                   <span>06</span>

//                   <div>
//                     <h2>Add Property Photos</h2>

//                     <p>
//                       Good photos help buyers understand
//                       your property better.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="upload-box">

//                   <div className="upload-icon">
//                     +
//                   </div>

//                   <h3>
//                     Upload property photos
//                   </h3>

//                   <p>
//                     Cover image and multiple property
//                     images can be added here.
//                   </p>

//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={(e) =>
//                       updateField(
//                         "propertyImages",
//                         Array.from(e.target.files || [])
//                       )
//                     }
//                   />

//                   {formData.propertyImages.length > 0 && (
//                     <div className="file-count">
//                       {formData.propertyImages.length} photos
//                       selected
//                     </div>
//                   )}

//                 </div>

//                 <div className="photo-note">
//                   <strong>Tip:</strong> Add bright photos of
//                   the living room, bedrooms, kitchen,
//                   bathrooms and exterior.
//                 </div>

//               </div>
//             )}

//             {/* =========================================
//                 STEP 7 — REVIEW
//             ========================================= */}

//             {step === 7 && (
//               <div className="step-content">

//                 <div className="section-heading">
//                   <span>07</span>

//                   <div>
//                     <h2>Review Your Property</h2>

//                     <p>
//                       Check your information before
//                       publishing.
//                     </p>
//                   </div>
//                 </div>

//                 {/* PROPERTY HERO */}

//                 <div className="review-hero">

//                   <div>
//                     <span className="review-badge">
//                       {formData.purpose}
//                     </span>

//                     <h2>
//                       {formData.title ||
//                         "Your Property Title"}
//                     </h2>

//                     <p>
//                       {formData.area || "Locality"},{" "}
//                       {formData.city || "City"}
//                     </p>
//                   </div>

//                   <div className="review-price">
//                     ₹{" "}
//                     {formData.price
//                       ? Number(
//                           formData.price
//                         ).toLocaleString("en-IN")
//                       : "—"}
//                   </div>

//                 </div>

//                 {/* QUICK INFO */}

//                 <div className="review-stats">

//                   <div>
//                     <span>Property</span>
//                     <strong>
//                       {formData.propertyType || "—"}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Category</span>
//                     <strong>
//                       {formData.category || "—"}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Area</span>
//                     <strong>
//                       {formData.propertyCommonDetails
//                         .carpetArea || "—"}{" "}
//                       Sq.ft
//                     </strong>
//                   </div>

//                   {formData.propertyType ===
//                     "Residential" && (
//                     <>
//                       <div>
//                         <span>Bedrooms</span>
//                         <strong>
//                           {formData.residentialDetails
//                             .bedrooms || "—"}
//                         </strong>
//                       </div>

//                       <div>
//                         <span>Bathrooms</span>
//                         <strong>
//                           {formData.residentialDetails
//                             .bathrooms || "—"}
//                         </strong>
//                       </div>
//                     </>
//                   )}

//                 </div>

//                 {/* DESCRIPTION */}

//                 <div className="review-section">

//                   <h3>
//                     Property Description
//                   </h3>

//                   <p>
//                     {formData.description ||
//                       "No description added."}
//                   </p>

//                 </div>

//                 {/* LOCATION */}

//                 <div className="review-section">

//                   <h3>Location</h3>

//                   <div className="review-details">

//                     <div>
//                       <span>Address</span>
//                       <strong>
//                         {formData.address || "—"}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>Locality</span>
//                       <strong>
//                         {formData.area || "—"}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>City</span>
//                       <strong>
//                         {formData.city || "—"}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>State</span>
//                       <strong>
//                         {formData.state || "—"}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>PIN Code</span>
//                       <strong>
//                         {formData.pinCode || "—"}
//                       </strong>
//                     </div>

//                   </div>

//                 </div>

//                 {/* AMENITIES */}

//                 <div className="review-section">

//                   <div className="review-title-row">
//                     <h3>
//                       Amenities & Facilities
//                     </h3>

//                     <span>
//                       {selectedAmenities.length} selected
//                     </span>
//                   </div>

//                   <div className="review-amenities">

//                     {selectedAmenities.length > 0 ? (
//                       selectedAmenities.map((item) => (
//                         <div key={item}>
//                           ✓ {item}
//                         </div>
//                       ))
//                     ) : (
//                       <p>
//                         No amenities selected.
//                       </p>
//                     )}

//                   </div>

//                 </div>

//                 {/* MORE DETAILS */}

//                 <details className="more-details">

//                   <summary>
//                     View More Property Details
//                     <span>+</span>
//                   </summary>

//                   <div className="more-details-content">

//                     <div>
//                       <span>Purpose</span>
//                       <strong>
//                         {formData.purpose}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>Property Type</span>
//                       <strong>
//                         {formData.propertyType}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>Category</span>
//                       <strong>
//                         {formData.category}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>Built-up Area</span>
//                       <strong>
//                         {formData.propertyCommonDetails
//                           .built_upArea || "—"}{" "}
//                         Sq.ft
//                       </strong>
//                     </div>

//                     <div>
//                       <span>Property Age</span>
//                       <strong>
//                         {formData.propertyCommonDetails
//                           .propertyAge || "—"}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>Facing</span>
//                       <strong>
//                         {formData.propertyCommonDetails
//                           .facing || "—"}
//                       </strong>
//                     </div>

//                     {formData.propertyType ===
//                       "Residential" && (
//                       <>
//                         <div>
//                           <span>Balconies</span>
//                           <strong>
//                             {formData.residentialDetails
//                               .balconies || "—"}
//                           </strong>
//                         </div>

//                         <div>
//                           <span>Furnishing</span>
//                           <strong>
//                             {formData.residentialDetails
//                               .furnishing || "—"}
//                           </strong>
//                         </div>

//                         <div>
//                           <span>Floor</span>
//                           <strong>
//                             {formData.residentialDetails
//                               .floorNo || "—"}
//                             {" / "}
//                             {formData.residentialDetails
//                               .totalFloors || "—"}
//                           </strong>
//                         </div>
//                       </>
//                     )}

//                   </div>

//                 </details>

//               </div>
//             )}

//             {/* =========================================
//                 NAVIGATION
//             ========================================= */}

//             <div className="form-actions">

//               <button
//                 type="button"
//                 onClick={previousStep}
//                 disabled={step === 1}
//                 className="back-button"
//               >
//                 ← Back
//               </button>

//               {step < totalSteps ? (
//                 <button
//                   type="button"
//                   onClick={nextStep}
//                   className="continue-button"
//                 >
//                   Continue
//                   <span>→</span>
//                 </button>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={saving}
//                   className="continue-button"
//                 >
//                   {saving
//                     ? "Publishing..."
//                     : "Publish Property"}
//                   <span>→</span>
//                 </button>
//               )}

//             </div>

//           </div>

//         </div>
//       </div>

//       {/* ==================================================
//           CSS
//       ================================================== */}

//       <style jsx>{`
//         * {
//           box-sizing: border-box;
//         }

//         .property-page {
//           min-height: 100vh;
//           padding: 45px 20px 80px;
//           background:
//             radial-gradient(
//               circle at top right,
//               rgba(208, 155, 55, 0.13),
//               transparent 35%
//             ),
//             #f5f3ed;
//         }

//         .property-container {
//           width: 100%;
//           max-width: 1050px;
//           margin: auto;
//         }

//         .property-header {
//           display: flex;
//           align-items: flex-end;
//           justify-content: space-between;
//           margin-bottom: 32px;
//         }

//         .brand-small {
//           color: #0c4a3e;
//           font-size: 13px;
//           font-weight: 800;
//           letter-spacing: 1.8px;
//           margin-bottom: 10px;
//         }

//         .property-header h1 {
//           margin: 0;
//           color: #073f35;
//           font-size: 38px;
//           font-weight: 800;
//           letter-spacing: -1px;
//         }

//         .property-header p {
//           margin: 8px 0 0;
//           color: #68756f;
//           font-size: 15px;
//         }

//         .step-count {
//           color: #0c4a3e;
//           background: #e9eee9;
//           border: 1px solid #d5ddd6;
//           padding: 10px 15px;
//           border-radius: 30px;
//           font-size: 13px;
//           font-weight: 700;
//         }

//         .progress-wrapper {
//           margin-bottom: 20px;
//         }

//         .progress-line {
//           height: 4px;
//           background: #dce1dc;
//           border-radius: 10px;
//           overflow: hidden;
//         }

//         .progress-active {
//           height: 100%;
//           background: #c99438;
//           transition: width 0.3s ease;
//         }

//         .progress-steps {
//           display: grid;
//           grid-template-columns: repeat(7, 1fr);
//           margin-top: -15px;
//         }

//         .progress-item {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 7px;
//           color: #9aa49f;
//           font-size: 11px;
//         }

//         .progress-item span {
//           width: 30px;
//           height: 30px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 50%;
//           background: #e2e5e1;
//           border: 3px solid #f5f3ed;
//           font-weight: 800;
//         }

//         .progress-item.active {
//           color: #0c4a3e;
//         }

//         .progress-item.active span {
//           background: #0c4a3e;
//           color: white;
//         }

//         .form-card {
//           background: #ffffff;
//           border: 1px solid #e2e6e2;
//           border-radius: 24px;
//           box-shadow: 0 20px 55px rgba(17, 54, 44, 0.09);
//           overflow: hidden;
//         }

//         .step-content {
//           padding: 42px;
//           min-height: 520px;
//         }

//         .section-heading {
//           display: flex;
//           gap: 18px;
//           margin-bottom: 35px;
//         }

//         .section-heading > span {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           min-width: 38px;
//           height: 38px;
//           border-radius: 12px;
//           background: #0c4a3e;
//           color: #e5ad4d;
//           font-size: 13px;
//           font-weight: 800;
//         }

//         .section-heading h2 {
//           margin: 0;
//           color: #073f35;
//           font-size: 25px;
//           font-weight: 800;
//         }

//         .section-heading p {
//           margin: 6px 0 0;
//           color: #77827c;
//           font-size: 14px;
//         }

//         .purpose-grid,
//         .type-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 18px;
//         }

//         .purpose-card,
//         .type-card {
//           position: relative;
//           text-align: left;
//           padding: 26px;
//           border: 1px solid #dfe5e0;
//           background: #fbfcfa;
//           border-radius: 18px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .purpose-card:hover,
//         .type-card:hover {
//           border-color: #c99438;
//           transform: translateY(-2px);
//         }

//         .purpose-card.selected,
//         .type-card.selected {
//           background: #0c4a3e;
//           border-color: #c99438;
//           box-shadow: 0 12px 30px rgba(12, 74, 62, 0.18);
//         }

//         .purpose-icon,
//         .type-icon {
//           width: 48px;
//           height: 48px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 14px;
//           background: #f3eadb;
//           color: #0c4a3e;
//           font-size: 22px;
//           margin-bottom: 20px;
//         }

//         .purpose-card strong,
//         .type-card strong {
//           display: block;
//           color: #0b4137;
//           font-size: 17px;
//           margin-bottom: 7px;
//         }

//         .purpose-card span,
//         .type-card span {
//           color: #7b8580;
//           font-size: 13px;
//         }

//         .purpose-card.selected strong,
//         .type-card.selected strong {
//           color: white;
//         }

//         .purpose-card.selected > span,
//         .type-card.selected > span {
//           color: #c8d5d0;
//         }

//         .selected-check {
//           position: absolute;
//           top: 16px;
//           right: 16px;
//           width: 25px;
//           height: 25px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 50%;
//           background: #d5a044;
//           color: white;
//           font-size: 13px;
//           font-weight: 800;
//         }

//         .field-label {
//           display: block;
//           margin-bottom: 12px;
//           color: #173f36;
//           font-size: 14px;
//           font-weight: 800;
//         }

//         .category-section {
//           margin-top: 35px;
//         }

//         .category-grid {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 12px;
//         }

//         .category-card {
//           border: 1px solid #dce3de;
//           background: white;
//           color: #24483f;
//           padding: 13px 18px;
//           border-radius: 12px;
//           font-size: 14px;
//           font-weight: 700;
//           cursor: pointer;
//         }

//         .category-card.selected {
//           background: #0c4a3e;
//           color: white;
//           border-color: #0c4a3e;
//         }

//         .category-card span {
//           margin-left: 8px;
//           color: #e2ad4b;
//         }

//         .form-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 20px;
//         }

//         .field {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .field.full,
//         .sub-heading.full {
//           grid-column: 1 / -1;
//         }

//         .field label {
//           color: #29483f;
//           font-size: 13px;
//           font-weight: 750;
//         }

//         .field input,
//         .field select,
//         .field textarea {
//           width: 100%;
//           border: 1px solid #dce3de;
//           background: #fbfcfa;
//           color: #183e36;
//           border-radius: 11px;
//           padding: 13px 14px;
//           font-size: 14px;
//           outline: none;
//           transition: 0.2s;
//         }

//         .field textarea {
//           resize: vertical;
//         }

//         .field input:focus,
//         .field select:focus,
//         .field textarea:focus {
//           border-color: #0c4a3e;
//           box-shadow: 0 0 0 3px rgba(12, 74, 62, 0.08);
//           background: white;
//         }

//         .sub-heading {
//           margin-top: 14px;
//           padding-top: 25px;
//           border-top: 1px solid #e5e9e5;
//           color: #0c4a3e;
//           font-size: 17px;
//           font-weight: 800;
//         }

//         .amenities-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 13px;
//         }

//         .amenity-card {
//           position: relative;
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           padding: 17px;
//           border: 1px solid #dfe5e0;
//           border-radius: 14px;
//           background: #fbfcfa;
//           cursor: pointer;
//           transition: 0.2s;
//         }

//         .amenity-card:hover {
//           border-color: #c99438;
//         }

//         .amenity-card.selected {
//           border-color: #c99438;
//           background: #f8f3e9;
//         }

//         .amenity-card input {
//           position: absolute;
//           opacity: 0;
//         }

//         .amenity-check {
//           width: 24px;
//           height: 24px;
//           flex-shrink: 0;
//           border: 2px solid #bbc7c0;
//           border-radius: 7px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-size: 13px;
//           font-weight: 800;
//         }

//         .amenity-card.selected .amenity-check {
//           background: #0c4a3e;
//           border-color: #0c4a3e;
//         }

//         .amenity-card strong {
//           display: block;
//           color: #153f36;
//           font-size: 14px;
//         }

//         .amenity-card span {
//           display: block;
//           margin-top: 3px;
//           color: #84908a;
//           font-size: 12px;
//         }

//         .selected-summary {
//           margin-top: 22px;
//           padding: 15px 18px;
//           border-radius: 12px;
//           background: #edf4f0;
//           color: #0c4a3e;
//         }

//         .selected-summary strong {
//           display: block;
//           font-size: 13px;
//         }

//         .selected-summary span {
//           display: block;
//           margin-top: 5px;
//           color: #61736b;
//           font-size: 12px;
//         }

//         .upload-box {
//           position: relative;
//           text-align: center;
//           padding: 60px 30px;
//           border: 2px dashed #ccd7d0;
//           border-radius: 18px;
//           background: #fafcf9;
//         }

//         .upload-icon {
//           width: 58px;
//           height: 58px;
//           margin: 0 auto 15px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 17px;
//           background: #0c4a3e;
//           color: #e3ad4d;
//           font-size: 30px;
//         }

//         .upload-box h3 {
//           margin: 0;
//           color: #123e35;
//         }

//         .upload-box p {
//           color: #7b8781;
//           font-size: 13px;
//         }

//         .upload-box input {
//           margin-top: 15px;
//         }

//         .file-count {
//           margin-top: 12px;
//           color: #0c4a3e;
//           font-weight: 700;
//           font-size: 13px;
//         }

//         .photo-note {
//           margin-top: 15px;
//           padding: 15px;
//           background: #f8f3e9;
//           border-radius: 12px;
//           color: #705a32;
//           font-size: 13px;
//         }

//         .review-hero {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 28px;
//           border-radius: 18px;
//           background: #0c4a3e;
//           color: white;
//         }

//         .review-badge {
//           display: inline-block;
//           padding: 6px 10px;
//           border-radius: 20px;
//           background: rgba(255, 255, 255, 0.12);
//           color: #e5b04e;
//           font-size: 11px;
//           font-weight: 800;
//           text-transform: uppercase;
//           letter-spacing: 1px;
//         }

//         .review-hero h2 {
//           margin: 12px 0 5px;
//           font-size: 24px;
//         }

//         .review-hero p {
//           margin: 0;
//           color: #c4d3ce;
//           font-size: 13px;
//         }

//         .review-price {
//           color: #e6b04f;
//           font-size: 25px;
//           font-weight: 800;
//         }

//         .review-stats {
//           display: grid;
//           grid-template-columns: repeat(5, 1fr);
//           margin-top: 18px;
//           border: 1px solid #e0e5e1;
//           border-radius: 15px;
//           overflow: hidden;
//         }

//         .review-stats div {
//           padding: 18px;
//           border-right: 1px solid #e0e5e1;
//         }

//         .review-stats div:last-child {
//           border-right: 0;
//         }

//         .review-stats span,
//         .review-details span,
//         .more-details-content span {
//           display: block;
//           color: #89938e;
//           font-size: 11px;
//           margin-bottom: 6px;
//         }

//         .review-stats strong {
//           color: #173f36;
//           font-size: 13px;
//         }

//         .review-section {
//           margin-top: 20px;
//           padding: 23px;
//           border: 1px solid #e0e5e1;
//           border-radius: 15px;
//         }

//         .review-section h3 {
//           margin: 0 0 15px;
//           color: #123f36;
//           font-size: 16px;
//         }

//         .review-section p {
//           margin: 0;
//           color: #66736c;
//           line-height: 1.7;
//           font-size: 13px;
//         }

//         .review-details {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 20px;
//         }

//         .review-details strong {
//           color: #1c443b;
//           font-size: 13px;
//         }

//         .review-title-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }

//         .review-title-row span {
//           color: #0c4a3e;
//           font-size: 12px;
//           font-weight: 700;
//         }

//         .review-amenities {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 9px;
//         }

//         .review-amenities div {
//           padding: 9px 12px;
//           border-radius: 9px;
//           background: #edf4f0;
//           color: #0c4a3e;
//           font-size: 12px;
//           font-weight: 700;
//         }

//         .more-details {
//           margin-top: 20px;
//           border: 1px solid #dfe5e0;
//           border-radius: 15px;
//           overflow: hidden;
//         }

//         .more-details summary {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 18px 20px;
//           cursor: pointer;
//           color: #0c4a3e;
//           font-weight: 800;
//           font-size: 14px;
//         }

//         .more-details summary span {
//           font-size: 20px;
//           color: #c99438;
//         }

//         .more-details-content {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 20px;
//           padding: 20px;
//           border-top: 1px solid #e4e8e4;
//           background: #fafbf9;
//         }

//         .more-details-content strong {
//           color: #21483f;
//           font-size: 13px;
//         }

//         .form-actions {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 20px 42px;
//           border-top: 1px solid #e5e9e5;
//           background: #fbfcfa;
//         }

//         .back-button {
//           border: 0;
//           background: transparent;
//           color: #66746d;
//           font-weight: 700;
//           cursor: pointer;
//           padding: 12px;
//         }

//         .back-button:disabled {
//           opacity: 0.3;
//           cursor: not-allowed;
//         }

//         .continue-button {
//           display: flex;
//           align-items: center;
//           gap: 18px;
//           border: 0;
//           border-radius: 11px;
//           padding: 14px 22px;
//           background: #c99438;
//           color: white;
//           font-weight: 800;
//           cursor: pointer;
//           box-shadow: 0 8px 20px rgba(201, 148, 56, 0.22);
//         }

//         .continue-button:hover {
//           background: #b9822d;
//         }

//         .continue-button:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         @media (max-width: 800px) {
//           .property-header {
//             display: block;
//           }

//           .step-count {
//             display: inline-block;
//             margin-top: 15px;
//           }

//           .step-content {
//             padding: 25px 20px;
//           }

//           .purpose-grid,
//           .type-grid,
//           .amenities-grid {
//             grid-template-columns: 1fr;
//           }

//           .form-grid {
//             grid-template-columns: 1fr;
//           }

//           .review-stats {
//             grid-template-columns: repeat(2, 1fr);
//           }

//           .review-stats div {
//             border-right: 0;
//             border-bottom: 1px solid #e0e5e1;
//           }

//           .review-hero {
//             display: block;
//           }

//           .review-price {
//             margin-top: 15px;
//           }

//           .more-details-content {
//             grid-template-columns: 1fr 1fr;
//           }
//         }

//         @media (max-width: 520px) {
//           .property-page {
//             padding: 20px 10px 50px;
//           }

//           .property-header h1 {
//             font-size: 29px;
//           }

//           .progress-item small {
//             display: none;
//           }

//           .form-card {
//             border-radius: 17px;
//           }

//           .review-stats,
//           .review-details,
//           .more-details-content {
//             grid-template-columns: 1fr;
//           }

//           .form-actions {
//             padding: 15px 20px;
//           }
//         }
//       `}</style>
//     </>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import RoleSelectionModal from "@/app/home/RoleSelectionModal";
import { createProperty, updateProperty, uploadImages } from "@/services/property";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_URL = `${STRAPI_URL.replace(/\/api\/?$/, "")}/api`;

// --- IndexedDB Helpers ---
const DB_NAME = "HomeHubDB";
const STORE_NAME = "PostPropertyState";

const initDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject("indexedDB not available");
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveStateToDB = async (state) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(state, "currentState");
    return new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
  } catch (e) {
    console.error("DB Save Error:", e);
  }
};

const loadStateFromDB = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get("currentState");
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    console.error("DB Load Error:", e);
    return null;
  }
};

const clearStateFromDB = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete("currentState");
  } catch (e) {
    console.error("DB Clear Error:", e);
  }
};
// -------------------------

const initialFormData = {
  title: "",
  description: "",

  purpose: "",
  propertyType: "",
  category: "",
  propertyStatus: "ACTIVE",

  address: "",
  area: "",
  city: "",
  state: "",
  pinCode: "",

  price: "",
  priceUnits: "Lakh",

  propertyCommonDetails: {
    carpetArea: "",
    built_upArea: "",
    propertyAge: "",
    facing: "",
    availableFrom: "",
    area_unit: "Sq.ft",
  },

  residentialDetails: {
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    furnishing: "",
    floorNo: "",
    totalFloors: "",
    propertyCondition: "",
  },

  commercialDetails: {
    commercialType: "",
    washrooms: "",
    cabins: "",
    meetingRooms: "",
    pantry: false,
    receptionArea: false,
  },

  industrialDetails: {
    industrialType: "",
    warehouseArea: "",
    loadingDock: false,
    powerSupply: "",
    officeSpace: false,
    craneFacility: false,
  },

  amenities: {
    Parking: false,
    Lift: false,
    Security: false,
    CCTV: false,
    PowerBackup: false,
    Gym: false,
    SwimmingPool: false,
    Garden: false,
  },

  coverImage: null,
  propertyImages: [],
};

/*
  IMPORTANT:
  Categories are kept according to your actual Strapi Property records.
*/

const categoryMap = {
  Residential: [
    "One BHK",
    "Two BHK",
    "Three BHK",
    "Four BHK",
    "Villa",
  ],

  Commercial: [
    "Office",
    "Shop",
    "Showroom",
    "Co-working Space",
    "Commercial Land",
  ],

  Industrial: [
    "Factory",
    "Warehouse",
    "Industrial Land",
  ],
};

export default function PropertyForm({ mode = "create", initialData = null, propertyId = null, onCancel }) {
  const [step, setStep] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialData);
    } else if (mode === "create") {
      // Load saved state if resuming after login
      loadStateFromDB().then((savedState) => {
        if (savedState) {
          const restoredForm = savedState.formData;
          // Purge stale saved state if it has an invalid Commercial category
          // (e.g. old "Warehouse" which Strapi no longer accepts)
          const validCommercialCategories = ["Office", "Shop", "Showroom", "Co-working Space", "Commercial Land"];
          if (
            restoredForm?.propertyType === "Commercial" &&
            restoredForm?.category &&
            !validCommercialCategories.includes(restoredForm.category)
          ) {
            // Invalid stale state – clear it so the user starts fresh
            clearStateFromDB();
            return;
          }
          if (restoredForm) setFormData(restoredForm);
          if (savedState.step) setStep(savedState.step);
        }
      });
    }
  }, [mode, initialData]);

  const totalSteps = 7;

  const categories = useMemo(() => {
    return categoryMap[formData.propertyType] || [];
  }, [formData.propertyType]);

  // ----------------------------------------------------
  // UPDATE MAIN FIELD
  // ----------------------------------------------------

  function updateField(field, value) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // ----------------------------------------------------
  // UPDATE NESTED OBJECT
  // ----------------------------------------------------

  function updateSection(section, field, value) {
    setFormData((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));
  }

  // ----------------------------------------------------
  // PURPOSE
  // ----------------------------------------------------

  function selectPurpose(value) {
    setFormData((previous) => ({
      ...previous,
      purpose: value,
    }));
  }

  // ----------------------------------------------------
  // PROPERTY TYPE
  // ----------------------------------------------------

  function selectPropertyType(value) {
    setFormData((previous) => ({
      ...previous,
      propertyType: value,
      category: "",
    }));
  }

  // ----------------------------------------------------
  // AMENITY
  // ----------------------------------------------------

  function toggleAmenity(name) {
    setFormData((previous) => ({
      ...previous,
      amenities: {
        ...previous.amenities,
        [name]: !previous.amenities[name],
      },
    }));
  }

  // ----------------------------------------------------
  // NEXT
  // ----------------------------------------------------

  function nextStep() {
    if (step === 1 && !formData.purpose) {
      alert("Please select Sell, Rent or PG.");
      return;
    }

    if (step === 2 && !formData.propertyType) {
      alert("Please select property type.");
      return;
    }

    if (step === 2 && !formData.category) {
      alert("Please select property category.");
      return;
    }

    if (step === 3 && !formData.title.trim()) {
      alert("Please enter property title.");
      return;
    }

    if (step === 3 && !formData.description.trim()) {
      alert("Please enter property description.");
      return;
    }

    if (step === 4 && !formData.address.trim()) {
      alert("Please enter property address.");
      return;
    }

    if (step === 4 && !formData.city.trim()) {
      alert("Please enter city.");
      return;
    }

    if (step === 4 && !formData.state.trim()) {
      alert("Please enter state.");
      return;
    }

    if (step === 4 && !formData.pinCode) {
      alert("Please enter PIN code.");
      return;
    }

    if (step < totalSteps) {
      setStep((previous) => previous + 1);
    }
  }

  // ----------------------------------------------------
  // PREVIOUS
  // ----------------------------------------------------

  function previousStep() {
    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  }

  // ----------------------------------------------------
  // DESCRIPTION → STRAPI BLOCKS
  // ----------------------------------------------------

  function createDescriptionBlocks(description) {
    if (!description?.trim()) {
      return [];
    }

    return description
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) => ({
        type: "paragraph",
        children: [
          {
            type: "text",
            text: paragraph,
          },
        ],
      }));
  }

  // ----------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------

  async function handleSubmit() {
    try {
      setSaving(true);

      // ----------------------------------------------
      // TOKEN
      // ----------------------------------------------

      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.setItem("pendingActionRedirect", "/post-property");
        await saveStateToDB({ formData, step });
        setShowLoginModal(true);
        setSaving(false);
        return;
      }

      // ----------------------------------------------
      // COMMERCIAL TYPE VALIDATION
      // ----------------------------------------------
      const validCommercialTypes = ["Office", "Shop", "Showroom", "Co-working Space", "Commercial Land"];
      if (formData.propertyType === "Commercial") {
        const commercialType = formData.commercialDetails?.commercialType || formData.commercialDetails?.CommercialType;
        if (!commercialType || !validCommercialTypes.includes(commercialType)) {
          alert("Please select a valid Commercial Type (Office, Shop, Showroom, Co-working Space, or Commercial Land).");
          setSaving(false);
          return;
        }
      }

      // ----------------------------------------------
      // GET CURRENT USER
      // ----------------------------------------------

      const userResponse = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const currentUser = await userResponse.json();

      console.log("CURRENT USER:", currentUser);

      if (!userResponse.ok || !currentUser?.id) {
        console.error("CURRENT USER ERROR:", currentUser);

        alert(
          currentUser?.error?.message ||
            "Unable to identify logged-in owner."
        );

        setSaving(false);
        return;
      }

      // ----------------------------------------------
      // DESCRIPTION
      // ----------------------------------------------

      const descriptionBlocks = createDescriptionBlocks(
        formData.description
      );

      // ----------------------------------------------
      // PROPERTY DATA
      // ----------------------------------------------

      // ----------------------------------------------
      // SANITIZE & MAP COMPONENT FIELDS
      // ----------------------------------------------

      const pinCodeClean = formData.pinCode
        ? Number(String(formData.pinCode).replace(/\D/g, ""))
        : null;

      const carpetAreaVal = formData.propertyCommonDetails?.carpetArea
        ? Number(String(formData.propertyCommonDetails.carpetArea).replace(/,/g, ""))
        : 100; // Default positive area if omitted to pass required schema check

      const builtUpAreaVal = formData.propertyCommonDetails?.built_upArea
        ? Number(String(formData.propertyCommonDetails.built_upArea).replace(/,/g, ""))
        : carpetAreaVal;

      // Strapi PropertyAge enum: ["New ", "Years 0-1", "Years 1-5", "Years 5-10", "Years 10+"]
      let propertyAgeMapped = formData.propertyCommonDetails?.propertyAge || null;
      if (propertyAgeMapped === "New") propertyAgeMapped = "New ";
      else if (propertyAgeMapped === "0-5 Years" || propertyAgeMapped === "0-1 Years") propertyAgeMapped = "Years 1-5";
      else if (propertyAgeMapped === "5-10 Years") propertyAgeMapped = "Years 5-10";
      else if (propertyAgeMapped === "10+ Years") propertyAgeMapped = "Years 10+";
      else if (propertyAgeMapped && !["New ", "Years 0-1", "Years 1-5", "Years 5-10", "Years 10+"].includes(propertyAgeMapped)) {
        propertyAgeMapped = null;
      }

      // Strapi AvailableForm date field: must be YYYY-MM-DD format
      let availableFormDate = formData.propertyCommonDetails?.availableFrom;
      if (!availableFormDate || isNaN(new Date(availableFormDate).getTime())) {
        availableFormDate = new Date().toISOString().split("T")[0];
      } else {
        availableFormDate = new Date(availableFormDate).toISOString().split("T")[0];
      }

      // Strapi PriceUnits enum: ["Lakh", "Cr", "/month"]
      let priceUnitsMapped = null;
      if (formData.priceUnits === "Crore" || formData.priceUnits === "Cr") priceUnitsMapped = "Cr";
      else if (formData.priceUnits === "Monthly" || formData.priceUnits === "/month") priceUnitsMapped = "/month";
      else if (formData.priceUnits === "Lakh") priceUnitsMapped = "Lakh";

      // Strapi Bedrooms enum: ["BHK 1", "BHK 2", "BHK 3", "BHK 4", "BHK 5+"]
      let bedroomsMapped = formData.residentialDetails?.bedrooms || null;
      if (bedroomsMapped) {
        if (bedroomsMapped === "1" || bedroomsMapped === "1 BHK" || bedroomsMapped === "BHK 1") bedroomsMapped = "BHK 1";
        else if (bedroomsMapped === "2" || bedroomsMapped === "2 BHK" || bedroomsMapped === "BHK 2") bedroomsMapped = "BHK 2";
        else if (bedroomsMapped === "3" || bedroomsMapped === "3 BHK" || bedroomsMapped === "BHK 3") bedroomsMapped = "BHK 3";
        else if (bedroomsMapped === "4" || bedroomsMapped === "4 BHK" || bedroomsMapped === "BHK 4") bedroomsMapped = "BHK 4";
        else if (bedroomsMapped === "5+" || bedroomsMapped === "5+ BHK" || bedroomsMapped === "BHK 5+") bedroomsMapped = "BHK 5+";
        else bedroomsMapped = null;
      }

      // ----------------------------------------------
      // UPLOAD IMAGES
      // ----------------------------------------------

      let uploadedImageIds = [];
      const newFiles = formData.propertyImages.filter((img) => img instanceof File);
      const existingImages = formData.propertyImages.filter((img) => !(img instanceof File) && img?.id);

      if (newFiles.length > 0) {
        try {
          const uploadResult = await uploadImages(newFiles, token);
          if (uploadResult && Array.isArray(uploadResult)) {
            uploadedImageIds = uploadResult.map((img) => img.id);
          }
        } catch (error) {
          console.error("Image upload failed:", error);
          alert("Image upload failed, but saving property anyway.");
        }
      }

      const allImageIds = [
        ...existingImages.map((img) => img.id),
        ...uploadedImageIds,
      ];

      const propertyData = {
        Title: formData.title.trim(),

        Description: descriptionBlocks,

        Property_Type: formData.propertyType || "Residential",

        // Purpose already matches Strapi enum: "Sale", "Rent", "PG"
        Purpose: formData.purpose || "Sale",

        Category: formData.category || "Three BHK",

        Address: formData.address.trim(),

        Area: formData.area.trim(),

        City: formData.city.trim(),

        State: formData.state.trim(),

        PinCode: pinCodeClean || 411001,

        PropertyStatus: formData.propertyStatus || "ACTIVE",

        Price: formData.price
          ? String(formData.price).replace(/,/g, "")
          : "0",

        PriceUnits: priceUnitsMapped,

        PropertyCommonDetails: {
          CarpetArea: carpetAreaVal,
          Built_upArea: builtUpAreaVal,
          PropertyAge: propertyAgeMapped,
          Facing: formData.propertyCommonDetails?.facing || null,
          AvailableForm: availableFormDate,
          Area_Unit: formData.propertyCommonDetails?.area_unit || "Sq.ft",
        },

        ResidentialDetails:
          formData.propertyType === "Residential"
            ? {
                Bedrooms: bedroomsMapped,
                Bathrooms: formData.residentialDetails?.bathrooms ? Number(formData.residentialDetails.bathrooms) : null,
                Balconies: formData.residentialDetails?.balconies ? Number(formData.residentialDetails.balconies) : null,
                Furnishing: formData.residentialDetails?.furnishing || null,
                FloorNo: formData.residentialDetails?.floorNo ? Number(formData.residentialDetails.floorNo) : null,
                TotalFloors: formData.residentialDetails?.totalFloors ? Number(formData.residentialDetails.totalFloors) : null,
                PropertyCondition: formData.residentialDetails?.propertyCondition || null,
              }
            : null,

        CommercialDetails:
          formData.propertyType === "Commercial"
            ? {
                // Active form uses camelCase "commercialType" via updateSection.
                // CommercialDetails.jsx (PascalCase) is a fallback.
                CommercialType: formData.commercialDetails?.commercialType || formData.commercialDetails?.CommercialType || null,
                Washrooms: formData.commercialDetails?.washrooms ? Number(formData.commercialDetails.washrooms) : (formData.commercialDetails?.Washrooms ? Number(formData.commercialDetails.Washrooms) : null),
                Cabins: formData.commercialDetails?.cabins ? Number(formData.commercialDetails.cabins) : (formData.commercialDetails?.Cabins ? Number(formData.commercialDetails.Cabins) : null),
                MeetingRooms: formData.commercialDetails?.meetingRooms ? Number(formData.commercialDetails.meetingRooms) : (formData.commercialDetails?.MeetingRooms ? Number(formData.commercialDetails.MeetingRooms) : null),
                Pantry: Boolean(formData.commercialDetails?.pantry ?? formData.commercialDetails?.Pantry),
                ReceptionArea: Boolean(formData.commercialDetails?.receptionArea ?? formData.commercialDetails?.ReceptionArea),
              }
            : null,

        IndustrialDetails:
          formData.propertyType === "Industrial"
            ? {
                IndustrialType: formData.industrialDetails?.industrialType || null,
                WarehouseArea: formData.industrialDetails?.warehouseArea ? Number(String(formData.industrialDetails.warehouseArea).replace(/,/g, "")) : null,
                LoadingDock: Boolean(formData.industrialDetails?.loadingDock),
                PowerSupply: formData.industrialDetails?.powerSupply || null,
                OfficeSpace: Boolean(formData.industrialDetails?.officeSpace),
                CraneFacility: Boolean(formData.industrialDetails?.craneFacility),
              }
            : null,

        PropertyAmenities: {
          ...formData.amenities,
        },

        PropertyImage: allImageIds,
        CoverImage: allImageIds.length > 0 ? allImageIds[0] : null,

        Owner: currentUser.id,
      };

      console.log(
        "======================================"
      );
      console.log("FINAL PROPERTY DATA:");
      console.log(
        JSON.stringify(propertyData, null, 2)
      );
      console.log(
        "======================================"
      );

      // ----------------------------------------------
      // SUBMIT (CREATE OR UPDATE)
      // ----------------------------------------------

      let result;
      if (mode === "edit" && propertyId) {
        result = await updateProperty(
          propertyId,
          propertyData,
          token
        );
      } else {
        result = await createProperty(
          propertyData,
          token
        );
      }

      console.log("PROPERTY SUBMIT RESULT:", result);

      if (result) {
        if (mode === "edit") {
          alert("Property Updated Successfully!");
          if (onCancel) onCancel(); // Redirect back to property detail page
        } else {
          alert("Property Added Successfully!");
          clearStateFromDB();
          setFormData({
            ...initialFormData,
          });
          setStep(1);
        }
      } else {
        alert(mode === "edit" ? "Property update failed." : "Property creation failed.");
      }
    } catch (error) {
      console.error(
        "PROPERTY SUBMIT ERROR:",
        error
      );

      alert(
        error?.message ||
          "Something went wrong while creating property."
      );
    } finally {
      setSaving(false);
    }
  }

  // ----------------------------------------------------
  // SELECTED AMENITIES
  // ----------------------------------------------------

  const selectedAmenities = Object.entries(
    formData.amenities
  )
    .filter(([, value]) => value)
    .map(([key]) => key);

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------

  return (
    <>
      <div className="property-page">
        <div className="property-container">

          {/* HEADER */}

          <div className="property-header">
            <div>
              <div className="brand-small">
                HOMEHUB
              </div>

              <h1>Post Your Property</h1>

              <p>
                Tell us about your property and reach
                the right buyers and tenants.
              </p>
            </div>

            <div className="step-count">
              Step {step} of {totalSteps}
            </div>
          </div>

          {/* PROGRESS */}

          <div className="progress-wrapper">
            <div className="progress-line">
              <div
                className="progress-active"
                style={{
                  width: `${
                    ((step - 1) /
                      (totalSteps - 1)) *
                    100
                  }%`,
                }}
              />
            </div>

            <div className="progress-steps">
              {[
                "Purpose",
                "Property",
                "Details",
                "Location",
                "Amenities",
                "Photos",
                "Review",
              ].map((item, index) => (
                <div
                  key={item}
                  className={`progress-item ${
                    step >= index + 1
                      ? "active"
                      : ""
                  }`}
                >
                  <span>{index + 1}</span>
                  <small>{item}</small>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CARD */}

          <div className="form-card">

            {/* =========================================
                STEP 1 — PURPOSE
            ========================================= */}

            {step === 1 && (
              <div className="step-content">

                <div className="section-heading">
                  <span>01</span>

                  <div>
                    <h2>
                      What do you want to do?
                    </h2>

                    <p>
                      Choose how you want to list
                      your property.
                    </p>
                  </div>
                </div>

                <div className="purpose-grid">

                  {[
                    {
                      value: "Sale",
                      icon: "⌂",
                      title: "Sell",
                      text: "Sell your property",
                    },
                    {
                      value: "Rent",
                      icon: "↗",
                      title: "Rent",
                      text: "Rent out your property",
                    },
                    {
                      value: "PG",
                      icon: "♟",
                      title: "PG / Co-living",
                      text: "Offer PG or co-living",
                    },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() =>
                        selectPurpose(
                          item.value
                        )
                      }
                      className={`purpose-card ${
                        formData.purpose ===
                        item.value
                          ? "selected"
                          : ""
                      }`}
                    >
                      <div className="purpose-icon">
                        {item.icon}
                      </div>

                      <strong>
                        {item.title}
                      </strong>

                      <span>
                        {item.text}
                      </span>

                      {formData.purpose ===
                        item.value && (
                        <div className="selected-check">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================
                STEP 2 — PROPERTY TYPE + CATEGORY
            ========================================= */}

            {step === 2 && (
              <div className="step-content">

                <div className="section-heading">
                  <span>02</span>

                  <div>
                    <h2>
                      What type of property is it?
                    </h2>

                    <p>
                      Select the property type and then
                      choose its category.
                    </p>
                  </div>
                </div>

                <label className="field-label">
                  Property Type
                </label>

                <div className="type-grid">

                  {[
                    {
                      value: "Residential",
                      icon: "⌂",
                      text: "Homes & Apartments",
                    },
                    {
                      value: "Commercial",
                      icon: "▦",
                      text: "Office & Shops",
                    },
                    {
                      value: "Industrial",
                      icon: "▥",
                      text: "Factory & Industrial",
                    },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() =>
                        selectPropertyType(
                          item.value
                        )
                      }
                      className={`type-card ${
                        formData.propertyType ===
                        item.value
                          ? "selected"
                          : ""
                      }`}
                    >
                      <div className="type-icon">
                        {item.icon}
                      </div>

                      <strong>
                        {item.value}
                      </strong>

                      <span>
                        {item.text}
                      </span>

                      {formData.propertyType ===
                        item.value && (
                        <div className="selected-check">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {formData.propertyType && (
                  <div className="category-section">

                    <label className="field-label">
                      {formData.propertyType} Category
                    </label>

                    <div className="category-grid">

                      {categories.map(
                        (category) => (
                          <button
                            type="button"
                            key={category}
                            onClick={() =>
                              updateField(
                                "category",
                                category
                              )
                            }
                            className={`category-card ${
                              formData.category ===
                              category
                                ? "selected"
                                : ""
                            }`}
                          >
                            {category}

                            {formData.category ===
                              category && (
                              <span>
                                ✓
                              </span>
                            )}
                          </button>
                        )
                      )}

                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================================
                STEP 3 — DETAILS
            ========================================= */}

            {step === 3 && (
              <div className="step-content">

                <div className="section-heading">
                  <span>03</span>

                  <div>
                    <h2>
                      Property Details
                    </h2>

                    <p>
                      Add the important information
                      about your property.
                    </p>
                  </div>
                </div>

                <div className="form-grid">

                  <div className="field full">
                    <label>
                      Property Title
                    </label>

                    <input
                      value={formData.title}
                      onChange={(e) =>
                        updateField(
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Spacious 2 BHK Apartment"
                    />
                  </div>

                  <div className="field full">
                    <label>
                      Description
                    </label>

                    <textarea
                      value={
                        formData.description
                      }
                      onChange={(e) =>
                        updateField(
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe your property..."
                      rows={5}
                    />
                  </div>

                  <div className="field">
                    <label>Price</label>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.price}
                      onChange={(e) =>
                        updateField(
                          "price",
                          e.target.value
                        )
                      }
                      placeholder="Enter price"
                    />
                  </div>

                  <div className="field">
                    <label>Price Unit</label>

                    <select
                      value={
                        formData.priceUnits
                      }
                      onChange={(e) =>
                        updateField(
                          "priceUnits",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select unit
                      </option>

                      <option value="Lakh">
                        Lakh
                      </option>

                      <option value="Cr">
                        Crore
                      </option>

                      <option value="/month">
                        Monthly
                      </option>
                    </select>
                  </div>

                  <div className="field">
                    <label>
                      Carpet Area
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        formData
                          .propertyCommonDetails
                          .carpetArea
                      }
                      onChange={(e) =>
                        updateSection(
                          "propertyCommonDetails",
                          "carpetArea",
                          e.target.value
                        )
                      }
                      placeholder="e.g. 1200"
                    />
                  </div>

                  <div className="field">
                    <label>
                      Built-up Area
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        formData
                          .propertyCommonDetails
                          .built_upArea
                      }
                      onChange={(e) =>
                        updateSection(
                          "propertyCommonDetails",
                          "built_upArea",
                          e.target.value
                        )
                      }
                      placeholder="e.g. 1350"
                    />
                  </div>

                  <div className="field">
                    <label>
                      Property Age
                    </label>

                    <select
                      value={
                        formData
                          .propertyCommonDetails
                          .propertyAge
                      }
                      onChange={(e) =>
                        updateSection(
                          "propertyCommonDetails",
                          "propertyAge",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select age
                      </option>
                      <option value="New ">
                        New
                      </option>
                      <option value="Years 0-1">
                        0–1 Years
                      </option>
                      <option value="Years 1-5">
                        1–5 Years
                      </option>
                      <option value="Years 5-10">
                        5–10 Years
                      </option>
                      <option value="Years 10+">
                        10+ Years
                      </option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Facing</label>

                    <select
                      value={
                        formData
                          .propertyCommonDetails
                          .facing
                      }
                      onChange={(e) =>
                        updateSection(
                          "propertyCommonDetails",
                          "facing",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select facing
                      </option>
                      <option>
                        East
                      </option>
                      <option>
                        West
                      </option>
                      <option>
                        North
                      </option>
                      <option>
                        South
                      </option>
                      <option>
                        North-East
                      </option>
                      <option>
                        North-West
                      </option>
                      <option>
                        South-East
                      </option>
                      <option>
                        South-West
                      </option>
                    </select>
                  </div>

                  {/* RESIDENTIAL */}

                  {formData.propertyType ===
                    "Residential" && (
                    <>
                      <div className="sub-heading full">
                        Residential Details
                      </div>

                      <div className="field">
                        <label>
                          Bedrooms
                        </label>

                        <select
                          value={
                            formData
                              .residentialDetails
                              .bedrooms
                          }
                          onChange={(e) =>
                            updateSection(
                              "residentialDetails",
                              "bedrooms",
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select
                          </option>

                          <option value="BHK 1">
                            1 BHK
                          </option>

                          <option value="BHK 2">
                            2 BHK
                          </option>

                          <option value="BHK 3">
                            3 BHK
                          </option>

                          <option value="BHK 4">
                            4 BHK
                          </option>

                          <option value="BHK 5+">
                            5+ BHK
                          </option>
                        </select>
                      </div>

                      <div className="field">
                        <label>
                          Bathrooms
                        </label>

                        <input
                          type="number"
                          value={
                            formData
                              .residentialDetails
                              .bathrooms
                          }
                          onChange={(e) =>
                            updateSection(
                              "residentialDetails",
                              "bathrooms",
                              e.target.value
                            )
                          }
                          placeholder="Bathrooms"
                        />
                      </div>

                      <div className="field">
                        <label>
                          Balconies
                        </label>

                        <input
                          type="number"
                          value={
                            formData
                              .residentialDetails
                              .balconies
                          }
                          onChange={(e) =>
                            updateSection(
                              "residentialDetails",
                              "balconies",
                              e.target.value
                            )
                          }
                          placeholder="Balconies"
                        />
                      </div>

                      <div className="field">
                        <label>
                          Furnishing
                        </label>

                        <select
                          value={
                            formData
                              .residentialDetails
                              .furnishing
                          }
                          onChange={(e) =>
                            updateSection(
                              "residentialDetails",
                              "furnishing",
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select furnishing
                          </option>

                          <option>
                            Unfurnished
                          </option>

                          <option>
                            Semi Furnished
                          </option>

                          <option>
                            Fully Furnished
                          </option>
                        </select>
                      </div>

                      <div className="field">
                        <label>
                          Floor No.
                        </label>

                        <input
                          type="number"
                          value={
                            formData
                              .residentialDetails
                              .floorNo
                          }
                          onChange={(e) =>
                            updateSection(
                              "residentialDetails",
                              "floorNo",
                              e.target.value
                            )
                          }
                          placeholder="Floor"
                        />
                      </div>

                      <div className="field">
                        <label>
                          Total Floors
                        </label>

                        <input
                          type="number"
                          value={
                            formData
                              .residentialDetails
                              .totalFloors
                          }
                          onChange={(e) =>
                            updateSection(
                              "residentialDetails",
                              "totalFloors",
                              e.target.value
                            )
                          }
                          placeholder="Total floors"
                        />
                      </div>
                    </>
                  )}

                  {/* COMMERCIAL */}

                  {formData.propertyType ===
                    "Commercial" && (
                    <>
                      <div className="sub-heading full">
                        Commercial Details
                      </div>

                      <div className="field">
                        <label>
                          Commercial Type
                        </label>

                        <select
                          value={
                            formData
                              .commercialDetails
                              .commercialType
                          }
                          onChange={(e) =>
                            updateSection(
                              "commercialDetails",
                              "commercialType",
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select
                          </option>

                          <option value="Office">
                            Office
                          </option>

                          <option value="Shop">
                            Shop
                          </option>

                          <option value="Showroom">
                            Showroom
                          </option>

                          <option value="Co-working Space">
                            Co-working Space
                          </option>

                          <option value="Commercial Land">
                            Commercial Land
                          </option>
                        </select>
                      </div>

                      <div className="field">
                        <label>
                          Washrooms
                        </label>

                        <input
                          type="number"
                          value={
                            formData
                              .commercialDetails
                              .washrooms
                          }
                          onChange={(e) =>
                            updateSection(
                              "commercialDetails",
                              "washrooms",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="field">
                        <label>
                          Cabins
                        </label>

                        <input
                          type="number"
                          value={
                            formData
                              .commercialDetails
                              .cabins
                          }
                          onChange={(e) =>
                            updateSection(
                              "commercialDetails",
                              "cabins",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="field">
                        <label>
                          Meeting Rooms
                        </label>

                        <input
                          type="number"
                          value={
                            formData
                              .commercialDetails
                              .meetingRooms
                          }
                          onChange={(e) =>
                            updateSection(
                              "commercialDetails",
                              "meetingRooms",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </>
                  )}

                  {/* INDUSTRIAL */}

                  {formData.propertyType ===
                    "Industrial" && (
                    <>
                      <div className="sub-heading full">
                        Industrial Details
                      </div>

                      <div className="field">
                        <label>
                          Industrial Type
                        </label>

                        <select
                          value={
                            formData
                              .industrialDetails
                              .industrialType
                          }
                          onChange={(e) =>
                            updateSection(
                              "industrialDetails",
                              "industrialType",
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select
                          </option>

                          <option>
                            Factory
                          </option>

                          <option>
                            Warehouse
                          </option>

                          <option>
                            Industrial Land
                          </option>
                        </select>
                      </div>

                      <div className="field">
                        <label>
                          Warehouse Area
                        </label>

                        <input
                          type="number"
                          value={
                            formData
                              .industrialDetails
                              .warehouseArea
                          }
                          onChange={(e) =>
                            updateSection(
                              "industrialDetails",
                              "warehouseArea",
                              e.target.value
                            )
                          }
                          placeholder="Sq.ft"
                        />
                      </div>

                      <div className="field">
                        <label>
                          Power Supply
                        </label>

                        <select
                          value={
                            formData
                              .industrialDetails
                              .powerSupply
                          }
                          onChange={(e) =>
                            updateSection(
                              "industrialDetails",
                              "powerSupply",
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select
                          </option>

                          <option>
                            Single Phase
                          </option>

                          <option>
                            Three Phase
                          </option>

                          <option>
                            High Voltage
                          </option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* =========================================
                STEP 4 — LOCATION
            ========================================= */}

            {step === 4 && (
              <div className="step-content">

                <div className="section-heading">
                  <span>04</span>

                  <div>
                    <h2>
                      Where is your property?
                    </h2>

                    <p>
                      Add the exact location details.
                    </p>
                  </div>
                </div>

                <div className="form-grid">

                  <div className="field full">
                    <label>
                      Address
                    </label>

                    <input
                      value={
                        formData.address
                      }
                      onChange={(e) =>
                        updateField(
                          "address",
                          e.target.value
                        )
                      }
                      placeholder="Building, street, locality"
                    />
                  </div>

                  <div className="field">
                    <label>
                      Area / Locality
                    </label>

                    <input
                      value={formData.area}
                      onChange={(e) =>
                        updateField(
                          "area",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Baner"
                    />
                  </div>

                  <div className="field">
                    <label>
                      City
                    </label>

                    <input
                      value={formData.city}
                      onChange={(e) =>
                        updateField(
                          "city",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Pune"
                    />
                  </div>

                  <div className="field">
                    <label>
                      State
                    </label>

                    <input
                      value={formData.state}
                      onChange={(e) =>
                        updateField(
                          "state",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Maharashtra"
                    />
                  </div>

                  <div className="field">
                    <label>
                      PIN Code
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={
                        formData.pinCode
                      }
                      onChange={(e) =>
                        updateField(
                          "pinCode",
                          e.target.value
                        )
                      }
                      placeholder="411045"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================
                STEP 5 — AMENITIES
            ========================================= */}

            {step === 5 && (
              <div className="step-content">

                <div className="section-heading">
                  <span>05</span>

                  <div>
                    <h2>
                      Amenities & Facilities
                    </h2>

                    <p>
                      Select only the facilities
                      available at your property.
                    </p>
                  </div>
                </div>

                <div className="amenities-grid">

                  {[
                    [
                      "Parking",
                      "Dedicated parking",
                    ],
                    [
                      "Lift",
                      "Lift facility",
                    ],
                    [
                      "Security",
                      "24×7 security",
                    ],
                    [
                      "CCTV",
                      "CCTV surveillance",
                    ],
                    [
                      "PowerBackup",
                      "Power backup",
                    ],
                    [
                      "Gym",
                      "Fitness centre",
                    ],
                    [
                      "SwimmingPool",
                      "Swimming pool",
                    ],
                    [
                      "Garden",
                      "Garden / green area",
                    ],
                  ].map(
                    ([key, description]) => (
                      <label
                        key={key}
                        className={`amenity-card ${
                          formData
                            .amenities[key]
                            ? "selected"
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={
                            formData
                              .amenities[key]
                          }
                          onChange={() =>
                            toggleAmenity(
                              key
                            )
                          }
                        />

                        <div className="amenity-check">
                          {formData
                            .amenities[key]
                            ? "✓"
                            : ""}
                        </div>

                        <div>
                          <strong>
                            {key ===
                            "PowerBackup"
                              ? "Power Backup"
                              : key ===
                                "SwimmingPool"
                              ? "Swimming Pool"
                              : key}
                          </strong>

                          <span>
                            {description}
                          </span>
                        </div>
                      </label>
                    )
                  )}
                </div>

                {selectedAmenities.length >
                  0 && (
                  <div className="selected-summary">
                    <strong>
                      {
                        selectedAmenities.length
                      }{" "}
                      facilities selected
                    </strong>

                    <span>
                      {
                        selectedAmenities.join(
                          " • "
                        )
                      }
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* =========================================
                STEP 6 — PHOTOS
            ========================================= */}

            {step === 6 && (
              <div className="step-content">

                <div className="section-heading">
                  <span>06</span>

                  <div>
                    <h2>
                      Add Property Photos
                    </h2>

                    <p>
                      Good photos help buyers
                      understand your property better.
                    </p>
                  </div>
                </div>

                <div className="upload-box">

                  <div className="upload-icon">
                    +
                  </div>

                  <h3>
                    Upload property photos
                  </h3>

                  <p>
                    Cover image and multiple property
                    images can be added here.
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      updateField(
                        "propertyImages",
                        Array.from(
                          e.target.files || []
                        )
                      )
                    }
                  />

                  {formData
                    .propertyImages.length >
                    0 && (
                    <div className="file-count">
                      {
                        formData
                          .propertyImages
                          .length
                      }{" "}
                      photos selected
                    </div>
                  )}
                </div>

                <div className="photo-note">
                  <strong>Tip:</strong> Add bright
                  photos of the living room, bedrooms,
                  kitchen, bathrooms and exterior.
                </div>
              </div>
            )}

            {/* =========================================
                STEP 7 — REVIEW
            ========================================= */}

            {step === 7 && (
              <div className="step-content">

                <div className="section-heading">
                  <span>07</span>

                  <div>
                    <h2>
                      Review Your Property
                    </h2>

                    <p>
                      Check your information before
                      publishing.
                    </p>
                  </div>
                </div>

                <div className="review-hero">

                  <div>
                    <span className="review-badge">
                      {formData.purpose}
                    </span>

                    <h2>
                      {formData.title ||
                        "Your Property Title"}
                    </h2>

                    <p>
                      {formData.area ||
                        "Locality"}
                      ,{" "}
                      {formData.city ||
                        "City"}
                    </p>
                  </div>

                  <div className="review-price">
                    ₹{" "}
                    {formData.price
                      ? Number(
                          formData.price
                        ).toLocaleString(
                          "en-IN"
                        )
                      : "—"}
                  </div>
                </div>

                <div className="review-stats">

                  <div>
                    <span>
                      Property
                    </span>

                    <strong>
                      {formData.propertyType ||
                        "—"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Category
                    </span>

                    <strong>
                      {formData.category ||
                        "—"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Area
                    </span>

                    <strong>
                      {formData
                        .propertyCommonDetails
                        .carpetArea ||
                        "—"}{" "}
                      Sq.ft
                    </strong>
                  </div>

                  {formData.propertyType ===
                    "Residential" && (
                    <>
                      <div>
                        <span>
                          Bedrooms
                        </span>

                        <strong>
                          {formData
                            .residentialDetails
                            .bedrooms ||
                            "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Bathrooms
                        </span>

                        <strong>
                          {formData
                            .residentialDetails
                            .bathrooms ||
                            "—"}
                        </strong>
                      </div>
                    </>
                  )}
                </div>

                <div className="review-section">

                  <h3>
                    Property Description
                  </h3>

                  <p>
                    {formData.description ||
                      "No description added."}
                  </p>
                </div>

                <div className="review-section">

                  <h3>
                    Location
                  </h3>

                  <div className="review-details">

                    <div>
                      <span>
                        Address
                      </span>

                      <strong>
                        {formData.address ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Locality
                      </span>

                      <strong>
                        {formData.area ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        City
                      </span>

                      <strong>
                        {formData.city ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        State
                      </span>

                      <strong>
                        {formData.state ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        PIN Code
                      </span>

                      <strong>
                        {formData.pinCode ||
                          "—"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="review-section">

                  <div className="review-title-row">
                    <h3>
                      Amenities & Facilities
                    </h3>

                    <span>
                      {
                        selectedAmenities.length
                      }{" "}
                      selected
                    </span>
                  </div>

                  <div className="review-amenities">

                    {selectedAmenities.length >
                    0 ? (
                      selectedAmenities.map(
                        (item) => (
                          <div key={item}>
                            ✓ {item}
                          </div>
                        )
                      )
                    ) : (
                      <p>
                        No amenities selected.
                      </p>
                    )}
                  </div>
                </div>

                <details className="more-details">

                  <summary>
                    View More Property Details
                    <span>+</span>
                  </summary>

                  <div className="more-details-content">

                    <div>
                      <span>
                        Purpose
                      </span>

                      <strong>
                        {formData.purpose}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Property Type
                      </span>

                      <strong>
                        {formData.propertyType}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Category
                      </span>

                      <strong>
                        {formData.category}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Built-up Area
                      </span>

                      <strong>
                        {formData
                          .propertyCommonDetails
                          .built_upArea ||
                          "—"}{" "}
                        Sq.ft
                      </strong>
                    </div>

                    <div>
                      <span>
                        Property Age
                      </span>

                      <strong>
                        {formData
                          .propertyCommonDetails
                          .propertyAge ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Facing
                      </span>

                      <strong>
                        {formData
                          .propertyCommonDetails
                          .facing ||
                          "—"}
                      </strong>
                    </div>

                    {formData.propertyType ===
                      "Residential" && (
                      <>
                        <div>
                          <span>
                            Balconies
                          </span>

                          <strong>
                            {formData
                              .residentialDetails
                              .balconies ||
                              "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Furnishing
                          </span>

                          <strong>
                            {formData
                              .residentialDetails
                              .furnishing ||
                              "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Floor
                          </span>

                          <strong>
                            {formData
                              .residentialDetails
                              .floorNo ||
                              "—"}{" "}
                            /{" "}
                            {formData
                              .residentialDetails
                              .totalFloors ||
                              "—"}
                          </strong>
                        </div>
                      </>
                    )}
                  </div>
                </details>
              </div>
            )}

            {/* =========================================
                NAVIGATION
            ========================================= */}

            <div className="form-actions">

              <button
                type="button"
                onClick={previousStep}
                disabled={step === 1}
                className="back-button"
              >
                ← Back
              </button>

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="continue-button"
                >
                  Continue
                  <span>→</span>
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  {mode === "edit" && onCancel && (
                    <button
                      type="button"
                      onClick={onCancel}
                      disabled={saving}
                      className="back-button"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="continue-button"
                  >
                    {saving
                      ? mode === "edit" ? "Saving..." : "Publishing..."
                      : mode === "edit" ? "Save Changes" : "Publish Property"}

                    <span>→</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          CSS
      ================================================== */}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        /* ── PAGE ───────────────────────────────────── */

        .property-page {
          min-height: 100vh;
          padding: 48px 20px 96px;
          background: var(--bg-page);
          transition: background 0.3s ease;
        }

        .property-container {
          width: 100%;
          max-width: 1040px;
          margin: auto;
        }

        /* ── HEADER ─────────────────────────────────── */

        .property-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
          gap: 16px;
        }

        .brand-small {
          color: var(--text-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .property-header h1 {
          margin: 0;
          color: var(--text-primary);
          font-size: clamp(26px, 5vw, 40px);
          font-weight: 800;
          letter-spacing: -1.2px;
          line-height: 1.1;
        }

        .property-header p {
          margin: 8px 0 0;
          color: var(--text-muted);
          font-size: 15px;
          line-height: 1.5;
        }

        .step-count {
          flex-shrink: 0;
          color: var(--text-muted);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          padding: 9px 16px;
          border-radius: 40px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        /* ── PROGRESS ───────────────────────────────── */

        .progress-wrapper {
          margin-bottom: 24px;
        }

        .progress-line {
          height: 3px;
          background: var(--border-subtle);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-active {
          height: 100%;
          background: var(--text-primary);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .progress-steps {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-top: -14px;
        }

        .progress-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          color: var(--text-muted);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.3px;
          transition: color 0.2s;
        }

        .progress-item span {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--bg-card);
          border: 2px solid var(--border-subtle);
          font-size: 11px;
          font-weight: 800;
          transition: all 0.2s;
        }

        .progress-item.active {
          color: var(--text-primary);
        }

        .progress-item.active span {
          background: var(--text-primary);
          border-color: var(--text-primary);
          color: var(--bg-page);
        }

        /* ── FORM CARD ──────────────────────────────── */

        .form-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 24px;
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .step-content {
          padding: 44px;
          min-height: 520px;
        }

        /* ── SECTION HEADING ────────────────────────── */

        .section-heading {
          display: flex;
          gap: 16px;
          margin-bottom: 36px;
          align-items: flex-start;
        }

        .section-heading > span {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--text-primary);
          color: var(--bg-page);
          font-size: 12px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .section-heading h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .section-heading p {
          margin: 6px 0 0;
          color: var(--text-muted);
          font-size: 14px;
          line-height: 1.5;
        }

        /* ── PURPOSE & TYPE CARDS ───────────────────── */

        .purpose-grid,
        .type-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .purpose-card,
        .type-card {
          position: relative;
          text-align: left;
          padding: 24px;
          border: 1.5px solid var(--border-subtle);
          background: var(--bg-card);
          border-radius: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .purpose-card:hover,
        .type-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .purpose-card.selected,
        .type-card.selected {
          background: var(--text-primary);
          border-color: var(--text-primary);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
          transform: translateY(-2px);
        }

        .purpose-icon,
        .type-icon {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: var(--bg-card-hover);
          color: var(--text-primary);
          font-size: 20px;
          margin-bottom: 18px;
          border: 1px solid var(--border-subtle);
          transition: all 0.2s;
        }

        .purpose-card strong,
        .type-card strong {
          display: block;
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .purpose-card span,
        .type-card span {
          color: var(--text-muted);
          font-size: 13px;
        }

        .purpose-card.selected strong,
        .type-card.selected strong {
          color: var(--bg-page);
        }

        .purpose-card.selected > span,
        .type-card.selected > span {
          color: rgba(255, 255, 255, 0.55);
        }

        .purpose-card.selected .purpose-icon,
        .type-card.selected .type-icon {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.15);
          color: var(--bg-page);
        }

        .selected-check {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          color: var(--bg-page);
          font-size: 12px;
          font-weight: 800;
        }

        /* ── FIELD LABEL ────────────────────────────── */

        .field-label {
          display: block;
          margin-bottom: 12px;
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        /* ── CATEGORY ───────────────────────────────── */

        .category-section {
          margin-top: 32px;
        }

        .category-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .category-card {
          border: 1.5px solid var(--border-subtle);
          background: var(--bg-card);
          color: var(--text-primary);
          padding: 11px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-card:hover {
          border-color: var(--border-hover);
          background: var(--bg-card-hover);
        }

        .category-card.selected {
          background: var(--text-primary);
          color: var(--bg-page);
          border-color: var(--text-primary);
        }

        .category-card span {
          margin-left: 7px;
          opacity: 0.7;
        }

        /* ── FORM GRID ──────────────────────────────── */

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field.full,
        .sub-heading.full {
          grid-column: 1 / -1;
        }

        .field label {
          color: var(--text-primary);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          border: 1.5px solid var(--border-subtle);
          background: var(--bg-card);
          color: var(--text-primary);
          border-radius: 11px;
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
          appearance: none;
        }

        .field textarea {
          resize: vertical;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: var(--text-primary);
          box-shadow: 0 0 0 3px var(--border-subtle);
        }

        .field input::placeholder,
        .field textarea::placeholder {
          color: var(--text-muted);
          opacity: 0.6;
        }

        .sub-heading {
          margin-top: 16px;
          padding-top: 22px;
          border-top: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.2px;
        }

        /* ── AMENITIES ──────────────────────────────── */

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .amenity-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          border: 1.5px solid var(--border-subtle);
          border-radius: 14px;
          background: var(--bg-card);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .amenity-card:hover {
          border-color: var(--border-hover);
          background: var(--bg-card-hover);
        }

        .amenity-card.selected {
          border-color: var(--text-primary);
          background: var(--bg-card-hover);
        }

        .amenity-card input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .amenity-check {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          border: 1.5px solid var(--border-subtle);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--bg-page);
          font-size: 12px;
          font-weight: 800;
          transition: all 0.2s;
        }

        .amenity-card.selected .amenity-check {
          background: var(--text-primary);
          border-color: var(--text-primary);
        }

        .amenity-card strong {
          display: block;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 700;
        }

        .amenity-card span {
          display: block;
          margin-top: 2px;
          color: var(--text-muted);
          font-size: 12px;
        }

        .selected-summary {
          margin-top: 20px;
          padding: 14px 18px;
          border-radius: 12px;
          background: var(--bg-card-hover);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
        }

        .selected-summary strong {
          display: block;
          font-size: 13px;
          font-weight: 700;
        }

        .selected-summary span {
          display: block;
          margin-top: 4px;
          color: var(--text-muted);
          font-size: 12px;
        }

        /* ── UPLOAD ─────────────────────────────────── */

        .upload-box {
          position: relative;
          text-align: center;
          padding: 56px 30px;
          border: 2px dashed var(--border-subtle);
          border-radius: 18px;
          background: var(--bg-card);
          transition: border-color 0.2s;
        }

        .upload-box:hover {
          border-color: var(--border-hover);
        }

        .upload-icon {
          width: 54px;
          height: 54px;
          margin: 0 auto 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: var(--text-primary);
          color: var(--bg-page);
          font-size: 26px;
        }

        .upload-box h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 17px;
          font-weight: 700;
        }

        .upload-box p {
          color: var(--text-muted);
          font-size: 13px;
          margin: 6px 0 0;
        }

        .upload-box input {
          margin-top: 16px;
          color: var(--text-muted);
          font-size: 13px;
        }

        .file-count {
          margin-top: 14px;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 13px;
        }

        .photo-note {
          margin-top: 14px;
          padding: 14px 16px;
          background: var(--bg-card-hover);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          color: var(--text-muted);
          font-size: 13px;
          line-height: 1.5;
        }

        /* ── REVIEW ─────────────────────────────────── */

        .review-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 32px;
          border-radius: 18px;
          background: var(--text-primary);
          color: var(--bg-page);
        }

        .review-badge {
          display: inline-block;
          padding: 5px 11px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.13);
          color: rgba(255, 255, 255, 0.85);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 10px;
        }

        .review-hero h2 {
          margin: 0 0 4px;
          font-size: 22px;
          font-weight: 800;
          color: var(--bg-page);
        }

        .review-hero p {
          margin: 0;
          color: rgba(255, 255, 255, 0.55);
          font-size: 13px;
        }

        .review-price {
          color: rgba(255, 255, 255, 0.9);
          font-size: 26px;
          font-weight: 800;
          flex-shrink: 0;
          text-align: right;
        }

        .review-stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          margin-top: 16px;
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          overflow: hidden;
        }

        .review-stats div {
          padding: 16px;
          border-right: 1px solid var(--border-subtle);
        }

        .review-stats div:last-child {
          border-right: 0;
        }

        .review-stats span,
        .review-details span,
        .more-details-content span {
          display: block;
          color: var(--text-muted);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }

        .review-stats strong {
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 700;
        }

        .review-section {
          margin-top: 16px;
          padding: 22px;
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          background: var(--bg-card);
        }

        .review-section h3 {
          margin: 0 0 12px;
          color: var(--text-primary);
          font-size: 15px;
          font-weight: 700;
        }

        .review-section p {
          margin: 0;
          color: var(--text-muted);
          line-height: 1.7;
          font-size: 13px;
        }

        .review-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .review-details strong {
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 700;
        }

        .review-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .review-title-row span {
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .review-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .review-amenities div {
          padding: 8px 12px;
          border-radius: 8px;
          background: var(--bg-card-hover);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-size: 12px;
          font-weight: 700;
        }

        .more-details {
          margin-top: 16px;
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          overflow: hidden;
        }

        .more-details summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          cursor: pointer;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 14px;
          background: var(--bg-card);
          transition: background 0.15s;
          list-style: none;
        }

        .more-details summary::-webkit-details-marker {
          display: none;
        }

        .more-details summary:hover {
          background: var(--bg-card-hover);
        }

        .more-details summary span {
          font-size: 18px;
          color: var(--text-muted);
        }

        .more-details-content {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 18px 20px;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-card);
        }

        .more-details-content strong {
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 700;
        }

        /* ── NAVIGATION BAR ─────────────────────────── */

        .form-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 44px;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-card);
        }

        .back-button {
          border: 0;
          background: transparent;
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          padding: 10px 14px;
          border-radius: 10px;
          transition: background 0.15s, color 0.15s;
        }

        .back-button:hover:not(:disabled) {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .back-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .continue-button {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 0;
          border-radius: 12px;
          padding: 13px 24px;
          background: var(--text-primary);
          color: var(--bg-page);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          letter-spacing: 0.2px;
        }

        .continue-button:hover:not(:disabled) {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        .continue-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* ── RESPONSIVE ─────────────────────────────── */

        @media (max-width: 800px) {
          .property-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .step-count {
            align-self: flex-start;
          }

          .step-content {
            padding: 28px 22px;
          }

          .purpose-grid,
          .type-grid,
          .amenities-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .review-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .review-stats div {
            border-right: 0;
            border-bottom: 1px solid var(--border-subtle);
          }

          .review-hero {
            display: block;
          }

          .review-price {
            margin-top: 14px;
            text-align: left;
          }

          .more-details-content {
            grid-template-columns: 1fr 1fr;
          }

          .form-actions {
            padding: 16px 22px;
          }
        }

        @media (max-width: 520px) {
          .property-page {
            padding: 24px 12px 56px;
          }

          .property-header h1 {
            font-size: 26px;
          }

          .progress-item small {
            display: none;
          }

          .form-card {
            border-radius: 18px;
          }

          .step-content {
            padding: 22px 16px;
          }

          .review-stats,
          .review-details,
          .more-details-content {
            grid-template-columns: 1fr;
          }

          .review-stats div {
            border-bottom: 1px solid var(--border-subtle);
          }

          .purpose-grid,
          .type-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            padding: 14px 16px;
          }
        }
      `}</style>
      {showLoginModal && <RoleSelectionModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}