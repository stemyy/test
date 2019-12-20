import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, List, CardHeader, ListItem, ListItemText, ListItemIcon, Checkbox, Button, Divider} from '@material-ui/core';
const useStyles = makeStyles(theme => ({
    root: {
        margin: 'auto',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 200,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}));

function not(a, b) {
    return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter(value => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

const CategoriesTransfer = (props) => {
    const classes = useStyles();
    const {categoryName, unassigned, assigned, setUnassigned, setAssigned, categoryId} = props;
    const [checked, setChecked] = useState([]);

    const unassignedChecked = intersection(checked, unassigned);
    const assignedChecked = intersection(checked, assigned);

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = items => intersection(checked, items).length;

    const handleToggleAll = items => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedAssigned = () => {
        unassignedChecked.forEach(product => product.categoryId = categoryId);
        setAssigned(assigned.concat(unassignedChecked));
        setUnassigned(not(unassigned, unassignedChecked));
        setChecked(not(checked, unassignedChecked));
    };

    const handleCheckedUnassigned = () => {
        assignedChecked.forEach(product => product.categoryId = null);
        setUnassigned(unassigned.concat(assignedChecked));
        setAssigned(not(assigned, assignedChecked));
        setChecked(not(checked, assignedChecked));
    };

    const customList = (title, products) => (
        <React.Fragment>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(products)}
                        checked={numberOfChecked(products) === products.length && products.length !== 0}
                        indeterminate={numberOfChecked(products) !== products.length && numberOfChecked(products) !== 0}
                        disabled={products.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(products)}/${products.length} sélectionnés`}
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {products.map(product => {
                    const labelId = `transfer-list-all-item-${product.id}-label`;

                    return (
                        <ListItem key={product.id} role="listitem" button onClick={handleToggle(product)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(product) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={product.reference} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </React.Fragment>
    );

    return (
        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
            <Grid item>{customList('Non assignés', unassigned)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedAssigned}
                        disabled={unassignedChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedUnassigned}
                        disabled={assignedChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList(categoryName, assigned)}</Grid>
        </Grid>
    );
};

export default CategoriesTransfer;
