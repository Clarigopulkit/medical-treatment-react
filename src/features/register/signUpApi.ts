import {postNormalized} from '../../utils/apiHelpers'

export const fetchRegister = (payload:any) => postNormalized("register", payload)
.then(response => response.data)
.catch(error => error);