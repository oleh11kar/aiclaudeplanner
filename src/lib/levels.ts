export type Level = {
  level: number;
  name: string;
  minTasks: number;
  maxTasks: number | null; // null = MAX LEVEL
  quote: string;
  color: string;   // tailwind bg class for the circle
  textColor: string;
};

export const LEVELS: Level[] = [
  {
    level: 1, name: 'Taskling',
    minTasks: 0, maxTasks: 10,
    quote: "I just started. You could say I'm... task-ling my potential.",
    color: 'bg-gray-400', textColor: 'text-white',
  },
  {
    level: 2, name: 'To-Doer',
    minTasks: 11, maxTasks: 25,
    quote: "I'm to-doing it. To-doing it real good.",
    color: 'bg-gray-600', textColor: 'text-white',
  },
  {
    level: 3, name: 'Check Norris',
    minTasks: 26, maxTasks: 50,
    quote: "Nobody checks boxes like Chuck. Nobody.",
    color: 'bg-blue-500', textColor: 'text-white',
  },
  {
    level: 4, name: 'Sir Completes-a-Lot',
    minTasks: 51, maxTasks: 100,
    quote: "I like big tasks and I cannot lie.",
    color: 'bg-emerald-500', textColor: 'text-white',
  },
  {
    level: 5, name: 'Task Skywalker',
    minTasks: 101, maxTasks: 200,
    quote: "May the checkmark be with you.",
    color: 'bg-violet-500', textColor: 'text-white',
  },
  {
    level: 6, name: 'Done Quixote',
    minTasks: 201, maxTasks: 350,
    quote: "Fighting windmills? No problem. Filing taxes? Done.",
    color: 'bg-amber-500', textColor: 'text-white',
  },
  {
    level: 7, name: 'Produc-knight',
    minTasks: 351, maxTasks: 500,
    quote: "Sworn to protect the realm from procrastination.",
    color: 'bg-rose-400', textColor: 'text-white',
  },
  {
    level: 8, name: 'Lord of the Checklists',
    minTasks: 501, maxTasks: 750,
    quote: "One list to rule them all, one list to find them.",
    color: 'bg-rose-700', textColor: 'text-white',
  },
  {
    level: 9, name: 'The Dadvinci',
    minTasks: 751, maxTasks: 999,
    quote: "Deciphering life's mysteries, one task at a time.",
    color: 'bg-teal-600', textColor: 'text-white',
  },
  {
    level: 10, name: 'Yoda of Todos',
    minTasks: 1000, maxTasks: null,
    quote: "Complete tasks, you must. Overthink them, you shall not.",
    color: 'bg-violet-700', textColor: 'text-white',
  },
];

export function getCurrentLevel(totalCompleted: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalCompleted >= LEVELS[i].minTasks) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(totalCompleted: number, lvl: Level): number {
  if (lvl.maxTasks === null) return 1;
  const into = totalCompleted - lvl.minTasks;
  const span = lvl.maxTasks - lvl.minTasks;
  return Math.min(Math.max(into / span, 0), 1);
}

export function getRangeLabel(lvl: Level): string {
  if (lvl.maxTasks === null) return `${lvl.minTasks}+ tasks done`;
  return `${lvl.minTasks}–${lvl.maxTasks} tasks done`;
}
