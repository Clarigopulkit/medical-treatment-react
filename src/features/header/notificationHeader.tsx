import React from "react";
import {
  AppBar,
  Typography,
  createStyles,
  Theme,
  makeStyles,
  Grid,
  Link,
  Box,
} from "@material-ui/core";
import "./notificationHeader.scss";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {},
  })
);

const NotificationHeader: React.FC<any> = () => {
  const classes = useStyles();
  return (
    <div className="notification-header">
      <AppBar position="relative" className="notification-header-app-bar">
        <Grid container className="notification-header-container">
          <Grid item xs={12} className="notification-header-title">
            <Box
            className="FontFam"
              display="flex"
              alignItems="baseline"
              justifyContent="center"
              flexWrap="wrap"
              
            >
              <Typography
                variant="h6"
                className="notification-header-title-content"
              >
                Find a Covid-19 vaccine appointment.
              </Typography>

              <Typography variant="h6">
                <Link href="#" className="book-appointment-link">
                  Book Appointment
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {/* <Header/>         */}
      </AppBar>
    </div>
  );
};
export default NotificationHeader;
