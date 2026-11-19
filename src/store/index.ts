import { configureStore } from '@reduxjs/toolkit';
import wellsReducer from './wellsSlice';
import witsReducer from './witsSlice';

export const store = configureStore({
  reducer: {
    wells: wellsReducer,
    wits: witsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
