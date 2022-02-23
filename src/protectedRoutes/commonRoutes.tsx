import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import {
  hideHeader,
  showHeader,
} from "../reducres/reducers/notificationHeader";
import { closeSpinner, loadSpinner } from "../reducres/reducers/spinner";
import auth from "./Auth";

export const CommonRoutes = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hideHeader());
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
          (auth.isAuthenticated().role === "Doctor" ||
            auth.isAuthenticated().role === "Clinic")
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
