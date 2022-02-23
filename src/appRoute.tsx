import React, { Suspense, useEffect, useState } from "react";
import { Switch as RouterSwitch, Route } from "react-router-dom";
import {
  createStyles,
  Theme,
  makeStyles,
  createTheme,
  ThemeProvider,
  Grid,
} from "@material-ui/core";
import light from "./utils/theme/lightTheme";
import dark from "./utils/theme/darkTheme";
import LoginVerification from "./features/loginVerification/loginVerification";

import NotificationHeader from "./features/header/notificationHeader";
import UserRegister from "./features/register/register";
import ForgotPassword from "./features/forgotPassword/forgotPassword";
import ChangePassword from "./features/changePassword/changePassword";

import AuthTabs from "./features/login/AuthTabs";
import Footer from "./features/footer/footer";

import ResendOtp from "./features/loginVerification/resendOtp/resendOtp";

import { selectLogin } from "./features/login/loginSlice";
import { useAppSelector } from "./hooks/hooks";
import ResetPassword from "./features/forgotPassword/resetPassword/resetPassword";
import SPDashboard from "./features/SP/dashboard/dashboard";
import TreatmentDetails from "./features/treatment/treatment";
import ClinicProfile from "./features/SP/clinics/clinicProfile/clinicProfile";
import treatmentsSaveInfo from "./features/SP/Doctor/profile/treatmentsSaveInfo/treatmentsSaveInfo";
import { CommonRoutes } from "./protectedRoutes/commonRoutes";
import Auth from "./protectedRoutes/Auth";
import { useDispatch } from "react-redux";
import { ClinicRoutes } from "./protectedRoutes/clinicRoutes";
import { DoctorRoutes } from "./protectedRoutes/doctorRoutes";
import { PatientRoutes } from "./protectedRoutes/patientRoutes";
import { ToastContainer } from "react-toastify";
import { PublicRoutes } from "./protectedRoutes/publicRoutes";
import { store } from "./store";
import Fallback from "./components/fallback/fallback";
// import TreatmentDetails from "./features/treatment/treatmentDetails";
import AdvancedSearch from "./features/advancedSearch/advancedSearch";
import TreatmentCategories from "./features/treatmentCategories/treatmentCategories";
import TreatmentSubCategories from "./features/treatmentSubCategories/treatmentSubCategories";
import SPMyRequests from "./features/SPMyRequests/SPMyRequests";
import ViewDoctorProfile from "./features/SP/ViewDoctorProfile/ViewDoctorProfile";
const AddNewDoctor = React.lazy(
  () => import("./features/SP/Doctor/AddNewDoctor/AddNewDoctor")
);
const Header = React.lazy(() => import("./features/header"));

const SignUp = React.lazy(() => import("./features/formValidation/signUpYup"));
const Error = React.lazy(() => import("./features/errorMessage/errorMessage"));
const Dashboard = React.lazy(() => import("./features/dashboard"));
const PostRequest = React.lazy(
  () => import("./features/postRequest/postRequest")
);
const Profile = React.lazy(() => import("./features/profile/profile"));
const MyProfile = React.lazy(
  () => import("./features/SP/Doctor/profile/myProfile/myProfile")
);
const AboutUs = React.lazy(() => import("./features/footer/aboutUs"));

const Home = React.lazy(() => import("./features/footer/home"));
const Service = React.lazy(() => import("./features/footer/service"));
const ContactUs = React.lazy(() => import("./features/footer/contactUs"));
const Provider = React.lazy(() => import("./features/footer/provider"));
const ForCustomer = React.lazy(() => import("./features/footer/forCustomer"));

const HelpAndSupport = React.lazy(
  () => import("./features/footer/resource/helpAndSupport")
);
const SuccessStories = React.lazy(
  () => import("./features/footer/resource/successStories")
);
const RatingsAndReviews = React.lazy(
  () => import("./features/footer/resource/ratingsAndReviews")
);
const FAQS = React.lazy(() => import("./features/footer/resource/FAQ's"));
const Blog = React.lazy(() => import("./features/footer/resource/blog"));
const Community = React.lazy(
  () => import("./features/footer/resource/community")
);
const Clinics = React.lazy(() => import("./features/header/clinics/ckinics"));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: "40px 100px",
      background: "#FCF7F7",
      [theme.breakpoints.down("lg")]: {
        padding: "40px 60px",
      },
      [theme.breakpoints.down("md")]: {
        padding: "40px 30px",
      },
      [theme.breakpoints.down("xs")]: {
        padding: "40px 15px",
      },
    },

    switch: {
      float: "right",
      margin: "20px 50px 0px 0px ",
    },
  })
);

const AppRoute: React.FC<{}> = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const token_new = localStorage.getItem("auth-token");

    setToken(token_new);
    if (token) {
    }
  }, [JSON.parse(localStorage.getItem("persist:root"))]);
  const classes = useStyles();
  const [theme, SetTheme] = useState<any>(light);
  const { user } = useAppSelector(selectLogin);
  const appliedTheme = createTheme(theme);

  let newToken = "";

  const dispatch = useDispatch();
  const [headerOption, setheaderOption] = useState(false);
  useEffect(() => {
    let header = store.getState().header.Header;
    if (header === true) {
      setheaderOption(true);
    } else {
      setheaderOption(false);
    }
  });

  return (
    <>
      <ThemeProvider theme={appliedTheme}>
        <Suspense fallback={<Fallback />}>
          <>
            {headerOption && <NotificationHeader />}
            <Header />

            <main
              className={classes.content}
              style={
                window.location.pathname == "/login"
                  ? {
                      backgroundImage: `url(/BgImages/login.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center 10%",
                    }
                  : window.location.pathname == "/dashboard"
                  ? {
                      backgroundImage: `url(/BgImages/transparent_butterfly.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center 27%",
                      backgroundSize: "100%",
                    }
                  : window.location.pathname == "/sp-dashboard"
                  ? {
                      backgroundImage: `url(/BgImages/transparent_butterfly.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center 27%",
                      backgroundSize: "100%",
                    }
                  : window.location.pathname == "/"
                  ? {
                      backgroundImage: `url(/BgImages/login.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center 10%",
                    }
                  : window.location.pathname == "/home/treatment-categories"
                  ? {
                      backgroundImage: `url(/BgImages/category.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center 10%",
                      backgroundPositionY:"repeat"
                    }
                    : window.location.pathname == "/post-request"
                    ? {
                      backgroundImage: `url(/BgImages/all-bg.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center 47%",
                      backgroundSize: "89%",
                      paddingTop:10
                      }
                  : {
                      backgroundImage: `url(/BgImages/new-bg.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center 2%",
                      backgroundSize: "93%",
                    }
              }
            >
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              <RouterSwitch>
                <PublicRoutes exact path="/" component={AuthTabs} />
                <PublicRoutes exact path="/login" component={AuthTabs} />
                <PublicRoutes exact path="/register" component={UserRegister} />
                <PublicRoutes exact path="/signup" component={SignUp} />
                <PublicRoutes exact path="/resend-otp" component={ResendOtp} />
                <PublicRoutes
                  exact
                  path="/forgot-password"
                  component={ForgotPassword}
                />
                <PublicRoutes
                  exact
                  path="/change-password"
                  component={ChangePassword}
                />
                <PublicRoutes
                  exact
                  path="/otp-validation"
                  component={LoginVerification}
                />
                <PublicRoutes
                  exact
                  path="/manage-profiles"
                  component={Profile}
                />

                <PublicRoutes exact path="/error" component={Error} />

                <PublicRoutes
                  exact
                  path="/reset-password/:id"
                  component={ResetPassword}
                />

                <CommonRoutes
                  exact
                  path="/sp-dashboard"
                  component={SPDashboard}
                />

                <PublicRoutes
                  exact
                  path="/advanced-search"
                  component={AdvancedSearch}
                />

<PublicRoutes
                  exact
                  path="/advanced-search/treatment-detail/:id"
                  component={TreatmentDetails}
                />


                <PatientRoutes exact path="/dashboard" component={Dashboard} />

                <ClinicRoutes
                  exact
                  path="/add-new-doctor"
                  component={AddNewDoctor}
                />
                {/* Info: Use unique route path for patient & doctor. Currently the path `post-request` is same for both. Please check it. */}
                {/* <DoctorRoutes
                  exact
                  path="/post-request"
                  component={PostRequest}
                /> */}
                <PatientRoutes
                  exact
                  path="/post-request"
                  component={PostRequest}
                />
                <DoctorRoutes exact path="/MyProfile" component={MyProfile} />

                <ClinicRoutes exact path="/sp-my-requests" component={SPMyRequests} />

                <ClinicRoutes exact path="/clinic-personal-info/view-doctor-details/:id" component={ViewDoctorProfile} />

                <PublicRoutes exact path="/about-us" component={AboutUs} />
                <PublicRoutes exact path="/home" component={Home} />
                <PublicRoutes exact path="/home/treatment-categories/treatment-sub-categories/treatment-detail/:id" component={TreatmentDetails} />
                <PublicRoutes exact path="/treatment-detail/:id" component={TreatmentDetails} />
                <PublicRoutes exact path="/home/treatment-categories" component={TreatmentCategories} />
                <PublicRoutes exact path="/home/treatment-categories/treatment-sub-categories" component={TreatmentSubCategories} />
                <PublicRoutes exact path="/service" component={Service} />
                <PublicRoutes exact path="/contact-us" component={ContactUs} />
                <PublicRoutes exact path="/provider" component={Provider} />
                <PublicRoutes exact path="/customer" component={ForCustomer} />
                <PublicRoutes
                  exact
                  path="/help-support"
                  component={HelpAndSupport}
                />
                <PublicRoutes
                  exact
                  path="/success-stories"
                  component={SuccessStories}
                />
                <PublicRoutes
                  exact
                  path="/ratings-reviews"
                  component={RatingsAndReviews}
                />
                <PublicRoutes exact path="/faqs" component={FAQS} />
                <PublicRoutes exact path="/blog" component={Blog} />
                <PublicRoutes exact path="/community" component={Community} />
                <PublicRoutes exact path="/clinics" component={Clinics} />

                <ClinicRoutes
                  exact
                  path="/clinic-personal-info"
                  component={ClinicProfile}
                />

                <PublicRoutes
                  exact
                  path="/treatments-save-info"
                  component={treatmentsSaveInfo}
                />

                <Route path="*">
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justify="center"
                  >
                    <img src="/404.jpeg" />
                  </Grid>
                </Route>
              </RouterSwitch>
            </main>
            <Footer />
          </>
        </Suspense>
      </ThemeProvider>
    </>
  );
};
export default AppRoute;
