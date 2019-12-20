import React, {useEffect} from 'react';
import {Snackbar} from '@material-ui/core';
import {useSelector} from 'react-redux';

const Toaster = () => {
    const toast = useSelector(state => state.toast);

    useEffect(() => {

    }, [toast]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        return null;
    };

    if (toast) {
        return <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={toast.open}
            autoHideDuration={toast.autoHideDuration}
            onClose={handleClose}
            ContentProps={{
                'aria-describedby': 'toast-message-id',
            }}
            message={<span id="toast-message-id">{toast.message}</span>}
            /*action={[
                <Button key="undo" color="secondary" size="small" onClick={handleClose}>
                    UNDO
                </Button>,
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    className={classes.close}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>,
            ]}*/
        />
    } else {
        return null;
    }
};

export default Toaster;
