// "use client";

// import { Toaster } from "react-hot-toast";

// export default function Providers() {
//   return (
//     <Toaster
//       position="top-right"
//       toastOptions={{
//         duration: 3000,
//       }}
//     />
//   );
// }
"use client";

import { Toaster } from "react-hot-toast";

export default function Providers() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,

          style: {
            borderRadius: "12px",
            background: "#ffffff",
            color: "#111827",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },

          success: {
            duration: 3000,
            iconTheme: {
              primary: "#2563eb",
              secondary: "#ffffff",
            },
          },

          error: {
            duration: 4000,
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </>
  );
}
