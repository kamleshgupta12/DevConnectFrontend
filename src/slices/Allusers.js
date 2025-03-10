import { createSlice } from "@reduxjs/toolkit";

const allUsersSlice = createSlice({
  name: "allusers",
  initialState: {
    allUsers: [],
    selectedUser: null,  
    singleuserData:null
  },
  reducers: {
    setAllUser: (state, action) => {
      state.allUsers = action.payload;
    },
    viewUser: (state, action) => {
      state.selectedUser = action.payload;  
    },
    singleuserData: (state, action) => {
      state.singleUser = action.payload;  
    },
  },
});

export const { setAllUser, viewUser,singleuserData } = allUsersSlice.actions;
export default allUsersSlice.reducer;
