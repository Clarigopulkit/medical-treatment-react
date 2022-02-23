import React, { useEffect ,useState} from "react";
import {
  Typography,
  Grid,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CustomButton from "../../reusable/customButton/customButton";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "./requestTab.scss"
import { Country, State, City } from "country-state-city";
import { useForm } from "react-hook-form";
import TextInput from "../../reusable/TextInput";
import DropDown from "../../reusable/DropDown";

import { Box, Modal, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
interface ISignUpForm {
  country: string;
  state: string;
  city: string;
  radius: string;
  location: string;
  visitor_local: string;
  time_preference: string;
  language_preference: String;
  validity: string;
  personal_note: string;
  fluency: string;
  expiry_date:string
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
console.log('data',)
const useStyles = makeStyles((theme: Theme) => ({
  selectEmptyPatial: {
    width: "97.5%",
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
  submitWrapper: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  },
}));


const visitor = ['Visitor', 'Local']
const fluency = ['Any level', 'Conversational of better', 'Fluent or better', 'Native or bilingual only']
const radius = [5,10,15,25,50,75];
const language = ["English", "German", "French", "Spanish"]
const valid = [15,30,45];
const RequestTab: React.FC<any> = ({ onNext, requestData, onBack,onSave }) => {

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  console.log('print------ - -',watch('country'))
  // if(country)
  const onSubmit = data => {
    console.log('data--00--0--0',data)
    onNext(data)
  }
  const [countryList, setCountryList] = useState([])
  const classes = useStyles();
  const [checked, setChecked] = React.useState(true);

  const [cancelOpen, setcancelOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const history = useHistory()
  useEffect(()=>reset(requestData),[])
  const scrollTop = () =>{
 window.scrollTo({top: 0, behavior: 'smooth'});
 };
 const onSaved = data => {
  onSave({data})
  }
 
  return (
    <div>
      <Typography variant="h5" color="primary" style={{ fontWeight: 'bold', color: '#446354', marginBottom: 20 }}>Location</Typography>
      <Grid container justifyContent="flex-start" direction="row">
        <DropDown watch={watch} register={register} errors={errors} label={'Country'} options={Country.getAllCountries()} fieldName={'country'} />
        <DropDown watch={watch} register={register} errors={errors} label={'State'} options={State.getStatesOfCountry(Country.getAllCountries().find(c => c.name == watch('country'))?.isoCode)} fieldName={'state'} />
        <DropDown watch={watch} register={register} errors={errors} label={'City'} options={City.getCitiesOfState(Country.getAllCountries().find(c => c.name == watch('country'))?.isoCode, State.getAllStates().find(s => s.name == watch('state'))?.isoCode)} fieldName={'city'} />
        <DropDown watch={watch} register={register} errors={errors} label={'Radius (mile)'} options={radius} fieldName={'radius'} />
      </Grid>
      <Grid container justifyContent="flex-start" direction="row">
        <TextInput  register={register} errors={errors} label={'Your preferred location'} lg={6} fieldName={'preferred_location'} />
      </Grid>

      <Typography variant="h5" color="primary" style={{ fontWeight: 'bold', color: '#446354', marginBottom: 20, marginTop: 20 }}>Preference</Typography>
      <Grid container justifyContent="flex-start" direction="row">
        <DropDown watch={watch} register={register} errors={errors} lg={6} errorMessage="Please let us know if you are a visitor or a local." label={'Are you visitor or local'} options={visitor} fieldName={'visitor_local'} />
        <TextInput register={register} errors={errors} label={'Your preferred time'} lg={6} fieldName={'time_preference'} />
        <DropDown watch={watch} register={register} errors={errors} lg={3} label={'Language'} options={language} fieldName={'language_preference'} />
        {/* <DropDown watch={watch} register={register} errors={errors} lg={3} label={'Fluency'} options={fluency} fieldName={'fluency'} /> */}
      </Grid>

      {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div style={{height : 10}} />
      <label style={{ fontWeight: 600, fontSize: "18px", color: "#446455", marginTop: "10px" }}>Request is open in the next</label>
        <Grid container justifyContent="flex-start" lg={6} style={{ marginTop: "10px" }} md={6} sm={6} xs={12}> */}
          {/* <KeyboardDatePicker
            disableToolbar
            variant="inline"
            fullWidth
            format="MM/dd/yyyy"
            className={`validity-date-picker ${classes.selectEmptyPatial}`}
            margin="normal"
            id="date-picker-inline"
            // label="Valid Up to"
            value={selectedDate}
            onChange={setSelectedDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          /> */}
                  {/* <DropDown watch={watch} register={register} errors={errors} label={'Request is open in the next'} options={valid} fieldName={'selectedDate'} />
        </Grid>
      </MuiPickersUtilsProvider> */}
       <Grid container justifyContent="flex-start"  style={{ marginTop: "10px",}}  > 
      <DropDown lg={6} watch={watch} register={register} errors={errors} label={'Request is open in the next'} options={valid} fieldName={'expiry_date'} />
     </Grid>
      <Grid container justifyContent="flex-start" direction="row">
        <TextInput multiline register={register} errors={errors} label={'Personal note'} lg={12} fieldName={'personal_note'} />
      </Grid>

      <div>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              style={{ color: "#446354" }}
              inputProps={{ "aria-label": "secondary checkbox" }}
              checked={checked}
              onClick={() => setChecked(cv => !cv)}
              name="gilad"
            />
          }
          label={<p>I agree to the{" "}<a href="#" className="agree-link"> Terms of User </a> and <a href="#" className="agree-link">Payment Policies</a>.</p>}
        />
      </div>
      <div className={classes.submissionArea} style={{ margin: "24px 0 12px 0", justifyContent: "space-between" }} >
        <div className={classes.submitWrapper}>
          <CustomButton onClick={ onBack} className="post-request-button-content-light" style={{ margin: "0" }}>Back</CustomButton>
          <CustomButton onClick={() => {   setcancelOpen(true)}} className="post-request-button-content-light" style={{ margin: "0" }}>Cancel</CustomButton>
        </div>
        <div className={classes.submitWrapper}>
          <CustomButton onClick={ handleSubmit(onSaved)} className="post-request-button-content" style={{ margin: "0" }}>Save</CustomButton>
          <CustomButton onClick={handleSubmit(onSubmit)} className="post-request-button-content" style={{ margin: "0" }}>Next</CustomButton>
        </div>
      </div>
      <div style={{marginRight:15}}>
      <div className={`${classes.submissionArea} ${classes.noteArea}`}>
        *Note: Click on 'Next' saves the content automatically
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
    </div>
  );
};

export default RequestTab;