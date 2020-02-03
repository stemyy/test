import React, {useState} from 'react';
import ProviderProfile from "./ProviderProfile";
import ProviderDialog from "./ProviderDialog";
import {Grid, Fab, Typography} from "@material-ui/core";
import {Add as AddIcon} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: "20px"
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    title: {
        textAlign: 'center',
        marginTop: '10px'
    }
}));

const List = (props) => {
    const {providers, toggleDialog} = props;
    if (providers.length < 1) return <Typography color="inherit">Aucun fournisseur</Typography>;
    return providers.map(provider => (
        <Grid key={provider.id} item>
            <ProviderProfile provider={provider} toggleDialog={toggleDialog}/>
        </Grid>
    ));
};

const ProvidersList = (props) => {
    const {providers, actions} = props;
    const [dialogOptions, setDialogOptions] = useState({open: false, provider: null, type: false});
    const classes = useStyles();

    const toggleDialog = (isOpen, type = false, provider = null) => {
        const newDialogOptions = {...dialogOptions, ...{open: isOpen}};
        if (type) {
            newDialogOptions.type = type;
            newDialogOptions.provider = provider;
        }
        setDialogOptions(newDialogOptions);
    };

    return (
        <React.Fragment>
            <Typography variant="h2" component="h2" className={classes.title}>Fournisseurs</Typography>
            <Grid container className={classes.root} justify="space-evenly" spacing={0}>
                <List providers={providers} toggleDialog={toggleDialog}/>
            </Grid>

            <ProviderDialog toggleDialog={toggleDialog} provider={dialogOptions.provider} isOpen={dialogOptions.open} type={dialogOptions.type} actions={actions}/>
            <Fab aria-label={"Ajouter un fournisseur"} className={classes.fab} color="primary" onClick={() => toggleDialog(true, "add")}>
                <AddIcon/>
            </Fab>
        </React.Fragment>
    );
};

export default ProvidersList;
