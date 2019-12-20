import React, {useState} from "react";
import {
    Collapse,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText, Switch
} from "@material-ui/core";
import {Link} from "react-router-dom";
import routes from "../constants/routes";
import {
    AccountCircle as AccountCircleIcon,
    Brightness4 as Brightness4Icon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Settings as SettingsIcon,
    ShoppingCart as ShoppingCartIcon,
    Storage as StorageIcon
} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const useStyle = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    }
}));

export default (props) => {
    const [displayConfigure, setDisplayConfigure] = useState(false);
    const {toggleDrawer, darkMode, toggleDarkMode} = props;
    const classes = useStyle();

    return (
        <React.Fragment>
            <List>
                <Link to={routes.STOCK} onClick={toggleDrawer(false)} style={{color:"inherit", textDecoration: "none"}}>
                    <ListItem button key={"stock"}>
                        <ListItemIcon>
                            <StorageIcon/>
                        </ListItemIcon>
                        <ListItemText primary={"Stock"} />
                    </ListItem>
                </Link>
                <ListItem button onClick={() => setDisplayConfigure(!displayConfigure)}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Configurer" />
                    {displayConfigure ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
                <Collapse in={displayConfigure} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to={routes.PROVIDER} onClick={toggleDrawer(false)} style={{color:"inherit", textDecoration: "none"}}>
                            <ListItem className={classes.nested} button key={"addProvider"}>
                                <ListItemIcon>
                                    <AccountCircleIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Fournisseurs"} />
                            </ListItem>
                        </Link>
                        <Link to={routes.MAKER} onClick={toggleDrawer(false)} style={{color:"inherit", textDecoration: "none"}}>
                            <ListItem className={classes.nested} button key={"addMaker"}>
                                <ListItemIcon>
                                    <AccountCircleIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Fabricants"} />
                            </ListItem>
                        </Link>
                    </List>
                </Collapse>
                <Link to={routes.ORDERS} onClick={toggleDrawer(false)} style={{color:"inherit", textDecoration: "none"}}>
                    <ListItem button key={"orders"}>
                        <ListItemIcon>
                            <ShoppingCartIcon/>
                        </ListItemIcon>
                        <ListItemText primary={"Commandes"} />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List>
                <ListItem>
                    <ListItemIcon>
                        <Brightness4Icon />
                    </ListItemIcon>
                    <ListItemText primary="Mode nuit">
                    </ListItemText>
                    <ListItemSecondaryAction>
                        <Switch
                            onChange={toggleDarkMode}
                            checked={darkMode}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        </React.Fragment>
    )
}
