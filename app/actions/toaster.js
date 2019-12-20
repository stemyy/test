const _openToast = (options) => ({
    type: 'OPEN_TOAST',
    options
});

export const openToast = (options) => {
    const baseToast = {
        openedAt: Date.now(),
        open: false,
        autoHideDuration: 3000,
        message: ''
    };

    const toast = {...baseToast, ...options};
    return (dispatch) => {
        dispatch(_openToast(toast));
        setTimeout(() => {
            dispatch(_removeToast());
        }, toast.autoHideDuration);
    };
};

const _removeToast = () => ({
    type: 'CLOSE_TOAST'
});

export const removeToast = () => {
    return (dispatch) => {
        dispatch(_removeToast());
    };
};
