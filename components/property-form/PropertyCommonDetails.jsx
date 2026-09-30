"use client";

export default function PropertyCommonDetails({
  formData,
  setFormData,
}) {

  function handleChange(e) {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      propertyCommonDetails: {
        ...prev.propertyCommonDetails,

        [name]:
          type === "number"
            ? Number(value)
            : value,
      },
    }));
  }

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Common Property Details
        </h2>

        <p className="mt-1 text-gray-500">
          Fill the common details of the property.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Carpet Area */}

        <div>
          <label className="mb-2 block font-medium">
            Carpet Area
          </label>

          <input
            type="number"
            name="CarpetArea"
            value={formData.propertyCommonDetails?.CarpetArea || ""}
            onChange={handleChange}
            placeholder="850"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Built Up Area */}

        <div>
          <label className="mb-2 block font-medium">
            Built-up Area
          </label>

          <input
            type="number"
            name="Built_upArea"
            value={formData.propertyCommonDetails?.Built_upArea || ""}
            onChange={handleChange}
            placeholder="1000"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Area Unit */}

        <div>
          <label className="mb-2 block font-medium">
            Area Unit
          </label>

          <select
            name="Area_Unit"
            value={formData.propertyCommonDetails?.Area_Unit || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Area Unit</option>
            <option value="Sq.ft">Sq.ft</option>
            <option value="Sq.m">Sq.m</option>
            <option value="Acres">Acres</option>
            <option value="Guntha">Guntha</option>
          </select>
        </div>

        {/* Parking */}

        <div>
          <label className="mb-2 block font-medium">
            Parking
          </label>

          <select
            name="Parking"
            value={formData.propertyCommonDetails?.Parking || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Parking</option>
            <option value="No Parking">No Parking</option>
            <option value="Bike Parking">Bike Parking</option>
            <option value="Car Parking">Car Parking</option>
            <option value="Bike + Car Parking">Bike + Car Parking</option>
          </select>
        </div>

        {/* Property Age */}

        <div>
          <label className="mb-2 block font-medium">
            Property Age
          </label>

          <select
            name="PropertyAge"
            value={formData.propertyCommonDetails?.PropertyAge || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Property Age</option>
            <option value="Under Construction">
              Under Construction
            </option>
            <option value="Ready to Move">
              Ready to Move
            </option>
            <option value="Years 0-1">
              0-1 Years
            </option>
            <option value="Years 1-5">
              1-5 Years
            </option>
            <option value="Years 5-10">
              5-10 Years
            </option>
            <option value="Years 10+">
              10+ Years
            </option>
          </select>
        </div>

        {/* Facing */}

        <div>
          <label className="mb-2 block font-medium">
            Facing
          </label>

          <select
            name="Facing"
            value={formData.propertyCommonDetails?.Facing || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Facing</option>

            <option value="East">East</option>
            <option value="West">West</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="North-East">North-East</option>
            <option value="North-West">North-West</option>
            <option value="South-East">South-East</option>
            <option value="South-West">South-West</option>

          </select>
        </div>

        {/* Available From */}

        <div>
          <label className="mb-2 block font-medium">
            Available From
          </label>

          <input
            type="date"
            name="AvailableFrom"
            value={formData.propertyCommonDetails?.AvailableFrom || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

      </div>

    </div>
  );
}