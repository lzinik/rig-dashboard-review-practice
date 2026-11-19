import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/client';
import type { RootState } from '.';
import type { Well } from '../types';

type WellsState = {
  list: Well[];
  selectedId: number | null;
  status: 'idle' | 'loading' | 'loaded';
  lastUpdated: Date | null;
};

const initialState: WellsState = {
  list: [],
  selectedId: null,
  status: 'idle',
  lastUpdated: null,
};

export const fetchWells = createAsyncThunk('wells/fetch', async () => {
  return api.getWells();
});

const wellsSlice = createSlice({
  name: 'wells',
  initialState,
  reducers: {
    wellSelected(state, action: PayloadAction<number>) {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWells.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWells.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.list = action.payload;
        state.lastUpdated = new Date();
        if (!state.selectedId) {
          state.selectedId = action.payload[0].id;
        }
      });
  },
});

export const { wellSelected } = wellsSlice.actions;
export default wellsSlice.reducer;

export const selectWells = (state: RootState) => state.wells.list;

export const selectSelectedWell = (state: RootState) =>
  state.wells.list.find((w) => w.id === state.wells.selectedId);
