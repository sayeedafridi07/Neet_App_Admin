import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  isSubmitting: false,
  isFetched: false,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuestions(state, action) {
      const { data, pagination } = action.payload;
      state.questions = data;
      state.pagination = pagination;
      state.isFetched = true;
    },
    setLoading(state, action) {
      state.loading = action.payload;
      state.isSubmitting = action.payload;
    },
    setIsSubmitting(state, action) {
      state.isSubmitting = action.payload;
    },
  },
});

export const { setQuestions, setLoading, setIsSubmitting } = quizSlice.actions;

export default quizSlice.reducer;
