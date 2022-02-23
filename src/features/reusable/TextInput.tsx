import {
    FormControl,
    FormHelperText,
    TextField,
    Grid,
    Typography,
} from "@material-ui/core";


const TextInput = ({ fieldName, header = null, label, lg = null, register, errors, multiline = false }) => {
    return (
        <Grid item style={{ padding: '5px' }} lg={lg || 3} md={lg || 3} sm={6} xs={12} justifyContent="flex-start" >
            <label style={{ fontWeight: 600, fontSize: "18px", color: "#446455", marginBottom: "2px" }}>{label}</label>
            <FormControl style={{paddingTop : 10}} error={errors[fieldName] ? true : false} variant="outlined" fullWidth>
                <TextField
                    InputLabelProps={{ style: { paddingTop: 12 } }}
                    variant="outlined"
                    
                    multiline={multiline}
                    InputProps={{ style: { minHeight: multiline ?150 : 45, borderRadius : 30 } }}
                    inputProps={register(fieldName)}
                   />
                <FormHelperText>{errors[fieldName]?.message}</FormHelperText>
            </FormControl>
        </Grid>
    )
}

export default TextInput
