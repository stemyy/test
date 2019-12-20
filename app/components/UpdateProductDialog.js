import React, {useState, useEffect} from 'react';
import {
    Button, Chip,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, FormControl, Input, InputLabel, MenuItem, Select,
} from "@material-ui/core";
import baseData from "./baseData";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {useSelector} from "react-redux";

const baseRows = baseData.baseRows;

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        flexFlow: 'row wrap',
    },
    formControl: {
        flexDirection: "row",
        alignItems: "flex-end",
        minWidth: '200px',
        marginTop: theme.spacing()
    },
    dialogContent: {
        overflow: "visible"
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    select: {
        width: "100%"
    }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

/*!
 * Find the differences between two objects and push to a new object
 * (c) 2019 Chris Ferdinandi & Jascha Brinkmann, MIT License, https://gomakethings.com & https://twitter.com/jaschaio
 * @param  {Object} obj1 The original object
 * @param  {Object} obj2 The object to compare against it
 * @return {Object}      An object of differences between the two
 */
const diff = function (obj1, obj2) {

    // Make sure an object to compare is provided
    if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
        return obj1;
    }

    //
    // Variables
    //

    const diffs = {};
    let key;


    //
    // Methods
    //

    /**
     * Check if two arrays are equal
     * @param  {Array}   arr1 The first array
     * @param  {Array}   arr2 The second array
     * @return {Boolean}      If true, both arrays are equal
     */
    const arraysMatch = function (arr1, arr2) {

        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) return false;

        // Check if all items exist and are in the same order
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }

        // Otherwise, return true
        return true;

    };

    /**
     * Compare two items and push non-matches to object
     * @param  {*}      item1 The first item
     * @param  {*}      item2 The second item
     * @param  {String} key   The key in our object
     */
    const compare = function (item1, item2, key) {

        // Get the object type
        const type1 = Object.prototype.toString.call(item1);
        const type2 = Object.prototype.toString.call(item2);

        // If type2 is undefined it has been removed
        if (type2 === '[object Undefined]') {
            diffs[key] = null;
            return;
        }

        // If items are different types
        if (type1 !== type2) {
            diffs[key] = item2;
            return;
        }

        // If an object, compare recursively
        if (type1 === '[object Object]') {
            const objDiff = diff(item1, item2);
            if (Object.keys(objDiff).length > 1) {
                diffs[key] = objDiff;
            }
            return;
        }

        // If an array, compare
        if (type1 === '[object Array]') {
            if (!arraysMatch(item1, item2)) {
                diffs[key] = item2;
            }
            return;
        }

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (type1 === '[object Function]') {
            if (item1.toString() !== item2.toString()) {
                diffs[key] = item2;
            }
        } else {
            if (item1 !== item2 ) {
                diffs[key] = item2;
            }
        }

    };


    //
    // Compare our objects
    //

    // Loop through the first object
    for (key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            compare(obj1[key], obj2[key], key);
        }
    }

    // Loop through the second object and find missing items
    for (key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            if (!obj1[key] && obj1[key] !== obj2[key] ) {
                diffs[key] = obj2[key];
            }
        }
    }

    // Return the object of differences
    return diffs;

};

function getStyles(value, selected, theme) {
    return {
        fontWeight:
            selected.find(provider => JSON.stringify(provider) === JSON.stringify(value))
                ? theme.typography.fontWeightMedium
                : theme.typography.fontWeightRegular
    };
}

const UpdateProductDialog = (props) => {
    const {product, isOpen, setIsOpen, updateProduct, removeProduct} = props;
    const [editedProduct, setEditedProduct] = useState(product);
    const [isValid, setIsValid] = useState(false);
    const providers = useSelector(state => state.providers);
    const makers = useSelector(state => state.makers);
    const categories = useSelector(state => state.categories);
    const classes = useStyles();

    useEffect(() => {
        if (product) {
            if (product.categoryId === null) product.categoryId = 0;
            setEditedProduct({...product, ...{['providers'] : product.providers.map(({ productProviders, ...item}) => item)}});
        }
    }, [product]);

    useEffect(() => {
        if (product && editedProduct) {
            setIsValid(!(JSON.stringify(editedProduct) !== JSON.stringify({...product, ...{['providers'] : product.providers.map(({ productProviders, ...item}) => item)}})));
        }
    }, [editedProduct]);

    const handleEditProduct = (row, value) => {
        setEditedProduct({...editedProduct, ...{[row] : value}})
    };

    const handleDelete = () => {
        removeProduct(product.id);
        setIsOpen(false);
    };

    const handleSubmit = () => {
        const updates = diff(product, editedProduct);
        if (updates.categoryId === 0) updates.categoryId = null;
        updateProduct(product.id, updates);
        setIsOpen(false);
    };

    const handleRemoveSelected = (name, toRemove) => {
        setEditedProduct({...editedProduct, [name]: editedProduct[name].filter(selected => {return selected.id !== toRemove.id})});
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Modifier le produit { product.name }</DialogTitle>
            { editedProduct &&
                <DialogContent className={classes.dialogContent}>
                    <form className={classes.container}>
                        <DialogContentText>
                            Veuillez entrer les nouvelles informations du produit.
                        </DialogContentText>
                        {baseRows.map(
                            row => (
                                <Field key={row.name} classes={classes} value={editedProduct[row.dbName]} onChangeInput={(event) => handleEditProduct(row.dbName, event.target.value)} row={row} selectable={row.name === 'providers' ? providers : (row.name === 'makers' ? makers : (row.name === 'categoryId' ? categories : null))} handleRemoveSelected={(row.name === 'providers' || row.name === 'makers') ? handleRemoveSelected : null} />
                            )
                        )}
                    </form>
                </DialogContent>
            }
            <DialogActions>
                <Button onClick={handleDelete} color="secondary">Supprimer le produit</Button>
                <div style={{flex: '1 0 0'}} />
                <Button onClick={() => setIsOpen(false)} color="primary">
                    Annuler
                </Button>
                <Button disabled={isValid} onClick={handleSubmit} color="primary">
                    Enregistrer
                </Button>
            </DialogActions>
        </Dialog>
    )
};

const Field = (props) => {
    const {row, onChangeInput, classes, selectable, handleRemoveSelected} = props;
    let value = props.value;
    const theme = useTheme();
    let input;

    if (selectable) {
        if (value && value.length > 0) {
            const selectedId = value.map(selected => selected.id);
            value = selectable.filter(provider => !(selectedId.indexOf(provider.id) === -1));
        }
    }
    if (row.name === 'providers' || row.name === 'makers') {
        if (row.name === 'makers') return null;
        input = <React.Fragment>
            <InputLabel id={"label-select-" + row.name}>{row.label}</InputLabel>
            <Select
                labelId={"label-select-" + row.name}
                multiple
                name={row.name}
                value={value}
                onChange={onChangeInput}
                className={classes.select}
                input={<Input id={"select-multiple-" + row.name} />}
                renderValue={selected => {
                    return(
                        <div className={classes.chips}>
                            {selected.map(value => (
                                <Chip key={value.id} onDelete={() => handleRemoveSelected(row.name, value)} label={value.name} className={classes.chip} />
                            ))}
                        </div>
                    )
                }}
                MenuProps={MenuProps}
            >
                {selectable.map(suggestion => (
                    <MenuItem key={suggestion.id} value={suggestion} style={getStyles(suggestion, value, theme)}>
                        {suggestion.name}
                    </MenuItem>
                ))}
            </Select>
        </React.Fragment>;
    } else if (row.name === 'categoryId') {
        input = <React.Fragment>
            <InputLabel htmlFor="age-simple">Catégorie</InputLabel>
            <Select
                className={classes.select}
                onChange={onChangeInput}
                value={value}
                name={row.name}
            >
                <MenuItem key={0} value={0}>Aucune</MenuItem>
                {selectable.map(category => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
            </Select>
        </React.Fragment>
    } else {
        input = <React.Fragment><InputLabel>{row.label}</InputLabel><Input name={row.name} onChange={onChangeInput} value={value}/></React.Fragment>
    }

    return (
        <FormControl className={classes.formControl}>
            {input}
        </FormControl>
    )
};

export default UpdateProductDialog;
