const fs = require('fs');

let file = fs.readFileSync('src/constants.ts', 'utf8');

// Undo all the global `];\n};` replaces
file = file.replace(/\];\n\};\n/g, '];\n');
file = file.replace(/\];\n\};/g, '];\n');

// Now explicitly add `};` at the end of the `getInitialColumns` block
file = file.replace(/  \{ id: 'release', title: t\.playtestingRelease \},\n\];\n/, "  { id: 'release', title: t.playtestingRelease },\n];\n};\n");

fs.writeFileSync('src/constants.ts', file);
