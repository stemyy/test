import React from "react";
import Banner from "./Banner";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import {Button, List, ListItem, ListItemText} from "@material-ui/core";
import {connect, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import * as StockAlertActions from "../actions/stockAlert";

const StockAlert = (props) => {
    const alerts = useSelector(state => state.stockAlerts);
    if (alerts.length < 1) return null;
    const {handleDialog, removeStockAlerts} = props;
    return (
        <Banner
            icon={<AnnouncementIcon />}
            title={"Les produits suivants ont besoin d'être commandés"}
            button={<React.Fragment><Button onClick={() => removeStockAlerts()} color="secondary">Retirer les alertes</Button><Button onClick={() => handleDialog('add')}>Passer une commande</Button></React.Fragment>}
        >
            <List dense>
                {alerts.map(
                    alert => (
                        <ListItem key={alert.id}>
                            <ListItemText
                                primary={`${alert.product.name} (${alert.provider.name})`}
                            />
                        </ListItem>
                    ))}
            </List>
        </Banner>
    )
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators(StockAlertActions, dispatch);
}

export default connect(null,
    mapDispatchToProps
)(StockAlert);
