import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AddressInfo, FieldInfo, SectionTitle } from "./ViewDoctorProfile";

const PersonalInfo = ({ data }) => {
  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: "flex" }}>
        <img
          style={{
            width: "200px",
            height: "170px",
            border: "1px rgb(221, 221, 221) solid",
            borderRadius: "5px",
            marginRight: 20,
            marginBottom: "8px",
            objectFit: "contain",
          }}
          src="https://image.shutterstock.com/image-photo/profile-picture-smiling-young-caucasian-260nw-1954278664.jpg"
        />
        <div>
          <p style={{ color: "#085044", margin: 0, fontSize: "16px" }}>
            SP ID :{" "}
            <p
              style={{
                fontWeight: "bold",
                display: "inline",
                fontSize: "16px",
              }}
            >
              71602
            </p>
          </p>
          <p style={{ color: "#085044", margin: 0, fontSize: "16px" }}>
            Response rate :{" "}
            <p
              style={{
                fontWeight: "bold",
                display: "inline",
                fontSize: "16px",
              }}
            >
              2days
            </p>
          </p>
          <p style={{ color: "#085044", margin: 0, fontSize: "16px" }}>
            Rating :{" "}
            <p
              style={{
                fontWeight: "bold",
                display: "inline",
                fontSize: "16px",
              }}
            >
              4.2
            </p>
          </p>
        </div>
      </div>
      <div
        style={{
          marginTop: "0px",
          padding: "15px 0px",
          marginBottom: 20,
        }}
      >
        <Grid container justifyContent="flex-start" direction="row">
          <FieldInfo label="First Name" value="Value" />
          <FieldInfo label="Middle Name" value="Value" />
          <FieldInfo label="Last Name" value="Value" />
          <FieldInfo label="Email Id" value="Value" />
          <FieldInfo label="Phone Number" value="Value" />
          <FieldInfo label="Mobile Number" value="Value" />
          <FieldInfo label="Week Leaves / Offs" value="Value" />
        </Grid>
      </div>
      <div style={{ height: "64px" }}>
        <SectionTitle value="Office Address" />
      </div>
      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ddbcbc",
          padding: "15px 30px",
          height: "236px",
        }}
      >
        <AddressInfo />
      </div>
      <div style={{ height: 20 }} />
      <div
        style={{
          marginTop: "0px",
          border: "1px solid #ddbcbc",
          padding: "15px 30px",
          height: "236px",
        }}
      >
        <AddressInfo />
      </div>

      <SectionTitle value="Correspondence Address" />
      <div style={{ marginTop: "0px", padding: "15px 0px", height: "196px" }}>
        <AddressInfo />
      </div>

      <div style={{ paddingTop: "16px" }}>
        <FieldInfo
          width={6}
          label="LinkedIn Profile (Paste profile Link)"
          value="Value"
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
