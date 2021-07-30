'use strict';

import Chat from "./views/Chat";


const
  socket = require("socket.io-client");

let store;
let locale;



class ChatClient {
  init(_store, _locale) {
    store = _store;
    locale = _locale;
  }


  constructor() {
    this._socket = null;
  }

  createSocket(_query) {
    if (_query)
      this._socket = socket("http://127.0.0.1:2000/", { query: _query });
    else this._socket = socket("http://127.0.0.1:2000/");

    this._socket._connectTimer = setTimeout(() => {
      this._socket.close();
      store.dispatch({
        type: "MESSAGE_BOX",
        payload: {
          messageBox: {
            title: locale.timed_out,
            message: locale.couldnt_connect,
            canClose: true,
          },
        },
      });
    }, 5000);
  }

  disconnect() {
    if (this._socket != null) this._socket.disconnect();

    window.location = "/";
  }

  startChat(_informationData) {
    return new Promise((resolve, reject) => {
      if (this._socket) this._socket.close();

      store.dispatch({
        type: "MESSAGE_HISTORY",
        payload: { messageHistory: [] },
      });

      this.createSocket({ informationData: JSON.stringify(_informationData) });

      this._socket.on("connect", () => {
        clearTimeout(this._socket._connectTimer);
        console.log("Succesfully connected to support server.");

        store.dispatch({
          type: "MESSAGE_BOX",
          payload: {
            messageBox: null,
          },
        });

        this._socket.on("claim", () => {
          store.dispatch({
            type: "ONLINE_STATE",
            payload: { isOnline: true },
          });
        });

        this._socket.on("chat", (data) => {
          store.dispatch({
            type: "ADD_MESSAGE",
            payload: {
              message: {
                ...data,
                align: data.sender === this._socket.id ? "right" : "left",
              },
            },
          });
        });

        this._socket.on("disconnect", () => {
          console.log("Disconnected from support server.");

          this.onDisconnect();

          this._socket.removeAllListeners();
        });
        resolve(this._socket.connected);
      });
    });
  }

  sendMessage(data) {
    if (this._socket != null) this._socket.emit("chat", data);
    console.log("Message sent: " + data);
  }

  stopChat() {
    return new Promise((resolve, reject) => {
      store.dispatch({
        type: "MESSAGE_BOX",
        payload: {
          messageBox: null,
        },
      });

      this.disconnect();
      resolve();
    });
  }

  startChatAdmin(token) {
    return new Promise((resolve, reject) => {
      if (this._socket) this._socket.close();

      // this.createSocket({ admin: true, adminUsername: username, adminPassword: password });
      this.createSocket({ admin: true, jwt: token });

      store.dispatch({
        type: "IS_SUPPORTER",
        payload: {
          message: {
            isSupporter: true,
          },
        },
      });

      this._socket.on("connect_error", (m) => {
        if (m.type === "TransportError") return;
        clearTimeout(this._socket._connectTimer);

        store.dispatch({
          type: "MESSAGE_BOX",
          payload: {
            messageBox: {
              title: locale.no_permission,
              message: locale.formatString(locale.couldnt_connect_wmessage, { message: m }),
              canClose: true,
            },
          },
        });

        store.dispatch({
          type: "ADMIN_LOGGEDIN",
          payload: {
            isLoggedin: false
          },
        });

        // alert(locale.wrong_username_or_password);
        // window.location.reload();
      });

      this._socket.on("connect", (socket) => {
        clearTimeout(this._socket._connectTimer);
        console.log("Succesfully connected to support server.");

        store.dispatch({
          type: "ONLINE_STATE",
          payload: { isOnline: true },
        });

        this._socket.on("chat", (data) => {
          store.dispatch({
            type: "ADD_MESSAGE",
            payload: {
              message: {
                ...data,
                align: data.sender === this._socket.id ? "right" : "left",
              },
            },
          });
        });

        this._socket.on("tickets", (data) => {
          store.dispatch({
            type: "TICKETS",
            payload: {
              tickets: data.tickets,
            },
          });
        });

        this._socket.on("disconnect", () => {
          console.log("Disconnected from support server.");

          store.dispatch({
            type: "MESSAGE_BOX",
            payload: {
              messageBox: {
                title: locale.timed_out,
                message: locale.couldnt_connect,
                canClose: true,
              },
            },
          });

          store.dispatch({
            type: "ADMIN_LOGGEDIN",
            payload: {
              isLoggedin: false
            },
          });

          this.onDisconnect();

          this._socket.removeAllListeners();
        });

        resolve(this._socket.connected);
      });
    });
  }

  onDisconnect() {
    store.dispatch({
      type: "CLAIMED_TICKET",
      payload: {
        claimedTicket: null,
      },
    });

    store.dispatch({
      type: "ONLINE_STATE",
      payload: { isOnline: false },
    });
  }

  closeTicket(roomName) {
    if (store.getState().claimedTicket === roomName) this.onDisconnect();

    this._socket.emit("closeTicket", roomName);
  }

  claimTicket(roomName) {
    store.dispatch({
      type: "CLAIMED_TICKET",
      payload: {
        claimedTicket: roomName,
      },
    });

    store.dispatch({
      type: "MESSAGE_HISTORY",
      payload: { messageHistory: [] },
    });

    this._socket.emit("claimTicket", roomName);
  }
}

export default ChatClient;
