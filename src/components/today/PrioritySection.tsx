'use client';
import { Task } from '@/lib/types';
import TaskCheckItem from './TaskCheckItem';

type Props = {
  title: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function PrioritySection({ title, tasks, onToggle, onDelete }: Props) {
  if (tasks.length === 0) return null;
  return (
    <div className="mb-4">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 px-1">{title}</p>
      <div className="bg-white rounded-3xl divide-y divide-gray-100 px-4 shadow-sm">
        {tasks.map(task => (
          <TaskCheckItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
