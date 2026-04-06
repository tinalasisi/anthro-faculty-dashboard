# UMich Anthropology Faculty Dashboard

An interactive React dashboard for analyzing faculty composition, salary distribution, and departmental costs across the four subfields of the University of Michigan Department of Anthropology.

## Quick Start

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/umich-anthro-dashboard.git
cd umich-anthro-dashboard
npm install
# Place salary_record_2025.csv in public/
npm run dev
\`\`\`

## Features

| Tab | Description |
|-----|-------------|
| **Summary** | Cross-tabulation of faculty counts by rank × subfield |
| **Sociocultural / Linguistic / Biological / Archaeological** | Per-subfield faculty lists grouped by rank |
| **By Courtesy** | Faculty with courtesy appointments (excluded from main counts) |
| **Salaries** | Sortable table: Anthro FTR, appointment fraction, dept cost, other appointments |
| **Distribution** | Histogram + bar chart, toggleable FTR vs Anthro Cost, color-coded by rank |
| **Subfield Costs** | Aggregate cost per subfield: total cost, FTE, headcount, average cost |

## Data

- **Faculty list**: Hardcoded in \`src/data/faculty.js\`
- **Salary CSV**: Place \`salary_record_2025.csv\` in \`public/\` (not committed; ~55K rows)
- **Name mappings**: See \`NAME_MAPPINGS.md\` and \`src/data/nameMappings.js\`

## Key Design Decisions

- **Courtesy appointments** excluded from subfield counts and costs
- **Anthro Cost** = FTR × Anthro fraction (what the dept actually pays)
- **Multi-subfield faculty** counted in each subfield (noted as double-counting)
- **Name matching** uses exact overrides, scored fuzzy matching, and anthro-row locking

## Tech Stack

React 18 · Vite · Papaparse · Lodash
