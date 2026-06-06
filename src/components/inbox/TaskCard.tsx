'use client';
import { Task } from '@/lib/types';
import ClarificationField from './ClarificationField';

type Props = {
  task: Task;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onMoveToToday: (id: string) => void;
  onDelete: (id: string) => void;
};

// Card background + text colour per priority
const cardTheme: Record<string, { bg: string; title: string; pill: string; pillText: string; btn: string }> = {
  top: {
    bg: 'bg-violet-600',
    title: 'text-white',
    pill: 'bg-white/20',
    pillText: 'text-white',
    btn: 'bg-white text-violet-700',
  },
  important: {
    bg: 'bg-orange-400',
    title: 'text-white',
    pill: 'bg-white/25',
    pillText: 'text-white',
    btn: 'bg-white text-orange-600',
  },
  nice: {
    bg: 'bg-emerald-400',
    title: 'text-gray-900',
    pill: 'bg-white/30',
    pillText: 'text-gray-800',
    btn: 'bg-white text-emerald-700',
  },
  null: {
    bg: 'bg-sky-400',
    title: 'text-white',
    pill: 'bg-white/25',
    pillText: 'text-white',
    btn: 'bg-white text-sky-700',
  },
};

const priorityLabel: Record<string, string> = {
  top: '🔴 Top Priority',
  important: '🟠 Important',
  nice: '🟢 Nice to do',
};

export default function TaskCard({ task, onUpdate, onMoveToToday, onDelete }: Props) {
  const hasClarification = Object.keys(task.needsClarification).length > 0;
  const theme = cardTheme[task.priority ?? 'null'];

  return (
    <div className={`${theme.bg} rounded-3xl shadow-sm p-5 mb-3`}>
      {/* Title */}
      <p className={`font-extrabold text-lg leading-snug mb-3 ${theme.title}`}>
        {task.title}
      </p>

      {/* Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {task.priority ? (
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${theme.pill} ${theme.pillText}`}>
            {priorityLabel[task.priority]}
          </span>
        ) : (
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${theme.pill} ${theme.pillText}`}>
            ? Priority
          </span>
        )}
        {task.deadline && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${theme.pill} ${theme.pillText}`}>
            📅 {new Date(task.deadline + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {hasClarification && (
        <ClarificationField task={task} onUpdate={patch => onUpdate(task.id, patch)} />
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-1">
        <button onClick={() => onMoveToToday(task.id)}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm min-h-[44px] active:scale-95 transition-transform ${theme.btn}`}>
          Add to Today →
        </button>
        <button onClick={() => onDelete(task.id)}
          className="py-3 px-4 rounded-2xl bg-black/15 text-white font-bold text-sm min-h-[44px] active:scale-95 transition-transform">
          Delete
        </button>
      </div>
    </div>
  );
}
