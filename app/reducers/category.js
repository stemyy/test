import type {Action} from "./types";
import {ipcRenderer} from "electron";

const categories = ipcRenderer.sendSync('get-categories');

export default function category(state: array = categories, action: Action) {
    switch (action.type) {
        case 'ADD_CATEGORY':
            return [
                ...state,
                action.category
            ];
        case 'UPDATE_CATEGORY':
            return state.map((category) => {
                if (category.id === action.id) {
                    return {
                        ...category,
                        ...action.updates
                    };
                } else {
                    return category;
                }
            });
        case 'REMOVE_CATEGORY':
            return state.filter(({ id }) => id !== action.id);
        default:
            return state;
    }
}
