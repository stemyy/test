import React, {useState} from 'react';
import {
    Card,
    CardHeader,
    Avatar,
    IconButton,
    CardContent,
    CardActions,
    Collapse,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
} from "@material-ui/core";
import {MoreVert as MoreVertIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    card: {
        width: 345,
        marginBottom: "20px"
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const MakerProfile = (props) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openedDetails, setOpenedDetails] = useState({products : false, stock : false});
    const {maker, toggleDialog} = props;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleClickMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClickEdit = () => {
        toggleDialog(true, "update", maker);
        handleCloseMenu();
    };

    const handleClickDelete = () => {
        toggleDialog(true, "delete", maker);
        handleCloseMenu();
    };

    const toggleDetails = (type) => {
        const update = {
            [type] : !openedDetails[type]
        };
        setOpenedDetails({...openedDetails, ...update});
    };

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {maker.name[0]}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings" onClick={handleClickMenu}>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={maker.name}
            />
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={handleClickEdit}>Modifier</MenuItem>
                <MenuItem onClick={handleClickDelete}>Supprimer</MenuItem>
            </Menu>
            <CardContent>
                <List>
                    <ListItem disabled={maker.products.length === 0} button onClick={() => toggleDetails('products')}>
                        <ListItemText primary={maker.products.length === 0 ? "Aucun Produit" : maker.products.length + " Produit" + (maker.products.length > 1 ? "s" : "")}/>
                        {maker.products.length > 0 && (openedDetails.products ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                    </ListItem>
                    <Collapse in={openedDetails.products} timeout="auto" unmountOnExit>
                        <List dense disablePadding>
                            {maker.products.map(product => (
                                <ListItem className={classes.nested} key={product.id}>
                                    <ListItemText primary={product.name}/>
                                </ListItem>
                                )
                            )}
                        </List>
                    </Collapse>
                </List>
            </CardContent>
            <CardActions disableSpacing>
                {/*<IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    disabled
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>*/}
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>

                </CardContent>
            </Collapse>
        </Card>
    )
};

export default MakerProfile;
