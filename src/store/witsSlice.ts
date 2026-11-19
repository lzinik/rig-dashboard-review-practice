import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';
import type { Channel, WitsRecord } from '../types';

type WitsState = {
  records: WitsRecord[];
  connected: boolean;
};

const initialState: WitsState = {
  records: [],
  connected: false,
};

const witsSlice = createSlice({
  name: 'wits',
  initialState,
  reducers: {
    recordReceived(state, action: PayloadAction<WitsRecord>) {
      state.records.push(action.payload);
    },
    connectionChanged(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
  },
});

export const { recordReceived, connectionChanged } = witsSlice.actions;
export default witsSlice.reducer;

export const selectRecords = (state: RootState) => state.wits.records;

export const selectLatest = (state: RootState) =>
  state.wits.records[state.wits.records.length - 1];

export const selectSeries = (channel: Channel) => (state: RootState) =>
  state.wits.records.map((r) => [r.timestamp, r.data[channel]] as [number, number]);
