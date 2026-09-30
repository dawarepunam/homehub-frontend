// "use client";

// import { useEffect, useState } from "react";

// const STRAPI_URL =
//   process.env.NEXT_PUBLIC_STRAPI_URL ||
//   "http://localhost:1337/api";

// export default function HomeLoanCalculatorPage() {
//   const [data, setData] = useState(null);

//   const [loanAmount, setLoanAmount] = useState(3000000);
//   const [interestRate, setInterestRate] = useState(8.5);
//   const [loanTenure, setLoanTenure] = useState(20);

//   const [result, setResult] = useState({
//     emi: 0,
//     totalInterest: 0,
//     totalPayment: 0,
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchHomeLoanData() {
//       try {
//         const response = await fetch(
//           `${STRAPI_URL}/tool-setting?populate[HomeLoanCalculator]=*`,
//           {
//             cache: "no-store",
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Strapi API Error: ${response.status}`
//           );
//         }

//         const json = await response.json();

//         setData(json?.data?.HomeLoanCalculator || null);
//       } catch (error) {
//         console.error(
//           "Home Loan Calculator Error:",
//           error
//         );

//         setError(
//           "Unable to load Home Loan Calculator data."
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchHomeLoanData();
//   }, []);

//   const calculateEMI = () => {
//     const principal = Number(loanAmount);
//     const monthlyRate =
//       Number(interestRate) / 12 / 100;
//     const months = Number(loanTenure) * 12;

//     if (
//       !principal ||
//       !monthlyRate ||
//       !months
//     ) {
//       return;
//     }

//     const emi =
//       (principal *
//         monthlyRate *
//         Math.pow(
//           1 + monthlyRate,
//           months
//         )) /
//       (Math.pow(
//         1 + monthlyRate,
//         months
//       ) - 1);

//     const totalPayment = emi * months;

//     const totalInterest =
//       totalPayment - principal;

//     setResult({
//       emi: Math.round(emi),
//       totalInterest:
//         Math.round(totalInterest),
//       totalPayment:
//         Math.round(totalPayment),
//     });
//   };

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value || 0);
//   };

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-[#f7f3ed] flex items-center justify-center">
//         <p className="text-lg text-[#3d3832]">
//           Loading Home Loan Calculator...
//         </p>
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="min-h-screen bg-[#f7f3ed] flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 font-medium">
//             {error}
//           </p>

//           <p className="mt-2 text-sm text-gray-600">
//             Check your Strapi API and make sure
//             HomeLoanCalculator is published.
//           </p>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-[#f7f3ed] py-12 px-5">
//       <div className="max-w-6xl mx-auto">

//         {/* HEADER */}

//         <div className="text-center mb-10">

//           <span className="inline-block text-sm font-semibold tracking-[0.2em] uppercase text-[#a66a3f] mb-3">
//             Home Loan Tool
//           </span>

//           <h1 className="text-4xl md:text-5xl font-bold text-[#302b26]">
//             {data?.Title ||
//               "Home Loan Calculator"}
//           </h1>

//           <p className="max-w-2xl mx-auto mt-4 text-[#6f665e] text-lg">
//             {data?.Subtitle ||
//               "Calculate your monthly home loan EMI and plan your home purchase."}
//           </p>

//         </div>

//         {/* MAIN CARD */}

//         <div className="grid lg:grid-cols-2 gap-8">

//           {/* INPUT CARD */}

//           <div className="bg-white rounded-3xl p-7 md:p-9 shadow-[0_15px_50px_rgba(60,45,30,0.08)] border border-[#e8dfd5]">

//             <h2 className="text-2xl font-bold text-[#302b26] mb-7">
//               Loan Details
//             </h2>

//             {/* LOAN AMOUNT */}

//             <div className="mb-6">

//               <label className="block text-sm font-semibold text-[#4c443d] mb-2">
//                 {data?.LoanAmountLabel ||
//                   "Loan Amount"}
//               </label>

//               <div className="relative">

//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b8177] font-medium">
//                   ₹
//                 </span>

//                 <input
//                   type="number"
//                   value={loanAmount}
//                   onChange={(e) =>
//                     setLoanAmount(e.target.value)
//                   }
//                   className="w-full rounded-xl border border-[#dcd2c7] bg-[#fbf9f6] py-3.5 pl-9 pr-4 text-[#302b26] outline-none focus:border-[#b5794d]"
//                   placeholder="3000000"
//                 />

//               </div>

//             </div>

//             {/* INTEREST RATE */}

//             <div className="mb-6">

//               <label className="block text-sm font-semibold text-[#4c443d] mb-2">
//                 {data?.InterestRateLabel ||
//                   "Interest Rate"}
//               </label>

//               <div className="relative">

//                 <input
//                   type="number"
//                   step="0.1"
//                   value={interestRate}
//                   onChange={(e) =>
//                     setInterestRate(e.target.value)
//                   }
//                   className="w-full rounded-xl border border-[#dcd2c7] bg-[#fbf9f6] py-3.5 px-4 pr-10 text-[#302b26] outline-none focus:border-[#b5794d]"
//                   placeholder="8.5"
//                 />

//                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8177] font-medium">
//                   %
//                 </span>

//               </div>

//             </div>

//             {/* TENURE */}

//             <div className="mb-8">

//               <label className="block text-sm font-semibold text-[#4c443d] mb-2">
//                 {data?.LoanTenureLabel ||
//                   "Loan Tenure"}
//               </label>

//               <div className="relative">

//                 <input
//                   type="number"
//                   value={loanTenure}
//                   onChange={(e) =>
//                     setLoanTenure(e.target.value)
//                   }
//                   className="w-full rounded-xl border border-[#dcd2c7] bg-[#fbf9f6] py-3.5 px-4 pr-16 text-[#302b26] outline-none focus:border-[#b5794d]"
//                   placeholder="20"
//                 />

//                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8177] font-medium">
//                   Years
//                 </span>

//               </div>

//             </div>

//             {/* BUTTON */}

//             <button
//               onClick={calculateEMI}
//               className="w-full rounded-xl bg-[#a66a3f] hover:bg-[#8e5630] text-white font-semibold py-4 transition-all duration-200 shadow-lg"
//             >
//               {data?.CalculateButtonText ||
//                 "Calculate Home Loan EMI"}
//             </button>

//           </div>

//           {/* RESULT CARD */}

//           <div className="rounded-3xl p-7 md:p-9 bg-[#302b26] text-white shadow-[0_15px_50px_rgba(40,30,20,0.15)]">

//             <p className="text-sm uppercase tracking-[0.15em] text-[#d7b18f] font-semibold mb-3">
//               {data?.MonthlyEMILabel ||
//                 "Monthly EMI"}
//             </p>

//             <div className="text-4xl md:text-5xl font-bold mb-8">
//               {formatCurrency(result.emi)}
//               <span className="text-base font-normal text-[#c7bdb4]">
//                 {" "}
//                 / month
//               </span>
//             </div>

//             {/* RESULT ITEMS */}

//             <div className="space-y-4">

//               <div className="flex justify-between items-center border-b border-[#5a5048] pb-4">

//                 <span className="text-[#d1c7be]">
//                   {data?.TotalInterestLabel ||
//                     "Total Interest"}
//                 </span>

//                 <span className="font-semibold">
//                   {formatCurrency(
//                     result.totalInterest
//                   )}
//                 </span>

//               </div>

//               <div className="flex justify-between items-center border-b border-[#5a5048] pb-4">

//                 <span className="text-[#d1c7be]">
//                   {data?.TotalPaymentLabel ||
//                     "Total Payment"}
//                 </span>

//                 <span className="font-semibold">
//                   {formatCurrency(
//                     result.totalPayment
//                   )}
//                 </span>

//               </div>

//               <div className="flex justify-between items-center">

//                 <span className="text-[#d1c7be]">
//                   Loan Amount
//                 </span>

//                 <span className="font-semibold">
//                   {formatCurrency(
//                     loanAmount
//                   )}
//                 </span>

//               </div>

//             </div>

//             {/* DESCRIPTION */}

//             <div className="mt-8 rounded-2xl bg-[#403832] p-5">

//               <p className="text-sm leading-6 text-[#d8cec5]">
//                 {data?.ResultDescription ||
//                   "Get an estimated monthly EMI based on your loan amount, interest rate and tenure."}
//               </p>

//             </div>

//           </div>

//         </div>

//       </div>
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337/api";

export default function HomeLoanCalculatorPage() {
  // =====================================================
  // STRAPI DATA
  // =====================================================

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // USER INPUTS
  // IMPORTANT:
  // No default values are shown in the form.
  // =====================================================

  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [existingEMI, setExistingEMI] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");

  // =====================================================
  // CALCULATION RESULT
  // =====================================================

  const [result, setResult] = useState({
    calculated: false,
    eligibleLoan: 0,
    maximumEMI: 0,
    propertyBudget: 0,
  });

  // =====================================================
  // FETCH HOME LOAN ELIGIBILITY DATA FROM STRAPI
  // =====================================================

  useEffect(() => {
    async function fetchHomeLoanData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${STRAPI_URL}/tool-setting?populate=*`,
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

        console.log(
          "ToolSetting API Response:",
          json
        );

        const toolSetting = json?.data;

        // -------------------------------------------------
        // First try exact Strapi component name
        // -------------------------------------------------

        let homeLoanData =
          toolSetting?.HomeLoanEligibilityCalculator ||
          null;

        // -------------------------------------------------
        // Fallback:
        // Find component using Title
        // -------------------------------------------------

        if (!homeLoanData && toolSetting) {
          const values = Object.values(toolSetting);

          homeLoanData = values.find((item) => {
            if (
              !item ||
              typeof item !== "object" ||
              Array.isArray(item)
            ) {
              return false;
            }

            const title = String(item?.Title || "")
              .trim()
              .toLowerCase();

            return title.includes(
              "home loan eligibility calculator"
            );
          });
        }

        // -------------------------------------------------
        // No data found
        // -------------------------------------------------

        if (!homeLoanData) {
          console.error(
            "Home Loan Eligibility Calculator data not found:",
            toolSetting
          );

          throw new Error(
            "Home Loan Eligibility Calculator data was not found in Strapi."
          );
        }

        console.log(
          "Home Loan Eligibility Calculator Data:",
          homeLoanData
        );

        setData(homeLoanData);
      } catch (err) {
        console.error(
          "Home Loan Calculator Error:",
          err
        );

        setError(
          "Unable to load Home Loan Calculator data."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHomeLoanData();
  }, []);

  // =====================================================
  // CALCULATE HOME LOAN ELIGIBILITY
  // =====================================================

  const calculateEligibility = () => {
    const income = Number(monthlyIncome);
    const currentEMI = Number(existingEMI);
    const downPaymentAmount = Number(downPayment);
    const annualRate = Number(interestRate);
    const years = Number(loanTenure);

    // -------------------------------------------------
    // Basic validation
    // -------------------------------------------------

    if (
      !income ||
      income <= 0 ||
      currentEMI < 0 ||
      !annualRate ||
      annualRate <= 0 ||
      !years ||
      years <= 0
    ) {
      alert(
        "Please enter valid Monthly Income, Existing EMI, Interest Rate and Loan Tenure."
      );

      return;
    }

    // -------------------------------------------------
    // Maximum EMI
    //
    // We consider 50% of monthly income as maximum
    // affordable EMI.
    //
    // Example:
    // Income = ₹60,000
    // 50% = ₹30,000
    // Existing EMI = ₹5,000
    //
    // Maximum Affordable EMI = ₹25,000
    // -------------------------------------------------

    const maximumPossibleEMI = income * 0.5;

    const maximumEMI = Math.max(
      maximumPossibleEMI - currentEMI,
      0
    );

    // -------------------------------------------------
    // Loan eligibility calculation
    // -------------------------------------------------

    let eligibleLoan = 0;

    if (maximumEMI > 0) {
      const monthlyRate =
        annualRate / 12 / 100;

      const months = years * 12;

      const factor = Math.pow(
        1 + monthlyRate,
        months
      );

      eligibleLoan =
        (maximumEMI * (factor - 1)) /
        (monthlyRate * factor);
    }

    // -------------------------------------------------
    // Estimated property budget
    //
    // Eligible Loan + Down Payment / Savings
    // -------------------------------------------------

    const propertyBudget =
      eligibleLoan +
      (downPaymentAmount || 0);

    // -------------------------------------------------
    // Save result
    // -------------------------------------------------

    setResult({
      calculated: true,
      eligibleLoan: Math.round(eligibleLoan),
      maximumEMI: Math.round(maximumEMI),
      propertyBudget: Math.round(propertyBudget),
    });
  };

  // =====================================================
  // CURRENCY FORMAT
  // =====================================================

  const formatCurrency = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f3ed] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#d8c4b2] border-t-[#a66a3f] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-lg text-[#3d3832]">
            Loading Home Loan Calculator...
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
      <main className="min-h-screen bg-[#f7f3ed] flex items-center justify-center px-5">
        <div className="text-center max-w-lg">
          <div className="text-5xl mb-5">
            ⚠️
          </div>

          <h2 className="text-xl font-semibold text-[#302b26]">
            {error}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#6f665e]">
            Please make sure the Home Loan Eligibility
            Calculator is saved and published in Strapi.
          </p>

          <p className="mt-3 text-xs text-[#8b8177]">
            API:
            {STRAPI_URL}/tool-setting?populate=*
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-[#f7f3ed] py-12 px-5">
      <div className="max-w-6xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center mb-10">
          <span className="inline-block text-sm font-semibold tracking-[0.2em] uppercase text-[#a66a3f] mb-3">
            Home Loan Tool
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-[#302b26]">
            {data?.Title ||
              "Home Loan Eligibility Calculator"}
          </h1>

          <p className="max-w-2xl mx-auto mt-4 text-[#6f665e] text-lg">
            {data?.Subtitle ||
              "Check how much home loan you may be eligible for based on your income."}
          </p>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid lg:grid-cols-2 gap-8">

          {/* =================================================
              INPUT CARD
          ================================================= */}

          <div className="bg-white rounded-3xl p-7 md:p-9 shadow-[0_15px_50px_rgba(60,45,30,0.08)] border border-[#e8dfd5]">

            <h2 className="text-2xl font-bold text-[#302b26] mb-7">
              Loan Details
            </h2>

            {/* =============================================
                MONTHLY INCOME
            ============================================= */}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#4c443d] mb-2">
                {data?.MonthlyIncomeLabel ||
                  "Monthly Income"}
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b8177] font-medium">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={monthlyIncome}
                  onChange={(e) =>
                    setMonthlyIncome(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#dcd2c7] bg-[#fbf9f6] py-3.5 pl-9 pr-4 text-[#302b26] outline-none focus:border-[#b5794d] focus:ring-2 focus:ring-[#b5794d]/10"
                  placeholder="Enter monthly income"
                />
              </div>
            </div>

            {/* =============================================
                EXISTING EMI
            ============================================= */}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#4c443d] mb-2">
                {data?.ExistingEMILabel ||
                  "Existing Monthly EMI"}
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b8177] font-medium">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={existingEMI}
                  onChange={(e) =>
                    setExistingEMI(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#dcd2c7] bg-[#fbf9f6] py-3.5 pl-9 pr-4 text-[#302b26] outline-none focus:border-[#b5794d] focus:ring-2 focus:ring-[#b5794d]/10"
                  placeholder="Enter existing EMI"
                />
              </div>
            </div>

            {/* =============================================
                DOWN PAYMENT
            ============================================= */}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#4c443d] mb-2">
                {data?.DownPaymentLabel ||
                  "Down Payment / Savings"}
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b8177] font-medium">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={downPayment}
                  onChange={(e) =>
                    setDownPayment(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#dcd2c7] bg-[#fbf9f6] py-3.5 pl-9 pr-4 text-[#302b26] outline-none focus:border-[#b5794d] focus:ring-2 focus:ring-[#b5794d]/10"
                  placeholder="Enter down payment / savings"
                />
              </div>
            </div>

            {/* =============================================
                INTEREST RATE
            ============================================= */}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#4c443d] mb-2">
                {data?.InterestRateLabel ||
                  "Interest Rate"}
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) =>
                    setInterestRate(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#dcd2c7] bg-[#fbf9f6] py-3.5 px-4 pr-10 text-[#302b26] outline-none focus:border-[#b5794d] focus:ring-2 focus:ring-[#b5794d]/10"
                  placeholder="Enter interest rate"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8177] font-medium">
                  %
                </span>
              </div>
            </div>

            {/* =============================================
                LOAN TENURE
            ============================================= */}

            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#4c443d] mb-2">
                {data?.LoanTenureLabel ||
                  "Loan Tenure"}
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={loanTenure}
                  onChange={(e) =>
                    setLoanTenure(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#dcd2c7] bg-[#fbf9f6] py-3.5 px-4 pr-16 text-[#302b26] outline-none focus:border-[#b5794d] focus:ring-2 focus:ring-[#b5794d]/10"
                  placeholder="Enter loan tenure"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b8177] font-medium">
                  Years
                </span>
              </div>
            </div>

            {/* =============================================
                CALCULATE BUTTON
            ============================================= */}

            <button
              type="button"
              onClick={calculateEligibility}
              className="w-full rounded-xl bg-[#a66a3f] hover:bg-[#8e5630] text-white font-semibold py-4 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {data?.CalculateButtonText ||
                "Check Eligibility"}
            </button>
          </div>

          {/* =================================================
              RESULT CARD
          ================================================= */}

          <div className="rounded-3xl p-7 md:p-9 bg-[#302b26] text-white shadow-[0_15px_50px_rgba(40,30,20,0.15)]">

            {/* =============================================
                ELIGIBLE LOAN
            ============================================= */}

            <p className="text-sm uppercase tracking-[0.15em] text-[#d7b18f] font-semibold mb-3">
              {data?.EligibleLoanLabel ||
                "Eligible Loan Amount"}
            </p>

            <div className="text-4xl md:text-5xl font-bold mb-8">
              {result.calculated
                ? formatCurrency(result.eligibleLoan)
                : "—"}
            </div>

            {/* =============================================
                RESULT ITEMS
            ============================================= */}

            <div className="space-y-4">

              {/* MAXIMUM EMI */}

              <div className="flex justify-between items-center border-b border-[#5a5048] pb-4 gap-5">
                <span className="text-[#d1c7be]">
                  {data?.MaximumEMILabel ||
                    "Maximum Affordable EMI"}
                </span>

                <span className="font-semibold text-right">
                  {result.calculated
                    ? formatCurrency(result.maximumEMI)
                    : "—"}
                </span>
              </div>

              {/* EXISTING EMI */}

              <div className="flex justify-between items-center border-b border-[#5a5048] pb-4 gap-5">
                <span className="text-[#d1c7be]">
                  {data?.ExistingEMILabel ||
                    "Existing Monthly EMI"}
                </span>

                <span className="font-semibold text-right">
                  {existingEMI
                    ? formatCurrency(existingEMI)
                    : "—"}
                </span>
              </div>

              {/* PROPERTY BUDGET */}

              <div className="flex justify-between items-center border-b border-[#5a5048] pb-4 gap-5">
                <span className="text-[#d1c7be]">
                  {data?.PropertyBudgetLabel ||
                    "Estimated Property Budget"}
                </span>

                <span className="font-semibold text-right">
                  {result.calculated
                    ? formatCurrency(result.propertyBudget)
                    : "—"}
                </span>
              </div>

              {/* DOWN PAYMENT */}

              <div className="flex justify-between items-center border-b border-[#5a5048] pb-4 gap-5">
                <span className="text-[#d1c7be]">
                  {data?.DownPaymentLabel ||
                    "Down Payment / Savings"}
                </span>

                <span className="font-semibold text-right">
                  {downPayment
                    ? formatCurrency(downPayment)
                    : "—"}
                </span>
              </div>

              {/* INTEREST RATE */}

              <div className="flex justify-between items-center border-b border-[#5a5048] pb-4 gap-5">
                <span className="text-[#d1c7be]">
                  {data?.InterestRateLabel ||
                    "Interest Rate"}
                </span>

                <span className="font-semibold text-right">
                  {interestRate
                    ? `${interestRate}%`
                    : "—"}
                </span>
              </div>

              {/* LOAN TENURE */}

              <div className="flex justify-between items-center gap-5">
                <span className="text-[#d1c7be]">
                  {data?.LoanTenureLabel ||
                    "Loan Tenure"}
                </span>

                <span className="font-semibold text-right">
                  {loanTenure
                    ? `${loanTenure} Years`
                    : "—"}
                </span>
              </div>
            </div>

            {/* =============================================
                DESCRIPTION
            ============================================= */}

            <div className="mt-8 rounded-2xl bg-[#403832] p-5">
              <p className="text-sm leading-6 text-[#d8cec5]">
                {data?.ResultDescription ||
                  "This is an estimated loan eligibility based on the information provided."}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            SMALL DISCLAIMER
        ================================================= */}

        <p className="text-center text-xs text-[#8b8177] mt-8 max-w-3xl mx-auto leading-5">
          This calculator provides an estimated eligibility
          amount for informational purposes only. Actual
          eligibility may vary based on lender policies,
          credit profile, income and other financial factors.
        </p>
      </div>
    </main>
  );
}
