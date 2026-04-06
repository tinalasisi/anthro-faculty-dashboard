import { facultyData, subfields, sfIdx } from "../data/faculty";

const colors = { Sociocultural: "#6366f1", Linguistic: "#f59e0b", Biological: "#10b981", Archaeological: "#ef4444", "By Courtesy": "#8b5cf6" };

function getCourtesy() {
  return facultyData.filter((r) => r[6] === "Yes").map((r) => {
    const s = []; subfields.forEach((sf) => { if (r[sfIdx[sf]] === "Yes") s.push(sf); });
    return { name: r[0], rank: r[1], subfields: s };
  });
}

export default function CourtesyTab() {
  const courtesy = getCourtesy();
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: colors["By Courtesy"] }}>{courtesy.length}</span>
        <span style={{ fontSize: 14, color: "#666" }}>faculty with courtesy appointments</span>
      </div>
      {courtesy.map((p, i) => (
        <div key={i} style={{ padding: "12px 16px", marginBottom: 8, borderRadius: 8, backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
            {p.rank} \u00b7 {p.subfields.map((sf) => (<span key={sf} style={{ display: "inline-block", marginLeft: 4, padding: "1px 8px", borderRadius: 10, fontSize: 12, backgroundColor: colors[sf] + "15", color: colors[sf], fontWeight: 600 }}>{sf}</span>))}
          </div>
        </div>
      ))}
    </div>
  );
}