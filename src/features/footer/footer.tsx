import React from 'react';
import { Grid, Typography, Link } from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

import './footer.scss'
import { useHistory } from 'react-router-dom';

const Footer: React.FC<any> = () => {
    const history = useHistory()
    return (
        <>
            <div className="bt-footer">

                <Grid container spacing={4}>

                    {/* <Grid item lg={1} xs={1}></Grid> */}
                    <Grid item xs={12}  md={4}>

                        <img src={require('../../utils/images/Bottom-Logo.png').default} alt="logo" />
                        <Typography className="footer-content">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}  md={2}>
                        <Typography variant="h5" className="footer-company-content">
                            Company
                        </Typography>
                        <Typography>
                            <Link onClick={()=>(history.push('/home'))} className="clinics-link">
                                Home
                            </Link>
                        </Typography>
                        <Typography>
                            <Link onClick={()=>(history.push('/about-us'))} className="clinics-link">
                                About Us
                            </Link>
                        </Typography>
                        <Typography>
                            <Link onClick={()=>(history.push('/service'))} className="clinics-link">
                                Service
                            </Link>
                        </Typography>
                        <Typography>
                            <Link onClick={()=>(history.push('/contact-us'))} className="clinics-link">
                                Contact Us
                            </Link>
                        </Typography>
                        <Typography>
                            <Link onClick={()=>(history.push('/provider'))} className="clinics-link">
                                For Provider
                            </Link>
                        </Typography>
                        <Typography>
                            <Link  onClick={()=>(history.push('/customer'))} className="clinics-link">
                                For Customer
                            </Link>
                        </Typography>


                    </Grid>
                    <Grid item xs={12}  md={2}>

                        <Typography variant="h5" className="footer-company-content">
                            Resource
                        </Typography>
                        <Typography>
                            <Link onClick={()=>(history.push('/help-support'))} className="clinics-link">
                                Help & Support
                            </Link>
                        </Typography>
                        <Typography>
                            <Link onClick={()=>(history.push('/success-stories'))} className="clinics-link">
                                Success Stories
                            </Link>
                        </Typography>
                        <Typography>
                            <Link onClick={()=>(history.push('/ratings-reviews'))} className="clinics-link">
                                Rating & Reviews
                            </Link>
                        </Typography>
                        <Typography>
                            <Link onClick={()=>(history.push('/faqs'))} className="clinics-link">
                                FAQ's
                            </Link>
                        </Typography>
                        <Typography>
                            <Link onClick={()=>(history.push('/blog'))} className="clinics-link">
                                Blog
                            </Link>
                        </Typography>
                        <Typography>
                            <Link onClick={()=>(history.push('/community'))} className="clinics-link">
                                Community
                            </Link>
                        </Typography>

                    </Grid>
                    <Grid item xs={12}  md={2}>
                        <Typography variant="h5" className="footer-company-content">
                            Follow Us
                        </Typography>
                        <Typography>
                            <Link href="#" className="social-icons-link" >
                                <FacebookIcon fontSize="small" className="social-icons" /> Facebook
                            </Link>
                        </Typography>
                        <Typography>
                            <Link href="#" className="social-icons-link" >
                                <TwitterIcon fontSize="small" className="social-icons" /> Twitter
                            </Link>
                        </Typography>
                        <Typography>
                            <Link href="#" className="social-icons-link">
                                <InstagramIcon fontSize="small" className="social-icons" /> Instagram
                            </Link>
                        </Typography>
                        <Typography>
                            <Link href="#" className="social-icons-link">
                                <LinkedInIcon fontSize="small" className="social-icons" />  Linked In
                            </Link>
                        </Typography>

                    </Grid>

                    <Grid item xs={12}>
                        <Typography className="bt-footer-content">
                            2021 BT APP.INC
                        </Typography>
                    </Grid>
                </Grid>

            </div>
        </>
    )
}

export default Footer;