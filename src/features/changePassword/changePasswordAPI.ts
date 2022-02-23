import { postNormalized } from "../../utils/apiHelpers";

export const fetchChangePassword = (payload:any) => postNormalized("change-password", payload)
.then(response => response.data)
.catch(error => error);