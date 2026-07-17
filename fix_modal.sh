awk '
/          <\/button>/ {
    if (seen_btn_close) {
        # Skip the extra </button>
        seen_btn_close = 0
        next
    }
    seen_btn_close = 1
}
{ print }
' src/components/ProjectSettingsModal.tsx > src/components/ProjectSettingsModal.tsx.tmp
mv src/components/ProjectSettingsModal.tsx.tmp src/components/ProjectSettingsModal.tsx
