"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Building2, UserRound, ArrowRight, ArrowLeft, X } from "lucide-react";

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#14231C]/60 backdrop-blur-md">
      <div className="relative w-full max-w-[520px] rounded-[24px] bg-white p-8 shadow-[0_25px_70px_rgba(0,0,0,0.18)] border border-[#E5E9EA]">
        
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#FAFAFA] text-[#14231C] border border-[#E5E9EA] hover:bg-[#F2F4F5] transition-colors"
        >
          <X size={18} />
        </button>

        {/* BACK BUTTON (Only for Step 2) */}
        {step === "owner" && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back"
            className="absolute top-5 left-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#FAFAFA] text-[#14231C] border border-[#E5E9EA] hover:bg-[#F2F4F5] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        {/* HEADING */}
        <div className={`text-center mb-8 ${step === "owner" ? "mt-2" : ""}`}>
          <h2 className="text-[28px] font-bold text-[#14231C]">
            {step === "initial" ? "Welcome to HomeHub" : "How do you want to continue?"}
          </h2>
          <p className="mt-2 text-[15px] text-[#5C7680]">
            {step === "initial" ? "Choose how you want to continue" : "Select your role"}
          </p>
        </div>

        {/* STEP 1 OPTIONS */}
        {step === "initial" && (
          <div className="grid grid-cols-2 gap-4">
            {/* ADMINISTRATION */}
            <button
              type="button"
              onClick={() => setSelectedOption("admin")}
              className={`text-left p-5 min-h-[170px] rounded-[18px] border-2 transition-all duration-200 ${
                selectedOption === "admin" 
                  ? "border-[#14231C] bg-[#FAFAFA] shadow-sm" 
                  : "border-[#E5E9EA] bg-white hover:border-[#D1D9DC]"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14231C]/10 text-[#14231C] mb-4">
                <Settings size={22} />
              </div>
              <div className="text-lg font-bold text-[#14231C]">
                Administration
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#5C7680]">
                Manage HomeHub platform and operations.
              </p>
            </button>

            {/* OWNER */}
            <button
              type="button"
              onClick={() => setSelectedOption("owner")}
              className={`text-left p-5 min-h-[170px] rounded-[18px] border-2 transition-all duration-200 ${
                selectedOption === "owner" 
                  ? "border-[#D9A441] bg-[#FFFAF0] shadow-sm" 
                  : "border-[#E5E9EA] bg-white hover:border-[#D1D9DC]"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D9A441]/10 text-[#D9A441] mb-4">
                <Building2 size={22} />
              </div>
              <div className="text-lg font-bold text-[#14231C]">
                Portal
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#5C7680]">
                Access the Buyer or Seller portals.
              </p>
            </button>
          </div>
        )}

        {/* STEP 2 OPTIONS */}
        {step === "owner" && (
          <div className="grid grid-cols-2 gap-4">
            {/* SELLER */}
            <button
              type="button"
              onClick={() => setSelectedOption("seller")}
              className={`text-left p-5 min-h-[170px] rounded-[18px] border-2 transition-all duration-200 ${
                selectedOption === "seller" 
                  ? "border-[#D9A441] bg-[#FFFAF0] shadow-sm" 
                  : "border-[#E5E9EA] bg-white hover:border-[#D1D9DC]"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D9A441]/10 text-[#D9A441] mb-4">
                <Building2 size={22} />
              </div>
              <div className="text-lg font-bold text-[#14231C]">
                Seller
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#5C7680]">
                I want to list and manage my properties.
              </p>
            </button>

            {/* BUYER */}
            <button
              type="button"
              onClick={() => setSelectedOption("buyer")}
              className={`text-left p-5 min-h-[170px] rounded-[18px] border-2 transition-all duration-200 ${
                selectedOption === "buyer" 
                  ? "border-[#176B4D] bg-[#F1F8F4] shadow-sm" 
                  : "border-[#E5E9EA] bg-white hover:border-[#D1D9DC]"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#176B4D]/10 text-[#176B4D] mb-4">
                <UserRound size={22} />
              </div>
              <div className="text-lg font-bold text-[#14231C]">
                Buyer
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[#5C7680]">
                I want to buy or rent a property.
              </p>
            </button>
          </div>
        )}

        {/* CONTINUE BUTTON */}
        <button
          type="button"
          onClick={handleContinue}
          className={`w-full mt-6 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-white text-[15px] font-bold transition-all duration-200 hover:shadow-md ${
            ["admin"].includes(selectedOption) 
              ? "bg-[#14231C] hover:bg-[#0E1A14]" 
              : ["buyer"].includes(selectedOption)
              ? "bg-[#176B4D] hover:bg-[#104D36]"
              : "bg-[#073B4C] hover:bg-[#0A485D]"
          }`}
        >
          Continue
          <ArrowRight size={18} />
        </button>

        {/* FOOTER TEXT */}
        <p className="mt-4 text-center text-[12px] text-[#8BA7AF]">
          You can change your selection before continuing.
        </p>
      </div>
    </div>
  );
}