"use client";

export default function IndustrialDetails({
  formData,
  setFormData,
}) {

  function handleChange(e) {
    const { name, value } = e.target;

    let finalValue = value;

    // Boolean Fields
    if (
      name === "LoadingDock" ||
      name === "OfficeSpace" ||
      name === "CraneFacility"
    ) {
      finalValue = value === "true";
    }

    // Number Fields
    if (name === "WarehouseArea") {
      finalValue = value === "" ? "" : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      industrialDetails: {
        ...prev.industrialDetails,
        [name]: finalValue,
      },
    }));
  }

  return (
    <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Industrial Details
        </h2>

        <p className="text-gray-500">
          Fill industrial property information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Industrial Type */}

        <div>
          <label className="mb-2 block font-medium">
            Industrial Type
          </label>

          <select
            name="IndustrialType"
            value={formData.industrialDetails?.IndustrialType || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Industrial Type</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Factory">Factory</option>
            <option value="Industrial Shed">Industrial Shed</option>
            <option value="Industrial Land">Industrial Land</option>
            <option value="Manufacturing Unit">Manufacturing Unit</option>
          </select>
        </div>

        {/* Warehouse Area */}

        <div>
          <label className="mb-2 block font-medium">
            Warehouse Area
          </label>

          <input
            type="number"
            name="WarehouseArea"
            value={formData.industrialDetails?.WarehouseArea ?? ""}
            onChange={handleChange}
            placeholder="5000"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Loading Dock */}

        <div>
          <label className="mb-2 block font-medium">
            Loading Dock
          </label>

          <select
            name="LoadingDock"
            value={
              formData.industrialDetails?.LoadingDock === true
                ? "true"
                : formData.industrialDetails?.LoadingDock === false
                ? "false"
                : ""
            }
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Loading Dock</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Power Supply */}

        <div>
          <label className="mb-2 block font-medium">
            Power Supply
          </label>

          <select
            name="PowerSupply"
            value={formData.industrialDetails?.PowerSupply || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Power Supply</option>
            <option value="Single Phase">Single Phase</option>
            <option value="Three Phase">Three Phase</option>
            <option value="High Voltage">High Voltage</option>
          </select>
        </div>

        {/* Office Space */}

        <div>
          <label className="mb-2 block font-medium">
            Office Space
          </label>

          <select
            name="OfficeSpace"
            value={
              formData.industrialDetails?.OfficeSpace === true
                ? "true"
                : formData.industrialDetails?.OfficeSpace === false
                ? "false"
                : ""
            }
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Office Space</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Crane Facility */}

        <div>
          <label className="mb-2 block font-medium">
            Crane Facility
          </label>

          <select
            name="CraneFacility"
            value={
              formData.industrialDetails?.CraneFacility === true
                ? "true"
                : formData.industrialDetails?.CraneFacility === false
                ? "false"
                : ""
            }
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Crane Facility</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

      </div>

    </div>
  );
}