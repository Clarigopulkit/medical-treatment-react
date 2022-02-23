import React, { useState, useEffect } from "react";
import { Grid, Typography, TextareaAutosize, Box } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";

import Rating from "@material-ui/lab/Rating";
import Modal from "../../../../../components/modal/modal";

import { Formik, Form, FormikProps, FieldArray } from "formik";
import * as Yup from "yup";
import { map, get } from "lodash";
import AddIcon from "@material-ui/icons/Add";
import CustomButton from "../../../../reusable/customButton/customButton";
import "./visibleProfileInfo.scss";
import CustomTextField from "../../../../reusable/customTextField/customTextField";
import { useAppDispatch } from "../../../../../hooks/hooks";
import { fetchChangeProfilePictureAsync } from "../personalTab/personalInfoSlice";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { fetchDoctorVisibleInfoAsync } from "./visibleProfileSlice";
import { BaseUrl, objectToFormData } from "../../../../../utils/apiHelpers";
import Toast from "../../../../../reducres/reducers/toast";
import { Regex } from "../../../../../utils/validations";
import {
  closeSpinner,
  loadSpinner,
} from "../../../../../reducres/reducers/spinner";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { fetchProfileAsync } from "../../../../profile/profileSlice";
import CustomPopup from "../../../../reusable/customPopup/customPopup";
import Auth from "../../../../../protectedRoutes/Auth";

const useStyles = makeStyles((theme: Theme) => ({
  root1: {
    display: "block",
    margin: "0 auto",
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
  selectEmpty: {},
  formControl: {
    margin: theme.spacing(1),
    width: "50px",
  },
  formControlSelect: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  fixWrap: {
    flexWrap: "nowrap",
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap-reverse",
    },
  },
  fix_pad: {
    "& > span": {
      paddingTop: "0px",
      paddingLeft: "30px",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      textAling: "unset !important",
      "& > span": {
        paddingTop: "20px",
        paddingLeft: "0px",
      },
    },
  },
  fix_margin: {
    [theme.breakpoints.up("md")]: {
      marginRight: "10px !important",
    },
  },
}));

export interface portfolio {
  title: any;
  document: any;
}

let portfolio_interface: {
  job_title: any;

  file: any;
}[] = [
    {
      job_title: "",

      file: [{ file: "", description: "" }],
    },
  ];

let clinic_interface: [
  {
    id : any
    file: any;
    description: any;
  }
][] = [[{ file: "", description: "" , id:111111111}]];

const VisibleProfileInfo: React.FC<any> = ({
  user_details,
  history,
  file_url,
  doctor_portfolio,
  doctorHospitalClinic,
  doctor_hospital_clinic,
  name,
}) => {
  const [initialValuesInit, setInitialValues] = useState({
    file_url: file_url,
    name: name || "",
    introduction_title: user_details?.introduction_title || "",
    professional_career_desc: user_details?.professional_career_desc || "",
    portfolio: [].length > 0 ? [] : portfolio_interface,
    clinic: [].length > 0 ? [] : clinic_interface,
    feedbacks: [].length > 0 ? [] : [],
    speciality:
      user_details?.speciality && JSON.parse(user_details?.speciality),
  });

  const [windowWIdth, setWindowWidt] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0)
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 400) {
        setWindowWidt(window.innerWidth);
      }
      if (window.innerWidth >= 400) {
        if (windowWIdth < 400) {
          setWindowWidt(99999);
          return;
        }
      }
    });
    setWindowWidt(window.innerWidth);
  }, [window.innerWidth]);

  const classes = useStyles();
  const defPortfolioFiles = map(doctor_portfolio, (item) => {
    return { url: item.file_url, description: item.description };
  });
  const defhospitalFiles = map(doctor_hospital_clinic, (item) => {
    return { url: item.file_url, description: item.description };
  });
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<any>("");
  const [preview, setPreview] = useState<any>("");
  const [introductionTitle, setIntroductionTitle] = useState(
    get(user_details, "introduction_title", "")
  );

  const [port_value, setPortvalue] = useState([""]);
  const [port_file, setPortfile] = useState<any>([""]);

  useEffect(() => { }, [port_value, port_file]);
  const [Clinic_value, setClinicvalue] = useState([""]);
  const [Clinic_File, setClinicFile] = useState<any>([""]);

  useEffect(() => {
    let portfolio = doctor_portfolio?.map((item, index) => {
      return {
        id: item.id,
        user_id: item.user_id,
        job_title: item.job_title,
        file: item.doctor_portfolio_images.map((item_item) => {
          return { ...item_item, file: item_item.file_url };
        }),
      };
    });

    let newfolio = portfolio;

    newfolio?.map((item, index) => {
      return {
        ...item,
        file: item.file.push({ file: "", description: "" }),
      };
    });

    let clinic = doctorHospitalClinic?.map((item, index) => {
      if(item.hospital_clinic_images.length > 0){
        return item.hospital_clinic_images.map((item_item) => {
          return { ...item_item, mainID : item.id, file: item_item.file_url };
        });
      } else return [{...item,mainID :item.id, file : item.file || ""}]
    
    });

    console.log ('-------------------', clinic)

    if (newfolio.length > 0) {
      setPortvalue(
        newfolio.map((item) => {
          return "";
        })
      );
      setPortfile(
        newfolio.map((item) => {
          return "";
        })
      );
    }

    let clinicForm: any = [];
    clinic &&
      clinic?.map(async (item, index) => {
        if (clinic.length > clinicForm.lenght) {
          clinicForm.push(...clinicForm, "");
        }
        // return item.push({ file: "", description: "" });
      });

    if (clinic.length > 0) {
      setClinicvalue(
        clinic.map((item) => {
          return "";
        })
      );
      setClinicFile(
        clinic.map((item) => {
          return "";
        })
      );
    }

    setInitialValues({
      file_url: file_url,
      name: name || "",

      introduction_title: user_details?.introduction_title || "",
      professional_career_desc: user_details?.professional_career_desc || "",
      portfolio:
        newfolio && newfolio?.length > 0 ? newfolio : portfolio_interface,
      clinic: clinic && clinic?.length > 0 ? clinic : clinic_interface,
      feedbacks: [].length > 0 ? [] : [],
      speciality:
        user_details?.speciality && JSON.parse(user_details?.speciality),
    });
  }, [
    user_details,
    history,
    file_url,
    doctor_portfolio,
    doctor_hospital_clinic,
  ]);

  const [value, setValue] = React.useState<number | null>(2);

  const onSelectFile = (e) => {
    if (e.target.files[0].type.split("/")[0] === "image") {
      if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined);
        return;
      }
      setSelectedFile(e.target.files[0]);
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      dispatch(fetchChangeProfilePictureAsync(formData));
    } else {
      setPopupProps({ title: 'Error', message: "File must be an image", primaryText: 'Ok', hideSecondaryButton: true })
      // Toast.error("File must be an Image.");
    }
  };

  const handleSaveClick = (values) => {
    try {
      let formData = new FormData();

      formData.append("introduction_title", values?.introduction_title);

      formData.append(
        "professional_career_desc",
        values?.professional_career_desc
      );

      formData = objectToFormData(
        values?.portfolio.map((item) => {
          return {
            job_title: item.job_title == null ? "" : item.job_title,
            id: item.id,
          };
        }),
        "portfolio",
        formData
      );

      let port = values?.portfolio.map((item) => {
        return [...item.file];
      });
      let new_port: any = [];

      port.filter((item, index) => {
        return item.filter((item_item, index_index) => {
          if (/* typeof item_item.file !== "string" && */ item_item !== "") {
            if (new_port[index] == undefined) {
              if (item_item.file !== "") {
                new_port.push([item_item]);
              }
            } else {
              if (item_item.file !== "") {
                new_port[index].push(item_item);
              }
            }
            return item;
          }
        });
      });
      if (new_port.length > 0) {
        formData = objectToFormData(new_port, "portfolio", formData);
      }

      let clinic = [];

      values.clinic.filter(async (item, index) => {
        await item.filter((item_item) => {
          if (
            item_item.file !== "" /* && typeof item_item.file !== "string" */
          ) {
            if (clinic[index] == undefined) {
              if (item_item.file !== "") {
                clinic.push([item_item]);
              }
            } else {
              if (item_item.file !== "") {
                clinic[index].push(item_item);
              }
            }
          }
          return item_item;
        });
      });

      dispatch(loadSpinner());
      if (clinic.length > 0) {
        formData = objectToFormData(clinic, "hospitals", formData);
      }
      dispatch(fetchDoctorVisibleInfoAsync(formData)).then(async (result) => {
        if (result?.payload.length == 0) {
          Toast.success("Visible profile info saved successfully");
          await dispatch(fetchProfileAsync());
          dispatch(closeSpinner());
        }
        if (result?.payload?.response?.data?.statusCode == 400) {
          setPopupProps({ title: 'Error', message: result?.payload?.response?.data?.message, primaryText: 'Ok', hideSecondaryButton: true })
          // Toast.error(result?.payload?.response?.data?.message);
          dispatch(closeSpinner());
        }
      });
    } catch (error) { }
  };

  const [modalContent, setModalContent] = useState<any>({});
  const [open, setOpen] = useState(false);
  const handleModalClose = () => {
    setOpen(!open);
  };

  const [popupProps, setPopupProps] = useState<any>()
  const [type, setType] = useState("");

  return (
    <div className="profile-visible-tab">
      {popupProps && <CustomPopup visible={popupProps ? true : false} dismiss={() => setPopupProps(null)} {...popupProps} />}
      <Formik
        enableReinitialize={true}
        initialValues={initialValuesInit}
        onSubmit={(values: any, actions) => {
          window.scrollTo(0, 0)
          console.log(values)
          handleSaveClick(values);
        }}
        validationSchema={Yup.object().shape({
          introduction_title: Yup.string()
            .matches(Regex.Intro, "Please enter a valid title")
            .required("Please enter title"),
          professional_career_desc: Yup.string().required(
            "Please enter Introduction/Description"
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
          } = props;
          return (
            <Form autoComplete="off" className="profile-visible-tab">
              <Modal
                open={open}
                type={type}
                close={handleModalClose}
                content={modalContent}
              />
              <Grid container className="visible-grid-container" spacing={4}>
                <Grid className="text-contenting" xs={12} item style={{paddingBottom:"0px", marginTop : -15, marginRight : -15}}> 
                  <span className="visible-title">Public Profile</span>

                  <CustomButton
                  style={{marginRight:0}}
                    type="submit"
                    className="doctor-profile-change-button"
                  >
                    save
                  </CustomButton>

                </Grid>
                <Grid item xs={12} style={{paddingTop:"0px"}}>
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="space-between"
                  >
                    <span
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        width: "100%",
                      }}
                    >
                      <span
                        className={`max-content ${classes.fix_pad}`}
                        style={{
                          display: "flex",
                          width: "100%",
                          flexWrap: "wrap",
                        }}
                      >
                        {selectedFile ? (
                          <img style={{objectFit : 'contain', borderWidth : 1, borderColor : '#ddd', borderStyle : 'solid', borderRadius : 5}}
                            src={
                              selectedFile && URL.createObjectURL(selectedFile)
                            }
                            className="visible-image"
                            height="187px"
                            width="200px"
                          />
                        ) : (
                          <>
                            <img style={{objectFit : 'contain', borderWidth : 1, borderColor : '#ddd', borderStyle : 'solid', borderRadius : 5}}
                                //  style={{ objectFit: 'cover' }}
                              src={values.file_url}
                              className="visible-image"
                              height="187px"
                              width="200px"
                            />
                          </>
                        )}
                        <span className={`pl-5   title_info_box`}>
                          <Typography
                            className="heading pb-x"

                          >
                            {values.name.charAt(0).toUpperCase() + values.name.slice(1) }
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="baseline"
                            style={{ marginBottom: "3px", alignItems: "center" }}
                          >
                            <Typography
                              variant="h6"
                              className="typo-1"
                            >
                              Response Rate:
                            </Typography>
                            <Typography>2 Days</Typography>
                          </Box>
                          {/* </Typography> */}
                          <Typography variant="h5">
                            <Box display="flex" flexWrap="wrap">
                              <Typography
                                variant="h6"
                                className="typo-1"
                              >
                                FeedBacks:
                              </Typography>
                              <Typography>4.8</Typography>

                              <span className="feedback_arrange">
                                <Typography className="pl-2">
                                  {" "}
                                  {/* {[...Array(5)].map((star, i) => {
                                    return (
                                      <span
                                        style={{ paddingRight: "3px" }}
                                        className={
                                          i < 4 - 1
                                            ? "star fs-25 golden"
                                            : "star fs-25"
                                        }
                                      >
                                        &#9733;
                                      </span>
                                    );
                                  })} */}
                                  <Rating
                                    name="simple-controlled"
                                    value={value}
                                    disabled
                                    className="rating"
                                    onChange={(event, newValue) => {
                                      setValue(newValue);
                                    }}
                                  />
                                </Typography>
                                <Typography style={{ paddingLeft: "5px" }}>
                                  (205)
                                </Typography>
                              </span>
                            </Box>
                          </Typography>
                          <Typography
                            variant="h6"
                            className="speciality"
                            style={{
                              maxWidth: "600px",
                              wordBreak: "break-word",
                            }}
                          >
                            {/* {Cardiology and Hearth Specialist} */}
                            {values?.speciality?.map((item, index) => {
                              return (
                                <span>
                                  {index == values.speciality.length - 1 &&
                                    "and"}{" "}
                                  {item.label}{" "}
                                </span>
                              );
                            })}
                          </Typography>

                          <Typography style={{ float: "left" }}>

                            <label htmlFor="contained-button-file">
                              <CustomButton component="span"
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
                            </label>
                          </Typography>



                          {/* </Grid> */}
                        </span>
                      </span>
                      {/* <label htmlFor="contained-button-file">
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
                      </label> */}
                    </span>
                  </Box>
                </Grid>
                <Grid item lg={12} xs={12}>
                  <span className="title_introduction">Introduction Title</span>
                  <CustomTextField   
                    style={{width:"50%"}}     
                           
                    className="login-text-field my-cls"
                    variant="outlined"
                    name="introduction_title"
                    placeholder="Introduction Title"
                    value={values?.introduction_title}
                    onChange={
                      /* (e) => setIntroductionTitle(e.target.value) */ handleChange
                    }
                    helperText={
                      errors &&
                        errors.introduction_title &&
                        touched &&
                        touched.introduction_title
                        ? errors.introduction_title
                        : ""
                    }
                    error={
                      errors?.introduction_title && touched?.introduction_title
                        ? true
                        : false
                    }
                  />
                </Grid>
                <Grid item lg={12} xs={12}>
                  <span className="title_introduction">Introduction</span>
                  <TextareaAutosize
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#085044",
                      marginBottom: "10px",
                      marginTop: "0px"
                    }}
                    className={`text-area-field ${errors &&
                      errors.professional_career_desc &&
                      touched &&
                      touched.professional_career_desc &&
                      "error_div"
                      }`}
                    aria-label="minimum height"
                    rowsMin={4}
                    name="professional_career_desc"
                    value={values?.professional_career_desc}
                    onChange={handleChange}
                  />
                  {errors &&
                    errors &&
                    errors.professional_career_desc &&
                    touched &&
                    touched.professional_career_desc && (
                      <div
                        className="field-error"
                        style={{ lineHeight: "0.1", color: "#f44336" }}
                      >
                        {errors.professional_career_desc}
                      </div>
                    )}
                  {/* <CustomButton
                    component="span"
                    fullWidth
                    className="upload-button"
                  >
                    Save Image
                  </CustomButton> */}
                </Grid>
                <Grid item lg={12} xs={12} style={{marginRight:25}} className="custom-save-button">
                  <CustomButton
   
                    type="submit"
                    fullWidth
                    className="doctor-profile-change-button"
                  >
                    save Introduction
                  </CustomButton>
                </Grid>
                <hr style={{ width: "98%" }} />

                <FieldArray
                  name="portfolio"
                  render={({ insert, remove, push }) => (
                    <>
                      <Grid item xs={12} className="office-address-grid">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          flexWrap="wrap"
                          flexShrink=""
                        >
                          <Typography className="visible-title">
                            Portfolio
                          </Typography>
                          {/* </Grid> */}
                          {/* <Grid item lg={6} xs={12} className="custom-save-button"> */}


                          {windowWIdth > 460 ? (
                            <CustomButton
                              style={{
                                padding: "16px 32px 15px 33px",
                                borderRadius: "21px",
                                backgroundColor: "#085044",marginRight:25
                              }}
                              onClick={() => {
                                insert(0,{
                                  job_title: "",
                                  file: [{ file: "", description: "" }],
                                });
                                const newPort = port_value;
                                const newFile = port_file;
                                setPortvalue([...newPort, ""]);
                                setPortfile([...newFile, ""]);
                              }}
                            >
                              Add new Job
                            </CustomButton>
                          ) : (
                            <AddCircleIcon
                              style={{ fontSize: "30px" }}
                              onClick={() => {
                                push({
                                  job_title: "",
                                  file: [{ file: "", description: "" }],
                                });
                                const newPort = port_value;
                                const newFile = port_file;
                                setPortvalue([...newPort, ""]);
                                setPortfile([...newFile, ""]);
                              }}
                            />
                          )}

                        </Box>
                      </Grid>
                      {values?.portfolio.map((item, index) => {
                        const portCheck = item.file.length;
                        return (
                          <div style={{ width: 'calc(100% - 20px)', marginTop: 15, marginLeft: '10px' }} className="work-inner-box">
                            {/* {index > 0 && (
                              <Grid item xs={12} style={{ textAlign: "right" }}>
                                {windowWIdth > 460 ? (
                                  <>
                                    <CustomButton
                                      style={{
                                        padding: "16px 32px 15px 33px",
                                        borderRadius: "21px",
                                        backgroundColor: "#085044",
                                      }}
                                      onClick={() => {
                                        handleModalClose();
                                        setType(`Job ${index}.`);
                                        setModalContent({
                                          setField: () => {
                                            remove(index);
                                          },
                                        });
                                      }}
                                    >
                                      Remove Job
                                    </CustomButton>
                                  </>
                                ) : (
                                  <Tooltip
                                    title="Remove Image"
                                    className="pointer"
                                  >
                                    <RemoveCircleIcon
                                      style={{ fontSize: "30px" }}
                                      onClick={() => {
                                        handleModalClose();
                                        setType(`Job ${index}.`);
                                        setModalContent({
                                          setField: () => {
                                            remove(index);
                                          },
                                        });
                                      }}
                                    />
                                  </Tooltip>
                                )}
                              </Grid>
                            )} */}
                            <Grid item xs={12}>
                              <div style={{ display: 'flex',flex:1,  justifyContent: 'space-between', marginBottom: 25,width:'92%' ,}}  >
                                <div style={{ width:'83.5%',}}>
                                <Grid item xs={12}>
                                  <CustomTextField
                                    placeholder="Title of Job"
                                    fullWidth
                                    variant="outlined"
                                    className="login-text-field"
                                    name={`portfolio[${index}].job_title`}
                                    onChange={handleChange}
                                    value={item?.job_title}
                                  />
                                  </Grid>
                                </div>
                                
                                {index == 0 && (
                                  (windowWIdth > 530) ? (
                                    <>
                                     <Grid item xs={1}>
                                     
                                     
                                      </Grid>
                                    </>
                                  ) : (
                                    <Tooltip
                                      title="Remove Image"
                                      className="pointer"

                                    
                                    >
                                      <RemoveCircleIcon
                                        style={{ fontSize: "30px" ,}}
                                        onClick={() => {
                                          handleModalClose();
                                          setType(`portfolio`);
                                          setModalContent({
                                            setField: () => {
                                              remove(index);
                                            },
                                          });
                                        }}
                                      />
                                    </Tooltip>
                                  )
                                )}
                                {(
                                  (windowWIdth > 530) ? (
                                    <>
                                     <Grid item xs={1} style={{textAlign: "right",}} >
                                    {/* <div style={{justifyContent:'flex-end',backgroundColor:'red',flex:1,textAlign:'right'}}> */}
                                      <CustomButton
                                        style={{marginTop:"-1px",
                                          // padding: "16px 32px 15px 33px",
                                          borderRadius: "21px",
                                          backgroundColor: "#085044",
                                          marginLeft:"15px"
                                        }}
                                        onClick={() => {
                                          handleModalClose();
                                          setType(`portfolio`);
                                          setModalContent({
                                            ...item,
                                            message: "Are you sure you want to delete this portfolio section?",
                                            setField: () => {
                                              remove(index);
                                            },
                                          });
                                        }}
                                      >
                                        Delete
                                      </CustomButton>
                                      {/* </div> */}
                                      </Grid>
                                    </>
                                  ) : (
                                    <Tooltip
                                      title="Remove Image"
                                      className="pointer"

                                    
                                    >
                                      <RemoveCircleIcon
                                        style={{ fontSize: "30px" ,}}
                                        onClick={() => {
                                          handleModalClose();
                                          setType(`Job ${index}.`);
                                          setModalContent({
                                            ...item,
                                            message: "Are you sure you want to delete this portfolio section?",
                                            setField: () => {
                                              remove(index);
                                            },
                                          });
                                        }}
                                      />
                                    </Tooltip>
                                  )
                                )}
                              </div>


                            </Grid>

                            <Grid item xs={12}>
                              <div>
                                <FieldArray
                                  name={`portfolio[${index}].file`}
                                  render={({ insert, remove, push }) => (
                                    <Grid
                                      container
                                      spacing={3}
                                      className={classes.fixWrap}
                                    >
                                      {portCheck > 0 &&
                                        item?.file[0].file !== "" && (
                                          <Grid
                                            item
                                            style={{
                                              display: "flex",
                                              overflowX: "scroll",
                                              overflowY: "hidden",
                                              height: "280px",
                                              padding: "10px 15px",
                                            }}
                                            xs={12}
                                            sm={8}
                                            md={12}
                                            className="no_progress_bar "
                                            id={`image_port_container_${index}`}
                                          >
                                            {item?.file.length >= 1 &&
                                              item?.file[0].file !== "" &&
                                              item?.file.map(
                                                (item_item, index_1) => {
                                                  return (
                                                    item_item.file !== "" && (
                                                      <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        md={4}
                                                        lg={3}
                                                        className={
                                                          classes.fix_margin
                                                        }
                                                        style={{
                                                          minWidth: "288px",
                                                          display: "flex",
                                                          flexDirection:
                                                            "column",
                                                          marginRight: "45px",
                                                        }}
                                                      >
                                                        <span
                                                          style={{
                                                            position:
                                                              "relative",
                                                          }}
                                                        >
                                                          <div
                                                            style={{
                                                              display: "flex",
                                                              alignItems:
                                                                "center",
                                                              justifyContent:
                                                                "center",
                                                              margin:
                                                                "0px 26px 10px 0",
                                                              maxWidth: "277px",
                                                              minWidth: "277px",
                                                              width: "100%",
                                                              height: "170px",
                                                            }}
                                                          >
                                                            <img
                                                              id={
                                                                "hosimage_" +
                                                                index_1
                                                              }
                                                              style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit:
                                                                  "contain",
                                                                border: '1px solid #ccc',
                                                                borderRadius: 5
                                                              }}
                                                              className="port_image"
                                                              src={
                                                                typeof item_item.file ==
                                                                  "object"
                                                                  ? item_item.file ==
                                                                    null
                                                                    ? ""
                                                                    : URL.createObjectURL(
                                                                      item_item.file
                                                                    )
                                                                  : typeof item_item.file ==
                                                                    "string"
                                                                    ? item_item.file
                                                                    : ""
                                                              }
                                                              alt={
                                                                typeof item_item.file ==
                                                                  "object"
                                                                  ? item_item.file ==
                                                                    null
                                                                    ? ""
                                                                    : URL.createObjectURL(
                                                                      item_item.file
                                                                    )
                                                                  : typeof item_item.file ==
                                                                    "string"
                                                                    ? item_item.file
                                                                    : ""
                                                              }
                                                            />
                                                          </div>
                                                          <div
                                                            style={{
                                                              width: "277px",
                                                              height: "79px",
                                                              overflow: "Auto",
                                                            }}
                                                          >
                                                            <Typography
                                                              style={{
                                                                wordBreak:
                                                                  "break-all",
                                                                textAlign:
                                                                  "left",
                                                                fontSize:
                                                                  "13px",
                                                              }}
                                                              className="articles-content"
                                                            >
                                                              {
                                                                item_item.description
                                                              }
                                                            </Typography>
                                                          </div>
                                                          <Tooltip
                                                            title="Remove Image"
                                                            className="remove_icon_visible_profile pointer"
                                                          >
                                                            <RemoveCircleIcon
                                                              onClick={() => {
                                                                handleModalClose();
                                                                setType(
                                                                  `Job ${index} image.`
                                                                );

                                                                setModalContent(
                                                                  {
                                                                    setField:
                                                                      () =>
                                                                        setFieldValue(
                                                                          `portfolio[${index}].file`,
                                                                          item?.file?.filter(
                                                                            (
                                                                              item,
                                                                              index_2
                                                                            ) => {
                                                                              return (
                                                                                index_1 !==
                                                                                index_2
                                                                              );
                                                                            }
                                                                          )
                                                                        ),
                                                                  }
                                                                );
                                                              }}
                                                            />
                                                          </Tooltip>
                                                        </span>
                                                      </Grid>
                                                    )
                                                  );
                                                }
                                              )}
                                          </Grid>
                                        )}

                                      <Grid
                                        item
                                        xs={12}
                                        md={3}
                                        sm={6}
                                        style={{ marginLeft: 'auto' }}
                                        className={
                                          port_file[index] !== "" &&
                                          "add_image_class"
                                        }
                                      >
                                        {port_file[index] == "" ? (
                                          <label
                                            htmlFor={`contained-button-files[${index}]`}
                                          >
                                            <CustomButton
                                              fullWidth
                                              component="span"
                                              className="doctor-profile-plus-button"
                                              style={{
                                                marginTop: "0",
                                              }}
                                            >
                                              <div className="plus-icon-text">
                                                <>
                                                  <AddIcon
                                                    fontSize="large"
                                                    className="plus add_Icon"
                                                  />
                                                  <Typography>
                                                    Add Image
                                                  </Typography>
                                                </>
                                              </div>


                                              <input
                                                hidden
                                                id={`contained-button-files[${index}]`}
                                                type="file"
                                                name={`clinic[${index}][${item.length - 1
                                                  }].file`}
                                                onChange={async (e) => {
                                                  if (
                                                    e.target.files[0].type.split(
                                                      "/"
                                                    )[0] === "image"
                                                  ) {
                                                    let port_due = port_file;
                                                    port_due[index] =
                                                      e.target.files[0];
                                                    setPortfile(
                                                      port_file?.map(
                                                        (item, index_index) => {
                                                          return index ==
                                                            index_index
                                                            ? e.target.files[0]
                                                            : item;
                                                        }
                                                      )
                                                    );
                                                  } else {
                                                    setPopupProps({ title: 'Error', message: "File must be an image", primaryText: 'Ok', hideSecondaryButton: true })
                                                    // Toast.error(
                                                    //   "File must be an image"
                                                    // );
                                                  }
                                                }}
                                                accept="image/*"
                                              />
                                            </CustomButton>
                                            <p style={{
                                              marginTop: "0px",
                                            }}>Ideal photo size: 1024px*1024px</p>
                                          </label>
                                        ) : (
                                          port_file[index] &&
                                          port_file[index] !== "" && (
                                            <img
                                              width="100%"
                                              height="169px"
                                              style={{
                                                objectFit: "cover",
                                                margin: "0 0 14px 0px",
                                              }}
                                              src={URL.createObjectURL(
                                                port_file[index]
                                              )}
                                            />
                                          )
                                        )}



                                        <TextareaAutosize
                                          className="text-area-field_addbutton"
                                          aria-label="minimum height"
                                          rowsMin={5}
                                          placeholder="Description"
                                          value={port_value[index]}
                                          onChange={async (e) => {
                                            if (
                                              port_value[index].length < 100
                                            ) {
                                              await setPortvalue(
                                                port_value?.map(
                                                  (item, index_index) => {
                                                    return index_index === index
                                                      ? e.target.value
                                                      : item;
                                                  }
                                                )
                                              );
                                            } else {
                                              return;
                                            }
                                          }}
                                        />
                                        {port_file[index] &&
                                          port_file[index] !== "" && (
                                            <CustomButton
                                              component="span"
                                              fullWidth
                                              className="upload-button"
                                              onClick={() => {
                                                setFieldValue(
                                                  `portfolio[${index}].file[${item?.file.length - 1
                                                  }].description`,
                                                  port_value[index]
                                                );
                                                setFieldValue(
                                                  `portfolio[${index}].file[${item?.file.length - 1
                                                  }].file`,
                                                  port_file[index]
                                                );
                                                push({
                                                  file: "",
                                                  description: "",
                                                });
                                                setPortfile(
                                                  port_file.map(
                                                    (item, index_1) => {
                                                      return index_1 == index
                                                        ? ""
                                                        : item;
                                                    }
                                                  )
                                                );
                                                setPortvalue(
                                                  port_value.map(
                                                    (item, index_1) => {
                                                      return index_1 == index
                                                        ? ""
                                                        : item;
                                                    }
                                                  )
                                                );
                                              }}
                                            >
                                              Add Image
                                            </CustomButton>
                                          )}
                                      </Grid>

                                      {/* </div> */}
                                    </Grid>
                                  )}
                                />
                              </div>
                            </Grid>
                          </div>
                        );
                      })}
                    </>
                  )}
                />

                <FieldArray
                  name={`clinic`}
                  render={({ insert, remove, push }) => (
                    <>
                      <Grid item xs={12} className="office-address-grid">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          flexWrap="wrap"
                          flexShrink=""
                        >
                          <Typography className="visible-title">
                            Hospital/Clinic
                          </Typography>
                          {/* </Grid> */}
                          {/* <Grid item lg={6} xs={12} className="custom-save-button"> */}
                          {windowWIdth > 460 ? (
                            <CustomButton
                              style={{
                                padding: "16px 32px 15px 33px",
                                borderRadius: "21px",
                                backgroundColor: "#085044",marginRight:30
                              }}
                              onClick={() => {
                                push([
                                  {
                                    file: "",
                                    description: "",
                                  },
                                ]);
                                let newCLinic = Clinic_value;
                                let newCLinicFile = Clinic_File;
                                setClinicvalue([...newCLinic, ""]);
                                setClinicFile([...newCLinicFile, ""]);
                              }}
                            >
                              Add new Clinic
                            </CustomButton>
                          ) : (
                            <AddCircleIcon
                              style={{ fontSize: "30px" }}
                              onClick={() => {
                                push([{ file: "", description: "" }]);

                                let newCLinic = Clinic_value;
                                let newCLinicFile = Clinic_File;
                                setClinicvalue([...newCLinic, ""]);
                                setClinicFile([...newCLinicFile, ""]);
                              }}
                            />
                          )}
                        </Box>
                      </Grid>
                      {values?.clinic?.map((item, index) => {
                        return (
                          <>
                            {(
                              <Grid item xs={12} style={{ textAlign: "right" }}>
                                {windowWIdth > 460 ? (
                                  <CustomButton
                                    style={{
                                      padding: "16px 32px 15px 33px",
                                      borderRadius: "21px",
                                      backgroundColor: "#085044",marginRight:33
                                    }}
                                    onClick={() => {
                                      console.log(values)
                                      const token = Auth.getToken().token;
                                      setPopupProps({ title: 'Delete', message: "Are you sure you want to delete this hospital/clinic section?", onYes : ()=>{
                                        values?.clinic.length == 1 ? setFieldValue('clinic', clinic_interface) : remove(index)
                                        fetch(BaseUrl()+'remove-addr-rgst-edu-work/'+item[0].mainID+'/doctor_hospital_clinic', {method : 'GET', headers : {Authorization: `Bearer ${token}`}})
                                      }})
                                      // handleModalClose();
                                      // setType(`doctor_hospital_clinic`);

                                      // setModalContent({
                                      //   ...item,
                                      //   message: "Are you sure you want to delete this hospital/clinic section?",
                                      //   setField: () => values?.clinic.length == 1 ? setFieldValue('clinic', clinic_interface) : remove(index)
                                      // });
                                    }}
                                    // onClick={() => {
                                    //   handleModalClose();
                                    //   setType(`hospital/clinic`);
                                    //   setModalContent({
                                    //     ...item,
                                    //     message: "Are you sure you want to delete this hospital/clinic section?",
                                    //     setField: () => values?.clinic.length == 1 ? setFieldValue('clinic', clinic_interface) : remove(index)
                                    //   });
                                    // }}
                                  >
                                    Delete
                                  </CustomButton>
                                ) : (
                                  <RemoveCircleIcon
                                    style={{ fontSize: "30px" }}
                                    onClick={() => {
                                      console.log(values)
                                      const token = Auth.getToken().token;
                                      setPopupProps({ title: 'Delete', message: "Are you sure you want to delete this hospital/clinic section?", onYes : ()=>{
                                        values?.clinic.length == 1 ? setFieldValue('clinic', clinic_interface) : remove(index)
                                        fetch(BaseUrl()+'remove-addr-rgst-edu-work/'+item[0].mainID+'/doctor_hospital_clinic', {method : 'GET', headers : {Authorization: `Bearer ${token}`}})
                                      }})
                                    }}
                                  />
                                )}
                              </Grid>
                            )}
                            <Grid item xs={12}>
                              <div>
                                <FieldArray
                                  name={`clinic[${index}]`}
                                  render={({ insert, remove, push }) => {
                                    return (
                                      <>
                                        <Grid
                                          container
                                          style={{ width: 'calc(100% + 10px)', marginTop: 15, marginLeft: -5 }}
                                          spacing={3}
                                          className={classes.fixWrap + ' work-inner-box'}
                                        >
                                          {item.length > 0 &&
                                            item[0]?.file !== "" ? (
                                            <Grid
                                              item
                                              xs={12}
                                              md={12}
                                              sm={8}
                                              style={{
                                                display: "flex",
                                                overflowX: "scroll",
                                                height: "280px",
                                                padding: "10px 15px",
                                              }}
                                              className="no_progress_bar"
                                              id={`clinc_image_port_container_${index}`}
                                            >
                                              {item.length > 0 &&
                                                item[0].file !== "" &&
                                                item.map(
                                                  (item_item, index_1) => {
                                                    return (
                                                      item_item.file !== "" && (
                                                        <Grid
                                                          item
                                                          className={
                                                            classes.fix_margin
                                                          }
                                                          style={{
                                                            display: "flex",
                                                            flexDirection:
                                                              "column",
                                                            marginRight: "45px",
                                                          }}
                                                        >
                                                          <div
                                                            style={{
                                                              display: "flex",
                                                              alignItems:
                                                                "center",
                                                              justifyContent:
                                                                "center",
                                                              margin:
                                                                "0px 26px 10px 0",
                                                              maxWidth: "277px",
                                                              width: "100%",
                                                              height: "170px",
                                                              position:
                                                                "relative",
                                                            }}
                                                          >
                                                            {item_item.file !==
                                                              "" && (
                                                                <img
                                                                  id={
                                                                    "hosimage_" +
                                                                    index_1
                                                                  }
                                                                  style={{
                                                                    width: "100%",
                                                                    height:
                                                                      "100%",
                                                                    objectFit:
                                                                      "cover",
                                                                  }}
                                                                  className="port_image"
                                                                  src={
                                                                    typeof item_item.file ==
                                                                      "object"
                                                                      ? item_item.file ==
                                                                        null
                                                                        ? ""
                                                                        : URL.createObjectURL(
                                                                          item_item.file
                                                                        )
                                                                      : typeof item_item.file ==
                                                                        "string"
                                                                        ? item_item.file
                                                                        : ""
                                                                  }
                                                                  alt={
                                                                    typeof item_item.file ==
                                                                      "object"
                                                                      ? item_item.file ==
                                                                        null
                                                                        ? ""
                                                                        : URL.createObjectURL(
                                                                          item_item.file
                                                                        )
                                                                      : typeof item_item.file ==
                                                                        "string"
                                                                        ? item_item.file
                                                                        : ""
                                                                  }
                                                                />
                                                              )}
                                                            {item.file !==
                                                              "" && (
                                                                <Tooltip
                                                                  title="Remove Image"
                                                                  className="remove_icon_visible pointer"
                                                                >
                                                                  <RemoveCircleIcon
                                                                    onClick={() => {
                                                                      handleModalClose();
                                                                      setType(
                                                                        `Clinic ${index} image.`
                                                                      );
                                                                      setModalContent(
                                                                        {
                                                                          setField:
                                                                            () =>
                                                                              setFieldValue(
                                                                                `clinic[${index}]`,
                                                                                item.filter(
                                                                                  (
                                                                                    item,
                                                                                    index_2
                                                                                  ) => {
                                                                                    return (
                                                                                      index_1 !==
                                                                                      index_2
                                                                                    );
                                                                                  }
                                                                                )
                                                                              ),
                                                                        }
                                                                      );
                                                                    }}
                                                                  />
                                                                </Tooltip>
                                                              )}
                                                          </div>
                                                          <div
                                                            style={{
                                                              width: "277px",
                                                              height: "79px",
                                                              overflow: "Auto",
                                                            }}
                                                          >
                                                            <Typography
                                                              style={{
                                                                wordBreak:
                                                                  "break-all",
                                                                textAlign:
                                                                  "left",
                                                                fontSize:
                                                                  "13px",
                                                              }}
                                                              className="articles-content"
                                                            >
                                                              {
                                                                item_item.description
                                                              }
                                                            </Typography>
                                                          </div>
                                                        </Grid>
                                                      )
                                                    );
                                                  }
                                                )}
                                            </Grid>
                                          ) : (
                                            <></>
                                          )}

                                          <Grid
                                            item
                                            xs={12}
                                            md={3}
                                            sm={6}
                                            style={{ marginLeft: 'auto' }}
                                            className={
                                              Clinic_File[index] !== "" &&
                                              "add_image_class"
                                            }
                                          >
                                            {Clinic_File[index] == "" ? (
                                              <label
                                                htmlFor={`clinic_contained-button-files[${index}]`}
                                              >
                                                <CustomButton
                                                  fullWidth
                                                  component="span"
                                                  className="doctor-profile-plus-button"
                                                  style={{
                                                    marginTop: "0",
                                                  }}
                                                >
                                                  <div className="plus-icon-text">
                                                    <>
                                                      <AddIcon
                                                        fontSize="large"
                                                        className="plus add_Icon"
                                                      />
                                                      <Typography>
                                                        Add Image
                                                      </Typography>
                                                    </>
                                                  </div>

                                                  <input
                                                    hidden
                                                    id={`clinic_contained-button-files[${index}]`}
                                                    type="file"
                                                    name={`clinic[${index}][${item.length - 1
                                                      }].file`}
                                                    onChange={async (e) => {
                                                      if (
                                                        e.target.files[0].type.split(
                                                          "/"
                                                        )[0] === "image"
                                                      ) {
                                                        let Clinic_due =
                                                          Clinic_File;
                                                        Clinic_due[index] =
                                                          e.target.files[0];
                                                        setClinicFile(
                                                          Clinic_due?.map(
                                                            (
                                                              item,
                                                              index_index
                                                            ) => {
                                                              return index ==
                                                                index_index
                                                                ? e.target
                                                                  .files[0]
                                                                : item;
                                                            }
                                                          )
                                                        );
                                                      } else {
                                                        setPopupProps({ title: 'Error', message: "File must be an image", primaryText: 'Ok', hideSecondaryButton: true })
                                                        // Toast.error(
                                                        //   "File must be an image"
                                                        // );
                                                      }
                                                    }}
                                                    accept="image/*"
                                                  />
                                                </CustomButton>
                                              </label>
                                            ) : (
                                              Clinic_File[index] &&
                                              Clinic_File[index] !== "" && (
                                                <img
                                                  width="100%"
                                                  height="169px"
                                                  style={{
                                                    objectFit: "cover",
                                                    margin: "0 0 14px 0px",
                                                  }}
                                                  src={URL.createObjectURL(
                                                    Clinic_File[index]
                                                  )}
                                                />
                                              )
                                            )}

                                            <TextareaAutosize
                                              className="text-area-field_addbutton"
                                              aria-label="minimum height"
                                              rowsMin={5}
                                              name={`clinic[${index}][${item.length - 1
                                                }].description`}
                                              placeholder="Description"
                                              value={Clinic_value[index]}
                                              onChange={async (e) => {
                                                if (
                                                  Clinic_value[index].length <
                                                  100
                                                ) {
                                                  await setClinicvalue(
                                                    Clinic_value.map(
                                                      (item, index_index) => {
                                                        return index_index ===
                                                          index
                                                          ? e.target.value
                                                          : item;
                                                      }
                                                    )
                                                  );
                                                } else {
                                                  return;
                                                }
                                              }}
                                            />
                                            {Clinic_File[index] !== "" && (
                                              <CustomButton
                                                component="span"
                                                fullWidth
                                                className="upload-button"
                                                onClick={async () => {
                                                  await setFieldValue(
                                                    `clinic[${index}][${item.length - 1
                                                    }].description`,
                                                    Clinic_value[index]
                                                  );
                                                  await setFieldValue(
                                                    `clinic[${index}][${item.length - 1
                                                    }].file`,
                                                    Clinic_File[index]
                                                  );
                                                  push({
                                                    file: "",
                                                    description: "",
                                                  });
                                                  setClinicFile(
                                                    Clinic_File.map(
                                                      (item, index_1) => {
                                                        return index_1 == index
                                                          ? ""
                                                          : item;
                                                      }
                                                    )
                                                  );
                                                  setClinicvalue(
                                                    Clinic_value.map(
                                                      (item, index_1) => {
                                                        return index_1 == index
                                                          ? ""
                                                          : item;
                                                      }
                                                    )
                                                  );
                                                }}
                                              >
                                                Add Image
                                              </CustomButton>
                                            )}
                                          </Grid>
                                        </Grid>
                                      </>
                                    );
                                  }}
                                />
                              </div>
                            </Grid>
                          </>
                        );
                      })}
                    </>
                  )}
                />
                {/* </Grid> */}
                {/* <Grid container className="visible-portfolio-grid-container"> */}
                <Grid item lg={12} xs={12} className="office-address-grid">
                  <Typography className="visible-title">Feedbacks</Typography>
                </Grid>
                {[...Array(5)].map((item) => {
                  return (
                    <>
                      <Grid item xs={12} className="office-address-grid">
                        <Box display="flex" justifyContent="space-between">
                          <span>
                            <Typography className="visible-title_1">
                              Irretable bowel syndrome
                            </Typography>
                            <Typography className="visible-title_2">
                              John sui | 23Aug,2021
                            </Typography>
                            <Rating
                              name="simple-controlled"
                              value={value}
                              className="rating"
                              onChange={(event, newValue) => {
                                setValue(newValue);
                              }}
                            />
                          </span>
                          <span>
                            {/* </Grid>
                    <Grid item lg={6} xs={12}> */}
                            <Typography className="final_price">
                              Final Price
                            </Typography>
                            <Typography className="final_price_price">
                              $740
                            </Typography>
                          </span>
                        </Box>
                      </Grid>

                      <Grid item xs={12} className="feedBack_content">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s, whe
                        an unknown printer took a galley of type and scrambled
                        it to make a type specimen book.
                      </Grid>
                      <hr style={{ width: "98%" }} />
                    </>
                  );
                })}
                <Grid xs={12} style={{ textAlign: "center" }}>
                  <CustomButton
                    style={{
                      background: "none",
                      border: "1px solid #085044",
                      color: "#085044",
                    }}
                  >
                    Load More
                  </CustomButton>
                </Grid>

                <Grid item xs={12} style={{ textAlign: "right" }}>
                  <CustomButton
                  style={{marginRight:15}}
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    save
                  </CustomButton>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default withRouter(VisibleProfileInfo);
