import { getNormalized, postNormalized } from "../../../../../utils/apiHelpers";
export const fetchDoctorPersonalInfo = (payload: any) =>
  postNormalized("save-personal-info", payload)
    .then((response) => response.data)
    .catch((error) => error);


export const fetchChangePtofilePicture = (payload: any) =>
  postNormalized("change-profile-picture", payload)
    .then((response) => response.data)
    .catch((error) => error);

export const DeleteUserInfo = (payload: any) =>
  getNormalized(`remove-addr-rgst-edu-work/${payload.id}/${payload.type}`)
    .then((response) => response)
    .catch((error) => error);

export const changeAccountStatus = (payload: any) =>
  postNormalized(`activate-deactivate-account`, payload)
    .then((response) => response)
    .catch((error) => error);
