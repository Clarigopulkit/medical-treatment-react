import React, { useEffect, useMemo, useState } from "react";
import {

  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  FormHelperText,
  TextField,
  Grid,
  TextareaAutosize,
} from "@material-ui/core";
import { Formik, Form, FormikProps } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CustomButton from "../../reusable/customButton/customButton";
import Radio, { RadioProps } from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import "./questionarieTab.scss";
import clsx from "clsx";
import { Typography, Box, Modal, Button } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import successTick from "../../../assets/success-tick.png";

import SentimentVeryDissatisfiedTwoToneIcon from "@material-ui/icons/SentimentVeryDissatisfiedTwoTone";
import MoodBadTwoToneIcon from "@material-ui/icons/MoodBadTwoTone";
import SentimentDissatisfiedTwoToneIcon from "@material-ui/icons/SentimentDissatisfiedTwoTone";
import SentimentSatisfiedTwoToneIcon from "@material-ui/icons/SentimentSatisfiedTwoTone";
import MoodTwoToneIcon from "@material-ui/icons/MoodTwoTone";
import { useForm } from "react-hook-form";
import TextInput from "../../reusable/TextInput";
import { fetchQuestionnaireByTreatment } from "../postRequestApi";
import { IconButton } from "@mui/material";
import { fromEvent } from 'file-selector';
import { useFilePicker } from 'use-file-picker';
import { AddCircleOutline, Close } from "@material-ui/icons";
import { UploadFile, UploadFileRounded } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import {selectTreatment} from '../postRequestSlice'
interface ISignUpForm {
  area: string;
  category: string;
  subCategory: string;
  treatment: string;
}
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper', borderWidth: 2, borderColor: '#debcbd', borderStyle: 'solid',
  p: 3,
};
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
      justifyContent: "center",
    },
  },
  noteArea: {
    color: "#446455",
    fontSize: "12px",
    paddingRight: "6px",
    paddingBottom: "24px",
    fontWeight:'bold',
    
  },
  questionName: {
    fontWeight: "bold",
    color: "#446354",
  },
  uploadFileLabel: {
    color: "#446354 !important",
  },
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: "50%",
    width: 16,
    height: 16,
    boxShadow: "inset 0 0 0 1px #446354, inset 0 -1px 0 #446354",
    backgroundColor: "#f5f8fa",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#446354",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },
  answerLabel: {
    color: "#446354 !important",
  },
  answerList: {
    flexDirection: "row",
    gap: "40px",
    margin: "16px 0",
    [theme.breakpoints.down("sm")]: {
      gap: "6px",
    },
  },
  submitWrapper: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #debcbd",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    textAlign: "center",
    maxWidth: "420px",
    overflow: "auto",
    [theme.breakpoints.down("sm")]: {
      maxHeight: "400px",
    },
  },
  successResponseTitle: {
    fontWeight: 600,
    color: "#446354",
    marginTop: "8px",
  },
}));
const areas = ["Clinic", "Doctor", "Patient"];

function StyledRadio(props: RadioProps) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

const QuestionarieTab: React.FC<any> = ({  onDone, onBack,onSave }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [cancelOpen, setcancelOpen] = React.useState(false);
  const [data, setData] = useState<any>()
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState<number>(0)
  const [request_files, setRequestFiels] = useState([])
  const [selectedFiles, setSelectefFilse] = useState([])
 

  const [questionnaires, setQuestionnaires] = useState([])
  const history = useHistory()
  const [openFileSelector, { filesContent,plainFiles, loading, errors }] = useFilePicker({
    readAs: 'DataURL',
    accept: '*',
    multiple: true,
    
    // limitFilesConfig: { max: 1 },
    // minFileSize: 0.1, // in megabytes
    // maxFileSize: 50,

  });
  const  treatment  = useAppSelector(selectTreatment);

  useEffect(()=>setRequestFiels(cv=>[...cv, ...plainFiles]),[plainFiles])

  useEffect(()=>setSelectefFilse(cv=>[...cv, ...filesContent]),[filesContent])

  console.log(plainFiles)
  
  console.log('redux data data----',treatment.treatmentId)
  
  
  const Picker = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (errors.length) {
      return <div>Error...</div>;
    }

    return (
      <div>
        <div style={{display :'flex', }} >
          {selectedFiles.map((file, index) => {
            const fileExtension = file.name.slice(file.name.lastIndexOf('.'))
            const isImage = (() => {
              if (fileExtension == '.jpg') return true
              if (fileExtension == '.jpeg') return true
              if (fileExtension == '.png') return true
              return false
            })()
            return (
              <div style={{ padding: 0, margin: 10 }} key={index}>

                <div style={{ height: 150, width: 150, borderRadius: 15, border: '1px #ccc solid', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} >
                  {/* <IconButton  style={{ position: 'absolute', top: 10, right: 10, color: '#999' }} >
                  <Close  />
                  </IconButton> */}
               
                  {isImage ? <img style={{ height: 150, width: 150, objectFit: 'cover' }} alt={file.name} src={file.content}></img> : <p style={{ fontSize: 36, color: '#ccc' }} >{fileExtension}</p>}

                </div>
                <h3 style={{ marginTop: 0, width : 150 }} >{file.name}</h3>
              </div>
            )
          })}
        </div>

        <div onClick={() => openFileSelector()} id="upload-btn" style={{ padding: 15, border: 'solid 1px #ccc', backgroundColor: "#f9f9f9", display: 'flex', borderRadius: 15, marginTop: 5 , maxWidth : 350}} >
            <UploadFileRounded style={{ fontSize: 40 }} />
            <div style={{ paddingLeft: 10 }} >
              <Typography style={{}} >Upload File or Drag and Drop</Typography>
              <Typography style={{ fontSize: 12, color: '#ccc' }} >pdf/image</Typography>
            </div>
          </div>
      </div>

    );
  }

  const { register, handleSubmit, watch, formState: { errors: formErrors }, reset } = useForm();
  const onSubmit = data => {
    console.log(data)
    setData(data)
    setOpen(true)
  }

  const onFeedBackSubmit = () => {
    setOpen(false)
    onDone({ ...data, feedback, user_experience: rating, request_files : plainFiles })
  }
  const onSaved = () => {
  onSave({...data})
  }
  useEffect(() => fetchQuestionnaireByTreatment(treatment.treatmentId, setQuestionnaires), [])

  const Question = ({ question }) => {
    switch (question.answer_type) {
      case "1": return <TextInput header={question.question} register={register} errors={formErrors} label={question.question} lg={12} fieldName={question.questionaire_id + ''} />
      default: return null
    }
  }

  const selectedRatingStyle = { borderRadius: 200, height: 50, width: 50, color: 'black', backgroundColor: '#085044' }

  return (
    <div>

      {questionnaires.map((item, index) => <Question key={item} question={item} />)}
      <Picker />
      <div
        className={classes.submissionArea}
        style={{
          margin: "24px 0 12px 0",
          justifyContent: "space-between",
        }}
      >
        <div className={classes.submitWrapper}>
          <CustomButton
            onClick={onBack}
            className="post-request-button-content-light"
            style={{ margin: "0" }}
          >
            Back
          </CustomButton>
          <CustomButton
             onClick={() => {   setcancelOpen(true)}}
            className="post-request-button-content-light"
            style={{ margin: "0" }}
          >
            Cancel
          </CustomButton>
        </div>
        <div className={classes.submitWrapper}>
          <CustomButton
            onClick={() =>  onSaved()}
            className="post-request-button-content"
            style={{ margin: "0" }}
          >
            Save
          </CustomButton>
          <CustomButton
            onClick={handleSubmit(onSubmit)}
            className="post-request-button-content"
            style={{ margin: "0" }}
          >
            Post Request
          </CustomButton>
        </div>
       
      </div>
      <div className={`${classes.submissionArea} ${classes.noteArea}`}>
        <div>
        <div style={{marginRight:15}}>
          <sup>*</sup>Note: Click on 'Next' saves the content
          automatically
        </div>
        </div>
      </div>

      <Modal
            open={cancelOpen}
            onClose={()=>setcancelOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
                      <Box 
                      sx={style}


>
    <Typography id="modal-modal-title" variant="h6" style={{ fontWeight: 'bold', color: '#085044', textAlign: 'center' }} component="h2">Cancel</Typography>
    <Typography 
    id="modal-modal-description"
    //  sx={{ mt: 2 }} 
     style={{ color: '#085044', textAlign: 'center' }}
     >Are you sure you want to cancel?</Typography>
    <div style={{ display: 'flex',  justifyContent: 'center', paddingTop: 10 }}>

        <CustomButton
              variant="outlined"
              fullWidth
              style={{
                background: "none",
                border: "1px solid #085044",
                color: "#085044",
              }}
              onClick={() => setcancelOpen(false)}
            >
              No
            </CustomButton>
            <div style={{ width: 10 }} /> 
            <CustomButton
              
               onClick={() => 
        history.push("/dashboard")
        }
            >
              Yes
            </CustomButton>
  
    </div>
</Box>
          </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <img src={successTick} alt="success-img" />
            <Typography
              variant="h5"
              className={classes.successResponseTitle}
              id="transition-modal-title"
            >
              Your Request Has Been Successfully Posted
            </Typography>
            <p
              className={classes.uploadFileLabel}
              id="transition-modal-description"
            >
              Please Rate us how happy you are with this BT App?
            </p>
            <div className={"emojiSection"}>
              <SentimentVeryDissatisfiedTwoToneIcon style={rating == 1 ? selectedRatingStyle : null} onClick={() => setRating(1)} />
              <MoodBadTwoToneIcon style={rating == 2 ? selectedRatingStyle : null} onClick={() => setRating(2)} />
              <SentimentDissatisfiedTwoToneIcon onClick={() => setRating(3)} style={rating == 3 ? selectedRatingStyle : null} />
              <SentimentSatisfiedTwoToneIcon style={rating == 4 ? selectedRatingStyle : null} onClick={() => setRating(4)} />
              <MoodTwoToneIcon style={rating == 5 ? selectedRatingStyle : null} onClick={() => setRating(5)} />
            </div>
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className={classes.textField}
            >
              <TextField
                InputProps={{ disableUnderline: true }}
                style={{ borderRadius: 20, border: '1px solid #085044', padding: 15, width: '100%' }}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Type your feedback..." />
            </Grid>
            <div
              style={{ justifyContent: "center" }}
              className={classes.submitWrapper}
            >
              <CustomButton
                onClick={() => setOpen(false)}
                className="post-request-button-content-light"
                style={{ margin: "0" }}
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={onFeedBackSubmit}
                className="post-request-button-content"
                style={{ margin: "0" }}
              >
                Submit
              </CustomButton>
            </div>
          </div>
        </Fade>
      </Modal>

    </div>
  );
};

export default  (QuestionarieTab);
