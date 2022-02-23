import React, { Suspense, useEffect, useState } from "react";
import {
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  FormHelperText,
  Grid,
  TextareaAutosize,
} from "@material-ui/core";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CustomButton from "../../reusable/customButton/customButton";
import { fetchTreatmentsAreas, fetchCategoryByArea, fetchSubCategoryByCategory, fetchTreatments } from '../postRequestApi';
import "./treatmentsTab.scss";

import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import {updateTreatmentId} from '../postRequestSlice'

interface ISignUpForm {
  area: string;
  category: string;
  subCategory: string;
  treatment: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root1: {
    maxWidth: "450px",
    display: "block",
    margin: "0 auto",
  },
  title: {
    padding: theme.spacing(3),
    paddingLeft: 0,
    color: "#446354",
    fontWeight: 600,
    marginBottom: "16px",
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
    marginBottom: "30px",
  },
  selectEmpty: {
    //   marginTop: theme.spacing(2),
    //   height:"40px",
    width: "95%",
  },
  submissionArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: "right",
    gap: "16px",
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap",
      justifyContent: "flex-end",
    },
  },
  noteArea: {
    color: "#446455",
    fontSize: "12px",
    paddingRight: "6px",
    paddingBottom: "24px",
    fontWeight:'bold'
  },
}));
const area = ["Clinic", "Doctor", "Patient"];


const TreatmentTab: React.FC<any> = ({ onNext, treatmentData,onSave }) => {

  // const [area, setArea] = useState()
  const [areas, setAreas] = useState([])
  const [areasid, setAreasid] = useState('')

  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])

  const [subCategory, setSubCategory] = useState('')
  const [subCategories, setSubCategories] = useState([])

  const [treatment, setTreatment] = useState('')
  const [treatments, setTreatments] = useState([])
  const [addComment, setAddComment] = useState(treatmentData?.questionaire_note || '')
  const dispatch = useAppDispatch();

  const onSaved = (data) => {
    onSave({data})
    }

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchTreatmentsAreas(setAreas);
   

  }, []);


  const classes = useStyles();
  return (
    <div> 
      <Formik
        initialValues={{
          area: treatmentData?.area_id || '',
          category: treatmentData?.category_id || '',
          subCategory: treatmentData?.sub_category_id || '',
          treatment: treatmentData?.treatment_id || '',
        }}

        onSubmit={(values: ISignUpForm, actions) => {
          const params = {
            "area_id": values.area,
            "category_id": values.category,
            "sub_category_id": values.subCategory,
            "treatment_id": values.treatment,
            "questionaire_note": addComment,
          }
         
         
          // dispatch({type:'SET_TREATMENT_ID',payload:values.treatment})
          // dispatch(decrement())
        //  dispatch(selectTreatment())
        dispatch(updateTreatmentId(values.treatment))
          onNext(params)
         
        }}
        
        validationSchema={Yup.object().shape({
          area: Yup.string()
            .required("Must have Select")
            .min(1, " select any Area"),
          category: Yup.string()
            .required("Must have Select")
            .min(1, " select any category"),
          subCategory: Yup.string()
            .required("Must have Select")
            .min(1, " select any subCategory"),
          treatment: Yup.string()
            .required("Must have Select")
            .min(1, " select any subCategory"),
        })}
      >
        {(props: FormikProps<ISignUpForm>) => {
          const { values, touched, errors, handleChange, handleSubmit } = props;

          if (values.area !== areasid) {
            setAreasid(values.area)
            fetchCategoryByArea(values.area, setCategories)
          }
          else if (values.area == areasid) {

          }

          if (values.category !== category) {
            setCategory(values.category)
            fetchSubCategoryByCategory(values.category, setSubCategories)
          }
          else if (values.category == category) {
          }

          if (values.subCategory !== subCategory) {
            setSubCategory(values.subCategory)
            fetchTreatments(values.subCategory, setTreatments)

          }
          else if (values.subCategory == subCategory) {
          }
          return (
            <Form>
              <Typography
                variant="h5"
                color="primary"
                className={classes.title}
              >
                Treatment
              </Typography>
              <Grid spacing={2} container justify="space-around" direction="row">
                <Grid
                  item
                  lg={3}
                  md={3}
                  sm={6}
                  xs={12}
                  className={classes.textField}
                >
                  <label style={{ fontWeight: 600, color: "#446354", marginBottom: "2px", }}>Select Area</label>
                  {(!values.area) && <Typography style={{ color: "#446354", fontSize: 18, position: 'absolute', paddingLeft: 15, paddingTop: 19 }} className="advance-search-heading">Select</Typography>}
                  <FormControl style={{paddingTop : 10}} fullWidth variant="standard" error={errors.area && touched.area ? true : false}>
                    <Select
                      id="area"
                      name="area"
                      placeholder="Select Area"
                      SelectDisplayProps={{ style: { height: 44, padding: '0 0 0 0', display: 'flex', alignItems: 'center' } }}
                      // className={` ${classes.selectEmpty} no-scrooll input-label `}
                      onChange={handleChange}
                      value={values.area}
                      disableUnderline
                      style={{ borderRadius: 30, borderWidth: 1, borderColor: 'rgb(8, 80, 68)', borderStyle: 'solid', padding: '0 15px', color: '#446354' }}
                    >
                      {areas.map((names) => (
                        <MenuItem key={names.id} value={names.id} >
                          <ListItemText primary={capitalize(names.title)} />
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.area && touched.area ? errors.area : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  lg={3}
                  md={3}
                  sm={6}
                  xs={12}
                  className={classes.textField}
                >
                  <label style={{ fontWeight: 600, color: "#446354", marginBottom: "2px", }}>Select Category</label>
                  {(!values.category) && <Typography style={{ color: "#446354", fontSize: 18, position: 'absolute', paddingLeft: 15, paddingTop: 19 }} className="advance-search-heading">Select</Typography>}
                  <FormControl style={{paddingTop : 10}} fullWidth variant="standard" error={errors.category && touched.category ? true : false}>
                    <Select
                      id="category"
                      name="category"
                      placeholder="Select Category"
                      SelectDisplayProps={{ style: { height: 44, padding: '0 0 0 0', display: 'flex', alignItems: 'center' } }}
                      // className={` ${classes.selectEmpty} no-scrooll input-label `}
                      onChange={handleChange}
                      value={values.category}
                      disableUnderline
                      style={{ borderRadius: 30, borderWidth: 1, borderColor: 'rgb(8, 80, 68)', borderStyle: 'solid', padding: '0 15px', color: '#446354' }}
                    >
                      {categories.map((names) => (
                        <MenuItem key={names.id} value={names.id} >
                          <ListItemText primary={capitalize(names.title)} />
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.category && touched.category ? errors.category : ""}
                    </FormHelperText>
                  </FormControl>

                </Grid>
                <Grid
                  item
                  lg={3}
                  md={3}
                  sm={6}
                  xs={12}
                  className={classes.textField}
                >

                  <label style={{ fontWeight: 600, color: "#446354", marginBottom: "2px", }}>Select Sub-Category</label>
                  {(!values.subCategory) && <Typography style={{ color: "#446354", fontSize: 18, position: 'absolute', paddingLeft: 15, paddingTop: 19 }} className="advance-search-heading">Select</Typography>}
                  <FormControl style={{paddingTop : 10}} fullWidth variant="standard" error={errors.subCategory && touched.subCategory ? true : false}>
                    <Select
                      id="subCategory"
                      name="subCategory"
                      placeholder="Select Sub-Category"
                      SelectDisplayProps={{ style: { height: 44, padding: '0 0 0 0', display: 'flex', alignItems: 'center' } }}
                      // className={` ${classes.selectEmpty} no-scrooll input-label `}
                      onChange={handleChange}
                      value={values.subCategory}
                      disableUnderline
                      style={{ borderRadius: 30, borderWidth: 1, borderColor: 'rgb(8, 80, 68)', borderStyle: 'solid', padding: '0 15px', color: '#446354' }}
                    >
                      {subCategories.map((names) => (
                        <MenuItem key={names.id} value={names.id} >
                          <ListItemText primary={capitalize(names.title)} />
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.subCategory && touched.subCategory ? errors.subCategory : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  lg={3}
                  md={3}
                  sm={6}
                  xs={12}
                  className={classes.textField}
                >


                  <label style={{ fontWeight: 600, color: "#446354", marginBottom: "2px", }}>Select Treatment</label>
                  {(!values.treatment) && <Typography style={{ color: "#446354", fontSize: 18, position: 'absolute', paddingLeft: 15, paddingTop: 19 }} className="advance-search-heading">Select</Typography>}
                  <FormControl style={{paddingTop : 10}} fullWidth variant="standard" error={errors.treatment && touched.treatment ? true : false}>
                    <Select
                      id="treatment"
                      name="treatment"
                      placeholder="Select Treatment"
                      SelectDisplayProps={{ style: { height: 44, padding: '0 0 0 0', display: 'flex', alignItems: 'center' } }}
                      // className={` ${classes.selectEmpty} no-scrooll input-label `}
                      onChange={handleChange}
                      value={values.treatment}
                      disableUnderline
                      style={{ borderRadius: 30, borderWidth: 1, borderColor: 'rgb(8, 80, 68)', borderStyle: 'solid', padding: '0 15px', color: '#446354' }}
                    >
                      
                      {treatments.map((names) => (
                        <MenuItem key={names.id} value={names.id} >
                          <ListItemText primary={capitalize(names.title)} />
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.treatment && touched.treatment ? errors.treatment : ""}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <InputLabel
                    id="demo-mutiple-checkbox-label"
                    style={{ fontWeight: 600, color: "#446354", marginBottom: "15px" }}
                  >
                    Add Comments
                  </InputLabel>
                  {/* <div className="text-area2">  */}
                  <TextareaAutosize
                  
                    className="text-area"
                    aria-label="minimum height"
                    rowsMin="8"
                    
                    placeholder="Type Here"
                    value={addComment}
                    onChange={(e) => setAddComment((e as any).target.value)}
                  />
                  
                  {/* </div> */}
                </Grid>
              </Grid>
              
              <div
                className={classes.submissionArea}
                style={{ margin: "24px 0 12px 0" }}
              >
                <CustomButton
                  // onClick={() => {saveTreatmentData()}}
                  className="post-request-button-content-light"
                  style={{ margin: "0" }}
                >
                  Save
                </CustomButton>
                <CustomButton
                  onClick={handleSubmit}
                  className="post-request-button-content"
                  style={{ margin: "0" }}
                >
                  Next
                </CustomButton>
              </div>
              <div className={`${classes.submissionArea} ${classes.noteArea}`}>
                <div style={{marginRight:15}}>
                  <sup >*</sup>Note: Click on 'Next' saves the content
                  automatically
                </div>
              </div>
            
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default TreatmentTab;



function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}