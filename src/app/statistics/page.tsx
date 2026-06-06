'use client';
import { useEffect, useState } from 'react';
import { getTasks } from '@/lib/storage';
import StatsChart from '@/components/statistics/StatsChart';
import LevelBadge from '@/components/statistics/LevelBadge';
import LevelsGrid from '@/components/statistics/LevelsGrid';

type Filter = 'day' | 'week' | 'month';

function getChartData(filter: Filter, completedTasks: { completedAt: string }[]) {
  if (filter === 'month') {
    // Last 12 months aggregated
    const months: { date: string; count: number }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const count = completedTasks.filter(t => t.completedAt.startsWith(key)).length;
      months.push({ date: key, count });
    }
    return months;
  }

  // Day or Week: daily bars
  const dayCount = filter === 'day' ? 1 : 7;
  const today = new Date();
  const days: { date: string; count: number }[] = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const count = completedTasks.filter(t => t.completedAt.startsWith(key)).length;
    days.push({ date: key, count });
  }
  return days;
}

function formatLabel(date: string, filter: Filter): string {
  if (filter === 'month') {
    // date is "YYYY-MM"
    const d = new Date(date + '-01T00:00:00');
    const month = d.toLocaleDateString('en', { month: 'short' }); // "Mar"
    const year = String(d.getFullYear()).slice(2);                 // "26"
    return `${month} ${year}`;
  }
  // date is "YYYY-MM-DD"
  const d = new Date(date + 'T00:00:00');
  if (filter === 'day') return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  return d.toLocaleDateString('en', { weekday: 'short' }); // "Mon"
}

export default function StatisticsPage() {
  const [filter, setFilter] = useState<Filter>('week');
  const [chartData, setChartData] = useState<{ date: string; count: number; label: string }[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);

  useEffect(() => {
    const tasks = getTasks();
    const done = tasks.filter(t => t.status === 'done' && t.completedAt) as { completedAt: string }[];
    setTotalCompleted(done.length);
    const raw = getChartData(filter, done);
    setChartData(raw.map(d => ({ ...d, label: formatLabel(d.date, filter) })));
  }, [filter]);

  const filterBtns: { label: string; value: Filter }[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  return (
    <div className="px-4 pt-4 pb-24">
      <p className="text-2xl font-black text-gray-900 mb-4">Statistics</p>

      <div className="flex gap-2 mb-5">
        {filterBtns.map(({ label, value }) => (
          <button key={value} onClick={() => setFilter(value)}
            className={`flex-1 py-2.5 rounded-full text-sm font-black transition-colors min-h-[44px]
              ${filter === value ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <StatsChart data={chartData} />
      </div>

      <LevelBadge totalCompleted={totalCompleted} />
      <LevelsGrid totalCompleted={totalCompleted} />
    </div>
  );
}
