import React, {useState, useEffect} from 'react';
import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField
} from "@material-ui/core";

const AddCategory = (props) => {
    const {addCategory, toggleDialogCategory} = props;
    const [isValid, setIsValid] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        setIsValid(Boolean(categoryName))
    }, [categoryName]);

    const handleSubmit = () => {
        const category = {
            'name' : categoryName
        };
        addCategory(category);
        toggleDialogCategory(false);
    };
    return (
        <React.Fragment>
            <DialogContent>
                <DialogContentText>
                    Veuillez entrer le nom de la nouvelle catégorie
                </DialogContentText>
                <TextField
                    onChange={(event) => setCategoryName(event.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Nom de la catégorie"
                    type="text"
                    value={categoryName}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => toggleDialogCategory(false)} color="primary">
                    Annuler
                </Button>
                <Button disabled={!isValid} onClick={handleSubmit} color="primary">
                    Enregistrer
                </Button>
            </DialogActions>
        </React.Fragment>
    )
};

export default AddCategory;
