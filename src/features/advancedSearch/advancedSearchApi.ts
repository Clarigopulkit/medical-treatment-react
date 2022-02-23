import axios from "axios";
import Auth from "../../protectedRoutes/Auth";
import { BaseUrl } from "../../utils/apiHelpers";

const token = Auth.getToken().token;

const defaultOptions = {
    headers: {
        "content": "application/json",
        // "Authorization": `Bearer ${token}`,
    },
  };
  
export const fetchTreatmentsAreasProfile =(setArea)=>{
    // do your searching here
    const url = BaseUrl() +'get-all-areas' // change this with the real url
    // you will have to add the token and add the method
    fetch(url, { method: 'get'}).then(async res => {
        let json = await res.json()
        setArea(json.data)
    })
}

export const fetchCategoryByArea =(params,setCategory)=>{
    if(params=='none') return
    const url = BaseUrl() +'get-categories-by-area/'+ params
    fetch(url, { method: 'get' }).then(async res => {
        let json = await res.json()
        setCategory(json.data[0].category)
    })
}
export const fetchSubCategoryByCategory =(params,setSubCategory)=>{
    if(params=='none') return
    const url = BaseUrl() +'get-subcategories-by-category/'+ params // change this with the real url
    // you will have to add the token and add the method
    fetch(url, { method: 'get' }).then(async res => {
        let json = await res.json()
        setSubCategory(json.data[0].subcategory)
        console.log('this api  get-subcategories-by-category')
    })
}
export const fetchTreatmentBySubCategory =(params,setTreatment)=>{
    if(params=='none') return
    const url = BaseUrl() +'get-treatments-by-subcategory/'+ params // change this with the real url
    // you will have to add the token and add the method
    fetch(url, { method: 'get' }).then(async res => {
        let json = await res.json()
        setTreatment(json.data.treatment)
        // console.log('this api name get-treatments-by-subcategory/',  params)
    })
}

export const searchTreatmentsApi = (params, setResults,setBeforeSearch) => {
    const url = BaseUrl() +'advance-search' 
    const formData = new FormData()
    Object.entries(params).forEach(([key, value])=> typeof value =='string'|| typeof value =='number' ? formData.append(key, value as string) : null)
    fetch(url,{...defaultOptions, method: 'POST', body  : formData }).then(async res => {
        let json = await res.json()
        setResults(json.data.data)
        if(json?.data?.data != null)
        {
            setBeforeSearch(true)
        }
    })

}

export const categoryByAreawithpagination =(params,setCategory,setTotalCount)=>{
    
        const url = BaseUrl() +'categoryByArea'
        const formData = new FormData()
        Object.entries(params).forEach(([key, value])=> typeof value =='string'|| typeof value =='number' ? formData.append(key, value as string) : null)
        fetch(url, { method: 'post', body  : formData }).then(async res => {
        let json = await res.json()
            setCategory(json.data.category)
            setTotalCount(json.data.count)
            // console.log('count print',json.data.count)
            // console.log('count print',json.data.category.lenght)
        })
    }

export const subcategoryBycategorywithpagination =(params,setSubCategory,setTotalCountForSubcate)=>{
        const url = BaseUrl() +'subcategoryBycategory'
        const formData = new FormData()
        Object.entries(params).forEach(([key, value])=> typeof value =='string'|| typeof value =='number' ? formData.append(key, value as string) : null)
        fetch(url, { method: 'post', body  : formData }).then(async res => {
            let json = await res.json()
            // debugger
            setTotalCountForSubcate(json.data.count)
            setSubCategory(json.data.subcategory)
            // console.log('count print',json.data.count)
            // console.log('this api  get-treatments-by-subcategory',params)
        })
    }
