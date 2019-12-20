// @flow
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import product from './product';
import rows from './rows';
import category from './category';
import provider from './provider';
import maker from './maker';
import order from './order';
import toast from './toast';

export default function createRootReducer(history: History) {
    return combineReducers({
        router: connectRouter(history),
        products: product,
        orders: order,
        rows: rows,
        categories: category,
        providers: provider,
        makers: maker,
        toast: toast
    });
}
