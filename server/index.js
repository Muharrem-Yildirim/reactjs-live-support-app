const ChatServer = require("./ChatServer"),
  http = require("http"),
  express = require("express"),
  path = require("path"),
  mongoose = require("mongoose"),
  cors = require("cors");

require("dotenv").config();

const PORT = process.env.WEB_PORT || 3000;

console.log(
  "\x1b[32m",
  "================================================================================",
  "\x1b[0m"
);

mongoose
  .connect("mongodb://localhost:27017/live-support-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true, //?
    useCreateIndex: true, //?
  })
  .then(() => {

    const app = new express();
    var server = http.createServer(app);

    app.use(cors());

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use("/api", require("./api/api.js"));

    app.use(express.static(path.resolve(__dirname, "../app/build")));

    app.use("/chat-histories", express.static(path.resolve(__dirname, "./chat-histories")));



    app.get("/*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../app/build/index.html"));
    });


    server.listen(PORT, () => {
      console.log(` > Web server is listening on: ${PORT} port.`);


      let chatServer = new ChatServer();

      chatServer.start(server);
      chatServer.setJoinQuitLogging(process.env.LOG_JOINQUIT);
      chatServer.setMessageLogging(process.env.LOG_MESSAGES);

      console.log(
        "\x1b[32m",
        "================================================================================",
        "\x1b[0m",
        "\n"
      );
    });
  });