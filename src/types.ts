export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  subTasks: SubTask[];
  tips: string[];
  notes: string;
  isCritical?: boolean;
  dueDate?: string;
  position?: number;
}

export interface Column {
  id: string;
  title: string;
  position?: number;
}

export type ProjectTemplate = 
  | 'blank' 
  | 'zone-wars' 
  | 'tycoon' 
  | 'bed-wars' 
  | 'box-fight' 
  | 'deathrun' 
  | 'prop-hunt' 
  | 'escape-room' 
  | 'horror' 
  | 'racing' 
  | 'simulator' 
  | 'rpg' 
  | 'ffa' 
  | 'team-deathmatch' 
  | 'capture-the-flag' 
  | 'gun-game' 
  | 'hide-and-seek' 
  | 'parkour' 
  | 'only-up' 
  | 'red-vs-blue';

export interface Project {
  id: string;
  name: string;
  template: ProjectTemplate;
  status?: string;
  image_url?: string;
  island_code?: string;
  notes?: string;
  created_at?: string;
  columns?: Column[];
  tasks?: Task[];
}

export interface ProjectLog {
  id: string;
  project_id: string;
  user_email: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface ProjectMember {
  project_id: string;
  user_email: string;
  role: 'admin' | 'member';
}

export interface ProjectState {
  projectName: string;
  template: ProjectTemplate;
  columns: Column[];
  tasks: Task[];
  onboardingComplete: boolean;
}

export function deduplicateById<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  return arr.filter(item => {
    if (!item || !item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
