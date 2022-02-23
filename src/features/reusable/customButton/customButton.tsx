import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "./customButton.scss";
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(2.4, 0),
      textTransform: "capitalize !important",
      fontFamily: "Open Sans Bold !important",
      fontWeight:"600 !important"
    },
  },
  button: {
    height: "41px",
    minWidth: "160px",

    borderRadius: "50px",
    maxWidth: "100%",
    fontSize: 15,
    fontWeight: 600,
    background: "#085044",
    color: "white",
    "&: hover": {
      background: "gray",
    },
    boxShadow: "none !important",
  },

  customChange: {
    fontWeight: 700,
    fontSize: "18px",
  },
}));

const CustomButton: React.FC<any> = ({
  variant,
  color,
  className,
  type,
  size,
  fullWidth,
  onClick,
  component,
  children,
  change,
  buttonStyle,
  ...inputProps
}) => {
  const classes = useStyles();
  return (
    <div
      className={`${classes.root} custom-button `}
      style={{ boxSizing: "border-box" }}
    >
      <Button
      style={buttonStyle}
        variant={variant}
        color={color}
        className={`${className} ${classes.button} custom-button-content `}
        type={type}
        size={size}
        fullWidth={fullWidth}
        onClick={onClick}
        {...inputProps}
        component={component}
      >
        <span className={change === "styleSubmit" && classes.customChange}>
          {children}
        </span>
      </Button>
    </div>
  );
};

export default CustomButton;
