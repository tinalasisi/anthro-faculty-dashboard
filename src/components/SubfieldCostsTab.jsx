import _ from "lodash";
import { subfields, ranks } from "../data/faculty";

const colors = { Sociocultural: "#6366f1", Linguistic: "#f59e0b", Biological: "#10b981", Archaeological: "#ef4444" };
const fmt = (v) => { if (v == null) return "\u2014"; const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[,$]/g, "")); return isNaN(n) || n === 0 ? "\u2014" : "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); };
const pct = (v) => { const n = parseFloat(v); return isNaN(n) ? "\u2014" : Math.round(n * 100) + "%"; };

export default function SubfieldCostsTab({ salaryData, loading }) {
  if (loading) return <p>Loading...</p>;
  if (!salaryData) return null;
  const nonCourtesy = salaryData.filter((d) => !d.courtesy);

  const sfData = subfields.map((sf) => {
    const people = nonCourtesy.filter((d) => d.subfields.includes(sf));
    const withSalary = people.filter((d) => d.anthroCost && d.anthroCost > 0);
    const totalCost = _.sumBy(withSalary, "anthroCost");
    const totalFte = _.sumBy(people.filter((d) => d.anthroFraction != null), "anthroFraction");
    const fullTime = people.filter((d) => d.anthroFraction != null && d.anthroFraction >= 1).length;
    const partial = people.filter((d) => d.anthroFraction != null && d.anthroFraction < 1).length;
    const avgCost = withSalary.length > 0 ? totalCost / withSalary.length : 0;
    return { sf, people, withSalary, totalCost, totalFte, fullTime, partial, avgCost, headcount: people.length };
  });
  const maxCost = Math.max(...sfData.map((d) => d.totalCost), 1);
  const grandTotal = _.sumBy(sfData, "totalCost");

  return (
    <div>
      <p style={{ fontSize: 13, color: "#666", margin: "0 0 20px" }}>Cost to dept = FTR \u00d7 Anthro fraction. Faculty in multiple subfields counted in each. Courtesy excluded.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
        {sfData.map((d) => (<div key={d.sf} style={{ padding: 16, borderRadius: 10, border: "2px solid " + colors[d.sf] + "40", backgroundColor: colors[d.sf] + "08" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors[d.sf], marginBottom: 8 }}>{d.sf}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#111" }}>{fmt(d.totalCost)}</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>total dept cost</div>
          <div style={{ marginTop: 10, fontSize: 12, color: "#555", lineHeight: 1.6 }}>
            <div>{d.headcount} faculty ({d.fullTime} full, {d.partial} partial)</div>
            <div>{d.totalFte.toFixed(1)} FTE in Anthro</div>
            <div>Avg cost: {fmt(d.avgCost)}</div>
          </div>
        </div>))}
      </div>
      <h3 style={{ fontSize: 15, margin: "0 0 12px" }}>Total Department Cost by Subfield</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {sfData.map((d) => (<div key={d.sf} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 120, textAlign: "right", fontSize: 13, fontWeight: 600, color: colors[d.sf] }}>{d.sf}</div>
          <div style={{ flex: 1, position: "relative", height: 28 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 28, borderRadius: 4, width: (d.totalCost / maxCost * 100) + "%", backgroundColor: colors[d.sf], opacity: 0.75 }}></div>
            <div style={{ position: "absolute", left: 8, top: 0, height: 28, lineHeight: "28px", fontSize: 12, fontWeight: 600, color: "#fff" }}>{fmt(d.totalCost)}</div>
          </div>
        </div>))}
      </div>
      <h3 style={{ fontSize: 15, margin: "0 0 12px" }}>Faculty Detail by Subfield</h3>
      {sfData.map((d) => (<div key={d.sf} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: colors[d.sf], marginBottom: 8 }}>{d.sf} \u2014 {d.headcount} faculty, {fmt(d.totalCost)} total cost</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {_.orderBy(d.withSalary, ["anthroCost"], ["desc"]).map((p, i) => {
            const maxP = d.withSalary.length > 0 ? Math.max(...d.withSalary.map((x) => x.anthroCost)) : 1;
            return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <div style={{ width: 150, textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#555" }}>{p.name}</div>
              <div style={{ flex: 1, position: "relative", height: 16 }}><div style={{ position: "absolute", left: 0, top: 1, height: 14, borderRadius: 2, width: (p.anthroCost / maxP * 100) + "%", backgroundColor: colors[d.sf], opacity: p.anthroFraction < 1 ? 0.4 : 0.7 }}></div></div>
              <div style={{ width: 55, textAlign: "center", flexShrink: 0 }}>{p.anthroFraction < 1 ? <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>{pct(p.anthroFraction)}</span> : <span style={{ fontSize: 11, color: "#10b981" }}>100%</span>}</div>
              <div style={{ width: 75, textAlign: "right", flexShrink: 0, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{fmt(p.anthroCost)}</div>
            </div>);
          })}
        </div>
      </div>))}
      <div style={{ marginTop: 20, padding: 16, backgroundColor: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 13, color: "#666" }}>Note: Faculty in multiple subfields (e.g., Hull, Keane, Lemon) are counted in each. Grand total across subfields ({fmt(grandTotal)}) double-counts some costs.</div>
      </div>
    </div>
  );
}