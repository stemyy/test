import type {Action} from "./types";

const toast = null;

export default function category(state: toast = null, action: Action) {
    switch (action.type) {
        case 'OPEN_TOAST':
            return action.options;

        case 'CLOSE_TOAST':
            return state ? {...state, ...{open: false}} : null;

        case 'REMOVE_TOAST':
            return null;

        default:
            return state;
    }
}
