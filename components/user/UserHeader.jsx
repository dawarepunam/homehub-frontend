// // "use client";

// // import { useEffect, useState } from "react";
// // import Image from "next/image";
// // import Link from "next/link";

// // import ProfileDropdown from "./ProfileDropdown";
// // import UserDropdown from "./UserDropdown";

// // const STRAPI_URL =
// //   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
// //   "http://localhost:1337";

// // export default function UserHeader({ headerData }) {
// //   const [activeMenu, setActiveMenu] = useState(null);
// //   const [user, setUser] = useState(null);
// //   const [showProfileMenu, setShowProfileMenu] = useState(false);

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       const savedUser = localStorage.getItem("user");

// //       if (savedUser) {
// //         setUser(JSON.parse(savedUser));
// //       }
// //     }, 0);

// //     return () => clearTimeout(timer);
// //   }, []);

// //   if (!headerData) return null;

// //   const logo = headerData?.Logo?.url
// //     ? `${STRAPI_URL}${headerData.Logo.url}`
// //     : null;

// //   const menu = [...(headerData?.MenuItem || [])]
// //     .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0))
// //     .map((item) => ({
// //       ...item,

// //       DropdownItem: (item.DropdownItem || [])
// //         .filter(
// //           (dropdownItem) =>
// //             dropdownItem &&
// //             dropdownItem.IsActive &&
// //             dropdownItem.Text &&
// //             dropdownItem.Slug,
// //         )
// //         .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0)),
// //     }));

// //   return (
// //     <header className="sticky top-0 z-50 border-b bg-white shadow-md">
// //       <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
// //         <Link href="/user" className="flex items-center gap-3">
// //           {logo ? (
// //             <Image
// //               src={logo}
// //               alt={headerData.Brand}
// //               width={50}
// //               height={50}
// //               className="rounded-xl object-cover"
// //             />
// //           ) : (
// //             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
// //               H
// //             </div>
// //           )}

// //           <h1 className="text-3xl font-bold text-blue-700">
// //             {headerData.Brand}
// //           </h1>
// //         </Link>

// //         <div className="flex items-center gap-5 text-2xl">
// //           <button className="transition hover:text-blue-600">☰</button>

// //           {user ? (
// //             <div
// //               className="relative"
// //               onMouseEnter={() => setShowProfileMenu(true)}
// //               onMouseLeave={() => setShowProfileMenu(false)}
// //             >
// //               <button className="flex items-center gap-3">
// //                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
// //                   {user.username?.charAt(0).toUpperCase()}
// //                 </div>

// //                 <span className="text-base font-semibold text-gray-700">
// //                   {user.username}
// //                 </span>

// //                 <span className="text-xs">▼</span>
// //               </button>

// //               {showProfileMenu && (
// //                 <ProfileDropdown items={headerData?.ProfileMenu || []} />
// //               )}
// //             </div>
// //           ) : (
// //             <Link
// //               href="/user/login"
// //               className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
// //             >
// //               Login
// //             </Link>
// //           )}
// //         </div>
// //       </div>

// //       <div className="border-t bg-white">
// //         <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
// //           <button className="rounded-lg bg-gray-100 px-4 py-2 font-medium">
// //             📍 {headerData.DefaultLocation}
// //           </button>

// //           {menu
// //             .filter((item) => item.Title)
// //             .map((item) => (
// //               <div
// //                 key={item.id}
// //                 className="relative"
// //                 onMouseEnter={() => setActiveMenu(item.id)}
// //                 onMouseLeave={() => setActiveMenu(null)}
// //               >
// //                 <button
// //                   type="button"
// //                   onClick={() =>
// //                     setActiveMenu(activeMenu === item.id ? null : item.id)
// //                   }
// //                   className="flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition hover:bg-blue-50 hover:text-blue-700"
// //                 >
// //                   {item.Title}

// //                   {item.HasDropdown && item.DropdownItem.length > 0 && (
// //                     <span className="text-xs">▼</span>
// //                   )}
// //                 </button>
// //                 {activeMenu === item.id &&
// //                   item.HasDropdown &&
// //                   item.DropdownItem?.length > 0 && (
// //                     <div className="absolute left-0 top-full z-[9999]">
// //                       <UserDropdown menuItem={item} />
// //                     </div>
// //                   )}
// //                 {activeMenu === item.id &&
// //                   item.HasDropdown &&
// //                   item.DropdownItem?.length > 0 && (
// //                     <div className="absolute left-0 top-full z-[9999]">
// //                       <UserDropdown menuItem={item} />
// //                     </div>
// //                   )}
// //               </div>
// //             ))}
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import { Menu, MapPin, ArrowLeftRight, Check, Home, LogOut, Heart, MessageSquare } from "lucide-react";

// import ProfileDropdown from "./ProfileDropdown";
// import UserDropdown from "./UserDropdown";
// import ExploreDropdown from "./ExploreDropdown";
// import UserNotificationBell from "./UserNotificationBell";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// export default function UserHeader({ headerData }) {
//   const router = useRouter();
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [user, setUser] = useState(null);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   // ─── Mode Switcher ───────────────────────────────────────────
//   // activeMode is purely a UI/navigation preference.
//   // It does NOT affect the Strapi JWT or authentication role.
//   const [activeMode, setActiveMode] = useState("buyer");
//   const [modeSwitcherOpen, setModeSwitcherOpen] = useState(false);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     function loadUser() {
//       try {
//         const savedUser = window.localStorage.getItem("user");
//         if (savedUser) setUser(JSON.parse(savedUser));
//       } catch (error) {
//         console.error("User Parse Error:", error);
//       }
//     }

//     loadUser();

//     // Re-load when EditProfile or ProfilePage saves a new photo
//     window.addEventListener("userProfileUpdated", loadUser);
//     // Also refresh when user navigates back to this tab/page
//     document.addEventListener("visibilitychange", () => {
//       if (document.visibilityState === "visible") loadUser();
//     });
//     return () => {
//       window.removeEventListener("userProfileUpdated", loadUser);
//       document.removeEventListener("visibilitychange", loadUser);
//     };
//   }, []);


//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     // Read persisted activeMode
//     const saved = localStorage.getItem("activeMode");
//     if (saved === "seller" || saved === "buyer") {
//       setActiveMode(saved);
//     } else {
//       // Default: buyer when on the user module
//       setActiveMode("buyer");
//       localStorage.setItem("activeMode", "buyer");
//     }
//   }, []);


//   function handleModeSwitch(mode) {
//     if (mode === activeMode) {
//       setModeSwitcherOpen(false);
//       return;
//     }
//     // Save purely as a UI preference — does NOT alter Strapi JWT or role
//     localStorage.setItem("activeMode", mode);
//     setActiveMode(mode);
//     setModeSwitcherOpen(false);
//     if (mode === "seller") {
//       router.push("/");
//     }
//   }

//   function handleLogout() {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       localStorage.removeItem("userRole");
//       localStorage.removeItem("activeMode");
//     }
//     setUser(null);
//     router.replace("/user/login");
//   }

//   const logo = headerData?.Logo?.url
//     ? `${STRAPI_URL}${headerData.Logo.url}`
//     : null;

//   const brandName = headerData?.Brand || "HomeHub";
//   const defaultLocation = headerData?.DefaultLocation || "All India";

//   const menu = (headerData?.MenuItem || [])
//     .filter(Boolean)
//     .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0))
//     .map((item) => ({
//       ...item,
//       DropdownItem: (item.DropdownItem || [])
//         .filter(
//           (dropdown) =>
//             dropdown && dropdown.IsActive && dropdown.Text && dropdown.Slug,
//         )
//         .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0)),
//     }));

//   return (
//     <header
//       className="sticky top-0 z-50"
//       style={{
//         background: "linear-gradient(135deg, #0D3326 0%, #123F32 100%)",
//         borderBottom: "1px solid rgba(215,174,98,0.20)",
//         boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
//       }}
//     >
//       {/* Gold accent top line */}
//       <div
//         className="absolute top-0 left-0 right-0 h-[2px]"
//         style={{ background: "linear-gradient(90deg, transparent 0%, #D7AE62 40%, #D7AE62 60%, transparent 100%)" }}
//       />

//       {/* TOP HEADER */}
//       <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-4 lg:px-8">

//         {/* Logo + Brand */}
//         <Link href="/user" className="flex items-center gap-3">
//           {logo ? (
//             <Image
//               src={logo}
//               alt={brandName}
//               width={44}
//               height={44}
//               className="rounded-xl object-contain"
//               unoptimized
//             />
//           ) : (
//             <div
//               className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-extrabold"
//               style={{ background: "linear-gradient(135deg, #D7AE62, #C99A40)", color: "#0D3326" }}
//             >
//               H
//             </div>
//           )}
//           <div>
//             <span
//               className="block text-xl font-extrabold tracking-tight"
//               style={{ color: "#F3E7D2" }}
//             >
//               {brandName}
//             </span>
//             <span className="block text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(215,174,98,0.7)" }}>
//               Buyer Portal
//             </span>
//           </div>
//         </Link>

//         {/* Right actions */}
//         <div className="flex items-center gap-1.5">

//           {/* ── SAVED ──────────────────────────────── */}
//           <Link
//             href="/user/wishlist"
//             className="flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[13px] font-semibold transition-all duration-200 hover:bg-white/10"
//             style={{ borderColor: "rgba(215,174,98,0.25)", color: "#F3E7D2" }}
//           >
//             <Heart size={13} style={{ color: "#D7AE62" }} />
//             <span className="hidden sm:inline">Saved</span>
//           </Link>

//           {/* ── ENQUIRIES ──────────────────────────── */}
//           <Link
//             href="/user/enquiries"
//             className="flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[13px] font-semibold transition-all duration-200 hover:bg-white/10"
//             style={{ borderColor: "rgba(215,174,98,0.25)", color: "#F3E7D2" }}
//           >
//             <MessageSquare size={13} style={{ color: "#D7AE62" }} />
//             <span className="hidden sm:inline">Enquiries</span>
//           </Link>

//           {/* ── NOTIFICATION BELL ─────────────────────── */}
//           <UserNotificationBell />

//           {/* ── MODE SWITCHER ──────────────────────────── */}
//           <div className="relative">
//             <button
//               type="button"
//               onClick={() => setModeSwitcherOpen((p) => !p)}
//               aria-label="Switch mode"
//               className="flex h-9 items-center gap-2 rounded-xl border px-3 text-[13px] font-bold transition-all duration-200"
//               style={
//                 modeSwitcherOpen
//                   ? { borderColor: "#D7AE62", background: "rgba(215,174,98,0.18)", color: "#D7AE62" }
//                   : { borderColor: "rgba(215,174,98,0.25)", background: "rgba(215,174,98,0.07)", color: "#D7AE62" }
//               }
//             >
//               {activeMode === "buyer" ? (
//                 <>
//                   <ArrowLeftRight size={13} />
//                   <span className="hidden sm:inline">Buyer Mode</span>
//                 </>
//               ) : (
//                 <>
//                   <Home size={13} />
//                   <span className="hidden sm:inline">Seller Mode</span>
//                 </>
//               )}
//               <span className={`text-[10px] inline-block transition-transform duration-200 ${modeSwitcherOpen ? "rotate-180" : ""}`}>▾</span>
//             </button>

//             {modeSwitcherOpen && (
//               <div
//                 className="absolute right-0 top-full mt-2 w-[180px] overflow-hidden rounded-2xl shadow-2xl z-[200]"
//                 style={{ background: "#fff", border: "1px solid #EDE8DF" }}
//               >
//                 <div className="p-1.5">
//                   <button
//                     type="button"
//                     onClick={() => handleModeSwitch("buyer")}
//                     className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-bold transition"
//                     style={
//                       activeMode === "buyer"
//                         ? { background: "rgba(13,51,38,0.08)", color: "#0D3326" }
//                         : { color: "#374151" }
//                     }
//                   >
//                     <ArrowLeftRight size={13} style={{ color: "#226E58" }} />
//                     <span className="flex-1 text-left">Buyer Mode</span>
//                     {activeMode === "buyer" && <Check size={13} style={{ color: "#226E58" }} />}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => handleModeSwitch("seller")}
//                     className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-bold transition hover:bg-gray-50"
//                     style={
//                       activeMode === "seller"
//                         ? { background: "rgba(13,51,38,0.08)", color: "#0D3326" }
//                         : { color: "#374151" }
//                     }
//                   >
//                     <Home size={13} style={{ color: "#0D3326" }} />
//                     <span className="flex-1 text-left">Seller Mode</span>
//                     {activeMode === "seller" && <Check size={13} style={{ color: "#0D3326" }} />}
//                   </button>
//                 </div>

//                 {user && (
//                   <div style={{ borderTop: "1px solid #EDE8DF" }} className="p-1.5">
//                     <button
//                       type="button"
//                       onClick={handleLogout}
//                       className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-bold text-red-600 transition hover:bg-red-50"
//                     >
//                       <LogOut size={13} />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* ── USER PROFILE ──────────────────────────── */}
//           {user ? (
//             <div
//               className="relative"
//               onMouseEnter={() => setShowProfileMenu(true)}
//               onMouseLeave={() => setShowProfileMenu(false)}
//             >
//               <button type="button" onClick={() => router.push('/user/profile')} className="flex items-center gap-2.5 cursor-pointer">
//                 {(() => {
//                   const firstName = user.firstName || "";
//                   const lastName  = user.lastName  || "";
//                   const fullName  = [firstName, lastName].filter(Boolean).join(" ") || user.username || "";
//                   const displayInitial = fullName.trim().charAt(0).toUpperCase() || "U";
//                   const displayName    = fullName || user.username || "";
//                   return (
//                     <>
//                       <div
//                         className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden text-base font-extrabold shrink-0"
//                         style={{ background: "linear-gradient(135deg, #D7AE62, #C99A40)", color: "#0D3326" }}
//                       >
//                         {user.profileImage ? (
//                           <img
//                             src={user.profileImage}
//                             alt={displayName || "Profile"}
//                             className="h-full w-full object-cover"
//                             onError={(e) => {
//                               e.currentTarget.style.display = "none";
//                               e.currentTarget.nextSibling.style.display = "flex";
//                             }}
//                           />
//                         ) : null}
//                         <span
//                           className="flex items-center justify-center w-full h-full"
//                           style={{ display: user.profileImage ? "none" : "flex" }}
//                         >
//                           {displayInitial}
//                         </span>
//                       </div>
//                       <span className="hidden font-semibold lg:block" style={{ color: "#F3E7D2" }}>
//                         {displayName}
//                       </span>
//                     </>
//                   );
//                 })()}
//                 <span className="text-xs" style={{ color: "rgba(215,174,98,0.7)" }}>▼</span>
//               </button>

//               {showProfileMenu && (
//                 <div className="absolute right-0 top-full mt-2 z-[99999]">
//                   <ProfileDropdown items={headerData?.ProfileMenu || []} />
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link
//               href="/user/login"
//               className="rounded-xl px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5"
//               style={{ background: "linear-gradient(135deg, #D7AE62, #C99A40)", color: "#0D3326" }}
//             >
//               Login
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* MENU BAR */}
//       <div style={{ borderTop: "1px solid rgba(215,174,98,0.15)", background: "rgba(0,0,0,0.15)" }}>
//         <div className="no-scrollbar mx-auto flex max-w-[1400px] items-center gap-4 overflow-x-auto whitespace-nowrap px-4 sm:px-6 py-2.5 lg:px-8 sm:gap-6">
//           <button
//             className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition"
//             style={{ background: "rgba(215,174,98,0.10)", color: "#D7AE62" }}
//           >
//             <MapPin size={13} />
//             {defaultLocation}
//           </button>

//           {menu.map((item) => (
//             <div
//               key={item.id || item.Slug}
//               className="relative shrink-0 pb-2"
//               onMouseEnter={() => setActiveMenu(item.id)}
//               onMouseLeave={() => setActiveMenu(null)}
//             >
//               <button
//                 type="button"
//                 onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
//                 className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition hover:bg-white/10"
//                 style={{ color: "#F3E7D2" }}
//               >
//                 {item.Title}
//               </button>

//               {activeMenu === item.id &&
//                 item.HasDropdown &&
//                 item.DropdownItem.length > 0 && (
//                   <div className="absolute left-1/2 top-[100%] z-[9999] -translate-x-1/2">
//                     <UserDropdown menuItem={item} />
//                   </div>
//                 )}
//             </div>
//           ))}

//           {/* STATIC EXPLORE DROPDOWN */}
//           <div
//             className="relative shrink-0 pb-2"
//             onMouseEnter={() => setActiveMenu("explore")}
//             onMouseLeave={() => setActiveMenu(null)}
//           >
//             <button
//               type="button"
//               onClick={() => setActiveMenu(activeMenu === "explore" ? null : "explore")}
//               className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition hover:bg-white/10"
//               style={{ color: "#F3E7D2" }}
//             >
//               Explore
//             </button>

//             {activeMenu === "explore" && (
//               <div className="absolute left-1/2 top-[100%] z-[9999] -translate-x-1/2">
//                 <ExploreDropdown />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// import ProfileDropdown from "./ProfileDropdown";
// import UserDropdown from "./UserDropdown";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
//   "http://localhost:1337";

// export default function UserHeader({ headerData }) {
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [user, setUser] = useState(null);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const savedUser = localStorage.getItem("user");

//       if (savedUser) {
//         setUser(JSON.parse(savedUser));
//       }
//     }, 0);

//     return () => clearTimeout(timer);
//   }, []);

//   if (!headerData) return null;

//   const logo = headerData?.Logo?.url
//     ? `${STRAPI_URL}${headerData.Logo.url}`
//     : null;

//   const menu = [...(headerData?.MenuItem || [])]
//     .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0))
//     .map((item) => ({
//       ...item,

//       DropdownItem: (item.DropdownItem || [])
//         .filter(
//           (dropdownItem) =>
//             dropdownItem &&
//             dropdownItem.IsActive &&
//             dropdownItem.Text &&
//             dropdownItem.Slug,
//         )
//         .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0)),
//     }));

//   return (
//     <header className="sticky top-0 z-50 border-b bg-white shadow-md">
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//         <Link href="/user" className="flex items-center gap-3">
//           {logo ? (
//             <Image
//               src={logo}
//               alt={headerData.Brand}
//               width={50}
//               height={50}
//               className="rounded-xl object-cover"
//             />
//           ) : (
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
//               H
//             </div>
//           )}

//           <h1 className="text-3xl font-bold text-blue-700">
//             {headerData.Brand}
//           </h1>
//         </Link>

//         <div className="flex items-center gap-5 text-2xl">
//           <button className="transition hover:text-blue-600">☰</button>

//           {user ? (
//             <div
//               className="relative"
//               onMouseEnter={() => setShowProfileMenu(true)}
//               onMouseLeave={() => setShowProfileMenu(false)}
//             >
//               <button className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
//                   {user.username?.charAt(0).toUpperCase()}
//                 </div>

//                 <span className="text-base font-semibold text-gray-700">
//                   {user.username}
//                 </span>

//                 <span className="text-xs">▼</span>
//               </button>

//               {showProfileMenu && (
//                 <ProfileDropdown items={headerData?.ProfileMenu || []} />
//               )}
//             </div>
//           ) : (
//             <Link
//               href="/user/login"
//               className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
//             >
//               Login
//             </Link>
//           )}
//         </div>
//       </div>

//       <div className="border-t bg-white">
//         <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
//           <button className="rounded-lg bg-gray-100 px-4 py-2 font-medium">
//             📍 {headerData.DefaultLocation}
//           </button>

//           {menu
//             .filter((item) => item.Title)
//             .map((item) => (
//               <div
//                 key={item.id}
//                 className="relative"
//                 onMouseEnter={() => setActiveMenu(item.id)}
//                 onMouseLeave={() => setActiveMenu(null)}
//               >
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setActiveMenu(activeMenu === item.id ? null : item.id)
//                   }
//                   className="flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition hover:bg-blue-50 hover:text-blue-700"
//                 >
//                   {item.Title}

//                   {item.HasDropdown && item.DropdownItem.length > 0 && (
//                     <span className="text-xs">▼</span>
//                   )}
//                 </button>
//                 {activeMenu === item.id &&
//                   item.HasDropdown &&
//                   item.DropdownItem?.length > 0 && (
//                     <div className="absolute left-0 top-full z-[9999]">
//                       <UserDropdown menuItem={item} />
//                     </div>
//                   )}
//                 {activeMenu === item.id &&
//                   item.HasDropdown &&
//                   item.DropdownItem?.length > 0 && (
//                     <div className="absolute left-0 top-full z-[9999]">
//                       <UserDropdown menuItem={item} />
//                     </div>
//                   )}
//               </div>
//             ))}
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, MapPin, ArrowLeftRight, Check, Home, LogOut, Heart, MessageSquare } from "lucide-react";

import ProfileDropdown from "./ProfileDropdown";
import UserDropdown from "./UserDropdown";
import ExploreDropdown from "./ExploreDropdown";
import UserNotificationBell from "./UserNotificationBell";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

export default function UserHeader({ headerData }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(null);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ─── Mode Switcher ───────────────────────────────────────────
  // activeMode is purely a UI/navigation preference.
  // It does NOT affect the Strapi JWT or authentication role.
  const [activeMode, setActiveMode] = useState("buyer");
  const [modeSwitcherOpen, setModeSwitcherOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function loadUser() {
      try {
        const savedUser = window.localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("User Parse Error:", error);
      }
    }

    loadUser();

    // Re-load when EditProfile or ProfilePage saves a new photo
    window.addEventListener("userProfileUpdated", loadUser);
    // Also refresh when user navigates back to this tab/page
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") loadUser();
    });
    return () => {
      window.removeEventListener("userProfileUpdated", loadUser);
      document.removeEventListener("visibilitychange", loadUser);
    };
  }, []);


  useEffect(() => {
    if (typeof window === "undefined") return;
    // Read persisted activeMode
    const saved = localStorage.getItem("activeMode");
    if (saved === "seller" || saved === "buyer") {
      setActiveMode(saved);
    } else {
      // Default: buyer when on the user module
      setActiveMode("buyer");
      localStorage.setItem("activeMode", "buyer");
    }
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
    if (mode === "seller") {
      router.push("/owner");
    }
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("activeMode");
    }
    setUser(null);
    router.replace("/user/login");
  }

  const logo = headerData?.Logo?.url
    ? `${STRAPI_URL}${headerData.Logo.url}`
    : null;

  const brandName = headerData?.Brand || "HomeHub";
  const defaultLocation = headerData?.DefaultLocation || "All India";

  const menu = (headerData?.MenuItem || [])
    .filter(Boolean)
    .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0))
    .map((item) => ({
      ...item,
      DropdownItem: (item.DropdownItem || [])
        .filter(
          (dropdown) =>
            dropdown && dropdown.IsActive && dropdown.Text && dropdown.Slug,
        )
        .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0)),
    }));

  return (
    <header
      className="sticky top-0 z-[1000]"
      style={{
        background: "linear-gradient(135deg, #0D3326 0%, #123F32 100%)",
        borderBottom: "1px solid rgba(215,174,98,0.20)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      {/* Gold accent top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent 0%, #D7AE62 40%, #D7AE62 60%, transparent 100%)" }}
      />

      {/* TOP HEADER */}
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-4 lg:px-8">

        {/* Logo + Brand */}
        <Link href="/user" className="flex items-center gap-3">
          {logo ? (
            <Image
              src={logo}
              alt={brandName}
              width={44}
              height={44}
              className="rounded-xl object-contain"
              unoptimized
            />
          ) : (
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-extrabold"
              style={{ background: "linear-gradient(135deg, #D7AE62, #C99A40)", color: "#0D3326" }}
            >
              H
            </div>
          )}
          <div>
            <span
              className="block text-xl font-extrabold tracking-tight"
              style={{ color: "#F3E7D2" }}
            >
              {brandName}
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(215,174,98,0.7)" }}>
              Buyer Portal
            </span>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">

          {/* ── SAVED ──────────────────────────────── */}
          <Link
            href="/user/wishlist"
            className="flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[13px] font-semibold transition-all duration-200 hover:bg-white/10"
            style={{ borderColor: "rgba(215,174,98,0.25)", color: "#F3E7D2" }}
          >
            <Heart size={13} style={{ color: "#D7AE62" }} />
            <span className="hidden sm:inline">Saved</span>
          </Link>

          {/* ── ENQUIRIES ──────────────────────────── */}
          <Link
            href="/user/enquiries"
            className="flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[13px] font-semibold transition-all duration-200 hover:bg-white/10"
            style={{ borderColor: "rgba(215,174,98,0.25)", color: "#F3E7D2" }}
          >
            <MessageSquare size={13} style={{ color: "#D7AE62" }} />
            <span className="hidden sm:inline">Enquiries</span>
          </Link>

          {/* ── NOTIFICATION BELL ─────────────────────── */}
          <UserNotificationBell />

          {/* ── MODE SWITCHER ──────────────────────────── */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setModeSwitcherOpen((p) => !p)}
              aria-label="Switch mode"
              className="flex h-9 items-center gap-2 rounded-xl border px-3 text-[13px] font-bold transition-all duration-200"
              style={
                modeSwitcherOpen
                  ? { borderColor: "#D7AE62", background: "rgba(215,174,98,0.18)", color: "#D7AE62" }
                  : { borderColor: "rgba(215,174,98,0.25)", background: "rgba(215,174,98,0.07)", color: "#D7AE62" }
              }
            >
              {activeMode === "buyer" ? (
                <>
                  <ArrowLeftRight size={13} />
                  <span className="hidden sm:inline">Buyer Mode</span>
                </>
              ) : (
                <>
                  <Home size={13} />
                  <span className="hidden sm:inline">Seller Mode</span>
                </>
              )}
              <span className={`text-[10px] inline-block transition-transform duration-200 ${modeSwitcherOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {modeSwitcherOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-[180px] overflow-hidden rounded-2xl shadow-2xl z-[200]"
                style={{ background: "#fff", border: "1px solid #EDE8DF" }}
              >
                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("buyer")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-bold transition"
                    style={
                      activeMode === "buyer"
                        ? { background: "rgba(13,51,38,0.08)", color: "#0D3326" }
                        : { color: "#374151" }
                    }
                  >
                    <ArrowLeftRight size={13} style={{ color: "#226E58" }} />
                    <span className="flex-1 text-left">Buyer Mode</span>
                    {activeMode === "buyer" && <Check size={13} style={{ color: "#226E58" }} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleModeSwitch("seller")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-bold transition hover:bg-gray-50"
                    style={
                      activeMode === "seller"
                        ? { background: "rgba(13,51,38,0.08)", color: "#0D3326" }
                        : { color: "#374151" }
                    }
                  >
                    <Home size={13} style={{ color: "#0D3326" }} />
                    <span className="flex-1 text-left">Seller Mode</span>
                    {activeMode === "seller" && <Check size={13} style={{ color: "#0D3326" }} />}
                  </button>
                </div>

                {user && (
                  <div style={{ borderTop: "1px solid #EDE8DF" }} className="p-1.5">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-bold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={13} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── USER PROFILE ──────────────────────────── */}
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setShowProfileMenu(true)}
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <button type="button" onClick={() => router.push('/user/profile')} className="flex items-center gap-2.5 cursor-pointer">
                {(() => {
                  const firstName = user.firstName || "";
                  const lastName = user.lastName || "";
                  const fullName = [firstName, lastName].filter(Boolean).join(" ") || user.username || "";
                  const displayInitial = fullName.trim().charAt(0).toUpperCase() || "U";
                  const displayName = fullName || user.username || "";
                  return (
                    <>
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden text-base font-extrabold shrink-0"
                        style={{ background: "linear-gradient(135deg, #D7AE62, #C99A40)", color: "#0D3326" }}
                      >
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={displayName || "Profile"}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <span
                          className="flex items-center justify-center w-full h-full"
                          style={{ display: user.profileImage ? "none" : "flex" }}
                        >
                          {displayInitial}
                        </span>
                      </div>
                      <span className="hidden font-semibold lg:block" style={{ color: "#F3E7D2" }}>
                        {displayName}
                      </span>
                    </>
                  );
                })()}
                <span className="text-xs" style={{ color: "rgba(215,174,98,0.7)" }}>▼</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 z-[99999]">
                  <ProfileDropdown items={headerData?.ProfileMenu || []} />
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/user/login"
              className="rounded-xl px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #D7AE62, #C99A40)", color: "#0D3326" }}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* MENU BAR */}
      <div style={{ borderTop: "1px solid rgba(215,174,98,0.15)", background: "rgba(0,0,0,0.15)" }}>
        <div className="no-scrollbar mx-auto flex max-w-[1400px] items-center gap-4 overflow-visible whitespace-nowrap px-4 sm:px-6 py-2.5 lg:px-8 sm:gap-6">
          <button
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition"
            style={{ background: "rgba(215,174,98,0.10)", color: "#D7AE62" }}
          >
            <MapPin size={13} />
            {defaultLocation}
          </button>

          {menu.map((item) => (
            <div
              key={item.id || item.Slug}
              className="relative shrink-0 pb-2"
              onMouseEnter={() => setActiveMenu(item.id)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition hover:bg-white/10"
                style={{ color: "#F3E7D2" }}
              >
                {item.Title}
              </button>

              {activeMenu === item.id &&
                item.HasDropdown &&
                item.DropdownItem.length > 0 && (
                  <div className="absolute left-1/2 top-[100%] z-[9999] -translate-x-1/2">
                    <UserDropdown menuItem={item} />
                  </div>
                )}
            </div>
          ))}

          {/* STATIC EXPLORE DROPDOWN */}
          <div
            className="relative shrink-0 pb-2"
            onMouseEnter={() => setActiveMenu("explore")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === "explore" ? null : "explore")}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition hover:bg-white/10"
              style={{ color: "#F3E7D2" }}
            >
              Explore
            </button>

            {activeMenu === "explore" && (
              <div className="absolute left-1/2 top-[100%] z-[9999] -translate-x-1/2">
                <ExploreDropdown />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

