// "use client";

// import { useEffect, useState } from "react";
// import {
//   Settings,
//   Home,
//   Bell,
//   Shield,
//   Globe,
//   IndianRupee,
//   Moon,
//   Search,
//   Eye,
//   Phone,
//   Mail,
//   UserRound,
// } from "lucide-react";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// const API_URL = `${STRAPI_URL}/api`;

// export default function UserSettingsPage() {
//   const [settings, setSettings] = useState({
//     language: "English",
//     currency: "INR",
//     darkMode: false,
//     saveSearchHistory: true,
//     showRecentlyViewed: true,

//     propertyType: "Apartment",
//     purpose: "Buy",
//     preferredCity: "",
//     preferredArea: "",
//     preferredCategory: "Residential",
//     minimumBudget: "",
//     maximumBudget: "",

//     emailNotifications: true,
//     propertyAlerts: true,
//     newPropertyAlerts: true,
//     enquiryUpdates: true,
//     marketingNotifications: false,

//     profileVisibility: true,
//     phoneNumber: false,
//     emailAddress: false,
//     ownerContact: true,
//   });

//   const [profileDocumentId, setProfileDocumentId] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   // =========================================================
//   // LOAD USER PROFILE FROM STRAPI
//   // =========================================================

//   useEffect(() => {
//     const loadUserSettings = async () => {
//       try {
//         setLoading(true);
//         setErrorMessage("");

//         const token = localStorage.getItem("token");

//         if (!token) {
//           setErrorMessage("Please login first.");
//           setLoading(false);
//           return;
//         }

//         // First get currently logged-in user
//         const userResponse = await fetch(`${API_URL}/users/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!userResponse.ok) {
//           throw new Error("Unable to get logged-in user.");
//         }

//         const currentUser = await userResponse.json();

//         // Get User Profile belonging to logged-in user
//         const profileQuery =
//           `${API_URL}/user-profiles?` +
//           `filters[users_permissions_user][id][$eq]=${currentUser.id}` +
//           `&populate=*`;

//         const profileResponse = await fetch(profileQuery, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!profileResponse.ok) {
//           throw new Error("Unable to load user profile.");
//         }

//         const profileResult = await profileResponse.json();

//         const profile = profileResult?.data?.[0];

//         if (!profile) {
//           setErrorMessage(
//             "User Profile not found. Please create a User Profile in Strapi first.",
//           );
//           setLoading(false);
//           return;
//         }

//         // Strapi v5
//         setProfileDocumentId(profile.documentId);

//         const userSettings = profile.UserSettings || {};
//         const propertyPreferences = profile.PropertyPreferences || {};
//         const notificationPreferences = profile.NotificationPreferences || {};
//         const privacySettings = profile.PrivacySettings || {};

//         setSettings({
//           language: userSettings.Language || "English",
//           currency: userSettings.Currency || "INR",
//           darkMode: Boolean(userSettings.DarkMode),
//           saveSearchHistory: Boolean(userSettings.SaveSearchHistory),
//           showRecentlyViewed: Boolean(userSettings.ShowRecentlyViewed),

//           propertyType: propertyPreferences.PropertyType || "Apartment",
//           purpose: propertyPreferences.Purpose || "Buy",
//           preferredCity: propertyPreferences.PreferredCity || "",
//           preferredArea: propertyPreferences.PreferredArea || "",
//           preferredCategory:
//             propertyPreferences.PreferredCategory || "Residential",
//           minimumBudget:
//             propertyPreferences.MinimumBudget !== null &&
//             propertyPreferences.MinimumBudget !== undefined
//               ? String(propertyPreferences.MinimumBudget)
//               : "",
//           maximumBudget:
//             propertyPreferences.MaximumBudget !== null &&
//             propertyPreferences.MaximumBudget !== undefined
//               ? String(propertyPreferences.MaximumBudget)
//               : "",

//           emailNotifications:
//             notificationPreferences.EmailNotifications ?? true,

//           propertyAlerts: notificationPreferences.PropertyAlerts ?? true,

//           newPropertyAlerts: notificationPreferences.NewPropertyAlerts ?? true,

//           enquiryUpdates: Boolean(notificationPreferences.EnquiryUpdates),

//           marketingNotifications:
//             notificationPreferences.MarketingNotifications ?? false,

//           profileVisibility: privacySettings.ProfileVisibility ?? true,

//           phoneNumber: privacySettings.PhoneNumber ?? false,

//           emailAddress: privacySettings.EmailAddress ?? false,

//           ownerContact: privacySettings.OwnerContact ?? true,
//         });
//       } catch (error) {
//         console.error("Load User Settings Error:", error);

//         setErrorMessage(error.message || "Failed to load user settings.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUserSettings();
//   }, []);

//   // =========================================================
//   // HANDLE CHANGE
//   // =========================================================

//   const handleChange = (field, value) => {
//     setSettings((previous) => ({
//       ...previous,
//       [field]: value,
//     }));

//     // Remove old messages when user changes something
//     setSuccessMessage("");
//     setErrorMessage("");
//   };

//   // =========================================================
//   // SAVE SETTINGS TO STRAPI
//   // =========================================================

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       setSuccessMessage("");
//       setErrorMessage("");

//       const token = localStorage.getItem("token");

//       if (!token) {
//         setErrorMessage("Please login first.");
//         return;
//       }

//       if (!profileDocumentId) {
//         setErrorMessage("User Profile not found. Cannot save settings.");
//         return;
//       }

//       const payload = {
//         data: {
//           UserSettings: {
//             Language: settings.language,
//             Currency: settings.currency,
//             DarkMode: settings.darkMode,
//             SaveSearchHistory: settings.saveSearchHistory,
//             ShowRecentlyViewed: settings.showRecentlyViewed,
//           },

//           PropertyPreferences: {
//             PropertyType: settings.propertyType,
//             Purpose: settings.purpose,
//             PreferredCity: settings.preferredCity,
//             PreferredArea: settings.preferredArea,
//             PreferredCategory: settings.preferredCategory,
//             MinimumBudget:
//               settings.minimumBudget === ""
//                 ? null
//                 : Number(settings.minimumBudget),
//             MaximumBudget:
//               settings.maximumBudget === ""
//                 ? null
//                 : Number(settings.maximumBudget),
//           },

//           NotificationPreferences: {
//             EmailNotifications: settings.emailNotifications,
//             PropertyAlerts: settings.propertyAlerts,
//             NewPropertyAlerts: settings.newPropertyAlerts,

//             // Strapi मध्ये हा field सध्या Text आहे
//             EnquiryUpdates: Boolean(settings.enquiryUpdates),

//             MarketingNotifications: settings.marketingNotifications,
//           },

//           PrivacySettings: {
//             ProfileVisibility: settings.profileVisibility,
//             PhoneNumber: settings.phoneNumber,
//             EmailAddress: settings.emailAddress,
//             OwnerContact: settings.ownerContact,
//           },
//         },
//       };

//       const response = await fetch(
//         `${API_URL}/user-profiles/${profileDocumentId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         console.error("Strapi Save Error:", result);

//         throw new Error(result?.error?.message || "Failed to save settings.");
//       }

//       setSuccessMessage("Settings saved successfully.");

//       // Message 3 seconds नंतर remove
//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 3000);
//     } catch (error) {
//       console.error("Save Settings Error:", error);

//       setErrorMessage(error.message || "Failed to save settings.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =========================================================
//   // LOADING SCREEN
//   // =========================================================

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-5xl">
//           <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
//             <p className="text-gray-600">Loading your settings...</p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // =========================================================
//   // PAGE
//   // =========================================================

//   return (
//     <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-5xl">
//         {/* PAGE HEADER */}

//         <div className="mb-8">
//           <div className="flex items-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
//               <Settings className="text-blue-600" size={24} />
//             </div>

//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

//               <p className="mt-1 text-gray-600">
//                 Manage your account preferences and settings.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* SUCCESS MESSAGE */}

//         {successMessage && (
//           <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
//             {successMessage}
//           </div>
//         )}

//         {/* ERROR MESSAGE */}

//         {errorMessage && (
//           <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//             {errorMessage}
//           </div>
//         )}

//         {/* USER SETTINGS */}

//         <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
//           <div className="mb-6 flex items-center gap-3">
//             <div className="rounded-lg bg-blue-100 p-3">
//               <Globe className="text-blue-600" size={22} />
//             </div>

//             <div>
//               <h2 className="text-xl font-bold text-gray-900">User Settings</h2>

//               <p className="text-sm text-gray-500">
//                 Manage your language, currency and viewing preferences.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-5 sm:grid-cols-2">
//             {/* LANGUAGE */}

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Language
//               </label>

//               <select
//                 value={settings.language}
//                 onChange={(e) => handleChange("language", e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
//               >
//                 <option value="English">English</option>
//                 <option value="Hindi">Hindi</option>
//                 <option value="Marathi">Marathi</option>
//               </select>
//             </div>

//             {/* CURRENCY */}

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Currency
//               </label>

//               <div className="relative">
//                 <IndianRupee
//                   size={18}
//                   className="absolute left-3 top-3.5 text-gray-400"
//                 />

//                 <select
//                   value={settings.currency}
//                   onChange={(e) => handleChange("currency", e.target.value)}
//                   className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-600"
//                 >
//                   <option value="INR">INR - Indian Rupee</option>

//                   <option value="USD">USD - US Dollar</option>

//                   <option value="EUR">EUR - Euro</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 space-y-4">
//             <ToggleRow
//               icon={<Moon size={20} />}
//               title="Dark Mode"
//               description="Use dark theme across the application."
//               checked={settings.darkMode}
//               onChange={(value) => handleChange("darkMode", value)}
//             />

//             <ToggleRow
//               icon={<Search size={20} />}
//               title="Save Search History"
//               description="Save your recent property searches."
//               checked={settings.saveSearchHistory}
//               onChange={(value) => handleChange("saveSearchHistory", value)}
//             />

//             <ToggleRow
//               icon={<Eye size={20} />}
//               title="Recently Viewed Properties"
//               description="Show properties that you recently viewed."
//               checked={settings.showRecentlyViewed}
//               onChange={(value) => handleChange("showRecentlyViewed", value)}
//             />
//           </div>
//         </section>

//         {/* PROPERTY PREFERENCES */}

//         <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
//           <div className="mb-6 flex items-center gap-3">
//             <div className="rounded-lg bg-green-100 p-3">
//               <Home className="text-green-600" size={22} />
//             </div>

//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Property Preferences
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Tell us what type of property you are looking for.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-5 sm:grid-cols-2">
//             <SelectField
//               label="Property Type"
//               value={settings.propertyType}
//               onChange={(value) => handleChange("propertyType", value)}
//               options={[
//                 "Apartment",
//                 "Villa",
//                 "Independent House",
//                 "Office",
//                 "Shop",
//               ]}
//             />

//             <SelectField
//               label="Purpose"
//               value={settings.purpose}
//               onChange={(value) => handleChange("purpose", value)}
//               options={["Buy", "Rent", "Sale", "Lease"]}
//             />

//             <InputField
//               label="Preferred City"
//               value={settings.preferredCity}
//               onChange={(value) => handleChange("preferredCity", value)}
//               placeholder="e.g. Pune"
//             />

//             <InputField
//               label="Preferred Area"
//               value={settings.preferredArea}
//               onChange={(value) => handleChange("preferredArea", value)}
//               placeholder="e.g. Wakad"
//             />

//             <InputField
//               label="Preferred Category"
//               value={settings.preferredCategory}
//               onChange={(value) => handleChange("preferredCategory", value)}
//               placeholder="e.g. Residential"
//             />

//             <InputField
//               label="Minimum Budget"
//               value={settings.minimumBudget}
//               onChange={(value) => handleChange("minimumBudget", value)}
//               placeholder="e.g. 3000000"
//               type="number"
//             />

//             <InputField
//               label="Maximum Budget"
//               value={settings.maximumBudget}
//               onChange={(value) => handleChange("maximumBudget", value)}
//               placeholder="e.g. 8000000"
//               type="number"
//             />
//           </div>
//         </section>

//         {/* NOTIFICATION PREFERENCES */}

//         <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
//           <div className="mb-6 flex items-center gap-3">
//             <div className="rounded-lg bg-orange-100 p-3">
//               <Bell className="text-orange-600" size={22} />
//             </div>

//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Notification Preferences
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Choose which notifications you want to receive.
//               </p>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <ToggleRow
//               icon={<Mail size={20} />}
//               title="Email Notifications"
//               description="Receive important updates by email."
//               checked={settings.emailNotifications}
//               onChange={(value) => handleChange("emailNotifications", value)}
//             />

//             <ToggleRow
//               icon={<Home size={20} />}
//               title="Property Alerts"
//               description="Get alerts for properties matching your preferences."
//               checked={settings.propertyAlerts}
//               onChange={(value) => handleChange("propertyAlerts", value)}
//             />

//             <ToggleRow
//               icon={<Search size={20} />}
//               title="New Property Alerts"
//               description="Get notified when new properties are listed."
//               checked={settings.newPropertyAlerts}
//               onChange={(value) => handleChange("newPropertyAlerts", value)}
//             />

//             <ToggleRow
//               icon={<Bell size={20} />}
//               title="Enquiry Updates"
//               description="Receive updates about your property enquiries."
//               checked={settings.enquiryUpdates}
//               onChange={(value) => handleChange("enquiryUpdates", value)}
//             />

//             <ToggleRow
//               icon={<Mail size={20} />}
//               title="Marketing Notifications"
//               description="Receive offers and promotional updates."
//               checked={settings.marketingNotifications}
//               onChange={(value) =>
//                 handleChange("marketingNotifications", value)
//               }
//             />
//           </div>
//         </section>

//         {/* PRIVACY SETTINGS */}

//         <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
//           <div className="mb-6 flex items-center gap-3">
//             <div className="rounded-lg bg-purple-100 p-3">
//               <Shield className="text-purple-600" size={22} />
//             </div>

//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Privacy Settings
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Control what information is visible to others.
//               </p>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <ToggleRow
//               icon={<UserRound size={20} />}
//               title="Profile Visibility"
//               description="Allow your profile to be visible."
//               checked={settings.profileVisibility}
//               onChange={(value) => handleChange("profileVisibility", value)}
//             />

//             <ToggleRow
//               icon={<Phone size={20} />}
//               title="Show Phone Number"
//               description="Allow your phone number to be visible."
//               checked={settings.phoneNumber}
//               onChange={(value) => handleChange("phoneNumber", value)}
//             />

//             <ToggleRow
//               icon={<Mail size={20} />}
//               title="Show Email Address"
//               description="Allow your email address to be visible."
//               checked={settings.emailAddress}
//               onChange={(value) => handleChange("emailAddress", value)}
//             />

//             <ToggleRow
//               icon={<UserRound size={20} />}
//               title="Owner Contact"
//               description="Allow property owners to contact you."
//               checked={settings.ownerContact}
//               onChange={(value) => handleChange("ownerContact", value)}
//             />
//           </div>
//         </section>

//         {/* SAVE BUTTON */}

//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={saving}
//             className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {saving ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

// // =========================================================
// // REUSABLE TOGGLE COMPONENT
// // =========================================================

// function ToggleRow({ icon, title, description, checked, onChange }) {
//   return (
//     <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
//       <div className="flex items-center gap-3">
//         <div className="text-gray-500">{icon}</div>

//         <div>
//           <h3 className="font-semibold text-gray-900">{title}</h3>

//           <p className="text-sm text-gray-500">{description}</p>
//         </div>
//       </div>

//       <button
//         type="button"
//         onClick={() => onChange(!checked)}
//         className={`relative h-6 w-11 shrink-0 rounded-full transition ${
//           checked ? "bg-blue-600" : "bg-gray-300"
//         }`}
//         aria-label={title}
//       >
//         <span
//           className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
//             checked ? "left-6" : "left-1"
//           }`}
//         />
//       </button>
//     </div>
//   );
// }

// // =========================================================
// // SELECT FIELD
// // =========================================================

// function SelectField({ label, value, onChange, options }) {
//   return (
//     <div>
//       <label className="mb-2 block text-sm font-semibold text-gray-700">
//         {label}
//       </label>

//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
//       >
//         {options.map((option) => (
//           <option key={option} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// // =========================================================
// // INPUT FIELD
// // =========================================================

// function InputField({ label, value, onChange, placeholder, type = "text" }) {
//   return (
//     <div>
//       <label className="mb-2 block text-sm font-semibold text-gray-700">
//         {label}
//       </label>

//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
//       />
//     </div>
//   );
// }
// // "use client";

// // import { useEffect, useState } from "react";
// // import {
// //   Settings,
// //   Home,
// //   Bell,
// //   Shield,
// //   Globe,
// //   IndianRupee,
// //   Moon,
// //   Search,
// //   Eye,
// //   Phone,
// //   Mail,
// //   UserRound,
// // } from "lucide-react";

// // const STRAPI_URL =
// //   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
// //   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
// //   "http://localhost:1337";

// // const API_URL = `${STRAPI_URL}/api`;

// // export default function UserSettingsPage() {
// //   const [settings, setSettings] = useState({
// //     language: "English",
// //     currency: "INR",
// //     darkMode: false,
// //     saveSearchHistory: true,
// //     showRecentlyViewed: true,

// //     propertyType: "Apartment",
// //     purpose: "Buy",
// //     preferredCity: "",
// //     preferredArea: "",
// //     preferredCategory: "Residential",
// //     minimumBudget: "",
// //     maximumBudget: "",

// //     emailNotifications: true,
// //     propertyAlerts: true,
// //     newPropertyAlerts: true,
// //     enquiryUpdates: true,
// //     marketingNotifications: false,

// //     profileVisibility: true,
// //     phoneNumber: false,
// //     emailAddress: false,
// //     ownerContact: true,
// //   });

// //   const [profileDocumentId, setProfileDocumentId] = useState(null);

// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);

// //   const [successMessage, setSuccessMessage] = useState("");
// //   const [errorMessage, setErrorMessage] = useState("");

// //   // =========================================================
// //   // LOAD USER PROFILE FROM STRAPI
// //   // =========================================================

// //   useEffect(() => {
// //     const loadUserSettings = async () => {
// //       try {
// //         setLoading(true);
// //         setErrorMessage("");

// //         const token = localStorage.getItem("token");

// //         if (!token) {
// //           setErrorMessage("Please login first.");
// //           setLoading(false);
// //           return;
// //         }

// //         // First get currently logged-in user
// //         const userResponse = await fetch(`${API_URL}/users/me`, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });

// //         if (!userResponse.ok) {
// //           throw new Error("Unable to get logged-in user.");
// //         }

// //         const currentUser = await userResponse.json();

// //         // Get all User Profiles with their user relation
// //         const profileQuery = `${API_URL}/user-profiles?populate=*&pagination[pageSize]=100`;

// //         const profileResponse = await fetch(profileQuery, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });

// //         if (!profileResponse.ok) {
// //           const errorResult = await profileResponse.json().catch(() => ({}));

// //           throw new Error(
// //             errorResult?.error?.message || "Unable to load user profiles.",
// //           );
// //         }

// //         const profileResult = await profileResponse.json();

// //         const profiles = profileResult?.data || [];

// //         // Find profile belonging to currently logged-in user
// //         const profile = profiles.find((item) => {
// //           const relation = item?.users_permissions_user;

// //           if (!relation) {
// //             return false;
// //           }

// //           const relationId = relation?.id;
// //           const relationDocumentId = relation?.documentId;

// //           return (
// //             relationId === currentUser.id ||
// //             relationDocumentId === currentUser.documentId
// //           );
// //         });

// //         if (!profile) {
// //           console.log("Current User:", currentUser);
// //           console.log("All Profiles:", profiles);

// //           setErrorMessage("User Profile not found for the logged-in user.");

// //           setLoading(false);
// //           return;
// //         }

// //         console.log("Matched User Profile:", profile);

// //         // Strapi v5 documentId
// //         setProfileDocumentId(profile.documentId);

// //         if (!profile) {
// //           setErrorMessage(
// //             "User Profile not found. Please create a User Profile in Strapi first.",
// //           );
// //           setLoading(false);
// //           return;
// //         }

// //         // Strapi v5
// //         setProfileDocumentId(profile.documentId);

// //         const userSettings = profile.UserSettings || {};
// //         const propertyPreferences = profile.PropertyPreferences || {};
// //         const notificationPreferences = profile.NotificationPreferences || {};
// //         const privacySettings = profile.PrivacySettings || {};

// //         setSettings({
// //           language: userSettings.Language || "English",
// //           currency: userSettings.Currency || "INR",
// //           darkMode: Boolean(userSettings.DarkMode),
// //           saveSearchHistory: Boolean(userSettings.SaveSearchHistory),
// //           showRecentlyViewed: Boolean(userSettings.ShowRecentlyViewed),

// //           propertyType: propertyPreferences.PropertyType || "Apartment",
// //           purpose: propertyPreferences.Purpose || "Buy",
// //           preferredCity: propertyPreferences.PreferredCity || "",
// //           preferredArea: propertyPreferences.PreferredArea || "",
// //           preferredCategory:
// //             propertyPreferences.PreferredCategory || "Residential",
// //           minimumBudget:
// //             propertyPreferences.MinimumBudget !== null &&
// //             propertyPreferences.MinimumBudget !== undefined
// //               ? String(propertyPreferences.MinimumBudget)
// //               : "",
// //           maximumBudget:
// //             propertyPreferences.MaximumBudget !== null &&
// //             propertyPreferences.MaximumBudget !== undefined
// //               ? String(propertyPreferences.MaximumBudget)
// //               : "",

// //           emailNotifications:
// //             notificationPreferences.EmailNotifications ?? true,

// //           propertyAlerts: notificationPreferences.PropertyAlerts ?? true,

// //           newPropertyAlerts: notificationPreferences.NewPropertyAlerts ?? true,

// //           enquiryUpdates: Boolean(notificationPreferences.EnquiryUpdates),

// //           marketingNotifications:
// //             notificationPreferences.MarketingNotifications ?? false,

// //           profileVisibility: privacySettings.ProfileVisibility ?? true,

// //           phoneNumber: privacySettings.PhoneNumber ?? false,

// //           emailAddress: privacySettings.EmailAddress ?? false,

// //           ownerContact: privacySettings.OwnerContact ?? true,
// //         });
// //       } catch (error) {
// //         console.error("Load User Settings Error:", error);

// //         setErrorMessage(error.message || "Failed to load user settings.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     loadUserSettings();
// //   }, []);

// //   // =========================================================
// //   // HANDLE CHANGE
// //   // =========================================================

// //   const handleChange = (field, value) => {
// //     setSettings((previous) => ({
// //       ...previous,
// //       [field]: value,
// //     }));

// //     // Remove old messages when user changes something
// //     setSuccessMessage("");
// //     setErrorMessage("");
// //   };

// //   // =========================================================
// //   // SAVE SETTINGS TO STRAPI
// //   // =========================================================

// //   const handleSave = async () => {
// //     try {
// //       setSaving(true);
// //       setSuccessMessage("");
// //       setErrorMessage("");

// //       const token = localStorage.getItem("token");

// //       if (!token) {
// //         setErrorMessage("Please login first.");
// //         return;
// //       }

// //       if (!profileDocumentId) {
// //         setErrorMessage("User Profile not found. Cannot save settings.");
// //         return;
// //       }

// //       const payload = {
// //         data: {
// //           UserSettings: {
// //             Language: settings.language,
// //             Currency: settings.currency,
// //             DarkMode: settings.darkMode,
// //             SaveSearchHistory: settings.saveSearchHistory,
// //             ShowRecentlyViewed: settings.showRecentlyViewed,
// //           },

// //           PropertyPreferences: {
// //             PropertyType: settings.propertyType,
// //             Purpose: settings.purpose,
// //             PreferredCity: settings.preferredCity,
// //             PreferredArea: settings.preferredArea,
// //             PreferredCategory: settings.preferredCategory,
// //             MinimumBudget:
// //               settings.minimumBudget === ""
// //                 ? null
// //                 : Number(settings.minimumBudget),
// //             MaximumBudget:
// //               settings.maximumBudget === ""
// //                 ? null
// //                 : Number(settings.maximumBudget),
// //           },

// //           NotificationPreferences: {
// //             EmailNotifications: settings.emailNotifications,
// //             PropertyAlerts: settings.propertyAlerts,
// //             NewPropertyAlerts: settings.newPropertyAlerts,

// //             // Strapi मध्ये हा field सध्या Text आहे
// //             EnquiryUpdates: Boolean(settings.enquiryUpdates),

// //             MarketingNotifications: settings.marketingNotifications,
// //           },

// //           PrivacySettings: {
// //             ProfileVisibility: settings.profileVisibility,
// //             PhoneNumber: settings.phoneNumber,
// //             EmailAddress: settings.emailAddress,
// //             OwnerContact: settings.ownerContact,
// //           },
// //         },
// //       };

// //       const response = await fetch(
// //         `${API_URL}/user-profiles/${profileDocumentId}`,
// //         {
// //           method: "PUT",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //           body: JSON.stringify(payload),
// //         },
// //       );

// //       const result = await response.json();

// //       if (!response.ok) {
// //         console.error("Strapi Save Error:", result);

// //         throw new Error(result?.error?.message || "Failed to save settings.");
// //       }

// //       setSuccessMessage("Settings saved successfully.");

// //       // Message 3 seconds नंतर remove
// //       setTimeout(() => {
// //         setSuccessMessage("");
// //       }, 3000);
// //     } catch (error) {
// //       console.error("Save Settings Error:", error);

// //       setErrorMessage(error.message || "Failed to save settings.");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   // =========================================================
// //   // LOADING SCREEN
// //   // =========================================================

// //   if (loading) {
// //     return (
// //       <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
// //         <div className="mx-auto max-w-5xl">
// //           <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
// //             <p className="text-gray-600">Loading your settings...</p>
// //           </div>
// //         </div>
// //       </main>
// //     );
// //   }

// //   // =========================================================
// //   // PAGE
// //   // =========================================================

// //   return (
// //     <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
// //       <div className="mx-auto max-w-5xl">
// //         {/* PAGE HEADER */}

// //         <div className="mb-8">
// //           <div className="flex items-center gap-3">
// //             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
// //               <Settings className="text-blue-600" size={24} />
// //             </div>

// //             <div>
// //               <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

// //               <p className="mt-1 text-gray-600">
// //                 Manage your account preferences and settings.
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* SUCCESS MESSAGE */}

// //         {successMessage && (
// //           <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
// //             {successMessage}
// //           </div>
// //         )}

// //         {/* ERROR MESSAGE */}

// //         {errorMessage && (
// //           <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
// //             {errorMessage}
// //           </div>
// //         )}

// //         {/* USER SETTINGS */}

// //         <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
// //           <div className="mb-6 flex items-center gap-3">
// //             <div className="rounded-lg bg-blue-100 p-3">
// //               <Globe className="text-blue-600" size={22} />
// //             </div>

// //             <div>
// //               <h2 className="text-xl font-bold text-gray-900">User Settings</h2>

// //               <p className="text-sm text-gray-500">
// //                 Manage your language, currency and viewing preferences.
// //               </p>
// //             </div>
// //           </div>

// //           <div className="grid gap-5 sm:grid-cols-2">
// //             {/* LANGUAGE */}

// //             <div>
// //               <label className="mb-2 block text-sm font-semibold text-gray-700">
// //                 Language
// //               </label>

// //               <select
// //                 value={settings.language}
// //                 onChange={(e) => handleChange("language", e.target.value)}
// //                 className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
// //               >
// //                 <option value="English">English</option>
// //                 <option value="Hindi">Hindi</option>
// //                 <option value="Marathi">Marathi</option>
// //               </select>
// //             </div>

// //             {/* CURRENCY */}

// //             <div>
// //               <label className="mb-2 block text-sm font-semibold text-gray-700">
// //                 Currency
// //               </label>

// //               <div className="relative">
// //                 <IndianRupee
// //                   size={18}
// //                   className="absolute left-3 top-3.5 text-gray-400"
// //                 />

// //                 <select
// //                   value={settings.currency}
// //                   onChange={(e) => handleChange("currency", e.target.value)}
// //                   className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-600"
// //                 >
// //                   <option value="INR">INR - Indian Rupee</option>

// //                   <option value="USD">USD - US Dollar</option>

// //                   <option value="EUR">EUR - Euro</option>
// //                 </select>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="mt-6 space-y-4">
// //             <ToggleRow
// //               icon={<Moon size={20} />}
// //               title="Dark Mode"
// //               description="Use dark theme across the application."
// //               checked={settings.darkMode}
// //               onChange={(value) => handleChange("darkMode", value)}
// //             />

// //             <ToggleRow
// //               icon={<Search size={20} />}
// //               title="Save Search History"
// //               description="Save your recent property searches."
// //               checked={settings.saveSearchHistory}
// //               onChange={(value) => handleChange("saveSearchHistory", value)}
// //             />

// //             <ToggleRow
// //               icon={<Eye size={20} />}
// //               title="Recently Viewed Properties"
// //               description="Show properties that you recently viewed."
// //               checked={settings.showRecentlyViewed}
// //               onChange={(value) => handleChange("showRecentlyViewed", value)}
// //             />
// //           </div>
// //         </section>

// //         {/* PROPERTY PREFERENCES */}

// //         <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
// //           <div className="mb-6 flex items-center gap-3">
// //             <div className="rounded-lg bg-green-100 p-3">
// //               <Home className="text-green-600" size={22} />
// //             </div>

// //             <div>
// //               <h2 className="text-xl font-bold text-gray-900">
// //                 Property Preferences
// //               </h2>

// //               <p className="text-sm text-gray-500">
// //                 Tell us what type of property you are looking for.
// //               </p>
// //             </div>
// //           </div>

// //           <div className="grid gap-5 sm:grid-cols-2">
// //             <SelectField
// //               label="Property Type"
// //               value={settings.propertyType}
// //               onChange={(value) => handleChange("propertyType", value)}
// //               options={[
// //                 "Apartment",
// //                 "Villa",
// //                 "Independent House",
// //                 "Office",
// //                 "Shop",
// //               ]}
// //             />

// //             <SelectField
// //               label="Purpose"
// //               value={settings.purpose}
// //               onChange={(value) => handleChange("purpose", value)}
// //               options={["Buy", "Rent", "Sale", "Lease"]}
// //             />

// //             <InputField
// //               label="Preferred City"
// //               value={settings.preferredCity}
// //               onChange={(value) => handleChange("preferredCity", value)}
// //               placeholder="e.g. Pune"
// //             />

// //             <InputField
// //               label="Preferred Area"
// //               value={settings.preferredArea}
// //               onChange={(value) => handleChange("preferredArea", value)}
// //               placeholder="e.g. Wakad"
// //             />

// //             <InputField
// //               label="Preferred Category"
// //               value={settings.preferredCategory}
// //               onChange={(value) => handleChange("preferredCategory", value)}
// //               placeholder="e.g. Residential"
// //             />

// //             <InputField
// //               label="Minimum Budget"
// //               value={settings.minimumBudget}
// //               onChange={(value) => handleChange("minimumBudget", value)}
// //               placeholder="e.g. 3000000"
// //               type="number"
// //             />

// //             <InputField
// //               label="Maximum Budget"
// //               value={settings.maximumBudget}
// //               onChange={(value) => handleChange("maximumBudget", value)}
// //               placeholder="e.g. 8000000"
// //               type="number"
// //             />
// //           </div>
// //         </section>

// //         {/* NOTIFICATION PREFERENCES */}

// //         <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
// //           <div className="mb-6 flex items-center gap-3">
// //             <div className="rounded-lg bg-orange-100 p-3">
// //               <Bell className="text-orange-600" size={22} />
// //             </div>

// //             <div>
// //               <h2 className="text-xl font-bold text-gray-900">
// //                 Notification Preferences
// //               </h2>

// //               <p className="text-sm text-gray-500">
// //                 Choose which notifications you want to receive.
// //               </p>
// //             </div>
// //           </div>

// //           <div className="space-y-4">
// //             <ToggleRow
// //               icon={<Mail size={20} />}
// //               title="Email Notifications"
// //               description="Receive important updates by email."
// //               checked={settings.emailNotifications}
// //               onChange={(value) => handleChange("emailNotifications", value)}
// //             />

// //             <ToggleRow
// //               icon={<Home size={20} />}
// //               title="Property Alerts"
// //               description="Get alerts for properties matching your preferences."
// //               checked={settings.propertyAlerts}
// //               onChange={(value) => handleChange("propertyAlerts", value)}
// //             />

// //             <ToggleRow
// //               icon={<Search size={20} />}
// //               title="New Property Alerts"
// //               description="Get notified when new properties are listed."
// //               checked={settings.newPropertyAlerts}
// //               onChange={(value) => handleChange("newPropertyAlerts", value)}
// //             />

// //             <ToggleRow
// //               icon={<Bell size={20} />}
// //               title="Enquiry Updates"
// //               description="Receive updates about your property enquiries."
// //               checked={settings.enquiryUpdates}
// //               onChange={(value) => handleChange("enquiryUpdates", value)}
// //             />

// //             <ToggleRow
// //               icon={<Mail size={20} />}
// //               title="Marketing Notifications"
// //               description="Receive offers and promotional updates."
// //               checked={settings.marketingNotifications}
// //               onChange={(value) =>
// //                 handleChange("marketingNotifications", value)
// //               }
// //             />
// //           </div>
// //         </section>

// //         {/* PRIVACY SETTINGS */}

// //         <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
// //           <div className="mb-6 flex items-center gap-3">
// //             <div className="rounded-lg bg-purple-100 p-3">
// //               <Shield className="text-purple-600" size={22} />
// //             </div>

// //             <div>
// //               <h2 className="text-xl font-bold text-gray-900">
// //                 Privacy Settings
// //               </h2>

// //               <p className="text-sm text-gray-500">
// //                 Control what information is visible to others.
// //               </p>
// //             </div>
// //           </div>

// //           <div className="space-y-4">
// //             <ToggleRow
// //               icon={<UserRound size={20} />}
// //               title="Profile Visibility"
// //               description="Allow your profile to be visible."
// //               checked={settings.profileVisibility}
// //               onChange={(value) => handleChange("profileVisibility", value)}
// //             />

// //             <ToggleRow
// //               icon={<Phone size={20} />}
// //               title="Show Phone Number"
// //               description="Allow your phone number to be visible."
// //               checked={settings.phoneNumber}
// //               onChange={(value) => handleChange("phoneNumber", value)}
// //             />

// //             <ToggleRow
// //               icon={<Mail size={20} />}
// //               title="Show Email Address"
// //               description="Allow your email address to be visible."
// //               checked={settings.emailAddress}
// //               onChange={(value) => handleChange("emailAddress", value)}
// //             />

// //             <ToggleRow
// //               icon={<UserRound size={20} />}
// //               title="Owner Contact"
// //               description="Allow property owners to contact you."
// //               checked={settings.ownerContact}
// //               onChange={(value) => handleChange("ownerContact", value)}
// //             />
// //           </div>
// //         </section>

// //         {/* SAVE BUTTON */}

// //         <div className="flex justify-end">
// //           <button
// //             type="button"
// //             onClick={handleSave}
// //             disabled={saving}
// //             className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
// //           >
// //             {saving ? "Saving..." : "Save Changes"}
// //           </button>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }

// // // =========================================================
// // // REUSABLE TOGGLE COMPONENT
// // // =========================================================

// // function ToggleRow({ icon, title, description, checked, onChange }) {
// //   return (
// //     <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
// //       <div className="flex items-center gap-3">
// //         <div className="text-gray-500">{icon}</div>

// //         <div>
// //           <h3 className="font-semibold text-gray-900">{title}</h3>

// //           <p className="text-sm text-gray-500">{description}</p>
// //         </div>
// //       </div>

// //       <button
// //         type="button"
// //         onClick={() => onChange(!checked)}
// //         className={`relative h-6 w-11 shrink-0 rounded-full transition ${
// //           checked ? "bg-blue-600" : "bg-gray-300"
// //         }`}
// //         aria-label={title}
// //       >
// //         <span
// //           className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
// //             checked ? "left-6" : "left-1"
// //           }`}
// //         />
// //       </button>
// //     </div>
// //   );
// // }

// // // =========================================================
// // // SELECT FIELD
// // // =========================================================

// // function SelectField({ label, value, onChange, options }) {
// //   return (
// //     <div>
// //       <label className="mb-2 block text-sm font-semibold text-gray-700">
// //         {label}
// //       </label>

// //       <select
// //         value={value}
// //         onChange={(e) => onChange(e.target.value)}
// //         className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
// //       >
// //         {options.map((option) => (
// //           <option key={option} value={option}>
// //             {option}
// //           </option>
// //         ))}
// //       </select>
// //     </div>
// //   );
// // }

// // // =========================================================
// // // INPUT FIELD
// // // =========================================================

// // function InputField({ label, value, onChange, placeholder, type = "text" }) {
// //   return (
// //     <div>
// //       <label className="mb-2 block text-sm font-semibold text-gray-700">
// //         {label}
// //       </label>

// //       <input
// //         type={type}
// //         value={value}
// //         onChange={(e) => onChange(e.target.value)}
// //         placeholder={placeholder}
// //         className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
// //       />
// //     </div>
// //   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import {
//   Settings,
//   Home,
//   Bell,
//   Shield,
//   Globe,
//   IndianRupee,
//   Moon,
//   Search,
//   Eye,
//   Phone,
//   Mail,
//   UserRound,
// } from "lucide-react";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// const API_URL = `${STRAPI_URL}/api`;

// const DEFAULT_SETTINGS = {
//   language: "English",
//   currency: "INR",
//   darkMode: false,
//   saveSearchHistory: true,
//   showRecentlyViewed: true,

//   propertyType: "Apartment",
//   purpose: "Buy",
//   preferredCity: "",
//   preferredArea: "",
//   preferredCategory: "Residential",
//   minimumBudget: "",
//   maximumBudget: "",

//   // Default ON
//   emailNotifications: true,
//   propertyAlerts: true,
//   newPropertyAlerts: true,
//   enquiryUpdates: true,

//   // Default OFF
//   marketingNotifications: false,

//   profileVisibility: true,
//   phoneNumber: false,
//   emailAddress: false,
//   ownerContact: true,
// };

// export default function UserSettingsPage() {
//   const [settings, setSettings] = useState(DEFAULT_SETTINGS);

//   const [profileDocumentId, setProfileDocumentId] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   // =========================================================
//   // LOAD CURRENT USER + USER PROFILE
//   // =========================================================

//   useEffect(() => {
//     const loadUserSettings = async () => {
//       try {
//         setLoading(true);
//         setErrorMessage("");
//         setSuccessMessage("");

//         const token = localStorage.getItem("token");

//         if (!token) {
//           setErrorMessage("Please login first.");
//           setLoading(false);
//           return;
//         }

//         // -----------------------------------------------------
//         // 1. GET CURRENT LOGGED-IN USER
//         // -----------------------------------------------------

//         const userResponse = await fetch(`${API_URL}/users/me`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           cache: "no-store",
//         });

//         const currentUser = await userResponse.json();

//         if (!userResponse.ok) {
//           throw new Error(
//             currentUser?.error?.message || "Unable to get logged-in user.",
//           );
//         }

//         if (!currentUser?.id) {
//           throw new Error("Logged-in user ID not found.");
//         }

//         console.log("CURRENT USER:", currentUser);

//         // -----------------------------------------------------
//         // 2. GET USER PROFILE
//         // -----------------------------------------------------

//         const profileQuery =
//           `${API_URL}/user-profiles?` +
//           `filters[users_permissions_user][id][$eq]=${currentUser.id}` +
//           `&populate=*`;

//         const profileResponse = await fetch(profileQuery, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           cache: "no-store",
//         });

//         const profileResult = await profileResponse.json().catch(() => null);

//         if (!profileResponse.ok) {
//           throw new Error(
//             profileResult?.error?.message || "Unable to load user profile.",
//           );
//         }

//         let profile = profileResult?.data?.[0] || null;

//         // -----------------------------------------------------
//         // 3. IF PROFILE DOES NOT EXIST → CREATE IT
//         // -----------------------------------------------------

//         if (!profile) {
//           console.log("User Profile not found. Creating profile...");

//           const createProfilePayload = {
//             data: {
//               users_permissions_user: currentUser.id,
//             },
//           };

//           const createProfileResponse = await fetch(
//             `${API_URL}/user-profiles`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify(createProfilePayload),
//             },
//           );

//           const createProfileResult = await createProfileResponse
//             .json()
//             .catch(() => null);

//           if (!createProfileResponse.ok) {
//             console.error("CREATE USER PROFILE ERROR:", createProfileResult);

//             throw new Error(
//               createProfileResult?.error?.message ||
//                 "Unable to create User Profile.",
//             );
//           }

//           profile = createProfileResult?.data || null;

//           if (!profile) {
//             throw new Error("User Profile could not be created.");
//           }

//           console.log("USER PROFILE CREATED:", profile);
//         }

//         // -----------------------------------------------------
//         // 4. SAVE PROFILE DOCUMENT ID
//         // -----------------------------------------------------

//         if (!profile.documentId) {
//           throw new Error("User Profile documentId not found.");
//         }

//         setProfileDocumentId(profile.documentId);

//         // -----------------------------------------------------
//         // 5. READ COMPONENT DATA
//         // -----------------------------------------------------

//         const userSettings = profile.UserSettings || {};

//         const propertyPreferences = profile.PropertyPreferences || {};

//         const notificationPreferences = profile.NotificationPreferences || {};

//         const privacySettings = profile.PrivacySettings || {};

//         // -----------------------------------------------------
//         // 6. LOAD SETTINGS INTO FRONTEND
//         // -----------------------------------------------------

//         setSettings({
//           language: userSettings.Language || DEFAULT_SETTINGS.language,

//           currency: userSettings.Currency || DEFAULT_SETTINGS.currency,

//           darkMode: userSettings.DarkMode ?? DEFAULT_SETTINGS.darkMode,

//           saveSearchHistory:
//             userSettings.SaveSearchHistory ??
//             DEFAULT_SETTINGS.saveSearchHistory,

//           showRecentlyViewed:
//             userSettings.ShowRecentlyViewed ??
//             DEFAULT_SETTINGS.showRecentlyViewed,

//           propertyType:
//             propertyPreferences.PropertyType || DEFAULT_SETTINGS.propertyType,

//           purpose: propertyPreferences.Purpose || DEFAULT_SETTINGS.purpose,

//           preferredCity:
//             propertyPreferences.PreferredCity || DEFAULT_SETTINGS.preferredCity,

//           preferredArea:
//             propertyPreferences.PreferredArea || DEFAULT_SETTINGS.preferredArea,

//           preferredCategory:
//             propertyPreferences.PreferredCategory ||
//             DEFAULT_SETTINGS.preferredCategory,

//           minimumBudget:
//             propertyPreferences.MinimumBudget !== null &&
//             propertyPreferences.MinimumBudget !== undefined
//               ? String(propertyPreferences.MinimumBudget)
//               : DEFAULT_SETTINGS.minimumBudget,

//           maximumBudget:
//             propertyPreferences.MaximumBudget !== null &&
//             propertyPreferences.MaximumBudget !== undefined
//               ? String(propertyPreferences.MaximumBudget)
//               : DEFAULT_SETTINGS.maximumBudget,

//           // Email notifications = ON by default
//           emailNotifications:
//             notificationPreferences.EmailNotifications ??
//             DEFAULT_SETTINGS.emailNotifications,

//           propertyAlerts:
//             notificationPreferences.PropertyAlerts ??
//             DEFAULT_SETTINGS.propertyAlerts,

//           newPropertyAlerts:
//             notificationPreferences.NewPropertyAlerts ??
//             DEFAULT_SETTINGS.newPropertyAlerts,

//           enquiryUpdates:
//             notificationPreferences.EnquiryUpdates ??
//             DEFAULT_SETTINGS.enquiryUpdates,

//           marketingNotifications:
//             notificationPreferences.MarketingNotifications ??
//             DEFAULT_SETTINGS.marketingNotifications,

//           profileVisibility:
//             privacySettings.ProfileVisibility ??
//             DEFAULT_SETTINGS.profileVisibility,

//           phoneNumber:
//             privacySettings.PhoneNumber ?? DEFAULT_SETTINGS.phoneNumber,

//           emailAddress:
//             privacySettings.EmailAddress ?? DEFAULT_SETTINGS.emailAddress,

//           ownerContact:
//             privacySettings.OwnerContact ?? DEFAULT_SETTINGS.ownerContact,
//         });
//       } catch (error) {
//         console.error("LOAD USER SETTINGS ERROR:", error);

//         setErrorMessage(error.message || "Failed to load user settings.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUserSettings();
//   }, []);

//   // =========================================================
//   // HANDLE CHANGE
//   // =========================================================

//   const handleChange = (field, value) => {
//     setSettings((previous) => ({
//       ...previous,
//       [field]: value,
//     }));

//     setSuccessMessage("");
//     setErrorMessage("");
//   };

//   // =========================================================
//   // SAVE SETTINGS
//   // =========================================================

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       setSuccessMessage("");
//       setErrorMessage("");

//       const token = localStorage.getItem("token");

//       if (!token) {
//         setErrorMessage("Please login first.");
//         return;
//       }

//       if (!profileDocumentId) {
//         setErrorMessage("User Profile is not available.");
//         return;
//       }

//       const payload = {
//         data: {
//           UserSettings: {
//             Language: settings.language,
//             Currency: settings.currency,
//             DarkMode: settings.darkMode,
//             SaveSearchHistory: settings.saveSearchHistory,
//             ShowRecentlyViewed: settings.showRecentlyViewed,
//           },

//           PropertyPreferences: {
//             PropertyType: settings.propertyType,

//             Purpose: settings.purpose,

//             PreferredCity: settings.preferredCity,

//             PreferredArea: settings.preferredArea,

//             PreferredCategory: settings.preferredCategory,

//             MinimumBudget:
//               settings.minimumBudget === ""
//                 ? null
//                 : Number(settings.minimumBudget),

//             MaximumBudget:
//               settings.maximumBudget === ""
//                 ? null
//                 : Number(settings.maximumBudget),
//           },

//           NotificationPreferences: {
//             EmailNotifications: settings.emailNotifications,

//             PropertyAlerts: settings.propertyAlerts,

//             NewPropertyAlerts: settings.newPropertyAlerts,

//             EnquiryUpdates: settings.enquiryUpdates,

//             MarketingNotifications: settings.marketingNotifications,
//           },

//           PrivacySettings: {
//             ProfileVisibility: settings.profileVisibility,

//             PhoneNumber: settings.phoneNumber,

//             EmailAddress: settings.emailAddress,

//             OwnerContact: settings.ownerContact,
//           },
//         },
//       };

//       console.log("SAVING SETTINGS:", payload);

//       const response = await fetch(
//         `${API_URL}/user-profiles/${profileDocumentId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       const result = await response.json().catch(() => null);

//       if (!response.ok) {
//         console.error("STRAPI SAVE ERROR:", result);

//         throw new Error(result?.error?.message || "Failed to save settings.");
//       }

//       console.log("SETTINGS SAVED:", result);

//       setSuccessMessage("Settings saved successfully.");

//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 3000);
//     } catch (error) {
//       console.error("SAVE SETTINGS ERROR:", error);

//       setErrorMessage(error.message || "Failed to save settings.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =========================================================
//   // LOADING
//   // =========================================================

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-5xl">
//           <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
//             <p className="text-gray-600">Loading your settings...</p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // =========================================================
//   // PAGE
//   // =========================================================

//   return (
//     <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-5xl">
//         <div className="mb-8">
//           <div className="flex items-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
//               <Settings className="text-blue-600" size={24} />
//             </div>

//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

//               <p className="mt-1 text-gray-600">
//                 Manage your account preferences and settings.
//               </p>
//             </div>
//           </div>
//         </div>

//         {successMessage && (
//           <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
//             {successMessage}
//           </div>
//         )}

//         {errorMessage && (
//           <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//             {errorMessage}
//           </div>
//         )}

//         {/* USER SETTINGS */}

//         <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
//           <div className="mb-6 flex items-center gap-3">
//             <div className="rounded-lg bg-blue-100 p-3">
//               <Globe className="text-blue-600" size={22} />
//             </div>

//             <div>
//               <h2 className="text-xl font-bold text-gray-900">User Settings</h2>

//               <p className="text-sm text-gray-500">
//                 Manage your language, currency and viewing preferences.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-5 sm:grid-cols-2">
//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Language
//               </label>

//               <select
//                 value={settings.language}
//                 onChange={(e) => handleChange("language", e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
//               >
//                 <option value="English">English</option>

//                 <option value="Hindi">Hindi</option>

//                 <option value="Marathi">Marathi</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Currency
//               </label>

//               <div className="relative">
//                 <IndianRupee
//                   size={18}
//                   className="absolute left-3 top-3.5 text-gray-400"
//                 />

//                 <select
//                   value={settings.currency}
//                   onChange={(e) => handleChange("currency", e.target.value)}
//                   className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-600"
//                 >
//                   <option value="INR">INR - Indian Rupee</option>

//                   <option value="USD">USD - US Dollar</option>

//                   <option value="EUR">EUR - Euro</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 space-y-4">
//             <ToggleRow
//               icon={<Moon size={20} />}
//               title="Dark Mode"
//               description="Use dark theme across the application."
//               checked={settings.darkMode}
//               onChange={(value) => handleChange("darkMode", value)}
//             />

//             <ToggleRow
//               icon={<Search size={20} />}
//               title="Save Search History"
//               description="Save your recent property searches."
//               checked={settings.saveSearchHistory}
//               onChange={(value) => handleChange("saveSearchHistory", value)}
//             />

//             <ToggleRow
//               icon={<Eye size={20} />}
//               title="Recently Viewed Properties"
//               description="Show properties that you recently viewed."
//               checked={settings.showRecentlyViewed}
//               onChange={(value) => handleChange("showRecentlyViewed", value)}
//             />
//           </div>
//         </section>

//         {/* PROPERTY PREFERENCES */}

//         <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
//           <div className="mb-6 flex items-center gap-3">
//             <div className="rounded-lg bg-green-100 p-3">
//               <Home className="text-green-600" size={22} />
//             </div>

//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Property Preferences
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Tell us what type of property you are looking for.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-5 sm:grid-cols-2">
//             <SelectField
//               label="Property Type"
//               value={settings.propertyType}
//               onChange={(value) => handleChange("propertyType", value)}
//               options={[
//                 "Apartment",
//                 "Villa",
//                 "Independent House",
//                 "Office",
//                 "Shop",
//               ]}
//             />

//             <SelectField
//               label="Purpose"
//               value={settings.purpose}
//               onChange={(value) => handleChange("purpose", value)}
//               options={["Buy", "Rent", "Sale", "Lease"]}
//             />

//             <InputField
//               label="Preferred City"
//               value={settings.preferredCity}
//               onChange={(value) => handleChange("preferredCity", value)}
//               placeholder="e.g. Pune"
//             />

//             <InputField
//               label="Preferred Area"
//               value={settings.preferredArea}
//               onChange={(value) => handleChange("preferredArea", value)}
//               placeholder="e.g. Wakad"
//             />

//             <InputField
//               label="Preferred Category"
//               value={settings.preferredCategory}
//               onChange={(value) => handleChange("preferredCategory", value)}
//               placeholder="e.g. Residential"
//             />

//             <InputField
//               label="Minimum Budget"
//               value={settings.minimumBudget}
//               onChange={(value) => handleChange("minimumBudget", value)}
//               placeholder="e.g. 3000000"
//               type="number"
//             />

//             <InputField
//               label="Maximum Budget"
//               value={settings.maximumBudget}
//               onChange={(value) => handleChange("maximumBudget", value)}
//               placeholder="e.g. 8000000"
//               type="number"
//             />
//           </div>
//         </section>

//         {/* NOTIFICATION PREFERENCES */}

//         <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
//           <div className="mb-6 flex items-center gap-3">
//             <div className="rounded-lg bg-orange-100 p-3">
//               <Bell className="text-orange-600" size={22} />
//             </div>

//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Notification Preferences
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Choose which notifications you want to receive.
//               </p>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <ToggleRow
//               icon={<Mail size={20} />}
//               title="Email Notifications"
//               description="Receive important updates by email."
//               checked={settings.emailNotifications}
//               onChange={(value) => handleChange("emailNotifications", value)}
//             />

//             <ToggleRow
//               icon={<Home size={20} />}
//               title="Property Alerts"
//               description="Get alerts for properties matching your preferences."
//               checked={settings.propertyAlerts}
//               onChange={(value) => handleChange("propertyAlerts", value)}
//             />

//             <ToggleRow
//               icon={<Search size={20} />}
//               title="New Property Alerts"
//               description="Get notified when new properties are listed."
//               checked={settings.newPropertyAlerts}
//               onChange={(value) => handleChange("newPropertyAlerts", value)}
//             />

//             <ToggleRow
//               icon={<Bell size={20} />}
//               title="Enquiry Updates"
//               description="Receive updates about your property enquiries."
//               checked={settings.enquiryUpdates}
//               onChange={(value) => handleChange("enquiryUpdates", value)}
//             />

//             <ToggleRow
//               icon={<Mail size={20} />}
//               title="Marketing Notifications"
//               description="Receive offers and promotional updates."
//               checked={settings.marketingNotifications}
//               onChange={(value) =>
//                 handleChange("marketingNotifications", value)
//               }
//             />
//           </div>
//         </section>

//         {/* PRIVACY SETTINGS */}

//         <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
//           <div className="mb-6 flex items-center gap-3">
//             <div className="rounded-lg bg-purple-100 p-3">
//               <Shield className="text-purple-600" size={22} />
//             </div>

//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Privacy Settings
//               </h2>

//               <p className="text-sm text-gray-500">
//                 Control what information is visible to others.
//               </p>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <ToggleRow
//               icon={<UserRound size={20} />}
//               title="Profile Visibility"
//               description="Allow your profile to be visible."
//               checked={settings.profileVisibility}
//               onChange={(value) => handleChange("profileVisibility", value)}
//             />

//             <ToggleRow
//               icon={<Phone size={20} />}
//               title="Show Phone Number"
//               description="Allow your phone number to be visible."
//               checked={settings.phoneNumber}
//               onChange={(value) => handleChange("phoneNumber", value)}
//             />

//             <ToggleRow
//               icon={<Mail size={20} />}
//               title="Show Email Address"
//               description="Allow your email address to be visible."
//               checked={settings.emailAddress}
//               onChange={(value) => handleChange("emailAddress", value)}
//             />

//             <ToggleRow
//               icon={<UserRound size={20} />}
//               title="Owner Contact"
//               description="Allow property owners to contact you."
//               checked={settings.ownerContact}
//               onChange={(value) => handleChange("ownerContact", value)}
//             />
//           </div>
//         </section>

//         {/* SAVE */}

//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={saving}
//             className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {saving ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

// // =========================================================
// // TOGGLE
// // =========================================================

// function ToggleRow({ icon, title, description, checked, onChange }) {
//   return (
//     <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
//       <div className="flex items-center gap-3">
//         <div className="text-gray-500">{icon}</div>

//         <div>
//           <h3 className="font-semibold text-gray-900">{title}</h3>

//           <p className="text-sm text-gray-500">{description}</p>
//         </div>
//       </div>

//       <button
//         type="button"
//         onClick={() => onChange(!checked)}
//         className={`relative h-6 w-11 shrink-0 rounded-full transition ${
//           checked ? "bg-blue-600" : "bg-gray-300"
//         }`}
//         aria-label={title}
//       >
//         <span
//           className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
//             checked ? "left-6" : "left-1"
//           }`}
//         />
//       </button>
//     </div>
//   );
// }

// // =========================================================
// // SELECT
// // =========================================================

// function SelectField({ label, value, onChange, options }) {
//   return (
//     <div>
//       <label className="mb-2 block text-sm font-semibold text-gray-700">
//         {label}
//       </label>

//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
//       >
//         {options.map((option) => (
//           <option key={option} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// // =========================================================
// // INPUT
// // =========================================================

// function InputField({ label, value, onChange, placeholder, type = "text" }) {
//   return (
//     <div>
//       <label className="mb-2 block text-sm font-semibold text-gray-700">
//         {label}
//       </label>

//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
//       />
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Home,
  Bell,
  Shield,
  Globe,
  IndianRupee,
  Moon,
  Search,
  Eye,
  Phone,
  Mail,
  UserRound,
} from "lucide-react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

const API_URL = `${STRAPI_URL}/api`;

const DEFAULT_SETTINGS = {
  language: "English",
  currency: "INR",
  darkMode: false,
  saveSearchHistory: true,
  showRecentlyViewed: true,

  // Property Preferences
  propertyType: "Residential",
  purpose: "Buy",
  preferredCity: "",
  preferredArea: "",
  preferredCategory: "Residential",
  minimumBudget: "",
  maximumBudget: "",

  // Notification Preferences
  emailNotifications: true,
  propertyAlerts: true,
  newPropertyAlerts: true,
  enquiryUpdates: true,
  marketingNotifications: false,

  // Privacy
  profileVisibility: true,
  phoneNumber: false,
  emailAddress: false,
  ownerContact: true,
};

export default function UserSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [profileDocumentId, setProfileDocumentId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // LOAD USER + PROFILE
  // =========================================================

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const token = localStorage.getItem("token");

        if (!token) {
          setErrorMessage("Please login first.");
          setLoading(false);
          return;
        }

        // -----------------------------------------------------
        // 1. GET LOGGED-IN USER
        // -----------------------------------------------------

        const userResponse = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const currentUser = await userResponse.json().catch(() => null);

        if (!userResponse.ok) {
          throw new Error(
            currentUser?.error?.message || "Unable to get logged-in user.",
          );
        }

        if (!currentUser || !currentUser.id) {
          throw new Error("Logged-in user ID not found.");
        }

        console.log("CURRENT USER:", currentUser);

        // -----------------------------------------------------
        // 2. FIND USER PROFILE
        // -----------------------------------------------------

        const profileQuery =
          `${API_URL}/user-profiles?` +
          `filters[users_permissions_user][id][$eq]=${currentUser.id}` +
          `&populate=*`;

        const profileResponse = await fetch(profileQuery, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const profileResult = await profileResponse.json().catch(() => null);

        if (!profileResponse.ok) {
          throw new Error(
            profileResult?.error?.message || "Unable to load user profile.",
          );
        }

        let profile = profileResult?.data?.[0] || null;

        // -----------------------------------------------------
        // 3. CREATE PROFILE IF NOT EXISTS
        // -----------------------------------------------------

        if (!profile) {
          console.log("User Profile not found. Creating...");

          const createProfileResponse = await fetch(
            `${API_URL}/user-profiles`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                data: {
                  users_permissions_user: currentUser.id,
                },
              }),
            },
          );

          const createProfileResult = await createProfileResponse
            .json()
            .catch(() => null);

          if (!createProfileResponse.ok) {
            console.error("CREATE PROFILE ERROR:", createProfileResult);

            throw new Error(
              createProfileResult?.error?.message ||
                "Unable to create User Profile.",
            );
          }

          profile = createProfileResult?.data || null;

          if (!profile) {
            throw new Error("User Profile could not be created.");
          }

          console.log("USER PROFILE CREATED:", profile);
        }

        // -----------------------------------------------------
        // 4. PROFILE DOCUMENT ID
        // -----------------------------------------------------

        if (!profile.documentId) {
          throw new Error("User Profile documentId not found.");
        }

        setProfileDocumentId(profile.documentId);

        // -----------------------------------------------------
        // 5. COMPONENT DATA
        // -----------------------------------------------------

        const userSettings = profile.UserSettings || {};

        const propertyPreferences = profile.PropertyPreferences || {};

        const notificationPreferences = profile.NotificationPreferences || {};

        const privacySettings = profile.PrivacySettings || {};

        // -----------------------------------------------------
        // 6. SET FRONTEND VALUES
        // -----------------------------------------------------

        setSettings({
          language: userSettings.Language || DEFAULT_SETTINGS.language,

          currency: userSettings.Currency || DEFAULT_SETTINGS.currency,

          darkMode: userSettings.DarkMode ?? DEFAULT_SETTINGS.darkMode,

          saveSearchHistory:
            userSettings.SaveSearchHistory ??
            DEFAULT_SETTINGS.saveSearchHistory,

          showRecentlyViewed:
            userSettings.ShowRecentlyViewed ??
            DEFAULT_SETTINGS.showRecentlyViewed,

          // Property Type
          propertyType:
            propertyPreferences.PropertyType || DEFAULT_SETTINGS.propertyType,

          // Purpose
          purpose: propertyPreferences.Purpose || DEFAULT_SETTINGS.purpose,

          preferredCity:
            propertyPreferences.PreferredCity || DEFAULT_SETTINGS.preferredCity,

          preferredArea:
            propertyPreferences.PreferredArea || DEFAULT_SETTINGS.preferredArea,

          preferredCategory:
            propertyPreferences.PreferredCategory ||
            DEFAULT_SETTINGS.preferredCategory,

          minimumBudget:
            propertyPreferences.MinimumBudget !== null &&
            propertyPreferences.MinimumBudget !== undefined
              ? String(propertyPreferences.MinimumBudget)
              : DEFAULT_SETTINGS.minimumBudget,

          maximumBudget:
            propertyPreferences.MaximumBudget !== null &&
            propertyPreferences.MaximumBudget !== undefined
              ? String(propertyPreferences.MaximumBudget)
              : DEFAULT_SETTINGS.maximumBudget,

          // Notifications
          emailNotifications:
            notificationPreferences.EmailNotifications ??
            DEFAULT_SETTINGS.emailNotifications,

          propertyAlerts:
            notificationPreferences.PropertyAlerts ??
            DEFAULT_SETTINGS.propertyAlerts,

          newPropertyAlerts:
            notificationPreferences.NewPropertyAlerts ??
            DEFAULT_SETTINGS.newPropertyAlerts,

          enquiryUpdates:
            notificationPreferences.EnquiryUpdates ??
            DEFAULT_SETTINGS.enquiryUpdates,

          marketingNotifications:
            notificationPreferences.MarketingNotifications ??
            DEFAULT_SETTINGS.marketingNotifications,

          // Privacy
          profileVisibility:
            privacySettings.ProfileVisibility ??
            DEFAULT_SETTINGS.profileVisibility,

          phoneNumber:
            privacySettings.PhoneNumber ?? DEFAULT_SETTINGS.phoneNumber,

          emailAddress:
            privacySettings.EmailAddress ?? DEFAULT_SETTINGS.emailAddress,

          ownerContact:
            privacySettings.OwnerContact ?? DEFAULT_SETTINGS.ownerContact,
        });
      } catch (error) {
        console.error("LOAD USER SETTINGS ERROR:", error);

        setErrorMessage(error.message || "Failed to load user settings.");
      } finally {
        setLoading(false);
      }
    };

    loadUserSettings();
  }, []);

  // =========================================================
  // HANDLE TOGGLE / INPUT CHANGE
  // =========================================================

  const handleChange = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  // =========================================================
  // SAVE SETTINGS
  // =========================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccessMessage("");
      setErrorMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Please login first.");
        return;
      }

      if (!profileDocumentId) {
        setErrorMessage("User Profile is not available.");
        return;
      }

      const payload = {
        data: {
          // =================================================
          // USER SETTINGS
          // =================================================

          UserSettings: {
            Language: settings.language,

            Currency: settings.currency,

            DarkMode: settings.darkMode,

            SaveSearchHistory: settings.saveSearchHistory,

            ShowRecentlyViewed: settings.showRecentlyViewed,
          },

          // =================================================
          // PROPERTY PREFERENCES
          // =================================================

          PropertyPreferences: {
            PropertyType: settings.propertyType,

            Purpose: settings.purpose,

            PreferredCity: settings.preferredCity,

            PreferredArea: settings.preferredArea,

            PreferredCategory: settings.preferredCategory,

            MinimumBudget:
              settings.minimumBudget === ""
                ? null
                : Number(settings.minimumBudget),

            MaximumBudget:
              settings.maximumBudget === ""
                ? null
                : Number(settings.maximumBudget),
          },

          // =================================================
          // NOTIFICATION PREFERENCES
          // =================================================

          NotificationPreferences: {
            EmailNotifications: settings.emailNotifications,

            PropertyAlerts: settings.propertyAlerts,

            NewPropertyAlerts: settings.newPropertyAlerts,

            EnquiryUpdates: settings.enquiryUpdates,

            MarketingNotifications: settings.marketingNotifications,
          },

          // =================================================
          // PRIVACY SETTINGS
          // =================================================

          PrivacySettings: {
            ProfileVisibility: settings.profileVisibility,

            PhoneNumber: settings.phoneNumber,

            EmailAddress: settings.emailAddress,

            OwnerContact: settings.ownerContact,
          },
        },
      };

      console.log("SAVING SETTINGS:", payload);

      const response = await fetch(
        `${API_URL}/user-profiles/${profileDocumentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("STRAPI SAVE ERROR:", result);

        throw new Error(result?.error?.message || "Failed to save settings.");
      }

      console.log("SETTINGS SAVED:", result);

      setSuccessMessage("Settings saved successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("SAVE SETTINGS ERROR:", error);

      setErrorMessage(error.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">Loading your settings...</p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Settings className="text-blue-600" size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

              <p className="mt-1 text-gray-600">
                Manage your account preferences and settings.
              </p>
            </div>
          </div>
        </div>

        {/* SUCCESS */}

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {successMessage}
          </div>
        )}

        {/* ERROR */}

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {/* ===================================================
            USER SETTINGS
        =================================================== */}

        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <Globe className="text-blue-600" size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">User Settings</h2>

              <p className="text-sm text-gray-500">
                Manage your language, currency and viewing preferences.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* LANGUAGE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Language
              </label>

              <select
                value={settings.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
              >
                <option value="English">English</option>

                <option value="Hindi">Hindi</option>

                <option value="Marathi">Marathi</option>
              </select>
            </div>

            {/* CURRENCY */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Currency
              </label>

              <div className="relative">
                <IndianRupee
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />

                <select
                  value={settings.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-600"
                >
                  <option value="INR">INR - Indian Rupee</option>

                  <option value="USD">USD - US Dollar</option>

                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <ToggleRow
              icon={<Moon size={20} />}
              title="Dark Mode"
              description="Use dark theme across the application."
              checked={settings.darkMode}
              onChange={(value) => handleChange("darkMode", value)}
            />

            <ToggleRow
              icon={<Search size={20} />}
              title="Save Search History"
              description="Save your recent property searches."
              checked={settings.saveSearchHistory}
              onChange={(value) => handleChange("saveSearchHistory", value)}
            />

            <ToggleRow
              icon={<Eye size={20} />}
              title="Recently Viewed Properties"
              description="Show properties that you recently viewed."
              checked={settings.showRecentlyViewed}
              onChange={(value) => handleChange("showRecentlyViewed", value)}
            />
          </div>
        </section>

        {/* ===================================================
            PROPERTY PREFERENCES
        =================================================== */}

        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3">
              <Home className="text-green-600" size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Property Preferences
              </h2>

              <p className="text-sm text-gray-500">
                Tell us what type of property you are looking for.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* PROPERTY TYPE */}

            <SelectField
              label="Property Type"
              value={settings.propertyType}
              onChange={(value) => handleChange("propertyType", value)}
              options={["Residential", "Commercial", "Industrial"]}
            />

            {/* PURPOSE */}

            <SelectField
              label="Purpose"
              value={settings.purpose}
              onChange={(value) => handleChange("purpose", value)}
              options={["Buy", "Rent", "Sale"]}
            />

            {/* CITY */}

            <InputField
              label="Preferred City"
              value={settings.preferredCity}
              onChange={(value) => handleChange("preferredCity", value)}
              placeholder="e.g. Pune"
            />

            {/* AREA */}

            <InputField
              label="Preferred Area"
              value={settings.preferredArea}
              onChange={(value) => handleChange("preferredArea", value)}
              placeholder="e.g. Wakad"
            />

            {/* CATEGORY */}

            <InputField
              label="Preferred Category"
              value={settings.preferredCategory}
              onChange={(value) => handleChange("preferredCategory", value)}
              placeholder="e.g. Residential"
            />

            {/* MINIMUM BUDGET */}

            <InputField
              label="Minimum Budget"
              value={settings.minimumBudget}
              onChange={(value) => handleChange("minimumBudget", value)}
              placeholder="e.g. 3000000"
              type="number"
            />

            {/* MAXIMUM BUDGET */}

            <InputField
              label="Maximum Budget"
              value={settings.maximumBudget}
              onChange={(value) => handleChange("maximumBudget", value)}
              placeholder="e.g. 8000000"
              type="number"
            />
          </div>
        </section>

        {/* ===================================================
            NOTIFICATION PREFERENCES
        =================================================== */}

        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-3">
              <Bell className="text-orange-600" size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Notification Preferences
              </h2>

              <p className="text-sm text-gray-500">
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* EMAIL NOTIFICATIONS */}

            <ToggleRow
              icon={<Mail size={20} />}
              title="Email Notifications"
              description="Receive important updates by email."
              checked={settings.emailNotifications}
              onChange={(value) => handleChange("emailNotifications", value)}
            />

            {/* PROPERTY ALERTS */}

            <ToggleRow
              icon={<Home size={20} />}
              title="Property Alerts"
              description="Get alerts for properties matching your preferences."
              checked={settings.propertyAlerts}
              onChange={(value) => handleChange("propertyAlerts", value)}
            />

            {/* NEW PROPERTY ALERTS */}

            <ToggleRow
              icon={<Search size={20} />}
              title="New Property Alerts"
              description="Get notified when new properties are listed."
              checked={settings.newPropertyAlerts}
              onChange={(value) => handleChange("newPropertyAlerts", value)}
            />

            {/* ENQUIRY UPDATES */}

            <ToggleRow
              icon={<Bell size={20} />}
              title="Enquiry Updates"
              description="Receive updates about your property enquiries."
              checked={settings.enquiryUpdates}
              onChange={(value) => handleChange("enquiryUpdates", value)}
            />

            {/* MARKETING */}

            <ToggleRow
              icon={<Mail size={20} />}
              title="Marketing Notifications"
              description="Receive offers and promotional updates."
              checked={settings.marketingNotifications}
              onChange={(value) =>
                handleChange("marketingNotifications", value)
              }
            />
          </div>
        </section>

        {/* ===================================================
            PRIVACY SETTINGS
        =================================================== */}

        <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3">
              <Shield className="text-purple-600" size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Privacy Settings
              </h2>

              <p className="text-sm text-gray-500">
                Control what information is visible to others.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <ToggleRow
              icon={<UserRound size={20} />}
              title="Profile Visibility"
              description="Allow your profile to be visible."
              checked={settings.profileVisibility}
              onChange={(value) => handleChange("profileVisibility", value)}
            />

            <ToggleRow
              icon={<Phone size={20} />}
              title="Show Phone Number"
              description="Allow your phone number to be visible."
              checked={settings.phoneNumber}
              onChange={(value) => handleChange("phoneNumber", value)}
            />

            <ToggleRow
              icon={<Mail size={20} />}
              title="Show Email Address"
              description="Allow your email address to be visible."
              checked={settings.emailAddress}
              onChange={(value) => handleChange("emailAddress", value)}
            />

            <ToggleRow
              icon={<UserRound size={20} />}
              title="Owner Contact"
              description="Allow property owners to contact you."
              checked={settings.ownerContact}
              onChange={(value) => handleChange("ownerContact", value)}
            />
          </div>
        </section>

        {/* SAVE BUTTON */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}

// =========================================================
// TOGGLE COMPONENT
// =========================================================

function ToggleRow({ icon, title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div className="text-gray-500">{icon}</div>

        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>

          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
        aria-label={title}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

// =========================================================
// SELECT FIELD
// =========================================================

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// =========================================================
// INPUT FIELD
// =========================================================

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
      />
    </div>
  );
}
