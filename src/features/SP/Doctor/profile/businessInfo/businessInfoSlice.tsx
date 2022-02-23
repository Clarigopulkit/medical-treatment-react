import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../../../store";
import { fetchDoctorBusinessInfo } from "./businessInfoAPI";

export interface IDoctorProfilePersonalInfo {
  clinicName: string;
  clinicEmail: string;
  clinicPhone: string;
  websiteAddress: string;
  TAXNumber: string;
  registrationNumber: string;
  year: string;
  registrationAuthority: string;
  phone: string;
  mobile: string;
  weekOff: string;
  linkedInProfile: string;
  officeAddress: string;
  correspondenceAddress: string;
  country: string;
  state: string;
  postalCode: string;
  newCustomTextFields: object;
  qualification: string;
  college: string;
  educationYear: string;
  yourRole: string;
  HospitalOrClinicName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postCode: string;
  Duration: string;
  reference: string;
  doctorLinkedInProfileLink: string;
  referenceDoctorEmail: string;
  referenceDoctorPhoneNumber: string;
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  sortCode: string;
  swiftCode: string;
  doctorBusinessInfoProfile: any;
  loading: boolean;
  isSuccess: boolean;
  loginDoctorProfileSuccessMessage: boolean;
}

const initialState: IDoctorProfilePersonalInfo = {
  clinicName: "",
  clinicEmail: "",
  clinicPhone: "",
  websiteAddress: "",
  TAXNumber: "",
  registrationNumber: "",
  year: "",
  registrationAuthority: "",
  qualification: "",
  college: "",
  educationYear: "",
  phone: "",
  mobile: "",
  weekOff: "",
  linkedInProfile: "",
  officeAddress: "",
  correspondenceAddress: "",
  country: "",
  state: "",
  postalCode: "",
  newCustomTextFields: {
    registrationNumber: "",
    year: "",
    registrationAuthority: "",
  },
  yourRole: "",
  HospitalOrClinicName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postCode: "",
  Duration: "",
  reference: "",
  doctorLinkedInProfileLink: "",
  referenceDoctorEmail: "",
  referenceDoctorPhoneNumber: "",
  accountNumber: "",
  accountHolderName: "",
  bankName: "",
  sortCode: "",
  swiftCode: "",
  doctorBusinessInfoProfile: [],
  loading: false,
  isSuccess: false,
  loginDoctorProfileSuccessMessage: false,
};

export const fetchDoctorBusinessInfoAsync = createAsyncThunk(
  "doctorBusinessInfoProfile/fetchDoctorBusinessInfo",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchDoctorBusinessInfo(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const doctorBusinessInfoSlice = createSlice({
  name: "doctorBusinessInfoProfile",
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
      .addCase(fetchDoctorBusinessInfoAsync.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
      })
      .addCase(fetchDoctorBusinessInfoAsync.rejected, (state) => {
        state.loading = false;
        state.isSuccess = false;
      })
      .addCase(fetchDoctorBusinessInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.doctorBusinessInfoProfile = action.payload;
      });
  },
});

export const {
  updateUserName,
  updatePassword,
  updateIsSuccess,
  updateLoginSuccessMessage,
  clearStoreData,
} = doctorBusinessInfoSlice.actions;

export const selectDoctorBusinessInfoProfile = (state: RootState) =>
  state.doctorBusinessInfo;

export default doctorBusinessInfoSlice.reducer;
