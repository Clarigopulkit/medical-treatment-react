import { Typography, Box, Modal, Button } from "@material-ui/core";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper', borderWidth: 2, borderColor: '#debcbd', borderStyle: 'solid',
    p: 3,
};

function CustomPopup({ visible, dismiss, title, onYes = null, hideSecondaryButton = false, message = null, onNo = null, primaryText = null }) {

    const onPrimary = () => {
        if (onYes) onYes()
        dismiss()
    }

    const onSecondary = () => {
        if (onNo) onNo()
        dismiss()
    }

    return (
        <Modal
            open={visible}
            onClose={dismiss}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >

            <Box sx={style}


            >
                <Typography id="modal-modal-title" variant="h6" style={{ fontWeight: 'bold', color: '#085044', textAlign: 'center' }} component="h2">{title}</Typography>
                {message && <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{ color: '#085044', textAlign: 'center' }} >{message}</Typography>}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>


                    {!hideSecondaryButton && <Button onClick={onSecondary} disableElevation style={{ background: "white", borderRadius: 30, color: '#085044', flexGrow: 1,maxWidth: '50%', fontWeight: 'bold', border: '1px solid #085044' }} >No</Button>}
                    {!hideSecondaryButton && <div style={{ width: 10 }} />}
                    <Button onClick={onPrimary} disableElevation style={{ background: "#085044", borderRadius: 30, color: 'white', flexGrow: 1, maxWidth: '50%', justifySelf: 'center', fontWeight: 'bold', }} >{primaryText || 'Yes'}</Button>


                </div>
            </Box>

        </Modal>
    );
}
export default CustomPopup