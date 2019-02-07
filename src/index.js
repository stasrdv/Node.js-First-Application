const expres = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressJwt = require("express-jwt");
var onlineUsers = [];
const path = require("path");

// Routes
let registerRoute = require("./routes/register");
let loginRoute = require("./routes/auth");
let getUsers = require("./routes/users");
let home = require("./routes/home");

const app = expres();
const https = require("https").Server(app);
const io = require("socket.io")(https);

// cors
app.use(cors());

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expres.static("public"));

app.use(
  expressJwt({ secret: "i31GOVwz5K0W" }).unless({
    path: ["/auth", "/register", "/verify"]
  })
);

// Apply routes
app.use(loginRoute, registerRoute, getUsers, home);
app.use("/public", expres.static(path.join(__dirname, "public")));

// Handler for Error
app.use((err, req, res, next) => {
  if (req.path == "/entry") {
    res.redirect("/");
  } else {
    if (err) {
      res.sendStatus(err.status).json(err.code);
    }
  }
});

io.on("connection", socket => {
  const _user = socket.request._query;
  //unique array of online
  let found = onlineUsers.find(user => user["userID"] === _user["userID"]);
  if (!found) {
    onlineUsers.push(_user);
  }
  io.emit("onlineUsers", {
    type: "onlineUsers",
    onlineUsers: onlineUsers
  });

  socket.on("typing", _user => {
    io.emit("typing", {
      type: "typing",
      _user
    });
  });

  socket.on("stopped-typing", _user => {
    io.emit("stopped-typing", {
      type: "stopped-typing",
      _user
    });
  });

  socket.on("disconnect", () => {
    const _index = onlineUsers.findIndex(user => {
      user.userID == _user["userID"];
    });
    onlineUsers.splice(_index, 1);
    io.emit("onlineUsers", {
      type: "onlineUsers",
      onlineUsers: onlineUsers
    });
  });

  socket.on("add-message", message => {
    io.emit("message", {
      type: "new-message",
      text: message.text,
      userName: message.userName,
      userID: message.userID,
      currentTime: message.currentTime
    });
  });
});

const PORT = process.env.PORT || 3000;
https.listen(PORT, () => console.info(`Server has started on ${PORT}`));
