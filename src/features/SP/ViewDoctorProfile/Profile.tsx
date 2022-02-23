

import { Grid, Typography, } from "@material-ui/core";
import { Rating, Button } from "@mui/material";
// import { TextField } from "material-ui";
import {
    AddressInfo, FieldInfo, SectionTitle,
    ProfileIntroField
} from "./ViewDoctorProfile";

const Profile = (data) => {
    return (
        <div style={{ padding: "0px 30px" }}>
            <div style={{ marginTop: 0 }}>
                <SectionTitle value="Public Profile" />
            </div>
            <div style={{
                marginTop: 20,
                //  border: '1px solid #ddbcbc', padding: 20,
                marginBottom: 20
            }}>
                <div style={{ display: 'flex', paddingTop: "15" }} >
                    <img style={{ width: 200, height: 187, border: '1px #ccc solid', borderRadius: 5, marginRight: 20, objectFit: 'contain' }} src="https://image.shutterstock.com/image-photo/profile-picture-smiling-young-caucasian-260nw-1954278664.jpg" />
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "start" }}>
                        <p style={{ fontSize: "25px", fontWeight: "bold", color: '#085044', margin: 0 }}>Kratika Singh</p>
                        {/* {/ <p style={{ color: '#085044', margin: 0 }} >SP ID : <p style={{ fontWeight: 'bold', display: 'inline' }} >71602</p></p> /} */}
                        <p style={{ color: '#085044', margin: "10px 0 -10px 0", fontSize: "initial" }} >Response rate : <p style={{ fontWeight: 'bold', display: 'inline' }} >2days</p></p>
                        <p style={{ color: '#085044', margin: 0, fontSize: "initial", display: "flex", alignItems: "center" }} >Feedback : <p style={{ fontWeight: 600, display: 'inline' }} >4.8</p><span><Rating value={2} style={{ marginLeft: 5 }} /></span> <p style={{ fontWeight: 600, display: 'inline' }}>(205)</p></p>
                        <p style={{ fontSize: "16px", fontWeight: 600, color: '#085044', margin: 0, wordBreak: "break-word" }}>Cardiology - Non Interventional and General Study</p>
                    </div>
                </div>
                <Grid container justifyContent="flex-start" direction="row" style={{ padding: "50px 0" }}>
                    <FieldInfo width={6} label="Introduction Title" value="Title" />
                    <ProfileIntroField width={12} label="Introduction " value="Here is introduction.." />

                </Grid>

                <hr style={{ width: "98%" }} />
            </div>
            <SectionTitle value="Portfolio" />
            <div style={{ marginTop: 20, border: '1px solid #ddbcbc', padding: 20, marginBottom: 20 }}>
                <Grid container justifyContent="flex-start" direction="row">
                    <Item />
                    <Item />
                </Grid>
            </div>

            <SectionTitle value="Hospital" />
            <div style={{ marginTop: 20, border: '1px solid #ddbcbc', padding: 20, marginBottom: 20 }}>
                <Grid container justifyContent="flex-start" direction="row">
                    <Item />
                    <Item />
                </Grid>
            </div>

            <SectionTitle value="Feedbacks" />
            <div style={{ paddingTop: 40 }}>
                {[1, 2, 3, 4].map((item, index, arr) => <FeedBackItem item={item} key={index} showDivider={index != arr.length - 1} />)}
            </div>
        </div>
    )
}

export default Profile

const Item = ({ item = null }) => (
    <Grid style={{ padding: 10 }} item md={3} sm={3} xs={12}>
        <img style={{ width: '100%', height: 200, border: '1px solid #50', objectFit: 'cover' }} src="https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/GettyImages-1081947082_hero-1024x575.jpg?w=1155&h=1528" />
        <p style={{ paddingTop: 10, margin: 0, fontSize: 15, color: '#085044', }} >Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore voluptate quam aliquid accusantium ipsam.</p>
    </Grid>
)

const FeedBackItem = ({ item, showDivider }) => (
    <div>
        <Typography style={{ fontWeight: 'bold', fontSize: 18, color: "#085044" }} >Irritable bowel syndrome</Typography>
        <Typography style={{ fontWeight: 'bold', color: "#085044" }} >John sui | April 2021</Typography>
        <Rating value={4} readOnly />
        <p style={{ margin: 0, fontSize: 16, color: '#085044', padding: "15px 0" }} >Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore voluptate quam aliquid accusantium ipsam.</p>
        {showDivider && <div style={{ marginTop: 10, marginBottom: 10, width: '100%', background: '#eee', height: 1 }} />}
    </div>
)
