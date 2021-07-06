import React, { Component } from "react";
import { connect } from "react-redux";
import "../assets/admin.scss";
import { withChatContext } from "../ChatContext";

import {
  Grid,
  Button

} from "@material-ui/core";
import notificationMp3 from "../assets/notification.mp3";

import Ticket from "../components/Admin/Ticket";
import InfoModal from "../components/Admin/InfoModal";

import locale from "../locales/main";

import * as Utils from "../utils";
import LoginModal from "../components/Admin/LoginModal";
import AddUserModal from "../components/Admin/AddUserModal";


/*
 ROOM NAME IS UNIQUE ROOM ID SO DON'T WORRY
*/
class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTicketInfo: null,
      addUserModal: false,
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

  onClickShowInfo = (e, idx) => {
    this.setState({ showTicketInfo: idx });
  }

  onClickClaimTicket = (e, roomName) => {
    this.props.chatClient.claimTicket(roomName);

    this.props.history.push("/chat");
  }
  onClickCloseTicket = (e, roomName) => {
    this.props.chatClient.closeTicket(roomName);
  }

  onCloseTicketInfo = (e) => {
    this.setState((prevState) => {
      return { ...prevState, showTicketInfo: null }
    });
  }

  toggleAddUser = (e) => {
    this.setState((prevState) => {
      return { ...prevState, addUserModal: !prevState.addUserModal }
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.addUserModal && <AddUserModal
          toggleAddUser={this.toggleAddUser} />}

        {!this.props.isLoggedin && <LoginModal connectAsAdmin={this.connectAsAdmin} />}

        {this.state.showTicketInfo != null && (
          <InfoModal {... this.props.tickets[this.state.showTicketInfo].informationData} onCloseTicketInfo={this.onCloseTicketInfo123} />
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

            {this.props.tickets.map((element, idx) => {
              return <Ticket element={element} key={idx} idx={idx} onClickShowInfo={this.onClickShowInfo} onClickClaimTicket={this.onClickClaimTicket} onClickCloseTicket={this.onClickCloseTicket} />
            })}
            {this.props.tickets.map((element, idx) => {
              return <Ticket element={element} key={idx} idx={idx} onClickShowInfo={this.onClickShowInfo} onClickClaimTicket={this.onClickClaimTicket} onClickCloseTicket={this.onClickCloseTicket} />
            })}

          </Grid>
          <div className="admin-bottom">
            <Button variant="contained" toggleAddUser={this.toggleAddUser}
              onClick={() => {
                this.setState(
                  {
                    ...this.state,
                    addUserModal: true,
                  }
                )
              }}>{locale.add_user}</Button>
            <Button variant="contained">{locale.list_user}</Button>
            <Button variant="contained">{locale.chat_logs}</Button>

          </div>


        </Grid>


      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedin: state.isLoggedin,
    isOnline: state.isOnline,
    messageHistory: state.messageHistory,
    messageBox: state.messageBox,
    tickets: state.tickets,
  };
};

export default withChatContext(connect(mapStateToProps)(Admin));
