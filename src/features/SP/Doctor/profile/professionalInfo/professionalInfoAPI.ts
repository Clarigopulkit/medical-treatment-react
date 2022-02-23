import { postNormalized } from "../../../../../utils/apiHelpers";
export const fetchDoctorProfessionalInfo = (payload: any) =>
  postNormalized("save-professional-info", payload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
