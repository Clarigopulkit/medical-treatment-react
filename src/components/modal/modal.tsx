import { Form, Formik, FormikProps } from "formik";
import React from "react";
import CustomButton from "../../features/reusable/customButton/customButton";
import CustomTextField from "../../features/reusable/customTextField/customTextField";
import Modal from "@material-ui/core/Modal";
import { Grid, makeStyles, createStyles, Theme, Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { DeleteDataFormUser } from "../../features/SP/Doctor/profile/personalTab/personalInfoSlice";
import { useAppDispatch } from "../../hooks/hooks";
import Toast from "../../reducres/reducers/toast";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "block",
      margin: "0 auto",
    },
    title: {
      padding: theme.spacing(3),
    },
    textField: {
      marginBottom: theme.spacing(2),
    },
    linkCheckbox: {
      alignItems: "center",
    },
    chanpePassword: {
      height: "41px",
      marginTop: "20px",
    },
    typogarphy: {
      textAlign: "right",
    },
    submitButton: {
      marginBottom: "30px",
    },
    paper: {
      "& > * ": {
        textAlign: "center",
      },
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #debcbd",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3), top: '50% !important',
      left: '50% !important',
      transform: 'translate(-50%, -50%)!important',
    },
  })
);

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

export default function Modla(props) {
  const [modalStyle] = React.useState(getModalStyle);

  const dispatch = useAppDispatch();

  const handledelete = (values, fieldFunciton) => {
    dispatch(DeleteDataFormUser({ id: values.id, type: values.type })).then(
      (response) => {
        if (response?.payload?.data?.statusCode == 200) {
          Toast.success(response?.payload?.data?.message);
          props.close();
        } else {
          Toast.error(response?.payload?.data?.message);
        }
      }
    );
  };

  const classes = useStyles();

  return (
    <Modal
    // style={{backgroundColor:}}
      open={props?.open}
      onClose={props?.close}
      aria-labelledby="modal-delete-address"
      aria-describedby="modal-delete-address"
    >
      <Form autoComplete="false">
        <div style={modalStyle} className={classes.paper}>
          {/* {setTimer(30)} */}
          <span
            id="simple-modal-description"
            style={{
              right: "20px",
              top: "10px",
              position: "absolute",
              float: "right",
              fontSize: "20px",
              color: "rgb(65 100 85)",
              fontWeight: 600,
              padding: "2px 5px",
              cursor: "pointer",
            }}
            onClick={async () => {
              props?.close();
            }}
          >
            X
          </span>
         
          <p
            id="simple-modal-description"
            style={{
              fontSize: "18px",
              color: "rgb(65 100 85)",
              fontWeight: 600,marginTop:"30px"
            }}
          >
            {/* Enter OTP sent to your mail <br />
                {"*****" + verifyOtpp?.email.slice(4) + " "} to change your
              Password. */}
            {props?.content?.message || "Are you sure you want to delete image?"} <br />
            {/* this {props?.type} */}
            {/* <span>?This data will be deleted permanently.</span> */}
          </p>
        
          {/* <CustomTextField
                variant="outlined"
                fullWidth
                placeholder="OTP"
                name="otp"
                defaultValue={values.otp}
                onChange={
                  handleChange
                }
                helperText={
                  errors && errors.otp && touched && touched.otp && errors.otp
                }
                error={
                  errors && errors.otp && touched && touched.otp && errors.otp
                  ? true
                  : false
                }
              /> */}

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          
          >
             <CustomButton
              variant="outlined"
              fullWidth
              style={{
                background: "none",
                border: "1px solid #085044",
                color: "#085044",
              }}
              onClick={() => {
                props?.close();
              }}
            >
              No
            </CustomButton>
            <CustomButton
              variant="outlined"
              fullWidth
              onClick={() => {
                if (props?.content?.id !== undefined) {
                  handledelete(
                    { ...props.content, type: props.type },
                    props.content.setField()
                  );
                } else {
                  props.content.setField();
                  Toast.success(`Successfully deleted ${props?.type}`);

                  props?.close();
                }
              }}
            >
              Yes
            </CustomButton>
           
          </Box>
          <div
            className="pointer"
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#085044",
            }}
          ></div>
        </div>
      </Form>
    </Modal>
  );
}
