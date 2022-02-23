import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { AddDoctor, fetchDoctorList,DeleteDoctor } from "./addDoctorApi";

export const fetchDoctor = createAsyncThunk(
  "/get-doctors-by-clinic/",
  async (page : number) => {
    try {
      const response = await fetchDoctorList(page);
      if (response.statusCode !== 200) {
      }
      return response.data;
    } catch (error) {}
  }
);

export const AddDoctorClinic = createAsyncThunk(
  "AddDoctor",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await AddDoctor(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }
      return response.data;
    } catch (error) {}
  }
);

export const DeleteDoctorClinic = createAsyncThunk(
  "DeleteDoctor",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await DeleteDoctor(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }
      return response.data;
    } catch (error) {}
  }
);

const initialState = {
  doctorList: [],
  loading: false,
  isSuccess: false,
};

export const Doctorlist = createSlice({
  name: "get-doctors-by-clinic",
  initialState,
  reducers: {
    clearStoreData: (state) => {
      state = initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctor.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
      })
      .addCase(fetchDoctor.rejected, (state) => {
        state.loading = false;
        state.isSuccess = false;
      })
      .addCase(fetchDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
      });
  },
});

export const { clearStoreData } = Doctorlist.actions;

export const setDoctorlist = (state: RootState) => state;

export default Doctorlist.reducer;
