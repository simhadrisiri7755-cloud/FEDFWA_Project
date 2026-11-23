import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Avatar from '../components/atoms/Avatar';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import Field from '../components/molecules/Field';
import PageHeader from '../components/molecules/PageHeader';
import RatingStars from '../components/molecules/RatingStars';
import { editEmployee } from '../store/employeesSlice';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useToast from '../hooks/useToast';
import { PHONE_PATTERN, validateProfile } from '../utils/validators';
import { errMsg, formatCurrency } from '../utils/format';
import { formatDate } from '../utils/date';

function Detail({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-ink">{children}</dd>
    </div>
  );
}

export default function Profile() {
  useDocumentTitle('My profile');
  const dispatch = useDispatch();
  const { user, updateUser } = useAuth();
  const { notify } = useToast();

  const [values, setValues] = useState({ phone: user.phone, location: user.location });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const dirty = values.phone !== user.phone || values.location !== user.location;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateProfile(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      const updated = await dispatch(editEmployee({ id: user.id, changes: { phone: values.phone.trim(), location: values.location.trim() } })).unwrap();
      updateUser(updated);
      notify('Your details were updated.');
    } catch (err) {
      notify(errMsg(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="My profile" description="Your employment details. You can keep your contact information up to date." />

      <div className="grid items-start gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex flex-wrap items-center gap-4 border-b border-line pb-6">
            <Avatar name={user.name} size="lg" />
            <div>
              <h2 className="text-xl font-extrabold text-ink">{user.name}</h2>
              <p className="text-sm text-muted">{user.jobTitle} · {user.department}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="brand">{user.systemRole === 'hr' ? 'HR administrator' : 'Employee'}</Badge>
                <Badge tone="neutral">ID {user.id}</Badge>
              </div>
            </div>
          </div>
          <dl className="grid gap-5 pt-6 sm:grid-cols-2">
            <Detail label="Work email">{user.email}</Detail>
            <Detail label="Date of joining">{formatDate(user.joinDate)}</Detail>
            <Detail label="Annual CTC">{Number(user.salary) > 0 ? formatCurrency(user.salary) : 'Awaiting HR'}</Detail>
            <Detail label="Latest rating">
              <RatingStars value={user.rating} />
            </Detail>
          </dl>
        </Card>

        <Card title="Contact information" description="Visible to HR." className="lg:col-span-2">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Field name="phone" label="Mobile number" type="tel" inputMode="numeric" pattern={PHONE_PATTERN} maxLength={10} placeholder="9876543210" required value={values.phone} onChange={handleChange} error={errors.phone} />
            <Field name="location" label="Work location" placeholder="e.g. Bengaluru" required value={values.location} onChange={handleChange} error={errors.location} />
            <Button type="submit" loading={saving} disabled={!dirty} className="w-full">
              Save changes
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
