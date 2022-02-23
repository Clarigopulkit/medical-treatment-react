import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../../../store";
import {
  fetchTreatmentsAreasProfile,
  fetchUpdateTreatments,
  fetchSavedTreatmentsList,
  fetchSaveTreatmentsInfo,
  fetchTreatmentsCategoryProfile,
  fetchTreatmentsSubCategoryProfile,
  fetchTreatments,
} from "./treatmentsInfoAPI";

export interface IProfileState {
  treatmentsProfileUsers: any;
  treatmentsProfileCategoryUsers: any;
  treatmentsProfileSubCategoryUsers: any;
  treatmentsList: any;
  treatmentsSaveList: any;
  savedTreatmentDetailsList: any;
  updateTreatments: any;
  loading: boolean;
}

const initialState: IProfileState = {
  treatmentsProfileUsers: [],
  treatmentsProfileCategoryUsers: [],
  treatmentsProfileSubCategoryUsers: [],
  treatmentsList: [],
  treatmentsSaveList: [],
  savedTreatmentDetailsList: [],
  updateTreatments: [],
  loading: false,
};
export const fetchUpdateTreatmentsInfoAsync = createAsyncThunk(
  "updateTreatments/fetchUpdateTreatments",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchUpdateTreatments(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchSaveTreatmentsInfoAsync = createAsyncThunk(
  "DoctorProfessionalInfo/fetchDoctorProfessionalInfo",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchSaveTreatmentsInfo(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchTreatmentsAreasProfileAsync = createAsyncThunk(
  "treatmentsProfileUsers/fetchTreatmentsProfile",
  async () => {
    const response = await fetchTreatmentsAreasProfile();
    return response;
  }
);
export const fetchSavedTreatmentsListAsync = createAsyncThunk(
  "savedTreatmentDetailsList/fetchSavedTreatmentsList",
  async () => {
    const response = await fetchSavedTreatmentsList();
    return response;
  }
);
export const fetchTreatmentsCategoryProfileAsync = createAsyncThunk(
  "treatmentsProfileUsers/fetchTreatmentsCategoryProfile",
  async (payload: any) => {
    const response = await fetchTreatmentsCategoryProfile(payload);
    return response.data;
  }
);

export const fetchTreatmentsSubCategoryProfileAsync = createAsyncThunk(
  "treatmentsProfileUsers/fetchTreatmentsSubCategoryProfile",
  async (payload: any) => {
    const response = await fetchTreatmentsSubCategoryProfile(payload);
    return response.data;
  }
);

export const fetchTreatmentsAsync = createAsyncThunk(
  "treatmentsList/fetchTreatments",
  async (payload: any) => {
    const response = await fetchTreatments(payload);
    return response.data;
  }
);

export const fetchTreatmentsProfileSlice = createSlice({
  name: "treatmentsProfileUsers",
  initialState,
  reducers: {
    clearStoreData: (state) => {
      state.treatmentsProfileCategoryUsers = [];
      state.treatmentsProfileSubCategoryUsers = [];
      state.treatmentsList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpdateTreatmentsInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateTreatmentsInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.updateTreatments = action.payload;
      })
      .addCase(fetchSaveTreatmentsInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSaveTreatmentsInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.treatmentsSaveList = action.payload;
      })
      .addCase(fetchTreatmentsCategoryProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTreatmentsCategoryProfileAsync.fulfilled,
        (state, action) => {
          state.loading = false;
          state.treatmentsProfileCategoryUsers = [];
          state.treatmentsProfileCategoryUsers = action.payload;
        }
      )
      .addCase(fetchTreatmentsSubCategoryProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTreatmentsSubCategoryProfileAsync.fulfilled,
        (state, action) => {
          state.loading = false;
          state.treatmentsProfileSubCategoryUsers = action.payload;
        }
      )
      .addCase(
        fetchTreatmentsSubCategoryProfileAsync.rejected,
        (state, action) => {
          state.loading = false;
          state.treatmentsProfileSubCategoryUsers = action.payload;
        }
      )
      .addCase(fetchTreatmentsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTreatmentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.treatmentsList = action.payload;
      })
      .addCase(fetchTreatmentsAreasProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTreatmentsAreasProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.treatmentsProfileUsers = action.payload;
      })
      .addCase(fetchSavedTreatmentsListAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSavedTreatmentsListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.savedTreatmentDetailsList = action.payload;
      });
  },
});

export const { clearStoreData } = fetchTreatmentsProfileSlice.actions;
export const selectTreatmentsProfileUsers = (state: RootState) =>
  state.doctorTreatmentsInfo;

export default fetchTreatmentsProfileSlice.reducer;
