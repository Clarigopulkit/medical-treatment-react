import React, { useEffect, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Tabs, Paper, Grid } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import "./requestTab.scss";
import TreatmentTab from "./treatmentsTab/treatmentsTab";
import RequestTab from "./requestTabDetails/requestTab";
import QuestionarieTab from "./questionarieTab/questionarieTab";
import CustomPopup from "../reusable/customPopup/customPopup";
import { createRequest } from "./postRequestApi";
import { useHistory } from "react-router-dom";
import Toast from "../../reducres/reducers/toast";


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;


  useEffect(() => {
 window.scrollTo(0, 0)
}, []);



  return (
    <div
      className="border-bottomView"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  root1: {
    "& > div > div > div > div > div >.Mui-selected": {
      backgroundColor: "#ffdedd",
    },
   
    },
    changeColor: {
      "& > div > span": {
        background: "#b784a7",
      },}
  
}));
const RequestTabs: React.FC<any> = (props) => {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const history = useHistory()
  const [treatmentTabData, setTreatmentTabData] = useState<any>()
  const [requestTabData, setRequestTabData] = useState<any>()
  const [questionnaireTabData, setQuestionnaireTabData] = useState<any>()
  const [onSavequestionnaireTabData, setonSaveQuestionnaireTabData] = useState<any>()
  const [onSavetreatmentTabData, setonSaveTreatmentTabData] = useState<any>()
  const [onSaverequestTabData, setonSaveRequestTabData] = useState<any>()
  // const count = useSelector(state => state.counter.value)
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue >= 1 && !treatmentTabData) return setPopupProps({ title: 'Treatment', message: 'Please select a treatment to continue.', primaryText: 'Ok', hideSecondaryButton: true })
    if (newValue == 2 && !requestTabData) return setPopupProps({ title: 'Request Form', message: 'Please fill the request form to continue.', primaryText: 'Ok', hideSecondaryButton: true })
    setValue(newValue);
  };

  useEffect(() => {
  
    if (!treatmentTabData) return
    createRequest({ ...treatmentTabData, status: 1 })
  }, [treatmentTabData])

  useEffect(() => {
    if (!treatmentTabData || !requestTabData) return
    createRequest({ ...treatmentTabData, ...requestTabData, status: 1 })
  }, [requestTabData])

  useEffect(() => {
    if (!treatmentTabData || !requestTabData || !questionnaireTabData) return
    createRequest({ ...treatmentTabData, ...requestTabData, ...questionnaireTabData, status: 2 }, ()=>{
      Toast.success("Request posted successfully.");
      history.goBack()
    })
  }, [questionnaireTabData])

  //oNLY SAVE
  useEffect(() => {
    if ( !onSavequestionnaireTabData|| !treatmentTabData || !requestTabData ) return
    createRequest({ ...treatmentTabData, ...requestTabData, ...onSavequestionnaireTabData, status: 1 }, ()=>{
      Toast.success("Request saved successfully.");
      // history.goBack()
    })
  }, [onSavequestionnaireTabData])

  useEffect(() => {
    if (!onSavetreatmentTabData) return
    createRequest({ ...onSavetreatmentTabData, status: 1 })
  }, [onSavetreatmentTabData])

  useEffect(() => {
    if (!onSaverequestTabData || !treatmentTabData ) return
    createRequest({ ...treatmentTabData, ...onSaverequestTabData, status: 1 })
  }, [onSaverequestTabData])

  const [popupProps, setPopupProps] = useState<any>()

  return (
    <div className={classes.root1}>
      {popupProps && <CustomPopup visible={popupProps ? true : false} dismiss={() => setPopupProps(null)} {...popupProps} />}
     
      <Grid container>
        <Grid item xs={12}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            className={`tabs-container !important  ${classes.changeColor}`} 
          >
            <Tab
              fullWidth
              label="Treatment"
              {...a11yProps(0)}
              className="login-tab"
            />
            <Tab
              fullWidth
              label="Request"

              {...a11yProps(2)}
              className="login-tab"
            />
            <Tab
              fullWidth
              label="Questionaire"
              {...a11yProps(1)}
              className="login-tab"
            />
          </Tabs>
        </Grid>
      </Grid>
      <Paper square>
        <TabPanel value={value} index={0}>
       

          <TreatmentTab treatmentData={treatmentTabData} 
            onSave={(data)=>{
              setonSaveTreatmentTabData(data)
            }}
          onNext={(data) => {
            setValue(1)
            setTreatmentTabData(data)
            window.scrollTo(0,0)
          }} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <RequestTab onBack={() => {setValue(0);window.scrollTo(0,0)}} requestData={requestTabData} 
            onSave={(data)=>{
              setonSaveRequestTabData(data)
            }}
          onNext={(data) => {
            setValue(2)
            setRequestTabData(data)
            window.scrollTo(0,0)
          }} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <QuestionarieTab onBack={() => {setValue(1);window.scrollTo(0,0) }} onDone={data=>setQuestionnaireTabData(data)}
          onSave={(data)=>{
            setonSaveQuestionnaireTabData(data)
          }}
          />
        </TabPanel>
      </Paper>
      {/* </div> */}
      {/* <AppBar position="static">
            <Grid container>
                <Grid item xs={12}>
                    <Tabs  value={value} onChange={handleTabChange} aria-label="simple tabs example" className="tabs-container">                    
                        <Tab fullWidth label="Treatments" {...a11yProps(0)} className="login-tab"/>                 
                        <Tab  fullWidth label="Questionary" {...a11yProps(1)} className="login-tab" />
                        <Tab  fullWidth label="Request" {...a11yProps(2)} className="login-tab" />                    
                    </Tabs>
                </Grid>
            </Grid>
            </AppBar>
            <Card>       
                <TabPanel value={value} index={0}>
                    <Login/>hello
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <UserRegister /> Questionary
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Login/> Request
                </TabPanel>
          </Card> */}
    </div>
  );
};

export default RequestTabs;
