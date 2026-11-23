const TONES = {
  success: 'bg-success-soft text-success-ink ring-success-line',
  warning: 'bg-warning-soft text-warning-ink ring-warning-line',
  danger: 'bg-danger-soft text-danger-ink ring-danger-line',
  info: 'bg-info-soft text-info-ink ring-info-line',
  brand: 'bg-brand-50 text-link ring-brand-200',
  neutral: 'bg-surface-2 text-ink-soft ring-line',
};

const STATUS_TONE = {
  Active: 'success',
  'On Leave': 'warning',
  Inactive: 'neutral',
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'danger',
  Present: 'success',
  Late: 'warning',
  Absent: 'danger',
  'Not marked': 'neutral',
  Weekend: 'neutral',
};

export default function Badge({ tone = 'neutral', dot = false, children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${TONES[tone]} ${className}`}>
      {dot && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Status is always conveyed by text + colour (never colour alone). */
export function StatusBadge({ status }) {
  return (
    <Badge tone={STATUS_TONE[status] ?? 'neutral'} dot>
      {status}
    </Badge>
  );
}
