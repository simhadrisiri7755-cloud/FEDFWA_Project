import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../components/atoms/Card';
import { PageSkeleton } from '../components/atoms/Skeleton';
import EmptyState from '../components/molecules/EmptyState';
import PageHeader from '../components/molecules/PageHeader';
import StatCard from '../components/molecules/StatCard';
import Tabs from '../components/molecules/Tabs';
import LeaveForm from '../components/organisms/LeaveForm';
import LeaveTable from '../components/organisms/LeaveTable';
import { applyLeave, reviewLeave, selectAllLeaves } from '../store/leavesSlice';
import { selectAllEmployees } from '../store/employeesSlice';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useToast from '../hooks/useToast';
import { leaveBalance } from '../utils/leave';
import { errMsg } from '../utils/format';

const FILTERS = ['Pending', 'Approved', 'Rejected', 'All'];

export default function Leaves() {
  useDocumentTitle('Leave');
  const dispatch = useDispatch();
  const { user, isHR } = useAuth();
  const { notify } = useToast();

  const leaves = useSelector(selectAllLeaves);
  const employees = useSelector(selectAllEmployees);
  const loading = useSelector((s) => s.leaves.status === 'idle' || s.leaves.status === 'loading');

  const [tab, setTab] = useState(isHR ? 'review' : 'mine');
  const [filter, setFilter] = useState('Pending');
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const employeesById = useMemo(() => Object.fromEntries(employees.map((e) => [e.id, e])), [employees]);
  const mine = useMemo(() => leaves.filter((l) => l.employeeId === user.id), [leaves, user.id]);
  const balance = useMemo(() => leaveBalance(leaves, user.id), [leaves, user.id]);
  const pendingCount = useMemo(() => leaves.filter((l) => l.status === 'Pending').length, [leaves]);
  const reviewList = useMemo(() => leaves.filter((l) => filter === 'All' || l.status === filter), [leaves, filter]);

  const handleApply = async (payload) => {
    setSubmitting(true);
    try {
      await dispatch(applyLeave({ ...payload, employeeId: user.id })).unwrap();
      notify('Leave request submitted. HR will review it shortly.');
      return true;
    } catch (e) {
      notify(errMsg(e), 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async (leave, status) => {
    setBusyId(leave.id);
    try {
      await dispatch(reviewLeave({ id: leave.id, status })).unwrap();
      notify(`${employeesById[leave.employeeId]?.name ?? 'Request'} — ${status.toLowerCase()}.`);
    } catch (e) {
      notify(errMsg(e), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const myLeaves = (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(balance).map(([type, b]) => (
          <StatCard key={type} label={`${type} leave`} value={b.left} hint={`${b.used} used of ${b.total} days`} icon="calendar" tone={type === 'Sick' ? 'sky' : type === 'Earned' ? 'violet' : 'brand'} />
        ))}
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <Card title="My requests" padded={false} className="lg:col-span-3">
          <div className="pt-4">
            {mine.length === 0 ? (
              <EmptyState icon="calendar" title="No requests yet" description="Use the form to apply for your first leave." />
            ) : (
              <LeaveTable leaves={mine} employeesById={employeesById} />
            )}
          </div>
        </Card>
        <div className="lg:col-span-2">
          <LeaveForm balance={balance} onSubmit={handleApply} submitting={submitting} />
        </div>
      </div>
    </div>
  );

  const review = (
    <Card padded={false}>
      <div className="flex flex-wrap items-center gap-2 p-4 sm:p-5" role="group" aria-label="Filter requests by status">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === f ? 'bg-primary text-on-primary' : 'bg-surface-2 text-ink-soft hover:bg-line'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {reviewList.length === 0 ? (
        <EmptyState icon="check" title={filter === 'Pending' ? 'All caught up' : 'Nothing here'} description={filter === 'Pending' ? 'There are no leave requests waiting for review.' : `No ${filter.toLowerCase()} requests.`} />
      ) : (
        <LeaveTable leaves={reviewList} employeesById={employeesById} showEmployee onReview={handleReview} busyId={busyId} />
      )}
    </Card>
  );

  return (
    <>
      <PageHeader
        title="Leave"
        description={isHR ? 'Review your team’s requests and manage your own time off.' : 'Check your balance, apply for time off and track approvals.'}
      />
      {loading ? (
        <PageSkeleton />
      ) : isHR ? (
        <>
          <Tabs
            label="Leave views"
            idPrefix="leave"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'review', label: 'Review requests', count: pendingCount },
              { value: 'mine', label: 'My leave' },
            ]}
          />
          <div role="tabpanel" id="leave-panel" aria-labelledby={`leave-${tab}`}>
            {tab === 'review' ? review : myLeaves}
          </div>
        </>
      ) : (
        myLeaves
      )}
    </>
  );
}
