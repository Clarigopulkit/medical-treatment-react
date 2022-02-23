import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import Toast from "../../reducres/reducers/toast";
import { RootState } from "../../store";
import { fetchLogout } from "./logoutAPI";

export interface ILogoutState {
  loading: boolean;
  isSuccess: boolean;
  logout: any;
}

const initialState: ILogoutState = {
  loading: false,
  isSuccess: false,
  logout: [],
};

export const fetchLogoutAsync = createAsyncThunk(
  "logout/fetchLogout",
  async (payload: any, { rejectWithValue }) => {
    try {
      await storage.removeItem("persist:root");
      const response = await fetchLogout(payload);
      if (response.statusCode !== 200) {
        Toast.error("Error Logging Out");
        return rejectWithValue(response);
      }
      Toast.success("Logged Out Successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutSlice = createSlice({
  name: "logout",
  initialState,
  reducers: {
    updateIsSuccess: (state, action) => {
      state.isSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogoutAsync.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
      })
      .addCase(fetchLogoutAsync.rejected, (state) => {
        state.loading = false;
        state.isSuccess = false;
      })
      .addCase(fetchLogoutAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.logout = action.payload;
      });
  },
});

export const { updateIsSuccess } = logoutSlice.actions;

export const selectLogout = (state: RootState) => state.logout;

export default logoutSlice.reducer;
