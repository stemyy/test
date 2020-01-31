import React from 'react';
import clsx from 'clsx';
import {ExpandMore as ExpandMoreIcon} from '@material-ui/icons';
import {useSelector, connect} from 'react-redux';
import routes from "../constants/routes";
import {Link} from "react-router-dom";
import {bindActionCreators} from "redux";
import * as OrderActions from "../actions/order";
import * as StockActions from "../actions/stock";
import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    ExpansionPanelActions,
    Typography,
    Chip,
    Button,
    Divider,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    dateLabel: {
        display: 'inline-block',
        width: '90px'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column3: {
        alignSelf: 'center',
        flexBasis: '33.33%',
    },
    column4: {
        alignSelf: 'center',
        flexBasis: '22.22%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}));

const Row = (props) => {
    const {ordered, handleCancel, handleReceipt} = props;
    return <OrderExpansionPanel ordered={ordered} handleCancel={handleCancel} handleReceipt={handleReceipt}/>
};

const OrdersList = (props) => {
    const {orderActions, stockActions} = props;
    const classes = useStyles();
    const orders = useSelector(state => state.orders);
    // sort orders by state and date
    orders.sort(
        function(a, b) {
            // if orders have the same state then order by date
            if (a.received === b.received) {
                return a.createdAt > b.createdAt ? 1 : -1;
            }
            return a.received > b.received ? 1 : -1;
        }
    );

    const handleCancel = (order) => {
        orderActions.cancelOrder(order);
    };

    const handleReceipt = (ordered) => {
        const stockUpdate = {
            'quantity' : ordered.quantity,
            'pricePerUnit': ordered.price / parseInt(ordered.quantity)
        };
        const orderUpdate = {
            'received' : 1
        };

        stockActions.updateStock(ordered.stockId, stockUpdate, orderActions.validateOrder(ordered.id, orderUpdate));
    };

    return (
        <div className={classes.root}>
            { orders.map(ordered => {
                return (
                    <Row handleCancel={handleCancel} handleReceipt={handleReceipt} ordered={ordered} key={ordered.id}/>
                )
            })}
        </div>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        orderActions: bindActionCreators(OrderActions, dispatch),
        stockActions: bindActionCreators(StockActions, dispatch),
    }
}

const OrderExpansionPanel = (props) => {
    const classes = useStyles();
    const {ordered, handleCancel, handleReceipt} = props;

    if (ordered.received) {
        return (
            <ExpansionPanel expanded={false} disabled TransitionProps={{unmountOnExit: true}} key={ordered.receivedAt}>
                <ExpansionPanelSummary
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                >
                    <div className={classes.column3}>
                        <Typography className={classes.heading}>
                            <span className={classes.dateLabel}>Commandé</span> : {new Date(ordered.createdAt).toLocaleString()}
                        </Typography>
                        <Typography className={classes.heading}>
                            <span className={classes.dateLabel}>Reçu</span> : {new Date(ordered.receivedAt).toLocaleString()}
                        </Typography>
                    </div>
                    <div className={classes.column3}>
                        <Typography className={classes.secondaryHeading}>
                            <Chip
                                label={ordered.providerName}
                                component={Link}
                                color={"primary"}
                                to={routes.STOCK}
                                clickable
                            />
                        </Typography>
                    </div>
                    <div className={classes.column3}>
                        <Typography className={classes.secondaryHeading}>{ordered.quantity} {ordered.productName} </Typography>
                    </div>
                    <div className={classes.column3}>
                        <Typography className={classes.secondaryHeading}>{ordered.price}€</Typography>
                    </div>
                </ExpansionPanelSummary>
            </ExpansionPanel>
        )
    } else {
        return (
            <ExpansionPanel TransitionProps={{unmountOnExit: true}} key={ordered.id}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                >
                    <div className={classes.column3}>
                        <Typography className={classes.heading}>{new Date(ordered.createdAt).toLocaleString()}</Typography>
                    </div>
                    <div className={classes.column3}>
                        <Typography className={classes.secondaryHeading}>{ordered.productName}</Typography>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                    <div className={classes.column4}>
                        Prix : {ordered.price} €
                    </div>
                    <div className={classes.column4}>
                        Quantité : {ordered.quantity}
                    </div>
                    <div className={classes.column4}>
                        <Chip
                            label={ordered.providerName}
                            component={Link}
                            color={"primary"}
                            to={routes.STOCK}
                            clickable
                        />
                    </div>
                    <div className={clsx(classes.column3, classes.helper)}>
                        <Typography variant="caption">
                            Aucune note
                        </Typography>
                    </div>
                </ExpansionPanelDetails>
                <Divider/>
                <ExpansionPanelActions>
                    <Button onClick={() => handleCancel(ordered.id)} size="small">Annuler</Button>
                    <Button onClick={() => handleReceipt(ordered, ordered.quantity, ordered.stockId)} size="small" color="primary">Reçu</Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        )
    }
};

export default connect(null,
    mapDispatchToProps
)(OrdersList);

