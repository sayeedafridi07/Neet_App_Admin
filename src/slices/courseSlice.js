import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourses(state, action) {
      const { data, pagination } = action.payload;

      state.courses = data;
      state.pagination = pagination;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  setCourses, setLoading,
} = courseSlice.actions;

export default courseSlice.reducer;