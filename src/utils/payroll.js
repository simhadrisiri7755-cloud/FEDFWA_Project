/**
 * Turns an annual CTC into a monthly payslip.
 * Earnings: Basic 50%, HRA 20%, Special allowance 30% of monthly gross.
 * Deductions: PF 12% of basic, professional tax ₹200, income tax (TDS) ~5% of gross.
 * Special allowance is the remainder, so the earnings always add up exactly.
 */
export function computePayslip(annualCtc) {
  const gross = Math.round(Number(annualCtc) / 12);
  const basic = Math.round(gross * 0.5);
  const hra = Math.round(gross * 0.2);
  const special = gross - basic - hra;

  const pf = Math.round(basic * 0.12);
  const professionalTax = 200;
  const tds = Math.round(gross * 0.05);
  const totalDeductions = pf + professionalTax + tds;

  return {
    earnings: [
      { label: 'Basic salary', amount: basic },
      { label: 'House rent allowance', amount: hra },
      { label: 'Special allowance', amount: special },
    ],
    deductions: [
      { label: 'Provident fund (12% of basic)', amount: pf },
      { label: 'Professional tax', amount: professionalTax },
      { label: 'Income tax (TDS)', amount: tds },
    ],
    gross,
    totalDeductions,
    net: gross - totalDeductions,
  };
}
