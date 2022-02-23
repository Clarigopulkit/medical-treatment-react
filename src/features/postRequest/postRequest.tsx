import React, { Suspense, useEffect, useState } from "react";
import { Breadcrumbs, Typography } from "@material-ui/core";
import RequestTabs from "./requestTabs";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import {fetchTreatmentsAreas} from './postRequestApi';
import { keys, values } from "lodash";

function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  event.preventDefault();
}

const PostRequest: React.FC<any> = () => {

  const [area, setArea] = useState()
  //   const [areas, setAreas] = useState([])

  //   useEffect(() => {
  //     fetchTreatmentsAreas(setAreas);
  //     console.log('api data',areas)
  // }, []);


  return (
    <div style={{justifyContent:'center',flex:1,alignSelf:'center',width:'100%',padding:0,marginTop:0}}>
    <div style={{width:'84%',flex:1,marginLeft:'auto',marginRight:'auto'}}>
      <Breadcrumbs style={{marginTop:0,}} separator="|" aria-label="breadcrumb">
        <Link
          style={{ color: "#3f89e5", fontWeight: "normal",textDecoration: "unset" }}
          to="/dashboard"
        >
          {" "}
          Dashboard{" "}
        </Link>
        <Link
          style={{ fontWeight: "normal", textDecoration: "unset" ,color:'#085044'}}
          to="/post-request"
          onClick={handleClick}
        >
          {" "}
          Post a request{" "}
        </Link>
      </Breadcrumbs>
      <Typography variant="h5" style={{ margin: "20px 0",marginBottom:15,marginTop:15,color:'#085044' }}>
        Post a Request
      </Typography>
      <RequestTabs />
    </div>
    </div>
  );
};

export default PostRequest;
