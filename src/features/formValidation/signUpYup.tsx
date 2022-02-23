import React, { useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
  Theme,
  Input,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
  FormHelperText,
} from "@material-ui/core";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";

import {  useAppDispatch } from "../../hooks/hooks";
import { fetchRegisterAsync } from "../formValidation/signUpSlice";
import { store } from "../../store";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "450px",
      display: "block",
      margin: "0 auto",
    },
    textField: {
      width: "100%",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    submitButton: {
      marginTop: "24px",
    },
    title: {
      textAlign: "center",
    },
  })
);

interface ISignUpForm {
  userType: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  email: string;
  zipcode: string;
  country: Array<string>;
}

const countries = [
  "India",
  "Sri Lanka",
  "USA",
  "Germany",
  "South Africa",
  "England",
  "Sweden",
  "Austrilia",
];

const SignUp: React.FunctionComponent = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const history = useHistory();

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

  const createNewUser = async (data: ISignUpForm, resetForm: Function) => {
    dispatch(
      fetchRegisterAsync({
        userType: data.userType,
        name: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
    );
  };

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          userType: "",
          fullName: "",
          password: "",
          confirmPassword: "",
          email: "",
          zipcode: "",
          country: [],
        }}
        onSubmit={(values: ISignUpForm, actions) => {
          createNewUser(values, actions.resetForm);
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email().required("Enter valid email-id"),
          fullName: Yup.string().required("Please enter full name"),
          state: Yup.string().required("please select atleast 3"),
          password: Yup.string()
            .matches(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/
            )
            .required(
              "Please valid password. One uppercase, one lowercase, one special character and no spaces"
            ),
          confirmPassword: Yup.string()
            .required("Required")
            .test("password-match", "Password musth match", function (value) {
              return this.parent.password === value;
            }),
          zipcode: Yup.string()
            .required()
            .matches(/^[0-9]+$/, "Must be only digits")
            .min(6, "Must be exactly 6 digits")
            .max(6, "Must be exactly 6 digits"),

          country: Yup.array()
            .required("Must have Select")
            .min(2, " select minimun 2 countries"),
        })}
      >
        {(props: FormikProps<ISignUpForm>) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            isSubmitting,
          } = props;
          return (
            <Form>
              <h1 className={classes.title}>Sign up</h1>
              <Grid container justify="space-around" direction="row">
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.textField}
                >
                  <TextField
                    fullWidth
                    name="fullName"
                    id="fullName"
                    label="Full Name"
                    value={values.fullName}
                    type="text"
                    helperText={
                      errors.fullName && touched.fullName
                        ? errors.fullName
                        : "Enter your full name."
                    }
                    error={errors.fullName && touched.fullName ? true : false}
                    onChange={handleChange}
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
                  <TextField
                    fullWidth
                    name="password"
                    id="password"
                    label="Password"
                    value={values.password}
                    type="password"
                    helperText={
                      errors.password && touched.password
                        ? "Please enter valid password should be at least 8 digits including at least one uppercase, one lowercase, one special character  and no spaces"
                        : "Please enter valid password should be at least 8 digits including at least one uppercase, one lowercase, one special character  and no spaces"
                    }
                    error={errors.password && touched.password ? true : false}
                    onChange={handleChange}
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
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    id="confirmPassword"
                    label="Confirm password"
                    value={values.confirmPassword}
                    type="password"
                    helperText={
                      errors.confirmPassword && touched.confirmPassword
                        ? errors.confirmPassword
                        : "Re-enter password to confirm"
                    }
                    error={
                      errors.confirmPassword && touched.confirmPassword
                        ? true
                        : false
                    }
                    onChange={handleChange}
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
                  <TextField
                    fullWidth
                    name="email"
                    id="email"
                    label="Email-id"
                    value={values.email}
                    type="email"
                    helperText={
                      errors.email && touched.email
                        ? errors.email
                        : "Enter email-id"
                    }
                    error={errors.email && touched.email ? true : false}
                    onChange={handleChange}
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
                  <TextField
                    fullWidth
                    name="zipcode"
                    id="zipcode"
                    label="ZipCode"
                    value={values.zipcode}
                    type="text"
                    helperText={
                      errors.zipcode && touched.zipcode
                        ? errors.zipcode
                        : "Enter your zipcode."
                    }
                    error={errors.zipcode && touched.zipcode ? true : false}
                    onChange={handleChange}
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
                  <FormControl
                    fullWidth
                    error={errors.country && touched.country ? true : false}
                  >
                    <InputLabel id="demo-mutiple-checkbox-label">
                      Country
                    </InputLabel>
                    <Select
                      labelId="demo-mutiple-checkbox-label"
                      id="country"
                      name="country"
                      multiple
                      input={<Input />}
                      value={values.country}
                      onChange={handleChange}
                      renderValue={(selected) =>
                        (selected as string[]).join(", ")
                      }
                    >
                      {countries.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox
                            checked={values.country.indexOf(name) > -1}
                          />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.country && touched.country ? errors.country : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={classes.submitButton}
                >
                  <Button type="submit" variant="contained" color="secondary">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SignUp;
