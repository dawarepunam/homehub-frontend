"use client";

export default function Review({ formData }) {
  return (
    <div className="space-y-8">

      {/* Heading */}

      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Review Property
        </h2>

        <p className="mt-2 text-gray-500">
          Please verify all details before submitting.
        </p>
      </div>

      {/* Basic Information */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h3 className="mb-5 text-xl font-semibold">
          Basic Information
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          <p><strong>Title :</strong> {formData.title || "Not Provided"}</p>

          <p><strong>Property Type :</strong> {formData.propertyType || "Not Provided"}</p>

          <p><strong>Purpose :</strong> {formData.purpose || "Not Provided"}</p>

          <p><strong>Category :</strong> {formData.category || "Not Provided"}</p>

          <p><strong>Status :</strong> {formData.propertyStatus || "Not Provided"}</p>

          <p className="md:col-span-2">
            <strong>Description :</strong>{" "}
            {formData.description || "Not Provided"}
          </p>

        </div>

      </div>

      {/* Location */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h3 className="mb-5 text-xl font-semibold">
          Location
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          <p><strong>Address :</strong> {formData.address || "Not Provided"}</p>

          <p><strong>Area :</strong> {formData.area || "Not Provided"}</p>

          <p><strong>City :</strong> {formData.city || "Not Provided"}</p>

          <p><strong>State :</strong> {formData.state || "Not Provided"}</p>

          <p><strong>Pin Code :</strong> {formData.pinCode || "Not Provided"}</p>

        </div>

      </div>

      {/* Common Details */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h3 className="mb-5 text-xl font-semibold">
          Common Property Details
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          <p><strong>Carpet Area :</strong> {formData.propertyCommonDetails?.CarpetArea || "-"}</p>

          <p><strong>Built-up Area :</strong> {formData.propertyCommonDetails?.Built_upArea || "-"}</p>

          <p><strong>Parking :</strong> {formData.propertyCommonDetails?.Parking || "-"}</p>

          <p><strong>Property Age :</strong> {formData.propertyCommonDetails?.PropertyAge || "-"}</p>

          <p><strong>Facing :</strong> {formData.propertyCommonDetails?.Facing || "-"}</p>

          <p><strong>Area Unit :</strong> {formData.propertyCommonDetails?.Area_Unit || "-"}</p>

          <p><strong>Available From :</strong> {formData.propertyCommonDetails?.AvailableFrom || "-"}</p>

        </div>

      </div>

      {/* Residential */}

      {formData.propertyType === "Residential" && (

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h3 className="mb-5 text-xl font-semibold">
            Residential Details
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <p><strong>Bedrooms :</strong> {formData.residentialDetails?.Bedrooms || "-"}</p>

            <p><strong>Bathrooms :</strong> {formData.residentialDetails?.Bathrooms || "-"}</p>

            <p><strong>Balconies :</strong> {formData.residentialDetails?.Balconies || "-"}</p>

            <p><strong>Furnishing :</strong> {formData.residentialDetails?.Furnishing || "-"}</p>

            <p><strong>Floor No :</strong> {formData.residentialDetails?.FloorNo || "-"}</p>

            <p><strong>Total Floors :</strong> {formData.residentialDetails?.TotalFloors || "-"}</p>

          </div>

        </div>

      )}

      {/* Commercial */}

      {formData.propertyType === "Commercial" && (

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h3 className="mb-5 text-xl font-semibold">
            Commercial Details
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <p><strong>Commercial Type :</strong> {formData.commercialDetails?.CommercialType || "-"}</p>

            <p><strong>Washrooms :</strong> {formData.commercialDetails?.Washrooms || "-"}</p>

            <p><strong>Cabins :</strong> {formData.commercialDetails?.Cabins || "-"}</p>

            <p><strong>Meeting Rooms :</strong> {formData.commercialDetails?.MeetingRooms || "-"}</p>

            <p><strong>Pantry :</strong> {String(formData.commercialDetails?.Pantry ?? "-")}</p>

            <p><strong>Reception Area :</strong> {String(formData.commercialDetails?.ReceptionArea ?? "-")}</p>

          </div>

        </div>

      )}

      {/* Industrial */}

      {formData.propertyType === "Industrial" && (

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h3 className="mb-5 text-xl font-semibold">
            Industrial Details
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <p><strong>Industrial Type :</strong> {formData.industrialDetails?.IndustrialType || "-"}</p>

            <p><strong>Warehouse Area :</strong> {formData.industrialDetails?.WarehouseArea || "-"}</p>

            <p><strong>Loading Dock :</strong> {String(formData.industrialDetails?.LoadingDock ?? "-")}</p>

            <p><strong>Power Supply :</strong> {formData.industrialDetails?.PowerSupply || "-"}</p>

            <p><strong>Office Space :</strong> {String(formData.industrialDetails?.OfficeSpace ?? "-")}</p>

            <p><strong>Crane Facility :</strong> {String(formData.industrialDetails?.CraneFacility ?? "-")}</p>

          </div>

        </div>

      )}

      {/* Images */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h3 className="mb-5 text-xl font-semibold">
          Uploaded Images
        </h3>

        {/* Cover */}

        <div className="mb-6">

          <p className="mb-3 font-medium">
            Cover Image
          </p>

          {formData.coverImage ? (
            <img
              src={URL.createObjectURL(formData.coverImage)}
              alt="Cover"
              className="h-52 w-72 rounded-lg border object-cover"
            />
          ) : (
            <p className="text-gray-500">
              No Cover Image Selected
            </p>
          )}

        </div>

        {/* Gallery */}

        <div>

          <p className="mb-3 font-medium">
            Gallery Images
          </p>

          {formData.propertyImages?.length > 0 ? (

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

              {formData.propertyImages.map((image, index) => (

                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  className="h-36 w-full rounded-lg border object-cover"
                />

              ))}

            </div>

          ) : (

            <p className="text-gray-500">
              No Gallery Images Selected
            </p>

          )}

        </div>

      </div>

    </div>
  );
}