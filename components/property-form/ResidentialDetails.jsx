"use client";

export default function ResidentialDetails({
  formData,
  setFormData,
}) {

  function handleChange(e) {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      residentialDetails: {
        ...prev.residentialDetails,
        [name]:
          type === "number"
            ? Number(value)
            : value,
      },
    }));
  }

  return (
    <div className="space-y-8">

      {/* Heading */}

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Residential Details
        </h2>

        <p className="text-gray-500">
          Enter residential property information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Bedrooms */}

        <div>
          <label className="mb-2 block font-medium">
            Bedrooms
          </label>

          <select
            name="Bedrooms"
            value={formData.residentialDetails?.Bedrooms || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Bedrooms</option>

            <option value="BHK 1">1 BHK</option>
            <option value="BHK 2">2 BHK</option>
            <option value="BHK 3">3 BHK</option>
            <option value="BHK 4">4 BHK</option>
            <option value="BHK 5+">5+ BHK</option>

          </select>
        </div>

        {/* Bathrooms */}

        <div>
          <label className="mb-2 block font-medium">
            Bathrooms
          </label>

          <input
            type="number"
            name="Bathrooms"
            min="0"
            value={formData.residentialDetails?.Bathrooms || ""}
            onChange={handleChange}
            placeholder="2"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Balconies */}

        <div>
          <label className="mb-2 block font-medium">
            Balconies
          </label>

          <input
            type="number"
            name="Balconies"
            min="0"
            value={formData.residentialDetails?.Balconies || ""}
            onChange={handleChange}
            placeholder="1"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Furnishing */}

        <div>
          <label className="mb-2 block font-medium">
            Furnishing
          </label>

          <select
            name="Furnishing"
            value={formData.residentialDetails?.Furnishing || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Furnishing</option>

            <option value="Unfurnished">
              Unfurnished
            </option>

            <option value="Semi Furnished">
              Semi Furnished
            </option>

            <option value="Fully Furnished">
              Fully Furnished
            </option>

          </select>
        </div>

        {/* Floor No */}

        <div>
          <label className="mb-2 block font-medium">
            Floor No
          </label>

          <input
            type="number"
            name="FloorNo"
            min="0"
            value={formData.residentialDetails?.FloorNo || ""}
            onChange={handleChange}
            placeholder="5"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Total Floors */}

        <div>
          <label className="mb-2 block font-medium">
            Total Floors
          </label>

          <input
            type="number"
            name="TotalFloors"
            min="0"
            value={formData.residentialDetails?.TotalFloors || ""}
            onChange={handleChange}
            placeholder="12"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

      </div>

    </div>
  );
}