import React, { useEffect, useState } from 'react';
import {Breadcrumbs,Link} from '@material-ui/core';

import './treatment.scss'
import TreatmentDetails from './treatmentDetails';
import TreatmentArticles from './treatmentArticles';
import RelatedTreatments from './relatedTreatments/relatedtreatments';
import CustomButton from '../reusable/customButton/customButton';
import { fetchTreatmentDetails } from './treatmentDetailsApi';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Auth from "../../protectedRoutes/Auth";


function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  event.preventDefault();
}

const AdvancedSearch:React.FC<any> = () => {
    const params = useParams() as any
    const history = useHistory()
    const [state, setState] = useState<any>()
    console.log(state)
  
    useEffect(() => { fetchTreatmentDetails(params?.id, setState) }, [])

    function routeChangeForPostRequest()
    {
        if(Auth.isAuthenticated().role === "Patient")
        {
          history.push('/post-request');  
        }else{
          history.push('/login');
        }
    }
  
  
    return (
        <div className="ad-search-treatments manage-container"  >
            <Breadcrumbs separator="|" aria-label="breadcrumb">
                {/* dashboard link */}
                <Link color="primary" href="/dashboard" onClick={handleClick}>
                   Dashboard
                </Link>
                {/* advance search */}
                <Link color="primary" href="post-request" onClick={handleClick}>
                    Advanced Search
                </Link>
                {/* Search result */}
                <Link color="inherit" href="post-request" onClick={handleClick}>
                    search results
                </Link>                  
            </Breadcrumbs>    
            <TreatmentDetails treatment={state} />
            <TreatmentArticles treatmentId = {params?.id} />
            {/* <RelatedTreatments /> */}
            <div className="post-button">
            {(Auth.isAuthenticated().role !== "Doctor") && (Auth.isAuthenticated().role !== "Clinic") &&  
                <CustomButton onClick={routeChangeForPostRequest} className="post-custom-button">
                post a Request
            </CustomButton>
        
        }
            
            </div>
           
        </div>
    )
}

export default AdvancedSearch;