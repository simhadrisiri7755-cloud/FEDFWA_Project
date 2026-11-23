import { initials } from '../../utils/format';

// Every pair passes 4.5:1 against white text.
const COLORS = [
  ['#0b6f65', '#0a4f49'],
  ['#9a3412', '#7c2a0e'],
  ['#1d4ed8', '#1e3a8a'],
  ['#6d28d9', '#4c1d95'],
  ['#be185d', '#9d174d'],
  ['#4d7c0f', '#3f6212'],
  ['#0e7490', '#155e75'],
  ['#a16207', '#854d0e'],
];
const SIZES = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-xl', xl: 'h-24 w-24 text-3xl' };

const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export default function Avatar({ name, size = 'md' }) {
  const [from, to] = COLORS[hash(name) % COLORS.length];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-bold text-white ring-2 ring-card ${SIZES[size]}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials(name)}
    </span>
  );
}
