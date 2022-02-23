import {postNormalized} from '../../../utils/apiHelpers'

export const fetchUpdateProfile = (payload:any) => postNormalized("profile-update", payload)
.then(response => response.data)
.catch(error => error);