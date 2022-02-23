
import { Grid } from "@material-ui/core";
import { AddressInfo, FieldInfo, SectionTitle } from "./ViewDoctorProfile";

const BusinessInfo = ({ data }) => {
    return (
        <div
            style={{ padding: 30 }}
        >
            <SectionTitle value="Business Information" />
            <div style={{
                marginTop: 20,
                // backgroundColor: "green",
                // border: '1px solid #ddbcbc', padding: 20,
                marginBottom: 30
            }}>
                <Grid container spacing={2} justifyContent="flex-start" direction="row">
                    <FieldInfo width={12} label="Clinic Name" value="Value" />
                </Grid>
                <Grid container spacing={2} justifyContent="flex-start" direction="row">

                    <FieldInfo width={3} label="Website Address" value="Value" />
                    <FieldInfo width={3} label="Clinic Email" value="Value" />
                    <FieldInfo width={3} label="Clinic Phone Number" value="Value" />
                </Grid>
                <Grid container spacing={2} justifyContent="flex-start" direction="row">

                    <FieldInfo width={3} label="Registration Authority" value="Value" />
                    <FieldInfo width={5} label="Registration Number" value="Value" />
                </Grid>
                <img style={{ width: 200, height: 200, border: '1px #ccc solid', borderRadius: 5, marginRight: 20, marginTop: 20, objectFit: 'cover' }} src="https://image.shutterstock.com/image-photo/profile-picture-smiling-young-caucasian-260nw-1954278664.jpg" />
            </div>

            <SectionTitle value="Clinic Address" />
            <AddressInfo />
            <div style={{ height: 20, marginTop: "40px" }} />

            <SectionTitle value="Payment Information" />
            <div style={{
                marginTop: 20,
                // border: '1px solid #ddbcbc',
                // padding: 20
            }}>
                <Grid container justifyContent="flex-start" direction="row">
                    <FieldInfo width={3} label="Tax Number" value="Value" />
                </Grid>
                <Grid container spacing={2} justifyContent="flex-start" direction="row">
                    <FieldInfo width={6} label="Bank Account Number" value="Value" />
                    <FieldInfo width={3} label="Account Holder Name" value="Value" />
                    <FieldInfo width={3} label="Bank Name" value="Value" />
                    <FieldInfo width={3} label="Sort Code or Routing Number" value="Value" />
                    <FieldInfo width={3} label="Swift Code" value="Value" />
                </Grid>
            </div>
        </div>
    )
}

export default BusinessInfo






