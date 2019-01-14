let expres = require("express");
let cors = require("cors");
let path = require("path");
let bodyParser = require("body-parser");
const expressJwt = require("express-jwt");

// Routes
let registerRoute = require("./routes/register");
let loginRoute = require("./routes/auth");
let getItems = require("./routes/items");

let app = expres();

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expres.static("public"));

app.use(
  expressJwt({ secret: "i31GOVwz5K0W" }).unless({
    path: ["/auth"]
  })
);
// Apply routes
app.use(loginRoute, registerRoute, getItems);

// cors
app.use(cors());
// apply route tp app

// Handler for 404 - Not found
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});
// Handler for Error 500
app.use((err, req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/500.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));
