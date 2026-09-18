import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: {
    data: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
    loading: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers(state, action) {
      const { role, data, pagination } = action.payload;

      state[role].data = data;
      state[role].pagination = pagination;
    },

    setLoading(state, action) {
      const { role, loading } = action.payload;
      state[role].loading = loading;
    },
  },
});

export const {
  setUsers, setLoading,
} = userSlice.actions;

export default userSlice.reducer;