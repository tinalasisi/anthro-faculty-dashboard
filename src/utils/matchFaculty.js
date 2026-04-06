import { exactOverrides, firstNameAliases } from "../data/nameMappings";

export function getLastNameVariants(facultyName) {
  const clean = facultyName.replace(/\./g, "").toLowerCase();
  const parts = clean.split(/\s+/);
  const last = parts[parts.length - 1];
  const variants = new Set();
  variants.add(last);
  variants.add(facultyName.split(/\s+/).pop().toLowerCase());
  variants.add(last.replace(/'/g, ""));
  if (last.includes("-")) last.split("-").forEach((p) => variants.add(p));
  if (parts.length >= 3) {
    const compound = parts[parts.length - 2] + " " + last;
    variants.add(compound);
    const deacc = parts[parts.length - 2].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (deacc !== parts[parts.length - 2]) variants.add(deacc + " " + last);
  }
  return [...variants];
}

export function firstNameScore(facultyFirst, csvFirstFull) {
  const csvParts = csvFirstFull.toLowerCase().split(/\s+/).map((s) => s.replace(/[^a-z'-]/g, ""));
  const ff = facultyFirst.toLowerCase();
  const aliases = firstNameAliases[ff] || [ff];
  for (const a of aliases) { for (const c of csvParts) { if (c === a) return 10; } }
  for (const a of aliases) { for (const c of csvParts) { const m = Math.min(a.length, c.length); if (m >= 4 && c.substring(0, 4) === a.substring(0, 4)) return 8; } }
  for (const a of aliases) { if (csvFirstFull.toLowerCase().includes(a)) return 6; }
  for (const a of aliases) { for (const c of csvParts) { const m = Math.min(3, a.length, c.length); if (m >= 3 && c.substring(0, 3) === a.substring(0, 3)) return 5; } }
  return 0;
}

export function smartMatch(facultyName, rows) {
  const override = exactOverrides[facultyName];
  if (override) {
    const m = rows.filter((r) => (r.NAME || "").toLowerCase().includes(override));
    if (m.length > 0) return m;
  }
  const clean = facultyName.replace(/\./g, "").toLowerCase();
  const parts = clean.split(/\s+/);
  const first = parts[0];
  const lastVariants = getLastNameVariants(facultyName);

  const lastMatches = rows.filter((row) => {
    const n = (row.NAME || "").toLowerCase();
    const ci = n.indexOf(",");
    if (ci === -1) return false;
    const csvLast = n.substring(0, ci).trim();
    for (const v of lastVariants) {
      if (csvLast === v || csvLast.replace(/[^a-z]/g, "") === v.replace(/[^a-z]/g, "") || csvLast.replace(/ jr$/, "").trim() === v) return true;
    }
    return false;
  });
  if (lastMatches.length === 0) return [];

  const scored = lastMatches.map((row) => {
    const n = (row.NAME || "").toLowerCase();
    const csvFirstFull = n.substring(n.indexOf(",") + 1).trim();
    return { row, score: firstNameScore(first, csvFirstFull) };
  });
  const maxScore = Math.max(...scored.map((s) => s.score));
  if (maxScore === 0) return [];
  const best = scored.filter((s) => s.score === maxScore).map((s) => s.row);

  const anthroRow = best.find((r) => (r.APPOINTING_DEPT || "").toLowerCase().includes("anthro"));
  if (anthroRow) {
    const exact = (anthroRow.NAME || "").trim().toLowerCase();
    const all = rows.filter((r) => (r.NAME || "").trim().toLowerCase() === exact);
    if (all.length > 0) return all;
  }
  return best;
}