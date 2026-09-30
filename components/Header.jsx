"use client";

// import { useState, useEffect } from "react";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import NotificationBell from "./NotificationBell";
// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
//   "http://localhost:1337";

// export default function Header({ headerData }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const [search, setSearch] = useState("");

//   // URL मधला q input मध्ये दाखव
//   useEffect(() => {
//     setSearch(searchParams.get("q") || "");
//   }, [searchParams]);

//   // User typing -> Search Page update
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (pathname === "/search") {
//         const params = new URLSearchParams(searchParams.toString());

//         if (search.trim()) {
//           params.set("q", search);
//         } else {
//           params.delete("q");
//         }

//         router.replace(`/search?${params.toString()}`);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search]);

//   const handleSearch = () => {
//     if (!search.trim()) return;

//     router.push(`/search?q=${encodeURIComponent(search.trim())}`);
//   };

//   const logoUrl = headerData?.Logo?.url
//     ? `${STRAPI_URL}${headerData.Logo.url}`
//     : null;

//   return (
//     <header className="bg-white border-b shadow-sm sticky top-0 z-50">

//       <div className="max-w-7xl mx-auto flex items-center gap-6 px-6 py-4">

//         {/* Logo */}

//         <Link
//           href="/"
//           className="flex items-center gap-3 flex-shrink-0"
//         >
//           {logoUrl ? (
//             <Image
//               src={logoUrl}
//               alt="Logo"
//               width={45}
//               height={45}
//               className="rounded-lg border object-cover"
//               unoptimized
//             />
//           ) : (
//             <div className="w-11 h-11 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
//               H
//             </div>
//           )}

//           <h1 className="text-xl font-semibold">
//             {headerData?.Brand || "HomeHub"}
//           </h1>
//         </Link>

//         {/* Search */}

//         <div className="flex-1">

//           <input
//             type="text"
//             value={search}
//             placeholder={
//               headerData?.Search ||
//               "Search by Area, City, Category..."
//             }
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 handleSearch();
//               }
//             }}
//             className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
//           />

//         </div>

//         {/* Add Property */}

//         <Link href="/add-property">

//           <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg">

//             + Add Property

//           </button>

//         </Link>

//       </div>

//     </header>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   ChevronDown,
//   UserRound,
//   LogOut,
//   Settings,
//   Home,
//   Mail,
// } from "lucide-react";

// import NotificationBell from "./NotificationBell";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL || "http://localhost:1337";

// const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || `${STRAPI_URL}/api`;

// export default function Header({ headerData }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [search, setSearch] = useState(searchParams.get("q") || "");

//   const [owner, setOwner] = useState(null);
//   const [ownerProfile, setOwnerProfile] = useState(null);

//   const [profileOpen, setProfileOpen] = useState(false);
//   const [loadingOwner, setLoadingOwner] = useState(true);

//   // =====================================================
//   // LOAD LOGGED-IN OWNER FROM STRAPI
//   // =====================================================

//   useEffect(() => {
//     const loadOwnerProfile = async () => {
//       try {
//         setLoadingOwner(true);

//         const token = localStorage.getItem("token");

//         if (!token) {
//           setOwner(null);
//           setOwnerProfile(null);
//           return;
//         }

//         // -------------------------------------------------
//         // 1. GET CURRENT LOGGED-IN USER
//         // -------------------------------------------------

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
//             currentUser?.error?.message || "Unable to load owner.",
//           );
//         }

//         setOwner(currentUser);

//         // -------------------------------------------------
//         // 2. GET USER PROFILE CONNECTED TO THIS USER
//         // -------------------------------------------------

//         const profileQuery =
//           `${API_URL}/user-profiles?` +
//           `filters[users_permissions_user][id][$eq]=${currentUser.id}` +
//           `&populate[ProfileDetails][populate]=*`;

//         const profileResponse = await fetch(profileQuery, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           cache: "no-store",
//         });

//         const profileResult = await profileResponse.json();

//         if (!profileResponse.ok) {
//           console.error("OWNER PROFILE ERROR:", profileResult);

//           setOwnerProfile(null);
//           return;
//         }

//         const profile = profileResult?.data?.[0] || null;

//         setOwnerProfile(profile);

//         console.log("CURRENT OWNER:", currentUser);

//         console.log("OWNER PROFILE:", profile);
//       } catch (error) {
//         console.error("LOAD OWNER PROFILE ERROR:", error);

//         setOwner(null);
//         setOwnerProfile(null);
//       } finally {
//         setLoadingOwner(false);
//       }
//     };

//     loadOwnerProfile();
//   }, []);

//   // =====================================================
//   // SEARCH
//   // =====================================================

//   function handleSearch(value) {
//     const text = value.trim();

//     setSearch(value);

//     if (!text) {
//       return;
//     }

//     router.push(`/search?q=${encodeURIComponent(text)}`);
//   }

//   // =====================================================
//   // OWNER PROFILE DATA
//   // =====================================================

//   const firstName = ownerProfile?.ProfileDetails?.FirstName || "";

//   const lastName = ownerProfile?.ProfileDetails?.LastName || "";

//   const profileName = `${firstName} ${lastName}`.trim();

//   const ownerName = profileName || owner?.username || "Owner";

//   const ownerEmail = owner?.email || "";

//   const profileImage = ownerProfile?.ProfileDetails?.ProfileImage;

//   const profileImageUrl = profileImage?.url
//     ? `${STRAPI_URL}${profileImage.url}`
//     : null;

//   const ownerInitial = ownerName.charAt(0).toUpperCase();

//   // =====================================================
//   // LOGOUT
//   // =====================================================

//   function handleLogout() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userRole");

//     setOwner(null);
//     setOwnerProfile(null);
//     setProfileOpen(false);

//     router.replace("/login");
//   }

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
//       <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
//         {/* =================================================
//             LOGO
//         ================================================= */}

//         <Link href="/" className="flex flex-shrink-0 items-center gap-3">
//           {headerData?.Logo?.url ? (
//             <Image
//               src={`${STRAPI_URL}${headerData.Logo.url}`}
//               alt="Logo"
//               width={45}
//               height={45}
//               className="rounded-lg border object-cover"
//               unoptimized
//             />
//           ) : (
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0F6678] text-white">
//               <Home size={21} />
//             </div>
//           )}

//           <h1 className="text-xl font-semibold text-gray-900">
//             {headerData?.Brand || "HomeHub"}
//           </h1>
//         </Link>

//         {/* =================================================
//             SEARCH
//         ================================================= */}

//         <div className="flex-1">
//           <input
//             type="text"
//             value={search}
//             placeholder={
//               headerData?.Search || "Search by Area, City, Category..."
//             }
//             onChange={(e) => {
//               const value = e.target.value;

//               setSearch(value);

//               if (value.trim() !== "") {
//                 router.push(`/search?q=${encodeURIComponent(value)}`);
//               }
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 handleSearch(search);
//               }
//             }}
//             className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#0F6678] focus:ring-2 focus:ring-[#0F6678]/20"
//           />
//         </div>

//         {/* =================================================
//             RIGHT SIDE
//         ================================================= */}

//         <div className="flex items-center gap-4">
//           {/* NOTIFICATION */}

//           <NotificationBell />

//           {/* =================================================
//               OWNER PROFILE DROPDOWN
//           ================================================= */}

//           <div className="relative">
//             <button
//               type="button"
//               onClick={() => setProfileOpen((previous) => !previous)}
//               className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-1.5 transition hover:border-[#0F6678] hover:bg-gray-50"
//             >
//               {/* PROFILE IMAGE */}

//               {profileImageUrl ? (
//                 <Image
//                   src={profileImageUrl}
//                   alt={ownerName}
//                   width={38}
//                   height={38}
//                   className="h-9 w-9 rounded-full object-cover"
//                   unoptimized
//                 />
//               ) : (
//                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9A441] font-bold text-[#073B4C]">
//                   {ownerInitial}
//                 </div>
//               )}

//               {/* OWNER NAME */}

//               <div className="hidden text-left sm:block">
//                 <p className="max-w-[120px] truncate text-sm font-semibold text-gray-900">
//                   {loadingOwner ? "Loading..." : ownerName}
//                 </p>

//                 <p className="text-xs text-gray-500">Owner</p>
//               </div>

//               <ChevronDown
//                 size={16}
//                 className={`text-gray-500 transition ${
//                   profileOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {/* =================================================
//                 DROPDOWN
//             ================================================= */}

//             {profileOpen && (
//               <div className="absolute right-0 top-full z-[100] mt-3 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
//                 {/* PROFILE HEADER */}

//                 <div className="border-b bg-gray-50 p-4">
//                   <div className="flex items-center gap-3">
//                     {profileImageUrl ? (
//                       <Image
//                         src={profileImageUrl}
//                         alt={ownerName}
//                         width={48}
//                         height={48}
//                         className="h-12 w-12 rounded-full object-cover"
//                         unoptimized
//                       />
//                     ) : (
//                       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D9A441] text-lg font-bold text-[#073B4C]">
//                         {ownerInitial}
//                       </div>
//                     )}

//                     <div className="min-w-0">
//                       <p className="truncate font-semibold text-gray-900">
//                         {ownerName}
//                       </p>

//                       <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
//                         <Mail size={13} />
//                         <span className="truncate">{ownerEmail}</span>
//                       </div>

//                       <p className="mt-1 text-xs font-medium text-[#0F6678]">
//                         Property Owner
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* MENU */}

//                 <div className="p-2">
//                   <Link
//                     href="/owner/profile"
//                     onClick={() => setProfileOpen(false)}
//                     className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
//                   >
//                     <UserRound size={18} className="text-[#0F6678]" />

//                     <span>My Profile</span>
//                   </Link>

//                   <Link
//                     href="/"
//                     onClick={() => setProfileOpen(false)}
//                     className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
//                   >
//                     <Home size={18} className="text-[#0F6678]" />

//                     <span>My Properties</span>
//                   </Link>

//                   <Link
//                     href="/owner/enquiries"
//                     onClick={() => setProfileOpen(false)}
//                     className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
//                   >
//                     <Mail size={18} className="text-[#0F6678]" />

//                     <span>My Enquiries</span>
//                   </Link>

//                   <Link
//                     href="/owner/settings"
//                     onClick={() => setProfileOpen(false)}
//                     className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
//                   >
//                     <Settings size={18} className="text-[#0F6678]" />

//                     <span>Settings</span>
//                   </Link>
//                 </div>

//                 {/* LOGOUT */}

//                 <div className="border-t p-2">
//                   <button
//                     type="button"
//                     onClick={handleLogout}
//                     className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
//                   >
//                     <LogOut size={18} />

//                     <span>Logout</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* =================================================
//               ADD PROPERTY
//           ================================================= */}

//           <Link href="/add-property">
//             <button className="rounded-lg bg-[#0F6678] px-5 py-3 font-semibold text-white transition hover:bg-[#0B5868]">
//               + Add Property
//             </button>
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   ChevronDown,
//   UserRound,
//   LogOut,
//   Home,
//   Mail,
//   Menu,
//   X,
//   Settings,
//   Building2,
//   MessageSquare,
// } from "lucide-react";

// import NotificationBell from "./NotificationBell";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL || "http://localhost:1337";

// const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || `${STRAPI_URL}/api`;

// export default function Header({ headerData }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [search, setSearch] = useState(searchParams.get("q") || "");

//   const [owner, setOwner] = useState(null);
//   const [ownerProfile, setOwnerProfile] = useState(null);

//   const [profileOpen, setProfileOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [loadingOwner, setLoadingOwner] = useState(true);

//   // =====================================================
//   // LOAD LOGGED-IN OWNER + PROFILE FROM STRAPI
//   // =====================================================

//   useEffect(() => {
//     let mounted = true;

//     async function loadOwnerProfile() {
//       try {
//         setLoadingOwner(true);

//         const token = localStorage.getItem("token");

//         if (!token) {
//           if (mounted) {
//             setOwner(null);
//             setOwnerProfile(null);
//           }
//           return;
//         }

//         // -------------------------------------------------
//         // 1. CURRENT USER
//         // -------------------------------------------------

//         const userResponse = await fetch(`${API_URL}/users/me`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           cache: "no-store",
//         });

//         const currentUser = await userResponse.json().catch(() => null);

//         if (!userResponse.ok) {
//           throw new Error(
//             currentUser?.error?.message || "Unable to load Owner.",
//           );
//         }

//         if (!mounted) return;

//         setOwner(currentUser);

//         // -------------------------------------------------
//         // 2. USER PROFILE
//         // -------------------------------------------------

//         const profileQuery =
//           `${API_URL}/user-profiles?` +
//           `filters[users_permissions_user][id][$eq]=${currentUser.id}` +
//           `&populate[ProfileDetails][populate]=*`;

//         const profileResponse = await fetch(profileQuery, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           cache: "no-store",
//         });

//         const profileResult = await profileResponse.json().catch(() => null);

//         if (!profileResponse.ok) {
//           console.error("OWNER PROFILE ERROR:", profileResult);

//           if (mounted) {
//             setOwnerProfile(null);
//           }

//           return;
//         }

//         const profile = profileResult?.data?.[0] || null;

//         if (mounted) {
//           setOwnerProfile(profile);
//         }

//         console.log("CURRENT OWNER:", currentUser);
//         console.log("OWNER PROFILE:", profile);
//       } catch (error) {
//         console.error("LOAD OWNER PROFILE ERROR:", error);

//         if (mounted) {
//           setOwner(null);
//           setOwnerProfile(null);
//         }
//       } finally {
//         if (mounted) {
//           setLoadingOwner(false);
//         }
//       }
//     }

//     loadOwnerProfile();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // =====================================================
//   // STRAPI OWNER PROFILE MENU
//   // =====================================================

//   const ownerMenuItems = useMemo(() => {
//     const menu =
//       headerData?.OwnerProfileMenu || headerData?.OwnerProfileMenu?.data || [];

//     if (!Array.isArray(menu)) {
//       return [];
//     }

//     return [...menu]
//       .filter((item) => {
//         return item?.IsActive !== false && item?.isActive !== false;
//       })
//       .sort((a, b) => {
//         const orderA = Number(a?.DisplayOrder ?? a?.displayOrder ?? 999) || 999;

//         const orderB = Number(b?.DisplayOrder ?? b?.displayOrder ?? 999) || 999;

//         return orderA - orderB;
//       });
//   }, [headerData]);

//   // =====================================================
//   // SEARCH
//   // =====================================================

//   function handleSearch(value) {
//     const text = value.trim();

//     setSearch(value);

//     if (!text) {
//       router.push("/search");
//       return;
//     }

//     router.push(`/search?q=${encodeURIComponent(text)}`);

//     setMobileMenuOpen(false);
//   }

//   // =====================================================
//   // OWNER PROFILE DATA
//   // =====================================================

//   const firstName = ownerProfile?.ProfileDetails?.FirstName || "";

//   const lastName = ownerProfile?.ProfileDetails?.LastName || "";

//   const profileName = `${firstName} ${lastName}`.trim();

//   const ownerName = profileName || owner?.username || "Owner";

//   const ownerEmail = owner?.email || "";

//   const profileImage = ownerProfile?.ProfileDetails?.ProfileImage;

//   const profileImageUrl = profileImage?.url
//     ? `${STRAPI_URL}${profileImage.url}`
//     : null;

//   const ownerInitial = ownerName.charAt(0).toUpperCase();

//   // =====================================================
//   // ICON HELPER
//   // =====================================================

//   function renderMenuIcon(iconName) {
//     const icon = String(iconName || "")
//       .trim()
//       .toLowerCase();

//     const iconClass = "h-[18px] w-[18px]";

//     switch (icon) {
//       case "user":
//       case "profile":
//         return <UserRound className={iconClass} />;

//       case "home":
//       case "properties":
//         return <Building2 className={iconClass} />;

//       case "mail":
//       case "message":
//       case "enquiry":
//       case "enquiries":
//         return <MessageSquare className={iconClass} />;

//       case "settings":
//         return <Settings className={iconClass} />;

//       default:
//         return <UserRound className={iconClass} />;
//     }
//   }

//   // =====================================================
//   // LOGOUT
//   // =====================================================

//   function handleLogout() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userRole");

//     setOwner(null);
//     setOwnerProfile(null);

//     setProfileOpen(false);
//     setMobileMenuOpen(false);

//     router.replace("/login");
//   }

//   // =====================================================
//   // CLOSE ALL MENUS
//   // =====================================================

//   function closeMenus() {
//     setProfileOpen(false);
//     setMobileMenuOpen(false);
//   }

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-[0_4px_20px_rgba(15,102,120,0.08)] backdrop-blur">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6">
//         <div className="flex min-h-[74px] items-center gap-3 lg:gap-5">
//           {/* =================================================
//               LOGO
//           ================================================= */}

//           <Link
//             href="/"
//             onClick={closeMenus}
//             className="flex shrink-0 items-center gap-3"
//           >
//             {headerData?.Logo?.url ? (
//               <Image
//                 src={`${STRAPI_URL}${headerData.Logo.url}`}
//                 alt={headerData?.Brand || "HomeHub"}
//                 width={44}
//                 height={44}
//                 className="h-10 w-10 rounded-xl border border-slate-200 object-cover shadow-sm sm:h-11 sm:w-11"
//                 unoptimized
//               />
//             ) : (
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F6678] text-white shadow-sm sm:h-11 sm:w-11">
//                 <Home size={20} />
//               </div>
//             )}

//             <div className="hidden sm:block">
//               <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
// //                 {headerData?.Brand || "HomeHub"}
// //               </h1>

// //               <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#0F6678]">
// //                 Owner Portal
// //               </p>
// //             </div>
// //           </Link>

// //           {/* =================================================
// //               SEARCH
// //           ================================================= */}

//           <div className="flex min-w-0 flex-1">
//             <div className="relative w-full">
//               <input
//                 type="text"
//                 value={search}
//                 placeholder={
//                   headerData?.Search || "Search by Area, City, Category..."
//                 }
//                 onChange={(e) => {
//                   const value = e.target.value;

//                   setSearch(value);

//                   if (value.trim() !== "") {
//                     router.push(`/search?q=${encodeURIComponent(value)}`);
//                   }
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     handleSearch(search);
//                   }
//                 }}
//                 className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0F6678] focus:bg-white focus:ring-4 focus:ring-[#0F6678]/10"
//               />
//             </div>
//           </div>

//           {/* =================================================
//               DESKTOP RIGHT SIDE
//           ================================================= */}

//           <div className="hidden items-center gap-3 lg:flex">
//             {/* Notification */}

//             <div className="rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
//               <NotificationBell />
//             </div>

//             {/* =================================================
//                 OWNER PROFILE
//             ================================================= */}

//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => setProfileOpen((previous) => !previous)}
//                 className={`group flex items-center gap-2 rounded-2xl border px-2 py-1.5 transition ${
//                   profileOpen
//                     ? "border-[#0F6678] bg-[#F2F8F9]"
//                     : "border-slate-200 bg-white hover:border-[#0F6678] hover:bg-slate-50"
//                 }`}
//               >
//                 {profileImageUrl ? (
//                   <Image
//                     src={profileImageUrl}
//                     alt={ownerName}
//                     width={38}
//                     height={38}
//                     className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
//                     unoptimized
//                   />
//                 ) : (
//                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9A441] font-bold text-[#073B4C]">
//                     {ownerInitial}
//                   </div>
//                 )}

//                 <div className="max-w-[125px] text-left">
//                   <p className="truncate text-sm font-semibold text-slate-900">
//                     {loadingOwner ? "Loading..." : ownerName}
//                   </p>

//                   <p className="text-[11px] font-medium text-[#0F6678]">
//                     Property Owner
//                   </p>
//                 </div>

//                 <ChevronDown
//                   size={16}
//                   className={`text-slate-500 transition-transform duration-200 ${
//                     profileOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {/* =================================================
//                   DESKTOP DROPDOWN
//               ================================================= */}

//               {profileOpen && (
//                 <div className="absolute right-0 top-full mt-3 w-[310px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
//                   {/* Profile Header */}

//                   <div className="border-b border-slate-100 bg-gradient-to-r from-[#F1F8F9] to-[#FFFBF2] p-4">
//                     <div className="flex items-center gap-3">
//                       {profileImageUrl ? (
//                         <Image
//                           src={profileImageUrl}
//                           alt={ownerName}
//                           width={52}
//                           height={52}
//                           className="h-[52px] w-[52px] rounded-full object-cover ring-4 ring-white shadow-sm"
//                           unoptimized
//                         />
//                       ) : (
//                         <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#D9A441] text-xl font-bold text-[#073B4C] ring-4 ring-white shadow-sm">
//                           {ownerInitial}
//                         </div>
//                       )}

//                       <div className="min-w-0">
//                         <p className="truncate text-sm font-bold text-slate-900">
//                           {ownerName}
//                         </p>

//                         <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
//                           <Mail size={13} />

//                           <span className="truncate">{ownerEmail}</span>
//                         </div>

//                         <span className="mt-2 inline-flex rounded-full bg-[#0F6678]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0F6678]">
//                           Owner Account
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Strapi Menu */}

//                   <div className="p-2">
//                     {ownerMenuItems.length > 0 ? (
//                       ownerMenuItems.map((item, index) => {
//                         const title = item?.Title || item?.title || "Menu";

//                         const url = item?.Url || item?.URL || item?.url || "#";

//                         const icon = item?.Icon || item?.icon || "";

//                         return (
//                           <Link
//                             key={`${title}-${index}`}
//                             href={url}
//                             onClick={() => {
//                               closeMenus();
//                             }}
//                             className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#F2F8F9] hover:text-[#0F6678]"
//                           >
//                             <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#0F6678] transition group-hover:bg-white">
//                               {renderMenuIcon(icon)}
//                             </span>

//                             <span className="flex-1">{title}</span>

//                             <span className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0F6678]">
//                               →
//                             </span>
//                           </Link>
//                         );
//                       })
//                     ) : (
//                       <>
//                         <Link
//                           href="/owner/profile"
//                           onClick={closeMenus}
//                           className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                         >
//                           <UserRound size={18} className="text-[#0F6678]" />
//                           My Profile
//                         </Link>

//                         <Link
//                           href="/"
//                           onClick={closeMenus}
//                           className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                         >
//                           <Building2 size={18} className="text-[#0F6678]" />
//                           My Properties
//                         </Link>

//                         <Link
//                           href="/owner/enquiries"
//                           onClick={closeMenus}
//                           className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                         >
//                           <MessageSquare size={18} className="text-[#0F6678]" />
//                           My Enquiries
//                         </Link>

//                         <Link
//                           href="/owner/settings"
//                           onClick={closeMenus}
//                           className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                         >
//                           <Settings size={18} className="text-[#0F6678]" />
//                           Settings
//                         </Link>
//                       </>
//                     )}
//                   </div>

//                   {/* Logout */}

//                   <div className="border-t border-slate-100 p-2">
//                     <button
//                       type="button"
//                       onClick={handleLogout}
//                       className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
//                     >
//                       <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
//                         <LogOut size={18} />
//                       </span>
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Add Property */}

//             <Link href="/add-property">
//               <button className="whitespace-nowrap rounded-xl bg-[#0F6678] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#0B5868] hover:shadow-md">
//                 + Add Property
//               </button>
//             </Link>
//           </div>

//           {/* =================================================
//               MOBILE MENU BUTTON
//           ================================================= */}

//           <div className="flex items-center gap-2 lg:hidden">
//             <div className="rounded-xl border border-slate-200 bg-white p-1">
//               <NotificationBell />
//             </div>

//             <button
//               type="button"
//               onClick={() => setMobileMenuOpen((previous) => !previous)}
//               className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-[#0F6678] hover:text-[#0F6678]"
//               aria-label="Open menu"
//             >
//               {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
//             </button>
//           </div>
//         </div>

//         {/* =================================================
//             MOBILE MENU
//         ================================================= */}

//         {mobileMenuOpen && (
//           <div className="border-t border-slate-100 py-4 lg:hidden">
//             {/* Mobile Owner */}

//             <div className="mb-4 rounded-2xl bg-gradient-to-r from-[#F1F8F9] to-[#FFFBF2] p-4">
//               <div className="flex items-center gap-3">
//                 {profileImageUrl ? (
//                   <Image
//                     src={profileImageUrl}
//                     alt={ownerName}
//                     width={46}
//                     height={46}
//                     className="h-[46px] w-[46px] rounded-full object-cover ring-2 ring-white"
//                     unoptimized
//                   />
//                 ) : (
//                   <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#D9A441] font-bold text-[#073B4C] ring-2 ring-white">
//                     {ownerInitial}
//                   </div>
//                 )}

//                 <div className="min-w-0">
//                   <p className="truncate font-bold text-slate-900">
//                     {loadingOwner ? "Loading..." : ownerName}
//                   </p>

//                   <p className="truncate text-xs text-slate-500">
//                     {ownerEmail}
//                   </p>

//                   <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#0F6678]">
//                     Property Owner
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Search */}

//             <div className="mb-4">
//               <input
//                 type="text"
//                 value={search}
//                 placeholder={
//                   headerData?.Search || "Search by Area, City, Category..."
//                 }
//                 onChange={(e) => setSearch(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     handleSearch(search);
//                   }
//                 }}
//                 className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6678] focus:ring-4 focus:ring-[#0F6678]/10"
//               />
//             </div>

//             {/* Mobile Strapi Menu */}

//             <div className="space-y-1">
//               {ownerMenuItems.length > 0 ? (
//                 ownerMenuItems.map((item, index) => {
//                   const title = item?.Title || item?.title || "Menu";

//                   const url = item?.Url || item?.URL || item?.url || "#";

//                   const icon = item?.Icon || item?.icon || "";

//                   return (
//                     <Link
//                       key={`${title}-mobile-${index}`}
//                       href={url}
//                       onClick={closeMenus}
//                       className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-[#F2F8F9] hover:text-[#0F6678]"
//                     >
//                       <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#0F6678]">
//                         {renderMenuIcon(icon)}
//                       </span>

//                       {title}
//                     </Link>
//                   );
//                 })
//               ) : (
//                 <>
//                   <Link
//                     href="/owner/profile"
//                     onClick={closeMenus}
//                     className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                   >
//                     <UserRound size={18} className="text-[#0F6678]" />
//                     My Profile
//                   </Link>

//                   <Link
//                     href="/"
//                     onClick={closeMenus}
//                     className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                   >
//                     <Building2 size={18} className="text-[#0F6678]" />
//                     My Properties
//                   </Link>

//                   <Link
//                     href="/owner/enquiries"
//                     onClick={closeMenus}
//                     className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                   >
//                     <MessageSquare size={18} className="text-[#0F6678]" />
//                     My Enquiries
//                   </Link>

//                   <Link
//                     href="/owner/settings"
//                     onClick={closeMenus}
//                     className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
//                   >
//                     <Settings size={18} className="text-[#0F6678]" />
//                     Settings
//                   </Link>
//                 </>
//               )}
//             </div>

//             {/* Mobile Add Property */}

//             <Link
//               href="/add-property"
//               onClick={closeMenus}
//               className="mt-4 block"
//             >
//               <button className="w-full rounded-xl bg-[#0F6678] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B5868]">
//                 + Add Property
//               </button>
//             </Link>

//             {/* Mobile Logout */}

//             <button
//               type="button"
//               onClick={handleLogout}
//               className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-3.5 text-sm font-semibold text-red-600"
//             >
//               <LogOut size={17} />
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// // }
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   usePathname,
//   useRouter,
//   useSearchParams,
// } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";

// import {
//   Home,
//   Building2,
//   MessageSquare,
//   CalendarDays,
//   BarChart3,
//   Tag,
//   UserRound,
//   Settings,
//   LogOut,
//   ChevronDown,
//   Menu,
//   X,
//   Search,
//   Mail,
// } from "lucide-react";

// import NotificationBell from "./NotificationBell";

// /* =========================================================
//    STRAPI
// ========================================================= */

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
//   "http://localhost:1337";

// const API_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL ||
//   `${STRAPI_URL}/api`;

// /* =========================================================
//    HEADER
// ========================================================= */

// export default function Header({ headerData }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   /* =======================================================
//      STATES
//   ======================================================= */

//   const [search, setSearch] = useState(
//     searchParams.get("q") || ""
//   );

//   const [owner, setOwner] = useState(null);
//   const [ownerProfile, setOwnerProfile] = useState(null);

//   const [profileOpen, setProfileOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const [loadingOwner, setLoadingOwner] = useState(true);

//   /* =======================================================
//      LOAD LOGGED-IN OWNER
//   ======================================================= */

//   useEffect(() => {
//     let mounted = true;

//     async function loadOwnerProfile() {
//       try {
//         setLoadingOwner(true);

//         const token = localStorage.getItem("token");

//         if (!token) {
//           if (mounted) {
//             setOwner(null);
//             setOwnerProfile(null);
//           }

//           return;
//         }

//         /* ---------------------------------------------------
//            CURRENT USER
//         --------------------------------------------------- */

//         const userResponse = await fetch(
//           `${API_URL}/users/me`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             cache: "no-store",
//           }
//         );

//         const currentUser =
//           await userResponse.json().catch(() => null);

//         if (!userResponse.ok) {
//           throw new Error(
//             currentUser?.error?.message ||
//               "Unable to load Owner."
//           );
//         }

//         if (!mounted) return;

//         setOwner(currentUser);

//         /* ---------------------------------------------------
//            OWNER PROFILE
//         --------------------------------------------------- */

//         const profileQuery =
//           `${API_URL}/user-profiles?` +
//           `filters[users_permissions_user][id][$eq]=${currentUser.id}` +
//           `&populate[ProfileDetails][populate]=*`;

//         const profileResponse = await fetch(
//           profileQuery,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             cache: "no-store",
//           }
//         );

//         const profileResult =
//           await profileResponse.json().catch(() => null);

//         if (!profileResponse.ok) {
//           console.error(
//             "OWNER PROFILE ERROR:",
//             profileResult
//           );

//           if (mounted) {
//             setOwnerProfile(null);
//           }

//           return;
//         }

//         const profile =
//           profileResult?.data?.[0] || null;

//         if (mounted) {
//           setOwnerProfile(profile);
//         }

//         console.log("CURRENT OWNER:", currentUser);
//         console.log("OWNER PROFILE:", profile);
//       } catch (error) {
//         console.error(
//           "LOAD OWNER PROFILE ERROR:",
//           error
//         );

//         if (mounted) {
//           setOwner(null);
//           setOwnerProfile(null);
//         }
//       } finally {
//         if (mounted) {
//           setLoadingOwner(false);
//         }
//       }
//     }

//     loadOwnerProfile();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   /* =======================================================
//      STRAPI OWNER NAVIGATION
//   ======================================================= */

//   const ownerNavItems = useMemo(() => {
//     const nav =
//       headerData?.OwnerNavItem ||
//       headerData?.OwnerNavItem?.data ||
//       [];

//     if (!Array.isArray(nav)) {
//       return [];
//     }

//     return [...nav]
//       .filter((item) => {
//         return (
//           item?.IsActive !== false &&
//           item?.isActive !== false
//         );
//       })
//       .sort((a, b) => {
//         const orderA =
//           Number(
//             a?.DisplayOrder ??
//               a?.displayOrder ??
//               999
//           ) || 999;

//         const orderB =
//           Number(
//             b?.DisplayOrder ??
//               b?.displayOrder ??
//               999
//           ) || 999;

//         return orderA - orderB;
//       });
//   }, [headerData]);

//   /* =======================================================
//      STRAPI OWNER PROFILE MENU
//   ======================================================= */

//   const ownerMenuItems = useMemo(() => {
//     const menu =
//       headerData?.OwnerProfileMenu ||
//       headerData?.OwnerProfileMenu?.data ||
//       [];

//     if (!Array.isArray(menu)) {
//       return [];
//     }

//     return [...menu]
//       .filter((item) => {
//         return (
//           item?.IsActive !== false &&
//           item?.isActive !== false
//         );
//       })
//       .sort((a, b) => {
//         const orderA =
//           Number(
//             a?.DisplayOrder ??
//               a?.displayOrder ??
//               999
//           ) || 999;

//         const orderB =
//           Number(
//             b?.DisplayOrder ??
//               b?.displayOrder ??
//               999
//           ) || 999;

//         return orderA - orderB;
//       });
//   }, [headerData]);

//   /* =======================================================
//      OWNER DATA
//   ======================================================= */

//   const firstName =
//     ownerProfile?.ProfileDetails?.FirstName || "";

//   const lastName =
//     ownerProfile?.ProfileDetails?.LastName || "";

//   const profileName =
//     `${firstName} ${lastName}`.trim();

//   const ownerName =
//     profileName ||
//     owner?.username ||
//     "Owner";

//   const ownerEmail =
//     owner?.email || "";

//   const profileImage =
//     ownerProfile?.ProfileDetails?.ProfileImage;

//   const profileImageUrl =
//     profileImage?.url
//       ? `${STRAPI_URL}${profileImage.url}`
//       : null;

//   const ownerInitial =
//     ownerName.charAt(0).toUpperCase();

//   /* =======================================================
//      ICON HELPER
//   ======================================================= */

//   function renderIcon(iconName) {
//     const icon = String(iconName || "")
//       .trim()
//       .toLowerCase()
//       .replace(/[-_\s]/g, "");

//     const className = "h-[17px] w-[17px]";

//     switch (icon) {
//       case "home":
//       case "dashboard":
//         return <Home className={className} />;

//       case "building":
//       case "building2":
//       case "property":
//       case "properties":
//       case "myproperties":
//         return (
//           <Building2 className={className} />
//         );

//       case "message":
//       case "messages":
//       case "enquiry":
//       case "enquiries":
//         return (
//           <MessageSquare className={className} />
//         );

//       case "calendar":
//       case "visit":
//       case "visits":
//       case "sitevisit":
//       case "sitevisits":
//         return (
//           <CalendarDays className={className} />
//         );

//       case "chart":
//       case "analytics":
//       case "insights":
//       case "bar":
//         return (
//           <BarChart3 className={className} />
//         );

//       case "tag":
//       case "promotion":
//       case "promotions":
//         return <Tag className={className} />;

//       case "user":
//       case "profile":
//         return (
//           <UserRound className={className} />
//         );

//       case "settings":
//         return (
//           <Settings className={className} />
//         );

//       default:
//         return <Home className={className} />;
//     }
//   }

//   /* =======================================================
//      SEARCH
//   ======================================================= */

//   function handleSearch(value) {
//     const text = value.trim();

//     setSearch(value);

//     if (!text) {
//       router.push("/search");
//       return;
//     }

//     router.push(
//       `/search?q=${encodeURIComponent(text)}`
//     );

//     setMobileMenuOpen(false);
//   }

//   /* =======================================================
//      LOGOUT
//   ======================================================= */

//   function handleLogout() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userRole");

//     setOwner(null);
//     setOwnerProfile(null);

//     setProfileOpen(false);
//     setMobileMenuOpen(false);

//     router.replace("/login");
//   }

//   /* =======================================================
//      CLOSE MENUS
//   ======================================================= */

//   function closeMenus() {
//     setProfileOpen(false);
//     setMobileMenuOpen(false);
//   }

//   /* =======================================================
//      ACTIVE NAV
//   ======================================================= */

//   function isActive(url) {
//     if (!url || url === "#") {
//       return false;
//     }

//     if (url === "/") {
//       return pathname === "/";
//     }

//     return (
//       pathname === url ||
//       pathname?.startsWith(`${url}/`)
//     );
//   }

//   /* =======================================================
//      UI
//   ======================================================= */

//   return (
//     <header
//       className="
//         sticky top-0 z-50
//         border-b border-[#2f6653]
//         bg-[#123F32]
//         shadow-[0_8px_30px_rgba(18,63,50,0.22)]
//       "
//     >
//       <div className="mx-auto max-w-[1450px] px-4 sm:px-6">

//         {/* =================================================
//             MAIN HEADER
//         ================================================= */}

//         <div
//           className="
//             flex min-h-[76px]
//             items-center
//             gap-3
//             lg:gap-5
//           "
//         >

//           {/* =================================================
//               LOGO
//           ================================================= */}

//           <Link
//             href="/"
//             onClick={closeMenus}
//             className="
//               group
//               flex
//               shrink-0
//               items-center
//               gap-3
//             "
//           >
//             {headerData?.Logo?.url ? (
//               <div
//                 className="
//                   relative
//                   flex
//                   h-11
//                   w-11
//                   items-center
//                   justify-center
//                   overflow-hidden
//                   rounded-xl
//                   border
//                   border-[#D7AE62]/50
//                   bg-[#F2E6CF]
//                   shadow-[0_4px_15px_rgba(0,0,0,0.18)]
//                 "
//               >
//                 <Image
//                   src={`${STRAPI_URL}${headerData.Logo.url}`}
//                   alt={
//                     headerData?.Brand ||
//                     "HomeHub"
//                   }
//                   width={44}
//                   height={44}
//                   className="
//                     h-full
//                     w-full
//                     object-cover
//                   "
//                   unoptimized
//                 />
//               </div>
//             ) : (
//               <div
//                 className="
//                   flex
//                   h-11
//                   w-11
//                   items-center
//                   justify-center
//                   rounded-xl
//                   border
//                   border-[#D7AE62]/50
//                   bg-[#D7AE62]
//                   text-[#123F32]
//                   shadow-[0_4px_15px_rgba(0,0,0,0.18)]
//                 "
//               >
//                 <Home size={22} />
//               </div>
//             )}

//             <div className="hidden sm:block">
//               <h1
//                 className="
//                   text-[17px]
//                   font-extrabold
//                   tracking-tight
//                   text-[#F7F0E3]
//                 "
//               >
//                 {headerData?.Brand ||
//                   "HomeHub"}
//               </h1>

//               <p
//                 className="
//                   mt-0.5
//                   text-[9px]
//                   font-bold
//                   uppercase
//                   tracking-[0.22em]
//                   text-[#D7AE62]
//                 "
//               >
//                 Owner Portal
//               </p>
//             </div>
//           </Link>

//           {/* =================================================
//               DESKTOP NAVIGATION
//           ================================================= */}

//           <nav
//             className="
//               hidden
//               min-w-0
//               flex-1
//               items-center
//               justify-center
//               lg:flex
//             "
//           >
//             <div
//               className="
//                 flex
//                 items-center
//                 gap-1
//                 rounded-2xl
//                 border
//                 border-[#2D604F]
//                 bg-[#0E382D]/60
//                 p-1
//               "
//             >
//               {ownerNavItems.length > 0 ? (
//                 ownerNavItems.map(
//                   (item, index) => {
//                     const title =
//                       item?.Title ||
//                       item?.title ||
//                       "Menu";

//                     const url =
//                       item?.Url ||
//                       item?.URL ||
//                       item?.url ||
//                       "#";

//                     const icon =
//                       item?.Icon ||
//                       item?.icon ||
//                       "";

//                     const active =
//                       isActive(url);

//                     return (
//                       <Link
//                         key={`${title}-${index}`}
//                         href={url}
//                         onClick={closeMenus}
//                         className={`
//                           group
//                           relative
//                           flex
//                           items-center
//                           gap-2
//                           rounded-xl
//                           px-3
//                           py-2.5
//                           text-[12px]
//                           font-semibold
//                           transition-all
//                           duration-200

//                           ${
//                             active
//                               ? `
//                                 bg-[#D7AE62]
//                                 text-[#123F32]
//                                 shadow-[0_4px_14px_rgba(215,174,98,0.22)]
//                               `
//                               : `
//                                 text-[#DDE9E1]
//                                 hover:bg-[#1B4F3F]
//                                 hover:text-[#F3D59B]
//                               `
//                           }
//                         `}
//                       >
//                         <span
//                           className={`
//                             transition-transform
//                             duration-200
//                             group-hover:scale-110
//                           `}
//                         >
//                           {renderIcon(icon)}
//                         </span>

//                         <span className="whitespace-nowrap">
//                           {title}
//                         </span>
//                       </Link>
//                     );
//                   }
//                 )
//               ) : (
//                 <>
//                   {/* FALLBACK NAV */}

//                   <Link
//                     href="/owner"
//                     className="
//                       flex items-center gap-2
//                       rounded-xl
//                       bg-[#D7AE62]
//                       px-3 py-2.5
//                       text-[12px]
//                       font-semibold
//                       text-[#123F32]
//                     "
//                   >
//                     <Home size={17} />
//                     Home
//                   </Link>

//                   <Link
//                     href="/owner/properties"
//                     className="
//                       flex items-center gap-2
//                       rounded-xl
//                       px-3 py-2.5
//                       text-[12px]
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B4F3F]
//                       hover:text-[#F3D59B]
//                     "
//                   >
//                     <Building2 size={17} />
//                     My Properties
//                   </Link>

//                   <Link
//                     href="/owner/enquiries"
//                     className="
//                       flex items-center gap-2
//                       rounded-xl
//                       px-3 py-2.5
//                       text-[12px]
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B4F3F]
//                       hover:text-[#F3D59B]
//                     "
//                   >
//                     <MessageSquare size={17} />
//                     Enquiries
//                   </Link>

//                   <Link
//                     href="/owner/site-visits"
//                     className="
//                       flex items-center gap-2
//                       rounded-xl
//                       px-3 py-2.5
//                       text-[12px]
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B4F3F]
//                       hover:text-[#F3D59B]
//                     "
//                   >
//                     <CalendarDays size={17} />
//                     Site Visits
//                   </Link>

//                   <Link
//                     href="/owner/insights"
//                     className="
//                       flex items-center gap-2
//                       rounded-xl
//                       px-3 py-2.5
//                       text-[12px]
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B4F3F]
//                       hover:text-[#F3D59B]
//                     "
//                   >
//                     <BarChart3 size={17} />
//                     Insights
//                   </Link>

//                   <Link
//                     href="/owner/promotions"
//                     className="
//                       flex items-center gap-2
//                       rounded-xl
//                       px-3 py-2.5
//                       text-[12px]
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B4F3F]
//                       hover:text-[#F3D59B]
//                     "
//                   >
//                     <Tag size={17} />
//                     Promotions
//                   </Link>
//                 </>
//               )}
//             </div>
//           </nav>

//           {/* =================================================
//               RIGHT SIDE
//           ================================================= */}

//           <div
//             className="
//               ml-auto
//               flex
//               items-center
//               gap-2
//               lg:gap-3
//             "
//           >

//             {/* SEARCH - DESKTOP */}

//             <div className="hidden xl:block">
//               <div
//                 className="
//                   relative
//                   w-[230px]
//                 "
//               >
//                 <Search
//                   size={16}
//                   className="
//                     absolute
//                     left-3.5
//                     top-1/2
//                     -translate-y-1/2
//                     text-[#7A8F84]
//                   "
//                 />

//                 <input
//                   type="text"
//                   value={search}
//                   placeholder={
//                     headerData?.Search ||
//                     "Search properties..."
//                   }
//                   onChange={(e) => {
//                     setSearch(e.target.value);
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       handleSearch(search);
//                     }
//                   }}
//                   className="
//                     w-full
//                     rounded-xl
//                     border
//                     border-[#416C5C]
//                     bg-[#F2E9D9]
//                     py-2.5
//                     pl-9
//                     pr-3
//                     text-xs
//                     text-[#173F35]
//                     outline-none
//                     transition
//                     placeholder:text-[#809187]
//                     focus:border-[#D7AE62]
//                     focus:ring-2
//                     focus:ring-[#D7AE62]/20
//                   "
//                 />
//               </div>
//             </div>

//             {/* NOTIFICATION */}

//             <div
//               className="
//                 flex
//                 h-10
//                 w-10
//                 items-center
//                 justify-center
//                 rounded-xl
//                 border
//                 border-[#416C5C]
//                 bg-[#174B3B]
//                 text-[#F4E8D1]
//                 transition
//                 hover:border-[#D7AE62]
//                 hover:text-[#F3D59B]
//               "
//             >
//               <NotificationBell />
//             </div>

//             {/* =================================================
//                 PROFILE
//             ================================================= */}

//             <div className="relative hidden lg:block">

//               <button
//                 type="button"
//                 onClick={() =>
//                   setProfileOpen(
//                     (previous) => !previous
//                   )
//                 }
//                 className={`
//                   group
//                   flex
//                   items-center
//                   gap-2
//                   rounded-xl
//                   border
//                   px-2
//                   py-1.5
//                   transition-all
//                   duration-200

//                   ${
//                     profileOpen
//                       ? `
//                         border-[#D7AE62]
//                         bg-[#1B513F]
//                       `
//                       : `
//                         border-[#416C5C]
//                         bg-[#174B3B]
//                         hover:border-[#D7AE62]
//                         hover:bg-[#1B513F]
//                       `
//                   }
//                 `}
//               >

//                 {profileImageUrl ? (
//                   <Image
//                     src={profileImageUrl}
//                     alt={ownerName}
//                     width={36}
//                     height={36}
//                     className="
//                       h-9
//                       w-9
//                       rounded-full
//                       object-cover
//                       ring-2
//                       ring-[#D7AE62]/50
//                     "
//                     unoptimized
//                   />
//                 ) : (
//                   <div
//                     className="
//                       flex
//                       h-9
//                       w-9
//                       items-center
//                       justify-center
//                       rounded-full
//                       bg-[#D7AE62]
//                       font-bold
//                       text-[#123F32]
//                     "
//                   >
//                     {ownerInitial}
//                   </div>
//                 )}

//                 <div className="max-w-[105px] text-left">
//                   <p
//                     className="
//                       truncate
//                       text-xs
//                       font-bold
//                       text-[#F7F0E3]
//                     "
//                   >
//                     {loadingOwner
//                       ? "Loading..."
//                       : ownerName}
//                   </p>

//                   <p
//                     className="
//                       text-[9px]
//                       font-medium
//                       uppercase
//                       tracking-wider
//                       text-[#D7AE62]
//                     "
//                   >
//                     Property Owner
//                   </p>
//                 </div>

//                 <ChevronDown
//                   size={15}
//                   className={`
//                     text-[#C8D8CF]
//                     transition-transform
//                     duration-200
//                     ${
//                       profileOpen
//                         ? "rotate-180"
//                         : ""
//                     }
//                   `}
//                 />
//               </button>

//               {/* =================================================
//                   PROFILE DROPDOWN
//               ================================================= */}

//               {profileOpen && (
//                 <div
//                   className="
//                     absolute
//                     right-0
//                     top-full
//                     mt-3
//                     w-[300px]
//                     overflow-hidden
//                     rounded-2xl
//                     border
//                     border-[#D5C6AA]
//                     bg-[#F4EBDD]
//                     shadow-[0_22px_60px_rgba(18,63,50,0.28)]
//                   "
//                 >

//                   {/* PROFILE HEADER */}

//                   <div
//                     className="
//                       border-b
//                       border-[#D8C9AE]
//                       bg-[#E9DDC7]
//                       p-4
//                     "
//                   >
//                     <div
//                       className="
//                         flex
//                         items-center
//                         gap-3
//                       "
//                     >

//                       {profileImageUrl ? (
//                         <Image
//                           src={profileImageUrl}
//                           alt={ownerName}
//                           width={52}
//                           height={52}
//                           className="
//                             h-[52px]
//                             w-[52px]
//                             rounded-full
//                             object-cover
//                             ring-4
//                             ring-[#F4EBDD]
//                           "
//                           unoptimized
//                         />
//                       ) : (
//                         <div
//                           className="
//                             flex
//                             h-[52px]
//                             w-[52px]
//                             items-center
//                             justify-center
//                             rounded-full
//                             bg-[#D7AE62]
//                             text-xl
//                             font-bold
//                             text-[#123F32]
//                             ring-4
//                             ring-[#F4EBDD]
//                           "
//                         >
//                           {ownerInitial}
//                         </div>
//                       )}

//                       <div className="min-w-0">

//                         <p
//                           className="
//                             truncate
//                             text-sm
//                             font-extrabold
//                             text-[#173F35]
//                           "
//                         >
//                           {ownerName}
//                         </p>

//                         <div
//                           className="
//                             mt-1
//                             flex
//                             items-center
//                             gap-1.5
//                             text-xs
//                             text-[#69766F]
//                           "
//                         >
//                           <Mail size={13} />

//                           <span className="truncate">
//                             {ownerEmail}
//                           </span>
//                         </div>

//                         <span
//                           className="
//                             mt-2
//                             inline-flex
//                             rounded-full
//                             bg-[#174B3B]
//                             px-2.5
//                             py-1
//                             text-[9px]
//                             font-bold
//                             uppercase
//                             tracking-wider
//                             text-[#F4EBDD]
//                           "
//                         >
//                           Owner Account
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* MENU */}

//                   <div className="p-2">

//                     {ownerMenuItems.length > 0 ? (
//                       ownerMenuItems.map(
//                         (item, index) => {

//                           const title =
//                             item?.Title ||
//                             item?.title ||
//                             "Menu";

//                           const url =
//                             item?.Url ||
//                             item?.URL ||
//                             item?.url ||
//                             "#";

//                           const icon =
//                             item?.Icon ||
//                             item?.icon ||
//                             "";

//                           return (
//                             <Link
//                               key={`${title}-${index}`}
//                               href={url}
//                               onClick={closeMenus}
//                               className="
//                                 group
//                                 flex
//                                 items-center
//                                 gap-3
//                                 rounded-xl
//                                 px-3
//                                 py-2.5
//                                 text-sm
//                                 font-semibold
//                                 text-[#365247]
//                                 transition
//                                 hover:bg-[#E7D8BD]
//                                 hover:text-[#174B3B]
//                               "
//                             >
//                               <span
//                                 className="
//                                   flex
//                                   h-9
//                                   w-9
//                                   shrink-0
//                                   items-center
//                                   justify-center
//                                   rounded-lg
//                                   bg-[#E8DCC8]
//                                   text-[#A97928]
//                                   transition
//                                   group-hover:bg-[#D7AE62]
//                                   group-hover:text-[#123F32]
//                                 "
//                               >
//                                 {renderIcon(icon)}
//                               </span>

//                               <span className="flex-1">
//                                 {title}
//                               </span>

//                               <span
//                                 className="
//                                   text-[#9B8A70]
//                                   transition
//                                   group-hover:translate-x-1
//                                   group-hover:text-[#A97928]
//                                 "
//                               >
//                                 →
//                               </span>
//                             </Link>
//                           );
//                         }
//                       )
//                     ) : (
//                       <>
//                         <Link
//                           href="/owner/profile"
//                           onClick={closeMenus}
//                           className="
//                             flex
//                             items-center
//                             gap-3
//                             rounded-xl
//                             px-3
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-[#365247]
//                             hover:bg-[#E7D8BD]
//                           "
//                         >
//                           <UserRound
//                             size={18}
//                             className="text-[#A97928]"
//                           />
//                           My Profile
//                         </Link>

//                         <Link
//                           href="/owner/properties"
//                           onClick={closeMenus}
//                           className="
//                             flex
//                             items-center
//                             gap-3
//                             rounded-xl
//                             px-3
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-[#365247]
//                             hover:bg-[#E7D8BD]
//                           "
//                         >
//                           <Building2
//                             size={18}
//                             className="text-[#A97928]"
//                           />
//                           My Properties
//                         </Link>

//                         <Link
//                           href="/owner/enquiries"
//                           onClick={closeMenus}
//                           className="
//                             flex
//                             items-center
//                             gap-3
//                             rounded-xl
//                             px-3
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-[#365247]
//                             hover:bg-[#E7D8BD]
//                           "
//                         >
//                           <MessageSquare
//                             size={18}
//                             className="text-[#A97928]"
//                           />
//                           My Enquiries
//                         </Link>

//                         <Link
//                           href="/owner/settings"
//                           onClick={closeMenus}
//                           className="
//                             flex
//                             items-center
//                             gap-3
//                             rounded-xl
//                             px-3
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-[#365247]
//                             hover:bg-[#E7D8BD]
//                           "
//                         >
//                           <Settings
//                             size={18}
//                             className="text-[#A97928]"
//                           />
//                           Settings
//                         </Link>
//                       </>
//                     )}
//                   </div>

//                   {/* LOGOUT */}

//                   <div
//                     className="
//                       border-t
//                       border-[#D8C9AE]
//                       p-2
//                     "
//                   >
//                     <button
//                       type="button"
//                       onClick={handleLogout}
//                       className="
//                         flex
//                         w-full
//                         items-center
//                         gap-3
//                         rounded-xl
//                         px-3
//                         py-2.5
//                         text-sm
//                         font-bold
//                         text-[#9B4036]
//                         transition
//                         hover:bg-[#EBD4CB]
//                       "
//                     >
//                       <span
//                         className="
//                           flex
//                           h-9
//                           w-9
//                           items-center
//                           justify-center
//                           rounded-lg
//                           bg-[#EBD4CB]
//                         "
//                       >
//                         <LogOut size={17} />
//                       </span>

//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* =================================================
//                 ADD PROPERTY
//             ================================================= */}

//             <Link
//               href="/add-property"
//               onClick={closeMenus}
//               className="
//                 hidden
//                 items-center
//                 gap-2
//                 rounded-xl
//                 border
//                 border-[#D7AE62]
//                 bg-[#D7AE62]
//                 px-4
//                 py-2.5
//                 text-xs
//                 font-extrabold
//                 text-[#123F32]
//                 shadow-[0_4px_14px_rgba(215,174,98,0.18)]
//                 transition
//                 duration-200
//                 hover:-translate-y-0.5
//                 hover:bg-[#E4C27E]
//                 hover:shadow-[0_8px_20px_rgba(215,174,98,0.25)]
//                 xl:flex
//               "
//             >
//               <span className="text-base">
//                 +
//               </span>

//               Add Property
//             </Link>

//             {/* =================================================
//                 MOBILE BUTTON
//             ================================================= */}

//             <button
//               type="button"
//               onClick={() =>
//                 setMobileMenuOpen(
//                   (previous) => !previous
//                 )
//               }
//               className="
//                 flex
//                 h-10
//                 w-10
//                 items-center
//                 justify-center
//                 rounded-xl
//                 border
//                 border-[#416C5C]
//                 bg-[#174B3B]
//                 text-[#F3E7D2]
//                 transition
//                 hover:border-[#D7AE62]
//                 hover:text-[#D7AE62]
//                 lg:hidden
//               "
//               aria-label="Open menu"
//             >
//               {mobileMenuOpen ? (
//                 <X size={21} />
//               ) : (
//                 <Menu size={21} />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* =====================================================
//             MOBILE MENU
//         ===================================================== */}

//         {mobileMenuOpen && (
//           <div
//             className="
//               border-t
//               border-[#2F6653]
//               py-4
//               lg:hidden
//             "
//           >

//             {/* MOBILE SEARCH */}

//             <div className="mb-4">
//               <div className="relative">

//                 <Search
//                   size={17}
//                   className="
//                     absolute
//                     left-3.5
//                     top-1/2
//                     -translate-y-1/2
//                     text-[#7A8F84]
//                   "
//                 />

//                 <input
//                   type="text"
//                   value={search}
//                   placeholder={
//                     headerData?.Search ||
//                     "Search properties..."
//                   }
//                   onChange={(e) =>
//                     setSearch(e.target.value)
//                   }
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       handleSearch(search);
//                     }
//                   }}
//                   className="
//                     w-full
//                     rounded-xl
//                     border
//                     border-[#416C5C]
//                     bg-[#F2E9D9]
//                     py-3
//                     pl-10
//                     pr-4
//                     text-sm
//                     text-[#173F35]
//                     outline-none
//                     placeholder:text-[#809187]
//                     focus:border-[#D7AE62]
//                   "
//                 />
//               </div>
//             </div>

//             {/* MOBILE OWNER */}

//             <div
//               className="
//                 mb-4
//                 rounded-2xl
//                 border
//                 border-[#416C5C]
//                 bg-[#174B3B]
//                 p-4
//               "
//             >
//               <div
//                 className="
//                   flex
//                   items-center
//                   gap-3
//                 "
//               >

//                 {profileImageUrl ? (
//                   <Image
//                     src={profileImageUrl}
//                     alt={ownerName}
//                     width={48}
//                     height={48}
//                     className="
//                       h-12
//                       w-12
//                       rounded-full
//                       object-cover
//                       ring-2
//                       ring-[#D7AE62]/60
//                     "
//                     unoptimized
//                   />
//                 ) : (
//                   <div
//                     className="
//                       flex
//                       h-12
//                       w-12
//                       items-center
//                       justify-center
//                       rounded-full
//                       bg-[#D7AE62]
//                       font-bold
//                       text-[#123F32]
//                     "
//                   >
//                     {ownerInitial}
//                   </div>
//                 )}

//                 <div className="min-w-0">

//                   <p
//                     className="
//                       truncate
//                       font-extrabold
//                       text-[#F5ECDD]
//                     "
//                   >
//                     {loadingOwner
//                       ? "Loading..."
//                       : ownerName}
//                   </p>

//                   <p
//                     className="
//                       truncate
//                       text-xs
//                       text-[#BFD0C7]
//                     "
//                   >
//                     {ownerEmail}
//                   </p>

//                   <p
//                     className="
//                       mt-1
//                       text-[10px]
//                       font-bold
//                       uppercase
//                       tracking-wider
//                       text-[#D7AE62]
//                     "
//                   >
//                     Property Owner
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* MOBILE NAV */}

//             <div className="space-y-1">

//               {ownerNavItems.length > 0 ? (
//                 ownerNavItems.map(
//                   (item, index) => {

//                     const title =
//                       item?.Title ||
//                       item?.title ||
//                       "Menu";

//                     const url =
//                       item?.Url ||
//                       item?.URL ||
//                       item?.url ||
//                       "#";

//                     const icon =
//                       item?.Icon ||
//                       item?.icon ||
//                       "";

//                     const active =
//                       isActive(url);

//                     return (
//                       <Link
//                         key={`${title}-mobile-${index}`}
//                         href={url}
//                         onClick={closeMenus}
//                         className={`
//                           flex
//                           items-center
//                           gap-3
//                           rounded-xl
//                           px-3
//                           py-3
//                           text-sm
//                           font-semibold
//                           transition

//                           ${
//                             active
//                               ? `
//                                 bg-[#D7AE62]
//                                 text-[#123F32]
//                               `
//                               : `
//                                 text-[#DDE9E1]
//                                 hover:bg-[#1B513F]
//                                 hover:text-[#F3D59B]
//                               `
//                           }
//                         `}
//                       >
//                         <span
//                           className="
//                             flex
//                             h-9
//                             w-9
//                             items-center
//                             justify-center
//                             rounded-lg
//                             bg-[#225541]
//                           "
//                         >
//                           {renderIcon(icon)}
//                         </span>

//                         {title}
//                       </Link>
//                     );
//                   }
//                 )
//               ) : (
//                 <>
//                   <Link
//                     href="/owner"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       hover:bg-[#1B513F]
//                     "
//                   >
//                     <Home size={18} />
//                     Home
//                   </Link>

//                   <Link
//                     href="/owner/properties"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       hover:bg-[#1B513F]
//                     "
//                   >
//                     <Building2 size={18} />
//                     My Properties
//                   </Link>

//                   <Link
//                     href="/owner/enquiries"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       hover:bg-[#1B513F]
//                     "
//                   >
//                     <MessageSquare size={18} />
//                     Enquiries
//                   </Link>

//                   <Link
//                     href="/owner/site-visits"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       hover:bg-[#1B513F]
//                     "
//                   >
//                     <CalendarDays size={18} />
//                     Site Visits
//                   </Link>
//                 </>
//               )}
//             </div>

//             {/* MOBILE ADD PROPERTY */}

//             <Link
//               href="/add-property"
//               onClick={closeMenus}
//               className="
//                 mt-4
//                 flex
//                 w-full
//                 items-center
//                 justify-center
//                 gap-2
//                 rounded-xl
//                 bg-[#D7AE62]
//                 px-5
//                 py-3.5
//                 text-sm
//                 font-extrabold
//                 text-[#123F32]
//                 shadow-[0_6px_18px_rgba(215,174,98,0.2)]
//               "
//             >
//               <span className="text-lg">
//                 +
//               </span>

//               Add Property
//             </Link>

//             {/* MOBILE LOGOUT */}

//             <button
//               type="button"
//               onClick={handleLogout}
//               className="
//                 mt-2
//                 flex
//                 w-full
//                 items-center
//                 justify-center
//                 gap-2
//                 rounded-xl
//                 border
//                 border-[#70443E]
//                 bg-[#492E2A]
//                 px-5
//                 py-3.5
//                 text-sm
//                 font-bold
//                 text-[#F0C9C2]
//               "
//             >
//               <LogOut size={17} />

//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";

// import {
//   Home,
//   Building2,
//   MessageSquare,
//   CalendarDays,
//   BarChart3,
//   Tag,
//   UserRound,
//   Settings,
//   LogOut,
//   ChevronDown,
//   Menu,
//   X,
//   Mail,
// } from "lucide-react";

// import NotificationBell from "./NotificationBell";

// /* =========================================================
//    STRAPI
// ========================================================= */

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
//   "http://localhost:1337";

// const API_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL ||
//   `${STRAPI_URL}/api`;

// /* =========================================================
//    HEADER
// ========================================================= */

// export default function Header({ headerData }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   /* =======================================================
//      STATES
//   ======================================================= */

//   const [owner, setOwner] = useState(null);
//   const [ownerProfile, setOwnerProfile] = useState(null);

//   const [profileOpen, setProfileOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const [loadingOwner, setLoadingOwner] = useState(true);

//   /* =======================================================
//      LOAD LOGGED-IN OWNER
//   ======================================================= */

//   useEffect(() => {
//     let mounted = true;

//     async function loadOwnerProfile() {
//       try {
//         setLoadingOwner(true);

//         const token = localStorage.getItem("token");

//         if (!token) {
//           if (mounted) {
//             setOwner(null);
//             setOwnerProfile(null);
//           }

//           return;
//         }

//         /* ---------------------------------------------------
//            CURRENT USER
//         --------------------------------------------------- */

//         const userResponse = await fetch(
//           `${API_URL}/users/me`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             cache: "no-store",
//           }
//         );

//         const currentUser =
//           await userResponse.json().catch(() => null);

//         if (!userResponse.ok) {
//           throw new Error(
//             currentUser?.error?.message ||
//               "Unable to load Owner."
//           );
//         }

//         if (!mounted) return;

//         setOwner(currentUser);

//         /* ---------------------------------------------------
//            OWNER PROFILE
//         --------------------------------------------------- */

//         const profileQuery =
//           `${API_URL}/user-profiles?` +
//           `filters[users_permissions_user][id][$eq]=${currentUser.id}` +
//           `&populate[ProfileDetails][populate]=*`;

//         const profileResponse = await fetch(
//           profileQuery,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             cache: "no-store",
//           }
//         );

//         const profileResult =
//           await profileResponse.json().catch(() => null);

//         if (!profileResponse.ok) {
//           console.error(
//             "OWNER PROFILE ERROR:",
//             profileResult
//           );

//           if (mounted) {
//             setOwnerProfile(null);
//           }

//           return;
//         }

//         const profile =
//           profileResult?.data?.[0] || null;

//         if (mounted) {
//           setOwnerProfile(profile);
//         }

//         console.log(
//           "CURRENT OWNER:",
//           currentUser
//         );

//         console.log(
//           "OWNER PROFILE:",
//           profile
//         );
//       } catch (error) {
//         console.error(
//           "LOAD OWNER PROFILE ERROR:",
//           error
//         );

//         if (mounted) {
//           setOwner(null);
//           setOwnerProfile(null);
//         }
//       } finally {
//         if (mounted) {
//           setLoadingOwner(false);
//         }
//       }
//     }

//     loadOwnerProfile();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   /* =======================================================
//      STRAPI OWNER NAVIGATION
//   ======================================================= */

//   const ownerNavItems = useMemo(() => {
//     const nav =
//       headerData?.OwnerNavItem ||
//       headerData?.OwnerNavItem?.data ||
//       [];

//     if (!Array.isArray(nav)) {
//       return [];
//     }

//     return [...nav]
//       .filter((item) => {
//         const title = String(
//           item?.Title ||
//             item?.title ||
//             ""
//         )
//           .trim()
//           .toLowerCase();

//         /*
//           HOME / DASHBOARD HEADER NAVIGATION HIDDEN.
//           Logo itself remains clickable.
//         */

//         const isHomeItem =
//           title === "home" ||
//           title === "dashboard";

//         return (
//           !isHomeItem &&
//           item?.IsActive !== false &&
//           item?.isActive !== false
//         );
//       })
//       .sort((a, b) => {
//         const orderA =
//           Number(
//             a?.DisplayOrder ??
//               a?.displayOrder ??
//               999
//           ) || 999;

//         const orderB =
//           Number(
//             b?.DisplayOrder ??
//               b?.displayOrder ??
//               999
//           ) || 999;

//         return orderA - orderB;
//       });
//   }, [headerData]);

//   /* =======================================================
//      STRAPI OWNER PROFILE MENU
//   ======================================================= */

//   const ownerMenuItems = useMemo(() => {
//     const menu =
//       headerData?.OwnerProfileMenu ||
//       headerData?.OwnerProfileMenu?.data ||
//       [];

//     if (!Array.isArray(menu)) {
//       return [];
//     }

//     return [...menu]
//       .filter((item) => {
//         return (
//           item?.IsActive !== false &&
//           item?.isActive !== false
//         );
//       })
//       .sort((a, b) => {
//         const orderA =
//           Number(
//             a?.DisplayOrder ??
//               a?.displayOrder ??
//               999
//           ) || 999;

//         const orderB =
//           Number(
//             b?.DisplayOrder ??
//               b?.displayOrder ??
//               999
//           ) || 999;

//         return orderA - orderB;
//       });
//   }, [headerData]);

//   /* =======================================================
//      OWNER DATA
//   ======================================================= */

//   const firstName =
//     ownerProfile?.ProfileDetails?.FirstName || "";

//   const lastName =
//     ownerProfile?.ProfileDetails?.LastName || "";

//   const profileName =
//     `${firstName} ${lastName}`.trim();

//   const ownerName =
//     profileName ||
//     owner?.username ||
//     "Owner";

//   const ownerEmail =
//     owner?.email || "";

//   const profileImage =
//     ownerProfile?.ProfileDetails?.ProfileImage;

//   const profileImageUrl =
//     profileImage?.url
//       ? `${STRAPI_URL}${profileImage.url}`
//       : null;

//   const ownerInitial =
//     ownerName.charAt(0).toUpperCase();

//   /* =======================================================
//      ICON HELPER
//   ======================================================= */

//   function renderIcon(iconName) {
//     const icon = String(iconName || "")
//       .trim()
//       .toLowerCase()
//       .replace(/[-_\s]/g, "");

//     /* NAVIGATION ICON SIZE INCREASED */

//     const className =
//       "h-[20px] w-[20px]";

//     switch (icon) {
//       case "home":
//       case "dashboard":
//         return (
//           <Home
//             className={className}
//           />
//         );

//       case "building":
//       case "building2":
//       case "property":
//       case "properties":
//       case "myproperties":
//         return (
//           <Building2
//             className={className}
//           />
//         );

//       case "message":
//       case "messages":
//       case "enquiry":
//       case "enquiries":
//         return (
//           <MessageSquare
//             className={className}
//           />
//         );

//       case "calendar":
//       case "visit":
//       case "visits":
//       case "sitevisit":
//       case "sitevisits":
//         return (
//           <CalendarDays
//             className={className}
//           />
//         );

//       case "chart":
//       case "analytics":
//       case "insights":
//       case "bar":
//         return (
//           <BarChart3
//             className={className}
//           />
//         );

//       case "tag":
//       case "promotion":
//       case "promotions":
//         return (
//           <Tag
//             className={className}
//           />
//         );

//       case "user":
//       case "profile":
//         return (
//           <UserRound
//             className={className}
//           />
//         );

//       case "settings":
//         return (
//           <Settings
//             className={className}
//           />
//         );

//       default:
//         return (
//           <Home
//             className={className}
//           />
//         );
//     }
//   }

//   /* =======================================================
//      LOGOUT
//   ======================================================= */

//   function handleLogout() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userRole");

//     setOwner(null);
//     setOwnerProfile(null);

//     setProfileOpen(false);
//     setMobileMenuOpen(false);

//     router.replace("/login");
//   }

//   /* =======================================================
//      CLOSE MENUS
//   ======================================================= */

//   function closeMenus() {
//     setProfileOpen(false);
//     setMobileMenuOpen(false);
//   }

//   /* =======================================================
//      ACTIVE NAV
//   ======================================================= */

//   function isActive(url) {
//     if (!url || url === "#") {
//       return false;
//     }

//     if (url === "/") {
//       return pathname === "/";
//     }

//     return (
//       pathname === url ||
//       pathname?.startsWith(`${url}/`)
//     );
//   }

//   /* =======================================================
//      UI
//   ======================================================= */

//   return (
//     <header
//       className="
//         sticky
//         top-0
//         z-50
//         border-b
//         border-[#2E6654]
//         bg-gradient-to-r
//         from-[#0A372C]
//         via-[#104A3A]
//         to-[#0A372C]
//         shadow-[0_8px_35px_rgba(8,48,38,0.30)]
//       "
//     >

//       {/* =====================================================
//           GOLD TOP LINE
//       ===================================================== */}

//       <div
//         className="
//           h-[2px]
//           w-full
//           bg-gradient-to-r
//           from-transparent
//           via-[#D7AE62]
//           to-transparent
//           opacity-90
//         "
//       />

//       <div
//         className="
//           mx-auto
//           max-w-[1600px]
//           px-5
//           sm:px-7
//           lg:px-10
//         "
//       >

//         {/* =================================================
//             MAIN HEADER
//         ================================================= */}

//         <div
//           className="
//             flex
//             min-h-[78px]
//             items-center
//             gap-5
//           "
//         >

//           {/* =================================================
//               LOGO
//           ================================================= */}

//           <Link
//             href="/"
//             onClick={closeMenus}
//             className="
//               group
//               flex
//               shrink-0
//               items-center
//               gap-3
//             "
//           >

//             {headerData?.Logo?.url ? (

//               <div
//                 className="
//                   relative
//                   flex
//                   h-12
//                   w-12
//                   items-center
//                   justify-center
//                   overflow-hidden
//                   rounded-xl
//                   border
//                   border-[#D7AE62]/70
//                   bg-[#F2E6CF]
//                   shadow-[0_5px_18px_rgba(0,0,0,0.20)]
//                   transition-all
//                   duration-300
//                   group-hover:scale-105
//                   group-hover:shadow-[0_7px_22px_rgba(215,174,98,0.20)]
//                 "
//               >

//                 <Image
//                   src={`${STRAPI_URL}${headerData.Logo.url}`}
//                   alt={
//                     headerData?.Brand ||
//                     "HomeHub"
//                   }
//                   width={48}
//                   height={48}
//                   className="
//                     h-full
//                     w-full
//                     object-cover
//                   "
//                   unoptimized
//                 />

//               </div>

//             ) : (

//               <div
//                 className="
//                   flex
//                   h-12
//                   w-12
//                   items-center
//                   justify-center
//                   rounded-xl
//                   border
//                   border-[#E2BB6D]
//                   bg-[#D7AE62]
//                   text-[#123F32]
//                   shadow-[0_5px_18px_rgba(0,0,0,0.20)]
//                   transition-all
//                   duration-300
//                   group-hover:scale-105
//                 "
//               >

//                 <Home size={24} />

//               </div>

//             )}

//             <div className="hidden sm:block">

//               {/* HOMEHUB — INCREASED */}

//               <h1
//                 className="
//                   text-[23px]
//                   font-extrabold
//                   leading-none
//                   tracking-tight
//                   text-[#F7F0E3]
//                 "
//               >
//                 {headerData?.Brand ||
//                   "HomeHub"}
//               </h1>

//               {/* OWNER PORTAL — SIZE NOT INCREASED */}

//               <p
//                 className="
//                   mt-0.5
//                   text-[9px]
//                   font-bold
//                   uppercase
//                   tracking-[0.22em]
//                   text-[#D7AE62]
//                 "
//               >
//                 Owner Portal
//               </p>

//             </div>

//           </Link>

//           {/* =================================================
//               DESKTOP NAVIGATION
//           ================================================= */}

//           <nav
//             className="
//               hidden
//               min-w-0
//               flex-1
//               items-center
//               justify-center
//               lg:flex
//             "
//           >

//             <div
//               className="
//                 flex
//                 items-center
//                 gap-1.5
//               "
//             >

//               {ownerNavItems.length > 0 ? (

//                 ownerNavItems.map(
//                   (item, index) => {

//                     const title =
//                       item?.Title ||
//                       item?.title ||
//                       "Menu";

//                     const url =
//                       item?.Url ||
//                       item?.URL ||
//                       item?.url ||
//                       "#";

//                     const icon =
//                       item?.Icon ||
//                       item?.icon ||
//                       "";

//                     const active =
//                       isActive(url);

//                     return (
//                       <Link
//                         key={`${title}-${index}`}
//                         href={url}
//                         onClick={closeMenus}
//                         className={`
//                           group
//                           relative
//                           flex
//                           items-center
//                           gap-2.5
//                           rounded-xl
//                           px-3.5
//                           py-3
//                           text-[13px]
//                           font-bold
//                           transition-all
//                           duration-200

//                           ${
//                             active
//                               ? `
//                                 bg-[#D7AE62]
//                                 text-[#123F32]
//                                 shadow-[0_5px_18px_rgba(215,174,98,0.22)]
//                               `
//                               : `
//                                 text-[#DDE9E3]
//                                 hover:bg-[#174F3E]
//                                 hover:text-[#F3D59B]
//                               `
//                           }
//                         `}
//                       >

//                         <span
//                           className={`
//                             transition-transform
//                             duration-200
//                             group-hover:scale-110

//                             ${
//                               active
//                                 ? "text-[#123F32]"
//                                 : "text-[#C9D8D1]"
//                             }
//                           `}
//                         >
//                           {renderIcon(icon)}
//                         </span>

//                         <span
//                           className="
//                             whitespace-nowrap
//                           "
//                         >
//                           {title}
//                         </span>

//                         {/* ACTIVE UNDERLINE */}

//                         {active && (
//                           <span
//                             className="
//                               absolute
//                               bottom-0.5
//                               left-1/2
//                               h-[2px]
//                               w-5
//                               -translate-x-1/2
//                               rounded-full
//                               bg-[#123F32]/40
//                             "
//                           />
//                         )}

//                       </Link>
//                     );
//                   }
//                 )

//               ) : (

//                 <>

//                   {/* MY PROPERTIES */}

//                   <Link
//                     href="/owner/properties"
//                     onClick={closeMenus}
//                     className="
//                       group
//                       flex
//                       items-center
//                       gap-2.5
//                       rounded-xl
//                       px-3.5
//                       py-3
//                       text-[13px]
//                       font-bold
//                       text-[#DDE9E3]
//                       transition-all
//                       duration-200
//                       hover:bg-[#174F3E]
//                       hover:text-[#F3D59B]
//                     "
//                   >

//                     <Building2
//                       size={20}
//                       className="
//                         text-[#C9D8D1]
//                         transition-transform
//                         group-hover:scale-110
//                       "
//                     />

//                     My Properties

//                   </Link>

//                   {/* ENQUIRIES */}

//                   <Link
//                     href="/owner/enquiries"
//                     onClick={closeMenus}
//                     className="
//                       group
//                       flex
//                       items-center
//                       gap-2.5
//                       rounded-xl
//                       px-3.5
//                       py-3
//                       text-[13px]
//                       font-bold
//                       text-[#DDE9E3]
//                       transition-all
//                       duration-200
//                       hover:bg-[#174F3E]
//                       hover:text-[#F3D59B]
//                     "
//                   >

//                     <MessageSquare
//                       size={20}
//                       className="
//                         text-[#C9D8D1]
//                         transition-transform
//                         group-hover:scale-110
//                       "
//                     />

//                     Enquiries

//                   </Link>

//                   {/* SITE VISITS */}

//                   <Link
//                     href="/owner/site-visits"
//                     onClick={closeMenus}
//                     className="
//                       group
//                       flex
//                       items-center
//                       gap-2.5
//                       rounded-xl
//                       px-3.5
//                       py-3
//                       text-[13px]
//                       font-bold
//                       text-[#DDE9E3]
//                       transition-all
//                       duration-200
//                       hover:bg-[#174F3E]
//                       hover:text-[#F3D59B]
//                     "
//                   >

//                     <CalendarDays
//                       size={20}
//                       className="
//                         text-[#C9D8D1]
//                         transition-transform
//                         group-hover:scale-110
//                       "
//                     />

//                     Site Visits

//                   </Link>

//                   {/* INSIGHTS */}

//                   <Link
//                     href="/owner/insights"
//                     onClick={closeMenus}
//                     className="
//                       group
//                       flex
//                       items-center
//                       gap-2.5
//                       rounded-xl
//                       px-3.5
//                       py-3
//                       text-[13px]
//                       font-bold
//                       text-[#DDE9E3]
//                       transition-all
//                       duration-200
//                       hover:bg-[#174F3E]
//                       hover:text-[#F3D59B]
//                     "
//                   >

//                     <BarChart3
//                       size={20}
//                       className="
//                         text-[#C9D8D1]
//                         transition-transform
//                         group-hover:scale-110
//                       "
//                     />

//                     Insights

//                   </Link>

//                   {/* PROMOTIONS */}

//                   <Link
//                     href="/owner/promotions"
//                     onClick={closeMenus}
//                     className="
//                       group
//                       flex
//                       items-center
//                       gap-2.5
//                       rounded-xl
//                       px-3.5
//                       py-3
//                       text-[13px]
//                       font-bold
//                       text-[#DDE9E3]
//                       transition-all
//                       duration-200
//                       hover:bg-[#174F3E]
//                       hover:text-[#F3D59B]
//                     "
//                   >

//                     <Tag
//                       size={20}
//                       className="
//                         text-[#C9D8D1]
//                         transition-transform
//                         group-hover:scale-110
//                       "
//                     />

//                     Promotions

//                   </Link>

//                 </>

//               )}

//             </div>

//           </nav>

//           {/* =================================================
//               RIGHT SIDE
//           ================================================= */}

//           <div
//             className="
//               ml-auto
//               flex
//               shrink-0
//               items-center
//               gap-2
//               lg:gap-3
//             "
//           >

//             {/* =================================================
//                 NOTIFICATION
//             ================================================= */}

//             <div
//               className="
//                 flex
//                 h-11
//                 w-11
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-xl
//                 border
//                 border-[#4A7465]
//                 bg-[#164B3B]
//                 text-[#F3D59B]
//                 shadow-[0_3px_12px_rgba(0,0,0,0.12)]
//                 transition-all
//                 duration-200
//                 hover:border-[#D7AE62]
//                 hover:bg-[#1C5947]
//                 hover:text-[#F6D58D]
//                 hover:shadow-[0_5px_18px_rgba(215,174,98,0.18)]
//                 [&_button]:!border-0
//                 [&_button]:!bg-transparent
//                 [&_button]:!p-0
//                 [&_button]:!text-[#F3D59B]
//                 [&_svg]:!h-[20px]
//                 [&_svg]:!w-[20px]
//                 [&_svg]:!text-[#F3D59B]
//               "
//               title="Notifications"
//             >

//               <NotificationBell />

//             </div>

//             {/* =================================================
//                 PROFILE
//                 IMAGE + CHEVRON
//             ================================================= */}

//             <div
//               className="
//                 relative
//                 hidden
//                 lg:block
//               "
//             >

//               <button
//                 type="button"
//                 onClick={() =>
//                   setProfileOpen(
//                     (previous) =>
//                       !previous
//                   )
//                 }
//                 aria-label="Open profile menu"
//                 className={`
//                   group
//                   flex
//                   h-11
//                   items-center
//                   gap-2
//                   rounded-xl
//                   border
//                   px-1.5
//                   py-1.5
//                   transition-all
//                   duration-200

//                   ${
//                     profileOpen
//                       ? `
//                         border-[#D7AE62]
//                         bg-[#1B513F]
//                         shadow-[0_5px_20px_rgba(215,174,98,0.15)]
//                       `
//                       : `
//                         border-[#416C5C]
//                         bg-[#174B3B]
//                         hover:border-[#D7AE62]
//                         hover:bg-[#1B513F]
//                       `
//                   }
//                 `}
//               >

//                 {/* PROFILE IMAGE — SAME SIZE */}

//                 {profileImageUrl ? (

//                   <Image
//                     src={profileImageUrl}
//                     alt="Profile"
//                     width={36}
//                     height={36}
//                     className="
//                       h-9
//                       w-9
//                       rounded-full
//                       object-cover
//                       ring-2
//                       ring-[#D7AE62]/60
//                       transition-transform
//                       duration-200
//                       group-hover:scale-105
//                     "
//                     unoptimized
//                   />

//                 ) : (

//                   <div
//                     className="
//                       flex
//                       h-9
//                       w-9
//                       items-center
//                       justify-center
//                       rounded-full
//                       bg-[#D7AE62]
//                       font-bold
//                       text-[#123F32]
//                       shadow-inner
//                       transition-transform
//                       duration-200
//                       group-hover:scale-105
//                     "
//                   >
//                     {ownerInitial}
//                   </div>

//                 )}

//                 <ChevronDown
//                   size={15}
//                   className={`
//                     mr-0.5
//                     text-[#C8D8CF]
//                     transition-transform
//                     duration-200
//                     ${
//                       profileOpen
//                         ? "rotate-180 text-[#D7AE62]"
//                         : ""
//                     }
//                   `}
//                 />

//               </button>

//               {/* =================================================
//                   PROFILE DROPDOWN
//               ================================================= */}

//               {profileOpen && (

//                 <div
//                   className="
//                     absolute
//                     right-0
//                     top-full
//                     mt-3
//                     w-[300px]
//                     overflow-hidden
//                     rounded-2xl
//                     border
//                     border-[#D5C6AA]
//                     bg-[#F4EBDD]
//                     shadow-[0_22px_60px_rgba(18,63,50,0.32)]
//                   "
//                 >

//                   {/* PROFILE HEADER */}

//                   <div
//                     className="
//                       border-b
//                       border-[#D8C9AE]
//                       bg-[#E9DDC7]
//                       p-4
//                     "
//                   >

//                     <div
//                       className="
//                         flex
//                         items-center
//                         gap-3
//                       "
//                     >

//                       {profileImageUrl ? (

//                         <Image
//                           src={profileImageUrl}
//                           alt="Profile"
//                           width={52}
//                           height={52}
//                           className="
//                             h-[52px]
//                             w-[52px]
//                             rounded-full
//                             object-cover
//                             ring-4
//                             ring-[#F4EBDD]
//                           "
//                           unoptimized
//                         />

//                       ) : (

//                         <div
//                           className="
//                             flex
//                             h-[52px]
//                             w-[52px]
//                             items-center
//                             justify-center
//                             rounded-full
//                             bg-[#D7AE62]
//                             text-xl
//                             font-bold
//                             text-[#123F32]
//                             ring-4
//                             ring-[#F4EBDD]
//                           "
//                         >
//                           {ownerInitial}
//                         </div>

//                       )}

//                       <div className="min-w-0">

//                         <p
//                           className="
//                             truncate
//                             text-sm
//                             font-extrabold
//                             text-[#173F35]
//                           "
//                         >
//                           {loadingOwner
//                             ? "Loading..."
//                             : ownerName}
//                         </p>

//                         <div
//                           className="
//                             mt-1
//                             flex
//                             items-center
//                             gap-1.5
//                             text-xs
//                             text-[#69766F]
//                           "
//                         >

//                           <Mail size={13} />

//                           <span className="truncate">
//                             {ownerEmail}
//                           </span>

//                         </div>

//                         <span
//                           className="
//                             mt-2
//                             inline-flex
//                             rounded-full
//                             bg-[#174B3B]
//                             px-2.5
//                             py-1
//                             text-[9px]
//                             font-bold
//                             uppercase
//                             tracking-wider
//                             text-[#F4EBDD]
//                           "
//                         >
//                           Owner Account
//                         </span>

//                       </div>

//                     </div>

//                   </div>

//                   {/* PROFILE MENU */}

//                   <div className="p-2">

//                     {ownerMenuItems.length > 0 ? (

//                       ownerMenuItems.map(
//                         (item, index) => {

//                           const title =
//                             item?.Title ||
//                             item?.title ||
//                             "Menu";

//                           const url =
//                             item?.Url ||
//                             item?.URL ||
//                             item?.url ||
//                             "#";

//                           const icon =
//                             item?.Icon ||
//                             item?.icon ||
//                             "";

//                           return (

//                             <Link
//                               key={`${title}-${index}`}
//                               href={url}
//                               onClick={closeMenus}
//                               className="
//                                 group
//                                 flex
//                                 items-center
//                                 gap-3
//                                 rounded-xl
//                                 px-3
//                                 py-2.5
//                                 text-sm
//                                 font-semibold
//                                 text-[#365247]
//                                 transition
//                                 hover:bg-[#E7D8BD]
//                                 hover:text-[#174B3B]
//                               "
//                             >

//                               <span
//                                 className="
//                                   flex
//                                   h-9
//                                   w-9
//                                   shrink-0
//                                   items-center
//                                   justify-center
//                                   rounded-lg
//                                   bg-[#E8DCC8]
//                                   text-[#A97928]
//                                   transition
//                                   group-hover:bg-[#D7AE62]
//                                   group-hover:text-[#123F32]
//                                 "
//                               >
//                                 {renderIcon(icon)}
//                               </span>

//                               <span className="flex-1">
//                                 {title}
//                               </span>

//                               <span
//                                 className="
//                                   text-[#9B8A70]
//                                   transition
//                                   group-hover:translate-x-1
//                                   group-hover:text-[#A97928]
//                                 "
//                               >
//                                 →
//                               </span>

//                             </Link>

//                           );
//                         }
//                       )

//                     ) : (

//                       <>

//                         <Link
//                           href="/owner/profile"
//                           onClick={closeMenus}
//                           className="
//                             flex
//                             items-center
//                             gap-3
//                             rounded-xl
//                             px-3
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-[#365247]
//                             transition
//                             hover:bg-[#E7D8BD]
//                           "
//                         >

//                           <UserRound
//                             size={18}
//                             className="text-[#A97928]"
//                           />

//                           My Profile

//                         </Link>

//                         <Link
//                           href="/owner/properties"
//                           onClick={closeMenus}
//                           className="
//                             flex
//                             items-center
//                             gap-3
//                             rounded-xl
//                             px-3
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-[#365247]
//                             transition
//                             hover:bg-[#E7D8BD]
//                           "
//                         >

//                           <Building2
//                             size={18}
//                             className="text-[#A97928]"
//                           />

//                           My Properties

//                         </Link>

//                         <Link
//                           href="/owner/enquiries"
//                           onClick={closeMenus}
//                           className="
//                             flex
//                             items-center
//                             gap-3
//                             rounded-xl
//                             px-3
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-[#365247]
//                             transition
//                             hover:bg-[#E7D8BD]
//                           "
//                         >

//                           <MessageSquare
//                             size={18}
//                             className="text-[#A97928]"
//                           />

//                           My Enquiries

//                         </Link>

//                         <Link
//                           href="/owner/settings"
//                           onClick={closeMenus}
//                           className="
//                             flex
//                             items-center
//                             gap-3
//                             rounded-xl
//                             px-3
//                             py-2.5
//                             text-sm
//                             font-semibold
//                             text-[#365247]
//                             transition
//                             hover:bg-[#E7D8BD]
//                           "
//                         >

//                           <Settings
//                             size={18}
//                             className="text-[#A97928]"
//                           />

//                           Settings

//                         </Link>

//                       </>

//                     )}

//                   </div>

//                   {/* LOGOUT */}

//                   <div
//                     className="
//                       border-t
//                       border-[#D8C9AE]
//                       p-2
//                     "
//                   >

//                     <button
//                       type="button"
//                       onClick={handleLogout}
//                       className="
//                         flex
//                         w-full
//                         items-center
//                         gap-3
//                         rounded-xl
//                         px-3
//                         py-2.5
//                         text-sm
//                         font-bold
//                         text-[#9B4036]
//                         transition
//                         hover:bg-[#EBD4CB]
//                       "
//                     >

//                       <span
//                         className="
//                           flex
//                           h-9
//                           w-9
//                           items-center
//                           justify-center
//                           rounded-lg
//                           bg-[#EBD4CB]
//                         "
//                       >
//                         <LogOut size={17} />
//                       </span>

//                       Logout

//                     </button>

//                   </div>

//                 </div>

//               )}

//             </div>

//             {/* =================================================
//                 ADD PROPERTY
//             ================================================= */}

//             <Link
//               href="/add-property"
//               onClick={closeMenus}
//               className="
//                 hidden
//                 xl:flex
//                 items-center
//                 gap-2
//                 rounded-xl
//                 border
//                 border-[#D7AE62]
//                 bg-[#D7AE62]
//                 px-5
//                 py-3
//                 text-[13px]
//                 font-extrabold
//                 text-[#123F32]
//                 shadow-[0_5px_16px_rgba(215,174,98,0.18)]
//                 transition-all
//                 duration-200
//                 hover:-translate-y-0.5
//                 hover:bg-[#E4C27E]
//                 hover:shadow-[0_8px_22px_rgba(215,174,98,0.28)]
//               "
//             >

//               <span className="text-base">
//                 +
//               </span>

//               Add Property

//             </Link>

//             {/* =================================================
//                 MOBILE MENU BUTTON
//             ================================================= */}

//             <button
//               type="button"
//               onClick={() =>
//                 setMobileMenuOpen(
//                   (previous) => !previous
//                 )
//               }
//               className="
//                 flex
//                 h-10
//                 w-10
//                 items-center
//                 justify-center
//                 rounded-xl
//                 border
//                 border-[#416C5C]
//                 bg-[#174B3B]
//                 text-[#F3E7D2]
//                 transition-all
//                 hover:border-[#D7AE62]
//                 hover:text-[#D7AE62]
//                 lg:hidden
//               "
//               aria-label="Open menu"
//             >

//               {mobileMenuOpen ? (
//                 <X size={21} />
//               ) : (
//                 <Menu size={21} />
//               )}

//             </button>

//           </div>

//         </div>

//         {/* =====================================================
//             MOBILE MENU
//         ===================================================== */}

//         {mobileMenuOpen && (

//           <div
//             className="
//               border-t
//               border-[#2F6653]
//               py-4
//               lg:hidden
//             "
//           >

//             {/* MOBILE OWNER */}

//             <div
//               className="
//                 mb-4
//                 rounded-2xl
//                 border
//                 border-[#416C5C]
//                 bg-[#174B3B]
//                 p-4
//               "
//             >

//               <div
//                 className="
//                   flex
//                   items-center
//                   gap-3
//                 "
//               >

//                 {profileImageUrl ? (

//                   <Image
//                     src={profileImageUrl}
//                     alt="Profile"
//                     width={48}
//                     height={48}
//                     className="
//                       h-12
//                       w-12
//                       rounded-full
//                       object-cover
//                       ring-2
//                       ring-[#D7AE62]/60
//                     "
//                     unoptimized
//                   />

//                 ) : (

//                   <div
//                     className="
//                       flex
//                       h-12
//                       w-12
//                       items-center
//                       justify-center
//                       rounded-full
//                       bg-[#D7AE62]
//                       font-bold
//                       text-[#123F32]
//                     "
//                   >
//                     {ownerInitial}
//                   </div>

//                 )}

//                 <div className="min-w-0">

//                   <p
//                     className="
//                       truncate
//                       font-extrabold
//                       text-[#F5ECDD]
//                     "
//                   >
//                     {loadingOwner
//                       ? "Loading..."
//                       : ownerName}
//                   </p>

//                   <p
//                     className="
//                       truncate
//                       text-xs
//                       text-[#BFD0C7]
//                     "
//                   >
//                     {ownerEmail}
//                   </p>

//                   <p
//                     className="
//                       mt-1
//                       text-[10px]
//                       font-bold
//                       uppercase
//                       tracking-wider
//                       text-[#D7AE62]
//                     "
//                   >
//                     Property Owner
//                   </p>

//                 </div>

//               </div>

//             </div>

//             {/* MOBILE NAV */}

//             <div className="space-y-1">

//               {ownerNavItems.length > 0 ? (

//                 ownerNavItems.map(
//                   (item, index) => {

//                     const title =
//                       item?.Title ||
//                       item?.title ||
//                       "Menu";

//                     const url =
//                       item?.Url ||
//                       item?.URL ||
//                       item?.url ||
//                       "#";

//                     const icon =
//                       item?.Icon ||
//                       item?.icon ||
//                       "";

//                     const active =
//                       isActive(url);

//                     return (

//                       <Link
//                         key={`${title}-mobile-${index}`}
//                         href={url}
//                         onClick={closeMenus}
//                         className={`
//                           flex
//                           items-center
//                           gap-3
//                           rounded-xl
//                           px-3
//                           py-3
//                           text-sm
//                           font-semibold
//                           transition-all

//                           ${
//                             active
//                               ? `
//                                 bg-[#D7AE62]
//                                 text-[#123F32]
//                               `
//                               : `
//                                 text-[#DDE9E1]
//                                 hover:bg-[#1B513F]
//                                 hover:text-[#F3D59B]
//                               `
//                           }
//                         `}
//                       >

//                         <span
//                           className={`
//                             flex
//                             h-9
//                             w-9
//                             items-center
//                             justify-center
//                             rounded-lg

//                             ${
//                               active
//                                 ? "bg-[#E5C47D]/70"
//                                 : "bg-[#225541]"
//                             }
//                           `}
//                         >
//                           {renderIcon(icon)}
//                         </span>

//                         {title}

//                       </Link>

//                     );
//                   }
//                 )

//               ) : (

//                 <>

//                   <Link
//                     href="/owner/properties"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B513F]
//                     "
//                   >

//                     <Building2 size={20} />

//                     My Properties

//                   </Link>

//                   <Link
//                     href="/owner/enquiries"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B513F]
//                     "
//                   >

//                     <MessageSquare size={20} />

//                     Enquiries

//                   </Link>

//                   <Link
//                     href="/owner/site-visits"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B513F]
//                     "
//                   >

//                     <CalendarDays size={20} />

//                     Site Visits

//                   </Link>

//                   <Link
//                     href="/owner/insights"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B513F]
//                     "
//                   >

//                     <BarChart3 size={20} />

//                     Insights

//                   </Link>

//                   <Link
//                     href="/owner/promotions"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B513F]
//                     "
//                   >

//                     <Tag size={20} />

//                     Promotions

//                   </Link>

//                 </>

//               )}

//             </div>

//             {/* MOBILE ADD PROPERTY */}

//             <Link
//               href="/add-property"
//               onClick={closeMenus}
//               className="
//                 mt-4
//                 flex
//                 w-full
//                 items-center
//                 justify-center
//                 gap-2
//                 rounded-xl
//                 border
//                 border-[#D7AE62]
//                 bg-[#D7AE62]
//                 px-5
//                 py-3.5
//                 text-sm
//                 font-extrabold
//                 text-[#123F32]
//                 shadow-[0_6px_18px_rgba(215,174,98,0.20)]
//                 transition-all
//                 hover:bg-[#E4C27E]
//               "
//             >

//               <span className="text-lg">
//                 +
//               </span>

//               Add Property

//             </Link>

//             {/* MOBILE LOGOUT */}

//             <button
//               type="button"
//               onClick={handleLogout}
//               className="
//                 mt-2
//                 flex
//                 w-full
//                 items-center
//                 justify-center
//                 gap-2
//                 rounded-xl
//                 border
//                 border-[#70443E]
//                 bg-[#492E2A]
//                 px-5
//                 py-3.5
//                 text-sm
//                 font-bold
//                 text-[#F0C9C2]
//                 transition
//                 hover:bg-[#59342F]
//               "
//             >

//               <LogOut size={17} />

//               Logout

//             </button>

//           </div>

//         )}

//       </div>

//     </header>
//   );
// }

//                     My Properties

//                   </Link>

//                   <Link
//                     href="/owner/enquiries"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B513F]
//                     "
//                   >

//                     <MessageSquare size={20} />

//                     Enquiries

//                   </Link>

//                   <Link
//                     href="/owner/site-visits"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B513F]
//                     "
//                   >

//                     <CalendarDays size={20} />

//                     Site Visits

//                   </Link>

//                   <Link
//                     href="/owner/insights"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B513F]
//                     "
//                   >

//                     <BarChart3 size={20} />

//                     Insights

//                   </Link>

//                   <Link
//                     href="/owner/promotions"
//                     onClick={closeMenus}
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       rounded-xl
//                       px-3
//                       py-3
//                       text-sm
//                       font-semibold
//                       text-[#DDE9E1]
//                       transition
//                       hover:bg-[#1B513F]
//                     "
//                   >

//                     <Tag size={20} />

//                     Promotions

//                   </Link>

//                 </>

//               )}

//             </div>

//             {/* MOBILE ADD PROPERTY */}

//             <Link
//               href="/add-property"
//               onClick={closeMenus}
//               className="
//                 mt-4
//                 flex
//                 w-full
//                 items-center
//                 justify-center
//                 gap-2
//                 rounded-xl
//                 border
//                 border-[#D7AE62]
//                 bg-[#D7AE62]
//                 px-5
//                 py-3.5
//                 text-sm
//                 font-extrabold
//                 text-[#123F32]
//                 shadow-[0_6px_18px_rgba(215,174,98,0.20)]
//                 transition-all
//                 hover:bg-[#E4C27E]
//               "
//             >

//               <span className="text-lg">
//                 +
//               </span>

//               Add Property

//             </Link>

//             {/* MOBILE LOGOUT */}

//             <button
//               type="button"
//               onClick={handleLogout}
//               className="
//                 mt-2
//                 flex
//                 w-full
//                 items-center
//                 justify-center
//                 gap-2
//                 rounded-xl
//                 border
//                 border-[#70443E]
//                 bg-[#492E2A]
//                 px-5
//                 py-3.5
//                 text-sm
//                 font-bold
//                 text-[#F0C9C2]
//                 transition
//                 hover:bg-[#59342F]
//               "
//             >

//               <LogOut size={17} />

//               Logout

//             </button>

//           </div>

//         )}

//       </div>

//     </header>
//   );
// }


import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  Home,
  Building2,
  MessageSquare,
  CalendarDays,
  BarChart3,
  Tag,
  UserRound,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Mail,
  ArrowLeftRight,
  Check,
} from "lucide-react";

import NotificationBell from "./NotificationBell";

/* =========================================================
   STRAPI
========================================================= */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL ||
  "http://localhost:1337";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  `${STRAPI_URL}/api`;

function getStrapiItems(value) {
  if (Array.isArray(value)) {
    return value.map(getStrapiEntry);
  }

  if (Array.isArray(value?.data)) {
    return value.data.map(getStrapiEntry);
  }

  return [];
}

function getStrapiEntry(entry) {
  if (entry?.attributes) {
    return {
      ...entry,
      ...entry.attributes,
    };
  }

  return entry;
}

function hasOwnerDropdownData(header) {
  return getStrapiItems(header?.OwnerNavItem).some((item) => {
    const dropdown =
      item?.OwnerDropdownItem ??
      item?.ownerDropdownItem ??
      item?.OwnerDropdownItems ??
      item?.ownerDropdownItems ??
      item?.DropdownItems ??
      item?.DropdownItem ??
      item?.dropdownItems ??
      item?.dropdownItem;

    return getStrapiItems(dropdown).length > 0;
  });
}

function hasOwnerProfileMenuData(header) {
  return getStrapiItems(header?.OwnerProfileMenu).length > 0;
}

/* =========================================================
   HEADER
========================================================= */

export default function Header({ headerData }) {
  const router = useRouter();
  const pathname = usePathname();

  /* =======================================================
     STATES
  ======================================================= */

  const [owner, setOwner] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [nestedHeaderData, setNestedHeaderData] = useState(null);
  const [ownerProfileMenuData, setOwnerProfileMenuData] = useState([]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobilePromotionsOpen, setMobilePromotionsOpen] = useState(false);

  const [loadingOwner, setLoadingOwner] = useState(true);

  // ─── Mode Switcher ───────────────────────────────────────────
  // activeMode is purely a UI/navigation preference.
  // It does NOT affect the Strapi JWT or authentication role.
  const [activeMode, setActiveMode] = useState("seller");
  const [modeSwitcherOpen, setModeSwitcherOpen] = useState(false);

  const headerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function loadOwnerHeaderDropdowns() {
      if (hasOwnerDropdownData(headerData)) {
        setNestedHeaderData(null);
        return;
      }

      try {
        const query =
          `${API_URL}/owner-dashboard?` +
          `populate[header][populate][Logo]=true` +
          `&populate[header][populate][OwnerNavItem][populate][OwnerDropdownItem]=true`;

        const response = await fetch(query, {
          cache: "no-store",
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            result?.error?.message ||
              "Unable to load owner header dropdowns."
          );
        }

        const dashboard = getStrapiEntry(result?.data);
        const header =
          getStrapiEntry(dashboard?.header) ||
          getStrapiEntry(dashboard?.Header) ||
          null;

        if (mounted && header) {
          setNestedHeaderData(header);
        }
      } catch (error) {
        console.error(
          "OWNER HEADER DROPDOWN ERROR:",
          error
        );
      }
    }

    loadOwnerHeaderDropdowns();

    return () => {
      mounted = false;
    };
  }, [headerData]);

  const effectiveHeaderData =
    nestedHeaderData || headerData;

  useEffect(() => {
    let mounted = true;

    async function loadOwnerProfileMenu() {
      if (hasOwnerProfileMenuData(effectiveHeaderData)) {
        setOwnerProfileMenuData([]);
        return;
      }

      const profileMenuQueries = [
        `${API_URL}/headers?populate[OwnerProfileMenu]=true`,
        `${API_URL}/header?populate[OwnerProfileMenu]=true`,
      ];

      for (const query of profileMenuQueries) {
        try {
          const response = await fetch(query, {
            cache: "no-store",
          });

          if (!response.ok) {
            continue;
          }

          const result = await response.json().catch(() => null);
          const records = getStrapiItems(result?.data);
          const header =
            records.find(hasOwnerProfileMenuData) ||
            getStrapiEntry(result?.data);
          const menu = getStrapiItems(header?.OwnerProfileMenu);

          if (mounted && menu.length > 0) {
            setOwnerProfileMenuData(menu);
            return;
          }
        } catch (error) {
          console.error(
            "OWNER PROFILE MENU ERROR:",
            error
          );
        }
      }
    }

    loadOwnerProfileMenu();

    return () => {
      mounted = false;
    };
  }, [effectiveHeaderData]);

  /* =======================================================
     LOAD LOGGED-IN OWNER
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadOwnerProfile() {
      try {
        setLoadingOwner(true);

        const token = localStorage.getItem("token");

        if (!token) {
          if (mounted) {
            setOwner(null);
            setOwnerProfile(null);
          }

          return;
        }

        const userResponse = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const currentUser =
          await userResponse.json().catch(() => null);

        if (!userResponse.ok) {
          throw new Error(
            currentUser?.error?.message ||
              "Unable to load Owner."
          );
        }

        if (!mounted) return;

        setOwner(currentUser);

        const profileQuery =
          `${API_URL}/user-profiles?` +
          `filters[users_permissions_user][id][$eq]=${currentUser.id}` +
          `&populate[ProfileDetails][populate]=*`;

        const profileResponse = await fetch(profileQuery, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const profileResult =
          await profileResponse.json().catch(() => null);

        if (!profileResponse.ok) {
          console.error(
            "OWNER PROFILE ERROR:",
            profileResult
          );

          if (mounted) {
            setOwnerProfile(null);
          }

          return;
        }

        const profile =
          profileResult?.data?.[0] || null;

        if (mounted) {
          setOwnerProfile(profile);
        }

        console.log("CURRENT OWNER:", currentUser);
        console.log("OWNER PROFILE:", profile);
      } catch (error) {
        console.error(
          "LOAD OWNER PROFILE ERROR:",
          error
        );

        if (mounted) {
          setOwner(null);
          setOwnerProfile(null);
        }
      } finally {
        if (mounted) {
          setLoadingOwner(false);
        }
      }
    }

    loadOwnerProfile();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     OWNER NAVIGATION FROM STRAPI
     
     Expected Strapi structure:

     OwnerNavItem
       ├── Title
       ├── Icon
       ├── Url
       ├── DisplayOrder
       ├── IsActive
       └── OwnerDropdownItem
             ├── Title
             ├── Icon
             ├── Url
             ├── DisplayOrder
             └── IsActive
  ======================================================= */

  const ownerNavItems = useMemo(() => {
    const nav = getStrapiItems(
      effectiveHeaderData?.OwnerNavItem
    );

    if (!Array.isArray(nav)) {
      console.warn(
        "OwnerNavItem is not an array:",
        nav
      );

      return [];
    }

    return [...nav]
      .filter((item) => {
        return (
          item?.IsActive !== false &&
          item?.isActive !== false
        );
      })
      .sort((a, b) => {
        const orderA =
          Number(
            a?.DisplayOrder ??
              a?.displayOrder ??
              999
          ) || 999;

        const orderB =
          Number(
            b?.DisplayOrder ??
              b?.displayOrder ??
              999
          ) || 999;

        return orderA - orderB;
      });
  }, [effectiveHeaderData]);

  /* =======================================================
     OWNER PROFILE MENU
  ======================================================= */

  const ownerMenuItems = useMemo(() => {
    const menu =
      getStrapiItems(
        effectiveHeaderData?.OwnerProfileMenu
      ) || [];

    const profileMenu =
      menu.length > 0 ? menu : ownerProfileMenuData;

    if (!Array.isArray(profileMenu)) {
      return [];
    }

    return [...profileMenu]
      .filter((item) => {
        return (
          item?.IsActive !== false &&
          item?.isActive !== false
        );
      })
      .sort((a, b) => {
        const orderA =
          Number(
            a?.DisplayOrder ??
              a?.displayOrder ??
              999
          ) || 999;

        const orderB =
          Number(
            b?.DisplayOrder ??
              b?.displayOrder ??
              999
          ) || 999;

        return orderA - orderB;
      });
  }, [effectiveHeaderData, ownerProfileMenuData]);

  const ownerProfileUrl = "/owner/profile";

  /* =======================================================
     OWNER DATA
  ======================================================= */

  const firstName =
    ownerProfile?.ProfileDetails?.FirstName || "";

  const lastName =
    ownerProfile?.ProfileDetails?.LastName || "";

  const profileName =
    `${firstName} ${lastName}`.trim();

  const ownerName =
    profileName ||
    owner?.username ||
    "Owner";

  const ownerEmail =
    owner?.email || "";

  const profileImage =
    ownerProfile?.ProfileDetails?.ProfileImage;

  const profileImageUrl =
    profileImage?.url
      ? `${STRAPI_URL}${profileImage.url}`
      : null;

  const ownerInitial =
    ownerName.charAt(0).toUpperCase();

  /* =======================================================
     ICON HELPER
  ======================================================= */

  function renderIcon(iconName, size = 20) {
    const icon = String(iconName || "")
      .trim()
      .toLowerCase()
      .replace(/[-_\s]/g, "");

    const iconProps = { size, strokeWidth: 2 };

    switch (icon) {
      case "home":
      case "dashboard":
        return <Home {...iconProps} />;
      case "building":
      case "building2":
      case "property":
      case "properties":
      case "myproperties":
        return <Building2 {...iconProps} />;
      case "message":
      case "messages":
      case "enquiry":
      case "enquiries":
        return <MessageSquare {...iconProps} />;
      case "calendar":
      case "visit":
      case "visits":
      case "sitevisit":
      case "sitevisits":
        return <CalendarDays {...iconProps} />;
      case "chart":
      case "analytics":
      case "insights":
      case "bar":
        return <BarChart3 {...iconProps} />;
      case "tag":
      case "promotion":
      case "promotions":
        return <Tag {...iconProps} />;
      case "user":
      case "profile":
        return <UserRound {...iconProps} />;
      case "settings":
        return <Settings {...iconProps} />;
      default:
        return <Home {...iconProps} />;
    }
  }

  /* =======================================================
     DROPDOWN ITEMS FROM STRAPI
  ======================================================= */

  function getDropdownItems(item) {
    const parentTitle = (item?.Title || item?.title || "").trim().toLowerCase();
    if (parentTitle === "promotions") {
      return [];
    }

    const dropdown =
      item?.OwnerDropdownItem ??
      item?.ownerDropdownItem ??
      item?.OwnerDropdownItems ??
      item?.ownerDropdownItems ??
      item?.DropdownItems ??
      item?.DropdownItem ??
      item?.dropdownItems ??
      item?.dropdownItem ??
      [];

    const dropdownItems = getStrapiItems(dropdown);

    if (!Array.isArray(dropdownItems)) return [];

    // ─────────────────────────────────────────────────────────────
    // OWNER PROPERTY WORKFLOW: remove "Pending" and "Drafts" from
    // the My Properties dropdown — only All Properties / Active /
    // Sold / Rented are part of the required Owner-facing workflow.
    // (Strapi Draft & Publish functionality is NOT affected.)
    // ─────────────────────────────────────────────────────────────
    const EXCLUDED_TITLES = ["pending", "drafts", "draft"];

    return [...dropdownItems]
      .filter((d) => {
        if (d?.IsActive === false || d?.isActive === false) return false;
        const dTitle = (d?.Title || d?.title || "").trim().toLowerCase();
        return !EXCLUDED_TITLES.includes(dTitle);
      })
      .sort((a, b) => {
        const oA = Number(a?.DisplayOrder ?? a?.displayOrder ?? 999) || 999;
        const oB = Number(b?.DisplayOrder ?? b?.displayOrder ?? 999) || 999;
        return oA - oB;
      });
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  // Read persisted activeMode on mount, but enforce based on URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Force correct mode based on URL
    if (pathname?.startsWith("/owner")) {
      setActiveMode("seller");
      localStorage.setItem("activeMode", "seller");
      return;
    }
    if (pathname?.startsWith("/user")) {
      setActiveMode("buyer");
      localStorage.setItem("activeMode", "buyer");
      return;
    }

    const saved = localStorage.getItem("activeMode");
    if (saved === "buyer" || saved === "seller") {
      setActiveMode(saved);
    } else {
      setActiveMode("seller");
      localStorage.setItem("activeMode", "seller");
    }
  }, [pathname]);

  // Close mode switcher dropdown when clicking outside
  useEffect(() => {
    function onOutside(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setModeSwitcherOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  function handleModeSwitch(mode) {
    if (mode === activeMode) {
      setModeSwitcherOpen(false);
      return;
    }
    // Save purely as a UI preference — does NOT alter Strapi JWT or role
    localStorage.setItem("activeMode", mode);
    setActiveMode(mode);
    setModeSwitcherOpen(false);
    if (mode === "buyer") {
      router.push("/user");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("activeMode");
    setOwner(null);
    setOwnerProfile(null);
    setProfileOpen(false);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    router.replace("/login");
  }

  /* =======================================================
     CLOSE MENUS
  ======================================================= */

  function closeMenus() {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }

  /* =======================================================
     ACTIVE NAV
  ======================================================= */

  function isActive(url) {
    if (!url || url === "#") return false;
    if (url === "/") return pathname === "/";
    return pathname === url || pathname?.startsWith(`${url}/`);
  }

  function isDropdownActive(dropdownItems) {
    return dropdownItems.some((d) => {
      const url = d?.Url || d?.URL || d?.url || "#";
      return isActive(url);
    });
  }

  /* =======================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    function handleOutsideClick(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <header
      ref={headerRef}
      className="
        sticky
        top-0
        z-50
        border-b
        border-[#2E6654]
        bg-gradient-to-r
        from-[#0A372C]
        via-[#104A3A]
        to-[#0A372C]
        shadow-[0_8px_35px_rgba(8,48,38,0.30)]
      "
    >
      {/* GOLD TOP LINE */}
      <div
        className="
          h-[2px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-[#D7AE62]
          to-transparent
          opacity-90
        "
      />

      <div
        className="
          mx-auto
          max-w-[1600px]
          px-5
          sm:px-7
          lg:px-10
        "
      >
        {/* =================================================
            MAIN HEADER
        ================================================= */}

        <div
          className="
            flex
            min-h-[78px]
            items-center
            gap-5
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            onClick={closeMenus}
            className="
              group
              flex
              shrink-0
              items-center
              gap-3
            "
          >
            {effectiveHeaderData?.Logo?.url ? (
              <div
                className="
                  relative
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#D7AE62]/70
                  bg-[#F2E6CF]
                  shadow-[0_5px_18px_rgba(0,0,0,0.20)]
                  transition-all
                  duration-300
                  group-hover:scale-105
                  group-hover:shadow-[0_7px_22px_rgba(215,174,98,0.20)]
                "
              >
                <Image
                  src={`${STRAPI_URL}${effectiveHeaderData.Logo.url}`}
                  alt={effectiveHeaderData?.Brand || "HomeHub"}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#E2BB6D]
                  bg-[#D7AE62]
                  text-[#123F32]
                "
              >
                <Home size={24} />
              </div>
            )}

            <div className="hidden sm:block">
              <h1
                className="
                  text-[23px]
                  font-extrabold
                  leading-none
                  tracking-tight
                  text-[#F7F0E3]
                "
              >
                {effectiveHeaderData?.Brand || "HomeHub"}
              </h1>
              <p
                className="
                  mt-0.5
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  text-[#D7AE62]
                "
              >
                Owner Portal
              </p>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav
            className="
              hidden
              min-w-0
              flex-1
              items-center
              justify-center
              lg:flex
            "
          >
            <div className="flex items-center gap-1">
              {ownerNavItems.length > 0 ? (
                ownerNavItems.map((item, index) => {
                  const title = item?.Title || item?.title || "Menu";
                  const url = item?.Url || item?.URL || item?.url || "#";
                  const icon = item?.Icon || item?.icon || "";
                  const dropdownItems = getDropdownItems(item);
                  const hasDropdown = dropdownItems.length > 0;
                  const active = isActive(url);
                  const dropdownActiveState = isDropdownActive(dropdownItems);
                  const isOpen = openDropdown === index;
                  const highlighted = active || dropdownActiveState || isOpen;

                  return (
                    <div
                      key={`${title}-${index}`}
                      className="relative flex h-full items-center"
                      onMouseEnter={() => { if (hasDropdown) setOpenDropdown(index); }}
                      onMouseLeave={() => { if (hasDropdown) setOpenDropdown(null); }}
                    >
                      {hasDropdown ? (
                        <button
                          type="button"
                          onFocus={() => setOpenDropdown(index)}
                          aria-expanded={isOpen}
                          className={`group relative flex items-center gap-2 rounded-xl px-3.5 py-3 text-[13px] font-bold transition-all duration-200 ${highlighted ? "bg-[#D7AE62] text-[#123F32] shadow-[0_5px_20px_rgba(215,174,98,0.25)]" : "text-[#DDE9E3] hover:bg-[#174F3E] hover:text-[#F3D59B]"}`}
                        >
                          <span className={`flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${highlighted ? "text-[#123F32]" : "text-[#C9D8D1]"}`}>
                            {renderIcon(icon, 20)}
                          </span>
                          <span className="whitespace-nowrap">{title}</span>
                          {highlighted && <span className="absolute bottom-[3px] left-1/2 h-[2px] w-7 -translate-x-1/2 rounded-full bg-[#123F32]/45" />}
                        </button>
                      ) : (
                        <Link
                          href={url}
                          onClick={closeMenus}
                          className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[13px] font-bold transition-all duration-200 ${active ? "bg-[#D7AE62] text-[#123F32] shadow-[0_5px_20px_rgba(215,174,98,0.22)]" : "text-[#DDE9E3] hover:bg-[#174F3E] hover:text-[#F3D59B]"}`}
                        >
                          <span className={`transition-transform duration-200 group-hover:scale-110 ${active ? "text-[#123F32]" : "text-[#C9D8D1]"}`}>
                            {renderIcon(icon, 20)}
                          </span>
                          <span className="whitespace-nowrap">{title}</span>
                          {active && <span className="absolute bottom-[3px] left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-[#123F32]/45" />}
                        </Link>
                      )}

                      {hasDropdown && (
                        <div
                          className={`absolute left-1/2 top-full z-[100] min-w-[240px] w-max max-w-[320px] -translate-x-1/2 pt-1.5 transition-all duration-200 ease-out ${isOpen ? "pointer-events-auto translate-y-0 opacity-100 visible" : "pointer-events-none translate-y-1.5 opacity-0 invisible"}`}
                          onMouseEnter={() => setOpenDropdown(index)}
                        >
                          <span className="absolute left-0 right-0 top-0 h-2" />
                          <div className="overflow-hidden rounded-xl border border-[#D7AE62]/45 bg-[#F7F0E3] shadow-[0_22px_55px_rgba(10,55,44,0.38)]">
                            <div className="border-b border-[#E1D4BB] bg-[#EEE2CC] px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D7AE62] text-[#123F32]">
                                  {renderIcon(icon, 17)}
                                </span>
                                <p className="text-sm font-extrabold text-[#173F35]">{title}</p>
                              </div>
                            </div>
                            <div className="p-2">
                              {dropdownItems.map((dropdownItem, dropdownIndex) => {
                                const dTitle = dropdownItem?.Title || dropdownItem?.title || "Option";
                                const dUrl = dropdownItem?.Url || dropdownItem?.URL || dropdownItem?.url || "#";
                                const dIcon = dropdownItem?.Icon || dropdownItem?.icon || "";
                                const dActive = isActive(dUrl);
                                return (
                                  <Link
                                    key={`${dTitle}-${dropdownIndex}`}
                                    href={dUrl}
                                    onClick={closeMenus}
                                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${dActive ? "bg-[#D7AE62]/25 ring-1 ring-[#D7AE62]/40" : "hover:bg-[#EDE1CC]"}`}
                                  >
                                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${dActive ? "bg-[#D7AE62] text-[#123F32]" : "bg-[#E8DDCA] text-[#8B6728] group-hover:bg-[#D7AE62] group-hover:text-[#123F32]"}`}>
                                      {renderIcon(dIcon, 17)}
                                    </span>
                                    <span className="block text-[13px] font-bold text-[#29493E]">{dTitle}</span>
                                    <ChevronRight size={16} className="ml-auto shrink-0 text-[#8B6728] opacity-0 transition-opacity group-hover:opacity-100" />
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <>
                  <Link href="/owner/dashboard" onClick={closeMenus} className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[13px] font-bold transition-all duration-200 ${isActive("/owner/dashboard") ? "bg-[#D7AE62] text-[#123F32]" : "text-[#DDE9E3] hover:bg-[#174F3E] hover:text-[#F3D59B]"}`}>
                    <Home size={20} /><span>Dashboard</span>
                  </Link>
                  <Link href="/owner/properties" onClick={closeMenus} className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[13px] font-bold transition-all duration-200 ${isActive("/owner/properties") ? "bg-[#D7AE62] text-[#123F32]" : "text-[#DDE9E3] hover:bg-[#174F3E] hover:text-[#F3D59B]"}`}>
                    <Building2 size={20} /><span>My Properties</span>
                  </Link>
                  <Link href="/owner/enquiries/new" onClick={closeMenus} className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[13px] font-bold transition-all duration-200 ${isActive("/owner/enquiries") ? "bg-[#D7AE62] text-[#123F32]" : "text-[#DDE9E3] hover:bg-[#174F3E] hover:text-[#F3D59B]"}`}>
                    <MessageSquare size={20} /><span>Enquiries</span>
                  </Link>
                  <Link href="/owner/enquiries/site-visits" onClick={closeMenus} className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[13px] font-bold transition-all duration-200 ${isActive("/owner/enquiries/site-visits") ? "bg-[#D7AE62] text-[#123F32]" : "text-[#DDE9E3] hover:bg-[#174F3E] hover:text-[#F3D59B]"}`}>
                    <CalendarDays size={20} /><span>Site Visits</span>
                  </Link>
                  <Link href="/owner/insights" onClick={closeMenus} className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[13px] font-bold transition-all duration-200 ${isActive("/owner/insights") ? "bg-[#D7AE62] text-[#123F32]" : "text-[#DDE9E3] hover:bg-[#174F3E] hover:text-[#F3D59B]"}`}>
                    <BarChart3 size={20} /><span>Insights</span>
                  </Link>

                  {/* Promotions Link */}
                  <Link href="/owner/promotions" onClick={closeMenus} className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[13px] font-bold transition-all duration-200 ${isActive("/owner/promotions") ? "bg-[#D7AE62] text-[#123F32]" : "text-[#DDE9E3] hover:bg-[#174F3E] hover:text-[#F3D59B]"}`}>
                    <Tag size={20} /><span>Promotions</span>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-2
              lg:gap-3
            "
          >
            {/* ── MODE SWITCHER ──────────────────────────────── */}

            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setModeSwitcherOpen((p) => !p)}
                aria-label="Switch mode"
                className={`
                  flex h-11 items-center gap-2 rounded-xl border px-3
                  text-[13px] font-bold transition-all duration-200
                  ${
                    modeSwitcherOpen
                      ? "border-[#D7AE62] bg-[#1B513F] text-[#F3D59B] shadow-[0_4px_18px_rgba(215,174,98,0.18)]"
                      : "border-[#4A7465] bg-[#164B3B] text-[#DDE9E3] hover:border-[#D7AE62] hover:bg-[#1B513F] hover:text-[#F3D59B]"
                  }
                `}
              >
                {activeMode === "seller" ? (
                  <>
                    <Home size={15} />
                    <span>Seller Mode</span>
                  </>
                ) : (
                  <>
                    <ArrowLeftRight size={15} />
                    <span>Buyer Mode</span>
                  </>
                )}
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${modeSwitcherOpen ? "rotate-180" : ""}`}
                />
              </button>

              {modeSwitcherOpen && (
                <div className="absolute right-0 top-full mt-2 w-[180px] overflow-hidden rounded-xl border border-[#D5C6AA] bg-[#F4EBDD] shadow-[0_18px_50px_rgba(18,63,50,0.28)] z-[200]">
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => handleModeSwitch("seller")}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-bold transition ${
                        activeMode === "seller"
                          ? "bg-[#D7AE62]/20 text-[#174B3B]"
                          : "text-[#365247] hover:bg-[#E7D8BD] hover:text-[#174B3B]"
                      }`}
                    >
                      <Home size={15} />
                      <span className="flex-1 text-left">Seller Mode</span>
                      {activeMode === "seller" && <Check size={14} className="text-[#D7AE62]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleModeSwitch("buyer")}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-bold transition ${
                        activeMode === "buyer"
                          ? "bg-[#D7AE62]/20 text-[#174B3B]"
                          : "text-[#365247] hover:bg-[#E7D8BD] hover:text-[#174B3B]"
                      }`}
                    >
                      <ArrowLeftRight size={15} />
                      <span className="flex-1 text-left">Buyer Mode</span>
                      {activeMode === "buyer" && <Check size={14} className="text-[#D7AE62]" />}
                    </button>

                    <div className="my-1.5 mx-1 h-px bg-[#D5C6AA]" />
                    
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-bold text-[#9B4036] transition hover:bg-[#EBD4CB]"
                    >
                      <LogOut size={15} />
                      <span className="flex-1 text-left">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* NOTIFICATION */}

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#4A7465]
                bg-[#164B3B]
                text-[#F3D59B]
                shadow-[0_3px_12px_rgba(0,0,0,0.12)]
                transition-all
                duration-200
                hover:border-[#D7AE62]
                hover:bg-[#1C5947]
                hover:text-[#F6D58D]
                [&_button]:!border-0
                [&_button]:!bg-transparent
                [&_button]:!p-0
                [&_button]:!text-[#F3D59B]
                [&_svg]:!h-[20px]
                [&_svg]:!w-[20px]
                [&_svg]:!text-[#F3D59B]
              "
              title="Notifications"
            >
              <NotificationBell />
            </div>

            {/* PROFILE */}

            <div
              className="
                relative
                hidden
                lg:block
              "
            >
              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    (previous) => !previous
                  )
                }
                aria-label="Open profile menu"
                className={`
                  group
                  flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  border
                  px-1.5
                  py-1.5
                  transition-all
                  duration-200

                  ${
                    profileOpen
                      ? `
                        border-[#D7AE62]
                        bg-[#1B513F]
                        shadow-[0_5px_20px_rgba(215,174,98,0.15)]
                      `
                      : `
                        border-[#416C5C]
                        bg-[#174B3B]
                        hover:border-[#D7AE62]
                        hover:bg-[#1B513F]
                      `
                  }
                `}
              >
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="
                      h-9
                      w-9
                      rounded-full
                      object-cover
                      ring-2
                      ring-[#D7AE62]/60
                    "
                    unoptimized
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-[#D7AE62]
                      font-bold
                      text-[#123F32]
                    "
                  >
                    {ownerInitial}
                  </div>
                )}

              </button>

              {/* PROFILE DROPDOWN */}

              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-full
                    mt-3
                    w-[230px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#D5C6AA]
                    bg-[#F4EBDD]
                    shadow-[0_22px_60px_rgba(18,63,50,0.32)]
                  "
                >
                  <div className="p-2">
                    {false ? (
                      ownerMenuItems.map(
                        (item, index) => {
                          const title =
                            item?.Title ||
                            item?.title ||
                            "Menu";

                          const url =
                            item?.Url ||
                            item?.URL ||
                            item?.url ||
                            "#";

                          const icon =
                            item?.Icon ||
                            item?.icon ||
                            "";

                          return (
                            <Link
                              key={`${title}-${index}`}
                              href={url}
                              onClick={closeMenus}
                              className="
                                group
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-3
                                py-2.5
                                text-sm
                                font-semibold
                                text-[#365247]
                                transition
                                hover:bg-[#E7D8BD]
                                hover:text-[#174B3B]
                              "
                            >
                              <span
                                className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-[#E8DCC8]
                                  text-[#A97928]
                                  transition
                                  group-hover:bg-[#D7AE62]
                                  group-hover:text-[#123F32]
                                "
                              >
                                {renderIcon(
                                  icon,
                                  18
                                )}
                              </span>

                              <span className="flex-1">
                                {title}
                              </span>

                              <span
                                className="
                                  text-[#9B8A70]
                                  transition
                                  group-hover:translate-x-1
                                  group-hover:text-[#A97928]
                                "
                              >
                                →
                              </span>
                            </Link>
                          );
                        }
                      )
                    ) : (
                      <>
                        <Link
                          href={ownerProfileUrl}
                          onClick={closeMenus}
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-2.5
                            text-sm
                            font-semibold
                            text-[#365247]
                            transition
                            hover:bg-[#E7D8BD]
                          "
                        >
                          <UserRound
                            size={18}
                            className="text-[#A97928]"
                          />
                          My Profile
                        </Link>

                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ADD PROPERTY */}

            <Link
              href="/add-property"
              onClick={closeMenus}
              className="
                hidden
                xl:flex
                items-center
                gap-2
                rounded-xl
                border
                border-[#D7AE62]
                bg-[#D7AE62]
                px-5
                py-3
                text-[13px]
                font-extrabold
                text-[#123F32]
                shadow-[0_5px_16px_rgba(215,174,98,0.18)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#E4C27E]
                hover:shadow-[0_8px_22px_rgba(215,174,98,0.28)]
              "
            >
              <span className="text-base">
                +
              </span>

              Add Property
            </Link>

            {/* MOBILE BUTTON */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (previous) => !previous
                )
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-[#416C5C]
                bg-[#174B3B]
                text-[#F3E7D2]
                transition-all
                hover:border-[#D7AE62]
                hover:text-[#D7AE62]
                lg:hidden
              "
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>
          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        {mobileMenuOpen && (
          <div
            className="
              border-t
              border-[#2F6653]
              py-4
              lg:hidden
            "
          >
            <div
              className="
                mb-4
                rounded-2xl
                border
                border-[#416C5C]
                bg-[#174B3B]
                p-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="
                      h-12
                      w-12
                      rounded-full
                      object-cover
                      ring-2
                      ring-[#D7AE62]/60
                    "
                    unoptimized
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-[#D7AE62]
                      font-bold
                      text-[#123F32]
                    "
                  >
                    {ownerInitial}
                  </div>
                )}

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      font-extrabold
                      text-[#F5ECDD]
                    "
                  >
                    {loadingOwner
                      ? "Loading..."
                      : ownerName}
                  </p>

                  <p
                    className="
                      truncate
                      text-xs
                      text-[#BFD0C7]
                    "
                  >
                    {ownerEmail}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#D7AE62]
                    "
                  >
                    Property Owner
                  </p>
                </div>
              </div>
            </div>

            {/* MOBILE NAV */}

            <div className="space-y-1">
              {ownerNavItems.map(
                (item, index) => {
                  const title =
                    item?.Title ||
                    item?.title ||
                    "Menu";

                  const url =
                    item?.Url ||
                    item?.URL ||
                    item?.url ||
                    "#";

                  const icon =
                    item?.Icon ||
                    item?.icon ||
                    "";

                  const dropdownItems =
                    getDropdownItems(item);

                  const hasDropdown =
                    dropdownItems.length > 0;

                  const active =
                    isActive(url);

                  const dropdownActive =
                    isDropdownActive(
                      dropdownItems
                    );

                  const isOpen =
                    openDropdown ===
                    `mobile-${index}`;

                  return (
                    <div
                      key={`${title}-mobile-${index}`}
                    >
                      {hasDropdown ? (
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDropdown(
                              isOpen
                                ? null
                                : `mobile-${index}`
                            )
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-sm
                            font-semibold
                            transition-all

                            ${
                              active ||
                              dropdownActive ||
                              isOpen
                                ? `
                                  bg-[#D7AE62]
                                  text-[#123F32]
                                `
                                : `
                                  text-[#DDE9E1]
                                  hover:bg-[#1B513F]
                                  hover:text-[#F3D59B]
                                `
                            }
                          `}
                        >
                          <span
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-[#225541]
                            "
                          >
                            {renderIcon(
                              icon,
                              19
                            )}
                          </span>

                          <span className="flex-1 text-left">
                            {title}
                          </span>

                        </button>
                      ) : (
                        <Link
                          href={url}
                          onClick={closeMenus}
                          className={`
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-sm
                            font-semibold
                            transition-all

                            ${
                              active
                                ? `
                                  bg-[#D7AE62]
                                  text-[#123F32]
                                `
                                : `
                                  text-[#DDE9E1]
                                  hover:bg-[#1B513F]
                                  hover:text-[#F3D59B]
                                `
                            }
                          `}
                        >
                          <span
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-[#225541]
                            "
                          >
                            {renderIcon(
                              icon,
                              19
                            )}
                          </span>

                          {title}
                        </Link>
                      )}

                      {/* MOBILE DROPDOWN */}

                      {hasDropdown &&
                        isOpen && (
                          <div
                            className="
                              ml-12
                              mt-1
                              space-y-1
                              border-l-2
                              border-[#D7AE62]/50
                              pl-3
                            "
                          >
                            {dropdownItems.map(
                              (
                                dropdownItem,
                                dropdownIndex
                              ) => {
                                const dropdownTitle =
                                  dropdownItem?.Title ||
                                  dropdownItem?.title ||
                                  "Option";

                                const dropdownUrl =
                                  dropdownItem?.Url ||
                                  dropdownItem?.URL ||
                                  dropdownItem?.url ||
                                  "#";

                                const dropdownIcon =
                                  dropdownItem?.Icon ||
                                  dropdownItem?.icon ||
                                  "";

                                const dropdownActive =
                                  isActive(
                                    dropdownUrl
                                  );

                                return (
                                  <Link
                                    key={`${dropdownTitle}-${dropdownIndex}`}
                                    href={dropdownUrl}
                                    onClick={
                                      closeMenus
                                    }
                                    className={`
                                      flex
                                      items-center
                                      gap-3
                                      rounded-lg
                                      px-3
                                      py-2.5
                                      text-xs
                                      font-semibold
                                      transition
                                      ${
                                        dropdownActive
                                          ? `
                                            bg-[#D7AE62]/20
                                            text-[#F3D59B]
                                          `
                                          : `
                                            text-[#DDE9E1]
                                            hover:bg-[#1B513F]
                                            hover:text-[#F3D59B]
                                          `
                                      }
                                    `}
                                  >
                                    <span
                                      className={`
                                        flex
                                        h-7
                                        w-7
                                        items-center
                                        justify-center
                                        rounded-md
                                        ${
                                          dropdownActive
                                            ? `
                                              bg-[#D7AE62]
                                              text-[#123F32]
                                            `
                                            : "bg-[#225541]"
                                        }
                                      `}
                                    >
                                      {renderIcon(
                                        dropdownIcon,
                                        14
                                      )}
                                    </span>

                                    {dropdownTitle}
                                  </Link>
                                );
                              }
                            )}
                          </div>
                        )}
                    </div>
                  );
                }
              )}
            </div>

            {/* MOBILE ADD PROPERTY */}

            <Link
              href="/add-property"
              onClick={closeMenus}
              className="
                mt-4
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#D7AE62]
                bg-[#D7AE62]
                px-5
                py-3.5
                text-sm
                font-extrabold
                text-[#123F32]
                shadow-[0_6px_18px_rgba(215,174,98,0.20)]
                transition-all
                hover:bg-[#E4C27E]
              "
            >
              <span className="text-lg">
                +
              </span>

              Add Property
            </Link>

            {/* MOBILE LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="
                mt-2
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#70443E]
                bg-[#492E2A]
                px-5
                py-3.5
                text-sm
                font-bold
                text-[#F0C9C2]
                transition
                hover:bg-[#59342F]
              "
            >
              <LogOut size={17} />

              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
