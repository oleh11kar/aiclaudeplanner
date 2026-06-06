'use client';
import { Task } from '@/lib/types';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
};

export default function TaskCheckItem({ task, onToggle }: Props) {
  const done = task.status === 'done';
  return (
    <button
      onClick={() => onToggle(task.id)}
      className="w-full flex items-center gap-3 py-3 px-1 text-left active:opacity-70 transition-opacity min-h-[44px]"
    >
      <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
        ${done ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'}`}>
        {done && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className={`flex-1 text-base ${done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
        {task.title}
      </span>
      {task.deadline && !done && (
        <span className="text-xs text-gray-400 flex-shrink-0">
          {new Date(task.deadline + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
        </span>
      )}
    </button>
  );
}
