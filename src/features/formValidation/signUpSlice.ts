import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { fetchRegister } from "../register/signUpApi";

export interface IRegisterState {
  userType: string;
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  register: any;
}

const initialState: IRegisterState = {
  userType: "",
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
  loading: false,
  register: [],
};

export const fetchRegisterAsync = createAsyncThunk(
  "register/fetchRegister",
  async (payload: any) => {
    const response = await fetchRegister(payload);
    return response;
  }
);

export const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    updateUserType: (state, action) => {
      state.userType = action.payload;
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
        state.register = action.payload;
      });
  },
});

export const {
  updateUserType,
  updateEmail,
  updateName,
  updatePassword,
  updateConfirmPassword,
} = registerSlice.actions;

export const selectRegister = (state: RootState) => state.login;

export default registerSlice.reducer;
