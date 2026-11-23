import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { api } from '../api/mockApi';
import { apiThunk } from './apiThunk';

const adapter = createEntityAdapter({ sortComparer: (a, b) => b.date.localeCompare(a.date) });

export const fetchAttendance = apiThunk('attendance/fetch', () => api.getAttendance());
export const checkIn = apiThunk('attendance/checkIn', (employeeId) => api.checkIn(employeeId));
export const checkOut = apiThunk('attendance/checkOut', (employeeId) => api.checkOut(employeeId));

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: adapter.getInitialState({ status: 'idle', error: null }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        adapter.setAll(state, action.payload);
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Could not load attendance.';
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        adapter.addOne(state, action.payload);
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        adapter.upsertOne(state, action.payload);
      });
  },
});

export const { selectAll: selectAllAttendance } = adapter.getSelectors((state) => state.attendance);

export default attendanceSlice.reducer;
