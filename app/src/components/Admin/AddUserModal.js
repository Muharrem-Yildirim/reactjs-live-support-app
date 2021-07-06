import React, { Component } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField
} from '@material-ui/core';
import locale from "../../locales/main";
import { withChatContext } from "../../ChatContext";
import { connect } from 'react-redux';


class AddUserModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }
    }

    onClickAdd = () => {
        this.props.chatClient._socket.emit("addUser", { username: this.state.username, password: this.state.password });
        this.props.toggleAddUser();
    }

    onInputChange = (e) => {
        this.setState(
            (prevState) => {
                return {
                    ...prevState,
                    [e.target.name]: e.target.value,
                };
            },
            () => {
                // console.log(e.target.name, this.state[e.target.name]);
            }
        );
    };

    render() {
        return (
            <Dialog
                open
                onClose={this.props.toggleAddUser}
                maxWidth="xs"
                fullWidth
            >

                <DialogTitle>{locale.add_user}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="username"
                        label={locale.username}
                        type="text"
                        fullWidth
                        variant="filled"
                        onChange={this.onInputChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="password"
                        label={locale.password}
                        type="password"
                        fullWidth
                        variant="filled"
                        onChange={this.onInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onClickAdd} color="primary">
                        {locale.add}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOnline: state.isOnline,
        messageHistory: state.messageHistory,
        messageBox: state.messageBox,
        tickets: state.tickets,
    };
};


export default withChatContext(connect(mapStateToProps)(AddUserModal));