
"use client";

import { useEffect, useState } from "react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337/api";

export default function PropertyCostPage() {
  const [data, setData] = useState(null);

  const [propertyPrice, setPropertyPrice] = useState("");
  const [stampDuty, setStampDuty] = useState("");
  const [registration, setRegistration] = useState("");
  const [gst, setGst] = useState("");
  const [otherCharges, setOtherCharges] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPropertyCostData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${STRAPI_URL}/tool-setting?populate[PropertyCostCalculator]=*`
        );

        if (!response.ok) {
          throw new Error(
            `Strapi API Error: ${response.status}`
          );
        }

        const json = await response.json();

        setData(json?.data?.PropertyCostCalculator || null);
      } catch (err) {
        console.error(
          "Property Cost Calculator Error:",
          err
        );

        setError(
          "Unable to load Property Cost Calculator."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPropertyCostData();
  }, []);

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  }

  function calculatePropertyCost() {
    const price = Number(propertyPrice) || 0;
    const stamp = Number(stampDuty) || 0;
    const registrationRate =
      Number(registration) || 0;
    const gstRate = Number(gst) || 0;
    const other = Number(otherCharges) || 0;

    if (price <= 0) {
      setResult(null);
      return;
    }

    const stampDutyAmount =
      (price * stamp) / 100;

    const registrationAmount =
      (price * registrationRate) / 100;

    const gstAmount =
      (price * gstRate) / 100;

    const totalCost =
      price +
      stampDutyAmount +
      registrationAmount +
      gstAmount +
      other;

    setResult({
      propertyPrice: price,
      stampDuty: stampDutyAmount,
      registration: registrationAmount,
      gst: gstAmount,
      otherCharges: other,
      totalCost,
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f3ed] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-white p-10 shadow-sm">
            <p className="text-center text-[#6f6257]">
              Loading Property Cost Calculator...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f3ed] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#3f342c]">
              Property Cost Calculator
            </h1>

            <p className="mt-3 text-red-600">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#f7f3ed] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#3f342c]">
              Property Cost Calculator
            </h1>

            <p className="mt-3 text-[#6f6257]">
              Property Cost Calculator data is not
              available in Strapi.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 text-center">

          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#a56b45]">
            <span className="h-px w-8 bg-[#a56b45]" />

            PROPERTY TOOL

            <span className="h-px w-8 bg-[#a56b45]" />
          </span>

          <h1 className="mt-4 text-3xl font-bold text-[#3f342c] sm:text-4xl">
            {data.Title ||
              "Property Cost Calculator"}
          </h1>

          {data.Subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#6f6257]">
              {data.Subtitle}
            </p>
          )}
        </div>

        {/* =========================
            CALCULATOR
        ========================= */}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">

          {/* INPUT CARD */}

          <section className="rounded-3xl border border-[#e8ddd1] bg-white p-6 shadow-[0_18px_50px_rgba(73,54,40,0.08)] sm:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#3f342c]">
                Calculate Your Property Cost
              </h2>

              <p className="mt-1 text-sm text-[#7b6d62]">
                Enter the property price and applicable
                charges.
              </p>
            </div>

            <div className="space-y-5">

              {/* PROPERTY PRICE */}

              <InputField
                label={
                  data.PropertyPriceLabel ||
                  "Property Price"
                }
                value={propertyPrice}
                onChange={setPropertyPrice}
                prefix="₹"
                placeholder="50,00,000"
              />

              {/* STAMP DUTY */}

              <InputField
                label={
                  data.StampDutyLabel ||
                  "Stamp Duty"
                }
                value={stampDuty}
                onChange={setStampDuty}
                suffix="%"
                placeholder="6"
              />

              {/* REGISTRATION */}

              <InputField
                label={
                  data.RegistrationLabel ||
                  "Registration Charges"
                }
                value={registration}
                onChange={setRegistration}
                suffix="%"
                placeholder="1"
              />

              {/* GST */}

              <InputField
                label={
                  data.GSTLabel ||
                  "GST"
                }
                value={gst}
                onChange={setGst}
                suffix="%"
                placeholder="0"
              />

              {/* OTHER CHARGES */}

              <InputField
                label={
                  data.OtherChargesLabel ||
                  "Other Charges"
                }
                value={otherCharges}
                onChange={setOtherCharges}
                prefix="₹"
                placeholder="50,000"
              />

              {/* CALCULATE */}

              <button
                type="button"
                onClick={calculatePropertyCost}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#a56b45] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#8e5837] active:scale-[0.99]"
              >
                {data.CalculateButtonText ||
                  "Calculate Total Cost"}

                <span aria-hidden="true">
                  →
                </span>
              </button>

            </div>
          </section>

          {/* RESULT CARD */}

          <section className="rounded-3xl bg-[#3f342c] p-6 text-white shadow-[0_18px_50px_rgba(63,52,44,0.18)] sm:p-8">

            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#d9b89c]">
                PROPERTY COST SUMMARY
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {data.TotalCostLabel ||
                  "Total Property Cost"}
              </h2>
            </div>

            {!result ? (
              <div className="flex min-h-[330px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#a56b45] text-2xl">
                    ₹
                  </div>

                  <p className="text-sm leading-6 text-[#d8ccc2]">
                    Enter your property details and
                    click Calculate to see the
                    estimated total cost.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">

                <ResultRow
                  label={
                    data.PropertyPriceResultLabel ||
                    "Property Price"
                  }
                  value={result.propertyPrice}
                />

                <ResultRow
                  label={
                    data.StampDutyResultLabel ||
                    "Stamp Duty"
                  }
                  value={result.stampDuty}
                />

                <ResultRow
                  label={
                    data.RegistrationResultLabel ||
                    "Registration Charges"
                  }
                  value={result.registration}
                />

                <ResultRow
                  label={
                    data.GSTResultLabel ||
                    "GST"
                  }
                  value={result.gst}
                />

                <ResultRow
                  label={
                    data.OtherChargesResultLabel ||
                    "Other Charges"
                  }
                  value={result.otherCharges}
                />

                <div className="my-5 h-px bg-white/15" />

                <div className="rounded-2xl bg-[#a56b45] p-5">
                  <p className="text-sm text-white/80">
                    {data.TotalCostLabel ||
                      "Total Property Cost"}
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {formatCurrency(
                      result.totalCost
                    )}
                  </p>
                </div>

                {data.ResultDescription && (
                  <p className="pt-4 text-sm leading-6 text-[#d8ccc2]">
                    {data.ResultDescription}
                  </p>
                )}

              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}

/* =========================================
   INPUT FIELD
========================================= */

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#4d4037]">
        {label}
      </label>

      <div className="flex overflow-hidden rounded-2xl border border-[#ded2c6] bg-[#fcfaf7] transition focus-within:border-[#a56b45] focus-within:ring-2 focus-within:ring-[#a56b45]/10">

        {prefix && (
          <span className="flex items-center px-4 text-sm font-semibold text-[#76685d]">
            {prefix}
          </span>
        )}

        <input
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-3.5 text-base font-medium text-[#3f342c] outline-none placeholder:text-[#b5a99f]"
        />

        {suffix && (
          <span className="flex items-center px-4 text-sm font-semibold text-[#76685d]">
            {suffix}
          </span>
        )}

      </div>
    </div>
  );
}

/* =========================================
   RESULT ROW
========================================= */

function ResultRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3">
      <span className="text-sm text-[#d8ccc2]">
        {label}
      </span>

      <span className="text-sm font-semibold text-white">
        {new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(value || 0)}
      </span>
    </div>
  );
}
