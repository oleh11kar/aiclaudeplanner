'use client';
import { Task } from '@/lib/types';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskCheckItem({ task, onToggle, onDelete }: Props) {
  const done = task.status === 'done';
  return (
    <div className="flex items-center gap-2 py-3 px-1 min-h-[44px]">
      <button
        onClick={() => onToggle(task.id)}
        className="flex items-center gap-3 flex-1 text-left active:opacity-70 transition-opacity"
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

      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors active:scale-90"
        aria-label="Remove task"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  );
}
