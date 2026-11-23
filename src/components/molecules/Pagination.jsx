import Button from '../atoms/Button';

export default function Pagination({ page, pageCount, total, pageSize, onChange }) {
  if (total === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5">
      <p className="text-sm text-muted">
        Showing <span className="font-semibold text-ink">{start}–{end}</span> of <span className="font-semibold text-ink">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" icon="left" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
          Prev
        </Button>
        <span className="px-1 text-sm font-semibold text-ink" aria-current="page">
          {page} / {pageCount}
        </span>
        <Button size="sm" variant="secondary" disabled={page >= pageCount} onClick={() => onChange(page + 1)} aria-label="Next page">
          Next
          <span aria-hidden="true">→</span>
        </Button>
      </div>
    </nav>
  );
}
