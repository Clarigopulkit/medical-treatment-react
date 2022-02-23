import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { fetchRegister } from "./signUpApi";

export interface IRegisterState {
  userType: string;
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  registerUser: any;
  isRegisterSuccess: boolean;
}

const initialState: IRegisterState = {
  userType: "",
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
  loading: false,
  registerUser: [],
  isRegisterSuccess: false,
};

export const fetchRegisterAsync = createAsyncThunk(
  "register/fetchRegister",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchRegister(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    updateUserType: (state, action) => {
      state.userType = action.payload;
    },
    updateIsRegisterSuccess: (state, action) => {
      state.isRegisterSuccess = action.payload;
    },
    updateEmail: (state, action) => {
      state.email = action.payload;
    },
    updateName: (state, action) => {
      state.name = action.payload;
    },
    updatePassword: (state, action) => {
      state.password = action.payload;
    },
    updateConfirmPassword: (state, action) => {
      state.confirmPassword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisterAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isRegisterSuccess = true;
        state.registerUser = action.payload;
      });
  },
});

export const {
  updateUserType,
  updateEmail,
  updateName,
  updatePassword,
  updateConfirmPassword,
  updateIsRegisterSuccess,
} = registerSlice.actions;

export const selectRegister = (state: RootState) => state.register;

export default registerSlice.reducer;
