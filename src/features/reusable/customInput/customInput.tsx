import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import "./customInput.scss";

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

const CustomInput: React.FC<any> = ({
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
  textFieldProps,
  containerStyles,
  multiline,
  rows,
  inputProps,
}) => {
  const classes = useStyles();
  const textFieldClassName = `${className} ${classes.textField} ${classes.fixBorder}  ${error && classes.error}  text-field login-text-field`
  return (
    <div className={`custom-text-field`} {...containerStyles} aria-target={name}>
      {(fieldName || textFieldProps.placeholder) && (
        <div style={{ fontSize: "15px" }}>
          {fieldName || textFieldProps.placeholder}
          {textFieldProps.required!==false && <span style={{ color: "red" }}>*</span>}
        </div>
      )}
      <TextField
        {...textFieldProps}
        fullWidth
        hiddenLabel
        className={textFieldClassName}
        InputProps={{ ...InputProps, className: classes.input }}
        error={error ? true : false}
        helperText={error?.message}
        variant="outlined"
      />
      {/* <TextField
        id={id}
        label={label}
        variant={variant}
        autoComplete={autoComplete}
        className={textFieldClassName}
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
      /> */}
    </div>
  );
};

export default CustomInput;
