import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import { StatusBadge } from '../atoms/Badge';
import { checkIn, checkOut, selectAllAttendance } from '../../store/attendanceSlice';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { formatLongDate, isWeekend, todayISO } from '../../utils/date';
import { errMsg } from '../../utils/format';
import { workedHours } from '../../utils/attendance';

/** Check in / check out for the signed-in user. Shared by the dashboard and the attendance page. */
export default function TodayAttendanceCard() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { notify } = useToast();
  const records = useSelector(selectAllAttendance);
  const [busy, setBusy] = useState(false);

  const today = todayISO();
  const record = records.find((r) => r.employeeId === user.id && r.date === today);

  const run = async (thunk, message) => {
    setBusy(true);
    try {
      await dispatch(thunk(user.id)).unwrap();
      notify(message);
    } catch (e) {
      notify(errMsg(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Today" description={formatLongDate(today)}>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <dl className="flex gap-8">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">Check-in</dt>
            <dd className="mt-1 text-2xl font-extrabold text-ink">{record?.checkIn ?? '--:--'}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">Check-out</dt>
            <dd className="mt-1 text-2xl font-extrabold text-ink">{record?.checkOut ?? '--:--'}</dd>
          </div>
          <div className="hidden sm:block">
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">Worked</dt>
            <dd className="mt-1 text-2xl font-extrabold text-ink">{workedHours(record)}</dd>
          </div>
        </dl>

        <div className="flex items-center gap-3">
          {record && <StatusBadge status={record.status} />}
          {isWeekend(today) && !record ? (
            <span className="text-sm font-medium text-muted">It’s the weekend — enjoy!</span>
          ) : !record ? (
            <Button icon="login" loading={busy} onClick={() => run(checkIn, 'Checked in. Have a great day!')}>
              Check in
            </Button>
          ) : !record.checkOut ? (
            <Button variant="secondary" icon="logout" loading={busy} onClick={() => run(checkOut, 'Checked out. See you tomorrow!')}>
              Check out
            </Button>
          ) : (
            <span className="text-sm font-semibold text-link">Day complete ✓</span>
          )}
        </div>
      </div>
    </Card>
  );
}
