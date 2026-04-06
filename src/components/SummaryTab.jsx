import { subfields, ranks } from "../data/faculty";

const colors = { Sociocultural: "#6366f1", Linguistic: "#f59e0b", Biological: "#10b981", Archaeological: "#ef4444" };

export default function SummaryTab({ t, highlight, setHighlight }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
      <thead><tr style={{ borderBottom: "2px solid #333" }}>
        <th style={{ textAlign: "left", padding: "8px 12px" }}>Rank</th>
        {subfields.map((sf) => (<th key={sf} style={{ textAlign: "center", padding: "8px 12px", color: colors[sf], fontWeight: 600 }}>{sf}</th>))}
      </tr></thead>
      <tbody>
        {ranks.map((rank) => (
          <tr key={rank} onMouseEnter={() => setHighlight(rank)} onMouseLeave={() => setHighlight(null)} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: highlight === rank ? "#f8fafc" : "transparent" }}>
            <td style={{ padding: "10px 12px", fontWeight: 500 }}>{rank}</td>
            {subfields.map((sf) => (<td key={sf} style={{ textAlign: "center", padding: "10px 12px" }}><span style={{ display: "inline-block", minWidth: 28, height: 28, lineHeight: "28px", borderRadius: 6, backgroundColor: t[sf][rank] > 0 ? colors[sf] + "20" : "transparent", color: t[sf][rank] > 0 ? colors[sf] : "#ccc", fontWeight: t[sf][rank] > 0 ? 700 : 400, fontSize: 15 }}>{t[sf][rank]}</span></td>))}
          </tr>
        ))}
        <tr style={{ borderTop: "2px solid #333", fontWeight: 700 }}>
          <td style={{ padding: "10px 12px" }}>Total</td>
          {subfields.map((sf) => { const total = ranks.reduce((s, r) => s + t[sf][r], 0); return <td key={sf} style={{ textAlign: "center", padding: "10px 12px", color: colors[sf] }}>{total}</td>; })}
        </tr>
      </tbody>
    </table>
  );
}