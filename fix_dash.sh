sed -i -e '623a\
              {/* Language Toggle EN/DE */}\
              <div className="flex items-center p-1 bg-ue-panel border border-ue-border rounded-xl">\
                <button\
                  onClick={() => setLang('\''en'\'')}\
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${lang === '\''en'\'' ? '\''bg-epic-cyan text-ue-bg shadow-sm'\'' : '\''text-ue-text-muted hover:text-ue-text'\''}`}\
                >\
                  EN\
                </button>\
                <button\
                  onClick={() => setLang('\''de'\'')}\
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${lang === '\''de'\'' ? '\''bg-epic-cyan text-ue-bg shadow-sm'\'' : '\''text-ue-text-muted hover:text-ue-text'\''}`}\
                >\
                  DE\
                </button>\
              </div>\
' src/components/Dashboard.tsx
