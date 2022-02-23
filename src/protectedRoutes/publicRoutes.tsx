import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { showHeader } from "../reducres/reducers/notificationHeader";
import { closeSpinner, loadSpinner } from "../reducres/reducers/spinner";

export const PublicRoutes = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showHeader());
    dispatch(loadSpinner());
    setTimeout(() => {
      dispatch(closeSpinner());
    }, 2000);
  });

  return (
    <Route
      {...rest}
      render={(props) => {
        return <Component {...props} />;
      }}
    />
  );
};
