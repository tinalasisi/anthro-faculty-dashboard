import { useState, useEffect } from "react";
import Papa from "papaparse";
import _ from "lodash";
import { facultyData, subfields, ranks, sfIdx } from "./data/faculty";
import { smartMatch } from "./utils/matchFaculty";
import SummaryTab from "./components/SummaryTab";
import SubfieldTab from "./components/SubfieldTab";
import CourtesyTab from "./components/CourtesyTab";
import SalariesTab from "./components/SalariesTab";
import DistributionTab from "./components/DistributionTab";
import SubfieldCostsTab from "./components/SubfieldCostsTab";

const colors = { Sociocultural: "#6366f1", Linguistic: "#f59e0b", Biological: "#10b981", Archaeological: "#ef4444", "By Courtesy": "#8b5cf6" };
const parseMoney = (v) => { const n = parseFloat(String(v).replace(/[,$]/g, "")); return isNaN(n) ? 0 : n; };

function getTally() {
  const r = {}; subfields.forEach((sf) => { r[sf] = {}; ranks.forEach((rk) => { r[sf][rk] = 0; }); });
  facultyData.forEach((row) => { if (row[6] === "Yes") return; subfields.forEach((sf) => { if (row[sfIdx[sf]] === "Yes") r[sf][row[1]]++; }); });
  return r;
}

const allTabs = ["Summary", ...subfields, "By Courtesy", "Salaries", "Distribution", "Subfield Costs"];

export default function App() {
  const [tab, setTab] = useState("Summary");
  const [highlight, setHighlight] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = getTally();

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/salary_record_2025.csv");
        const raw = await response.text();
        const parsed = Papa.parse(raw, { header: true, dynamicTyping: true, skipEmptyLines: true });
        const rows = parsed.data;
        const matched = facultyData.map((f) => {
          const name = f[0], rank = f[1], courtesy = f[6] === "Yes";
          const sfs = []; subfields.forEach((sf) => { if (f[sfIdx[sf]] === "Yes") sfs.push(sf); });
          const matches = smartMatch(name, rows);
          const anthroRows = matches.filter((r) => (r.APPOINTING_DEPT || "").toLowerCase().includes("anthro"));
          const otherRows = matches.filter((r) => !(r.APPOINTING_DEPT || "").toLowerCase().includes("anthro"));
          const anthroFtr = anthroRows.length > 0 ? parseMoney(anthroRows[0].APPT_ANNUAL_FTR) : null;
          const anthroFraction = anthroRows.length > 0 ? anthroRows[0].APPT_FRACTION : null;
          const anthroCost = (anthroFtr && anthroFraction != null) ? anthroFtr * anthroFraction : anthroFtr;
          const csvTitle = anthroRows.length > 0 ? (anthroRows[0].APPOINTMENT_TITLE || "") : "";
          const otherDepts = otherRows.map((r) => ({ dept: (r.APPOINTING_DEPT || "").trim(), fraction: r.APPT_FRACTION, title: (r.APPOINTMENT_TITLE || "").trim(), ftr: parseMoney(r.APPT_ANNUAL_FTR) }));
          return { name, rank, courtesy, subfields: sfs, anthroFtr, anthroFraction, anthroCost, csvTitle, otherDepts, matchCount: matches.length };
        });
        setSalaryData(matched);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: "20px", maxWidth: 960 }}>
      <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>Anthropology Faculty by Subfield & Rank</h2>
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", marginBottom: 20, overflowX: "auto" }}>
        {allTabs.map((tb) => { const active = tab === tb; const c = colors[tb] || "#374151"; return (<button key={tb} onClick={() => setTab(tb)} style={{ padding: "8px 12px", fontSize: 13, fontWeight: active ? 700 : 500, color: active ? c : "#6b7280", background: "none", border: "none", borderBottom: active ? "3px solid " + c : "3px solid transparent", cursor: "pointer", whiteSpace: "nowrap", marginBottom: -2 }}>{tb}</button>); })}
      </div>
      {tab === "Summary" && <SummaryTab t={t} highlight={highlight} setHighlight={setHighlight} />}
      {subfields.includes(tab) && <SubfieldTab tab={tab} />}
      {tab === "By Courtesy" && <CourtesyTab />}
      {tab === "Salaries" && <SalariesTab salaryData={salaryData} loading={loading} error={error} />}
      {tab === "Distribution" && <DistributionTab salaryData={salaryData} loading={loading} />}
      {tab === "Subfield Costs" && <SubfieldCostsTab salaryData={salaryData} loading={loading} />}
    </div>
  );
}