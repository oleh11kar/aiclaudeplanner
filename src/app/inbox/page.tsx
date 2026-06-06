'use client';
import { useEffect, useState } from 'react';
import { getTasks, updateTask, deleteTask } from '@/lib/storage';
import { Task } from '@/lib/types';
import TaskCard from '@/components/inbox/TaskCard';

export default function InboxPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getTasks().filter(t => t.status === 'inbox'));
  }, []);

  function refresh() {
    setTasks(getTasks().filter(t => t.status === 'inbox'));
  }

  function handleUpdate(id: string, patch: Partial<Task>) {
    updateTask(id, patch);
    refresh();
  }

  function handleMoveToToday(id: string) {
    updateTask(id, { status: 'today' });
    refresh();
  }

  function handleDelete(id: string) {
    deleteTask(id);
    refresh();
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <p className="text-2xl font-black text-gray-900 mb-4">Inbox</p>
      {tasks.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg font-medium">Inbox is empty</p>
          <p className="text-sm mt-1">Capture something first</p>
        </div>
      ) : (
        tasks.map(task => (
          <TaskCard key={task.id} task={task}
            onUpdate={handleUpdate}
            onMoveToToday={handleMoveToToday}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
