const fs = require('fs');

const base = {
  dashboardTitle: "UEFN Flow",
  dashboardSubtitle: "Welcome back, Creator. Your projects are waiting.",
  desktopBtn: "Desktop App (.EXE)",
  newProjectBtn: "New Project",
  showArchivedBtn: "Show Archived",
  hideArchivedBtn: "Hide Archived",
  archiveBtn: "Archive",
  unarchiveBtn: "Unarchive",
  noProjectsTitle: "No projects yet",
  noProjectsSubtitle: "Create your first project to get started.",
  startBtn: "Start Now",
  deleteProjectTitle: "Delete Project",
  deleteProjectConfirm: "Are you sure you want to delete this project? All tasks and data will be lost.",
  deleteBtn: "Delete",
  cancelBtn: "Cancel",
  confirmBtn: "Confirm",
  saveBtn: "Save",
  openBtn: "Open",
  projectHealthTitle: "Project Health & Completion",
  activeProjectsStats: "Completion percentages for active UEFN projects.",
  exportBackupBtn: "Export Project Backups (JSON)",
  languageLabel: "Language",
  themeLabel: "Theme",
  themeEpicDark: "Epic Dark",
  themeUefnLight: "UEFN Light",
  projectSettingsTitle: "Project Settings",
  settingsTitle: "Settings",
  progressLabel: "Project Progress",
  projectNameLabel: "Project Name",
  islandCodeLabel: "Island Code",
  thumbnailLabel: "Preview Thumbnail",
  dragDropImage: "Drag and drop an image here",
  orClickUpload: "or click to upload",
  imagePlaceholder: "Or paste image URL...",
  saveTemplateBtn: "Save as Template",
  saveTemplateDesc: "Choose an icon and save current structure as custom template.",
  createTemplateBtn: "Create Template",
  statusLabel: "Status (e.g. Online, Offline, Private)",
  backToDashboard: "Back to Dashboard",
  addTaskBtn: "Add Task",
  addColumnBtn: "Add Column",
  deleteColumnBtn: "Delete Column",
  renameColumnBtn: "Rename Column",
  healthPercent: "Health",
  tasksCompleted: "Tasks Completed"
};

const de = { ...base, dashboardSubtitle: "Willkommen zurück, Creator. Deine Projekte warten.", newProjectBtn: "Neues Projekt", showArchivedBtn: "Archiv zeigen", hideArchivedBtn: "Archiv aus", archiveBtn: "Archivieren", unarchiveBtn: "Wiederherstellen", noProjectsTitle: "Noch keine Projekte", noProjectsSubtitle: "Erstelle dein erstes Projekt, um loszulegen.", startBtn: "Jetzt starten", deleteProjectTitle: "Projekt löschen", deleteProjectConfirm: "Bist du sicher, dass du dieses Projekt unwiderruflich löschen möchtest? Alle Aufgaben und Daten gehen verloren.", deleteBtn: "Löschen", cancelBtn: "Abbrechen", confirmBtn: "Bestätigen", saveBtn: "Speichern", openBtn: "Öffnen", projectHealthTitle: "Projekt-Gesundheit & Abschluss", activeProjectsStats: "Abschluss-Prozentsätze für aktive UEFN-Projekte.", exportBackupBtn: "Projekt-Backup exportieren (JSON)", languageLabel: "Sprache", themeLabel: "Design", projectSettingsTitle: "Projekt-Einstellungen", settingsTitle: "Einstellungen", progressLabel: "Projektfortschritt", projectNameLabel: "Projektname", islandCodeLabel: "Island Code", thumbnailLabel: "Vorschaubild", dragDropImage: "Bild hierhin ziehen", orClickUpload: "oder klicken zum Hochladen", imagePlaceholder: "Oder Bild-URL einfügen...", saveTemplateBtn: "Als Vorlage speichern", saveTemplateDesc: "Wähle ein Symbol und speichere die aktuelle Struktur als Vorlage.", createTemplateBtn: "Vorlage erstellen", statusLabel: "Status (z. B. Online, Offline, Privat)", backToDashboard: "Zurück zum Dashboard", addTaskBtn: "Aufgabe hinzufügen", addColumnBtn: "Spalte hinzufügen", deleteColumnBtn: "Spalte löschen", renameColumnBtn: "Spalte umbenennen", healthPercent: "Gesundheit", tasksCompleted: "Aufgaben abgeschlossen" };
const es = { ...base, dashboardSubtitle: "Bienvenido de nuevo, Creador.", newProjectBtn: "Nuevo Proyecto", showArchivedBtn: "Mostrar Archivados", hideArchivedBtn: "Ocultar Archivados", archiveBtn: "Archivar", unarchiveBtn: "Desarchivar", noProjectsTitle: "Sin proyectos", deleteBtn: "Eliminar", cancelBtn: "Cancelar", confirmBtn: "Confirmar", saveBtn: "Guardar", openBtn: "Abrir", languageLabel: "Idioma", themeLabel: "Tema" };
const fr = { ...base, dashboardSubtitle: "Bon retour, Créateur.", newProjectBtn: "Nouveau Projet", showArchivedBtn: "Afficher les archives", hideArchivedBtn: "Masquer les archives", archiveBtn: "Archiver", unarchiveBtn: "Désarchiver", noProjectsTitle: "Aucun projet", deleteBtn: "Supprimer", cancelBtn: "Annuler", confirmBtn: "Confirmer", saveBtn: "Enregistrer", openBtn: "Ouvrir", languageLabel: "Langue", themeLabel: "Thème" };
const it = { ...base, dashboardSubtitle: "Bentornato, Creatore.", newProjectBtn: "Nuovo Progetto", showArchivedBtn: "Mostra Archiviati", hideArchivedBtn: "Nascondi Archiviati", archiveBtn: "Archivia", unarchiveBtn: "Estrai dall'archivio", noProjectsTitle: "Nessun progetto", deleteBtn: "Elimina", cancelBtn: "Annulla", confirmBtn: "Conferma", saveBtn: "Salva", openBtn: "Apri", languageLabel: "Lingua", themeLabel: "Tema" };
const pt = { ...base, dashboardSubtitle: "Bem-vindo de volta, Criador.", newProjectBtn: "Novo Projeto", showArchivedBtn: "Mostrar Arquivados", hideArchivedBtn: "Ocultar Arquivados", archiveBtn: "Arquivar", unarchiveBtn: "Desarquivar", noProjectsTitle: "Sem projetos", deleteBtn: "Excluir", cancelBtn: "Cancelar", confirmBtn: "Confirmar", saveBtn: "Salvar", openBtn: "Abrir", languageLabel: "Idioma", themeLabel: "Tema" };
const ru = { ...base, dashboardSubtitle: "С возвращением, Создатель.", newProjectBtn: "Новый проект", showArchivedBtn: "Показать архив", hideArchivedBtn: "Скрыть архив", archiveBtn: "В архив", unarchiveBtn: "Разархивировать", noProjectsTitle: "Нет проектов", deleteBtn: "Удалить", cancelBtn: "Отмена", confirmBtn: "Подтвердить", saveBtn: "Сохранить", openBtn: "Открыть", languageLabel: "Язык", themeLabel: "Тема" };
const zh = { ...base, dashboardSubtitle: "欢迎回来，创作者。", newProjectBtn: "新项目", showArchivedBtn: "显示已归档", hideArchivedBtn: "隐藏已归档", archiveBtn: "归档", unarchiveBtn: "取消归档", noProjectsTitle: "暂无项目", deleteBtn: "删除", cancelBtn: "取消", confirmBtn: "确认", saveBtn: "保存", openBtn: "打开", languageLabel: "语言", themeLabel: "主题" };
const ja = { ...base, dashboardSubtitle: "お帰りなさい、クリエイター。", newProjectBtn: "新規プロジェクト", showArchivedBtn: "アーカイブを表示", hideArchivedBtn: "アーカイブを非表示", archiveBtn: "アーカイブ", unarchiveBtn: "アーカイブ解除", noProjectsTitle: "プロジェクトなし", deleteBtn: "削除", cancelBtn: "キャンセル", confirmBtn: "確認", saveBtn: "保存", openBtn: "開く", languageLabel: "言語", themeLabel: "テーマ" };

const output = `export type Language = 'en' | 'de' | 'es' | 'fr' | 'it' | 'pt' | 'ru' | 'zh' | 'ja';

export const translations: Record<Language, any> = {
  en: ${JSON.stringify(base, null, 4)},
  de: ${JSON.stringify(de, null, 4)},
  es: ${JSON.stringify(es, null, 4)},
  fr: ${JSON.stringify(fr, null, 4)},
  it: ${JSON.stringify(it, null, 4)},
  pt: ${JSON.stringify(pt, null, 4)},
  ru: ${JSON.stringify(ru, null, 4)},
  zh: ${JSON.stringify(zh, null, 4)},
  ja: ${JSON.stringify(ja, null, 4)}
};
`;

fs.writeFileSync('src/lib/translations.ts', output);
