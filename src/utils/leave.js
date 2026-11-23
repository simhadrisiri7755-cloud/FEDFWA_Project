export const LEAVE_TYPES = ['Casual', 'Sick', 'Earned'];

/** Yearly entitlement in working days. */
export const ENTITLEMENT = { Casual: 12, Sick: 10, Earned: 15 };

/** Used / left per leave type for one employee in a calendar year (approved leaves only). */
export function leaveBalance(leaves, employeeId, year = new Date().getFullYear()) {
  return LEAVE_TYPES.reduce((acc, type) => {
    const used = leaves
      .filter((l) => l.employeeId === employeeId && l.type === type && l.status === 'Approved' && l.from.startsWith(String(year)))
      .reduce((sum, l) => sum + l.days, 0);
    acc[type] = { total: ENTITLEMENT[type], used, left: Math.max(ENTITLEMENT[type] - used, 0) };
    return acc;
  }, {});
}

export const isOnLeave = (leaves, employeeId, date) =>
  leaves.some((l) => l.employeeId === employeeId && l.status === 'Approved' && l.from <= date && date <= l.to);
