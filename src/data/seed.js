import { addDays, isWeekend, todayISO } from '../utils/date';
import { LATE_AFTER } from '../utils/attendance';

export const DEPARTMENTS = ['Engineering', 'Design', 'Human Resources', 'Finance', 'Marketing', 'Sales', 'Operations'];
export const STATUSES = ['Active', 'On Leave', 'Inactive'];
export const SYSTEM_ROLES = [
  { value: 'employee', label: 'Employee' },
  { value: 'hr', label: 'HR administrator' },
];

// [name, email-local, department, jobTitle, salary, joinDate, location, rating, status, systemRole]
const PEOPLE = [
  ['Priya Nair', 'hr', 'Human Resources', 'HR Manager', 1800000, '2019-04-15', 'Bengaluru', 5, 'Active', 'hr'],
  ['Arjun Mehta', 'arjun', 'Engineering', 'Senior Frontend Engineer', 2400000, '2021-07-01', 'Bengaluru', 4, 'Active', 'employee'],
  ['Sneha Iyer', 'sneha', 'Design', 'Product Designer', 1500000, '2022-02-14', 'Chennai', 4, 'Active', 'employee'],
  ['Rahul Verma', 'rahul', 'Engineering', 'Backend Engineer', 2100000, '2020-11-23', 'Pune', 3, 'Active', 'employee'],
  ['Ananya Rao', 'ananya', 'Marketing', 'Content Strategist', 1100000, '2023-01-09', 'Mumbai', 4, 'Active', 'employee'],
  ['Karan Malhotra', 'karan', 'Sales', 'Account Executive', 1300000, '2022-08-22', 'Delhi', 3, 'Active', 'employee'],
  ['Divya Krishnan', 'divya', 'Finance', 'Financial Analyst', 1600000, '2021-03-30', 'Bengaluru', 5, 'Active', 'employee'],
  ['Vikram Singh', 'vikram', 'Operations', 'Operations Lead', 1900000, '2018-09-03', 'Hyderabad', 4, 'Active', 'employee'],
  ['Meera Joshi', 'meera', 'Engineering', 'QA Engineer', 1250000, '2023-06-12', 'Pune', 2, 'Active', 'employee'],
  ['Aditya Kapoor', 'aditya', 'Sales', 'Sales Manager', 2000000, '2019-12-02', 'Mumbai', 4, 'On Leave', 'employee'],
  ['Pooja Desai', 'pooja', 'Marketing', 'Brand Manager', 1700000, '2020-05-18', 'Ahmedabad', 3, 'Active', 'employee'],
  ['Nikhil Bansal', 'nikhil', 'Finance', 'Accounts Associate', 800000, '2024-02-05', 'Delhi', 3, 'Active', 'employee'],
  ['Ishita Sen', 'ishita', 'Design', 'UX Researcher', 1400000, '2023-09-25', 'Kolkata', 5, 'Active', 'employee'],
  ['Rohan Gupta', 'rohan', 'Operations', 'Logistics Coordinator', 750000, '2022-04-11', 'Hyderabad', 2, 'Inactive', 'employee'],
];

const pad3 = (n) => String(n).padStart(3, '0');

function buildEmployees() {
  return PEOPLE.map(([name, local, department, jobTitle, salary, joinDate, location, rating, status, systemRole], i) => ({
    id: `E${pad3(i + 1)}`,
    name,
    email: `${local}@company.com`,
    password: systemRole === 'hr' ? 'hr123' : 'emp123', // demo only — a real backend never stores plain text
    phone: `98${String(76543210 + i * 1117).slice(0, 8)}`,
    department,
    jobTitle,
    systemRole,
    salary,
    joinDate,
    location,
    rating,
    status,
  }));
}

function buildLeaves(today) {
  const mk = (n, employeeId, type, fromOffset, span, status, reason) => {
    let from = addDays(today, fromOffset);
    while (isWeekend(from)) from = addDays(from, 1);
    const to = addDays(from, span);
    return { id: `L${pad3(n)}`, employeeId, type, from, to, days: 0, reason, status, appliedOn: addDays(from, -6) };
  };
  const leaves = [
    mk(1, 'E002', 'Casual', -40, 1, 'Approved', 'Family function out of town'),
    mk(2, 'E002', 'Sick', -75, 0, 'Approved', 'Viral fever, doctor advised rest'),
    mk(3, 'E003', 'Earned', 9, 4, 'Pending', 'Trip with family'),
    mk(4, 'E004', 'Casual', 3, 0, 'Pending', 'Bank and passport work'),
    mk(5, 'E005', 'Sick', -12, 1, 'Approved', 'Dental procedure'),
    mk(6, 'E007', 'Earned', 14, 6, 'Pending', 'Annual vacation'),
    mk(7, 'E009', 'Casual', -20, 0, 'Rejected', 'Personal errand during release week'),
    mk(8, 'E010', 'Earned', -1, 4, 'Approved', 'Wedding in the family'),
    mk(9, 'E011', 'Sick', 6, 1, 'Pending', 'Scheduled medical checkup'),
  ];
  // days are weekdays between from–to (computed here to keep seed self-contained)
  return leaves.map((l) => {
    let days = 0;
    for (let c = l.from; c <= l.to; c = addDays(c, 1)) if (!isWeekend(c)) days += 1;
    return { ...l, days };
  });
}

function buildAttendance(employees, today) {
  const records = [];
  let n = 1;
  const active = employees.filter((e) => e.status !== 'Inactive');
  for (let back = 14; back >= 1; back -= 1) {
    const date = addDays(today, -back);
    if (isWeekend(date)) continue;
    active.forEach((emp, i) => {
      const roll = (i * 7 + back * 13) % 17;
      if (roll === 0) {
        records.push({ id: `A${pad3(n++)}`, employeeId: emp.id, date, checkIn: null, checkOut: null, status: 'Absent' });
        return;
      }
      const inMin = 8 * 60 + 40 + ((i * 11 + back * 7) % 60); // 08:40–09:39
      const lateMin = roll === 1 || roll === 2 ? 30 : 0;
      const checkIn = toHHMM(inMin + lateMin);
      const checkOut = toHHMM(inMin + lateMin + 8 * 60 + ((i * 5 + back) % 50));
      records.push({
        id: `A${pad3(n++)}`,
        employeeId: emp.id,
        date,
        checkIn,
        checkOut,
        status: checkIn > LATE_AFTER ? 'Late' : 'Present',
      });
    });
  }
  // Today: a few people already checked in; the demo accounts (E001, E002) are left unmarked.
  if (!isWeekend(today)) {
    active.slice(2, 9).forEach((emp, i) => {
      const checkIn = toHHMM(9 * 60 + 2 + i * 6);
      records.push({ id: `A${pad3(n++)}`, employeeId: emp.id, date: today, checkIn, checkOut: null, status: checkIn > LATE_AFTER ? 'Late' : 'Present' });
    });
  }
  return records;
}

const toHHMM = (mins) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

export function buildSeed() {
  const today = todayISO();
  const employees = buildEmployees();
  return { employees, leaves: buildLeaves(today), attendance: buildAttendance(employees, today) };
}
