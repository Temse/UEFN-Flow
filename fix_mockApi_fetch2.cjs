const fs = require('fs');
let code = fs.readFileSync('src/lib/mockApi.ts', 'utf8');

// revert the previous change if it was made
code = code.replace(
  "Object.defineProperty(window, 'fetch', {\n  configurable: true,\n  writable: true,\n  value: async (...args: any[]) => {",
  "const originalFetch = window.fetch;\nwindow.fetch = async (...args) => {"
);

// We can just redefine fetch on globalThis if that works, or window.
// In a browser environment, `window.fetch` is configurable.
// Let's rewrite the whole mockApi fetch part cleanly.
const before = "const originalFetch = window.fetch;\nwindow.fetch = async (...args) => {";
const after = "const originalFetch = window.fetch;\nObject.defineProperty(window, 'fetch', {\n  configurable: true,\n  writable: true,\n  value: async (...args: any[]) => {";

if (code.includes(before)) {
  code = code.replace(before, after);
  // replace the last "};" with "});"
  const lastBracket = code.lastIndexOf("};");
  code = code.substring(0, lastBracket) + "});\n" + code.substring(lastBracket + 2);
}

fs.writeFileSync('src/lib/mockApi.ts', code);
