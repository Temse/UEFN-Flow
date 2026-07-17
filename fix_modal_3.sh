echo '          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-ue-text-muted hover:text-ue-text cursor-pointer">
              {lang === "en" ? "Cancel" : "Abbrechen"}
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-epic-cyan text-ue-bg font-bold rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              {lang === "en" ? "Save" : "Speichern"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}' >> src/components/ProjectSettingsModal.tsx
