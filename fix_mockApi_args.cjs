const fs = require('fs');
let code = fs.readFileSync('src/lib/mockApi.ts', 'utf8');

code = code.replace("return originalFetch(...args);", "return originalFetch(args[0], args[1]);");

fs.writeFileSync('src/lib/mockApi.ts', code);
