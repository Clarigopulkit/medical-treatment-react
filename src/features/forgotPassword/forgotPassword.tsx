import React, { useEffect, useState } from "react";
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
import Toast from "../../reducres/reducers/toast";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import CustomButton from "../reusable/customButton/customButton";
import {
  fetchForgotPasswordAsync,
  selectForgotPassword,
  updateUserName,
} from "./forgotPasswordSlice";
import "./forgotPassword.scss";
import CustomTextField from "../reusable/customTextField/customTextField";
import { store } from "../../store";
import CustomPopup from "../reusable/customPopup/customPopup";

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
  userName: string;
}

const ForgotPassword: React.FC<any> = ({ history }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState();
  const { userName } = useAppSelector(selectForgotPassword);

  useEffect(() => {
    let user = store.getState();
    if (
      user.login.user &&
      user.login.user.roles &&
      user.login.user.roles[0] &&
      user.login.user.roles[0].name
    ) {
      history.push("/dashboard");
    }
  }, []);

  const [popupProps, setPopupProps] = useState<any>()

  const userLogin = async (data: IForgotPasswordState,resetForm) => {
     
    dispatch(fetchForgotPasswordAsync({ username: data.userName })).then(
      (response) => {
        if(response?.type=='forgotPassword/fetchForgotPassword/fulfilled')
        {
            resetForm();
            setPopupProps({ message: 'We have just sent you the email. If you do not hear from us in few minutes, please check your spam folder', title: "Success", primaryText: 'Ok', hideSecondaryButton: true })
        }
      }
    );
  };

  const handleBackClick = () => {
    history.push("/login");
  };
  return (
    <>
      <div className={classes.root}>
        {/* <AutoErrorMessage /> */}

        {/* <NotificationHeader /> */}
        {popupProps && <CustomPopup visible={popupProps ? true : false} dismiss={() => setPopupProps(null)} {...popupProps} />}
        <Formik
          enableReinitialize
          initialValues={{
            userName: "",
          }}
          onSubmit={(values: IForgotPasswordState,{resetForm}) => {
            userLogin(values,resetForm);
          }}
          validationSchema={Yup.object().shape({
            userName: Yup.string().email().required("Enter valid email-id"),
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
                        require("../../utils/images/forgot-password-icon.png")
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
                    Forgot Password?
                  </Typography>
                  <Typography
                    align="center"
                    variant="body1"
                    color="primary"
                    className="heading-content"
                  >
                    Please enter your registered email address for recovering your account.
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
                        name="userName"
                        id="userName"
                        variant="outlined"
                        value={values.userName}
                        type="userName"
                        placeholder="Enter Email"
                        helperText={
                          errors.userName && touched.userName
                            ? errors.userName
                            : ""
                        }
                        error={
                          errors.userName && touched.userName ? true : false
                        }
                        onChange={(event: any): void => {
                          handleChange(event);
                          dispatch(updateUserName(event.target.value));
                        }}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item lg={10} md={10} sm={10} xs={10}>
                      <CustomButton fullWidth type="submit" variant="contained">
                        Send Email
                      </CustomButton>
                    </Grid>
                    <Grid item lg={10} md={10} sm={10} xs={10}>
                      <CustomButton
                        fullWidth
                        variant="contained"
                        onClick={handleBackClick}
                      >
                        Back to login
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

export default ForgotPassword;
