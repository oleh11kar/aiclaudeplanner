'use client';
import { useEffect, useState } from 'react';
import { getTasks, updateTask } from '@/lib/storage';
import { Task } from '@/lib/types';
import PrioritySection from '@/components/today/PrioritySection';

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  function loadTasks() {
    const today = new Date().toDateString();
    const all = getTasks();
    // Show 'today' tasks + today's 'done' tasks
    const todayTasks = all.filter(t => {
      if (t.status === 'today') return true;
      if (t.status === 'done' && t.completedAt) {
        return new Date(t.completedAt).toDateString() === today;
      }
      return false;
    });
    setTasks(todayTasks);
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

  const top = tasks.filter(t => t.priority === 'top');
  const important = tasks.filter(t => t.priority === 'important');
  const nice = tasks.filter(t => t.priority === 'nice' || t.priority === null);

  const isEmpty = tasks.length === 0;

  return (
    <div className="px-4 pt-4 pb-24">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Today</p>
      {isEmpty ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-lg font-medium">Nothing planned yet</p>
          <p className="text-sm mt-1">Move tasks from Inbox</p>
        </div>
      ) : (
        <>
          <PrioritySection title="Top Priority" tasks={top} onToggle={handleToggle} />
          <PrioritySection title="Important" tasks={important} onToggle={handleToggle} />
          <PrioritySection title="Nice to do" tasks={nice} onToggle={handleToggle} />
        </>
      )}
    </div>
  );
}
