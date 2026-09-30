"use client";

import { useMemo } from "react";

export default function Media({
  formData,
  setFormData,
}) {

  function handleCoverImage(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      coverImage: file,
    }));
  }

  function handleGalleryImages(e) {
    const files = Array.from(e.target.files);

    const onlyImages = files.filter((file) =>
      file.type.startsWith("image/")
    );

    setFormData((prev) => ({
      ...prev,
      propertyImages: onlyImages,
    }));
  }

  const coverPreview = useMemo(() => {
    if (!formData.coverImage) return null;
    return URL.createObjectURL(formData.coverImage);
  }, [formData.coverImage]);

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Property Images
        </h2>

        <p className="mt-1 text-gray-500">
          Upload cover image and gallery images.
        </p>
      </div>

      {/* Cover Image */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <label className="mb-3 block text-lg font-semibold">
          Cover Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImage}
          className="w-full rounded-lg border p-3"
        />

        {formData.coverImage && (
          <>
            <p className="mt-3 text-sm font-medium text-green-600">
              {formData.coverImage.name}
            </p>

            <img
              src={coverPreview}
              alt="Cover Preview"
              className="mt-4 h-52 w-full rounded-lg border object-cover"
            />
          </>
        )}

      </div>

      {/* Gallery Images */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <label className="mb-3 block text-lg font-semibold">
          Gallery Images
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleGalleryImages}
          className="w-full rounded-lg border p-3"
        />

        {formData.propertyImages.length > 0 && (

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

            {formData.propertyImages.map((image, index) => (

              <div
                key={index}
                className="overflow-hidden rounded-lg border bg-gray-50"
              >

                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  className="h-36 w-full object-cover"
                />

                <div className="truncate p-2 text-xs">
                  {image.name}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}