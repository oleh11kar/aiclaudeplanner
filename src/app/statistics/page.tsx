'use client';
import { useEffect, useState } from 'react';
import { getTasks } from '@/lib/storage';
import StatsChart from '@/components/statistics/StatsChart';
import LevelBadge from '@/components/statistics/LevelBadge';

type Filter = 'day' | 'week' | 'month';

function getDatesInRange(filter: Filter): string[] {
  const today = new Date();
  const days: string[] = [];
  const count = filter === 'day' ? 1 : filter === 'week' ? 7 : 30;
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

export default function StatisticsPage() {
  const [filter, setFilter] = useState<Filter>('week');
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);

  useEffect(() => {
    const tasks = getTasks();
    const done = tasks.filter(t => t.status === 'done' && t.completedAt);
    setTotalCompleted(done.length);

    const dates = getDatesInRange(filter);
    const data = dates.map(date => ({
      date,
      count: done.filter(t => t.completedAt!.startsWith(date)).length,
    }));
    setChartData(data);
  }, [filter]);

  const filterBtns: { label: string; value: Filter }[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  return (
    <div className="px-4 pt-4 pb-24">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Statistics</p>

      <div className="flex gap-2 mb-5">
        {filterBtns.map(({ label, value }) => (
          <button key={value} onClick={() => setFilter(value)}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors min-h-[44px]
              ${filter === value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <StatsChart data={chartData} />
      </div>

      <LevelBadge totalCompleted={totalCompleted} />
    </div>
  );
}
