import React, { useState, useEffect } from "react";
// import "./index.css";
import { useHistory } from "react-router-dom";
import { Pagination, Rating } from "@material-ui/lab";
import { getMyRequests } from "./SPMyRequestsApi";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { Tabs, Paper, Grid, IconButton,Button } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import "./style.scss";
import { FavoriteBorder, FavoriteOutlined } from "@material-ui/icons";


interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}


const SPMyRequests = () => {
    const history = useHistory()

    const [status, setStatus] = useState(0)

    const [list, setList] = useState([{ name: 'name' }, { name: 'name' }, { name: 'name' }, { name: 'name' }, { name: 'name' }, { name: 'name' }, { name: 'name' }, { name: 'name' }, { name: 'name' }, { name: 'name' }]);
    const [page, setPage] = React.useState(1);
    const [sort, setSort] = useState(1)
    const [lastCount, setLastCount] = useState();

    const onSuccess = ({ list, lastCount }) => {
        setList(list)
        setLastCount(lastCount)
    }

    useEffect(() => getMyRequests({ page: page, status: status, sort: sort }, onSuccess), [page]);

    useEffect(() => setPage(1), [status, sort]);

    return (

        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
                <p style={{ color: "#085044", fontSize: 30, fontWeight: 'bold' }} >Requests</p>

                <div style={{ marginLeft: 'auto', }} >
                    <MyButton onClick={() => setSort(1)} label="Sort by" outlined />
                </div>
            </div>
            <div style={{ flexGrow: 1, background: 'white', border: 'solid 1px #debcbb' }}>

                <Grid container>
                    <Grid item xs={12}>
                        <Tabs
                            value={status}
                            onChange={(e, value) => setStatus(value)}
                            aria-label="simple tabs example"
                            className="tabs-container"
                        >
                            <Tab fullWidth label="New" {...a11yProps(0)} className="login-tab" />
                            <Tab fullWidth label="Answered" {...a11yProps(1)} className="login-tab" />
                            <Tab fullWidth label="Expired" {...a11yProps(2)} className="login-tab" />

                        </Tabs>
                    </Grid>
                </Grid>
                {list.map((item, index) => <DoctorItem key={index} item={{ ...item, status: status }} />)}
                <div style={{ display: 'flex', padding: 15, justifyContent: 'flex-end', background: "#ffdedd50" }} >
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                        <Pagination
                            style={{ border: '1px #ddd solid', borderRadius: 15 }}
                            count={lastCount}
                            page={page}
                            onChange={(e, value) => setPage(value)}/>
                        <Button
                            onClick={() => setPage(page + 1)}
                            disabled={page == lastCount}
                            style={{ background: '#085044',height : 35, marginLeft: 20, borderRadius: 30, color: 'white', opacity: page == lastCount ? .5 : 1 }}
                            variant="contained">Next</Button>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default SPMyRequests;

const MyButton = ({ onClick = null, label, outlined = false }) => {
    return (
        <div
            onClick={onClick}
            style={{ borderRadius: 50, borderWidth: 2, borderStyle: 'solid', borderColor: outlined ? "#085044" : "white", backgroundColor: outlined ? "white" : "#085044", padding: '10px 30px 10px 30px', cursor: 'pointer', minWidth: 200 }} >
            <p style={{ color: outlined ? "#085044" : 'white', fontSize: 16, fontWeight: 'bold', padding: 0, margin: 0, textAlign: 'center' }} >{label}</p>
        </div>
    )
}
const DoctorItem = ({ item = null }) => {

    const buttonText = () => {
        switch (item.status) {
            case REQUEST_STATUSES.NEW: return 'Submit Quote'
            case REQUEST_STATUSES.ANSWERED: return 'View Quote'
            case REQUEST_STATUSES.EXPIRED: return 'View Quote'
        }
    }

    const ItemStatus = () => {
        switch (item.status) {
            case REQUEST_STATUSES.NEW: return (
                <div style={{ flexGrow: 1 }} >
                    <div style={{ display: 'flex', alignItems: 'flex-end' }} >
                        <p style={{ color: "#085044", fontSize: 18, fontWeight: 'bold', margin: 0, paddingBottom: 10 }} >Expires In 20</p>
                        <p style={{ color: "#085044", margin: '0 5px', paddingBottom: 13 }} >Days</p>
                    </div>
                    <p style={{ color: "#085044", margin: '0 5px 0 0' }} >On 10 May 2021</p>
                </div>
            )
            case REQUEST_STATUSES.ANSWERED: {
                if (item.attention) return (
                    <div style={{ flexGrow: 1 }} >
                        <p style={{ color: "#085044", fontWeight: 'bold', paddingBottom: 10, margin: 0 }} >Attention</p>
                        <p style={{ color: "#085044", margin: '0 5px 0 0' }} >REQUEST has been updated</p>
                        <p style={{ color: "#085044", margin: '0 5px 0 0' }} >on April 5, 2022</p>
                    </div>
                ); else return (
                    <div style={{ flexGrow: 1 }} >
                        <p style={{ color: "#085044", fontSize: 18, fontWeight: 'bold', paddingBottom: 10, margin: 0 }} >$ 500</p>
                        <div style={{ display: 'flex' }} >
                            <p style={{ color: "#085044", margin: 0, marginRight: 5 }} >Quote Date:</p>
                            <p style={{ color: "#085044", fontWeight: 'bold', margin: 0 }} >15 Apr, 2021</p>
                        </div>
                    </div>
                )
            }

            case REQUEST_STATUSES.EXPIRED: return (
                <div style={{ flexGrow: 1 }} >
                    <div style={{ display: 'flex', }} >
                        <p style={{ color: "#085044", fontSize: 18, fontWeight: 'bold', margin: 0, padding: 0 }} >$ 500</p>
                        <p style={{ color: "white", fontSize: 18, fontWeight: 'bold', margin: 0, borderRadius: 3, backgroundColor: '#ffcecc', padding: '0px 10px', marginLeft: 10 }} >Expired</p>
                    </div>
                    <div style={{ display: 'flex', paddingTop: 5 }} >
                        <p style={{ color: "#085044", margin: 0, marginRight: 5 }} >Quote Date:</p>
                        <p style={{ color: "#085044", fontWeight: 'bold', margin: 0 }} >15 Apr, 2021</p>
                    </div>
                </div>
            )

            default: return null
        }
    }

    return (
        <div className="doctor-item" style={{ display: 'flex', padding: 20, margin: 0, borderStyle: 'solid', borderWidth: '1px 0 0 0', borderColor: "#ffdedd" }}>
            <div style={{ flexGrow: 1 }} >
                <p style={{ color: "#085044", fontSize: 18, fontWeight: 'bold', paddingBottom: 10, margin: 0 }} >Irritable bowel syndrome</p>
                <div style={{ display: 'flex' }} >
                    <p style={{ color: "#085044", margin: '0 5px 0 0' }} >Posted on </p>
                    <p style={{ color: "#085044", fontWeight: 'bold', margin: 0 }} >15 Apr, 2021</p>
                    <p style={{ color: "#085044", margin: '0 5px' }} >| Req ID:</p>
                    <p style={{ color: "#085044", fontWeight: 'bold', margin: 0 }} >1542215555</p>
                </div>
                <div style={{ display: 'flex' }} >
                    <p style={{ color: "#085044", margin: '0 5px 0 0' }} >Posted on </p>
                    <p style={{ color: "#085044", fontWeight: 'bold', margin: 0 }} >Josn Mcmohan</p>
                    <p style={{ color: "#085044", margin: '0 5px' }} >|</p>
                    <p style={{ color: "#085044", fontWeight: 'bold', margin: 0 }} >User ID 519357</p>
                </div>
            </div>
            <div style={{ width: 1, alignSelf: 'stretch', backgroundColor: '#ffdedd', margin: '0 20px' }} />
            <ItemStatus />
            <div style={{ width: 1, alignSelf: 'stretch', backgroundColor: '#ffdedd', margin: '0 30px' }} />
            <div style={{ alignSelf: 'center', display: 'flex', alignItems: 'center' }} >
                {item.status == REQUEST_STATUSES.NEW && <IconButton style={{ margin: '0 30px 0 0', color: 'black' }} >
                    {item.favorite ? <FavoriteOutlined style={{ fontSize: 40 }} /> : <FavoriteBorder style={{ fontSize: 40 }} />}
                </IconButton>}
                <MyButton label={buttonText()} />
            </div>
        </div>
    )
}

const REQUEST_STATUSES = {
    NEW: 0,
    ANSWERED: 1,
    EXPIRED: 2
}