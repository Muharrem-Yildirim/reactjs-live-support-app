import React, { Component } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton
} from '@material-ui/core';
import NoRowsFound from '../NoRowsFound';
import CloseIcon from '@material-ui/icons/Close';

import axios from "../../axios";
import * as utils from "../../utils";
import locale from "../../locales/main";
import { withChatContext } from "../../ChatContext";
import { connect } from 'react-redux';

class ListUsersModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usersList: []
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

    componentDidMount() {
        this.loadUsers();
    }

    deleteUser = (userId) => {
        axios.delete(
            utils.getRuntime() === "dev"
                ? `http://localhost:2000/api/admin/users/${userId}`
                : `/api/admin/users/${userId}`
        ).then(res => {
            this.loadUsers();
        });
    }


    loadUsers = () => {
        axios.get(
            utils.getRuntime() === "dev"
                ? "http://localhost:2000/api/admin/users"
                : "/api/admin/users"
        ).then(res => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    usersList: res.data
                }
            })
        });
    }

    render() {
        return (
            <Dialog
                open
                onClose={this.props.toggleListUsers}
                maxWidth="xs"
                fullWidth
            >

                <DialogTitle>{locale.users_list}</DialogTitle>
                <DialogContent>
                    <Paper>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell align="right">{locale.username}</TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {this.state.usersList.map((user, idx) => (
                                        <TableRow key={user._id}>
                                            <TableCell align="right">{idx + 1}</TableCell>
                                            <TableCell align="right">{user.username}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => {
                                                    if (window.confirm(locale.are_you_sure_to_delete)) {
                                                        this.deleteUser(user._id);
                                                    }
                                                }}>
                                                    <CloseIcon style={{ color: "red" }} fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>

                        </TableContainer>
                        {this.state.usersList.length === 0 &&
                            <NoRowsFound />
                        }
                    </Paper>
                </DialogContent>
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


export default withChatContext(connect(mapStateToProps)(ListUsersModal));