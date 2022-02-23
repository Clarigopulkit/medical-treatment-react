import {postNormalized} from '../../utils/apiHelpers'

export const fetchLogout = (payload:any) => postNormalized("logout", payload)
.then(response => response.data)
.catch(error => error);