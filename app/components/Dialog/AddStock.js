import React, {useState, useEffect} from 'react';
import {
    MenuItem,
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
    InputAdornment,
    Select,
    Checkbox, FormControlLabel
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        flexFlow: 'row wrap',
    },
    formControl: {
        minWidth: "250px",
        marginTop: theme.spacing(2)
    },
    stockInput: {
        height: "100%"
    }
}));

const AddStock = (props) => {
    const classes = useStyle();
    const {baseProducts, baseProviders, setIsValid, setSubmitArguments, selected} = props;
    const products = baseProducts.map(suggestion => ({
        value: suggestion.id,
        label: `${suggestion.name} - ${suggestion.reference}`,
        providers: suggestion.providers,
        stocks: suggestion.stocks
    }));
    const [productSelectValue, setProductSelectValue] = useState(selected ? selected.id : '');
    const [providerSelectValue, setProviderSelectValue] = useState(selected ? selected.providers[0].id : '');
    const selectedProduct = productSelectValue ? products.find(product => product.value === productSelectValue) : '';
    const providers = productSelectValue ?
        selectedProduct.providers.map(provider => ({
            value: provider.id,
            label: provider.name,
            quantity: provider.quantity
        }))
        :
        baseProviders.map(provider => ({
            value: provider.id,
            label: provider.name,
            quantity: provider.quantity
        }))
    ;
    const selectedProvider = providerSelectValue ? providers.find(provider => provider.value === providerSelectValue) : '';
    const [amount, setAmount] = useState('');
    const [lastPrice, setLastPrice] = useState('');
    const [price, setPrice] = useState('');
    const [skipOrder, setSkipOrder] = useState(false);

    const handleSelectedProduct = (event) => {
        const selectedId = event.target.value;
        const selected = products.find(product => product.value === selectedId);
        const mostRecentStock = selected ? selected.stocks.sort(function(a,b){
            return new Date(b['createdAt']) - new Date(a['createdAt']);
        })[0] : '';

        setAmount('');
        setLastPrice(mostRecentStock ? mostRecentStock.pricePerUnit : '');
        setProductSelectValue(selectedId);
    };

    const handleAmount = (input) => {
        const newAmount = Math.abs(input.target.value);
        if (price > 0) {
            const lastPricePerUnit = Math.abs(price)/Math.abs(amount);
            setPrice((newAmount*lastPricePerUnit).toFixed(2));
        }

        setAmount(newAmount);
    };

    let afterModification = selectedProduct ? selectedProduct.stocks.reduce( function(a, b){ // get the sum of the stock from every providers
        return a + b['quantity'];
    }, 0) : '';
    let difference = '';
    let pricePerUnit = 0;
    if (amount !== '') {
        const parsedAmount = parseInt(amount);
        afterModification += parsedAmount;
        pricePerUnit = price/parsedAmount;

        if (selectedProduct) {
            if (pricePerUnit > lastPrice) {
                difference = '('+(pricePerUnit-lastPrice).toFixed(2)+'€ de +)';
            } else if (pricePerUnit < lastPrice) {
                difference = '('+(lastPrice-pricePerUnit).toFixed(2)+'€ de -)';
            }
        }
    }

    useEffect(() => {
        const isValid = Boolean(productSelectValue && providerSelectValue && amount && price);
        if (isValid) {
            const order = {
                'skipped': skipOrder,
                'quantity': amount,
                'price': price,
                'providerName': selectedProvider.label,
                'productName': selectedProduct.label,
                'providerId': providerSelectValue,
                'productId': productSelectValue,
                'received': false,
                'stock': {
                    'quantity': 0,
                    'pricePerUnit': 0,
                    'productId': productSelectValue,
                    'providerId': providerSelectValue
                }
            };
            setSubmitArguments([order]);
        }
        setIsValid(isValid);
    }, [productSelectValue, providerSelectValue, amount, price, skipOrder]);

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
                    labelId="label-providers"
                    id="select-providers"
                    value={providerSelectValue}
                    disabled={!(selectedProduct)}
                    onChange={(event) => {setProviderSelectValue(event.target.value)}}
                >
                    {providers.map(suggestion => (
                        <MenuItem key={suggestion.value} value={suggestion.value}>{suggestion.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel>Quantité</InputLabel>
                <Input
                    value={amount}
                    inputProps={{ min: 1, max: "" }}
                    disabled={!(selectedProduct && selectedProvider)}
                    type={"number"}
                    className={classes.stockInput}
                    onChange={handleAmount}
                />
                <FormHelperText>{selectedProduct && "Après modification :" + afterModification}</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel>Prix</InputLabel>
                <Input
                    inputProps={{step : 0.01}}
                    onChange={(event) => {setPrice(event.target.value)}}
                    value={price}
                    disabled={!(amount > 0 && selectedProduct)}
                    type={"number"}
                    endAdornment={<InputAdornment position="end">€</InputAdornment>}
                />
                <FormHelperText>Soit {pricePerUnit.toFixed(2)}€/u {difference}</FormHelperText>
            </FormControl>
            <FormControlLabel
                control={
                    <Checkbox checked={skipOrder} onChange={() => setSkipOrder(!skipOrder)} value="skipOrder" />
                }
                label="Ajout direct"
            />
        </form>
    )
};

export default AddStock;
