const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatCurrency = (value) => inr.format(Number(value) || 0);

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export const errMsg = (e) => (typeof e === 'string' ? e : e?.message || 'Something went wrong. Please try again.');

export const pluralize = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
