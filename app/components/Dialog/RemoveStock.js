import React, {useEffect, useState} from 'react';
import {MenuItem, FormControl, InputLabel, Input, FormHelperText, Select} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        flexFlow: 'row wrap',
    },
    formControl: {
        margin: "auto",
        minWidth: "250px",
        marginTop: theme.spacing(2)
    },
    stockInput: {
        height: "100%"
    }
}));

const RemoveStock = (props) => {
    const classes = useStyle();
    const {baseProducts, setIsValid, setSubmitArguments} = props;
    const products = baseProducts.filter(function(product) {
        return product.stocks.reduce( function(a, b){
            return a + b['quantity'];
        }, 0) >= 1;
    }).map(suggestion => ({
        value: suggestion.id,
        label: suggestion.name,
        providers: suggestion.providers,
        stocks: suggestion.stocks
    }));

    const [stocks, setStocks] = useState([]);
    const [productSelectValue, setProductSelectValue] = useState('');
    const [stockSelectValue, setStockSelectValue] = useState('');
    const selectedProduct = products.find(product => product.value === productSelectValue);
    const selectedStock = stocks.find(stock => stock.value === stockSelectValue);
    const [amount, setAmount] = useState('');

    const handleSelectedProduct = (event) => {
        const selectedId = event.target.value;
        const selected = products.find(product => product.value === selectedId);
        const productStocks = selected ? selected.stocks.filter(function(stock) {
            return stock.quantity >= 1;
        }).sort(function(a,b){ // sort by date to display the newest first
            return new Date(b['createdAt']) - new Date(a['createdAt']);
        }).map(stock => ({
            value : stock.id,
            label: `${stock.provider ? stock.provider.name : 'Fournisseur supprimé'} (${stock.quantity})`,
            quantity: stock.quantity,
        })) : [];

        setAmount('');
        setProductSelectValue(selectedId);
        setStocks(productStocks);
    };

    const handleSelectedStock = (event) => {
        const selectedId = event.target.value;
        const selected = stocks.find(product => product.value === selectedId);

        let actualAmount = amount;
        if (selected) {
            actualAmount = (Math.abs(amount) <= selected.quantity) ? amount : -Math.abs(selected.quantity);
        } else {
            actualAmount = '';
        }
        setAmount(actualAmount);
        setStockSelectValue(selectedId);
    };

    const handleAmount = (input) => {
        const maxSelectedStock = -Math.abs(selectedStock.quantity);
        let amount = -Math.abs(input.target.value);
        amount = (amount < maxSelectedStock) ? maxSelectedStock : amount ;

        if (amount < -Math.abs(selectedStock.quantity)) {
            amount = -Math.abs(selectedStock.quantity);
        }

        setAmount(amount);
    };

    useEffect(() => {
        const isValid = Boolean(productSelectValue && stockSelectValue && amount);

        if (isValid) {
            const updates = {
                'quantity' : selectedStock.quantity + amount,
            };
            setSubmitArguments([stockSelectValue, updates]);
        }
        setIsValid(isValid);
    }, [productSelectValue, stockSelectValue, amount]);

    let afterModification = selectedProduct ? selectedProduct.stocks.reduce( function(a, b){ // get the sum of the stock from every providers
        return a + b['quantity'];
    }, 0) : '';

    if (amount !== '') afterModification += parseInt(amount);
    const min = selectedStock ? -Math.abs(selectedStock.quantity) : "";

    return (
        <form className={classes.container}>
            <FormControl className={classes.formControl}>
                <InputLabel id="label-product">Produit</InputLabel>
                <Select
                    labelId="label-product"
                    id="select-product"
                    value={productSelectValue}
                    onChange={handleSelectedProduct}
                >
                    {products.map(suggestion => (
                        <MenuItem key={suggestion.value} value={suggestion.value}>{suggestion.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel id="label-providers">Fournisseur</InputLabel>
                <Select
                    disabled={!(selectedProduct)}
                    labelId="label-providers"
                    id="select-providers"
                    value={stockSelectValue}
                    onChange={handleSelectedStock}
                >
                    {stocks.map((suggestion) => (
                        <MenuItem key={suggestion.value} value={suggestion.value}>{suggestion.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel>Quantité</InputLabel>
                <Input
                    value={amount}
                    inputProps={{ min: min, max: "-1" }}
                    disabled={!(selectedProduct && selectedStock)}
                    type={"number"}
                    className={classes.stockInput}
                    onChange={handleAmount}
                />
                {selectedProduct !== null && <FormHelperText> Après modification : {afterModification}</FormHelperText>}
            </FormControl>
        </form>
    )
};

export default RemoveStock;
