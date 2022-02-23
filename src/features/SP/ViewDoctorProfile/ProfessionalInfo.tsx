import { Grid } from "@material-ui/core";
import { AddressInfo, FieldInfo, SectionTitle } from "./ViewDoctorProfile";

const ProfessionalInfo = ({ data }) => {
  return (
    <div style={{ padding: 30 }}>
      <SectionTitle value="Registration Information" />
      <div
        style={{
          marginTop: 20,
          border: "1px solid #ddbcbc",
          padding: "0px 30px 15px 30px",
          marginBottom: 20,
        }}
      >
        <Grid container justifyContent="flex-start" direction="row">
          <FieldInfo width={4} label="Registration Number" value="Value" />
          <FieldInfo width={4} label="Registration Authority" value="Value" />
          <FieldInfo width={4} label="Year" value="Value" />
        </Grid>
        <img
          style={{
            width: "270px",
            height: "170px",
            borderRadius: "5px",
            marginRight: 20,
            marginTop: 20,
            objectFit: "cover",
            border: "1px solid rgb(221, 221, 221)",
            padding: "10px",
          }}
          src="https://image.shutterstock.com/image-photo/profile-picture-smiling-young-caucasian-260nw-1954278664.jpg"
        />
      </div>

      <SectionTitle value="Education" />
      <div
        style={{
          marginTop: 20,
          border: "1px solid #ddbcbc",
          padding: "0px 30px 15px 30px",
          // padding: 20,
          marginBottom: 20,
        }}
      >
        <Grid container justifyContent="flex-start" direction="row">
          <FieldInfo width={4} label="Qualification" value="Value" />
          <FieldInfo width={4} label="College/University" value="Value" />
          <FieldInfo width={4} label="Year" value="Value" />
        </Grid>
        <img
          style={{
            width: 270,
            height: 170,
            padding: "10px",
            border: "1px #ccc solid",
            borderRadius: 5,
            marginRight: 20,
            marginTop: 20,
            objectFit: "cover",
          }}
          src="https://image.shutterstock.com/image-photo/profile-picture-smiling-young-caucasian-260nw-1954278664.jpg"
        />
      </div>

      <SectionTitle value="Work Experience" />
      <WorkExperience />
      <WorkExperience />
    </div>
  );
};

export default ProfessionalInfo;

const WorkExperience = () => (
  <div
    style={{
      marginTop: 20,
      marginBottom: "35px",
      border: "1px solid #ddbcbc",
      padding: "15px 30px",
    }}
  >
    <Grid container justifyContent="flex-start" direction="row">
      <FieldInfo width={3} label="Your Role" value="Value" />
      <FieldInfo width={3} label="Ward" value="Value" />
      <FieldInfo width={3} label="Hospital/Clinic Name" value="Value" />
      <FieldInfo width={12} label="Address Line" value="Value" />
      <FieldInfo width={3} label="Country" value="Value" />
      <FieldInfo width={3} label="State" value="Value" />
      <FieldInfo width={3} label="City" value="Value" />
      <FieldInfo width={3} label="Zip/Postal Code" value="Value" />
      <FieldInfo width={3} label="since" value="Value" />
      <FieldInfo width={3} label="Reference (Doctor Name)" value="Value" />
      <FieldInfo width={3} label="Doctor LinkedIn Profile Link" value="Value" />
      <FieldInfo width={3} label="Reference Doctor's Email" value="Value" />
      <FieldInfo width={3} label="Reference Doctor's Phone" value="Value" />
    </Grid>
  </div>
);
