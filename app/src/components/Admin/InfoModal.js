import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@material-ui/core";

import locale from "../../locales/main";


export default function InfoModal(props) {
    return (
        <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{locale.ticket_owner}</DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="alert-dialog-description"
                    className="display-linebreak"
                >
                    <b>{locale.full_name}</b>{" "}
                    {
                        props
                            .fullName
                    }
                    <br />
                    <b>{locale.email}</b>{" "}
                    {
                        props
                            .email
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={() => { props.onCloseTicketInfo() }}
                >
                    {locale.close.toLocaleUpperCase()}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
