// @flow
import type {Action} from './types';
import {ipcRenderer} from 'electron';

const providers = ipcRenderer.sendSync('get-providers');
export default function provider(state: array = providers, action: Action) {
    switch (action.type) {
        case 'ADD_PROVIDER':
            return [
                ...state,
                action.provider
            ];
        case 'UPDATE_PROVIDER':
            return state.map((provider) => {
                if (provider.id === action.id) {
                    return {
                        ...provider,
                        ...action.updates
                    };
                } else {
                    return provider;
                }
            });
        case 'REMOVE_PROVIDER':
            return state.filter(({ id }) => id !== action.id);
        case 'REFRESH_PROVIDERS':
            return action.providers;
        default:
            return state;
    }
}
