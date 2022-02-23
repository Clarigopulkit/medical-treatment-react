import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Box, ButtonBase, Grid, Paper, Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, useHistory, useRouteMatch } from "react-router-dom";
import { AddDoctorClinic } from "../addDoctor/addDoctorSlice";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../../../hooks/hooks";
import CustomTextField from "../../../reusable/customTextField/customTextField";
import { grey } from "@material-ui/core/colors";
import CustomButton from "../../../reusable/customButton/customButton";
import CustomModal from "../../../reusable/customModal/customModal";
import * as Yup from "yup";
import { Regex } from "../../../validations/Regex";
import { ValidationMessages } from "../../../validations/Messages";
import AutoErrorMessage from "../../../autoErrorMessage/autoErrorMessage";
import Button from "@material-ui/core/Button";
import { displayPartsToString } from "typescript";
import Modal from "@material-ui/core/Modal";

import CloseIcon from "@material-ui/icons/Close";
// import Typography from "material-ui/c";
import "./index.css";
import Toast from "../../../../reducres/reducers/toast";
import { closeSpinner, loadSpinner } from "../../../../reducres/reducers/spinner";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      outline: "none",
      width: 400,
      backgroundColor: theme.palette.background.paper,top: '50% !important',
      left: '50% !important',
      transform: 'translate(-50%, -50%)!important',
      // border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),borderWidth:2,borderColor:'#debcbd',borderStyle : 'solid',
    },

    root: {
      // display: "flex",
      width: "100%",

      "& > *": {
        // margin: theme.spacing(2),
        width: "100%",
        // height: theme.spacing(16),
        boxSizing: "border-box !important",
      },
    },
    fs35: {
      fontSize: "35px",
    },
    border50: {
      borderRadius: "50px",
    },

    outline: {
      border: "1px solid grey",
    },
    px4: {
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
    },

    py4: {
      paddingTop: "1.5rem",
      paddingBottom: "1.5rem",
    },

    p4: {
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",

      paddingTop: "1.5rem",
      paddingBottom: "1.5rem",
    },
    BGWhite: {
      backgroundColor: "white",
    },
    JCE: {
      justifyContent: "flex-end",
    },
    buttonOverlay: {
      width: "100%",
      background: "transparent",
      border: "none",
    },
    typogarphy: {
      textAlign: "center",
    },
    

    paper_modal: {
      // width: "100px",
      // height: "100px",
      margin: theme.spacing(1),
      width: theme.spacing(20),
      height: theme.spacing(20),
      borderRadius: "5px",
    },

    changeSelect: {
      "& >span > div": {
        margin: "0 !important",
      },
      "& >span > lable > div > span ": {
        margin: "0 !important",
        width: "100% !important",
      },
      "& > span ": {
        paddingRight: "20px !important",
        paddingLeft: "40px",
      },
      [theme.breakpoints.down("xs")]: {
        "& > *": {
          padding: "0px !important",
        },
      },
      [theme.breakpoints.up("md")]: {
        // "& > *": {
        //   padding: "0px !important",
        // },
        flexWrap: "noWrap",
      },
    },
  })
);

const AddNewDoctor = () => {
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
      borderStyle: "solid", borderColor: "#debcbd"
    };
  }

  const classes = useStyles();

  const dispatch = useAppDispatch();
  const history = useHistory();

  const [myProfileImage, setMyProfile] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [modalStyle] = React.useState(getModalStyle);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Grid container>
        <Grid item xs={12} lg={12}>
          <Box display="flex" justifyContent="flex-end">
            <CloseIcon style={{color:'#085044'}} className="cancel-icon" onClick={handleClose} />
          </Box>
        </Grid>

        <Grid item xs={12} lg={12} >
          <Typography
            variant="h5"
            className="modal-heading"
            id="simple-modal-title"
            style={{alignItems:"center",justifyContent:"center",textAlign:'center',color:'#085044'}}
          >
            Invitation has been sent
            <br />
            via email
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" >
            <CustomButton
              variant="filled"
              onClick={() => {
                handleClose();
              }}
            >
              Ok
            </CustomButton>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
  return (
    <>
      {/* <AutoErrorMessage /> */}
      <Formik
      enableReinitialize={true}
        initialValues={{
          email: "",
          name: "",
          invite_msg: "",
          phone: "",
          linkedin_profile: "",
          profile: {},
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .required(ValidationMessages.fullName.required)
            .min(2, ValidationMessages.fullName.min)
            .max(50, ValidationMessages.fullName.max)
            .matches(Regex.NAME, ValidationMessages.fullName.invaild),
          email: Yup.string()
            .required(ValidationMessages.EMAIL.required)
            .max(255, ValidationMessages.EMAIL.max)
            .matches(Regex.EMAIL, ValidationMessages.EMAIL.invalid),

            invite_msg: Yup.string().required(
                ValidationMessages.invitation_text.required
              ),

          // linkedin_profile: Yup.string().required(
          //   ValidationMessages.fullName.required
          // ),

          // phone: Yup.string()
          //   .required(ValidationMessages.PHONE.required)
          //   .min(10, ValidationMessages.PHONE.DOES_NOT_EXISTS)
          //   .max(10, ValidationMessages.PHONE.invalid)
          //   .matches(Regex.PHONE, ValidationMessages.PHONE.invalid),
        })}
        onSubmit={(values, { setSubmitting ,resetForm}) => {
          dispatch(loadSpinner());
          dispatch(AddDoctorClinic(values)).then((result) => {
            // @ Check Wether Request is Fulfilled or not
            if (result.type === "AddDoctor/fulfilled") {
              resetForm();
              dispatch(closeSpinner());
              Toast.success("Successfully Sent Invitation.");
              // history.push("/clinic-personal-info/");
              setOpen(true);
            } else {
              dispatch(closeSpinner());
              Toast.error(result?.payload?.response?.data?.message);
            }
          });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting,
          resetForm
          /* and other goodies */
        }) => (
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            encType="multiPart/form-data"
          >
            <Grid
              container
              spacing={5}
              style={{ justifyContent: "center", paddingBottom: "2rem", }}
            >
              {/* <Grid item lg={10} className="py-4">
                <Grid item lg={12}>
                  <Grid container alignItems="center">
                    <ArrowBackIcon
                      className={classes.fs35}
                      onClick={() => {
                        history.replace("/clinic-personal-info");
                      }}
                    />
                    <Typography variant="h3" className="main-heading">
                      <Grid item className={classes.fs35}>
                        Add Doctor
                      </Grid>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid> */}

              <Grid
                item
                lg={10}
                className=""
                style={{
                  border: "1px solid #debcbd",
                  background: "white",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
              >
                <Grid
                  // className="office-address-title"
                  style={{ borderBottom:0 }}
                >
                  <Typography
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      // borderBottom: "1px solid #debcbd",
                      // paddingBottom: "10px",
                      paddingTop: "0px",
                      paddingLeft: "2rem",
                      paddingRight: "2rem",color:'#085044'
                    }}
                  >
                    Add Doctor
                  </Typography>
                </Grid>
                {/* <Grid
                  container
                  style={{ justifyContent: "space-between" }}
                  className="py-4 px-4"
                >
                  <Grid item xs={12} lg={2}>
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      flexDirection="column"
                      alignItems="center"
                      className={classes.changeSelect}
                    >
                      <img
                        src="https://images.hindustantimes.com/rf/image_size_640x362/HT/p2/2016/10/22/Pictures/_26338b52-9834-11e6-98f6-96638e85be2b.jpg"
                        width="180px"
                      />
                      <div style={{ paddingTop: "10px", width: "100%" }}>
                        <label htmlFor="contained-button-file">
                          <CustomButton
                            component="span"
                            fullWidth
                            className="green-button"
                            style={{ fontSize: "15px" }}
                          >
                            Upload Picture
                            <input
                              hidden
                              id="contained-button-file"
                              type="file"
                              onChange={(e) => {
                                setFieldValue("profile", e.target.files[0]);
                              }}
                            />
                          </CustomButton>
                        </label>
                      </div>
                    </Box>
                  </Grid>
                </Grid> */}

                <Grid
                  container
                  spacing={5}
                  style={{ justifyContent: "space-between" }}
                  className="py-4 px-4"
                >
                  <Grid item lg={6} md={6} sm={6} xs={12}>
                    <CustomTextField
                      className="login-text-field"
                      fullWidth
                      fieldName={"First Name"}
                      variant={"outlined"}
                      value={values.name}
                      placeholder="First Name"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={errors.name && errors.name}
                      error={errors && errors.name ? true : false}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12}>
                    <CustomTextField
                      className="login-text-field"
                      fullWidth
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fieldName={"Email"}
                      variant={"outlined"}
                      value={values.email}
                      placeholder="Email"
                      helperText={errors.email && errors.email}
                      error={errors && errors.email ? true : false}
                    />
                  </Grid>
                   {/* <Grid item lg={6} md={6} sm={6} xs={12}>
                    <CustomTextField
                      className="login-text-field"
                      fullWidth
                      fieldName={"Phone Number"}
                      variant={"outlined"}
                      name="phone"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Phone Number"
                      helperText={errors.phone && errors.phone}
                      error={errors && errors.phone ? true : false}
                    />
                  </Grid> */}
                  <Grid item lg={12} md={6} sm={6} xs={12}>
                    <CustomTextField
                      className="login-text-field"
                      fullWidth
                      multiline
                      InputProps={{style : {minHeight : 150, textAlignVertical : 'top'}}}
                      inputProps={{style : {minHeight :150}}}
                      name="invite_msg"
                      onChange={handleChange}
                      value={values.invite_msg}
                      onBlur={handleBlur}
                      fieldName={"Invitation Text"}
                      variant={"outlined"}
                      placeholder="Invitation Text"
                      helperText={
                        errors.invite_msg && errors.invite_msg
                      }
                      error={errors && errors.invite_msg ? true : false}
                    />
                  </Grid>
                </Grid>

                <div>
                  <Modal
                  style={{marginRight:90,}}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    {body}
                  </Modal>
                </div>

                <Grid
                  item
                  className="py-4 px-4"
                  style={{ justifyContent: "flex-end", display: "flex" }}
                >
                  <CustomButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    className="login-button"
                    onClick={handleSubmit}
                  >
                    Send Invitation
                  </CustomButton>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddNewDoctor;
