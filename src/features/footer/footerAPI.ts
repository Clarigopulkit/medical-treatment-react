import axios from "axios";
import Auth from "../../protectedRoutes/Auth";
import { BaseUrl } from "../../utils/apiHelpers";

const token = Auth.getToken().token;

const defaultOptions = {
    headers: {
        "content": "application/json"
    },
  };
  
export const ladingPage =(setDetails,setHairDetails,setFaceDetails,setSkinDetails)=>{
    // do your searching here
    const url = BaseUrl() +'landnig-page' // change this with the real url
    fetch(url, { method: 'get'}).then(async res => {
        let json = await res.json()
        setDetails(json.data.body[0].category)
        setHairDetails(json?.data.hair[0].category)
        setFaceDetails(json?.data.face[0].category)
        setSkinDetails(json?.data.skin[0].category)
    })
}