import React, { useEffect, useState } from "react";
import {
  Grid,
  FormHelperText,
  MenuItem,
  ListItemText,
  Select,
  FormControl,
  InputLabel,
  Link,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CustomButton from "../reusable/customButton/customButton";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import {
  fetchRegisterAsync,
  selectRegister,
  updateIsRegisterSuccess,
} from "./registerSlice";
import CustomTextField from "../reusable/customTextField/customTextField";
import "./register.scss";
import { store } from "../../store";
import { Regex } from "../validations/Regex";
import { closeSpinner, loadSpinner } from "../../reducres/reducers/spinner";
// import IconButton from "material-ui/IconButton";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Toast from "../../reducres/reducers/toast";

interface ISignUpForm {
  userType: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
const useStyles = makeStyles((theme: Theme) => ({
  root1: {
    maxWidth: "450px",
    display: "block",
    margin: "0 auto",
  },
  title: {
    padding: theme.spacing(2),
    paddingTop: "20px",
    color: "#446354",
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
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  BorderColor: {
    borderColor: "#085044",

    "& $notchedOutline": {
      borderColor: "#085044",
    },
  },
}));
const userTypes = ["Clinic", "Doctor", "Patient"];

const UserRegister: React.FC<any> = ({ history, setValue }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { isRegisterSuccess } = useAppSelector(selectRegister);
  const [passwordVisible, setPasswordVisibility] = useState(false)

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

  useEffect(() => {
    if (isRegisterSuccess) {
      history.push("otp-validation");
    }
    return () => {
      dispatch(updateIsRegisterSuccess(false));
    };
  }, [isRegisterSuccess]);

  const createNewUser = async (data: ISignUpForm, resetForm: Function) => {
    dispatch(loadSpinner());
    dispatch(
      fetchRegisterAsync({
        user_type: data.userType,
        email: data.email,
        name: data.name,
        password: data.password,
        password_confirmation: data.password_confirmation,
      })
    ).then((response) => {
      dispatch(closeSpinner());
        if (response?.payload?.response?.data?.statusCode == 200) {
          Toast.success(response?.payload?.response?.data.message);
          
        } else {
          Toast.error(response?.payload?.response?.data.message);
        }
    });
  };
  return (
    <div className={`${classes.root1} bt-register `}>
      {/* <AutoErrorMessage /> */}
      {/* <NotificationHeader /> */}
      {/* <Card> */}
      <Formik
        initialValues={{
          userType: "",
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
        }}
        onSubmit={(values: ISignUpForm, actions) => {
          createNewUser(values, actions.resetForm);
        }}
        validationSchema={Yup.object().shape({
          userType: Yup.string()
            .required("Please select User Type")
            .min(1, "Select any UserType"),
          email: Yup.string().email().required("Enter a valid email address"),
          name: Yup.string().required("Please enter full name").min(1).max(50),
          password: Yup.string()
            .required(
              "Please enter valid password should be at least 8 digits including at least one uppercase, one lowercase, one special character  and no spaces"
            )
            .matches(
              Regex.PASSWORD,
              "Please enter valid password should be at least 8 digits including at least one uppercase, one lowercase, one special character  and no spaces"
            ),
          password_confirmation: Yup.string()
            .required("Please enter confirm password")
            .test("password-match", "Password must match", function (value) {
              return this.parent.password === value;
            }),
        })}
      >
        {/* main Feild */}
        {(props: FormikProps<ISignUpForm>) => {
          const { values, touched, errors, handleBlur, handleChange } = props;
          return (
            <Form className="RegisterForm">
              <Typography
                align="center"
                variant="h5"
                color="primary"
                className={classes.title}
              >
                Create an Account
              </Typography>
              <Grid container justify="space-around" direction="row">
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.textField}
                >
                  <FormControl
                    className={classes.BorderColor}
                    fullWidth
                    variant="outlined"
                    error={errors.userType && touched.userType ? true : false}
                  >
                    {/* label user Type */}
                    <InputLabel
                      style={{ fontSize: "15px" }}
                      id="demo-mutiple-checkbox-label"
                      className="input-label"
                    >
                      User Type
                    </InputLabel>
                    {/* User type selector */}
                    <Select
                      labelId="demo-mutiple-checkbox-label"
                      id="userType"
                      name="userType"
                      className={` ${classes.selectEmpty} ${classes.BorderColor
                        } input-label no-scrooll ${{
                          root: classes.BorderColor,
                        }}`}
                      onChange={handleChange}
                      error={errors.userType && touched.userType}
                      value={values.userType}
                    >
                      {userTypes.map((names) => (
                        <MenuItem key={names} value={names}>
                          <ListItemText primary={names} />
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.userType && touched.userType
                        ? errors.userType
                        : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.textField}
                >
                  <Grid container spacing={1}>
                    {/* Full Name  */}
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                      <CustomTextField
                        className="login-text-field mr-6"
                        variant="outlined"
                        fullWidth
                        name="name"
                        id="name"
                        placeholder="Full Name"
                        value={values.name}
                        type="text"
                        helperText={
                          errors.name && touched.name ? errors.name : ""
                        }
                        error={errors.name && touched.name ? true : false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={6}>
                      {/* Email */}
                      <CustomTextField
                        fullWidth
                        className="login-text-field ml-6"
                        variant="outlined"
                        name="email"
                        id="email"
                        placeholder="Email Address"
                        value={values.email}
                        type="email"
                        helperText={
                          errors.email && touched.email ? errors.email : ""
                        }
                        error={errors.email && touched.email ? true : false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.textField}
                >
                  {/* password feild */}
                  <CustomTextField
                    fullWidth
                    className="login-text-field"
                    variant="outlined"
                    name="password"
                    id="password"
                    placeholder="Password"
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
                    value={values.password}
                    type={passwordVisible ? "text" : "password"}
                    helperText={
                      errors.password && touched.password ? errors.password : ""
                    }
                    error={errors.password && touched.password ? true : false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.textField}
                >
                  {/* Confirm Password */}
                  <CustomTextField
                    fullWidth
                    className="login-text-field"
                    variant="outlined"
                    name="password_confirmation"
                    id="password_confirmation"
                    placeholder="Confirm password"
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
                    value={values.password_confirmation}
                    type={passwordVisible ? "text" : "password"}
                    helperText={
                      errors.password_confirmation &&
                        touched.password_confirmation
                        ? errors.password_confirmation
                        : ""
                    }
                    error={
                      errors.password_confirmation &&
                        touched.password_confirmation
                        ? true
                        : false
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.submitButton}
                >
                  {/* Submit Button */}
                  <CustomButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    className="register-button"
                  >
                    Submit
                  </CustomButton>
                </Grid>
              </Grid>
              {/* existing User  */}
              <Typography
                align="center"
                variant="h5"
                color="primary"
                className={classes.title1}
              >
                Already Register?
              </Typography>
              <Typography
                align="center"
                variant="h5"
                color="primary"
                className={classes.title2}
              >
                <Link
                  href="#"
                  onClick={() => setValue(0)}
                  className="register-link"
                >
                  Log In
                </Link>
              </Typography>
            </Form>
          );
        }}
      </Formik>
      {/* </Card> */}
    </div >
  );
};

export default withRouter(UserRegister);
