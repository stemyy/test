// @flow
import type {Action} from './types';
import {ipcRenderer} from 'electron';

const makers = ipcRenderer.sendSync('get-makers');
export default function maker(state: array = makers, action: Action) {
    switch (action.type) {
        case 'ADD_MAKER':
            return [
                ...state,
                action.maker
            ];
        case 'UPDATE_MAKER':
            return state.map((maker) => {
                if (maker.id === action.id) {
                    return {
                        ...maker,
                        ...action.updates
                    };
                } else {
                    return maker;
                }
            });
        case 'REMOVE_MAKER':
            return state.filter(({ id }) => id !== action.id);
        case 'REFRESH_MAKERS':
            return action.makers;
        default:
            return state;
    }
}
