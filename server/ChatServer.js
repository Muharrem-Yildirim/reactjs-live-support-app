const
  moment = require("moment"),
  Utils = require("./utils"),
  swig = require('swig'),
  fs = require('fs');


const userModel = require("./api/models/userModel"),
  authController = require("./api/controllers/authController");

class ChatServer {
  constructor() {
    this._io = null;
    this._messageLogging = false;
    this._joinquitLogging = false;

    this._onlineSupporters = [];
    this._ticketsCache = [];

    this._lastRoomId = 0;

    this._messageHistories = new Map();
  }

  setJoinQuitLogging(state) {
    this._joinquitLogging = state;
  }

  setMessageLogging(state) {
    this._messageLogging = state;
  }

  start(server) {
    console.log(" > Starting chat server..");
    this._io = require("socket.io")(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this._io.use(async function (socket, next) {
      if (typeof socket.handshake.query.admin === "undefined") {
        if (typeof socket.handshake.query.informationData !== "undefined") {
          socket.handshake.query.informationData = JSON.parse(
            socket.handshake.query.informationData
          );

          socket.informationData = socket.handshake.query.informationData;
        }
      }


      let token = socket.handshake?.query?.jwt;

      authController.verifyJwt(token)
        .then((decode) => {
          socket.isSupporter = true;
          socket.decode = decode;
          socket.adminUsername = decode.username;

          next();
        }).catch((err) => next(new Error("Authcention error")));
    });

    this.handleUsers();

    console.log(" > Chat server succesfully started.");
  }

  handleUsers() {
    this._io.on("connection", async (socket) => {
      socket.leave(socket.id);

      if (typeof socket.informationData !== "undefined") {
        socket.informationData.fullName = Utils.isEmptyOrSpaces(
          socket.informationData.fullName
        )
          ? "Unknown"
          : socket.informationData.fullName;
        socket.informationData.email = Utils.isEmptyOrSpaces(
          socket.informationData.email
        )
          ? "Unknown"
          : socket.informationData.email;
        socket.informationData.message = Utils.isEmptyOrSpaces(
          socket.informationData.message
        )
          ? "Unknown"
          : socket.informationData.message;
      }

      if (socket.isSupporter) {
        socket.join("supporters");
        socket.room = "supporters";
        this.handleSupporter(socket);
      } else {
        let roomName = "room_" + this._lastRoomId;

        socket.join(roomName);
        socket.room = roomName;
        this._io.sockets.adapter.rooms.get(roomName).customer = socket.informationData;

        this._io.to(socket.room).emit("chat", {
          isSupporter: true,
          sender: 9999,
          message:
            "welcome_to_live_support",
          time: moment(new Date()).format("HH:mm"),
        });

        this._lastRoomId++;

        this.syncTickets();
      }

      if (this._joinquitLogging)
        console.log(
          ` [+] ${socket.isSupporter ? "Supporter" : "User"} connected: ${socket.id
          } (${socket.room})`
        );

      socket.on("chat", async (data) => {
        if (this._messageLogging) {
          let messageSentUsers = Array.from(
            await this._io.of("/").in(socket.room).allSockets()
          ).length;

          console.log(
            " Message taken:",
            data,
            `-> Sending to [${socket.room}] ${messageSentUsers} users.`
          );

          if (!this._messageHistories.has(socket.room)) {
            this._messageHistories.set(socket.room, []);
          }

          this._messageHistories.set(socket.room, [
            ...this._messageHistories.get(socket.room),
            {
              isSupporter: socket.isSupporter ? true : false,
              message: data.message,
              time: moment(new Date()).format("HH:mm").toString(),
            }
          ]);

          console.log(this._messageHistories.get(socket.room));
        }

        this._io.to(socket.room).emit("chat", {
          isSupporter: socket.isSupporter,
          sender: socket.id,
          message: data.message,
          // time: data.time,
          time: moment(new Date()).format("HH:mm"),
        });
      });

      socket.on("disconnect", () => {
        if (this._joinquitLogging)
          console.log(
            ` [-] ${socket.isSupporter ? "Supporter" : "User"} disconnected: ${socket.id
            } (${socket.room})`
          );

        if (socket.room === "supporters") return;

        if (!socket.isSupporter) this._lastRoomId--;

        this.closeTicket(socket.room);

        this.syncTickets();
      });
    });
  }

  closeTicket(roomName, bySupporter) {
    if (bySupporter)
      this._io.to(roomName).emit("chat", {
        isSupporter: true,
        sender: -1,
        message: "thanks_for_contacting_us",
        time: moment(new Date()).format("HH:mm"),
      });

    var template = swig.compileFile('./other/chat_history.html');
    var output = template({
      customer: { ...this._io.sockets.adapter.rooms.get(roomName)?.customer },
      supporter: { ...this._io.sockets.adapter.rooms.get(roomName)?.supporter },
      messages: this._messageHistories.get(roomName)
    });

    let fileName = "./chat-histories/" + moment().format("YYYY-MM-DD__HH_mm_ss") + "_" + Utils.makeid(10) + ".html";
    fs.writeFile(fileName, output, function (err) {
      if (err) {
        return console.log(err);
      }

      console.log(fileName);
    });

    Array.from(this._io.of("/").in(roomName).sockets).forEach((socket) => {
      if (socket[1].room == roomName) {
        socket[1].leave(roomName);

        if (socket[1].isSupporter) {
          socket[1].join("supporters");
          socket[1].room = "supporters";
        } else socket[1].disconnect();
      }
    });
  }

  handleSupporter(socket) {
    socket.on("closeTicket", (roomName) => {
      this.closeTicket(roomName, true);

      this.syncTickets();
    });


    /*
      REMOVE THIS AND TURN IT TO API
    */
    socket.on("addUser", ({ username, password }) => {
      new userModel({
        username: username,
        hash_password: Utils.hashPassword(password)
      }).save();
    });

    socket.on("claimTicket", (roomName) => {
      socket.leave(socket.room);
      socket.join(roomName);
      socket.room = roomName;

      this._io.sockets.adapter.rooms.get(roomName).isClaimed = true;
      this._io.sockets.adapter.rooms.get(roomName).supporter = { name: socket.adminUsername };

      // this._io.to(roomName).emit("chat", {
      //   isSupporter: true,
      //   sender: 9999,
      //   message: "interviews_are_recorded",
      //   time: moment(new Date()).format("HH:mm"),
      // });

      setTimeout(() => {
        // this._io.to(roomName).emit("chat", {
        //   isSupporter: true,
        //   sender: 9999,
        //   message: "how_can_i_help",
        //   time: moment(new Date()).format("HH:mm"),
        // });

        this._io.to(roomName).emit("claim");
      }, 1000);

      this.syncTickets();
    });

    socket.emit("tickets", { tickets: this._ticketsCache });
  }

  syncTickets() {
    let tickets = [];

    this._io.of("/").adapter.rooms.forEach((users, roomName) => {
      let userId = Array.from(users)[0];
      let user = this._io.of("/").sockets.get(userId);
      if (!user.isSupporter && roomName !== "supporters")
        tickets.push({
          isClaimed: this._io.sockets.adapter.rooms.get(roomName).isClaimed,
          roomName,
          user: { socket: userId },
          informationData: user.informationData,
        });
    });

    this._io.of("/").adapter.rooms.forEach((users, roomName) => {
      let userId = Array.from(users)[0];
      let user = this._io.of("/").sockets.get(userId);
      if (user.isSupporter) user.emit("tickets", { tickets: tickets });
    });

    this._ticketsCache = tickets;
  }
}

module.exports = ChatServer;
