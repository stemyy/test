import React, {useState, useEffect} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@material-ui/core";

const MakerDialog = (props) => {
    const {type, isOpen, maker, toggleDialog} = props;
    const {addMaker, updateMaker, removeMaker} = props.actions;
    const [newMaker, setNewMaker] = useState({});
    const [isValid, setIsValid] = useState(false);
    let Content;

    useEffect(() => {
        if (maker) {
            setNewMaker(maker);
        } else {
            setNewMaker({name: ''})
        }
    }, [maker]);

    useEffect(() => {
        if (type === "update") {
            setIsValid(JSON.stringify(maker) !== JSON.stringify(newMaker));
        } else if (type === "add") {
            setIsValid(newMaker.name !== '');
        }
    }, [newMaker]);

    const handleChanges = (property, value) => {
        setNewMaker({...newMaker, ...{ [property] : value}});
    };

    const handleDelete = () => {
        if (!maker) return null;
        removeMaker(maker.id);
        toggleDialog(false);
    };

    const handleAdd = () => {
        addMaker(newMaker);
        setNewMaker({name: ''});
        toggleDialog(false);
    };

    const handleUpdate = () => {
        updateMaker(newMaker.id, newMaker);
        toggleDialog(false);
    };

    if (!type) return null;

    if (type === "delete") {
        Content = <React.Fragment>
            <DialogTitle id="alert-dialog-title">{"Supprimer "+maker.name+" ?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Vous êtes sur le point de supprimer le fabriquant {maker.name}, êtes vous sûr de vouloir continuer ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => toggleDialog(false)} color="primary">
                    Annuler
                </Button>
                <Button onClick={handleDelete} color="primary" autoFocus>
                    Confirmer
                </Button>
            </DialogActions>
        </React.Fragment>
    } else {
        Content = <React.Fragment>
            <DialogTitle id="form-dialog-title">
                {type === 'add' ? 'Ajouter un fabriquant' : 'Modifier '+maker.name}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {type === 'add' ? 'Veuillez entrer le nom du nouveau fabriquant' : 'Veuillez entrer le nouveau nom du fabriquant'}
                </DialogContentText>
                <TextField
                    onChange={(event) => handleChanges("name", event.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Nom du fabriquant"
                    type="text"
                    value={newMaker.name}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => toggleDialog(false)} color="primary">
                    Annuler
                </Button>
                {type === 'add'
                    ? <Button disabled={!isValid} onClick={handleAdd} color="primary">Ajouter</Button>
                    : <Button disabled={!isValid} onClick={handleUpdate} color="primary">Enregistrer</Button>
                }
            </DialogActions>
        </React.Fragment>
    }
    return (
        <Dialog open={isOpen} onClose={() => toggleDialog(false)} aria-labelledby="form-dialog-title">
            {Content}
        </Dialog>
    )
};

export default MakerDialog;
