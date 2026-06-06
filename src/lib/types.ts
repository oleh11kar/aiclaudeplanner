export type Priority = 'top' | 'important' | 'nice';
export type TaskStatus = 'inbox' | 'today' | 'done' | 'deleted';

export type NeedsClarification = {
  priority?: string;
  duration?: string;
  deadline?: string;
};

export type Task = {
  id: string;
  title: string;
  priority: Priority | null;
  durationMin: number | null;
  deadline: string | null;
  status: TaskStatus;
  completedAt: string | null;
  createdAt: string;
  needsClarification: NeedsClarification;
  removedFromTasks?: boolean; // hides from Tasks view, stats unaffected
};
