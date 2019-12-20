import React, { useState, useEffect } from 'react';
import {connect} from "react-redux";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    FormControl,
    InputLabel,
    Input,
    MenuItem,
    Chip,
    Select,
} from '@material-ui/core';
import {useTheme, makeStyles} from '@material-ui/core/styles';
import baseData from "../baseData";

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

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        justifyContent: 'space-around',
        flexFlow: 'row wrap',
    },
    formControl: {
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
}));

function getStyles(value, selected, theme) {
    return {
        fontWeight:
            selected.indexOf(value) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const baseRows = baseData['baseRows'];

const AddProduct = (props) => {
    const [isValid, setIsValid] = useState(false);
    const [inputValues, setInputValues] = useState({'categoryId' : '0', 'providers' : [], 'makers' : []});
    const {rows, providers, makers, handleDialog, categories} = props;
    const classes = useStyles();

    useEffect(() => {
        checkIfValid();
    }, [inputValues]);

    const inputChangeHandle = (event) => {
        setInputValues({...inputValues, [event.target.name]: event.target.value});
    };

    const handleDelete = (name, toRemove) => {
        setInputValues({...inputValues, [name]: inputValues[name].filter(selected => {return selected !== toRemove})});
    };

    const checkIfValid = () => {
        let isValid = true;
        for (let i = 0; i < baseRows.length; i++) {
            const inputValue = inputValues[baseRows[i].name];
            if ( typeof inputValue == 'undefined' || inputValue === null || inputValue === '' || (Array.isArray(inputValue) && baseRows[i].name !== 'makers' && inputValue.length === 0) ) {
                isValid = false;
            }
        }

        setIsValid(isValid);
    };

    const submitProduct = () => {
        if (isValid) {
            const {rows, addProduct, handleDialog} = props;
            const productData = rows.map( row => ({name: row.name, value : inputValues[row.name]}));
            const product = { productData: productData};
            for (let i = 0; i < baseRows.length; i++) {
                product[baseRows[i].name] = inputValues[baseRows[i].name];
            }

            if (product.categoryId === 0 || product.categoryId === '0') product.categoryId = null;
            addProduct(product);
            handleDialog('add_product');
        }
    };

    return (
        <Paper>
            <DialogTitle id="form-dialog-product-title">Ajouter un produit</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <form className={classes.container}>
                    {baseRows.map(
                        row => (
                            <Field key={row.name} classes={classes} value={inputValues[row.name]} onChangeInput={inputChangeHandle} row={row} selectable={row.name === 'providers' ? providers : (row.name === 'makers' ? makers : (row.name === 'categoryId' ? categories : null))} handleDelete={(row.name === 'providers' || row.name === 'makers') ? handleDelete : null} />
                        )
                    )}
                    {rows.map(
                        row => (
                            <FormControl key={row.id} className={classes.formControl}>
                                <InputLabel>{row.label}</InputLabel>
                                <Input name={row.name} onChangeInput={inputChangeHandle} />
                            </FormControl>
                        )
                    )}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleDialog('add_product')} color="primary">
                    Annuler
                </Button>
                <Button disabled={!isValid} onClick={submitProduct} color="primary">
                    Soumettre
                </Button>
            </DialogActions>
        </Paper>
    )
};

const Field = (props) => {
    const {row, onChangeInput, classes, selectable, value, handleDelete} = props;
    const theme = useTheme();
    let input;

    if (row.name === 'providers' || row.name === 'makers') {
        const suggestions = selectable.map(suggestion => ({
            value: suggestion.id,
            label: suggestion.name
        }));

        input = <React.Fragment>
            <InputLabel id={"label-select-" + row.name}>{row.label}</InputLabel>
            <Select
                labelId={"label-select-" + row.name}
                multiple
                name={row.name}
                value={value}
                onChange={onChangeInput}
                input={<Input id={"select-multiple-" + row.name} />}
                renderValue={selected => (
                    <div className={classes.chips}>
                        {selected.map(value => (
                            <Chip key={value} onDelete={() => handleDelete(row.name, value)} label={suggestions.filter(suggestion => {return suggestion.value === value})[0].label} className={classes.chip} />
                        ))}
                    </div>
                )}
                MenuProps={MenuProps}
            >
                {suggestions.map(suggestion => (
                    <MenuItem key={suggestion.value} value={suggestion.value} style={getStyles(suggestion.value, value, theme)}>
                        {suggestion.label}
                    </MenuItem>
                ))}
            </Select>
        </React.Fragment>;
    } else if (row.name === 'categoryId') {
        input = <React.Fragment>
            <InputLabel htmlFor="age-simple">Catégorie</InputLabel>
            <Select
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
        input = <React.Fragment><InputLabel>{row.label}</InputLabel><Input name={row.name} onChange={onChangeInput} /></React.Fragment>
    }

    return (
        <FormControl className={classes.formControl}>
            {input}
        </FormControl>
    )
};

function mapStateToProps(state) {
    return {
        providers: state.providers,
        makers: state.makers,
        categories: state.categories
    };
}

export default connect(
    mapStateToProps,
)(AddProduct);
