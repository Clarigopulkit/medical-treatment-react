import {getNormalized} from '../../utils/apiHelpers'
export const fetchProfile = () => getNormalized("manage-profile")
.then(response => response.data)
.catch(error => error);