import Icon from '../atoms/Icon';

/** Read-only when `onChange` is omitted; otherwise a keyboard-friendly 1–5 button group. */
export default function RatingStars({ value, onChange, label, disabled = false }) {
  if (!onChange) {
    return (
      <span className="inline-flex items-center gap-0.5 text-accent" role="img" aria-label={`${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Icon key={n} name="star" filled={n <= value} className={`h-4 w-4 ${n <= value ? '' : 'text-line-strong'}`} />
        ))}
      </span>
    );
  }
  return (
    <div role="group" aria-label={label} className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          aria-pressed={n === value}
          aria-label={`Rate ${n} out of 5`}
          onClick={() => onChange(n)}
          className="rounded-md p-1 text-accent transition motion-safe:hover:scale-110 disabled:opacity-50"
        >
          <Icon name="star" filled={n <= value} className={`h-5 w-5 ${n <= value ? '' : 'text-line-strong'}`} />
        </button>
      ))}
    </div>
  );
}
