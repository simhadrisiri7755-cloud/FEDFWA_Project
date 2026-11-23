import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { api } from '../api/mockApi';
import { apiThunk } from './apiThunk';

const adapter = createEntityAdapter({ sortComparer: (a, b) => b.appliedOn.localeCompare(a.appliedOn) || b.id.localeCompare(a.id) });

export const fetchLeaves = apiThunk('leaves/fetch', () => api.getLeaves());
export const applyLeave = apiThunk('leaves/apply', (payload) => api.createLeave(payload));
export const reviewLeave = apiThunk('leaves/review', ({ id, status }) => api.reviewLeave(id, status));

const leavesSlice = createSlice({
  name: 'leaves',
  initialState: adapter.getInitialState({ status: 'idle', error: null }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.status = 'succeeded';
        adapter.setAll(state, action.payload);
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Could not load leave requests.';
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        adapter.addOne(state, action.payload);
      })
      .addCase(reviewLeave.fulfilled, (state, action) => {
        adapter.upsertOne(state, action.payload);
      });
  },
});

export const { selectAll: selectAllLeaves } = adapter.getSelectors((state) => state.leaves);

export default leavesSlice.reducer;
