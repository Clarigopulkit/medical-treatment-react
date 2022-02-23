import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { fetchComments } from "./errorMessageAPI";

export interface ICommentsState {
  comments: any;
  loading: boolean;
}

const initialState: ICommentsState = {
  comments: [],
  loading: false,
};

export const fetchCommentsAsync = createAsyncThunk(
  "comments/fetchComments",
  async () => {
    const response = await fetchComments();
    return response;
  }
);

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsAsync.pending, (state) => {
        state.loading = false;
      })
      .addCase(fetchCommentsAsync.fulfilled, (state, action) => {
        state.comments = action.payload;
      });
  },
});

export const selectComments = (state: RootState) => state.comments;

export default commentsSlice.reducer;
