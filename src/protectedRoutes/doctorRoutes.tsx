import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import {
  hideHeader,
  showHeader,
} from "../reducres/reducers/notificationHeader";
import { closeSpinner, loadSpinner } from "../reducres/reducers/spinner";
import auth from "./Auth";

export const DoctorRoutes = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(hideHeader());

    dispatch(loadSpinner());
    setTimeout(() => {
      dispatch(closeSpinner());
    }, 2000);
  });

  return (
    <Route
      {...rest}
      render={(props) => {
        if (
          auth.isAuthenticated().authenticated &&
          auth.isAuthenticated().role === "Doctor"
        ) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};
