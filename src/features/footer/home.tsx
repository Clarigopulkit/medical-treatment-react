import { Icon, Typography, makeStyles, Theme, createStyles } from '@material-ui/core';
import React, { useRef, Suspense, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {ladingPage } from '../footer/footerAPI';
import CustomButton from '../reusable/customButton/customButton';
import Auth from "../../protectedRoutes/Auth";
import info from '../../assets/info.png'
import banner from 'logo192.png'
import './footer.scss'

import face_treatment_title from '../../assets/face_treatment_title.png'

import content_contributory_1 from '../../assets/content_contributory_1.png'
import content_contributory_2 from '../../assets/content_contributory_2.png'
import content_contributory_3 from '../../assets/content_contributory_3.png'
import content_contributory_4 from '../../assets/content_contributory_4.png'
import content_contributory_5 from '../../assets/content_contributory_5.png'
import content_contributory_title from '../../assets/content_contributory_title.png'
import influencer_title from '../../assets/influencer_title.png'

import body_treatment_title from '../../assets/body_treatment_title.png'
import hair_treatment_title from '../../assets/hair_treatment_title.png'
import skin_treatment_title from '../../assets/skin_treatment_title.png'

import social_google_icon from '../../assets/social_google_icon.png'
import social_icon_2 from '../../assets/social_icon_2.png'
import social_icon_3 from '../../assets/social_icon_3.png'
import social_icon_4 from '../../assets/social_icon_4.png'
import social_icon_5 from '../../assets/social_icon_5.png'
import magazine_title from '../../assets/magazine_title.png'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            margin: "-40px -100px",
            background: "#fdf7f7",
            [theme.breakpoints.down("lg")]: {
                margin: "-40px -60px",
            },
            [theme.breakpoints.down("md")]: {
                margin: "-40px -30px",
            },
            [theme.breakpoints.down("xs")]: {
                margin: "-40px -15px",
            },
        },

        switch: {
            float: "right",
            margin: "20px 50px 0px 0px ",
        },
        FontFamMain: {
            color: "white !important",
            width: '65%',
            fontSize:"21px",
            fontFamily: "Dosis !important",
            zIndex: 1,
          },
          signFont: {
            color: "white !important",
            width: '80%',
            fontSize:"24px",
            fontFamily: "angelinas !important",
            zIndex: 1,
            padding:"10px 0px"
          },
          titleCls:{
            textTransform: 'capitalize',
             fontWeight: 'bold',
             fontSize: 18, 
             textAlign: 'center', 
             color:'rgb(38 91 81)'
          }


    })
);

const Home: React.FC<any> = () => {
    const [details, setDetails] = useState([])
    const [hairDetails, setHairDetails] = useState([])
    const [faceDetails, setFaceDetails] = useState([])
    const [skinDetails, setSkinDetails] = useState([])
    const classes = useStyles();
    useEffect(() => {
       
        window.scrollTo(0, 0)
        ladingPage(setDetails,setHairDetails,setFaceDetails,setSkinDetails);
    }, [])

    // console.log(details);

    const history = useHistory()

    function routeChange()
    {
       history.push('/login') 
    }


    return (
        <div className={classes.content}>
            <div style={{ backgroundImage: `url(/BgImages/banner.png)`, backgroundPosition: 'center', backgroundSize : 'cover', backgroundRepeat: "no-repeat", height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', alignItems: 'flex-end' }} >
                <div style={{ zIndex: 1, width: '50%', paddingLeft: 100}}>
                    <Typography className={classes.FontFamMain} >
                     We delight in the beauty of the butterfly, but rarely admit the changes it has gone through to achieve that beauty.
                    </Typography>
                    <Typography className={classes.signFont}>
                     Maya Angelou
                    </Typography>
                    <CustomButton  onClick={routeChange} type="submit" variant="contained" >Sign in</CustomButton>
                </div>
            </div>

            <div className='InfoDiv'>
                <InfoComponent />
                <InfoComponent />
                <InfoComponent />
                <InfoComponent />
            </div>

            <div style={{ background: 'white', padding: 50 }} >
                <div className='faceDiv' >
                    <img style={{ width: 350}} src={face_treatment_title} />
                    <CustomButton onClick={() => history.push({pathname:'home/treatment-categories',state : {id : 3}} )} type="submit" variant="contained">View All</CustomButton>
                    {/* <CustomButton onClick={() => history.push('home/treatment-categories')} type="submit" variant="contained" style={{}}>View All</CustomButton> */}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', background: 'white', padding: "0px 50px" }} >
                {faceDetails.map((item, index) =><TreatmentComponent  onClick={() => history.push({ pathname: 'home/treatment-categories/treatment-sub-categories', state: { id: item.id } })} image={item.url} label={item.title} item={item} />)}
                </div>
            </div>

            <div style={{backgroundColor: '#ffdedd' }} >
                <div className='ContentContributDiv' >
                    <img style={{ width: 350}} src={content_contributory_title} />
                    <CustomButton type="submit" variant="contained">View All</CustomButton>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center', justifyContent: 'center',padding: "0px 72px"
             }} >
                    <ContentContributory onClick={() => history.push('treatment-detail')} image={content_contributory_1} label={'Lorem ipsum'} />
                    <ContentContributory onClick={() => history.push('treatment-detail')} image={content_contributory_2} label={'Lorem ipsum'} />
                    <ContentContributory onClick={() => history.push('treatment-detail')} image={content_contributory_3} label={'Lorem ipsum'} />
                    <ContentContributory onClick={() => history.push('treatment-detail')} image={content_contributory_4} label={'Lorem ipsum'} />
                </div>
            </div>

            <div style={{ paddingTop: 75, paddingBottom: 50, backgroundColor: 'white', backgroundImage: `url(/BgImages/body_treatment_image.png)`, backgroundPosition: "center 27%",
                      backgroundSize: "100%",}}
            
            >
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 100px' }} >
                    <div style={{ flex: 1, height: 1, backgroundColor: '#ddbcbc' }} />
                    <img style={{ width: 350 }} src={body_treatment_title} />
                    <div style={{ flex: 1, height: 1, backgroundColor: '#ddbcbc' }} />
                </div>
                <div style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', paddingTop: 50 }} >
                {details.map((item, index) =>
                <BodyTreatment onClick={() => history.push({ pathname: 'home/treatment-categories/treatment-sub-categories', state: { id: item.id } })} image={item.url} label={item.title}  marginTop={index*150} item={item}   />)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop:55 }} >
                    <CustomButton type="submit" variant="contained" onClick={() => history.push({pathname:'home/treatment-categories',state : {id : 4}} )}style={{marginRight:30}}>View All Body Treatments</CustomButton>
                </div>
            </div>

            <div style={{backgroundColor: '#ffdedd' }} >
                <div className='ContentContributDiv'>
                    <img style={{ width: 275 }} src={influencer_title} />
                    <CustomButton type="submit" variant="contained">View All</CustomButton>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center', justifyContent: 'center',padding: "0px 72px" }} >
                    <Influencer onClick={() => history.push('treatment-detail')} image={content_contributory_1} label={'Lorem ipsum nam'} />
                    <Influencer onClick={() => history.push('treatment-detail')} image={content_contributory_2} label={'Lorem ipsum'} />
                    <Influencer onClick={() => history.push('treatment-detail')} image={content_contributory_3} label={'Lorem ipsum'} />
                    <Influencer onClick={() => history.push('treatment-detail')} image={content_contributory_4} label={'Lorem ipsum'} />
                    <Influencer onClick={() => history.push('treatment-detail')} image={content_contributory_5} label={'Lorem ipsum'} />
                </div>
            </div>

            <div style={{ paddingTop: 75, paddingBottom: 40, backgroundColor: 'white', backgroundImage: `url(/BgImages/hair.png)`, backgroundPosition: "center 40%", backgroundRepeat: "no-repeat",
                      backgroundSize: "105%", }} >
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 100px' }} >
                    <div style={{ flex: 1, height: 1, backgroundColor: '#ddbcbc' }} />
                    <img style={{ width: 350 }} src={hair_treatment_title} />
                    <div style={{ flex: 1, height: 1, backgroundColor: '#ddbcbc' }} />
                </div>
                <div style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', padding: "42px 112px 10px 112px" }} >
                {hairDetails.map((item, index) => <HairTreatment onClick={() => history.push({pathname:'home/treatment-categories/treatment-sub-categories',state : {id : item.id}} )} image={item.url} label={item.title} reverse={index%2!=0} item={item} />)}
                </div>
                <div style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', marginTop:10 }} >
                <CustomButton type="submit" variant="contained" onClick={() => history.push({pathname:'home/treatment-categories',state : {id : 6}} )} style={{marginRight:35}} >View All Hair Treatments</CustomButton>
              </div>
            </div>

            <div style={{ padding: 50, backgroundColor: '#f7f7f7' }} >
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 50px',width:'100%', }} >
                    <div style={{ flex: 1, height: 1, backgroundColor: '#ddbcbc' }} />
                    <img style={{ width: 350 }} src={magazine_title} />
                    <div style={{ flex: 1, height: 1, backgroundColor: '#ddbcbc' }} />
                </div>
                <div style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', padding: "0px 42px" }} >
                    <SocialIcon image={social_google_icon} />
                    <div style={{ width: 1, backgroundColor: '#00000020' }} />
                    <SocialIcon image={social_icon_2} />
                    <SocialIcon image={social_icon_3} />
                    <SocialIcon image={social_icon_4} />
                    <SocialIcon image={social_icon_5} />
                </div>
            </div>

            <div style={{ background: 'white' }} >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1px 105px' }} >
                    <img style={{ width: 350 }} src={skin_treatment_title} />
                    <CustomButton type="submit" variant="contained" onClick={() => history.push({pathname:'home/treatment-categories',state : {id : 5}} )}>View All</CustomButton>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', background: 'white',padding: "32px 95px" }} >
                {skinDetails.map((item, index) =>  <TreatmentComponent onClick={() => history.push({ pathname: 'home/treatment-categories/treatment-sub-categories', state: { id: item.id } })} image={item.url} label={item.title} item={item} />)}
            </div>
            </div>
        </div>
    )
}
export default Home;

const InfoComponent = () => (
    <div className="InfoCompoCls" >
        <img style={{ width: '50%' }} src={info} />
        <Typography className="titleCls" >
        Lorem Ip  Step 1
        </Typography>
        <Typography className="descriptionBoby">
             Lorem Ipsum has been the industry's standard dummy text ever 1500s, 
        </Typography>
    </div>
)

const TreatmentComponent = ({ image, label, onClick = null, item }) => (
    <div onClick={onClick} className='treatment_component' style={{ display: 'flex', alignItems: 'center', flex: 1, flexDirection: 'column' }} >
        <img style={{ width: '100%' }} src={image} />
        <Typography className="titleCls">
        {item.title}
        </Typography>
        <Typography className="descriptionBoby">
        {(item.description)!=null?item.description:""}
        </Typography>
    </div>
)


const ContentContributory = ({ image, label, onClick = null }) => {
    const imgRef = useRef(null)
    return (
        <div onClick={onClick} className='treatment_component' style={{ display: 'flex', flexDirection: 'column', padding: 30, position: 'relative', flex: 1, }} >
            <img ref={imgRef} style={{ width: '100%', height: 230, objectFit: 'cover', zIndex: 1 }} src={image} />
            <Typography className="titleCls" >
                {label}
            </Typography>
        </div>
    )
}

const BodyTreatment = ({ image, label, marginTop = 0, onClick = null,item }) => (
    
    <div onClick={onClick} className='treatment_component' style={{ flex: 1, maxWidth: 300, height: 300, background: '#f5f5f5', borderRadius: 20, margin: '0 50px', marginTop, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding: 30, textTransform: 'capitalize' }}>
        <Typography className="titleCls" >
            {item.title}
        </Typography>
        <Typography className="descriptionBoby">
        {(item.description)!=null?item.description:""}
        </Typography>
        <img src={image} style={{ width: '70%', position: 'absolute', left: '20%', top: 89 }} />
    </div>
)

const Influencer = ({ image, label, onClick = null }) => (
    <div onClick={onClick} className='treatment_component' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 30, position: 'relative', flex : 1 }} >
        <img style={{ width : '100%', height: 230, objectFit: 'cover', zIndex: 1, borderRadius: 20 }} src={image} />
        <Typography className="titleCls">
            {label}
        </Typography>
    </div>
)

const HairTreatment = ({ image, label, onClick = null, reverse = false,item }) => (
    <div onClick={onClick} className='treatment_component' style={{ flex: 1, maxWidth: 380, margin: '0 50px', display: 'flex', flexDirection: reverse ? 'column-reverse' : 'column', alignItems: 'center', padding: 30, position: 'relative', border: '1px solid #ffdedd', borderRadius: 60, borderTopLeftRadius: 0 }} >
        <img style={{ width: '90%', objectFit: 'contain', zIndex: 1, borderRadius: 20 }} src={image} />
        <div style={{height : 30}} />
        <div>
            <Typography className="titleCls">
            {item.title}
            </Typography>
            <Typography className="descriptionBoby" >
            {(item.description)!=null?item.description:""}
            </Typography>
        </div>
    </div>
)

const SocialIcon = ({ image }) => (
    <img style={{ height: 60, objectFit: 'contain', margin: '0 1%', flex : 1 }} src={image} />
)