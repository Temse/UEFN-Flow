const fs = require('fs');

const baseTranslations = {
  saving: { en: "Saving...", de: "Speichert...", es: "Guardando...", fr: "Enregistrement...", it: "Salvataggio...", pt: "Salvando...", ru: "Сохранение...", zh: "保存中...", ja: "保存中..." },
  noReminders: { en: "No reminders yet.", de: "Noch keine Erinnerungen.", es: "Aún no hay recordatorios.", fr: "Pas encore de rappels.", it: "Nessun promemoria ancora.", pt: "Sem lembretes ainda.", ru: "Пока нет напоминаний.", zh: "暂无提醒。", ja: "リマインダーはまだありません。" },
  notesBtn: { en: "Notes", de: "Notizen", es: "Notas", fr: "Notes", it: "Note", pt: "Notas", ru: "Заметки", zh: "笔记", ja: "ノート" },
  toggleNotes: { en: "Toggle Project Notes", de: "Projektnotizen umschalten", es: "Alternar notas del proyecto", fr: "Basculer les notes du projet", it: "Attiva/disattiva note progetto", pt: "Alternar notas do projeto", ru: "Переключить заметки проекта", zh: "切换项目笔记", ja: "プロジェクトノートの切り替え" },
  projectLoadError: { en: "Project could not be loaded", de: "Projekt konnte nicht geladen werden", es: "No se pudo cargar el proyecto", fr: "Le projet n'a pas pu être chargé", it: "Impossibile caricare il progetto", pt: "Não foi possível carregar o projeto", ru: "Не удалось загрузить проект", zh: "无法加载项目", ja: "プロジェクトを読み込めませんでした" },
  projectNotFound: { en: "Project Not Found", de: "Projekt nicht gefunden", es: "Proyecto no encontrado", fr: "Projet introuvable", it: "Progetto non trovato", pt: "Projeto não encontrado", ru: "Проект не найден", zh: "项目未找到", ja: "プロジェクトが見つかりません" },
  projectNotExist: { en: "The requested project does not exist.", de: "Das angeforderte Projekt existiert nicht.", es: "El proyecto solicitado no existe.", fr: "Le projet demandé n'existe pas.", it: "Il progetto richiesto non esiste.", pt: "O projeto solicitado não existe.", ru: "Запрошенный проект не существует.", zh: "请求的项目不存在。", ja: "要求されたプロジェクトは存在しません。" },
  noteForGithub: { en: "Note for GitHub Pages:", de: "Hinweis für GitHub Pages:", es: "Nota para GitHub Pages:", fr: "Note pour GitHub Pages :", it: "Nota per GitHub Pages:", pt: "Nota para GitHub Pages:", ru: "Примечание для GitHub Pages:", zh: "GitHub Pages 提示：", ja: "GitHub Pages の注意：" },
  githubNoteDesc: { en: "If you are using the static GitHub Pages version of this app, projects are only saved in your browser's local storage. Links cannot be shared across different devices because there is no backend server.", de: "Wenn du die statische GitHub Pages-Version dieser App verwendest, werden Projekte nur im lokalen Speicher deines Browsers gespeichert. Links können nicht geräteübergreifend geteilt werden, da kein Backend-Server vorhanden ist.", es: "Si usa la versión estática de GitHub Pages, los proyectos solo se guardan en su navegador. Los enlaces no se pueden compartir entre dispositivos.", fr: "Si vous utilisez la version statique GitHub Pages, les projets sont uniquement sauvegardés dans le navigateur. Les liens ne peuvent pas être partagés.", it: "Se usi la versione statica di GitHub Pages, i progetti vengono salvati solo nel browser. I link non possono essere condivisi.", pt: "Se estiver usando a versão estática do GitHub Pages, os projetos são salvos apenas no navegador. Os links não podem ser compartilhados.", ru: "Если вы используете статическую версию GitHub Pages, проекты сохраняются только в браузере. Ссылками нельзя делиться между устройствами.", zh: "如果使用静态 GitHub Pages 版本，项目仅保存在浏览器本地存储中。无法跨设备共享链接。", ja: "静的なGitHub Pagesバージョンを使用している場合、プロジェクトはブラウザのローカルストレージにのみ保存されます。リンクはデバイス間で共有できません。" },
  addNewColumn: { en: "Add New Column", de: "Neue Spalte hinzufügen", es: "Añadir nueva columna", fr: "Ajouter une nouvelle colonne", it: "Aggiungi nuova colonna", pt: "Adicionar nova coluna", ru: "Добавить новую колонку", zh: "添加新列", ja: "新しい列を追加" },
  enterColumnName: { en: "Enter column name...", de: "Spaltenname eingeben...", es: "Introducir nombre de columna...", fr: "Entrez le nom de la colonne...", it: "Inserisci nome colonna...", pt: "Digite o nome da coluna...", ru: "Введите имя колонки...", zh: "输入列名...", ja: "列名を入力..." },
  addNewTask: { en: "Add New Task", de: "Neue Aufgabe hinzufügen", es: "Añadir nueva tarea", fr: "Ajouter une nouvelle tâche", it: "Aggiungi nuova attività", pt: "Adicionar nova tarefa", ru: "Добавить новую задачу", zh: "添加新任务", ja: "新しいタスクを追加" },
  enterTaskTitle: { en: "Enter task title...", de: "Aufgabentitel eingeben...", es: "Introducir título de tarea...", fr: "Entrez le titre de la tâche...", it: "Inserisci titolo attività...", pt: "Digite o título da tarefa...", ru: "Введите название задачи...", zh: "输入任务标题...", ja: "タスクのタイトルを入力..." },
  renameColumn: { en: "Rename Column", de: "Spalte umbenennen", es: "Renombrar columna", fr: "Renommer la colonne", it: "Rinomina colonna", pt: "Renomear coluna", ru: "Переименовать колонку", zh: "重命名列", ja: "列の名前を変更" },
  newColumnName: { en: "New column name...", de: "Neuer Spaltenname...", es: "Nuevo nombre de columna...", fr: "Nouveau nom de colonne...", it: "Nuovo nome colonna...", pt: "Novo nome da coluna...", ru: "Новое имя колонки...", zh: "新列名...", ja: "新しい列名..." },
  deleteColumnConfirm: { en: "Are you sure you want to delete this column and all its tasks?", de: "Bist du sicher, dass du diese Spalte und alle darin enthaltenen Aufgaben löschen möchtest?", es: "¿Seguro que quieres eliminar esta columna y todas sus tareas?", fr: "Êtes-vous sûr de vouloir supprimer cette colonne et toutes ses tâches ?", it: "Sei sicuro di voler eliminare questa colonna e tutte le sue attività?", pt: "Tem certeza de que deseja excluir esta coluna e todas as suas tarefas?", ru: "Вы уверены, что хотите удалить эту колонку и все ее задачи?", zh: "您确定要删除此列及其所有任务吗？", ja: "この列とそのすべてのタスクを削除してもよろしいですか？" },
  progressSaved: { en: "Progress saved successfully", de: "Fortschritt erfolgreich gesichert", es: "Progreso guardado con éxito", fr: "Progrès enregistré avec succès", it: "Progresso salvato con successo", pt: "Progresso salvo com sucesso", ru: "Прогресс успешно сохранен", zh: "进度保存成功", ja: "進捗が正常に保存されました" },
  allChangesSaved: { en: "All changes saved", de: "Alle Änderungen gespeichert", es: "Todos los cambios guardados", fr: "Toutes les modifications enregistrées", it: "Tutte le modifiche salvate", pt: "Todas as alterações salvas", ru: "Все изменения сохранены", zh: "所有更改已保存", ja: "すべての変更が保存されました" },
  uploadImageOnly: { en: "Please upload images only.", de: "Bitte lade nur Bilder hoch.", es: "Sube solo imágenes.", fr: "Veuillez ne télécharger que des images.", it: "Carica solo immagini.", pt: "Faça upload apenas de imagens.", ru: "Пожалуйста, загружайте только изображения.", zh: "请仅上传图片。", ja: "画像のみアップロードしてください。" },
  projectStatus: { en: "Project Status", de: "Projektstatus", es: "Estado del proyecto", fr: "Statut du projet", it: "Stato del progetto", pt: "Status do projeto", ru: "Статус проекта", zh: "项目状态", ja: "プロジェクトのステータス" },
  statusOnline: { en: "Online", de: "Online", es: "En línea", fr: "En ligne", it: "Online", pt: "Online", ru: "Онлайн", zh: "在线", ja: "オンライン" },
  statusOffline: { en: "Offline", de: "Offline", es: "Desconectado", fr: "Hors ligne", it: "Offline", pt: "Offline", ru: "Офлайн", zh: "离线", ja: "オフライン" },
  statusPrivate: { en: "Private", de: "Privat", es: "Privado", fr: "Privé", it: "Privato", pt: "Privado", ru: "Приватный", zh: "私密", ja: "プライベート" },
  statusCustom: { en: "Custom", de: "Eigener", es: "Personalizado", fr: "Personnalisé", it: "Personalizzato", pt: "Personalizado", ru: "Пользовательский", zh: "自定义", ja: "カスタム" },
  enterCustomStatus: { en: "Enter custom status...", de: "Eigenen Status eingeben...", es: "Introducir estado...", fr: "Statut personnalisé...", it: "Stato personalizzato...", pt: "Status personalizado...", ru: "Пользовательский статус...", zh: "输入自定义状态...", ja: "カスタムステータスを入力..." },
  previewImage: { en: "Preview Image", de: "Vorschaubild", es: "Imagen de vista previa", fr: "Image d'aperçu", it: "Immagine di anteprima", pt: "Imagem de visualização", ru: "Предпросмотр изображения", zh: "预览图片", ja: "プレビュー画像" },
  dragImageHere: { en: "Drag image here", de: "Bild hierhin ziehen", es: "Arrastrar imagen aquí", fr: "Faites glisser l'image ici", it: "Trascina l'immagine qui", pt: "Arraste a imagem para cá", ru: "Перетащите изображение сюда", zh: "将图片拖到此处", ja: "ここに画像をドラッグ" },
  orClickToUpload: { en: "or click to upload", de: "oder klicken zum Hochladen", es: "o clic para subir", fr: "ou cliquer pour télécharger", it: "o clicca per caricare", pt: "ou clique para fazer upload", ru: "или нажмите для загрузки", zh: "或点击上传", ja: "またはクリックしてアップロード" },
  imageUploaded: { en: "Image uploaded", de: "Bild hochgeladen", es: "Imagen subida", fr: "Image téléchargée", it: "Immagine caricata", pt: "Imagem carregada", ru: "Изображение загружено", zh: "图片已上传", ja: "画像がアップロードされました" },
  orPasteImageUrl: { en: "Or paste an image URL...", de: "Oder Bild-URL einfügen...", es: "O pegar una URL de imagen...", fr: "Ou coller une URL d'image...", it: "O incolla URL immagine...", pt: "Ou cole o URL da imagem...", ru: "Или вставьте URL изображения...", zh: "或粘贴图片 URL...", ja: "または画像URLを貼り付け..." },
  saveAsTemplate: { en: "Save as Template", de: "Als Vorlage speichern", es: "Guardar como plantilla", fr: "Enregistrer comme modèle", it: "Salva come modello", pt: "Salvar como modelo", ru: "Сохранить как шаблон", zh: "保存为模板", ja: "テンプレートとして保存" },
  savingTemplate: { en: "Saving...", de: "Speichert...", es: "Guardando...", fr: "Enregistrement...", it: "Salvataggio...", pt: "Salvando...", ru: "Сохранение...", zh: "保存中...", ja: "保存中..." },
  exportProject: { en: "Export Project", de: "Projekt exportieren", es: "Exportar proyecto", fr: "Exporter le projet", it: "Esporta progetto", pt: "Exportar projeto", ru: "Экспорт проекта", zh: "导出项目", ja: "プロジェクトをエクスポート" },
  archiveProject: { en: "Archive Project", de: "Projekt archivieren", es: "Archivar proyecto", fr: "Archiver le projet", it: "Archivia progetto", pt: "Arquivar projeto", ru: "Архивировать проект", zh: "归档项目", ja: "プロジェクトをアーカイブ" },
  unarchiveProject: { en: "Unarchive Project", de: "Projekt wiederherstellen", es: "Desarchivar proyecto", fr: "Désarchiver le projet", it: "Annulla archiviazione progetto", pt: "Desarquivar projeto", ru: "Разархивировать проект", zh: "取消归档项目", ja: "アーカイブを解除" },
  completion: { en: "Completion", de: "Abschluss", es: "Finalización", fr: "Achèvement", it: "Completamento", pt: "Conclusão", ru: "Завершение", zh: "完成度", ja: "完了" },
  importFailed: { en: "Failed to import project", de: "Import fehlgeschlagen", es: "Fallo al importar el proyecto", fr: "Échec de l'importation du projet", it: "Importazione progetto non riuscita", pt: "Falha ao importar o projeto", ru: "Не удалось импортировать проект", zh: "导入项目失败", ja: "プロジェクトのインポートに失敗しました" },
  localSaveError: { en: "Error saving project locally", de: "Fehler beim lokalen Sichern des Projekts", es: "Error al guardar el proyecto", fr: "Erreur lors de l'enregistrement", it: "Errore salvataggio locale", pt: "Erro ao salvar localmente", ru: "Ошибка сохранения", zh: "本地保存错误", ja: "ローカル保存エラー" },
  importProject: { en: "Import Project", de: "Projekt importieren", es: "Importar proyecto", fr: "Importer le projet", it: "Importa progetto", pt: "Importar projeto", ru: "Импорт проекта", zh: "导入项目", ja: "プロジェクトをインポート" },
  importBtn: { en: "Import", de: "Import", es: "Importar", fr: "Importer", it: "Importa", pt: "Importar", ru: "Импорт", zh: "导入", ja: "インポート" },
  pasteProjectDataFirst: { en: "Please paste project data first.", de: "Bitte füge zuerst die Projektdaten ein.", es: "Por favor, pega los datos primero.", fr: "Veuillez d'abord coller les données.", it: "Incolla prima i dati del progetto.", pt: "Cole os dados do projeto primeiro.", ru: "Пожалуйста, сначала вставьте данные.", zh: "请先粘贴项目数据。", ja: "最初にプロジェクトデータを貼り付けてください。" },
  invalidJsonData: { en: "Invalid JSON data. Please check the format.", de: "Ungültige JSON-Daten. Bitte Format überprüfen.", es: "Datos JSON no válidos. Revisa el formato.", fr: "Données JSON invalides. Vérifiez le format.", it: "Dati JSON non validi. Controlla il formato.", pt: "Dados JSON inválidos. Verifique o formato.", ru: "Недопустимые данные JSON. Проверьте формат.", zh: "无效的 JSON 数据。请检查格式。", ja: "無効なJSONデータです。形式を確認してください。" },
  exportProjectData: { en: "Export Project Data", de: "Projektdaten exportieren", es: "Exportar datos del proyecto", fr: "Exporter les données du projet", it: "Esporta dati del progetto", pt: "Exportar dados do projeto", ru: "Экспорт данных проекта", zh: "导出项目数据", ja: "プロジェクトデータをエクスポート" },
  importProjectData: { en: "Import Project Data", de: "Projektdaten importieren", es: "Importar datos del proyecto", fr: "Importer les données du projet", it: "Importa dati del progetto", pt: "Importar dados do projeto", ru: "Импорт данных проекта", zh: "导入项目数据", ja: "プロジェクトデータをインポート" },
  copyExportText: { en: "Copy this text and save it somewhere safe. You can use it later to import the project.", de: "Kopiere diesen Text und speichere ihn sicher. Du kannst ihn später verwenden, um das Projekt zu importieren.", es: "Copia este texto y guárdalo en un lugar seguro.", fr: "Copiez ce texte et enregistrez-le dans un endroit sûr.", it: "Copia questo testo e salvalo in un luogo sicuro.", pt: "Copie este texto e salve-o em um local seguro.", ru: "Скопируйте этот текст и сохраните его в надежном месте.", zh: "复制此文本并将其保存在安全的地方。稍后可用于导入项目。", ja: "このテキストをコピーして安全な場所に保存してください。" },
  pasteImportText: { en: "Paste the project data text here to import it.", de: "Füge den Projektdaten-Text hier ein, um es zu importieren.", es: "Pega el texto de los datos del proyecto aquí.", fr: "Collez le texte des données du projet ici.", it: "Incolla il testo dei dati del progetto qui.", pt: "Cole o texto de dados do projeto aqui.", ru: "Вставьте текст данных проекта сюда.", zh: "在此处粘贴项目数据文本以导入。", ja: "プロジェクトデータのテキストをここに貼り付けてください。" },
  copied: { en: "Copied!", de: "Kopiert!", es: "¡Copiado!", fr: "Copié !", it: "Copiato!", pt: "Copiado!", ru: "Скопировано!", zh: "已复制！", ja: "コピーしました！" },
  copyToClipboard: { en: "Copy to Clipboard", de: "In Zwischenablage kopieren", es: "Copiar al portapapeles", fr: "Copier dans le presse-papiers", it: "Copia negli appunti", pt: "Copiar para a área de transferência", ru: "Скопировать в буфер обмена", zh: "复制到剪贴板", ja: "クリップボードにコピー" },
  preProduction: { en: "📝 Pre-Production", de: "📝 Pre-Production", es: "📝 Preproducción", fr: "📝 Pré-production", it: "📝 Pre-produzione", pt: "📝 Pré-produção", ru: "📝 Препродакшн", zh: "📝 前期制作", ja: "📝 プリプロダクション" },
  environmentArt: { en: "🛠️ Environment & Art", de: "🛠️ Environment & Art", es: "🛠️ Entorno y Arte", fr: "🛠️ Environnement & Art", it: "🛠️ Ambiente e Arte", pt: "🛠️ Ambiente e Arte", ru: "🛠️ Окружение и Арт", zh: "🛠️ 环境与美术", ja: "🛠️ 環境とアート" },
  logicVerse: { en: "⚙️ Logic & Verse", de: "⚙️ Logic & Verse", es: "⚙️ Lógica y Verse", fr: "⚙️ Logique & Verse", it: "⚙️ Logica e Verse", pt: "⚙️ Lógica e Verse", ru: "⚙️ Логика и Verse", zh: "⚙️ 逻辑与 Verse", ja: "⚙️ ロジックとVerse" },
  optimizationStage: { en: "🧹 Optimization", de: "🧹 Optimization", es: "🧹 Optimización", fr: "🧹 Optimisation", it: "🧹 Ottimizzazione", pt: "🧹 Otimização", ru: "🧹 Оптимизация", zh: "🧹 优化", ja: "🧹 最適化" },
  playtestingRelease: { en: "🎮 Playtesting & Release", de: "🎮 Playtesting & Release", es: "🎮 Pruebas y Lanzamiento", fr: "🎮 Test de jeu & Sortie", it: "🎮 Playtesting e Rilascio", pt: "🎮 Playtesting e Lançamento", ru: "🎮 Плейтест и Релиз", zh: "🎮 试玩与发布", ja: "🎮 プレイテストとリリース" },
};

const file = fs.readFileSync('src/lib/translations.ts', 'utf8');
const lines = file.split('\n');

const codes = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'zh', 'ja'];
let currentLang = null;

const updatedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('tasksCompleted":')) {
    updatedLines.push(line.replace('"', '",')); // Add comma if missing
  } else {
    updatedLines.push(line);
  }
  
  const match = line.match(/^\s+([a-z]{2}):\s+\{/);
  if (match) {
    currentLang = match[1];
  }
  
  if (currentLang && line.includes('tasksCompleted":')) {
    for (const [key, langs] of Object.entries(baseTranslations)) {
      if (langs[currentLang]) {
        updatedLines.push(`    "${key}": "${langs[currentLang]}",`);
      }
    }
  }
}

fs.writeFileSync('src/lib/translations.ts', updatedLines.join('\n'));
