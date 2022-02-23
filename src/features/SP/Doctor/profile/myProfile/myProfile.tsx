import React, { useRef, useState } from "react";

import { Grid, Paper, Button } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { get } from "lodash";

import "./myProfile.scss";
import PersonalInfo from "../personalTab/personalInfo";
import ProfessionalInfo from "../professionalInfo/professionalInfo";
import TreatmentsInfo from "../treatmentsInfo/treatmentsInfo";
import BusinessInfo from "../businessInfo/businessInfo";
import VisibleProfileInfo from "../visibleProfileInfo/visibleProfileInfo";
import NotificationHeader from "../../../../header/notificationHeader";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import {
  fetchProfileAsync,
  selectProfileUsers,
} from "../../../../profile/profileSlice";
import { useSelector } from "react-redux";
import Modal from "@material-ui/core/Modal";
import Toast from "../../../../../reducres/reducers/toast";
import {
  closeSpinner,
  loadSpinner,
} from "../../../../../reducres/reducers/spinner";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
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
  paper: {
    position: "absolute",
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #fff",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  changeColor: {
    "& > div > span": {
      background: "#b784a7",
    },
  },
}));

const MyProfile: React.FC<any> = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState(0);

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const { profileUsers } = useAppSelector(selectProfileUsers);

  const PersonalInfoRef = useRef<any>(null)
  const ProfessionalInfoRef = useRef<any>(null)
  const BusinessInfoRef = useRef<any>(null)

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(loadSpinner());
    dispatch(fetchProfileAsync()).then((result) => {
      if (result?.payload?.phone !== undefined) {
        dispatch(closeSpinner());
      }
      if (result?.payload?.response?.data?.statusCode == 400) {
        Toast.error(result?.payload?.response?.data?.message);
        dispatch(closeSpinner());
      }
    });
  }, []);
  const body = (
    <div className="treatment-popup">
      <div style={modalStyle} className={classes.paper}>
        {/* <h2 id="simple-modal-title">Text in a modal</h2> */}
        <Typography variant="h5" id="simple-modal-description">
          Please Get Verified First.
        </Typography>
        <Box display="flex" justifyContent="space-evenly" alignItems="center">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </Box>
      </div>
    </div>
  );

  const state = useSelector((state) => state["profile"]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {

    const change = () => {
      dispatch(loadSpinner());
      if (newValue == 2) {
        if (state?.profileUsers?.is_active == 1) {
          setValue(newValue);
          setTimeout(() => {
            dispatch(closeSpinner());
          }, 2000);
        } else {
          setValue(newValue);
          setTimeout(() => {
            dispatch(closeSpinner());
          }, 2000);
        }
      } else {
        setValue(newValue);
        setTimeout(() => {
          dispatch(closeSpinner());
        }, 2000);
      }
    }

    if(value==0)return PersonalInfoRef.current?.onTabChange(change)
    if(value==1)return ProfessionalInfoRef.current?.onTabChange(change)
    if(value==3)return BusinessInfoRef.current?.onTabChange(change)
    change()
  };



  return (
    <div className="profile-tab-main">
      {/* <NotificationHeader />           */}
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
      </div>
      <Grid container >
        <Grid item xs={12}>
          <Paper className={classes.root}>
            <Tabs
              value={value}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered

              className={`outer-tabs ${classes.changeColor}`}
            >
              <Tab
                label="Personal Info"
                {...a11yProps(0)}
                className="profile-tabs"
              />
              <Tab
                label="Professional Info"
                {...a11yProps(1)}
                className="profile-tabs"
              />
              <Tab
                label="Treatments"
                {...a11yProps(2)}
                className="profile-tabs"
              />
              <Tab
                label="Business Info"
                {...a11yProps(3)}
                className="profile-tabs"
              />
              <Tab
                label="Public Profile"
                {...a11yProps(4)}
                className="profile-tabs"
              />
            </Tabs>
          </Paper>
          <Paper className="profile-tab-paper">
            <TabPanel value={value} index={0}>
              <PersonalInfo ref={PersonalInfoRef} {...profileUsers} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ProfessionalInfo
                ref={ProfessionalInfoRef}
                speciality_info={get(profileUsers, "user_details")}
                is_active={get(profileUsers, "is_active")}
                user_details={get(profileUsers, "user_details")}
                user_registration={get(profileUsers, "user_registration")}
                user_education={get(profileUsers, "user_education")}
                user_work_experience={get(profileUsers, "user_work_experience")}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <TreatmentsInfo />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <BusinessInfo
              ref={BusinessInfoRef}
                user_payment_information={get(
                  profileUsers,
                  "user_payment_information"
                )}
                user_business_info={get(profileUsers, "user_business_info")}
              />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <VisibleProfileInfo
                {...profileUsers}
                user_details={get(profileUsers, "user_details")}
                doctor_portfolio={get(profileUsers, "doctor_portfolio")}
                doctor_hospital_clinic={get(
                  profileUsers,
                  "doctor_hospital_clinic"
                )}
              />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default MyProfile;
