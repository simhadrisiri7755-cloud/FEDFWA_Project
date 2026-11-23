const R = 46;
const C = 2 * Math.PI * R;

/** Circular progress (0–100) drawn with SVG; the percentage is also printed in the middle as text. */
export default function ProgressRing({ value, label, sublabel, color = 'var(--primary)' }) {
  const pct = Math.max(0, Math.min(100, value));
  const off = C * (1 - pct / 100);
  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 120 120" role="img" aria-label={`${label}: ${pct}%`} className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="11" />
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={off}
          className="ring-draw"
          style={{ '--len': C, '--off': off }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="tabular text-3xl font-extrabold leading-none text-ink">{pct}%</span>
        {sublabel && <span className="mt-1 text-xs font-semibold text-muted">{sublabel}</span>}
      </div>
    </div>
  );
}
