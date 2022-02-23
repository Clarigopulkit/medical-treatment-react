import {getNormalized} from '../../utils/apiHelpers';

export const fetchUsers = () => getNormalized("https://jsonplaceholder.typicode.com/users")
    .then(response => response.data)
    .catch(error => error);