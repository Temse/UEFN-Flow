var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_http = require("http");
var import_socket = require("socket.io");
var import_vite = require("vite");
var import_better_sqlite3 = __toESM(require("better-sqlite3"), 1);
var import_adm_zip = __toESM(require("adm-zip"), 1);
var import_nanoid = require("nanoid");
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_fs = __toESM(require("fs"), 1);
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var db = new import_better_sqlite3.default("uefn_flow.db");
db.pragma("foreign_keys = ON");
db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    template TEXT NOT NULL,
    image_url TEXT,
    island_code TEXT,
    notes TEXT,
    position INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS columns (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    position INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    column_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    notes TEXT,
    is_critical BOOLEAN DEFAULT 0,
    due_date DATETIME,
    position INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS subtasks (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    position INTEGER NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS custom_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    columns TEXT NOT NULL,
    tasks TEXT NOT NULL,
    icon TEXT DEFAULT 'Layout',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS project_members (
    project_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    PRIMARY KEY (project_id, user_email),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS project_logs (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );
`);
try {
  db.prepare("ALTER TABLE tasks ADD COLUMN due_date DATETIME").run();
} catch (e) {
}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN island_code TEXT").run();
} catch (e) {
}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN image_url TEXT").run();
} catch (e) {
}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN position INTEGER DEFAULT 0").run();
} catch (e) {
}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN status TEXT").run();
} catch (e) {
}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN notes TEXT").run();
} catch (e) {
}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN archived INTEGER DEFAULT 0").run();
} catch (e) {
}
async function startServer() {
  const app = (0, import_express.default)();
  const httpServer = (0, import_http.createServer)(app);
  const io = new import_socket.Server(httpServer, {
    cors: {
      origin: "*"
    }
  });
  app.use(import_express.default.json());
  app.get("/api/download-zip", (req, res) => {
    try {
      let addDirectoryToZip = function(localDir, zipDir) {
        const items = import_fs.default.readdirSync(localDir);
        for (const item of items) {
          if ([
            "node_modules",
            "dist",
            ".git",
            "dist_electron",
            "tmp"
          ].includes(item)) {
            continue;
          }
          if (item.endsWith(".db") || item.endsWith(".db-journal")) {
            continue;
          }
          const localPath = import_path.default.join(localDir, item);
          const stat = import_fs.default.statSync(localPath);
          if (stat.isDirectory()) {
            addDirectoryToZip(localPath, zipDir ? `${zipDir}/${item}` : item);
          } else {
            zip.addLocalFile(localPath, zipDir);
          }
        }
      };
      const tempFilename = `uefn-flow-${(0, import_nanoid.nanoid)(6)}.zip`;
      const zipPath = import_path.default.join("/tmp", tempFilename);
      const zip = new import_adm_zip.default();
      addDirectoryToZip(process.cwd(), "");
      zip.writeZip(zipPath);
      res.download(zipPath, "uefn-flow-desktop.zip", (err) => {
        if (err) {
          console.error("Error sending zip file:", err);
        }
        try {
          if (import_fs.default.existsSync(zipPath)) {
            import_fs.default.unlinkSync(zipPath);
          }
        } catch (cleanupErr) {
          console.error("Error during temp zip cleanup:", cleanupErr);
        }
      });
    } catch (err) {
      console.error("Zip generation crash:", err);
      res.status(500).json({ error: "Systemfehler beim Erstellen der Zip-Datei: " + err.message });
    }
  });
  app.get("/api/backup/export", (req, res) => {
    try {
      const projects = db.prepare("SELECT * FROM projects").all();
      const backupData = projects.map((p) => {
        const columns = db.prepare("SELECT * FROM columns WHERE project_id = ? ORDER BY position ASC").all(p.id);
        const tasks = db.prepare("SELECT * FROM tasks WHERE project_id = ? ORDER BY position ASC").all(p.id);
        const tasksWithSubtasks = tasks.map((t) => {
          const subtasks = db.prepare("SELECT * FROM subtasks WHERE task_id = ? ORDER BY position ASC").all(t.id);
          return { ...t, subTasks: subtasks };
        });
        return { ...p, columns, tasks: tasksWithSubtasks };
      });
      res.setHeader("Content-Disposition", "attachment; filename=uefn-flow-backup.json");
      res.setHeader("Content-Type", "application/json");
      res.json({ version: "1.0", exported_at: (/* @__PURE__ */ new Date()).toISOString(), projects: backupData });
    } catch (err) {
      console.error("Export backup error:", err);
      res.status(500).json({ error: "Fehler beim Exportieren des Backups: " + err.message });
    }
  });
  app.post("/api/backup/import", (req, res) => {
    try {
      let { projects } = req.body;
      if (!projects && req.body.name) {
        projects = [req.body];
      }
      if (!projects || !Array.isArray(projects)) {
        return res.status(400).json({ error: "Ung\xFCltiges Backup-Format: Keine Projekte gefunden." });
      }
      const insertProject = db.prepare("INSERT INTO projects (id, name, template, island_code, position, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
      const insertColumn = db.prepare("INSERT INTO columns (id, project_id, title, position) VALUES (?, ?, ?, ?)");
      const insertTask = db.prepare("INSERT INTO tasks (id, project_id, column_id, title, description, notes, is_critical, due_date, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      const insertSubtask = db.prepare("INSERT INTO subtasks (id, task_id, title, completed, position) VALUES (?, ?, ?, ?, ?)");
      const importedProjects = [];
      const transaction = db.transaction(() => {
        projects.forEach((proj) => {
          const newProjectId = (0, import_nanoid.nanoid)();
          const maxPos = db.prepare("SELECT MAX(position) as maxPos FROM projects").get();
          const nextPos = (maxPos?.maxPos || 0) + 1;
          const importedName = proj.name.endsWith(" (Import)") ? proj.name : proj.name + " (Import)";
          insertProject.run(
            newProjectId,
            importedName,
            proj.template || null,
            proj.island_code || null,
            nextPos,
            proj.status || "Blank",
            proj.image_url || null
          );
          const columnIdMap = {};
          (proj.columns || []).forEach((col, colIdx) => {
            const newColId = (0, import_nanoid.nanoid)();
            columnIdMap[col.id] = newColId;
            insertColumn.run(newColId, newProjectId, col.title, col.position !== void 0 ? col.position : colIdx);
          });
          (proj.tasks || []).forEach((task, taskIdx) => {
            const newTaskId = (0, import_nanoid.nanoid)();
            const originalColId = task.column_id || task.columnId;
            const mappedColId = columnIdMap[originalColId] || originalColId;
            const isCriticalVal = task.is_critical !== void 0 ? task.is_critical : task.isCritical ? 1 : 0;
            const dueDateVal = task.due_date !== void 0 ? task.due_date : task.dueDate || null;
            insertTask.run(
              newTaskId,
              newProjectId,
              mappedColId,
              task.title || "Unbenannte Aufgabe",
              task.description || "",
              task.notes || "",
              isCriticalVal ? 1 : 0,
              dueDateVal,
              task.position !== void 0 ? task.position : taskIdx
            );
            (task.subTasks || []).forEach((st, stIdx) => {
              const isCompleted = st.completed !== void 0 ? st.completed : 0;
              insertSubtask.run(
                (0, import_nanoid.nanoid)(),
                newTaskId,
                st.title || "Unbenannte Unteraufgabe",
                isCompleted ? 1 : 0,
                st.position !== void 0 ? st.position : stIdx
              );
            });
          });
          importedProjects.push({ id: newProjectId, name: importedName });
        });
      });
      transaction();
      res.json({ success: true, imported: importedProjects });
    } catch (err) {
      console.error("Import backup error:", err);
      res.status(500).json({ error: "Fehler beim Importieren des Backups: " + err.message });
    }
  });
  app.get("/api/projects", (req, res) => {
    try {
      const projects = db.prepare("SELECT * FROM projects ORDER BY position ASC, created_at DESC").all();
      const projectsWithTasks = projects.map((p) => {
        const tasks = db.prepare("SELECT * FROM tasks WHERE project_id = ? ORDER BY position ASC").all(p.id);
        const tasksWithSubTasks = tasks.map((t) => {
          const subTasks = db.prepare("SELECT * FROM subtasks WHERE task_id = ? ORDER BY position ASC").all(t.id);
          return { ...t, subTasks };
        });
        const columns = db.prepare("SELECT * FROM columns WHERE project_id = ? ORDER BY position ASC").all(p.id);
        return { ...p, tasks: tasksWithSubTasks, columns };
      });
      res.json(projectsWithTasks);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Projekte konnten nicht geladen werden" });
    }
  });
  app.post("/api/projects", (req, res) => {
    try {
      const { name, template, columns, tasks, island_code, userEmail } = req.body;
      const projectId = (0, import_nanoid.nanoid)();
      const maxPos = db.prepare("SELECT MAX(position) as maxPos FROM projects").get();
      const nextPos = (maxPos?.maxPos || 0) + 1;
      const insertProject = db.prepare("INSERT INTO projects (id, name, template, island_code, position, status) VALUES (?, ?, ?, ?, ?, ?)");
      const insertMember = db.prepare("INSERT INTO project_members (project_id, user_email, role) VALUES (?, ?, ?)");
      const insertColumn = db.prepare("INSERT INTO columns (id, project_id, title, position) VALUES (?, ?, ?, ?)");
      const insertTask = db.prepare("INSERT INTO tasks (id, project_id, column_id, title, description, notes, is_critical, due_date, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      const insertSubtask = db.prepare("INSERT INTO subtasks (id, task_id, title, completed, position) VALUES (?, ?, ?, ?, ?)");
      const insertLog = db.prepare("INSERT INTO project_logs (id, project_id, user_email, action, details) VALUES (?, ?, ?, ?, ?)");
      const transaction = db.transaction(() => {
        const initialStatus = template && typeof template === "string" ? template.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ") : "Blank";
        insertProject.run(projectId, name, template || "blank", island_code || null, nextPos, initialStatus);
        if (userEmail) {
          insertMember.run(projectId, userEmail, "admin");
        }
        const columnIdMap = {};
        (columns || []).forEach((col, index) => {
          const newColId = (0, import_nanoid.nanoid)();
          columnIdMap[col.id] = newColId;
          insertColumn.run(newColId, projectId, col.title, index);
        });
        const firstColId = Object.values(columnIdMap)[0] || null;
        (tasks || []).forEach((task, index) => {
          const newTaskId = (0, import_nanoid.nanoid)();
          const origColId = task.columnId || task.column_id;
          let newColId = columnIdMap[origColId] || origColId;
          if (!newColId || !Object.values(columnIdMap).includes(newColId)) {
            newColId = firstColId;
          }
          if (!newColId) return;
          insertTask.run(
            newTaskId,
            projectId,
            newColId,
            task.title || "Unbenannte Aufgabe",
            task.description || "",
            task.notes || "",
            task.is_critical ? 1 : 0,
            task.dueDate || task.due_date || null,
            index
          );
          (task.subTasks || task.subtasks || []).forEach((st, stIndex) => {
            insertSubtask.run((0, import_nanoid.nanoid)(), newTaskId, st.title || "Unbenannte Unteraufgabe", st.completed ? 1 : 0, stIndex);
          });
        });
        if (userEmail) {
          insertLog.run((0, import_nanoid.nanoid)(), projectId, userEmail, "project_created", `Projekt "${name}" erstellt.`);
        }
      });
      transaction();
      res.json({ id: projectId });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });
  app.patch("/api/projects/:id/archive", (req, res) => {
    const { archived } = req.body;
    db.prepare("UPDATE projects SET archived = ? WHERE id = ?").run(archived ? 1 : 0, req.params.id);
    res.json({ success: true });
  });
  app.patch("/api/projects/:id/position", (req, res) => {
    const { position } = req.body;
    db.prepare("UPDATE projects SET position = ? WHERE id = ?").run(position, req.params.id);
    res.json({ success: true });
  });
  app.post("/api/columns", (req, res) => {
    const { id, project_id, title, position } = req.body;
    db.prepare("INSERT INTO columns (id, project_id, title, position) VALUES (?, ?, ?, ?)").run(id, project_id, title, position);
    res.json({ success: true });
  });
  app.patch("/api/columns/:id", (req, res) => {
    const { title, position } = req.body;
    if (title !== void 0) {
      db.prepare("UPDATE columns SET title = ? WHERE id = ?").run(title, req.params.id);
    }
    if (position !== void 0) {
      db.prepare("UPDATE columns SET position = ? WHERE id = ?").run(position, req.params.id);
    }
    res.json({ success: true });
  });
  app.delete("/api/columns/:id", (req, res) => {
    const id = req.params.id;
    db.prepare("DELETE FROM subtasks WHERE task_id IN (SELECT id FROM tasks WHERE column_id = ?)").run(id);
    db.prepare("DELETE FROM tasks WHERE column_id = ?").run(id);
    db.prepare("DELETE FROM columns WHERE id = ?").run(id);
    res.json({ success: true });
  });
  app.delete("/api/tasks/:id", (req, res) => {
    const id = req.params.id;
    db.prepare("DELETE FROM subtasks WHERE task_id = ?").run(id);
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    res.json({ success: true });
  });
  app.post("/api/tasks", (req, res) => {
    try {
      const { id, projectId, columnId, title, description, notes } = req.body;
      const insertTask = db.prepare("INSERT INTO tasks (id, project_id, column_id, title, description, notes, is_critical, due_date, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      const maxPosObj = db.prepare("SELECT MAX(position) as maxPos FROM tasks WHERE column_id = ?").get(columnId);
      const position = maxPosObj?.maxPos !== null && maxPosObj?.maxPos !== void 0 ? maxPosObj.maxPos + 1 : 0;
      insertTask.run(id, projectId, columnId, title, description || "", notes || "", 0, null, position);
      res.json({
        id,
        projectId,
        columnId,
        title,
        description: description || "",
        notes: notes || "",
        isCritical: false,
        dueDate: null,
        subTasks: [],
        tips: [],
        position
      });
    } catch (err) {
      console.error("Error creating task via REST:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  });
  app.get("/api/admin/logs", (req, res) => {
    const logs = db.prepare("SELECT * FROM project_logs ORDER BY timestamp DESC LIMIT 1000").all();
    res.json(logs);
  });
  app.post("/api/admin/reset-project/:id", (req, res) => {
    const id = req.params.id;
    db.prepare("DELETE FROM subtasks WHERE task_id IN (SELECT id FROM tasks WHERE project_id = ?)").run(id);
    db.prepare("DELETE FROM tasks WHERE project_id = ?").run(id);
    res.json({ success: true });
  });
  app.get("/api/projects/:id/logs", (req, res) => {
    const logs = db.prepare("SELECT * FROM project_logs WHERE project_id = ? ORDER BY timestamp DESC").all(req.params.id);
    res.json(logs);
  });
  app.get("/api/projects/:id/members", (req, res) => {
    const members = db.prepare("SELECT * FROM project_members WHERE project_id = ?").all(req.params.id);
    res.json(members);
  });
  app.post("/api/projects/:id/members", (req, res) => {
    const { userEmail, role } = req.body;
    db.prepare("INSERT OR REPLACE INTO project_members (project_id, user_email, role) VALUES (?, ?, ?)").run(req.params.id, userEmail, role || "member");
    res.json({ success: true });
  });
  app.post("/api/projects/:id/logs", (req, res) => {
    const { userEmail, action, details } = req.body;
    db.prepare("INSERT INTO project_logs (id, project_id, user_email, action, details) VALUES (?, ?, ?, ?, ?)").run((0, import_nanoid.nanoid)(), req.params.id, userEmail, action, details);
    res.json({ success: true });
  });
  app.get("/api/projects/:id", (req, res) => {
    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    const columns = db.prepare("SELECT * FROM columns WHERE project_id = ? ORDER BY position").all(req.params.id);
    const tasks = db.prepare("SELECT * FROM tasks WHERE project_id = ? ORDER BY position").all(req.params.id);
    const tasksWithSubtasks = tasks.map((task) => {
      const subtasks = db.prepare("SELECT * FROM subtasks WHERE task_id = ? ORDER BY position").all(task.id);
      return {
        ...task,
        columnId: task.column_id,
        isCritical: !!task.is_critical,
        dueDate: task.due_date,
        subTasks: subtasks.map((st) => ({ ...st, completed: !!st.completed }))
      };
    });
    res.json({ ...project, columns, tasks: tasksWithSubtasks });
  });
  app.delete("/api/projects/:id", (req, res) => {
    const id = req.params.id;
    db.prepare("DELETE FROM subtasks WHERE task_id IN (SELECT id FROM tasks WHERE project_id = ?)").run(id);
    db.prepare("DELETE FROM tasks WHERE project_id = ?").run(id);
    db.prepare("DELETE FROM columns WHERE project_id = ?").run(id);
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    res.json({ success: true });
  });
  app.get("/api/templates", (req, res) => {
    const templates = db.prepare("SELECT * FROM custom_templates").all();
    res.json(templates.map((t) => ({
      ...t,
      columns: JSON.parse(t.columns),
      tasks: JSON.parse(t.tasks)
    })));
  });
  app.post("/api/templates", (req, res) => {
    const { id, name, columns, tasks, icon } = req.body;
    db.prepare("INSERT INTO custom_templates (id, name, columns, tasks, icon) VALUES (?, ?, ?, ?, ?)").run(id, name, JSON.stringify(columns), JSON.stringify(tasks), icon || "Layout");
    res.json({ success: true });
  });
  app.delete("/api/templates/:id", (req, res) => {
    db.prepare("DELETE FROM custom_templates WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });
  app.get("/api/fortnite/island/:code", async (req, res) => {
    const code = req.params.code;
    if (!code || code === "undefined") {
      return res.status(400).json({ error: "Invalid island code" });
    }
    try {
      const metricsPromise = fetch(`https://api.fortnite.com/ecosystem/v1/islands/${code}/metrics/minute`, {
        headers: { "accept": "application/json" }
      });
      const infoPromise = fetch(`https://fortnite-api.com/v1/islands/lookup?code=${code}`);
      const [metricsRes, infoRes] = await Promise.all([metricsPromise, infoPromise]);
      let metricsData = {};
      if (metricsRes.ok) {
        metricsData = await metricsRes.json();
      }
      let infoData = {};
      if (infoRes.ok) {
        infoData = await infoRes.json();
      }
      const island = infoData.data || {};
      const getLatest = (arr) => {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return null;
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].value !== null && arr[i].value !== void 0) return arr[i].value;
        }
        return null;
      };
      const activePlayers = getLatest(metricsData.peakCCU) ?? island.activePlayers ?? 0;
      const totalPlays = getLatest(metricsData.plays) ?? island.stats?.plays ?? 0;
      res.json({
        id: island.uuid || code,
        name: island.title || island.displayName || "Island " + code,
        active_players: activePlayers,
        total_plays: totalPlays,
        rating: island.stats?.rating || "0.0",
        creator: island.creator,
        image: island.image,
        last_updated: (/* @__PURE__ */ new Date()).toISOString(),
        metrics: metricsData
        // Pass full metrics for potential frontend charts
      });
    } catch (error) {
      console.error("Fortnite API Error:", error);
      res.status(500).json({
        id: code,
        name: "Island " + code,
        active_players: 0,
        total_plays: 0,
        rating: "0.0",
        last_updated: (/* @__PURE__ */ new Date()).toISOString(),
        error: error instanceof Error ? error.message : "Connection error"
      });
    }
  });
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });
  io.on("connection", (socket) => {
    socket.on("join-project", (projectId) => {
      socket.join(projectId);
      console.log(`User joined project: ${projectId}`);
    });
    socket.on("task-moved", ({ projectId, taskId, newColumnId, newPosition }) => {
      db.prepare("UPDATE tasks SET column_id = ?, position = ? WHERE id = ?").run(newColumnId, newPosition, taskId);
      socket.to(projectId).emit("task-moved", { taskId, newColumnId, newPosition });
    });
    socket.on("task-updated", ({ projectId, task }) => {
      const updateTask = db.prepare("UPDATE tasks SET title = ?, description = ?, notes = ?, is_critical = ?, due_date = ? WHERE id = ?");
      updateTask.run(task.title, task.description, task.notes, task.isCritical ? 1 : 0, task.dueDate || null, task.id);
      db.prepare("DELETE FROM subtasks WHERE task_id = ?").run(task.id);
      const insertSubtask = db.prepare("INSERT INTO subtasks (id, task_id, title, completed, position) VALUES (?, ?, ?, ?, ?)");
      (task.subTasks || []).forEach((st, index) => {
        insertSubtask.run(st.id, task.id, st.title, st.completed ? 1 : 0, index);
      });
      socket.to(projectId).emit("task-updated", task);
    });
    socket.on("task-added", ({ projectId, task }) => {
      const insertTask = db.prepare("INSERT INTO tasks (id, project_id, column_id, title, description, notes, is_critical, due_date, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      insertTask.run(task.id, projectId, task.columnId, task.title, task.description || "", task.notes || "", task.isCritical ? 1 : 0, task.dueDate || null, task.position || 0);
      const insertSubtask = db.prepare("INSERT INTO subtasks (id, task_id, title, completed, position) VALUES (?, ?, ?, ?, ?)");
      (task.subTasks || []).forEach((st, index) => {
        insertSubtask.run(st.id, task.id, st.title, st.completed ? 1 : 0, index);
      });
      socket.to(projectId).emit("task-added", task);
    });
    socket.on("task-deleted", ({ projectId, taskId }) => {
      socket.to(projectId).emit("task-deleted", taskId);
    });
    socket.on("column-added", ({ projectId, column }) => {
      socket.to(projectId).emit("column-added", column);
    });
    socket.on("project-updated", ({ projectId, name, imageUrl, islandCode, status, notes }) => {
      db.prepare("UPDATE projects SET name = ?, image_url = ?, island_code = ?, status = ?, notes = ? WHERE id = ?").run(name, imageUrl, islandCode, status || "Blank", notes || "", projectId);
      socket.to(projectId).emit("project-updated", { name, imageUrl, islandCode, status: status || "Blank", notes: notes || "" });
    });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(import_express.default.static(import_path.default.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(__dirname, "dist", "index.html"));
    });
  }
  const PORT = 3e3;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
