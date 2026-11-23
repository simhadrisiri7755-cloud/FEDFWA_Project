import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { api } from '../api/mockApi';
import { apiThunk } from './apiThunk';

const adapter = createEntityAdapter({ sortComparer: (a, b) => a.name.localeCompare(b.name) });

export const fetchEmployees = apiThunk('employees/fetch', () => api.getEmployees());
export const addEmployee = apiThunk('employees/add', (payload) => api.createEmployee(payload));
export const editEmployee = apiThunk('employees/edit', ({ id, changes }) => api.updateEmployee(id, changes));
export const removeEmployee = apiThunk('employees/remove', (id) => api.deleteEmployee(id));

const employeesSlice = createSlice({
  name: 'employees',
  initialState: adapter.getInitialState({ status: 'idle', error: null }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        adapter.setAll(state, action.payload);
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Could not load employees.';
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        adapter.addOne(state, action.payload);
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        adapter.upsertOne(state, action.payload);
      })
      .addCase(removeEmployee.fulfilled, (state, action) => {
        adapter.removeOne(state, action.payload);
      });
  },
});

export const { selectAll: selectAllEmployees, selectById: selectEmployeeById } = adapter.getSelectors(
  (state) => state.employees,
);

export default employeesSlice.reducer;
