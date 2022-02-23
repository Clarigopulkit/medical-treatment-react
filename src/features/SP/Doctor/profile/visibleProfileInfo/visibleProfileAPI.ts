import { postNormalized } from "../../../../../utils/apiHelpers";

export const fetchDoctorVisibleInfo = (payload:any) => postNormalized("save-visible-profile", payload)
.then(response => response.data)
.catch(error => error);