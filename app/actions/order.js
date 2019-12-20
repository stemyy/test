import {ipcRenderer} from "electron";
import {openToast} from "./toaster";

const _cancelOrder = (id) => ({
    type: 'REMOVE_ORDER',
    id
});

export const cancelOrder = (orderId) => {
    return (dispatch) => {
        ipcRenderer.send('cancel-order', orderId);
        ipcRenderer.once('order-canceled', () => {
            dispatch(_cancelOrder(orderId));
            dispatch(openToast({message: 'Commande annulée', open: true}));
        })
    };
};

const _validateOrder = (id, updates) => ({
    type: 'VALIDATE_ORDER',
    id, updates
});

export const validateOrder = (orderId, updates) => {
    return (dispatch) => {
        const now = new Date();
        updates.receivedAt = now.getTime();
        ipcRenderer.send('validate-order', orderId, updates);
        ipcRenderer.once('order-validated', (event, updates) => {
            dispatch(_validateOrder(orderId, updates));
        })
    };
};
