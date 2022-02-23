export const getMyRequests = (params, onSuccess)=>{
    // call the api here. And the call the onSuccess function if the api call was successful.

    // make sure to pass the list and the last count values to the onSuccess function when you call it. it should be something like this> onSuccess({list : json.data.data, lastCount : json.data.last_page})
}

// import Auth from "../../protectedRoutes/Auth"
// import { BaseUrl } from "../../utils/apiHelpers"

// export const getMyRequests = ( setState) =>{
//     const url = BaseUrl()+'treatment-details/'
//     const options = {method : 'GET'}
//     fetch(url, options)
//     .then(async res=>{
//         let json = await res.json()
//         setState(json.data[0])
//     }).catch(err=>console.log(err))
// }
