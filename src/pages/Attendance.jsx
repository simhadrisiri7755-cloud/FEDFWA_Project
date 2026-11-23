import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '../components/atoms/Avatar';
import Card from '../components/atoms/Card';
import { StatusBadge } from '../components/atoms/Badge';
import { PageSkeleton } from '../components/atoms/Skeleton';
import EmptyState from '../components/molecules/EmptyState';
import PageHeader from '../components/molecules/PageHeader';
import StatCard from '../components/molecules/StatCard';
import Tabs from '../components/molecules/Tabs';
import TodayAttendanceCard from '../components/organisms/TodayAttendanceCard';
import { selectAllAttendance } from '../store/attendanceSlice';
import { selectAllEmployees } from '../store/employeesSlice';
import { selectAllLeaves } from '../store/leavesSlice';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { statusFor, workedHours } from '../utils/attendance';
import { formatShortDay, monthKey, todayISO } from '../utils/date';

function MyAttendance({ user, records }) {
  const month = monthKey(todayISO());
  const mine = useMemo(() => records.filter((r) => r.employeeId === user.id), [records, user.id]);
  const thisMonth = mine.filter((r) => r.date.startsWith(month));
  const count = (status) => thisMonth.filter((r) => r.status === status).length;

  return (
    <div className="space-y-6">
      <TodayAttendanceCard />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Present" value={count('Present')} hint="This month" icon="check" />
        <StatCard label="Late arrivals" value={count('Late')} hint="After 9:45 AM" icon="clock" tone="amber" />
        <StatCard label="Absent" value={count('Absent')} hint="This month" icon="x" tone="violet" />
      </div>
      <Card title="Recent days" padded={false}>
        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left">
            <caption className="sr-only">Your attendance for recent days</caption>
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-muted">
                <th scope="col" className="px-5 py-3">Date</th>
                <th scope="col" className="px-5 py-3">Check-in</th>
                <th scope="col" className="px-5 py-3">Check-out</th>
                <th scope="col" className="hidden px-5 py-3 sm:table-cell">Worked</th>
                <th scope="col" className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {mine.slice(0, 14).map((r) => (
                <tr key={r.id} className="border-t border-line text-sm">
                  <th scope="row" className="px-5 py-3 text-left font-semibold text-ink">{formatShortDay(r.date)}</th>
                  <td className="px-5 py-3 text-ink-soft">{r.checkIn ?? '—'}</td>
                  <td className="px-5 py-3 text-ink-soft">{r.checkOut ?? '—'}</td>
                  <td className="hidden px-5 py-3 text-ink-soft sm:table-cell">{workedHours(r)}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function TeamAttendance({ records }) {
  const employees = useSelector(selectAllEmployees);
  const leaves = useSelector(selectAllLeaves);
  const today = todayISO();
  const [date, setDate] = useState(today);

  const rows = useMemo(
    () =>
      employees
        .filter((e) => e.status !== 'Inactive')
        .map((e) => ({ employee: e, ...statusFor(e.id, date, records, leaves) })),
    [employees, records, leaves, date],
  );

  const tally = (s) => rows.filter((r) => r.status === s).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Present" value={tally('Present')} icon="check" />
        <StatCard label="Late" value={tally('Late')} icon="clock" tone="amber" />
        <StatCard label="On leave" value={tally('On Leave')} icon="calendar" tone="violet" />
        <StatCard label="Absent / not marked" value={tally('Absent') + tally('Not marked')} icon="x" tone="sky" />
      </div>

      <Card padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
          <h2 className="text-base font-bold text-ink">Team attendance</h2>
          <div className="flex items-center gap-3">
            <label htmlFor="attendance-date" className="text-sm font-semibold text-ink-soft">Date</label>
            <input
              id="attendance-date"
              type="date"
              value={date}
              max={today}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              className="h-11 rounded-xl border border-line-strong bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>
        </div>
        {rows.length === 0 ? (
          <EmptyState title="No employees" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <caption className="sr-only">Attendance for {formatShortDay(date)}</caption>
              <thead>
                <tr className="text-xs font-bold uppercase tracking-wide text-muted">
                  <th scope="col" className="px-5 py-3">Employee</th>
                  <th scope="col" className="px-5 py-3">Check-in</th>
                  <th scope="col" className="px-5 py-3">Check-out</th>
                  <th scope="col" className="hidden px-5 py-3 sm:table-cell">Worked</th>
                  <th scope="col" className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ employee, status, record }) => (
                  <tr key={employee.id} className="border-t border-line text-sm">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={employee.name} size="sm" />
                        <div>
                          <p className="font-semibold text-ink">{employee.name}</p>
                          <p className="text-xs text-muted">{employee.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{record?.checkIn ?? '—'}</td>
                    <td className="px-5 py-3 text-ink-soft">{record?.checkOut ?? '—'}</td>
                    <td className="hidden px-5 py-3 text-ink-soft sm:table-cell">{workedHours(record)}</td>
                    <td className="px-5 py-3"><StatusBadge status={status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function Attendance() {
  useDocumentTitle('Attendance');
  const { user, isHR } = useAuth();
  const records = useSelector(selectAllAttendance);
  const loading = useSelector((s) => s.attendance.status === 'idle' || s.attendance.status === 'loading');
  const [tab, setTab] = useState('mine');

  return (
    <>
      <PageHeader title="Attendance" description={isHR ? 'Track your own days and see who’s in across the team.' : 'Check in, check out and review your recent days.'} />
      {loading ? (
        <PageSkeleton />
      ) : isHR ? (
        <>
          <Tabs
            label="Attendance views"
            idPrefix="att"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'mine', label: 'My attendance' },
              { value: 'team', label: 'Team' },
            ]}
          />
          <div role="tabpanel" id="att-panel" aria-labelledby={`att-${tab}`}>
            {tab === 'mine' ? <MyAttendance user={user} records={records} /> : <TeamAttendance records={records} />}
          </div>
        </>
      ) : (
        <MyAttendance user={user} records={records} />
      )}
    </>
  );
}
