# Anthropology Faculty → Salary CSV Name Mappings

Last updated: April 2026

## Tricky Matches (Exact Overrides Required)

| Faculty Name | CSV Name | Notes |
|---|---|---|
| Tina Lasisi | Lasisi, Oladuni | Different first name (goes by Tina) |
| Maureen Devlin | Hamalainen, Maureen Devlin | Different last name in CSV |
| Andrew J. Marshall | Marshall, Andrew John | Middle initial → full middle name |
| Elizabeth F.S. Roberts | Roberts, Elizabeth FS | Initials without periods |
| Webb Keane | Keane Jr, Edward Webb | Has "Jr" suffix; first name is Edward, goes by Webb |
| Mike McGovern | McGovern, Michael | Goes by Mike, CSV has Michael |
| Luciana Chamorro | Chamorro Elizondo, Luciana Fernanda | Compound last name in CSV |
| Julio Villa-Palomino | Villa-Palomino, Julio Cesar | Dual title: ASST PROF/POSTDOC SCH-MSF |

## Special Characters in Names

| Faculty Name | Notes |
|---|---|
| John O'Shea | Apostrophe in last name - do NOT strip when searching |
| Liliana Cortés Ortiz | Accented é; compound last name |
| Hakem Al-Rustom | Hyphenated last name |
| Sherina Feliciano-Santos | Hyphenated last name |
| Alicia Ventresca-Miller | Hyphenated; search "Ventresca" as fallback |
| Giulia Saltini Semerari | Compound (non-hyphenated) last name |

## Matching Strategy

1. Check exact overrides first
2. Match last name (preserve apostrophes, handle hyphens/compounds)
3. Score first name: exact (10) > 4+ char prefix (8) > substring (6) > 3 char prefix (5)
4. Lock onto anthro row's exact CSV name for other-dept lookups
5. Nickname aliases: Mike↔Michael, Webb↔Edward
