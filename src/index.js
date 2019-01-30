const expres = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressJwt = require("express-jwt");
var onlineUsers = [];

// Routes
let registerRoute = require("./routes/register");
let loginRoute = require("./routes/auth");
let getItems = require("./routes/items");
let getUsers = require("./routes/users");

const app = expres();
const http = require("http").Server(app);
const io = require("socket.io")(http);

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
app.use(loginRoute, registerRoute, getItems, getUsers);

// Handler for Error
app.use((err, req, res, next) => {
  if (req.path == "/entry") {
    res.redirect("/");
  } else {
    if (err) {
      res.sendStatus(err.status).json(err.code);
    }
  }

  // res.sendFile(path.join(__dirname, "../public/500.html"));
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
      user: _user
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
http.listen(PORT, () => console.info(`Server has started on ${PORT}`));
