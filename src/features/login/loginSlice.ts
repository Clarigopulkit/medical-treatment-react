import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import Toast from "../../reducres/reducers/toast";
import { RootState } from "../../store";
import { fetchLogin } from "./loginAPI";

export interface ILoginState {
  userName: string;
  password: string;
  user: any;
  loading: boolean;
  isSuccess: boolean;
  loginSuccessMessage: string;
}

const initialState: ILoginState = {
  userName: "",
  password: "",
  user: [],
  loading: false,
  isSuccess: false,
  loginSuccessMessage: "",
};

export const fetchLoginAsync = createAsyncThunk(
  "login/fetchLogin",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchLogin(payload);
      // console.log('FETCH ASYN LOGIN', response.data)
      if (response.statusCode !== 200) {
        // Toast.error(response.message);
        return rejectWithValue(response);
      }
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
      }
      Toast.success("Logged In Successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    updateUserName: (state, action) => {
      state.userName = action.payload;
    },
    updatePassword: (state, action) => {
      state.password = action.payload;
    },
    updateIsSuccess: (state, action) => {
      state.isSuccess = action.payload;
    },
    updateLoginSuccessMessage: (state, action) => {
      state.loginSuccessMessage = action.payload;
    },
    clearStoreData: (state) => {
      localStorage.clear();
      sessionStorage.clear();
      storage.removeItem("persist:root");
      for (let keys in state) {
        state[keys] = [];
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginAsync.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
      })
      .addCase(fetchLoginAsync.rejected, (state) => {
        state.loading = false;
        state.isSuccess = false;
      })
      .addCase(fetchLoginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.user = action.payload;
      });
  },
});

export const {
  updateUserName,
  updatePassword,
  updateIsSuccess,
  updateLoginSuccessMessage,
  clearStoreData,
} = loginSlice.actions;

export const selectLogin = (state: RootState) => state.login;

export default loginSlice.reducer;
