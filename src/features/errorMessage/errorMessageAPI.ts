import {getNormalized} from '../../utils/apiHelpers';

export const fetchComments = () => getNormalized("https://jsonplaceholder.typicode.com/commentsdata")
.then(response => response.data)
.catch(error => error);