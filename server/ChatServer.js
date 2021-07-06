const Moment = require("moment"), Utils = require("./utils");

const userModel = require("./models/userModel")

class ChatServer {
  constructor() {
    this._io = null;
    this._messageLogging = false;
    this._joinquitLogging = false;

    this._onlineSupporters = [];
    this._ticketsCache = [];

    this._lastRoomId = 0;
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

        return next();
      }

      try {
        let user = await userModel.findOne(
          {
            username: socket.handshake?.query?.adminUsername
          },
        );

        if (user && user.comparePassword(socket.handshake?.query?.adminPassword)) {
          socket.isSupporter = true;
          next();
        } else next(new Error("Authentication error"));
      }
      catch (e) {
        console.log(e);
      }
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
        socket.join("room_" + this._lastRoomId);
        socket.room = "room_" + this._lastRoomId;

        this._io.to(socket.room).emit("chat", {
          isSupporter: true,
          sender: 9999,
          message:
            "welcome_to_live_support",
          time: Moment(new Date()).format("HH:mm"),
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
        }

        this._io.to(socket.room).emit("chat", {
          isSupporter: socket.isSupporter,
          sender: socket.id,
          message: data.message,
          // time: data.time,
          time: Moment(new Date()).format("HH:mm"),
        });
      });

      socket.on("disconnect", () => {
        if (this._joinquitLogging)
          console.log(
            ` [-] ${socket.isSupporter ? "Supporter" : "User"} disconnected: ${socket.id
            } (${socket.room})`
          );

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
        sender: 99999,
        message: "thanks_for_contacting_us",
        time: Moment(new Date()).format("HH:mm"),
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

    socket.on("claimTicket", (roomName) => {
      socket.leave(socket.room);
      socket.join(roomName);
      socket.room = roomName;

      this._io.sockets.adapter.rooms.get(roomName).isClaimed = true;

      // this._io.to(roomName).emit("chat", {
      //   isSupporter: true,
      //   sender: 9999,
      //   message: "interviews_are_recorded",
      //   time: Moment(new Date()).format("HH:mm"),
      // });

      setTimeout(() => {
        // this._io.to(roomName).emit("chat", {
        //   isSupporter: true,
        //   sender: 9999,
        //   message: "how_can_i_help",
        //   time: Moment(new Date()).format("HH:mm"),
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
