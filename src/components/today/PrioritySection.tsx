'use client';
import { Task } from '@/lib/types';
import TaskCheckItem from './TaskCheckItem';

type Props = {
  title: string;
  tasks: Task[];
  onToggle: (id: string) => void;
};

export default function PrioritySection({ title, tasks, onToggle }: Props) {
  if (tasks.length === 0) return null;
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 px-1">{title}</p>
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 px-4">
        {tasks.map(task => (
          <TaskCheckItem key={task.id} task={task} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}
