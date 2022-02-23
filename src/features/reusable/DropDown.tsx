import {
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    Grid,
    Typography
} from "@material-ui/core";


const DropDown = ({ fieldName, label, options, lg = null, errorMessage = null, register, errors, watch }) => {
    const value = watch(fieldName)
    return (
        <Grid item style={{ padding: '5px' }} lg={lg || 3} md={lg || 3} sm={6} xs={12} >
            <label style={{ fontWeight: 600, fontSize: "18px", color: "#446455", marginBottom: "2px"}}>{label}</label>

            {(!value) && <Typography style={{ color: "#446455", fontSize: 18, position: 'absolute', paddingLeft: 15, paddingTop: 19 }} className="advance-search-heading">Select</Typography>}
            <FormControl style={{paddingTop  :10}} error={errors[fieldName] ? true : false} variant="standard" fullWidth>
                <Select
                    {...register(fieldName, { required: 'Please select ' + label })}
                    value={value || ''}
                    SelectDisplayProps={{ style: { height: 44, padding: '0 0 0 0', display: 'flex', alignItems: 'center' } }}
                    label={null}
                    disableUnderline
                    style={{ borderRadius: 30, borderWidth: 1, borderColor: 'rgb(8, 80, 68)', borderStyle: 'solid', padding: '0 15px', color: '#446455' }}
                    MenuProps={{ style: { maxHeight: 300 } }}>

                    {options.map((item, index) => <MenuItem key={index} value={item.id || item.name || item}>{item.name || item}</MenuItem>)}

                </Select>
                {errors[fieldName] && <FormHelperText>{errorMessage || errors[fieldName]?.message}</FormHelperText>}
            </FormControl>
        </Grid>
    )
}


export default DropDown