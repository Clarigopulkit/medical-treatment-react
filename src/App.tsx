import "./App.scss";
import AppRoute from "./appRoute";
import Spinner from "./components/spinner/spinner";
import { ContextOneProvider } from "./context/appContext";

import "react-toastify/dist/ReactToastify.css";

function App() {
  // console.log = function () {};
  // console.error = function () {};
  // console.info = function () {};
  // console.warn = function () {};

  return (
    <ContextOneProvider>
      <Spinner />
      <AppRoute />
    </ContextOneProvider>
  );
}

export default App;
