import React, { useEffect } from "react";
import {
  Grid,
  makeStyles,
  createStyles,
  Theme,
  Typography,
  Card,
  Link,
} from "@material-ui/core";
import { Link as RouteLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import {
  selectOtp,
  fetchOtpAsync,
  updateIsOtpSuccess,
} from "./lginVerificationSlice";
import { fetchResendOtpAsync } from "./resendOtp/resendOtpSlice";
import { selectLogin } from "../login/loginSlice";
import CustomButton from "../reusable/customButton/customButton";
import { selectRegister } from "../register/registerSlice";
import { selectChangePassword } from "../changePassword/changePasswordSlice";
import "./loginVerification.scss";
import CustomTextField from "../reusable/customTextField/customTextField";
import { closeSpinner, loadSpinner } from "../../reducres/reducers/spinner";
import Toast from "../../reducres/reducers/toast";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "450px",
      display: "block",
      margin: "0 auto",
    },
    title: {
      padding: theme.spacing(3),
    },
    title2: {
      fontSize: "15px",
      textDecoration: "none",
      marginTop: theme.spacing(1),
      "& > *": {
        color: "#139aef !important",
        fontWeight: 600,
      },
    },

    new_link: {
      color: "#139aef !important",
      fontWeight: 600,
    },
    textField: {
      marginBottom: theme.spacing(1),
    },
    linkCheckbox: {
      alignItems: "center",
    },
    typogarphy: {
      textAlign: "right",
    },
    submitButton: {
      marginTop: "20px",
      marginBottom: "30px",
    },
  })
);
export interface IOtpVerifyState {
  otp: string;
}

const LoginVerification: React.FC<any> = ({ history }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { isOtpSuccess, loading } = useAppSelector(selectOtp);
  const { user } = useAppSelector(selectLogin);
  const { registerUser } = useAppSelector(selectRegister);
  const { userChangePasword } = useAppSelector(selectChangePassword);
  const [seconds, setSeconds] = React.useState(60);

  useEffect(() => {
    if (isOtpSuccess) {
    }
    return () => {
      dispatch(loadSpinner());
      dispatch(updateIsOtpSuccess(false));
    };
  }, [isOtpSuccess]);
  React.useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
    }
  });

  const otpVerify = async (data: IOtpVerifyState) => {
    dispatch(loadSpinner());
    if(registerUser.email!=null || registerUser.email!= undefined )
    {
      dispatch(fetchOtpAsync({ email: registerUser.email, otp: data.otp })).then(
        (result) => {
          if (result?.payload?.response?.data?.statusCode == 400) {
            Toast.error(result?.payload?.response?.data?.message);
          }
          if (result.payload.token !== undefined) {
            Toast.success("Account Verified Successfully");
            history.replace("/");
          }
          dispatch(closeSpinner());
        }
      );
    }else{
      let userEmail =  localStorage.getItem('email');
      dispatch(fetchOtpAsync({ email: userEmail, otp: data.otp })).then(
        (result) => {
          if (result?.payload?.response?.data?.statusCode == 400) {
            Toast.error(result?.payload?.response?.data?.message);
          }
          if (result.payload.token !== undefined) {
            Toast.success("Account Verified Successfully");
            localStorage.removeItem('email');
            history.replace("/");
          }
          dispatch(closeSpinner());
        }
      );
    }
  };

  const resendOtp = () => {
    dispatch(loadSpinner());
    if(registerUser.email!=null || registerUser.email!= undefined )
    {
    dispatch(fetchResendOtpAsync({ email: registerUser.email })).then(
      (result) => {
        if (result?.payload?.name != undefined) {
          setSeconds(30)
          Toast.success("OTP has been sent to you in mail.");
        }

        if (result?.payload?.response?.data?.statusCode == 400) {
          Toast.error(result?.payload?.response?.data?.message);
        }
        dispatch(closeSpinner());
      }
    );
    }else{
      let getuserEmail =  localStorage.getItem('email');
      dispatch(fetchResendOtpAsync({ email: getuserEmail })).then(
        (result) => {
          if (result?.payload?.name != undefined) {
            setSeconds(30)
            Toast.success("OTP has been sent to you in mail.");
          }
  
          if (result?.payload?.response?.data?.statusCode == 400) {
            Toast.error(result?.payload?.response?.data?.message);
          }
          dispatch(closeSpinner());
        }
      );

    }
  };
  return (
    <div className={`${classes.root} login-otp-validation`}>
      {/* <AutoErrorMessage /> */}
      {/* <NotificationHeader /> */}
      <Formik
        initialValues={{
          otp: "",
        }}
        onSubmit={(values: IOtpVerifyState) => {
          otpVerify(values);
        }}
        validationSchema={Yup.object().shape({
          otp: Yup.string().required("Please Enter Otp"),
        })}
      >
        {(props: FormikProps<IOtpVerifyState>) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
          } = props;
          return (
            <div>
              <Card className="login-card">
                <Typography
                  align="center"
                  variant="h5"
                  color="primary"
                  className="heading-icon"
                >
                  <img
                    src={
                      require("../../utils/images/otp-verification-icon.png")
                        .default
                    }
                    height="120px"
                    width="120px"
                    alt="logo"
                  />
                </Typography>
                <Typography
                  align="center"
                  variant="h5"
                  color="primary"
                  className="heading"
                >
                  OTP verification
                </Typography>
                <Typography
                  align="center"
                  variant="body1"
                  color="primary"
                  className="heading-content"
                >
                  Please enter the one-time password to verify your
                  account.Password has been sent to your {registerUser.email}.
                </Typography>
                <Form autoComplete="false">
                  <Grid
                    container
                    spacing={2}
                    justify="space-around"
                    direction="row"
                  >
                    <Grid
                      item
                      lg={10}
                      md={10}
                      sm={10}
                      xs={10}
                      className={classes.textField}
                    >
                      <CustomTextField
                        className={`login-text-field ${classes.textField}`}
                        fullWidth
                        name="otp"
                        id="otp"
                        variant="outlined"
                        value={values.otp}
                        type="text"
                        placeholder="Enter OTP"
                        helperText={errors.otp && touched.otp ? errors.otp : ""}
                        error={errors.otp && touched.otp ? true : false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                  </Grid>
                </Form>

                <Grid
                  container
                  spacing={1}
                  style={{ justifyContent: "center" }}
                >
                  <Grid item xs={10}>
                    <CustomButton
                      fullWidth
                      type="submit"
                      variant="contained"
                      className="verify-button"
                      onClick={handleSubmit}
                    >
                      Verify OTP
                    </CustomButton>
                  </Grid>
                  {/* </Grid> */}
                  <Grid xs={10} style={{ textAlign: "center" }}>
                    <Typography
                      align="center"
                      variant="h5"
                      color="primary"
                      className="timer"
                    >
                      0:{seconds}
                    </Typography>
                    {seconds <= 0 && (
                      <>
                        <Typography
                          align="center"
                          variant="h5"
                          color="primary"
                          className={classes.title2}
                        >
                          {/* <Link href="resend-otp"  className="register-link" >
                                                Resend
                                            </Link>  */}
                          <Link
                            component="button"
                            variant="body2"
                            className="register-link"
                            onClick={() => {
                              resendOtp();
                            }}
                          >
                            Resend
                          </Link>
                        </Typography>
                        <Typography>
                          <RouteLink
                            className={`register-link ${classes.new_link}`}
                            style={{ fontSize: "15px" }}
                            to="/"
                          >
                            Login/Register
                          </RouteLink>
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Card>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default withRouter(LoginVerification);
