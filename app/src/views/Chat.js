import React, { Component, createRef } from "react";
import SendIcon from "@material-ui/icons/Send";
import { connect } from "react-redux";
import "../assets/chat.scss";
import Moment from "moment";
import { withChatContext } from "../ChatContext";
import CircularProgress from '@material-ui/core/CircularProgress';

import AutoLinkText from "react-autolink-text2";
import { Grid, IconButton } from "@material-ui/core";

import locale from "../locales/main";
import ChatBubble from "../components/ChatBubble";


const Utils = require("../utils");

class Chat extends Component {
  constructor(props) {
    super(props);
    Moment.locale("tr");

    this.messageList = createRef();
    this.messageInput = createRef();

    this.state = {
      message: "",
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log(nextProps.isOnline);
    // console.log(this.props.isOnline);
    return true;
  }

  scrollToBottom = () => {
    this.messageList.current.scrollIntoView({
      block: "end",
    });
  };

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

  sendMessage() {
    this.props.chatClient.sendMessage({
      message: this.messageInput.current.value,
    });

    this.setState((prevState) => {
      return {
        message: "",
      };
    });
  }

  onPressButton = (e) => {
    if (Utils.isEmptyOrSpaces(this.messageInput.current.value)) return;
    this.sendMessage();
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <React.Fragment>

        <Grid container className="chat-container">
          {!this.props.isOnline && <div className="offline-loading">
            <CircularProgress style={{ color: "orange" }} size='3rem' />
            <span>{locale.please_wait}</span>

          </div>}
          <Grid container className="messages" ref={this.messageList}>
            {this.props.messageHistory.map((element, idx) => {

              return (
                <ChatBubble element={element} idx={idx} key={idx} lastAlign={this.props.messageHistory[idx - 1]?.align} />
              );
            })}
          </Grid>
        </Grid>
        <div className="messages-bottom">
          <div className="message-textbox">
            <input
              type="text"
              name="message"
              ref={this.messageInput}
              placeholder={locale.enter_message}
              onChange={this.onInputChange}
              onKeyDown={this.onKeyDown}
              value={this.state.message}
              disabled={!this.props.isOnline ? true : false}
            />
          </div>
          <IconButton
            aria-label=""
            className="message-send-button"
            onClick={this.onPressButton}
            disabled={
              this.state.message.length === 0
                ? true
                : !this.props.isOnline
                  ? true
                  : false
            }
          >
            <SendIcon />
          </IconButton>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOnline: state.isOnline,
    messageHistory: state.messageHistory,
  };
};

export default withChatContext(connect(mapStateToProps)(Chat));
