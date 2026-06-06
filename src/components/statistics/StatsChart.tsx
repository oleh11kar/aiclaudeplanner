'use client';

type DayData = { date: string; count: number };

type Props = {
  data: DayData[];
};

export default function StatsChart({ data }: Props) {
  const max = Math.max(...data.map(d => d.count), 1);
  const chartH = 140;
  const barW = Math.min(32, Math.floor(280 / data.length));
  const gap = 4;
  const totalW = data.length * (barW + gap);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 overflow-x-auto">
      <svg width={totalW} height={chartH + 24} className="mx-auto block">
        {data.map((d, i) => {
          const barH = max > 0 ? Math.round((d.count / max) * chartH) : 0;
          const x = i * (barW + gap);
          const y = chartH - barH;
          const opacity = 0.3 + 0.7 * (d.count / max);
          return (
            <g key={d.date}>
              <rect x={x} y={y} width={barW} height={barH}
                rx={4} fill={`rgba(99,102,241,${opacity.toFixed(2)})`} />
              <text x={x + barW / 2} y={chartH + 16} textAnchor="middle"
                fontSize={9} fill="#9ca3af">
                {new Date(d.date + 'T00:00:00').toLocaleDateString('en', { month: 'numeric', day: 'numeric' })}
              </text>
              {d.count > 0 && (
                <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={10} fill="#4f46e5" fontWeight="600">
                  {d.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
