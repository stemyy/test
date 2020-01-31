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
            dispatch(_removeToast(baseToast.openedAt));
        }, toast.autoHideDuration);
    };
};

const _removeToast = (id) => ({
    type: 'CLOSE_TOAST',
    id: id
});

export const removeToast = (id) => {
    return (dispatch) => {
        dispatch(_removeToast(id));
    };
};
