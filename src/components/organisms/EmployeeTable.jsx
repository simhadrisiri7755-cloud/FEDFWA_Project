import { memo } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../atoms/Avatar';
import Icon from '../atoms/Icon';
import { StatusBadge } from '../atoms/Badge';
import { formatCurrency } from '../../utils/format';
import { formatDate } from '../../utils/date';

// memo: typing in the search box re-renders the page, but rows whose props are unchanged are skipped.
const EmployeeRow = memo(function EmployeeRow({ employee, isSelf, onDelete }) {
  return (
    <tr className="border-t border-line transition-colors hover:bg-surface-2/50">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar name={employee.name} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">
              {employee.name}
              {isSelf && <span className="ml-2 text-xs font-medium text-muted">(you)</span>}
            </p>
            <p className="truncate text-xs text-muted">{employee.jobTitle}</p>
          </div>
        </div>
      </td>
      <td className="hidden px-5 py-3.5 text-sm text-ink-soft md:table-cell">{employee.department}</td>
      <td className="hidden px-5 py-3.5 text-sm text-ink-soft lg:table-cell">{formatDate(employee.joinDate)}</td>
      <td className="hidden px-5 py-3.5 text-sm font-medium text-ink lg:table-cell">{formatCurrency(employee.salary)}</td>
      <td className="px-5 py-3.5">
        <StatusBadge status={employee.status} />
      </td>
      <td className="px-5 py-3.5">
        <div className="flex justify-end gap-1">
          <Link
            to={`/employees/${employee.id}/edit`}
            aria-label={`Edit ${employee.name}`}
            className="rounded-lg p-2 text-ink-soft transition hover:bg-surface-2 hover:text-link"
          >
            <Icon name="edit" className="h-[18px] w-[18px]" />
          </Link>
          <button
            type="button"
            disabled={isSelf}
            onClick={() => onDelete(employee)}
            aria-label={`Delete ${employee.name}`}
            title={isSelf ? 'You cannot delete your own account' : undefined}
            className="rounded-lg p-2 text-ink-soft transition hover:bg-danger-soft hover:text-danger disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Icon name="trash" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </td>
    </tr>
  );
});

export default function EmployeeTable({ employees, currentUserId, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <caption className="sr-only">Employees. Columns: name and role, department, joining date, annual salary, status, actions.</caption>
        <thead>
          <tr className="bg-surface-2/50 text-xs font-bold uppercase tracking-wider text-muted">
            <th scope="col" className="px-5 py-3">Employee</th>
            <th scope="col" className="hidden px-5 py-3 md:table-cell">Department</th>
            <th scope="col" className="hidden px-5 py-3 lg:table-cell">Joined</th>
            <th scope="col" className="hidden px-5 py-3 lg:table-cell">Annual CTC</th>
            <th scope="col" className="px-5 py-3">Status</th>
            <th scope="col" className="px-5 py-3 text-right"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <EmployeeRow key={e.id} employee={e} isSelf={e.id === currentUserId} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
