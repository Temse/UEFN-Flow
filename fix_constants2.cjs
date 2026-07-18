const fs = require('fs');

let file = fs.readFileSync('src/constants.ts', 'utf8');

// Strip all `};`
file = file.replace(/\};\n/g, '');
file = file.replace(/\};/g, '');

// Now we have no `};` at all. Let's add them where they belong.
// 1. After `getInitialColumns` array ends.
// 2. After `baseTasks` array ends? Actually `baseTasks` is `const baseTasks: Task[] = [ ... ];`
// 3. After `templateSpecificTasks.push(...)`
// 4. End of `getTemplateTasks`

// Let's just recreate constants.ts cleanly.
