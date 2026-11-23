import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Field from '../components/molecules/Field';
import AuthLayout from '../components/templates/AuthLayout';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { errMsg } from '../utils/format';
import { validateLogin } from '../utils/validators';

const DEMO = [
  { label: 'HR administrator', email: 'hr@company.com', password: 'hr123' },
  { label: 'Employee', email: 'arjun@company.com', password: 'emp123' },
];

const HIGHLIGHTS = [
  'Employee profiles, roles and departments in one place',
  'One-tap attendance, leave requests and approvals',
  'Payslips employees can view and print themselves',
];

export default function Login() {
  useDocumentTitle('Sign in');
  const { user, login } = useAuth();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={location.state?.from?.pathname ?? '/'} replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateLogin(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    setLoading(true);
    try {
      await login(values);
    } catch (err) {
      setSubmitError(errMsg(err));
      setLoading(false);
    }
  };

  return (
    <AuthLayout headline="People operations, without the paperwork." highlights={HIGHLIGHTS}>
      <h1 className="text-[2rem] font-extrabold tracking-tight text-ink">Welcome back</h1>
      <p className="mt-2 text-muted">Sign in to manage your team or view your own records.</p>

      <form onSubmit={handleSubmit} noValidate className="spotlight mt-8 space-y-5 rounded-3xl border border-line bg-card p-6 shadow-card sm:p-7">
        {submitError && (
          <p role="alert" className="rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm font-semibold text-danger-ink">
            {submitError}
          </p>
        )}
        <Field name="email" label="Work email" type="email" placeholder="you@company.com" autoComplete="username" autoFocus required value={values.email} onChange={handleChange} error={errors.email} />
        <Field name="password" label="Password" type="password" placeholder="Enter your password" autoComplete="current-password" required value={values.password} onChange={handleChange} error={errors.password} />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        New to Staffly?{' '}
        <Link to="/signup" className="font-bold text-link hover:underline">
          Create an account
        </Link>
      </p>

      <section aria-labelledby="demo-heading" className="mt-6 rounded-3xl border border-dashed border-line-strong bg-card/60 p-5">
        <h2 id="demo-heading" className="text-sm font-bold text-ink">Try a demo account</h2>
        <p className="mt-1 text-xs text-muted">Fills the form for you — then press “Sign in”.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {DEMO.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => {
                setValues({ email: d.email, password: d.password });
                setErrors({});
                setSubmitError('');
              }}
              className="spotlight rounded-2xl border border-line bg-card px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-primary"
            >
              <span className="block text-sm font-bold text-ink">{d.label}</span>
              <span className="block truncate text-xs text-muted">{d.email}</span>
            </button>
          ))}
        </div>
      </section>
    </AuthLayout>
  );
}
