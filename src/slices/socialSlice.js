import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/social";

// ✅ Fetch Social Links (Async)
export const fetchSocialLinks = createAsyncThunk(
  "social/fetchSocialLinks",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get-link/${userId}`);
      return res.data.socialLinks || {};
    } catch (err) {
      return rejectWithValue("Failed to load social links.");
    }
  }
);

// ✅ Update Social Links (Async)
export const updateSocialLinks = createAsyncThunk(
  "social/updateSocialLinks",
  async ({ userId, socialLinks }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/update-link/${userId}`, { socialLinks });
      return res.data.socialLinks || socialLinks;
    } catch (err) {
      return rejectWithValue("Failed to save social links.");
    }
  }
);

const socialSlice = createSlice({
  name: "social",
  initialState: {
    socialLinks: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.socialLinks = action.payload;
      })
      .addCase(fetchSocialLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSocialLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSocialLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.socialLinks = action.payload;
      })
      .addCase(updateSocialLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default socialSlice.reducer;
