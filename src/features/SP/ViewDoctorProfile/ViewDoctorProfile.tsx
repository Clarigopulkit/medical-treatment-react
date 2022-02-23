import { useEffect, useState } from "react";
// import "./index.css";
import { useHistory, useParams } from "react-router-dom";

import { Tabs, Grid } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
// import "./style.scss";
import PersonalInfo from "./PersonalInfo";
import ProfessionalInfo from "./ProfessionalInfo";
import BusinessInfo from "./BusinessInfo";
import Profile from "./Profile";
import TreatmentInfo from "./TreatmentInfo";
import { getTabData } from "./ViewDoctorProfileAPI";

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ViewDoctorProfile = () => {
  const params = useParams();
  const [tab, setTab] = useState(0);
  const [tabData, setTabData] = useState();

  useEffect(() => getTabData((params as any)?.id, tab, setTabData), [tab]);

  const Panel = () => {
    switch (tab) {
      case 0:
        return <PersonalInfo data={tabData} />;
      case 1:
        return <ProfessionalInfo data={tabData} />;
      case 2:
        return <TreatmentInfo data={tabData} />;
      case 3:
        return <BusinessInfo data={tabData} />;
      case 4:
        return <Profile data={tabData} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
                <p style={{ color: "#085044", fontSize: 30, fontWeight: 'bold' }} >Requests</p>

                <div style={{ marginLeft: 'auto', }} >
                    <MyButton label="Sort by" outlined />
                </div>
            </div> */}
      <div
        style={{
          flexGrow: 1,
          background: "white",
          border: "solid 1px #debcbb",
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Tabs
              value={tab}
              onChange={(e, value) => setTab(value)}
              aria-label="simple tabs example"
              className="tabs-container"
            >
              <Tab
                style={{ flex: 1, fontSize: "18px", fontWeight: "bold" }}
                label="PERSONAL INFO"
                className="login-tab"
              />
              <Tab
                style={{
                  flex: 1,
                  color: "#085044",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                label="PROFESSIONAL INFO"
                className="login-tab"
              />
              <Tab
                style={{
                  flex: 1,
                  color: "#085044",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                label="TREATMENTS"
                className="login-tab"
              />
              <Tab
                style={{
                  flex: 1,
                  color: "#085044",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                label="BUSINESS INFO"
                className="login-tab"
              />
              <Tab
                style={{
                  flex: 1,
                  color: "#085044 !important",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                label="PUBLIC-PROFILE"
                className="login-tab"
              />
            </Tabs>
          </Grid>
        </Grid>

        <Panel />
      </div>
    </div>
  );
};
export default ViewDoctorProfile;


export const ProfileIntroField = ({ label, value, width = null }) => (
  <Grid style={{
      paddingTop: 30
  }} item md={width || 3} sm={width || 3} xs={12}>
      <Typography style={{ fontWeight: 'bold', color: '#085044', fontSize: "15px", marginBottom: '2' }} >{label}</Typography>
      <Typography style={{
          color: '#085044', padding: ' 20px', fontWeight: 'bold',
          height: "114px",
          //  marginTop: 10,
          border: 'solid #085044 1px',
          fontFamily: "monospace",
          borderRadius: 21
      }} >{value}</Typography>
  </Grid>
)

const MyButton = ({ onClick = null, label, outlined = false }) => {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 50,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: outlined ? "#085044" : "white",
        backgroundColor: outlined ? "white" : "#085044",
        padding: "10px 30px 10px 30px",
        cursor: "pointer",
        minWidth: 200,
      }}
    >
      <p
        style={{
          color: outlined ? "#085044" : "white",
          fontSize: 16,
          fontWeight: "bold",
          padding: 0,
          margin: 0,
          textAlign: "center",
        }}
      >
        {label}
      </p>
    </div>
  );
};

export const FieldInfo = ({ label, value, width = null }) => (
  <Grid
    style={{ padding: "16px 24px 16px 0px " }}
    item
    md={width || 3}
    sm={width || 3}
    xs={12}
  >
    <Typography style={{ fontWeight: "bold", color: "#085044" }}>
      {label}
    </Typography>
    <Typography
      style={{
        color: "#085044",
        padding: "10px 20px",
        fontWeight: "bold",
        marginTop: "2px",
        border: "solid #085044 1px",
        borderRadius: 50,
        height: "41px",
      }}
    >
      {value}
    </Typography>
  </Grid>
);

export const AddressInfo = () => (
  <Grid container justifyContent="flex-start" direction="row">
    <FieldInfo label="Address Line" width={12} value="Mikias" />
    <FieldInfo label="Country" value="Mikias" />
    <FieldInfo label="State" value="Mikias" />
    <FieldInfo label="City" value="Mikias" />
    <FieldInfo label="Zip / Postal code" value="Mikias" />
  </Grid>
);

export const SectionTitle = ({ value }) => (
  <Typography
    style={{
      fontWeight: "bold",
      color: "#085044",
      fontSize: "24px",
      lineHeight: "29.6333px",
      marginTop: "72px",
      marginBottom: "15px",
    }}
  >
    {value}
  </Typography>
);
