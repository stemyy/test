import type {Action} from "./types";

const toast = null;

export default function category(state: toast = null, action: Action) {
    switch (action.type) {
        case 'OPEN_TOAST':
            return action.options;

        case 'CLOSE_TOAST':
            if (!state) return null;
            return (state.openedAt === action.id) ? {...state, ...{open: false}} : state;

        case 'REMOVE_TOAST':
            return null;

        default:
            return state;
    }
}
