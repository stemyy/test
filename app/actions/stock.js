import {ipcRenderer} from "electron";
import {openToast} from "./toaster";

const _updateStock = (stockId, productId, updates, stock) => ({
    type: 'UPDATE_STOCK',
    stockId, productId, updates, stock
});

export const updateStock = (stockId, updates, callback) => {
    return (dispatch) => {
        ipcRenderer.send('update-stock', stockId, updates);
        ipcRenderer.once('stock-updated', (event, updates, productId, stock) => {
            dispatch(_updateStock(stockId, productId, updates, stock));
            if (callback) callback();
            dispatch(openToast({message: 'Stock mis à jour', open: true}));
        })
    };
};

const _orderStock = (order) => ({
    type: 'ORDER_STOCK',
    order
});

export const orderStock = (ordered) => {
    return (dispatch) => {
        ipcRenderer.send('order-stock', ordered);
        ipcRenderer.once('stock-ordered', (event, order) => {
            dispatch(_orderStock(order));
            dispatch(openToast({message: 'Commande ajoutée', open: true}));
        })
    };
};
