import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meetings: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
};

const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    setMeetings(state, action) {
      const { data, pagination } = action.payload;

      state.meetings = data;
      state.pagination = pagination;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  setMeetings, setLoading,
} = meetingSlice.actions;

export default meetingSlice.reducer;