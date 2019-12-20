import React, {useState} from 'react';
import {Link} from "react-router-dom";
import routes from "../constants/routes";
import MenuSideList from "../components/MenuSideList";
import {Menu as MenuIcon} from '@material-ui/icons';
import {Toolbar, AppBar, Drawer, Typography, IconButton} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";

const useStyle = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    grow: {
        flexGrow: 1,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    drawer: {
        minWidth: '250px'
    }
}));

const Menu = (props) => {
    const [displayDrawer, setDisplayDrawer] = useState(false);
    const classes = useStyle();
    const {toggleDarkMode, darkMode} = props;

    const toggleDrawer = (open) => () => {
        setDisplayDrawer(open);
    };

    return (
        <div className={classes.root}>
            <AppBar position={"static"}>
                <Toolbar>
                    <div>
                    <IconButton component="span" edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton></div>
                    <Typography variant="h6" color="inherit" className={classes.grow}>
                        <Link to={routes.STOCK} style={{color:"white", textDecoration: "none"}}>
                            Stocker
                        </Link>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer open={displayDrawer} onClose={toggleDrawer(false)}>
                <div className={classes.drawer} tabIndex={0} role="button" onKeyDown={toggleDrawer(false)}>
                    <MenuSideList toggleDarkMode={toggleDarkMode} darkMode={darkMode} toggleDrawer={toggleDrawer}/>
                </div>
            </Drawer>
        </div>
    )
};

export default Menu;
