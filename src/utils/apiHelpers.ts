import axios from "axios";
import Auth from "../protectedRoutes/Auth";

export const getNormalized = (url: string) => {
  const token = Auth.getToken().token;
  return axios({
    method: "get",
    url: BaseUrl() + url,
    headers: {
      content: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postNormalized = (url: string, payload: any) => {
  const token = Auth.getToken().token;
  return axios({
    method: "post",
    url: BaseUrl() + url,

    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  });
};

export const putNormalized = (url: string, payload: any) => {
  const token = Auth.getToken().token;
  return axios({
    method: "put",
    url: BaseUrl() + url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  });
};

export const BaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? "http://3.20.135.253:9001/api/"
    : "http://3.20.135.253:9001/api/";
};

export const objectToFormData = (obj, rootName, formData) => {
  const appendFormData = (data, root) => {
    root = root || "";
    if (data instanceof File) {
      formData.append(root, data);
    } else if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        appendFormData(data[i], root + "[" + i + "]");
      }
    } else if (typeof data === "object" && data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          if (root === "") {
            appendFormData(data[key], key);
          } else {
            appendFormData(data[key], root + "[" + key + "]");
          }
        }
      }
    } else {
      if (data !== null && typeof data !== "undefined") {
        formData.append(root, data);
      }
    }
  };
  appendFormData(obj, rootName);

  return formData;
};
