import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { fetchUpdateProfile } from "./updateProfileAPI";
export interface IOtpState {
  otpNumber: string;
  updateProfile: any;
  loading: boolean;
  isUpdateProfileSuccess: boolean;
}

const initialState: IOtpState = {
  otpNumber: "",
  updateProfile: [],
  loading: false,
  isUpdateProfileSuccess: false,
};

export const fetchUpdateProfileAsync = createAsyncThunk(
  "updateProfile/fetchUpdateProfile",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchUpdateProfile(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState,
  reducers: {
    updateOtpNumber: (state, action) => {
      state.otpNumber = action.payload;
    },
    updateIsUpdateProfileSuccess: (state, action) => {
      state.isUpdateProfileSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpdateProfileAsync.pending, (state) => {
        state.loading = true;
        state.isUpdateProfileSuccess = false;
      })
      .addCase(fetchUpdateProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdateProfileSuccess = true;
        state.updateProfile = action.payload;
      });
  },
});

export const { updateOtpNumber, updateIsUpdateProfileSuccess } =
  updateProfileSlice.actions;

export const selectUpdateProfile = (state: RootState) => state.updateProfile;

export default updateProfileSlice.reducer;
