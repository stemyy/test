import React from "react";
import {Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar, ListItemText} from "@material-ui/core";
import {Person as PersonIcon, Add as AddIcon} from "@material-ui/icons";

export default () => {
    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
            <List>
                {emails.map(email => (
                    <ListItem button onClick={() => handleListItemClick(email)} key={email}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={email} />
                    </ListItem>
                ))}

                <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
                    <ListItemAvatar>
                        <Avatar>
                            <AddIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="add account" />
                </ListItem>
            </List>
        </Dialog>
    );
}
