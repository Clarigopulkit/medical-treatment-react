import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { fetchLoginOtp } from "./loginVerificationAPI";
export interface IOtpState {
  otpNumber: string;
  userOtp: any;
  loading: boolean;
  isOtpSuccess: boolean;
}

const initialState: IOtpState = {
  otpNumber: "",
  userOtp: [],
  loading: false,
  isOtpSuccess: false,
};

export const fetchOtpAsync = createAsyncThunk(
  "otp/fetchLoginOtp",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchLoginOtp(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginVerificationSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    updateOtpNumber: (state, action) => {
      state.otpNumber = action.payload;
    },
    updateIsOtpSuccess: (state, action) => {
      state.isOtpSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtpAsync.pending, (state) => {
        state.loading = true;
        state.isOtpSuccess = false;
      })
      .addCase(fetchOtpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isOtpSuccess = true;
        state.userOtp = action.payload;
      });
  },
});

export const { updateOtpNumber, updateIsOtpSuccess } =
  loginVerificationSlice.actions;

export const selectOtp = (state: RootState) => state.otp;

export default loginVerificationSlice.reducer;
