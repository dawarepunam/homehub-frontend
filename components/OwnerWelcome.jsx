// import Link from "next/link";
// import {
//   ArrowRight,
//   Building2,
//   Eye,
//   Home,
//   MessageSquare,
//   Plus,
//   Sparkles,
//   UserRound,
// } from "lucide-react";

// export default function OwnerWelcome({
//   welcomeData,
//   owner,
//   properties = [],
// }) {
//   const ownerName =
//     welcomeData?.OwnerNameLabel ||
//     owner?.username ||
//     owner?.email ||
//     "Owner";

//   const ownerRole =
//     welcomeData?.OwnerRoleLabel || "Property Owner";

//   const heading =
//     welcomeData?.Heading || "Welcome back,";

//   const subtitle = welcomeData?.Subtitle || "";

//   const propertyLabel =
//     welcomeData?.PropertyCountLabel ||
//     "Properties Listed";

//   const enquiryLabel =
//     welcomeData?.EnquiryCountLabel ||
//     "New Enquiries";

//   const viewLabel =
//     welcomeData?.ViewCountLabel ||
//     "Property Views";

//   const propertyCount = Array.isArray(properties)
//     ? properties.length
//     : 0;

//   const ownerInitial =
//     ownerName?.trim()?.charAt(0)?.toUpperCase() || "O";

//   return (
//     <section className="mb-8">
//       <div className="relative overflow-hidden rounded-lg border border-[#1C5A47] bg-[radial-gradient(circle_at_18%_20%,rgba(215,174,98,0.16),transparent_28%),linear-gradient(115deg,#073B2F_0%,#0F4A39_45%,#0A372C_100%)] shadow-[0_18px_42px_rgba(9,55,44,0.24)]">
//         <div className="pointer-events-none absolute left-7 top-8 grid grid-cols-5 gap-2 opacity-25">
//           {Array.from({ length: 25 }).map((_, index) => (
//             <span
//               key={index}
//               className="h-1 w-1 rounded-full bg-[#D7AE62]"
//             />
//           ))}
//         </div>

//         <div className="pointer-events-none absolute right-10 top-10 h-28 w-28 rounded-full border border-[#D7AE62]/10" />
//         <div className="pointer-events-none absolute -right-10 bottom-4 h-40 w-40 rounded-full border border-[#D7AE62]/10" />
//         <div className="pointer-events-none absolute bottom-0 right-6 hidden h-32 w-56 border border-[#F7F0E3]/5 lg:block" />

//         <div className="relative grid items-center gap-6 px-5 py-6 sm:px-7 lg:grid-cols-[1.1fr_0.9fr] lg:px-9 lg:py-8">
//           <div>
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D7AE62]/55 bg-[#123F32]/70 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E7C982]">
//               <Sparkles size={14} />
//               Owner Dashboard
//             </div>

//             <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-[#F7F0E3] sm:text-4xl lg:text-[38px]">
//               {heading}{" "}
//               <span className="text-[#D7AE62]">
//                 {ownerName}
//               </span>
//             </h1>

//             {subtitle ? (
//               <p className="mt-3 max-w-2xl text-sm leading-6 text-[#DDE9E1]">
//                 {subtitle}
//               </p>
//             ) : null}

//             <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-[#F4EBDD]">
//               <span className="inline-flex items-center gap-2 rounded-full bg-[#F7F0E3]/12 px-3 py-2 ring-1 ring-[#F7F0E3]/12">
//                 <UserRound
//                   size={16}
//                   className="text-[#D7AE62]"
//                 />
//                 {ownerRole}
//               </span>

//               <span className="inline-flex items-center gap-2 rounded-full bg-[#F7F0E3]/12 px-3 py-2 ring-1 ring-[#F7F0E3]/12">
//                 <Home
//                   size={16}
//                   className="text-[#D7AE62]"
//                 />
//                 HomeHub Owner Portal
//               </span>
//             </div>

//             <div className="mt-6 grid gap-3 sm:flex">
//               <Link
//                 href="/add-property"
//                 className="inline-flex items-center justify-center gap-2 rounded-md bg-[#D7AE62] px-5 py-3 text-sm font-extrabold text-[#123F32] shadow-[0_8px_20px_rgba(215,174,98,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E4C27E]"
//               >
//                 <Plus size={17} />
//                 Add Property
//               </Link>

//               <Link
//                 href="/owner/properties"
//                 className="group inline-flex items-center justify-center gap-2 rounded-md border border-[#F7F0E3]/30 bg-[#F7F0E3]/10 px-5 py-3 text-sm font-extrabold text-[#F7F0E3] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D7AE62] hover:bg-[#F7F0E3]/16"
//               >
//                 View Properties
//                 <ArrowRight
//                   size={17}
//                   className="transition-transform duration-200 group-hover:translate-x-1"
//                 />
//               </Link>
//             </div>
//           </div>

//           <div className="lg:justify-self-end">
//             <div className="rounded-lg border border-[#F7F0E3]/18 bg-[#F7F0E3]/14 p-5 shadow-[0_18px_42px_rgba(4,33,25,0.28)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:bg-[#F7F0E3]/18 lg:min-w-[470px]">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-[#F7F0E3]/80 bg-[#F7F0E3] text-xl font-extrabold text-[#174B3B] shadow-sm">
//                   {ownerInitial}
//                 </div>

//                 <div className="min-w-0">
//                   <p className="truncate text-lg font-extrabold text-[#F7F0E3]">
//                     {ownerName}
//                   </p>

//                   <p className="mt-1 text-sm font-semibold text-[#DDE9E1]">
//                     {ownerRole}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-6 grid gap-4 sm:grid-cols-3">
//                 <div className="flex items-center gap-3 border-b border-[#F7F0E3]/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
//                   <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D7AE62]/22 text-[#D7AE62]">
//                     <Building2 size={19} />
//                   </span>

//                   <div>
//                     <p className="text-xl font-extrabold text-[#F7F0E3]">
//                       {propertyCount}
//                     </p>
//                     <p className="text-[10px] font-extrabold uppercase leading-4 tracking-wide text-[#DDE9E1]">
//                       {propertyLabel}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3 border-b border-[#F7F0E3]/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
//                   <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D7AE62]/22 text-[#D7AE62]">
//                     <MessageSquare size={19} />
//                   </span>

//                   <div>
//                     <p className="text-[10px] font-extrabold uppercase leading-4 tracking-wide text-[#DDE9E1]">
//                       {enquiryLabel}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D7AE62]/22 text-[#D7AE62]">
//                     <Eye size={19} />
//                   </span>

//                   <div>
//                     <p className="text-[10px] font-extrabold uppercase leading-4 tracking-wide text-[#DDE9E1]">
//                       {viewLabel}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Eye,
  Home,
  MessageSquare,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function OwnerWelcome({
  welcomeData,
  owner,
  properties = [],
}) {
  // =====================================================
  // LOGGED-IN OWNER NAME
  // Priority:
  // 1. username from /users/me
  // 2. email from /users/me
  // 3. Strapi fallback name
  // 4. Owner
  // =====================================================

  const ownerName =
    owner?.username ||
    owner?.name ||
    owner?.firstName ||
    welcomeData?.OwnerNameLabel ||
    owner?.email ||
    "Owner";

  // =====================================================
  // OWNER ROLE
  // =====================================================

  const ownerRole =
    owner?.role?.name ||
    owner?.Role ||
    owner?.roleName ||
    welcomeData?.OwnerRoleLabel ||
    "Property Owner";

  // =====================================================
  // STRAPI CONTENT
  // =====================================================

  const heading =
    welcomeData?.Heading || "Welcome back,";

  const subtitle =
    welcomeData?.Subtitle || "";

  const propertyLabel =
    welcomeData?.PropertyCountLabel ||
    "Properties Listed";

  const enquiryLabel =
    welcomeData?.EnquiryCountLabel ||
    "New Enquiries";

  const viewLabel =
    welcomeData?.ViewCountLabel ||
    "Property Views";

  // =====================================================
  // DYNAMIC PROPERTY COUNT
  // =====================================================

  const propertyCount = Array.isArray(properties)
    ? properties.length
    : 0;

  // =====================================================
  // OWNER INITIAL
  // =====================================================

  const ownerInitial =
    ownerName?.trim()?.charAt(0)?.toUpperCase() || "O";

  return (
    <section className="mb-8">
      <div className="relative overflow-hidden rounded-lg border border-[#1C5A47] bg-[radial-gradient(circle_at_18%_20%,rgba(215,174,98,0.16),transparent_28%),linear-gradient(115deg,#073B2F_0%,#0F4A39_45%,#0A372C_100%)] shadow-[0_18px_42px_rgba(9,55,44,0.24)]">

        {/* Decorative dots */}
        <div className="pointer-events-none absolute left-7 top-8 grid grid-cols-5 gap-2 opacity-25">
          {Array.from({ length: 25 }).map((_, index) => (
            <span
              key={index}
              className="h-1 w-1 rounded-full bg-[#D7AE62]"
            />
          ))}
        </div>

        {/* Decorative circles */}
        <div className="pointer-events-none absolute right-10 top-10 h-28 w-28 rounded-full border border-[#D7AE62]/10" />

        <div className="pointer-events-none absolute -right-10 bottom-4 h-40 w-40 rounded-full border border-[#D7AE62]/10" />

        <div className="pointer-events-none absolute bottom-0 right-6 hidden h-32 w-56 border border-[#F7F0E3]/5 lg:block" />

        <div className="relative grid items-center gap-6 px-5 py-6 sm:px-7 lg:grid-cols-[1.1fr_0.9fr] lg:px-9 lg:py-8">

          {/* =================================================
              LEFT SECTION
          ================================================= */}

          <div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D7AE62]/55 bg-[#123F32]/70 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E7C982]">
              <Sparkles size={14} />
              Owner Dashboard
            </div>

            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-[#F7F0E3] sm:text-4xl lg:text-[38px]">
              {heading}{" "}
              <span className="text-[#D7AE62]">
                {ownerName}
              </span>
            </h1>

            {subtitle ? (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#DDE9E1]">
                {subtitle}
              </p>
            ) : null}

            {/* Owner information */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-[#F4EBDD]">

              <span className="inline-flex items-center gap-2 rounded-full bg-[#F7F0E3]/12 px-3 py-2 ring-1 ring-[#F7F0E3]/12">
                <UserRound
                  size={16}
                  className="text-[#D7AE62]"
                />

                {ownerRole}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#F7F0E3]/12 px-3 py-2 ring-1 ring-[#F7F0E3]/12">
                <Home
                  size={16}
                  className="text-[#D7AE62]"
                />

                HomeHub Owner Portal
              </span>

            </div>

            {/* Action buttons */}
            <div className="mt-6 grid gap-3 sm:flex">

              <Link
                href="/add-property"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#D7AE62] px-5 py-3 text-sm font-extrabold text-[#123F32] shadow-[0_8px_20px_rgba(215,174,98,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E4C27E]"
              >
                <Plus size={17} />
                Add Property
              </Link>

              <Link
                href="/owner/properties"
                className="group inline-flex items-center justify-center gap-2 rounded-md border border-[#F7F0E3]/30 bg-[#F7F0E3]/10 px-5 py-3 text-sm font-extrabold text-[#F7F0E3] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D7AE62] hover:bg-[#F7F0E3]/16"
              >
                View Properties

                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

            </div>
          </div>

          {/* =================================================
              RIGHT OWNER CARD
          ================================================= */}

          <div className="lg:justify-self-end">

            <div className="rounded-lg border border-[#F7F0E3]/18 bg-[#F7F0E3]/14 p-5 shadow-[0_18px_42px_rgba(4,33,25,0.28)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:bg-[#F7F0E3]/18 lg:min-w-[470px]">

              {/* Owner profile */}
              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-[#F7F0E3]/80 bg-[#F7F0E3] text-xl font-extrabold text-[#174B3B] shadow-sm">
                  {ownerInitial}
                </div>

                <div className="min-w-0">

                  <p className="truncate text-lg font-extrabold text-[#F7F0E3]">
                    {ownerName}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#DDE9E1]">
                    {ownerRole}
                  </p>

                </div>
              </div>

              {/* =================================================
                  OWNER COUNTS
              ================================================= */}

              <div className="mt-6 grid gap-4 sm:grid-cols-3">

                {/* Properties */}
                <div className="flex items-center gap-3 border-b border-[#F7F0E3]/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D7AE62]/22 text-[#D7AE62]">
                    <Building2 size={19} />
                  </span>

                  <div>

                    <p className="text-xl font-extrabold text-[#F7F0E3]">
                      {propertyCount}
                    </p>

                    <p className="text-[10px] font-extrabold uppercase leading-4 tracking-wide text-[#DDE9E1]">
                      {propertyLabel}
                    </p>

                  </div>
                </div>

                {/* Enquiries */}
                <div className="flex items-center gap-3 border-b border-[#F7F0E3]/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D7AE62]/22 text-[#D7AE62]">
                    <MessageSquare size={19} />
                  </span>

                  <div>

                    <p className="text-[10px] font-extrabold uppercase leading-4 tracking-wide text-[#DDE9E1]">
                      {enquiryLabel}
                    </p>

                  </div>
                </div>

                {/* Views */}
                <div className="flex items-center gap-3">

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D7AE62]/22 text-[#D7AE62]">
                    <Eye size={19} />
                  </span>

                  <div>

                    <p className="text-[10px] font-extrabold uppercase leading-4 tracking-wide text-[#DDE9E1]">
                      {viewLabel}
                    </p>

                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
