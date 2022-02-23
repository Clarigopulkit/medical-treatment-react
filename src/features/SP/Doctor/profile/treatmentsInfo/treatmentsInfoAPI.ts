import {getNormalized} from '../../../../../utils/apiHelpers'
import { postNormalized } from "../../../../../utils/apiHelpers";
export const fetchSaveTreatmentsInfo = (payload:any) => postNormalized("save-treatment", payload)
.then(response => response.data)
.catch(error => error);

export const fetchTreatmentsAreasProfile = () => getNormalized(`get-all-areas`)
.then(response => response.data)
.catch(error => error);

export const fetchSavedTreatmentsList = () => getNormalized(`get-user-saved-treatments`)
.then(response => response.data)
.catch(error => error);

export const fetchTreatmentsCategoryProfile = (payload:any) => postNormalized(`get-all-categories-by-area`, {area: payload})
.then(response => response.data)
.catch(error => error);

export const fetchTreatmentsSubCategoryProfile = (payload) => postNormalized(`get-all-subcategories-by-category `,payload)
.then(response => response.data)
.catch(error => error);

export const fetchTreatments = (payload) => postNormalized(`get-all-treatments-by-subcategory `,payload)
.then(response => response.data)
.catch(error => error);

export const fetchUpdateTreatments = (treatment) => postNormalized(`update-user-saved-treatments`,treatment)
.then(response => response.data)
.catch(error => error);
