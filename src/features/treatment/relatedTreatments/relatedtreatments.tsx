import React from 'react';
import {Grid,Paper,Typography, Link} from '@material-ui/core';

import './relatedTreatments.scss';

const RelatedTreatments: React.FC<any> = () => {
    return(
        <div className="relatedTreatments-search">           
            <Paper className="relatedTreatments-search-paper">                        
                <Grid container spacing={4} className="relatedTreatments-search-grid">
                    <Grid item xs={5}>
                        <hr />
                    </Grid>
                    <Grid item xs={2}>
                        <img src={require('../../../utils/images/treatments-logo.png').default} 
                            width="100%"  alt="logo"
                        /> 
                    </Grid>
                    <Grid item xs={5}>
                        <hr />
                    </Grid>
                    <Grid item xs={4}>
                        <img src={require('../../../utils/images/youtube1.png').default} 
                            width="100%"  alt="logo"
                        /> 
                        <Typography className="relatedTreatments-content">Article Name Lorem Ipsum is simply</Typography>
                        <Link className="relatedTreatments-link">Click for more info</Link>
                    </Grid>
                    < Grid item xs={4}>
                        <img src={require('../../../utils/images/youtube2.png').default} 
                            width="100%"  alt="logo"
                        />  
                        <Typography className="relatedTreatments-content">Article Name Lorem Ipsum is simply</Typography>
                        <Link className="relatedTreatments-link">Click for more info</Link>
                    </Grid>
                    < Grid item xs={4}>
                        <img src={require('../../../utils/images/youtube3.png').default} 
                            width="100%"  alt="logo"
                        />
                        <Typography className="relatedTreatments-content">Article Name Lorem Ipsum is simply</Typography>
                        <Link className="relatedTreatments-link">Click for more info</Link>
                    </Grid>
                </Grid>
            </Paper>                
        </div>
    )
}

export default RelatedTreatments;