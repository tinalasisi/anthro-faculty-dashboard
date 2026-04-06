import { useState } from "react";
import _ from "lodash";
import { ranks } from "../data/faculty";

const fmt = (v) => { if (v == null) return "\u2014"; const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[,$]/g, "")); return isNaN(n) || n === 0 ? "\u2014" : "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); };
const pct = (v) => { const n = parseFloat(v); return isNaN(n) ? "\u2014" : Math.round(n * 100) + "%"; };

export default function SalariesTab({ salaryData, loading, error }) {
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const handleSort = (col) => { if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc")); else { setSortCol(col); setSortDir(col === "salary" || col === "cost" ? "desc" : "asc"); } };
  const arrow = (col) => sortCol === col ? (sortDir === "asc" ? " \u25b2" : " \u25bc") : "";
  const sorted = salaryData ? _.orderBy(salaryData, [(d) => { if (sortCol === "name") return d.name; if (sortCol === "rank") return ranks.indexOf(d.rank); if (sortCol === "salary") return d.anthroFtr || 0; if (sortCol === "fraction") return d.anthroFraction || 0; if (sortCol === "cost") return d.anthroCost || 0; return d.name; }], [sortDir]) : [];

  if (loading) return <p style={{ color: "#666" }}>Loading salary data...</p>;
  if (error) return <p style={{ color: "#ef4444" }}>Error: {error}</p>;
  if (!salaryData) return null;

  return (
    <div>
      <p style={{ fontSize: 13, color: "#666", margin: "0 0 16px" }}>Matched {salaryData.filter((d) => d.matchCount > 0).length} of {salaryData.length} faculty. Click headers to sort.</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 800 }}>
          <thead><tr style={{ borderBottom: "2px solid #333", cursor: "pointer", userSelect: "none" }}>
            <th onClick={() => handleSort("name")} style={{ textAlign: "left", padding: "8px 8px", whiteSpace: "nowrap" }}>Name{arrow("name")}</th>
            <th onClick={() => handleSort("rank")} style={{ textAlign: "left", padding: "8px 8px", whiteSpace: "nowrap" }}>Rank{arrow("rank")}</th>
            <th onClick={() => handleSort("salary")} style={{ textAlign: "right", padding: "8px 8px", whiteSpace: "nowrap" }}>Anthro FTR{arrow("salary")}</th>
            <th onClick={() => handleSort("fraction")} style={{ textAlign: "center", padding: "8px 8px", whiteSpace: "nowrap" }}>Anthro Frac{arrow("fraction")}</th>
            <th onClick={() => handleSort("cost")} style={{ textAlign: "right", padding: "8px 8px", whiteSpace: "nowrap", background: "#fef3c7" }}>Anthro Cost{arrow("cost")}</th>
            <th style={{ textAlign: "left", padding: "8px 8px" }}>Other Appointments</th>
          </tr></thead>
          <tbody>{sorted.map((d, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "8px 8px", fontWeight: 500 }}>{d.name}{d.courtesy && <span style={{ marginLeft: 6, fontSize: 11, color: "#8b5cf6", fontWeight: 600 }}>(courtesy)</span>}{d.csvTitle && d.csvTitle.toLowerCase().includes("postdoc") && <span style={{ marginLeft: 6, fontSize: 10, color: "#d97706", fontWeight: 600 }}>(+postdoc)</span>}</td>
              <td style={{ padding: "8px 8px", color: "#666" }}>{d.rank}</td>
              <td style={{ padding: "8px 8px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{d.anthroFtr ? fmt(d.anthroFtr) : <span style={{ color: "#ccc" }}>not found</span>}</td>
              <td style={{ padding: "8px 8px", textAlign: "center" }}>{d.anthroFraction != null ? <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 12, fontWeight: 600, backgroundColor: d.anthroFraction >= 1 ? "#10b98120" : "#f59e0b20", color: d.anthroFraction >= 1 ? "#10b981" : "#f59e0b" }}>{pct(d.anthroFraction)}</span> : <span style={{ color: "#ccc" }}>\u2014</span>}</td>
              <td style={{ padding: "8px 8px", textAlign: "right", fontVariantNumeric: "tabular-nums", background: "#fffbeb", fontWeight: 600 }}>{d.anthroCost ? fmt(d.anthroCost) : <span style={{ color: "#ccc" }}>\u2014</span>}</td>
              <td style={{ padding: "8px 8px" }}>{d.otherDepts.length > 0 ? d.otherDepts.map((o, j) => <span key={j} style={{ display: "inline-block", marginRight: 4, marginBottom: 2, padding: "2px 8px", borderRadius: 10, fontSize: 11, backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", color: "#555" }}>{o.dept} ({pct(o.fraction)}) {fmt(o.ftr)}</span>) : <span style={{ color: "#ccc", fontSize: 12 }}>100% Anthro</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}