export function getProgress(totalTasks: number) {
  const level = Math.floor(Math.sqrt(totalTasks / 5));
  const currentLevelStart = 5 * level ** 2;
  const nextLevelStart = 5 * (level + 1) ** 2;
  const intoLevel = totalTasks - currentLevelStart;
  const levelSpan = nextLevelStart - currentLevelStart;
  return {
    level,
    nextLevelAt: nextLevelStart,
    tasksToNext: nextLevelStart - totalTasks,
    progress: levelSpan === 0 ? 0 : intoLevel / levelSpan,
  };
}
