import React, {useState} from 'react';
import MakerProfile from "./MakerProfile";
import MakerDialog from "./MakerDialog";
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
    const {makers, toggleDialog} = props;
    if (makers.length < 1) return <Typography color="inherit">Aucun fabriquant</Typography>;
    return makers.map(maker => (
        <Grid key={maker.id} item>
            <MakerProfile maker={maker} toggleDialog={toggleDialog}/>
        </Grid>
    ));
};

const MakersList = (props) => {
    const {makers, actions} = props;
    const [dialogOptions, setDialogOptions] = useState({open: false, maker: null, type: false});
    const classes = useStyles();

    const toggleDialog = (isOpen, type = false, maker = null) => {
        const newDialogOptions = {...dialogOptions, ...{open: isOpen}};
        if (type) {
            newDialogOptions.type = type;
            newDialogOptions.maker = maker;
        }
        setDialogOptions(newDialogOptions);
    };

    return (
        <React.Fragment>
            <Typography variant="h2" component="h2" className={classes.title}>Fabriquants</Typography>
            <Grid container className={classes.root} justify="space-evenly" spacing={0}>
                <List makers={makers} toggleDialog={toggleDialog}/>
            </Grid>

            <MakerDialog toggleDialog={toggleDialog} maker={dialogOptions.maker} isOpen={dialogOptions.open} type={dialogOptions.type} actions={actions}/>
            <Fab aria-label={"Ajouter un fabriquant"} className={classes.fab} color="primary" onClick={() => toggleDialog(true, "add")}>
                <AddIcon/>
            </Fab>
        </React.Fragment>
    );
};

export default MakersList;
