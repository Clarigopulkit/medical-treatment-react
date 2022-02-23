// import {getNormalized} from '../../utils/apiHelpers'
// import { postNormalized } from "../../utils/apiHelpers";
import axios from "axios";
import Auth from "../../protectedRoutes/Auth";
import { BaseUrl } from "../../utils/apiHelpers";

const token = Auth.getToken().token;
console.log('token= ',token)
const defaultOptions = {
    headers: {
        "content": "application/json",
        "Authorization": `Bearer ${token}`,
    },
};

export const fetchTreatmentsAreas = (setAreas) => {
    // do your searching here
    const url = BaseUrl() + 'get-all-areas' // change this with the real url
    // you will have to add the token and add the method
    fetch(url, { method: 'get' }).then(async res => {
        let json = await res.json()
        setAreas(json.data)
    })
}

export const fetchCategoryByArea = (id, setCategories) => {
    // console.log('data api param',params,setCategory)
    const url = BaseUrl() + 'get-categories-by-area/' + id
    fetch(url, { method: 'get' }).then(async res => {
        let json = await res.json()
console.log('create post api')
        setCategories(json.data[0].category)
    })
}
export const fetchSubCategoryByCategory = (params, setSubCategories) => {
    const url = BaseUrl() + 'get-subcategories-by-category/' + params // change this with the real url
    // you will have to add the token and add the method
    fetch(url, { method: 'get' }).then(async res => {
        let json = await res.json()
        setSubCategories(json.data[0].subcategory)
        console.log('api call sucessfull')
    })
}

export const fetchTreatments = (id, setTreatments) => {
    // do your searching here
    const url = BaseUrl() + 'get-treatments-by-subcategory/' + id // change this with the real url
    // you will have to add the token and add the method
    fetch(url, { method: 'get' }).then(async res => {
        let json = await res.json()
        console.log('print treatment data+=',json.data)
        
        setTreatments(json.data.treatment)
    })
}

export const createRequest = (params, onSuccess=null) => {
    console.log('create post api--params--=',params)
    // do your searching here
    if (!params) return
    const url = BaseUrl() + 'create-request' // change this with the real url
    // you will have to add the token and add the method
    const formData = new FormData()
    Object.entries({ ...params }).forEach(([key, value]) => {
        if(key=='request_files') (value as any).forEach(file => formData.append(key, file));
        else formData.append(key, value as string)
    })
    console.log(formData)
    fetch(url, { ...defaultOptions, method: 'POST', body: formData }).then(async res => {
        let json = await res.json()
        // setTreatments(json.data)
        console.log('create post api----=',json)
        if(onSuccess) onSuccess()
    })
}

export const fetchQuestionnaireByTreatment = (id, setState) => {
    // do your searching here
    const url = BaseUrl() + 'questionnaire-by-treatment'// change this with the real url
    const formData = new FormData()
    formData.append('treatment_id', id)
    fetch(url, {...defaultOptions, method: 'POST', body :  formData}).then(async res => {
        let json = await res.json()
        console.log('api work',json)
        if(json.statusCode==200){
        setState(json.data?.[0]?.question_answer)
        console.log('data found')
        }
        else{
            console.log('no data found')
        }
    })
}
