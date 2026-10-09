// export default function PropertyOverview({ property }) {
//   const common = property?.PropertyCommonDetails;
//   const residential = property?.ResidentialDetails;

//   return (
//     <section className="mt-10">

//       <h2 className="mb-6 text-3xl font-bold text-gray-900">
//         Property Overview
//       </h2>

//       <div className="grid grid-cols-2 gap-5 rounded-2xl bg-white p-8 shadow-md md:grid-cols-3 lg:grid-cols-4">

//         <OverviewCard
//           title="Bedrooms"
//           value={residential?.Bedrooms || "-"}
//           icon="🛏"
//         />

//         <OverviewCard
//           title="Bathrooms"
//           value={residential?.Bathrooms || "-"}
//           icon="🚿"
//         />

//         <OverviewCard
//           title="Balconies"
//           value={residential?.Balconies || "-"}
//           icon="🌅"
//         />

//         <OverviewCard
//           title="Carpet Area"
//           value={`${common?.CarpetArea || "-"} ${common?.Area_Unit || ""}`}
//           icon="📐"
//         />

//         <OverviewCard
//           title="Built-up Area"
//           value={`${common?.Built_upArea || "-"} ${common?.Area_Unit || ""}`}
//           icon="🏢"
//         />

//         <OverviewCard
//           title="Parking"
//           value={common?.Parking || "-"}
//           icon="🚗"
//         />

//         <OverviewCard
//           title="Facing"
//           value={common?.Facing || "-"}
//           icon="🧭"
//         />

//         <OverviewCard
//           title="Property Age"
//           value={common?.PropertyAge || "-"}
//           icon="📅"
//         />

//         <OverviewCard
//           title="Available From"
//           value={common?.AvailableForm || "-"}
//           icon="📆"
//         />

//         <OverviewCard
//           title="Furnishing"
//           value={residential?.Furnishing || "-"}
//           icon="🛋"
//         />

//         <OverviewCard
//           title="Floor"
//           value={residential?.FloorNo || "-"}
//           icon="🏬"
//         />

//         <OverviewCard
//           title="Total Floors"
//           value={residential?.TotalFloors || "-"}
//           icon="🏙"
//         />

//       </div>

//     </section>
//   );
// }

// function OverviewCard({ title, value, icon }) {
//   return (
//     <div className="rounded-xl border bg-gray-50 p-5 transition hover:shadow-md">

//       <div className="text-3xl">
//         {icon}
//       </div>

//       <h3 className="mt-3 text-sm text-gray-500">
//         {title}
//       </h3>

//       <p className="mt-2 text-lg font-bold text-gray-900">
//         {value}
//       </p>

//     </div>
//   );
// }


export default function PropertyOverview({ property }) {

  const overview = property?.PropertyOverview || [];

  if (overview.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-extrabold tracking-tight">
        Property Overview
      </h2>

      <div className="grid grid-cols-2 gap-4 rounded-[var(--radius-card)] bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 md:p-8 shadow-[var(--shadow-card)] md:grid-cols-3 lg:grid-cols-4">
        {overview
          .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
          .map((item) => (
            <OverviewCard
              key={item.id}
              title={item.Title}
              value={item.Value}
              icon={item.Icon}
            />
        ))}
      </div>
    </section>
  );
}

function OverviewCard({ title, value, icon }) {
  const icons = {
    bed: "🛏",
    bath: "🚿",
    balcony: "🌅",
    area: "📐",
    building: "🏢",
    car: "🚗",
    compass: "🧭",
    calendar: "📅",
    floor: "🏙",
    sofa: "🛋",
    location: "📍",
    home: "🏠",
  };

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-5 transition hover:shadow-md">
      <div className="text-3xl">
        {icons[icon] || "🏠"}
      </div>
      <h3 className="mt-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
        {title}
      </h3>
      <p className="mt-2 text-lg font-bold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}