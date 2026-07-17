const fs = require('fs');

// Revert main.tsx
let main = fs.readFileSync('src/main.tsx', 'utf8');
main = main.replace("import './lib/mockApi';\n", "");
main = main.replace("import './lib/mockApi';", "");
fs.writeFileSync('src/main.tsx', main);

// Revert ProjectView.tsx socket
let pv = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');
pv = pv.replace("import { io } from '../lib/mockSocket';", "import { io } from 'socket.io-client';");
fs.writeFileSync('src/components/ProjectView.tsx', pv);

