import { getProgress } from '@/lib/progress';

export default function LevelBadge({ totalCompleted }: { totalCompleted: number }) {
  const { level, tasksToNext, progress } = getProgress(totalCompleted);
  return (
    <div className="bg-violet-600 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-3xl">{level}</span>
        </div>
        <div className="flex-1">
          <p className="text-white font-black text-xl">Level {level}</p>
          <div className="mt-2 h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all"
              style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <p className="text-violet-200 text-sm font-semibold mt-1">{tasksToNext} tasks to next level</p>
        </div>
      </div>
      <p className="text-center text-3xl font-black text-white mt-4">{totalCompleted} <span className="text-violet-200 text-lg font-bold">tasks done</span></p>
    </div>
  );
}
