import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import Field from '../components/molecules/Field';
import PasswordStrength from '../components/molecules/PasswordStrength';
import AuthLayout from '../components/templates/AuthLayout';
import { DEPARTMENTS } from '../data/seed';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useToast from '../hooks/useToast';
import { errMsg } from '../utils/format';
import { PHONE_PATTERN, cleanName, validateSignup } from '../utils/validators';

const HIGHLIGHTS = [
  'Set up your account in under a minute',
  'Check in, request leave and track balances yourself',
  'HR confirms your pay details — payslips appear after your first full month',
];

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  department: '',
  jobTitle: '',
  location: '',
  password: '',
  confirm: '',
  terms: false,
};

export default function Signup() {
  useDocumentTitle('Create account');
  const { user, register } = useAuth();
  const { notify } = useToast();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateSignup(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    setLoading(true);
    try {
      const created = await register({ ...values, name: cleanName(values.name) });
      notify(`Welcome to Staffly, ${created.name.split(' ')[0]}! Your account is ready.`);
    } catch (err) {
      setSubmitError(errMsg(err));
      setLoading(false);
    }
  };

  const pwType = showPasswords ? 'text' : 'password';

  return (
    <AuthLayout headline="Join your team on Staffly." highlights={HIGHLIGHTS}>
      <h1 className="text-[2rem] font-extrabold tracking-tight text-ink">Create your account</h1>
      <p className="mt-2 text-muted">Tell us a little about your role. You’ll be signed in right away.</p>

      <form onSubmit={handleSubmit} noValidate className="spotlight mt-8 space-y-5 rounded-3xl border border-line bg-card p-6 shadow-card sm:p-7">
        {submitError && (
          <p role="alert" className="rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm font-semibold text-danger-ink">
            {submitError}
          </p>
        )}

        <Field name="name" label="Full name" placeholder="e.g. Asha Rao" autoComplete="name" autoFocus required value={values.name} onChange={handleChange} error={errors.name} />
        <Field name="email" label="Work email" type="email" placeholder="you@company.com" autoComplete="email" required value={values.email} onChange={handleChange} error={errors.email} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="phone" label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" pattern={PHONE_PATTERN} maxLength={10} placeholder="9876543210" required value={values.phone} onChange={handleChange} error={errors.phone} />
          <Field name="location" label="Work location" placeholder="e.g. Bengaluru" autoComplete="address-level2" required value={values.location} onChange={handleChange} error={errors.location} />
          <Field name="department" label="Department" as="select" required options={[{ value: '', label: 'Select…' }, ...DEPARTMENTS]} value={values.department} onChange={handleChange} error={errors.department} />
          <Field name="jobTitle" label="Job title" placeholder="e.g. QA Engineer" autoComplete="organization-title" required value={values.jobTitle} onChange={handleChange} error={errors.jobTitle} />
        </div>

        <Field name="password" label="Password" type={pwType} placeholder="At least 8 characters" autoComplete="new-password" hint="Use 8+ characters with at least one letter and one number." required value={values.password} onChange={handleChange} error={errors.password} />
        <PasswordStrength password={values.password} />
        <Field name="confirm" label="Confirm password" type={pwType} placeholder="Re-enter your password" autoComplete="new-password" required value={values.confirm} onChange={handleChange} error={errors.confirm} />

        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-soft">
          <input type="checkbox" checked={showPasswords} onChange={(e) => setShowPasswords(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
          Show passwords
        </label>

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
            <input
              id="field-terms"
              name="terms"
              type="checkbox"
              required
              checked={values.terms}
              onChange={handleChange}
              aria-invalid={errors.terms ? true : undefined}
              aria-describedby={errors.terms ? 'field-terms-error' : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
            />
            <span>I agree to the Terms of Use and the company’s employee data policy.</span>
          </label>
          {errors.terms && (
            <p id="field-terms-error" className="mt-1.5 text-xs font-medium text-danger">
              {errors.terms}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-link hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
