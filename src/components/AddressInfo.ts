import axios from "axios";

const instance = axios.create({
  baseURL: "https://www.universal-tutorial.com/api/",
  timeout: 1000,
  headers: {
    "X-Custom-Header": "foobar",
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});

exports.AddressInfo = instance;
