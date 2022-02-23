import { postNormalized } from "../../utils/apiHelpers";

export const fetchLoginOtp = (payload: any) =>
  postNormalized("validate-otp", payload)
    .then((response) => response.data)
    .catch((error) => error);
