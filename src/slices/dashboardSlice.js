import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    loading: false,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: initialState,
    reducers: {
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setData(state, value) {
            state.data = value.payload;
        },
    },
});

export const { setLoading, setData } = dashboardSlice.actions;

export default dashboardSlice.reducer;
