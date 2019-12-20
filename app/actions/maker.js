import {ipcRenderer} from "electron";
import {openToast} from "./toaster";

const _addMaker = (maker) => ({
    type: 'ADD_MAKER',
    maker
});

export const addMaker = (maker) => {
    return (dispatch) => {
        ipcRenderer.send('add-maker', maker);
        ipcRenderer.once('maker-created', (event, maker) => {
            maker.products = [];
            dispatch(_addMaker(maker));
            dispatch(openToast({message: 'Fournisseur ajouté', open: true}));
        });
    };
};

const _updateMaker = (id, updates) => ({
    type: 'UPDATE_MAKER',
    id, updates
});

export const updateMaker = (makerId, makerUpdate) => {
    return (dispatch) => {
        ipcRenderer.send('update-maker', makerId, makerUpdate);
        ipcRenderer.once('maker-updated', (event, updates) => {
            dispatch(_updateMaker(makerId, updates));
            dispatch(openToast({message: 'Fabriquant modifié', open: true}));
        })
    };
};

const _removeMaker = (id) => ({
    type: 'REMOVE_MAKER',
    id
});

export const removeMaker = (id) => {
    return (dispatch) => {
        ipcRenderer.send('remove-maker', id);
        ipcRenderer.once('maker-removed', (event, id) => {
            dispatch(_removeMaker(id));
            dispatch(openToast({message: 'Fabriquant supprimé', open: true}));
        });
    }
};

const _refreshMakers = (makers) => ({
    type: 'REFRESH_MAKERS',
    makers
});

export const refreshMakers = () => {
    return (dispatch) => {
        const makers = ipcRenderer.sendSync('get-makers');
        dispatch(_refreshMakers(makers));
    };
};
