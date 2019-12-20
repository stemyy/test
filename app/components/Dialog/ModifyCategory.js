import React, {useState, useEffect} from 'react';
import CategoriesTransfer from './CategoriesTransfer';
import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField
} from "@material-ui/core";

const isEqual = function (a, b) {
    if (a.length !== b.length) return false;
    const ser = o => JSON.stringify(Object.keys(o).sort().map( k => [k, o[k]] ));
    a = new Set(a.map(ser));
    return b.every( o => a.has(ser(o)) );
};

const ModifyCategory = (props) => {
    const {category, updateCategory, removeCategory, updateProductsCategories, toggleDialogCategory, products} = props;
    const [isValid, setIsValid] = useState(false);
    const [categoryName, setCategoryName] = useState(category ? category.name : '');
    const defaultUnassigned = products.filter(product => product.categoryId === null).map(product => {return {id: product.id, categoryId: product.categoryId, reference: product.reference}});
    const defaultAssigned = products.filter(product => product.categoryId === category.id).map(product => {return {id: product.id, categoryId: product.categoryId, reference: product.reference}});
    const [unassigned, setUnassigned] = useState(defaultUnassigned);
    const [assigned, setAssigned] = useState(defaultAssigned);

    useEffect(() => {
        setIsValid((categoryName && (categoryName !== category.name) || !isEqual(defaultAssigned, assigned)));
    }, [categoryName, unassigned, assigned]);

    const handleSubmit = () => {
        const categoryUpdates = {
            'name' : categoryName
        };
        let productChanges = null;

        if (!isEqual(defaultAssigned, assigned)) {
            const changesAssigned = assigned.filter(product => (!defaultAssigned.find(p => (p.id === product.id && p.categoryId === product.categoryId))));
            const changesUnassigned = unassigned.filter(product => (!defaultUnassigned.find(p => (p.id === product.id && p.categoryId === product.categoryId))));
            productChanges = changesAssigned.concat(changesUnassigned);
        }

        updateCategory(category.id, categoryUpdates, (productChanges) ? updateProductsCategories(category.id, productChanges) : null);
        toggleDialogCategory(false);
    };

    const handleDelete = () => {
        toggleDialogCategory(false);
        removeCategory(category.id);
    };

    return (
        <React.Fragment>
            <DialogContent>
                <DialogContentText>
                    Veuillez entrer le nouveau nom de la catégorie, tous les produits appartenants à cette catégorie ne seront pas impactés.
                </DialogContentText>
                <TextField
                    onChange={(event) => setCategoryName(event.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Nom de la catégorie"
                    type="text"
                    value={categoryName}
                    fullWidth
                />
                <CategoriesTransfer categoryName={categoryName} categoryId={category.id} assigned={assigned} setAssigned={setAssigned} unassigned={unassigned} setUnassigned={setUnassigned}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} color="secondary">Supprimer la catégorie</Button>
                <div style={{flex: '1 0 0'}} />
                <Button onClick={() => toggleDialogCategory(false)} color="primary">
                    Annuler
                </Button>
                <Button disabled={!isValid} onClick={handleSubmit} color="primary">
                    Enregistrer
                </Button>
            </DialogActions>
        </React.Fragment>
    )
};

export default ModifyCategory;
