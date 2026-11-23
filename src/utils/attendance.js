import { isWeekend } from './date';
import { isOnLeave } from './leave';

export const LATE_AFTER = '09:45';

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** "8h 12m" worked, or "—" when the day isn't complete. */
export function workedHours(record) {
  if (!record?.checkIn || !record?.checkOut) return '—';
  const mins = toMinutes(record.checkOut) - toMinutes(record.checkIn);
  if (mins <= 0) return '—';
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
}

/** Status of one employee on one date, combining attendance records and approved leave. */
export function statusFor(employeeId, date, records, leaves) {
  const record = records.find((r) => r.employeeId === employeeId && r.date === date);
  if (record) return { status: record.status, record };
  if (isOnLeave(leaves, employeeId, date)) return { status: 'On Leave', record: null };
  if (isWeekend(date)) return { status: 'Weekend', record: null };
  return { status: 'Not marked', record: null };
}
