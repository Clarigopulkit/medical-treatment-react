

import { Grid } from "@material-ui/core";
import { SectionTitle } from "./ViewDoctorProfile";
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const TreatmentInfo = ({ data }) => {
    return (
        <div style={{ padding: 30 }}>
            <SectionTitle value="Treatments" />
            <Grid container justifyContent="flex-start" direction="row">
                <Section list={['Body', 'Hair']} label="Area" number={2} />
                <Section list={['Arms and Hands', 'Back']} label="Category" number={2} />
                <Section list={['Wrist', 'Irritable back pain', 'Nose']} label="Sub Categories" number={3} />
                <Section list={['Body', 'Hair']} label="Treatments" number={2} />
            </Grid>
        </div>
    )
}

export default TreatmentInfo

const Section = ({ list, label, number }) => (
    <Grid item md={3} sm={3} xs={12}>
        <div style={{ border: "1px #ddbcbc solid", margin: 10 }}>
            <div style={{ color: '#085044', border: "1px solid #FDF7F7", background: "#FDF7F7", padding: "0px 10px", height: 40, fontWeight: 300, fontSize: 18, margin: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }} >{label}
                <p style={{ display: "inline", marginRight: 10, fontWeight: 600 }}>{number}</p>
            </div>
            <div style={{ padding: 15 }} >
                {list.map((item, index, arr) => (
                    <div style={{ paddingTop: index == 0 ? 0 : 15, display: 'flex', justifyContent: 'space-between' }} >
                        <p key={index} style={{ color: "#085044", margin: 0, fontWeight: 'bold' }} >{item}</p>
                        <p key={index} style={{ color: "#085044", margin: 0, fontWeight: 'bold' }} ><CheckBoxIcon /></p>
                    </div>
                ))}
            </div>
        </div>
    </Grid>
)