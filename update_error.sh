cat << 'INNER_EOF' > error_msg.txt
        <p className="text-ue-text-muted mb-8 max-w-md mx-auto">
          {error || (lang === 'en' ? 'The requested project does not exist.' : 'Das angeforderte Projekt existiert nicht.')}
        </p>
        <div className="bg-ue-panel/50 border border-ue-border rounded-xl p-4 mb-8 max-w-md mx-auto text-left text-sm text-ue-text-muted">
          <p className="mb-2"><strong>{lang === 'en' ? 'Note for GitHub Pages:' : 'Hinweis für GitHub Pages:'}</strong></p>
          <p>
            {lang === 'en' 
              ? 'If you are using the static GitHub Pages version of this app, projects are only saved in your browser\'s local storage. Links cannot be shared across different devices because there is no backend server.' 
              : 'Wenn du die statische GitHub Pages-Version dieser App verwendest, werden Projekte nur im lokalen Speicher deines Browsers gespeichert. Links können nicht geräteübergreifend geteilt werden, da kein Backend-Server vorhanden ist.'}
          </p>
        </div>
INNER_EOF

sed -i -e '/<p className="text-ue-text-muted mb-8 max-w-md">/,+2c\
'"$(cat error_msg.txt | sed 's/$/\\/')"'' src/components/ProjectView.tsx
sed -i -e 's/\\$//' src/components/ProjectView.tsx
