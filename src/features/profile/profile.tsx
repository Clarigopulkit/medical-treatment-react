import React from 'react';
import CustomButton from '../reusable/customButton/customButton';
import { fetchProfileAsync, selectProfileUsers } from './profileSlice';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { Typography } from '@material-ui/core';
import { fetchUpdateProfileAsync } from './updateProfile/updateProfileSlice';


const Profile = () => {
    
    const {profileUsers} = useAppSelector(selectProfileUsers);
    const dispatch = useAppDispatch();
    const handleClick = () => {        
        dispatch(fetchProfileAsync())
        .then(response =>{
            return response.payload
        } )
       
    }
    const  handleUpdateClick = () => {
        dispatch(fetchUpdateProfileAsync({user_id:"1", type:"profile_pic"}))
    }
   
    return(
        <>
            <CustomButton
                onClick= {handleClick}
            >
                Manage Profiles
            </CustomButton>
            <CustomButton
                onClick= {handleUpdateClick}
            >
                update Profile
            </CustomButton>
           <Typography>
           {/* {profileUsers.data.name}<br /> */}
           {/* {profileUsers.data.email} */}
           {/* {data.email} */}
           {/* {response.payload.data.email} */}
           </Typography> 

        </>
    )
}

export default Profile;