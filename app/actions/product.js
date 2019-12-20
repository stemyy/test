import {ipcRenderer} from 'electron';
import {openToast} from "./toaster";

const _addProduct = (product) => ({
    type: 'ADD_PRODUCT',
    product
});

export const addProduct = (product) => {
    return (dispatch) => {
        ipcRenderer.send('add-product', product);
        ipcRenderer.once('product-created', (event, product) => {
            dispatch(_addProduct(product));
            dispatch(openToast({message: 'Produit ajouté', open: true}));
        })
    };
};

const _removeProducts = (selected) => ({
    type: 'REMOVE_PRODUCTS',
    selected
});

export const removeProduct = (selected) => {
    return (dispatch) => {
        ipcRenderer.send('remove-products', selected);
        ipcRenderer.once('products-removed', (event, selected) => {
            dispatch(_removeProducts(selected));
            const message = selected.length < 2 ? 'Produit supprimé' : 'Produits supprimés';
            dispatch(openToast({message: message, open: true}));
        });
    }
};

const _updateProduct = (id, updates) => ({
    type: 'UPDATE_PRODUCT',
    id,
    updates
});

export const updateProduct = (id, updates) => {
    return (dispatch) => {
        ipcRenderer.send('update-product', id, updates);
        ipcRenderer.once('product-updated', (event, updates) => {
            dispatch(_updateProduct(id, updates));
            dispatch(openToast({message: 'Produit mis à jour', open: true}));
        });
    }
};

const _updateProductsCategories = (updates) => ({
    type: 'UPDATE_PRODUCTS_CATEGORIES',
    updates
});

export const updateProductsCategories = (categoryId, updates) => {
    return (dispatch) => {
        ipcRenderer.send('update-products-categories', categoryId, updates);
        ipcRenderer.once('products-categories-updated', () => {
            dispatch(_updateProductsCategories(updates));
        });
    }
};

const _refreshProviders = (products) => ({
    type: 'REFRESH_PRODUCTS',
    products
});

export const refreshProducts = () => {
    return (dispatch) => {
        const products = ipcRenderer.sendSync('get-products');
        dispatch(_refreshProviders(products));
    };
};
