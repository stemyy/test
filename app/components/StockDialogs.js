import {SpeedDial, SpeedDialAction} from "@material-ui/lab";
import {
    PlaylistAdd as PlaylistAddIcon,
    Add as AddIcon,
    Create as CreateIcon,
    Remove as RemoveIcon
} from "@material-ui/icons";
import React, {useState} from "react";
import EditStock from "./Dialog/EditStock";
import AddProduct from "./Dialog/AddProduct";
import {Dialog} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import StockAlert from "./StockAlertBanner";

const useStyles = makeStyles(theme => ({
    speedDial: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    dialogPaper: {
        overflow: "visible"
    },
}));

const StockDialog = (props) => {
    const classes = useStyles();
    const [displayDialog, setDisplayDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [fabIsOpen, setFabIsOpen] = useState(false);

    const handleDialog = (type) => {
        if (type) setDialogType(type);
        setDisplayDialog(!displayDialog);
        setFabIsOpen(false);
    };

    const {addProduct, rows} = props;
    let dialogContent;
    if (dialogType === 'add_product') {
        dialogContent = <AddProduct handleDialog={handleDialog} rows={rows} addProduct={addProduct} />;
    } else {
        dialogContent = <EditStock type={dialogType} handleDialog={handleDialog}/>
    }
    return (
        <React.Fragment>
            <StockAlert handleDialog={handleDialog}/>
            <SpeedDial
                ariaLabel="Actions"
                className={classes.speedDial}
                icon={<CreateIcon />}
                onMouseEnter={() => setFabIsOpen(true)}
                onMouseLeave={() => setFabIsOpen(false)}
                open={fabIsOpen}
                direction={'up'}
            >
                <SpeedDialAction
                    color={"primary"}
                    key={"remove"}
                    icon={<RemoveIcon/>}
                    title={"Retrait de stock"}
                    onClick={() => handleDialog('remove')}
                />
                <SpeedDialAction
                    color={"secondary"}
                    key={"add"}
                    icon={<AddIcon/>}
                    title={"Commande de stock"}
                    onClick={() => handleDialog('add')}
                />
                <SpeedDialAction
                    FabProps={{ color: "secondary" }}
                    key={"add_product"}
                    icon={<PlaylistAddIcon/>}
                    title={"Ajout d'un produit"}
                    onClick={() => handleDialog('add_product')}
                />
            </SpeedDial>
            <Dialog
                onClose={() => handleDialog(false)}
                PaperProps={{ className: classes.dialogPaper }}
                open={displayDialog}
                aria-labelledby="form-dialog-stock-title"
            >
                {dialogContent}
            </Dialog>
        </React.Fragment>
    )
};

export default StockDialog;
