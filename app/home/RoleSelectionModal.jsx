"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleSelectionModal({ onClose }) {
  const router = useRouter();
  
  // Step 1: initial, Step 2: owner
  const [step, setStep] = useState("initial");
  
  // "admin" or "owner" (for first step)
  // "seller" or "buyer" (for second step)
  const [selectedOption, setSelectedOption] = useState("owner");

  const handleContinue = () => {
    if (step === "initial") {
      if (selectedOption === "admin") {
        router.push("/admin/login");
        onClose();
      } else if (selectedOption === "owner") {
        setStep("owner");
        setSelectedOption("seller"); // Default selected option for step 2
      }
    } else if (step === "owner") {
      if (selectedOption === "seller") {
        router.push("/login");
      } else if (selectedOption === "buyer") {
        router.push("/user/login");
      }
      onClose();
    }
  };

  const handleBack = () => {
    if (step === "owner") {
      setStep("initial");
      setSelectedOption("owner");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(20, 35, 28, 0.55)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "520px",
          borderRadius: "24px",
          background: "#fffdf8",
          padding: "32px",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.18)",
        }}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            width: "34px",
            height: "34px",
            border: "none",
            borderRadius: "50%",
            background: "#f1f0e9",
            color: "#26352d",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {/* BACK BUTTON (Only for Step 2) */}
        {step === "owner" && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back"
            style={{
              position: "absolute",
              top: "18px",
              left: "18px",
              width: "34px",
              height: "34px",
              border: "none",
              borderRadius: "50%",
              background: "#f1f0e9",
              color: "#26352d",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ←
          </button>
        )}

        {/* HEADING */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "26px",
            marginTop: step === "owner" ? "10px" : "0"
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#18352a",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            {step === "initial" ? "Welcome to HomeHub" : "How do you want to continue?"}
          </h2>

          <p
            style={{
              margin: "9px 0 0",
              color: "#6d756f",
              fontSize: "15px",
            }}
          >
            {step === "initial" ? "Choose how you want to continue" : "Select your role"}
          </p>
        </div>

        {/* STEP 1 OPTIONS */}
        {step === "initial" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            {/* ADMINISTRATION */}
            <button
              type="button"
              onClick={() => setSelectedOption("admin")}
              style={{
                textAlign: "left",
                padding: "20px",
                minHeight: "170px",
                borderRadius: "18px",
                border: selectedOption === "admin" ? "2px solid #176b4d" : "1px solid #dedfd8",
                background: selectedOption === "admin" ? "#f1f8f4" : "#ffffff",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "#e4f1ea",
                  fontSize: "22px",
                  marginBottom: "14px",
                }}
              >
                ⚙️
              </div>
              <div
                style={{
                  color: "#18352a",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Administration
              </div>
              <p
                style={{
                  margin: "7px 0 0",
                  color: "#737a75",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                Manage HomeHub platform and operations.
              </p>
            </button>

            {/* OWNER */}
            <button
              type="button"
              onClick={() => setSelectedOption("owner")}
              style={{
                textAlign: "left",
                padding: "20px",
                minHeight: "170px",
                borderRadius: "18px",
                border: selectedOption === "owner" ? "2px solid #c59627" : "1px solid #dedfd8",
                background: selectedOption === "owner" ? "#fff9e9" : "#ffffff",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "#fff1c9",
                  fontSize: "22px",
                  marginBottom: "14px",
                }}
              >
                🏠
              </div>
              <div
                style={{
                  color: "#18352a",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Owner
              </div>
              <p
                style={{
                  margin: "7px 0 0",
                  color: "#737a75",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                List, sell and manage your properties.
              </p>
            </button>
          </div>
        )}

        {/* STEP 2 OPTIONS */}
        {step === "owner" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            {/* SELLER */}
            <button
              type="button"
              onClick={() => setSelectedOption("seller")}
              style={{
                textAlign: "left",
                padding: "20px",
                minHeight: "170px",
                borderRadius: "18px",
                border: selectedOption === "seller" ? "2px solid #c59627" : "1px solid #dedfd8",
                background: selectedOption === "seller" ? "#fff9e9" : "#ffffff",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "#fff1c9",
                  fontSize: "22px",
                  marginBottom: "14px",
                }}
              >
                🏠
              </div>
              <div
                style={{
                  color: "#18352a",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Seller
              </div>
              <p
                style={{
                  margin: "7px 0 0",
                  color: "#737a75",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                I want to list and manage my properties.
              </p>
            </button>

            {/* BUYER */}
            <button
              type="button"
              onClick={() => setSelectedOption("buyer")}
              style={{
                textAlign: "left",
                padding: "20px",
                minHeight: "170px",
                borderRadius: "18px",
                border: selectedOption === "buyer" ? "2px solid #176b4d" : "1px solid #dedfd8",
                background: selectedOption === "buyer" ? "#f1f8f4" : "#ffffff",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "#e4f1ea",
                  fontSize: "22px",
                  marginBottom: "14px",
                }}
              >
                👤
              </div>
              <div
                style={{
                  color: "#18352a",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Buyer
              </div>
              <p
                style={{
                  margin: "7px 0 0",
                  color: "#737a75",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                I want to buy or rent a property.
              </p>
            </button>
          </div>
        )}

        {/* CONTINUE BUTTON */}
        <button
          type="button"
          onClick={handleContinue}
          style={{
            width: "100%",
            marginTop: "22px",
            padding: "14px 20px",
            border: "none",
            borderRadius: "12px",
            background: ["admin", "buyer"].includes(selectedOption) ? "#176b4d" : "#c59627",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Continue →
        </button>

        {/* FOOTER TEXT */}
        <p
          style={{
            margin: "15px 0 0",
            textAlign: "center",
            color: "#929791",
            fontSize: "11px",
          }}
        >
          You can change your selection before continuing.
        </p>
      </div>
    </div>
  );
}