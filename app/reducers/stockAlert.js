// @flow
import type {Action} from './types';
import {ipcRenderer} from 'electron';

const stockAlerts = ipcRenderer.sendSync('get-stockAlerts');
export default function stockAlert(state: array = stockAlerts, action: Action) {
    switch (action.type) {
        case 'CREATE_STOCK_ALERT':
            return [
                ...state,
                action.element
            ];
        case 'REMOVE_STOCK_ALERT':
            return state.filter(({ productId, providerId }) => (productId !== action.productId && providerId !== providerId));
        case 'REMOVE_STOCK_ALERTS':
            return [];
        default:
            return state;
    }
}
