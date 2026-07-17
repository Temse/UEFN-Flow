const Database = require('better-sqlite3');
const db = new Database('uefn_flow.db');
console.log(db.prepare("SELECT id, name FROM projects").all());
