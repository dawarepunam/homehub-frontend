"use client";

export default function Location({
  formData,
  setFormData,
}) {
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Property Location
        </h2>

        <p className="mt-1 text-gray-500">
          Enter the complete address of your property.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">

        {/* Address */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Address
          </label>

          <textarea
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter Full Address"
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Area */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Area
          </label>

          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Baner"
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* City & State */}

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Pune"
              className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              State
            </label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Maharashtra"
              className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

        </div>

        {/* Pin Code */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Pin Code
          </label>

          <input
            type="number"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            placeholder="411045"
            className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

      </div>

    </div>
  );
}