import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import "./customTextField.scss";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(4),

        minHeight: "40px",
        height: "40px",
      },
    },
    textField: {
      border: "none",
      "&$focused": {
        border: "none",
      },
    },
    input: {
      WebkitBoxShadow: "0 0 0 1000px white inset",
    },

    fixBorder: {
      "& > div ": {
        border: "0px !important",
      },
    },

    error: {
      "& > div > fieldset": {
        border: "1px solid red !important",
      },
    },
  })
);

const CustomTextField: React.FC<any> = ({
  id,
  label,
  variant,
  autoComplete,
  name,
  className,
  inputRef,
  helperText,
  color,
  InputProps,
  defaultValue,
  type,
  value,
  readOnly,
  disabled,
  error,
  fieldName,
  fullWidth,
  onChange,
  placeholder,
  required,
  multiline,
  rows,
  inputProps,
}) => {
  const classes = useStyles();
  return (
    <div className={`custom-text-field ${error && "error"}`} aria-target={name}>
      {fieldName && (
        <div style={{ fontSize: "15px",color:'#085044',marginBottom:2 }}>
          {fieldName}
          {required && <span style={{ color: "red" }}>*</span>}
        </div>
      )}
      <TextField
        id={id}
        label={label}
        variant={variant}
        autoComplete={autoComplete}
        className={`${className} ${classes.textField} ${classes.fixBorder}  ${
          error && classes.error
        }  text-field`}
        inputProps={inputProps}
        color={color}
        defaultValue={defaultValue}
        disabled={disabled}
        error={error}
        multiline={multiline}
        inputRef={inputRef}
        InputProps={{ ...InputProps, className: classes.input }}
        fullWidth={fullWidth}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        helperText={helperText}
        value={value}
        rows={rows}
        name={name}
      ></TextField>
    </div>
  );
};

export default CustomTextField;
