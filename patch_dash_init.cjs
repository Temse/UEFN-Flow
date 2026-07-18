const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

code = code.replace("import { INITIAL_COLUMNS, getTemplateTasks } from '../constants';", "import { getInitialColumns, getTemplateTasks } from '../constants';");

// Inside handleCreateProject:
// let tasks = getTemplateTasks(template);
code = code.replace("let tasks = getTemplateTasks(template);", "let tasks = getTemplateTasks(template, lang);");

// let columns = [...INITIAL_COLUMNS];
code = code.replace(/let columns = \[\.\.\.INITIAL_COLUMNS\];/g, "let columns = getInitialColumns(lang);");
code = code.replace(/columns: INITIAL_COLUMNS/g, "columns: getInitialColumns(lang)");
code = code.replace(/columns = INITIAL_COLUMNS/g, "columns = getInitialColumns(lang)");
code = code.replace(/const baseColumns = INITIAL_COLUMNS/g, "const baseColumns = getInitialColumns(lang)");
code = code.replace(/\[\.\.\.INITIAL_COLUMNS\]/g, "getInitialColumns(lang)");
code = code.replace(/INITIAL_COLUMNS/g, "getInitialColumns(lang)");

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log("Patched INITIAL_COLUMNS");
