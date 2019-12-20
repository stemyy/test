import {ipcRenderer} from "electron";
import {openToast} from "./toaster";

const _addProvider = (provider) => ({
    type: 'ADD_PROVIDER',
    provider
});

export const addProvider = (provider) => {
    return (dispatch) => {
        ipcRenderer.send('add-provider', provider);
        ipcRenderer.once('provider-created', (event, provider) => {
            provider.products = [];
            dispatch(_addProvider(provider));
            dispatch(openToast({message: 'Fournisseur ajouté', open: true}));
        });
    };
};

const _updateProvider = (id, updates) => ({
    type: 'UPDATE_PROVIDER',
    id, updates
});

export const updateProvider = (providerId, providerUpdate) => {
    return (dispatch) => {
        ipcRenderer.send('update-provider', providerId, providerUpdate);
        ipcRenderer.once('provider-updated', (event, updates) => {
            dispatch(_updateProvider(providerId, updates));
            dispatch(openToast({message: 'Fournisseur modifié', open: true}));
        })
    };
};

const _removeProvider = (id) => ({
    type: 'REMOVE_PROVIDER',
    id
});

export const removeProvider = (id) => {
    return (dispatch) => {
        ipcRenderer.send('remove-provider', id);
        ipcRenderer.once('provider-removed', (event, id) => {
            dispatch(_removeProvider(id));
            dispatch(openToast({message: 'Fournisseur supprimé', open: true}));
        });
    }
};

const _refreshProviders = (providers) => ({
    type: 'REFRESH_PROVIDERS',
    providers
});

export const refreshProviders = () => {
    return (dispatch) => {
        const providers = ipcRenderer.sendSync('get-providers');
        dispatch(_refreshProviders(providers));
    };
};
