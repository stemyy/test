import {ipcRenderer} from "electron";

const _createStockAlert = (stockAlert) => ({
    type: 'CREATE_STOCK_ALERT',
    element: stockAlert
});

export const createStockAlert = (productId, providerId) => {
    return (dispatch) => {
        ipcRenderer.send('create-stock-alert', productId, providerId);
        ipcRenderer.once('stock-alert-created', (event, stockAlert) => {
            dispatch(_createStockAlert(stockAlert));
        })
    };
};

const _removeStockAlert = (productId, providerId) => ({
    type: 'REMOVE_STOCK_ALERT',
    productId, providerId
});

export const removeStockAlert = (productId, providerId) => {
    return (dispatch) => {
        ipcRenderer.send('remove-stock-alert', productId, providerId);
        ipcRenderer.once('stock-alert-removed', () => {
            dispatch(_removeStockAlert(productId, providerId));
        })
    };
};


const _removeStockAlerts = () => ({
    type: 'REMOVE_STOCK_ALERTS',
});

export const removeStockAlerts = () => {
    return (dispatch) => {
        ipcRenderer.send('remove-stock-alerts');
        ipcRenderer.once('stock-alerts-removed', () => {
            dispatch(_removeStockAlerts());
        })
    };
};
