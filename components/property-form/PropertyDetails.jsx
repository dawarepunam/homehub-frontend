"use client";

import PropertyCommonDetails from "./PropertyCommonDetails";
import ResidentialDetails from "./ResidentialDetails";
import CommercialDetails from "./CommercialDetails";
import IndustrialDetails from "./IndustrialDetails";

export default function PropertyDetails({
  formData,
  setFormData,
}) {
  return (
    <div className="space-y-10">

      {/* Heading */}

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Property Details
        </h2>

        <p className="mt-2 text-gray-500">
          Fill the property specifications based on the selected property type.
        </p>
      </div>

      {/* Common Details */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <PropertyCommonDetails
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      {/* Property Type Validation */}

      {!formData.propertyType && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-700">
          Please select <strong>Property Type</strong> in Step 1 to continue.
        </div>
      )}

      {/* Residential Details */}

      {formData.propertyType === "Residential" && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <ResidentialDetails
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      )}

      {/* Commercial Details */}

      {formData.propertyType === "Commercial" && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <CommercialDetails
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      )}

      {/* Industrial Details */}

      {formData.propertyType === "Industrial" && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <IndustrialDetails
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      )}

    </div>
  );
}