const fs = require('fs');

let file = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// add searchQuery state
file = file.replace(/const \[showArchived, setShowArchived\] = useState\(false\);/, "const [showArchived, setShowArchived] = useState(false);\n  const [searchQuery, setSearchQuery] = useState('');");

// add search bar
const searchBarHtml = `        <div className="mb-12 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">
              {t.dashboardSubtitle}
            </h1>
            <p className="text-ue-text-muted">
              {t.activeProjectsStats}
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ue-text-muted" size={18} />
            <input
              type="text"
              placeholder={t.searchProjects || "Search projects..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ue-panel/50 border border-ue-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-epic-cyan text-ue-text placeholder-ue-text-muted/50"
            />
          </div>
        </div>`;

file = file.replace(/<div className="mb-12 flex justify-between items-end">\s*<div>\s*<h1 className="text-4xl font-black mb-2 tracking-tight">\s*\{t\.dashboardSubtitle\}\s*<\/h1>\s*<p className="text-ue-text-muted">\s*\{t\.activeProjectsStats\}\s*<\/p>\s*<\/div>\s*<\/div>/, searchBarHtml);

// update filtering logic
file = file.replace(/\.filter\(\(p\) => \(showArchived \? p\.archived : !p\.archived\)\)/, `.filter((p) => (showArchived ? p.archived : !p.archived))\n                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))`);

fs.writeFileSync('src/components/Dashboard.tsx', file);
