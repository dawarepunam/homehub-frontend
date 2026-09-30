"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  MapPin,
  Home as HomeIcon,
  RotateCcw,
  AlertTriangle,
  X,
  Info,
  Building,
  Grid,
  CheckCircle,
} from "lucide-react";
import PropertyCard from "@/components/user/PropertyCard";

// Colors (from EMI/Area converter)
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
};

const TO_SQFT = {
  "Sq.Ft": 1,
  "Sq.M": 10.7639,
  "Sq.Yd": 9,
  Acre: 43560,
  Guntha: 1089,
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
  .pv-page { min-height: 100vh; background: ${C.cream}; font-family: "Inter", system-ui, sans-serif; padding-bottom: 60px; }
  .pv-breadcrumb { background: ${C.forest}; border-bottom: 1px solid rgba(215,174,98,0.2); }
  .pv-breadcrumb-inner { max-width: 1280px; margin: 0 auto; padding: 10px 24px; display: flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(243,231,210,0.7); }
  .pv-breadcrumb a { color: rgba(243,231,210,0.7); text-decoration: none; transition: color 0.2s; }
  .pv-breadcrumb a:hover { color: ${C.gold}; }
  .pv-breadcrumb-sep { color: rgba(215,174,98,0.4); }
  .pv-breadcrumb-cur { color: ${C.gold}; font-weight: 600; }

  .pv-hero { background: linear-gradient(135deg, ${C.forest} 0%, ${C.forestMid} 100%); padding: 36px 24px 32px; border-bottom: 1px solid rgba(215,174,98,0.15); }
  .pv-hero-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 16px; }
  .pv-hero-icon { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, ${C.gold}, ${C.goldDark}); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pv-hero h1 { font-size: clamp(22px, 4vw, 34px); font-weight: 800; color: ${C.parchment}; margin: 0 0 4px; letter-spacing: -0.5px; }
  .pv-hero p { font-size: 14px; color: rgba(243,231,210,0.65); margin: 0; }

  .pv-grid { max-width: 1280px; margin: 0 auto; padding: 32px 24px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
  @media (max-width: 860px) { .pv-grid { grid-template-columns: 1fr; } }

  .pv-card { background: ${C.white}; border-radius: 20px; border: 1px solid ${C.creamDark}; box-shadow: 0 4px 24px rgba(13,51,38,0.06); overflow: hidden; }
  .pv-card-header { background: linear-gradient(135deg, ${C.cream} 0%, ${C.creamDark} 100%); padding: 16px 24px; border-bottom: 1px solid ${C.creamDark}; display: flex; align-items: center; gap: 10px; }
  .pv-card-num { width: 28px; height: 28px; border-radius: 50%; background: ${C.forest}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: ${C.gold}; flex-shrink: 0; }
  .pv-card-title { font-size: 16px; font-weight: 700; color: ${C.forest}; margin: 0; }
  .pv-card-body { padding: 24px; }

  .pv-field { margin-bottom: 20px; }
  .pv-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .pv-label { display: block; font-size: 12.5px; font-weight: 600; color: ${C.text}; margin-bottom: 6px; letter-spacing: 0.3px; }
  .pv-label::after { content: " *"; color: ${C.error}; }
  
  .pv-input-wrap { display: flex; align-items: center; border: 1.5px solid ${C.creamDark}; border-radius: 12px; background: ${C.cream}; transition: all 0.2s; overflow: hidden; }
  .pv-input-wrap:focus-within { border-color: ${C.gold}; box-shadow: 0 0 0 3px rgba(215,174,98,0.12); background: ${C.white}; }
  .pv-input-icon { padding: 0 12px; color: ${C.forestLight}; display: flex; align-items: center; }
  .pv-input, .pv-select { flex: 1; border: none; outline: none; padding: 11px 12px 11px 0; font-size: 15px; font-weight: 600; color: ${C.text}; background: transparent; width: 100%; }
  .pv-select { padding: 11px 16px 11px 0; cursor: pointer; }
  .pv-input[type="number"] { -moz-appearance: textfield; }
  .pv-input::-webkit-outer-spin-button, .pv-input::-webkit-inner-spin-button { -webkit-appearance: none; }

  .pv-btn-row { display: flex; gap: 12px; margin-top: 24px; }
  .pv-btn-calc { flex: 1; padding: 13px 20px; border-radius: 12px; border: none; background: linear-gradient(135deg, ${C.forest}, ${C.forestMid}); color: ${C.parchment}; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.25s; box-shadow: 0 4px 14px rgba(13,51,38,0.25); }
  .pv-btn-calc:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(13,51,38,0.35); }
  .pv-btn-reset { padding: 13px 18px; border-radius: 12px; border: 1.5px solid ${C.creamDark}; background: ${C.white}; color: ${C.muted}; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .pv-btn-reset:hover { border-color: ${C.error}; color: ${C.error}; background: ${C.errorBg}; }

  .pv-info-strip { margin-top: 16px; padding: 12px 16px; border-radius: 12px; background: rgba(215,174,98,0.07); border: 1px solid rgba(215,174,98,0.2); display: flex; gap: 10px; align-items: flex-start; font-size: 12.5px; color: ${C.forest}; }

  /* Results side */
  .pv-result-box { background: linear-gradient(135deg, ${C.forest} 0%, ${C.forestMid} 100%); border-radius: 16px; padding: 24px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(13,51,38,0.15); }
  @media (max-width: 500px) { .pv-result-box { flex-direction: column; align-items: flex-start; gap: 20px; } }
  .pv-res-left { display: flex; align-items: center; gap: 16px; }
  .pv-res-icon { width: 56px; height: 56px; border-radius: 14px; background: rgba(215,174,98,0.15); border: 1px solid rgba(215,174,98,0.3); display: flex; align-items: center; justify-content: center; }
  .pv-res-label { font-size: 13px; font-weight: 600; color: rgba(215,174,98,0.8); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .pv-res-val { font-size: clamp(24px, 4vw, 32px); font-weight: 800; color: ${C.parchment}; line-height: 1.1; }
  .pv-res-range { font-size: 13px; font-weight: 500; color: rgba(243,231,210,0.6); margin-top: 4px; }
  
  .pv-res-right { border-left: 1px solid rgba(215,174,98,0.2); padding-left: 24px; display: flex; flex-direction: column; gap: 12px; }
  @media (max-width: 500px) { .pv-res-right { border-left: none; border-top: 1px solid rgba(215,174,98,0.2); padding-left: 0; padding-top: 20px; width: 100%; } }
  .pv-stat { display: flex; align-items: center; gap: 10px; }
  .pv-stat-ic { color: ${C.gold}; }
  .pv-stat-text { font-size: 12px; color: rgba(243,231,210,0.7); font-weight: 500; }
  .pv-stat-val { font-size: 14px; font-weight: 700; color: ${C.parchment}; }

  .pv-calc-box { border: 1px solid ${C.creamDark}; border-radius: 16px; overflow: hidden; }
  .pv-calc-hdr { background: ${C.cream}; padding: 12px 16px; font-size: 13px; font-weight: 700; color: ${C.forest}; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid ${C.creamDark}; }
  .pv-calc-body { padding: 20px 16px; display: flex; align-items: center; justify-content: space-between; background: ${C.white}; }
  .pv-calc-item { text-align: center; }
  .pv-calc-lbl { font-size: 11px; color: ${C.muted}; font-weight: 600; margin-bottom: 6px; }
  .pv-calc-val { font-size: 16px; font-weight: 800; color: ${C.forest}; }
  .pv-calc-op { font-size: 18px; color: ${C.muted}; font-weight: 300; }

  .pv-calc-footer { background: ${C.cream}; padding: 12px 16px; font-size: 12px; color: ${C.forest}; display: flex; gap: 8px; align-items: flex-start; line-height: 1.5; }

  .pv-empty { min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }
  .pv-empty-icon { width: 64px; height: 64px; border-radius: 18px; background: rgba(215,174,98,0.1); border: 1px solid rgba(215,174,98,0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
  .pv-empty-title { font-size: 16px; font-weight: 700; color: ${C.forest}; margin-bottom: 6px; }
  .pv-empty-sub { font-size: 13px; color: ${C.muted}; max-width: 280px; }
  .pv-empty-err { color: ${C.error}; font-weight: 500; }

  .pv-similar { max-width: 1280px; margin: 40px auto 0; padding: 0 24px; }
  .pv-similar-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .pv-similar-title { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 800; color: ${C.forest}; }
  .pv-similar-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

  .pv-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .pv-modal { background: ${C.white}; border-radius: 20px; padding: 32px 28px 28px; max-width: 400px; width: 100%; position: relative; box-shadow: 0 24px 60px rgba(0,0,0,0.25); }
  .pv-modal-icon { width: 52px; height: 52px; border-radius: 14px; background: rgba(215,174,98,0.12); border: 1px solid rgba(215,174,98,0.25); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
  .pv-modal-title { font-size: 18px; font-weight: 800; color: ${C.forest}; text-align: center; margin-bottom: 12px; }
  .pv-modal-list { list-style: disc; padding-left: 18px; font-size: 13.5px; color: ${C.muted}; line-height: 1.7; margin-bottom: 22px; }
  .pv-modal-btn { width: 100%; padding: 13px; border-radius: 12px; border: none; background: linear-gradient(135deg, ${C.gold}, ${C.goldDark}); color: ${C.forest}; font-size: 15px; font-weight: 700; cursor: pointer; }
  .pv-modal-x { position: absolute; top: 14px; right: 14px; width: 30px; height: 30px; border-radius: 8px; border: none; background: ${C.cream}; color: ${C.muted}; display: flex; align-items: center; justify-content: center; cursor: pointer; }
`;

export default function PropertyValuationClient({ allProperties = [] }) {
  // Extract unique options from properties
  const cities = useMemo(() => {
    const list = allProperties.map((p) => p.City).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [allProperties]);

  const propertyTypes = useMemo(() => {
    const list = allProperties.map((p) => p.Property_Type).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [allProperties]);

  const categories = useMemo(() => {
    const list = allProperties.map((p) => p.Category).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [allProperties]);

  const [form, setForm] = useState({
    city: "",
    propertyType: "",
    category: "",
    area: "",
    unit: "Sq.Ft",
  });

  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [modalErrors, setModalErrors] = useState([]);

  function handleCalculate() {
    const errs = [];
    if (!form.city) errs.push("Please select a City.");
    if (!form.propertyType) errs.push("Please select a Property Type.");
    if (!form.category) errs.push("Please select a Category.");
    
    const inputArea = extractNumber(form.area);
    if (!inputArea || inputArea <= 0) errs.push("Please enter a valid Property Area greater than 0.");
    
    if (errs.length > 0) {
      setModalErrors(errs);
      return;
    }

    // Find comparables
    const comparables = allProperties.filter((p) => {
      const matchCity = !form.city || p.City === form.city;
      const matchType = !form.propertyType || p.Property_Type === form.propertyType;
      const matchCat = !form.category || p.Category === form.category;
      return matchCity && matchType && matchCat;
    });

    // Calculate Avg Price / SqFt
    let totalSqFtPrice = 0;
    let validComps = [];

    comparables.forEach((p) => {
      let pArea = extractNumber(p.PropertyCommonDetails?.CarpetArea) || extractNumber(p.PropertyCommonDetails?.Built_upArea);
      if (!pArea) pArea = extractNumber(p.Area);

      let pPrice = extractNumber(p.Price);
      if (pPrice && p.PriceUnits) {
        const unit = p.PriceUnits.toLowerCase();
        if (unit.includes("lakh")) pPrice *= 100000;
        else if (unit.includes("crore")) pPrice *= 10000000;
        else if (unit.includes("thousand") || unit.includes("k")) pPrice *= 1000;
      }
      if (!pPrice) pPrice = extractNumber(p.PropertyCommonDetails?.Price);

      if (pArea > 0 && pPrice > 0) {
        const sqftPrice = pPrice / pArea;
        totalSqFtPrice += sqftPrice;
        validComps.push(p);
      }
    });

    if (validComps.length === 0) {
      setResult(null);
      setErrorMsg("Not enough comparable HomeHub property data to estimate this value.");
      return;
    }

    const avgPricePerSqFt = totalSqFtPrice / validComps.length;
    
    // Convert User Area to SqFt
    const multiplier = TO_SQFT[form.unit] || 1;
    const userAreaSqFt = inputArea * multiplier;

    const estimatedValue = userAreaSqFt * avgPricePerSqFt;
    const rangeLow = estimatedValue * 0.92; // -8%
    const rangeHigh = estimatedValue * 1.08; // +8%

    setResult({
      avgPricePerSqFt: Math.round(avgPricePerSqFt),
      estimatedValue: Math.round(estimatedValue),
      rangeLow: Math.round(rangeLow),
      rangeHigh: Math.round(rangeHigh),
      userAreaSqFt: Math.round(userAreaSqFt),
      comparableCount: validComps.length,
      comparables: validComps.slice(0, 3), // Show top 3
    });
    setErrorMsg("");
  }

  function handleReset() {
    setForm({
      city: "",
      propertyType: "",
      category: "",
      area: "",
      unit: "Sq.Ft",
    });
    setResult(null);
    setErrorMsg("");
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="pv-page">
        {/* Breadcrumb */}
        <div className="pv-breadcrumb">
          <div className="pv-breadcrumb-inner">
            <Link href="/user">Home</Link>
            <span className="pv-breadcrumb-sep">›</span>
            <span>Tools</span>
            <span className="pv-breadcrumb-sep">›</span>
            <span className="pv-breadcrumb-cur">Property Valuation</span>
          </div>
        </div>

        {/* Hero */}
        <div className="pv-hero">
          <div className="pv-hero-inner">
            <div className="pv-hero-icon">
              <HomeIcon size={26} color={C.forest} />
            </div>
            <div>
              <h1>Property Valuation</h1>
              <p>Estimate the value of your property based on available HomeHub property data.</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="pv-grid">
          {/* LEFT: Input Form */}
          <div className="pv-card">
            <div className="pv-card-header">
              <div className="pv-card-num">1</div>
              <h2 className="pv-card-title">Property Details</h2>
            </div>
            <div className="pv-card-body">
              <p style={{ fontSize: "13px", color: C.muted, marginBottom: "20px" }}>
                Enter the property information to get an estimated value based on similar properties in your area.
              </p>

              <div className="pv-field-row">
                <div className="pv-field" style={{ marginBottom: 0 }}>
                  <label className="pv-label">City</label>
                  <div className="pv-input-wrap">
                    <span className="pv-input-icon"><MapPin size={16} /></span>
                    <select
                      className="pv-select"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pv-field" style={{ marginBottom: 0 }}>
                  <label className="pv-label">Property Type</label>
                  <div className="pv-input-wrap">
                    <span className="pv-input-icon"><Building size={16} /></span>
                    <select
                      className="pv-select"
                      value={form.propertyType}
                      onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                    >
                      <option value="">Select Type</option>
                      {propertyTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pv-field">
                <label className="pv-label">Category</label>
                <div className="pv-input-wrap">
                  <span className="pv-input-icon"><Grid size={16} /></span>
                  <select
                    className="pv-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pv-field-row">
                <div className="pv-field" style={{ marginBottom: 0 }}>
                  <label className="pv-label">Property Area</label>
                  <div className="pv-input-wrap">
                    <span className="pv-input-icon"><Grid size={16} /></span>
                    <input
                      type="number"
                      className="pv-input"
                      placeholder="e.g. 1200"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pv-field" style={{ marginBottom: 0 }}>
                  <label className="pv-label">Area Unit</label>
                  <div className="pv-input-wrap">
                    <select
                      className="pv-select"
                      style={{ paddingLeft: "16px" }}
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    >
                      {Object.keys(TO_SQFT).map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pv-btn-row">
                <button type="button" className="pv-btn-calc" onClick={handleCalculate}>
                  <TrendingUp size={16} /> Estimate Property Value
                </button>
                <button type="button" className="pv-btn-reset" onClick={handleReset}>
                  <RotateCcw size={15} /> Reset
                </button>
              </div>

              <div className="pv-info-strip">
                <Info size={16} style={{ flexShrink: 0 }} />
                <span>The valuation is based on similar properties available on HomeHub and is an estimate, not a certified valuation.</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="pv-card">
            <div className="pv-card-header">
              <div className="pv-card-num">2</div>
              <h2 className="pv-card-title">Estimated Property Value</h2>
            </div>
            
            <div className="pv-card-body" style={{ padding: "20px 24px" }}>
              {result ? (
                <>
                  <div className="pv-result-box">
                    <div className="pv-res-left">
                      <div className="pv-res-icon">
                        <HomeIcon size={28} color={C.gold} />
                      </div>
                      <div>
                        <div className="pv-res-label">Estimated Property Value</div>
                        <div className="pv-res-val">{formatINR(result.estimatedValue)}</div>
                        <div className="pv-res-range">
                          ({formatINR(result.rangeLow)} — {formatINR(result.rangeHigh)})
                        </div>
                      </div>
                    </div>
                    <div className="pv-res-right">
                      <div className="pv-stat">
                        <TrendingUp size={16} className="pv-stat-ic" />
                        <div>
                          <div className="pv-stat-text">Avg. Price / Sq.Ft</div>
                          <div className="pv-stat-val">{formatINR(result.avgPricePerSqFt)}</div>
                        </div>
                      </div>
                      <div className="pv-stat">
                        <Building size={16} className="pv-stat-ic" />
                        <div>
                          <div className="pv-stat-text">Comparable Properties</div>
                          <div className="pv-stat-val">{result.comparableCount}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pv-calc-box">
                    <div className="pv-calc-hdr">
                      <Info size={14} color={C.forest} /> How this is calculated?
                    </div>
                    <div className="pv-calc-body">
                      <div className="pv-calc-item">
                        <div className="pv-calc-lbl">Average Price / Sq.Ft</div>
                        <div className="pv-calc-val">{formatINR(result.avgPricePerSqFt)}</div>
                      </div>
                      <div className="pv-calc-op">×</div>
                      <div className="pv-calc-item">
                        <div className="pv-calc-lbl">Your Area</div>
                        <div className="pv-calc-val">{result.userAreaSqFt} Sq.Ft</div>
                      </div>
                      <div className="pv-calc-op">=</div>
                      <div className="pv-calc-item">
                        <div className="pv-calc-lbl">Estimated Value</div>
                        <div className="pv-calc-val" style={{ color: C.goldDark }}>{formatINR(result.estimatedValue)}</div>
                      </div>
                    </div>
                    <div className="pv-calc-footer">
                      <CheckCircle size={14} color={C.forestLight} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>This estimate is based on similar HomeHub properties in {form.city || "your area"} and may vary based on location, property condition, and other factors.</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="pv-empty">
                  <div className="pv-empty-icon">
                    <TrendingUp size={28} color={C.gold} />
                  </div>
                  <div className="pv-empty-title">Property Valuation</div>
                  {errorMsg ? (
                    <div className="pv-empty-sub pv-empty-err">{errorMsg}</div>
                  ) : (
                    <div className="pv-empty-sub">Enter your property details and click <strong>Estimate Property Value</strong> to see the result.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {result && result.comparables.length > 0 && (
          <div className="pv-similar">
            <div className="pv-similar-hdr">
              <div className="pv-similar-title">
                <HomeIcon size={20} color={C.gold} /> Similar Properties Used for Valuation
              </div>
            </div>
            <div className="pv-similar-grid">
              {result.comparables.map((prop) => (
                <PropertyCard key={prop.id || prop.documentId} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Validation Modal */}
      {modalErrors.length > 0 && (
        <div className="pv-modal-overlay" onClick={() => setModalErrors([])}>
          <div className="pv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pv-modal-icon"><AlertTriangle size={28} color={C.gold} /></div>
            <h2 className="pv-modal-title">Please check your input</h2>
            <ul className="pv-modal-list">
              {modalErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
            <button className="pv-modal-btn" onClick={() => setModalErrors([])}>Got it</button>
            <button className="pv-modal-x" onClick={() => setModalErrors([])}><X size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}
