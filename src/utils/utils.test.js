import { computePayslip } from './payroll';
import { countWeekdays, previousMonthKeys } from './date';
import { leaveBalance } from './leave';
import { workedHours } from './attendance';
import { validateEmployee, validateLeave, validateLogin } from './validators';

describe('computePayslip', () => {
  it('earnings add up to gross and net = gross - deductions', () => {
    const slip = computePayslip(1200000);
    expect(slip.gross).toBe(100000);
    expect(slip.earnings.reduce((s, r) => s + r.amount, 0)).toBe(slip.gross);
    expect(slip.deductions.reduce((s, r) => s + r.amount, 0)).toBe(slip.totalDeductions);
    expect(slip.net).toBe(slip.gross - slip.totalDeductions);
  });
});

describe('date helpers', () => {
  it('counts only weekdays, inclusive', () => {
    // Mon 2026-11-23 → Mon 2026-11-30 spans one weekend
    expect(countWeekdays('2026-11-23', '2026-11-30')).toBe(6);
    expect(countWeekdays('2026-11-28', '2026-11-29')).toBe(0); // Sat–Sun
    expect(countWeekdays('2026-11-30', '2026-11-23')).toBe(0); // reversed
  });

  it('returns previous month keys newest first, across year boundaries', () => {
    expect(previousMonthKeys(3, new Date(2026, 0, 15))).toEqual(['2025-12', '2025-11', '2025-10']);
  });
});

describe('leaveBalance', () => {
  it('only counts approved leave of the requested year', () => {
    const year = new Date().getFullYear();
    const leaves = [
      { employeeId: 'E1', type: 'Casual', status: 'Approved', from: `${year}-03-02`, days: 2 },
      { employeeId: 'E1', type: 'Casual', status: 'Pending', from: `${year}-04-02`, days: 5 },
      { employeeId: 'E2', type: 'Casual', status: 'Approved', from: `${year}-05-02`, days: 3 },
    ];
    expect(leaveBalance(leaves, 'E1', year).Casual).toEqual({ total: 12, used: 2, left: 10 });
  });
});

describe('workedHours', () => {
  it('formats hours and minutes, and handles incomplete days', () => {
    expect(workedHours({ checkIn: '09:10', checkOut: '17:45' })).toBe('8h 35m');
    expect(workedHours({ checkIn: '09:10', checkOut: null })).toBe('—');
  });
});

describe('validators', () => {
  const valid = {
    name: 'Aarav Sharma', email: 'aarav@company.com', phone: '9876543210', department: 'Engineering',
    jobTitle: 'Engineer', salary: '1200000', joinDate: '2023-01-01', location: 'Pune',
  };

  it('accepts a complete employee', () => {
    expect(validateEmployee(valid)).toEqual({});
  });

  it('flags bad phone, email and salary', () => {
    const errors = validateEmployee({ ...valid, phone: '12345', email: 'nope', salary: '500' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'phone', 'salary']);
  });

  it('rejects future joining dates', () => {
    expect(validateEmployee({ ...valid, joinDate: '2999-01-01' }).joinDate).toMatch(/future/);
  });

  it('validates login fields', () => {
    expect(validateLogin({ email: '', password: '' })).toHaveProperty('email');
    expect(validateLogin({ email: 'a@b.co', password: 'x' })).toEqual({});
  });

  it('blocks leave longer than the remaining balance and end-before-start', () => {
    const base = { type: 'Casual', reason: 'Family event' };
    expect(validateLeave({ ...base, from: '2999-01-14', to: '2999-01-08' }).to).toMatch(/on or after/);
    expect(validateLeave({ ...base, from: '2999-01-07', to: '2999-01-18' }, 3).to).toMatch(/only have 3 days/);
    expect(validateLeave({ ...base, from: '2999-01-07', to: '2999-01-08' }, 3)).toEqual({});
  });
});
