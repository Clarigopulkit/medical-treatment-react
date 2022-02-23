import React, { useState } from "react";
import CustomPopup from "../features/reusable/customPopup/customPopup";

let ContextOne = React.createContext<any>({});
let initialState = {
  theme: null,
  spinner: false,
};

let reducer = (state: any, action: any) => {
  switch (action.type) {
    case "change":
      return {
        ...state,
        theme: action.theme,
      };
    default:
      return { ...state };
  }
};

function ContextOneProvider(props: any) {
  let [state, dispatch] = React.useReducer<any>(reducer, initialState);
  // const [popupVisible, setPopupVisibility] = useState<any>()

  // const customPopup = ({title, onYes,hideSecondaryButton=null, message=null}) => {
  //   setPopupVisibility({title,onYes, hideSecondaryButton, message})
  // }

  let value = { state, dispatch, /* customPopup */ };
  return (
    <ContextOne.Provider value={value}>
      {/* {popupVisible && <CustomPopup {...popupVisible} visible={popupVisible ? true : false} dismiss={() => setPopupVisibility(null)} />} */}
      {props.children}
    </ContextOne.Provider>
  );
}

let ContextOneConsumer = ContextOne.Consumer;
export { ContextOne, ContextOneProvider, ContextOneConsumer };
