import reducer, { addEmployee, fetchEmployees, removeEmployee, selectAllEmployees } from './employeesSlice';
import { createStore } from './index';
import { api } from '../api/mockApi';

jest.mock('../api/mockApi', () => ({
  api: { getEmployees: jest.fn(), createEmployee: jest.fn(), updateEmployee: jest.fn(), deleteEmployee: jest.fn() },
}));

const people = [
  { id: 'E002', name: 'Zara Khan' },
  { id: 'E001', name: 'Asha Rao' },
];

describe('employees slice', () => {
  beforeEach(() => jest.clearAllMocks());

  it('starts idle', () => {
    expect(reducer(undefined, { type: 'init' })).toMatchObject({ status: 'idle', error: null, ids: [] });
  });

  it('loads employees (sorted by name) and marks the request succeeded', async () => {
    api.getEmployees.mockResolvedValue(people);
    const store = createStore();
    const pending = store.dispatch(fetchEmployees());
    expect(store.getState().employees.status).toBe('loading');
    await pending;
    expect(store.getState().employees.status).toBe('succeeded');
    expect(selectAllEmployees(store.getState()).map((e) => e.name)).toEqual(['Asha Rao', 'Zara Khan']);
  });

  it('stores a readable error when loading fails', async () => {
    api.getEmployees.mockRejectedValue(new Error('Server down'));
    const store = createStore();
    await store.dispatch(fetchEmployees());
    expect(store.getState().employees).toMatchObject({ status: 'failed', error: 'Server down' });
  });

  it('adds and removes employees', async () => {
    api.createEmployee.mockResolvedValue({ id: 'E003', name: 'Mira Das' });
    api.deleteEmployee.mockResolvedValue('E003');
    const store = createStore();
    await store.dispatch(addEmployee({ name: 'Mira Das' }));
    expect(selectAllEmployees(store.getState())).toHaveLength(1);
    await store.dispatch(removeEmployee('E003'));
    expect(selectAllEmployees(store.getState())).toHaveLength(0);
  });

  it('rejects with the API message so the UI can show a toast', async () => {
    api.createEmployee.mockRejectedValue(new Error('An employee with this email already exists.'));
    const store = createStore();
    await expect(store.dispatch(addEmployee({})).unwrap()).rejects.toBe('An employee with this email already exists.');
  });
});
