"use client";

const categoryOptions = {
  Residential: ["One BHK", "Two BHK", "Three BHK", "Four BHK", "Villa", "Plot"],

  Commercial: ["Office", "Shop"],

  Industrial: ["Warehouse", "Factory", "Land"],
};

export default function BasicInfo({ formData, setFormData }) {
  function handleChange(e) {
    const { name, value } = e.target;

    // Property Type बदलल्यावर Category रिकामी कर
    if (name === "propertyType") {
      setFormData((prev) => ({
        ...prev,
        propertyType: value,
        category: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Basic Information</h3>

      {/* Title */}

      <div>
        <label className="mb-2 block font-medium">Property Title</label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter Property Title"
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Description */}

      <div>
        <label className="mb-2 block font-medium">Description</label>

        <textarea
          rows={5}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Property Description"
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Property Type */}

      <div>
        <label className="mb-2 block font-medium">Property Type</label>

        <select
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select Property Type</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
        </select>
      </div>

      {/* Purpose */}

      <div>
        <label className="mb-2 block font-medium">Purpose</label>

        <select
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select Purpose</option>
          <option value="Sale">Sale</option>
          <option value="Rent">Rent</option>
          <option value="Buy">Buy</option>
          {/* <option value="Lease">Lease</option>
          <option value="WareHouse">WareHouse</option>
          <option value="Factory">Factory</option>
          <option value="Land">Land</option> */}
        </select>
      </div>

      {/* Category */}

      <div>
        <label className="mb-2 block font-medium">Category</label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={!formData.propertyType}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
        >
          <option value="">Select Category</option>

          {(categoryOptions[formData.propertyType] || []).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Property Status */}

      <div>
        <label className="mb-2 block font-medium">Property Status</label>

        <select
          name="propertyStatus"
          value={formData.propertyStatus || ""}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select Status</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Rented">Rented</option>
        </select>
      </div>
    </div>
  );
}
