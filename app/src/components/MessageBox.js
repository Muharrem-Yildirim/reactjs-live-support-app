import React from 'react'

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Button from "@material-ui/core/Button";

import locale from "../locales/main";

import store from "../redux/store";

export default function MessageBox({ title, message, canClose }) {
    const onClickClose = () => {
        store.dispatch({
            type: "MESSAGE_BOX",
            payload: { messageBox: null },
        });
    }

    return (
        <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="alert-dialog-description"
                    className="display-linebreak"
                >
                    {message}
                </DialogContentText>
            </DialogContent>
            {canClose && (
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={onClickClose}
                    >
                        {locale.close}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    )
}
