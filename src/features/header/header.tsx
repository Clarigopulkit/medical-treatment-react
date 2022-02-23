import React, { useEffect, useState } from "react";
import {
  alpha,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { CssBaseline, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { closeSpinner, loadSpinner } from "../../reducres/reducers/spinner";
import { clearStoreData } from "../login/loginSlice";
import { useAppDispatch } from "../../hooks/hooks";

import clsx from "clsx";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Auth from "../../protectedRoutes/Auth";
import Toast from "../../reducres/reducers/toast";
import { fetchLogoutAsync } from "../logout/logoutSlice";
import "./header.css";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
      "& > *": {
        backgroundColor: "white !important",
      },
      position: "sticky",
      top: 0,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("md")]: {
        display: "none !important",
      },
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    toolbar: {},
    settings: {
      justifyContent: "space-around !important",
      [theme.breakpoints.down("md")]: {
        justifyContent: "space-between !important",
      },
    },

    settingLogOut: {
      justifyContent: "center !important",
      [theme.breakpoints.down("sm")]: {
        justifyContent: "flex-start !important",
      },
    },
    Header_Options: {
      [theme.breakpoints.down("sm")]: {
        display: "none !important",
      },
      "& > p > a": {
        fontFamily: "CarlaSans !important",
        textDecoration: "none",
        color: "#085044 !important",
      },
    },

    list: {
      width: 250,
    },
    fullList: {
      width: "auto",
    },
    drawerFont: {
      "& > *": {
        fontFamily: "CarlaSans !important",
      },
    },
    imgheader: {
      backgroundColor: "#ffdedd !important",
    },
    listContainer: {
      overflow: "hidden",
      "& > ul": {
        paddingTop: "0px !important",
      },
      "& > ul > div:hover": {
        backgroundColor: "#ffdedd",
      },
      "& > ul > div > *": {
        textDecoration: "none !important",
        color: "black",
      },
    },
    Header_logo: {
      textAlign: "center",
      backgroundColor: "#ffdedd",
      padding: "10px 0px"
    },
    sideOpitons: {
      "& > div > ul > li": {
        color: "#404040 !important",
      },
    },
  })
);

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const history = useHistory();
  const handleProfileOpen = () => {
    if (Auth.isAuthenticated().role === "Clinic") {
      history.push("/clinic-personal-info");
    }
    if (Auth.isAuthenticated().role === "Doctor") {
      history.push("/MyProfile");
    }
    if (Auth.isAuthenticated().role === "Patient") {
      Toast.error("No Page Found");
    }
    setAnchorEl(null);
  };


  const Loginpage = () => {
    history.push("/login");
  };

  const dispatch = useAppDispatch();

  const handleClickLogout = () => {
    dispatch(loadSpinner());
    dispatch(fetchLogoutAsync({})).then(async (response) => {
      await dispatch(clearStoreData());
      dispatch(closeSpinner());
      window.location.href = '/login';
      // history.replace("/login");
    });
    setAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const [scroolHeight, setScrollHeight] = useState(0);
  useEffect(() => {
    if (
      document.getElementsByClassName("notification-header")[0]
        ?.scrollHeight !== undefined
    ) {
      setScrollHeight(
        document.getElementsByClassName("notification-header")[0].scrollHeight
      );
    } else {
      setScrollHeight(0);
    }
  });

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      className={classes.sideOpitons}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        id={"navBar_more_butoon"}
        onClick={(e) => {
          handleProfileOpen();
          setMobileMoreAnchorEl(null);
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        id={"navBar_more_butoon"}
        onClick={(e) => {
          handleClose();
          setMobileMoreAnchorEl(null);
        }}
      >
        My account
      </MenuItem>
      <MenuItem
        id={"navBar_more_butoon"}
        onClick={(e) => {
          handleClickLogout();
          setMobileMoreAnchorEl(null);
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton onClick={() => history.push("/advanced-search")} aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu >
  );

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  type Anchor = "top" | "left" | "bottom" | "right";

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, classes.listContainer, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem
          className={classes.imgheader}
          style={{ backgroundColor: "#ffdedd !important" }}
        >
          <Link to="/home">
          <img
            src={require("../../utils/images/Logo.png").default}
            width="100%"
            alt="logo Bg"
          />
          </Link>
        </ListItem>
        {Auth.isAuthenticated().authenticated === true
          ? ["DASBOARD", "MY REQUEST", "QUOTES", "ORDERS"].map(
            (text, index) => (
              <ListItem button key={text}>
                <Link
                  to={
                    text === "DASBOARD" &&
                      Auth.isAuthenticated().role === ("Clinic" || "Doctor")
                      ? "/sp-dashboard"
                      : text === "MY REQUEST"
                        ? "sp-my-requests"
                        : text === "QUOTES"
                          ? "#"
                          : ""
                  }
                >
                  {/* <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon> */}
                  <ListItemText
                    className={classes.drawerFont}
                    primary={text}
                    style={{ fontFamily: "CarlaSans !important" }}
                  />
                </Link>
              </ListItem>
            )
          )
          : ["How it works", " Influncers", "For Clinics", " E-Gifts"].map(
            (text, index) => (
              <ListItem button key={text}>
                <Link
                  to={
                    text === "How it works"
                      ? "#"
                      : text === " Influncers"
                        ? "#"
                        : text === "For Clinics"
                          ? "#"
                          : "#"
                  }
                >
                  {/* <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon> */}
                  <ListItemText
                    className={classes.drawerFont}
                    primary={text}
                    style={{ fontFamily: "CarlaSans !important" }}
                  />
                </Link>
              </ListItem>
            )
          )}
      </List>
      
      <Divider />
      <List>
        {/* {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))} */}
      </List>
    </div>
  );

  const [win, setWin] = useState<any>("unset");
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 323) {
        setWin((window.innerWidth - 50).toString());
      }
    });
  }, [window.innerWidth]);
  return (
    <>
      <div className="header">
        <CssBaseline />
        <div className="header-logo">
          <Grid container>
            <Grid item xs={12} className={classes.Header_logo}>
              <Link to="/home" >
                <img
                  src={require("../../utils/images/Logo.png").default}
                  height="100px"
                  style={{
                    width: win == "unset" ? win : win + "px",
                  }}
                  alt="logo Bg"
                />
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
      <div
        className={classes.grow}
        style={{ position: "sticky", top: scroolHeight, zIndex: 8 }}
      >
        <AppBar position="static">
          <Toolbar
            className={
              Auth.isAuthenticated().authenticated === true
                ? classes.settings
                : classes.settingLogOut
            }
          >
            <IconButton
              edge="start"
              className={classes.menuButton}
              aria-label="open drawer"
            >
              <MenuIcon onClick={toggleDrawer("left", true)} />
              <SwipeableDrawer
                anchor={"left"}
                open={state["left"]}
                onClose={toggleDrawer("left", false)}
                onOpen={toggleDrawer("left", true)}
              >
                {list("left")}
              </SwipeableDrawer>
            </IconButton>
            {/* <Typography className={classes.title} variant="h6" noWrap> */}
            {/* Beauty Tune */}
            {/* </Typography> */}
            {/*  New Condition */}

            {Auth.isAuthenticated().authenticated && (
              <div className={classes.sectionDesktop}>
                <IconButton onClick={() => history.push("/advanced-search")} aria-label="show 4 new mails" color="inherit">
                  <Badge /* badgeContent={4} */ color="secondary">
                    {/* <MailIcon /> */}
                    <img
                      src={require("../../utils/images/search.png").default}
                      width="25px"
                      height="20px"
                      alt="logo Search"
                    />
                  </Badge>
                </IconButton>
                {(Auth.isAuthenticated().role !== "Clinic") ?
                  <IconButton
                    aria-label="show 17 new notifications"
                    color="inherit"
                  >
                    <Badge color="secondary">
                      <img
                        src={require("../../utils/images/heart.png").default}
                        width="25px"
                        height="25px"
                        alt="logo heart"
                      />
                      {/* <NotificationsIcon /> */}
                    </Badge>
                  </IconButton> : null
                }

                {(Auth.isAuthenticated().role !== "Clinic") ?
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <img
                      src={require("../../utils/images/Info.png").default}
                      width="25px"
                      height="25px"
                      alt="logo info"
                    />
                  </IconButton> : null
                }
              </div>
            )}

            
{
   (() => {
       if ((Auth.isAuthenticated().authenticated === true) && (Auth.isAuthenticated().role !== "Clinic") )
          return  <Grid
          className={classes.Header_Options}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {/* <Grid item> */}
          <Typography className="px-3">
            <Link
              to={
                Auth.isAuthenticated().role === "Clinic" ||
                  Auth.isAuthenticated().role === "Doctor"
                  ? "/sp-dashboard"
                  : "/dashboard"
              }
              className="clinics-link"
            >
              Dashboard
            </Link>
          </Typography>

          <Typography className="px-3">
            <Link
              to={
                Auth.isAuthenticated().role === "Clinic" ||
                  Auth.isAuthenticated().role === "Doctor"
                  ? "/sp-my-requests"
                  : "/sp-my-requests"
              }
              className="clinics-link"
            >
              My Requests
            </Link>
          </Typography>

          <Typography className="px-3">
            <Link to="#" className="clinics-link">
              Quotes
            </Link>
          </Typography>

          <Typography className="px-3 ">
            <Link to="#" className="clinics-link">
              Orders
            </Link>
          </Typography>
        </Grid>
      if((Auth.isAuthenticated().authenticated === true) && (Auth.isAuthenticated().role == "Clinic"))
      return <Grid
      className={classes.Header_Options}
      style={{ justifyContent: "space-between",marginRight:25,marginLeft:25 }}
    >
           {/* <IconButton onClick={()=>  history.push("/advanced-search")} aria-label="show 4 new mails" color="inherit">
          <Badge color="secondary">
            <img
              src={require("../../utils/images/search.png").default}
              width="25px"
              height="20px"
              alt="logo"
            />
          </Badge>
        </IconButton> */}
      <Grid
        className={classes.Header_Options}
        style={{ display: "flex", justifyContent: "space-between",marginTop:12 }}
      >
        <Typography className="px-3">
          <Link to="/#" className="clinics-link">
            How it works
          </Link>
        </Typography>

        <Typography className="px-3">
          <Link to="/#" className="clinics-link">
            Influncers
          </Link>
        </Typography>

        <Typography className="px-3">
          <Link to="#" className="clinics-link">
            For Clinics
          </Link>
        </Typography>

        <Typography className="px-3 ">
          <Link to="#" className="clinics-link">
            E-Gifts
          </Link>
        </Typography>
      </Grid>
      </Grid>
      if(Auth.isAuthenticated().authenticated === false)
      return <Grid
      className={classes.Header_Options}
      style={{ flex:1,display: "flex", justifyContent: "space-between",marginRight:90,marginLeft:90 }}
    >
           <IconButton onClick={()=>  history.push("/advanced-search")} aria-label="show 4 new mails" color="inherit">
          <Badge color="secondary">
            <img
              src={require("../../utils/images/search.png").default}
              width="25px"
              height="20px"
              alt="logo"
            />
          </Badge>
        </IconButton>
      <Grid
        className={classes.Header_Options}
        style={{ display: "flex", justifyContent: "space-between",marginTop:12 }}
      >
        <Typography className="px-3">
          <Link to="/#" className="clinics-link">
            How it works
          </Link>
        </Typography>

        <Typography className="px-3">
          <Link to="/#" className="clinics-link">
            Influncers
          </Link>
        </Typography>

        <Typography className="px-3">
          <Link to="#" className="clinics-link">
            For Clinics
          </Link>
        </Typography>

        <Typography className="px-3 ">
          <Link to="#" className="clinics-link">
            E-Gifts
          </Link>
        </Typography>
      </Grid>
      <IconButton
            edge="end"
            aria-label="account of current user my page"
            // aria-controls={menuId}
            aria-haspopup="true"
            onClick={Loginpage}
            color="inherit"
          >
            <img
              src={require("../../utils/images/user.png").default}
              width="25px"
              height="25px"
              alt="logo"
            />
          </IconButton>
      </Grid>
   })()
}
            {Auth.isAuthenticated().authenticated && (
              <>
                <div className={classes.sectionDesktop} >
                {(Auth.isAuthenticated().role !== "Clinic")?
                  <IconButton  aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                      <img
                        src={
                          require("../../utils/images/notification.png").default
                        }
                        width="25px"
                        height="25px"
                        alt="logo notification"
                       
                      />
                    </Badge>
                  </IconButton>:null}
                  {(Auth.isAuthenticated().role !== "Clinic")?
                  <IconButton
                    aria-label="show 17 new notifications"
                    color="inherit"
                  >
                    <Badge badgeContent={17} color="secondary">
                      <img
                        src={require("../../utils/images/chat.png").default}
                        width="25px"
                        height="25px"
                        alt="logo Chat"
                      />
                    </Badge>
                  </IconButton>:null}
                  
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <img
                      src={require("../../utils/images/user.png").default}
                      width="25px"
                      height="25px"
                      alt="logo user"
                    />
                  </IconButton>
                </div>
                <div className={classes.sectionMobile}>
                  <IconButton
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                  >
                    <MoreIcon />
                  </IconButton>
                </div>
              </>
            )}
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
    </>
  );
}
