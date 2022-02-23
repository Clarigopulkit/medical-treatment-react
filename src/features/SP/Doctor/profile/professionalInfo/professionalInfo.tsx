import React, { ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from "react";
import {
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  ListItemText,
  Checkbox,
  Box,
  InputAdornment,
  FormControl,
} from "@material-ui/core";
import Modal from "../../../../../components/modal/modal";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import axios from "axios";
import { map, filter, head, get, isEmpty, isArray } from "lodash";
import { Autocomplete } from "@material-ui/lab";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Formik, Form, FormikProps, FieldArray, FormikConfig } from "formik";
import * as Yup from "yup";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useAppDispatch } from "../../../../../hooks/hooks";
import CustomButton from "../../../../reusable/customButton/customButton";
import CustomTextField from "../../../../reusable/customTextField/customTextField";
import { fetchDoctorProfessionalInfoAsync } from "./professionalInfoSlice";
import "./professionalInfo.scss";
import { objectToFormData } from "../../../../../utils/apiHelpers";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import {
  closeSpinner,
  loadSpinner,
} from "../../../../../reducres/reducers/spinner";
import Toast from "../../../../../reducres/reducers/toast";
import { Regex } from "../../../../../utils/validations";
import { fetchProfileAsync } from "../../../../profile/profileSlice";
import { dialCodes } from "../../../../../utils/dialCodes/dialCodes";
import { City, Country, State } from "country-state-city";
import CustomPopup from "../../../../reusable/customPopup/customPopup";
const useStyles = makeStyles((theme: Theme) => ({
  root1: {
    display: "block",
    margin: "0 auto",
  },
  fab: {
    margin: theme.spacing(1),
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
    // margin: theme.spacing(1),

    // width: "65px",
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

  uploadButton: {
    "& > div": {
      padding: "5px !important",
    },
  },
  uploadButton_1: {
    "& > div": {
      borderRadius: "50px !important",
    },
  },
}));

const ProfessionalInfo: ForwardRefRenderFunction<FormikConfig<any>, any> = ({
  user_registration,
  user_education,
  user_work_experience,
  is_active,
  speciality_info,
}, ref: any) => {
  let registrationInfoData: {
    registration_number: string;
    registration_authority: string;
    year: string;
    document: string;
  }[] = [
      {
        registration_number: "",
        registration_authority: "",
        year: "",
        document: "",
      },
    ];
  let educationInfoData: {
    qualification: string;
    college_university: string;
    year: string;
    document: string;
  }[] = [
      {
        qualification: "",
        college_university: "",
        year: "",
        document: "",
      },
    ];
  let specialityInfoData: {}[] = [{}];

  let workExperinceInfoData: {
    role: string;
    clinic_name: string;
    address_line1: string;
    address_line2: string;
    ward: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    duration: string;
    reference: string;
    linkedin_profile: string;
    reference_email: string;
    reference_phone: string;
    current_organization: number;
  }[] = [
      {
        role: "",
        clinic_name: "",
        address_line1: "",
        address_line2: "",
        ward: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        duration: "",
        reference: "",
        linkedin_profile: "",
        reference_email: "",
        reference_phone: "",
        current_organization: 0,
      },
    ];
  let specialityList = [
    { label: "Add New...", value: 7 },
    { label: "  Cardiology - Non Interventional", value: 0 },
    { label: "  Corneal Transplant..", value: 1 },
    { label: "  General Surgery.", value: 2 },
    { label: "  Infectious Diseases.", value: 3 },
    { label: "  In-Vitro Fertilisation (IVF)", value: 4 },
    { label: "  Laboratory Medicine.", value: 5 },
    { label: " Medical Gastroenterology ", value: 6 },

  ];
  let speciality: any = [];

  const [intialValidValues, setInitialStateValue] = useState({
    registrationInfoData:
      user_registration && !isEmpty(user_registration)
        ? user_registration.map((item) => {
          return {
            registration_authority: item.registration_authority,
            registration_number: item.registration_number,
            year: item.year,
            id: item.id,
            document: [item.document],
          };
        })
        : registrationInfoData,
    educationInfoData:
      user_education && !isEmpty(user_education)
        ? user_education.map((item) => {
          return {
            ...item,
            document: [item.document],
          };
        })
        : educationInfoData,
    workExperinceInfoData:
      user_work_experience && !isEmpty(user_work_experience)
        ? user_work_experience.map((item) => {
          return {
            id: item?.id,
            user_id: item?.user_id,
            role: item?.role,
            clinic_name: item?.clinic_name,
            ward: item?.ward,
            address_line1: item?.address_line1,
            address_line2: item?.address_line2,
            city: item?.city,
            state: item?.state,
            country: item?.country,
            zipcode: item?.zipcode,
            duration: item?.duration,
            country_code: item?.country_code,
            reference: item?.reference,
            linkedin_profile: item?.linkedin_profile,
            reference_email: item?.reference_email,
            reference_phone: item?.reference_phone,
            current_organization: item?.current_organization,
          };
        })
        : workExperinceInfoData,
    speciality:
      speciality_info &&
        speciality_info?.speciality &&
        speciality_info?.speciality != "" &&
        speciality_info?.speciality != "null"
        ? JSON.parse(speciality_info?.speciality)
        : [],
  });

  useEffect(() => {
    setInitialStateValue({
      registrationInfoData:
        user_registration && !isEmpty(user_registration)
          ? user_registration.map((item) => {
            return {
              registration_authority: item.registration_authority,
              registration_number: item.registration_number,
              year: item.year,
              id: item.id,
              document: [item.document],
            };
          })
          : registrationInfoData,
      educationInfoData:
        user_education && !isEmpty(user_education)
          ? user_education.map((item) => {
            return {
              ...item,
              document: [item.document],
            };
          })
          : educationInfoData,
      workExperinceInfoData:
        user_work_experience && !isEmpty(user_work_experience)
          ? user_work_experience.map((item) => {
            return {
              id: item?.id,
              user_id: item?.user_id,
              role: item?.role,
              clinic_name: item?.clinic_name,
              address_line1: item?.address_line1,
              address_line2: item?.address_line2,
              ward: item?.ward,
              city: item?.city,
              state: item?.state,
              country: item?.country,
              zipcode: item?.zipcode,
              duration: item?.duration,
              country_code: item?.country_code,
              reference: item?.reference,
              linkedin_profile: item?.linkedin_profile,
              reference_email: item?.reference_email,
              reference_phone: item?.reference_phone,
              current_organization: item?.current_organization,
            };
          })
          : workExperinceInfoData,
      speciality:
        speciality_info &&
          speciality_info?.speciality &&
          speciality_info?.speciality != "" &&
          speciality_info?.speciality != "null"
          ? JSON.parse(speciality_info?.speciality)
          : [],
    });
  }, [
    speciality_info,
    user_work_experience,
    user_education,
    user_registration,
  ]);

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState("");
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [checked, setChecked] = React.useState(null);

  // For select drop down for year

  function yearfunction() {
    const year = (new Date()).getFullYear();
    const yearsList = Array.from(new Array(30), (val, index) => year - index);
    return yearsList;
  }

  // For select drop down for year sinceyear
  function sincefunction() {
    const sinceyear = 1;
    const sinceyearList = Array.from(new Array(50), (val, index) => sinceyear + index);
    return sinceyearList;
  }

  const [years, setYears] = useState(yearfunction());
  const [since, setSince] = useState(sincefunction());

  const handleCheckBoxChange = (index) => {
    if (checked == index) {
      setChecked(null);
    } else {
      setChecked(index);
    }
  };

  const [fieldGet, setFieldGet] = useState<any>();
  const [fieldenable, setFieldenable] = useState<any>(false);
  const [specialityError, SetspecialityError] = useState(false);

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

  // useEffect(() => {
  //   if (country) {
  //     let auth_token = sessionStorage.getItem("token");

  //     axios({
  //       method: "GET",

  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${auth_token}`,
  //       },
  //     }).then((response) => {
  //       setCountries(
  //         countries.map((item, index) => {
  //           return item.country_name === country
  //             ? { ...item, states: response.data }
  //             : item;
  //         })
  //       );
  //     });
  //   }
  // }, [country]);

  const [state, setState] = useState("");

  // useEffect(() => {
  //   if (state) {
  //     let auth_token = sessionStorage.getItem("token");

  //     axios({
  //       method: "GET",

  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${auth_token}`,
  //       },
  //     }).then((response) => {
  //       setCountries(
  //         countries.map((item, index) => {
  //           if (item.country_name === country) {
  //             return {
  //               ...item,
  //               states: item.states.map((item_item) => {
  //                 return item_item.state_name == state
  //                   ? {
  //                     ...item_item,
  //                     city:
  //                       response.data.length > 0
  //                         ? response.data
  //                         : [{ city_name: state }],
  //                   }
  //                   : item_item;
  //               }),
  //             };
  //           } else {
  //             return item;
  //           }
  //         })
  //       );
  //     });
  //   }
  // }, [state]);

  const saveDoctorProfessionalProfileInfo = async (data: any) => {
    let formData = new FormData();

    let register = data.registrationInfoData.map((item) => {
      return { ...item, document: item.document[0] };
    });

    formData = objectToFormData(register, "registration", formData);

    let register_educationInfoData = data.educationInfoData.map((item) => {
      return { ...item, document: item.document[0] };
    });

    formData = objectToFormData(
      register_educationInfoData,
      "education",
      formData
    );

    formData = objectToFormData(
      [...data.workExperinceInfoData],
      "workExperince",
      formData
    );
    formData = objectToFormData([...data.speciality], "speciality", formData);

    console.log(JSON.stringify(formData, null, 2))

    dispatch(loadSpinner());

    dispatch(fetchDoctorProfessionalInfoAsync(formData)).then((result) => {
      if (result?.payload?.workExperince !== undefined) {
        Toast.success("Details Saved Successfully");
        dispatch(fetchProfileAsync());
        dispatch(closeSpinner());
      }
      if (result?.payload?.response?.data?.statusCode == 400) {
        let message = result?.payload?.response?.data?.message;
        setPopupProps({ title: 'Error', message, primaryText: 'Ok', hideSecondaryButton: true })
        // Toast.error(message);
        dispatch(closeSpinner());
      }
    });
  };

  const [modalContent, setModalContent] = useState<any>({});
  const [open, setOpen] = useState(false);
  const handleModalClose = () => {
    setOpen(!open);
  };

  useImperativeHandle(ref, () => ({
    onTabChange: (change: () => void) => !dirty ? change() : setPopupProps({ title: 'Caution', message: 'You have unsaved changes. Are you sure you want to change the tab?', onYes: change })
  }))

  const [dirty, setDirty] = useState(false)


  const [type, setType] = useState("");
  const [popupProps, setPopupProps] = useState<any>()
  return (
    <div ref={ref} className={`${classes.root1} doctor-profile-professional-info-tab `}>
      {popupProps && <CustomPopup visible={popupProps ? true : false} dismiss={() => setPopupProps(null)} {...popupProps} />}
      {/* <AutoErrorMessage /> */}
      <Formik
        enableReinitialize
        initialValues={intialValidValues}
        onSubmit={(values: any, actions) => {
          if (values.speciality.length == 0) {
            window.scrollTo(0, 0)
            SetspecialityError(!specialityError);
            setPopupProps({ title: 'Error', message: 'Please Fill all required Fileds.', primaryText: 'Ok', hideSecondaryButton: true })
            // Toast.error("Please Fill all required Fileds.");
            return;
          } else {
            window.scrollTo(0, 0)
            saveDoctorProfessionalProfileInfo(values);
          }
        }}
        validationSchema={Yup.object().shape({
          registrationInfoData: Yup.array().of(
            Yup.object().shape({
              registration_number: Yup.string()
                .matches(
                  Regex.Registeration_number,
                  "Please enter a valid registration number"
                )
                .min(7, "Registration Number must be between 7 to 15 character")
                .max(
                  15,
                  "Registration Number must be between 7 to 15 character"
                )
                .required("Please enter registration number"),
              registration_authority: Yup.string()
                .matches(Regex.NAME, "Must be a String.")
                .required("Please enter registration authority name"),
              year: Yup.string()
                .matches(Regex.Year, "Please enter valid year")
                .required("Please enter year"),
            })
          ),
          educationInfoData: Yup.array().of(
            Yup.object().shape({
              qualification: Yup.string().required(
                "Please enter highest qualification"
              ),
              college_university: Yup.string().required(
                "Please enter a college/university"
              ),
              year: Yup.string().required("Please enter year"),
            })
          ),
          speciality: Yup.array()
            .of(
              Yup.object({
                label: Yup.string().required("Please select Speciality."),
              })
            )
            .required("Please add Speciality")
            .test(
              "speciality-check",
              "Please select Speciality.",
              function (value) {
                return value.length > 0;
              }
            ),
          workExperinceInfoData: Yup.array().of(
            Yup.object().shape({
              role: Yup.string().required("Please enter your role").nullable(),
              clinic_name: Yup.string()
                .required("Please enter Hospital or Clinic name")
                .nullable(),
              address_line1: Yup.string()
                .required("Please enter address Line 1")
                .nullable(),
              // country_code: Yup.string().required(),
              city: Yup.string()
                .matches(
                  Regex.SPECIAL_CHARACTERS,
                  "Please enter valid city name"
                )
                .required("Please enter city name")
                .nullable(),
              state: Yup.string().required("Please select state").nullable(),
              country: Yup.string()
                .required("Please select Country.")
                .nullable(),
              zipcode: Yup.string()
                .min(4, "Post code must be between 4 to 6 number")
                .matches(Regex.post, "Please enter a valid zip code")
                .required("Please enter Post Code.")
                .nullable(),
              duration: Yup.string()
                .required("Please enter duration")
                .nullable(),
              reference: Yup.string()
                .required("Please enter reference doctor name.")
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
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            dirty
          } = props;
          setDirty(dirty)
          return (
            <Form>
              <Modal
                open={open}
                type={type}
                close={handleModalClose}
                content={modalContent}
              />
              <Grid style={{ overflow: 'hidden' }} container spacing={4}>

                <Grid style={{ overflow: 'hidden' }} item xs={12}>
                  <FieldArray
                    name="registrationInfoData"
                    render={({ insert, remove, push }) => (
                      <div className={"mb-1"}>
                        {values.registrationInfoData !== null &&
                          values.registrationInfoData.length > 0 &&
                          values.registrationInfoData.map(
                            (item: any, index: any) => (
                              <div
                                className="row mb-3 d-flex align-items-center"
                                key={index}
                              >
                                {
                                  index==0 &&
                                  <Grid container>
                                  <Grid item lg={6} xs={6} className="office-address-grid">
                                    <Typography className="office-address-title" style={{ marginLeft: 18 }}>
                                      Registration Information
                                    </Typography>
                                    <Tooltip title="Add More">
                                      <IconButton aria-label="add-more">
                                        <AddCircleIcon
                                          onClick={() =>
                                            insert(0, {
                                              registration_number: "",
                                              registration_authority:
                                                "",
                                              year: "",
                                              document: "",
                                            })
                                          }
                                          fontSize="large"
                                          className={
                                            classes.fab +
                                            " add-icon pointer"
                                          }
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                  <Grid item lg={6} xs={6} className="footer-buttons">
                                    <CustomButton style={{ marginRight: 22 }}
                                      onClick={() => {
                                        setTimeout(() => {
                                          if (Object.keys(errors).length > 0) setPopupProps({ message: 'There are required fields you need to fill out.', title: "Required Fields", hideSecondaryButton: true, primaryTest: 'Ok' })
                                        }, 500)
                                        handleSubmit()
                                      }}
                                      type="submit"
                                      variant="contained"
                                      className={`register-button ${classes.BottomButtons}`}
                                    >
                                      save
                                    </CustomButton>
                                  </Grid>
                                </Grid>
                                }
                                <div className="col-10 ">
                                  <div className="work-inner-box">
                                    <Grid
                                      container
                                      direction="row"
                                      className=""
                                      spacing={2}
                                    >
                                      <Grid item lg={5} xs={12}>
                                        <div className="professional-grid-item">
                                          <CustomTextField

                                            fullWidth
                                            fieldName="Registration Number"
                                            variant="outlined"
                                            className="login-text-field"
                                            required color="#085044"
                                            name={`registrationInfoData.${index}.registration_number`}
                                            placeholder="Registration Number"
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={
                                              item.registration_number
                                            }
                                            helperText={
                                              errors &&
                                              errors.registrationInfoData &&
                                              errors.registrationInfoData[
                                              index
                                              ] &&
                                              errors.registrationInfoData[index]
                                                .registration_number &&
                                              touched &&
                                              touched.registrationInfoData &&
                                              touched.registrationInfoData[
                                              index
                                              ] &&
                                              touched.registrationInfoData[
                                                index
                                              ].registration_number &&
                                              errors.registrationInfoData[index]
                                                .registration_number
                                            }
                                            error={
                                              errors &&
                                                errors.registrationInfoData &&
                                                errors.registrationInfoData[
                                                index
                                                ] &&
                                                errors.registrationInfoData[index]
                                                  .registration_number &&
                                                touched &&
                                                touched.registrationInfoData &&
                                                touched.registrationInfoData[
                                                index
                                                ] &&
                                                touched.registrationInfoData[
                                                  index
                                                ].registration_number
                                                ? true
                                                : false
                                            }
                                          />
                                        </div>
                                      </Grid>
                                      <Grid item lg={5} xs={12}>
                                        <CustomTextField
                                          fullWidth
                                          required color="#085044"
                                          fieldName="Registration Authority"
                                          className="login-text-field input-with-dropdown"
                                          name={`registrationInfoData.${index}.registration_authority`}
                                          placeholder="Registration Authority"
                                          type="text"
                                          variant="outlined"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          value={
                                            item.registration_authority
                                          }
                                          helperText={
                                            errors &&
                                            errors.registrationInfoData &&
                                            errors.registrationInfoData[
                                            index
                                            ] &&
                                            errors.registrationInfoData[index]
                                              .registration_authority &&
                                            touched &&
                                            touched.registrationInfoData &&
                                            touched.registrationInfoData[
                                            index
                                            ] &&
                                            touched.registrationInfoData[index]
                                              .registration_authority &&
                                            errors.registrationInfoData[index]
                                              .registration_authority
                                          }
                                          error={
                                            errors &&
                                              errors.registrationInfoData &&
                                              errors.registrationInfoData[
                                              index
                                              ] &&
                                              errors.registrationInfoData[index]
                                                .registration_authority &&
                                              touched &&
                                              touched.registrationInfoData &&
                                              touched.registrationInfoData[
                                              index
                                              ] &&
                                              touched.registrationInfoData[index]
                                                .registration_authority
                                              ? true
                                              : false
                                          }
                                        />
                                      </Grid>
                                      {/* years */}


                                      <Grid item lg={2} xs={12}>
                                        <Box
                                          display="flex"
                                          alignItems="flex-start"
                                        >
                                          <span style={{ flex: "0.9" }}>

                                            <label
                                              htmlFor={`registrationInfoData.${index}.year`}
                                            >
                                              Year{" "}
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>
                                            </label>

                                            <Select
                                              labelId="demo-mutiple-checkbox-label"
                                              id="Year"
                                              name={`registrationInfoData.${index}.year`}
                                              variant="outlined"
                                              placeholder="Year"
                                              className={` ${classes.selectEmpty
                                                } ${errors &&
                                                errors.registrationInfoData &&
                                                errors.registrationInfoData[
                                                index
                                                ] &&
                                                errors.registrationInfoData[
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
                                              errors.registrationInfoData &&
                                              errors.registrationInfoData[
                                              index
                                              ] &&
                                              errors.registrationInfoData[index]
                                                .year &&
                                              touched &&
                                              touched.registrationInfoData &&
                                              touched.registrationInfoData[
                                              index
                                              ] &&
                                              touched.registrationInfoData[index]
                                                .country && (
                                                <div className="field-error">
                                                  {
                                                    errors.registrationInfoData[
                                                      index
                                                    ].year
                                                  }
                                                </div>
                                              )}
                                          </span>
                                          <span
                                            style={{
                                              flex: "0.1",
                                              display: "flex",
                                              justifyContent: "flex-end",
                                              alignItems: "center",
                                              marginTop: "5px"
                                            }}
                                          >

                                            <Tooltip title="Remove">
                                              <IconButton aria-label="remove">
                                                <RemoveCircleIcon
                                                  onClick={() => {
                                                    handleModalClose();
                                                    setType("registration");
                                                    setModalContent({
                                                      ...item,
                                                      message: "Are you sure you want to delete this registration information section?",
                                                      setField: () =>
                                                        setFieldValue(
                                                          `registrationInfoData`,
                                                          values.registrationInfoData.filter(
                                                            (
                                                              item,
                                                              index_1
                                                            ) => {
                                                              return (
                                                                index !==
                                                                index_1
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

                                          </span>


                                        </Box>



                                      </Grid>

                                      <Grid item lg={4} xs={12}>
                                        <CustomTextField
                                          variant="outlined" color="#085044"
                                          fullWidth
                                          className={classes.uploadButton}
                                          name={`registrationInfoData.${index}.document`}
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
                                              let size: number =
                                                event.target.files[0].size;
                                              if (size / 1024 <= 10240) {
                                                setFieldValue(
                                                  `registrationInfoData.${index}.document`,
                                                  [event.target.files[0]]
                                                );
                                              } else {
                                                setPopupProps({ title: 'File size', hideSecondaryButton: true, primaryText: 'Ok', message: 'File must be smaller than 10MB.' })
                                              }
                                            } else {
                                              setPopupProps({ title: 'Valid file', hideSecondaryButton: true, primaryText: 'Ok', message: 'Please upload a valid file/image.' })
                                              // Toast.error(
                                              //   "Please upload a valid  file/image"
                                              // );
                                            }
                                          }}
                                          placeholder="Upload File Images/pdf"
                                          value={
                                            item?.document?.name ||
                                            item.document
                                          }
                                          InputProps={{
                                            endAdornment: (
                                              <>
                                                <input
                                                  id={`registrationInfoData.${index}.document`}
                                                  hidden
                                                  name={`registrationInfoData.${index}.document`}
                                                  type="file"
                                                  accept="image/*,.pdf"
                                                  multiple
                                                  onChange={async (event) => {
                                                    if (
                                                      event.target.files &&
                                                      event.target.files[0] &&
                                                      (event.target.files[0]?.type.split(
                                                        "/"
                                                      )[0] == "image" ||
                                                        event.target.files[0]
                                                          ?.type ==
                                                        "application/pdf")
                                                    ) {
                                                      let size: number =
                                                        event.target.files[0]
                                                          .size;
                                                      if (
                                                        size / 1024 <=
                                                        10240
                                                      ) {
                                                        setFieldValue(
                                                          `registrationInfoData.${index}.document`,
                                                          [
                                                            event.target
                                                              .files[0],
                                                          ]
                                                        );
                                                      } else {
                                                        setPopupProps({ title: 'Error', message: "File must be smaller than 10mb.", primaryText: 'Ok', hideSecondaryButton: true })
                                                        // Toast.error(
                                                        //   "File must be smaller than 10mb."
                                                        // );
                                                      }
                                                    } else {
                                                      setPopupProps({ title: 'Error', message: "Please upload a valid  file/image", primaryText: 'Ok', hideSecondaryButton: true })
                                                      // Toast.error(
                                                      //   "Please upload a valid  file/image"
                                                      // );
                                                    }
                                                  }}
                                                />

                                                <label
                                                  htmlFor={`registrationInfoData.${index}.document`}
                                                >
                                                  <CustomButton
                                                    component="span"
                                                    className="upload-button"
                                                  >
                                                    upload
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
                                          overflowX: "hidden",
                                          overflowY: "hidden",
                                          width: "100%",
                                          display: "felx",
                                        }}
                                      >
                                        {item?.document &&
                                          item?.document !== "" &&
                                          item.document.map(
                                            (item_item, index_2) => {
                                              return (
                                                item_item !== null && (
                                                  <span
                                                    style={{
                                                      position: "relative",
                                                      display: "inline-block",
                                                    }}
                                                  >
                                                    {item_item !== null &&
                                                      (item_item?.type !==
                                                        "application/pdf" ||
                                                        item_item?.type ==
                                                        undefined ? (
                                                        <>
                                                          {item_item.slice(
                                                            -3
                                                          ) !== "pdf" ? (
                                                            <a
                                                              target="_blank"
                                                              href={
                                                                typeof item_item ==
                                                                  "string"
                                                                  ? item_item
                                                                  : item_item !==
                                                                    null
                                                                    ? URL.createObjectURL(
                                                                      item_item
                                                                    )
                                                                    : ""
                                                              }
                                                            >
                                                              <img
                                                                style={{
                                                                  wordBreak:
                                                                    "break-all",
                                                                  padding:
                                                                    "10px",
                                                                  maxWidth:
                                                                    "270px",
                                                                  width:
                                                                    "270px",
                                                                  height:
                                                                    "170px",
                                                                  objectFit: 'contain', borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 5
                                                                }}
                                                                src={
                                                                  typeof item_item ==
                                                                    "string"
                                                                    ? item_item
                                                                    : item_item !==
                                                                      null
                                                                      ? URL.createObjectURL(
                                                                        item_item
                                                                      )
                                                                      : ""
                                                                }
                                                                height="150px"
                                                                alt={
                                                                  typeof item_item ==
                                                                    "string"
                                                                    ? item_item
                                                                    : item_item !==
                                                                      null
                                                                      ? URL.createObjectURL(
                                                                        item_item
                                                                      )
                                                                      : ""
                                                                }
                                                              />
                                                            </a>
                                                          ) : (
                                                            <a
                                                              target="_blank"
                                                              href={item_item}
                                                            >
                                                              <img
                                                                style={{
                                                                  wordBreak:
                                                                    "break-all",
                                                                  padding:
                                                                    "10px",
                                                                  maxWidth:
                                                                    "270px",
                                                                  width:
                                                                    "270px",
                                                                  height:
                                                                    "170px",
                                                                  objectFit: 'contain', borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 5
                                                                }}
                                                                src={
                                                                  require("../../../../../utils/images/logoPDF.png")
                                                                    .default
                                                                }
                                                                height="150px"
                                                                alt={item_item}
                                                              />
                                                            </a>
                                                          )}
                                                        </>
                                                      ) : (
                                                        <a
                                                          target="_blank"
                                                          href={URL.createObjectURL(
                                                            item_item
                                                          )}
                                                        >
                                                          <img
                                                            style={{
                                                              wordBreak:
                                                                "break-all",
                                                              padding: "10px",
                                                              maxWidth: "270px",
                                                              width: "270px",
                                                              height: "170px",
                                                              objectFit: 'contain', borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 5
                                                            }}
                                                            src={
                                                              require("../../../../../utils/images/logoPDF.png")
                                                                .default
                                                            }
                                                            height="150px"
                                                            alt={URL.createObjectURL(
                                                              item_item
                                                            )}
                                                          />
                                                        </a>
                                                      ))}
                                                    <Tooltip
                                                      title="Remove Image"
                                                      className="remove_icon pointer"
                                                    >
                                                      <RemoveCircleIcon
                                                        onClick={() => {
                                                          handleModalClose();
                                                          setType(
                                                            "registration"
                                                          );
                                                          setModalContent({
                                                            ...item_item,
                                                            setField: () =>
                                                              setFieldValue(
                                                                `registrationInfoData[${index}].document`,
                                                                item.document.filter(
                                                                  (
                                                                    item,
                                                                    index_1
                                                                  ) => {
                                                                    return (
                                                                      index_2 !==
                                                                      index_1
                                                                    );
                                                                  }
                                                                )
                                                              ),
                                                          });
                                                        }}
                                                      />
                                                      {/* </IconButton> */}
                                                    </Tooltip>
                                                  </span>
                                                )
                                              );
                                            }
                                          )}
                                        {/* ) : (
                                      <img src={item.document} alt="" />
                                    )} */}
                                      </Grid>
                                    </Grid>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    )}
                  />
                </Grid>


                <Grid item xs={12}>
                  <FieldArray
                    name="educationInfoData"
                    render={({ insert, remove, push }) => (
                      <div className={"mb-1"}>
                        {values.educationInfoData !== null &&
                          values.educationInfoData.length > 0 &&
                          values.educationInfoData.map(
                            (item: any, index: any) => (
                              <div
                                className="row mb-3 d-flex align-items-center"
                                key={index}
                              >
                                <div className="col-10">
                                  {index == 0 && <Grid style={{ flexDirection: 'row', alignItems: 'center', display: "flex", justifyContent: 'space-between' }} item xs={12}>
                                    <Typography className="office-address-title">
                                      Education
                                    </Typography>
                                    <Tooltip title="Add More">
                                      <IconButton aria-label="add-more">
                                        <AddCircleIcon
                                          onClick={() =>
                                            insert(0, {
                                              qualification: "",
                                              college_university: "",
                                              year: "",
                                              document: "",
                                            })
                                          }
                                          fontSize="large"
                                          className={
                                            classes.fab +
                                            " add-icon pointer"
                                          }
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>}
                                  <div style={{ display: 'flex', alignItems: 'flex-start' }} >

                                    <div style={{ flex: 1 }} className="work-inner-box">
                                      <Grid container spacing={2}>

                                        <Grid item lg={5} xs={12}>
                                          <CustomTextField
                                            fieldName="Qualification"
                                            required
                                            fullWidth color="#085044"
                                            variant="outlined"
                                            className={`login-text-field ${classes.uploadButton_1}`}
                                            name={`educationInfoData.${index}.qualification`}
                                            placeholder="Qualification"
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={item.qualification}
                                            helperText={
                                              errors &&
                                              errors.educationInfoData &&
                                              errors.educationInfoData[index] &&
                                              errors.educationInfoData[index]
                                                .qualification &&
                                              touched &&
                                              touched.educationInfoData &&
                                              touched.educationInfoData[index] &&
                                              touched.educationInfoData[index]
                                                .qualification &&
                                              errors.educationInfoData[index]
                                                .qualification
                                            }
                                            error={
                                              errors &&
                                                errors.educationInfoData &&
                                                errors.educationInfoData[index] &&
                                                errors.educationInfoData[index]
                                                  .qualification &&
                                                touched &&
                                                touched.educationInfoData &&
                                                touched.educationInfoData[index] &&
                                                touched.educationInfoData[index]
                                                  .qualification
                                                ? true
                                                : false
                                            }
                                          />
                                        </Grid>
                                        <Grid item lg={5} xs={12}>
                                          <CustomTextField
                                            fieldName="College/University"
                                            required color="#085044"
                                            fullWidth
                                            variant="outlined"
                                            className={`login-text-field ${classes.uploadButton_1}`}
                                            name={`educationInfoData.${index}.college_university`}
                                            placeholder="College/University"
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={item.college_university}
                                            helperText={
                                              errors &&
                                              errors.educationInfoData &&
                                              errors.educationInfoData[index] &&
                                              errors.educationInfoData[index]
                                                .college_university &&
                                              touched &&
                                              touched.educationInfoData &&
                                              touched.educationInfoData[index] &&
                                              touched.educationInfoData[index]
                                                .college_university &&
                                              errors.educationInfoData[index]
                                                .college_university
                                            }
                                            error={
                                              errors &&
                                                errors.educationInfoData &&
                                                errors.educationInfoData[index] &&
                                                errors.educationInfoData[index]
                                                  .college_university &&
                                                touched &&
                                                touched.educationInfoData &&
                                                touched.educationInfoData[index] &&
                                                touched.educationInfoData[index]
                                                  .college_university
                                                ? true
                                                : false
                                            }
                                          />
                                        </Grid>
                                        <Grid item lg={2} xs={12}>
                                          <Box
                                            display="flex"
                                            alignItems="flex-start"
                                          >
                                            <span style={{ flex: "0.9" }}>

                                              <label
                                                htmlFor={`educationInfoData.${index}.year`}
                                              >
                                                Year{" "}
                                                <span style={{ color: "red" }}>
                                                  *
                                                </span>
                                              </label>

                                              <Select
                                                labelId="demo-mutiple-checkbox-label"
                                                id="Year"
                                                name={`educationInfoData.${index}.year`}
                                                variant="outlined"
                                                placeholder="Year"
                                                className={` ${classes.selectEmpty
                                                  } ${errors &&
                                                  errors.educationInfoData &&
                                                  errors.educationInfoData[
                                                  index
                                                  ] &&
                                                  errors.educationInfoData[
                                                    index
                                                  ].year &&
                                                  classes.border_fix
                                                  } no-scrooll input-label no-scrooll`}
                                                onChange={(e: any) => {
                                                  return (
                                                    handleChange(e)
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
                                                errors.educationInfoData &&
                                                errors.educationInfoData[
                                                index
                                                ] &&
                                                errors.educationInfoData[index]
                                                  .year &&
                                                touched &&
                                                touched.educationInfoData &&
                                                touched.educationInfoData[
                                                index
                                                ] &&
                                                touched.educationInfoData[index]
                                                  .country && (
                                                  <div className="field-error">
                                                    {
                                                      errors.educationInfoData[
                                                        index
                                                      ].year
                                                    }
                                                  </div>
                                                )}
                                            </span>
                                            <span
                                            style={{flex: "0.1",display: "flex",justifyContent: "flex-end",alignItems: "center",
                                              marginTop: "5px"
                                            }}
                                          >


                                        <Tooltip title="Remove">
                                          <IconButton aria-label="remove">
                                            <RemoveCircleIcon
                                              onClick={() => {
                                                handleModalClose();
                                                setType("education");
                                                setModalContent({
                                                  ...item,
                                                  message: "Are you sure you want to delete this education section ?",
                                                  setField: () =>
                                                    setFieldValue(
                                                      `educationInfoData`,
                                                      values.educationInfoData.filter(
                                                        (
                                                          item,
                                                          index_1
                                                        ) => {
                                                          return (
                                                            index !==
                                                            index_1
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


                                            </span>
                                          </Box>



                                        </Grid>



                                        <Grid item lg={4} xs={12}>
                                          <CustomTextField
                                            color="#085044"
                                            fullWidth
                                            className={classes.uploadButton}
                                            variant="outlined"
                                            name={`educationInfoData.${index}.document`}
                                            placeholder="Upload File Image/pdf"
                                            value={
                                              item.document?.name || item.document
                                            }
                                            InputProps={{
                                              endAdornment: (
                                                <>
                                                  <input
                                                    placeholder="Upload File"
                                                    id={`educationInfoData.${index}.document`}
                                                    hidden
                                                    name={`educationInfoData.${index}.document`}
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    ref={`educationInfoData.${index}.document`}
                                                    multiple
                                                    onChange={(event) => {
                                                      if (
                                                        (event.target.files &&
                                                          event.target.files[0] &&
                                                          event.target.files[0]?.type.split(
                                                            "/"
                                                          )[0] == "image") ||
                                                        event.target.files[0]
                                                          ?.type ==
                                                        "application/pdf"
                                                      ) {
                                                        let size: number =
                                                          event.target.files[0]
                                                            .size;
                                                        if (
                                                          size / 1024 <=
                                                          10240
                                                        ) {
                                                          setFieldValue(
                                                            `educationInfoData.${index}.document`,
                                                            [
                                                              event.target
                                                                .files[0],
                                                            ]
                                                          );
                                                        } else {
                                                          setPopupProps({ title: 'Error', message: "File must be smaller than 10mb.", primaryText: 'Ok', hideSecondaryButton: true })
                                                          // Toast.error(
                                                          //   "File must be smaller than 10mb."
                                                          // );
                                                        }
                                                      } else {
                                                        setPopupProps({ title: 'Error', message: "Please upload a valid  file/image", primaryText: 'Ok', hideSecondaryButton: true })
                                                        // Toast.error(
                                                        //   "Please upload a valid  file/image"
                                                        // );
                                                      }
                                                    }}
                                                  />

                                                  <label
                                                    htmlFor={`educationInfoData.${index}.document`}
                                                  >
                                                    <CustomButton
                                                      component="span"
                                                      className="upload-button"
                                                    >
                                                      upload
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
                                            overflowX: "hidden",
                                            overflowY: "hidden",
                                            width: "100%",
                                            display: "felx",
                                          }}
                                        >
                                          {item?.document &&
                                            item?.document !== "" &&
                                            item.document.map(
                                              (item_item, index_2) => {
                                                return (
                                                  item_item !== null && (
                                                    <span
                                                      style={{
                                                        position: "relative",
                                                        display: "inline-block",
                                                      }}
                                                    >
                                                      {item_item !== null &&
                                                        (item_item?.type !==
                                                          "application/pdf" ||
                                                          item_item?.type ==
                                                          undefined ? (
                                                          <>
                                                            {item_item?.slice(
                                                              -3
                                                            ) !== "pdf" ? (
                                                              <a
                                                                target="_blank"
                                                                href={
                                                                  typeof item_item ==
                                                                    "string"
                                                                    ? item_item
                                                                    : item_item !==
                                                                      null
                                                                      ? URL.createObjectURL(
                                                                        item_item
                                                                      )
                                                                      : ""
                                                                }
                                                              >
                                                                <img
                                                                  style={{
                                                                    wordBreak:
                                                                      "break-all",
                                                                    padding:
                                                                      "10px",
                                                                    maxWidth:
                                                                      "270px",
                                                                    width:
                                                                      "270px",
                                                                    height:
                                                                      "170px",
                                                                    objectFit: 'contain', borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 5
                                                                  }}
                                                                  src={
                                                                    typeof item_item ==
                                                                      "string"
                                                                      ? item_item
                                                                      : item_item !==
                                                                        null
                                                                        ? URL.createObjectURL(
                                                                          item_item
                                                                        )
                                                                        : ""
                                                                  }
                                                                  height="150px"
                                                                  alt={
                                                                    typeof item_item ==
                                                                      "string"
                                                                      ? item_item
                                                                      : item_item !==
                                                                        null
                                                                        ? URL.createObjectURL(
                                                                          item_item
                                                                        )
                                                                        : ""
                                                                  }
                                                                />
                                                              </a>
                                                            ) : (
                                                              <a
                                                                target="_blank"
                                                                href={item_item}
                                                              >
                                                                <img
                                                                  style={{
                                                                    wordBreak:
                                                                      "break-all",
                                                                    padding:
                                                                      "10px",
                                                                    maxWidth:
                                                                      "270px",
                                                                    width:
                                                                      "270px",
                                                                    height:
                                                                      "170px",
                                                                    objectFit: 'contain', borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 5
                                                                  }}
                                                                  src={
                                                                    require("../../../../../utils/images/logoPDF.png")
                                                                      .default
                                                                  }
                                                                  height="150px"
                                                                  alt={item_item}
                                                                />
                                                              </a>
                                                            )}
                                                          </>
                                                        ) : (
                                                          <a
                                                            target="_blank"
                                                            href={URL.createObjectURL(
                                                              item_item
                                                            )}
                                                          >
                                                            <img
                                                              style={{
                                                                wordBreak:
                                                                  "break-all",
                                                                padding: "10px",
                                                                maxWidth: "270px",
                                                                width: "270px",
                                                                height: "170px",
                                                                objectFit: 'contain', borderWidth: 1, borderColor: '#ddd', borderStyle: 'solid', borderRadius: 5
                                                              }}
                                                              src={
                                                                require("../../../../../utils/images/logoPDF.png")
                                                                  .default
                                                              }
                                                              height="150px"
                                                              alt={URL.createObjectURL(
                                                                item_item
                                                              )}
                                                            />
                                                          </a>
                                                        ))}
                                                      <Tooltip title="Remove Image" className="remove_icon pointer">
                                                        <RemoveCircleIcon onClick={() => {
                                                          handleModalClose();
                                                          setType(
                                                            "education document"
                                                          );
                                                          setModalContent({
                                                            ...item_item,
                                                            setField: () =>
                                                              setFieldValue(
                                                                `educationInfoData[${index}].document`,
                                                                item.document.filter(
                                                                  (
                                                                    item,
                                                                    index_1
                                                                  ) => {
                                                                    return (
                                                                      index_2 !==
                                                                      index_1
                                                                    );
                                                                  }
                                                                )
                                                              ),
                                                          });
                                                        }}
                                                        />
                                                      </Tooltip>
                                                    </span>
                                                  )
                                                );
                                              }
                                            )}
                                         
                                        </Grid>
                                      </Grid>
                                    </div>
                                   
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    )}
                  />
                </Grid>


                <Grid style={{ overflow: 'hidden' }} item xs={12}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-around"
                  >
                    <FieldArray
                      name="workExperinceInfoData"
                      render={({ insert, remove, push }) => (
                        <div className={"mb-1"}>
                          {values.workExperinceInfoData !== null &&
                            values.workExperinceInfoData.length > 0 &&
                            values.workExperinceInfoData.map(
                              (item: any, index: any) => (

                                <div>
                                  {index == 0 && (
                                    <Grid style={{ overflow: 'hidden', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} item xs={12}>
                                      <Typography className="office-address-title">
                                        Work Experience
                                      </Typography>

                                      <Tooltip title="Add More">
                                        <IconButton aria-label="add-more">
                                          <AddCircleIcon
                                            onClick={() =>
                                              insert(0, {
                                                role: "",
                                                clinic_name: "",
                                                address_line1: "",
                                                address_line2: "",
                                                city: "",
                                                state: "",
                                                country: "",
                                                zipcode: "",
                                                duration: "",
                                                reference: "",
                                                linkedin_profile: "",
                                                reference_email: "",
                                                reference_phone: "",
                                                current_organization: 0,
                                              })
                                            }
                                            fontSize="large"
                                            className={
                                              classes.fab + " add-icon pointer"
                                            }
                                          />
                                        </IconButton>
                                      </Tooltip>

                                    </Grid>
                                  )}

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    className={`row mb-3 d-flex work-experince-box align-items-center ${index != 0 && "mt-3"
                                      }`}
                                    key={index}
                                  >

                                    <div className="work-inner-box">
                                      <div className="">
                                        <Grid
                                          container
                                          direction="row"
                                          className="professional-info-container"
                                          spacing={2}
                                        >
                                          <Grid item lg={3} xs={12}>
                                            <CustomTextField
                                              fieldName="Your Role"
                                              variant="outlined"
                                              color="#085044"
                                              fullWidth
                                              required
                                              className={`login-text-field ${classes.uploadButton_1}`}
                                              name={`workExperinceInfoData.${index}.role`}
                                              placeholder="Your Role"
                                              type="text"
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              value={item.role}
                                              helperText={
                                                errors &&
                                                errors.workExperinceInfoData &&
                                                errors.workExperinceInfoData[
                                                index
                                                ] &&
                                                errors.workExperinceInfoData[
                                                  index
                                                ].role &&
                                                touched &&
                                                touched.workExperinceInfoData &&
                                                touched.workExperinceInfoData[
                                                index
                                                ] &&
                                                touched.workExperinceInfoData[
                                                  index
                                                ].role &&
                                                errors.workExperinceInfoData[
                                                  index
                                                ].role
                                              }
                                              error={
                                                errors &&
                                                  errors.workExperinceInfoData &&
                                                  errors.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].role &&
                                                  touched &&
                                                  touched.workExperinceInfoData &&
                                                  touched.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  touched.workExperinceInfoData[
                                                    index
                                                  ].role
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </Grid>
                                          <Grid item lg={3} xs={12}>
                                            <CustomTextField
                                              color="#085044"
                                              fieldName="Ward"
                                              variant="outlined"
                                              fullWidth
                                              className={`login-text-field ${classes.uploadButton_1}`}
                                              name={`workExperinceInfoData.${index}.ward`}
                                              placeholder="Ward"
                                              type="text"
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              value={item.ward}
                                              helperText={
                                                errors &&
                                                errors.workExperinceInfoData &&
                                                errors.workExperinceInfoData[
                                                index
                                                ] &&
                                                errors.workExperinceInfoData[
                                                  index
                                                ].Ward &&
                                                touched &&
                                                touched.workExperinceInfoData &&
                                                touched.workExperinceInfoData[
                                                index
                                                ] &&
                                                touched.workExperinceInfoData[
                                                  index
                                                ].Ward &&
                                                errors.workExperinceInfoData[
                                                  index
                                                ].Ward
                                              }
                                              error={
                                                errors &&
                                                  errors.workExperinceInfoData &&
                                                  errors.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].Ward &&
                                                  touched &&
                                                  touched.workExperinceInfoData &&
                                                  touched.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  touched.workExperinceInfoData[
                                                    index
                                                  ].Ward
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </Grid>

                                          <Grid item lg={3} xs={12}>
                                            <CustomTextField
                                              color="#085044"
                                              fieldName="Hospital/Clinic Name"
                                              variant="outlined"
                                              fullWidth
                                              required
                                              className={`login-text-field ${classes.uploadButton_1}`}
                                              name={`workExperinceInfoData.${index}.clinic_name`}
                                              placeholder="Clinic Name"
                                              type="text"
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              value={item?.clinic_name}
                                              helperText={
                                                errors &&
                                                errors.workExperinceInfoData &&
                                                errors.workExperinceInfoData[
                                                index
                                                ] &&
                                                errors.workExperinceInfoData[
                                                  index
                                                ].clinic_name &&
                                                touched &&
                                                touched.workExperinceInfoData &&
                                                touched.workExperinceInfoData[
                                                index
                                                ] &&
                                                touched.workExperinceInfoData[
                                                  index
                                                ].clinic_name &&
                                                errors.workExperinceInfoData[
                                                  index
                                                ].clinic_name
                                              }
                                              error={
                                                errors &&
                                                  errors.workExperinceInfoData &&
                                                  errors.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].clinic_name &&
                                                  touched &&
                                                  touched.workExperinceInfoData &&
                                                  touched.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  touched.workExperinceInfoData[
                                                    index
                                                  ].clinic_name
                                                  ? true
                                                  : false
                                              }
                                            />
                                            {/* </div> */}
                                          </Grid>

                                          <Grid item lg={12} xs={12}>
                                            <div className="professional-grid-item">
                                              {/* <label
                                                  htmlFor={`workExperinceInfoData.${index}.address_line1`}
                                                >
                                                  Address Line 1
                                                </label> */}
                                              <CustomTextField
                                                color="#085044"
                                                fieldName="Address Line 1"
                                                fullWidth
                                                required
                                                variant="outlined"
                                                className={`login-text-field ${classes.uploadButton_1}`}
                                                name={`workExperinceInfoData.${index}.address_line1`}
                                                placeholder="Address Line 1"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={item.address_line1}
                                                helperText={
                                                  errors &&
                                                  errors.workExperinceInfoData &&
                                                  errors.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].address_line1 &&
                                                  touched &&
                                                  touched.workExperinceInfoData &&
                                                  touched.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  touched.workExperinceInfoData[
                                                    index
                                                  ].address_line1 /* 
                                                  <div className="field-error">
                                                    { */ &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].address_line1
                                                  /*  }
                                                    </div> */
                                                }
                                                error={
                                                  errors &&
                                                    errors.workExperinceInfoData &&
                                                    errors.workExperinceInfoData[
                                                    index
                                                    ] &&
                                                    errors.workExperinceInfoData[
                                                      index
                                                    ].address_line1 &&
                                                    touched &&
                                                    touched.workExperinceInfoData &&
                                                    touched.workExperinceInfoData[
                                                    index
                                                    ] &&
                                                    touched.workExperinceInfoData[
                                                      index
                                                    ].address_line1
                                                    ? true
                                                    : false
                                                }
                                              />
                                            </div>
                                          </Grid>

                                          <Grid item lg={3} xs={12}>
                                            <label
                                              htmlFor={`workExperinceInfoData.${index}.country`}
                                            >
                                              Country{" "}
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>
                                            </label>
                                            <Select
                                              style={{ color: "#085044" }}
                                              labelId="demo-mutiple-checkbox-label"
                                              id="country"
                                              name={`workExperinceInfoData.${index}.country`}
                                              variant="outlined"
                                              className={` ${classes.selectEmpty
                                                } ${errors &&
                                                errors.workExperinceInfoData &&
                                                errors.workExperinceInfoData[
                                                index
                                                ] &&
                                                errors.workExperinceInfoData[
                                                  index
                                                ].country &&
                                                classes.border_fix
                                                } no-scrooll input-label no-scrooll`}
                                              onChange={(e: any) => {
                                                return (
                                                  handleChange(e),
                                                  setCountry(e.target.value),
                                                  setFieldValue(
                                                    `workExperinceInfoData.${index}.state`,
                                                    ""
                                                  ),
                                                  setFieldValue(
                                                    `workExperinceInfoData.${index}.city`,
                                                    ""
                                                  )
                                                );
                                              }}
                                              error={true}
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
                                              errors.workExperinceInfoData &&
                                              errors.workExperinceInfoData[
                                              index
                                              ] &&
                                              errors.workExperinceInfoData[index]
                                                .country &&
                                              touched &&
                                              touched.workExperinceInfoData &&
                                              touched.workExperinceInfoData[
                                              index
                                              ] &&
                                              touched.workExperinceInfoData[index]
                                                .country && (
                                                <div className="field-error">
                                                  {
                                                    errors.workExperinceInfoData[
                                                      index
                                                    ].country
                                                  }
                                                </div>
                                              )}
                                          </Grid>

                                          <Grid item lg={3} xs={12}>
                                            <label
                                              htmlFor={`workExperinceInfoData.${index}.state`}
                                            >
                                              State{" "}
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>
                                            </label>

                                            <Select
                                              style={{ color: "#085044" }}
                                              labelId="demo-mutiple-checkbox-label"
                                              id="state"
                                              name={`workExperinceInfoData.${index}.state`}
                                              variant="outlined"
                                              className={` ${classes.selectEmpty
                                                }  ${errors &&
                                                errors.workExperinceInfoData &&
                                                errors.workExperinceInfoData[
                                                index
                                                ] &&
                                                errors.workExperinceInfoData[
                                                  index
                                                ].state &&
                                                classes.border_fix
                                                } no-scrooll input-label `}
                                              onChange={(e) => {
                                                handleChange(e);

                                                setState(
                                                  e.target.value.toString()
                                                );

                                                setFieldValue(
                                                  `workExperinceInfoData.${index}.city`,
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
                                              errors.workExperinceInfoData &&
                                              errors.workExperinceInfoData[
                                              index
                                              ] &&
                                              errors.workExperinceInfoData[index]
                                                .state &&
                                              touched &&
                                              touched.workExperinceInfoData &&
                                              touched.workExperinceInfoData[
                                              index
                                              ] &&
                                              touched.workExperinceInfoData[index]
                                                .state && (
                                                <div className="field-error">
                                                  {
                                                    errors.workExperinceInfoData[
                                                      index
                                                    ].state
                                                  }
                                                </div>
                                              )}
                                          </Grid>

                                          <Grid item lg={3} xs={12}>
                                            <label
                                              htmlFor={`workExperinceInfoData.${index}.city`}
                                            >
                                              City
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>
                                            </label>

                                            <Select
                                              style={{ color: "#085044" }}
                                              labelId="demo-mutiple-checkbox-label"
                                              id="city"
                                              name={`workExperinceInfoData.${index}.city`}
                                              variant="outlined"
                                              className={` ${classes.selectEmpty
                                                }  ${errors &&
                                                errors.workExperinceInfoData &&
                                                errors.workExperinceInfoData[
                                                index
                                                ] &&
                                                errors.workExperinceInfoData[
                                                  index
                                                ].city &&
                                                classes.border_fix
                                                } no-scrooll input-label `}
                                              onChange={(e) => {
                                                handleChange(e);
                                              }}
                                              value={item.city}
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
                                              errors.workExperinceInfoData &&
                                              errors.workExperinceInfoData[
                                              index
                                              ] &&
                                              errors.workExperinceInfoData[index]
                                                .city &&
                                              touched &&
                                              touched.workExperinceInfoData &&
                                              touched.workExperinceInfoData[
                                              index
                                              ] &&
                                              touched.workExperinceInfoData[index]
                                                .city && (
                                                <div className="field-error">
                                                  {
                                                    errors.workExperinceInfoData[
                                                      index
                                                    ].city
                                                  }
                                                </div>
                                              )}
                                          </Grid>

                                          <Grid item lg={3} xs={12}>
                                          <Box
                                          display="flex"
                                          alignItems="flex-start"
                                        >
                                          <span style={{ flex: "0.9" }}>
                                            <div className="professional-grid-item">
                                              <CustomTextField
                                                fieldName="Zip code /Post code"
                                                color="#085044"
                                                required
                                                fullWidth
                                                variant="outlined"
                                                className={`login-text-field ${classes.uploadButton_1}`}
                                                name={`workExperinceInfoData.${index}.zipcode`}
                                                placeholder="Zip code /Post code"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={item.zipcode}
                                                helperText={
                                                  errors &&
                                                  errors.workExperinceInfoData &&
                                                  errors.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].zipcode &&
                                                  touched &&
                                                  touched.workExperinceInfoData &&
                                                  touched.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  touched.workExperinceInfoData[
                                                    index
                                                  ].zipcode &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].zipcode
                                                }
                                                error={
                                                  errors &&
                                                    errors.workExperinceInfoData &&
                                                    errors.workExperinceInfoData[
                                                    index
                                                    ] &&
                                                    errors.workExperinceInfoData[
                                                      index
                                                    ].zipcode &&
                                                    touched &&
                                                    touched.workExperinceInfoData &&
                                                    touched.workExperinceInfoData[
                                                    index
                                                    ] &&
                                                    touched.workExperinceInfoData[
                                                      index
                                                    ].zipcode
                                                    ? true
                                                    : false
                                                }
                                              />
                                            </div>
                                            </span>
                                            <span style={{
                                              flex: "0.1", display: "flex", justifyContent: "flex-end",
                                              alignItems: "center", marginTop: "5px"
                                            }}
                                          >
                                            
                                        <Tooltip title="Remove">
                                        <IconButton aria-label="remove">
                                          <RemoveCircleIcon
                                            fontSize="large"
                                            className={
                                              classes.fab + " add-icon pointer"
                                            }
                                            // onClick={() => {
                                            //   remove(index);
                                            //   if (index == checked) {
                                            //     setChecked(null);
                                            //   }
                                            // }}

                                            onClick={() => {
                                              handleModalClose();
                                              setType("experience");
                                              setModalContent({
                                                ...item,
                                                message: "Are you sure you want to delete this work experience section ?",
                                                setField: () =>
                                                  setFieldValue(
                                                    `workExperinceInfoData`,
                                                    values.workExperinceInfoData.filter(
                                                      (
                                                        item,
                                                        index_1
                                                      ) => {
                                                        return (
                                                          index !==
                                                          index_1
                                                        );
                                                      }
                                                    )
                                                  ),
                                              });
                                            }}

                                          />
                                        </IconButton>
                                      </Tooltip>
                                     
                                          

                                          </span>
                                          </Box>
                                          </Grid>
                                          <Grid item lg={2} xs={12}>
                                            <div className="professional-grid-item">
                                              <label
                                                htmlFor={`workExperinceInfoData.${index}.duration`}
                                              >
                                                Since
                                                <span style={{ color: "red" }}>*</span>

                                              </label>

                                              <Select
                                                style={{ color: "#085044" }}
                                                labelId="demo-mutiple-checkbox-label"
                                                id="Year"
                                                name={`workExperinceInfoData.${index}.duration`}
                                                variant="outlined"
                                                className={` ${classes.selectEmpty
                                                  } ${errors &&
                                                  errors.workExperinceInfoData &&
                                                  errors.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].duration &&
                                                  classes.border_fix
                                                  } no-scrooll input-label no-scrooll`}
                                                onChange={(e: any) => {
                                                  return (
                                                    handleChange(e)
                                                    // setCountry(e.target.value)
                                                  );
                                                }}
                                                error={true}
                                                value={item.duration}
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

                                              {errors &&
                                                errors.workExperinceInfoData &&
                                                errors.workExperinceInfoData[
                                                index
                                                ] &&
                                                errors.workExperinceInfoData[index]
                                                  .duration &&
                                                touched &&
                                                touched.workExperinceInfoData &&
                                                touched.workExperinceInfoData[
                                                index
                                                ] &&
                                                touched.workExperinceInfoData[index]
                                                  .country && (
                                                  <div className="field-error">
                                                    {
                                                      errors.workExperinceInfoData[
                                                        index
                                                      ].duration
                                                    }
                                                  </div>
                                                )}

                                            </div>
                                          </Grid>
                                          <Grid md={8} />
                                          <Grid item lg={3} xs={12}>
                                            <div className="professional-grid-item">
                                              <CustomTextField
                                                color="#085044"
                                                required
                                                fieldName="Reference (Doctor Name)"
                                                variant="outlined"
                                                fullWidth
                                                className={`login-text-field ${classes.uploadButton_1}`}
                                                name={`workExperinceInfoData.${index}.reference`}
                                                placeholder="Reference"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={item.reference}
                                                helperText={
                                                  errors &&
                                                  errors.workExperinceInfoData &&
                                                  errors.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].reference &&
                                                  touched &&
                                                  touched.workExperinceInfoData &&
                                                  touched.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  touched.workExperinceInfoData[
                                                    index
                                                  ].reference &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].reference
                                                }
                                                error={
                                                  errors &&
                                                    errors.workExperinceInfoData &&
                                                    errors.workExperinceInfoData[
                                                    index
                                                    ] &&
                                                    errors.workExperinceInfoData[
                                                      index
                                                    ].reference &&
                                                    touched &&
                                                    touched.workExperinceInfoData &&
                                                    touched.workExperinceInfoData[
                                                    index
                                                    ] &&
                                                    touched.workExperinceInfoData[
                                                      index
                                                    ].reference
                                                    ? true
                                                    : false
                                                }
                                              />
                                            </div>
                                          </Grid>
                                          <Grid item lg={3} xs={12}>
                                            <div className="professional-grid-item">
                                              <CustomTextField
                                                color="#085044"
                                                fullWidth
                                                fieldName="Doctor LinkedIn Profile Link"
                                                variant="outlined"
                                                className={`login-text-field ${classes.uploadButton_1}`}
                                                name={`workExperinceInfoData.${index}.linkedin_profile`}
                                                placeholder="LinkedIn Profile"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={
                                                  item.linkedin_profile
                                                }
                                                helperText={
                                                  errors &&
                                                  errors.workExperinceInfoData &&
                                                  errors.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].linkedin_profile &&
                                                  touched &&
                                                  touched.workExperinceInfoData &&
                                                  touched.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  touched.workExperinceInfoData[
                                                    index
                                                  ].linkedin_profile && (
                                                    <div className="field-error">
                                                      {
                                                        errors
                                                          .workExperinceInfoData[
                                                          index
                                                        ].linkedin_profile
                                                      }
                                                    </div>
                                                  )
                                                }
                                                error={
                                                  errors &&
                                                    errors.workExperinceInfoData &&
                                                    errors.workExperinceInfoData[
                                                    index
                                                    ] &&
                                                    errors.workExperinceInfoData[
                                                      index
                                                    ].linkedin_profile &&
                                                    touched &&
                                                    touched.workExperinceInfoData &&
                                                    touched.workExperinceInfoData[
                                                    index
                                                    ] &&
                                                    touched.workExperinceInfoData[
                                                      index
                                                    ].linkedin_profile
                                                    ? true
                                                    : false
                                                }
                                              />
                                            </div>
                                          </Grid>
                                          <Grid item lg={3} xs={12}>
                                            <div className="professional-grid-item">
                                              <CustomTextField
                                                fieldName={
                                                  "Reference Doctor's Email"
                                                }
                                                color="#085044"
                                                fullWidth
                                                variant="outlined"
                                                className={`login-text-field ${classes.uploadButton_1}`}
                                                name={`workExperinceInfoData.${index}.reference_email`}
                                                placeholder="Reference Email"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={
                                                  item.reference_email
                                                }
                                                helperText={
                                                  errors &&
                                                  errors.workExperinceInfoData &&
                                                  errors.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].reference_email &&
                                                  touched &&
                                                  touched.workExperinceInfoData &&
                                                  touched.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  touched.workExperinceInfoData[
                                                    index
                                                  ].reference_email && (
                                                    <div className="field-error">
                                                      {
                                                        errors
                                                          .workExperinceInfoData[
                                                          index
                                                        ].reference_email
                                                      }
                                                    </div>
                                                  )
                                                }
                                                error={
                                                  errors &&
                                                    errors.workExperinceInfoData &&
                                                    errors.workExperinceInfoData[
                                                    index
                                                    ] &&
                                                    errors.workExperinceInfoData[
                                                      index
                                                    ].reference_email &&
                                                    touched &&
                                                    touched.workExperinceInfoData &&
                                                    touched.workExperinceInfoData[
                                                    index
                                                    ] &&
                                                    touched.workExperinceInfoData[
                                                      index
                                                    ].reference_email
                                                    ? true
                                                    : false
                                                }
                                              />
                                            </div>
                                          </Grid>
                                          <Grid item lg={3} xs={12}>
                                            <CustomTextField
                                              color="#085044"
                                              fieldName="Reference Doctor's Phone"
                                              variant="outlined"
                                              fullWidth
                                              id="input-with-dropdown"
                                              className={`login-text-field ${classes.uploadButton_1}`}
                                              name={`workExperinceInfoData.${index}.reference_phone`}
                                              placeholder="Reference Phone"
                                              type="text"
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              value={item.reference_phone}
                                              InputProps={{
                                                startAdornment: (
                                                  <InputAdornment position="start">
                                                    <FormControl
                                                      className={
                                                        classes.formControl
                                                      }
                                                    >
                                                      <Select
                                                        style={{ color: "#085044" }}
                                                        id="country_code"
                                                        name={`workExperinceInfoData.${index}.country_code`}
                                                        value={
                                                          item.country_code ||
                                                          "+1"
                                                        }
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
                                                          .sort(
                                                            (a: any, b: any) => {
                                                              return a - b;
                                                            }
                                                          )
                                                          .map((item) => {
                                                            return (
                                                              <MenuItem
                                                                value={`+${item}`}
                                                              >
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
                                                errors.workExperinceInfoData &&
                                                errors.workExperinceInfoData[
                                                index
                                                ] &&
                                                errors.workExperinceInfoData[
                                                  index
                                                ].reference_phone &&
                                                touched &&
                                                touched.workExperinceInfoData &&
                                                touched.workExperinceInfoData[
                                                index
                                                ] &&
                                                touched.workExperinceInfoData[
                                                  index
                                                ].reference_phone &&
                                                errors.workExperinceInfoData[
                                                  index
                                                ].reference_phone
                                              }
                                              error={
                                                errors &&
                                                  errors.workExperinceInfoData &&
                                                  errors.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  errors.workExperinceInfoData[
                                                    index
                                                  ].reference_phone &&
                                                  touched &&
                                                  touched.workExperinceInfoData &&
                                                  touched.workExperinceInfoData[
                                                  index
                                                  ] &&
                                                  touched.workExperinceInfoData[
                                                    index
                                                  ].reference_phone
                                                  ? true
                                                  : false
                                              }
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            lg={12}
                                            xs={12}
                                            className="checkbox-grid-item mb-30"
                                          >
                                            <Checkbox
                                              checked={item.current_organization}
                                              name={`workExperinceInfoData.${index}.current_organization`}
                                              onChange={(e) => {
                                                if (
                                                  values.workExperinceInfoData[
                                                    index
                                                  ].current_organization === 1
                                                ) {
                                                  setFieldValue(
                                                    `workExperinceInfoData[${index}].current_organization`,
                                                    0
                                                  );
                                                } else {
                                                  setFieldValue(
                                                    `workExperinceInfoData[${index}].current_organization`,
                                                    1
                                                  );
                                                }
                                                values.workExperinceInfoData.map(
                                                  (item, index_1) => {
                                                    return (
                                                      index_1 !== index &&
                                                      setFieldValue(
                                                        `workExperinceInfoData[${index_1}].current_organization`,
                                                        0
                                                      )
                                                    );
                                                  }
                                                );
                                              }}
                                              inputProps={{
                                                "aria-label": "",
                                              }}
                                            />

                                            <Typography>
                                              Current Organization
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </div>
                                    </div>

                                    {/* <div className="plus-icon">


                                      <Tooltip title="Remove">
                                        <IconButton aria-label="remove">
                                          <RemoveCircleIcon
                                            fontSize="large"
                                            className={
                                              classes.fab + " add-icon pointer"
                                            }
                                            onClick={() => {
                                              remove(index);
                                              if (index == checked) {
                                                setChecked(null);
                                              }
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>

                                    </div> */}
                                  </div>
                                </div>

                              )
                            )}
                        </div>
                      )}
                    />
                    {/* </Paper> */}
                    {/* </Grid> */}
                  </Box>
                </Grid>
                <Grid style={{ overflow: 'hidden' }} item lg={12} xs={12} className="office-address-grid">
                  <Typography className="office-address-title">
                    Specialty
                  </Typography>
                </Grid>
                <Grid style={{ overflow: 'hidden', paddingLeft: 0 }} item lg={12} xs={5}>
                  <Grid item xs={5} >
                    <FieldArray
                      name="speciality"
                      render={({ insert, remove, push }) => (
                        <Autocomplete
                          id="speciality"
                          style={{ marginLeft: 0, borderRadius: '30px' }}
                          multiple
                          disabled={values?.speciality?.length >= 2}
                          ChipProps={{ style: { color: '#085044', fontFamily: 'Helvetica', backgroundColor: '#ffdedd',border:"1px solid #ddbcbc" }, disabled: false }}
                          // fullWidth
                          className="autocomplete"
                          options={specialityList}
                          getOptionLabel={(option) => option.label}
                          value={values.speciality}
                          onChange={(e, value) => {
                            setFieldValue("speciality", value);
                            value.forEach((item) => {
                              if (item.value == 7) {
                                setFieldenable(true);
                              }
                            });
                          }}
                          renderInput={(params) => (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column-reverse",
                              }}
                            >
                              <TextField
                                disabled
                                className={`hidden_1 
                               ${values.speciality.length !== 0 ? "mb-15" : ""
                                  }`}
                                {...params}
                                placeholder="Specialty"
                                variant="outlined"
                                fullWidth
                              />
                              <TextField
                                className={`hidden`}
                                {...params}
                                name="speciality"
                                placeholder="Speciality"
                                variant="outlined"
                                fullWidth
                              />

                              {values?.speciality?.length >= 2 && <p style={{ paddingLeft: 30, opacity: .5 }}>You have selected maximum number of specialties allowed.</p>}

                            </div>
                          )}
                        />

                      )}
                    />

                  </Grid>

                  {errors &&
                    errors.speciality &&
                    touched &&
                    touched.speciality && (
                      <div className="field-error error_div">
                        {errors.speciality}
                      </div>
                    )}
                  {/* {specialityError && (
                    <div className="field-error error_div">
                      Please Select Your Speciality.
                    </div>
                  )} */}
                </Grid>

                <Grid item xs={12}>
                  {fieldenable == true && (
                    <>
                      <div>
                        <CustomTextField
                          variant="outlined"
                          fullWidth
                          placeholder="Please Enter speciality"
                          onChange={(e) => {
                            setFieldGet({
                              label: e.target.value,
                              value: Math.floor(Math.random() * 100 + 1),
                            });
                          }}
                        />
                        <CustomButton
                          variant="outlined"
                          onClick={() => {
                            setFieldGet({});
                            setFieldenable(false);
                            if (values?.speciality?.map(v => v?.label?.toLowerCase()).reduce((p, c) => p + c, '').includes(fieldGet?.label?.toLowerCase())) {
                              let newArr = values.speciality
                              newArr.pop()
                              setInitialStateValue({
                                ...values,
                                speciality: newArr
                              });
                              return
                            }
                            setInitialStateValue({
                              ...values,
                              speciality: values.speciality.map((item) => {
                                if (item.value === 7) {
                                  return fieldGet;
                                } else {
                                  return item;
                                }
                              }),
                            });

                          }}
                        >
                          Save
                        </CustomButton>
                      </div>
                    </>
                  )}
                </Grid>
                <hr />


                <Grid item xs={12}>
                  {/* BUttons Bottom */}
                  <Box style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between', }} className={classes.buttonBox}>
                    <div style={{ width: 'auto', marginLeft: 'auto', marginBottom: 0, paddingTop: 0, paddingBottom: 0 }} className={'work-inner-box'} >
                      <p >Fields with "<p style={{ color: 'red', display: 'inline' }} > * </p>" are compulsory for profile verification</p>
                    </div>
                    <div style={{ marginLeft: 20, marginRight: -20 }}>
                      <CustomButton
                        onClick={() => {
                          setTimeout(() => {
                            if (Object.keys(errors).length > 0) setPopupProps({ message: 'There are required fields you need to fill out.', title: "Required Fields", hideSecondaryButton: true, primaryTest: 'Ok' })
                          }, 500)
                          handleSubmit()
                        }}
                        type="submit"
                        variant="contained"
                        className={`register-button ${classes.BottomButtons}`}
                      >
                        save
                      </CustomButton>
                    </div>
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

export default React.forwardRef(ProfessionalInfo);
