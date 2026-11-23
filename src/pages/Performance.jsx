import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../components/atoms/Avatar';
import Card from '../components/atoms/Card';
import { PageSkeleton } from '../components/atoms/Skeleton';
import PageHeader from '../components/molecules/PageHeader';
import RatingStars from '../components/molecules/RatingStars';
import StatCard from '../components/molecules/StatCard';
import { editEmployee, selectAllEmployees } from '../store/employeesSlice';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useToast from '../hooks/useToast';
import { errMsg } from '../utils/format';

const LABELS = { 1: 'Needs improvement', 2: 'Below expectations', 3: 'Meets expectations', 4: 'Exceeds expectations', 5: 'Outstanding' };

export default function Performance() {
  useDocumentTitle('Performance');
  const dispatch = useDispatch();
  const { notify } = useToast();
  const employees = useSelector(selectAllEmployees);
  const loading = useSelector((s) => s.employees.status === 'idle' || s.employees.status === 'loading');
  const [busyId, setBusyId] = useState(null);

  const active = useMemo(() => employees.filter((e) => e.status !== 'Inactive'), [employees]);
  const stats = useMemo(() => {
    const avg = active.length ? active.reduce((sum, e) => sum + e.rating, 0) / active.length : 0;
    return {
      avg: avg.toFixed(1),
      top: active.filter((e) => e.rating >= 5).length,
      attention: active.filter((e) => e.rating <= 2).length,
    };
  }, [active]);

  const rate = async (employee, rating) => {
    if (employee.rating === rating) return;
    setBusyId(employee.id);
    try {
      await dispatch(editEmployee({ id: employee.id, changes: { rating } })).unwrap();
      notify(`${employee.name} rated ${rating}/5.`);
    } catch (e) {
      notify(errMsg(e), 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader title="Performance" description="Record review ratings and spot who is thriving or needs support." />
      {loading ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Average rating" value={`${stats.avg} / 5`} hint={`across ${active.length} active employees`} icon="star" tone="amber" />
            <StatCard label="Outstanding (5★)" value={stats.top} hint="Consider for recognition" icon="check" />
            <StatCard label="Needs attention (≤2★)" value={stats.attention} hint="Plan a check-in" icon="alert" tone="violet" />
          </div>
          <Card padded={false}>
            <div className="overflow-x-auto pt-3">
              <table className="w-full text-left">
                <caption className="sr-only">Performance ratings. Choose 1 to 5 stars to update a rating.</caption>
                <thead>
                  <tr className="text-xs font-bold uppercase tracking-wide text-muted">
                    <th scope="col" className="px-5 py-3">Employee</th>
                    <th scope="col" className="hidden px-5 py-3 md:table-cell">Department</th>
                    <th scope="col" className="px-5 py-3">Rating</th>
                    <th scope="col" className="hidden px-5 py-3 lg:table-cell">Review</th>
                  </tr>
                </thead>
                <tbody>
                  {active.map((e) => (
                    <tr key={e.id} className="border-t border-line">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={e.name} />
                          <div>
                            <p className="font-semibold text-ink">{e.name}</p>
                            <p className="text-xs text-muted">{e.jobTitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-5 py-3 text-sm text-ink-soft md:table-cell">{e.department}</td>
                      <td className="px-5 py-3">
                        <RatingStars value={e.rating} label={`Rating for ${e.name}`} disabled={busyId === e.id} onChange={(n) => rate(e, n)} />
                      </td>
                      <td className="hidden px-5 py-3 text-sm font-medium text-ink-soft lg:table-cell">{LABELS[e.rating]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
