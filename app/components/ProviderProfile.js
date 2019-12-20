import React, {useState, useMemo} from 'react';
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

const ProviderProfile = (props) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openedDetails, setOpenedDetails] = useState({products : false, stock : false});
    const {provider, toggleDialog} = props;

    const formatProduct = (product) => {
        const stock = provider.stocks.filter(stock => stock.productId === product.id);

        const quantity = stock.reduce( function(a, b){
            return a + b['quantity'];
        }, 0);

        const price = parseFloat(stock.reduce( function(a, b){
            return a + b['pricePerUnit'] * b['quantity'];
        }, 0).toFixed(2)) + '€';

        return {
            id: product.id,
            description: product.description,
            quantity: quantity,
            price: price
        }
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleClickMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClickEdit = (provider) => {
        toggleDialog(true, "update", provider);
        handleCloseMenu();
    };

    const handleClickDelete = (provider) => {
        toggleDialog(true, "delete", provider);
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
                        {provider.name[0]}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings" onClick={handleClickMenu}>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={provider.name}
            />
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => handleClickEdit(provider)}>Modifier</MenuItem>
                <MenuItem onClick={() => handleClickDelete(provider)}>Supprimer</MenuItem>
            </Menu>
            <CardContent>
                <List>
                    <ListItem disabled={provider.products.length === 0} button onClick={() => toggleDetails('products')}>
                        <ListItemText primary={provider.products.length === 0 ? "Aucun Produit" : provider.products.length + " Produit" + (provider.products.length > 1 ? "s" : "")}/>
                        {provider.products.length > 0 && (openedDetails.products ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                    </ListItem>
                    <Collapse in={openedDetails.products} timeout="auto" unmountOnExit>
                        <List dense disablePadding>
                            {provider.products.map(product => {
                                product = useMemo(() => formatProduct(product), [product]);
                                return(
                                    <ListItem className={classes.nested} key={product.id}>
                                        <ListItemText primary={`${product.quantity} ${product.description} + (${product.price})`}/>
                                    </ListItem>
                                )
                            })}
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

export default ProviderProfile;
