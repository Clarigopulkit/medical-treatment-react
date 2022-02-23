import { BaseUrl } from "../../../utils/apiHelpers"

export const resetPassword = (params, onSuccess) => {
    console.log(params)
    const url = BaseUrl() + 'resetPassword'
    const formData = new FormData()
    Object.entries(params).forEach(([key, value])=>formData.append(key, value))
    fetch(url, { method: 'POST', body :formData })
        .then(res => res.json())
        .then(json => {
            console.log(json)
            onSuccess()
        }).catch(err => console.log('Reset password', err))
}