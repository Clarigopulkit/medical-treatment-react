import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "../../../../reducres/reducers/toast";
import { RootState } from "../../../../store";
import {
  fetchChangePtofilePicture,
  fetchSaveClinicPersonalInfo,
} from "./clinicPersonalInfoAPI";

export interface IDoctorProfilePersonalInfo {
  clinicPersonalInfo: any;
  changePicture: any;
  loading: boolean;
  isSuccess: boolean;
  loginDoctorProfileSuccessMessage: boolean;
}

const initialState: IDoctorProfilePersonalInfo = {
  clinicPersonalInfo: [],
  changePicture: [],
  loading: false,
  isSuccess: false,
  loginDoctorProfileSuccessMessage: false,
};

export const fetchSaveClinicPersonalInfoAsync = createAsyncThunk(
  "changePicture/fetchSaveClinicPersonalInfo",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchSaveClinicPersonalInfo(payload);
      if (response.statusCode !== 200) {
        let message = response.message;
        Toast.error(message);
        return rejectWithValue(response);
      }
      Toast.success("Details Saved Successfully");

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchChangeProfilePictureAsync = createAsyncThunk(
  "changePicture/fetchChangePtofilePicture",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchChangePtofilePicture(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const clinicPersonalInfoSlice = createSlice({
  name: "doctorPersonalInfo",
  initialState,
  reducers: {
    updateUserName: (state, action) => {},
    updatePassword: (state, action) => {},
    updateIsSuccess: (state, action) => {},
    updateLoginSuccessMessage: (state, action) => {},
    clearStoreData: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChangeProfilePictureAsync.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
      })
      .addCase(fetchChangeProfilePictureAsync.rejected, (state) => {
        state.loading = false;
        state.isSuccess = false;
      })
      .addCase(fetchChangeProfilePictureAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.changePicture = action.payload;
      })
      .addCase(fetchSaveClinicPersonalInfoAsync.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
      })
      .addCase(fetchSaveClinicPersonalInfoAsync.rejected, (state) => {
        state.loading = false;
        state.isSuccess = false;
      })
      .addCase(fetchSaveClinicPersonalInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.clinicPersonalInfo = action.payload;
      });
  },
});

export const {
  updateUserName,
  updatePassword,
  updateIsSuccess,
  updateLoginSuccessMessage,
  clearStoreData,
} = clinicPersonalInfoSlice.actions;

export const selectClinicPersonalProfile = (state: RootState) => state;

export default clinicPersonalInfoSlice.reducer;
