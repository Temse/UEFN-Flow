const fs = require('fs');
let code = fs.readFileSync('src/lib/mockApi.ts', 'utf8');

code = code.replace(
  "const originalFetch = window.fetch;\nwindow.fetch = async (...args) => {",
  `const originalFetch = window.fetch;
Object.defineProperty(window, 'fetch', {
  configurable: true,
  writable: true,
  value: async (...args: any[]) => {`
);

// also we need to close it differently maybe? Let's check how the file ends.
// Wait, replacing the start is enough, it just changes the assignment to defineProperty

// Wait, if I do that, the end of the block would be `};` which is fine for `value: async (...) => { ... };`? No, it would be `} \n});`
// Actually, `window.fetch = async (...args) => { ... };` -> ends with `};`
