import { Button, Icon, MenuItem, makeStyles, Theme, TextField, Typography, createStyles } from '@material-ui/core';
import React, { Suspense, useEffect, useRef, useState } from "react";
import { searchTreatmentsApi, fetchTreatmentsAreasProfile, fetchCategoryByArea, fetchSubCategoryByCategory } from './advancedSearchApi';
import parse from 'html-react-parser';
import { useHistory, useLocation } from 'react-router-dom';
import { InputLabel, Select, FormControl, Grid } from '@mui/material';
import healthcare_a_search from '../../assets/healthcare_a_search.png';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        signFont: {
            color: "#085044 !important",
            width: '80%',
            fontSize: "36px",
            fontFamily: "angelinas !important",
            zIndex: 1,
            padding: "10px 0px",
            marginBottom: "10px",
        },

        FontFamMain: {
            color: "#085044 !important",
            width: '80%',
            fontSize: "36px",
            fontFamily: "Dosis !important",
            zIndex: 1,
            margin: "4px",
        },
        LabelCls: {
            fontSize: "15px",
            color: "#085044 !important",
            marginBottom: "2px"
        }



    })
);

const AdvancedSearch: React.FC<any> = () => {
  
    const history = useHistory()

    const [area, setArea] = useState('')
    const [areas, setAreas] = useState([])
    const [BeforeSearch, setBeforeSearch] = useState(false)

    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([])

    const [subCategory, setSubCategory] = useState('')
    const [subCategories, setSubCategories] = useState([])

    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState([])
    const classes = useStyles();
    useEffect(() => {
        window.scrollTo(0, 0)
        // onSearch()
        fetchTreatmentsAreasProfile(setAreas);
    }, []);

    function getCategory(e) {
        setArea(e)
        if (!e) return setCategories([])
        fetchCategoryByArea(e, setCategories);
       
    }

    function getSubCategory(e) {
        setCategory(e)
        if (!e) return setSubCategories([])
        fetchSubCategoryByCategory(e, setSubCategories);
    }

    const onSearch = () =>{
        // setBeforeSearch(true)
        searchTreatmentsApi(
            {
                area_id: area,
                category_id: category,
                subcategory_id: subCategory,
                name: searchTerm
            }, setResults,setBeforeSearch)
    }  // dont forget to change the param names with the api keys

    return (
        <div style={{}}>
            <Grid container className="ad-search-grid-container">
                <Grid item xs={8}>
                <img style={{ width: 350, marginBottom:20}} src={healthcare_a_search} />
                    {/* <Typography className={classes.signFont}>
                        Advanced Search
                    </Typography> */}
                </Grid>
            </Grid>

            <Grid rowSpacing={1.5} columnSpacing={1.5} container justifyContent="flex-start" direction="row">
                <SearchBox value={searchTerm} onChange={setSearchTerm} />
                <DropDown label={'Area'} list={areas} value={area} onChange={(e) => getCategory(e)} />
                <DropDown label={'Category'} list={categories} value={category} onChange={(e) => { getSubCategory(e) }} />
                <DropDown label={'Sub-Category'} list={subCategories} value={subCategory} onChange={setSubCategory} />
                <Grid item lg={1.5} md={12} sm={12} xs={12} >
                    <Button
                        onClick={onSearch}
                        fullWidth
                        style={{ background: '#085044', borderRadius: 30, color: 'white', marginTop: 25 }}
                        variant="contained">Search</Button>
                </Grid>
            </Grid>
            <div style={{ padding: 30, backgroundColor: 'white', border: '1px solid #ffdedd', marginTop: 20 }} >

                {BeforeSearch && results.length > 0 && results !== undefined && results.map((item, index) => <TreatmentItem onClick={() => history.push('advanced-search/treatment-detail/' + item.treatment_id)} hideBottomBorder={index === results.length - 1} item={item} history={history} />)}

                {BeforeSearch && results.length === 0 && <span style={{ color: '#085044', fontWeight:600, fontSize: "18px",marginLeft:"44%" }}>Sorry, no treatment found. </span>}

            </div>

        </div>
    )
}
export default AdvancedSearch;

const DropDown = ({ onChange, value, list, label }) => {
    console.log(label,' value', value)
    return (
        <Grid style={{ position: 'relative' }} item lg={2.5} md={3} sm={6} xs={15} >
            <label style={{ fontWeight: 600, fontSize: "15px", color: "#085044", marginBottom: "2px" }}>{label}</label>

            {(!value) && <Typography style={{ color: "#085044", fontSize: 18, position: 'absolute', paddingLeft: 15, paddingTop: 17 }} className="advance-search-heading">
                {label}
            </Typography>}
            <FormControl fullWidth variant='standard' style={{ marginTop: 7 }}>

                <Select

                    // id="demo-simple-select"
                    value={value}
                    SelectDisplayProps={{ style: { height: 44, padding: '0 0 0 0', display: 'flex', alignItems: 'center' } }}
                    label={null}
                    MenuProps={{ style: { marginTop: -40 } }}

                    onChange={(e) => onChange(e.target.value)}
                    // inputProps={{ style: { backgroundColor: 'red' } }}
                    disableUnderline
                    style={{ borderRadius: 30, borderWidth: 1, borderColor: 'rgb(8, 80, 68)', borderStyle: 'solid', padding: '0 15px', color: '#085044' }}
                >
                    <MenuItem value={''}>
                        <em>None</em>
                    </MenuItem>
                    {list.map((item, index) => <MenuItem key={index} value={item.id}>{item.title.charAt(0).toUpperCase() + item.title.slice(1)}</MenuItem>)}
                </Select>
            </FormControl>
        </Grid>

    )
}

const SearchBox = ({ value, onChange }) => {
    return (
        <Grid item lg={3} md={3} sm={6} xs={12} >
            <FormControl fullWidth variant="outlined">
                <label style={{ fontWeight: 600, fontSize: "15px", color: "#085044", marginBottom: "2px" }}>Treatment or keywords</label>
                <TextField
                    InputProps={{ disableUnderline: true, style: { padding: '7.5px' } }}
                    style={{ height: 44, marginTop: 7, background: 'white', borderRadius: 30, border: '1px #085044 solid', padding: '6px 15px', color: '#085044', minWidth: 200 }}
                    id="standard-basic"
                    placeholder='Treatment or keywords'
                    onChange={(e) => onChange(e.target.value)}
                    value={value}
                    variant="standard" />
            </FormControl>
        </Grid>
    )
}
const TreatmentItem = ({ item, hideBottomBorder = false, onClick, history }) => {
    const [limit, setLimit] = useState(500)
    return (

        <div style={{ display: 'flex', borderBottom: hideBottomBorder ? null : 'solid 1px #ffdedd', paddingTop: 20 }} >
            <div style={{ color: '#085044 ', flex: 1 }} >
                <Typography style={{ fontWeight: 'bold', fontSize: 24, paddingBottom: 15, color: '#085044 ' }} >{item.treatment_title}</Typography>
                <Typography style={{ paddingBottom: 10, color: '#085044 ' }}>{item.treatment_description.length > 500 ? parse(item.treatment_description.substr(0, limit) + "...") : parse(item.treatment_description)}</Typography>
                <Typography style={{ fontWeight: 'bold', color: '#085044 ', backgroundColor: '#ffdedd', fontSize: 18, padding: '5px 10px', border: '2px solid #d6b8b8', borderRadius: 20, display: 'inline', margin: '10px 0' }} >{item.no_of_videos} Videos Inside</Typography>
                {item.treatment_description.length > 500 && <Typography onClick={() => limit > 500 ? setLimit(500) : setLimit(10000)} style={{ paddingBottom: 10, paddingTop: 10, color: '#4b6dbd', cursor: 'pointer' }}>{limit > 500 ? 'Show Less' : 'Read More'}</Typography>}
            </div>
            <Button style={{ background: '#085044', borderRadius: 30, color: 'white', minWidth: 180 }} onClick={() => history.push('treatment-detail/' + item.treatment_id)} variant="contained">View Details</Button>
        </div>
    )
}

function substr(arg0: number, arg1: number) {
    throw new Error('Function not implemented.');
}

