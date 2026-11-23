import Icon from '../atoms/Icon';
import useCountUp from '../../hooks/useCountUp';

const TONES = {
  brand: { chip: 'bg-brand-50 text-link', glow: 'from-brand-500/20' },
  amber: { chip: 'bg-warning-soft text-warning-ink', glow: 'from-accent/25' },
  sky: { chip: 'bg-info-soft text-info-ink', glow: 'from-sky-500/20' },
  violet: { chip: 'bg-grape-soft text-grape-ink', glow: 'from-violet-500/20' },
};

function Value({ value }) {
  const numeric = typeof value === 'number';
  const shown = useCountUp(numeric ? value : 0);
  return <>{numeric ? shown : value}</>;
}

export default function StatCard({ label, value, hint, icon, tone = 'brand' }) {
  const t = TONES[tone];
  return (
    <div className="spotlight group relative overflow-hidden rounded-3xl border border-line bg-card p-5 shadow-card transition duration-300 motion-safe:hover:-translate-y-1 hover:shadow-pop">
      <div aria-hidden="true" className={`pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-linear-to-br ${t.glow} to-transparent blur-2xl transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="relative flex items-center justify-between">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${t.chip} transition-transform duration-300 motion-safe:group-hover:rotate-6 motion-safe:group-hover:scale-110`}>
          <Icon name={icon} className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="tabular relative mt-4 text-[2rem] font-extrabold leading-none tracking-tight text-ink">
        <Value value={value} />
      </p>
      {hint && <p className="relative mt-2 text-xs font-medium text-muted">{hint}</p>}
    </div>
  );
}
