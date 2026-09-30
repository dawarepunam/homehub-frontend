"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Calculator,
  RotateCcw,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  Home,
  Percent,
  TrendingUp,
  Info,
} from "lucide-react";

/* ─────────────────────────────────────────────
   COLOUR TOKENS  (HomeHub Buyer design system)
───────────────────────────────────────────────*/
const C = {
  forest: "#0D3326",
  forestMid: "#123F32",
  forestLight: "#226E58",
  gold: "#D7AE62",
  goldDark: "#C99A40",
  cream: "#F5F3EE",
  creamDark: "#EDE8DF",
  parchment: "#F3E7D2",
  text: "#1A2C26",
  muted: "#6B7280",
  white: "#ffffff",
  error: "#DC2626",
  errorBg: "#FEF2F2",
  principalColor: "#0D3326",
  interestColor: "#D7AE62",
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────*/
function formatINR(value) {
  if (!value && value !== 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function parseNumber(val) {
  const n = parseFloat(String(val).replace(/,/g, ""));
  return isNaN(n) ? null : n;
}

function calcEMI(principal, annualRate, tenureYears) {
  if (!principal || !annualRate || !tenureYears) return null;
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return emi;
}

function buildAmortization(principal, annualRate, tenureYears) {
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  const emi = calcEMI(principal, annualRate, tenureYears);
  if (!emi) return [];

  let balance = principal;
  const schedule = [];

  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    if (balance < 0) balance = 0;

    const year = Math.ceil(i / 12);
    if (!schedule[year - 1]) {
      schedule[year - 1] = { year, principalPaid: 0, interestPaid: 0, balance };
    }
    schedule[year - 1].principalPaid += principalPaid;
    schedule[year - 1].interestPaid += interest;
    schedule[year - 1].balance = balance;
  }

  return schedule;
}

/* ─────────────────────────────────────────────
   SVG DONUT CHART
───────────────────────────────────────────────*/
function DonutChart({ principalPct, interestPct }) {
  const r = 58;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;
  const principalDash = (principalPct / 100) * circumference;
  const interestDash = (interestPct / 100) * circumference;
  const gap = 2;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.creamDark} strokeWidth="18" />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={C.principalColor} strokeWidth="18"
        strokeDasharray={`${principalDash - gap} ${circumference - principalDash + gap}`}
        strokeDashoffset={circumference / 4} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={C.interestColor} strokeWidth="18"
        strokeDasharray={`${interestDash - gap} ${circumference - interestDash + gap}`}
        strokeDashoffset={circumference / 4 - principalDash + gap} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill={C.muted}>Split</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.forest}>{principalPct}%</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   INPUT FIELD
───────────────────────────────────────────────*/
function InputField({ id, label, value, onChange, prefix, suffix, hint, min, max, step }) {
  return (
    <div className="emi-field">
      <label htmlFor={id} className="emi-label">
        {label}{hint && <span className="emi-hint"> {hint}</span>}
      </label>
      <div className="emi-input-wrap">
        {prefix && <span className="emi-prefix">{prefix}</span>}
        <input
          id={id} type="number" value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min} max={max} step={step}
          className="emi-input" autoComplete="off"
        />
        {suffix && <span className="emi-suffix">{suffix}</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VALIDATION MODAL
───────────────────────────────────────────────*/
function ValidationModal({ errors, onClose }) {
  return (
    <div className="emi-modal-overlay" onClick={onClose}>
      <div className="emi-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="emi-modal-title">
        <div className="emi-modal-icon-wrap"><AlertTriangle size={32} color={C.gold} /></div>
        <h2 id="emi-modal-title" className="emi-modal-title">Please check your input</h2>
        <ul className="emi-modal-list">
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
        <button id="emi-modal-close" className="emi-modal-btn" onClick={onClose} type="button">Got it</button>
        <button className="emi-modal-x" onClick={onClose} type="button" aria-label="Close"><X size={16} /></button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESULT ROW
───────────────────────────────────────────────*/
function ResultRow({ label, value, highlight }) {
  return (
    <div className={`emi-result-row${highlight ? " emi-result-row--highlight" : ""}`}>
      <span className="emi-result-label">{label}</span>
      <span className="emi-result-value">{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CSS (scoped via class prefix "emi-")
───────────────────────────────────────────────*/
const STYLES = `
  .emi-page { min-height: 100vh; background: #F5F3EE; font-family: "Inter", system-ui, sans-serif; }

  /* Breadcrumb */
  .emi-breadcrumb { background: #0D3326; border-bottom: 1px solid rgba(215,174,98,0.2); }
  .emi-breadcrumb-inner { max-width: 1280px; margin: 0 auto; padding: 10px 24px; display: flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(243,231,210,0.7); }
  .emi-breadcrumb a { color: rgba(243,231,210,0.7); text-decoration: none; transition: color 0.2s; }
  .emi-breadcrumb a:hover { color: #D7AE62; }
  .emi-breadcrumb-sep { color: rgba(215,174,98,0.4); }
  .emi-breadcrumb-current { color: #D7AE62; font-weight: 600; }

  /* Hero */
  .emi-hero { background: linear-gradient(135deg, #0D3326 0%, #123F32 100%); padding: 36px 24px 32px; border-bottom: 1px solid rgba(215,174,98,0.15); }
  .emi-hero-inner { max-width: 1280px; margin: 0 auto; }
  .emi-hero h1 { font-size: clamp(24px, 4vw, 34px); font-weight: 800; color: #F3E7D2; margin: 0 0 6px; letter-spacing: -0.5px; }
  .emi-hero p { font-size: 14px; color: rgba(243,231,210,0.65); margin: 0; }
  .emi-hero-flex { display: flex; align-items: center; gap: 14px; }
  .emi-hero-icon-box { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #D7AE62, #C99A40); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

  /* Grid */
  .emi-grid { max-width: 1280px; margin: 0 auto; padding: 32px 24px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
  @media (max-width: 860px) { .emi-grid { grid-template-columns: 1fr; } }

  /* Card */
  .emi-card { background: #ffffff; border-radius: 20px; border: 1px solid #EDE8DF; box-shadow: 0 4px 24px rgba(13,51,38,0.06); overflow: hidden; }
  .emi-card-header { background: linear-gradient(135deg, #F5F3EE 0%, #EDE8DF 100%); padding: 18px 24px; border-bottom: 1px solid #EDE8DF; display: flex; align-items: center; gap: 10px; }
  .emi-card-header-icon { width: 36px; height: 36px; border-radius: 10px; background: #0D3326; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .emi-card-title { font-size: 16px; font-weight: 700; color: #0D3326; margin: 0; }
  .emi-card-body { padding: 24px; }

  /* Fields */
  .emi-field { margin-bottom: 18px; }
  .emi-label { display: block; font-size: 12.5px; font-weight: 600; color: #1A2C26; margin-bottom: 6px; letter-spacing: 0.3px; }
  .emi-label::after { content: " *"; color: #DC2626; }
  .emi-hint { font-weight: 400; color: #6B7280; font-size: 11.5px; }
  .emi-input-wrap { display: flex; align-items: center; border: 1.5px solid #EDE8DF; border-radius: 12px; background: #F5F3EE; transition: border-color 0.2s, box-shadow 0.2s; overflow: hidden; }
  .emi-input-wrap:focus-within { border-color: #D7AE62; box-shadow: 0 0 0 3px rgba(215,174,98,0.12); background: #ffffff; }
  .emi-prefix, .emi-suffix { padding: 0 12px; font-size: 14px; font-weight: 600; color: #226E58; background: transparent; user-select: none; white-space: nowrap; }
  .emi-input { flex: 1; border: none; outline: none; padding: 11px 12px 11px 4px; font-size: 15px; font-weight: 600; color: #1A2C26; background: transparent; min-width: 0; }
  .emi-input::-webkit-inner-spin-button, .emi-input::-webkit-outer-spin-button { -webkit-appearance: none; }
  .emi-input[type=number] { -moz-appearance: textfield; }

  /* Loan amount display */
  .emi-loan-field-label { display: block; font-size: 12.5px; font-weight: 600; color: #1A2C26; margin-bottom: 6px; letter-spacing: 0.3px; }
  .emi-loan-display { display: flex; align-items: center; justify-content: space-between; border: 1.5px solid #EDE8DF; border-radius: 12px; background: linear-gradient(135deg, #F0EDE7 0%, #EDE8DF 100%); padding: 11px 16px; }
  .emi-loan-display-label { font-size: 13px; color: #6B7280; font-weight: 500; }
  .emi-loan-display-value { font-size: 16px; font-weight: 800; color: #0D3326; display: flex; align-items: center; gap: 8px; }
  .emi-loan-badge { font-size: 10px; font-weight: 600; background: rgba(13,51,38,0.1); color: #226E58; border-radius: 6px; padding: 2px 7px; }

  /* Select */
  .emi-select-wrap { border: 1.5px solid #EDE8DF; border-radius: 12px; background: #F5F3EE; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
  .emi-select-wrap:focus-within { border-color: #D7AE62; box-shadow: 0 0 0 3px rgba(215,174,98,0.12); background: #ffffff; }
  .emi-select { width: 100%; border: none; outline: none; padding: 11px 16px; font-size: 15px; font-weight: 600; color: #1A2C26; background: transparent; appearance: none; cursor: pointer; }

  /* Buttons */
  .emi-btn-row { display: flex; gap: 12px; margin-top: 24px; }
  .emi-btn-calc { flex: 1; padding: 13px 20px; border-radius: 12px; border: none; background: linear-gradient(135deg, #0D3326, #123F32); color: #F3E7D2; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.25s; box-shadow: 0 4px 14px rgba(13,51,38,0.25); }
  .emi-btn-calc:hover { background: linear-gradient(135deg, #0A2A1E, #0D3326); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(13,51,38,0.35); }
  .emi-btn-reset { padding: 13px 18px; border-radius: 12px; border: 1.5px solid #EDE8DF; background: #ffffff; color: #6B7280; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .emi-btn-reset:hover { border-color: #DC2626; color: #DC2626; background: #FEF2F2; }

  /* Result card */
  .emi-result-card { background: linear-gradient(135deg, #0D3326 0%, #123F32 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px rgba(13,51,38,0.20); }
  .emi-emi-box { padding: 28px 24px 20px; border-bottom: 1px solid rgba(215,174,98,0.15); text-align: center; }
  .emi-emi-label { font-size: 12px; font-weight: 600; color: rgba(215,174,98,0.75); letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 8px; }
  .emi-emi-amount { font-size: clamp(28px, 5vw, 38px); font-weight: 900; color: #F3E7D2; letter-spacing: -1px; line-height: 1.1; }
  .emi-emi-amount .emi-per-month { font-size: 0.55em; font-weight: 600; color: rgba(215,174,98,0.75); vertical-align: middle; }
  .emi-emi-icon { width: 64px; height: 64px; border-radius: 18px; background: rgba(215,174,98,0.12); border: 1px solid rgba(215,174,98,0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }

  /* Result rows */
  .emi-summary-block { padding: 20px 24px; }
  .emi-result-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(215,174,98,0.08); }
  .emi-result-row:last-child { border-bottom: none; }
  .emi-result-label { font-size: 13px; color: rgba(243,231,210,0.65); font-weight: 500; }
  .emi-result-value { font-size: 14px; font-weight: 700; color: #F3E7D2; }
  .emi-result-row--highlight .emi-result-label { color: rgba(215,174,98,0.85); font-weight: 600; }
  .emi-result-row--highlight .emi-result-value { color: #D7AE62; font-size: 15px; }

  /* Breakdown card */
  .emi-breakdown-inner { padding: 20px 24px; }
  .emi-breakdown-chart-row { display: flex; align-items: center; gap: 20px; }
  .emi-legend { flex: 1; display: flex; flex-direction: column; gap: 10px; }
  .emi-legend-item { display: flex; align-items: center; gap: 10px; }
  .emi-legend-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
  .emi-legend-pct { font-size: 20px; font-weight: 800; line-height: 1.1; }
  .emi-legend-lbl { font-size: 11px; color: #6B7280; font-weight: 500; margin-top: 2px; }
  .emi-bar-wrap { height: 10px; border-radius: 99px; background: #EDE8DF; overflow: hidden; margin-top: 16px; }
  .emi-bar-principal { height: 100%; background: #0D3326; border-radius: 99px; transition: width 0.6s ease; }

  /* Tip */
  .emi-tip { margin: 0 24px 24px; padding: 12px 16px; border-radius: 12px; background: rgba(215,174,98,0.08); border: 1px solid rgba(215,174,98,0.2); display: flex; gap: 10px; align-items: flex-start; font-size: 12.5px; color: rgba(243,231,210,0.7); }

  /* Empty state */
  .emi-empty { min-height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }
  .emi-empty-icon { width: 72px; height: 72px; border-radius: 20px; background: rgba(215,174,98,0.08); border: 1px solid rgba(215,174,98,0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
  .emi-empty-title { font-size: 17px; font-weight: 700; color: #F3E7D2; margin-bottom: 6px; }
  .emi-empty-sub { font-size: 13px; color: rgba(243,231,210,0.5); max-width: 220px; }

  /* Amortization */
  .emi-amort { padding: 0 24px 24px; }
  .emi-amort-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; background: #F5F3EE; border: 1px solid #EDE8DF; border-radius: 14px; cursor: pointer; font-size: 14px; font-weight: 700; color: #0D3326; transition: background 0.2s; }
  .emi-amort-trigger:hover { background: #EDE8DF; }
  .emi-amort-table-wrap { margin-top: 12px; border: 1px solid #EDE8DF; border-radius: 14px; overflow: auto; max-height: 340px; background: #ffffff; }
  .emi-amort-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .emi-amort-table th { background: #0D3326; color: #F3E7D2; padding: 10px 14px; text-align: right; font-weight: 600; font-size: 11.5px; white-space: nowrap; position: sticky; top: 0; z-index: 1; }
  .emi-amort-table th:first-child { text-align: left; }
  .emi-amort-table td { padding: 10px 14px; text-align: right; border-bottom: 1px solid #F5F3EE; color: #1A2C26; font-weight: 500; }
  .emi-amort-table td:first-child { text-align: left; font-weight: 600; color: #0D3326; }
  .emi-amort-table tr:last-child td { border-bottom: none; }
  .emi-amort-table tr:hover td { background: #F5F3EE; }

  /* Modal */
  .emi-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 24px; animation: emi-fade-in 0.18s ease; }
  .emi-modal { background: #ffffff; border-radius: 20px; padding: 32px 28px 28px; max-width: 420px; width: 100%; position: relative; box-shadow: 0 24px 60px rgba(0,0,0,0.25); animation: emi-slide-up 0.22s ease; }
  .emi-modal-icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: rgba(215,174,98,0.12); border: 1px solid rgba(215,174,98,0.25); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
  .emi-modal-title { font-size: 18px; font-weight: 800; color: #0D3326; text-align: center; margin-bottom: 14px; }
  .emi-modal-list { list-style: disc; padding-left: 18px; font-size: 13.5px; color: #6B7280; line-height: 1.7; margin-bottom: 22px; }
  .emi-modal-list li { margin-bottom: 4px; }
  .emi-modal-btn { width: 100%; padding: 13px; border-radius: 12px; border: none; background: linear-gradient(135deg, #D7AE62, #C99A40); color: #0D3326; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .emi-modal-btn:hover { filter: brightness(1.05); }
  .emi-modal-x { position: absolute; top: 14px; right: 14px; width: 30px; height: 30px; border-radius: 8px; border: none; background: #F5F3EE; color: #6B7280; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
  .emi-modal-x:hover { background: #EDE8DF; }

  @keyframes emi-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes emi-slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

/* ─────────────────────────────────────────────
   MAIN CLIENT COMPONENT
───────────────────────────────────────────────*/
const DEFAULT = { price: "", downPayment: "", rate: "", tenure: "20" };

export default function EmiCalculatorClient() {
  const [form, setForm] = useState(DEFAULT);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAmort, setShowAmort] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const price = parseNumber(form.price);
  const down = parseNumber(form.downPayment);
  const loanAmount = price != null && down != null ? Math.max(0, price - down) : null;

  /* Live recalculation */
  useEffect(() => {
    if (!calculated) return;
    runCalculation(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  function validate() {
    const errs = [];
    const p = parseNumber(form.price);
    const d = parseNumber(form.downPayment);
    const r = parseNumber(form.rate);
    const t = parseNumber(form.tenure);
    if (p == null || p <= 0) errs.push("Property price must be greater than 0.");
    if (d == null || d < 0) errs.push("Down payment cannot be negative.");
    if (p != null && d != null && d >= p) errs.push("Down payment cannot be greater than or equal to property price.");
    if (r == null || r < 1 || r > 30) errs.push("Interest rate must be between 1% and 30%.");
    if (t == null || t < 1 || t > 30) errs.push("Tenure must be between 1 and 30 years.");
    return errs;
  }

  const runCalculation = useCallback((showErrors = true) => {
    const errs = validate();
    if (errs.length > 0) {
      if (showErrors) { setErrors(errs); setShowModal(true); }
      setResult(null);
      return;
    }
    const p = parseNumber(form.price);
    const d = parseNumber(form.downPayment);
    const r = parseNumber(form.rate);
    const t = parseNumber(form.tenure);
    const loan = Math.max(0, p - d);
    const emi = calcEMI(loan, r, t);
    const totalPayment = emi * t * 12;
    const totalInterest = totalPayment - loan;
    const principalPct = Math.round((loan / totalPayment) * 100);
    const interestPct = 100 - principalPct;
    setResult({ emi, loan, totalInterest, totalPayment, principalPct, interestPct, amortization: buildAmortization(loan, r, t) });
    setCalculated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  function handleCalculate() { runCalculation(true); }

  function handleReset() {
    setForm(DEFAULT);
    setResult(null);
    setErrors([]);
    setShowModal(false);
    setCalculated(false);
    setShowAmort(false);
  }

  function setField(key) { return (val) => setForm((f) => ({ ...f, [key]: val })); }

  const tenureOptions = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="emi-page">

        {/* Breadcrumb */}
        <div className="emi-breadcrumb">
          <div className="emi-breadcrumb-inner">
            <Link href="/user">Home</Link>
            <span className="emi-breadcrumb-sep">›</span>
            <span>Tools</span>
            <span className="emi-breadcrumb-sep">›</span>
            <span className="emi-breadcrumb-current">EMI Calculator</span>
          </div>
        </div>

        {/* Hero */}
        <div className="emi-hero">
          <div className="emi-hero-inner">
            <div className="emi-hero-flex">
              <div className="emi-hero-icon-box">
                <Home size={26} color="#0D3326" />
              </div>
              <div>
                <h1>EMI Calculator</h1>
                <p>Plan your home loan before you buy.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="emi-grid">

          {/* LEFT: Form */}
          <div>
            <div className="emi-card">
              <div className="emi-card-header">
                <div className="emi-card-header-icon">
                  <Calculator size={18} color="#D7AE62" />
                </div>
                <h2 className="emi-card-title">Loan Details</h2>
              </div>
              <div className="emi-card-body">

                <InputField
                  id="emi-property-price" label="Property Price"
                  value={form.price} onChange={setField("price")}
                  prefix="₹" min={0} step={100000}
                />

                <InputField
                  id="emi-down-payment" label="Down Payment"
                  value={form.downPayment} onChange={setField("downPayment")}
                  prefix="₹" min={0} step={100000}
                />

                {/* Loan Amount auto */}
                <div className="emi-field">
                  <span className="emi-loan-field-label">
                    Loan Amount <span style={{ color: "#6B7280", fontWeight: 400, fontSize: "11.5px" }}>(auto calculated)</span>
                  </span>
                  <div className="emi-loan-display">
                    <span className="emi-loan-display-label">
                      {loanAmount != null ? "Loan Amount" : "Enter price & down payment"}
                    </span>
                    <span className="emi-loan-display-value">
                      {loanAmount != null ? formatINR(loanAmount) : "—"}
                      <span className="emi-loan-badge">Auto</span>
                    </span>
                  </div>
                </div>

                <InputField
                  id="emi-interest-rate" label="Interest Rate (p.a.)"
                  value={form.rate} onChange={setField("rate")}
                  suffix="%" min={1} max={30} step={0.1}
                />

                {/* Tenure */}
                <div className="emi-field">
                  <label htmlFor="emi-tenure" className="emi-label" style={{ display: "block" }}>
                    Loan Tenure
                  </label>
                  <div className="emi-select-wrap">
                    <select id="emi-tenure" className="emi-select" value={form.tenure} onChange={(e) => setField("tenure")(e.target.value)}>
                      {tenureOptions.map((y) => (
                        <option key={y} value={y}>{y} {y === 1 ? "Year" : "Years"}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="emi-btn-row">
                  <button id="emi-calculate-btn" type="button" className="emi-btn-calc" onClick={handleCalculate}>
                    <Calculator size={17} /> Calculate EMI
                  </button>
                  <button id="emi-reset-btn" type="button" className="emi-btn-reset" onClick={handleReset} title="Click to reset all fields">
                    <RotateCcw size={15} /> Reset
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div>
            <div className="emi-result-card">
              {result ? (
                <>
                  <div className="emi-emi-box">
                    <div className="emi-emi-icon">
                      <TrendingUp size={28} color="#D7AE62" />
                    </div>
                    <div className="emi-emi-label">Your Monthly EMI</div>
                    <div className="emi-emi-amount">
                      {formatINR(Math.round(result.emi))}{" "}
                      <span className="emi-per-month">/ month</span>
                    </div>
                  </div>
                  <div className="emi-summary-block">
                    <ResultRow label="Loan Amount" value={formatINR(Math.round(result.loan))} />
                    <ResultRow label="Total Interest" value={formatINR(Math.round(result.totalInterest))} />
                    <ResultRow label="Total Payment" value={formatINR(Math.round(result.totalPayment))} highlight />
                  </div>
                  <div className="emi-tip">
                    <Info size={14} color="#D7AE62" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>
                      <strong style={{ color: "#D7AE62" }}>Tip:</strong> A higher down payment can help you reduce your EMI and total interest.
                    </span>
                  </div>
                </>
              ) : (
                <div className="emi-empty">
                  <div className="emi-empty-icon">
                    <Calculator size={32} color="#D7AE62" />
                  </div>
                  <div className="emi-empty-title">Your Monthly EMI</div>
                  <div className="emi-empty-sub">
                    Fill in the loan details and click <strong>Calculate EMI</strong> to see your results.
                  </div>
                </div>
              )}
            </div>

            {/* Breakdown */}
            {result && (
              <div className="emi-card" style={{ marginTop: 24 }}>
                <div className="emi-card-header">
                  <div className="emi-card-header-icon">
                    <Percent size={16} color="#D7AE62" />
                  </div>
                  <h3 className="emi-card-title">Principal vs Interest</h3>
                </div>
                <div className="emi-breakdown-inner">
                  <div className="emi-breakdown-chart-row">
                    <DonutChart principalPct={result.principalPct} interestPct={result.interestPct} />
                    <div className="emi-legend">
                      <div className="emi-legend-item">
                        <span className="emi-legend-dot" style={{ background: "#0D3326" }} />
                        <div>
                          <div className="emi-legend-pct" style={{ color: "#0D3326" }}>{result.principalPct}%</div>
                          <div className="emi-legend-lbl">Principal</div>
                        </div>
                      </div>
                      <div className="emi-legend-item">
                        <span className="emi-legend-dot" style={{ background: "#D7AE62" }} />
                        <div>
                          <div className="emi-legend-pct" style={{ color: "#C99A40" }}>{result.interestPct}%</div>
                          <div className="emi-legend-lbl">Interest</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="emi-bar-wrap">
                    <div className="emi-bar-principal" style={{ width: `${result.principalPct}%` }} />
                  </div>
                </div>

                {/* Amortization accordion */}
                <div className="emi-amort">
                  <button id="emi-amort-toggle" type="button" className="emi-amort-trigger" onClick={() => setShowAmort((v) => !v)} aria-expanded={showAmort}>
                    <span>Amortization Schedule (Summary)</span>
                    {showAmort ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {showAmort && (
                    <div className="emi-amort-table-wrap">
                      <table className="emi-amort-table">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Principal Paid</th>
                            <th>Interest Paid</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.amortization.map((row) => (
                            <tr key={row.year}>
                              <td>Year {row.year}</td>
                              <td>{formatINR(Math.round(row.principalPaid))}</td>
                              <td>{formatINR(Math.round(row.interestPaid))}</td>
                              <td>{formatINR(Math.round(row.balance))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Validation Modal */}
      {showModal && <ValidationModal errors={errors} onClose={() => setShowModal(false)} />}
    </>
  );
}
