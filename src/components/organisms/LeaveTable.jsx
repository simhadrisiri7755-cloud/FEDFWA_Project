import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import { StatusBadge } from '../atoms/Badge';
import { formatDate } from '../../utils/date';

/** Leave requests list. Pass `onReview` to show approve/reject actions for pending rows (HR). */
export default function LeaveTable({ leaves, employeesById, showEmployee = false, onReview, busyId }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <caption className="sr-only">Leave requests</caption>
        <thead>
          <tr className="text-xs font-bold uppercase tracking-wide text-muted">
            {showEmployee && <th scope="col" className="px-5 py-3">Employee</th>}
            <th scope="col" className="px-5 py-3">Type</th>
            <th scope="col" className="px-5 py-3">Dates</th>
            <th scope="col" className="hidden px-5 py-3 md:table-cell">Reason</th>
            <th scope="col" className="px-5 py-3">Status</th>
            {onReview && <th scope="col" className="px-5 py-3 text-right"><span className="sr-only">Actions</span></th>}
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => {
            const emp = employeesById[l.employeeId];
            const range = l.from === l.to ? formatDate(l.from) : `${formatDate(l.from)} – ${formatDate(l.to)}`;
            return (
              <tr key={l.id} className="border-t border-line align-top">
                {showEmployee && (
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp?.name ?? '?'} size="sm" />
                      <span className="font-semibold text-ink">{emp?.name ?? 'Former employee'}</span>
                    </div>
                  </td>
                )}
                <td className="px-5 py-3.5 text-sm font-medium text-ink">{l.type}</td>
                <td className="px-5 py-3.5 text-sm text-ink-soft">
                  {range}
                  <span className="block text-xs text-muted">{l.days} working {l.days === 1 ? 'day' : 'days'}</span>
                </td>
                <td className="hidden max-w-xs px-5 py-3.5 text-sm text-ink-soft md:table-cell">{l.reason}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={l.status} />
                </td>
                {onReview && (
                  <td className="px-5 py-3.5">
                    {l.status === 'Pending' && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="success" icon="check" loading={busyId === l.id} onClick={() => onReview(l, 'Approved')} aria-label={`Approve ${l.type} leave for ${emp?.name}`}>
                          Approve
                        </Button>
                        <Button size="sm" variant="reject" icon="x" disabled={busyId === l.id} onClick={() => onReview(l, 'Rejected')} aria-label={`Reject ${l.type} leave for ${emp?.name}`}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
