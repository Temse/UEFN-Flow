cat << 'INNER_EOF' > empty_state.txt
              {/* Language selection also visible when no projects exist */}
              <div className="flex justify-center gap-4 mb-6 relative z-10">
                <div className="flex items-center p-1 bg-black/20 border border-ue-border rounded-xl">
                  <button
                    onClick={() => setLang('en')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${lang === 'en' ? 'bg-epic-cyan text-ue-bg shadow-sm' : 'text-ue-text-muted hover:text-ue-text'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLang('de')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${lang === 'de' ? 'bg-epic-cyan text-ue-bg shadow-sm' : 'text-ue-text-muted hover:text-ue-text'}`}
                  >
                    DE
                  </button>
                </div>
                <div className="flex items-center p-1 bg-black/20 border border-ue-border rounded-xl">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${theme === 'light' ? 'bg-epic-cyan text-ue-bg shadow-sm' : 'text-ue-text-muted hover:text-ue-text'}`}
                  >
                    <Sun size={12} /> Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${theme === 'dark' ? 'bg-epic-cyan text-ue-bg shadow-sm' : 'text-ue-text-muted hover:text-ue-text'}`}
                  >
                    <Moon size={12} /> Dark
                  </button>
                </div>
              </div>
INNER_EOF

sed -i -e '/{\/\* Language selection also visible when no projects exist \*\/}/,+8c\
'"$(cat empty_state.txt | sed 's/$/\\/')"'' src/components/Dashboard.tsx
sed -i -e 's/\\$//' src/components/Dashboard.tsx
