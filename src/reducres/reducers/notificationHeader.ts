import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../store";

export interface Header {
  Header: Boolean;
}

const initialState: Header = {
  Header: false,
};

export const NotifiationHeader = createSlice({
  name: "NotifiationHeader",
  initialState,
  reducers: {
    showHeader: (state) => {
      state.Header = true;
    },
    hideHeader: (state) => {
      state.Header = false;
    },
  },
});

export const { showHeader, hideHeader } = NotifiationHeader.actions;

export default NotifiationHeader.reducer;
