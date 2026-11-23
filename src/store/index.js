import { configureStore } from '@reduxjs/toolkit';
import employees from './employeesSlice';
import leaves from './leavesSlice';
import attendance from './attendanceSlice';

export const createStore = () => configureStore({ reducer: { employees, leaves, attendance } });

export const store = createStore();
