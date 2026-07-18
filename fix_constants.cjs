const fs = require('fs');

let file = fs.readFileSync('src/constants.ts', 'utf8');

// Revert the `];\n};`
file = file.replace(/\];\n\};/g, '];');

// Fix getInitialColumns
file = file.replace(/export const getInitialColumns = \(lang: string = 'de'\): Column\[\] => \[/g, "export const getInitialColumns = (lang: Language = 'de'): Column[] => {\n  const t = translations[lang];\n  return [");

file = file.replace(/\{ id: 'pre-production', title: t\.preProduction \},/, "{ id: 'pre-production', title: t.preProduction },");
// Already replaced title in the first patch, but let's make sure the end of array is correct.
// wait, we need to add `];\n};` ONLY for the first array!

fs.writeFileSync('src/constants.ts', file);
