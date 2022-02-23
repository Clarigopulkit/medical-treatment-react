import {postNormalized} from '../../../utils/apiHelpers' 
export const fetchCreateInfluencer = (payload:any) => postNormalized("add-influencer", payload)
.then(response => response.data)
.catch(error => error);