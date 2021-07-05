import React, { Component } from "react";
import { Grid, IconButton, Button } from "@material-ui/core";
import { connect } from "react-redux";
import "../assets/admin.scss";
import InfoIcon from "@material-ui/icons/Info";
import { withChatContext } from "../ChatContext";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import notificationMp3 from "../assets/notification.mp3";

import locale from "../locales/main";

const Utils = require("../utils");

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTicketInfo: null,
    };

    this.notificationAudio = new Audio(notificationMp3);
    this.notificationAudio.volume = 0.05;
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
        // console.log(this.state[e.target.name]);
      }
    );
  };

  onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (Utils.isEmptyOrSpaces(e.target.value)) return;
      this.sendMessage();
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.tickets.length > prevProps.tickets.length)
      this.notificationAudio.play();
  }

  componentDidMount() {
    this.props.dispatch({
      type: "MESSAGE_BOX",
      payload: {
        messageBox: { title: locale.connecting, message: locale.please_wait },
      },
    });
    this.props.chatClient.startChatAdmin().then((isConnected) => {
      if (isConnected)
        this.props.dispatch({
          type: "MESSAGE_BOX",
          payload: {
            messageBox: null,
          },
        });
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.props.messageBox != null && (
          <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {this.props.messageBox.title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                className="display-linebreak"
              >
                {this.props.messageBox.message}
              </DialogContentText>
            </DialogContent>
            {this.props.messageBox.canClose && (
              <DialogActions>
                <Button
                  color="primary"
                  onClick={() => {
                    this.props.history.push("/");
                    this.props.dispatch({
                      type: "MESSAGE_BOX",
                      payload: { messageBox: null },
                    });
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            )}
          </Dialog>
        )}

        {this.state.showTicketInfo != null && (
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
                  this.props.tickets[this.state.showTicketInfo].informationData
                    .fullName
                }
                <br />
                <b>{locale.email}</b>{" "}
                {
                  this.props.tickets[this.state.showTicketInfo].informationData
                    .email
                }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                onClick={() => {
                  this.setState({ showTicketInfo: null });
                }}
              >
                {locale.close.toLocaleUpperCase()}
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <Grid container className="admin-container">
          <Grid container className="chats">
            {this.props.tickets.length === 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: 10,
                  fontFamily: "Open Sans",
                  fontWeight: "bold",
                  padding: 10,
                }}
              >
                {locale.no_support_request}
              </div>
            )}
            {this.props.tickets.map((element, key) => {
              return (
                <Grid className="chat" key={key}>
                  <div className="details">
                    <div className="title">
                      {element.informationData.fullName}
                    </div>
                    <div className="message">
                      {element.informationData.message}
                    </div>
                  </div>
                  <div style={{ flexGrow: 1 }} />
                  <IconButton
                    onClick={(e) => {
                      this.setState({ showTicketInfo: key });
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: 5 }}
                    onClick={(e) => {
                      this.props.chatClient.claimTicket(element.roomName);

                      this.props.history.push("/chat");
                    }}
                    disabled={element.isClaimed ? true : false}
                  >
                    {locale.claim.toLocaleUpperCase()}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: 5 }}
                    onClick={(e) => {
                      this.props.chatClient.closeTicket(element.roomName);
                    }}
                  >

                    {locale.close.toLocaleUpperCase()}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </React.Fragment>
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

export default withChatContext(connect(mapStateToProps)(Admin));
