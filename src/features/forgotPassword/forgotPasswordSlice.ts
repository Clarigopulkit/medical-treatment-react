import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { fetchForgotPassword } from "./forgotPasswordAPI";

export interface IForgotPasswordState {
  userName: string;
  forgotPassword: any;
  isForgotPasswordSuccess: boolean;
  loading: boolean;
}

const initialState: IForgotPasswordState = {
  userName: "",
  forgotPassword: [],
  isForgotPasswordSuccess: false,
  loading: false,
};

export const fetchForgotPasswordAsync = createAsyncThunk(
  "forgotPassword/fetchForgotPassword",
  async (payload: any) => {
    const response = await fetchForgotPassword(payload);
    return response.data;
  }
);

export const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    updateUserName: (state, action) => {
      state.userName = action.payload;
    },
    updateIsForgotPasswordSuccess: (state, action) => {
      state.isForgotPasswordSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForgotPasswordAsync.pending, (state) => {
        state.loading = true;
        state.isForgotPasswordSuccess = false;
      })
      .addCase(fetchForgotPasswordAsync.rejected, (state) => {
        state.loading = false;
        state.isForgotPasswordSuccess = false;
      })
      .addCase(fetchForgotPasswordAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isForgotPasswordSuccess = true;
        state.forgotPassword = action.payload;
      });
  },
});

export const { updateUserName, updateIsForgotPasswordSuccess } =
  forgotPasswordSlice.actions;

export const selectForgotPassword = (state: RootState) => state.fotgotPassword;

export default forgotPasswordSlice.reducer;
