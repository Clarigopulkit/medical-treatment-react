import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { fetchUsers } from "./userAPI";

export interface IUserState {
  users: any;
  loading: boolean;
}

const initialState: IUserState = {
  users: [],
  loading: false,
};

export const fetchUserAsync = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetchUsers();
  return response;
});

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      });
  },
});

export const selectUsers = (state: RootState) => state.users;

export default userSlice.reducer;
