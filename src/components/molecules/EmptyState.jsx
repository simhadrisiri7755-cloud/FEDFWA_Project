import Icon from '../atoms/Icon';

export default function EmptyState({ title, description, action, icon = 'search' }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-link ring-1 ring-brand-200">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
