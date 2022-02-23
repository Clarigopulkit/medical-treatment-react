import { postNormalized } from "../../../../utils/apiHelpers";


export const fetchChangePtofilePicture = (payload:any) => postNormalized("change-profile-picture", payload)
.then(response => response.data)
.catch(error => error);

export const fetchSaveClinicPersonalInfo = (payload:any) => postNormalized("save-clinic-personal-info", payload)
.then(response => response.data)
.catch(error => error);