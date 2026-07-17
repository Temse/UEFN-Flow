import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import AdmZip from "adm-zip";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("uefn_flow.db");
db.pragma('foreign_keys = ON');

// Initialize Database
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

// Migration: Ensure due_date exists in tasks
try {
  db.prepare("ALTER TABLE tasks ADD COLUMN due_date DATETIME").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN island_code TEXT").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN image_url TEXT").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN position INTEGER DEFAULT 0").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN status TEXT").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE projects ADD COLUMN notes TEXT").run();
} catch (e) {}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  app.use(express.json());

  app.get("/api/download-zip", (req, res) => {
    try {
      const tempFilename = `uefn-flow-${nanoid(6)}.zip`;
      const zipPath = path.join("/tmp", tempFilename);

      // Ensure /tmp folder exists (or just rely on default system path)
      const zip = new AdmZip();

      function addDirectoryToZip(localDir: string, zipDir: string) {
        const items = fs.readdirSync(localDir);
        for (const item of items) {
          // Exclusions to keep download size very tiny and exclude local state / caches
          if ([
            "node_modules", "dist", ".git", "dist_electron", "tmp"
          ].includes(item)) {
            continue;
          }
          if (item.endsWith(".db") || item.endsWith(".db-journal")) {
            continue;
          }
          
          const localPath = path.join(localDir, item);
          const stat = fs.statSync(localPath);
          
          if (stat.isDirectory()) {
            addDirectoryToZip(localPath, zipDir ? `${zipDir}/${item}` : item);
          } else {
            zip.addLocalFile(localPath, zipDir);
          }
        }
      }

      // Add all workspace files recursively starting from project root
      addDirectoryToZip(process.cwd(), "");

      // Write the zip archive
      zip.writeZip(zipPath);

      // Deliver the generated zip
      res.download(zipPath, "uefn-flow-desktop.zip", (err) => {
        if (err) {
          console.error("Error sending zip file:", err);
        }
        // Cleanup temp file
        try {
          if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
          }
        } catch (cleanupErr) {
          console.error("Error during temp zip cleanup:", cleanupErr);
        }
      });
    } catch (err: any) {
      console.error("Zip generation crash:", err);
      res.status(500).json({ error: "Systemfehler beim Erstellen der Zip-Datei: " + err.message });
    }
  });

  // API Routes
  app.get("/api/backup/export", (req, res) => {
    try {
      const projects = db.prepare("SELECT * FROM projects").all() as any[];
      const backupData = projects.map((p: any) => {
        const columns = db.prepare("SELECT * FROM columns WHERE project_id = ? ORDER BY position ASC").all(p.id);
        const tasks = db.prepare("SELECT * FROM tasks WHERE project_id = ? ORDER BY position ASC").all(p.id) as any[];
        const tasksWithSubtasks = tasks.map((t: any) => {
          const subtasks = db.prepare("SELECT * FROM subtasks WHERE task_id = ? ORDER BY position ASC").all(t.id);
          return { ...t, subTasks: subtasks };
        });
        return { ...p, columns, tasks: tasksWithSubtasks };
      });
      res.setHeader("Content-Disposition", "attachment; filename=uefn-flow-backup.json");
      res.setHeader("Content-Type", "application/json");
      res.json({ version: "1.0", exported_at: new Date().toISOString(), projects: backupData });
    } catch (err: any) {
      console.error("Export backup error:", err);
      res.status(500).json({ error: "Fehler beim Exportieren des Backups: " + err.message });
    }
  });

  app.post("/api/backup/import", (req, res) => {
    try {
      let { projects } = req.body;
      if (!projects && req.body.name) {
        // Single project payload instead of nested backup format
        projects = [req.body];
      }

      if (!projects || !Array.isArray(projects)) {
        return res.status(400).json({ error: "Ungültiges Backup-Format: Keine Projekte gefunden." });
      }

      const insertProject = db.prepare("INSERT INTO projects (id, name, template, island_code, position, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
      const insertColumn = db.prepare("INSERT INTO columns (id, project_id, title, position) VALUES (?, ?, ?, ?)");
      const insertTask = db.prepare("INSERT INTO tasks (id, project_id, column_id, title, description, notes, is_critical, due_date, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      const insertSubtask = db.prepare("INSERT INTO subtasks (id, task_id, title, completed, position) VALUES (?, ?, ?, ?, ?)");

      const importedProjects: any[] = [];

      const transaction = db.transaction(() => {
        projects.forEach((proj: any) => {
          const newProjectId = nanoid();
          
          // Get next position on dashboard
          const maxPos = db.prepare("SELECT MAX(position) as maxPos FROM projects").get() as any;
          const nextPos = (maxPos?.maxPos || 0) + 1;

          // Check if it's an import, append suffix if it's already got an import suffix or keep it clean
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

          // Map columns
          const columnIdMap: Record<string, string> = {};
          (proj.columns || []).forEach((col: any, colIdx: number) => {
            const newColId = nanoid();
            columnIdMap[col.id] = newColId;
            insertColumn.run(newColId, newProjectId, col.title, col.position !== undefined ? col.position : colIdx);
          });

          // Map tasks
          (proj.tasks || []).forEach((task: any, taskIdx: number) => {
            const newTaskId = nanoid();
            const originalColId = task.column_id || task.columnId;
            const mappedColId = columnIdMap[originalColId] || originalColId;

            const isCriticalVal = task.is_critical !== undefined ? task.is_critical : (task.isCritical ? 1 : 0);
            const dueDateVal = task.due_date !== undefined ? task.due_date : (task.dueDate || null);

            insertTask.run(
              newTaskId,
              newProjectId,
              mappedColId,
              task.title || "Unbenannte Aufgabe",
              task.description || "",
              task.notes || "",
              isCriticalVal ? 1 : 0,
              dueDateVal,
              task.position !== undefined ? task.position : taskIdx
            );

            // Subtasks
            (task.subTasks || []).forEach((st: any, stIdx: number) => {
              const isCompleted = st.completed !== undefined ? st.completed : 0;
              insertSubtask.run(
                nanoid(),
                newTaskId,
                st.title || "Unbenannte Unteraufgabe",
                isCompleted ? 1 : 0,
                st.position !== undefined ? st.position : stIdx
              );
            });
          });

          importedProjects.push({ id: newProjectId, name: importedName });
        });
      });

      transaction();
      res.json({ success: true, imported: importedProjects });
    } catch (err: any) {
      console.error("Import backup error:", err);
      res.status(500).json({ error: "Fehler beim Importieren des Backups: " + err.message });
    }
  });

  app.get("/api/projects", (req, res) => {
    try {
      // Return all projects with columns and tasks for local single-user experience
      const projects = db.prepare("SELECT * FROM projects ORDER BY position ASC, created_at DESC").all() as any[];
      const projectsWithTasks = projects.map(p => {
        const tasks = db.prepare("SELECT * FROM tasks WHERE project_id = ? ORDER BY position ASC").all(p.id) as any[];
        const tasksWithSubTasks = tasks.map(t => {
          const subTasks = db.prepare("SELECT * FROM subtasks WHERE task_id = ? ORDER BY position ASC").all(t.id);
          return { ...t, subTasks };
        });
        const columns = db.prepare("SELECT * FROM columns WHERE project_id = ? ORDER BY position ASC").all(p.id);
        return { ...p, tasks: tasksWithSubTasks, columns };
      });
      res.json(projectsWithTasks);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Projekte konnten nicht geladen werden" });
    }
  });

  app.post("/api/projects", (req, res) => {
    try {
      const { name, template, columns, tasks, island_code, userEmail } = req.body;
      const projectId = nanoid();
      
      const maxPos = db.prepare("SELECT MAX(position) as maxPos FROM projects").get() as any;
      const nextPos = (maxPos?.maxPos || 0) + 1;

      const insertProject = db.prepare("INSERT INTO projects (id, name, template, island_code, position, status) VALUES (?, ?, ?, ?, ?, ?)");
      const insertMember = db.prepare("INSERT INTO project_members (project_id, user_email, role) VALUES (?, ?, ?)");
      const insertColumn = db.prepare("INSERT INTO columns (id, project_id, title, position) VALUES (?, ?, ?, ?)");
      const insertTask = db.prepare("INSERT INTO tasks (id, project_id, column_id, title, description, notes, is_critical, due_date, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      const insertSubtask = db.prepare("INSERT INTO subtasks (id, task_id, title, completed, position) VALUES (?, ?, ?, ?, ?)");
      const insertLog = db.prepare("INSERT INTO project_logs (id, project_id, user_email, action, details) VALUES (?, ?, ?, ?, ?)");

      const transaction = db.transaction(() => {
        const initialStatus = (template && typeof template === "string")
          ? template.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
          : 'Blank';
        insertProject.run(projectId, name, template || 'blank', island_code || null, nextPos, initialStatus);
        if (userEmail) {
          insertMember.run(projectId, userEmail, 'admin');
        }
        
        const columnIdMap: Record<string, string> = {};
        (columns || []).forEach((col: any, index: number) => {
          const newColId = nanoid();
          columnIdMap[col.id] = newColId;
          insertColumn.run(newColId, projectId, col.title, index);
        });

        const firstColId = Object.values(columnIdMap)[0] || null;

        (tasks || []).forEach((task: any, index: number) => {
          const newTaskId = nanoid();
          const origColId = task.columnId || task.column_id;
          let newColId = columnIdMap[origColId] || origColId;
          
          if (!newColId || !Object.values(columnIdMap).includes(newColId)) {
            newColId = firstColId;
          }
          
          if (!newColId) return; // Skip if no valid column ID is available

          insertTask.run(
            newTaskId, 
            projectId, 
            newColId, 
            task.title || "Unbenannte Aufgabe", 
            task.description || '', 
            task.notes || '', 
            task.is_critical ? 1 : 0, 
            task.dueDate || task.due_date || null, 
            index
          );
          
          (task.subTasks || task.subtasks || []).forEach((st: any, stIndex: number) => {
            insertSubtask.run(nanoid(), newTaskId, st.title || "Unbenannte Unteraufgabe", st.completed ? 1 : 0, stIndex);
          });
        });

        if (userEmail) {
          insertLog.run(nanoid(), projectId, userEmail, 'project_created', `Projekt "${name}" erstellt.`);
        }
      });

      transaction();
      res.json({ id: projectId });
    } catch (error: any) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  app.patch("/api/projects/:id/position", (req, res) => {
    const { position } = req.body;
    db.prepare("UPDATE projects SET position = ? WHERE id = ?").run(position, req.params.id);
    res.json({ success: true });
  });

  app.post("/api/columns", (req, res) => {
    const { id, project_id, title, position } = req.body;
    db.prepare("INSERT INTO columns (id, project_id, title, position) VALUES (?, ?, ?, ?)")
      .run(id, project_id, title, position);
    res.json({ success: true });
  });

  app.patch("/api/columns/:id", (req, res) => {
    const { title, position } = req.body;
    if (title !== undefined) {
      db.prepare("UPDATE columns SET title = ? WHERE id = ?").run(title, req.params.id);
    }
    if (position !== undefined) {
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
      
      const maxPosObj = db.prepare("SELECT MAX(position) as maxPos FROM tasks WHERE column_id = ?").get(columnId) as any;
      const position = (maxPosObj?.maxPos !== null && maxPosObj?.maxPos !== undefined) ? maxPosObj.maxPos + 1 : 0;

      insertTask.run(id, projectId, columnId, title, description || '', notes || '', 0, null, position);
      res.json({ 
        id, 
        projectId, 
        columnId, 
        title, 
        description: description || '', 
        notes: notes || '', 
        isCritical: false, 
        dueDate: null, 
        subTasks: [], 
        tips: [], 
        position 
      });
    } catch (err: any) {
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
    // Simple reset: delete all tasks and columns and re-initialize from template?
    // Or just clear logs? User said "reset like revision control".
    // Let's implement a "Clear All Tasks" for now as a basic reset.
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
    db.prepare("INSERT OR REPLACE INTO project_members (project_id, user_email, role) VALUES (?, ?, ?)")
      .run(req.params.id, userEmail, role || 'member');
    res.json({ success: true });
  });

  app.post("/api/projects/:id/logs", (req, res) => {
    const { userEmail, action, details } = req.body;
    db.prepare("INSERT INTO project_logs (id, project_id, user_email, action, details) VALUES (?, ?, ?, ?, ?)")
      .run(nanoid(), req.params.id, userEmail, action, details);
    res.json({ success: true });
  });

  app.get("/api/projects/:id", (req, res) => {
    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const columns = db.prepare("SELECT * FROM columns WHERE project_id = ? ORDER BY position").all(req.params.id);
    const tasks = db.prepare("SELECT * FROM tasks WHERE project_id = ? ORDER BY position").all(req.params.id);
    
    const tasksWithSubtasks = tasks.map((task: any) => {
      const subtasks = db.prepare("SELECT * FROM subtasks WHERE task_id = ? ORDER BY position").all(task.id);
      return {
        ...task,
        columnId: task.column_id,
        isCritical: !!task.is_critical,
        dueDate: task.due_date,
        subTasks: subtasks.map((st: any) => ({ ...st, completed: !!st.completed }))
      };
    });

    res.json({ ...project, columns, tasks: tasksWithSubtasks });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const id = req.params.id;
    // Manual delete for safety if PRAGMA fails
    db.prepare("DELETE FROM subtasks WHERE task_id IN (SELECT id FROM tasks WHERE project_id = ?)").run(id);
    db.prepare("DELETE FROM tasks WHERE project_id = ?").run(id);
    db.prepare("DELETE FROM columns WHERE project_id = ?").run(id);
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/templates", (req, res) => {
    const templates = db.prepare("SELECT * FROM custom_templates").all();
    res.json(templates.map((t: any) => ({
      ...t,
      columns: JSON.parse(t.columns),
      tasks: JSON.parse(t.tasks)
    })));
  });

  app.post("/api/templates", (req, res) => {
    const { id, name, columns, tasks, icon } = req.body;
    db.prepare("INSERT INTO custom_templates (id, name, columns, tasks, icon) VALUES (?, ?, ?, ?, ?)")
      .run(id, name, JSON.stringify(columns), JSON.stringify(tasks), icon || 'Layout');
    res.json({ success: true });
  });

  app.delete("/api/templates/:id", (req, res) => {
    db.prepare("DELETE FROM custom_templates WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Fortnite API Proxy
  app.get("/api/fortnite/island/:code", async (req, res) => {
    const code = req.params.code;
    if (!code || code === 'undefined') {
      return res.status(400).json({ error: "Invalid island code" });
    }
    try {
      // Fetch metrics from the new ecosystem API provided by user
      const metricsPromise = fetch(`https://api.fortnite.com/ecosystem/v1/islands/${code}/metrics/minute`, {
        headers: { 'accept': 'application/json' }
      });
      
      // Also fetch basic info from the lookup API to get the name and image
      const infoPromise = fetch(`https://fortnite-api.com/v1/islands/lookup?code=${code}`);
      
      const [metricsRes, infoRes] = await Promise.all([metricsPromise, infoPromise]);
      
      let metricsData: any = {};
      if (metricsRes.ok) {
        metricsData = await metricsRes.json();
      }

      let infoData: any = {};
      if (infoRes.ok) {
        infoData = await infoRes.json();
      }

      const island = infoData.data || {};
      
      // Helper to extract latest non-null value from metrics arrays
      const getLatest = (arr: any[]) => {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return null;
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].value !== null && arr[i].value !== undefined) return arr[i].value;
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
        last_updated: new Date().toISOString(),
        metrics: metricsData // Pass full metrics for potential frontend charts
      });
    } catch (error) {
      console.error("Fortnite API Error:", error);
      res.status(500).json({
        id: code,
        name: "Island " + code,
        active_players: 0,
        total_plays: 0,
        rating: "0.0",
        last_updated: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Connection error"
      });
    }
  });

  // Catch-all for API routes to prevent falling through to SPA fallback
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Socket.io for Real-time
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
      
      // Update subtasks: delete all and re-insert for simplicity in this real-time sync
      db.prepare("DELETE FROM subtasks WHERE task_id = ?").run(task.id);
      const insertSubtask = db.prepare("INSERT INTO subtasks (id, task_id, title, completed, position) VALUES (?, ?, ?, ?, ?)");
      
      (task.subTasks || []).forEach((st: any, index: number) => {
        insertSubtask.run(st.id, task.id, st.title, st.completed ? 1 : 0, index);
      });

      socket.to(projectId).emit("task-updated", task);
    });

    socket.on("task-added", ({ projectId, task }) => {
      const insertTask = db.prepare("INSERT INTO tasks (id, project_id, column_id, title, description, notes, is_critical, due_date, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      insertTask.run(task.id, projectId, task.columnId, task.title, task.description || '', task.notes || '', task.isCritical ? 1 : 0, task.dueDate || null, task.position || 0);
      
      const insertSubtask = db.prepare("INSERT INTO subtasks (id, task_id, title, completed, position) VALUES (?, ?, ?, ?, ?)");
      (task.subTasks || []).forEach((st: any, index: number) => {
        insertSubtask.run(st.id, task.id, st.title, st.completed ? 1 : 0, index);
      });

      socket.to(projectId).emit("task-added", task);
    });

    socket.on("task-deleted", ({ projectId, taskId }) => {
      // Database deletion is handled by the REST API in ProjectView.tsx
      socket.to(projectId).emit("task-deleted", taskId);
    });

    socket.on("column-added", ({ projectId, column }) => {
      // Database insertion is handled by the REST API in ProjectView.tsx
      socket.to(projectId).emit("column-added", column);
    });

    socket.on("project-updated", ({ projectId, name, imageUrl, islandCode, status, notes }) => {
      db.prepare("UPDATE projects SET name = ?, image_url = ?, island_code = ?, status = ?, notes = ? WHERE id = ?").run(name, imageUrl, islandCode, status || 'Blank', notes || '', projectId);
      socket.to(projectId).emit("project-updated", { name, imageUrl, islandCode, status: status || 'Blank', notes: notes || '' });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
