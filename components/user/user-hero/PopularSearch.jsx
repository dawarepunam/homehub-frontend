// export default function PopularSearch({ data }) {
//   return (
//     <div className="mt-6">
//       <h3 className="text-lg font-semibold">Popular Searches</h3>

//       <div className="flex gap-3 flex-wrap mt-3">
//         {data?.map((item) => (
//           <button key={item.id} className="border rounded-full px-4 py-2">
//             {item.name}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// // }
// export default function PopularSearch({ searchData }) {
//   const popularSearches = searchData?.PopularSearches || [];

//   if (popularSearches.length === 0) {
//     return null;
//   }

//   return (
//     <div className="mx-auto mt-6 w-full max-w-7xl px-6 lg:px-8">
//       <h3 className="text-lg font-semibold text-gray-900">
//         Popular Searches
//       </h3>

//       <div className="mt-3 flex flex-wrap gap-3">
//         {popularSearches.map((item) => (
//           <button
//             key={item.id || item.value}
//             type="button"
//             className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
//           >
//             {item.name}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
export default function PopularSearch({ searchData }) {
  const popularSearches = searchData?.PopularSearches || [];

  if (!popularSearches.length) return null;

  return (
    <div className="mx-auto mt-6 w-full max-w-7xl px-6 lg:px-8">
      <h3 className="text-lg font-semibold text-gray-900">
        Popular Searches
      </h3>

      <div className="mt-3 flex flex-wrap gap-3">
        {popularSearches.map((item) => (
          <button
            key={item.id || item.value}
            type="button"
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-600 hover:text-blue-600"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}