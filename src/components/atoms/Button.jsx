import Icon from './Icon';
import Spinner from './Spinner';

const VARIANTS = {
  primary:
    'spotlight spotlight-light bg-primary text-on-primary hover:bg-primary-hover shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_18px_-8px_rgb(11_111_101/0.65)] hover:-translate-y-px',
  secondary: 'bg-card text-ink border border-line-strong hover:bg-surface-2 hover:border-primary/60',
  danger: 'bg-danger-solid text-white hover:brightness-90 shadow-sm',
  ghost: 'text-ink-soft hover:bg-surface-2 hover:text-ink',
  success: 'bg-success-soft text-success-ink border border-success-line hover:brightness-95',
  reject: 'bg-danger-soft text-danger-ink border border-danger-line hover:brightness-95',
};

const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

/** Polymorphic button: pass `as={Link}` (with `to`) to render a router link that looks like a button. */
export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  children,
  ...props
}) {
  const isNativeButton = Component === 'button';
  return (
    <Component
      {...(isNativeButton ? { type: 'button', disabled: loading || props.disabled } : {})}
      {...props}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition duration-200 motion-safe:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {loading ? <Spinner /> : icon ? <Icon name={icon} className="h-4 w-4" /> : null}
      {children}
    </Component>
  );
}
