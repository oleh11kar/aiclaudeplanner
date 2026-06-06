import { getProgress } from '@/lib/progress';

export default function LevelBadge({ totalCompleted }: { totalCompleted: number }) {
  const { level, tasksToNext, progress } = getProgress(totalCompleted);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-2xl">{level}</span>
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-bold text-lg">Level {level}</p>
          <div className="mt-2 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <p className="text-sm text-gray-500 mt-1">{tasksToNext} tasks to next level</p>
        </div>
      </div>
      <p className="text-center text-2xl font-bold text-gray-900 mt-4">{totalCompleted} tasks completed</p>
    </div>
  );
}
