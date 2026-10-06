"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "./FeaturedProperties.module.css";
import RoleSelectionModal from "./RoleSelectionModal";
import { getUserWishlist, addToWishlist, removeFromWishlist } from "@/services/wishlistService";
import { getStrapiMedia } from "@/utils/getStrapiMedia";

export default function FeaturedProperties({ data, properties }) {
  // =========================================
  // AUTH & WISHLIST STATE
  // =========================================
  const [savedPropertyIds, setSavedPropertyIds] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [savingPropertyId, setSavingPropertyId] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("strapi_jwt");
    const role = localStorage.getItem("userRole");
    const activeMode = localStorage.getItem("activeMode");

    if (token && token !== "null" && token !== "undefined") {
      setIsLoggedIn(true);
      setUserRole(role);

      if (role === "Admin") {
        setIsLoadingSaved(false);
      } else if (role === "Owner" && activeMode !== "buyer") {
        setIsLoadingSaved(false);
      } else {
        const pendingId = localStorage.getItem("pendingSavePropertyId");
        if (pendingId) {
          processPendingSave(pendingId);
        } else {
          fetchWishlist();
        }
      }
    } else {
      setIsLoadingSaved(false);
    }
  }, []);

  const processPendingSave = async (propertyId) => {
    try {
      setIsLoadingSaved(true);
      await addToWishlist(propertyId);
      toast.success("Property saved successfully.");
    } catch (error) {
      toast.error("Unable to save this property. Please try again.");
    } finally {
      localStorage.removeItem("pendingSavePropertyId");
      fetchWishlist();
    }
  };

  const fetchWishlist = async () => {
    try {
      setIsLoadingSaved(true);
      const profile = await getUserWishlist();
      const wishlistProps = profile?.Wishlist?.properties || [];
      const ids = wishlistProps.map((p) => String(p.documentId));
      setSavedPropertyIds(ids);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  const handleSaveClick = async (event, propertyId) => {
    event.preventDefault();

    if (!isLoggedIn) {
      localStorage.setItem("pendingSavePropertyId", propertyId);
      setShowRoleModal(true);
      return;
    }

    if (userRole === "Admin") {
      return;
    }

    const activeMode = localStorage.getItem("activeMode");

    if (userRole === "Owner" && activeMode !== "buyer") {
      toast(
        (t) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
              Saved properties are available in Buyer mode.
            </span>
            <button
              onClick={() => {
                localStorage.setItem("activeMode", "buyer");
                toast.dismiss(t.id);
                window.location.reload();
              }}
              style={{
                backgroundColor: '#176b4d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start', fontSize: '13px', fontWeight: '600'
              }}
            >
              Switch to Buyer
            </button>
          </div>
        ),
        { duration: 6000, id: 'switch-buyer-toast-prop' }
      );
      return;
    }

    try {
      setSavingPropertyId(propertyId);
      const isSaved = savedPropertyIds.includes(String(propertyId));

      if (isSaved) {
        await removeFromWishlist(propertyId);
        setSavedPropertyIds((prev) => prev.filter((id) => id !== String(propertyId)));
        toast.success("Removed from Saved Properties");
      } else {
        await addToWishlist(propertyId);
        setSavedPropertyIds((prev) => [...prev, String(propertyId)]);
        toast.success("Added to Saved Properties");
      }
    } catch (error) {
      toast.error(
        savedPropertyIds.includes(String(propertyId))
          ? "Unable to remove this property. Please try again."
          : "Unable to save this property. Please try again."
      );
    } finally {
      setSavingPropertyId(null);
    }
  };

  const handleViewDetailsClick = (e, propertyId) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowRoleModal(true);
    } else {
      window.location.href = `/property/${propertyId}`;
    }
  };

  // =========================================
  // FEATURED PROPERTIES DATA
  // =========================================

  const featuredData = data || {};

  const propertyList = Array.isArray(properties)
    ? properties
    : Array.isArray(featuredData?.Properties)
      ? featuredData.Properties
      : [];

  // =========================================
  // EMPTY STATE
  // =========================================

  if (propertyList.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* =========================================
            SECTION HEADER
        ========================================= */}

        <div className={styles.headingRow}>

          <div className={styles.heading}>

            <span className={styles.eyebrow}>
              {featuredData?.SectionLabel ||
                "FEATURED PROPERTIES"}
            </span>

            <h2>
              {featuredData?.Title ||
                "Handpicked Properties For You"}
            </h2>

            <p>
              {featuredData?.Subtitle ||
                "Explore properties recently added by verified owners."}
            </p>

          </div>

          <a
            href="/search"
            className={styles.viewAllButton}
          >
            {featuredData?.ViewAllText ||
              "View All Properties"}

            <span>→</span>
          </a>

        </div>

        {/* =========================================
            PROPERTY CARDS
        ========================================= */}

        <div className={styles.propertyGrid}>

          {propertyList.map((property, index) => {

            // =====================================
            // IMAGE
            // =====================================

            // Use canonical utility — handles all Strapi response shapes
            // and always produces the correct production URL
            const imageUrl = getStrapiMedia(property?.CoverImage) || "";

            // =====================================
            // BASIC PROPERTY DATA
            // =====================================

            const title =
              property?.Title ||
              "Property";

            const city =
              property?.City ||
              "";

            const state =
              property?.State ||
              "";

            const address =
              property?.Address ||
              "";

            const propertyType =
              property?.Property_Type ||
              "";

            const purpose =
              property?.Purpose ||
              "";

            const category =
              property?.Category ||
              "";

            // =====================================
            // COMMON DETAILS
            // =====================================

            const commonDetails =
              property?.PropertyCommonDetails ||
              {};

            const residentialDetails =
              property?.ResidentialDetails ||
              {};

            // =====================================
            // PROPERTY DETAILS
            // =====================================

            const carpetArea =
              commonDetails?.CarpetArea;

            const areaUnit =
              commonDetails?.Area_Unit ||
              "sq.ft";

            const bedrooms =
              residentialDetails?.Bedrooms;

            const bathrooms =
              residentialDetails?.Bathrooms;

            const parking =
              commonDetails?.Parking;

            // =====================================
            // PROPERTY ID
            // =====================================

            const propertyId =
              property?.documentId ||
              property?.id ||
              "";

            return (
              <article
                key={
                  propertyId ||
                  index
                }
                className={styles.propertyCard}
              >

                {/* =================================
                    IMAGE
                ================================= */}

                <div className={styles.imageWrapper}>

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className={
                        styles.propertyImage
                      }
                    />
                  ) : (
                    <div
                      className={
                        styles.imagePlaceholder
                      }
                    >
                      Property Image
                    </div>
                  )}

                  {/* PURPOSE */}

                  {purpose && (
                    <span
                      className={
                        styles.purposeBadge
                      }
                    >
                      {purpose}
                    </span>
                  )}

                  {/* FEATURED */}

                  <span
                    className={
                      styles.featuredBadge
                    }
                  >
                    Featured
                  </span>

                  {/* HEART */}

                  <button
                    type="button"
                    className={
                      styles.favoriteButton
                    }
                    aria-label="Save property"
                    onClick={(e) => handleSaveClick(e, propertyId)}
                    disabled={savingPropertyId === propertyId}
                    style={{ opacity: savingPropertyId === propertyId ? 0.5 : 1 }}
                  >
                    {savedPropertyIds.includes(String(propertyId)) ? "♥" : "♡"}
                  </button>

                </div>

                {/* =================================
                    CARD CONTENT
                ================================= */}

                <div
                  className={
                    styles.cardContent
                  }
                >

                  {/* CATEGORY */}

                  {category && (
                    <span
                      className={
                        styles.category
                      }
                    >
                      {category}
                    </span>
                  )}

                  {/* PROPERTY TYPE */}

                  {propertyType && (
                    <span
                      className={
                        styles.propertyType
                      }
                    >
                      {propertyType}
                    </span>
                  )}

                  {/* TITLE */}

                  <h3>
                    {title}
                  </h3>

                  {/* LOCATION */}

                  {(city ||
                    state ||
                    address) && (
                    <p
                      className={
                        styles.location
                      }
                    >
                      <span>⌖</span>

                      {address
                        ? address
                        : `${city}${
                            state
                              ? `, ${state}`
                              : ""
                          }`}
                    </p>
                  )}

                  {/* DETAILS */}

                  <div
                    className={
                      styles.details
                    }
                  >

                    {bedrooms && (
                      <div
                        className={
                          styles.detail
                        }
                      >
                        <span>🛏</span>

                        <strong>
                          {bedrooms}
                        </strong>

                        <small>
                          BHK
                        </small>
                      </div>
                    )}

                    {carpetArea && (
                      <div
                        className={
                          styles.detail
                        }
                      >
                        <span>▣</span>

                        <strong>
                          {carpetArea}
                        </strong>

                        <small>
                          {areaUnit}
                        </small>
                      </div>
                    )}

                    {bathrooms && (
                      <div
                        className={
                          styles.detail
                        }
                      >
                        <span>♨</span>

                        <strong>
                          {bathrooms}
                        </strong>

                        <small>
                          Bath
                        </small>
                      </div>
                    )}

                    {parking && (
                      <div
                        className={
                          styles.detail
                        }
                      >
                        <span>🚗</span>

                        <strong>
                          {parking}
                        </strong>

                        <small>
                          Parking
                        </small>
                      </div>
                    )}

                  </div>

                  {/* =================================
                      BOTTOM
                  ================================= */}

                  <div
                    className={
                      styles.cardBottom
                    }
                  >

                    <div>

                      <span
                        className={
                          styles.priceLabel
                        }
                      >
                        Property Price
                      </span>

                      <strong
                        className={
                          styles.price
                        }
                      >
                        {property?.Price
                          ? `₹${property.Price}`
                          : "Price on Request"}
                      </strong>

                    </div>

                    <a
                      href={`/property/${propertyId}`}
                      onClick={(e) => handleViewDetailsClick(e, propertyId)}
                      className={
                        styles.viewButton
                      }
                    >
                      View Details

                      <span>
                        →
                      </span>
                    </a>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </div>

      {/* =========================
          ROLE SELECTION MODAL
      ========================= */}
      {showRoleModal && (
        <RoleSelectionModal
          onClose={() => setShowRoleModal(false)}
          onContinue={() => setShowRoleModal(false)}
        />
      )}

    </section>
  );
}