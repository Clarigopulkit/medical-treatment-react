import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import Toast from "../../reducres/reducers/toast";
import { RootState } from "../../store";
import { fetchProfile } from "./profileAPI";

export interface IProfileState {
  profileUsers: any;
  loading: boolean;
}

const initialState: IProfileState = {
  profileUsers: [],
  loading: false,
};

export const fetchProfileAsync = createAsyncThunk(
  "profileUsers/fetchProfile",
  async () => {
    const response = await fetchProfile();

    if (response.statusCode !== 200) {
      Toast.error("Error Fetching Profile Info");
    }
    return response.data;
  }
);

export const profileSlice = createSlice({
  name: "profileUsers",
  initialState,
  reducers: {
    setProfile: (state) => {
      localStorage.clear();
      sessionStorage.clear();
      storage.removeItem("persist:root");
      for (let keys in state) {
        state[keys] = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.profileUsers = action.payload;
      });
  },
});

export const { setProfile } = profileSlice.actions;

export const selectProfileUsers = (state: RootState) => state.profile;

export default profileSlice.reducer;
