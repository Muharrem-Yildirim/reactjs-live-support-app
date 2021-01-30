import React, { Component, createRef } from "react";
import SendIcon from "@material-ui/icons/Send";
import { Grid, IconButton } from "@material-ui/core";
import { connect } from "react-redux";
import AutoLinkText from "react-autolink-text2";
import "../assets/chat.scss";
import Moment from "moment";
import { withChatContext } from "../ChatContext";
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
          <Grid container className="messages" ref={this.messageList}>
            {this.props.messageHistory.map((element, key) => {
              return (
                <Grid
                  item
                  className={
                    "message " + (element.align === "right" ? "right" : "left")
                  }
                  key={key}
                >
                  <div
                    className="message-image"
                    style={
                      key > 0
                        ? this.props.messageHistory[key - 1].align ===
                          element.align
                          ? { opacity: 0 }
                          : {}
                        : {}
                    }
                  >
                    {element.isSupporter ? (
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png"
                        alt="support profile"
                      />
                    ) : (
                      <img
                        src="https://www.w3schools.com/howto/img_avatar.png"
                        alt="user profile"
                      />
                    )}
                  </div>
                  <div
                    className="message-bubble fade-in"
                    style={
                      key > 0
                        ? this.props.messageHistory[key - 1].align ===
                          element.align
                          ? { borderRadius: 20 }
                          : {}
                        : {}
                    }
                  >
                    <div className="message-inside">
                      <span className="message-text">
                        <AutoLinkText
                          text={element.message}
                          disableUrlStripping={true}
                        />
                      </span>
                      <span className="message-time">{element.time}</span>
                    </div>
                  </div>
                </Grid>
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
              placeholder="Enter message.."
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
