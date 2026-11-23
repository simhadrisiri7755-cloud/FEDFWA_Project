import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import { computePayslip } from '../../utils/payroll';
import { formatCurrency } from '../../utils/format';
import { formatDate, monthLabel } from '../../utils/date';

function Lines({ title, rows, total, totalLabel }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wide text-muted">{title}</h3>
      <table className="mt-3 w-full text-sm">
        <caption className="sr-only">{title}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-line">
              <th scope="row" className="py-2.5 pr-3 text-left font-medium text-ink-soft">{r.label}</th>
              <td className="py-2.5 text-right font-semibold text-ink">{formatCurrency(r.amount)}</td>
            </tr>
          ))}
          <tr>
            <th scope="row" className="pt-3 text-left font-bold text-ink">{totalLabel}</th>
            <td className="pt-3 text-right font-extrabold text-ink">{formatCurrency(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function PayslipView({ employee, month }) {
  const slip = computePayslip(employee.salary);
  return (
    <article aria-label={`Payslip for ${monthLabel(month)}`} className="print-area rounded-2xl border border-line bg-card p-6 shadow-[0_1px_2px_rgba(18,32,30,0.04)] sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="text-sm font-bold text-link">Staffly Technologies Pvt. Ltd.</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">Payslip · {monthLabel(month)}</h2>
        </div>
        <Button variant="secondary" icon="printer" className="no-print" onClick={() => window.print()}>
          Print / Save as PDF
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-4 py-6">
        <Avatar name={employee.name} size="lg" />
        <dl className="grid flex-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">Employee</dt>
            <dd className="mt-0.5 font-semibold text-ink">{employee.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">Employee ID</dt>
            <dd className="mt-0.5 font-semibold text-ink">{employee.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">Designation</dt>
            <dd className="mt-0.5 font-semibold text-ink">{employee.jobTitle}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">Department</dt>
            <dd className="mt-0.5 font-semibold text-ink">{employee.department}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">Date of joining</dt>
            <dd className="mt-0.5 font-semibold text-ink">{formatDate(employee.joinDate)}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">Location</dt>
            <dd className="mt-0.5 font-semibold text-ink">{employee.location}</dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Lines title="Earnings" rows={slip.earnings} total={slip.gross} totalLabel="Gross earnings" />
        <Lines title="Deductions" rows={slip.deductions} total={slip.totalDeductions} totalLabel="Total deductions" />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-50 px-6 py-5">
        <p className="text-sm font-bold text-link">Net pay (credited to bank)</p>
        <p className="text-3xl font-extrabold tracking-tight text-ink">{formatCurrency(slip.net)}</p>
      </div>
      <p className="mt-4 text-xs text-muted">This is a computer-generated payslip and does not require a signature.</p>
    </article>
  );
}
