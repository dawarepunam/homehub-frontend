"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  TrendingUp,
  RotateCcw,
  AlertTriangle,
  X,
  Info,
  Banknote,
  Percent,
  Calendar,
  Wallet,
  Calculator,
  ArrowRight,
} from "lucide-react";

// Colors
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
  success: "#059669",
};

function extractNumber(str) {
  if (str === null || str === undefined || str === "") return null;
  if (typeof str === "number") return str;
  const num = parseFloat(String(str).replace(/[^\d.]/g, ""));
  return isNaN(num) ? null : num;
}

function formatINR(value) {
  if (!value && value !== 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

const STYLES = `
  .ec-page { min-height: 100vh; background: ${C.cream}; font-family: "Inter", system-ui, sans-serif; padding-bottom: 60px; }
  
  /* Breadcrumb */
  .ec-breadcrumb { background: ${C.forest}; border-bottom: 1px solid rgba(215,174,98,0.2); }
  .ec-breadcrumb-inner { max-width: 1280px; margin: 0 auto; padding: 10px 24px; display: flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(243,231,210,0.7); }
  .ec-breadcrumb a { color: rgba(243,231,210,0.7); text-decoration: none; transition: color 0.2s; }
  .ec-breadcrumb a:hover { color: ${C.gold}; }
  .ec-breadcrumb-sep { color: rgba(215,174,98,0.4); }
  .ec-breadcrumb-cur { color: ${C.gold}; font-weight: 600; }

  /* Hero */
  .ec-hero { background: linear-gradient(135deg, ${C.forest} 0%, ${C.forestMid} 100%); padding: 36px 24px 32px; border-bottom: 1px solid rgba(215,174,98,0.15); }
  .ec-hero-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 16px; }
  .ec-hero-icon { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, ${C.gold}, ${C.goldDark}); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ec-hero h1 { font-size: clamp(22px, 4vw, 34px); font-weight: 800; color: ${C.parchment}; margin: 0 0 4px; letter-spacing: -0.5px; }
  .ec-hero p { font-size: 14px; color: rgba(243,231,210,0.65); margin: 0; }

  /* Main Grid */
  .ec-grid { max-width: 1280px; margin: 0 auto; padding: 32px 24px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
  @media (max-width: 860px) { .ec-grid { grid-template-columns: 1fr; } }

  /* Card */
  .ec-card { background: ${C.white}; border-radius: 20px; border: 1px solid ${C.creamDark}; box-shadow: 0 4px 24px rgba(13,51,38,0.06); overflow: hidden; }
  .ec-card-header { background: linear-gradient(135deg, ${C.cream} 0%, ${C.creamDark} 100%); padding: 16px 24px; border-bottom: 1px solid ${C.creamDark}; display: flex; align-items: center; gap: 10px; }
  .ec-card-num { width: 28px; height: 28px; border-radius: 50%; background: ${C.forest}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: ${C.gold}; flex-shrink: 0; }
  .ec-card-title { font-size: 16px; font-weight: 700; color: ${C.forest}; margin: 0; }
  .ec-card-body { padding: 24px; }

  /* Fields */
  .ec-field { margin-bottom: 20px; }
  .ec-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .ec-label { display: block; font-size: 12.5px; font-weight: 600; color: ${C.text}; margin-bottom: 6px; letter-spacing: 0.3px; }
  .ec-label-req::after { content: " *"; color: ${C.error}; }
  
  .ec-input-wrap { display: flex; align-items: center; border: 1.5px solid ${C.creamDark}; border-radius: 12px; background: ${C.cream}; transition: all 0.2s; overflow: hidden; }
  .ec-input-wrap:focus-within { border-color: ${C.gold}; box-shadow: 0 0 0 3px rgba(215,174,98,0.12); background: ${C.white}; }
  .ec-input-icon { padding: 0 12px; color: ${C.forestLight}; display: flex; align-items: center; }
  .ec-input { flex: 1; border: none; outline: none; padding: 11px 12px 11px 0; font-size: 15px; font-weight: 600; color: ${C.text}; background: transparent; width: 100%; }
  .ec-input[type="number"] { -moz-appearance: textfield; }
  .ec-input::-webkit-outer-spin-button, .ec-input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .ec-suffix { padding-right: 12px; font-size: 13px; font-weight: 600; color: ${C.muted}; }

  /* Buttons */
  .ec-btn-row { display: flex; gap: 12px; margin-top: 24px; }
  .ec-btn-calc { flex: 1; padding: 13px 20px; border-radius: 12px; border: none; background: linear-gradient(135deg, ${C.forest}, ${C.forestMid}); color: ${C.parchment}; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.25s; box-shadow: 0 4px 14px rgba(13,51,38,0.25); }
  .ec-btn-calc:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(13,51,38,0.35); }
  .ec-btn-reset { padding: 13px 18px; border-radius: 12px; border: 1.5px solid ${C.creamDark}; background: ${C.white}; color: ${C.muted}; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .ec-btn-reset:hover { border-color: ${C.error}; color: ${C.error}; background: ${C.errorBg}; }
  .ec-btn-next { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; padding: 12px 20px; border-radius: 12px; background: linear-gradient(135deg, ${C.gold}, ${C.goldDark}); color: ${C.forest}; font-size: 14px; font-weight: 700; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 12px rgba(215,174,98,0.3); }
  .ec-btn-next:hover { transform: translateY(-2px); filter: brightness(1.05); }

  /* Strips */
  .ec-info-strip { margin-top: 16px; padding: 12px 16px; border-radius: 12px; background: rgba(215,174,98,0.07); border: 1px solid rgba(215,174,98,0.2); display: flex; gap: 10px; align-items: flex-start; font-size: 12.5px; color: ${C.forest}; }
  .ec-error-strip { margin-top: 16px; padding: 12px 16px; border-radius: 12px; background: rgba(220,38,38,0.05); border: 1px solid rgba(220,38,38,0.2); display: flex; gap: 10px; align-items: flex-start; font-size: 13px; font-weight: 500; color: ${C.error}; }

  /* Results Box */
  .ec-result-box { background: linear-gradient(135deg, ${C.forest} 0%, ${C.forestMid} 100%); border-radius: 16px; padding: 24px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(13,51,38,0.15); }
  @media (max-width: 500px) { .ec-result-box { flex-direction: column; align-items: flex-start; gap: 20px; } }
  .ec-res-left { display: flex; align-items: center; gap: 16px; }
  .ec-res-icon { width: 56px; height: 56px; border-radius: 14px; background: rgba(215,174,98,0.15); border: 1px solid rgba(215,174,98,0.3); display: flex; align-items: center; justify-content: center; }
  .ec-res-label { font-size: 13px; font-weight: 600; color: rgba(215,174,98,0.8); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .ec-res-val { font-size: clamp(24px, 4vw, 32px); font-weight: 800; color: ${C.parchment}; line-height: 1.1; }
  
  .ec-res-right { border-left: 1px solid rgba(215,174,98,0.2); padding-left: 24px; display: flex; flex-direction: column; gap: 12px; }
  @media (max-width: 500px) { .ec-res-right { border-left: none; border-top: 1px solid rgba(215,174,98,0.2); padding-left: 0; padding-top: 20px; width: 100%; } }
  .ec-stat { display: flex; align-items: center; gap: 10px; }
  .ec-stat-ic { color: ${C.gold}; }
  .ec-stat-text { font-size: 12px; color: rgba(243,231,210,0.7); font-weight: 500; }
  .ec-stat-val { font-size: 14px; font-weight: 700; color: ${C.parchment}; }

  /* Breakdown Visual */
  .ec-breakdown { border: 1px solid ${C.creamDark}; border-radius: 16px; overflow: hidden; margin-bottom: 20px; }
  .ec-breakdown-hdr { background: ${C.cream}; padding: 12px 16px; font-size: 13px; font-weight: 700; color: ${C.forest}; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid ${C.creamDark}; }
  .ec-breakdown-body { padding: 20px 16px; display: flex; align-items: center; justify-content: space-between; background: ${C.white}; }
  .ec-bd-item { text-align: center; flex: 1; }
  .ec-bd-lbl { font-size: 11px; color: ${C.muted}; font-weight: 600; margin-bottom: 6px; }
  .ec-bd-val { font-size: 16px; font-weight: 800; color: ${C.forest}; }
  .ec-bd-op { font-size: 18px; color: ${C.muted}; font-weight: 300; margin: 0 10px; }
  @media (max-width: 480px) {
    .ec-breakdown-body { flex-direction: column; gap: 10px; }
    .ec-bd-op { transform: rotate(90deg); margin: 5px 0; }
  }

  /* Stats Grid */
  .ec-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  .ec-stat-sm { background: ${C.cream}; border: 1px solid ${C.creamDark}; border-radius: 10px; padding: 12px; text-align: center; }
  .ec-stat-sm-lbl { font-size: 11px; color: ${C.muted}; font-weight: 600; margin-bottom: 4px; }
  .ec-stat-sm-val { font-size: 14px; font-weight: 700; color: ${C.forest}; }

  /* Empty State */
  .ec-empty { min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }
  .ec-empty-icon { width: 64px; height: 64px; border-radius: 18px; background: rgba(215,174,98,0.1); border: 1px solid rgba(215,174,98,0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
  .ec-empty-title { font-size: 16px; font-weight: 700; color: ${C.forest}; margin-bottom: 6px; }
  .ec-empty-sub { font-size: 13px; color: ${C.muted}; max-width: 280px; }

  /* Modal */
  .ec-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .ec-modal { background: ${C.white}; border-radius: 20px; padding: 32px 28px 28px; max-width: 400px; width: 100%; position: relative; box-shadow: 0 24px 60px rgba(0,0,0,0.25); }
  .ec-modal-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(215,174,98,0.12); border: 1px solid rgba(215,174,98,0.25); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
  .ec-modal-title { font-size: 18px; font-weight: 800; color: ${C.forest}; text-align: center; margin-bottom: 12px; }
  .ec-modal-list { list-style: disc; padding-left: 18px; font-size: 13.5px; color: ${C.muted}; line-height: 1.7; margin-bottom: 22px; }
  .ec-modal-btn { width: 100%; padding: 13px; border-radius: 12px; border: none; background: linear-gradient(135deg, ${C.gold}, ${C.goldDark}); color: ${C.forest}; font-size: 15px; font-weight: 700; cursor: pointer; }
  .ec-modal-x { position: absolute; top: 14px; right: 14px; width: 30px; height: 30px; border-radius: 8px; border: none; background: ${C.cream}; color: ${C.muted}; display: flex; align-items: center; justify-content: center; cursor: pointer; }
`;

export default function EligibilityCheckClient() {
  const [form, setForm] = useState({
    income: "",
    existingEmi: "0",
    foir: "50",
    interestRate: "8.5",
    tenure: "20",
  });

  const [result, setResult] = useState(null);
  const [modalErrors, setModalErrors] = useState([]);

  function handleCalculate() {
    const errs = [];
    
    const income = extractNumber(form.income);
    const existingEmi = extractNumber(form.existingEmi) || 0;
    const foir = extractNumber(form.foir);
    const rate = extractNumber(form.interestRate);
    const tenure = extractNumber(form.tenure);

    if (!income || income <= 0) errs.push("Monthly Income must be greater than 0.");
    if (existingEmi < 0) errs.push("Existing EMI cannot be negative.");
    if (!foir || foir <= 0 || foir > 100) errs.push("Maximum EMI Ratio (FOIR) must be between 1 and 100.");
    if (!rate || rate <= 0 || rate > 50) errs.push("Interest Rate must be a valid percentage.");
    if (!tenure || tenure <= 0 || tenure > 50) errs.push("Tenure must be a valid number of years.");

    if (errs.length > 0) {
      setModalErrors(errs);
      return;
    }

    const maxEmiCapacity = income * (foir / 100);
    const availableEmi = maxEmiCapacity - existingEmi;

    if (availableEmi <= 0) {
      setResult({
        eligibleLoan: 0,
        maxNewEmi: 0,
        maxCapacity: maxEmiCapacity,
        income,
        existingEmi,
        foir,
        rate,
        tenure,
        error: "Your existing EMIs exceed or meet your maximum EMI capacity. You are not eligible for a new loan based on these criteria.",
      });
      return;
    }

    // EMI Formula: P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
    const monthlyRate = rate / 12 / 100;
    const totalMonths = tenure * 12;
    const mathPow = Math.pow(1 + monthlyRate, totalMonths);
    const eligibleLoan = availableEmi * ((mathPow - 1) / (monthlyRate * mathPow));

    setResult({
      eligibleLoan: Math.round(eligibleLoan),
      maxNewEmi: Math.round(availableEmi),
      maxCapacity: Math.round(maxEmiCapacity),
      income,
      existingEmi,
      foir,
      rate,
      tenure,
      error: null,
    });
  }

  function handleReset() {
    setForm({
      income: "",
      existingEmi: "0",
      foir: "50",
      interestRate: "8.5",
      tenure: "20",
    });
    setResult(null);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="ec-page">
        {/* Breadcrumb */}
        <div className="ec-breadcrumb">
          <div className="ec-breadcrumb-inner">
            <Link href="/user">Home</Link>
            <span className="ec-breadcrumb-sep">›</span>
            <span>Tools</span>
            <span className="ec-breadcrumb-sep">›</span>
            <span className="ec-breadcrumb-cur">Eligibility Check</span>
          </div>
        </div>

        {/* Hero */}
        <div className="ec-hero">
          <div className="ec-hero-inner">
            <div className="ec-hero-icon">
              <CheckCircle size={26} color={C.forest} />
            </div>
            <div>
              <h1>Home Loan Eligibility</h1>
              <p>Check your estimated home loan eligibility based on your income and existing obligations.</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="ec-grid">
          {/* LEFT: Input Form */}
          <div className="ec-card">
            <div className="ec-card-header">
              <div className="ec-card-num">1</div>
              <h2 className="ec-card-title">Income & Obligations</h2>
            </div>
            <div className="ec-card-body">
              
              <div className="ec-field">
                <label className="ec-label ec-label-req">Monthly Income</label>
                <div className="ec-input-wrap">
                  <span className="ec-input-icon"><Wallet size={16} /></span>
                  <input
                    type="number"
                    className="ec-input"
                    placeholder="e.g. 80000"
                    value={form.income}
                    onChange={(e) => setForm({ ...form, income: e.target.value })}
                  />
                  <span className="ec-suffix">₹</span>
                </div>
              </div>

              <div className="ec-field">
                <label className="ec-label">Existing Monthly EMIs</label>
                <div className="ec-input-wrap">
                  <span className="ec-input-icon"><Banknote size={16} /></span>
                  <input
                    type="number"
                    className="ec-input"
                    placeholder="e.g. 10000"
                    value={form.existingEmi}
                    onChange={(e) => setForm({ ...form, existingEmi: e.target.value })}
                  />
                  <span className="ec-suffix">₹</span>
                </div>
              </div>

              <div className="ec-field-row">
                <div className="ec-field" style={{ marginBottom: 0 }}>
                  <label className="ec-label">Max EMI Ratio (FOIR)</label>
                  <div className="ec-input-wrap">
                    <span className="ec-input-icon"><Percent size={16} /></span>
                    <input
                      type="number"
                      className="ec-input"
                      value={form.foir}
                      onChange={(e) => setForm({ ...form, foir: e.target.value })}
                    />
                    <span className="ec-suffix">%</span>
                  </div>
                </div>

                <div className="ec-field" style={{ marginBottom: 0 }}>
                  <label className="ec-label">Interest Rate</label>
                  <div className="ec-input-wrap">
                    <span className="ec-input-icon"><TrendingUp size={16} /></span>
                    <input
                      type="number"
                      step="0.1"
                      className="ec-input"
                      value={form.interestRate}
                      onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
                    />
                    <span className="ec-suffix">%</span>
                  </div>
                </div>
              </div>

              <div className="ec-field" style={{ marginTop: 20 }}>
                <label className="ec-label">Loan Tenure</label>
                <div className="ec-input-wrap">
                  <span className="ec-input-icon"><Calendar size={16} /></span>
                  <input
                    type="number"
                    className="ec-input"
                    value={form.tenure}
                    onChange={(e) => setForm({ ...form, tenure: e.target.value })}
                  />
                  <span className="ec-suffix">Years</span>
                </div>
              </div>

              <div className="ec-btn-row">
                <button type="button" className="ec-btn-calc" onClick={handleCalculate}>
                  <CheckCircle size={16} /> Calculate Eligibility
                </button>
                <button type="button" className="ec-btn-reset" onClick={handleReset}>
                  <RotateCcw size={15} /> Reset
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="ec-card">
            <div className="ec-card-header">
              <div className="ec-card-num">2</div>
              <h2 className="ec-card-title">Eligibility Result</h2>
            </div>
            
            <div className="ec-card-body" style={{ padding: "20px 24px" }}>
              {result ? (
                <>
                  <div className="ec-result-box" style={{ background: result.error ? `linear-gradient(135deg, ${C.error}, #B91C1C)` : undefined }}>
                    <div className="ec-res-left">
                      <div className="ec-res-icon">
                        <Banknote size={28} color={C.gold} />
                      </div>
                      <div>
                        <div className="ec-res-label">Estimated Eligible Loan</div>
                        <div className="ec-res-val">{formatINR(result.eligibleLoan)}</div>
                      </div>
                    </div>
                    <div className="ec-res-right">
                      <div className="ec-stat">
                        <Wallet size={16} className="ec-stat-ic" />
                        <div>
                          <div className="ec-stat-text">Max Affordable New EMI</div>
                          <div className="ec-stat-val">{formatINR(result.maxNewEmi)} / mo</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.error && (
                    <div className="ec-error-strip">
                      <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                      <span>{result.error}</span>
                    </div>
                  )}

                  <div className="ec-breakdown">
                    <div className="ec-breakdown-hdr">
                      <Calculator size={14} color={C.forest} /> EMI Capacity Breakdown
                    </div>
                    <div className="ec-breakdown-body">
                      <div className="ec-bd-item">
                        <div className="ec-bd-lbl">Max EMI Capacity<br/>({result.foir}% of Income)</div>
                        <div className="ec-bd-val">{formatINR(result.maxCapacity)}</div>
                      </div>
                      <div className="ec-bd-op">−</div>
                      <div className="ec-bd-item">
                        <div className="ec-bd-lbl">Existing<br/>EMIs</div>
                        <div className="ec-bd-val">{formatINR(result.existingEmi)}</div>
                      </div>
                      <div className="ec-bd-op">=</div>
                      <div className="ec-bd-item">
                        <div className="ec-bd-lbl">Available<br/>EMI</div>
                        <div className="ec-bd-val" style={{ color: result.maxNewEmi > 0 ? C.success : C.error }}>{formatINR(result.maxNewEmi)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="ec-stats-grid">
                    <div className="ec-stat-sm">
                      <div className="ec-stat-sm-lbl">Monthly Income</div>
                      <div className="ec-stat-sm-val">{formatINR(result.income)}</div>
                    </div>
                    <div className="ec-stat-sm">
                      <div className="ec-stat-sm-lbl">Interest Rate</div>
                      <div className="ec-stat-sm-val">{result.rate}%</div>
                    </div>
                    <div className="ec-stat-sm">
                      <div className="ec-stat-sm-lbl">Tenure</div>
                      <div className="ec-stat-sm-val">{result.tenure} Yrs</div>
                    </div>
                  </div>

                  {result.eligibleLoan > 0 && (
                    <div style={{ textAlign: "center" }}>
                      <Link href={`/user/tools/emi-calculator?amount=${result.eligibleLoan}`} className="ec-btn-next">
                        Calculate EMI for this Loan <ArrowRight size={16} />
                      </Link>
                    </div>
                  )}

                  <div className="ec-info-strip">
                    <Info size={16} style={{ flexShrink: 0 }} />
                    <span>This is an indicative estimate for planning purposes only. Actual loan eligibility depends on lender policies, credit profile, income, age, existing obligations and other verification.</span>
                  </div>
                </>
              ) : (
                <div className="ec-empty">
                  <div className="ec-empty-icon">
                    <CheckCircle size={28} color={C.gold} />
                  </div>
                  <div className="ec-empty-title">Check Your Eligibility</div>
                  <div className="ec-empty-sub">Enter your income and obligations, then click <strong>Calculate Eligibility</strong> to see your estimated eligible home loan amount.</div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Validation Modal */}
      {modalErrors.length > 0 && (
        <div className="ec-modal-overlay" onClick={() => setModalErrors([])}>
          <div className="ec-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ec-modal-icon"><AlertTriangle size={28} color={C.gold} /></div>
            <h2 className="ec-modal-title">Please check your input</h2>
            <ul className="ec-modal-list">
              {modalErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
            <button className="ec-modal-btn" onClick={() => setModalErrors([])}>Got it</button>
            <button className="ec-modal-x" onClick={() => setModalErrors([])}><X size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}
