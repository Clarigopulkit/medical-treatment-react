import React from "react";
import { Grid, Card } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import "./loginTab.scss";
import Login from "./login";
import UserRegister from "../register/register";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
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
    maxWidth: "475px",
    display: "block",
    margin: "0 auto",
    "& > div > div > div > div > span": {
      border: "0px !important",
    },
    "& > div > div > div > div > div >.Mui-selected": {
      backgroundColor: "#ffdedd",
    },
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

export default function AuthTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={`${classes.root1} login-tab-main`}>
      <Grid container>
        <Grid item xs={12}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="simple tabs example"
            className={`login-tabs-container ${classes.changeColor}`}
          >
            <Tab
              fullWidth
              label="Log In"
              {...a11yProps(0)}
              className="login-tab"
            />
            <Tab
              fullWidth
              label="Register"
              {...a11yProps(1)}
              className="login-tab"
            />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          <Card className="login-card">
            <TabPanel value={value} index={0}>
              <Login setValue={setValue} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <UserRegister setValue={setValue} />
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
