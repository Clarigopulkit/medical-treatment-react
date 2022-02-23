import {postNormalized} from "../../../utils/apiHelpers"

export const fetchResendOtp = (payload:any) => postNormalized("re-send-otp", payload)
.then(response => response.data)
.catch(error => error);