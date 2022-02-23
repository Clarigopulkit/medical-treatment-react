import React, { useEffect, useRef, useState } from "react";

import { Grid, Paper, Link, styled, Breadcrumbs } from "@material-ui/core";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import "./clinicProfile.scss";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
// import AddDoctor from "../../Doctor/AddDoctor/addDoctor";
import ClinicPersonalInfo from "../clinicPersonalInfo/clinicPersonalInfo";
import CustomButton from "../../../reusable/customButton/customButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { useRouteMatch } from "react-router-dom";
import {
  fetchProfileAsync,
  selectProfileUsers,
} from "../../../profile/profileSlice";
import {
  closeSpinner,
  loadSpinner,
} from "../../../../reducres/reducers/spinner";
import AddDoctor from "../../Doctor/addDoctor/addDoctor";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  tabName: any;
  value: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, tabName, index, ...other } = props;

  return (
    <>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    </>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  fontWeight: 800,
  backgroundColor: "transparent",
}));

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  root1: {
    display: "block",
    margin: "0 auto",
    padding: theme.spacing(4),
  },
  title: {
    padding: theme.spacing(2),
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
    marginTop: theme.spacing(2),
  },
  changeColor: {
    "& > div > span": {
      background: "#b784a7",
    },
  },
}));

const ClinicProfile: React.FC<any> = () => {
  useEffect(() => {
    dispatch(loadSpinner());
    dispatch(fetchProfileAsync()).then(() => {
      dispatch(closeSpinner());
    });
  }, []);

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState(0);

  const { profileUsers } = useAppSelector(selectProfileUsers);

  const ClinicPersonalInfoRef = useRef<any>(null)

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if(value==0)return ClinicPersonalInfoRef.current?.onTabChange(()=>setValue(newValue))
    setValue(newValue)
  };

  const [tabName, setTabName] = useState("Clinic");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  let { path, url } = useRouteMatch();

  return (
    <div className="d-flex justify-content-center">
      <div className="clinic-tab-main col-md-10">
        {/* <NotificationHeader /> */}
        <Grid container spacing={2}>
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

          {/* <Grid
            xs={12}
            container
            spacing={0}
            style={{ justifyContent: "space-between" }}
            className="d-flex align-items-center justify-content-between py-4 px-0"
          >
            <Item className="text-left border-0 Al pb-0 px-0 fs-35">
              <Typography variant="h3" className="main-heading">
                <span className={"fs-35"}>
                  <ArrowBackIcon style={{ fontSize: "35px" }} />
                </span>{" "}
                My Profile
              </Typography>
            </Item>

            {value == 1 && (
              <CustomButton
                data-target="#modalAddDoctor"
                component="div"
                className="upload-button m-0 py-4 px-5 fw-800"
              >
                Save Details
              </CustomButton>
            )}
          </Grid> */}

          <Grid item xs={12}>
            <Paper className={classes.root}>
              <Tabs
                value={value}
                onChange={handleTabChange}
                indicatorColor="primary"
                className={classes.changeColor}
                textColor="primary"
                centered
              >
                <Tab label="Clinic info" {...a11yProps(0)} className="clinic-tabs" />
                <Tab label="Doctors" {...a11yProps(1)} className="clinic-tabs" />
                <Tab
                  label="payments"
                  {...a11yProps(2)}
                  className="clinic-tabs"
                />
              </Tabs>
            </Paper>
            <Paper className="clinic-tab-paper">
              <TabPanel value={value} index={0} tabName="Clinic info">
                <ClinicPersonalInfo ref={ClinicPersonalInfoRef} {...profileUsers} />
                {/* <PersonalInfo {...profileUsers}/> */}
              </TabPanel>
              <TabPanel value={value} index={1} tabName="My Profile">
                <AddDoctor />
                {/* <ProfessionalInfo user_details={get(profileUsers,'user_details')} user_registration={get(profileUsers,'user_registration')} user_education={get(profileUsers,'user_education')} user_work_experience={get(profileUsers, 'user_work_experience')}/> */}
              </TabPanel>
              <TabPanel value={value} index={2} tabName="Payments">
                {/* <TreatmentsInfo/> */}
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ClinicProfile;
