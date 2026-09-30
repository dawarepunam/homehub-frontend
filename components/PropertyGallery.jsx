"use client";

import { useState } from "react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") ||
  "http://localhost:1337";

export default function PropertyGallery({ property }) {
  // Cover Image
  const coverImage = property?.CoverImage?.url
    ? `${STRAPI_URL}${property.CoverImage.url}`
    : "https://placehold.co/1200x700?text=No+Image";

  // Multiple Images
  const galleryImages =
    property?.PropertyImage?.map((img) => ({
      id: img.id,
      url: `${STRAPI_URL}${img.url}`,
    })) || [];

  // Main Image State
  const [selectedImage, setSelectedImage] = useState(coverImage);

  return (
    <section className="space-y-5">

      {/* Main Image */}
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <img
          src={selectedImage}
          alt="Property"
          className="h-[500px] w-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 0 && (
        <div className="grid grid-cols-5 gap-4">

          {/* Cover Image */}
          <img
            src={coverImage}
            alt="Cover"
            onClick={() => setSelectedImage(coverImage)}
            className={`h-24 w-full cursor-pointer rounded-lg border-2 object-cover transition
              ${
                selectedImage === coverImage
                  ? "border-blue-600"
                  : "border-transparent"
              }`}
          />

          {/* Gallery Images */}
          {galleryImages.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt="Gallery"
              onClick={() => setSelectedImage(image.url)}
              className={`h-24 w-full cursor-pointer rounded-lg border-2 object-cover transition
                ${
                  selectedImage === image.url
                    ? "border-blue-600"
                    : "border-transparent"
                }`}
            />
          ))}

        </div>
      )}
    </section>
  );
}