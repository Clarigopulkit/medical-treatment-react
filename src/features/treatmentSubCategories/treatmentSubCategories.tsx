import { Icon, Typography, makeStyles, Theme, createStyles, IconButton, Popover } from '@material-ui/core';
import React, { Suspense, useEffect, useState } from "react";
import CustomButton from '../reusable/customButton/customButton';
import info from '../../assets/info.png'
import './treatmentSubCategoriesStyles.css'
import parse from 'html-react-parser';
import { useHistory, useLocation } from 'react-router-dom';
import { Delete, QuestionAnswer } from '@material-ui/icons';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { fetchCategoryByArea, fetchSubCategoryByCategory, fetchTreatmentBySubCategory, subcategoryBycategorywithpagination } from '../advancedSearch/advancedSearchApi';
import { iteratorSymbol } from 'immer/dist/internal';
import Button from "@material-ui/core/Button";
import Auth from "../../protectedRoutes/Auth";


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
    })
);


const TreatmentSubCategories: React.FC<any> = () => {
    const classes = useStyles();
    const [subcategories, setSubCategories] = useState([])
    const location = useLocation()
    const id = (location.state as any).id
    const [page, setPage] = React.useState(1);
    const [totalCount, setTotalCountForSubcate] = useState();

    // console.log(id)

    let getsubcategory = (page) => {
        var d = { page: page, id: id };
        subcategoryBycategorywithpagination(d, setSubCategories, setTotalCountForSubcate);
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        getsubcategory(page)
        // fetchSubCategoryByCategory(id,setSubCategories);
    }, []);

    const history = useHistory()
    function routeChange()
    {
        if(Auth.isAuthenticated().role == "")
        {
            history.push('/login') 
        }
    }


    return (
        <div className={classes.content}>
            <div style={{ backgroundImage: `url(/BgImages/banner.png)`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: "no-repeat", height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', alignItems: 'flex-end' }} >
                <div style={{ zIndex: 1, width: '50%', paddingLeft: 100 }}>
                    <Typography className="FontFamMain" >
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </Typography>
                    <CustomButton onClick={routeChange} type="submit" variant="contained" >Sign in</CustomButton>
                </div>
            </div>

            <div style={{ background: 'white', padding: 50 }} >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                    {subcategories != null && subcategories.map((item, index) => <SubCategory key={index} item={item} />)}
                  
                    {totalCount == subcategories?.length ? null :
                    <Button style={{
                        height: "41px", minWidth: "160px", marginTop: 15,
                        borderRadius: "50px",
                        maxWidth: "100%",
                        fontSize: 16,
                        fontWeight: 600,
                        background: "#085044", boxShadow: 'none',
                        color: "white",
                        textTransform: "initial"
                    }}
                        onClick={() => { getsubcategory(page + 1); return false; }}
                    >Load more{ } </Button>
                }

                </div>
            </div>
        </div>
    )
}
export default TreatmentSubCategories;

const SubCategory = ({ item }) => {
    const history = useHistory()
    const [treatments, setTreatments] = useState([])
    useEffect(() => fetchTreatmentBySubCategory(item.id, setTreatments), [])
    const Treatment = ({ item }) => {
        const [anchorEl, setAnchorEl] = React.useState(null);

        const handlePopoverOpen = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handlePopoverClose = () => {
            setAnchorEl(null);
        };

        const open = Boolean(anchorEl);

        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', width: 700 }} >
                    <Typography className="titleCls">
                        {item.title}
                    </Typography>
                    <QuestionMarkIcon onClick={!anchorEl ? handlePopoverOpen : handlePopoverClose} style={{ marginLeft: 20, color: '#bbb', border: 'solid #bbb 2px', borderRadius: 50 }} />
                    <div style={{ flex: 1, minWidth: 50 }} />
                    <CustomButton onClick={() => history.push('treatment-sub-categories/treatment-detail/' + item.id)} style={{ marginLeft: 'auto' }} type="submit" variant="contained">View Details</CustomButton>
                </div>
                <Popover
                    style={{ maxHeight: 400 }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                // onMouseLeave={()=>console.log('bruh')}
                >
                    {/* <Typography className='descriptionBoby' style={{ padding: 5, maxWidth: 300 }} >{item.description != null && parse(item.description)}</Typography> */}
                    <Typography className='descriptionBoby' style={{ padding: 5, maxWidth: 300 }} >
                         {item.description.length > 250 ? parse(item.description.substr(0, 250) + "...") : parse(item.description)}
                    </Typography>
                </Popover>
            </div>

        )
    }
    return (
        <div className='shadow-container' style={{ padding: 30, margin: '0 30px', borderRadius: 17, display: 'flex', alignItems: 'center', marginTop: 20 }} >
            <Typography className="titleCls" style={{width:100}}>
                {item.title}
            </Typography>
            <div className='shadow-divider' style={{ width: 15, alignSelf: 'stretch', margin: '0 50px' }} />
            <div>
                {treatments.map((item, index) => <Treatment item={item} key={index} />)}
            </div>

        </div>
    )
} 