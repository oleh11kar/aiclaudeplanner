'use client';
import { Task } from '@/lib/types';
import ClarificationField from './ClarificationField';

type Props = {
  task: Task;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onMoveToToday: (id: string) => void;
  onDelete: (id: string) => void;
};

const priorityStyles: Record<string, string> = {
  top: 'bg-red-100 text-red-700 border-red-200',
  important: 'bg-orange-100 text-orange-700 border-orange-200',
  nice: 'bg-gray-100 text-gray-600 border-gray-200',
};

const priorityLabel: Record<string, string> = {
  top: 'Top Priority',
  important: 'Important',
  nice: 'Nice to do',
};

export default function TaskCard({ task, onUpdate, onMoveToToday, onDelete }: Props) {
  const hasClarification = Object.keys(task.needsClarification).length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-base leading-snug">{task.title}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {task.priority ? (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${priorityStyles[task.priority]}`}>
                {priorityLabel[task.priority]}
              </span>
            ) : (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-dashed border-gray-400 text-gray-500">
                ? Priority
              </span>
            )}
            {task.durationMin && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                ~{task.durationMin} min
              </span>
            )}
            {task.deadline && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {new Date(task.deadline + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {hasClarification && (
        <ClarificationField task={task} onUpdate={patch => onUpdate(task.id, patch)} />
      )}

      <div className="flex gap-3 mt-4">
        <button onClick={() => onMoveToToday(task.id)}
          className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm min-h-[44px] active:scale-95 transition-transform">
          → Today
        </button>
        <button onClick={() => onDelete(task.id)}
          className="py-3 px-5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm min-h-[44px] active:scale-95 transition-transform">
          Delete
        </button>
      </div>
    </div>
  );
}
