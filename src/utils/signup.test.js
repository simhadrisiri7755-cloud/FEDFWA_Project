import { cleanName, passwordStrength, validateSignup } from './validators';

const valid = {
  name: 'Asha Rao',
  email: 'asha@company.com',
  phone: '9876543210',
  department: 'Engineering',
  jobTitle: 'QA Engineer',
  location: 'Pune',
  password: 'Sunrise42',
  confirm: 'Sunrise42',
  terms: true,
};

describe('validateSignup', () => {
  it('accepts a complete, valid form', () => {
    expect(validateSignup(valid)).toEqual({});
  });

  it('requires every field', () => {
    const errors = validateSignup({ name: '', email: '', phone: '', department: '', jobTitle: '', location: '', password: '', confirm: '', terms: false });
    expect(Object.keys(errors)).toEqual(['name', 'email', 'phone', 'department', 'jobTitle', 'location', 'password', 'confirm', 'terms']);
  });

  it('rejects weak passwords and mismatched confirmation', () => {
    expect(validateSignup({ ...valid, password: 'short1', confirm: 'short1' }).password).toMatch(/8 characters/i);
    expect(validateSignup({ ...valid, password: 'onlyletters', confirm: 'onlyletters' }).password).toMatch(/letter and one number/i);
    expect(validateSignup({ ...valid, confirm: 'Different42' }).confirm).toMatch(/do not match/i);
  });

  it('rejects names with digits and bad phone numbers', () => {
    expect(validateSignup({ ...valid, name: 'R2D2' }).name).toBeDefined();
    expect(validateSignup({ ...valid, phone: '1234567890' }).phone).toBeDefined();
  });
});

describe('cleanName / passwordStrength', () => {
  it('collapses whitespace', () => {
    expect(cleanName('  Asha   Rao ')).toBe('Asha Rao');
  });

  it('scores passwords from too short to strong', () => {
    expect(passwordStrength('abc1').score).toBe(0);
    expect(passwordStrength('abcdefgh').score).toBe(1);
    expect(passwordStrength('Abcdefg1').score).toBe(3);
    expect(passwordStrength('Abcdefg1!').score).toBe(4);
  });
});
