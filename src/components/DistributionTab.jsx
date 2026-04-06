import { useState } from "react";

const rankColors = { "Full Professor": "#2563eb", "Associate Professor": "#7c3aed", "Assistant Professor": "#059669", "Lecturer IV": "#d97706", Lecturer: "#dc2626" };
const fmt = (v) => { if (v == null) return "\u2014"; const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[,$]/g, "")); return isNaN(n) || n === 0 ? "\u2014" : "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); };
const pct = (v) => { const n = parseFloat(v); return isNaN(n) ? "\u2014" : Math.round(n * 100) + "%"; };

export default function DistributionTab({ salaryData, loading }) {
  const [sortBy, setSortBy] = useState("ftr");
  if (loading) return <p>Loading...</p>;
  if (!salaryData) return null;

  const withSalary = salaryData.filter((d) => d.anthroFtr && d.anthroFtr > 0 && !d.courtesy).sort((a, b) => sortBy === "ftr" ? a.anthroFtr - b.anthroFtr : (a.anthroCost || 0) - (b.anthroCost || 0));
  const buckets = [0, 50000, 75000, 100000, 125000, 150000, 175000, 200000, 250000, 300000, Infinity];
  const bucketLabels = ["<$50k", "$50-75k", "$75-100k", "$100-125k", "$125-150k", "$150-175k", "$175-200k", "$200-250k", "$250-300k", "$300k+"];
  const histogram = bucketLabels.map(() => []);
  withSalary.forEach((d) => { const val = sortBy === "ftr" ? d.anthroFtr : d.anthroCost || 0; for (let i = 0; i < buckets.length - 1; i++) { if (val >= buckets[i] && val < buckets[i + 1]) { histogram[i].push(d); break; } } });
  const maxBucket = Math.max(...histogram.map((h) => h.length), 1);
  if (withSalary.length === 0) return <p>No salary data found.</p>;

  return (
    <div>
      <p style={{ fontSize: 13, color: "#666", margin: "0 0 8px" }}>{withSalary.length} non-courtesy faculty with salary data. Colored by rank.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        {Object.entries(rankColors).map(([r, c]) => (<div key={r} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: c, display: "inline-block" }}></span>{r}</div>))}
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: "#d97706", display: "inline-block", backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)" }}></span>Postdoc dual title</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, margin: 0 }}>Salary Distribution</h3>
        <div style={{ display: "flex", gap: 0, border: "1px solid #d1d5db", borderRadius: 8, overflow: "hidden" }}>
          {[{ key: "ftr", label: "By FTR" }, { key: "cost", label: "By Anthro Cost" }].map((opt) => (<button key={opt.key} onClick={() => setSortBy(opt.key)} style={{ padding: "4px 12px", fontSize: 12, fontWeight: sortBy === opt.key ? 700 : 400, backgroundColor: sortBy === opt.key ? "#374151" : "#fff", color: sortBy === opt.key ? "#fff" : "#555", border: "none", cursor: "pointer" }}>{opt.label}</button>))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 180, borderBottom: "2px solid #333" }}>
        {histogram.map((bucket, i) => (<div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: "#333" }}>{bucket.length || ""}</div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column-reverse" }}>
            {bucket.map((d, j) => (<div key={j} title={d.name + ": " + fmt(sortBy === "ftr" ? d.anthroFtr : d.anthroCost)} style={{ width: "100%", height: Math.max(2, 160 / maxBucket), backgroundColor: d.csvTitle && d.csvTitle.toLowerCase().includes("postdoc") ? "#d97706" : rankColors[d.rank] || "#999", backgroundImage: d.csvTitle && d.csvTitle.toLowerCase().includes("postdoc") ? "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 6px)" : "none", borderTop: "1px solid rgba(255,255,255,0.3)", cursor: "pointer" }}></div>))}
          </div>
        </div>))}
      </div>
      <div style={{ display: "flex", gap: 3 }}>{bucketLabels.map((l, i) => (<div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#888", marginTop: 4, transform: "rotate(-30deg)", transformOrigin: "top center", height: 30 }}>{l}</div>))}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 12px" }}><h3 style={{ fontSize: 15, margin: 0 }}>All Faculty, Lowest to Highest</h3></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {withSalary.map((d, i) => { const val = sortBy === "ftr" ? d.anthroFtr : (d.anthroCost || 0); const maxVal = Math.max(...withSalary.map((x) => (sortBy === "ftr" ? x.anthroFtr : (x.anthroCost || 0))), 1); const w = Math.max(2, (val / maxVal) * 100); const isPostdoc = d.csvTitle && d.csvTitle.toLowerCase().includes("postdoc");
          return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <div style={{ width: 150, textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#555" }}>{d.name}{d.anthroFraction != null && d.anthroFraction < 1 && <span style={{ color: "#f59e0b", fontSize: 10, marginLeft: 3 }}>({pct(d.anthroFraction)})</span>}{isPostdoc && <span style={{ color: "#d97706", fontSize: 10, marginLeft: 2 }}>\u2605</span>}</div>
            <div style={{ flex: 1, position: "relative", height: 18 }}><div style={{ position: "absolute", left: 0, top: 2, height: 14, width: w + "%", backgroundColor: isPostdoc ? "#d97706" : (rankColors[d.rank] || "#999"), borderRadius: 2, opacity: sortBy === "cost" && d.anthroFraction < 1 ? 0.5 : 0.85, backgroundImage: isPostdoc ? "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 6px)" : "none" }}></div></div>
            <div style={{ width: 80, textAlign: "right", flexShrink: 0, fontVariantNumeric: "tabular-nums", color: "#333", fontWeight: 500 }}>{fmt(val)}</div>
          </div>);
        })}
      </div>
    </div>
  );
}