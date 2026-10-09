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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="relative w-full max-w-[520px] rounded-[24px] bg-[var(--bg-card)] p-8 shadow-[var(--shadow-card)] border border-[var(--border-subtle)] transform transition-all duration-300 animate-in fade-in zoom-in-95"
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-page)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
        >
          <X size={18} />
        </button>

        {/* BACK BUTTON (Only for Step 2) */}
        {step === "owner" && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back"
            className="absolute top-5 left-5 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-page)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        {/* HEADING */}
        <div className={`text-center mb-8 ${step === "owner" ? "mt-2" : ""}`}>
          <h2 className="text-[28px] font-extrabold text-[var(--text-primary)] tracking-tight">
            {step === "initial" ? "Welcome to HomeHub" : "How do you want to continue?"}
          </h2>
          <p className="mt-2 text-[15px] text-[var(--text-muted)] font-medium">
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
              className={`group relative text-left p-6 min-h-[180px] rounded-[18px] border-2 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)] ${
                selectedOption === "admin" 
                  ? "border-[var(--text-primary)] bg-[var(--bg-card-hover)] shadow-sm -translate-y-1" 
                  : "border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5"
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-5 transition-colors duration-300 ${
                selectedOption === "admin" ? "bg-[var(--text-primary)] text-[var(--bg-page)]" : "bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] group-hover:border-[var(--border-hover)]"
              }`}>
                <Settings size={22} strokeWidth={2.5} />
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                Administration
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)] font-medium">
                Manage HomeHub platform and operations.
              </p>
            </button>

            {/* OWNER */}
            <button
              type="button"
              onClick={() => setSelectedOption("owner")}
              className={`group relative text-left p-6 min-h-[180px] rounded-[18px] border-2 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)] ${
                selectedOption === "owner" 
                  ? "border-[var(--text-primary)] bg-[var(--bg-card-hover)] shadow-sm -translate-y-1" 
                  : "border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5"
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-5 transition-colors duration-300 ${
                selectedOption === "owner" ? "bg-[var(--text-primary)] text-[var(--bg-page)]" : "bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] group-hover:border-[var(--border-hover)]"
              }`}>
                <Building2 size={22} strokeWidth={2.5} />
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                Portal
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)] font-medium">
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
              className={`group relative text-left p-6 min-h-[180px] rounded-[18px] border-2 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)] ${
                selectedOption === "seller" 
                  ? "border-[var(--text-primary)] bg-[var(--bg-card-hover)] shadow-sm -translate-y-1" 
                  : "border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5"
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-5 transition-colors duration-300 ${
                selectedOption === "seller" ? "bg-[var(--text-primary)] text-[var(--bg-page)]" : "bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] group-hover:border-[var(--border-hover)]"
              }`}>
                <Building2 size={22} strokeWidth={2.5} />
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                Seller
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)] font-medium">
                I want to list and manage my properties.
              </p>
            </button>

            {/* BUYER */}
            <button
              type="button"
              onClick={() => setSelectedOption("buyer")}
              className={`group relative text-left p-6 min-h-[180px] rounded-[18px] border-2 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)] ${
                selectedOption === "buyer" 
                  ? "border-[var(--text-primary)] bg-[var(--bg-card-hover)] shadow-sm -translate-y-1" 
                  : "border-[var(--border-subtle)] bg-[var(--bg-page)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5"
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-5 transition-colors duration-300 ${
                selectedOption === "buyer" ? "bg-[var(--text-primary)] text-[var(--bg-page)]" : "bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] group-hover:border-[var(--border-hover)]"
              }`}>
                <UserRound size={22} strokeWidth={2.5} />
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                Buyer
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)] font-medium">
                I want to buy or rent a property.
              </p>
            </button>
          </div>
        )}

        {/* CONTINUE BUTTON */}
        <button
          type="button"
          onClick={handleContinue}
          className="group relative w-full mt-8 flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] text-[15px] font-bold transition-all duration-300 hover:opacity-90 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)] shadow-sm"
        >
          Continue
          <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* FOOTER TEXT */}
        <p className="mt-5 text-center text-[13px] text-[var(--text-muted)] font-medium">
          You can change your selection before continuing.
        </p>
      </div>
    </div>
  );
}