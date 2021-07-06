import React, { Component } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    withMobileDialog,
    Button,
    TextField
} from '@material-ui/core';
import locale from "../../locales/main";


class Login extends Component {
    render() {
        return (
            <Dialog
                open
                onRequestClose={this.props.toggleLogin}
                maxWidth="xs"
                fullWidth
            >

                <DialogTitle>{locale.login}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={locale.username}
                        type="text"
                        fullWidth
                        variant="filled"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={locale.password}
                        type="password"
                        fullWidth
                        variant="filled"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.toggleLogin} color="primary">
                        {locale.login}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withMobileDialog()(Login);