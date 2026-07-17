const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const regex = /\{\/\* Language Picker \*\/\}.*?\{\/\* Theme Picker \*\/\}/s;

const replacement = `{/* Language Picker */}
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-ue-text-muted mb-2">
                          {t.languageLabel}
                        </label>
                        <button
                          onClick={() => setShowLanguageSelector(true)}
                          className="w-full bg-ue-bg border border-ue-border hover:border-epic-cyan text-ue-text rounded-lg px-4 py-2 text-sm font-bold transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{lang === 'en' ? '🇺🇸' : lang === 'de' ? '🇩🇪' : lang === 'es' ? '🇪🇸' : lang === 'fr' ? '🇫🇷' : lang === 'it' ? '🇮🇹' : lang === 'pt' ? '🇵🇹' : lang === 'ru' ? '🇷🇺' : lang === 'zh' ? '🇨🇳' : lang === 'ja' ? '🇯🇵' : '🌐'}</span>
                            <span>{lang.toUpperCase()}</span>
                          </div>
                          <span className="text-ue-text-muted text-xs">Change</span>
                        </button>
                      </div>

                      {/* Theme Picker */}`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/Dashboard.tsx', code);
