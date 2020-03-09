import React, {useState} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as StockActions from '../../actions/stock';
import AddStock from './AddStock';
import RemoveStock from './RemoveStock';
import {Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    dialogContent: {
        overflow: "visible"
    }
}));

const EditStock = (props) => {
    let dialogTitle, dialogContent;
    const classes = useStyles();
    const {handleDialog, updateStock, orderStock, type, products, providers, selectedProduct} = props;
    const [isValid, setIsValid] = useState(false);
    const [submitArguments, setSubmitArguments] = useState([]);

    if (type && type === 'add') {
        dialogContent = <AddStock setSubmitArguments={setSubmitArguments} setIsValid={setIsValid} baseProducts={products} baseProviders={providers} selected={selectedProduct}/>;
        dialogTitle = "Commande de Stock";
    } else if (type && type === 'remove') {
        dialogContent = <RemoveStock setSubmitArguments={setSubmitArguments} setIsValid={setIsValid} baseProducts={products} selected={selectedProduct}/>;
        dialogTitle = "Retrait de Stock";
    }

    const handleSubmit = () => {
        if (type === 'add') {
            orderStock(submitArguments[0]);
        } else {
            updateStock(submitArguments[0], submitArguments[1]);
        }

        handleDialog(false);
    };

    return (
        <Paper>
            <DialogTitle id="form-dialog-stock-title">{ dialogTitle }</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <DialogContentText>
                    Indiquer le produit et la quantité à modifier. Pour un ajout de stock, il faut également indiquer le fournisseur et le prix.
                </DialogContentText>
                {dialogContent}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleDialog(false)} color="primary">
                    Annuler
                </Button>
                <Button disabled={!isValid} onClick={handleSubmit} color="primary">
                    Soumettre
                </Button>
            </DialogActions>
        </Paper>
    )
};

function mapStateToProps(state) {
    return {
        products: state.products,
        providers: state.providers
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(StockActions, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditStock);
