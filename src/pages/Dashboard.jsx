import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Avatar from '../components/atoms/Avatar';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';
import { StatusBadge } from '../components/atoms/Badge';
import { PageSkeleton } from '../components/atoms/Skeleton';
import DonutChart from '../components/molecules/DonutChart';
import EmptyState from '../components/molecules/EmptyState';
import ProgressRing from '../components/molecules/ProgressRing';
import StatCard from '../components/molecules/StatCard';
import TodayAttendanceCard from '../components/organisms/TodayAttendanceCard';
import { selectAllEmployees } from '../store/employeesSlice';
import { selectAllLeaves } from '../store/leavesSlice';
import { selectAllAttendance } from '../store/attendanceSlice';
import { DEPARTMENTS } from '../data/seed';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { computePayslip } from '../utils/payroll';
import { leaveBalance } from '../utils/leave';
import { formatCurrency } from '../utils/format';
import { formatDate, greeting, monthKey, todayISO } from '../utils/date';

const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)', 'var(--chart-6)'];

function useLoading() {
  const statuses = useSelector((s) => [s.employees.status, s.leaves.status, s.attendance.status]);
  return statuses.some((s) => s === 'idle' || s === 'loading');
}

/** Gradient welcome banner. Holds the page's single <h1>. */
function Hero({ title, description, children }) {
  return (
    <section aria-labelledby="dashboard-title" className="bg-hero spotlight spotlight-light relative mb-6 overflow-hidden rounded-[1.75rem] p-6 text-white shadow-pop motion-safe:animate-fade-up sm:p-9">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full border border-white/10 motion-safe:animate-float" />
      <div aria-hidden="true" className="pointer-events-none absolute right-24 top-24 h-16 w-16 rounded-full border border-white/10 motion-safe:animate-float [animation-delay:1.5s]" />
      <div className="relative max-w-2xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white/90 ring-1 ring-white/15">
          <Icon name="sparkle" className="h-3.5 w-3.5 text-accent" />
          Staffly overview
        </p>
        <h1 id="dashboard-title" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-base text-white/80">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">{children}</div>
      </div>
    </section>
  );
}

const heroBtn = 'bg-white! text-[#0a4f49]! shadow-lg hover:bg-white/90!';
const heroGhost = 'border-white/35! bg-white/10! text-white! hover:bg-white/20! hover:border-white/60!';

function HRDashboard({ firstName }) {
  const employees = useSelector(selectAllEmployees);
  const leaves = useSelector(selectAllLeaves);
  const records = useSelector(selectAllAttendance);
  const today = todayISO();

  const data = useMemo(() => {
    const active = employees.filter((e) => e.status !== 'Inactive');
    const presentToday = records.filter((r) => r.date === today && r.checkIn).length;
    const onLeaveToday = leaves.filter((l) => l.status === 'Approved' && l.from <= today && today <= l.to).length;
    const pending = leaves.filter((l) => l.status === 'Pending');
    const byDepartment = DEPARTMENTS.map((name) => ({ name, value: active.filter((e) => e.department === name).length }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .map((d, i) => ({ ...d, color: CHART_COLORS[i % CHART_COLORS.length] }));
    const recent = [...employees].sort((a, b) => b.joinDate.localeCompare(a.joinDate)).slice(0, 4);
    return { active, presentToday, onLeaveToday, pending, byDepartment, recent };
  }, [employees, leaves, records, today]);

  const byId = useMemo(() => Object.fromEntries(employees.map((e) => [e.id, e])), [employees]);
  const rate = data.active.length ? Math.round((data.presentToday / data.active.length) * 100) : 0;

  return (
    <>
      <Hero
        title={`${greeting()}, ${firstName}`}
        description={
          data.pending.length
            ? `You have ${data.pending.length} leave ${data.pending.length === 1 ? 'request' : 'requests'} waiting for review.`
            : 'Everything is up to date across your organisation.'
        }
      >
        <Button as={Link} to="/employees/new" icon="plus" className={heroBtn}>
          Add employee
        </Button>
        <Button as={Link} to="/leaves" variant="secondary" icon="calendar" className={heroGhost}>
          Review leave
        </Button>
      </Hero>

      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active employees" value={data.active.length} hint={`${employees.length} on record`} icon="users" />
        <StatCard label="Checked in today" value={data.presentToday} hint={`of ${data.active.length} active`} icon="clock" tone="sky" />
        <StatCard label="On leave today" value={data.onLeaveToday} hint="Approved leave" icon="calendar" tone="violet" />
        <StatCard label="Pending requests" value={data.pending.length} hint="Waiting for review" icon="briefcase" tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card title="Headcount by department" description="Active employees" className="lg:col-span-3">
          {data.byDepartment.length === 0 ? (
            <EmptyState icon="users" title="No employees yet" description="Add your first employee to see the breakdown." />
          ) : (
            <DonutChart data={data.byDepartment} total={data.active.length} centerLabel="active" label={`Active employees by department: ${data.byDepartment.map((d) => `${d.name} ${d.value}`).join(', ')}`} />
          )}
        </Card>

        <Card title="Attendance today" description="Checked in vs. active staff" className="lg:col-span-2">
          <ProgressRing value={rate} label="Attendance today" sublabel={`${data.presentToday} of ${data.active.length}`} />
          <p className="mt-4 text-center text-sm text-muted">
            {rate >= 80 ? 'Strong turnout today.' : rate > 0 ? 'Check-ins are still coming in.' : 'No one has checked in yet.'}
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card title="Needs your review" className="lg:col-span-3" action={<Link to="/leaves" className="text-sm font-semibold text-link hover:underline">View all</Link>}>
          {data.pending.length === 0 ? (
            <EmptyState icon="check" title="All caught up" description="No leave requests are waiting." />
          ) : (
            <ul className="divide-y divide-line">
              {data.pending.slice(0, 4).map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar name={byId[l.employeeId]?.name ?? '?'} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{byId[l.employeeId]?.name}</p>
                    <p className="text-xs text-muted">{l.type} · {formatDate(l.from)} · {l.days}d</p>
                  </div>
                  <StatusBadge status="Pending" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recently joined" className="lg:col-span-2" action={<Link to="/employees" className="text-sm font-semibold text-link hover:underline">Directory</Link>}>
          <ul className="space-y-2">
            {data.recent.map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-2xl bg-surface p-3 transition-colors hover:bg-surface-2">
                <Avatar name={e.name} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{e.name}</p>
                  <p className="truncate text-xs text-muted">{e.department} · {formatDate(e.joinDate, { month: 'short', year: 'numeric' })}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

function BalanceBar({ label, left, total, color }) {
  const pct = total ? Math.round((left / total) * 100) : 0;
  return (
    <li>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-semibold text-ink-soft">{label}</span>
        <span className="tabular font-bold text-ink">
          {left} <span className="font-medium text-muted">/ {total} days</span>
        </span>
      </div>
      <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full transition-[width] duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </li>
  );
}

function EmployeeDashboard({ user, firstName }) {
  const leaves = useSelector(selectAllLeaves);
  const records = useSelector(selectAllAttendance);
  const month = monthKey(todayISO());

  const balance = useMemo(() => leaveBalance(leaves, user.id), [leaves, user.id]);
  const mine = useMemo(() => leaves.filter((l) => l.employeeId === user.id).slice(0, 4), [leaves, user.id]);
  const presentDays = records.filter((r) => r.employeeId === user.id && r.date.startsWith(month) && r.checkIn).length;
  const hasSalary = Number(user.salary) > 0;
  const net = hasSalary ? computePayslip(user.salary).net : 0;

  return (
    <>
      <Hero title={`${greeting()}, ${firstName}`} description="Here’s your day at a glance.">
        <Button as={Link} to="/leaves" icon="calendar" className={heroBtn}>
          Apply for leave
        </Button>
        <Button as={Link} to="/payslips" variant="secondary" icon="card" className={heroGhost}>
          View payslips
        </Button>
      </Hero>

      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Casual leave left" value={balance.Casual.left} hint={`of ${balance.Casual.total} days`} icon="calendar" />
        <StatCard label="Sick leave left" value={balance.Sick.left} hint={`of ${balance.Sick.total} days`} icon="briefcase" tone="sky" />
        <StatCard label="Days present" value={presentDays} hint="This month" icon="clock" tone="violet" />
        <StatCard label="Monthly net pay" value={hasSalary ? formatCurrency(net) : 'Pending'} hint={hasSalary ? 'After deductions' : 'HR will confirm your pay'} icon="card" tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TodayAttendanceCard />
        </div>
        <Card title="Leave balance" description="Days remaining this year" className="lg:col-span-2">
          <ul className="space-y-5">
            <BalanceBar label="Casual" left={balance.Casual.left} total={balance.Casual.total} color="var(--chart-1)" />
            <BalanceBar label="Sick" left={balance.Sick.left} total={balance.Sick.total} color="var(--chart-3)" />
          </ul>
        </Card>
      </div>

      <Card title="My recent leave requests" className="mt-6" action={<Link to="/leaves" className="text-sm font-semibold text-link hover:underline">Apply for leave</Link>}>
        {mine.length === 0 ? (
          <EmptyState icon="calendar" title="No leave requests yet" description="When you apply for leave, it will show up here." />
        ) : (
          <ul className="divide-y divide-line">
            {mine.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-ink">{l.type} leave · {l.days} {l.days === 1 ? 'day' : 'days'}</p>
                  <p className="text-xs text-muted">{formatDate(l.from)}{l.from !== l.to && ` – ${formatDate(l.to)}`}</p>
                </div>
                <StatusBadge status={l.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

export default function Dashboard() {
  useDocumentTitle('Dashboard');
  const { user, isHR } = useAuth();
  const loading = useLoading();
  const firstName = user.name.split(' ')[0];

  if (loading) {
    return (
      <>
        <h1 className="sr-only">Dashboard</h1>
        <PageSkeleton />
      </>
    );
  }
  return isHR ? <HRDashboard firstName={firstName} /> : <EmployeeDashboard user={user} firstName={firstName} />;
}
