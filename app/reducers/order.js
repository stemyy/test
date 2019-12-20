// @flow
import type {Action} from './types';
import {ipcRenderer} from 'electron';

const orders = ipcRenderer.sendSync('get-orders');
export default function order(state: array = orders, action: Action) {
    switch (action.type) {
        case 'VALIDATE_ORDER':
            return state.map((order) => {
                if (order.id === action.id) {
                    return {
                        ...order,
                        ...action.updates
                    };
                } else {
                    return order;
                }
            });
        case 'REMOVE_ORDER':
            return state.filter(({ id }) => id !== action.id);
        case 'ORDER_STOCK':
            return [
                ...state,
                action.order
            ];
        default:
            return state;
    }
}
