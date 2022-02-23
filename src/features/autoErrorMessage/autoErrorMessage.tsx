import React, { useEffect, useState } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";
import { get } from "lodash";

const AutoErrorMessage: React.FC = () => {
  const [error, setError] = useState<boolean>(false);
  const [errorMesssge, setErrorMessage] = useState<string>("");
  const defaultErrorMessage =
    "Internal Server Error please contact Administrator!";
  useEffect(() => {
    axios.interceptors.request.use(
      function (config) {
        setError(false);
        setErrorMessage("");
        return config;
      },
      function (error) {
        setError(true);
        setErrorMessage(defaultErrorMessage);
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      function (response) {
        setError(false);
        setErrorMessage("");
        return response;
      },
      function (error) {
        setError(true);
        const errorMessage: string = get(error, "response.data.message", "");
        setErrorMessage(errorMessage || defaultErrorMessage);
        return Promise.reject(error);
      }
    );
  }, []);
  return (
    <>
      {error && (
        <Alert severity="error">
          <AlertTitle>Opps! Error</AlertTitle>
          {errorMesssge}
        </Alert>
      )}
    </>
  );
};
export default AutoErrorMessage;
