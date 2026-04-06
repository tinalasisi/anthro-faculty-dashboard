import { facultyData, subfields, ranks, sfIdx } from "../data/faculty";

const colors = { Sociocultural: "#6366f1", Linguistic: "#f59e0b", Biological: "#10b981", Archaeological: "#ef4444" };

function getPeople(sf) {
  const b = {}; ranks.forEach((r) => { b[r] = []; });
  facultyData.forEach((row) => { if (row[6] === "Yes") return; if (row[sfIdx[sf]] === "Yes") b[row[1]].push(row[0]); });
  return b;
}

export default function SubfieldTab({ tab }) {
  const people = getPeople(tab);
  const color = colors[tab];
  const total = ranks.reduce((s, r) => s + people[r].length, 0);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color }}>{total}</span>
        <span style={{ fontSize: 14, color: "#666" }}>faculty in {tab} Anthropology</span>
      </div>
      {ranks.map((rank) => {
        const names = people[rank]; if (!names.length) return null;
        return (<div key={rank} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color, padding: "2px 10px", borderRadius: 12, backgroundColor: color + "15" }}>{rank}</span>
            <span style={{ fontSize: 13, color: "#999" }}>({names.length})</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 4 }}>
            {names.sort().map((n) => (<span key={n} style={{ fontSize: 13, padding: "5px 12px", borderRadius: 6, backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb" }}>{n}</span>))}
          </div>
        </div>);
      })}
    </div>
  );
}