import { postNormalized } from "../../utils/apiHelpers";

export const fetchLogin = (payload: any) =>
  postNormalized("login", payload)
    .then((response) => response.data)
    .catch((error) => error);
