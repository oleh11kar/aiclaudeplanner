import { Task } from './types';

const KEY = 'ai-planner-tasks';

export function getTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw e;
    }
  }
}

export function addTasks(newTasks: Task[]): void {
  const existing = getTasks();
  saveTasks([...existing, ...newTasks]);
}

export function updateTask(id: string, patch: Partial<Task>): void {
  const tasks = getTasks();
  saveTasks(tasks.map(t => t.id === id ? { ...t, ...patch } : t));
}

export function deleteTask(id: string): void {
  updateTask(id, { status: 'deleted' });
}
