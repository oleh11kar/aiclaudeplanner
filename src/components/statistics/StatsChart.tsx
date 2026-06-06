'use client';

type DayData = { date: string; count: number; label?: string };

type Props = {
  data: DayData[];
};

export default function StatsChart({ data }: Props) {
  if (data.length === 0) return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">
      No data yet
    </div>
  );

  const max = Math.max(...data.map(d => d.count), 1);
  const chartH = 140;
  const barW = Math.min(32, Math.floor(300 / data.length));
  const gap = 4;
  const totalW = Math.max(data.length * (barW + gap), 300);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 overflow-x-auto">
      <svg width={totalW} height={chartH + 28} className="block">
        {data.map((d, i) => {
          const barH = max > 0 ? Math.round((d.count / max) * chartH) : 0;
          const x = i * (barW + gap);
          const y = chartH - barH;
          const opacity = d.count === 0 ? 0.08 : 0.3 + 0.7 * (d.count / max);
          const label = d.label ?? d.date;
          return (
            <g key={d.date}>
              <rect x={x} y={d.count === 0 ? chartH - 2 : y} width={barW} height={d.count === 0 ? 2 : barH}
                rx={4} fill={`rgba(99,102,241,${opacity.toFixed(2)})`} />
              <text x={x + barW / 2} y={chartH + 18} textAnchor="middle"
                fontSize={9} fill="#9ca3af">
                {label}
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
