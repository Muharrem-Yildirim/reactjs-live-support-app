const ChatServer = require("./ChatServer"),
  http = require("http"),
  express = require("express"),
  path = require("path"),
  mongoose = require("mongoose"),
  glob = require('glob');

const User = require("./models/userModel"), Role = require("./models/roleModel");
require("dotenv").config();

const PORT = process.env.WEB_PORT || 3000;

console.log(
  "\x1b[32m",
  "================================================================================",
  "\x1b[0m"
);

const ROLES = {
  ADMIN: 0,
  CUSTOMER_REPRESENTATIVE: 1
};


/* TO DO: 
  ROLE MANAGEMENT SYSTEM 
*/
function initRoles() {
  Object.keys(ROLES).map((role) => {
    if (!Role.find({ name: role })) {
      const newRole = new Role({
        name: role,
      });

      newRole.save();
    }
  })
}

mongoose
  .connect("mongodb://localhost:27017/live-support-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true, //?
    useCreateIndex: true, //?
  })
  .then(() => {

    const app = new express();
    var server = http.createServer(app);

    app.use(express.static(path.resolve(__dirname, "../app/build")));

    app.use("/chat-histories", express.static(path.resolve(__dirname, "./chat-histories")));

    app.get("/api/list", async (req, res) => {
      let files = await glob(__dirname + '/chat-histories/*.html', {}, async (err, files) => {

        let newArr = [];
        Promise.all(await files.map(file => {

          file = path.basename(file);

          newArr.push(file);
        }
        )).then(() => {

          return res.json(newArr);
        });
      });

    })

    app.get("/*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../app/build/index.html"));
    });




    server.listen(PORT, () => {
      console.log(` > Web server is listening on: ${PORT} port.`);


      let chatServer = new ChatServer();

      //  const newUser = new User({
      //    username:"username",
      //    hash_password:"test",
      //  });
      // newUser.save();


      initRoles();

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