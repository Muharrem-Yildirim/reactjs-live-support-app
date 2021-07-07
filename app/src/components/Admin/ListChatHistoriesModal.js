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

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from "../../axios";
import IconButton from '@material-ui/core/IconButton';
import * as utils from "../../utils";

import LaunchIcon from '@material-ui/icons/Launch';
import NoRowsFound from '../NoRowsFound';



class ListChatHistoriesModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            chatHistories: []
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
        this.loadHistories();
    }


    loadHistories() {
        axios.get(
            utils.getRuntime() === "dev"
                ? "http://localhost:2000/api/admin/chat-histories"
                : "/api/admin/chat-histories"
        ).then(res => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    chatHistories: res.data
                }
            })
        });
    }

    render() {
        return (
            <Dialog
                open
                onClose={this.props.toggleListChatHistories}
                maxWidth="xs"
                fullWidth
            >

                <DialogTitle>{locale.add_user}</DialogTitle>
                <DialogContent>
                    <Paper>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell align="right">{locale.file_name}</TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {this.state.chatHistories.map((fileName, idx) => (
                                        <TableRow key={fileName}>
                                            <TableCell align="right">{idx}</TableCell>
                                            <TableCell align="right">{fileName}</TableCell>
                                            <TableCell align="right"><IconButton onClick={() => {
                                                window.open("/chat-histories/" + fileName, "_blank")
                                            }}>
                                                <LaunchIcon />
                                            </IconButton></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>

                        </TableContainer>
                        {this.state.chatHistories.length === 0 &&
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


export default withChatContext(connect(mapStateToProps)(ListChatHistoriesModal));