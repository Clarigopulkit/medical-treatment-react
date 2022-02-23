import React, { ForwardRefRenderFunction, useImperativeHandle } from "react";
import {
  Grid,
  MenuItem,
  FormControl,
  Select,
  Input,
  Typography,
  FormHelperText,
  ListItemText,
  Checkbox,
  InputAdornment,
  Box
} from "@material-ui/core";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "../../../../../components/modal/modal";
import { map, filter, head, get, isEmpty } from "lodash";

import { Formik, Form, FormikProps, Field, FormikConfig } from "formik";
import * as Yup from "yup";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useAppDispatch } from "../../../../../hooks/hooks";
import CustomButton from "../../../../reusable/customButton/customButton";
import CustomTextField from "../../../../reusable/customTextField/customTextField";
import { fetchDoctorBusinessInfoAsync } from "./businessInfoSlice";
import { useState } from "react";
import "./businessInfo.scss";
import { useEffect } from "react";
import { closeSpinner, loadSpinner } from "../../../../../reducres/reducers/spinner";
import { Regex } from "../../../../../utils/validations";
import Toast from "../../../../../reducres/reducers/toast";
import { fetchProfileAsync } from "../../../../profile/profileSlice";
import { objectToFormData } from "../../../../../utils/apiHelpers";
import { dialCodes } from "../../../../../utils/dialCodes/dialCodes";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { City, Country, State } from "country-state-city";
import CustomPopup from "../../../../reusable/customPopup/customPopup";

const useStyles = makeStyles((theme: Theme) => ({
  root1: {
    display: "block",
    margin: "0 auto",
  },
  title: {
    padding: theme.spacing(2),
    paddingTop: "1px",
    color: "#446354",
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
  buttonBox: {
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "nowrap",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      flexWrap: "wrap",
      "& > div": {
        width: "100%",
      },
      "& >div> button": {
        width: "100%",
      },
    },
  },
  linkCheckbox: {
    alignItems: "center",
  },
  input: {
    display: "none",
  },
  margin: {
    margin: theme.spacing(1),
  },
  typogarphy: {
    textAlign: "right",
  },
  submitButton: {
    marginTop: "20px",
  },
  selectEmpty: {
    "& > div > div > span": {
      // overflowX: "scroll",
    },
  },
  border_fix: {
    "& > *": {
      borderColor: "red !important",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    width: "65px",
    minWidth: "fit-content",
    "& > *": {
      fontWeight: 700,
      color: "#085044",
    },
  },
  formControlSelect: {
    margin: theme.spacing(1),
    minWidth: 200,
  },

  uploadButton: {
    "& > div": {
      padding: "5px !important",
    },
  },
}));

export interface IDoctorProfilebusinessInfo {
  country_code: string;
  card_no: any;
  card_holder_name: any;
  clinic_name: string;
  clinic_email: string;
  clinic_phone_number: string;
  website_address: string;
  tax_number: string;
  registration_number: string;
  registration_authority: string;
  year: string;
  bank_name: string;
  sort_code: string;
  swift_code: string;
  fileUpload: any;
  address_line: string;
  address_line_1: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  is_primary_acc: number;
}

const BusinessInfo: ForwardRefRenderFunction<FormikConfig<any>, any> = ({
  user_business_info,
  user_payment_information,
  country_code,
}, ref: any) => {
  let businessInfo: {
    clinic_name: string;
    clinic_email: string;
    clinic_phone_number: string;
    website_address: string;
    tax_number: string;
    registration_number: string;
    registration_authority: string;
  }[] = [
      {
        clinic_name: "",
        clinic_email: "",
        clinic_phone_number: "",
        website_address: "",
        tax_number: "",
        registration_number: "",
        registration_authority: "",
      },
    ];
  let paymentsInfo: {
    card_no: string;
    card_holder_name: string;
    bank_name: string;
    sort_code: string;
    swift_code: string;
  }[] = [
      {
        card_no: "",
        card_holder_name: "",
        bank_name: "",
        sort_code: "",
        swift_code: "",
      },
    ];
  let clinicInfo: {
    address_line: string;
    address_line_1: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
  }[] = [
      {
        address_line: "",
        address_line_1: "",
        city: "",
        state: "",
        country: "",
        postcode: "",
      },
    ];

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [age, setAge] = React.useState("");
  const [files, setFiles] = useState<any>("");
  const [checked, setChecked] = React.useState(true);
  const [states, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  const [modalContent, setModalContent] = useState<any>({});
  const [open, setOpen] = useState(false);
  const handleModalClose = () => {
    setOpen(!open);
  };

  const [type, setType] = useState("");

  const {
    clinic_name = "",
    clinic_email = "",
    clinic_phone_number = "",
    website_address = "",
    tax_number = "",
    registration_number = "",
    registration_authority = "",
    year = "",
    fileUpload = "",
  } = user_business_info || {};

  const {
    card_no = "",
    card_holder_name = "",
    bank_name = "",
    sort_code = "",
    swift_code = "",
    is_primary_acc = 0,
  } = user_payment_information || {};

  const {
    address_line = "",
    address_line_1 = "",
    city = "",
    state = "",
    country = "",

    postcode = "",
  } = user_business_info || {};

  const [initialValues, setIntialState] = useState({
    clinic_name,
    country_code: user_business_info?.country_code,
    clinic_email,
    clinic_phone_number,
    website_address,
    tax_number,
    fileUpload,
    registration_number,
    registration_authority,
    year,
    card_no,
    card_holder_name,
    bank_name,
    sort_code,
    swift_code,
    address_line,
    address_line_1,
    city,
    state,
    country,
    postcode,
    is_primary_acc,
  });

  useEffect(() => {
    setIntialState({
      clinic_name,
      clinic_email,
      clinic_phone_number,
      website_address,
      country_code: user_business_info?.country_code,
      tax_number,
      fileUpload: user_business_info && user_business_info?.file_url,
      registration_number,
      registration_authority,
      year,
      card_no,
      card_holder_name,
      bank_name,
      sort_code,
      swift_code,
      address_line,
      address_line_1,
      city,
      state,
      country,
      postcode,
      is_primary_acc,
    });
  }, []);

  const saveDoctorbusinessProfileInfo = async (
    data: IDoctorProfilebusinessInfo
  ) => {
    dispatch(loadSpinner());

    let formData = new FormData();

    let ob1 = {
      clinic_name: data.clinic_name,
      clinic_email: data.clinic_email,
      clinic_phone_number: data.clinic_phone_number,
      tax_number: data.tax_number,
      registration_authority: data.registration_authority,
      website_address: data.website_address,
      registration_number: data.registration_number,
      address_line: data.address_line,
      address_line_1: data.address_line_1,
      city: data.city,
      country_code: data.country_code,
      state: data.state,
      country: data.country,
      postcode: data.postcode,
      file: data.fileUpload,
    };

    let payment = {
      card_no: data.card_no,
      account_no: data.card_no,
      card_holder_name: data.card_holder_name,
      bank_name: data.bank_name,
      sort_code: parseInt(data.sort_code),
      swift_code: data.swift_code,
      is_primary_acc: data?.is_primary_acc,
    };

    for (let keys in ob1) {
      if (typeof data[keys] !== "object") {
        formData.append(keys, data[keys]);
      }
    }

    formData = objectToFormData(payment, "payment", formData);

    if (typeof data.fileUpload == "object") {
      formData = objectToFormData(data.fileUpload, "file", formData);
    } else {
      formData = objectToFormData([], "file", formData);
    }

    dispatch(fetchDoctorBusinessInfoAsync(formData))
      .then((result) => {
        dispatch(fetchProfileAsync());
        if (result.payload.length == 0) {
          window.scrollTo(0, 0)
          Toast.success("Details Saved Successfully");
        } else {
          
          setPopupProps({ title: 'Error', message: result?.payload?.response?.data?.message, primaryText: 'Ok', hideSecondaryButton: true })
          // Toast.error(result?.payload?.response?.data?.message);
        }

        dispatch(closeSpinner());
      })
      .catch((err) => {
        dispatch(closeSpinner());
      });
  };

  useImperativeHandle(ref, () => ({
    onTabChange: (change: () => void) => !dirty ? change() : setPopupProps({ title: 'Caution', message: 'You have unsaved changes. Are you sure you want to change the tab?', onYes: change })
  }))

  const [dirty, setDirty] = useState(false)

  const [popupProps, setPopupProps] = useState<any>()

  return (
    <div ref={ref} className={`${classes.root1} doctor-profile-business-info-tab `}>
      {popupProps && <CustomPopup visible={popupProps ? true : false} dismiss={() => setPopupProps(null)} {...popupProps} />}
      {/* <AutoErrorMessage /> */}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values: IDoctorProfilebusinessInfo, actions) => {
          saveDoctorbusinessProfileInfo(values);
        }}
        validationSchema={Yup.object().shape({
          clinic_name: Yup.string()
            .required("Please enter clinic name")
            .nullable(),
          clinic_email: Yup.string()
            .required("Please enter clinic email")
            .email("Please enter a valid email"),
          clinic_phone_number: Yup.string()
            .matches(Regex.Number, "Please enter a valid Phone Number")
            .required("Please enter clinic phone number")
            .min(7, "Clinic phone number must be atleast 7 digits.")
            .max(12),
          website_address: Yup.string()
            .matches(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please insert a valid webstie address.')
            .required("Please enter website Address"),
          registration_authority: Yup.string().required(
            "Please Add Registration Authority"
          ),
          registration_number: Yup.string()
            .matches(
              Regex.RegNumber,
              "Please enter a valid registration Number"
            )
            .required("Please enter Registration Number"),

          address_line: Yup.string().required("Please enter address Line 1"),
          city: Yup.string().required("Please enter city"),
          state: Yup.string().required("Please select state"),
          country: Yup.string().required("Please select country"),
          postcode: Yup.string()
            .min(4, "Post Code must be of atleast 4 numbers")
            .matches(Regex.post, "Please enter a valid post code.")
            .required("Please enter post code"),
          tax_number: Yup.string().required("Please enter Tax Number"),
          bank_name: Yup.string().required("Please enter bank name"),
          card_no: Yup.string()
            .matches(Regex.account_number, "Please enter a valid account number")
            .required("Please Enter Account Number"),
          sort_code: Yup.string()
            .matches(Regex.Number, "Please enter a valid sort code")
            .required("Please enter sort code"),
          swift_code: Yup.string()
            .matches(Regex.swiftcode, "Please enter a valid swift code")
            .required("Please enter swift code"),
          card_holder_name: Yup.string().required(
            "Please Enter Account Holder Name"
          ),
        })}
      >
        {(props: FormikProps<IDoctorProfilebusinessInfo>) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            dirty
          } = props;
          setDirty(dirty)
          return (
            <Form autoComplete="off">
              <Modal
                open={open}
                close={handleModalClose}
                content={modalContent}
                type={type}
              />
              <Grid container>
                <Grid style={{ marginTop: -25 }} item lg={6} xs={6} className="office-address-grid">
                  <Typography className="office-address-title">
                    Business Information
                  </Typography>
                </Grid>
                <Grid style={{ marginTop: -15 }} item lg={6} xs={6} className="footer-buttons">
                  <CustomButton
                    onClick={() => {
                      setTimeout(() => {
                        if (Object.keys(errors).length > 0) setPopupProps({title: "Required Fields", message: 'There are required fields you need to fill out.',  primaryText: 'Ok', hideSecondaryButton: true  })
                      }, 500)
                      handleSubmit()
                    }}
                    variant="contained"
                    className="register-button"
                  >
                    Save
                  </CustomButton>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                className="business-info-container"
              >
                {businessInfo.map((item) => {
                  return (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <CustomTextField
                            fullWidth
                            className="login-text-field"
                            variant="outlined"
                            fieldName="Clinic Name"
                            name="clinic_name"
                            required
                            id="clinic_name"
                            placeholder="Clinic Name"
                            value={values?.clinic_name}
                            type="text"
                            helperText={
                              errors.clinic_name && touched.clinic_name
                                ? errors.clinic_name
                                : ""
                            }
                            error={
                              errors.clinic_name && touched.clinic_name
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
                            className="login-text-field"
                            variant="outlined"
                            fieldName="Website Address"
                            required
                            name="website_address"
                            id="website_address"
                            placeholder="Website Address"
                            value={values.website_address}
                            type="text"
                            helperText={
                              errors.website_address && touched.website_address
                                ? errors.website_address
                                : ""
                            }
                            error={
                              errors.website_address && touched.website_address
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
                            className="login-text-field"
                            variant="outlined"
                            fieldName="Clinic Email"
                            required
                            name="clinic_email"
                            id="clinic_email"
                            placeholder="Clinic Email  "
                            value={values.clinic_email}
                            type="text"
                            helperText={
                              errors.clinic_email && touched.clinic_email
                                ? errors.clinic_email
                                : ""
                            }
                            error={
                              errors.clinic_email && touched.clinic_email
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
                            className="login-text-field"
                            variant="outlined"
                            fieldName="Clinic Phone Number"

                            name="clinic_phone_number"
                            id="input-with-dropdown"
                            // id={values.clinic_phone_number}
                            placeholder="Clinic Phone number"
                            value={values.clinic_phone_number}
                            required
                            type="text"
                            helperText={
                              errors.clinic_phone_number &&
                                touched.clinic_phone_number
                                ? errors.clinic_phone_number
                                : ""
                            }
                            error={
                              errors.clinic_phone_number &&
                                touched.clinic_phone_number
                                ? true
                                : false
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FormControl className={classes.formControl}>
                                    <Select
                                      id="country_code"
                                      name="country_code"
                                      value={values.country_code || "+1"}
                                      disableUnderline
                                      onChange={handleChange}
                                      error={
                                        errors.country_code &&
                                          touched.country_code
                                          ? true
                                          : false
                                      }
                                    >
                                      {dialCodes.sort((a: any, b: any) => {
                                        return a - b;
                                      }).map((item) => {
                                        return (
                                          <MenuItem value={`+${item}`}>
                                            {`+${item}`}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>
                                  <Typography>|</Typography>
                                </InputAdornment>
                              ),
                            }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item lg={3} />
                        <Grid item lg={3} xs={12}>
                          <CustomTextField
                            fullWidth
                            className="login-text-field"
                            variant="outlined"
                            fieldName="Registration Authority"
                            required
                            name="registration_authority"
                            id="registration_authority"
                            placeholder="Registration Authority"
                            defaultValue={values.registration_authority}
                            type="text"
                            helperText={
                              errors.registration_authority &&
                                touched.registration_authority
                                ? errors.registration_authority
                                : ""
                            }
                            error={
                              errors.registration_authority &&
                                touched.registration_authority
                                ? true
                                : false
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item lg={5} xs={12}>
                          <CustomTextField
                            fullWidth
                            className="login-text-field"
                            variant="outlined"
                            required
                            name="registration_number"
                            id="registration_number"
                            placeholder="Registration Number"
                            value={values.registration_number}
                            type="text"
                            fieldName="Registration Number"
                            helperText={
                              errors.registration_number &&
                                touched.registration_number
                                ? errors.registration_number
                                : ""
                            }
                            error={
                              errors.registration_number &&
                                touched.registration_number
                                ? true
                                : false
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>

                        <Grid item lg={4} xs={12}>
                          <CustomTextField
                            fullWidth
                            className={classes.uploadButton}
                            id="file"
                            variant="outlined"
                            fieldName="File Upload"
                            name="fileUpload"
                            placeholder="Upload File"
                            value={
                              values?.fileUpload?.name || values.fileUpload
                            }
                            InputProps={{
                              endAdornment: (
                                <>
                                  <label htmlFor="filesss">
                                    <CustomButton
                                      component="span"
                                      className="upload-button"
                                    >
                                      upload
                                      <input
                                        id="filesss"
                                        type="file"
                                        hidden
                                        name="fileUpload"
                                        accept="image/*,.pdf"
                                        className={classes.input}
                                        multiple
                                        onChange={async (event) => {
                                          if (
                                            event.target.files &&
                                            event.target.files[0] &&
                                            (event.target.files[0]?.type.split(
                                              "/"
                                            )[0] == "image" ||
                                              event.target.files[0]?.type ==
                                              "application/pdf")
                                          ) {
                                            setFieldValue(
                                              "fileUpload" /* [
                                              ...values.fileUpload, */,
                                              event.target.files[0]
                                            );
                                          } else {
                                            setPopupProps({ title: 'Error', message: "Please upload a valid  file/image", primaryText: 'Ok', hideSecondaryButton: true })
                                            // Toast.error(
                                            //   "Please upload a valid  file/image"
                                            // );
                                          }
                                        }}
                                      />
                                    </CustomButton>
                                  </label>
                                </>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          className="no_progress_bar"
                          style={{
                            // overflowX: "scroll",
                            overflowY: "hidden",
                            width: "100%",
                            display: "felx",
                          }}
                        >
                          {values.fileUpload !== null &&
                            values.fileUpload !== "" && (
                              <span
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                {values?.fileUpload["type"] !==
                                  "application/pdf" ||
                                  values?.fileUpload["type"] == undefined ? (
                                  <>
                                    {values?.fileUpload.slice(-3) !== "pdf" ? (
                                      <a
                                        target="_blank"
                                        href={
                                          typeof values?.fileUpload == "string"
                                            ? values?.fileUpload
                                            : values?.fileUpload !== null
                                              ? URL.createObjectURL(
                                                values?.fileUpload
                                              )
                                              : ""
                                        }
                                      >
                                        <img
                                          style={{
                                            wordBreak: "break-all",
                                            padding: "10px",
                                            maxWidth: "270px",
                                            width: "270px",
                                            height: "170px",
                                            borderRadius : 5,
                                            border : '1px solid rgb(221, 221, 221)',
                                            objectFit : 'cover'
                                          }}
                                          src={
                                            typeof values?.fileUpload ==
                                              "string"
                                              ? values?.fileUpload
                                              : values?.fileUpload !== null
                                                ? URL.createObjectURL(
                                                  values.fileUpload
                                                )
                                                : ""
                                          }
                                          height="150px"
                                          alt={
                                            typeof values?.fileUpload ==
                                              "string"
                                              ? values?.fileUpload
                                              : values?.fileUpload !== null
                                                ? URL.createObjectURL(
                                                  values.fileUpload
                                                )
                                                : ""
                                          }
                                        />
                                      </a>
                                    ) : (
                                      <a
                                        target="_blank"
                                        href={values?.fileUpload}
                                      >
                                        <img
                                          style={{
                                            wordBreak: "break-all",
                                            padding: "10px",
                                            maxWidth: "270px",
                                            width: "270px",
                                            height: "170px",
                                            borderRadius : 5,
                                            border : '1px solid rgb(221, 221, 221)',
                                            objectFit : 'cover'
                                          }}
                                          src={
                                            require("../../../../../utils/images/logoPDF.png")
                                              .default
                                          }
                                          height="150px"
                                          alt={values?.fileUpload}
                                        />
                                      </a>
                                    )}
                                  </>
                                ) : (
                                  <a
                                    target="_blank"
                                    href={URL.createObjectURL(
                                      values?.fileUpload
                                    )}
                                  >
                                    <img
                                      style={{
                                        wordBreak: "break-all",
                                        padding: "10px",
                                        maxWidth: "270px",
                                        width: "270px",
                                        height: "170px",
                                        borderRadius : 5,
                                        border : '1px solid rgb(221, 221, 221)',
                                        objectFit : 'cover'
                                      }}
                                      src={
                                        require("../../../../../utils/images/logoPDF.png")
                                          .default
                                      }
                                      height="150px"
                                      alt={URL.createObjectURL(
                                        values?.fileUpload
                                      )}
                                    />
                                  </a>
                                )}
                                <Tooltip
                                  title="Remove Image"
                                  className="remove_icon pointer"
                                >
                                  <RemoveCircleIcon
                                    onClick={() => {
                                      handleModalClose();
                                      setType("business document");
                                      setModalContent({
                                        ...item,
                                        setField: () =>
                                          setFieldValue(`fileUpload`, ""),
                                      });
                                    }}
                                  />
                                </Tooltip>
                              </span>
                            )}
                          {/* );
                            })} */}
                          {/* ) : (
                                      <img src={item.document} alt="" />
                                    )} */}
                        </Grid>
                      </Grid>
                    </>
                  );
                })}

                <span
                  style={{
                    marginTop: "30px",
                    marginBottom: "30px",
                    width: "100%",
                  }}
                >
                  <Grid item lg={12} xs={12} className="office-address-grid">
                    <Typography className="office-address-title">
                      Clinic Address
                    </Typography>
                  </Grid>
                  {clinicInfo.map((item) => {
                    return (
                      <>
                        <Grid
                          container
                          direction="row"
                          className="business-info-container"
                          spacing={2}
                        >
                          <Grid
                            item
                            lg={6}
                            xs={12}
                            className={classes.textField}
                          >
                            <CustomTextField
                              fullWidth
                              className="login-text-field"
                              variant="outlined"
                              name="address_line"
                              required
                              id="address_line"
                              placeholder="Address Line 1"
                              fieldName="Address Line 1"
                              value={values.address_line}
                              type="text"
                              helperText={
                                errors.address_line && touched.address_line
                                  ? errors.address_line
                                  : ""
                              }
                              error={
                                errors.address_line && touched.address_line
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                          <Grid
                            item
                            lg={6}
                            xs={12}
                            className={classes.textField}
                          >
                            <CustomTextField
                              fullWidth
                              className="login-text-field"
                              variant="outlined"
                              name="address_line_1"
                              id="address_line_1"
                              fieldName="Address Line 2"
                              placeholder="Address Line 2"
                              value={
                                values.address_line_1 === "null"
                                  ? ""
                                  : values.address_line_1
                              }
                              type="text"
                              helperText={
                                errors.address_line_1 && touched.address_line_1
                                  ? errors.address_line_1
                                  : ""
                              }
                              error={
                                errors.address_line_1 && touched.address_line_1
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                          <Grid
                            item
                            lg={3}
                            xs={12}
                            className={classes.textField}
                          >
                            <FormControl fullWidth variant="outlined">
                              <label htmlFor={`country`}>
                                Country <span style={{ color: "red" }}>*</span>
                              </label>
                              <Select
                                labelId="demo-mutiple-checkbox-label"
                                id="country"
                                name="country"
                                className={` ${classes.selectEmpty} ${errors.country && classes.border_fix
                                  } no-scrooll input-label no-scrooll`}
                                onChange={async (e: any) => {
                                  return (
                                    handleChange(e),
                                    setFieldValue("state", ""),
                                    setFieldValue("city", "")
                                  );
                                }}
                                error={
                                  errors.country && touched.country
                                    ? true
                                    : false
                                }
                                value={values.country}
                              >
                                {Country.getAllCountries().map((item) => (
                                  <MenuItem
                                    key={item["countryCode"]}
                                    value={item.name}
                                  >
                                    <ListItemText primary={item.name} />
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                <span style={{ color: "red" }}>
                                  {errors.country && touched.country
                                    ? errors.country
                                    : ""}
                                </span>
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            lg={3}
                            xs={12}
                            className={classes.textField}
                          >
                            <FormControl fullWidth variant="outlined">
                              <label htmlFor={`state`}>
                                State <span style={{ color: "red" }}>*</span>
                              </label>
                              <Select
                                labelId="demo-mutiple-checkbox-label"
                                name="state"
                                id="state"
                                className={` ${classes.selectEmpty} ${errors.state && classes.border_fix
                                  } no-scrooll input-label `}
                                onChange={(e) => handleChange(e)}
                                value={values.state}
                                error={
                                  errors.state && touched.state ? true : false
                                }
                              >
                                {State.getStatesOfCountry(
                                  Country.getAllCountries().filter((items) => {
                                    return items.name == values?.country;
                                  })[0]?.isoCode
                                )?.map((item) => {
                                  return (
                                    <MenuItem key={item.name} value={item.name}>
                                      <ListItemText primary={item.name} />
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                              <FormHelperText>
                                <span style={{ color: "red" }}>
                                  {" "}
                                  {errors.state && touched.state
                                    ? errors.state
                                    : ""}
                                </span>
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            lg={3}
                            xs={12}
                            className={classes.textField}
                          >
                            <label htmlFor={"city"}>
                              City
                              <span style={{ color: "red" }}>*</span>
                            </label>

                            <Select
                              labelId="demo-mutiple-checkbox-label"
                              id="city"
                              name="city"
                              variant="outlined"
                              className={` ${classes.selectEmpty} ${errors.city && classes.border_fix
                                } no-scrooll input-label `}
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              value={values.city}
                            >
                              {City.getCitiesOfState(
                                Country.getAllCountries().filter((item_1) => {
                                  return item_1.name === values.country;
                                })[0]?.isoCode,
                                State.getAllStates().filter((items) => {
                                  return items.name == values.state;
                                })[0]?.isoCode
                              ).map((item) => {
                                return (
                                  <MenuItem key={item.name} value={item.name}>
                                    <ListItemText primary={item.name} />
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            {errors && errors.city && touched && touched.city && (
                              <span style={{ color: "red" }}>
                                <div className="field-error">{errors.city}</div>
                              </span>
                            )}
                          </Grid>

                          <Grid
                            item
                            lg={3}
                            xs={12}
                            className={classes.textField}
                          >
                            <CustomTextField
                              fullWidth
                              className="login-text-field"
                              variant="outlined"
                              name="postcode"
                              id="postcode"
                              required
                              fieldName="Zip code /Post code"
                              placeholder="Zip code /Post code"
                              value={values.postcode}
                              type="text"
                              helperText={
                                errors.postcode && touched.postcode
                                  ? errors.postcode
                                  : ""
                              }
                              error={
                                errors.postcode && touched.postcode
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                        </Grid>
                      </>
                    );
                  })}
                </span>

                <span
                  style={{ border: "1px solid #ddbcbc", paddingLeft: "20px" }}
                >
                  <Grid item xs={12}>
                    <Typography className="office-address-title">
                      Payment Information
                    </Typography>
                  </Grid>
                  {/* <Paper className="work-experince-paper"> */}
                  {paymentsInfo.map((item) => {
                    return (
                      <>
                        <Grid
                          container
                          direction="row"
                          className="business-info-container"
                          spacing={2}
                        >
                          <Grid
                            item
                            lg={3}
                            xs={12}
                            className={classes.textField}
                          >
                            <CustomTextField
                              fullWidth
                              required
                              className="login-text-field"
                              variant="outlined"
                              name="tax_number"
                              id="tax_number"
                              placeholder="TAX Number"
                              fieldName="Tax Number"
                              value={values.tax_number}
                              type="text"
                              helperText={
                                errors.tax_number && touched.tax_number
                                  ? errors.tax_number
                                  : ""
                              }
                              error={
                                errors.tax_number && touched.tax_number
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                          <Grid xs={6}></Grid>
                          <Grid
                            item
                            lg={6}
                            xs={12}
                            className={classes.textField}
                          >
                            <CustomTextField
                              fullWidth
                              className="login-text-field"
                              variant="outlined"
                              name="card_no"
                              id="Bank_Account_Number"
                              placeholder="Bank Account Number or IBAN"
                              fieldName="Bank Account Number"
                              required
                              value={values.card_no}
                              type="text"
                              helperText={
                                errors.card_no && touched.card_no
                                  ? errors.card_no
                                  : ""
                              }
                              error={
                                errors.card_no && touched.card_no ? true : false
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                          <Grid
                            item
                            lg={3}
                            xs={12}
                            className={classes.textField}
                          >
                            <CustomTextField
                              fullWidth
                              className="login-text-field"
                              variant="outlined"
                              name="card_holder_name"
                              id="Account Holder Name"
                              placeholder="Account Holder Name"
                              fieldName="Account Holder Name"
                              required
                              value={values.card_holder_name}
                              type="text"
                              helperText={
                                errors.card_holder_name &&
                                  touched.card_holder_name
                                  ? errors.card_holder_name
                                  : ""
                              }
                              error={
                                errors.card_holder_name &&
                                  touched.card_holder_name
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                          <Grid
                            item
                            lg={3}
                            xs={12}
                            className={classes.textField}
                          >
                            <CustomTextField
                              fullWidth
                              className="login-text-field"
                              variant="outlined"
                              name="bank_name"
                              id="bank_name"
                              placeholder="Bank Name"
                              fieldName="Bank Name"
                              required
                              value={values.bank_name}
                              type="text"
                              helperText={
                                errors.bank_name && touched.bank_name
                                  ? errors.bank_name
                                  : ""
                              }
                              error={
                                errors.bank_name && touched.bank_name
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                          <Grid
                            item
                            lg={3}
                            xs={12}
                            className={classes.textField}
                          >
                            <CustomTextField
                              fullWidth
                              className="login-text-field"
                              variant="outlined"
                              name="sort_code"
                              id="sort_code"
                              fieldName="Sort Code or Routing Number"
                              placeholder="Sort Code or Routing Number"
                              value={values.sort_code}
                              type="number"
                              helperText={
                                errors.sort_code && touched.sort_code
                                  ? errors.sort_code
                                  : ""
                              }
                              error={
                                errors.sort_code && touched.sort_code
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                          <Grid
                            item
                            lg={3}
                            xs={12}
                            className={classes.textField}
                          >
                            <CustomTextField
                              fullWidth
                              className="login-text-field"
                              variant="outlined"
                              name="swift_code"
                              id="swift_code"
                              fieldName="Swift Code"

                              placeholder="swift Code"
                              value={values.swift_code}
                              type="text"
                              helperText={
                                errors.swift_code && touched.swift_code
                                  ? errors.swift_code
                                  : ""
                              }
                              error={
                                errors.swift_code && touched.swift_code
                                  ? true
                                  : false
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Grid>
                          <Grid item xs={12} className="checkbox-grid-item">
                            <Checkbox
                              checked={
                                values.is_primary_acc == 0 ? false : true
                              }
                              name="is_primary_acc"
                              onChange={(e) => {
                                setFieldValue(
                                  e.target.name,
                                  e.target.checked == true ? 1 : 0
                                );
                              }}
                              inputProps={{ "aria-label": "" }}
                            />
                            <Typography>
                              check if this your primary account
                            </Typography>
                          </Grid>
                          {/* <Grid item xs={12} className="checkbox-grid-item ">
                            <div
                              style={{ marginRight: "0", marginLeft: "auto" }}
                            >
                              <CustomButton className="save-account-details-button px-4">
                                save account details
                              </CustomButton>
                            </div>
                          </Grid> */}
                        </Grid>
                      </>
                    );
                  })}
                </span>

                {/* </Paper> */}
                {/* <Grid container> */}
                <Grid item xs={12}>
                  <Box style={{ display: 'flex', alignItems: 'center', }} className={classes.buttonBox}>
                    <div style={{ width: 'auto', marginLeft: 'auto', marginRight: 30, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }} className={'work-inner-box'} >
                      <p >Fields with "<p style={{ color: 'red', display: 'inline' }} > * </p>" are compulsory for profile verification</p>
                    </div>
                    <CustomButton
                      onClick={() => {
                        setTimeout(() => {
                          if (Object.keys(errors).length > 0) setPopupProps({ message: 'There are required fields you need to fill out.', title: "Required Fields", hideSecondaryButton: true, primaryTest: 'Ok' })
                        }, 500)
                        handleSubmit()
                      }}
                      variant="contained"
                      className="register-button"
                    >
                      Save
                    </CustomButton>
                    {/* <CustomButton
                    variant="contained"
                    className="register-button"
                  >
                    Get Verified
                  </CustomButton> */}
                  </Box>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default React.forwardRef(BusinessInfo);
