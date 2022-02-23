import { createSlice } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../store";

export interface Spinner {
  spinner: Boolean;
}

const initialState: Spinner = {
  spinner: false,
};

export const Spinner = createSlice({
  name: "spinner",
  initialState,
  reducers: {
    loadSpinner: (state) => {
      state.spinner = true;
    },
    closeSpinner: (state) => {
      state.spinner = false;
    },
  },
});

export const { loadSpinner, closeSpinner } = Spinner.actions;

export const selectCount = (state: RootState) => state.spinner;

export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState());
  };

export default Spinner.reducer;
