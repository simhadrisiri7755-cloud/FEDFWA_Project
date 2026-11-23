import { useState } from 'react';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Field from '../molecules/Field';
import { LEAVE_TYPES } from '../../utils/leave';
import { countWeekdays, todayISO } from '../../utils/date';
import { pluralize } from '../../utils/format';
import { validateLeave } from '../../utils/validators';

const EMPTY = { type: 'Casual', from: '', to: '', reason: '' };

export default function LeaveForm({ balance, onSubmit, submitting }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const days = countWeekdays(values.from, values.to);
  const left = balance[values.type]?.left ?? 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // keep the range valid as the user picks the start date
      if (name === 'from' && next.to && next.to < value) next.to = value;
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateLeave(values, left);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    const ok = await onSubmit({ ...values, reason: values.reason.trim(), days });
    if (ok) setValues(EMPTY);
  };

  const common = (name) => ({ name, value: values[name], onChange: handleChange, error: errors[name] });

  return (
    <Card title="Apply for leave" description="Weekends are not counted.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field
          {...common('type')}
          as="select"
          label="Leave type"
          options={LEAVE_TYPES.map((t) => ({ value: t, label: `${t} (${balance[t].left} left)` }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field {...common('from')} label="From" type="date" min={todayISO()} required />
          <Field {...common('to')} label="To" type="date" min={values.from || todayISO()} required />
        </div>
        {days > 0 && (
          <p className="rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm font-semibold text-link" aria-live="polite">
            {pluralize(days, 'working day')} requested
          </p>
        )}
        <Field {...common('reason')} as="textarea" label="Reason" placeholder="Briefly explain why you need this leave" required />
        <Button type="submit" loading={submitting} className="w-full">
          Submit request
        </Button>
      </form>
    </Card>
  );
}
