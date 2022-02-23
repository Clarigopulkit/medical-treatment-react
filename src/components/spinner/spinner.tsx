import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Fallback from "../fallback/fallback";
import { closeSpinner } from "../../reducres/reducers/spinner";
import "./spinner.css";

export default function Spinner() {
  const state = useSelector((state) => state);
  const [spinner, setSpinner] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    setSpinner(state["spinner"].spinner);
    setTimeout(() => {
      dispatch(closeSpinner());
    }, 8000);
  }, [state]);

  return (
    <>
      {spinner == true ? (
        <>
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "fixed",
              zIndex: 99999,
            }}
          >
            <div
              className="overlay"
              style={{
                width: "100%",
                height: "100%",
                position: "sticky",
                background: "rgba(0, 0, 0, 0.1)",
                opacity: 1,
              }}
            >
              <Fallback />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
