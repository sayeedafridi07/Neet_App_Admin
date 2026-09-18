import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  programs: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
};

const programSlice = createSlice({
  name: "program",
  initialState,
  reducers: {
    setPrograms(state, action) {
      const { data, pagination } = action.payload;

      state.programs = data;
      state.pagination = pagination;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  setPrograms, setLoading,
} = programSlice.actions;

export default programSlice.reducer;