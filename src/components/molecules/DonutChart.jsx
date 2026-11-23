const R = 52;
const C = 2 * Math.PI * R;

/**
 * Dependency-free SVG donut chart. Each slice is a stroked circle whose dash length is its share.
 * The visible legend carries the same numbers, so the chart is never the only source of information.
 */
export default function DonutChart({ data, total, centerLabel, label }) {
  const sum = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative h-44 w-44 shrink-0">
        <svg viewBox="0 0 140 140" role="img" aria-label={label} className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="16" />
          {data.map((d, i) => {
            const len = (d.value / sum) * C;
            const gap = data.length > 1 ? 3 : 0;
            const seg = Math.max(len - gap, 0);
            const offset = -acc;
            acc += len;
            return (
              <circle
                key={d.name}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={d.color}
                strokeWidth="16"
                strokeLinecap="butt"
                strokeDasharray={`${seg} ${C - seg}`}
                strokeDashoffset={offset}
                className="motion-safe:animate-pop-in"
                style={{ animationDelay: `${i * 90}ms`, transformOrigin: '70px 70px' }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="tabular text-3xl font-extrabold leading-none text-ink">{total}</span>
          <span className="mt-1 text-xs font-semibold text-muted">{centerLabel}</span>
        </div>
      </div>

      <ul className="w-full min-w-0 flex-1 space-y-2.5">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-3 text-sm">
            <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-md" style={{ backgroundColor: d.color }} />
            <span className="min-w-0 flex-1 truncate font-semibold text-ink-soft">{d.name}</span>
            <span className="tabular font-bold text-ink">{d.value}</span>
            <span className="tabular w-10 text-right text-xs font-medium text-muted">{Math.round((d.value / sum) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
