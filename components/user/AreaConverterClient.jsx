"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRightLeft,
  RotateCcw,
  AlertTriangle,
  X,
  Home,
  Grid,
  Triangle,
  Leaf,
  Sprout,
  Lightbulb,
} from "lucide-react";

/* ─────────────────────────────────────────────
   CONVERSION TABLE  (all values → Sq.Ft base)
───────────────────────────────────────────────*/
const TO_SQFT = {
  sqft: 1,
  sqm: 10.7639,
  sqyd: 9,
  acre: 43560,
  guntha: 1089,
};

const UNITS = [
  { key: "sqft",  label: "Square Feet",  short: "Sq.Ft", Icon: Home    },
  { key: "sqm",   label: "Square Meter", short: "Sq.M",  Icon: Grid    },
  { key: "sqyd",  label: "Square Yard",  short: "Sq.Yd", Icon: Triangle },
  { key: "acre",  label: "Acre",         short: "Acre",  Icon: Leaf    },
  { key: "guntha",label: "Guntha",       short: "Guntha",Icon: Sprout  },
];

const QUICK_FACTS = [
  { from: "1 Sq.Ft", eq: "0.0929 Sq.M" },
  { from: "1 Sq.Ft", eq: "0.1111 Sq.Yd" },
  { from: "1 Acre",  eq: "43,560 Sq.Ft" },
  { from: "1 Guntha",eq: "1,089 Sq.Ft"  },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────*/
function convertAll(value, fromKey) {
  const inSqft = value * TO_SQFT[fromKey];
  return UNITS.reduce((acc, u) => {
    acc[u.key] = inSqft / TO_SQFT[u.key];
    return acc;
  }, {});
}

function smartFormat(n) {
  if (n === null || n === undefined) return "—";
  if (n >= 1000) return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  if (n >= 1)    return n.toLocaleString("en-IN", { maximumFractionDigits: 4 });
  return n.toLocaleString("en-IN", { maximumFractionDigits: 6 });
}

/* ─────────────────────────────────────────────
   SCOPED STYLES  (class prefix "ac-")
───────────────────────────────────────────────*/
const STYLES = `
  .ac-page { min-height:100vh; background:var(--bg-page); font-family:"Inter",system-ui,sans-serif; color:var(--text-primary); }

  /* breadcrumb */
  .ac-breadcrumb { background:var(--bg-surface); border-bottom:1px solid var(--border-subtle); }
  .ac-breadcrumb-inner { max-width:1280px; margin:0 auto; padding:10px 24px; display:flex; align-items:center; gap:6px; font-size:13px; color:var(--text-secondary); }
  .ac-breadcrumb a { color:var(--text-secondary); text-decoration:none; transition:color .2s; }
  .ac-breadcrumb a:hover { color:var(--text-primary); }
  .ac-breadcrumb-sep { color:var(--border-subtle); }
  .ac-breadcrumb-cur { color:var(--text-primary); font-weight:600; }

  /* hero */
  .ac-hero { background:var(--bg-surface); padding:36px 24px 32px; border-bottom:1px solid var(--border-subtle); }
  .ac-hero-inner { max-width:1280px; margin:0 auto; display:flex; align-items:center; gap:16px; }
  .ac-hero-icon { width:56px; height:56px; border-radius:16px; background:var(--btn-primary-bg); color:var(--btn-primary-text); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ac-hero h1 { font-size:clamp(22px,4vw,34px); font-weight:800; color:var(--text-primary); margin:0 0 4px; letter-spacing:-.5px; }
  .ac-hero p  { font-size:14px; color:var(--text-secondary); margin:0; }

  /* main grid */
  .ac-grid { max-width:1280px; margin:0 auto; padding:32px 24px 48px; display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:start; }
  @media(max-width:860px){ .ac-grid{ grid-template-columns:1fr; } }

  /* card */
  .ac-card { background:var(--bg-card); border-radius:20px; border:1px solid var(--border-subtle); box-shadow:0 4px 24px rgba(0,0,0,.04); overflow:hidden; }
  .ac-card-header { background:var(--bg-surface); padding:16px 24px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:10px; }
  .ac-card-num { width:28px; height:28px; border-radius:50%; background:var(--btn-primary-bg); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:var(--btn-primary-text); flex-shrink:0; }
  .ac-card-title { font-size:16px; font-weight:700; color:var(--text-primary); margin:0; }
  .ac-card-body { padding:24px; }

  /* fields */
  .ac-field { margin-bottom:20px; }
  .ac-label { display:block; font-size:12.5px; font-weight:600; color:var(--text-primary); margin-bottom:6px; letter-spacing:.3px; }
  .ac-label::after { content:" *"; color:#DC2626; }
  .ac-input-wrap { display:flex; align-items:center; border:1.5px solid var(--border-subtle); border-radius:12px; background:var(--bg-surface); transition:border-color .2s,box-shadow .2s; overflow:hidden; }
  .ac-input-wrap:focus-within { border-color:var(--text-primary); box-shadow:0 0 0 3px rgba(0,0,0,.06); background:var(--bg-card); }
  .ac-input-icon { padding:0 12px; color:var(--text-secondary); display:flex; align-items:center; }
  .ac-input { flex:1; border:none; outline:none; padding:11px 12px 11px 0; font-size:15px; font-weight:600; color:var(--text-primary); background:transparent; min-width:0; }
  .ac-input::-webkit-inner-spin-button,.ac-input::-webkit-outer-spin-button{-webkit-appearance:none;}
  .ac-input[type=number]{-moz-appearance:textfield;}

  /* select */
  .ac-select-wrap { border:1.5px solid var(--border-subtle); border-radius:12px; background:var(--bg-surface); overflow:hidden; transition:border-color .2s,box-shadow .2s; }
  .ac-select-wrap:focus-within { border-color:var(--text-primary); box-shadow:0 0 0 3px rgba(0,0,0,.06); background:var(--bg-card); }
  .ac-select { width:100%; border:none; outline:none; padding:11px 16px; font-size:15px; font-weight:600; color:var(--text-primary); background:transparent; appearance:none; cursor:pointer; }

  /* buttons */
  .ac-btn-row { display:flex; gap:12px; margin-top:24px; }
  .ac-btn-convert { flex:1; padding:13px 20px; border-radius:12px; border:none; background:var(--btn-primary-bg); color:var(--btn-primary-text); font-size:15px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all .25s; box-shadow:0 4px 14px rgba(0,0,0,.12); }
  .ac-btn-convert:hover { opacity:0.9; transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.18); }
  .ac-btn-reset { padding:13px 18px; border-radius:12px; border:1.5px solid var(--border-subtle); background:var(--bg-card); color:var(--text-secondary); font-size:14px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all .2s; }
  .ac-btn-reset:hover { border-color:#DC2626; color:#DC2626; background:rgba(220,38,38,.08); }

  /* info / error strip */
  .ac-info-strip { margin-top:16px; padding:12px 16px; border-radius:12px; background:var(--bg-surface); border:1px solid var(--border-subtle); display:flex; gap:10px; align-items:flex-start; font-size:12.5px; color:var(--text-secondary); }
  .ac-error-strip { background:rgba(220,38,38,.06); border-color:rgba(220,38,38,.25); color:#B91C1C; }

  /* results card (right) */
  .ac-result-header-row { padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:12px; }
  .ac-result-header-icon { width:38px; height:38px; border-radius:10px; background:var(--btn-primary-bg); color:var(--btn-primary-text); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ac-input-badge { background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:10px; padding:8px 16px; margin:0 22px 20px; display:flex; align-items:center; gap:10px; }
  .ac-input-badge-val { font-size:18px; font-weight:800; color:var(--text-primary); }
  .ac-input-badge-sub { font-size:11.5px; color:var(--text-secondary); font-weight:500; margin-top:2px; }

  /* result rows */
  .ac-result-rows { padding:0 22px 4px; }
  .ac-result-row { display:flex; align-items:center; gap:14px; padding:13px 0; border-bottom:1px solid var(--border-subtle); transition:background .15s; }
  .ac-result-row:last-child { border-bottom:none; }
  .ac-result-row:hover { background:var(--bg-surface); border-radius:10px; }
  .ac-row-icon { width:36px; height:36px; border-radius:10px; background:var(--bg-surface); color:var(--text-primary); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ac-row-label { flex:1; font-size:14px; font-weight:500; color:var(--text-primary); }
  .ac-row-value { font-size:17px; font-weight:800; color:var(--text-primary); }
  .ac-row-badge { margin-left:10px; font-size:11px; font-weight:700; background:var(--bg-surface); color:var(--text-secondary); border-radius:7px; padding:3px 9px; white-space:nowrap; }

  /* empty state */
  .ac-empty { min-height:300px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 24px; text-align:center; }
  .ac-empty-icon { width:64px; height:64px; border-radius:18px; background:var(--bg-surface); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:center; margin-bottom:16px; color:var(--text-primary); }
  .ac-empty-title { font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:6px; }
  .ac-empty-sub   { font-size:13px; color:var(--text-secondary); max-width:220px; }

  /* quick facts */
  .ac-facts { max-width:1280px; margin:0 auto; padding:0 24px 48px; }
  .ac-facts-title { display:flex; align-items:center; gap:10px; font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:16px; }
  .ac-facts-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
  @media(max-width:860px){ .ac-facts-grid{ grid-template-columns:repeat(2,1fr); } }
  @media(max-width:480px){ .ac-facts-grid{ grid-template-columns:1fr; } }
  .ac-fact-card { background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:14px 18px; display:flex; align-items:center; gap:12px; box-shadow:0 2px 8px rgba(0,0,0,.04); }
  .ac-fact-icon { width:34px; height:34px; border-radius:9px; background:var(--bg-surface); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:var(--text-primary); }
  .ac-fact-text { font-size:13px; font-weight:600; color:var(--text-primary); }
  .ac-fact-eq   { font-size:12px; color:var(--text-secondary); font-weight:700; }

  /* modal */
  .ac-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); backdrop-filter:blur(4px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:24px; animation:ac-fade .18s ease; }
  .ac-modal { background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:20px; padding:32px 28px 28px; max-width:400px; width:100%; position:relative; box-shadow:0 24px 60px rgba(0,0,0,.25); animation:ac-up .22s ease; }
  .ac-modal-icon { width:52px; height:52px; border-radius:14px; background:var(--bg-surface); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; color:var(--text-primary); }
  .ac-modal-title { font-size:18px; font-weight:800; color:var(--text-primary); text-align:center; margin-bottom:12px; }
  .ac-modal-list  { list-style:disc; padding-left:18px; font-size:13.5px; color:var(--text-secondary); line-height:1.7; margin-bottom:22px; }
  .ac-modal-btn   { width:100%; padding:13px; border-radius:12px; border:none; background:var(--btn-primary-bg); color:var(--btn-primary-text); font-size:15px; font-weight:700; cursor:pointer; }
  .ac-modal-btn:hover { opacity:0.9; }
  .ac-modal-x  { position:absolute; top:14px; right:14px; width:30px; height:30px; border-radius:8px; border:none; background:var(--bg-surface); color:var(--text-secondary); display:flex; align-items:center; justify-content:center; cursor:pointer; }
  .ac-modal-x:hover { background:var(--border-subtle); color:var(--text-primary); }

  @keyframes ac-fade { from{opacity:0} to{opacity:1} }
  @keyframes ac-up   { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }
`;

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────*/
export default function AreaConverterClient() {
  const [value, setValue]     = useState("");
  const [fromUnit, setFromUnit] = useState("sqft");
  const [results, setResults] = useState(null);
  const [errors, setErrors]   = useState([]);
  const [showModal, setShowModal] = useState(false);

  /* live conversion once results exist */
  useEffect(() => {
    if (results === null) return;
    doConvert(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, fromUnit]);

  function validate() {
    const errs = [];
    const n = parseFloat(value);
    if (value === "" || value === null) errs.push("Please enter an area value.");
    else if (isNaN(n))  errs.push("Area value must be a valid number.");
    else if (n <= 0)    errs.push("Area value must be greater than 0.");
    return errs;
  }

  function doConvert(showErrors = true) {
    const errs = validate();
    if (errs.length) {
      if (showErrors) { setErrors(errs); setShowModal(true); }
      setResults(null);
      return;
    }
    setResults(convertAll(parseFloat(value), fromUnit));
  }

  function handleReset() {
    setValue("");
    setFromUnit("sqft");
    setResults(null);
    setErrors([]);
    setShowModal(false);
  }

  const fromUnitMeta = UNITS.find((u) => u.key === fromUnit);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="ac-page">

        {/* Breadcrumb */}
        <div className="ac-breadcrumb">
          <div className="ac-breadcrumb-inner">
            <Link href="/user">Home</Link>
            <span className="ac-breadcrumb-sep">›</span>
            <span>Tools</span>
            <span className="ac-breadcrumb-sep">›</span>
            <span className="ac-breadcrumb-cur">Area Converter</span>
          </div>
        </div>

        {/* Hero */}
        <div className="ac-hero">
          <div className="ac-hero-inner">
            <div className="ac-hero-icon">
              <ArrowRightLeft size={26} />
            </div>
            <div>
              <h1>Area Converter</h1>
              <p>Convert property area between common units.</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="ac-grid">

          {/* LEFT: Input form */}
          <div className="ac-card">
            <div className="ac-card-header">
              <div className="ac-card-num">1</div>
              <h2 className="ac-card-title">Convert Area</h2>
            </div>
            <div className="ac-card-body">

              {/* Area Value */}
              <div className="ac-field">
                <label htmlFor="ac-value" className="ac-label">Enter Area Value</label>
                <div className="ac-input-wrap">
                  <span className="ac-input-icon">
                    <Grid size={16} />
                  </span>
                  <input
                    id="ac-value"
                    type="number"
                    min="0"
                    step="any"
                    className="ac-input"
                    placeholder="e.g. 1000"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* From Unit */}
              <div className="ac-field">
                <label htmlFor="ac-from-unit" className="ac-label">From Unit</label>
                <div className="ac-select-wrap">
                  <select
                    id="ac-from-unit"
                    className="ac-select"
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                  >
                    {UNITS.map((u) => (
                      <option key={u.key} value={u.key}>
                        {u.label} ({u.short})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="ac-btn-row">
                <button
                  id="ac-convert-btn"
                  type="button"
                  className="ac-btn-convert"
                  onClick={() => doConvert(true)}
                >
                  <ArrowRightLeft size={16} />
                  Convert
                </button>
                <button
                  id="ac-reset-btn"
                  type="button"
                  className="ac-btn-reset"
                  onClick={handleReset}
                  title="Reset all fields"
                >
                  <RotateCcw size={15} />
                  Reset
                </button>
              </div>

              {/* Hint strip */}
              <div className="ac-info-strip">
                <span style={{ flexShrink: 0, marginTop: 1 }}>ℹ️</span>
                <span>Enter a value and select the unit to see the conversion in all available units.</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="ac-card">
            <div className="ac-card-header">
              <div className="ac-card-num">2</div>
              <h2 className="ac-card-title">Conversion Results</h2>
            </div>

            {results ? (
              <>
                {/* Input summary badge */}
                <div style={{ padding: "16px 22px 0" }}>
                  <div className="ac-input-badge">
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <ArrowRightLeft size={18} />
                    </div>
                    <div>
                      <div className="ac-input-badge-val">
                        {smartFormat(parseFloat(value))} {fromUnitMeta?.short}
                      </div>
                      <div className="ac-input-badge-sub">From your input</div>
                    </div>
                  </div>
                </div>

                {/* Result rows */}
                <div className="ac-result-rows">
                  {UNITS.map((u) => (
                    <div key={u.key} className="ac-result-row">
                      <div className="ac-row-icon">
                        <u.Icon size={16} color="#226E58" />
                      </div>
                      <span className="ac-row-label">{u.label}</span>
                      <span className="ac-row-value">{smartFormat(results[u.key])}</span>
                      <span className="ac-row-badge">{u.short}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="ac-empty">
                <div className="ac-empty-icon">
                  <ArrowRightLeft size={28} style={{ color: "var(--btn-primary-bg)" }} />
                </div>
                <div className="ac-empty-title">Conversion Results</div>
                <div className="ac-empty-sub">
                  Enter a value, choose a unit, and click <strong>Convert</strong> to see all conversions.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Conversion Facts */}
        <div className="ac-facts">
          <div className="ac-facts-title">
            <Lightbulb size={20} style={{ color: "var(--btn-primary-bg)" }} />
            Quick Conversion Facts
          </div>
          <div className="ac-facts-grid">
            {QUICK_FACTS.map((f, i) => {
              const icons = [Grid, Triangle, Leaf, Sprout];
              const IconComp = icons[i];
              return (
                <div key={i} className="ac-fact-card">
                  <div className="ac-fact-icon">
                    <IconComp size={16} color="#226E58" />
                  </div>
                  <div>
                    <div className="ac-fact-text">{f.from}</div>
                    <div className="ac-fact-eq">= {f.eq}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Validation Modal */}
      {showModal && (
        <div className="ac-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ac-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="ac-modal-title">
            <div className="ac-modal-icon">
              <AlertTriangle size={28} style={{ color: "var(--btn-primary-bg)" }} />
            </div>
            <h2 id="ac-modal-title" className="ac-modal-title">Please check your input</h2>
            <ul className="ac-modal-list">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
            <button id="ac-modal-close" type="button" className="ac-modal-btn" onClick={() => setShowModal(false)}>
              Got it
            </button>
            <button type="button" className="ac-modal-x" onClick={() => setShowModal(false)} aria-label="Close">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
