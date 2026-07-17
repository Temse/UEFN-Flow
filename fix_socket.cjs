const fs = require('fs');
let pv = fs.readFileSync('src/components/ProjectView.tsx', 'utf8');
pv = pv.replace("import { io } from 'socket.io-client';", "import io from 'socket.io-client';");
fs.writeFileSync('src/components/ProjectView.tsx', pv);
