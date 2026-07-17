const fs = require('fs');
let code = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');
code = code.replace("import io from 'socket.io-client';", "import { io } from '../lib/mockSocket';");
fs.writeFileSync('src/components/ProjectView.tsx', code);
