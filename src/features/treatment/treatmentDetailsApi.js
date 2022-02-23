import Auth from "../../protectedRoutes/Auth"
import { BaseUrl } from "../../utils/apiHelpers"

export const fetchTreatmentDetails = (id, setState) =>{
    const url = BaseUrl()+'treatment-details/'+id
    const options = {method : 'GET'}
    fetch(url, options)
    .then(async res=>{
        let json = await res.json()
        setState(json.data[0])
    }).catch(err=>console.log(err))
}



export const fetchTreatmentArticles = (id, setState) =>{
    const url = BaseUrl()+'get-articles-by-treatment'
    const token = Auth.getToken().token;
    const formData = new FormData()
    formData.append('treatment_id', id)
    const options = {method : 'POST', body : formData, headers : {Authorization : 'Bearer ' +token}  }
    fetch(url, options)
    .then(async res=>{
        let json = await res.json()
        setState(json.data)
    }).catch(err=>console.log(err))
}