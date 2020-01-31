import {ipcRenderer} from "electron";
import {openToast} from "./toaster";
import {createStockAlert, removeStockAlert} from "./stockAlert"
import moment from 'moment-business-days';

const _updateStock = (stockId, productId, updates, stock) => ({
    type: 'UPDATE_STOCK',
    stockId, productId, updates, stock
});

export const updateStock = (stockId, updates, callback) => {
    return (dispatch) => {
        ipcRenderer.send('update-stock', stockId, updates);
        ipcRenderer.once('stock-updated', (event, updates, productId, providerId, stock) => {
            dispatch(_updateStock(stockId, productId, updates, stock));
            if (callback) { // means we're validating order/adding stock
                callback();
            } else {
                const stockAlert = checkStockAlert(productId, providerId);
                if (stockAlert) dispatch(createStockAlert(productId, providerId));
            }

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
        if (ordered.skipped) {
            ipcRenderer.send('skip-order', ordered);
            ipcRenderer.once('order-skipped', (event, stock) => {
                dispatch(_updateStock(stock.id, ordered.productId, stock, stock));
                dispatch(openToast({message: 'Stock mis à jour', open: true}));
            })
        } else {
            ipcRenderer.send('order-stock', ordered);
            ipcRenderer.once('stock-ordered', (event, order) => {
                dispatch(removeStockAlert(ordered.productId, ordered.providerId));
                dispatch(_orderStock(order));
                dispatch(openToast({message: 'Commande ajoutée', open: true}));
            })
        }
    };
};

const checkStockAlert = (productId, providerId) => {
    const stockChanges = ipcRenderer.sendSync('get-stockChanges', productId, providerId);
    const lastChange = stockChanges[0];
    const lastOrder = stockChanges.find(stockChange => stockChange.order !== null);
    if (!lastOrder) {
        return false;
    } else {
        const actualQuantity = lastChange.actualQuantity;
        const daysSinceLastRestock = moment(lastOrder.order.receivedAt).businessDiff(moment(lastChange.createdAt));
        const stockChangesSinceLastRestock = lastOrder.actualQuantity - lastChange.actualQuantity;
        const usagePerDaySinceLastOrder = stockChangesSinceLastRestock / daysSinceLastRestock;
        const allOrders = stockChanges.filter(stockChange => stockChange.order !== null);
        const ordersDelays = (allOrders.reduce( function(a, b){
            return a + moment(b.order.createdAt).businessDiff(moment(b.order.receivedAt));
        }, 0) / allOrders.length);
        const usagePrevisionBeforeNextOrder = usagePerDaySinceLastOrder * Math.ceil(ordersDelays * 1.30);

        return usagePrevisionBeforeNextOrder > actualQuantity;
    }
};
