import React, { useState } from "react";
import { connect } from "react-redux";
import { useLocation, withRouter } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Button,
  Toolbar,
  AppBar,
  Typography
} from "@material-ui/core";
import { withChatContext } from "../ChatContext";
import ExitModal from "../components/ExitModal";

import locale from "../locales/main";


function TopBar(props) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleExit = () => {
    setOpen(false);
    props.chatClient.stopChat().then(() => {
      props.history.push("/");
    });
  };

  return (
    <AppBar position="relative" color="primary">
      <ExitModal open={open} setOpen={setOpen} handleExit={handleExit} />

      {location.pathname === "/chat" && (
        <Toolbar className="toolbar">
          {props.claimedTicket != null && (
            <IconButton
              onClick={() => {
                props.chatClient.closeTicket(props.claimedTicket);
                props.history.push("/admin");
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <div style={{ flexGrow: 1 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" className="toolbar-header">
              {locale.live_support}
            </Typography>

            <p className="toolbar-status">
              <span className={"circle " + (props.isOnline ? "green" : "red")}>
                ⬤
              </span>{" "}
              {props.isOnline ? locale.online : locale.offline}
            </p>
          </div>
          <div style={{ flexGrow: 1 }} />
          {props.isSupporter === false && (
            <IconButton onClick={() => setOpen(true)}>
              <CloseIcon />
            </IconButton>
          )}
        </Toolbar>
      )}

      {location.pathname === "/admin" && (
        <Toolbar className="toolbar">
          <div style={{ flexGrow: 1 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" className="toolbar-header">
              {locale.live_support}
            </Typography>

            <p className="toolbar-status">  {locale.management}</p>
          </div>
          <div style={{ flexGrow: 1 }} />
        </Toolbar>
      )}
    </AppBar>
  );
}

const mapStateToProps = (state) => {
  return {
    isOnline: state.isOnline,
    claimedTicket: state.claimedTicket,
    isSupporter: state.isSupporter,
  };
};

export default withChatContext(connect(mapStateToProps)(withRouter(TopBar)));
