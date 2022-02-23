import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "../../../../../reducres/reducers/toast";
import { RootState } from "../../../../../store";
import { fetchDoctorProfessionalInfo } from "./professionalInfoAPI";

export interface IDoctorProfileProfessionalInfo {
  registrationNumber: string;
  registrationAuthority: string;
  year: string;
  qualification: string;
  college: string;
  educationYear: string;

  linkedInProfile: string;
  officeAddress: string;
  correspondenceAddress: string;
  country: string;
  state: string;
  postalCode: string;

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
  professionalInfo: any;
  loading: boolean;
  isSuccess: boolean;
  loginDoctorProfileSuccessMessage: boolean;
}

const initialState: IDoctorProfileProfessionalInfo = {
  registrationNumber: "",
  registrationAuthority: "",
  year: "",
  qualification: "",
  college: "",
  educationYear: "",
  linkedInProfile: "",
  officeAddress: "",
  correspondenceAddress: "",
  country: "",
  state: "",
  postalCode: "",
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
  professionalInfo: [],
  loading: false,
  isSuccess: false,
  loginDoctorProfileSuccessMessage: false,
};

export const fetchDoctorProfessionalInfoAsync = createAsyncThunk(
  "DoctorProfessionalInfo/fetchDoctorProfessionalInfo",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchDoctorProfessionalInfo(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const doctorProfessionalInfoSlice = createSlice({
  name: "DoctorProfessionalInfo",
  initialState,
  reducers: {
    clearStoreData: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorProfessionalInfoAsync.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
      })
      .addCase(fetchDoctorProfessionalInfoAsync.rejected, (state) => {
        state.loading = false;
        state.isSuccess = false;
      })
      .addCase(fetchDoctorProfessionalInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.professionalInfo = action.payload;
      });
  },
});

export const { clearStoreData } = doctorProfessionalInfoSlice.actions;

export const selectDoctorProfessionalInfo = (state: RootState) =>
  state.doctorProfessionalInfo;

export default doctorProfessionalInfoSlice.reducer;
