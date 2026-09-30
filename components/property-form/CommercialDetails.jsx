"use client";

export default function CommercialDetails({
  formData,
  setFormData,
}) {
  function handleChange(e) {
    const { name, value } = e.target;

    let finalValue = value;

    // Boolean Fields
    if (name === "Pantry" || name === "ReceptionArea") {
      finalValue = value === "true";
    }

    // Number Fields
    if (
      name === "Washrooms" ||
      name === "Cabins" ||
      name === "MeetingRooms"
    ) {
      finalValue = value === "" ? "" : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      commercialDetails: {
        ...prev.commercialDetails,
        [name]: finalValue,
      },
    }));
  }

  return (
    <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Commercial Details
        </h2>

        <p className="text-gray-500">
          Fill commercial property information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Commercial Type */}
        <div>
          <label className="mb-2 block font-medium">
            Commercial Type
          </label>

          <select
            name="CommercialType"
            value={formData.commercialDetails?.CommercialType || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Commercial Type</option>
            <option value="Office">Office</option>
            <option value="Shop">Shop</option>
            <option value="Showroom">Showroom</option>
            <option value="Co-working Space">Co-working Space</option>
            <option value="Commercial Land">Commercial Land</option>
          </select>
        </div>

        {/* Washrooms */}
        <div>
          <label className="mb-2 block font-medium">
            Washrooms
          </label>

          <input
            type="number"
            name="Washrooms"
            value={formData.commercialDetails?.Washrooms ?? ""}
            onChange={handleChange}
            placeholder="2"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Cabins */}
        <div>
          <label className="mb-2 block font-medium">
            Cabins
          </label>

          <input
            type="number"
            name="Cabins"
            value={formData.commercialDetails?.Cabins ?? ""}
            onChange={handleChange}
            placeholder="5"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Meeting Rooms */}
        <div>
          <label className="mb-2 block font-medium">
            Meeting Rooms
          </label>

          <input
            type="number"
            name="MeetingRooms"
            value={formData.commercialDetails?.MeetingRooms ?? ""}
            onChange={handleChange}
            placeholder="2"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Pantry */}
        <div>
          <label className="mb-2 block font-medium">
            Pantry
          </label>

          <select
            name="Pantry"
            value={
              formData.commercialDetails?.Pantry === true
                ? "true"
                : formData.commercialDetails?.Pantry === false
                ? "false"
                : ""
            }
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Pantry</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Reception Area */}
        <div>
          <label className="mb-2 block font-medium">
            Reception Area
          </label>

          <select
            name="ReceptionArea"
            value={
              formData.commercialDetails?.ReceptionArea === true
                ? "true"
                : formData.commercialDetails?.ReceptionArea === false
                ? "false"
                : ""
            }
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select Reception Area</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

      </div>

    </div>
  );
}