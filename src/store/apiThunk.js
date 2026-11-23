import { createAsyncThunk } from '@reduxjs/toolkit';
import { errMsg } from '../utils/format';

/** createAsyncThunk wrapper: failures reject with a readable string so components can toast it. */
export const apiThunk = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (e) {
      return rejectWithValue(errMsg(e));
    }
  });
