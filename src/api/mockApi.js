import { buildSeed } from '../data/seed';
import { LATE_AFTER } from '../utils/attendance';
import { nowTime, todayISO } from '../utils/date';
import { cleanName, validateSignup } from '../utils/validators';

/**
 * A tiny async "backend" persisted in localStorage.
 * Every method returns a Promise after a short delay, exactly like a real
 * fetch() call would — so swapping this file for calls to an Express/REST
 * API (GET/POST/PUT/DELETE) needs no changes in the Redux thunks or UI.
 */
const DB_KEY = 'ems.db.v1';
const LATENCY = 280;

const wait = (ms = LATENCY) => new Promise((resolve) => setTimeout(resolve, ms));

function writeDb(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* storage full or blocked — keep working in memory for this call */
  }
}

function readDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupted JSON — fall through and reseed */
  }
  const db = buildSeed();
  writeDb(db);
  return db;
}

const stripPassword = ({ password, ...rest }) => rest; // eslint-disable-line no-unused-vars

const nextId = (prefix, list, width = 3) => {
  const max = list.reduce((m, item) => Math.max(m, Number(item.id.slice(prefix.length)) || 0), 0);
  return `${prefix}${String(max + 1).padStart(width, '0')}`;
};

export const api = {
  /* ---------- auth ---------- */
  async login({ email, password }) {
    await wait();
    const user = readDb().employees.find((e) => e.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) throw new Error('Incorrect email or password.');
    if (user.status === 'Inactive') throw new Error('This account is deactivated. Please contact HR.');
    return stripPassword(user);
  },

  /**
   * Self-service sign-up. Always creates an ordinary *employee* (never HR — role escalation is
   * impossible from this endpoint). Salary stays 0 until HR sets it, so no payslip is invented.
   * Re-validates on the "server" side because the client can never be trusted.
   */
  async register(payload) {
    await wait();
    const errors = validateSignup({ ...payload, terms: true });
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
    const db = readDb();
    const email = payload.email.trim().toLowerCase();
    if (db.employees.some((e) => e.email.toLowerCase() === email)) {
      throw new Error('An account with this email already exists. Try signing in instead.');
    }
    const employee = {
      id: nextId('E', db.employees),
      name: cleanName(payload.name),
      email,
      password: payload.password, // demo only — a real backend stores a salted hash (bcrypt/argon2)
      phone: payload.phone.trim(),
      department: payload.department,
      jobTitle: payload.jobTitle.trim(),
      systemRole: 'employee',
      salary: 0,
      joinDate: todayISO(),
      location: payload.location.trim(),
      rating: 3,
      status: 'Active',
    };
    db.employees.push(employee);
    writeDb(db);
    return stripPassword(employee);
  },

  /* ---------- employees ---------- */
  async getEmployees() {
    await wait();
    return readDb().employees.map(stripPassword);
  },

  async createEmployee(payload) {
    await wait();
    const db = readDb();
    if (db.employees.some((e) => e.email.toLowerCase() === payload.email.trim().toLowerCase())) {
      throw new Error('An employee with this email already exists.');
    }
    const employee = {
      ...payload,
      email: payload.email.trim(),
      id: nextId('E', db.employees),
      password: 'emp123',
      rating: 3,
    };
    db.employees.push(employee);
    writeDb(db);
    return stripPassword(employee);
  },

  async updateEmployee(id, changes) {
    await wait();
    const db = readDb();
    const index = db.employees.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Employee not found.');
    if (
      changes.email &&
      db.employees.some((e) => e.id !== id && e.email.toLowerCase() === changes.email.trim().toLowerCase())
    ) {
      throw new Error('Another employee already uses this email.');
    }
    db.employees[index] = { ...db.employees[index], ...changes };
    writeDb(db);
    return stripPassword(db.employees[index]);
  },

  async deleteEmployee(id) {
    await wait();
    const db = readDb();
    db.employees = db.employees.filter((e) => e.id !== id);
    db.leaves = db.leaves.filter((l) => l.employeeId !== id);
    db.attendance = db.attendance.filter((a) => a.employeeId !== id);
    writeDb(db);
    return id;
  },

  /* ---------- leaves ---------- */
  async getLeaves() {
    await wait();
    return readDb().leaves;
  },

  async createLeave(payload) {
    await wait();
    const db = readDb();
    const overlaps = db.leaves.some(
      (l) =>
        l.employeeId === payload.employeeId &&
        l.status !== 'Rejected' &&
        l.from <= payload.to &&
        payload.from <= l.to,
    );
    if (overlaps) throw new Error('You already have a leave request covering some of these dates.');
    const leave = { ...payload, id: nextId('L', db.leaves), status: 'Pending', appliedOn: todayISO() };
    db.leaves.push(leave);
    writeDb(db);
    return leave;
  },

  async reviewLeave(id, status) {
    await wait();
    const db = readDb();
    const leave = db.leaves.find((l) => l.id === id);
    if (!leave) throw new Error('Leave request not found.');
    leave.status = status;
    writeDb(db);
    return leave;
  },

  /* ---------- attendance ---------- */
  async getAttendance() {
    await wait();
    return readDb().attendance;
  },

  async checkIn(employeeId) {
    await wait();
    const db = readDb();
    const date = todayISO();
    if (db.attendance.some((a) => a.employeeId === employeeId && a.date === date)) {
      throw new Error('You have already checked in today.');
    }
    const time = nowTime();
    const record = {
      id: nextId('A', db.attendance),
      employeeId,
      date,
      checkIn: time,
      checkOut: null,
      status: time > LATE_AFTER ? 'Late' : 'Present',
    };
    db.attendance.push(record);
    writeDb(db);
    return record;
  },

  async checkOut(employeeId) {
    await wait();
    const db = readDb();
    const record = db.attendance.find((a) => a.employeeId === employeeId && a.date === todayISO());
    if (!record?.checkIn) throw new Error('Check in first before checking out.');
    if (record.checkOut) throw new Error('You have already checked out today.');
    record.checkOut = nowTime();
    writeDb(db);
    return record;
  },

  /* ---------- demo helper ---------- */
  async resetDemoData() {
    await wait(120);
    writeDb(buildSeed());
  },
};
