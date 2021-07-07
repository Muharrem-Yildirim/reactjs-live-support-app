import React, { Component, createRef } from "react";

import {
  Grid,
  CircularProgress
} from "@material-ui/core";
import ChatBubble from "../components/ChatBubble";
import ChatBottom from "../components/ChatBottom";

import locale from "../locales/main";
import * as utils from "../utils";
import { withChatContext } from "../ChatContext";
import Moment from "moment";
import { connect } from "react-redux";
import "../assets/chat.scss";

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
      if (utils.isEmptyOrSpaces(e.target.value)) return;
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
    if (utils.isEmptyOrSpaces(this.messageInput.current.value)) return;
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
        <ChatBottom
          messageInput={this.messageInput}
          onInputChange={this.onInputChange}
          onKeyDown={this.onKeyDown}
          onPressButton={this.onPressButton}
          message={this.state.message}
          isOnline={this.props.isOnline}
        />
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
