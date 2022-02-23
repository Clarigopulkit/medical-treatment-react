import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { fetchChangePassword } from "./changePasswordAPI";
import Toast from "../../reducres/reducers/toast";
export interface IChangePaswordState {
  userName: string;
  userChangePasword: any;
  isChangePasswordSuccess: boolean;
  loading: boolean;
}

const initialState: IChangePaswordState = {
  userName: "",
  userChangePasword: [],
  isChangePasswordSuccess: false,
  loading: false,
};

export const fetchChangePaswordAsync = createAsyncThunk(
  "changePasword/fetchChangePassword",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchChangePassword(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changePaswordSlice = createSlice({
  name: "changePasword",
  initialState,
  reducers: {
    updateUserName: (state, action) => {
      state.userName = action.payload;
    },
    updateIsChangePasswordSuccess: (state, action) => {
      state.isChangePasswordSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChangePaswordAsync.pending, (state) => {
        state.loading = true;
        state.isChangePasswordSuccess = false;
      })
      .addCase(fetchChangePaswordAsync.rejected, (state) => {
        state.loading = false;
        state.isChangePasswordSuccess = false;
      })
      .addCase(fetchChangePaswordAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isChangePasswordSuccess = true;
        state.userChangePasword = action.payload;
      });
  },
});

export const { updateUserName, updateIsChangePasswordSuccess } =
  changePaswordSlice.actions;

export const selectChangePassword = (state: RootState) => state.changePassword;

export default changePaswordSlice.reducer;
