import React, { useEffect } from "react";
import {
  Grid,
  makeStyles,
  createStyles,
  Theme,
  Typography,
  Card,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import {
  selectOtp,
  fetchOtpAsync,
  updateIsOtpSuccess,
} from "../lginVerificationSlice";
import AutoErrorMessage from "../../autoErrorMessage/autoErrorMessage";
import CustomButton from "../../reusable/customButton/customButton";
import { selectRegister } from "../../register/registerSlice";
import { selectChangePassword } from "../../changePassword/changePasswordSlice";
import "./resendOtp.scss";
import CustomTextField from "../../reusable/customTextField/customTextField";

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
      color: "#A2D3F7",
      fontSize: "15px",
      textDecoration: "none",
      marginTop: theme.spacing(4),
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

const ResendOtp: React.FC<any> = ({ history }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { isOtpSuccess } = useAppSelector(selectOtp);
  const { registerUser } = useAppSelector(selectRegister);
  const { userChangePasword } = useAppSelector(selectChangePassword);
  const [seconds, setSeconds] = React.useState(60);

  useEffect(() => {
    if (isOtpSuccess) {
      history.push("login");
    }
    return () => {
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
    dispatch(fetchOtpAsync({ email: registerUser.email, otp: data.otp }));
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
          otp: Yup.string().required("Enter otp"),
        })}
      >
        {(props: FormikProps<IOtpVerifyState>) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
          } = props;
          return (
            <div>
              <Card className="login-card">
                <Form autoComplete="false">
                  <Typography
                    align="center"
                    variant="h5"
                    color="primary"
                    className="heading-icon"
                  >
                    <img
                      src={
                        require("../../../utils/images/otp-verification-icon.png")
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
                  {/* <Typography
                                    align="center"
                                    variant="h6"
                                    color="primary"
                                >
                                    Enter the OTP sent your email <br /> 
                                    { registerUser.email ||  userChangePasword && userChangePasword.changePassword && userChangePasword.changePassword.email}
                                   
                                </Typography> */}
                  <Typography
                    align="center"
                    variant="body1"
                    color="primary"
                    className="heading-content"
                  >
                    Please enter the one-time password to verify your
                    account.Password has been sent to your mobile number.
                  </Typography>
                  <Grid container justify="space-around" direction="row">
                    <Grid
                      item
                      lg={10}
                      md={10}
                      sm={10}
                      xs={10}
                      className={classes.textField}
                    >
                      <CustomTextField
                        className={classes.textField}
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
                    <Grid item lg={10} md={10} sm={10} xs={10}>
                      <CustomButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        className="verify-button"
                      >
                        Resend Otp
                      </CustomButton>
                    </Grid>
                  </Grid>
                </Form>
              </Card>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default withRouter(ResendOtp);
