import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import {
  hideHeader,
  showHeader,
} from "../reducres/reducers/notificationHeader";
import { closeSpinner, loadSpinner } from "../reducres/reducers/spinner";
import Auth from "./Auth";

export const ClinicRoutes = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(hideHeader());
    dispatch(loadSpinner());
    setTimeout(() => {
      dispatch(closeSpinner());
    }, 3000);
  });

  return (
    <Route
      {...rest}
      render={(props) => {
        if (
          Auth.isAuthenticated().authenticated &&
          Auth.isAuthenticated().role === "Clinic"
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
