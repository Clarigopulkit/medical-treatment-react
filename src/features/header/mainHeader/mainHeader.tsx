import React from "react";
import {
  CssBaseline,
  Typography,
  Grid,
  Link,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import "../header.scss";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";

import {
  fetchLogoutAsync,
  selectLogout,
  updateIsSuccess,
} from "../../logout/logoutSlice";
import { fetchLogout } from "../../logout/logoutAPI";

const MainHeader: React.FC<any> = ({ history }) => {
  const dispatch = useAppDispatch();
  const { isSuccess, loading } = useAppSelector(selectLogout);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const manageProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileOpen = () => {
    history.push("doctor-profile");
    setAnchorEl(null);
  };

  return (
    <div className="header">
      <CssBaseline />
      <div className="header-logo">
        <Grid container>
          <Grid item xs={12} className="header-logo-content">
            <img
              src={require("../../../utils/images/Logo.png").default}
              height="100px"
              alt="logo"
            />
          </Grid>
        </Grid>
      </div>
      <div className="sub-header">
        <div>
          <Grid
            container
            className="main-container"
            style={{ justifyContent: "space-between" }}
          >
            <Grid item xs={3} className="header-search-icon">
              <img
                src={require("../../../utils/images/search.png").default}
                width="30px"
                height="24px"
                alt="logo"
              />
            </Grid>
            <Grid item xs={4} className="header-body-content">
              <Typography>
                <Link href="#" className="clinics-link">
                  How it works
                </Link>
              </Typography>
              <Typography>
                <Link href="create-influencers" className="clinics-link">
                  Influncers
                </Link>
              </Typography>
              <Typography>
                <Link href="clinics" className="clinics-link">
                  For Clinics
                </Link>
              </Typography>
              <Typography>
                <Link href="#" className="clinics-link">
                  E-Gifts
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={3} className="header-profile-icon">
              <Button className="user-icon-button" onClick={manageProfileClick}>
                <img
                  src={require("../../../utils/images/user.png").default}
                  width="25px"
                  height="25px"
                  alt="logo"
                />
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>Profile</MenuItem>
                {/* <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClickLogout}>Logout</MenuItem> */}
              </Menu>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default withRouter(MainHeader);
