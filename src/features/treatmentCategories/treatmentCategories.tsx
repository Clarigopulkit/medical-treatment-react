import { Icon, Typography, makeStyles, Theme, createStyles } from '@material-ui/core';
import React, { Suspense, useEffect, useRef, useState } from "react";
import { fetchCategoryByArea, categoryByAreawithpagination } from '../advancedSearch/advancedSearchApi';
import { useHistory, useLocation } from 'react-router-dom';
import CustomButton from '../reusable/customButton/customButton';
import info from '../../assets/info.png'
import banner from '../../assets/banner.png'
import parse from 'html-react-parser';
import Button from "@material-ui/core/Button";
import Auth from "../../protectedRoutes/Auth";
import bgimagenew from "../../assets/bgimagenew.png";


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
            button: {
                height: "41px",
                minWidth: "160px",
                borderRadius: "50px",
                maxWidth: "100%",
                fontSize: 16,
                fontWeight: 600,
                background: "#085044",
                color: "white",
                "&: hover": {
                    background: "gray",
                },
                boxShadow: "none !important",
            },

            customChange: {
                fontWeight: 700,
                fontSize: "18px",
            },
        },
        FontFamMain:{
            color: "white !important",
            zIndex: 1,
            width: '80%',
            fontSize:"21px",
            fontFamily: "Dosis !important"
          },
        switch: {
            float: "right",
            margin: "20px 50px 0px 0px ",
        },
        bgsetting:{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "75px",
            paddingBottom: "50px",
            backgroundColor: "white",
            backgroundImage: "url(/BgImages/category.png)",
            backgroundPosition: "center 27%",
            backgroundSize: "100%",
            // backgroundPositionY: "repeat",
        }
    })
);


const TreatmentCategories: React.FC<any> = () => {
    const classes = useStyles();
    const [categories, setCategories] = useState([])
    const [page, setPage] = React.useState(1);
    const location = useLocation()
    const id = (location.state as any).id
    const [totalCount, setTotalCount] = useState();
    // { console.log('subcategry length', categories.length, '--- ', totalCount) }

    let getcategory = (page) => {
        var d = { page: page, id: id };
        categoryByAreawithpagination(d, setCategories, setTotalCount);
    }

    useEffect(() => {
        getcategory(page)
        window.scrollTo(0, 0)
        // console.log('first load',categories)
    }, []);

    const history = useHistory()

    function routeChange()
    {
        if(Auth.isAuthenticated().role == "")
        {
           history.push('/login');  
        }
    }


    return (
        <div className={classes.content} style={{ display: "flex",flexDirection: "column",alignItems: "center",
        backgroundColor: "white",backgroundImage: "url(/BgImages/category.png)",
        backgroundPosition: "center 38%",backgroundSize: "95%", backgroundRepeat: "repeat-y" }}  >
            <div style={{ backgroundImage: `url(/BgImages/FaceBG.png)`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: "no-repeat", height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', alignItems: 'flex-end' }} >
                <div style={{ zIndex: 1, width: '50%', paddingLeft: 100 }}>
                    <Typography className={classes.FontFamMain} >
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </Typography>
                    <CustomButton onClick={routeChange} type="submit" variant="contained" >Sign in</CustomButton>
                </div>
            </div>

            <div style={{ background: 'white', padding: 50 }} >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >

                    {categories.map((item, index) => <FaceTreatment onClick={() => history.push({ pathname: 'treatment-categories/treatment-sub-categories', state: { id: item.id } })} reverse={index % 2 != 0} item={item} />)}

                    {totalCount == categories.length ? null :
                        <Button style={{
                            height: "41px", minWidth: "160px",
                            borderRadius: "50px",
                            maxWidth: "100%",
                            fontSize: 16,
                            fontWeight: 600,
                            background: "#085044", boxShadow: 'none',
                            color: "white",
                            textTransform: "initial"
                        }}
                            onClick={() => {
                                getcategory(page + 1); return false;
                            }}
                        >View more { }</Button>
                    }
                </div>
            </div>
        </div>
    )
}


export default TreatmentCategories;

const FaceTreatment = ({ onClick = null, reverse = false, item }) =>{
    const imageRef = useRef(null)
    return (
        <div onClick={onClick} className='treatment_component' style={{ display: 'flex', alignItems: 'center', width: 1000, padding: 30, flexDirection: reverse ? 'row-reverse' : 'row' }} >
          <span style={{ width:350, display:"flex", justifyContent:"center",alignItems:"center" ,position:"relative" }} >
                    <img src={bgimagenew} style={{position:"absolute",height:"145%", top: "55%",transform: "translateY(-50%)"}} />
                    <img ref={imageRef} style={{ maxWidth: "80%", height:"auto",zIndex:1}} src={item.url} />
          </span>
            <div  style={{ padding: 50, margin: '0 30px', borderRadius: 20, border: '4px #f5f5f5 solid' }} >
                <Typography className="titleClsCategory">
                    {item.title}
                </Typography>
                <Typography className="Categorydescription">
                    {item.description != null && parse(item.description)}
                </Typography>
            </div>
    
        </div>
    )
} 