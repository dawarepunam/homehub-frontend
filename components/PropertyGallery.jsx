"use client";

import { useState } from "react";
import Image from "next/image";

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
    <section className="space-y-4">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--border-subtle)] bg-[var(--bg-section)] h-[400px] md:h-[500px]">
        <Image
          src={selectedImage}
          alt="Property"
          fill
          className="object-cover transition-opacity duration-300"
          unoptimized
          priority
        />
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {/* Cover Image */}
          <div
            onClick={() => setSelectedImage(coverImage)}
            className={`relative h-24 min-w-[120px] cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === coverImage
                ? "border-[var(--text-primary)] opacity-100"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={coverImage} alt="Cover" fill className="object-cover" unoptimized />
          </div>

          {/* Gallery Images */}
          {galleryImages.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image.url)}
              className={`relative h-24 min-w-[120px] cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === image.url
                  ? "border-[var(--text-primary)] opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={image.url} alt="Gallery" fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}