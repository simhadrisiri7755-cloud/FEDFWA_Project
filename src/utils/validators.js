import { countWeekdays, todayISO } from './date';

export const PHONE_PATTERN = '[6-9][0-9]{9}';
const PHONE_RE = new RegExp(`^${PHONE_PATTERN}$`);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Each validator returns an object of { fieldName: message }. Empty object = valid. */

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'Enter your work email.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Enter your password.';
  return errors;
}

export function validateEmployee(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Full name is required.';
  else if (v.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';

  if (!v.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Enter a valid email address.';

  if (!v.phone.trim()) errors.phone = 'Phone number is required.';
  else if (!PHONE_RE.test(v.phone.trim())) errors.phone = 'Enter a 10-digit mobile number starting with 6–9.';

  if (!v.department) errors.department = 'Choose a department.';
  if (!v.jobTitle.trim()) errors.jobTitle = 'Job title is required.';

  const salary = Number(v.salary);
  if (v.salary === '' || Number.isNaN(salary)) errors.salary = 'Enter the annual salary.';
  else if (salary < 100000) errors.salary = 'Annual salary must be at least ₹1,00,000.';

  if (!v.joinDate) errors.joinDate = 'Joining date is required.';
  else if (v.joinDate > todayISO()) errors.joinDate = 'Joining date cannot be in the future.';

  if (!v.location.trim()) errors.location = 'Work location is required.';
  return errors;
}

export function validateProfile({ phone, location }) {
  const errors = {};
  if (!PHONE_RE.test(phone.trim())) errors.phone = 'Enter a 10-digit mobile number starting with 6–9.';
  if (!location.trim()) errors.location = 'Work location is required.';
  return errors;
}

export function validateLeave(v, daysLeft = Infinity) {
  const errors = {};
  const today = todayISO();
  if (!v.type) errors.type = 'Choose a leave type.';
  if (!v.from) errors.from = 'Choose a start date.';
  else if (v.from < today) errors.from = 'Start date cannot be in the past.';
  if (!v.to) errors.to = 'Choose an end date.';
  else if (v.from && v.to < v.from) errors.to = 'End date must be on or after the start date.';

  if (!errors.from && !errors.to && v.from && v.to) {
    const days = countWeekdays(v.from, v.to);
    if (days === 0) errors.to = 'These dates fall on a weekend — pick working days.';
    else if (days > daysLeft) errors.to = `You only have ${daysLeft} day${daysLeft === 1 ? '' : 's'} of ${v.type} leave left.`;
  }
  if (v.reason.trim().length < 5) errors.reason = 'Give a short reason (at least 5 characters).';
  return errors;
}

/* ---------- sign-up ---------- */

const NAME_RE = /^\p{L}[\p{L} .'-]*$/u;

/** Collapses repeated spaces and trims, e.g. "  Asha   Rao " -> "Asha Rao". */
export const cleanName = (name = '') => name.trim().replace(/\s+/g, ' ');

/** 0 (too short) … 4 (strong). Used by the strength meter; validateSignup enforces the minimum rules. */
export function passwordStrength(password = '') {
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  if (password.length < 8) return { score: 0, label: labels[0] };
  const checks = [/[a-z]/.test(password) && /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)];
  const score = 1 + checks.filter(Boolean).length;
  return { score, label: labels[score] };
}

export function validateSignup(v) {
  const errors = {};
  const name = cleanName(v.name);
  if (!name) errors.name = 'Full name is required.';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
  else if (!NAME_RE.test(name)) errors.name = 'Use letters, spaces, dots, hyphens or apostrophes only.';

  if (!v.email.trim()) errors.email = 'Work email is required.';
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Enter a valid email address.';

  if (!v.phone.trim()) errors.phone = 'Mobile number is required.';
  else if (!PHONE_RE.test(v.phone.trim())) errors.phone = 'Enter a 10-digit mobile number starting with 6–9.';

  if (!v.department) errors.department = 'Choose your department.';
  if (!v.jobTitle.trim()) errors.jobTitle = 'Job title is required.';
  if (!v.location.trim()) errors.location = 'Work location is required.';

  if (!v.password) errors.password = 'Create a password.';
  else if (v.password.length < 8) errors.password = 'Use at least 8 characters.';
  else if (!/[A-Za-z]/.test(v.password) || !/\d/.test(v.password)) errors.password = 'Include at least one letter and one number.';

  if (!v.confirm) errors.confirm = 'Re-enter your password.';
  else if (v.confirm !== v.password) errors.confirm = 'Passwords do not match.';

  if (!v.terms) errors.terms = 'Please accept the terms to continue.';
  return errors;
}
