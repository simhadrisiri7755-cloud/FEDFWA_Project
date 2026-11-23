import Icon from '../atoms/Icon';
import useThemeMode from '../../hooks/useThemeMode';

/** Light / dark switch. A real button with aria-pressed, so it is keyboard and screen-reader friendly. */
export default function ThemeToggle({ className = '', onDark = false }) {
  const { mode, toggle } = useThemeMode();
  const dark = mode === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition duration-200 motion-safe:active:scale-90 ${
        onDark ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'border border-line bg-card text-ink-soft shadow-card hover:text-ink'
      } ${className}`}
    >
      <Icon name={dark ? 'sun' : 'moon'} className="h-[18px] w-[18px]" />
    </button>
  );
}
