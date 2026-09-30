"use client";

import { useEffect, useState } from "react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337/api";

export default function EMICalculatorPage() {
  const [emiData, setEmiData] = useState(null);

  const [propertyPrice, setPropertyPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");

  const [loanAmount, setLoanAmount] = useState(0);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH EMI DATA FROM STRAPI
  // =====================================================

  useEffect(() => {
    const fetchEMIData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${STRAPI_URL}/tool-setting?populate[EMICalculator]=*`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Strapi API Error: ${response.status}`
          );
        }

        const result = await response.json();

        console.log(
          "EMI Calculator Strapi Data:",
          result
        );

        const calculator =
          result?.data?.EMICalculator;

        if (!calculator) {
          throw new Error(
            "EMI Calculator data not found."
          );
        }

        setEmiData(calculator);
      } catch (err) {
        console.error(
          "EMI Calculator Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load EMI Calculator."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEMIData();
  }, []);

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // =====================================================
  // CALCULATE EMI
  // =====================================================

  const calculateEMI = () => {
    const price = Number(propertyPrice);
    const down = Number(downPayment);
    const rate = Number(interestRate);
    const years = Number(loanTenure);

    if (!price || price <= 0) {
      alert("Please enter property price.");
      return;
    }

    if (down < 0 || down >= price) {
      alert(
        "Down payment must be less than property price."
      );
      return;
    }

    if (!rate || rate <= 0) {
      alert("Please enter interest rate.");
      return;
    }

    if (!years || years <= 0) {
      alert("Please enter loan tenure.");
      return;
    }

    const principal = price - down;

    const monthlyRate = rate / 12 / 100;

    const numberOfMonths = years * 12;

    const emi =
      (principal *
        monthlyRate *
        Math.pow(
          1 + monthlyRate,
          numberOfMonths
        )) /
      (Math.pow(
        1 + monthlyRate,
        numberOfMonths
      ) - 1);

    const payment =
      emi * numberOfMonths;

    const interest =
      payment - principal;

    setLoanAmount(principal);
    setMonthlyEMI(emi);
    setTotalPayment(payment);
    setTotalInterest(interest);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#18352a] border-t-transparent" />

          <p className="mt-4 font-semibold text-[#18352a]">
            Loading EMI Calculator...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="min-h-screen bg-[#f8f6f0] flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-bold text-red-700">
            Unable to load EMI Calculator
          </h2>

          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-[#f8f6f0] px-4 py-10 md:px-8">

      <div className="mx-auto max-w-6xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e9eee8] px-4 py-2 text-sm font-semibold text-[#18352a]">
            🏠 Home Finance Tool
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#18352a] md:text-5xl">
            {emiData.Title}
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
            {emiData.Subtitle}
          </p>

        </div>

        {/* =================================================
            CALCULATOR CARD
        ================================================= */}

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">

          {/* LEFT SIDE */}

          <div className="rounded-3xl border border-[#e4dfcf] bg-white p-6 shadow-sm md:p-8">

            <div className="mb-7">

              <h2 className="text-2xl font-bold text-[#18352a]">
                {emiData.LoanSummaryTitle}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter your property and loan details
              </p>

            </div>

            <div className="space-y-6">

              {/* PROPERTY PRICE */}

              <div>

                <label
                  htmlFor="propertyPrice"
                  className="mb-2 block text-sm font-semibold text-[#18352a]"
                >
                  {emiData.PropertyPriceLabel}
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                    ₹
                  </span>

                  <input
                    id="propertyPrice"
                    type="number"
                    min="0"
                    value={propertyPrice}
                    onChange={(e) =>
                      setPropertyPrice(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 5000000"
                    className="w-full rounded-xl border border-[#ddd8ca] bg-[#fcfbf8] py-3.5 pl-10 pr-4 outline-none transition focus:border-[#18352a] focus:ring-2 focus:ring-[#18352a]/10"
                  />

                </div>

              </div>

              {/* DOWN PAYMENT */}

              <div>

                <label
                  htmlFor="downPayment"
                  className="mb-2 block text-sm font-semibold text-[#18352a]"
                >
                  {emiData.DownPaymentLabel}
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                    ₹
                  </span>

                  <input
                    id="downPayment"
                    type="number"
                    min="0"
                    value={downPayment}
                    onChange={(e) =>
                      setDownPayment(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 1000000"
                    className="w-full rounded-xl border border-[#ddd8ca] bg-[#fcfbf8] py-3.5 pl-10 pr-4 outline-none transition focus:border-[#18352a] focus:ring-2 focus:ring-[#18352a]/10"
                  />

                </div>

              </div>

              {/* LOAN AMOUNT */}

              <div>

                <label
                  className="mb-2 block text-sm font-semibold text-[#18352a]"
                >
                  {emiData.LoanAmountLabel}
                </label>

                <div className="rounded-xl border border-[#e4dfcf] bg-[#f3f1e8] px-4 py-3.5 font-bold text-[#18352a]">
                  {loanAmount
                    ? formatCurrency(loanAmount)
                    : "₹0"}
                </div>

              </div>

              {/* INTEREST RATE */}

              <div>

                <label
                  htmlFor="interestRate"
                  className="mb-2 block text-sm font-semibold text-[#18352a]"
                >
                  {emiData.InterestRateLabel}
                </label>

                <div className="relative">

                  <input
                    id="interestRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) =>
                      setInterestRate(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 8.5"
                    className="w-full rounded-xl border border-[#ddd8ca] bg-[#fcfbf8] px-4 py-3.5 pr-12 outline-none transition focus:border-[#18352a] focus:ring-2 focus:ring-[#18352a]/10"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                    %
                  </span>

                </div>

              </div>

              {/* TENURE */}

              <div>

                <label
                  htmlFor="loanTenure"
                  className="mb-2 block text-sm font-semibold text-[#18352a]"
                >
                  {emiData.LoanTenureLabel}
                </label>

                <div className="relative">

                  <input
                    id="loanTenure"
                    type="number"
                    min="1"
                    value={loanTenure}
                    onChange={(e) =>
                      setLoanTenure(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 20"
                    className="w-full rounded-xl border border-[#ddd8ca] bg-[#fcfbf8] px-4 py-3.5 pr-16 outline-none transition focus:border-[#18352a] focus:ring-2 focus:ring-[#18352a]/10"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                    Years
                  </span>

                </div>

              </div>

              {/* CALCULATE BUTTON */}

              <button
                type="button"
                onClick={calculateEMI}
                className="w-full rounded-xl bg-[#18352a] px-6 py-4 font-bold text-white transition hover:bg-[#244d3c] active:scale-[0.99]"
              >
                {emiData.CalculateButtonText} →
              </button>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE - RESULT
          ================================================= */}

          <div className="rounded-3xl bg-[#18352a] p-6 text-white shadow-sm md:p-8">

            <div className="mb-8">

              <p className="text-sm font-medium text-[#d9e5dc]">
                {emiData.MonthlyEMILabel}
              </p>

              <div className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                {monthlyEMI
                  ? formatCurrency(monthlyEMI)
                  : "₹0"}
              </div>

              <p className="mt-2 text-sm text-[#b8c9bf]">
                Estimated monthly payment
              </p>

            </div>

            <div className="space-y-4 border-t border-white/15 pt-6">

              {/* LOAN */}

              <div className="flex items-center justify-between gap-4">

                <span className="text-sm text-[#c8d5ce]">
                  {emiData.LoanAmountLabel}
                </span>

                <span className="font-semibold">
                  {formatCurrency(loanAmount)}
                </span>

              </div>

              {/* INTEREST */}

              <div className="flex items-center justify-between gap-4">

                <span className="text-sm text-[#c8d5ce]">
                  {emiData.TotalInterestLabel}
                </span>

                <span className="font-semibold">
                  {formatCurrency(totalInterest)}
                </span>

              </div>

              {/* TOTAL */}

              <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-4">

                <span className="text-sm text-[#c8d5ce]">
                  {emiData.TotalPaymentLabel}
                </span>

                <span className="text-lg font-bold">
                  {formatCurrency(totalPayment)}
                </span>

              </div>

            </div>

            {/* PRINCIPAL VS INTEREST */}

            <div className="mt-8 rounded-2xl bg-white/10 p-5">

              <p className="text-sm font-semibold text-white">
                {emiData.PrincipalInterestTitle}
              </p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">

                <div
                  className="h-full rounded-full bg-[#d9b36c] transition-all duration-500"
                  style={{
                    width:
                      totalPayment > 0
                        ? `${Math.min(
                            100,
                            (loanAmount /
                              totalPayment) *
                              100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

              <div className="mt-3 flex justify-between text-xs text-[#c8d5ce]">

                <span>
                  Principal
                </span>

                <span>
                  Interest
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}