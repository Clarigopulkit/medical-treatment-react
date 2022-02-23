import { postNormalized } from "../../../../../utils/apiHelpers";

export const fetchDoctorBusinessInfo = (payload:any) => postNormalized("save-business-info", payload)
.then(response => response.data)
.catch(error => error);