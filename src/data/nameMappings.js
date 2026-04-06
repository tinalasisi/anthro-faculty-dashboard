/**
 * Name matching configuration for linking faculty names to salary CSV records.
 * See NAME_MAPPINGS.md for full documentation.
 */

export const exactOverrides = {
  "Tina Lasisi": "lasisi,",
  "Maureen Devlin": "hamalainen,maureen",
  "Andrew J. Marshall": "marshall, andrew john",
  "Elizabeth F.S. Roberts": "roberts, elizabeth",
  "Webb Keane": "keane jr, edward webb",
  "Mike McGovern": "mcgovern, michael",
  "Luciana Chamorro": "chamorro elizondo,luciana",
  "Julio Villa-Palomino": "villa-palomino,julio",
};

export const firstNameAliases = {
  mike: ["michael", "mike"],
  michael: ["michael", "mike"],
  webb: ["webb", "edward"],
  dick: ["richard", "dick"],
  bill: ["william", "bill"],
  bob: ["robert", "bob"],
};