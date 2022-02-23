import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../../../store";
import { fetchDoctorVisibleInfo } from "./visibleProfileAPI";

interface IVisibleState {
  loading: boolean;
  visibleInfoUser: any;
}

export const initialState = {
  loading: true,
  visibleInfoUser: [],
};
export const fetchDoctorVisibleInfoAsync = createAsyncThunk(
  "DoctorVisibleInfo/fetchDoctorVisibleInfo",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchDoctorVisibleInfo(payload);
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
      .addCase(fetchDoctorVisibleInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctorVisibleInfoAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchDoctorVisibleInfoAsync.fulfilled, (state, action) => {
        state.loading = false;

        state.visibleInfoUser = action.payload;
      });
  },
});

export const { clearStoreData } = doctorProfessionalInfoSlice.actions;

export const selectDoctorProfessionalInfo = (state: RootState) =>
  state.doctorProfessionalInfo;

export default doctorProfessionalInfoSlice.reducer;
