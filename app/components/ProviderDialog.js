import React, {useState, useEffect} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@material-ui/core";

const ProviderDialog = (props) => {
    const {type, isOpen, provider, toggleDialog} = props;
    const {addProvider, updateProvider, removeProvider} = props.actions;
    const [newProvider, setNewProvider] = useState({});
    const [isValid, setIsValid] = useState(false);
    let Content;

    useEffect(() => {
        if (provider) {
            setNewProvider(provider);
        } else {
            setNewProvider({name: ''})
        }
    }, [provider]);

    useEffect(() => {
        if (type === "update") {
            setIsValid(JSON.stringify(provider) !== JSON.stringify(newProvider));
        } else if (type === "add") {
            setIsValid(newProvider.name !== '');
        }
    }, [newProvider]);

    const handleChanges = (property, value) => {
        setNewProvider({...newProvider, ...{ [property] : value}});
    };

    const handleDelete = () => {
        if (!provider) return null;
        removeProvider(provider.id);
        toggleDialog(false);
    };

    const handleAdd = () => {
        addProvider(newProvider);
        setNewProvider({name: ''});
        toggleDialog(false);
    };

    const handleUpdate = () => {
        updateProvider(newProvider.id, newProvider);
        toggleDialog(false);
    };

    if (!type) return null;

    if (type === "delete") {
        Content = <React.Fragment>
            <DialogTitle id="alert-dialog-title">{"Supprimer "+provider.name+" ?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Vous êtes sur le point de supprimer le fournisseur {provider.name}, êtes vous sûr de vouloir continuer ?
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
                {type === 'add' ? 'Ajouter un fournisseur' : 'Modifier '+provider.name}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {type === 'add' ? 'Veuillez entrer le nom du nouveau fournisseur' : 'Veuillez entrer le nouveau nom du fournisseur'}
                </DialogContentText>
                <TextField
                    onChange={(event) => handleChanges("name", event.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Nom du fournisseur"
                    type="text"
                    value={newProvider.name}
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

export default ProviderDialog;
