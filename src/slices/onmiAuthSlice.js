import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  user: null,
  token: localStorage.getItem('authToken') || null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    googleSignin: (state, action) => {
      const { token } = action.payload;
      state.token = token;
      state.user = jwtDecode(token);
    },
    logout: state => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
    },
    facebookSignin: (state, action) => {
      state.user = action.payload;
    },
    githubAuth: (state, action) => {
      if (action.payload) {
        console.log('Reducer received payload:', action.payload);
        state.user = action.payload;
      } else {
        console.error('Reducer received undefined payload.');
      }
    }
  }
});

export const { googleSignin, logout, facebookSignin, githubAuth } =
  authSlice.actions;

export default authSlice.reducer;
