/**
 * Label + control + hint + error, wired together for assistive tech:
 * label[for], aria-invalid, aria-describedby. Use `as="select"` with `options`, or `as="textarea"`.
 */
export default function Field({ label, name, error, hint, as = 'input', options = [], className = '', ...rest }) {
  const id = `field-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

  const controlClass = `block w-full rounded-xl border bg-card px-3.5 text-sm text-ink placeholder:text-faint transition focus:outline-none focus:ring-2 disabled:bg-surface-2 disabled:text-muted ${
    error ? 'border-danger focus:ring-danger/30' : 'border-line-strong focus:border-primary focus:ring-primary/25'
  }`;

  const common = {
    id,
    name,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    ...rest,
  };

  let control;
  if (as === 'select') {
    control = (
      <select {...common} className={`${controlClass} h-11`}>
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    );
  } else if (as === 'textarea') {
    control = <textarea rows={3} {...common} className={`${controlClass} py-2.5`} />;
  } else {
    control = <input {...common} className={`${controlClass} h-11`} />;
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {rest.required && (
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        )}
      </label>
      {control}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
