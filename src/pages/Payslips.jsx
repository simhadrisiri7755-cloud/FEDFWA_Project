import { useState } from 'react';
import Card from '../components/atoms/Card';
import EmptyState from '../components/molecules/EmptyState';
import PageHeader from '../components/molecules/PageHeader';
import PayslipView from '../components/organisms/PayslipView';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { monthKey, monthLabel, previousMonthKeys } from '../utils/date';

const MONTHS = previousMonthKeys(6);

export default function Payslips() {
  useDocumentTitle('Payslips');
  const { user } = useAuth();

  // Payslips only exist for completed months on or after the joining month, and only once HR has set a salary.
  const months = MONTHS.filter((m) => m >= monthKey(user.joinDate));
  const hasSalary = Number(user.salary) > 0;
  const [month, setMonth] = useState(months[0]);

  if (!hasSalary || months.length === 0) {
    return (
      <>
        <PageHeader title="Payslips" description="View and print your salary slips for the last six months." />
        <Card padded={false}>
          <EmptyState
            icon="card"
            title={hasSalary ? 'No payslips yet' : 'Your pay details are on the way'}
            description={
              hasSalary
                ? 'Your first payslip appears after your first full month with the company.'
                : 'HR still needs to confirm your salary. Once they do, your payslips will show up here.'
            }
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <div className="no-print">
        <PageHeader title="Payslips" description="View and print your salary slips for the last six months." />
        <div role="group" aria-label="Choose a month" className="mb-6 flex flex-wrap gap-2">
          {months.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={month === m}
              onClick={() => setMonth(m)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                month === m ? 'bg-primary text-on-primary shadow-sm' : 'border border-line bg-card text-ink-soft hover:border-primary hover:text-ink'
              }`}
            >
              {monthLabel(m)}
            </button>
          ))}
        </div>
      </div>
      <PayslipView employee={user} month={month} />
    </>
  );
}
