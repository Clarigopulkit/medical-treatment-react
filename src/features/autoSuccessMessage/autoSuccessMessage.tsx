import  React, { useEffect, useState } from 'react'
import { Alert } from '@material-ui/lab';
import axios from 'axios';

const AutoSuccessMessage: React.FC = () => {
    const [success, setSuccess] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    useEffect(() => {       
        axios.interceptors.response.use(function (response) {
            setSuccess(true);
            setSuccessMessage(response.data.message);
            return response;

        })
    }, [])
    return (
        <> 
            { success &&  
               <Alert severity="success">{successMessage}</Alert>
            }
        </>
    )
}
export default AutoSuccessMessage;