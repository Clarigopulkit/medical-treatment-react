import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "../../../../../reducres/reducers/toast";
import { RootState } from "../../../../../store";
import {
  fetchDoctorPersonalInfo,
  fetchChangePtofilePicture,
  DeleteUserInfo,
  changeAccountStatus,
} from "./personalInfoAPI";

export interface IDoctorProfilePersonalInfo {
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  weekOff: string;
  linkedinProfile: string;
  officeAddress: string;
  correspondenceAddress: string;
  doctorProfile: any;
  changePicture: any;
  loading: boolean;
  isSuccess: boolean;
  loginDoctorProfileSuccessMessage: boolean;
}

const initialState: IDoctorProfilePersonalInfo = {
  salutation: "",
  firstName: "",
  middleName: "",
  lastName: "",
  phone: "",
  weekOff: "",
  linkedinProfile: "",
  officeAddress: "",
  correspondenceAddress: "",
  doctorProfile: [],
  changePicture: [],
  loading: false,
  isSuccess: false,
  loginDoctorProfileSuccessMessage: false,
};

export const fetchDoctorPersonalInfoAsync = createAsyncThunk(
  "DoctorPersonalInfo/fetchDoctorPersonalInfo",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchDoctorPersonalInfo(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }
      if (response.statusCode === 400) {
        Toast.error(response.message);
      } else {
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchChangeProfilePictureAsync = createAsyncThunk(
  "DoctorPersonalInfo/fetchChangePtofilePicture",
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

export const DeleteDataFormUser = createAsyncThunk(
  "DoctorPersonalInfo/DeleteUserInfo",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await DeleteUserInfo(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changeAccStatus = createAsyncThunk(
  "DoctorPersonalInfo/chagneAccStatus",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await changeAccountStatus(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const doctorPersonalInfoSlice = createSlice({
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
      .addCase(fetchDoctorPersonalInfoAsync.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
      })
      .addCase(fetchDoctorPersonalInfoAsync.rejected, (state) => {
        state.loading = false;
        state.isSuccess = false;
      })
      .addCase(fetchDoctorPersonalInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.doctorProfile = action.payload;
      })
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
      });
  },
});

export const {
  updateUserName,
  updatePassword,
  updateIsSuccess,
  updateLoginSuccessMessage,
  clearStoreData,
} = doctorPersonalInfoSlice.actions;

export const selectDoctorProfile = (state: RootState) =>
  state.doctorPersonalProfile;

export default doctorPersonalInfoSlice.reducer;
