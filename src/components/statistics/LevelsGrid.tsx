import { LEVELS, getCurrentLevel, getLevelProgress, getRangeLabel } from '@/lib/levels';

type Props = { totalCompleted: number };

export default function LevelsGrid({ totalCompleted }: Props) {
  const current = getCurrentLevel(totalCompleted);

  return (
    <div className="mt-6">
      <p className="text-lg font-black text-gray-900 mb-3">Your Journey</p>
      <div className="flex flex-col gap-3">
        {LEVELS.map(lvl => {
          const isCurrent = lvl.level === current.level;
          const isMax = lvl.maxTasks === null;
          const isDone = totalCompleted > (lvl.maxTasks ?? Infinity);
          const progress = isCurrent ? getLevelProgress(totalCompleted, lvl) : 0;

          return (
            <div key={lvl.level}
              className={`relative rounded-3xl p-4 transition-all
                ${isCurrent
                  ? 'bg-white ring-2 ring-violet-500 shadow-lg'
                  : isDone
                    ? 'bg-white/60 opacity-60'
                    : 'bg-white'
                }`}
            >
              {/* MAX LEVEL badge */}
              {isMax && (
                <span className="absolute -top-2.5 left-4 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Max Level
                </span>
              )}

              {/* YOU ARE HERE badge */}
              {isCurrent && !isMax && (
                <span className="absolute -top-2.5 left-4 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  You are here
                </span>
              )}

              <div className="flex items-center gap-4">
                {/* Level circle */}
                <div className={`w-12 h-12 rounded-full ${lvl.color} ${lvl.textColor} flex items-center justify-center flex-shrink-0 font-black text-lg shadow-sm`}>
                  {isDone && !isCurrent ? '✓' : lvl.level}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-black text-base ${isCurrent ? 'text-gray-900' : isDone ? 'text-gray-500' : 'text-gray-700'}`}>
                      {lvl.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">{getRangeLabel(lvl)}</p>
                  <p className={`text-xs mt-1 italic ${isCurrent ? 'text-gray-600' : 'text-gray-400'}`}>
                    &quot;{lvl.quote}&quot;
                  </p>

                  {/* Progress bar — only for current level */}
                  {isCurrent && !isMax && (
                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all"
                        style={{ width: `${Math.round(progress * 100)}%` }}
                      />
                    </div>
                  )}
                  {isCurrent && !isMax && (
                    <p className="text-[10px] text-violet-500 font-bold mt-1">
                      {totalCompleted - lvl.minTasks} / {(lvl.maxTasks ?? 0) - lvl.minTasks} tasks
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
