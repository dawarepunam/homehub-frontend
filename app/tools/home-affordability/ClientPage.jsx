"use client";

import { useEffect, useState } from "react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337/api";

export default function HomeAffordabilityPage() {
  const [data, setData] = useState(null);

  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [existingEMI, setExistingEMI] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("8.5");
  const [loanTenure, setLoanTenure] = useState("20");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET STRAPI DATA
  // ==========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${STRAPI_URL}/tool-setting?populate[HomeAffordability]=*`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Strapi API Error: ${response.status}`
          );
        }

        const json = await response.json();

        setData(json?.data?.HomeAffordability || null);
      } catch (err) {
        console.error(
          "Home Affordability Error:",
          err
        );

        setError(
          "Unable to load Home Affordability Calculator."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==========================================
  // CALCULATE AFFORDABILITY
  // ==========================================

  const handleCalculate = () => {
    const income = Number(monthlyIncome);
    const currentEMI = Number(existingEMI) || 0;
    const savings = Number(downPayment) || 0;
    const rate = Number(interestRate);
    const years = Number(loanTenure);

    if (!income || income <= 0) {
      alert("Please enter your monthly income.");
      return;
    }

    if (!rate || rate <= 0) {
      alert("Please enter a valid interest rate.");
      return;
    }

    if (!years || years <= 0) {
      alert("Please enter a valid loan tenure.");
      return;
    }

    /*
      We consider around 40% of monthly income
      as the maximum comfortable EMI.
    */

    const maximumEMI = income * 0.4;

    const affordableEMI = Math.max(
      maximumEMI - currentEMI,
      0
    );

    if (affordableEMI <= 0) {
      setResult({
        affordableEMI: 0,
        loanAmount: 0,
        propertyBudget: savings,
      });

      return;
    }

    // Monthly interest rate
    const monthlyRate = rate / 12 / 100;

    // Number of monthly payments
    const numberOfMonths = years * 12;

    // Loan amount based on affordable EMI
    const loanAmount =
      affordableEMI *
      ((Math.pow(
        1 + monthlyRate,
        numberOfMonths
      ) -
        1) /
        (monthlyRate *
          Math.pow(
            1 + monthlyRate,
            numberOfMonths
          )));

    const propertyBudget =
      loanAmount + savings;

    setResult({
      affordableEMI,
      loanAmount,
      propertyBudget,
    });
  };

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f4ec",
          color: "#18352a",
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        Loading calculator...
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !data) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f4ec",
          padding: "30px",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            boxShadow:
              "0 15px 45px rgba(24,53,42,0.10)",
          }}
        >
          <h2
            style={{
              color: "#18352a",
              marginBottom: "10px",
            }}
          >
            Home Affordability Calculator
          </h2>

          <p style={{ color: "#777" }}>
            {error || "Calculator data not found."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f7f4ec 0%, #eee8d9 100%)",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* =====================================
            HEADER
        ===================================== */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "58px",
              height: "58px",
              borderRadius: "18px",
              background: "#18352a",
              color: "#e5c46a",
              fontSize: "28px",
              marginBottom: "18px",
            }}
          >
            🏠
          </div>

          <h1
            style={{
              margin: 0,
              color: "#18352a",
              fontSize: "38px",
              fontWeight: 800,
            }}
          >
            {data.Title}
          </h1>

          <p
            style={{
              maxWidth: "650px",
              margin: "12px auto 0",
              color: "#6f6b62",
              fontSize: "16px",
              lineHeight: 1.7,
            }}
          >
            {data.Subtitle}
          </p>
        </div>

        {/* =====================================
            CALCULATOR CARD
        ===================================== */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "28px",
            padding: "35px",
            boxShadow:
              "0 20px 60px rgba(24,53,42,0.10)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "22px",
            }}
          >
            {/* MONTHLY INCOME */}

            <InputField
              label={data.MonthlyIncomeLabel}
              value={monthlyIncome}
              setValue={setMonthlyIncome}
              placeholder="₹ 80,000"
            />

            {/* EXISTING EMI */}

            <InputField
              label={data.ExistingEMILabel}
              value={existingEMI}
              setValue={setExistingEMI}
              placeholder="₹ 10,000"
            />

            {/* DOWN PAYMENT */}

            <InputField
              label={data.DownPaymentLabel}
              value={downPayment}
              setValue={setDownPayment}
              placeholder="₹ 10,00,000"
            />

            {/* INTEREST */}

            <InputField
              label={data.InterestRateLabel}
              value={interestRate}
              setValue={setInterestRate}
              placeholder="8.5"
              suffix="%"
            />

            {/* TENURE */}

            <InputField
              label={data.LoanTenureLabel}
              value={loanTenure}
              setValue={setLoanTenure}
              placeholder="20"
              suffix="Years"
            />
          </div>

          {/* CALCULATE BUTTON */}

          <button
            type="button"
            onClick={handleCalculate}
            style={{
              width: "100%",
              marginTop: "30px",
              padding: "16px 20px",
              border: "none",
              borderRadius: "14px",
              background: "#18352a",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {data.CalculateButtonText}
            {" →"}
          </button>
        </div>

        {/* =====================================
            RESULT
        ===================================== */}

        {result && (
          <div
            style={{
              marginTop: "30px",
              background: "#18352a",
              color: "#ffffff",
              borderRadius: "28px",
              padding: "35px",
              boxShadow:
                "0 20px 50px rgba(24,53,42,0.18)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "30px",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  color: "#d8c98e",
                  fontSize: "14px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {data.HomeBudgetLabel}
              </p>

              <h2
                style={{
                  margin: 0,
                  fontSize: "42px",
                  fontWeight: 800,
                }}
              >
                {formatCurrency(
                  result.propertyBudget
                )}
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <ResultCard
                label={data.EstimatedLoanLabel}
                value={formatCurrency(
                  result.loanAmount
                )}
              />

              <ResultCard
                label={data.AffordableEMILabel}
                value={`${formatCurrency(
                  result.affordableEMI
                )} / month`}
              />

              <ResultCard
                label={data.RecommendedBudgetLabel}
                value={formatCurrency(
                  result.propertyBudget
                )}
              />
            </div>

            <p
              style={{
                marginTop: "25px",
                marginBottom: 0,
                textAlign: "center",
                color: "#d7d4ca",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              {data.ResultDescription}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

// ==========================================
// INPUT COMPONENT
// ==========================================

function InputField({
  label,
  value,
  setValue,
  placeholder,
  suffix,
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: "#18352a",
          fontSize: "14px",
          fontWeight: 700,
        }}
      >
        {label}
      </label>

      <div
        style={{
          position: "relative",
        }}
      >
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            setValue(
              e.target.value.replace(
                /[^\d.]/g,
                ""
              )
            );
          }}
          placeholder={placeholder}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "15px 18px",
            paddingRight: suffix
              ? "70px"
              : "18px",
            borderRadius: "13px",
            border: "1px solid #ddd7c9",
            background: "#faf9f5",
            color: "#18352a",
            fontSize: "15px",
            outline: "none",
          }}
        />

        {suffix && (
          <span
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform:
                "translateY(-50%)",
              color: "#77736a",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// ==========================================
// RESULT CARD
// ==========================================

function ResultCard({ label, value }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "17px",
        background:
          "rgba(255,255,255,0.08)",
        border:
          "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: "#c8c4b9",
          fontSize: "13px",
        }}
      >
        {label}
      </p>

      <strong
        style={{
          fontSize: "19px",
          color: "#ffffff",
        }}
      >
        {value}
      </strong>
    </div>
  );
}