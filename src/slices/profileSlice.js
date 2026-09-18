import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: localStorage.getItem("profile")
    ? JSON.parse(localStorage.getItem("profile"))
    : null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setProfile(state, value) {
      state.profile = value.payload;
      if (value.payload) {
        localStorage.setItem("profile", JSON.stringify(value.payload));
      } else {
        localStorage.removeItem("profile");
      }
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const { setProfile, setLoading } = profileSlice.actions;
export default profileSlice.reducer;
