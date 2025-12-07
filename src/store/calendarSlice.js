import { createSlice } from '@reduxjs/toolkit';
import dummyData from '../data/dummyData.json';

const initialState = {
  events: [],
  selectedDate: null,
  calendarData: dummyData,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    clearSelectedDate: (state) => {
      state.selectedDate = null;
    },
  },
});

export const { setSelectedDate, clearSelectedDate } = calendarSlice.actions;
export default calendarSlice.reducer;

