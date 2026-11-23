import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/atoms/Button';
import { PageSkeleton } from '../components/atoms/Skeleton';
import EmptyState from '../components/molecules/EmptyState';
import PageHeader from '../components/molecules/PageHeader';
import EmployeeForm from '../components/organisms/EmployeeForm';
import { addEmployee, editEmployee, selectEmployeeById } from '../store/employeesSlice';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useToast from '../hooks/useToast';
import { errMsg } from '../utils/format';

/** One page for both "Add employee" (/employees/new) and "Edit employee" (/employees/:id/edit). */
export default function EmployeeEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  useDocumentTitle(isEdit ? 'Edit employee' : 'Add employee');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { notify } = useToast();
  const employee = useSelector((s) => selectEmployeeById(s, id));
  const status = useSelector((s) => s.employees.status);
  const [submitting, setSubmitting] = useState(false);

  if (isEdit && !employee) {
    if (status === 'idle' || status === 'loading') return <PageSkeleton />;
    return (
      <EmptyState
        title="Employee not found"
        description="They may have been removed."
        action={<Button as={Link} to="/employees">Back to employees</Button>}
      />
    );
  }

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        const updated = await dispatch(editEmployee({ id, changes: values })).unwrap();
        if (updated.id === user.id) updateUser(updated); // keep the signed-in session in sync
        notify(`${updated.name} was updated.`);
      } else {
        const created = await dispatch(addEmployee(values)).unwrap();
        notify(`${created.name} was added. Default password: emp123`);
      }
      navigate('/employees');
    } catch (e) {
      notify(errMsg(e), 'error');
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title={isEdit ? `Edit ${employee.name}` : 'Add employee'}
        description={isEdit ? `Employee ID ${employee.id}` : 'Create a profile and assign a role. New accounts start with the password “emp123”.'}
      />
      <div className="max-w-3xl">
        <EmployeeForm
          key={employee?.id ?? 'new'}
          initialValues={employee}
          onSubmit={handleSubmit}
          submitting={submitting}
          lockRole={isEdit && employee.id === user.id}
          submitLabel={isEdit ? 'Save changes' : 'Add employee'}
        />
      </div>
    </>
  );
}
