import { passwordStrength } from '../../utils/validators';

const COLORS = ['bg-danger', 'bg-danger', 'bg-accent', 'bg-brand-500', 'bg-brand-600'];

/** Four-segment strength meter. The label is real text, so the state is never conveyed by colour alone. */
export default function PasswordStrength({ password }) {
  if (!password) return null;
  const { score, label } = passwordStrength(password);
  return (
    <div className="-mt-2" aria-live="polite">
      <div aria-hidden="true" className="flex gap-1.5">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${n <= score ? COLORS[score] : 'bg-surface-2'}`} />
        ))}
      </div>
      <p className="mt-1.5 text-xs font-medium text-muted">Password strength: <span className="font-bold text-ink">{label}</span></p>
    </div>
  );
}
