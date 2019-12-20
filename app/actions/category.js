import {ipcRenderer} from "electron";
import {openToast} from "./toaster";

const _addCategory = (category) => ({
    type: 'ADD_CATEGORY',
    category
});

export const addCategory = (category) => {
    return (dispatch) => {
        ipcRenderer.send('add-category', category);
        ipcRenderer.once('category-created', (event, category) => {
            dispatch(_addCategory(category));
            dispatch(openToast({message: 'Catégorie ajoutée', open: true}));
        });
    };
};

const _updateCategory = (id, updates) => ({
    type: 'UPDATE_CATEGORY',
    id, updates
});

export const updateCategory = (categoryId, categoryUpdates, callback) => {
    return (dispatch) => {
        ipcRenderer.send('update-category', categoryId, categoryUpdates);
        ipcRenderer.once('category-updated', (event, updates) => {
            dispatch(_updateCategory(categoryId, updates));
            if (callback) callback();
            dispatch(openToast({message: 'Catégorie modifiée', open: true}));
        })
    };
};

const _removeCategory = (id) => ({
    type: 'REMOVE_CATEGORY',
    id
});

export const removeCategory = (categoryId) => {
    return (dispatch) => {
        ipcRenderer.send('remove-category', categoryId);
        ipcRenderer.once('category-removed', () => {
            dispatch(_removeCategory(categoryId));
            dispatch(openToast({message: 'Catégorie supprimée', open: true}));
        })
    }
};

const _getCategories = (categories) => ({
    type: 'GET_CATEGORIES',
    categories
});

export const getCategories = () => {
    return (dispatch) => {

        //return axios.get('products').then(result => {
        const categories = [];

        result.data.forEach(item => {
            categories.push(item);
        });

        dispatch(_getCategories(categories));
        //});
    };
};
