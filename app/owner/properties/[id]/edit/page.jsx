"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PropertyForm from "@/components/property-form/PropertyForm";
import Header from "@/components/Header";
import Footer from "../../../Footer";
import { getOwnerDashboard } from "@/services/ownerDashboard";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:1337";

function extractTextFromBlocks(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      if (!block.children || !Array.isArray(block.children)) return "";
      return block.children.map((child) => child.text).join("");
    })
    .join("\n");
}

export default function EditPropertyPage({ params }) {
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [mappedData, setMappedData] = useState(null);
  
  // Resolve params for Next 15+ compatibility if needed
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  useEffect(() => {
    let cancelled = false;

    async function loadProperty() {
      try {
        setLoading(true);
        setErrorMessage("");

        if (!id) {
          throw new Error("Property ID not found.");
        }

        try {
          const dashboardData = await getOwnerDashboard();
          if (!cancelled) setDashboard(dashboardData || null);
        } catch (err) {
          console.warn("Owner dashboard could not load:", err);
        }

        const token = localStorage.getItem("token") || localStorage.getItem("jwt") || localStorage.getItem("strapi_jwt");
        if (!token) {
          throw new Error("Please login as Owner first.");
        }

        // Fetch property
        const propertyResponse = await fetch(`${STRAPI_URL}/api/properties/${id}?populate=*`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!propertyResponse.ok) {
          throw new Error(`Unable to load property. Status: ${propertyResponse.status}`);
        }

        const result = await propertyResponse.json();
        const propertyData = result?.data;

        if (!propertyData) {
          throw new Error("Property not found.");
        }

        // Check Authorization
        const userResponse = await fetch(`${STRAPI_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const currentUser = await userResponse.json();

        if (propertyData.Owner?.id !== currentUser?.id) {
          throw new Error("You are not authorized to edit this property.");
        }

        if (!cancelled) {
          setProperty(propertyData);

          // Map Strapi Data to PropertyForm initialFormData
          const p = propertyData;
          
          let propertyAgeMapped = p.PropertyCommonDetails?.PropertyAge || "";
          if (propertyAgeMapped === "New ") propertyAgeMapped = "New";
          else if (propertyAgeMapped === "Years 1-5") propertyAgeMapped = "0-5 Years";
          else if (propertyAgeMapped === "Years 5-10") propertyAgeMapped = "5-10 Years";
          else if (propertyAgeMapped === "Years 10+") propertyAgeMapped = "10+ Years";

          let bedroomsMapped = p.ResidentialDetails?.Bedrooms || "";
          if (bedroomsMapped === "BHK 1") bedroomsMapped = "1 BHK";
          else if (bedroomsMapped === "BHK 2") bedroomsMapped = "2 BHK";
          else if (bedroomsMapped === "BHK 3") bedroomsMapped = "3 BHK";
          else if (bedroomsMapped === "BHK 4") bedroomsMapped = "4 BHK";
          else if (bedroomsMapped === "BHK 5+") bedroomsMapped = "5+ BHK";

          let priceUnitsMapped = p.PriceUnits || "Lakh";
          if (priceUnitsMapped === "Cr") priceUnitsMapped = "Crore";
          else if (priceUnitsMapped === "/month") priceUnitsMapped = "Monthly";

          const mapped = {
            title: p.Title || "",
            description: extractTextFromBlocks(p.Description),
            purpose: p.Purpose || "",
            propertyType: p.Property_Type || "",
            category: p.Category || "",
            propertyStatus: p.PropertyStatus || "ACTIVE",
            address: p.Address || "",
            area: p.Area || "",
            city: p.City || "",
            state: p.State || "",
            pinCode: p.PinCode ? String(p.PinCode) : "",
            price: p.Price ? String(p.Price) : "",
            priceUnits: priceUnitsMapped,
            propertyCommonDetails: {
              carpetArea: p.PropertyCommonDetails?.CarpetArea ? String(p.PropertyCommonDetails.CarpetArea) : "",
              built_upArea: p.PropertyCommonDetails?.Built_upArea ? String(p.PropertyCommonDetails.Built_upArea) : "",
              propertyAge: propertyAgeMapped,
              facing: p.PropertyCommonDetails?.Facing || "",
              availableFrom: p.PropertyCommonDetails?.AvailableForm ? p.PropertyCommonDetails.AvailableForm.split("T")[0] : "",
              area_unit: p.PropertyCommonDetails?.Area_Unit || "Sq.ft",
            },
            residentialDetails: {
              bedrooms: bedroomsMapped,
              bathrooms: p.ResidentialDetails?.Bathrooms ? String(p.ResidentialDetails.Bathrooms) : "",
              balconies: p.ResidentialDetails?.Balconies ? String(p.ResidentialDetails.Balconies) : "",
              furnishing: p.ResidentialDetails?.Furnishing || "",
              floorNo: p.ResidentialDetails?.FloorNo ? String(p.ResidentialDetails.FloorNo) : "",
              totalFloors: p.ResidentialDetails?.TotalFloors ? String(p.ResidentialDetails.TotalFloors) : "",
              propertyCondition: p.ResidentialDetails?.PropertyCondition || "",
            },
            commercialDetails: {
              commercialType: p.CommercialDetails?.CommercialType || "",
              washrooms: p.CommercialDetails?.Washrooms ? String(p.CommercialDetails.Washrooms) : "",
              cabins: p.CommercialDetails?.Cabins ? String(p.CommercialDetails.Cabins) : "",
              meetingRooms: p.CommercialDetails?.MeetingRooms ? String(p.CommercialDetails.MeetingRooms) : "",
              pantry: Boolean(p.CommercialDetails?.Pantry),
              receptionArea: Boolean(p.CommercialDetails?.ReceptionArea),
            },
            industrialDetails: {
              industrialType: p.IndustrialDetails?.IndustrialType || "",
              warehouseArea: p.IndustrialDetails?.WarehouseArea ? String(p.IndustrialDetails.WarehouseArea) : "",
              loadingDock: Boolean(p.IndustrialDetails?.LoadingDock),
              powerSupply: p.IndustrialDetails?.PowerSupply || "",
              officeSpace: Boolean(p.IndustrialDetails?.OfficeSpace),
              craneFacility: Boolean(p.IndustrialDetails?.CraneFacility),
            },
            amenities: {
              Parking: Boolean(p.PropertyAmenities?.Parking),
              Lift: Boolean(p.PropertyAmenities?.Lift),
              Security: Boolean(p.PropertyAmenities?.Security),
              CCTV: Boolean(p.PropertyAmenities?.CCTV),
              PowerBackup: Boolean(p.PropertyAmenities?.PowerBackup),
              Gym: Boolean(p.PropertyAmenities?.Gym),
              SwimmingPool: Boolean(p.PropertyAmenities?.SwimmingPool),
              Garden: Boolean(p.PropertyAmenities?.Garden),
            },
            coverImage: null,
            propertyImages: [],
          };

          setMappedData(mapped);
        }
      } catch (error) {
        console.error("EDIT PROPERTY ERROR:", error);
        if (!cancelled) setErrorMessage(error?.message || "Unable to load property details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProperty();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="owner-layout">
        <Header dashboard={dashboard} />
        <main className="loading-container">
          <div className="spinner"></div>
          <p>Loading property details...</p>
        </main>
        <Footer />
        <style jsx>{`
          .loading-container { min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fafafa; }
          .spinner { width: 40px; height: 40px; border: 4px solid rgba(0, 0, 0, 0.1); border-left-color: #2b4c3b; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="owner-layout">
        <Header dashboard={dashboard} />
        <main className="error-container">
          <h2>Error</h2>
          <p>{errorMessage}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>Try Again</button>
          <Link href={`/owner/properties/${id}`} className="back-link">Back to Property</Link>
        </main>
        <Footer />
        <style jsx>{`
          .error-container { min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fafafa; text-align: center; }
          .error-container h2 { color: #d32f2f; margin-bottom: 10px; }
          .retry-btn { margin-top: 20px; padding: 10px 20px; background: #2b4c3b; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
          .back-link { margin-top: 20px; color: #2b4c3b; text-decoration: underline; font-weight: 500; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="owner-layout">
      <Header dashboard={dashboard} />
      
      <main className="edit-property-main">
        <div className="edit-header-container">
          <Link href={`/owner/properties/${id}`} className="back-nav">
            <ArrowLeft size={18} />
            Back to Property
          </Link>
          <div className="edit-title">
            <h1>Edit Property</h1>
            <p>Update your property details and keep your listing accurate.</p>
          </div>
        </div>

        {mappedData && (
          <PropertyForm 
            mode="edit" 
            initialData={mappedData} 
            propertyId={id} 
            onCancel={() => router.push(`/owner/properties/${id}`)}
          />
        )}
      </main>

      <Footer />

      <style jsx>{`
        .owner-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #fafafa;
        }
        .edit-property-main {
          flex: 1;
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .edit-header-container {
          margin-bottom: 30px;
        }
        .back-nav {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #2b4c3b;
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 20px;
          transition: color 0.2s ease;
        }
        .back-nav:hover {
          color: #c99438;
        }
        .edit-title h1 {
          font-size: 32px;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        .edit-title p {
          color: #666;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}
