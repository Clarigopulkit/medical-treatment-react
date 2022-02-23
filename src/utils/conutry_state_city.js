import Auth from "../protectedRoutes/Auth";
import { BaseUrl } from "./apiHelpers"

export const getCountries = (setState) => {
    if (!Auth) return
    const url = BaseUrl() + 'countries-list'
    const token = Auth?.getToken()?.token;
    fetch(url, { method: 'GET', headers: { Authorization: 'Bearer ' + token } })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            setState(json.data.map(country => ({ ...country, isoCode: country.sortname, })))
        })
}

export const getStates = (country_name, setState) => {
    if (!Auth) return
    const url = BaseUrl() + 'state-list'
    const token = Auth?.getToken()?.token;
    fetch(url, { method: 'POST', body: JSON.stringify({ country_name }), headers: { Authorization: 'Bearer ' + token, 'Content-Type' : 'application/json' } })
        .then(res => res.json())
        .then(json => {
            console.log(JSON.stringify({ country_name }), json)
            setState(json.data.map(state => ({ ...state, isoCode: state.stateId, })))
        })
}

export const getCities = (state_name, setState) => {
    if (!Auth) return
    const url = BaseUrl() + 'city-list'
    const token = Auth?.getToken()?.token;
    fetch(url, { method: 'POST', body: JSON.stringify({ state_name }), headers: { Authorization: 'Bearer ' + token, 'Content-Type' : 'application/json' } })
        .then(res => res.json())
        .then(json => {
            console.log(JSON.stringify({ state_name }), json)
            setState(json.data.map(state => ({ ...state, isoCode: state.stateId, })))
        })
}