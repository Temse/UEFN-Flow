const fs = require('fs');
let code = fs.readFileSync('src/lib/mockApi.ts', 'utf8');

code = code.replace("  }\n});\n", "  }\n} });\n");

fs.writeFileSync('src/lib/mockApi.ts', code);
