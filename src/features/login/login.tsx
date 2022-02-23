import React, { useEffect, useState } from "react";
import {
  Grid,
  makeStyles,
  createStyles,
  Theme,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { fetchLoginAsync, selectLogin, updateIsSuccess } from "./loginSlice";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import CustomButton from "../reusable/customButton/customButton";
import "./login.scss";
import CustomTextField from "../reusable/customTextField/customTextField";
import { store } from "../../store";
import { closeSpinner, loadSpinner } from "../../reducres/reducers/spinner";
import Auth from "../../protectedRoutes/Auth";
import storage from "redux-persist/lib/storage";
import { setProfile } from "../profile/profileSlice";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Toast from "../../reducres/reducers/toast";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "450px",
      display: "block",
      margin: "0 auto",
    },
    title: {
      padding: theme.spacing(2),
      color: "#446354",
      fontWeight: 0,
      fontFamily: "HelveticaBd !important",
    },
    title1: {
      padding: theme.spacing(2),
      color: "#446354",
      fontSize: "16px",
    },
    title2: {
      color: "#A2D3F7",
      fontSize: "15px",
      textDecoration: "underline",
    },
    fontH: {
      fontFamily: "Helvetica",
    },
    font15: {
      fontSize: "15px",
    },
    textField: {
      marginBottom: theme.spacing(2),
    },
    linkCheckbox: {
      alignItems: "center",
    },
    typogarphy: {
      textAlign: "right",
      fontSize: "15px",
    },
    submitButton: {
      marginTop: "40px",
      marginBottom: "40px",
    },
    link: {
      "& > *": {
        color: "#085044",
      },
      color: "#085044",
      textDecoration: "none",
      fontWeight: 500,
    },
  })
);

interface ILoginForm {
  email: string;
  password: string;
}

const Login: React.FunctionComponent<any> = ({ history, setValue }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector(selectLogin);
  const [passwordVisible, setPasswordVisibility] = useState(false)
  const [rememberMe, setrememberMe] = useState(false);

  const handleTabChange = () => {
    setValue(1);
  };
  useEffect(() => {
    window.scrollTo(0, 0)
    if (Auth.isAuthenticated().authenticated === false) {
      storage.removeItem("persist:root");
      dispatch(setProfile());
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("remember", JSON.stringify(rememberMe));
      // history.push("/sp-dashboard");
    }
    return () => {
      dispatch(updateIsSuccess(false));
    };
  }, [isSuccess]);

  useEffect(() => {
  let user = store.getState();
    if (
      user.login.user &&
      user.login.user.roles &&
      user.login.user.roles[0] &&
      user.login.user.roles[0].name
    ) {
      if (Auth.isAuthenticated().role === "Doctor" ) {
        history.push("/sp-dashboard");
      } else if( Auth.isAuthenticated().role === "Clinic"){
        history.push("/clinic-personal-info");
      } else{
        history.push("/dashboard");
      }
    }
  }, []);

  const userLogin = async (data: ILoginForm) => {
    dispatch(loadSpinner());
    dispatch(fetchLoginAsync({ email: data.email, password: data.password }))
      .then((result) => {
        dispatch(closeSpinner());
        if(result.type=='login/fetchLogin/fulfilled'){
          if(result.payload.roles[0].name === "Clinic")
          {
            history.push("/clinic-personal-info");
          }
          else if(result.payload.roles[0].name ==="Doctor")
          {
            history.push("/sp-dashboard");
          }
          else if(result.payload.roles[0].name ==="Patient")
          {
            history.push("/dashboard");
          }
        }
        else if(result?.payload?.response?.data?.statusCode!==200){
          Toast.error(result.payload.response.data.message);
          if(result?.payload?.response?.data?.data?.email_verified_at===null)
          {
             localStorage.setItem('email', result?.payload?.response?.data?.data?.email);
             history.push("otp-validation");
          }
        }

        //  console.log( 'testing', result);

      })
      .catch((err) => {
        dispatch(closeSpinner());
      });
  };
  return (
    <div className="bt-login">
      {/* <p>{Auth.isAuthenticated().role}</p> */}
      <div className={classes.root}>
        {/* <AutoErrorMessage /> */}
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={(values: ILoginForm) => {
            userLogin(values);
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email()
              .required("Please enter a valid email address"),
            password: Yup.string().required("Please enter the password"),
          })}
        >
          {/* main viewPort */}
          {(props: FormikProps<ILoginForm>) => {
            const { values, touched, errors, handleBlur, handleChange } = props;
            return (
              <Form autoComplete="false">
                <Typography
                  align="center"
                  variant="h5"
                  color="primary"
                  className={classes.title}
                >
                  Log In to your Account
                </Typography>
                <Grid
                  container
                  spacing={1}
                  justify="space-around"
                  direction="row"
                >
                  <Grid item xs={12}>
                    {/* Emial/UserName Field */}
                    <CustomTextField
                      className="login-text-field"
                      fullWidth
                      variant="outlined"
                      name="email"
                      id="email"
                      value={values.email}
                      type="email"
                      placeholder="Email Address"
                      helperText={
                        errors.email && touched.email ? errors.email : ""
                      }
                      error={errors.email && touched.email ? true : false}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/* Password */}
                    <CustomTextField
                      fullWidth
                      className="login-text-field"
                      variant="outlined"
                      name="password"
                      id="password"
                      value={values.password}
                      InputProps={{
                        endAdornment: (
                          < InputAdornment position="end" >
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setPasswordVisibility(cv => !cv)}>
                              {passwordVisible ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Password"
                      helperText={
                        errors.password && touched.password
                          ? errors.password
                          : ""
                      }
                      error={errors.password && touched.password ? true : false}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <Grid container className={classes.linkCheckbox}> */}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {/* Remember Me Feild */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            className={`labelkeep   ${classes.link}`}
                            onChange={() => {
                              setrememberMe(!rememberMe);
                            }}
                            name="checkedB"
                            color="primary"
                          />
                        }
                        className={`${classes.fontH} ${classes.font15}`}
                        label="keep me logged in"
                      />
                      <Typography>
                        {/* Forgot Password */}
                        <Link to="/forgot-password" className={classes.link}>
                          Forgot your password?
                        </Link>
                      </Typography>
                      {/* </Grid> */}
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={12} className={classes.submitButton}>
                  {/* Login Button */}
                  <CustomButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    className="login-button"
                  >
                    Login
                  </CustomButton>
                </Grid>
                <Typography
                  align="center"
                  variant="h5"
                  color="primary"
                  className={classes.title1}
                >
                  Don't have an account?
                </Typography>
                <Typography
                  align="center"
                  variant="h5"
                  color="primary"
                  className={classes.title2}
                >
                  {/* Register Button */}
                  <Link
                    to="#"
                    onClick={handleTabChange}
                    className="register-link"
                  >
                    Register Now
                  </Link>
                </Typography>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default withRouter(Login);
