import React from "react";
import { useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Badge,
  Link,
  TextareaAutosize,
  Breadcrumbs,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";

import { useAppDispatch } from "../../hooks/hooks";
import "./dashboard.scss";
import CustomButton from "../reusable/customButton/customButton";
import { fetchProfileAsync } from "../profile/profileSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const Dashboard: React.FC<any> = (props) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState<number | null>(2);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
  }
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        width: "100%",
        backgroundColor: theme.palette.background.paper,
      },
      inline: {
        display: "inline",
      },
      main_heading: {
        "& > div": {},
      },
    })
  );

  const classes = useStyles();
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <>
      <Grid container spacing={0} className="BT-Dashboard">
        <Grid item xs={12}>
          {/* Breadcrumbs */}
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/" onClick={handleClick}>
              Dashboard
            </Link>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12} className={classes.main_heading}>
          {/* Titlle bar */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h3" className="main-heading">
              Welcome John
            </Typography>
            <CustomButton
              onClick={() => props.history.push("post-request")}
              className="post-request-button-content"
            >
              Post Request
            </CustomButton>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={5} className="BT-Dashboard">
        <Grid item xs={12} md={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className="dashboard-card"
          >
            <div className="card-content">
              <span>
                <b>4</b> Active
              </span>
              <p>Total Requests</p>
            </div>
            <img
              src={require("../../utils/images/dashboard_icons/requests.png")}
              alt="logo"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className="dashboard-card"
          >
            <div className="card-content">
              <span>
                <b>36</b>
              </span>
              <p>Active Orders</p>
            </div>
            <img
              src={require("../../utils/images/activeOrders.png").default}
              alt="logo"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className="dashboard-card"
          >
            <div className="card-content">
              <span>
                <b>$1680</b>
              </span>
              <p>Pending Amount</p>
            </div>
            <img
              src={require("../../utils/images/pendingAmount.png").default}
              alt="logo"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Recommended Articles */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            className="articles-sub-heading-grid"
          >
            <Typography variant="h6" className="articles-heading">
              Recommended Articles
            </Typography>
            <Typography variant="h6" className="dark-blue-link">
              See All
            </Typography>
          </Box>

          <ul className="dashboard-card">
            {/* Recommended Articles List */}
            <li>
              <Typography className="bold-green-content">
                Recommended Articles
              </Typography>
              <p className="typo-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <Link className="blue-link" href="#text-buttons">
                Read More
              </Link>
            </li>
            <li>
              <Typography className="bold-green-content">
                Recommended Articles
              </Typography>
              <p className="typo-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <Link className="blue-link" href="#text-buttons">
                Read More
              </Link>
            </li>

            <li>
              <Typography className="bold-green-content">
                Recommended Articles
              </Typography>
              <p className="typo-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <Link className="blue-link" href="#text-buttons">
                Read More
              </Link>
            </li>
          </ul>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Latest Quotes */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            className="articles-sub-heading-grid"
          >
            <Typography variant="h6" className="articles-heading">
              Latest Proposals
              <Badge
                badgeContent={4}
                color="primary"
                className="quotes-badge pl-4"
              />
            </Typography>
            <Typography variant="h6" className="dark-blue-link">
              See All
            </Typography>
          </Box>

          <ul className="dashboard-card dr-card">
            {/* Latest Proposals List */}
            <li>
              <Typography className="bold-green-content">
                Face Pimples Problem
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <div className="dr-image">
                  <img
                    src={require("../../utils/images/doctor.png").default}
                    height="65px"
                    width="75px"
                    alt="logo"
                  />
                  <div className="dr-name">
                    <Typography component="legend" className="type-medium">
                      Dr. Sanford M
                    </Typography>
                    <Rating
                      name="simple-controlled"
                      value={value}
                      className="rating"
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                    />
                  </div>{" "}
                </div>
                <Typography className="quotes-fee">$500</Typography>
              </Box>
            </li>

            <li>
              <Typography className="bold-green-content">
                Face Pimples Problem
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <div className="dr-image">
                  <img
                    src={require("../../utils/images/doctor.png").default}
                    height="65px"
                    width="75px"
                    alt="logo"
                  />
                  <div className="dr-name">
                    <Typography component="legend" className="type-medium">
                      Dr. Sanford M
                    </Typography>
                    <Rating
                      name="simple-controlled"
                      value={value}
                      className="rating"
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                    />
                  </div>
                </div>
                <Typography className="quotes-fee">$500</Typography>
              </Box>
            </li>
            <li>
              <Typography className="bold-green-content">
                Face Pimples Problem
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <div className="dr-image">
                  <img
                    src={require("../../utils/images/doctor.png").default}
                    height="65px"
                    width="75px"
                    alt="logo"
                  />
                  <div className="dr-name">
                    <Typography component="legend" className="type-medium">
                      Dr. Sanford M
                    </Typography>
                    <Rating
                      name="simple-controlled"
                      value={value}
                      className="rating"
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                    />
                  </div>{" "}
                </div>
                <Typography className="quotes-fee">$500</Typography>
              </Box>
            </li>
          </ul>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Rate your completed Orders*/}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            className="articles-sub-heading-grid"
          >
            <Typography variant="h6" className="articles-heading">
              Rate your completed Orders
            </Typography>
          </Box>
          <ul className="dashboard-card">
            {/* Rate your completed Orders List */}
            <li>
              <Box display="flex">
                <div className="dr-image">
                  <img
                    src={require("../../utils/images/doctor.png").default}
                    height="65px"
                    width="75px"
                    alt="logo"
                  />
                  <div className="dr-name">
                    <Box>
                      <Typography component="legend" className="type-medium">
                        Dr. Sanford M
                      </Typography>
                      <Rating
                        name="simple-controlled"
                        value={value}
                        className="rating"
                        onChange={(event, newValue) => {
                          setValue(newValue);
                        }}
                      />
                    </Box>
                  </div>{" "}
                </div>
              </Box>
              <Box mt={4} display="flex" flexDirection="column">
                <TextareaAutosize
                  className="text-area-field"
                  aria-label="minimum height"
                  rowsMin={13}
                  placeholder="Write here"
                />
                <CustomButton fullWidth className="quote-submit-button">
                  Submit
                </CustomButton>
              </Box>
            </li>
          </ul>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
