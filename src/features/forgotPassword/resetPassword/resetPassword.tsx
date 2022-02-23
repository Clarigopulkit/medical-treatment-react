import React from "react";
import {
  Typography,
  Card,
  Grid,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";

import { useAppDispatch } from "../../../hooks/hooks";
import CustomButton from "../../reusable/customButton/customButton";
import "../forgotPassword.scss";
import AutoErrorMessage from "../../autoErrorMessage/autoErrorMessage";
import CustomTextField from "../../reusable/customTextField/customTextField";
import { useHistory, useParams } from "react-router-dom";
import { resetPassword } from "./resetPasswordApi";
import Toast from "../../../reducres/reducers/toast";

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
    textField: {
      marginBottom: theme.spacing(2),
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

export interface IForgotPasswordState {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC<any> = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const unique_code = (useParams() as any).id
  const history = useHistory()

  const userLogin = async (data: IForgotPasswordState) => { };
  return (
    <>
      <div className={classes.root}>
        {/* <AutoErrorMessage /> */}
        {/* <NotificationHeader /> */}
        <Formik
          initialValues={{
            newPassword: "",
            confirmPassword: "",
          }}
          onSubmit={(values: IForgotPasswordState) => {
            resetPassword({ new_password: values.newPassword, confirm_password: values.confirmPassword, unique_code }, () => {
              Toast.success("Successfully Saved Personal Info");
              history.push('/login')
            })
          }}
          validationSchema={Yup.object().shape({
            newPassword: Yup.string()
            .required(
              "Please insert a valid password."
            ).matches(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/, {message : 'Please insert valid password. One uppercase, one lowercase, one special character and no spaces'}
            ),
            confirmPassword: Yup.string()
              .required("please confirm password")
              .test("password-match", "Password musth match", function (value) {
                return this.parent.newPassword === value;
              }),
          })}
        >
          {(props: FormikProps<IForgotPasswordState>) => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleChange,
              isSubmitting,
            } = props;
            return (
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
                        require("../../../utils/images/forgot-password-icon.png")
                          .default
                      }
                      height="100px"
                      width="100px"
                      alt="logo"
                    />
                  </Typography>
                  <Typography
                    align="center"
                    variant="h5"
                    color="primary"
                    className="heading"
                  >
                    Reset Password
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="primary"
                    className="heading-content"
                  >
                    Reset your password bt entering new password.
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
                        name="newPassword"
                        id="newPassword"
                        variant="outlined"
                        value={values.newPassword}
                        type="password"
                        placeholder="New Password"
                        helperText={
                          errors.newPassword && touched.newPassword
                            ? errors.newPassword
                            : ""
                        }
                        error={
                          errors.newPassword && touched.newPassword
                            ? true
                            : false
                        }
                        onChange={(event: any): void => {
                          handleChange(event);
                        }}
                        onBlur={handleBlur}
                      />
                    </Grid>
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
                        name="confirmPassword"
                        id="confirmPassword"
                        variant="outlined"
                        value={values.confirmPassword}
                        type="password"
                        placeholder="Confirm Password"
                        helperText={
                          errors.confirmPassword && touched.confirmPassword
                            ? errors.confirmPassword
                            : ""
                        }
                        error={
                          errors.confirmPassword && touched.confirmPassword
                            ? true
                            : false
                        }
                        onChange={(event: any): void => {
                          handleChange(event);
                        }}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item lg={10} md={10} sm={10} xs={10}>
                      <CustomButton fullWidth type="submit" variant="contained">
                        reset password
                      </CustomButton>
                    </Grid>
                  </Grid>
                </Form>
              </Card>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default ResetPassword;
