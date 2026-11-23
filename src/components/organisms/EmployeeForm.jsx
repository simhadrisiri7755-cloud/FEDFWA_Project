import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Field from '../molecules/Field';
import { DEPARTMENTS, STATUSES, SYSTEM_ROLES } from '../../data/seed';
import { PHONE_PATTERN, validateEmployee } from '../../utils/validators';
import { todayISO } from '../../utils/date';

export const EMPTY_EMPLOYEE = {
  name: '',
  email: '',
  phone: '',
  department: '',
  jobTitle: '',
  systemRole: 'employee',
  salary: '',
  joinDate: '',
  status: 'Active',
  location: '',
};

/**
 * Controlled form used for both "Add" and "Edit".
 * Native constraints (required, pattern, type, min) are present for browsers and assistive tech,
 * while noValidate lets us show our own consistent, accessible error messages.
 */
export default function EmployeeForm({ initialValues = EMPTY_EMPLOYEE, onSubmit, submitting = false, lockRole = false, submitLabel = 'Save employee' }) {
  const [values, setValues] = useState({ ...EMPTY_EMPLOYEE, ...initialValues });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateEmployee(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }
    onSubmit({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      jobTitle: values.jobTitle.trim(),
      location: values.location.trim(),
      salary: Number(values.salary),
    });
  };

  const common = (name) => ({ name, value: values[name], onChange: handleChange, error: errors[name] });
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form onSubmit={handleSubmit} noValidate aria-describedby={hasErrors ? 'form-summary' : undefined} className="space-y-6">
      {hasErrors && (
        <p id="form-summary" role="alert" className="rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm font-semibold text-danger-ink">
          Please fix the highlighted fields below.
        </p>
      )}

      <Card title="Personal details" description="Basic contact information.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field {...common('name')} label="Full name" placeholder="e.g. Aarav Sharma" required autoFocus autoComplete="off" />
          <Field {...common('email')} label="Work email" type="email" placeholder="name@company.com" required autoComplete="off" />
          <Field
            {...common('phone')}
            label="Mobile number"
            type="tel"
            inputMode="numeric"
            placeholder="9876543210"
            pattern={PHONE_PATTERN}
            maxLength={10}
            hint="10 digits, starting with 6–9."
            required
          />
          <Field {...common('location')} label="Work location" placeholder="e.g. Bengaluru" required />
        </div>
      </Card>

      <Card title="Job & compensation" description="Role, department and pay.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field {...common('department')} as="select" label="Department" required options={[{ value: '', label: 'Select a department' }, ...DEPARTMENTS]} />
          <Field {...common('jobTitle')} label="Job title" placeholder="e.g. Software Engineer" required />
          <Field
            {...common('systemRole')}
            as="select"
            label="Access role"
            options={SYSTEM_ROLES}
            disabled={lockRole}
            hint={lockRole ? 'You cannot change your own access role.' : 'HR administrators can manage all employees.'}
          />
          <Field {...common('status')} as="select" label="Employment status" options={STATUSES} />
          <Field {...common('salary')} label="Annual CTC (₹)" type="number" min="100000" step="1000" inputMode="numeric" placeholder="1200000" required />
          <Field {...common('joinDate')} label="Joining date" type="date" max={todayISO()} required />
        </div>
      </Card>

      <div className="flex flex-wrap justify-end gap-3">
        <Button as={Link} to="/employees" variant="secondary">
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
