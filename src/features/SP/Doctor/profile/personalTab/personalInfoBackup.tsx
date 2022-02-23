import React, { useState, useEffect } from "react";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "../../../../../components/modal/modal";
import { Country, State, City } from "country-state-city";
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
import { Formik, Form, FormikProps, FieldArray, Field } from "formik";
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
import CustomInput from "../../../../reusable/customInput/customInput";
import { useFieldArray, useForm } from "react-hook-form";

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
  same_as_correspondence: Boolean;
}[] = [
    {
      address_line1: "",
      country: "",
      state: "",
      post_code: "",
      same_as_correspondence: false,
      city: "",
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

const PersonalInfo: React.FC<any> = ({
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
}) => {
  const ProfileUserState = useSelector((state) => state);

  const [week_off, setWeekOff] = useState(user_details?.week_off)

  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const officeAddresses = useFieldArray({
    control,
    name: "office_address", // unique name for your Field Array
    keyName: "office_address"
    // keyName: "id", default to "id", you can change the key name
  });
  const onSubmit = (data: any) => console.log(data);

  useEffect(() => {
    console.log(watch('office_address'))
  }, [watch('office_address.0.address_line1')])

  useEffect(() => reset({ office_address: [{ address_line1: 'some address' }] }), [])

  const filterOfficeAddress = user_addresses?.length > 0 ? user_addresses : [];
  const defOfficeAddress = user_addresses?.length > 0 ? user_addresses : [];
  let caddress =
    defOfficeAddress?.length > 0
      ? defOfficeAddress.filter((item, index) => {
        if (
          item.type == "2" ||
          item.type == 2 ||
          item.type == "1" ||
          item.type == 1 ||
          item.type == null
        ) {
          return { ...item, city: item?.city };
        }
      })
      : [];


  const [active, setActive] = useState<number>(1);
  useEffect(() => {
    setActive(is_active);

    dispatch(loadSpinner());
    setintitialStateValue({
      is_active: is_active,
      country_code: country_code || "+1",
      salutation: salutation || "0",
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      email: email,
      phone: phone,
      mobile: mobile,

      linkedin_profile: user_details?.linkedin_profile,
      office_address: !isEmpty(defOfficeAddress)
        ? defOfficeAddress.filter((item) => {
          return item.type == 0;
        })
        : office_address_interface,
      correspondence_address: !isEmpty(caddress)
        ? caddress
        : correspondence_address_interface,
    });

    dispatch(closeSpinner());
  }, [is_active, country_code]);


  const deleteAddress = (data: any) => { };

  const [intitialStateValue, setintitialStateValue] = useState({
    is_active: is_active,
    salutation: salutation || "0",
    // week_off: weekOff || [],
    first_name: first_name,
    middle_name: middle_name,
    last_name: last_name,
    email: email,
    country_code: country_code,
    phone: phone,
    mobile: phone,
    linkedin_profile: user_details?.linkedin_profile,
    office_address: !isEmpty(defOfficeAddress)
      ? defOfficeAddress.map((item) => {
        return { ...item, same_as_correspondence: item.type };
      })
      : office_address_interface,
    correspondence_address: !isEmpty(caddress)
      ? caddress
      : correspondence_address_interface,
  });

  const dispatch = useAppDispatch();

  const classes = useStyles();
  const { user } = useAppSelector(selectLogin);
  const [dropDownValue, setDropDownValue] = React.useState("");
  const [age, setAge] = React.useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [countries, setCountries] = useState(Country.getAllCountries());
  const [country, setCountry] = useState("");
  const [checked, setChecked] = React.useState<any>(null);
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  const [open, setOpen] = React.useState(false);

  const handleModalClose = () => {
    setOpen(!open);
  };

  const [modalContent, setModalContent] = useState<any>({});

  useEffect(() => {

    console.log("TOKEN", Auth.getToken().token)
    dispatch(loadSpinner());

    let activeindex;
    defOfficeAddress.forEach(async (item, index) => {
      if (item.type === 1 || item.type == "1") {
        activeindex = index;
        return index;
      }
    });

    if (activeindex !== undefined) {
      setChecked(activeindex);
    }

    setintitialStateValue({
      is_active: is_active || 3,
      country_code: country_code || "+1",
      salutation: salutation || "0",
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      email: email,
      phone: phone,
      mobile: mobile,

      linkedin_profile: user_details?.linkedin_profile,
      office_address: !isEmpty(defOfficeAddress)
        ? defOfficeAddress.map((item) => {
          return { ...item, same_as_correspondence: item.type };
        })
        : office_address_interface,
      correspondence_address: !isEmpty(caddress)
        ? defOfficeAddress.filter((item) => {
          return item.type === "1" || item.type === 1 || item.type === null;
        })
        : correspondence_address_interface,
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
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        mobile: data.phone,
        linkedin_profile: data.linkedin_profile,
        office_address: data.office_address,
        correspondence_address: data.correspondence_address,
      })
    ).then(async (result) => {
      if (result?.payload.length !== undefined) {
        Toast.success("Successfully Saved Personal Info");
        await dispatch(fetchProfileAsync());
      }
      if (result?.payload?.response?.data?.statusCode == 400) {
        Toast.error(result?.payload?.response?.data?.message);
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
        Toast.error(result?.payload?.response?.data?.message);
      }
      dispatch(closeSpinner());
    });
  };
  const stateStore = useSelector((state) => state["profile"]);

  const [State_DP, setState_city] = useState("");

  const changeAccStatus_acc = (payload) => {
    dispatch(changeAccStatus(payload))
      .then((result) => {
        if (result?.payload?.data?.statusCode == 200) {
          Toast.success(result?.payload.data.message);
        } else {
          Toast.error(result?.payload.data.message);
        }
      })
      .catch((err) => {
        Toast.error(err?.message);
      });
  };



  return (
    <div className={`${classes.root1} doctor-profile-personal-info-tab `}>
      <Formik
        enableReinitialize
        initialValues={intitialStateValue}
        onSubmit={(values: any, actions) => {
          saveDoctorPersonalProfileInfo(values);
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
                .matches(Regex.post, "Please enter a valid post code")
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
          } = props;

          const handleCheckBoxChange = (
            /* event: React.ChangeEvent<HTMLInputElement> */ index
          ) => {
            if (checked == index) {
              setChecked(null);
              values.correspondence_address[0] = {
                address_line1: "",
                country: "",
                state: "",
                post_code: "",
                city: "",
              };
              setintitialStateValue(values);
            } else {
              values.correspondence_address[0] = values?.office_address[index];
              setintitialStateValue(values);
              setChecked(index);
            }
          };
          return (
            <>

              <Form autoComplete="false">

                <Grid container spacing={4}>
                  <Modal
                    open={open}
                    type={"address"}
                    close={handleModalClose}
                    content={modalContent}
                  />
                  <Grid item xs={12}>
                    {/* <AutoErrorMessage /> */}
                  </Grid>
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
                        style={{ display: "flex" }}
                        className={classes.fixImage}
                      >
                        {selectedFile ?
                          <img src={preview} height="170px" width="200px" />
                          :
                          file_url ? <img src={file_url} height="170px" width="200px" /> : (
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
                              style={{ marginTop: "25px" }}
                            >
                              Change Picture
                              <input
                                hidden
                                id="contained-button-file"
                                type="file"
                                accept="image/*"
                                onChange={onSelectFile}
                              />
                            </CustomButton>
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
                          fullWidth
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          name="is_active"
                          value={values.is_active || 3}
                          onChange={(e) => {
                            handleChange(e);
                            changeAccStatus_acc({
                              type:
                                e.target.value == 1
                                  ? "activate"
                                  : e.target.value == 2
                                    ? "inactivate"
                                    : e.target.value == 4
                                      ? "permanentDelete"
                                      : "",
                            });
                          }}

                          style={{
                            color: "#085044 !important",
                            fontWeight: 600,
                          }}
                          className="status-drop-down active-select"
                        >
                          {/* {is_active && is_active === 1 && ( */}
                          <MenuItem value={1}>Active</MenuItem>
                          {/* )} */}

                          {/* {is_active && is_active === 3 && ( */}
                          <MenuItem value={3}>Unverified</MenuItem>
                          {/* )} */}
                          <MenuItem value={2}>Deactivate</MenuItem>
                          <MenuItem value={4}>Delete</MenuItem>
                          {/* <MenuItem value={30}>Thirty</MenuItem> */}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Grid item xs={12} lg={12}>

                    {/* First Name*/}

                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={3}>
                        <CustomInput
                          textFieldProps={{
                            placeholder: 'First Name',
                            defaultValue: values?.first_name,
                            ...register("first_name", { required: 'First name is required' }),
                            field_name: "first_name",
                            error: errors.first_name
                          }}

                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FormControl className={classes.formControl}>
                                  <Select
                                    {...register("salutation")}
                                    defaultValue={values.salutation + ''}
                                    disableUnderline
                                  >
                                    <MenuItem value={"0"}>Mr</MenuItem>
                                    <MenuItem value={"1"}>Dr</MenuItem>
                                    <MenuItem value={"2"}>Miss</MenuItem>
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

                        <CustomInput
                          textFieldProps={{
                            placeholder: 'Middle Name',
                            defaultValue: values?.middle_name,
                            ...register("middle_name", { required: 'Middle name is required' }),
                            field_name: "middle_name",
                            error: errors.middle_name
                          }}
                        />
                      </Grid>

                      {/* Last Name */}

                      <Grid item xs={12} lg={3}>
                        <CustomInput
                          textFieldProps={{
                            placeholder: 'Last Name',
                            defaultValue: values?.last_name,
                            ...register("last_name", { required: 'Last name is required' }),
                            field_name: "last_name",
                            error: errors.last_name
                          }}
                        />
                      </Grid>

                      {/* Email id */}

                      <Grid item xs={12} lg={3}>
                        <CustomInput
                          textFieldProps={{
                            placeholder: 'Email Id',
                            defaultValue: values?.email,
                            ...register("email", { required: 'Email is required' }),
                            field_name: "email",
                            error: errors.email
                          }}
                        />
                      </Grid>

                      {/* Phone Number */}

                      <Grid item xs={12} lg={3}>
                        <CustomInput
                          textFieldProps={{
                            placeholder: 'Phone Number',
                            defaultValue: values?.phone,
                            ...register("phone", { required: 'Phone Number is required' }),
                            field_name: "phone",
                            error: errors.phone
                          }}

                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FormControl className={classes.formControl}>
                                  <Select
                                    {...register("phone_code")}
                                    defaultValue={values.phone_code || "+1"}
                                    disableUnderline>
                                    {dialCodes.sort((a, b) => a - b).map((item) => <MenuItem value={`+${item}`}>{`+${item}`}</MenuItem>)}
                                  </Select>
                                </FormControl>
                                <Typography>|</Typography>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      {/* Mobile number */}

                      <Grid item xs={12} lg={3}>
                        <CustomInput
                          textFieldProps={{
                            placeholder: 'Mobile Number',
                            defaultValue: values?.mobile,
                            ...register("mobile", { required: 'Mobile Number is required' }),
                            field_name: "mobile",
                            error: errors.mobile
                          }}

                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FormControl className={classes.formControl}>
                                  <Select
                                    {...register("country_code")}
                                    defaultValue={values.country_code || "+1"}
                                    disableUnderline>
                                    {dialCodes.sort((a, b) => a - b).map((item) => <MenuItem value={`+${item}`}>{`+${item}`}</MenuItem>)}
                                  </Select>
                                </FormControl>
                                <Typography>|</Typography>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      {/* Week Off */}

                      <Grid item xs={12} lg={3}>
                        <WeekOffInput onValueChange={setWeekOff} value={week_off} />
                      </Grid>

                      {/* Office Address Starts */}

                      <Grid item xs={12} lg={12}>

                        {/* Office Address */}

                        <Box display="flex" alignItems="center">
                          <Typography variant="h4" className="office-address-title"  >Office Address</Typography>
                          <InfoIcon fontSize="large" className="add-info-icon" />
                          <IconButton style={{ marginLeft: 'auto' }} aria-label="add-more">
                            <AddCircleIcon
                              onClick={() => officeAddresses.insert(0, { address_line1: "", country: "", state: "", post_code: "", same_as_correspondence: 0, })}
                              fontSize="large"
                              className={classes.fab + " add-icon pointer"} />
                          </IconButton>
                        </Box>

                        {/* <AddressForm address={values?.office_address[0]} onChange={console.log} /> */}

                        {officeAddresses.fields.map((field, index) => (
                          <AddressForm key={field.office_address} arrayName="office_address" errors={errors} index={index} register={register} />
                        ))}

                        <FieldArray
                          name="office_address"
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
                                      onClick={() =>
                                        insert(0, {
                                          address_line1: "",
                                          country: "",
                                          state: "",
                                          post_code: "",
                                          same_as_correspondence: 0,
                                        })
                                      }
                                      fontSize="large"
                                      className={
                                        classes.fab + " add-icon pointer"
                                      }
                                    />
                                  </IconButton>
                                </Tooltip>
                              </Box>

                              {values?.office_address?.length > 0 &&
                                values.office_address.map(
                                  (item: any, index: any) => (
                                    <>
                                      {index > 0 && (
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
                                                    setField: () =>
                                                      setFieldValue(
                                                        `office_address`,
                                                        values.office_address.filter(
                                                          (item, index_1) => {
                                                            return (
                                                              index !== index_1
                                                            );
                                                          }
                                                        )
                                                      ),
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
                                      )}
                                      <Grid container spacing={3}>
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
                                            onChange={(e) => {
                                              handleChange(e);
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

                                        <Box display="flex" alignItems="center">
                                          <Checkbox
                                            checked={
                                              item.same_as_correspondence == 1
                                                ? true
                                                : false
                                            }
                                            onChange={() => {
                                              if (
                                                item.same_as_correspondence == 0
                                              ) {
                                                setFieldValue(
                                                  `office_address.${index}.same_as_correspondence`,
                                                  1
                                                );
                                                setChecked(index);
                                                setFieldValue(
                                                  `correspondence_address`,
                                                  [item]
                                                );
                                                values.office_address.forEach(
                                                  (item, index_index) => {
                                                    return (
                                                      index !== index_index &&
                                                      setFieldValue(
                                                        `office_address.${index_index}.same_as_correspondence`,
                                                        0
                                                      )
                                                    );
                                                  }
                                                );
                                              } else {
                                                setFieldValue(
                                                  `office_address.${index}.same_as_correspondence`,
                                                  0
                                                );
                                                setChecked(null);
                                                setFieldValue(
                                                  "correspondence_address",
                                                  [
                                                    {
                                                      address_line1: "",
                                                      country: "",
                                                      state: "",
                                                      post_code: "",
                                                      city: "",
                                                    },
                                                  ]
                                                );
                                              }
                                              setFieldTouched(
                                                `correspondence_address[0].country`,
                                                false
                                              );
                                              setFieldTouched(
                                                `correspondence_address[0].state`,
                                                false
                                              );
                                              setFieldTouched(
                                                `correspondence_address[0].city`,
                                                false
                                              );
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
                                    </>
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
                                            onChange={(e) => (
                                              handleChange(e),
                                              setFieldValue(
                                                `correspondence_address[${index}].city`,
                                                ""
                                              )
                                            )}
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

                <Grid item xs={12}>
                  {/* BUttons Bottom */}
                  <Box className={classes.buttonBox}>
                    <CustomButton
                      type="submit"
                      onClick={handleSubmit}
                      variant="contained"
                      className={`register-button ${classes.BottomButtons}`}
                    >
                      save details
                    </CustomButton>
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

export default PersonalInfo;

const WeekOffInput = ({ value, onValueChange }) => {
  const [date0, setDate0] = useState(value['0'])
  const [date1, setDate1] = useState(value['1'])

  const onChange = (event) => {
    let selectedDate = new Date(event.target.value)
    if (!date0) return setDate0(event.target.value)
    if (selectedDate.getTime() <= new Date(date0).getTime()) return setDate0(event.target.value)
    else return setDate1(event.target.value)
  }

  useEffect(() => onValueChange({ 0: date0, 1: date1 }), [date0, date1])

  return (
    <div>
      <CustomInput
        textFieldProps={{
          placeholder: 'Week Leaves /Offs',
          onChange: onChange,
          field_name: "week_off",
          defaultValue: date0,
          type: "date",
          inputProps: { min: "2021/01/11" }
        }}
      />
      <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', paddingTop: 10 }} >
        {date0 && <div style={{ display: "flex", flexWrap: "nowrap", width: "118%" }}  >
          <Typography style={{ fontSize: 14 }} >Start-Date: {date0} </Typography>
          <RemoveCircleIcon onClick={() => setDate1(null)} style={{ fontSize: "22px", marginLeft: "10px" }}
          />
        </div>}
        {date1 && <div style={{ display: "flex", flexWrap: "nowrap", width: "118%" }}  >
          <Typography style={{ fontSize: 14 }} >End-Date: {date1} </Typography>
          <RemoveCircleIcon onClick={() => setDate1(null)} style={{ fontSize: "22px", marginLeft: "10px" }}
          />
        </div>}
      </div>
    </div>

  )
}

const AddressForm = ({ errors, index, register, arrayName, key }) => {
  return (
    <Grid container key={key} spacing={3}>
      <Grid item xs={6}>
        <CustomInput
          textFieldProps={{
            placeholder: 'Address',
            ...register(`${arrayName}.${index}.address_line1`, { required: 'Address is required' }),
            // field_name: "${arrayName}.${index}.address_line1",
            error: errors?.[arrayName]?.[index]?.address_line1
          }} />
      </Grid>
      <Grid item xs={6}>
        <CustomInput
          textFieldProps={{
            placeholder: 'Address',
            ...register(`office_address.${index}.address_line2`, { required: 'Address is required' }),
            // field_name: "office_address.${index}.address_line2",
            error: errors?.[arrayName]?.[index]?.address_line2
          }} />
      </Grid>
    </Grid>
  )
}