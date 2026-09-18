import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
      if (value.payload) {
        localStorage.setItem("token", JSON.stringify(value.payload));
      } else {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
