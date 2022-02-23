import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
// import { fetchRegister } from "../register/signUpApi";

export interface IreatmentState {
  treatmentId: string;

}

const initialState: IreatmentState = {
    treatmentId: "",

};



export const treatmentSlice = createSlice({
  name: "treatment",
  initialState,
  reducers: {
    updateTreatmentId: (state, action) => {
      state.treatmentId = action.payload;
    },
   

    // updateEmail: (state, action) => {
    //   state.email = action.payload;
    // },
    // updateName: (state, action) => {
    //   state.name = action.payload;
    // },
    // updatePassword: (state, action) => {
    //   state.password = action.payload;
    // },
    // updateConfirmPassword: (state, action) => {
    //   state.confirmPassword = action.payload;
    // },
  },
 
});

export const {
    updateTreatmentId,

} = treatmentSlice.actions;

export const selectTreatment = (state: RootState) => state.treatment;

export default treatmentSlice.reducer;
