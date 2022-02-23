import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Link } from '@material-ui/core';

import './treatmentArticles.scss';
import { fetchTreatmentArticles } from './treatmentDetailsApi';

const TreatmentArticles: React.FC<any> = ({treatmentId}) => {
    const [state, setState] = useState<any>()

    console.log(state)

    useEffect(() => { 
        window.scrollTo(0, 0)
        fetchTreatmentArticles(treatmentId, setState) }, [])

    const ArticleItem = ({article}) => {
        return (
            <Grid item xs={4}>
                <img src={require('../../utils/images/article1.png').default}
                    width="100%" alt="logo"
                />
                <Typography className="articles-content">{article?.description}</Typography>
                <Link className="articles-link">Click for more info</Link>
            </Grid>
        )
    }
    if(!(state?.data?.length>0)) return null
    return (
        <div className="articles-search">
            <Paper className="articles-search-paper">
                <Grid container spacing={4} className="articles-search-grid">
                    <Grid item xs={5}>
                        <hr />
                    </Grid>
                    <Grid item xs={2}>
                        <img src={require('../../utils/images/articles-logo.png').default}
                            width="100%" alt="logo"
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <hr />
                    </Grid>
                    {state?.data?.map((article, index)=><ArticleItem article={article} key={index} />)}
                    {/* <Grid item xs={4}>
                        <img src={require('../../utils/images/article1.png').default}
                            width="100%" alt="logo"
                        />
                        <Typography className="articles-content">Article Name Lorem Ipsum is simply</Typography>
                        <Link className="articles-link">Click for more info</Link>
                    </Grid>
                    < Grid item xs={4}>
                        <img src={require('../../utils/images/article2.png').default}
                            width="100%" alt="logo"
                        />
                        <Typography className="articles-content">Article Name Lorem Ipsum is simply</Typography>
                        <Link className="articles-link">Click for more info</Link>
                    </Grid>
                    < Grid item xs={4}>
                        <img src={require('../../utils/images/article3.png').default}
                            width="100%" alt="logo"
                        />
                        <Typography className="articles-content">Article Name Lorem Ipsum is simply</Typography>
                        <Link className="articles-link">Click for more info</Link>
                    </Grid> */}
                </Grid>
            </Paper>
        </div>
    )
}

export default TreatmentArticles;