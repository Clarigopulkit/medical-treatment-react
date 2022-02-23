import React, { useState, useEffect, ForwardRefRenderFunction, useImperativeHandle  } from "react";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import {
  Grid,
  MenuItem,
  FormControl,
  Select,
  InputAdornment,
  Typography,
  FormHelperText,
  ListItemText,
  Checkbox,
  Box,
  FormControlLabel,
  Button,
} from "@material-ui/core";

import CheckBoxIcon from "@material-ui/icons/CheckBox";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { Formik, FormikProps, FieldArray, Field, FormikConfig } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./clinicPersonalInfo.scss";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import CustomButton from "../../../reusable/customButton/customButton";
import CustomTextField from "../../../reusable/customTextField/customTextField";

import userSlice from "../../../users/userSlice";
import { selectLogin } from "../../../login/loginSlice";
import { objectToFormData } from "../../../../utils/apiHelpers";
import {
  fetchChangeProfilePictureAsync,
  fetchSaveClinicPersonalInfoAsync,
  selectClinicPersonalProfile,
} from "./clinicPersonalInfoSlice";
import {
  closeSpinner,
  loadSpinner,
} from "../../../../reducres/reducers/spinner";
import { Regex } from "../../../../utils/validations";
import { dialCodes } from "../../../../utils/dialCodes/dialCodes";
import ChangePassword from "../../../changePassword/changePassword";
import { fetchProfileAsync } from "../../../profile/profileSlice";
import Toast from "../../../../reducres/reducers/toast";
import { type } from "os";
import { City, Country, State } from "country-state-city";
import CustomPopup from "../../../reusable/customPopup/customPopup";

const useStyles = makeStyles((theme: Theme) => ({
  root1: {
    display: "block",
    margin: "0 auto",
  },
  fab: {
    margin: theme.spacing(0),
    maxHeight: "fit-content",
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
  linkCheckbox: {
    alignItems: "center",
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
  input: {
    display: "none",
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
  formControlSelect: {
    margin: theme.spacing(1),
    minWidth: 200,
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
      flexWrap: "noWrap",
    },
  },

  changeOptions: {
    "& > div > span": {
      height: "34px !important",
      marginRight: "-11px !important",
    },
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
  paymentInfo: {
    padding: "0px 0px !important",
    "& > div": {
      padding: "15px 15px !important",
    },
  },
  BottomButtons: {
    marginRight: "30px",

    [theme.breakpoints.down("sm")]: {
      marginRight: "0px",

      width: "100%",
    },
  },
  NewSelect: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: "initial !important",
    },
  },

  fixspace: {},

  fixBorder_status: {
    borderRadius: "50px !important",
    maxHeight: "40px !important",
  },
  formControl: {
    "& > *": {
      fontWeight: 700,
      color: "#085044",
    },
  },
}));


const ClinicPersonalInfo:  ForwardRefRenderFunction<FormikConfig<any>, any> = (props, ref : any) => {
  let businessRegistrationInfoData: {
    business_registration_name: any;
    tax_number: any;
    registration_authority: string;
    year: string;
  }[] = [
      {
        business_registration_name: "",
        tax_number: "",
        registration_authority: "",
        year: "",
      },
    ];

  let clinicAddressInfoData: {
    address_line_1: string;
    address_line_2: string;
    country: string;
    state: string;
    city: string;
    post_code: string;
  }[] = [
      {
        address_line_1: "",
        address_line_2: "",
        country: "",
        state: "",
        city: "",
        post_code: "",
      },
    ];
  interface IPaymentsData {
    card_no: string;
    card_holder_name: string;
    bank_name: string;
    sort_code: string;
    swift_code: string;
    is_primary_acc: Boolean;
    account_holder_name: any;
    account_number: any;
  }
  let paymentsInfoData: IPaymentsData = {
    card_no: "",
    account_holder_name: "",
    account_number: "",
    card_holder_name: "",
    bank_name: "",
    sort_code: "",
    swift_code: "",
    is_primary_acc: false,
  };

  let clinicPersonalInfo_interface = {
    first_name: "",
    salutation: "",
    email: "",
    account_holder_name: "",
    linkedin_porfile: "",
  };
  let initialResponse = {
    clinic_name: props?.name,
    email: props?.email,
    phone: props?.phone,
    country_code: props?.country_code,
    website_address: "",
    active_since: props?.user_details?.active_since,
    week_off: "",
    active_licence_no: props?.user_details?.active_licence_no,
    edit_clinic_id: "27",
    linkedin_profile: props?.user_details?.linkedin_profile,
    clinicAddressInfoData: props?.user_addresses,
    businessRegistrationInfoData: props?.business_info,
  };

  const [initialValues, setInitialValues] = useState({
    profile: props?.file_url,
    unique_code: props?.unique_code,
    clinic_person_email:
      props?.contact_person_detail &&
      props?.contact_person_detail[0] &&
      props?.contact_person_detail[0]?.clinic_person_email,
      mobile:
      props?.contact_person_detail &&
      props?.contact_person_detail[0] &&
      props?.contact_person_detail[0]?.mobile||"",
      mobile_code:
      props?.contact_person_detail &&
      props?.contact_person_detail[0] &&
      props?.contact_person_detail[0]?.mobile_code,
    Clinkedin_profile:
      props?.contact_person_detail &&
      props?.contact_person_detail[0] &&
      props?.contact_person_detail[0]?.linkedin_profile,
    is_active: props?.is_active,
    salutation: props?.contact_person_detail &&
      props?.contact_person_detail[0] &&
      props?.contact_person_detail[0]?.salutation,
    user_id:
      props?.user_registration &&
      props?.user_registration[0] &&
      props?.user_registration[0].user_id,

    clinic_name: props?.name || "",
    email: props?.email || "",
    phone: props?.phone || "",
    website_address: props?.website_address || "",
    first_name:
      props?.contact_person_detail &&
      props?.contact_person_detail[0]?.first_name,
    country_code: (props?.country_code || ""),
    clinicPictures:
      props &&
        props?.doctor_hospital_clinic &&
        props?.doctor_hospital_clinic.length > 0
        ? props?.doctor_hospital_clinic
        : [],
    active_since: props?.user_details?.active_since || "",
    week_off: "",
    active_licence_no: props?.user_details?.active_licence_no || "",
    edit_clinic_id: "27",
    linkedin_profile: props?.user_details?.linkedin_profile,
    clinicAddressInfoData:
      (props &&
        props?.user_addresses?.map((item) => {
          return {
            ...item,
            address_line_1: item.address_line1,
          };
        })) ||
      clinicAddressInfoData,
    businessRegistrationInfoData:
      props &&
        props.user_registration &&
        props?.user_registration != undefined &&
        props?.user_registration.length > 0
        ? props?.user_registration.map((item) => {
          return {
            ...item,
            business_registration_name: item.registration_authority,
          };
        })
        : businessRegistrationInfoData,
    paymentsInfoData: (props && [
      {
        ...props?.business_info,
        account_holder_name: props?.business_info?.card_holder_name,
        account_number: props?.business_info?.card_no,
      },
    ]) || [paymentsInfoData],
  });

  useEffect(() => {
    setInitialValues({
      profile: props?.file_url,
      unique_code: props?.unique_code,
      clinic_person_email:
        props?.contact_person_detail &&
        props?.contact_person_detail[0] &&
        props?.contact_person_detail[0]?.clinic_person_email,
      mobile:
        props?.contact_person_detail &&
        props?.contact_person_detail[0] &&
        props?.contact_person_detail[0]?.mobile,

        mobile_code:
        props?.contact_person_detail &&
        props?.contact_person_detail[0] &&
        props?.contact_person_detail[0]?.country_code,

      Clinkedin_profile:
        props?.contact_person_detail &&
        props?.contact_person_detail[0] &&
        props?.contact_person_detail[0]?.linkedin_profile,
      is_active: props?.is_active,
      salutation: props?.contact_person_detail?.[0]?.salutation || 0,
      user_id:
        props?.user_registration &&
        props?.user_registration[0] &&
        props?.user_registration[0].user_id,

      clinic_name: props?.name || "",
      email: props?.email || "",
      phone: props?.phone || "",
      website_address: props?.website_address || "",
      first_name:
        props?.contact_person_detail &&
        props?.contact_person_detail[0]?.first_name,
      country_code: props?.country_code || "",
      clinicPictures:
        props &&
          props?.doctor_hospital_clinic &&
          props?.doctor_hospital_clinic.length > 0
          ? props?.doctor_hospital_clinic
          : [],
      active_since: props?.user_details?.active_since || "",
      week_off: "",
      active_licence_no: props?.user_details?.active_licence_no || "",
      edit_clinic_id: "27",
      linkedin_profile: props?.user_details?.linkedin_profile,
      clinicAddressInfoData:
        (props && props?.user_addresses?.length > 0 &&
          props?.user_addresses?.map((item) => {
            return {
              ...item,
              address_line_1: item.address_line1,
            };
          })) ||
        clinicAddressInfoData,
      businessRegistrationInfoData:
        props &&
          props.user_registration &&
          props?.user_registration != undefined &&
          props?.user_registration.length > 0
          ? props?.user_registration.map((item) => {
            return {
              ...item,
              business_registration_name: item.registration_authority,
            };
          })
          : businessRegistrationInfoData,
      paymentsInfoData: (props && [
        {
          ...props?.business_info,
          account_holder_name: props?.business_info?.card_holder_name,
          account_number: props?.business_info?.card_no,
        },
      ]) || [paymentsInfoData],
    });
  }, [props, props?.user_details]);

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectLogin);
  const { changePicture }: any = useAppSelector(selectClinicPersonalProfile);
  const [age, setAge] = React.useState("");
  const [selectedFile, setSelectedFile] = useState<any>("");
  const [preview, setPreview] = useState();
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [checked, setChecked] = React.useState(true);
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  const [State_DP, setState_city] = useState("");
  const [dirty, setDirty] = useState(false)

  // useImperativeHandle(ref, () => ({
  //   onTabChange: (change: () => void) => !dirty ? change() : setPopupProps({ title: 'Caution', message: 'You have unsaved changes. Are you sure you want to change the tab?', onYes: change })
  // }))

  // For select drop down for year

  function yearfunction() {
    const year = (new Date()).getFullYear();
    const yearsList = Array.from(new Array(30), (val, index) => year - index);
    return yearsList;
  }

  // const [open, setOpen] = React.useState(true);
  // useEffect(() => {
  //   let auth_token = sessionStorage.getItem("token");
  //   axios({
  //     method: "GET",

  //     headers: {
  //       Accept: "application/json",
  //       Authorization: `Bearer ${auth_token}`,
  //     },
  //   }).then((response) => setCountries(response.data));
  // }, []);
  const [years, setYears] = useState(yearfunction());
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleDropDownChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setAge(event.target.value as string);
  };
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl: any = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);


  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    dispatch(loadSpinner());
    dispatch(fetchChangeProfilePictureAsync(formData)).then((result) => {
      if (result?.payload?.file_url !== undefined) {
        dispatch(fetchProfileAsync());
        Toast.success("Successfully changed Profile Picture");
      }
      if (result?.payload?.response?.data?.statusCode == 400) {
        Toast.error(result?.payload?.response?.data?.message);
      }
      dispatch(closeSpinner());
    });
  };

  const saveDoctorPersonalProfileInfo = async (data: any) => {
    let formData = new FormData();
    data.week_off = JSON.stringify({});
    formData.append("website_address", data.website_address);
    formData.append("clinic_name", data.clinic_name);
    formData.append("country_code", data.country_code);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("active_since", data.active_since);
    formData.append("week_off", data.week_off);
    formData.append("linkedin_profile", data.linkedin_profile);
    formData.append("active_licence_no", data.active_since);
    formData.append("edit_clinic_id", data.edit_clinic_id);
    formData.append("first_name", data.first_name);
    formData.append("salutation", data.salutation);

    let clinicdetails = {
      salutation: data.salutation,
      first_name: data.first_name,
      clinic_person_email: data.clinic_person_email,
      mobile: data.mobile,
      mobile_code: data.mobile_code,
      linkedin_profile: data.Clinkedin_profile,
    };
    formData = objectToFormData(
      clinicdetails,
      "contact_person_details",
      formData
    );

    formData = objectToFormData(
      [...data.clinicAddressInfoData],
      "clinic_address",
      formData
    );

    formData = objectToFormData(
      [...data.businessRegistrationInfoData],
      "buisness_registration_info",
      formData
    );

    formData = objectToFormData(data.paymentsInfoData[0], "payment", formData);

    let Images = data.clinicPictures.filter((item) => {
      if (!item.file_url) {
        return item;
      }
    });

    formData = objectToFormData([...Images], "clinicPictures", formData);

    console.log(formData);

    dispatch(fetchSaveClinicPersonalInfoAsync(formData)).then(() => {
      dispatch(fetchProfileAsync());
      dispatch(closeSpinner());
    });
  };
  const [popupProps, setPopupProps] = useState<any>();
  const [open, setOpen] = React.useState(false);

  const handleModalClose = () => {
    setOpen(!open);
  };

  useImperativeHandle(ref, () => ({
    onTabChange: (change: () => void) => !dirty ? change() : setPopupProps({message: 'You have unsaved changes. Are you sure you want to change the tab?',title: 'Caution',  onYes: change })
  }))

  return (
    <div ref={ref} className={`${classes.root1} doctor-profile-personal-info-tab `}>
      {/* <AutoErrorMessage /> */}
      {popupProps && <CustomPopup visible={popupProps ? true : false} dismiss={() => setPopupProps(null)} {...popupProps} />}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          clinic_name: Yup.string()
            // .matches(Regex.NAME, "Please enter a valid clinic name")
            .required("Please enter a valid clinic name")
            .nullable(),
          email: Yup.string()
            .email("Please enter email")
            .required("Please enter a valid email"),
          phone: Yup.string()
            .matches(Regex.Number, "Please enter a valid phone number")
            .required("Please enter a Phone Number"),
          country_code: Yup.string().required("Please select country code."),
          // website_address: Yup.string().required("Please enter website"),
          first_name: Yup.string().matches(
            Regex.SPECIAL_CHARACTERS,
            "Please enter a valid name."
          ),
          mobile: Yup.string()
            .matches(Regex.Number, "Please enter a valid phone number")
            .required("Please enter a Phone Number"),
          // account_holder_name: Yup.string().matches(
          //   Regex.SPECIAL_CHARACTERS,
          //   "Please enter account holder name."
          // ),
          clinic_person_email: Yup.string().email("Please enter valid email."),
          active_since: Yup.string()
            .matches(Regex.Number, "Please enter valid year.")
            .required("Please enter active since"),
          linkedin_profile: Yup.string()
            .url(),
          // .required("Please enter valid link"),
          clinicAddressInfoData: Yup.array().of(
            Yup.object().shape({
              address_line_2: Yup.string(),
              country: Yup.string().required("Please select country."),
              state: Yup.string().required("Please select state."),
              city: Yup.string().required("Please enter City."),
              post_code: Yup.string()
                 .min(4, "Post Code must be atlease 4 digits.")
                // .matches(Regex.Number, "Please enter a valid post code")
                .required("Please enter Zip"),
              address_line_1: Yup.string().required("Please enter Address"),
            })
          ),
          businessRegistrationInfoData: Yup.array().of(
            Yup.object().shape({
              registration_number: Yup.string()
                .matches(
                  Regex.Registeration_number,
                  "Please enter a valid registeration number"
                )
                .required("Please enter registeration number"),
              business_registration_name: Yup.string()
                .matches(
                  Regex.NAME,
                  "Please enter a valid registeration authority name"
                )
                .required("Please enter registeration authority name"),
              year: Yup.string()
                .matches(Regex.Year, "Please enter a valid year")
                .required("Please enter a valid year"),
            })
          ),
          paymentsInfoData: Yup.array().of(
            Yup.object().shape({
              bank_name: Yup.string()
                .required("Please enter bank name")
                .nullable(),
              sort_code: Yup.string()
                .required("Please enter sort code")
                .nullable(),
              swift_code: Yup.string()
                .required("Please enter swift code")
                .nullable(),
              account_holder_name: Yup.string()
                .required("Please enter Account Holder Name")
                .nullable(),
              account_number: Yup.string()
                .matches(Regex.account_number, "Please enter a valid Account Number")
                .required("Please enter account number")
                .nullable(),
            })
          ),
        })}
        onSubmit={(values: any, actions) => {
          dispatch(loadSpinner());
          saveDoctorPersonalProfileInfo(values);
          window.scrollTo(0, 0)
        }}

      
      >
        {(props: FormikProps<any>) => {
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
          // console.log(initialValues)
          return (

            <>
              <div style={{ boxSizing: "border-box" }} className="px-4 py-4">
                <Grid container spacing={4}>
                  <Grid item xs={12} lg={4}>
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      className={classes.changeSelect}
                    >
                      <img src={values?.profile} style={{ objectFit: 'contain', borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 5 }} height="170px" width="200px" />
                      <span>
                        <Typography variant="subtitle1">
                          <div className="typo-1" style={{ "marginTop": 40 }}>
                            SP ID:{" "}
                            <span className="bold-green-content">
                              {values.unique_code}

                            </span>
                          </div>
                        </Typography>
                        <div style={{ paddingTop: "10px", }}>
                          <label htmlFor="contained-button-file">
                            <div style={{ marginTop: "7px" }}>
                              <CustomButton
                                component="span"
                                className="doctor-profile-change-button"
                              >
                                Upload Picture
                                <input
                                  hidden
                                  id="contained-button-file"
                                  type="file"
                                  accept="image/*"
                                  onChange={onSelectFile}
                                />
                              </CustomButton>
                              <div style={{color:'#085044',marginTop: "-13px",fontWeight:'bold',textAlign:'center'}}>(max 2mb)</div>
                            </div>
                          </label>
                        </div>
                      </span>
                    </Box>

                  </Grid>
                  <Grid item xs={12} lg={5}></Grid>
                  <Grid item xs={12} lg={3} >
                    <div style={{ "margin": 8, textAlign: "right" }}>
                      <div style={{ paddingTop: "20px", marginBottom:13 }}>
                        <Select
                          fullWidth
                          disabled
                          variant="outlined"
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={values.is_active||0}
                          onChange={handleDropDownChange}
                          className={`status-drop-down ${classes.fixBorder_status}`}
                          label="Active"
                          style={{
                            color: "#085044 !important",
                            fontWeight: 600,
                            maxWidth: 200, 
                            marginLeft: 15,
                            textAlign: "center"
                          }}
                        >
                          {values.is_active === 2 && (
                            <MenuItem value={2}>Active</MenuItem>
                          )}
                          {(values.is_active === 0 ||
                            values.is_active === 1) && (
                              <MenuItem value={0}>Pending</MenuItem>
                            )}
                          <MenuItem value={3}>Deactivate</MenuItem>
                          <MenuItem value={4}>Delete</MenuItem>
                          {/* <MenuItem value={30}>Thirty</MenuItem> */}
                        </Select>
                      </div>
                      <CustomButton
                        type="submit"
                        onClick={() => {
                          dispatch(loadSpinner());
                          saveDoctorPersonalProfileInfo(values);
                          window.scrollTo(0, 0)
                        }}
                        // onClick={() => {
                        //   setTimeout(() => {
                        //     if (Object.keys(errors).length > 0) setPopupProps({ message: 'There are required fields you need to fill out.', title: "Required Fields", hideSecondaryButton: true, primaryTest: 'Ok' })
                        //   }, 500)
                        //   handleSubmit()
                        // }}
                        style={{
                          width: 200, marginLeft: 15,marginTop:12
                        }}
                        className="green-button"
                        fullWidth
                      >Save
                      </CustomButton>
                    </div>
                  </Grid>


                  <Grid item xs={12}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} lg={6}>
                        <CustomTextField
                          required
                          name="clinic_name"
                          variant="outlined"
                          className="login-text-field"
                          placeholder={"Clinic Name"}
                          value={values.clinic_name}
                          fullWidth
                          fieldName="Clinic Name"
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
                          onChange={(e) => handleChange(e)}
                          onBlur={handleBlur}
                        />
                      </Grid>
                      <Grid lg={5} />

                      <Grid item xs={12} lg={3}>
                        <CustomTextField
                          name="website_address"
                          fullWidth
                          fieldName="Website"
                          // required
                          variant="outlined"
                          className="login-text-field"
                          value={values.website_address}
                          placeholder="Website"
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
                          onChange={(e) => handleChange(e)}
                          onBlur={handleBlur}
                        />
                      </Grid>
                      <Grid item xs={12} lg={3}>
                        <CustomTextField
                          name="clinic_email"
                          required
                          disabled
                          fullWidth
                          fieldName="Email Id"
                          variant="outlined"
                          className="login-text-field"
                          placeholder="Email"
                          type=""
                          value={values.email}
                          onChange={(e) => handleChange(e)}
                          onBlur={handleBlur}
                          helperText={
                            errors.email && touched.email ? errors.email : ""
                          }
                          error={
                            errors.clinic_email && touched.clinic_email
                              ? true
                              : false
                          }
                        />
                      </Grid>
                      <Grid item xs={12} lg={3}>
                        <CustomTextField
                          name="phone"
                          id="input-with-dropdown"
                          // id={values.clinic_phone_number}
                          value={values.phone}
                          fullWidth
                          required
                          fieldName="Phone Number"
                          variant="outlined"
                          className="login-text-field"
                          placeholder=""
                          type=""
                          onChange={handleChange}
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
                                    {dialCodes.sort(
                                      (a: any, b: any) => {
                                        return a - b;
                                      }
                                    ).map((item) => {
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
                          helperText={
                            (errors.phone || errors.country_code) &&
                              (touched.phone || touched.country_code)
                              ? errors.phone || errors.country_code
                              : ""
                          }
                          error={
                            (errors.phone || errors.country_code) &&
                              (touched.phone || touched.country_code)
                              ? true
                              : false
                          }
                        />
                      </Grid>
                      <Grid item lg={2} xs={12}>
                        <Box
                          display="flex"
                          flexDirection='column'
                          alignItems="flex-start"
                        >
                          <label style={{ fontWeight: 'bold', color: "#085044" }} htmlFor="Active" >  Active Since
                            <span style={{ color: "red" }}>*</span>
                          </label>

                          <Select
                            labelId="demo-mutiple-checkbox-label"
                            id="Active_Since"
                            name="active_since"
                            variant="outlined"
                            style={{ width: '70%', }}
                            className={` ${classes.selectEmpty
                              } ${errors &&
                              errors.active_since &&
                              classes.border_fix
                              } no-scrooll input-label no-scrooll`}
                            onChange={(e: any) => {
                              return (handleChange(e));
                            }}
                            error={true}
                            value={values.active_since}
                          >
                            {years.map(
                              (sinceval, index) => {
                                return (<MenuItem
                                  key={`year${index}`}
                                  value={sinceval}
                                >
                                  <ListItemText primary={sinceval} />
                                </MenuItem>)
                              }
                            )}
                          </Select>

                          {errors && errors.active_since && touched.active_since ? true : false}

                        </Box>
                      </Grid>



                      <Grid item xs={12} lg={6}>
                        <CustomTextField
                          name="linkedin_profile"
                          fullWidth
                          fieldName="LinkedIn Profile"
                          className="login-text-field"
                          placeholder="LinkedIn Profile"
                          value={values.linkedin_profile}
                          variant="outlined"
                          type=""
                          onChange={(e) => handleChange(e)}
                          onBlur={handleBlur}
                          helperText={
                            errors.linkedin_profile && touched.linkedin_profile
                              ? errors.linkedin_profile
                              : ""
                          }
                          error={
                            errors.linkedin_profile && touched.linkedin_profile
                              ? true
                              : false
                          }
                        />
                      </Grid>

                      {/* Clinic Address */}

                      <FieldArray
                        name="clinicAddressInfoData"
                        render={({ insert, remove, push }) => (
                          <>
                            {values.clinicAddressInfoData.map(
                              (item, index) => {
                                return (
                                  <>
                                    <Grid item xs={12}>
                                      {index == 0 && <Box display="flex" alignItems="center" justifyContent={"space-between"} >

                                        <Typography variant="h5" className="office-address-title" >Clinic Address</Typography>

                                        <Tooltip title="Add More">
                                          <IconButton aria-label="add-more">
                                            <AddCircleIcon
                                              onClick={() => {
                                                insert(0,{
                                                  address_line_1: "",
                                                  address_line_2: "",
                                                  country: "",
                                                  state: "",
                                                  city: "",
                                                  post_code: "",
                                                });
                                              }}
                                              fontSize="large"
                                              className="add-icon pointer"
                                            />
                                          </IconButton>
                                        </Tooltip>


                                      </Box>}
                                    </Grid>
                                    <div className="work-inner-box" style={{ display: 'flex', width: '100%', margin: '0 10px' }} >
                                      <Grid style={{ margin: '0' }} container spacing={4} >
                                        <Grid item xs={12} md={6}>
                                          <CustomTextField
                                            name={`clinicAddressInfoData[${index}].address_line_1`}
                                            value={item.address_line_1}
                                            variant="outlined"
                                            required
                                            fieldName="Address Line 1"
                                            className="login-text-field"
                                            fullWidth
                                            placeholder="Address Line 1"
                                            onChange={handleChange}
                                            helperText={
                                              errors &&
                                                errors.clinicAddressInfoData &&
                                                errors.clinicAddressInfoData[
                                                index
                                                ] &&
                                                errors.clinicAddressInfoData[index]
                                                  .address_line_1 &&
                                                touched &&
                                                touched.clinicAddressInfoData &&
                                                touched.clinicAddressInfoData[
                                                index
                                                ] &&
                                                touched.clinicAddressInfoData[index]
                                                  .address_line_1
                                                ? errors.clinicAddressInfoData[
                                                  index
                                                ].address_line_1
                                                : ""
                                            }
                                            error={
                                              errors &&
                                                errors.clinicAddressInfoData &&
                                                errors.clinicAddressInfoData[
                                                index
                                                ] &&
                                                errors.clinicAddressInfoData[index]
                                                  .address_line_1 &&
                                                touched &&
                                                touched.clinicAddressInfoData &&
                                                touched.clinicAddressInfoData[
                                                index
                                                ] &&
                                                touched.clinicAddressInfoData[index]
                                                  .address_line_1
                                                ? true
                                                : false
                                            }
                                          />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                          <CustomTextField
                                            fullWidth
                                            variant="outlined"
                                            fieldName="Address Line 2"
                                            className="login-text-field"
                                            placeholder="Address Line 2"
                                            value={item.address_line_2}
                                            type="text"
                                            name={`clinicAddressInfoData[${index}].address_line_2`}
                                            onChange={(e) => handleChange(e)}
                                            onBlur={handleBlur}
                                          />
                                        </Grid>

                                        <Grid
                                          item
                                          xs={12}
                                          md={3}
                                          className={`${classes.NewSelect} ${classes.fixspace}`}
                                        >
                                          {/* <CustomTextField name="Country" fullWidth variant="outlined" fieldName="Country" placeholder="Country" /> */}

                                          <label
                                            className="text_label"
                                            htmlFor={`clinicAddressInfoData[${index}].country`}
                                          >
                                            Country
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <FormControl
                                            fullWidth
                                            variant="outlined"
                                            className={`${classes.formControl} no-scrooll`}
                                          >
                                            <Select
                                              fullWidth
                                              labelId="demo-mutiple-checkbox-label"
                                              id="country"
                                              name={`clinicAddressInfoData[${index}].country`}
                                              className={` ${classes.selectEmpty} no-scrooll input-label`}
                                              value={item.country}
                                              onChange={(e: any) => {
                                                return (
                                                  handleChange(e),
                                                  setCountry(e.target.value),
                                                  setFieldValue(
                                                    `clinicAddressInfoData[${index}].state`,
                                                    ""
                                                  ),
                                                  setFieldValue(
                                                    `clinicAddressInfoData[${index}].city`,
                                                    ""
                                                  )
                                                );
                                              }}
                                            >

                                              {Country.getAllCountries().map(
                                                (item) => (
                                                  <MenuItem
                                                    key={item["countryCode"]}
                                                    value={item.name}
                                                  >
                                                    <ListItemText
                                                      primary={item.name}
                                                    />
                                                  </MenuItem>
                                                )
                                              )}
                                            </Select>
                                            {errors &&
                                              errors.clinicAddressInfoData &&
                                              errors.clinicAddressInfoData[index] &&
                                              errors.clinicAddressInfoData[index]
                                                .country &&
                                              touched &&
                                              touched.clinicAddressInfoData &&
                                              touched.clinicAddressInfoData[
                                              index
                                              ] &&
                                              touched.clinicAddressInfoData[index]
                                                .country ? (
                                              <div className="field-error c_red">
                                                {
                                                  errors.clinicAddressInfoData[
                                                    index
                                                  ].country
                                                }
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </FormControl>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          md={3}
                                          className={`${classes.NewSelect} ${classes.fixspace}`}
                                        >
                                          {/* <CustomTextField name="State" fullWidth variant="outlined" fieldName="State/Province" placeholder="State/Province" /> */}

                                          <label
                                            htmlFor={`clinicAddressInfoData[${index}].state`}
                                            className="text_label"
                                          >
                                            State
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <FormControl
                                            fullWidth
                                            variant="outlined"
                                            className={classes.formControl}
                                          >
                                            <Select
                                              labelId="demo-mutiple-checkbox-label"
                                              name={`clinicAddressInfoData[${index}].state`}
                                              id="state"
                                              className={` ${classes.selectEmpty} no-scrooll input-label login-text-field`}
                                              onChange={(e) => {
                                                handleChange(e);
                                                setState_city(
                                                  e.target.value.toString()
                                                );
                                                setFieldValue(
                                                  `clinicAddressInfoData[${index}].city`,
                                                  ""
                                                );
                                              }}
                                              value={item.state}
                                            >
                                              {State.getStatesOfCountry(
                                                Country.getAllCountries().filter(
                                                  (items) => {
                                                    return (
                                                      items.name == item?.country
                                                    );
                                                  }
                                                )[0]?.isoCode
                                              )?.map((item) => {
                                                return (
                                                  <MenuItem
                                                    key={item.name}
                                                    value={item.name}
                                                  >
                                                    <ListItemText
                                                      primary={item.name}
                                                    />
                                                  </MenuItem>
                                                );
                                              })}
                                            </Select>
                                            {errors &&
                                              errors.clinicAddressInfoData &&
                                              errors.clinicAddressInfoData[index] &&
                                              errors.clinicAddressInfoData[index]
                                                .state &&
                                              touched &&
                                              touched.clinicAddressInfoData &&
                                              touched.clinicAddressInfoData[
                                              index
                                              ] &&
                                              touched.clinicAddressInfoData[index]
                                                .state ? (
                                              <div className="field-error c_red">
                                                {
                                                  errors.clinicAddressInfoData[
                                                    index
                                                  ].state
                                                }
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </FormControl>
                                        </Grid>

                                        <Grid md={3} xs={12} item>
                                          <label
                                            className="text_label"
                                            htmlFor={`clinicAddressInfoData[${index}].state`}
                                          >
                                            City
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>

                                          <Select
                                            labelId="demo-mutiple-checkbox-label"
                                            id="city"
                                            fullWidth
                                            name={`clinicAddressInfoData[${index}].city`}
                                            variant="outlined"
                                            className={` ${classes.selectEmpty} no-scrooll input-label `}
                                            onChange={(e) => {
                                              handleChange(e);
                                            }}
                                            value={item?.city}
                                          >
                                            {City.getCitiesOfState(
                                              Country.getAllCountries().filter(
                                                (item_1) => {
                                                  return (
                                                    item_1.name === item.country
                                                  );
                                                }
                                              )[0]?.isoCode,
                                              State.getAllStates().filter(
                                                (items) => {
                                                  return items.name == item.state;
                                                }
                                              )[0]?.isoCode
                                            ).map((item) => {
                                              return (
                                                <MenuItem
                                                  key={item.name}
                                                  value={item.name}
                                                >
                                                  <ListItemText
                                                    primary={item.name}
                                                  />
                                                </MenuItem>
                                              );
                                            })}
                                          </Select>
                                          {errors &&
                                            errors.clinicAddressInfoData &&
                                            errors.clinicAddressInfoData[index] &&
                                            errors.clinicAddressInfoData[index]
                                              .city &&
                                            touched &&
                                            touched.clinicAddressInfoData &&
                                            touched.clinicAddressInfoData[index] &&
                                            touched.clinicAddressInfoData[index]
                                              .city ? (
                                            <div
                                              className="field-error  c_red"
                                              style={{ fontWeight: 700 }}
                                            >
                                              {
                                                errors.clinicAddressInfoData[
                                                  index
                                                ].city
                                              }
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                          <CustomTextField
                                            name={`clinicAddressInfoData[${index}].post_code`}
                                            fullWidth
                                            variant="outlined"
                                            fieldName="Post/Zip Code"
                                            required
                                            className="login-text-field"
                                            placeholder="Post/Zip Code"
                                            value={item.post_code}
                                            type="text"
                                            helperText={
                                              errors &&
                                                errors.clinicAddressInfoData &&
                                                errors.clinicAddressInfoData[
                                                index
                                                ] &&
                                                errors.clinicAddressInfoData[index]
                                                  .post_code &&
                                                touched &&
                                                touched.clinicAddressInfoData &&
                                                touched.clinicAddressInfoData[
                                                index
                                                ] &&
                                                touched.clinicAddressInfoData[index]
                                                  .post_code
                                                ? errors.clinicAddressInfoData[
                                                  index
                                                ].post_code
                                                : ""
                                            }
                                            error={
                                              errors &&
                                                errors.clinicAddressInfoData &&
                                                errors.clinicAddressInfoData[
                                                index
                                                ] &&
                                                errors.clinicAddressInfoData[index]
                                                  .post_code &&
                                                touched &&
                                                touched.clinicAddressInfoData &&
                                                touched.clinicAddressInfoData[
                                                index
                                                ] &&
                                                touched.clinicAddressInfoData[index]
                                                  .post_code
                                                ? true
                                                : false
                                            }
                                            onChange={(e) => handleChange(e)}
                                            onBlur={handleBlur}
                                          />
                                        </Grid>
                                      </Grid>
                                      <Tooltip title="Remove">
                                      <IconButton style={{height : 60, alignSelf  :'center'}} aria-label="add-more">
                                          <RemoveCircleIcon
                                            fontSize="large"
                                            className="add-icon pointer"
                                            onClick={() => {
                                              setPopupProps({ message: 'Are you sure you want to remove this clinic address section?', title: "Remove", onYes : ()=>remove(index) })
                                              // remove(index);
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </div>
                                  </>
                                );
                              }
                            )}
                          </>
                        )}
                      />



                      <Grid item xs={12}>
                        <Typography
                          variant="h5"
                          className="office-address-title"
                        >
                          Clinic Pictures
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          id="file"
                          variant="outlined"
                          fullWidth
                          name="fileUpload"
                          InputProps={{
                            endAdornment: (
                              <>
                                <label
                                  htmlFor="filesss"
                                  className={classes.changeOptions}
                                >
                                  <CustomButton
                                    fullWidth
                                    component="span"
                                    className="green-button"
                                  >
                                    upload
                                    <input
                                      id="filesss"
                                      type="file"
                                      hidden
                                      accept="image/*"
                                      name="clinicPictures"
                                      onChange={(e) => {
                                        setFieldValue("clinicPictures", [
                                          e.target.files[0],
                                        ]);
                                      }}
                                    />
                                  </CustomButton>
                                </label>
                              </>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid xs={12} item>
                        <span
                          style={{
                            display: "flex",
                            padding: "10px",
                            maxHeight: "150px",
                            alignItems: "center",
                            overflowX: "scroll",
                            overflowY: "hidden",
                          }}
                          className="scrollView"
                        >
                          {values?.clinicPictures.map((item) => {
                            return (
                              <a
                                href={
                                  (item?.file_url! == null || item !== null) &&
                                  (typeof item?.file_url == "string"
                                    ? item?.file_url
                                    : URL.createObjectURL(item))
                                }
                                target="_blank"
                              >
                                <img
                                  style={{
                                    cursor: "pointer",
                                    maxHeight: "220px",
                                    padding: "10px",
                                  }}
                                  width="220px"
                                  src={
                                    item.file_url !== undefined &&
                                      typeof item?.file_url == "string"
                                      ? item?.file_url
                                      : URL.createObjectURL(item)
                                  }
                                  alt=""
                                />
                              </a>
                            );
                          })}
                        </span>
                      </Grid>

                      <FieldArray
                        name="businessRegistrationInfoData"
                        render={({ insert, remove, push }) => (
                          <>
                            {values &&
                              values?.businessRegistrationInfoData?.map(
                                (item, index) => {
                                  return (
                                    <>
                                    <Grid item xs={12}>
                                      {index == 0 && <Box display="flex" alignItems="center" justifyContent={"space-between"} >

                                        <Typography variant="h5" className="office-address-title" >Business Registration Details</Typography>

                                        <Tooltip title="Add More">
                                          <IconButton aria-label="add-more">
                                            <AddCircleIcon
                                              onClick={() => {
                                                insert(0,{
                                                  business_registration_name: "",
                                                  registration_number: "",
                                                  year: "",
                                                  tax_number : ""
                                                });
                                              }}
                                              fontSize="large"
                                              className="add-icon pointer"
                                            />
                                          </IconButton>
                                        </Tooltip>


                                      </Box>}
                                    </Grid>
                                   <div className="work-inner-box" style={{ display: 'flex', width: '100%', margin: '0 10px' }} >
                                        <Grid container spacing={4}>
                                          <Grid item xs={12} md={5}>
                                            <CustomTextField
                                              name={`businessRegistrationInfoData[${index}].business_registration_name`}
                                              fullWidth
                                              variant="outlined"
                                              value={
                                                item.business_registration_name
                                              }
                                              fieldName="Registration Authority"
                                              required
                                              className="login-text-field"
                                              placeholder="Registration Authority"
                                              onChange={handleChange}
                                              helperText={
                                                errors &&
                                                  errors.businessRegistrationInfoData &&
                                                  errors
                                                    .businessRegistrationInfoData[
                                                  index
                                                  ] &&
                                                  errors
                                                    .businessRegistrationInfoData[
                                                    index
                                                  ].business_registration_name &&
                                                  touched &&
                                                  touched.businessRegistrationInfoData &&
                                                  touched
                                                    .businessRegistrationInfoData[
                                                  index
                                                  ] &&
                                                  touched
                                                    .businessRegistrationInfoData[
                                                    index
                                                  ].business_registration_name
                                                  ? errors
                                                    .businessRegistrationInfoData[
                                                    index
                                                  ].business_registration_name
                                                  : ""
                                              }
                                              error={
                                                errors.businessRegistrationInfoData &&
                                                  errors.businessRegistrationInfoData &&
                                                  errors
                                                    .businessRegistrationInfoData[
                                                  index
                                                  ] &&
                                                  errors
                                                    .businessRegistrationInfoData[
                                                    index
                                                  ].business_registration_name &&
                                                  touched.businessRegistrationInfoData &&
                                                  touched
                                                    .businessRegistrationInfoData[
                                                    index
                                                  ]?.business_registration_name
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </Grid>
                                          <Grid item xs={12} md={5}>
                                            <CustomTextField
                                              name={`businessRegistrationInfoData[${index}].registration_number`}
                                              fullWidth
                                              variant="outlined"
                                              value={item.registration_number}
                                              fieldName="Business Registration Number"
                                              className="login-text-field"
                                              onChange={handleChange}
                                              required
                                              placeholder="Business Registration Number"
                                              helperText={
                                                errors &&
                                                  errors.businessRegistrationInfoData &&
                                                  errors
                                                    .businessRegistrationInfoData[
                                                  index
                                                  ] &&
                                                  errors
                                                    .businessRegistrationInfoData[
                                                    index
                                                  ].registration_number &&
                                                  touched &&
                                                  touched.businessRegistrationInfoData &&
                                                  touched
                                                    .businessRegistrationInfoData[
                                                  index
                                                  ] &&
                                                  touched
                                                    .businessRegistrationInfoData[
                                                    index
                                                  ].registration_number
                                                  ? errors
                                                    .businessRegistrationInfoData[
                                                    index
                                                  ].registration_number
                                                  : ""
                                              }
                                              error={
                                                errors.businessRegistrationInfoData &&
                                                  errors
                                                    .businessRegistrationInfoData[
                                                  index
                                                  ] &&
                                                  errors
                                                    .businessRegistrationInfoData[
                                                    index
                                                  ].registration_number &&
                                                  touched.businessRegistrationInfoData &&
                                                  touched
                                                    .businessRegistrationInfoData[
                                                    index
                                                  ]?.registration_number
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </Grid>
                                          <Grid item lg={2} xs={12}>
                                            <Box
                                              display="flex"
                                              flexDirection='column'
                                              alignItems="flex-start"
                                            >
                                              <label
                                                style={{ fontWeight: 'bold', color: "#085044" }}
                                                htmlFor={`businessRegistrationInfoData.${index}.year`}
                                              >
                                                Year{" "}
                                                <span style={{ color: "red" }}>
                                                  *
                                                </span>
                                              </label>

                                              <Select
                                                labelId="demo-mutiple-checkbox-label"
                                                id="Year"
                                                style={{ width: '75%' }}
                                                name={`businessRegistrationInfoData.${index}.year`}
                                                variant="outlined"
                                                placeholder="Year"
                                                className={` ${classes.selectEmpty
                                                  } ${errors &&
                                                  errors.businessRegistrationInfoData &&
                                                  errors.businessRegistrationInfoData[
                                                  index
                                                  ] &&
                                                  errors.businessRegistrationInfoData[
                                                    index
                                                  ].year &&
                                                  classes.border_fix
                                                  } no-scrooll input-label no-scrooll`}
                                                onChange={(e: any) => {
                                                  return (
                                                    handleChange(e)
                                                    // setCountry(e.target.value)
                                                  );
                                                }}
                                                error={true}
                                                value={item.year}
                                              >
                                                {years.map(
                                                  (year, index) => {
                                                    return (<MenuItem
                                                      key={`year${index}`}
                                                      value={year}
                                                    >
                                                      <ListItemText primary={year} />
                                                    </MenuItem>)
                                                  }
                                                )}
                                              </Select>

                                              {errors &&
                                                errors.businessRegistrationInfoData &&
                                                errors.businessRegistrationInfoData[
                                                index
                                                ] &&
                                                errors.businessRegistrationInfoData[index]
                                                  .year &&
                                                touched &&
                                                touched.businessRegistrationInfoData &&
                                                touched.businessRegistrationInfoData[
                                                index
                                                ] &&
                                                touched.businessRegistrationInfoData[index]
                                                  .year && (
                                                  <div className="field-error">
                                                    {
                                                      errors.businessRegistrationInfoData[
                                                        index
                                                      ].year
                                                    }
                                                  </div>
                                                )}

                                            </Box>



                                          </Grid>



                                        </Grid>

                                        <Tooltip title="Remove">
                                        <IconButton style={{height : 60, alignSelf  :'center',marginTop:16}} aria-label="add-more">
                                          <RemoveCircleIcon
                                            fontSize="large"
                                            className="add-icon pointer"
                                            onClick={() => {
                                              setPopupProps({ message: 'Are you sure you want to remove this business registration detail section?', title: "Remove", onYes : ()=>remove(index) })
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                      </div>

                                      {/* {index != values?.businessRegistrationInfoData?.length - 1 &&<Grid item xs={12} md={4}/>} */}

                                      {index == values?.businessRegistrationInfoData?.length - 1 &&
                                        <Grid item xs={12} md={4}>
                                          <CustomTextField
                                            name={`businessRegistrationInfoData[${index}].tax_number`}
                                            value={item.tax_number}
                                            fullWidth
                                            variant="outlined"
                                            fieldName="Tax Number"
                                            className="login-text-field"
                                            placeholder="Tax Number"
                                            helperText={
                                              errors &&
                                                errors.businessRegistrationInfoData &&
                                                errors
                                                  .businessRegistrationInfoData[
                                                index
                                                ] &&
                                                errors
                                                  .businessRegistrationInfoData[
                                                  index
                                                ].tax_number &&
                                                touched &&
                                                touched.businessRegistrationInfoData &&
                                                touched
                                                  .businessRegistrationInfoData[
                                                index
                                                ] &&
                                                touched
                                                  .businessRegistrationInfoData[
                                                  index
                                                ].tax_number
                                                ? errors
                                                  .businessRegistrationInfoData[
                                                  index
                                                ].tax_number
                                                : ""
                                            }
                                            error={
                                              errors.businessRegistrationInfoData &&
                                                errors
                                                  .businessRegistrationInfoData[
                                                index
                                                ] &&
                                                errors
                                                  .businessRegistrationInfoData[
                                                  index
                                                ].tax_number &&
                                                touched.businessRegistrationInfoData &&
                                                touched
                                                  .businessRegistrationInfoData[
                                                  index
                                                ].tax_number
                                                ? true
                                                : false
                                            }
                                            onChange={(e) => handleChange(e)}
                                            onBlur={handleBlur}
                                          />
                                        </Grid>}
                                    </>
                                  );
                                }
                              )}
                          </>
                        )}
                      />

                      <Grid item xs={12}>
                        <Typography
                          variant="h5"
                          className="office-address-title"
                        >
                          Contact Person
                        </Typography>
                      </Grid>

                      <Grid item xs={12} lg={4}>
                        <CustomTextField
                          fullWidth
                          className="login-text-field first-name-salutaion-field"
                          autoComplete="off"
                          variant="outlined"
                          fieldName="Full Name"
                          name="first_name"
                          required
                          id="input-with-dropdown"
                          placeholder="Full Name"
                          value={values.first_name}
                          type="text"
                          helperText={
                            (errors.first_name || errors.salutation) &&
                              (touched.first_name || touched.salutation)
                              ? errors.first_name || errors.salutation
                              : ""
                          }
                          error={
                            (errors.first_name || errors.salutation) &&
                              (touched.first_name || touched.first_name)
                              ? true
                              : false
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FormControl className={classes.formControl}>
                                  <Select
                                    id="salutation"
                                    name="salutation"
                                    value={(values?.salutation) + ''}
                                    disableUnderline
                                    onChange={handleChange}
                                    error={
                                      errors.salutation && touched.salutation
                                        ? true
                                        : false
                                    }
                                  >
                                    <MenuItem value={"0"}>Mr</MenuItem>
                                    <MenuItem value={"1"}>Mrs</MenuItem>
                                    <MenuItem value={"3"}>Miss</MenuItem>
                                    <MenuItem value={"4"}>Dr</MenuItem>
                                    <MenuItem value={"2"}>Other</MenuItem>
                                  </Select>
                                </FormControl>
                                <Typography>|</Typography>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          fullWidth
                          variant="outlined"
                          fieldName="Email Address"
                          name="clinic_person_email"
                          value={values.clinic_person_email}
                          className="login-text-field"
                          placeholder="Email Address"
                          onChange={handleChange}
                          helperText={
                            errors &&
                              errors.clinic_person_email &&
                              touched &&
                              touched.clinic_person_email
                              ? errors.clinic_person_email
                              : ""
                          }
                          error={
                            errors &&
                              errors.clinic_person_email &&
                              touched &&
                              touched.clinic_person_email
                              ? true
                              : false
                          }
                        />
                      </Grid>
                      {/* old */}
                      {/* <Grid item xs={12} md={3}>
                        <CustomTextField
                          name="account_holder_name"
                          fullWidth
                          variant="outlined"
                          value={values?.account_holder_name}
                          fieldName="Phone Number"
                          className="login-text-field"
                          onChange={handleChange}
                          placeholder="Phone Number"
                          helperText={
                            errors &&
                              errors.account_holder_name &&
                              touched &&
                              touched.account_holder_name
                              ? errors.account_holder_name
                              : ""
                          }
                          error={
                            errors &&
                              errors.account_holder_name &&
                              touched &&
                              touched.account_holder_name
                              ? true
                              : false
                          }
                        />
                      </Grid> */}
                          {/* new */}

                          <Grid item xs={12} lg={3}>
                        <CustomTextField
                          name="mobile"
                          id="input-with-dropdown"
                          // id={values.clinic_phone_number}
                          value={values?.mobile}
                          fullWidth
                          required
                          fieldName="Phone Number"
                          variant="outlined"
                          className="login-text-field"
                          placeholder=""
                          type=""
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FormControl className={classes.formControl}>
                                  <Select
                                    id="mobile_code"
                                    name="mobile_code"
                                    value={values.mobile_code || "+1"}
                                    disableUnderline
                                    onChange={handleChange}
                                    error={
                                      errors.mobile_code &&
                                        touched.mobile_code
                                        ? true
                                        : false
                                    }
                                  >
                                    {dialCodes.sort(
                                      (a: any, b: any) => {
                                        return a - b;
                                      }
                                    ).map((item) => {
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
                          helperText={
                            errors &&
                              errors.mobile &&
                              touched &&
                              touched.mobile
                              ? errors.mobile
                              : ""
                          }
                          error={
                            errors &&
                              errors.mobile &&
                              touched &&
                              touched.mobile
                              ? true
                              : false
                          }
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="Clinkedin_profile"
                          fullWidth
                          value={values.Clinkedin_profile}
                          variant="outlined"
                          fieldName="LinkedIn Profile"
                          className="login-text-field"
                          placeholder="LinkedIn Profile"
                          onChange={handleChange}
                          helperText={
                            errors &&
                              errors.Clinkedin_profile &&
                              touched &&
                              touched.Clinkedin_profile
                              ? errors.Clinkedin_profile
                              : ""
                          }
                          error={
                            errors &&
                              errors.Clinkedin_profile &&
                              touched &&
                              touched.Clinkedin_profile
                              ? true
                              : false
                          }
                        />
                      </Grid>

                      {/* Payments Info */}

                      <Grid item xs={12}>
                        <Typography
                          variant="h5"
                          className="office-address-title"
                        >
                          Payment Information
                        </Typography>
                      </Grid>
                      <Grid item xs={12} className={classes.paymentInfo}>
                        <FieldArray
                          name="paymentsInfoData"
                          render={() => (
                            <>
                              {values &&
                                values?.paymentsInfoData?.map((item, index) => {
                                  return (
                                    <Grid container spacing={4}>
                                      <Grid item xs={12} md={5}>
                                        <CustomTextField
                                          name={`paymentsInfoData[${index}].account_number`}
                                          value={item.account_number}
                                          required
                                          fullWidth
                                          variant="outlined"
                                          fieldName="Account Number"
                                          className="login-text-field"
                                          placeholder="Account Number"
                                          onChange={(e) => handleChange(e)}
                                          onBlur={handleBlur}
                                          helperText={
                                            errors &&
                                              errors.paymentsInfoData &&
                                              errors.paymentsInfoData[index]
                                                .account_number &&
                                              touched &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData[index]
                                                .account_number
                                              ? errors.paymentsInfoData[index]
                                                .account_number
                                              : ""
                                          }
                                          error={
                                            errors &&
                                              errors.paymentsInfoData &&
                                              errors.paymentsInfoData[index]
                                                .account_number &&
                                              touched &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData[index]
                                                .account_number
                                              ? true
                                              : false
                                          }
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={3}>
                                        <CustomTextField
                                          name={`paymentsInfoData[${index}].account_holder_name`}
                                          value={item.account_holder_name}
                                          required
                                          fullWidth
                                          variant="outlined"
                                          fieldName="Account Holder Name"
                                          className="login-text-field"
                                          placeholder="Account Holder Name"
                                          onChange={(e) => handleChange(e)}
                                          onBlur={handleBlur}
                                          helperText={
                                            errors &&
                                              errors.paymentsInfoData &&
                                              errors.paymentsInfoData[index]
                                                .account_holder_name &&
                                              touched &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData[index]
                                                .account_holder_name
                                              ? errors.paymentsInfoData[index]
                                                .account_holder_name
                                              : ""
                                          }
                                          error={
                                            errors &&
                                              errors.paymentsInfoData &&
                                              errors.paymentsInfoData[index]
                                                .account_holder_name &&
                                              touched &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData[index]
                                                .account_holder_name
                                              ? true
                                              : false
                                          }
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={3}>
                                        <CustomTextField
                                          name={`paymentsInfoData[${index}].bank_name`}
                                          value={item.bank_name}
                                          fullWidth
                                          variant="outlined"
                                          required
                                          fieldName="Bank Name"
                                          className="login-text-field"
                                          onChange={(e) => handleChange(e)}
                                          onBlur={handleBlur}
                                          placeholder="Bank Name"
                                          helperText={
                                            errors &&
                                              errors.paymentsInfoData &&
                                              errors.paymentsInfoData[index]
                                                .bank_name &&
                                              touched &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData[index]
                                                .bank_name
                                              ? errors.paymentsInfoData[index]
                                                .bank_name
                                              : ""
                                          }
                                          error={
                                            errors &&
                                              errors.paymentsInfoData &&
                                              errors.paymentsInfoData[index]
                                                .bank_name &&
                                              touched &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData[index]
                                                .bank_name
                                              ? true
                                              : false
                                          }
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={3}>
                                        <CustomTextField
                                          name={`paymentsInfoData[${index}].sort_code`}
                                          value={item.sort_code}
                                          fullWidth
                                          required
                                          variant="outlined"
                                          className="login-text-field"
                                          fieldName="Sort Code / Routing Number"
                                          placeholder="Sort Code / Routing Number"
                                          onChange={(e) => handleChange(e)}
                                          onBlur={handleBlur}
                                          helperText={
                                            errors &&
                                              errors.paymentsInfoData &&
                                              errors.paymentsInfoData[index]
                                                .sort_code &&
                                              touched &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData[index]
                                                .sort_code
                                              ? errors.paymentsInfoData[index]
                                                .sort_code
                                              : ""
                                          }
                                          error={
                                            errors &&
                                              errors.paymentsInfoData &&
                                              errors.paymentsInfoData[index]
                                                .sort_code &&
                                              touched &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData[index]
                                                .sort_code
                                              ? true
                                              : false
                                          }
                                        />
                                      </Grid>

                                      <Grid item xs={12} md={3}>
                                        <CustomTextField
                                          name={`paymentsInfoData[${index}].swift_code`}
                                          value={item.swift_code}
                                          fullWidth
                                          required
                                          variant="outlined"
                                          fieldName="BIC / Swift Code"
                                          className="login-text-field"
                                          placeholder="BIC / Swift Code"
                                          onChange={(e) => handleChange(e)}
                                          onBlur={handleBlur}
                                          helperText={
                                            errors &&
                                              errors.paymentsInfoData &&
                                              errors.paymentsInfoData[index]
                                                .swift_code &&
                                              touched &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData[index]
                                                .swift_code
                                              ? errors.paymentsInfoData[index]
                                                .swift_code
                                              : ""
                                          }
                                          error={
                                            errors &&
                                              errors.paymentsInfoData &&
                                              errors.paymentsInfoData[index]
                                                .swift_code &&
                                              touched &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData &&
                                              touched.paymentsInfoData[index]
                                                .swift_code
                                              ? true
                                              : false
                                          }
                                        />
                                      </Grid>
                                      <Grid item xs={12}>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              icon={
                                                <CheckBoxOutlineBlankIcon />
                                              }
                                              checkedIcon={<CheckBoxIcon />}
                                              name={`paymentsInfoData[${index}].is_primary_acc`}
                                              checked={
                                                item.is_primary_acc == 0
                                                  ? false
                                                  : true
                                              }
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                            />
                                          }
                                          label="Check if this is your Primary Account."
                                        />
                                      </Grid>
                                    </Grid>
                                  );
                                })}
                            </>
                          )}
                        />
                      </Grid>

                      {/* <Grid xs={12}>
                        <ChangePassword />
                      </Grid> */}

                      <Grid item sm={12}>
                        {/* Change Password Fileds */}
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography
                              variant={"h4"}
                              className="office-address-title"
                            >
                              Change Password
                            </Typography>
                          </Grid>
                          <Grid item xs={12} lg={12}>
                            <ChangePassword />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* <Grid xs={12} sm={4} lg={3} item>
                        <CustomTextField
                          type="password"
                          name="CurrentPassword"
                          fullWidth
                          variant="outlined"
                          fieldName="Current Password"
                          className="login-text-field"
                          onChange={(e) => handleChange(e)}
                          onBlur={handleBlur}
                          placeholder="Currnet Password"
                        />
                      </Grid>

                      <Grid xs={12} sm={4} lg={3} item>
                        <CustomTextField
                          type="password"
                          name="NewPassword"
                          fullWidth
                          variant="outlined"
                          fieldName="Current Password"
                          className="login-text-field"
                          onChange={(e) => handleChange(e)}
                          onBlur={handleBlur}
                          placeholder="New Password"
                        />
                      </Grid>

                      <Grid xs={12} sm={4} lg={3} item>
                        <CustomTextField
                          type="password"
                          name="confirmPassword"
                          fullWidth
                          variant="outlined"
                          fieldName="Current Password"
                          className="login-text-field"
                          placeholder="Confirm Password"
                          onChange={(e) => handleChange(e)}
                          onBlur={handleBlur}
                        />
                      </Grid>

                      <Grid xs={12} sm={12} lg={3} item>
                        <CustomButton
                          name="SbumitButton"
                          className="green-button"
                          fullWidth
                          variant="filled"
                          onChange={(e) => handleChange(e)}
                          onBlur={handleBlur}
                        >
                          Change Password
                        </CustomButton>
                      </Grid> */}

                      {/* change Password Mannual Ends here */}

                      {/* ------------------------------------------------- */}

                      {/* <Grid item xs={12}>
                        <Typography
                          variant="h5"
                          className="office-address-title"
                        >
                          Notification Settings
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography
                            variant="h5"
                            className="office-address-content"
                          >
                            when to receive messages
                          </Typography>
                          <Switch
                            checked={state.checkedB}
                            onChange={handleSwitchChange}
                            color="primary"
                            name="checkedB"
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography
                            variant="h5"
                            className="office-address-content"
                          >
                            when to receive messages
                          </Typography>

                          <Switch
                            checked={state.checkedB}
                            onChange={handleSwitchChange}
                            color="primary"
                            name="checkedB"
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography
                            variant="h5"
                            className="office-address-content"
                          >
                            when to receive messages
                          </Typography>

                          <Switch
                            checked={state.checkedB}
                            onChange={handleSwitchChange}
                            color="primary"
                            name="checkedB"
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        </Box>
                      </Grid> */}

                      {/* {Object.keys(errors).length} */}

                      <Grid item xs={12}>
                        {/* BUttons Bottom */}
                        <Box style={{ display: 'flex', alignItems: 'center' }} className={classes.buttonBox}>
                          <div style={{ width: 'auto', marginLeft: 'auto', marginRight: 30, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }} className={'work-inner-box'} >
                            <p >Fields with "<p style={{ color: 'red', display: 'inline' }} > * </p>" are compulsory for profile verification</p>
                          </div>
                          <CustomButton
                            type="submit"
                            onClick={() => {
                              dispatch(loadSpinner());
                              saveDoctorPersonalProfileInfo(values);
                             
                            }}
                            variant="contained"
                            className={`register-button ${classes.BottomButtons}`}
                          >
                            save
                          </CustomButton>
                          <CustomButton
                            type="submit"
                            onClick={() => {
                              setTimeout(() => {
                                if (Object.keys(errors).length > 0) setPopupProps({ message: 'There are required fields you need to fill out.', title: "Required Fields", hideSecondaryButton: true, primaryText: 'Ok' })
                              }, 500)
                              handleSubmit()
                            }}
                            variant="contained"
                            className={`register-button ${classes.BottomButtons}`}
                          >
                            Get Verified
                          </CustomButton>
                          <div style={{ margin: -15 }} />
                        </Box>
                      </Grid>



                    </Grid>
                  </Grid>
                </Grid>

              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default React.forwardRef(ClinicPersonalInfo) ;
