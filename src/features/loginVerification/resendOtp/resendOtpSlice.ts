import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { fetchResendOtp } from "./resendOtpAPI";
export interface IResendOtpState {
  email: string;
  otpNumber: string;
  ResendOtp: any;
  loading: boolean;
  isOtpSuccess: boolean;
}

const initialState: IResendOtpState = {
  email: "",
  otpNumber: "",
  ResendOtp: [],
  loading: false,
  isOtpSuccess: false,
};

export const fetchResendOtpAsync = createAsyncThunk(
  "resendOtp/fetchResendOtp",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchResendOtp(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resendOtpSlice = createSlice({
  name: "resendOtp",
  initialState,
  reducers: {
    updateIsResendOtpSuccess: (state, action) => {
      state.isOtpSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResendOtpAsync.pending, (state) => {
        state.loading = true;
        state.isOtpSuccess = false;
      })
      .addCase(fetchResendOtpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isOtpSuccess = true;
        state.ResendOtp = action.payload;
      });
  },
});

export const { updateIsResendOtpSuccess } = resendOtpSlice.actions;

export const selectOtp = (state: RootState) => state.otp;

export default resendOtpSlice.reducer;
