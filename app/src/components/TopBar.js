import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { useLocation, withRouter } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { IconButton, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withChatContext } from "../ChatContext";

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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure to end chat?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            No
          </Button>
          <Button onClick={handleExit} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

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
              Live Support
            </Typography>

            <p className="toolbar-status">
              <span className={"circle " + (props.isOnline ? "green" : "red")}>
                ⬤
              </span>{" "}
              {props.isOnline ? "Online" : "Offline"}
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
              Live Support
            </Typography>

            <p className="toolbar-status">Admin Panel</p>
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
