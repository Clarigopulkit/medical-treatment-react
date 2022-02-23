import {
  postNormalized,
  BaseUrl,
  getNormalized,
} from "../../../../utils/apiHelpers";
export const fetchDoctorList = (page :number) =>
  getNormalized("get-doctors-by-clinic?page="+page)
    .then((response) => {
      // console.log('>>>>',response)
      return response.data;
    })
    .catch((error) =>{ 
      console.log('>catch error',error);
     return error });

export const AddDoctor = (payload: any) =>
  postNormalized("create-doctor", payload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => error);

 export const DeleteDoctor = (payload: any) =>
  postNormalized("delete-doctors-by-clinic", payload)
    .then((response) => {
      return response.data;
    })
    .catch((error) => error);