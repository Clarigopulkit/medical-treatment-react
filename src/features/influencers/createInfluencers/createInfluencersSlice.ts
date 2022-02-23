import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { fetchCreateInfluencer } from "./createInfluencersAPI";

export interface ICreateInfluencerState {
  name: string;
  state: string;
  city: string;
  zipCode: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  createInfluencer: any;
  loading: boolean;
}

const initialState: ICreateInfluencerState = {
  name: "",
  state: "",
  city: "",
  zipCode: "",
  title: "",
  description: "",
  email: "",
  phone: "",
  createInfluencer: [],
  loading: false,
};

export const fetchCreateInfluencerAsync = createAsyncThunk(
  "createInfluencer/fetchCreateInfluencer",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await fetchCreateInfluencer(payload);
      if (response.statusCode !== 200) {
        return rejectWithValue(response);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createInfluencerSlice = createSlice({
  name: "createInfluencer",
  initialState,
  reducers: {
    updateTextFields: (state, action) => {
      state = { ...state, [action.payload.name]: action.payload.value };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateInfluencerAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCreateInfluencerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.createInfluencer = action.payload;
      });
  },
});

export const { updateTextFields } = createInfluencerSlice.actions;

export const selectCreateInfluencer = (state: RootState) =>
  state.createInfluencer;

export default createInfluencerSlice.reducer;
