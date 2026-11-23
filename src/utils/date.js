const pad = (n) => String(n).padStart(2, '0');

/** Local-time ISO date, e.g. "2026-11-23" (avoids the UTC shift of toISOString). */
export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = () => toISODate(new Date());

/** Parse "YYYY-MM-DD" as a local date. */
export const parseISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (iso, n) => {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
};

export const nowTime = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const isWeekend = (iso) => {
  const day = parseISO(iso).getDay();
  return day === 0 || day === 6;
};

export const formatDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  iso ? new Intl.DateTimeFormat('en-IN', opts).format(parseISO(iso)) : '—';

export const formatLongDate = (iso) =>
  formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export const formatShortDay = (iso) => formatDate(iso, { weekday: 'short', day: 'numeric', month: 'short' });

export const monthKey = (iso) => iso.slice(0, 7);

export const monthLabel = (key) =>
  new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(parseISO(`${key}-01`));

/** Weekdays (Mon–Fri) between two ISO dates, inclusive. */
export const countWeekdays = (from, to) => {
  if (!from || !to || to < from) return 0;
  let count = 0;
  for (let cursor = from; cursor <= to; cursor = addDays(cursor, 1)) {
    if (!isWeekend(cursor)) count += 1;
  }
  return count;
};

/** Last `n` month keys before the current month, newest first. */
export const previousMonthKeys = (n, from = new Date()) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth() - (i + 1), 1);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  });

export const greeting = (date = new Date()) => {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};
