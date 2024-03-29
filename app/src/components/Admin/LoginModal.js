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
import axios from '../../axios';
import * as utils from '../../utils';
import store from '../../redux/store';


class LoginModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }
    }

    componentDidMount() {
        let token = localStorage.getItem("TOKEN");

        if (token) {
            this.props.dispatch({
                type: "MESSAGE_BOX",
                payload: {
                    messageBox: { title: locale.connecting, message: locale.please_wait },
                },
            });

            this.props.chatClient.startChatAdmin(
                token
            ).then((isConnected) => {
                if (isConnected) {
                    this.props.dispatch({
                        type: "MESSAGE_BOX",
                        payload: {
                            messageBox: null,
                        },
                    });

                    this.props.dispatch({
                        type: "ADMIN_LOGGEDIN",
                        payload: {
                            isLoggedin: true,
                        },
                    });
                }
            });
        }
    }

    connectAsAdmin = () => {


        let apiUrl = utils.getRuntime() === "dev"
            ? "http://localhost:2000/api/auth/login"
            : "/api/auth/login";

        axios.post(apiUrl, {
            username: this.state.username,
            password: this.state.password
        }).then(res => {
            localStorage.setItem("TOKEN", res.data.token);

            window.location = window.location;

            this.props.chatClient.startChatAdmin(
                res.data.token
            ).then((isConnected) => {
                if (isConnected) {
                    this.props.dispatch({
                        type: "MESSAGE_BOX",
                        payload: {
                            messageBox: null,
                        },
                    });

                    this.props.dispatch({
                        type: "ADMIN_LOGGEDIN",
                        payload: {
                            isLoggedin: true,
                        },
                    });
                }
            });
        }).catch(err => {
            store.dispatch({
                type: "MESSAGE_BOX",
                payload: {
                    messageBox: {
                        title: locale.no_permission,
                        message: locale.formatString(locale.couldnt_connect_wmessage, err),
                        canClose: true,
                    },
                },
            });
        })
    }

    onClickLogin = () => {
        window.localStorage.setItem("username", this.state.username);
        window.localStorage.setItem("password", this.state.password);
        window.localStorage.setItem("autologin", true);

        this.connectAsAdmin();
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
                maxWidth="xs"
                fullWidth
            >

                <DialogTitle>{locale.login}</DialogTitle>
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
                    <Button onClick={this.onClickLogin} color="primary">
                        {locale.login}
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


export default withChatContext(connect(mapStateToProps)(LoginModal));