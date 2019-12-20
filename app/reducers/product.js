// @flow
import type {Action} from './types';
import {ipcRenderer} from 'electron';

const products = ipcRenderer.sendSync('get-products');
export default function product(state: array = products, action: Action) {
    switch (action.type) {
        case 'ADD_PRODUCT':
            return [
                ...state,
                action.product
            ];
        case 'REMOVE_PRODUCTS':
            if (Array.isArray(action.selected)) {
                return state.filter(({ id }) => !action.selected.includes(id));
            } else {
                return state.filter(({ id }) => id !== action.selected);
            }
        case 'UPDATE_PRODUCTS_CATEGORIES':
            const changedId = action.updates.map(product => product.id);
            return state.map((product) => {
                if (changedId.indexOf(product.id) === -1) {
                    return product;
                } else {
                    const changes = action.updates.find(p => p.id === product.id);
                    if (changes) {
                        return {...product, ...changes}
                    } else {
                        return product;
                    }
                }
            });
        case 'UPDATE_STOCK':
            return state.map((product) => {
                if (product.id === action.productId) {
                    let stocks;
                    if (action.updates.quantity === 0) {
                        stocks = product.stocks.filter(stock => stock.id !== action.stockId);
                    } else {
                        const stockExists = product.stocks.find(stock => stock.id === action.stockId);
                        if (stockExists) {
                            stocks = product.stocks.map((stock) => {
                                if (stock.id === action.stockId) {
                                    return {
                                        ...stock,
                                        ...action.updates
                                    }
                                } else {
                                    return stock;
                                }
                            });
                        } else if (action.stock){
                            stocks = [
                                ...product.stocks,
                                action.stock
                            ]
                        }
                    }
                    return {
                        ...product,
                        stocks : stocks
                    };
                } else {
                    return product;
                }
            });
        case 'UPDATE_PRODUCT':
            return state.map((product) => {
                if (product.id === action.id) {
                    return {
                        ...product,
                        ...action.updates
                    };
                } else {
                    return product;
                }
            });
        case 'REFRESH_PRODUCTS':
            return action.products;
        default:
            return state;
    }
}
