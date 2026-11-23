import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';

const setup = (props = {}) => {
  const onSubmit = jest.fn();
  render(
    <MemoryRouter>
      <EmployeeForm onSubmit={onSubmit} {...props} />
    </MemoryRouter>,
  );
  return { onSubmit, user: userEvent.setup() };
};

describe('EmployeeForm', () => {
  it('autofocuses the first field and shows required hints', () => {
    setup();
    expect(screen.getByLabelText(/full name/i)).toHaveFocus();
    expect(screen.getByLabelText(/full name/i)).toBeRequired();
  });

  it('shows accessible errors, focuses the first invalid field and does not submit', async () => {
    const { onSubmit, user } = setup();
    await user.click(screen.getByRole('button', { name: /save employee/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    const name = screen.getByLabelText(/full name/i);
    expect(name).toBeInvalid();
    expect(name).toHaveAccessibleDescription(/full name is required/i);
    expect(name).toHaveFocus();
    expect(screen.getByRole('alert')).toHaveTextContent(/fix the highlighted fields/i);
  });

  it('clears a field error as soon as the user edits it', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /save employee/i }));
    await user.type(screen.getByLabelText(/full name/i), 'Aarav');
    expect(screen.getByLabelText(/full name/i)).toBeValid();
  });

  it('submits normalised values when everything is valid', async () => {
    const { onSubmit, user } = setup();
    await user.type(screen.getByLabelText(/full name/i), '  Aarav Sharma ');
    await user.type(screen.getByLabelText(/work email/i), 'aarav@company.com');
    await user.type(screen.getByLabelText(/mobile number/i), '9876543210');
    await user.type(screen.getByLabelText(/work location/i), 'Pune');
    await user.selectOptions(screen.getByLabelText(/department/i), 'Engineering');
    await user.type(screen.getByLabelText(/job title/i), 'Engineer');
    await user.type(screen.getByLabelText(/annual ctc/i), '1200000');
    fireEvent.change(screen.getByLabelText(/joining date/i), { target: { value: '2024-01-15' } });

    await user.click(screen.getByRole('button', { name: /save employee/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Aarav Sharma', salary: 1200000, department: 'Engineering', systemRole: 'employee' }),
    );
  });

  it('locks the access role when editing yourself', () => {
    setup({ lockRole: true });
    expect(screen.getByLabelText(/access role/i)).toBeDisabled();
  });
});
