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
import LaunchIcon from '@material-ui/icons/Launch';
import NoRowsFound from '../NoRowsFound';

import axios from "../../axios";
import * as utils from "../../utils";
import locale from "../../locales/main";
import { withChatContext } from "../../ChatContext";
import { connect } from 'react-redux';


class ListChatHistoriesModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chatHistories: []
        }
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

                <DialogTitle>{locale.chat_histories}</DialogTitle>
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
                                            <TableCell align="right">{idx + 1}</TableCell>
                                            <TableCell align="right">{fileName}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => {
                                                    window.open(utils.getRuntime() === "dev"
                                                        ? "http://localhost:2000/chat-histories/" + fileName
                                                        : "/chat-histories/" + fileName
                                                        , "_blank")
                                                }}>
                                                    <LaunchIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
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