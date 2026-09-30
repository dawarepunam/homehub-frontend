// "use client";

// import Link from "next/link";

// export default function ProfileDropdown({ items = [] }) {
//   const menu = [...items]
//     .filter(
//       (item) =>
//         item?.IsActive &&
//         item?.Title &&
//         item?.URL
//     )
//     .sort(
//       (a, b) =>
//         (a.DisplayOrder || 0) -
//         (b.DisplayOrder || 0)
//     );

//   if (menu.length === 0) {
//     return null;
//   }

//   return (
//     <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border bg-white shadow-xl">

//       {menu.map((item) => (
//         <Link
//           key={item.id}
//           href={item.URL}
//           className="block border-b px-5 py-3 hover:bg-blue-50"
//         >
//           <div className="font-medium">
//             {item.Title}
//           </div>
//         </Link>
//       ))}

//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import {
//   User,
//   Heart,
//   MessageCircle,
//   Settings,
//   LogOut,
//   ChevronRight,
// } from "lucide-react";

// const getIcon = (icon) => {
//   switch ((icon || "").toLowerCase()) {
//     case "user":
//       return <User size={18} />;
//     case "heart":
//       return <Heart size={18} />;
//     case "message-circle":
//       return <MessageCircle size={18} />;
//     case "settings":
//       return <Settings size={18} />;
//     case "log-out":
//       return <LogOut size={18} />;
//     default:
//       return <User size={18} />;
//   }
// };

// export default function ProfileDropdown({ items = [] }) {
//   const menu = [...items]
//     .filter((item) => item && item.IsActive && item.Title && item.URL)
//     .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));

//   if (menu.length === 0) return null;

//   return (
//     <div className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl z-[9999]">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//         <h3 className="text-lg font-bold text-white">My Account</h3>

//         <p className="text-sm text-blue-100">
//           Manage your profile & activities
//         </p>
//       </div>

//       {/* Menu */}
//       <div className="py-2">
//         {menu.map((item) => (
//           <Link
//             key={item.id}
//             href={item.URL}
//             className="flex items-center justify-between px-5 py-4 transition duration-200 hover:bg-blue-50"
//           >
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
//                 {getIcon(item.Icon)}
//               </div>

//               <span className="font-medium text-gray-800">{item.Title}</span>
//             </div>

//             <ChevronRight size={18} className="text-gray-400" />
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import {
//   User,
//   Heart,
//   MessageCircle,
//   Settings,
//   LogOut,
//   ChevronRight,
// } from "lucide-react";

// const getIcon = (icon) => {
//   switch ((icon || "").toLowerCase()) {
//     case "user":
//       return <User size={18} />;
//     case "heart":
//       return <Heart size={18} />;
//     case "message-circle":
//       return <MessageCircle size={18} />;
//     case "settings":
//       return <Settings size={18} />;
//     case "log-out":
//       return <LogOut size={18} />;

//     default:
//       return <User size={18} />;
//   }
// };

// export default function ProfileDropdown({ items = [] }) {
//   const menu = items
//     .filter((item) => item?.IsActive && item?.Title && item?.URL)
//     .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));

//   if (!menu.length) return null;

//   return (
//     <div
//       className="
//       absolute
//       right-0
//       top-full
//       mt-3
//       w-72
//       overflow-hidden
//       rounded-2xl
//       border
//       border-gray-200
//       bg-white
//       shadow-2xl
//       z-[9999]
//       "
//     >
//       {/* Header */}

//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//         <h3 className="text-lg font-bold text-white">My Account</h3>

//         <p className="mt-1 text-sm text-blue-100">
//           Manage your profile & activities
//         </p>
//       </div>

//       {/* Menu */}

//       <div className="py-2">
//         {menu.map((item) => (
//           <Link
//             key={item.id}
//             href={item.URL}
//             className="
//             flex
//             items-center
//             justify-between
//             px-5
//             py-4
//             transition
//             hover:bg-blue-50
//             "
//           >
//             <div className="flex items-center gap-3">
//               <div
//                 className="
//                 flex
//                 h-10
//                 w-10
//                 items-center
//                 justify-center
//                 rounded-full
//                 bg-blue-100
//                 text-blue-700
//                 "
//               >
//                 {getIcon(item.Icon)}
//               </div>

//               <span className="font-medium text-gray-800">{item.Title}</span>
//             </div>

//             <ChevronRight size={18} className="text-gray-400" />
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// // }
// "use client";

// import Link from "next/link";
// import {
//   User,
//   Heart,
//   MessageCircle,
//   Settings,
//   LogOut,
//   ChevronRight,
// } from "lucide-react";

// const getIcon = (icon) => {
//   switch ((icon || "").toLowerCase()) {
//     case "user":
//       return <User size={18} />;
//     case "heart":
//       return <Heart size={18} />;
//     case "message-circle":
//       return <MessageCircle size={18} />;
//     case "settings":
//       return <Settings size={18} />;
//     case "log-out":
//       return <LogOut size={18} />;
//     default:
//       return <User size={18} />;
//   }
// };

// export default function ProfileDropdown({ items = [] }) {
//   console.log("PROFILE DROPDOWN RENDER");

//   console.log(items);

//   const menu = items
//     .filter((item) => item?.IsActive && item?.Title && item?.URL)
//     .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));

//   console.log("PROFILE MENU", menu);

//   if (!menu.length) return null;

//   return (
//     <div className="absolute right-0 top-full mt-2 z-[99999] w-72 rounded-2xl border border-gray-200 bg-white shadow-2xl">
//       <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//         <h3 className="text-lg font-bold text-white">My Account</h3>

//         <p className="mt-1 text-sm text-blue-100">
//           Manage your profile & activities
//         </p>
//       </div>

//       <div className="py-2">
//         {menu.map((item) => (
//           <Link
//             key={item.id}
//             href={item.URL}
//             className="flex items-center justify-between px-5 py-4 transition hover:bg-blue-50"
//           >
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
//                 {getIcon(item.Icon)}
//               </div>

//               <span className="font-medium text-gray-800">{item.Title}</span>
//             </div>

//             <ChevronRight size={18} className="text-gray-400" />
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// // }
// "use client";

// import Link from "next/link";
// import {
//   User,
//   Heart,
//   MessageCircle,
//   Settings,
//   LogOut,
//   ChevronRight,
// } from "lucide-react";

// const getIcon = (icon) => {
//   switch ((icon || "").toLowerCase()) {
//     case "user":
//       return <User size={18} />;
//     case "heart":
//       return <Heart size={18} />;
//     case "message-circle":
//       return <MessageCircle size={18} />;
//     case "settings":
//       return <Settings size={18} />;
//     case "log-out":
//       return <LogOut size={18} />;
//     default:
//       return <User size={18} />;
//   }
// };

// export default function ProfileDropdown({ items = [] }) {
//   console.log("PROFILE DROPDOWN RENDER");
//   console.log(items);

//   const menu = items
//     .filter((item) => item?.IsActive && item?.Title && item?.URL)
//     .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));

//   console.log("PROFILE MENU", menu);

//   if (!menu.length) return null;

//   return (
//     <div
//       className="w-72 rounded-2xl border border-gray-200 bg-white shadow-2xl"
//       style={{
//         position: "relative",
//         zIndex: 999999,
//       }}
//     >
//       {/* Header */}
//       <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//         <h3 className="text-lg font-bold text-white">My Account</h3>

//         <p className="mt-1 text-sm text-blue-100">
//           Manage your profile & activities
//         </p>
//       </div>

//       {/* Menu */}
//       <div className="py-2">
//         {menu.map((item) => (
//           <Link
//             key={item.id}
//             href={item.URL}
//             className="flex items-center justify-between px-5 py-4 transition duration-200 hover:bg-blue-50"
//           >
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
//                 {getIcon(item.Icon)}
//               </div>

//               <span className="font-medium text-gray-800">{item.Title}</span>
//             </div>

//             <ChevronRight size={18} className="text-gray-400" />
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  User,
  Heart,
  MessageCircle,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const getIcon = (icon) => {
  switch ((icon || "").toLowerCase()) {
    case "user":
      return <User size={18} />;

    case "heart":
      return <Heart size={18} />;

    case "message-circle":
      return <MessageCircle size={18} />;

    case "settings":
      return <Settings size={18} />;

    case "log-out":
      return <LogOut size={18} />;

    default:
      return <User size={18} />;
  }
};

export default function ProfileDropdown({ items = [] }) {
  const router = useRouter();

  const menu = items
    .filter((item) => item?.IsActive && item?.Title)
    .sort((a, b) => (a.DisplayOrder || 0) - (b.DisplayOrder || 0));

  async function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logout Successfully");

    router.push("/user/login");
    router.refresh();
  }

  if (!menu.length) return null;

  return (
    <div
      className="w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      style={{
        position: "relative",
        zIndex: 999999,
      }}
    >
      {/* Header */}

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-lg font-bold text-white">My Account</h3>

        <p className="mt-1 text-sm text-blue-100">
          Manage your profile & activities
        </p>
      </div>

      {/* Menu */}

      <div className="py-2">
        {menu.map((item) => {
          const isLogout =
            item.Title.toLowerCase() === "logout" ||
            item.Icon?.toLowerCase() === "log-out";

          if (isLogout) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-red-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <LogOut size={18} />
                  </div>

                  <span className="font-medium text-red-600">Logout</span>
                </div>

                <ChevronRight size={18} className="text-red-400" />
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.URL}
              className="flex items-center justify-between px-5 py-4 transition hover:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  {getIcon(item.Icon)}
                </div>

                <span className="font-medium text-gray-800">{item.Title}</span>
              </div>

              <ChevronRight size={18} className="text-gray-400" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
