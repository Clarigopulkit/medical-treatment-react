import React from "react";
import { useEffect } from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import request from "../../../utils/images/dashboard_icons/requests.png";
import { Grid, Typography, Card } from "@material-ui/core";
import axios from "axios";

import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { selectLogin } from "../../login/loginSlice";
import "./dashboard.scss";
import notificationHeader from "../../../reducres/reducers/notificationHeader";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);



const SPDashboard: React.FC<any> = (props) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectLogin);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <div className="BT-Dashboard manage-container1">
      <Grid container spacing={4}>
        {/* Welcome Title */}
        <Grid item xs={12} style={{padding: "0px", paddingLeft: "15px"}}>
          <p className="name" >Welcome {user.first_name}</p>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <Grid container style={{ alignItems: "center", }}>
              <Grid item xs={6}>
                {/* total Requests */}
                <Typography className="headings-total-content" variant="h5">
                  4{" "}
                </Typography>
                <Typography className="headings-content" variant="h6">
                  Requests
                </Typography>
              </Grid>
              <Grid item xs={6} className="grid-cards">
                <img
                  src={require("../../../utils/images/dashboard_icons/requests.svg").default}
                  height="60px"
                  width="60px"
                  alt="logo"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        {/* My Quotes */}
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <Grid container style={{ alignItems: "center" }}>
              <Grid item xs={6}>
                <Typography className="headings-total-content" variant="h5">
                  2
                </Typography>
                <Typography className="headings-content" variant="h6">
                  My Quotes
                </Typography>
              </Grid>
              <Grid item xs={6} className="grid-cards">
                <img
                  src={require("../../../utils/images/dashboard_icons/my-quotes.png").default}
                  height="60px"
                  width="60px"
                  alt="logo"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        {/*  My orders */}
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <Grid container style={{ alignItems: "center" }}>
              <Grid item xs={6}>
                <Typography className="headings-total-content" variant="h5">
                  2
                </Typography>
                <Typography className="headings-content" variant="h6">
                  My orders
                </Typography>
              </Grid>
              <Grid item xs={6} className="grid-cards">
                <img
                  src={
                    require("../../../utils/images/dashboard_icons/my-orders.png").default
                  }
                  height="60px"
                  width="60px"
                  alt="logo"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Payments */}
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <Grid container style={{ alignItems: "center", }}>
              <Grid item xs={6}>
                <Typography className="headings-total-content" variant="h5">
                  4
                </Typography>
                <Typography className="headings-content" variant="h6">
                  Financial
                </Typography>
              </Grid>
              <Grid item xs={6} className="grid-cards">
                <img
                  src={
                    require("../../../utils/images/dashboard_icons/payments.png").default
                  }
                  height="60px"
                  width="60px"
                  alt="logo"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        {/* Favourite */}
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <Grid container style={{ alignItems: "center" }}>
              <Grid item xs={6}>
                <Typography className="headings-total-content" variant="h5">
                  2
                </Typography>
                <Typography className="headings-content" variant="h6">
                  Favourites
                </Typography>
              </Grid>
              <Grid item xs={6} className="grid-cards">
                <img
                  src={require("../../../utils/images/dashboard_icons/favourites.png").default}
                  height="60px"
                  width="60px"
                  alt="logo"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        {/* Profile */}
        <Grid item xs={12} md={4}>
          <Card className="dashboard-card">
            <Grid container style={{ alignItems: "center" }}>
              <Grid item xs={6}>
                <Typography className="headings-total-content" variant="h5">
                  1
                </Typography>
                <Typography className="headings-content" variant="h6">
                  Profile
                </Typography>
              </Grid>
              <Grid item xs={6} className="grid-cards">
                <img
                  src={require("../../../utils/images/dashboard_icons/profile.png").default}
                  height="60px"
                  width="60px"
                  alt="logo"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SPDashboard;
