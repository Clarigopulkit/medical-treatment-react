import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import userReducer from "./features/users/userSlice";
import commentsReducer from "./features/errorMessage/errorMessageSlice";
import loginReducer from "./features/login/loginSlice";
import OtpReducer from "./features/loginVerification/loginVerificationSlice";
import registerReducer from "./features/register/registerSlice";
import forgotPasswordReducer from "./features/forgotPassword/forgotPasswordSlice";
import changePasswordReducer from "./features/changePassword/changePasswordSlice";
import profileReducer from "./features/profile/profileSlice";
import updateProfileReducer from "./features/profile/updateProfile/updateProfileSlice";
import createInfluencerReducer from "./features/influencers/createInfluencers/createInfluencersSlice";
import doctorPersonalProfileReducer from "./features/SP/Doctor/profile/personalTab/personalInfoSlice";
import logoutReducer from "./features/logout/logoutSlice";
import doctorTreatmentsInfoReducer from "./features/SP/Doctor/profile/treatmentsInfo/treatmentsSlice";
import doctorProfessionalInfoReducer from "./features/SP/Doctor/profile/professionalInfo/professionalInfoSlice";
import doctorBusinessInfoReducer from "./features/SP/Doctor/profile/businessInfo/businessInfoSlice";
import spinner from "./reducres/reducers/spinner";
import notificationHeader from "./reducres/reducers/notificationHeader";
import TreatmentIdReducer from './features/postRequest/postRequestSlice';

const reducers = combineReducers({
  otp: OtpReducer,
  users: userReducer,
  comments: commentsReducer,
  login: loginReducer,
  register: registerReducer,
  fotgotPassword: forgotPasswordReducer,
  changePassword: changePasswordReducer,
  profile: profileReducer,
  updateProfile: updateProfileReducer,
  createInfluencer: createInfluencerReducer,
  doctorPersonalProfile: doctorPersonalProfileReducer,
  doctorProfessionalInfo: doctorProfessionalInfoReducer,
  doctorTreatmentsInfo: doctorTreatmentsInfoReducer,
  doctorBusinessInfo: doctorBusinessInfoReducer,
  logout: logoutReducer,
  spinner: spinner,
  header: notificationHeader,
  treatment:TreatmentIdReducer,
});

export const persistConfig = {
  key: "root",
  storage,
  blacklist: ["doctorTreatmentsInfo"],
};

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV === "development"
      ? getDefaultMiddleware().concat(thunk)
      : getDefaultMiddleware().concat(thunk),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
// export type TreatmnetState =ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
