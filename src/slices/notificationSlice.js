import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.list = action.payload;
    },
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.list = [];
    },
  },
});

export const { setNotifications, addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
