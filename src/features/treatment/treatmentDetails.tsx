import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Card } from "@material-ui/core";
import ReactPlayer from "react-player";

import "./treatmentDetails.scss";
import CustomButton from "../reusable/customButton/customButton";
import { fetchTreatmentDetails } from "./treatmentDetailsApi";
import anasthesia from '../../utils/images/anasthesia.png';
import invesiveness from '../../utils/images/invesiveness.png';
import appointments from '../../utils/images/number-of-appointments.png';
import operation from '../../utils/images/operation-time.png';
import request from '../../utils/images/recovery-periods.png';
import inpatient from '../../utils/images/inpatient-period.png';
import parse from 'html-react-parser';
import Auth from "../../protectedRoutes/Auth";
import { useHistory, useLocation } from 'react-router-dom';

const TreatmentDetails: React.FC<any> = ({treatment}) => {
 
  const Detail = ({ label, value ,image,time_title}) => {
    if (!value) return null
    return (
      <Grid item xs={4}>
        <Card className="advanced-search-card">
          <Grid container style={{justifyContent:'center',alignItems:'center'}}>
          <Grid item xs={7} >

              {value!= null && <Typography style={{color:'#085044',fontSize:26,fontFamily:"Dosis bold"}} variant="h4">{value} <span style={{fontSize:13,fontWeight:'normal',fontFamily:"Dosis Semi"}}>{time_title}</span> </Typography> }
             
              <Typography style={{color:'#085044',fontSize:15,fontWeight:500,fontFamily:"Open Sans Semi Bold"}} variant="h6">{label}</Typography>
            </Grid>
            <Grid item xs={5} className="grid-cards">
             {image!=null && <img
                src={image}
                height="55px"
                alt="logo"
                style={{marginTop:5}}
              />}
            </Grid>
          </Grid>
        </Card>
      </Grid>
    )
  }

  const DetailAsset = ({detail}) => {
    var youTubeUrl = detail?.url?.toString();
    var  EditYouTubeUrl = youTubeUrl?.replace("watch?v=", "embed/");
    switch (detail?.type) {
      case 0: return (
        <Grid item xs={12}>
        { detail?.url!=null &&  <img
            src={detail?.url}
            width="100%"
            alt="logo"
          /> }
            {/* <Typography className="advance-search-heading">
            Fiber supplements (Citrucel, FiberCon, Metamucil)
          </Typography> */}
        </Grid>
      )
    
      case 1: return (
        <Grid item xs={12}>
          {console.log('YouTube video player link- ',detail.url)}
          {/* {
          var SampleText = detail.url.toString();
  
        var NewText = SampleText.replace("watch?v=", "embed/");
        } */}
          {detail.url==""?null:
        
      //   <iframe id="ytplayer"  width="640" height="360"
      
      //   src="https://www.youtube.com/embed/TkTNFn51TvU"
      //  ></iframe>
         <iframe width="100%" height="478" src={EditYouTubeUrl} title="YouTube video player"   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ></iframe>
      }
          </Grid>
      )

      default:return null
    }
  }
  
  const history = useHistory()

  function routeChangeForPostRequest()
  {
      if(Auth.isAuthenticated().role === "Patient")
      {
        history.push('/post-request');  
      }else{
        history.push('/login');
      }
  }

  function routeChange()
  {
      if(Auth.isAuthenticated().role === "Patient")
      {
        // history.push('/post-request');  
      }else{
        history.push('/login');
      }
  }


  return (
    <div className="advanced-search" >
      <Grid container className="ad-search-grid-container">
        <Grid item xs={8} style={{width:60}}>
          <Typography className="advance-search-heading">
          {/* {treatment !=null && treatment?.title.substr(0,40)} */}
          {treatment !=null && treatment?.title}
            {/* Fiber supplements (Citrucel, FiberCon, Metamucil) */}
          </Typography>
        </Grid>
        <Grid style={{ display: 'flex', justifyContent: 'flex-end' }} item xs={2}>
         
         {(Auth.isAuthenticated().role !== "Doctor") && (Auth.isAuthenticated().role !== "Clinic") &&
          <CustomButton onClick={routeChange} variant="default" className="advance-search-button">
            Add to Wishlist
          </CustomButton> }
        </Grid>
        <Grid style={{ display: 'flex', justifyContent: 'flex-end' }} alignItems="flex-end" justifyContent="flex-end" item xs={2}>
        {(Auth.isAuthenticated().role !== "Doctor") && (Auth.isAuthenticated().role !== "Clinic") &&  
        <CustomButton onClick={routeChangeForPostRequest} className="advance-search-button">
            post Request
          </CustomButton> }
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Paper className="advanced-search-paper">
            {treatment?.description && <Typography className="paper-content">
              {parse(treatment?.description)}
            </Typography>}

            <Grid container spacing={4}>
              <Detail label="Anesthesia" value={treatment?.anesthesia} time_title="" image={anasthesia} />
              <Detail label="Operation Time" value={treatment?.treatment_time} time_title="" image={operation}/>
              <Detail label="Inpatient Period" value={treatment?.inpatient_period} time_title="" image={inpatient}/>
              <Detail label="Number of Appointments" value={treatment?.number_of_appointments} time_title="" image={appointments} />
              <Detail label="Recovery Period" value={treatment?.recovery_period} time_title="" image={request} />
              <Detail label="Invasiveness" value={treatment?.invasiveness} time_title="" image={invesiveness} />
              {treatment?.treatment_details?.map((detail, index) => (
                <>
                  <Grid item xs={12}>
                    { ( detail?.title !=null && detail?.title !="" ) && <span className="treatment-video-button">
                      {detail?.title}
                    </span> }
                    {detail?.derscription && <Typography className="treatment-content">{parse(detail?.derscription)}</Typography>}
                  </Grid>
                  <DetailAsset detail={detail} />
                </>
              ))}

            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default TreatmentDetails;
