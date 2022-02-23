import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchCommentsAsync, selectComments } from './errorMessageSlice';
import AutoErrorMessage from '../autoErrorMessage/autoErrorMessage';

const Error = () => {
    const { loading} = useAppSelector(selectComments);
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch(fetchCommentsAsync())
    }, [] );
    
    return (
        <>
            <div>
                {loading && <div>Loading</div>}
                {/* <AutoErrorMessage /> */}
            </div>
        </>
    )
}

export default Error;
