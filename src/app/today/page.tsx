'use client';
import { useEffect, useState } from 'react';
import { getTasks, updateTask } from '@/lib/storage';
import { Task } from '@/lib/types';
import PrioritySection from '@/components/today/PrioritySection';
import MotivationalCard from '@/components/today/MotivationalCard';

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function isToday(task: Task) {
  // No deadline → belongs to Today
  if (!task.deadline) return true;
  // Deadline is today or overdue → Today
  return task.deadline <= todayISO();
}

function byPriority(tasks: Task[]) {
  return {
    top: tasks.filter(t => t.priority === 'top'),
    important: tasks.filter(t => t.priority === 'important'),
    nice: tasks.filter(t => t.priority === 'nice' || t.priority === null),
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => { loadTasks(); }, []);

  function loadTasks() {
    const todayStr = new Date().toDateString();
    const all = getTasks();
    const visible = all.filter(t => {
      if (t.removedFromTasks) return false;
      if (t.status === 'today') return true;
      if (t.status === 'done' && t.completedAt) {
        return new Date(t.completedAt).toDateString() === todayStr;
      }
      return false;
    });
    setTasks(visible);
  }

  function handleDelete(id: string) {
    updateTask(id, { removedFromTasks: true });
    loadTasks();
  }

  function handleToggle(id: string) {
    const task = getTasks().find(t => t.id === id);
    if (!task) return;
    if (task.status === 'done') {
      updateTask(id, { status: 'today', completedAt: null });
    } else {
      updateTask(id, { status: 'done', completedAt: new Date().toISOString() });
    }
    loadTasks();
  }

  const todayTasks = tasks.filter(isToday);
  const upcomingTasks = tasks
    .filter(t => !isToday(t))
    .sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1));

  const todayGroups = byPriority(todayTasks);
  const upcomingGroups = byPriority(upcomingTasks);

  const isEmpty = tasks.length === 0;

  return (
    <div className="px-4 pt-4 pb-24">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tasks</p>

      {isEmpty ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-lg font-medium">Nothing planned yet</p>
          <p className="text-sm mt-1">Move tasks from Inbox</p>
        </div>
      ) : (
        <>
          {/* ── Today ── */}
          {todayTasks.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base font-bold text-gray-900">Today</span>
                <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                  {todayTasks.filter(t => t.status !== 'done').length} left
                </span>
              </div>
              <PrioritySection title="Top Priority" tasks={todayGroups.top} onToggle={handleToggle} onDelete={handleDelete} />
              <PrioritySection title="Important" tasks={todayGroups.important} onToggle={handleToggle} onDelete={handleDelete} />
              <PrioritySection title="Nice to do" tasks={todayGroups.nice} onToggle={handleToggle} onDelete={handleDelete} />
            </div>
          )}

          {/* ── Upcoming Tasks ── */}
          {upcomingTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base font-bold text-gray-900">Upcoming Tasks</span>
                <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full">
                  {upcomingTasks.length}
                </span>
              </div>
              <PrioritySection title="Top Priority" tasks={upcomingGroups.top} onToggle={handleToggle} onDelete={handleDelete} />
              <PrioritySection title="Important" tasks={upcomingGroups.important} onToggle={handleToggle} onDelete={handleDelete} />
              <PrioritySection title="Nice to do" tasks={upcomingGroups.nice} onToggle={handleToggle} onDelete={handleDelete} />
            </div>
          )}

          <MotivationalCard tasks={tasks} />
        </>
      )}
    </div>
  );
}
