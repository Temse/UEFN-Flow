awk '
/<div className="p-4 border-t border-ue-border bg-ue-bg\/30 flex justify-end gap-3 shrink-0">/ {
    print "        <div className=\"p-4 border-t border-ue-border bg-ue-bg/30 flex justify-between items-center shrink-0\">"
    print "          <div>"
    print "            {onArchive && ("
    print "              <button "
    print "                onClick={() => { onArchive(); onClose(); }}"
    print "                className=\"flex items-center gap-2 px-4 py-2 text-sm font-bold text-ue-text-muted hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all cursor-pointer\""
    print "              >"
    print "                <Archive size={16} />"
    print "                {lang === \"en\" ? (project.archived ? \"Unarchive\" : \"Archive\") : (project.archived ? \"Wiederherstellen\" : \"Archivieren\")}"
    print "              </button>"
    print "            )}"
    print "          </div>"
    print "          <div className=\"flex items-center gap-3\">"
    next
}
/          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-ue-text-muted hover:text-ue-text cursor-pointer">/ {
    print "            <button onClick={onClose} className=\"px-4 py-2 text-sm font-bold text-ue-text-muted hover:text-ue-text cursor-pointer\">"
    next
}
/          <button / {
    if (seen_save) {
        print $0
    } else {
        seen_save = 1
        print "            <button "
    }
    next
}
/            {lang === '"'"'en'"'"' \? '"'"'Save'"'"' : '"'"'Speichern'"'"'}/ {
    print "              {lang === \"en\" ? \"Save\" : \"Speichern\"}"
    print "            </button>"
    print "          </div>"
    next
}
{ print }
' src/components/ProjectSettingsModal.tsx > src/components/ProjectSettingsModal.tsx.tmp
mv src/components/ProjectSettingsModal.tsx.tmp src/components/ProjectSettingsModal.tsx
