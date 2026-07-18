const fs = require('fs');
let code = fs.readFileSync('src/constants.ts', 'utf-8');

// Modify export const getTemplateTasks = (template: ProjectTemplate): Task[] => {
code = code.replace(/export const getTemplateTasks = \(template: ProjectTemplate\): Task\[\] => \{/g, "export const getTemplateTasks = (template: ProjectTemplate, lang: string = 'de'): Task[] => {");

// We can just add a simple translation dictionary inside the function or just replace string literals based on lang.
// Let's do something simpler: we'll replace the entire getTemplateTasks body with a generated one that uses a helper.
