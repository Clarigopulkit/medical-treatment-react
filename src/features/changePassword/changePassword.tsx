import React, { useEffect, useState } from "react";
import { Grid, makeStyles, createStyles, Theme } from "@material-ui/core";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import CustomButton from "../reusable/customButton/customButton";
import {
  fetchChangePaswordAsync,
  selectChangePassword,
} from "./changePasswordSlice";
import CustomTextField from "../reusable/customTextField/customTextField";
import { Regex } from "../../utils/validations";
import { closeSpinner, loadSpinner } from "../../reducres/reducers/spinner";

import Modal from "@material-ui/core/Modal";
import { fetchOtpAsync } from "../loginVerification/loginVerificationSlice";
import Toast from "../../reducres/reducers/toast";
import { initialState } from "../SP/Doctor/profile/visibleProfileInfo/visibleProfileSlice";
import CustomPopup from "../reusable/customPopup/customPopup";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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
    chanpePassword: {
      height: "41px",
      marginTop: "10px",
    },
    typogarphy: {
      textAlign: "right",
    },
    submitButton: {
      marginBottom: "30px",
    },
    paper: {
      "& > * ": {
        textAlign: "center",
      },
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #debcbd",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),    top: '50% !important',
      left: '50% !important',
      transform: 'translate(-50%, -50%)!important',
    },
  })
);

export interface IChangePasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IOtp {
  otp: string;
}
const ChangePassword: React.FunctionComponent<any> = (props) => {
  const dispatch = useAppDispatch();
  const { userName } = useAppSelector(selectChangePassword);
  const { isChangePasswordSuccess, loading } =
    useAppSelector(selectChangePassword);

  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }

  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [verifyOtpp, setverifyOtpp] = React.useState({ email: "" });
  const [confirmOtp, setconfirmOtp] = React.useState("");
  const [confirmOtperror, setconfirmOtperror] = React.useState(false);

  const changePassword = async (data: IChangePasswordState) => {
    dispatch(loadSpinner());
    dispatch(
      fetchChangePaswordAsync({
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      })
    ).then((result) => {
      if (result?.payload?.response?.data?.statusCode == 400) {
        Toast.error(result?.payload?.response?.data?.message);
        dispatch(closeSpinner());
      }
      if (result?.payload?.email !== undefined) {
        Toast.success("Successfully send Otp on your email.");
        setOpen(true);
        setverifyOtpp(result.payload);
        dispatch(closeSpinner());
      } else {
        dispatch(closeSpinner());
      }
    });
  };

  const [modalStyle] = React.useState(getModalStyle);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePasswordConfirm = (values) => {
    dispatch(loadSpinner());
    dispatch(
      fetchChangePaswordAsync({
        email: verifyOtpp.email,
        otp: values.otp,
        current_password: passcont.currentPassword,
        new_password: passcont.newPassword,
        confirm_password: passcont.confirmPassword,
      })
    ).then((result) => {
      if (result?.payload?.response?.data?.data.length == 0) {
        window.scrollTo(0, 0)
        // Toast.error(result?.payload?.response?.data?.message);
        setPopupProps({ message: result?.payload?.response?.data?.message , title: "Alert", primaryText: 'Ok', hideSecondaryButton: true })
        dispatch(closeSpinner());
      } else {
        passcont.setField();
        if(result.type =="changePasword/fetchChangePassword/fulfilled")
        {
          setPopupProps({message: "The password has been successfully changed" , title: "Success", primaryText: 'Ok', hideSecondaryButton: true })
        }else{
          setPopupProps({message: result?.payload?.response?.data?.message , title: "Alert", primaryText: 'Ok', hideSecondaryButton: true })
        }
        
        // Toast.error(result?.payload?.response?.data?.message);
        handleClose();
        dispatch(closeSpinner());
      }
    });
  };

  const [changeState, setChangeState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [timer, setTimer] = useState(60);
  const [popupProps, setPopupProps] = useState<any>()
  useEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => {
      if (open == true) {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          return;
        }
      } else {
        return;
      }
    }, 1000);
  }, [open, timer]);

  useEffect(() => {
    if (timer > 0 && timer < 60) {
      setTimer(60);
    }
  }, [open]);

  const [passcont, setPasscont] = useState<any>(null);
  const [fieldValue_1, setfieldValue_1] = useState<any>(null);

  const initilavalues = { otp: "" };
  const body = (
    
    <Formik
      enableReinitialize
      initialValues={initilavalues}
      onSubmit={(values: IOtp) => {
        handleChangePasswordConfirm(values);
      }}
      validationSchema={Yup.object().shape({
        otp: Yup.string().required("Please enter otp to confirm."),
      })}
    >
      {(props: FormikProps<IOtp>) => {
        const {
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        } = props;

        return (
          
          <Form autoComplete="false">
            <div style={modalStyle} className={classes.paper}>
              <span
                id="simple-modal-description"
                style={{
                  right: "20px",
                  top: "10px",
                  position: "absolute",
                  float: "right",
                  fontSize: "20px",
                  color: "rgb(65 100 85)",
                  fontWeight: 600,
                  padding: "2px 5px",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  passcont.setField();

                  handleClose();
                  setTimer(60);
                }}
              >
                X
              </span>
              <p
                id="simple-modal-description"
                style={{
                  fontSize: "15px",
                  color: "rgb(65 100 85)",
                  fontWeight: 600,
                }}
              >
                Enter OTP sent to your mail <br />
                {"*****" + verifyOtpp?.email.slice(4) + " "} to change your
                password.
              </p>
              <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="OTP"
                name="otp"
                defaultValue={values.otp}
                onChange={handleChange}
                helperText={
                  errors && errors.otp && touched && touched.otp && errors.otp
                }
                error={
                  errors && errors.otp && touched && touched.otp && errors.otp
                    ? true
                    : false
                }
              />
              <CustomButton variant="outlined" fullWidth onClick={handleSubmit}>
                Change Password
              </CustomButton>
              <div
                className="pointer"
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#085044",
                }}
                onClick={() => {
                  if (timer === 0) {
                    changePassword(passcont);
                    setTimer(60)
                  }
                }}
              >
                {timer > 0 ? timer : "Resend OTP"}
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
  return (
    <>
      <div className={classes.root}>
        {/* <AutoErrorMessage /> */}
        {popupProps && <CustomPopup visible={popupProps ? true : false} dismiss={() => setPopupProps(null)} {...popupProps} />}
        <Formik
          enableReinitialize
          initialValues={changeState}
          onSubmit={(values: IChangePasswordState) => {
            setPasscont({ ...values, setField: fieldValue_1.filed });
            changePassword(values);
          }}
          validationSchema={Yup.object().shape({
            currentPassword: Yup.string().required(
              "Please enter current Password"
            ),
            newPassword: Yup.string()
            .required(
              "Please enter valid password should be at least 8 digits including at least one uppercase, one lowercase, one special character  and no spaces"
            )
            .matches(
              Regex.PASSWORD,
              "Please enter valid password should be at least 8 digits including at least one uppercase, one lowercase, one special character  and no spaces"
            ),
            confirmPassword: Yup.string()
              .required("Please re-enter password.")
              .test("password-match", "Password must match", function (value) {
                return this.parent.newPassword === value;
              }),
          })}
        >
          {(props: FormikProps<IChangePasswordState>) => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleChange,
              setFieldValue,
              setErrors,
              setFieldTouched,
              isSubmitting,
            } = props;
            return (
              <Form autoComplete="false">
                <Grid container spacing={3} style={{ alignItems: "" }}>
                  <Grid item lg={3} xs={12}>
                    <CustomTextField
                      fieldName="Current Password"
                      className={classes.textField}
                      variant="outlined"
                      fullWidth
                      name="currentPassword"
                      id="currentPassword"
                      value={values.currentPassword}
                      type="password"
                      placeholder="Current Password"
                      helperText={
                        errors.currentPassword && touched.currentPassword
                          ? errors.currentPassword
                          : ""
                      }
                      error={
                        errors.currentPassword && touched.currentPassword
                          ? true
                          : false
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <CustomTextField
                      fullWidth
                      fieldName="New Password"
                      variant="outlined"
                      name="newPassword"
                      id="newPassword"
                      placeholder="New Password"
                      value={values.newPassword}
                      type="password"
                      helperText={
                        errors.newPassword && touched.newPassword
                          ? errors.newPassword
                          : ""
                      }
                      error={
                        errors.newPassword && touched.newPassword ? true : false
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <div>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="simple-modal-title"
                      aria-describedby="simple-modal-description"
                    >
                      {body}
                    </Modal>
                  </div>
                  <Grid item lg={3} xs={12}>
                    <CustomTextField
                      fullWidth
                      fieldName="Confirm Password"
                      variant="outlined"
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      value={values.confirmPassword}
                      type="password"
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <div style={{height : 5}} />
                    <CustomButton
                      fullWidth
                      type="submit"
                      variant="contained"
                      onClick={() => {
                        setfieldValue_1({
                          filed: () => {
                            setFieldValue("confirmPassword", "");
                            setFieldValue("newPassword", "");
                            setFieldValue("currentPassword", "");
                            setFieldTouched("confirmPassword", false);
                            setFieldTouched("newPassword", false);
                            setFieldTouched("currentPassword", false);
                          },
                        });
                      }}
                    >
                      Change Password
                    </CustomButton>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default ChangePassword;
