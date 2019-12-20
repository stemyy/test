import type {Action} from "./types";
import {ipcRenderer} from "electron";

const productRows = ipcRenderer.sendSync('get-rows');

export default function rows(state: array = productRows, action: Action) {
    switch (action.type) {
        case 'ADD_ROW':
            return [
                ...state,
                action.row
            ];
        case 'REMOVE_ROW':
            return state.filter(({ id }) => id !== action.id);
        default:
            return state;
    }
}
