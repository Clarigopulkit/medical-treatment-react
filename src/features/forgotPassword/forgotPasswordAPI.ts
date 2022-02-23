import {postNormalized} from '../../utils/apiHelpers'

export const fetchForgotPassword= (payload:any) => postNormalized("forgot-password", payload)
.then(response => response.data)
.catch(error => error);

