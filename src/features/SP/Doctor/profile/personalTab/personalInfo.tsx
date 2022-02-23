import React, { useState, useEffect, useContext, ForwardRefRenderFunction, useImperativeHandle, useMemo, useRef } from "react";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "../../../../../components/modal/modal";
import { Country, State, City } from "country-state-city";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useHistory } from "react-router";
import {
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Typography,
  ListItemText,
  Checkbox,
  Box,
} from "@material-ui/core";

import "date-fns";

import { map, filter, head, get, isEmpty } from "lodash";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import InfoIcon from "@material-ui/icons/Info";
import { Formik, Form, FormikProps, FieldArray, Field, FormikConfig } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import CustomButton from "../../../../reusable/customButton/customButton";
import CustomTextField from "../../../../reusable/customTextField/customTextField";
import {
  changeAccStatus,
  fetchChangeProfilePictureAsync,
  fetchDoctorPersonalInfoAsync,
} from "./personalInfoSlice";
import "./personalInfo.scss";
import { selectLogin } from "../../../../login/loginSlice";
import ChangePassword from "../../../../changePassword/changePassword";
import { Regex } from "../../../../../utils/validations";
import {
  closeSpinner,
  loadSpinner,
} from "../../../../../reducres/reducers/spinner";
import { useSelector } from "react-redux";
import { dialCodes } from "../../../../../utils/dialCodes/dialCodes";
import Toast from "../../../../../reducres/reducers/toast";
import { fetchProfileAsync } from "../../../../profile/profileSlice";
import Auth from "../../../../../protectedRoutes/Auth";
import CustomPopup from "../../../../reusable/customPopup/customPopup";
import { getCities, getCountries, getStates } from "../../../../../utils/conutry_state_city";

const useStyles = makeStyles((theme: Theme) => ({
  root1: {
    display: "block",
    margin: "0 auto",
  },
  fab: {
    margin: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(2),
    paddingTop: "1px",
    color: "#085044",
  },
  title1: {
    padding: theme.spacing(2),
    color: "#085044",
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
  formControl: {
    margin: theme.spacing(1),
    width: "30px",
    minWidth: "fit-content",
    "& > *": {
      fontWeight: 700,
      color: "#085044",
    },
  },
  formControlSelect: {
    margin: theme.spacing(1),
    minWidth: 200,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      "& > *": {
        width: "100%",
      },
    },
  },

  BottomButtons: {
    marginRight: "30px",

    [theme.breakpoints.down("sm")]: {
      marginRight: "0px",

      width: "100%",
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
  fixImage: {
    flexWrap: "wrap",
    "& > span": {
      paddingLeft: "20px",
    },
    [theme.breakpoints.only("xs")]: {
      "& > p": {
        width: "100%",
        padding: "20px 0px !important",
      },
    },

    "& > p": {
      padding: "0 40px",
    },
  },
}));

export interface IDoctorProfilePersonalInfo {
  salutation: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  weekOff: any;
  linkedin_profile: string;
  officeAddress: string;
  address_line1: string;
  country: string;
  state: string;
  postalCode: string;
}
let office_address_interface: {
  address_line1: string;
  country: string;
  state: string;
  post_code: string;
  city: string;
  same_as_correspondence: number;
  type: string
}[] = [
    {
      address_line1: "",
      country: "",
      state: "",
      post_code: "",
      same_as_correspondence: 0,
      city: "",
      type: '0'
    },
  ];

let correspondence_address_interface: {
  address_line1: string;
  country: string;
  state: string;
  post_code: string;
  city: string;
}[] = [
    {
      address_line1: "",
      country: "",
      state: "",
      post_code: "",
      city: "",
    },
  ];

let valuecheck = null;

type HtmlProps = React.HTMLProps<HTMLElement>

const getFilteredAddress = (user_addresses, type) => {
  let filteredAddresses = user_addresses?.filter(address => address.type == type)
  return filteredAddresses?.length > 0 ? filteredAddresses : [{ address_line1: "", country: "", state: "", post_code: "", city: "", type }]
}

const PersonalInfo: ForwardRefRenderFunction<FormikConfig<any>, any> = ({
  user_addresses,
  file_url,
  user_details,
  linkedInProfile,
  phone,
  email,
  mobile,
  salutation,
  first_name,
  middle_name,
  last_name,
  is_active,
  country_code,
  country_code_mobile,
}, ref: any) => {
  const ProfileUserState = useSelector((state) => state);

  const filteredOfficeAddresses = useMemo(() => getFilteredAddress(user_addresses, "0"), [user_addresses])
  const filteredCorrespondenceAddresses = useMemo(() => getFilteredAddress(user_addresses, "1"), [user_addresses])

  const [weekOff, setWeekOff] = useState([]);

  const [active, setActive] = useState<number>(1);
  const history = useHistory();
  useEffect(() => {
    window.scrollTo(0, 0)
    setActive(is_active);

    dispatch(loadSpinner());
    setintitialStateValue({
      is_active: is_active,
      country_code_mobile: country_code_mobile || "+1",
      country_code: country_code || "+1",
      salutation: salutation || "0",
      week_off: user_details?.week_off || [],
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      email: email,
      phone: phone,
      mobile: mobile,

      linkedin_profile: user_details?.linkedin_profile,
      office_address: filteredOfficeAddresses,
      correspondence_address: filteredCorrespondenceAddresses,
    });

    dispatch(closeSpinner());
  }, [is_active, country_code]);
  useEffect(() => {
    if (user_details && user_details?.week_off !== null) {
      let week_off = [];
      if (user_details?.week_off !== null) {
        Object.keys(user_details.week_off).filter((item) => {
          week_off.push(user_details.week_off[item]);
        });
        setWeekOff(week_off);
      }
    }
  }, [user_details?.week_off]);

  const deleteAddress = (data: any) => { };

  const [intitialStateValue, setintitialStateValue] = useState({
    is_active: is_active,
    salutation: salutation || "0",
    week_off: weekOff || [],
    first_name: first_name,
    middle_name: middle_name,
    last_name: last_name,
    email: email,
    country_code: country_code,
    country_code_mobile: country_code_mobile,
    phone: phone,
    mobile: mobile,
    linkedin_profile: user_details?.linkedin_profile,
    office_address: filteredOfficeAddresses,
    correspondence_address: filteredCorrespondenceAddresses,
  });

  const dispatch = useAppDispatch();

  const classes = useStyles();
  const { user } = useAppSelector(selectLogin);
  const [dropDownValue, setDropDownValue] = React.useState("");
  const [age, setAge] = React.useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  // const [countries, setCountries] = useState(Country.getAllCountries());
  const [country, setCountry] = useState("");
  const [countryState, setCountryState] = useState("");
  const [checked, setChecked] = React.useState<any>(null);
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  const [open, setOpen] = React.useState(false);

  const handleModalClose = () => {
    setOpen(!open);
  };

  const checkIndexOfCorrespondence = (officeAddresses, correspondenceAddress) => {
    officeAddresses.forEach((address, index) => {
      if (
        address.address_line1 == correspondenceAddress?.address_line1 &&
        address.city == correspondenceAddress?.city &&
        address.country == correspondenceAddress?.country &&
        address.post_code == correspondenceAddress?.post_code &&
        address.state == correspondenceAddress?.state
      ) setChecked(index)
    });
  }

  const [modalContent, setModalContent] = useState<any>({});

  useEffect(() => {
    // console.log("TOKEN", Auth.getToken().token)
    dispatch(loadSpinner());

    checkIndexOfCorrespondence(filteredOfficeAddresses, filteredCorrespondenceAddresses[0])

    setintitialStateValue({
      is_active: is_active || 3,
      country_code: country_code || "+1",
      country_code_mobile: country_code_mobile || "+1",
      salutation: salutation || "0",
      week_off: user_details?.week_off || [],
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      email: email,
      phone: phone,
      mobile: mobile,
      linkedin_profile: user_details?.linkedin_profile,
      office_address: filteredOfficeAddresses,
      correspondence_address: filteredCorrespondenceAddresses,
    });
    dispatch(closeSpinner());
  }, [
    user_addresses,
    file_url,
    user_details,
    linkedInProfile,
    phone,
    email,
    country_code,
    salutation,
    first_name,
    middle_name,
    last_name,
  ]);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleDropDownChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setAge(event.target.value as string);
  };

  const handleChange1 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDropDownValue(event.target.value as string);
  };
  const saveDoctorPersonalProfileInfo = async (data: any) => {
    dispatch(loadSpinner());

    let new_off = data.week_off;

    const newData = {};
    new_off.map((item, index) => {
      newData[`${index}`] = item;
      return item;
    });

    dispatch(
      fetchDoctorPersonalInfoAsync({
        is_active: data.is_active,
        salutation: data.salutation,
        week_off: newData,
        country_code: data.country_code,
        country_code_mobile: data.country_code_mobile,
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        mobile: data.mobile,
        linkedin_profile: data.linkedin_profile,
        office_address: data.office_address,
        correspondence_address: data.correspondence_address,
      })
    ).then(async (result) => {
      if (result?.payload.length !== undefined) {
        Toast.success("Successfully Saved Personal Info");
        console.log('after add datar', result)
        await dispatch(fetchProfileAsync());

      }
      if (result?.payload?.response?.data?.statusCode == 400) {
        setPopupProps({ title: 'Error', message: result?.payload?.response?.data?.message, primaryText: 'Ok', hideSecondaryButton: true })
        // Toast.error(result?.payload?.response?.data?.message);
      }
      dispatch(closeSpinner());
    });
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
        setPopupProps({ title: 'Error', message: result?.payload?.response?.data?.message, primaryText: 'Ok', hideSecondaryButton: true })
        // Toast.error(result?.payload?.response?.data?.message);
      }
      dispatch(closeSpinner());
    });
  };
  const stateStore = useSelector((state) => state["profile"]);

  const [State_DP, setState_city] = useState("");

  const changeAccStatus_acc = (payload, handleChange) => {

    const onYes = () => {
      dispatch(changeAccStatus(payload))
        .then((result) => {
          if (payload.type !== 'activate') handleChange()
          if (result?.payload?.data?.statusCode == 200) {
            if (result?.payload?.data?.message == 'Account removed successfully') {
              Toast.success(result?.payload?.data?.message);
              history.push("/");
            }
            Toast.success(result?.payload?.data?.message);
          } else {
            setPopupProps({ title: 'Error', message: result?.payload?.response?.data.message, primaryText: 'Ok', hideSecondaryButton: true })
            // Toast.error(result?.payload.data.message);
          }
        })
        .catch((err) => {
          setPopupProps({ title: 'Error', message: err?.message, primaryText: 'Ok', hideSecondaryButton: true })
          // Toast.error(err?.message);
        });
    }

    if (payload.type == 'inactivate') return setPopupProps({ title: 'Caution', message: 'Are you sure you want to deactivate your account?', onYes })
    if (payload.type == 'permanentDelete') return setPopupProps({ title: 'Caution', message: 'Are you sure you want to permanently delete your account?', onYes })
    onYes()
  };

  useImperativeHandle(ref, () => ({
    // setPopupProps({ message: 'We have just sent you the email. If you do not hear from us in few minutes, please check your spam folder', title: "Success", primaryText: 'Ok', hideSecondaryButton: true })
 
    onTabChange: (change: () => void) => !dirty ? change() : setPopupProps({message: 'You have unsaved changes. Are you sure you want to change the tab?',title: 'Caution',  onYes: change })
  }))

  const [dirty, setDirty] = useState(false)

  const [popupProps, setPopupProps] = useState<any>()

  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  useEffect(()=>getCountries(setCountries),[])
  useEffect(()=>getStates(country, setStates),[country])
  useEffect(()=>getCities(countryState, setCities),[countryState])

  console.log(states)

  return (
    <div ref={ref} className={`${classes.root1} doctor-profile-personal-info-tab `}>
      {popupProps && <CustomPopup visible={popupProps ? true : false} dismiss={() => setPopupProps(null)} {...popupProps} />}
      <Formik

        enableReinitialize
        initialValues={intitialStateValue}
        onSubmit={(values: any, actions) => {
          window.scrollTo(0, 0)
          const newValues = JSON.parse(JSON.stringify(values))
          newValues.correspondence_address[0].type = "1"
          //console.log('enter data', newValues)
          saveDoctorPersonalProfileInfo(newValues);
        }}


        validationSchema={Yup.object().shape({
          salutation: Yup.string()
            .required("Please select salutation")
            .nullable(),
          first_name: Yup.string()
            .matches(Regex.SPECIAL_CHARACTERS, "Please enter valid first name")
            .required("Please enter first name")

            .nullable(),
          week_off: Yup.array()
            .of(Yup.string().required("Please Enter Week off"))
            .required("Please Enter Week off"),
          last_name: Yup.string()
            .required("Please enter last name")
            .matches(Regex.NAME, "Please enter valid first name")
            .nullable(),
          email: Yup.string()
            .required("Please enter a email address")
            .nullable()
            .matches(Regex.EMAIL, "Please enter valid the email address.")
            .email("Please include @"),
          phone: Yup.string()
            .required("Please enter phone number")
            .min(7, "Phone number should be atleast 7 digits.")
            .max(12, "Phone number should be max 12 digits.")
            .matches(Regex.Number, "Please enter valid the phone number.")
            .nullable(),
          mobile: Yup.string()
            .required("Please enter mobile number")
            .min(7, "Mobile number should be atleast 7 digits.")
            .max(12, "Mobile number should not be greater than 12 digits.")
            .matches(Regex.Number, "Please enter valid the Mobile number.")
            .nullable(),
          country_code: Yup.string()
            .required("Please select country code")
            .nullable(),
          country_code_mobile: Yup.string()
            .required("Please select country code")
            .nullable(),
          linkedin_profile: Yup.string()
            .url("Please enter valid LinkedIn Profile link")
            .nullable(),
          office_address: Yup.array().of(
            Yup.object().shape({
              address_line1: Yup.string()
                .required("Please enter address line 1")
                .nullable(),
              country: Yup.string()
                .required("Please select Country")
                .nullable(),
              city: Yup.string().required("Please select city").nullable(),
              state: Yup.string().required("Please select state").nullable(),
              post_code: Yup.string()
                .min(4, "Post Code must be atlease 4 digits.")
                // .matches(Regex.post, "Please enter a valid post code")
                .required("Please enter post code")
                .nullable(),
            })
          ),

          correspondence_address:
            checked == null &&
            Yup.array().of(
              Yup.object().shape({
                address_line1: Yup.string()
                  .required("Please enter address line 1")
                  .nullable(),
                country: Yup.string()
                  .required("Please select Country")
                  .nullable(),
                state: Yup.string().required("Please select state").nullable(),
                city: Yup.string().required("Please select city").nullable(),
                post_code: Yup.string()
                  .required("Please enter post code")
                  .nullable(),
              })
            ),
        })}
      >
        {(props: FormikProps<any>) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleSubmit,
            handleChange,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
            dirty
          } = props;
         console.log(values)
          setDirty(dirty)
          
          return (
            <>
              <Form autoComplete="false">
                {checkIndexOfCorrespondence(values.office_address, values.correspondence_address[0])}
                <Grid style={{ overflow: 'hidden' }} container spacing={4}>
                  <Modal
                    style={{ background: 'red' }}
                    open={open}
                    type={"address"}
                    close={handleModalClose}
                    content={modalContent}
                  />

                  {/* <Grid item xs={12}> */}
                  {/* Bread Crumbs */}
                  {/* <Breadcrumbs aria-label="breadcrumb">
                      <Link color="inherit" href="/">
                        Dashboard
                      </Link>
                      |
                      <Link color="inherit" href="/">
                        My Profile
                      </Link>
                    </Breadcrumbs>
                  </Grid> */}
                  <Grid item xs={12}>
                    {/* Image and User info BOx */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      flexWrap="wrap"
                    >
                      <span
                        style={{ display: "flex", borderWidth: 5, borderColor: '#eee' }}
                        className={classes.fixImage}
                      >
                        {selectedFile ?
                          <img style={{ objectFit: 'contain', borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 5 }} src={preview} height="170px" width="200px" />
                          :
                          file_url ? <img style={{ objectFit: 'contain', borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 5 }} src={file_url} height="170px" width="200px" /> : (
                            <div style={{ width: 200, height: 170, border: '1px solid #ddd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <p style={{ textAlign: 'center', opacity: 0.5 }} >Max 2mb</p>
                            </div>
                          )
                        }
                        <span>
                          <Typography noWrap>
                            <div className="typo-1">
                              SP ID:
                              <span className="bold-green-content">
                                {" "}
                                {user?.unique_code}
                              </span>
                            </div>
                            <div className="typo-1">
                              Response Rate:
                              <span className="bold-green-content">
                                {" "}
                                2 days
                              </span>
                            </div>
                            <div className="typo-1">
                              Rating:
                              <span className="bold-green-content">
                                {" "}
                                4.8 | 5
                              </span>
                            </div>
                          </Typography>
                          <label htmlFor="contained-button-file">
                            <CustomButton
                              component="span"
                              className="doctor-profile-change-button"
                              style={{ marginTop: "25px", marginBottom: 0 }}
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
                            <span style={{ justifyContent: 'center', alignItems: 'center', marginTop: 0, marginLeft: 34 }}>(max 2mb)
                            </span>
                          </label>
                        </span>
                      </span>
                      <FormControl
                        variant="outlined"
                        className={classes.formControlSelect}
                      >
                        {/* <InputLabel
                          variant={"outlined"}
                          id="demo-simple-select-outlined-label"
                        >
                          Status
                        </InputLabel> */}
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          name="is_active"
                          value={values.is_active || 3}
                          onChange={(e) => {
                            if (e.target.value == 1) handleChange(e)
                            changeAccStatus_acc({
                              type:
                                e.target.value == 1
                                  ? "activate"
                                  : e.target.value == 2
                                    ? "inactivate"
                                    : e.target.value == 4
                                      ? "permanentDelete"
                                      : "",
                            }, () => handleChange(e));
                          }}

                          style={{
                            color: "#085044 !important",
                            fontWeight: 600,
                            width: 200, marginLeft: 15,
                            textAlign: "center"
                          }}
                          className="status-drop-down active-select MuiInputBase-root-visual newbtn"
                        >
                          {/* {is_active && is_active === 1 && ( */}
                          <MenuItem value={1}>Active</MenuItem>
                          {/* )} */}

                          {/* {is_active && is_active === 3 && ( */}
                          <MenuItem style={{ display: 'none' }} value={3}>Unverified</MenuItem>
                          {/* )} */}
                          <MenuItem value={2}>Deactivate</MenuItem>
                          <MenuItem value={4}>Delete</MenuItem>
                          {/* <MenuItem value={30}>Thirty</MenuItem> */}
                        </Select>



                        <span className="newbtn">
                          <Box className={classes.buttonBox}>
                            <CustomButton
                              buttonStyle={{ width: 247, marginRight: -47 }}
                              type="submit"
                              onClick={() => {
                                setTimeout(() => {
                                  if (Object.keys(errors).length > 0) setPopupProps({ message: 'There are required fields you need to fill out.', title: "Required Fields", hideSecondaryButton: true, primaryText: 'Ok' })
                                }, 500)
                                handleSubmit()
                              }}
                              // onClick={() => {
                              //   window.scrollTo(0, 0)
                              //   const newValues = JSON.parse(JSON.stringify(values))
                              //   newValues.correspondence_address[0].type = "1"
                              //   // console.log('enter data', newValues)
                              //   saveDoctorPersonalProfileInfo(newValues);
                              // }}
                              variant="contained"
                              className={`register-button ${classes.BottomButtons}`}
                            >
                              Save
                            </CustomButton>
                          </Box>
                        </span>

                      </FormControl>


                    </Box>
                  </Grid>

                  <Grid item xs={12} lg={12}>
                    {/* First Name*/}

                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={3}>
                        <CustomTextField
                          fullWidth

                          className="login-text-field first-name-salutaion-field"
                          autoComplete="off"
                          variant="outlined"
                          color="#085044"
                          fieldName="First Name"
                          name="first_name"
                          required
                          id="input-with-dropdown"
                          placeholder="First Name"
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
                                    value={values.salutation + ''}
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
                      <Grid item xs={12} lg={3}>
                        {/* Middle Name */}
                        <CustomTextField
                          fullWidth
                          color="#085044"
                          fieldName="Middle Name"
                          placeholder="Middle Name"
                          className="login-text-field"
                          variant="outlined"
                          name="middle_name"
                          id="middleName"
                          value={values.middle_name || ""}
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Grid>
                      <Grid item xs={12} lg={3}>
                        {/* Last Name */}
                        <CustomTextField
                          fullWidth
                          fieldName="Last Name"
                          required
                          color="#085044"
                          className="login-text-field"
                          variant="outlined"
                          name="last_name"
                          id="lastName"
                          placeholder="Last Name"
                          value={values.last_name}
                          type="text"
                          helperText={
                            errors.last_name && touched.last_name
                              ? errors.last_name
                              : ""
                          }
                          error={
                            errors.last_name && touched.last_name ? true : false
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Grid>
                      <Grid item xs={12} lg={3}>
                        {/* Email id */}
                        <CustomTextField
                          fullWidth
                          fieldName="Email Id"
                          className="login-text-field"
                          variant="outlined"
                          required
                          disabled
                          color="#085044"
                          name="email"
                          id="email"
                          placeholder="Email Address"
                          value={values.email}
                          type="text"
                          helperText={
                            errors.email && touched.email ? errors.email : ""
                          }
                          error={errors.email && touched.email ? true : false}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Grid>
                       
                      <Grid item xs={12} lg={3}>
{/* Phone Number */}
<CustomTextField

  fullWidth
  fieldName="Phone Number"
  className="login-text-field"
  variant="outlined"
  name="phone"
  color="#085044"
  id="input-with-dropdown"
  required
  placeholder="Phone"
  value={values.phone}
  type="text"
  helperText={
    (errors.country_code || errors.phone) &&
      (touched.country_code || touched.phone)
      ? errors.phone || errors.country_code
      : ""
  }
  error={
    (errors.country_code || errors.phone) &&
      (touched.country_code || touched.phone)
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
            style={{ color: "#085044" }}
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
            {dialCodes
              .sort((a: any, b: any) => {
                return a - b;
              })
              .map((item) => {
                return (
                  <MenuItem style={{ color: "#085044" }} value={`+${item}`}>
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
/>
</Grid>


<Grid item xs={12} lg={3}>
<CustomTextField
  fullWidth
  fieldName={"Mobile Number"}
  className="login-text-field"
  variant="outlined"
  name="mobile"
  id="input-with-dropdown"
  required
  color="#085044"
  placeholder="Mobile number"
  value={values.mobile}
  type="text"
  helperText={
    errors.mobile && touched.mobile ? errors.mobile : ""
  }
  error={errors.mobile && touched.mobile ? true : false}
  onChange={handleChange}
  onBlur={handleBlur}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <FormControl className={classes.formControl}>
          <Select
            style={{ color: "#085044" }}
            id="country_code_mobile"
            name="country_code_mobile"
            value={values.country_code_mobile || "+1"}
            disableUnderline
            onChange={handleChange}
            error={
              errors.country_code_mobile &&
                touched.country_code_mobile
                ? true
                : false
            }
          >
            {dialCodes
              .sort((a: any, b: any) => {
                return a - b;
              })
              .map((item) => {
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
/>
</Grid>








{/* 
                      <Grid item xs={12} lg={3}>
                        
                        <CustomTextField

                          fullWidth
                          fieldName="Phone Number"
                          className="login-text-field"
                          variant="outlined"
                          name="phone"
                          color="#085044"
                          id="input-with-dropdown"
                          required
                          placeholder="Phone"
                          value={values.phone}
                          type="text"
                          helperText={
                            (errors.country_code_mobile || errors.phone) &&
                              (touched.country_code_mobile || touched.phone)
                              ? errors.phone || errors.country_code_mobile
                              : ""
                          }
                          error={
                            (errors.country_code_mobile || errors.phone) &&
                              (touched.country_code_mobile || touched.phone)
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
                                    style={{ color: "#085044" }}
                                    id="country_code_mobile"
                                    name="country_code_mobile"
                                    value={values.country_code_mobile || "+1"}
                                    disableUnderline
                                    onChange={handleChange}
                                    error={
                                      errors.country_code_mobile &&
                                        touched.country_code_mobile
                                        ? true
                                        : false
                                    }
                                  >
                                    {dialCodes
                                      .sort((a: any, b: any) => {
                                        return a - b;
                                      })
                                      .map((item) => {
                                        return (
                                          <MenuItem style={{ color: "#085044" }} value={`+${item}`}>
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
                        />
                      </Grid>


                      <Grid item xs={12} lg={3}>
                        <CustomTextField
                          fullWidth
                          fieldName={"Mobile Number"}
                          className="login-text-field"
                          variant="outlined"
                          name="mobile"
                          id="input-with-dropdown"
                          required
                          color="#085044"
                          placeholder="Mobile number"
                          value={values.mobile}
                          type="text"
                          helperText={
                            errors.mobile && touched.mobile ? errors.mobile : ""
                          }
                          error={errors.mobile && touched.mobile ? true : false}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FormControl className={classes.formControl}>
                                  <Select
                                    style={{ color: "#085044" }}
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
                                    {dialCodes
                                      .sort((a: any, b: any) => {
                                        return a - b;
                                      })
                                      .map((item) => {
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
                        />
                      </Grid> */}


                      
                      <Grid item xs={12} lg={3}>
                        {/* Week Off */}
                        <CustomTextField
                          fullWidth
                          fieldName="Week Leaves /Offs"
                          className="login-text-field"
                          variant="outlined"
                          value={""}
                          name="week_off"
                          inputProps={{ min: "2021/01/11" }}
                          id="weekOff"
                          placeholder="weekOff"
                          defaultValue={new Date().toLocaleDateString()}
                          type="date"
                          helperText={
                            errors.week_off && touched.week_off
                              ? errors.week_off
                              : ""
                          }
                          error={
                            errors.week_off && touched.week_off ? true : false
                          }
                          onChange={(e) => {
                            let D1: any = new Date(values?.week_off[0]);
                            let CD: any = new Date(e.target.value);
                            if (
                              values?.week_off.length > 1 &&
                              values?.week_off.length > 0
                            ) {
                              if (D1 < CD) {
                                let newWeek = JSON.parse(
                                  JSON.stringify(values?.week_off)
                                );
                                if (newWeek[1] === undefined) {
                                  if (D1 > CD) {
                                    let d1 = e.target.value;
                                    let d2 = newWeek[0];
                                    setFieldValue("week_off", [d1, d2]);
                                    return;
                                  }
                                  newWeek.push(e.target.value);
                                } else {
                                  newWeek[1] = e.target.value;
                                }
                                setFieldValue("week_off", newWeek);
                              } else {
                                let newWeek = JSON.parse(
                                  JSON.stringify(values?.week_off)
                                );
                                newWeek[0] = e.target.value;
                                newWeek.splice(1, 1);
                                setFieldValue("week_off", newWeek);
                              }
                            } else {
                              setFieldValue(`week_off`, [
                                ...values?.week_off,
                                e.target.value,
                              ]);
                            }
                          }}
                          onBlur={handleBlur}
                        />

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            width: "118%",
                          }}
                        >
                          {values.week_off.length > 0 && values.week_off?.map &&
                            values?.week_off?.map(
                              (item, index) =>
                                index < 2 && (
                                  <span
                                    onClick={() => {
                                      setFieldValue(
                                        "week_off",
                                        values?.week_off.filter(
                                          (item, index_1) => {
                                            return index !== index_1;
                                          }
                                        )
                                      );
                                    }}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      padding: "2px 10px",
                                      minWidth: "116px",
                                    }}
                                  >
                                    <Typography>
                                      {index == 0 && <span>Start-Date: </span>}
                                      {index == 1 && <span>End-Date: </span>}
                                      {item}
                                    </Typography>
                                    <RemoveCircleIcon
                                      style={{
                                        fontSize: "22px",
                                        marginLeft: "10px",
                                      }}
                                    />
                                  </span>
                                )
                            )}
                        </div>
                      </Grid>

                      {/* Office Address Starts */}
                      <Grid item xs={12} lg={12}>
                        {/* Office Address */}
                        <FieldArray
                          name="office_address"
                          render={({ insert, remove, push }) => (
                            <>
                              <Box
                                style={{ marginTop: 20 }}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mb={3}
                              >
                                <Box display="flex" alignItems="center">
                                  <Typography
                                    variant="h4"
                                    className="office-address-title"
                                  >
                                    Office Address
                                  </Typography>
                                  <InfoIcon
                                    fontSize="large"
                                    className="add-info-icon"
                                  />
                                </Box>
                                <Tooltip title="Add More">
                                  <IconButton aria-label="add-more">
                                    <AddCircleIcon
                                      onClick={() => {

                                        insert(0, {
                                          address_line1: "",
                                          country: "",
                                          state: "",
                                          post_code: "",
                                          same_as_correspondence: 0,
                                          type: '0'
                                        })
                                      }

                                      }
                                      fontSize="large"
                                      className={
                                        classes.fab + " add-icon pointer"
                                      }
                                    />
                                  </IconButton>
                                </Tooltip>
                              </Box>

                              {values?.office_address?.filter(address => address.type == '0')?.length > 0 &&
                                values?.office_address?.filter(address => address.type == '0').map(
                                  (item: any, index: any) => (
                                    <div className="work-inner-box" style={{ display: 'flex', alignItems: 'center' }} >

                                      <Grid style={{ marginTop: index ? 20 : 0 }} container spacing={3}>
                                        <Grid item xs={12}>
                                          <CustomTextField
                                            fullWidth
                                            fieldName={"Address Line"}
                                            variant="outlined"
                                            required
                                            className="login-text-field address-line-1"
                                            name={`office_address.${index}.address_line1`}
                                            placeholder="Address Line 1"
                                            value={item.address_line1}
                                            style={{ marginButtom: "15px", color: '#085044' }}
                                            onChange={(e) => {
                                              handleChange(e);
                                              if (checked == index) {
                                                setFieldValue(
                                                  `correspondence_address.${0}.address_line1`,
                                                  e.target.value
                                                );
                                              }
                                            }}
                                            onBlur={handleBlur}
                                          />
                                          {errors &&
                                            errors.office_address &&
                                            errors.office_address[index] &&
                                            errors.office_address[index]
                                              .address_line1 &&
                                            touched &&
                                            touched.office_address &&
                                            touched.office_address[index] &&
                                            touched.office_address[index]
                                              .address_line1 && (
                                              <div className="field-error">
                                                {
                                                  errors.office_address[index]
                                                    .address_line1
                                                }
                                              </div>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} lg={3}>
                                          <label
                                            htmlFor={`office_address.${index}.country`}
                                          >
                                            Country
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <Select
                                            placeholder="Country"
                                            labelId="demo-mutiple-checkbox-label"
                                            id="country"
                                            name={`office_address[${index}].country`}
                                            variant="outlined"
                                            className={` ${classes.selectEmpty
                                              } ${errors.office_address &&
                                              errors.office_address[index] &&
                                              errors.office_address[index]
                                                .country &&
                                              touched.office_address &&
                                              touched.office_address[index] &&
                                              touched.office_address[index]
                                                .country &&
                                              classes.border_fix
                                              } no-scrooll input-label login-text-field `}
                                            onChange={(e: any) => {
                                              if (checked == index) {
                                                setFieldValue(
                                                  `correspondence_address[${0}].country`,
                                                  e.target.value
                                                );
                                              }
                                              return (
                                                console.log(e.target.value),
                                                handleChange(e),
                                                setCountry(e.target.value),
                                                setFieldValue(
                                                  `office_address[${index}].state`,
                                                  ""
                                                ),
                                                setFieldValue(
                                                  `office_address[${index}].city`,
                                                  ""
                                                )
                                              );
                                            }}
                                            value={item.country}
                                          >
                                            {countries.map(
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
                                            errors.office_address &&
                                            errors.office_address[index] &&
                                            errors.office_address[index]
                                              .country &&
                                            touched &&
                                            touched.office_address &&
                                            touched.office_address[index] &&
                                            touched.office_address[index]
                                              .country && (
                                              <div className="field-error">
                                                {
                                                  errors.office_address[index]
                                                    .country
                                                }
                                              </div>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} lg={3}>
                                          <label
                                            htmlFor={`office_address.${index}.state`}
                                          >
                                            State
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <Select
                                            labelId="demo-mutiple-checkbox-label"
                                            id="state"
                                            name={`office_address.${index}.state`}
                                            variant="outlined"
                                            className={` ${classes.selectEmpty
                                              } ${errors.office_address &&
                                              errors.office_address[index] &&
                                              errors.office_address[index]
                                                .state &&
                                              touched.office_address &&
                                              touched.office_address[index] &&
                                              touched.office_address[index]
                                                .state &&
                                              classes.border_fix
                                              } no-scrooll input-label login-text-field `}
                                            onChange={(e:any) => {
                                              handleChange(e);
                                              setCountryState(e.target.value);
                                              setFieldValue(
                                                `office_address.${index}.city`,
                                                ""
                                              );

                                              if (checked == index) {
                                                setFieldValue(
                                                  `correspondence_address.${0}.state`,
                                                  e.target.value
                                                );
                                              }
                                              setState_city(
                                                e.target.value.toString()
                                              );
                                            }}
                                            value={item.state}
                                          >
                                            {states?.map((item) => {
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
                                            errors.office_address &&
                                            errors.office_address[index] &&
                                            errors.office_address[index]
                                              .state &&
                                            touched &&
                                            touched.office_address &&
                                            touched.office_address[index] &&
                                            touched.office_address[index]
                                              .state && (
                                              <div className="field-error">
                                                {
                                                  errors.office_address[index]
                                                    .state
                                                }
                                              </div>
                                            )}
                                        </Grid>
                                        <Grid lg={3} xs={12} item>
                                          <label
                                            htmlFor={`workExperinceInfoData[${index}].city`}
                                          >
                                            City
                                            {checked == null && (
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>
                                            )}
                                          </label>

                                          <Select
                                            labelId="demo-mutiple-checkbox-label"
                                            id="city"
                                            name={`office_address.${index}.city`}
                                            variant="outlined"
                                            className={` ${classes.selectEmpty
                                              } ${errors.office_address &&
                                              errors.office_address[index] &&
                                              errors.office_address[index]
                                                .city &&
                                              errors.office_address &&
                                              errors.office_address[index] &&
                                              errors.office_address[index]
                                                .city &&
                                              classes.border_fix
                                              } no-scrooll input-label `}
                                            onChange={(e) => {
                                              handleChange(e);
                                              if (checked == index) {
                                                setFieldValue(
                                                  `correspondence_address.${0}.city`,
                                                  e.target.value
                                                );
                                              }
                                            }}
                                            value={item.city}
                                          >
                                            {/* mapping city */}
                                            {cities.map((item) => {
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
                                            errors.office_address &&
                                            errors.office_address[index] &&
                                            errors.office_address[index].city &&
                                            touched &&
                                            touched.office_address &&
                                            touched.office_address[index] &&
                                            touched.office_address[index]
                                              .city && (
                                              <div className="field-error">
                                                {
                                                  errors.office_address[index]
                                                    .city
                                                }
                                              </div>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} lg={3}>
                                          <CustomTextField
                                            fullWidth
                                            fieldName="Zip code /Post code"
                                            className="login-text-field"
                                            name={`office_address.${index}.post_code`}
                                            placeholder="Zip code /Post code"
                                            variant="outlined"
                                            required
                                            type="text"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                              handleChange(e);
                                              if (checked == index) {
                                                setFieldValue(
                                                  `correspondence_address.${index}.post_code`,
                                                  e.target.value
                                                );
                                              }
                                            }}
                                            value={item.post_code}
                                            helperText={
                                              errors &&
                                              errors.office_address &&
                                              errors.office_address[index] &&
                                              errors.office_address[index]
                                                .post_code &&
                                              touched &&
                                              touched.office_address &&
                                              touched.office_address[index] &&
                                              touched.office_address[index]
                                                .post_code &&
                                              errors.office_address[index]
                                                .post_code
                                            }
                                            error={
                                              errors &&
                                                errors.office_address &&
                                                errors.office_address[index] &&
                                                errors.office_address[index]
                                                  .post_code &&
                                                touched &&
                                                touched.office_address &&
                                                touched.office_address[index] &&
                                                touched.office_address[index]
                                                  .post_code
                                                ? true
                                                : false
                                            }
                                          />
                                        </Grid>

                                        <Box display="flex" alignItems="center" style={{ marginBottom: "20px" }}>
                                          <Checkbox
                                            checked={checked == index}
                                            onChange={() => {
                                              if (checked == index) {
                                                setChecked(null);
                                                setFieldValue("correspondence_address", [{ address_line1: "", country: "", state: "", post_code: "", city: "" }])
                                              } else {
                                                setChecked(index);
                                                setFieldValue(`correspondence_address`, [item]);
                                              }
                                              setFieldTouched(`correspondence_address[0].country`, false);
                                              setFieldTouched(`correspondence_address[0].state`, false);
                                              setFieldTouched(`correspondence_address[0].city`, false);
                                            }}
                                            inputProps={{ "aria-label": "" }}
                                            onBlur={handleBlur}
                                          />
                                          <Typography>
                                            Correspondence Address same as
                                            office address
                                          </Typography>
                                        </Box>
                                      </Grid>

                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="flex-end"
                                      >
                                        <Tooltip title="Remove">
                                          <IconButton aria-label="remove">
                                            <RemoveCircleIcon
                                              onClick={() => {
                                                handleModalClose();
                                                setModalContent({
                                                  ...item,
                                                  message: "Are you sure you want to delete this office address section?",
                                                  setField: () => values?.office_address.length == 1 ? setFieldValue('office_address', office_address_interface) : remove(index)
                                                });
                                              }}
                                              fontSize="large"
                                              className={
                                                classes.fab +
                                                " add-icon pointer"
                                              }
                                            />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </div>

                                  )
                                )}
                            </>
                          )}
                        />
                      </Grid>

                      {/* Corrospondence Address */}
                      <Grid item xs={12} lg={12}>
                        <FieldArray
                          name="correspondence_address"
                          render={({ insert, remove, push }) => (
                            <>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mb={3}
                              >
                                <Box display="flex" alignItems="center">
                                  <Typography
                                    variant="h4"
                                    className="office-address-title"
                                  >
                                    Correspondence Address
                                  </Typography>
                                  <InfoIcon
                                    fontSize="large"
                                    className="add-info-icon"
                                  />
                                </Box>
                              </Box>

                              {values?.correspondence_address?.length > 0 &&
                                values.correspondence_address.map(
                                  (item: any, index: any) => (
                                    <>
                                      <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                          <CustomTextField
                                            fullWidth
                                            required={
                                              !checked
                                            }
                                            variant="outlined"
                                            className="login-text-field address-line-1"
                                            name={`correspondence_address.${index}.address_line1`}
                                            placeholder="Address Line 1"
                                            fieldName="Address Line"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={item.address_line1}
                                            disabled={
                                              checked != null ? true : false
                                            }
                                            helperText={
                                              errors &&
                                              errors.correspondence_address &&
                                              errors.correspondence_address[
                                              index
                                              ] &&
                                              errors.correspondence_address[
                                                index
                                              ].address_line1 &&
                                              touched &&
                                              touched.correspondence_address &&
                                              touched.correspondence_address[
                                              index
                                              ] &&
                                              touched.correspondence_address[
                                                index
                                              ].address_line1 &&
                                              errors.correspondence_address[
                                                index
                                              ].address_line1
                                            }
                                            error={
                                              errors &&
                                                errors.correspondence_address &&
                                                errors.correspondence_address[
                                                index
                                                ] &&
                                                errors.correspondence_address[
                                                  index
                                                ].address_line1 &&
                                                touched &&
                                                touched.correspondence_address &&
                                                touched.correspondence_address[
                                                index
                                                ] &&
                                                touched.correspondence_address[
                                                  index
                                                ].address_line1
                                                ? true
                                                : false
                                            }
                                          />
                                        </Grid>
                                        <Grid item xs={12} lg={3}>
                                          <label
                                            htmlFor={`correspondence_address.${index}.country`}
                                          >
                                            Country
                                            {checked == null && (
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>
                                            )}
                                          </label>
                                          <Select
                                            disabled={
                                              checked != null ? true : false
                                            }
                                            placeholder="Country"
                                            value={item.country}
                                            labelId="demo-mutiple-checkbox-label"
                                            id="country"
                                            name={`correspondence_address.${index}.country`}
                                            variant="outlined"
                                            className={` ${classes.selectEmpty
                                              } ${errors.correspondence_address &&
                                              errors.correspondence_address[
                                              index
                                              ] &&
                                              errors.correspondence_address[
                                                index
                                              ].country &&
                                              classes.border_fix
                                              } no-scrooll input-label login-text-field `}
                                            onChange={(e: any) => {
                                              return (
                                                handleChange(e),
                                                setCountry(e.target.value),
                                                setFieldValue(
                                                  `correspondence_address.${index}.state`,
                                                  ""
                                                ),
                                                setFieldValue(
                                                  `correspondence_address[${index}].city`,
                                                  ""
                                                )
                                              );
                                            }}
                                          >
                                            {countries.map((item) => (
                                              <MenuItem
                                                key={item?.currency}
                                                value={item?.name}
                                              >
                                                <ListItemText
                                                  primary={item?.name}
                                                />
                                              </MenuItem>
                                            ))}
                                          </Select>

                                          {errors &&
                                            errors.correspondence_address &&
                                            errors.correspondence_address[
                                            index
                                            ] &&
                                            errors.correspondence_address[index]
                                              .country &&
                                            touched &&
                                            touched.correspondence_address &&
                                            touched.correspondence_address[
                                            index
                                            ] &&
                                            touched.correspondence_address[
                                              index
                                            ].country && (
                                              <div className="field-error">
                                                {
                                                  errors.correspondence_address[
                                                    index
                                                  ].country
                                                }
                                              </div>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} lg={3}>
                                          <label
                                            htmlFor={`correspondence_address.${index}.state`}
                                          >
                                            State/Province
                                            {checked == null && (
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>
                                            )}
                                          </label>
                                          <Select
                                            labelId="demo-mutiple-checkbox-label"
                                            id="state"
                                            fullWidth
                                            disabled={
                                              checked != null ? true : false
                                            }
                                            variant="outlined"
                                            className={`login-text-field address-line-1 ${errors.correspondence_address &&
                                              errors.correspondence_address[
                                              index
                                              ] &&
                                              errors.correspondence_address[
                                                index
                                              ].state &&
                                              classes.border_fix
                                              }`}
                                            name={`correspondence_address.${index}.state`}
                                            placeholder="State"
                                            value={item.state}
                                            onChange={(e : any) => (
                                              handleChange(e),
                                              setCountryState(e.target.value),
                                              setFieldValue(
                                                `correspondence_address[${index}].city`,
                                                ""
                                              )
                                            )}
                                          >
                                            {states?.map((item) => {
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
                                            errors.correspondence_address &&
                                            errors.correspondence_address[
                                            index
                                            ] &&
                                            errors.correspondence_address[index]
                                              .state &&
                                            touched &&
                                            touched.correspondence_address &&
                                            touched.correspondence_address[
                                            index
                                            ] &&
                                            touched.correspondence_address[
                                              index
                                            ].state && (
                                              <div className="field-error">
                                                {
                                                  errors.correspondence_address[
                                                    index
                                                  ].state
                                                }
                                              </div>
                                            )}
                                        </Grid>

                                        <Grid lg={3} xs={12} item>
                                          <label
                                            htmlFor={`correspondence_address.${index}.city`}
                                          >
                                            City
                                            {checked == null && (
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>
                                            )}
                                          </label>

                                          <Select
                                            labelId="demo-mutiple-checkbox-label"
                                            id="city"
                                            name={`correspondence_address.${index}.city`}
                                            variant="outlined"
                                            disabled={
                                              checked !== null ? true : false
                                            }
                                            className={` ${classes.selectEmpty
                                              } ${errors.correspondence_address &&
                                              errors.correspondence_address[
                                              index
                                              ] &&
                                              errors.correspondence_address[
                                                index
                                              ].city &&
                                              classes.border_fix
                                              } no-scrooll input-label `}
                                            onChange={(e) => {
                                              handleChange(e);
                                            }}
                                            value={item.city}
                                          >
                                            {/* {City.getCitiesOfState(
                                              State.getAllStates().filter(
                                                (items) => {
                                                  return (
                                                    items.name == item.state
                                                  );
                                                }
                                              )[0]?.countryCode,
                                              State.getAllStates().filter(
                                                (items) => {
                                                  return (
                                                    items.name == item.state
                                                  );
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
                                            })} */}

                                            {cities.map((item) => {
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
                                            errors.correspondence_address &&
                                            errors.correspondence_address[
                                            index
                                            ] &&
                                            errors.correspondence_address[index]
                                              .city &&
                                            touched &&
                                            touched.correspondence_address &&
                                            touched.correspondence_address[
                                            index
                                            ] &&
                                            touched.correspondence_address[
                                              index
                                            ].city && (
                                              <div className="field-error">
                                                {
                                                  errors.correspondence_address[
                                                    index
                                                  ].city
                                                }
                                              </div>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} lg={3}>
                                          <CustomTextField
                                            fullWidth
                                            fieldName="Zip code /Post code"
                                            className="login-text-field"
                                            name={`correspondence_address.${index}.post_code`}
                                            placeholder="Zip code /Post code"
                                            variant="outlined"
                                            type="text"
                                            value={item.post_code}
                                            disabled={
                                              checked != null ? true : false
                                            }
                                            onChange={handleChange}
                                            required={
                                              checked == null ? "required" : ""
                                            }
                                            onBlur={handleBlur}
                                            helperText={
                                              errors &&
                                              errors.correspondence_address &&
                                              errors.correspondence_address[
                                              index
                                              ] &&
                                              errors.correspondence_address[
                                                index
                                              ].post_code &&
                                              touched &&
                                              touched.correspondence_address &&
                                              touched.correspondence_address[
                                              index
                                              ] &&
                                              touched.correspondence_address[
                                                index
                                              ].post_code &&
                                              errors.correspondence_address[
                                                index
                                              ].post_code
                                            }
                                            error={
                                              errors &&
                                                errors.correspondence_address &&
                                                errors.correspondence_address[
                                                index
                                                ] &&
                                                errors.correspondence_address[
                                                  index
                                                ].post_code &&
                                                touched &&
                                                touched.correspondence_address &&
                                                touched.correspondence_address[
                                                index
                                                ] &&
                                                touched.correspondence_address[
                                                  index
                                                ].post_code
                                                ? true
                                                : false
                                            }
                                          />
                                        </Grid>
                                      </Grid>
                                    </>
                                  )
                                )}
                            </>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    {/* LInked IN Profile */}
                    <CustomTextField
                      fullWidth
                      fieldName={"LinkedIn Profile (Paste profile Link)"}
                      className="login-text-field pl-15  mb-30"
                      variant="outlined"
                      name="linkedin_profile"
                      id="linkedInProfile"
                      placeholder="LinkedIn Profile"
                      value={values.linkedin_profile}
                      type="text"
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                </Grid>
              </Form>
              <Grid container spacing={2}>
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

                {/* {Object.keys(errors).length} */}

                <Grid item xs={12}>
                  {/* BUttons Bottom */}
                  <Box style={{ display: 'flex', alignItems: 'center' }} className={classes.buttonBox}>
                    <div style={{ width: 'auto', marginLeft: 'auto', marginRight: 30, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }} className={'work-inner-box'} >
                      <p >Fields with "<p style={{ color: 'red', display: 'inline' }} > * </p>" are compulsory for profile verification</p>
                    </div>
                    <CustomButton
                      type="submit"
                      // onClick={() => {
                      //   window.scrollTo(0, 0)
                      //   const newValues = JSON.parse(JSON.stringify(values))
                      //   newValues.correspondence_address[0].type = "1"
                      //   console.log('enter data', newValues)
                      //   saveDoctorPersonalProfileInfo(newValues);
                      // }}

                      onClick={() => {
                        setTimeout(() => {
                          if (Object.keys(errors).length > 0) setPopupProps({ message: 'There are required fields you need to fill out.', title: "Required Fields", hideSecondaryButton: true, primaryText: 'Ok' })
                        }, 500)
                        handleSubmit()
                      }}


                      variant="contained"
                      className={`register-button ${classes.BottomButtons}`}
                    >
                      save
                    </CustomButton>
                    <div style={{ width: 0 }} />
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
            </>
          );
        }}

      </Formik>
    </div>
  );
};

export default React.forwardRef(PersonalInfo);